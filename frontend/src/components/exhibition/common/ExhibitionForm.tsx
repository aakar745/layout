/**
 * MAIN FRONTEND FILE: This is the primary frontend component for Exhibition management
 * 
 * MAIN BACKEND FILE: backend/src/models/exhibition.model.ts
 * - Defines the Exhibition schema and interface
 * - Contains all field definitions and validations
 * 
 * BACKEND CONTROLLER: backend/src/controllers/exhibition.controller.ts
 * - Handles all exhibition-related API endpoints
 * - Manages CRUD operations and data validation
 * 
 * When adding new fields/features to Exhibition, update the following files:
 * 1. backend/src/models/exhibition.model.ts - Add fields to IExhibition interface and exhibitionSchema
 * 2. frontend/src/services/exhibition.ts - Add fields to Exhibition interface
 * 3. frontend/src/pages/exhibition/create/index.tsx - Add fields to ExhibitionFormData interface and handleSubmit
 * 4. frontend/src/pages/exhibition/[id]/edit.tsx - Add fields to ExhibitionFormData interface, handleSubmit, and initialValues
 * 5. frontend/src/components/exhibition/common/ExhibitionForm.tsx (HERE) - Update form structure if needed
 * 6. frontend/src/components/exhibition/settings/* - Update relevant settings component
 * 
 * Component Structure:
 * - Uses Ant Design Form and Tabs components
 * - Organizes settings into tabs:
 *   1. General: Basic exhibition info, stall rates, status
 *   2. Header: Title, subtitle, description for header section
 *   3. Footer: Footer text, contact info, external links
 *   4. Amenities: Available facilities, services, special requirements
 * - Each tab is a separate component in settings/ directory
 * - Handles form submission and validation
 * - Supports both create and edit modes
 * 
 * Data Flow:
 * Backend Model <-> Controller <-> Routes <-> Frontend Service <-> ExhibitionForm <-> Settings Components
 * 
 * Example: Adding new settings:
 * 1. Create new component in settings/ directory
 * 2. Add fields to Exhibition interface and schema
 * 3. Update ExhibitionFormData interface
 * 4. Add new tab in ExhibitionForm
 * 5. Include fields in form submission
 * 6. Handle field values in create/edit pages
 */

import React from 'react';
import { Form, Button, Tabs, FormInstance } from 'antd';
import { Exhibition } from '../../../services/exhibition';
import GeneralSettings from '../../exhibition/settings/GeneralSettings';
import HeaderSettings from '../../exhibition/settings/HeaderSettings';
import FooterSettings from '../../exhibition/settings/FooterSettings';
import AmenitiesSettings from '../../exhibition/settings/AmenitiesSettings';

interface ExhibitionFormProps {
  initialValues?: Partial<Exhibition>;
  onSubmit: (values: any) => void;
  submitText?: string;
}

const ExhibitionForm: React.FC<ExhibitionFormProps> = ({
  initialValues,
  onSubmit,
  submitText = 'Submit'
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  const items = [
    {
      key: 'general',
      label: 'General',
      children: <GeneralSettings form={form} />
    },
    {
      key: 'header',
      label: 'Header',
      children: <HeaderSettings form={form} />
    },
    {
      key: 'footer',
      label: 'Footer',
      children: <FooterSettings form={form} />
    },
    {
      key: 'amenities',
      label: 'Amenities',
      children: <AmenitiesSettings form={form} />
    }
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
      style={{ height: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, marginBottom: '24px' }}>
          <Tabs
            defaultActiveKey="general"
            items={items}
            type="card"
          />
        </div>
        <div style={{ textAlign: 'right', borderTop: '1px solid #f0f0f0', paddingTop: '24px' }}>
          <Button type="primary" htmlType="submit">
            {submitText}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default ExhibitionForm; 