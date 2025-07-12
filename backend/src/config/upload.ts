import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { Request, Response, NextFunction } from 'express';

// Define allowed upload types
const ALLOWED_TYPES = ['exhibitors', 'misc', 'exhibitions', 'logos', 'sponsors', 'fixtures', 'service-charges'];

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  // Create subdirectories for each allowed type
  ALLOWED_TYPES.forEach(type => {
    const typeDir = path.join(uploadsDir, type);
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }
    
    // Create thumbnail directory for each type
    const thumbDir = path.join(typeDir, 'thumbnails');
    if (!fs.existsSync(thumbDir)) {
      fs.mkdirSync(thumbDir, { recursive: true });
    }
  });
} catch (error) {
  if (error instanceof Error) {
    console.error('Error creating upload directories:', error.message);
  }
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
    const type = req.params.type || 'misc'; // Default to misc if no type specified
    
    // Validate upload type
    if (!ALLOWED_TYPES.includes(type)) {
      callback(new Error(`Invalid upload type. Allowed types: ${ALLOWED_TYPES.join(', ')}`), '');
      return;
    }
    
    const typeDir = path.join(uploadsDir, type);
    
    // Verify directory exists and is writable
    try {
      fs.accessSync(typeDir, fs.constants.W_OK);
      callback(null, typeDir);
    } catch (error) {
      if (error instanceof Error) {
        callback(new Error(`Upload directory not accessible: ${error.message}`), '');
      } else {
        callback(new Error('Upload directory not accessible'), '');
      }
    }
  },
  filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
    try {
      // Clean the original filename
      const cleanFileName = path.basename(file.originalname).replace(/[^a-zA-Z0-9.]/g, '-');
      // Generate unique filename: timestamp-cleaned_originalname
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const finalFilename = `${uniqueSuffix}-${cleanFileName}`;
      
      // If updating, try to remove old file
      if (req.method === 'PUT' && req.body.currentFile) {
        try {
          const oldPath = path.join(uploadsDir, req.params.type || 'misc', path.basename(req.body.currentFile));
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
          
          // Remove thumbnail if it exists
          const oldThumbPath = path.join(uploadsDir, req.params.type || 'misc', 'thumbnails', path.basename(req.body.currentFile));
          if (fs.existsSync(oldThumbPath)) {
            fs.unlinkSync(oldThumbPath);
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error removing old file:', error.message);
          }
          // Continue with new file upload even if old file deletion fails
        }
      }
      
      callback(null, finalFilename);
    } catch (error) {
      if (error instanceof Error) {
        callback(new Error(`Error processing filename: ${error.message}`), '');
      } else {
        callback(new Error('Error processing filename'), '');
      }
    }
  }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  console.log('[Upload Filter] File details:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });

  // Check file extension first - including HEIC
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.heic', '.HEIC'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (!validExtensions.includes(ext)) {
    console.log('[Upload Filter] Invalid file extension:', ext);
    callback(null, false);
    return;
  }

  // Check filename length
  if (file.originalname.length > 200) {
    console.log('[Upload Filter] Filename too long:', file.originalname.length);
    callback(null, false);
    return;
  }

  // Special handling for HEIC files (they can have various MIME types)
  if (ext === '.heic') {
    const validHeicMimes = [
      'image/heic',
      'image/heif', 
      'image/heic-sequence',
      'image/heif-sequence',
      'application/octet-stream', // Some browsers send this for HEIC
      'application/unknown', // Fallback
      '' // Some systems don't detect MIME type for HEIC
    ];
    
    if (file.mimetype && !validHeicMimes.includes(file.mimetype) && !file.mimetype.startsWith('image/')) {
      console.log('[Upload Filter] Invalid HEIC MIME type:', file.mimetype);
      callback(null, false);
      return;
    }
    
    console.log('[Upload Filter] HEIC file accepted:', file.originalname);
    callback(null, true);
    return;
  }

  // Check standard image MIME types for other formats
  if (!file.mimetype.startsWith('image/')) {
    console.log('[Upload Filter] Invalid MIME type:', file.mimetype);
    callback(null, false);
    return;
  }

  console.log('[Upload Filter] File accepted:', file.originalname);
  callback(null, true);
};

// Create multer instance for single file uploads
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only allow 1 file per request
  }
});

// Create multer instance for multiple file uploads
const uploadMultiple = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Allow up to 10 files per request
  }
});

// Image optimization settings
const optimizationSettings = {
  logos: {
    width: 200,
    height: 200,
    quality: 80
  },
  sponsors: {
    width: 150,
    height: 150,
    quality: 80
  },
  default: {
    width: 1200,
    height: 1200,
    quality: 80
  }
};

// Image optimization middleware
const optimizeImage = async (req: Request, res: Response, next: NextFunction) => {
  // Skip if no file was uploaded
  if (!req.file && (!req.files || req.files.length === 0)) {
    return next();
  }

  try {
    const type = req.params.type || 'misc';
    const settings = optimizationSettings[type as keyof typeof optimizationSettings] || optimizationSettings.default;
    
    // If single file upload
    if (req.file) {
      await processImage(req.file, type, settings);
      
      // Add thumbnail path to response
      const relativePath = req.file.path.split('uploads')[1].replace(/\\/g, '/');
      const fileName = path.basename(relativePath);
      const thumbPath = path.join('thumbnails', fileName).replace(/\\/g, '/');
      (req.file as any).thumbnail = relativePath.replace(fileName, thumbPath);
    }
    
    // If multiple files upload
    if (req.files && Array.isArray(req.files)) {
      await Promise.all(req.files.map(async (file) => {
        await processImage(file, type, settings);
        
        // Add thumbnail path to response
        const relativePath = file.path.split('uploads')[1].replace(/\\/g, '/');
        const fileName = path.basename(relativePath);
        const thumbPath = path.join('thumbnails', fileName).replace(/\\/g, '/');
        (file as any).thumbnail = relativePath.replace(fileName, thumbPath);
      }));
    }
    
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Image optimization failed:', error.message);
    }
    next(); // Continue even if optimization fails
  }
};

// Process an individual image with sharp
async function processImage(
  file: Express.Multer.File, 
  type: string, 
  settings: { width: number, height: number, quality: number }
) {
  // Skip SVG files (they're vectors and shouldn't be resized)
  if (file.mimetype === 'image/svg+xml') {
    return;
  }
  
  // HEIC files are now handled on the client side and converted to JPEG before upload
  // So we should never receive HEIC files on the server anymore
  if (file.mimetype === 'image/heic' || file.originalname.toLowerCase().endsWith('.heic')) {
    console.log('[Image Processing] Warning: HEIC file received on server. Client-side conversion may have failed:', file.originalname);
    // Skip processing HEIC files on server since they should be converted client-side
    return;
  }
  
  const { width, height, quality } = settings;
  const filePath = file.path;
  const fileName = path.basename(filePath);
  const dirPath = path.dirname(filePath);
  const thumbPath = path.join(dirPath, 'thumbnails', fileName);
  
  try {
    // Prepare the sharp instance with resize options
    const sharpInstance = sharp(filePath).resize(width, height, { 
      fit: 'inside',
      withoutEnlargement: true 
    });
    
    // Use appropriate format based on the original mimetype to preserve transparency
    if (file.mimetype === 'image/png') {
      // For PNG, preserve transparency
      await sharpInstance
        .png({ quality })
        .toFile(filePath + '.optimized');
    } else {
      // For other formats (like JPEG), use JPEG optimization
      await sharpInstance
        .jpeg({ quality, mozjpeg: true })
        .toFile(filePath + '.optimized');
    }
    
    // Replace original with optimized version
    fs.unlinkSync(filePath);
    fs.renameSync(filePath + '.optimized', filePath);
    
    // Create thumbnail with the same format preservation
    const thumbSharp = sharp(filePath).resize(Math.floor(width / 2), Math.floor(height / 2), { 
      fit: 'inside',
      withoutEnlargement: true 
    });
    
    if (file.mimetype === 'image/png') {
      await thumbSharp
        .png({ quality })
        .toFile(thumbPath);
    } else {
      await thumbSharp
        .jpeg({ quality: 70, mozjpeg: true })
        .toFile(thumbPath);
    }
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

// Utility function to delete files from uploads directory
const deleteFile = (filePath: string): boolean => {
  try {
    if (!filePath) return false;
    
    // Extract the file type and name
    const pathParts = filePath.split('/');
    if (pathParts.length < 2) return false;
    
    const type = pathParts[0]; // 'logos', 'sponsors', etc.
    const fileName = pathParts[pathParts.length - 1];
    
    // Build the full path to the file
    const fullPath = path.join(uploadsDir, type, fileName);
    const thumbPath = path.join(uploadsDir, type, 'thumbnails', fileName);
    
    // Check if the files exist
    let deleted = false;
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      deleted = true;
      console.log(`Deleted file: ${fullPath}`);
    }
    
    if (fs.existsSync(thumbPath)) {
      fs.unlinkSync(thumbPath);
      console.log(`Deleted thumbnail: ${thumbPath}`);
    }
    
    return deleted;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

export { upload, uploadMultiple, optimizeImage, deleteFile }; 