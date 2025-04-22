import { Request, Response } from 'express';
import Invoice from '../models/invoice.model';
import Booking from '../models/booking.model';
import nodemailer from 'nodemailer';
import { join } from 'path';
import { writeFileSync, unlinkSync, readFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import axios from 'axios';
import crypto from 'crypto';
import puppeteer from 'puppeteer';
import handlebars from 'handlebars';

// Cache directory for PDFs
const PDF_CACHE_DIR = join(process.cwd(), 'pdf-cache');
// Set cache retention period - default 30 days
const PDF_CACHE_MAX_AGE = parseInt(process.env.PDF_CACHE_MAX_AGE || '2592000000', 10); // 30 days in ms
// Set maximum cache size - default 500MB
const PDF_CACHE_MAX_SIZE = parseInt(process.env.PDF_CACHE_MAX_SIZE || '524288000', 10); // 500MB in bytes

// Clean up old cache files
const cleanupPdfCache = () => {
  try {
    console.log('[INFO] Running PDF cache cleanup');
    if (!existsSync(PDF_CACHE_DIR)) {
      return;
    }
    
    const now = Date.now();
    const files = readdirSync(PDF_CACHE_DIR);
    let totalSize = 0;
    const fileDetails = [];
    
    // Collect file info
    for (const file of files) {
      try {
        const filePath = join(PDF_CACHE_DIR, file);
        const stats = statSync(filePath);
        totalSize += stats.size;
        
        // Only process PDF files and their metadata
        if (file.endsWith('.pdf') || file.endsWith('.json')) {
          fileDetails.push({
            path: filePath,
            name: file,
            size: stats.size,
            lastAccessed: stats.atimeMs,
            lastModified: stats.mtimeMs
          });
        }
      } catch (err) {
        console.error(`[ERROR] Failed to process cache file: ${file}`, err);
      }
    }
    
    console.log(`[INFO] Current PDF cache size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Remove files by age
    for (const file of fileDetails) {
      if (now - file.lastModified > PDF_CACHE_MAX_AGE) {
        try {
          unlinkSync(file.path);
          console.log(`[INFO] Removed expired cache file: ${file.name}`);
        } catch (err) {
          console.error(`[ERROR] Failed to remove expired cache file: ${file.name}`, err);
        }
      }
    }
    
    // Recalculate size and check if we need to clean up more
    let currentSize = 0;
    const remainingFiles = fileDetails
      .filter(file => existsSync(file.path))
      .map(file => {
        try {
          const stats = statSync(file.path);
          return {
            ...file,
            size: stats.size,
            lastAccessed: stats.atimeMs
          };
        } catch (err) {
          return file;
        }
      })
      .sort((a, b) => a.lastAccessed - b.lastAccessed); // Sort by last accessed (oldest first)
    
    for (const file of remainingFiles) {
      currentSize += file.size;
    }
    
    // If still over limit, remove oldest accessed files until under limit
    if (currentSize > PDF_CACHE_MAX_SIZE) {
      console.log(`[INFO] Cache still over size limit (${(currentSize / 1024 / 1024).toFixed(2)} MB), removing oldest files`);
      
      for (const file of remainingFiles) {
        if (currentSize <= PDF_CACHE_MAX_SIZE) break;
        
        try {
          if (existsSync(file.path)) {
            unlinkSync(file.path);
            currentSize -= file.size;
            console.log(`[INFO] Removed oldest cache file: ${file.name}`);
          }
        } catch (err) {
          console.error(`[ERROR] Failed to remove cache file: ${file.name}`, err);
        }
      }
    }
    
    console.log(`[INFO] PDF cache cleanup completed. New size: ${(currentSize / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    console.error('[ERROR] Failed to clean up PDF cache:', error);
  }
};

// Ensure cache directory exists
try {
  if (!existsSync(PDF_CACHE_DIR)) {
    mkdirSync(PDF_CACHE_DIR, { recursive: true });
  }
  
  // Run cleanup on startup
  cleanupPdfCache();
  
  // Schedule cleanup to run every 24 hours
  setInterval(cleanupPdfCache, 24 * 60 * 60 * 1000);
} catch (error) {
  console.error('[ERROR] Error creating PDF cache directory:', error);
}

// WhatsApp configuration
const whatsappApiUrl = process.env.WHATSAPP_API_URL;
const whatsappApiToken = process.env.WHATSAPP_API_TOKEN;

// Email transporter configuration - exported for reuse in other controllers
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper function to generate cache key from invoice data
const generateCacheKey = (invoice: any): string => {
  try {
    // Extract required entities
    const bookingId = invoice.bookingId;
    const exhibition = bookingId?.exhibitionId;
    
    // Create data fingerprint with updatedAt timestamps from all relevant entities
    const dataToHash = {
      id: invoice._id?.toString(),
      bookingId: bookingId?._id?.toString(),
      amount: invoice.amount,
      status: invoice.status,
      updatedAt: invoice.updatedAt?.toString(),
      // Include these timestamps to detect changes in related data
      exhibitionId: exhibition?._id?.toString(),
      exhibitionUpdatedAt: exhibition?.updatedAt?.toString(),
      bookingUpdatedAt: bookingId?.updatedAt?.toString()
    };
    
    const hash = crypto.createHash('md5').update(JSON.stringify(dataToHash)).digest('hex');
    console.log(`[DEBUG] Generated cache key ${hash} for invoice ${invoice._id}`);
    return hash;
  } catch (error) {
    console.error('[ERROR] Failed to generate cache key:', error);
    // Fallback to a simpler key in case of error
    return crypto.createHash('md5').update(invoice._id.toString() + Date.now()).digest('hex');
  }
};

// Helper function to get cached PDF if available and still valid
const getCachedPDF = (cacheKey: string, invoice: any): Buffer | null => {
  const cachePath = join(PDF_CACHE_DIR, `${cacheKey}.pdf`);
  const metaPath = join(PDF_CACHE_DIR, `${cacheKey}.json`);
  
  if (existsSync(cachePath)) {
    try {
      // Check if metadata exists and entities haven't changed
      let isValid = true;
      
      if (existsSync(metaPath)) {
        try {
          const metadata = JSON.parse(readFileSync(metaPath, 'utf8'));
          const bookingId = invoice.bookingId;
          const exhibition = bookingId?.exhibitionId;
          
          // Verify all updatedAt timestamps match
          if (
            metadata.invoiceUpdatedAt !== invoice.updatedAt?.toString() ||
            metadata.bookingUpdatedAt !== bookingId?.updatedAt?.toString() ||
            metadata.exhibitionUpdatedAt !== exhibition?.updatedAt?.toString()
          ) {
            console.log(`[DEBUG] Cache invalid: data has changed for invoice ${invoice._id}`);
            isValid = false;
          }
        } catch (metaError) {
          console.error(`[ERROR] Error reading cache metadata for ${cacheKey}`, metaError);
          isValid = false;
        }
      } else {
        // No metadata, can't verify validity
        console.log(`[DEBUG] Cache metadata missing for ${cacheKey}`);
        isValid = false;
      }
      
      if (isValid) {
        console.log(`[DEBUG] Using valid cached PDF: ${cacheKey}`);
        return readFileSync(cachePath);
      } else {
        // Clean up invalid cache
        try {
          unlinkSync(cachePath);
          if (existsSync(metaPath)) {
            unlinkSync(metaPath);
          }
          console.log(`[DEBUG] Removed invalid cache: ${cacheKey}`);
        } catch (cleanupError) {
          console.error(`[ERROR] Failed to remove invalid cache: ${cacheKey}`, cleanupError);
        }
        return null;
      }
    } catch (error) {
      console.error(`[ERROR] Error reading cached PDF: ${cacheKey}`, error);
    }
  }
  return null;
};

// Helper function to cache generated PDF
const cachePDF = (cacheKey: string, pdfBuffer: Buffer, invoice: any): void => {
  const cachePath = join(PDF_CACHE_DIR, `${cacheKey}.pdf`);
  const metaPath = join(PDF_CACHE_DIR, `${cacheKey}.json`);
  
  try {
    // Save the PDF
    writeFileSync(cachePath, pdfBuffer);
    
    // Save metadata to validate cache later
    const bookingId = invoice.bookingId;
    const exhibition = bookingId?.exhibitionId;
    
    const metadata = {
      createdAt: new Date().toISOString(),
      invoiceId: invoice._id?.toString(),
      invoiceUpdatedAt: invoice.updatedAt?.toString(),
      bookingId: bookingId?._id?.toString(),
      bookingUpdatedAt: bookingId?.updatedAt?.toString(),
      exhibitionId: exhibition?._id?.toString(),
      exhibitionUpdatedAt: exhibition?.updatedAt?.toString()
    };
    
    writeFileSync(metaPath, JSON.stringify(metadata, null, 2));
    console.log(`[DEBUG] Cached PDF and metadata: ${cacheKey}`);
  } catch (error) {
    console.error(`[ERROR] Error caching PDF: ${cacheKey}`, error);
  }
};

// Optimized PDF generation with caching and auto-refresh
export const getPDF = async (invoice: any, forceRegenerate = false): Promise<Buffer> => {
  try {
    // Try to get from cache first if not forcing regeneration
    if (!forceRegenerate) {
      const cacheKey = generateCacheKey(invoice);
      const cachedPDF = getCachedPDF(cacheKey, invoice);
      if (cachedPDF) {
        return cachedPDF;
      }
    }
    
    // Generate new PDF
    console.log(`[DEBUG] Generating new PDF for invoice ${invoice._id}`);
    const pdfBuffer = await generatePDF(invoice);
    
    // Cache the newly generated PDF
    const cacheKey = generateCacheKey(invoice);
    cachePDF(cacheKey, pdfBuffer, invoice);
    
    return pdfBuffer;
  } catch (error) {
    console.error('[ERROR] Failed to get or generate PDF:', error);
    throw error;
  }
};

// Format currency number
const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-IN');
};

// Format date for display
const formatDate = (date: string | Date): string => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

// Format time for display
const formatTime = (date: string | Date): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Helper to calculate area
const calculateArea = (width: number, height: number): number => {
  return width * height;
};

// Generate PDF from invoice data using HTML template
export const generatePDF = async (invoice: any): Promise<Buffer> => {
  try {
    console.log('[DEBUG] Starting PDF generation');
    const { bookingId } = invoice;

    if (!bookingId) {
      console.error('[ERROR] Invalid invoice data: bookingId is missing');
      throw new Error('Invalid invoice data: Missing bookingId');
    }

    const exhibition = bookingId.exhibitionId;
    
    if (!exhibition) {
      console.error('[ERROR] Invalid invoice data: exhibitionId is missing in bookingId');
      throw new Error('Invalid invoice data: Missing exhibitionId');
    }
    
    // Get absolute paths for templates and verify they exist
    const currentDir = process.cwd();
    console.log(`[DEBUG] Current working directory: ${currentDir}`);
    
    const templatePath = join(currentDir, 'invoice-template.html');
    const styleSheetPath = join(currentDir, 'invoice-styles.css');
    
    console.log(`[DEBUG] Template path: ${templatePath}`);
    console.log(`[DEBUG] Stylesheet path: ${styleSheetPath}`);
    
    if (!existsSync(templatePath)) {
      console.error(`[ERROR] Template file not found at: ${templatePath}`);
      throw new Error(`Invoice template file not found at: ${templatePath}`);
    }
    
    if (!existsSync(styleSheetPath)) {
      console.error(`[ERROR] Stylesheet file not found at: ${styleSheetPath}`);
      throw new Error(`Invoice stylesheet file not found at: ${styleSheetPath}`);
    }
    
    console.log('[DEBUG] Reading template files');
    
    let templateHtml = readFileSync(templatePath, 'utf8');
    const styleSheet = readFileSync(styleSheetPath, 'utf8');
    
    // Add stylesheet inline
    templateHtml = templateHtml.replace('</head>', `<style>${styleSheet}</style></head>`);
    
    // Register helpers for the template
    console.log('[DEBUG] Registering handlebars helpers');
    handlebars.registerHelper('formatCurrency', (value: number) => {
      if (typeof value !== 'number') {
        return '0';
      }
      return value.toLocaleString('en-IN');
    });
    
    handlebars.registerHelper('formatDate', (dateString: string | Date) => {
      if (!dateString) return '';
      try {
        const date = dateString instanceof Date ? dateString : new Date(dateString);
        if (isNaN(date.getTime())) {
          console.error(`[ERROR] Invalid date value for formatDate: ${dateString}`);
          return '';
        }
        return date.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        });
      } catch (e) {
        console.error(`[ERROR] Date formatting error:`, e);
        return '';
      }
    });
    
    handlebars.registerHelper('formatExhibitionName', (name: string, startDateString: string, endDateString: string) => {
      if (!startDateString || !endDateString) return name || 'Exhibition';
      
      try {
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);
        
        // Group dates by month
        const datesByMonth: { [key: string]: string[] } = {};
        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
          const monthYear = currentDate.toLocaleString('default', { month: 'short', year: 'numeric' });
          if (!datesByMonth[monthYear]) {
            datesByMonth[monthYear] = [];
          }
          datesByMonth[monthYear].push(currentDate.getDate().toString().padStart(2, '0'));
          
          const nextDate = new Date(currentDate);
          nextDate.setDate(nextDate.getDate() + 1);
          currentDate = nextDate;
        }
        
        // Format each month group
        const formattedDateGroups = Object.entries(datesByMonth).map(([monthYear, dates]) => {
          return `${dates.join(', ')} ${monthYear}`;
        });
        
        return `${name || 'Exhibition'} (${formattedDateGroups.join(' & ')})`;
      } catch (e) {
        console.error(`[ERROR] Exhibition name formatting error:`, e);
        return `${name || 'Exhibition'} (${startDateString} - ${endDateString})`;
      }
    });
    
    handlebars.registerHelper('formatTime', (dateString: string | Date) => {
      if (!dateString) return '';
      try {
        const date = dateString instanceof Date ? dateString : new Date(dateString);
        if (isNaN(date.getTime())) {
          console.error(`[ERROR] Invalid date value for formatTime: ${dateString}`);
          return '';
        }
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
      } catch (e) {
        console.error(`[ERROR] Time formatting error:`, e);
        return '';
      }
    });
    
    handlebars.registerHelper('calculateArea', (width: number, height: number) => {
      if (typeof width !== 'number' || typeof height !== 'number') {
        return '0';
      }
      return (width * height).toFixed(2);
    });
    
    // Compile the template
    console.log('[DEBUG] Compiling template');
    const template = handlebars.compile(templateHtml);
    
    console.log('[DEBUG] Validating booking data structure');
    
    // Validation for required booking data
    if (!bookingId.stallIds || !Array.isArray(bookingId.stallIds)) {
      console.error('[ERROR] Missing or invalid stallIds:', bookingId.stallIds);
      throw new Error('Invalid invoice data: stallIds is missing or not an array');
    }
    
    if (!bookingId.calculations) {
      console.error('[ERROR] Missing calculations object');
      throw new Error('Invalid invoice data: calculations is missing');
    }
    
    // Recalculate totals based on current stall dimensions
    const stalls = bookingId.stallIds.map((stall: any, index: number) => {
      try {
        const width = stall.dimensions?.width || 0;
        const height = stall.dimensions?.height || 0;
        const area = calculateArea(width, height);
        const rate = stall.ratePerSqm || 0;
        const amount = area * rate;
        
        return {
          index: index + 1,
          stallNo: stall.number || `Stall ${index + 1}`,
          stallType: stall.stallTypeId?.name || 'Standard',
          dimensions: `${width}x${height}m`,
          area: Number(area.toFixed(0)),
          rate: rate,
          amount: amount
        };
      } catch (e) {
        console.error(`[ERROR] Error processing stall at index ${index}:`, e);
        return {
          index: index + 1,
          stallNo: `Error (${index + 1})`,
          stallType: 'Error',
          dimensions: 'Error',
          area: 0,
          rate: 0,
          amount: 0
        };
      }
    });

    // Calculate new totals based on current stall dimensions
    const recalculatedTotalBaseAmount = stalls.reduce((sum: number, stall: { amount: number }) => sum + stall.amount, 0);
    
    // Check if a discount exists in the booking calculations
    const hasDiscount = bookingId.calculations.stalls?.[0]?.discount !== null && 
                        bookingId.calculations.stalls?.[0]?.discount !== undefined;
    
    // Get discount percentage from the first stall's discount - only if a discount exists
    const discountPercentage = hasDiscount ? bookingId.calculations.stalls?.[0]?.discount?.value || 0 : 0;
    
    console.log('[DEBUG] Discount info - hasDiscount:', hasDiscount, 'discountPercentage:', discountPercentage);
    
    // Recalculate discount and after-discount amount
    const recalculatedDiscountAmount = hasDiscount ? 
      Math.round((recalculatedTotalBaseAmount * discountPercentage / 100) * 100) / 100 : 0;
    const recalculatedAmountAfterDiscount = recalculatedTotalBaseAmount - recalculatedDiscountAmount;
    
    // Get GST info
    const gstTax = bookingId.calculations.taxes?.find((tax: any) => tax.name.includes('GST'));
    const gstPercentage = gstTax?.rate || 18;
    
    // Recalculate GST and total
    const recalculatedGstAmount = Math.round((recalculatedAmountAfterDiscount * gstPercentage / 100) * 100) / 100;
    const recalculatedTotalAmount = recalculatedAmountAfterDiscount + recalculatedGstAmount;
    
    // Use recalculated values
    const totalBaseAmount = recalculatedTotalBaseAmount;
    const totalDiscountAmount = recalculatedDiscountAmount;
    const amountAfterDiscount = recalculatedAmountAfterDiscount;
    const gstAmount = recalculatedGstAmount;
    const totalAmount = recalculatedTotalAmount;
    
    // Format dates
    const createdAt = new Date(bookingId.createdAt || Date.now());
    
    // Add debug logs for date information
    console.log('[DEBUG] Invoice date information:', {
      bookingCreatedAt: bookingId.createdAt,
      parsedCreatedAt: createdAt.toString(),
      isValidDate: !isNaN(createdAt.getTime()),
      formattedDateGB: createdAt.toLocaleDateString('en-GB')
    });
    
    // Prepare data for template with safe defaults
    console.log('[DEBUG] Preparing template context data');
    const data = {
      bookingId: {
        companyName: bookingId.companyName || 'N/A',
        customerName: bookingId.customerName || 'N/A',
        customerPhone: bookingId.customerPhone || 'N/A',
        customerEmail: bookingId.customerEmail || 'N/A',
        customerGSTIN: bookingId.customerGSTIN || 'N/A',
        customerAddress: bookingId.customerAddress || 'N/A'
      },
      invoice: {
        invoiceNumber: invoice.invoiceNumber || 'Draft',
        date: createdAt, // Pass the Date object directly instead of a formatted string
        time: createdAt // Pass the Date object directly, let the helper format it
      },
      exhibition: {
        name: exhibition.name || 'Exhibition',
        venue: exhibition.venue || 'N/A',
        startDate: exhibition.startDate || '',
        endDate: exhibition.endDate || '',
        companyName: exhibition.companyName || 'Company Name',
        companyAddress: exhibition.companyAddress || 'N/A',
        companyEmail: exhibition.companyEmail || 'N/A',
        companyWebsite: exhibition.companyWebsite || 'N/A',
        bankName: exhibition.bankName || 'N/A',
        bankAccount: exhibition.bankAccount || 'N/A',
        bankAccountName: exhibition.bankAccountName || exhibition.companyName || 'N/A',
        bankBranch: exhibition.bankBranch || 'N/A',
        bankIFSC: exhibition.bankIFSC || 'N/A',
        companyCIN: exhibition.companyCIN || 'N/A',
        companyPAN: exhibition.companyPAN || 'N/A',
        companySAC: exhibition.companySAC || 'N/A',
        companyGST: exhibition.companyGST || 'N/A'
      },
      stalls: stalls,
      calculations: {
        totalBaseAmount: totalBaseAmount,
        discountPercentage: discountPercentage > 0 ? discountPercentage : 0,
        discountAmount: totalDiscountAmount,
        amountAfterDiscount: amountAfterDiscount,
        gstPercentage: gstPercentage,
        gstAmount: gstAmount,
        totalAmount: totalAmount
      },
      piInstructions: exhibition.piInstructions || 'THIS INVOICE IS PROFORMA INVOICE DO NOT CLAIM ANY GOVERNMENT CREDITS ON THIS PROFORMA INVOICE FINAL INVOICE WOULD BE RAISED AFTER 100% PAYMENT.',
      terms: exhibition.termsAndConditions || `All cheques / Drafts should be payable to "${exhibition.companyName || 'Company'}" This bill is payable as per agreed terms.`
    };
    
    // Log data structure for debugging
    console.log('[DEBUG] Template data structure:', JSON.stringify({
      // Log key parts but not the whole data to avoid overwhelming logs
      invoice: data.invoice,
      calculations: data.calculations
    }));
    
    // Generate HTML from template
    console.log('[DEBUG] Rendering template with data');
    const html = template(data);
    
    // Generate PDF with puppeteer
    console.log('[DEBUG] Launching puppeteer for PDF generation');
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ]
      });
      
      console.log('[DEBUG] Creating new page in puppeteer');
      const page = await browser.newPage();
      
      // Set viewport size to match A4
      await page.setViewport({
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
        deviceScaleFactor: 2,
      });
      
      // Basic HTML with direct CSS to avoid cross-origin issues
      const wrappedHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { margin: 0; padding: 0; background-color: white !important; color: black !important; }
            * { visibility: visible !important; opacity: 1 !important; }
            .proforma-invoice { visibility: visible !important; opacity: 1 !important; }
          </style>
        </head>
        <body>
          ${html}
        </body>
        </html>
      `;
      
      console.log('[DEBUG] Setting HTML content in page');
      await page.setContent(wrappedHtml, { 
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      
      // Wait a moment to ensure rendering is complete
      await new Promise(r => setTimeout(r, 1000));
      
      try {
        // Take screenshot for debugging
        const screenshotPath = join(process.cwd(), 'debug-screenshot.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`[DEBUG] Screenshot saved to: ${screenshotPath}`);
      } catch (err) {
        console.error('[ERROR] Failed to save screenshot:', err);
      }
      
      console.log('[DEBUG] Generating PDF');
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '5mm',
          right: '5mm',
          bottom: '5mm',
          left: '5mm'
        },
        preferCSSPageSize: true,
        timeout: 60000,
        pageRanges: '1' // Only print the first page
      });
      
      console.log('[DEBUG] PDF generation successful, buffer size:', pdfBuffer.length);
      return Buffer.from(pdfBuffer);
    } catch (err) {
      console.error('[ERROR] Puppeteer error:', err);
      throw err;
    } finally {
      if (browser) {
        console.log('[DEBUG] Closing puppeteer browser');
        await browser.close();
      }
    }
  } catch (err) {
    console.error('[ERROR] PDF generation failed:', err);
    if (err instanceof Error) {
      console.error('[ERROR] Stack trace:', err.stack);
    }
    throw err;
  }
};

export const getInvoices = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.user?._id) {
      return res.status(401).json({ 
        message: 'Authentication required',
        error: 'No user found in request'
      });
    }

    // Parse pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await Invoice.countDocuments({ userId: req.user._id });

    // Get invoices with proper population and pagination
    const invoices = await Invoice.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'bookingId',
        select: '_id customerName customerEmail customerPhone companyName calculations amount status createdAt updatedAt',
        populate: [
          { 
            path: 'exhibitionId',
            select: 'name venue startDate endDate description invoicePrefix companyName companyAddress companyContactNo companyEmail companyGST companyPAN companySAC companyCIN companyWebsite termsAndConditions piInstructions bankName bankAccount bankIFSC bankBranch bankAccountName'
          },
          { 
            path: 'stallIds',
            select: 'number dimensions ratePerSqm stallTypeId',
            populate: {
              path: 'stallTypeId',
              select: 'name'
            }
          }
        ]
      })
      .lean();

    // Log the number of invoices found
    console.log(`Found ${invoices.length} invoices for user ${req.user._id} (page ${page}, limit ${limit})`);

    // Filter out any null bookings and transform the data
    const validInvoices = invoices
      .filter(invoice => {
        if (!invoice.bookingId) {
          console.warn(`Invoice ${invoice._id} has no booking reference`);
          return false;
        }
        return true;
      })
      .map(invoice => ({
        ...invoice,
        bookingId: {
          ...invoice.bookingId,
          _id: invoice.bookingId._id.toString()
        }
      }));

    return res.status(200).json({
      success: true,
      data: validInvoices,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return res.status(500).json({
      message: 'Error fetching invoices',
      error: (error as Error).message
    });
  }
};

export const getInvoice = async (req: Request, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate({
        path: 'bookingId',
        populate: [
          { path: 'exhibitionId', select: 'name venue startDate endDate description invoicePrefix companyName companyAddress companyContactNo companyEmail companyGST companyPAN companySAC companyCIN companyWebsite termsAndConditions piInstructions bankName bankAccount bankIFSC bankBranch bankAccountName' },
          { path: 'stallIds', select: 'number dimensions ratePerSqm stallTypeId', populate: { path: 'stallTypeId', select: 'name' } },
        ],
      });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoice', error });
  }
};

export const downloadInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`[DEBUG] Invoice download requested for ID: ${id}`);
    
    // Get invoice and populate booking
    console.log(`[DEBUG] Looking up invoice ${id} in database`);
    const invoice = await Invoice.findById(id)
      .populate({
        path: 'bookingId',
        populate: [
          { path: 'exhibitionId' },
          { path: 'stallIds', populate: { path: 'stallTypeId' } },
        ],
      });

    if (!invoice) {
      console.log(`[ERROR] Invoice ${id} not found in database`);
      return res.status(404).json({ message: 'Invoice not found' });
    }

    console.log(`[DEBUG] Invoice ${id} found, checking permissions`);
    // Check if user has permission to view this invoice
    if (req.user?._id && req.user._id.toString() !== invoice.userId?.toString()) {
      console.log(`[ERROR] User ${req.user._id} doesn't have permission to view invoice ${id} (owned by ${invoice.userId})`);
      return res.status(403).json({ message: 'You do not have permission to view this invoice' });
    }

    // Check for force regeneration parameter - always regenerate to ensure latest data
    const forceRegenerate = true; // Always force regeneration to ensure latest data
    console.log(`[DEBUG] Generating PDF for invoice ${id}, force regenerate: ${forceRegenerate}`);
    
    try {
      // Log invoice structure for debugging
      console.log(`[DEBUG] Invoice structure:`, JSON.stringify({
        id: invoice._id,
        bookingId: invoice.bookingId._id,
        invoiceNumber: invoice.invoiceNumber,
        // Include other key invoice properties but not the entire object
      }));
      
      // Get PDF (from cache if available)
      const pdfBuffer = await getPDF(invoice, forceRegenerate);

      // Set response headers and send PDF
      console.log(`[DEBUG] Successfully generated PDF, sending response`);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${id}.pdf`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (pdfError) {
      console.error(`[ERROR] PDF generation failed:`, pdfError);
      if (pdfError instanceof Error) {
        console.error('[ERROR] Stack trace:', pdfError.stack);
      }
      res.status(500).json({ 
        message: 'Error generating invoice PDF', 
        error: pdfError instanceof Error ? pdfError.message : 'Unknown error' 
      });
    }
  } catch (error) {
    console.error('[ERROR] Invoice download error:', error);
    if (error instanceof Error) {
      console.error('[ERROR] Stack trace:', error.stack);
    }
    res.status(500).json({ 
      message: 'Error retrieving invoice data', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const shareViaEmail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, message } = req.body;

    // Validate
    if (!email) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    // Get invoice
    const invoice = await Invoice.findById(id)
      .populate({
        path: 'bookingId',
        populate: [
          { path: 'exhibitionId' },
          { path: 'stallIds', populate: { path: 'stallTypeId' } },
        ],
      });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Get PDF (from cache if available)
    const pdfBuffer = await getPDF(invoice);

    // Store PDF temporarily 
    const tempFilePath = join(process.cwd(), `temp-invoice-${id}.pdf`);
    writeFileSync(tempFilePath, pdfBuffer);

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: `Invoice - ${invoice.invoiceNumber}`,
      text: message || `Please find attached the invoice ${invoice.invoiceNumber}.`,
      attachments: [
        {
          filename: `invoice-${invoice.invoiceNumber}.pdf`,
          path: tempFilePath,
        },
      ],
    });

    // Delete temp file
    unlinkSync(tempFilePath);

    res.json({ message: 'Invoice shared via email successfully' });
  } catch (error) {
    console.error('Email sharing error:', error);
    res.status(500).json({ message: 'Error sharing invoice via email', error });
  }
};

export const shareViaWhatsApp = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { phoneNumber } = req.body;

    const invoice = await Invoice.findById(id).populate({
      path: 'bookingId',
      populate: [
        { path: 'exhibitionId', select: 'name venue startDate endDate description invoicePrefix companyName companyAddress companyContactNo companyEmail companyGST companyPAN companySAC companyCIN companyWebsite termsAndConditions piInstructions bankName bankAccount bankIFSC bankBranch bankAccountName' },
        { path: 'stallIds', select: 'number dimensions ratePerSqm stallTypeId', populate: { path: 'stallTypeId', select: 'name' } },
      ],
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const pdfBuffer = await generatePDF(invoice);
    const pdfPath = join(__dirname, `../temp/invoice-${id}.pdf`);
    writeFileSync(pdfPath, pdfBuffer);

    // TODO: Implement file storage and get public URL
    const pdfUrl = 'temporary-url'; // Replace with actual file storage implementation

    if (!whatsappApiUrl || !whatsappApiToken) {
      throw new Error('WhatsApp API configuration missing');
    }

    await axios.post(whatsappApiUrl, {
      phone: phoneNumber,
      message: `Here's your invoice: ${pdfUrl}`,
    }, {
      headers: {
        'Authorization': `Bearer ${whatsappApiToken}`
      }
    });

    unlinkSync(pdfPath);
    res.json({ message: 'Invoice shared successfully via WhatsApp' });
  } catch (error) {
    console.error('WhatsApp sharing error:', error);
    res.status(500).json({ message: 'Error sharing invoice via WhatsApp', error });
  }
};

export const updateInvoiceStatus = async (req: Request, res: Response) => {
  try {
    const { status, paymentDetails } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Update invoice status and payment details
    invoice.status = status;
    if (status === 'paid' && paymentDetails) {
      invoice.paymentDetails = {
        ...paymentDetails,
        paidAt: new Date(),
      };
    }
    await invoice.save();

    // If invoice is paid, update booking payment status
    if (status === 'paid') {
      await Booking.findByIdAndUpdate(invoice.bookingId, {
        paymentStatus: 'paid',
        paymentDetails: invoice.paymentDetails,
      });
    }

    // If invoice is refunded, update booking payment status
    if (status === 'refunded') {
      await Booking.findByIdAndUpdate(invoice.bookingId, {
        paymentStatus: 'refunded',
      });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error updating invoice status', error });
  }
};

export const getInvoicesByExhibition = async (req: Request, res: Response) => {
  try {
    const invoices = await Invoice.find()
      .populate({
        path: 'bookingId',
        match: { exhibitionId: req.params.exhibitionId },
        populate: [
          { path: 'userId', select: 'username' },
          { path: 'stallId', select: 'number' },
        ],
      })
      .sort({ createdAt: -1 });

    // Filter out invoices where bookingId is null (not matching exhibitionId)
    const filteredInvoices = invoices.filter(invoice => invoice.bookingId);

    res.json(filteredInvoices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exhibition invoices', error });
  }
}; 

