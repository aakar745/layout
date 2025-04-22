/// <reference types="vite/client" />

import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Select, Button, Space, InputNumber, Typography, Switch, FormInstance, Card, Row, Col, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import { Exhibition } from '../../../services/exhibition';
import stallService, { StallType } from '../../../services/stall';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

interface GeneralSettingsProps {
  form: FormInstance;
}

const RichTextEditor: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
}> = ({ value = '', onChange }) => {
  const editorRef = React.useRef<any>(null);
  
  // This ensures we're not re-initializing the editor on re-renders
  const [initialValue] = React.useState(value);
  
  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY as string}
      onInit={(evt, editor) => {
        editorRef.current = editor;
      }}
      value={value}
      init={{
        height: 300,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
          'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
          'bold italic | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist | ' +
          'removeformat | help',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; font-size: 14px; }',
        branding: false,
        promotion: false,
        entity_encoding: 'raw',
        convert_urls: false,    // Prevents URL conversion that can cause cursor issues
        paste_data_images: true,
        resize: false,
        statusbar: false,
        browser_spellcheck: true,
        setup: (editor) => {
          // Clear undo history when initializing to prevent issues
          editor.on('init', () => {
            editor.undoManager.clear();
            editor.undoManager.add();
          });
          
          // Track editor history for proper undo/redo
          editor.on('change', () => {
            editor.undoManager.add();
          });
        }
      }}
      onEditorChange={(content) => {
        onChange?.(content);
      }}
    />
  );
};

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ form }) => {
  const [stallTypes, setStallTypes] = useState<StallType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStallTypes = async () => {
      try {
        setLoading(true);
        const response = await stallService.getStallTypes();
        setStallTypes(response.data.filter(type => type.status === 'active'));
      } catch (error) {
        console.error('Failed to fetch stall types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStallTypes();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Basic Information Section
       * Core details about the exhibition including:
       * - Exhibition Name
       * - Description
       * - Venue
       * - Exhibition Dates
       */}
      <Card className="settings-card">
        <Title level={4}>Basic Information</Title>
        <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
          Enter the main details of your exhibition
        </Text>
        
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Exhibition Name"
              rules={[{ required: true, message: 'Please enter exhibition name' }]}
            >
              <Input placeholder="Enter exhibition name" />
            </Form.Item>
          </Col>
          
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter description' }]}
            >
              <Input.TextArea rows={4} placeholder="Enter exhibition description" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="venue"
              label="Exhibition Venue"
              rules={[{ required: true, message: 'Please enter exhibition venue' }]}
            >
              <Input.TextArea rows={2} placeholder="Enter exhibition venue details" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="invoicePrefix"
              label="Invoice Prefix"
              tooltip="This prefix will be used for all invoices generated for this exhibition (e.g. INV, EXP23)"
              rules={[
                { max: 10, message: 'Prefix cannot be longer than 10 characters' },
                { pattern: /^[A-Za-z0-9-]*$/, message: 'Only letters, numbers, and hyphens are allowed' }
              ]}
            >
              <Input placeholder="Enter invoice prefix (default: INV)" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="dateRange"
              label="Exhibition Dates"
              rules={[{ required: true, message: 'Please select exhibition dates' }]}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Company Details Section */}
      <Card className="settings-card" style={{ marginTop: '24px' }}>
        <Title level={4}>Company Details</Title>
        <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
          Enter your company information
        </Text>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="companyName"
              label="Company Name"
              rules={[{ required: true, message: 'Please enter company name' }]}
            >
              <Input placeholder="Enter company name" />
            </Form.Item>

            <Form.Item
              name="companyContactNo"
              label="Contact No."
              rules={[{ required: true, message: 'Please enter contact number' }]}
            >
              <Input placeholder="Enter contact number" />
            </Form.Item>

            <Form.Item
              name="companyEmail"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>

            <Form.Item
              name="companyAddress"
              label="Address"
              rules={[{ required: true, message: 'Please enter address' }]}
            >
              <Input.TextArea rows={4} placeholder="Enter company address" />
            </Form.Item>

            <Form.Item
              name="termsAndConditions"
              label="Terms & Conditions"
              tooltip="Use the rich text editor to format your terms and conditions"
            >
              <RichTextEditor />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="companyPAN"
              label="PAN No."
              rules={[{ required: true, message: 'Please enter PAN number' }]}
            >
              <Input placeholder="Enter PAN number" />
            </Form.Item>

            <Form.Item
              name="companyGST"
              label="GST No."
              rules={[{ required: true, message: 'Please enter GST number' }]}
            >
              <Input placeholder="Enter GST number" />
            </Form.Item>

            <Form.Item
              name="companySAC"
              label="SAC Code No."
            >
              <Input placeholder="Enter SAC code number" />
            </Form.Item>

            <Form.Item
              name="companyCIN"
              label="CIN No."
            >
              <Input placeholder="Enter CIN number" />
            </Form.Item>

            <Form.Item
              name="companyWebsite"
              label="Website"
              rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
            >
              <Input placeholder="Enter website URL" />
            </Form.Item>

            <Form.Item
              name="piInstructions"
              label="PI Instructions"
              tooltip="Use the rich text editor to format your PI instructions"
            >
              <RichTextEditor />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Bank Details Section */}
      <Card className="settings-card" style={{ marginTop: '24px' }}>
        <Title level={4}>Bank Details</Title>
        <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
          Enter your bank account information for payments
        </Text>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="bankName"
              label="Bank Name"
              rules={[{ required: true, message: 'Please enter bank name' }]}
            >
              <Input placeholder="Enter bank name" />
            </Form.Item>

            <Form.Item
              name="bankBranch"
              label="Branch Name"
              rules={[{ required: true, message: 'Please enter branch name' }]}
            >
              <Input placeholder="Enter branch name" />
            </Form.Item>

            <Form.Item
              name="bankIFSC"
              label="IFSC Code"
              rules={[
                { required: true, message: 'Please enter IFSC code' },
                { pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Please enter a valid IFSC code' }
              ]}
            >
              <Input placeholder="Enter IFSC code" style={{ textTransform: 'uppercase' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="bankAccountName"
              label="Account Name"
              rules={[{ required: true, message: 'Please enter account name' }]}
            >
              <Input placeholder="Enter account name" />
            </Form.Item>

            <Form.Item
              name="bankAccount"
              label="Account Number"
              rules={[
                { required: true, message: 'Please enter account number' },
                { pattern: /^\d+$/, message: 'Please enter a valid account number' }
              ]}
            >
              <Input placeholder="Enter account number" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Stall Rates Section */}
      <Card className="settings-card" style={{ marginTop: '24px' }}>
        <Title level={4}>Stall Rates & Pricing</Title>
        <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
          Configure pricing, taxes, and discounts for stalls
        </Text>

        {/* Stall Type Rates */}
        <div style={{ marginBottom: '32px' }}>
          <Title level={5}>Stall Type Rates</Title>
          <Text type="secondary" style={{ marginBottom: '16px', display: 'block' }}>
            Configure pricing per square meter for different types of stalls
          </Text>

          <Form.List name="stallRates">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'stallTypeId']}
                      rules={[{ required: true, message: 'Please select stall type' }]}
                    >
                      <Select
                        loading={loading}
                        placeholder="Select stall type"
                        style={{ width: 200 }}
                      >
                        {stallTypes.map(type => (
                          <Select.Option key={type._id} value={type._id}>
                            {type.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'rate']}
                      rules={[{ required: true, message: 'Please enter rate' }]}
                    >
                      <InputNumber
                        min={0}
                        placeholder="Rate per sq.m"
                        style={{ width: 200 }}
                        prefix="₹"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value: string | undefined) => {
                          const parsed = value ? Number(value.replace(/\₹\s?|(,*)/g, '')) : 0;
                          return isNaN(parsed) ? 0 : parsed;
                        }}
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Stall Type Rate
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>

        {/* Tax Configuration */}
        <div style={{ marginBottom: '32px' }}>
          <Title level={5}>Tax Configuration</Title>
          <Text type="secondary" style={{ marginBottom: '16px', display: 'block' }}>
            Configure applicable taxes for stall bookings
          </Text>

          <Form.List name="taxConfig">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: 'Please enter tax name' }]}
                    >
                      <Input placeholder="Tax name" style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'rate']}
                      rules={[{ required: true, message: 'Please enter tax rate' }]}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        placeholder="Tax rate"
                        style={{ width: 150 }}
                        formatter={value => `${value}%`}
                        parser={(value: string | undefined) => {
                          const parsed = value ? Number(value.replace('%', '')) : 0;
                          return isNaN(parsed) ? 0 : Math.min(parsed, 100);
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'isActive']}
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Tax
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>

        {/* Discount Configuration */}
        <div>
          <Title level={5}>Admin Discount Configuration</Title>
          <Text type="secondary" style={{ marginBottom: '16px', display: 'block' }}>
            Configure available discounts for admin panel stall bookings
          </Text>

          <Form.List name="discountConfig">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: 'Please enter discount name' }]}
                    >
                      <Input placeholder="Discount" style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'type']}
                      rules={[{ required: true, message: 'Please select type' }]}
                    >
                      <Select style={{ width: 150 }}>
                        <Select.Option value="percentage">Percentage (%)</Select.Option>
                        <Select.Option value="fixed">Fixed Amount (₹)</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, curValues) => {
                        return prevValues?.discountConfig?.[name]?.type !== curValues?.discountConfig?.[name]?.type;
                      }}
                    >
                      {({ getFieldValue }) => {
                        const type = getFieldValue(['discountConfig', name, 'type']);
                        return (
                          <Form.Item
                            {...restField}
                            name={[name, 'value']}
                            rules={[{ required: true, message: `Please enter ${type === 'percentage' ? 'percentage' : 'amount'}` }]}
                          >
                            <InputNumber
                              min={0}
                              max={type === 'percentage' ? 100 : undefined}
                              placeholder={type === 'percentage' ? 'Percentage' : 'Amount'}
                              style={{ width: 150 }}
                              formatter={value => type === 'percentage' ? `${value}%` : `₹${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={(value: string | undefined) => {
                                const parsed = value ? Number(value.replace(/[₹%,]/g, '')) : 0;
                                return isNaN(parsed) ? 0 : parsed;
                              }}
                            />
                          </Form.Item>
                        );
                      }}
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'isActive']}
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Admin Discount
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>

        {/* Public Discount Configuration */}
        <div style={{ marginTop: '24px' }}>
          <Title level={5}>Public Discount Configuration</Title>
          <Text type="secondary" style={{ marginBottom: '16px', display: 'block' }}>
            Configure available discounts for public stall bookings
          </Text>

          <Form.List name="publicDiscountConfig">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: 'Please enter discount name' }]}
                    >
                      <Input placeholder="Discount" style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'type']}
                      rules={[{ required: true, message: 'Please select type' }]}
                    >
                      <Select style={{ width: 150 }}>
                        <Select.Option value="percentage">Percentage (%)</Select.Option>
                        <Select.Option value="fixed">Fixed Amount (₹)</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, curValues) => {
                        return prevValues?.publicDiscountConfig?.[name]?.type !== curValues?.publicDiscountConfig?.[name]?.type;
                      }}
                    >
                      {({ getFieldValue }) => {
                        const type = getFieldValue(['publicDiscountConfig', name, 'type']);
                        return (
                          <Form.Item
                            {...restField}
                            name={[name, 'value']}
                            rules={[{ required: true, message: `Please enter ${type === 'percentage' ? 'percentage' : 'amount'}` }]}
                          >
                            <InputNumber
                              min={0}
                              max={type === 'percentage' ? 100 : undefined}
                              placeholder={type === 'percentage' ? 'Percentage' : 'Amount'}
                              style={{ width: 150 }}
                              formatter={value => type === 'percentage' ? `${value}%` : `₹${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={(value: string | undefined) => {
                                const parsed = value ? Number(value.replace(/[₹%,]/g, '')) : 0;
                                return isNaN(parsed) ? 0 : parsed;
                              }}
                            />
                          </Form.Item>
                        );
                      }}
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'isActive']}
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Public Discount
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
      </Card>

      {/* Status Settings Section */}
      <Card className="settings-card" style={{ marginTop: '24px' }}>
        <Title level={4}>Status Settings</Title>
        <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
          Manage the visibility and status of your exhibition
        </Text>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select>
                <Select.Option value="draft">Draft</Select.Option>
                <Select.Option value="published">Published</Select.Option>
                <Select.Option value="completed">Completed</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="isActive"
              label="Active Status"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default GeneralSettings; 