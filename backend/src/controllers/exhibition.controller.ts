import { Request, Response } from 'express';
import Exhibition from '../models/exhibition.model';
import mongoose from 'mongoose';
import { sanitizeHtml } from '../utils/sanitize';
import { generateSlug } from '../utils/url';
import { deleteFile } from '../config/upload';

export const createExhibition = async (req: Request, res: Response) => {
  try {
    const exhibitionData = {
      ...req.body,
      createdBy: req.user?._id,
    };

    // Sanitize HTML content in rich text fields
    if (exhibitionData.termsAndConditions) {
      exhibitionData.termsAndConditions = sanitizeHtml(exhibitionData.termsAndConditions);
    }
    if (exhibitionData.piInstructions) {
      exhibitionData.piInstructions = sanitizeHtml(exhibitionData.piInstructions);
    }

    // Generate slug if not provided
    if (!exhibitionData.slug && exhibitionData.name) {
      exhibitionData.slug = generateSlug(exhibitionData.name);
    }

    const exhibition = await Exhibition.create(exhibitionData);
    res.status(201).json(exhibition);
  } catch (error) {
    res.status(500).json({ message: 'Error creating exhibition', error });
  }
};

export const getExhibitions = async (req: Request, res: Response) => {
  try {
    const exhibitions = await Exhibition.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username');
    res.json(exhibitions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exhibitions', error });
  }
};

export const getActiveExhibitions = async (req: Request, res: Response) => {
  try {
    const exhibitions = await Exhibition.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username');
    res.json(exhibitions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active exhibitions', error });
  }
};

export const getExhibition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let exhibition;

    // Check if id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      exhibition = await Exhibition.findById(id)
        .populate('createdBy', 'username');
    } else {
      // If not a valid ObjectId, try to find by slug
      exhibition = await Exhibition.findOne({ slug: id })
        .populate('createdBy', 'username');
    }
    
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }
    
    res.json(exhibition);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exhibition', error });
  }
};

export const updateExhibition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let updateData = req.body;

    // Check if id is valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid exhibition ID' });
    }

    // Get the current exhibition to compare changes
    const currentExhibition = await Exhibition.findById(id);
    if (!currentExhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    // Extract status and isActive
    const { status, isActive, ...restUpdateData } = updateData;

    // Sanitize HTML content in rich text fields
    if (restUpdateData.termsAndConditions) {
      restUpdateData.termsAndConditions = sanitizeHtml(restUpdateData.termsAndConditions);
    }
    if (restUpdateData.piInstructions) {
      restUpdateData.piInstructions = sanitizeHtml(restUpdateData.piInstructions);
    }

    // Handle header logo deletion
    if (restUpdateData.headerLogo === null || restUpdateData.headerLogo === '') {
      // Check if we need to delete an existing file
      if (currentExhibition.headerLogo) {
        deleteFile(currentExhibition.headerLogo);
      }
      restUpdateData.headerLogo = '';
    }
    
    // Handle sponsor logos - could be array or complex object from frontend
    if (restUpdateData.sponsorLogos) {
      let newSponsorLogos: string[] = [];
      
      if (Array.isArray(restUpdateData.sponsorLogos)) {
        // Already an array, keep as is
        newSponsorLogos = restUpdateData.sponsorLogos;
      } else if (typeof restUpdateData.sponsorLogos === 'object') {
        // Complex object structure from frontend
        try {
          // If it has a fileList property with items
          if (restUpdateData.sponsorLogos.fileList && Array.isArray(restUpdateData.sponsorLogos.fileList)) {
            // Extract paths from response.path in each fileList item
            newSponsorLogos = restUpdateData.sponsorLogos.fileList
              .filter((file: any) => file.status === 'done' && file.response?.path)
              .map((file: any) => file.response.path);
          }
        } catch (err) {
          console.error('Error processing sponsorLogos:', err);
          newSponsorLogos = [];
        }
      }
      
      // Check for removed sponsor logos and delete their files
      if (currentExhibition.sponsorLogos && Array.isArray(currentExhibition.sponsorLogos)) {
        const removedLogos = currentExhibition.sponsorLogos.filter(oldPath => 
          !newSponsorLogos.includes(oldPath)
        );
        
        // Delete each removed logo file
        for (const logoPath of removedLogos) {
          deleteFile(logoPath);
        }
      }
      
      // Update the value in the database
      restUpdateData.sponsorLogos = newSponsorLogos;
    }

    // Generate slug if name is being updated but slug isn't provided
    if (restUpdateData.name && !restUpdateData.slug) {
      // Check if this is a name change by getting the current exhibition
      const currentExhibition = await Exhibition.findById(id);
      if (currentExhibition && currentExhibition.name !== restUpdateData.name) {
        restUpdateData.slug = generateSlug(restUpdateData.name);
      }
    }

    // Prepare update data
    const finalUpdateData = {
      ...restUpdateData,
      ...(status !== undefined && { status }),
      ...(isActive !== undefined && { isActive })
    };

    const exhibition = await Exhibition.findByIdAndUpdate(
      id,
      finalUpdateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    res.json(exhibition);
  } catch (error) {
    console.error('Error updating exhibition:', error);
    console.error('Update data:', JSON.stringify(req.body, null, 2));
    res.status(500).json({ message: 'Error updating exhibition', error });
  }
};

export const deleteExhibition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if id is valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid exhibition ID' });
    }

    const exhibition = await Exhibition.findByIdAndDelete(id);
    
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    res.json({ message: 'Exhibition deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exhibition', error });
  }
};

export const updateExhibitionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if id is valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid exhibition ID' });
    }

    const exhibition = await Exhibition.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    res.json(exhibition);
  } catch (error) {
    res.status(500).json({ message: 'Error updating exhibition status', error });
  }
}; 