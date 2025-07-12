/**
 * MAIN FILE: This is the primary file for Exhibition entity definition
 * 
 * MAIN FRONTEND FILE: frontend/src/components/exhibition/common/ExhibitionForm.tsx
 * - This is the main frontend component that handles the exhibition form
 * - It uses tabs to organize different sections (General, Header, etc.)
 * - All form fields are defined and validated here
 * 
 * BACKEND CONTROLLER: backend/src/controllers/exhibition.controller.ts
 * - Handles all exhibition-related API endpoints
 * - Key operations:
 *   1. createExhibition: Creates new exhibition with user as creator
 *   2. getExhibitions: Retrieves all exhibitions with creator info
 *   3. getActiveExhibitions: Fetches only active exhibitions
 *   4. getExhibition: Gets single exhibition by ID
 *   5. updateExhibition: Updates exhibition details
 *   6. deleteExhibition: Removes an exhibition
 *   7. updateExhibitionStatus: Changes exhibition status
 * - All operations include error handling and input validation
 * 
 * When adding new fields/features to Exhibition, update the following files:
 * 1. backend/src/models/exhibition.model.ts (HERE) - Add fields to IExhibition interface and exhibitionSchema
 * 2. frontend/src/services/exhibition.ts - Add fields to Exhibition interface
 * 3. frontend/src/pages/exhibition/create/index.tsx - Add fields to ExhibitionFormData interface and handleSubmit
 * 4. frontend/src/pages/exhibition/[id]/edit.tsx - Add fields to ExhibitionFormData interface, handleSubmit, and initialValues
 * 5. frontend/src/components/exhibition/common/ExhibitionForm.tsx - Update form structure if needed
 * 
 * Data Flow:
 * Backend Model <-> Controller <-> Routes <-> Frontend Service <-> ExhibitionForm <-> Create/Edit Pages
 * 
 * Example: Adding header fields required changes in all these files:
 * - Backend: Added headerTitle, headerSubtitle, headerDescription to schema
 * - Frontend: Added corresponding interfaces and form handling
 */

import mongoose, { Document, Schema } from 'mongoose';
import { generateSlug } from '../utils/url';

export interface IExhibition extends Document {
  // Basic Information
  name: string;
  description: string;
  venue: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'published' | 'completed';
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  assignedUsers?: mongoose.Types.ObjectId[]; // Users assigned to manage this exhibition
  invoicePrefix?: string;
  slug?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  stallRates?: Array<{
    stallTypeId: mongoose.Types.ObjectId;
    rate: number;
  }>;
  // Tax and Discount Configuration
  taxConfig?: Array<{
    name: string;
    rate: number;
    isActive: boolean;
  }>;
  discountConfig?: Array<{
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    isActive: boolean;
  }>;
  publicDiscountConfig?: Array<{
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    isActive: boolean;
  }>;
  theme?: string;

  // Company Details
  companyName?: string;
  companyContactNo?: string;
  companyEmail?: string;
  companyAddress?: string;
  companyWebsite?: string;
  companyPAN?: string;
  companyGST?: string;
  companySAC?: string;
  companyCIN?: string;
  termsAndConditions?: string;
  piInstructions?: string;

  // Bank Details
  bankName?: string;
  bankBranch?: string;
  bankIFSC?: string;
  bankAccountName?: string;
  bankAccount?: string;

  // Header settings
  headerTitle?: string;
  headerSubtitle?: string;
  headerDescription?: string;
  headerLogo?: string;
  sponsorLogos?: string[];

  // Footer settings
  footerText?: string;
  footerLogo?: string;
  contactEmail?: string;
  contactPhone?: string;
  footerLinks?: Array<{
    label: string;
    url: string;
  }>;

  // Amenities settings
  amenities?: Array<{
    type: 'facility' | 'service' | 'equipment' | 'other';
    name: string;
    description: string;
    rate: number;
  }>;

  // Basic amenities are included with stall booking - calculated based on stall size
  basicAmenities?: Array<{
    type: 'facility' | 'service' | 'equipment' | 'other';
    name: string;
    description: string;
    perSqm: number; // How many square meters per 1 unit (e.g., 1 table per 9 sqm)
    quantity: number; // The default quantity to provide per calculation
  }>;

  specialRequirements?: string;

  // Letter Settings
  letterSettings?: {
    // Stand Possession Letter
    standPossessionLetter?: {
      isEnabled: boolean;
      template: string;
      subject: string;
      automaticSending?: {
        isEnabled: boolean;
        daysBeforeExhibition: number; // e.g., 20 or 30 days
      };
    };
    
    // Transport Letter
    transportLetter?: {
      isEnabled: boolean;
      template: string;
      subject: string;
      automaticSending?: {
        isEnabled: boolean;
        daysBeforeExhibition: number; // e.g., 20 or 30 days
      };
    };
  };

  // Service Charge Configuration
  serviceChargeConfig?: {
    isEnabled: boolean;
    title: string;
    description: string;
    // Legacy service types (for backward compatibility)
    serviceTypes?: Array<{
      name: string;
      amount: number;
      description: string;
      isActive: boolean;
    }>;
    // New stall-based pricing rules
    pricingRules?: {
      smallStallThreshold: number;
      smallStallPrice: number;
      largeStallPrice: number;
    };
    // Payment Gateway Configuration
    paymentGateway: 'phonepe'; // PhonePe payment gateway
    phonePeConfig?: {
      clientId: string;
      env: 'SANDBOX' | 'PRODUCTION';
    };
  };
}

const exhibitionSchema = new Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'completed'],
    default: 'draft',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  invoicePrefix: {
    type: String,
    trim: true,
    maxlength: 10,
    match: [/^[A-Za-z0-9-]*$/, 'Invoice prefix can only contain letters, numbers, and hyphens']
  },
  dimensions: {
    type: {
      width: {
        type: Number,
        min: 10,
        max: 1000,
      },
      height: {
        type: Number,
        min: 10,
        max: 1000,
      }
    },
    default: {
      width: 100,
      height: 100
    }
  },
  stallRates: [{
    stallTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'StallType',
      required: true
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
      description: 'Rate per square meter'
    }
  }],
  // Tax and Discount Configuration
  taxConfig: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      description: 'Tax rate percentage'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  discountConfig: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 0,
      description: 'Discount value (percentage or fixed amount)'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  publicDiscountConfig: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 0,
      description: 'Public discount value (percentage or fixed amount)'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  theme: {
    type: String,
    trim: true,
    default: 'default'
  },

  // Company Details
  companyName: {
    type: String,
    trim: true
  },
  companyContactNo: {
    type: String,
    trim: true
  },
  companyEmail: {
    type: String,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  companyAddress: {
    type: String,
    trim: true
  },
  companyWebsite: {
    type: String,
    trim: true
  },
  companyPAN: {
    type: String,
    trim: true
  },
  companyGST: {
    type: String,
    trim: true
  },
  companySAC: {
    type: String,
    trim: true
  },
  companyCIN: {
    type: String,
    trim: true
  },
  termsAndConditions: {
    type: String,
    trim: true
  },
  piInstructions: {
    type: String,
    trim: true
  },

  // Bank Details
  bankName: {
    type: String,
    trim: true
  },
  bankBranch: {
    type: String,
    trim: true
  },
  bankIFSC: {
    type: String,
    trim: true,
    match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code']
  },
  bankAccountName: {
    type: String,
    trim: true
  },
  bankAccount: {
    type: String,
    trim: true,
    match: [/^\d+$/, 'Please enter a valid account number']
  },

  // Header settings
  headerTitle: {
    type: String,
    trim: true
  },
  headerSubtitle: {
    type: String,
    trim: true
  },
  headerDescription: {
    type: String,
    trim: true
  },
  headerLogo: {
    type: String,
    trim: true
  },
  sponsorLogos: [{
    type: String,
    trim: true
  }],

  // Footer settings
  footerText: {
    type: String,
    trim: true
  },
  footerLogo: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  contactPhone: {
    type: String,
    trim: true,
    match: [/^[0-9-+()]*$/, 'Please enter a valid phone number']
  },
  footerLinks: [{
    label: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    }
  }],

  // Amenities settings
  amenities: [{
    type: {
      type: String,
      enum: ['facility', 'service', 'equipment', 'other'],
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    rate: {
      type: Number,
      required: true,
      min: 0
    }
  }],

  // Basic amenities are included with stall booking - calculated based on stall size
  basicAmenities: [{
    type: {
      type: String,
      enum: ['facility', 'service', 'equipment', 'other'],
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    perSqm: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    }
  }],

  specialRequirements: {
    type: String,
    trim: true,
    maxlength: 1000
  },

  // Letter Settings
  letterSettings: {
    // Stand Possession Letter
    standPossessionLetter: {
      isEnabled: {
        type: Boolean,
        default: false
      },
      template: {
        type: String,
        trim: true
      },
      subject: {
        type: String,
        trim: true
      },
      automaticSending: {
        isEnabled: {
          type: Boolean,
          default: false
        },
        daysBeforeExhibition: {
          type: Number,
          min: 0,
          max: 30
        }
      }
    },
    
    // Transport Letter
    transportLetter: {
      isEnabled: {
        type: Boolean,
        default: false
      },
      template: {
        type: String,
        trim: true
      },
      subject: {
        type: String,
        trim: true
      },
      automaticSending: {
        isEnabled: {
          type: Boolean,
          default: false
        },
        daysBeforeExhibition: {
          type: Number,
          min: 0,
          max: 30
        }
      }
    }
  },

  // Service Charge Configuration
  serviceChargeConfig: {
    isEnabled: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      trim: true,
      default: 'Service Charges'
    },
    description: {
      type: String,
      trim: true,
      default: 'Pay service charges for stall positioning and setup'
    },
    // Legacy service types (for backward compatibility)
    serviceTypes: [{
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
      },
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      description: {
        type: String,
        trim: true,
        maxlength: 200
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    // New stall-based pricing rules
    pricingRules: {
      smallStallThreshold: {
        type: Number,
        min: 1,
        max: 1000
      },
      smallStallPrice: {
        type: Number,
        min: 0
      },
      largeStallPrice: {
        type: Number,
        min: 0
      }
    },
    // Payment Gateway Configuration
    paymentGateway: {
      type: String,
      enum: ['phonepe'],
      default: 'phonepe'
    },
    phonePeConfig: {
      clientId: {
        type: String,
        trim: true
      },
      env: {
        type: String,
        enum: ['SANDBOX', 'PRODUCTION'],
        default: 'SANDBOX'
      }
    }
  }
}, {
  timestamps: true,
});

// Add indexes for better query performance
// Single field indexes for frequent queries
// exhibitionSchema.index({ slug: 1 }); // Already unique, no need for additional index
exhibitionSchema.index({ status: 1 }); // Frequent filtering by status
exhibitionSchema.index({ isActive: 1 }); // Frequent filtering by active state
exhibitionSchema.index({ createdBy: 1 }); // Queries by creator
exhibitionSchema.index({ startDate: 1 }); // Date range queries and sorting
exhibitionSchema.index({ endDate: 1 }); // Date range queries
exhibitionSchema.index({ createdAt: 1 }); // Sorting by creation date

// Compound indexes for common query combinations
exhibitionSchema.index({ status: 1, isActive: 1 }); // Public exhibitions
exhibitionSchema.index({ isActive: 1, createdAt: -1 }); // Active exhibitions sorted by creation
exhibitionSchema.index({ createdBy: 1, isActive: 1 }); // User's active exhibitions
exhibitionSchema.index({ status: 1, startDate: 1 }); // Published exhibitions by start date
exhibitionSchema.index({ name: 'text', description: 'text' }); // Text search on name and description

// User's active exhibitions
exhibitionSchema.index({ status: 1, startDate: 1 });
// Exhibition assignments for access control
exhibitionSchema.index({ assignedUsers: 1 });
// Combined index for user-specific active exhibitions
exhibitionSchema.index({ assignedUsers: 1, status: 1, isActive: 1 });

// Add a pre-save hook to generate the slug from the name
exhibitionSchema.pre('save', function(next) {
  // Generate slug from name if name is modified or slug doesn't exist
  if (this.isModified('name') || !this.slug) {
    this.slug = generateSlug(this.name);
  }
  next();
});

export default mongoose.model<IExhibition>('Exhibition', exhibitionSchema); 