/**
 * Letter PDF Service
 * 
 * Handles PDF generation for exhibition letters using the existing PDF infrastructure.
 * Transforms letter data into HTML and then renders as PDF.
 */

import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import Settings from '../models/settings.model';
import { IExhibitionLetter } from '../models/exhibitionLetter.model';
import Exhibition from '../models/exhibition.model';
import Booking from '../models/booking.model';
import Exhibitor from '../models/exhibitor.model';
import Stall from '../models/stall.model';

// Register Handlebars helpers for letter templates
const registerLetterHandlebarsHelpers = () => {
  // Format date helper
  handlebars.registerHelper('formatDate', (date: string | Date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  });

  // Equality helper
  handlebars.registerHelper('eq', (a: any, b: any) => {
    return a === b;
  });

  // Conditional helper
  handlebars.registerHelper('if', function(this: any, conditional: any, options: any) {
    if (conditional) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
};

/**
 * Prepares letter data for template rendering
 */
export const prepareLetterData = async (
  exhibition: any,
  booking: any,
  exhibitor: any,
  letterType: 'standPossession' | 'transport',
  letterContent: string,
  stallNumbers: string[]
) => {
  // Get global settings to access logo
  const globalSettings = await Settings.findOne();
  const globalLogo = globalSettings?.logo || null;

  // Define base URL with proper fallback
  const isProduction = process.env.NODE_ENV === 'production';
  const currentDir = process.cwd();
  const baseUrl = isProduction 
    ? (process.env.BASE_URL || 'http://localhost:5000')
    : `file://${join(currentDir, '..')}`;

  // Resolve logo paths
  let exhibitionLogoPath = null;
  let globalLogoPath = null;
  
  if (exhibition.headerLogo) {
    exhibitionLogoPath = exhibition.headerLogo;
  }
  
  if (globalLogo) {
    globalLogoPath = globalLogo;
  }

  return {
    baseUrl: baseUrl,
    globalLogo: globalLogoPath,
    currentDir: currentDir,
    useGlobalLogo: true, // Always use global logo for letters
    letterType: letterType,
    currentDate: new Date(),
    
    // Exhibition information
    exhibition: {
      name: exhibition.name || 'Exhibition',
      venue: exhibition.venue || 'N/A',
      startDate: exhibition.startDate || '',
      endDate: exhibition.endDate || '',
      companyName: exhibition.companyName || 'Company Name',
      companyAddress: exhibition.companyAddress || 'N/A',
      companyEmail: exhibition.companyEmail || 'N/A',
      companyContactNo: exhibition.companyContactNo || 'N/A',
      companyWebsite: exhibition.companyWebsite || 'N/A',
      headerLogo: exhibitionLogoPath,
      companyGST: exhibition.companyGST || 'N/A'
    },
    
    // Recipient/Exhibitor information
    companyName: booking.companyName || exhibitor.companyName || 'N/A',
    representativeName: booking.customerName || exhibitor.contactPerson || 'N/A',
    mobile: booking.customerPhone || exhibitor.phone || 'N/A',
    email: booking.customerEmail || exhibitor.email || 'N/A',
    stallNumbers: stallNumbers.join(', '),
    
    // Letter content (with variables already replaced)
    content: letterContent
  };
};

/**
 * Generates a PDF from letter data using puppeteer
 */
export const generateLetterPDF = async (
  exhibition: any,
  booking: any,
  exhibitor: any,
  letterType: 'standPossession' | 'transport',
  letterContent: string,
  stallNumbers: string[]
): Promise<Buffer> => {
  try {
    // Get all the data ready
    const data = await prepareLetterData(exhibition, booking, exhibitor, letterType, letterContent, stallNumbers);
    
    // Register Handlebars helpers
    registerLetterHandlebarsHelpers();
    
    // Load and process template
    const currentDir = data.currentDir;
    const templatePath = join(currentDir, 'letter-template.html');
    const styleSheetPath = join(currentDir, 'letter-styles.css');
    
    if (!existsSync(templatePath)) {
      throw new Error(`Letter template file not found at: ${templatePath}`);
    }
    
    if (!existsSync(styleSheetPath)) {
      throw new Error(`Letter stylesheet file not found at: ${styleSheetPath}`);
    }
    
    let templateHtml = readFileSync(templatePath, 'utf8');
    const styleSheet = readFileSync(styleSheetPath, 'utf8');
    
    // Add stylesheet inline
    templateHtml = templateHtml.replace('</head>', `<style>${styleSheet}</style></head>`);
    
    // Compile the template
    const template = handlebars.compile(templateHtml);
    
    // Generate HTML from template
    const html = template(data);
    
    // Configure puppeteer options
    const puppeteerOptions: any = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    };
    
    // Use custom Chrome executable path if specified in environment
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    if (executablePath) {
      puppeteerOptions.executablePath = executablePath;
    }
    
    // Launch browser
    let browser;
    try {
      browser = await puppeteer.launch(puppeteerOptions);
      const page = await browser.newPage();
      
      // Set content and wait for it to load
      await page.setContent(html, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
             // Generate PDF with A4 format
       const pdfBuffer = Buffer.from(await page.pdf({
         format: 'A4',
         margin: {
           top: '20mm',
           right: '20mm',
           bottom: '20mm',
           left: '20mm'
         },
         printBackground: true,
         preferCSSPageSize: true
       }));
      
      await browser.close();
      
      console.log(`[INFO] Letter PDF generated successfully. Size: ${pdfBuffer.length} bytes`);
      return pdfBuffer;
      
    } catch (error) {
      if (browser) {
        await browser.close();
      }
      throw error;
    }
    
  } catch (error) {
    console.error('[ERROR] Letter PDF generation failed:', error);
    throw new Error(`Failed to generate letter PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate PDF for a specific letter record
 */
export const generateLetterPDFFromRecord = async (letter: IExhibitionLetter): Promise<Buffer> => {
  try {
    // Get the related data
    const exhibition = await Exhibition.findById(letter.exhibitionId);
    const booking = await Booking.findById(letter.bookingId)
      .populate('stallIds')
      .populate('exhibitionId');
    const exhibitor = await Exhibitor.findById(letter.exhibitorId);

    if (!exhibition || !booking || !exhibitor) {
      throw new Error('Missing required data for letter PDF generation');
    }

    // Generate PDF
    return await generateLetterPDF(
      exhibition,
      booking,
      exhibitor,
      letter.letterType,
      letter.content,
      letter.stallNumbers
    );
  } catch (error) {
    console.error('[ERROR] Failed to generate PDF from letter record:', error);
    throw error;
  }
};

/**
 * Create a safe filename for the letter PDF
 */
export const createLetterFilename = (
  letterType: 'standPossession' | 'transport',
  companyName: string,
  exhibitionName: string
): string => {
  const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9\-_]/g, '_');
  
  const typeLabel = letterType === 'standPossession' ? 'Stand_Possession' : 'Transport';
  const safeCompanyName = sanitize(companyName).substring(0, 20);
  const safeExhibitionName = sanitize(exhibitionName).substring(0, 20);
  
  return `${typeLabel}_Letter_${safeCompanyName}_${safeExhibitionName}.pdf`;
}; 