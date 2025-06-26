import React from 'react';
import { Modal, Form, Input, Row, Col, Button, Space, Switch, message } from 'antd';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store/store';
import { fetchExhibitors } from '../../../../store/slices/exhibitorSlice';
import exhibitorService, { ExhibitorProfile } from '../../../../services/exhibitor';

interface ExhibitorModalProps {
  visible: boolean;
  onCancel: () => void;
  onExhibitorAdded: (exhibitorId: string) => void;
  form: any;
}

const ExhibitorModal: React.FC<ExhibitorModalProps> = ({
  visible,
  onCancel,
  onExhibitorAdded,
  form
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (values: Partial<ExhibitorProfile>) => {
    try {
      // Transform form values to match backend expectations
      const exhibitorData = {
        companyName: values.companyName,
        contactPerson: values.contactPerson,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        state: values.state,
        pinCode: values.pinCode,
        website: values.website,
        description: values.description,
        panNumber: values.panNumber,
        gstNumber: values.gstNumber,
        isActive: values.isActive !== false // Convert to boolean, default true
      };

      const response = await exhibitorService.createExhibitor(exhibitorData);
      message.success({
        content: 'Exhibitor created successfully! Login credentials have been sent via email.',
        duration: 5
      });
      
      dispatch(fetchExhibitors({})); // Refresh exhibitors list
      onExhibitorAdded(response.data.exhibitor._id); // Select the newly added exhibitor
      onCancel(); // Close modal
      form.resetFields();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error?.message || 'Failed to add exhibitor';
      message.error(errorMessage);
      
      // Handle specific error cases
      if (errorMessage.includes('email already exists')) {
        form.setFields([{
          name: 'email',
          errors: ['This email is already registered']
        }]);
      }
    }
  };

  return (
    <Modal
      title={
        <span style={{ 
          fontSize: '18px', 
          fontWeight: 600,
          color: '#101828'
        }}>
          Add Exhibitor
        </span>
      }
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'flex-end', 
          padding: '20px 24px',
          borderTop: '1px solid #E5E7EB'
        }}>
          <Button 
            onClick={onCancel}
            size="large"
            style={{ 
              height: '44px',
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid #D0D5DD',
              color: '#344054',
              fontWeight: 500,
              fontSize: '14px',
              backgroundColor: 'white',
              minWidth: '100px'
            }}
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            onClick={form.submit}
            size="large"
            style={{ 
              height: '44px',
              padding: '12px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#6941C6',
              color: 'white',
              fontWeight: 500,
              fontSize: '14px',
              boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
              minWidth: '140px'
            }}
          >
            Create Exhibitor
          </Button>
        </div>
      }
      styles={{ 
        body: { 
          padding: '24px',
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto'
        },
        header: {
          borderBottom: '1px solid #E5E7EB',
          padding: '24px'
        },
        footer: {
          borderTop: '1px solid #E5E7EB',
          padding: 0
        }
      }}
      style={{
        top: 20
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        scrollToFirstError
      >
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '32px'
        }}>
          {/* Company Information Section */}
          <div>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: '2px solid #F3F4F6'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#EEF2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <span style={{ fontSize: '16px' }}>🏢</span>
              </div>
              <h3 style={{ 
                fontSize: '16px',
                fontWeight: 600,
                color: '#101828',
                margin: 0
              }}>
                Company Information
              </h3>
            </div>
            
            <Form.Item
              name="companyName"
              label="Company Name"
              rules={[
                { required: true, message: 'Please enter company name' },
                { min: 2, message: 'Company name must be at least 2 characters' },
                { max: 100, message: 'Company name cannot exceed 100 characters' }
              ]}
            >
              <Input 
                placeholder="Enter company name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Please enter address' }]}
            >
              <Input.TextArea 
                rows={3} 
                placeholder="Enter complete address"
                showCount
                maxLength={200}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="city"
                  label="City"
                  rules={[{ required: true, message: 'Please enter city' }]}
                >
                  <Input placeholder="Enter city" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="state"
                  label="State"
                  rules={[{ required: true, message: 'Please enter state' }]}
                >
                  <Input placeholder="Enter state" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="pinCode"
              label="PIN Code"
              rules={[
                { required: true, message: 'Please enter PIN code' },
                { pattern: /^\d{6}$/, message: 'Please enter a valid 6-digit PIN code' }
              ]}
            >
              <Input placeholder="123456" maxLength={6} />
            </Form.Item>

            <Form.Item
              name="website"
              label="Website"
              rules={[
                { type: 'url', message: 'Please enter a valid website URL' }
              ]}
            >
              <Input placeholder="https://www.company.com" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Company Description"
            >
              <Input.TextArea 
                rows={3} 
                placeholder="Brief description about the company"
                showCount
                maxLength={500}
              />
            </Form.Item>
          </div>

          {/* Contact & Legal Information Section */}
          <div>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: '2px solid #F3F4F6'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#FEF3F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <span style={{ fontSize: '16px' }}>👤</span>
              </div>
              <h3 style={{ 
                fontSize: '16px',
                fontWeight: 600,
                color: '#101828',
                margin: 0
              }}>
                Contact & Legal Information
              </h3>
            </div>
            
            <Form.Item
              name="contactPerson"
              label="Contact Person"
              rules={[
                { required: true, message: 'Please enter contact person' },
                { min: 2, message: 'Name must be at least 2 characters' },
                { max: 100, message: 'Name cannot exceed 100 characters' }
              ]}
            >
              <Input placeholder="Enter contact person name" size="large" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
              extra="Login credentials will be sent to this email"
            >
              <Input 
                placeholder="contact@company.com" 
                size="large"
                prefix={<span style={{ color: '#9CA3AF' }}>📧</span>}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please enter phone number' },
                { pattern: /^[0-9-+()]*$/, message: 'Please enter a valid phone number' }
              ]}
            >
              <Input 
                placeholder="9876543210" 
                size="large"
                prefix={<span style={{ color: '#9CA3AF' }}>📱</span>}
              />
            </Form.Item>

            <Form.Item
              name="panNumber"
              label="PAN Number"
              rules={[
                { pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: 'Please enter a valid PAN number (e.g., ABCDE1234F)' }
              ]}
            >
              <Input 
                placeholder="ABCDE1234F" 
                style={{ textTransform: 'uppercase' }}
                maxLength={10}
              />
            </Form.Item>

            <Form.Item
              name="gstNumber"
              label="GST Number"
              rules={[
                { pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, message: 'Please enter a valid GST number' }
              ]}
            >
              <Input 
                placeholder="27AAPFU0939F1ZV" 
                style={{ textTransform: 'uppercase' }}
                maxLength={15}
              />
            </Form.Item>

            <Form.Item
              name="isActive"
              label="Account Status"
              initialValue={true}
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="Active" 
                unCheckedChildren="Inactive"
                size="default"
              />
            </Form.Item>
          </div>
        </div>

        {/* Information Alert */}
        <div style={{ 
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#F0F9FF',
          border: '1px solid #BAE6FD',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <span style={{ fontSize: '16px', marginTop: '2px' }}>ℹ️</span>
          <div>
            <div style={{ fontWeight: 600, color: '#0369A1', marginBottom: '4px' }}>
              Account Creation Notice
            </div>
            <div style={{ color: '#0369A1', fontSize: '14px', lineHeight: '1.5' }}>
              • A temporary password will be automatically generated and sent to the provided email<br/>
              • The exhibitor will be pre-approved and can log in immediately<br/>
              • They should change their password after first login for security
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ExhibitorModal; 