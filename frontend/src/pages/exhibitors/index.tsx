import React, { useEffect, useState } from 'react';
import { 
  Card, Button, Space, Modal, Select, Input, message, 
  Form, Switch, Typography, Radio, Alert, Row, Col,
  Statistic, Tag, Badge, Divider
} from 'antd';
import { 
  UserOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ExclamationCircleOutlined, ClockCircleOutlined, UserAddOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchExhibitors, Exhibitor } from '../../store/slices/exhibitorSlice';
import exhibitorService from '../../services/exhibitor';
import ExhibitorTable from './ExhibitorTable';
import '../dashboard/Dashboard.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea, Search } = Input;

// Extended interface with all fields we need
interface ExhibitorData extends Exhibitor {
  createdAt: string;
  rejectionReason?: string;
  address?: string;
  website?: string;
  description?: string;
}

const ExhibitorManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { exhibitors, loading, pagination, filters } = useSelector((state: RootState) => state.exhibitor);
  const [selectedExhibitor, setSelectedExhibitor] = useState<ExhibitorData | null>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('approved');
  const [rejectionReason, setRejectionReason] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Server-side filtering and pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | undefined>();
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'companyName' | 'status' | 'contactPerson' | 'updatedAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const hasSelected = selectedRowKeys.length > 0;

  // Stats - these will be calculated from total counts
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Load exhibitors with current filters and pagination
  const loadExhibitors = React.useCallback(() => {
    dispatch(fetchExhibitors({
      page: currentPage,
      limit: pageSize,
      status: statusFilter,
      search: searchText.trim() || undefined,
      sortBy,
      sortOrder
    }));
  }, [dispatch, currentPage, pageSize, statusFilter, searchText, sortBy, sortOrder]);

  useEffect(() => {
    loadExhibitors();
  }, [loadExhibitors]);

  // Calculate stats whenever pagination total changes
  useEffect(() => {
    if (pagination.total > 0) {
      // For stats, we'll need to fetch count data separately or calculate from available data
      // For now, use pagination total as total count
      setStats({
        total: pagination.total,
        pending: 0, // We'd need separate API calls for these or include in response
        approved: 0,
        rejected: 0
      });
    }
      }, [pagination]);
  
  // Utility function for status tags (still used in modals)
  const getStatusTag = (status: string) => {
    switch(status) {
      case 'approved':
        return <Tag color="success">Approved</Tag>;
      case 'pending':
        return <Tag color="warning">Pending</Tag>;
      case 'rejected':
        return <Tag color="error">Rejected</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  useEffect(() => {
    if (selectedExhibitor && isEditModalVisible) {
      form.setFieldsValue({
        companyName: selectedExhibitor.companyName,
        contactPerson: selectedExhibitor.contactPerson,
        email: selectedExhibitor.email,
        phone: selectedExhibitor.phone,
        address: selectedExhibitor.address || '',
        website: selectedExhibitor.website || '',
        description: selectedExhibitor.description || '',
        isActive: selectedExhibitor.isActive
      });
    }
  }, [selectedExhibitor, isEditModalVisible, form]);



  const handleUpdateStatus = async () => {
    if (!selectedExhibitor) return;

    try {
      setUpdateLoading(true);
      await exhibitorService.updateStatus(
        selectedExhibitor._id,
        status,
        status === 'rejected' ? rejectionReason : undefined
      );
      message.success(`Exhibitor status updated to ${status}`);
      setIsUpdateModalVisible(false);
      // Refresh exhibitor list
      loadExhibitors();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update exhibitor status');
    } finally {
      setUpdateLoading(false);
    }
  };
  
  const handleEditExhibitorSubmit = async (values: any) => {
    if (!selectedExhibitor) return;
    
    try {
      setEditLoading(true);
      await exhibitorService.updateExhibitor(selectedExhibitor._id, values);
      message.success('Exhibitor details updated successfully');
      setIsEditModalVisible(false);
      // Refresh exhibitor list
      loadExhibitors();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update exhibitor details');
    } finally {
      setEditLoading(false);
    }
  };
  
  const handleDeleteExhibitor = async (id: string) => {
    try {
      setDeleteLoading(true);
      await exhibitorService.deleteExhibitor(id);
      message.success('Exhibitor deleted successfully');
      // Refresh exhibitor list
      loadExhibitors();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to delete exhibitor');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Server-side search handler
  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Server-side status filter handler
  const handleFilterByStatus = (value: any) => {
    setStatusFilter(value === 'all' ? undefined : value);
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  // Pagination change handler
  const handleTableChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Sort change handler
  const handleSortChange = (field: string, order: 'ascend' | 'descend' | undefined) => {
    if (order) {
      setSortBy(field as any);
      setSortOrder(order === 'ascend' ? 'asc' : 'desc');
    } else {
      setSortBy('createdAt');
      setSortOrder('desc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handleExportToExcel = async (selectedOnly = false) => {
    try {
      let dataToExport = exhibitors;
      
      // If exporting selected only, filter the data
      if (selectedOnly && selectedRowKeys.length > 0) {
        dataToExport = exhibitors.filter(item => selectedRowKeys.includes(item._id));
      }
      
      // If no data to export
      if (dataToExport.length === 0) {
        message.warning(selectedOnly ? 'No exhibitors selected for export' : 'No exhibitor data to export');
        return;
      }

      // Prepare data for Excel export
      const excelData = dataToExport.map((item: any) => ({
        'Company Name': item.companyName,
        'Contact Person': item.contactPerson,
        'Email': item.email,
        'Phone': item.phone,
        'Status': item.status.charAt(0).toUpperCase() + item.status.slice(1),
        'Active': item.isActive ? 'Yes' : 'No',
        'Registration Date': new Date(item.createdAt).toLocaleDateString(),
        'Address': item.address || '',
        'Website': item.website || '',
        'Description': item.description || ''
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths for better formatting
      const columnWidths = [
        { wch: 25 }, // Company Name
        { wch: 20 }, // Contact Person
        { wch: 30 }, // Email
        { wch: 15 }, // Phone
        { wch: 12 }, // Status
        { wch: 8 },  // Active
        { wch: 15 }, // Registration Date
        { wch: 40 }, // Address
        { wch: 30 }, // Website
        { wch: 50 }  // Description
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Exhibitors');

      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = selectedOnly 
        ? `exhibitors-selected-${timestamp}.xlsx`
        : `exhibitors-all-${timestamp}.xlsx`;

      // Save the file
      XLSX.writeFile(workbook, filename);

      message.success(`${selectedOnly ? 'Selected exhibitors' : 'All exhibitors'} exported to Excel successfully`);
    } catch (error) {
      console.error('Export error:', error);
      message.error('Failed to export exhibitor data');
    }
  };

  // Legacy CSV export function (keeping for backward compatibility)
  const handleExport = () => {
    handleExportToExcel(true); // Export selected items to Excel
  };
  
  const handleDeleteMultiple = () => {
    Modal.confirm({
      title: 'Delete Selected Exhibitors',
      content: `Are you sure you want to delete ${selectedRowKeys.length} exhibitors? This action cannot be undone.`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          setDeleteLoading(true);
          
          // Delete each selected exhibitor
          const promises = selectedRowKeys.map(id => 
            exhibitorService.deleteExhibitor(id.toString())
          );
          
          await Promise.all(promises);
          message.success(`${selectedRowKeys.length} exhibitors deleted successfully`);
          
          // Clear selection and refresh list
          setSelectedRowKeys([]);
          loadExhibitors();
        } catch (error: any) {
          message.error('Failed to delete some exhibitors');
        } finally {
          setDeleteLoading(false);
        }
      }
    });
  };

  // Table action handlers
  const handleViewExhibitor = (exhibitor: ExhibitorData) => {
    setSelectedExhibitor(exhibitor);
    setIsViewModalVisible(true);
  };

  const handleEditExhibitor = (exhibitor: ExhibitorData) => {
    setSelectedExhibitor(exhibitor);
    setIsEditModalVisible(true);
  };

  const handleUpdateStatusAction = (exhibitor: ExhibitorData) => {
    setSelectedExhibitor(exhibitor);
    setStatus(exhibitor.status as 'pending' | 'approved' | 'rejected');
    setRejectionReason(exhibitor.rejectionReason || '');
    setIsUpdateModalVisible(true);
  };

  const handleSelectionChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 24]} align="middle">
          <Col flex="auto">
            <Space direction="vertical" size={4}>
              <Title level={4} style={{ margin: 0 }}>Exhibitors</Title>
              <Text type="secondary">Manage exhibitors and their information</Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleExportToExcel(false)}
                size="large"
              >
                Export to Excel
              </Button>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => setIsEditModalVisible(true)}
                size="large"
              >
                Add Exhibitor
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Total Exhibitors" 
              value={stats.total}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Pending" 
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Approved" 
              value={stats.approved}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Rejected" 
              value={stats.rejected}
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters Section */}
      <Card className="info-card" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8} md={6} lg={4}>
              <Search
                placeholder="Search exhibitors"
                allowClear
                onSearch={handleSearch}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={8} md={6} lg={4}>
              <Select
                placeholder="Filter by status"
                style={{ width: '100%' }}
                onChange={handleFilterByStatus}
                allowClear
              >
                <Option value="all">All Status</Option>
                <Option value="pending">Pending</Option>
                <Option value="approved">Approved</Option>
                <Option value="rejected">Rejected</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8} md={6} lg={6}>
              <Text type="secondary">
                Page {currentPage} of {pagination.pages} ({pagination.total} total)
              </Text>
            </Col>
          </Row>

          {selectedRowKeys.length > 0 && (
            <Row>
              <Space>
                <Text>Selected {selectedRowKeys.length} items</Text>
                <Button danger onClick={handleDeleteMultiple}>
                  Delete Selected
                </Button>
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                >
                  Export Selected to Excel
                </Button>
              </Space>
            </Row>
          )}
        </Space>
      </Card>

      {/* Table Section */}
      <Card className="info-card">
        <ExhibitorTable
          exhibitors={exhibitors as any[]}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          total={pagination.total}
          totalPages={pagination.pages}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={handleSelectionChange}
          onView={handleViewExhibitor}
          onEdit={handleEditExhibitor}
          onUpdateStatus={handleUpdateStatusAction}
          onDelete={handleDeleteExhibitor}
          onTableChange={handleTableChange}
          onSortChange={handleSortChange}
        />
      </Card>

      {/* View Exhibitor Modal */}
      <Modal
        title="Exhibitor Details"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        {selectedExhibitor && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Company Information">
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <Text strong>Company Name:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>{selectedExhibitor.companyName}</Text>
                    </Col>
                    
                    <Col span={12}>
                      <Text strong>Contact Person:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>{selectedExhibitor.contactPerson}</Text>
                    </Col>
                    
                    <Col span={12}>
                      <Text strong>Email:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>{selectedExhibitor.email}</Text>
                    </Col>
                    
                    <Col span={12}>
                      <Text strong>Phone:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>{selectedExhibitor.phone}</Text>
                    </Col>
                    
                    <Col span={12}>
                      <Text strong>Address:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>{selectedExhibitor.address || 'Not provided'}</Text>
                    </Col>
                    
                    <Col span={12}>
                      <Text strong>Status:</Text>
                    </Col>
                    <Col span={12}>
                      {getStatusTag(selectedExhibitor.status)}
                    </Col>
                    
                    <Col span={12}>
                      <Text strong>Active:</Text>
                    </Col>
                    <Col span={12}>
                      <Badge status={selectedExhibitor.isActive ? 'success' : 'error'} 
                        text={selectedExhibitor.isActive ? 'Yes' : 'No'} />
                    </Col>
                    
                    <Col span={12}>
                      <Text strong>Registration Date:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>{new Date(selectedExhibitor.createdAt).toLocaleString()}</Text>
                    </Col>
                  </Row>
                </Card>
              </Col>
              
              <Col span={24}>
                <Card title="Additional Information">
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <Text strong>Address:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>{selectedExhibitor.address || 'Not provided'}</Text>
                    </Col>
                    
                    <Col span={12}>
                      <Text strong>Website:</Text>
                    </Col>
                    <Col span={12}>
                      {selectedExhibitor.website ? (
                        <a href={selectedExhibitor.website} target="_blank" rel="noopener noreferrer">
                          {selectedExhibitor.website}
                        </a>
                      ) : 'Not provided'}
                    </Col>
                    
                    {selectedExhibitor.status === 'rejected' && (
                      <>
                        <Col span={12}>
                          <Text strong>Rejection Reason:</Text>
                        </Col>
                        <Col span={12}>
                          <Text type="danger">{selectedExhibitor.rejectionReason || 'No reason provided'}</Text>
                        </Col>
                      </>
                    )}
                  </Row>
                  
                  {selectedExhibitor.description && (
                    <>
                      <Divider />
                      <Text strong>Description:</Text>
                      <Paragraph style={{ marginTop: 8 }}>
                        {selectedExhibitor.description}
                      </Paragraph>
                    </>
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        title="Update Exhibitor Status"
        open={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedExhibitor && (
          <div>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <UserOutlined style={{ fontSize: '18px' }} />
                  <span>Exhibitor Information</span>
                </div>
              }
              style={{ marginBottom: 16 }}
              bordered={false}
              size="small"
            >
              <Row gutter={[16, 8]}>
                <Col span={8}>
                  <Text strong>Company:</Text>
                </Col>
                <Col span={16}>
                  <Text>{selectedExhibitor.companyName}</Text>
                </Col>
                
                <Col span={8}>
                  <Text strong>Contact Person:</Text>
                </Col>
                <Col span={16}>
                  <Text>{selectedExhibitor.contactPerson}</Text>
                </Col>
                
                <Col span={8}>
                  <Text strong>Email:</Text>
                </Col>
                <Col span={16}>
                  <Text>{selectedExhibitor.email}</Text>
                </Col>
                
                <Col span={8}>
                  <Text strong>Address:</Text>
                </Col>
                <Col span={16}>
                  <Text>{selectedExhibitor.address || 'Not provided'}</Text>
                </Col>
                
                <Col span={8}>
                  <Text strong>Current Status:</Text>
                </Col>
                <Col span={16}>
                  {getStatusTag(selectedExhibitor.status)}
                </Col>
              </Row>
            </Card>

            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ExclamationCircleOutlined style={{ fontSize: '18px' }} />
                  <span>Update Status</span>
                </div>
              }
              bordered={false}
              size="small"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <Text strong>Select New Status:</Text>
                  <div style={{ marginTop: '16px' }}>
                    <Radio.Group 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value as 'pending' | 'approved' | 'rejected')}
                      buttonStyle="solid"
                    >
                      <Radio.Button value="pending">
                        <Space>
                          <ClockCircleOutlined style={{ color: '#faad14' }} />
                          Pending
                        </Space>
                      </Radio.Button>
                      <Radio.Button value="approved">
                        <Space>
                          <CheckCircleOutlined style={{ color: '#52c41a' }} />
                          Approved
                        </Space>
                      </Radio.Button>
                      <Radio.Button value="rejected">
                        <Space>
                          <CloseCircleOutlined style={{ color: '#f5222d' }} />
                          Rejected
                        </Space>
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
                
                {status === 'rejected' && (
                  <div>
                    <Form.Item 
                      label={<Text strong>Rejection Reason:</Text>}
                      required={status === 'rejected'}
                      rules={[{ required: true, message: 'Please provide a reason for rejection' }]}
                      help="This will be visible to the exhibitor"
                    >
                      <TextArea
                        rows={4}
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                        placeholder="Provide a reason for rejection"
                        style={{ marginTop: 8 }}
                      />
                    </Form.Item>
                  </div>
                )}
                
                {status === 'approved' && (
                  <Alert
                    message="Approval Confirmation"
                    description="By approving this exhibitor, they will be able to log in and manage their exhibition space."
                    type="success"
                    showIcon
                    style={{ marginTop: 8 }}
                  />
                )}
                
                {status === 'pending' && (
                  <Alert
                    message="Return to Pending"
                    description="This exhibitor will be moved back to pending status and will not be able to log in."
                    type="warning"
                    showIcon
                    style={{ marginTop: 8 }}
                  />
                )}
              </div>
              
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button onClick={() => setIsUpdateModalVisible(false)}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  onClick={handleUpdateStatus}
                  loading={updateLoading}
                  disabled={status === 'rejected' && !rejectionReason.trim()}
                >
                  Update Status
                </Button>
              </div>
            </Card>
          </div>
        )}
      </Modal>
      
      {/* Edit Exhibitor Modal */}
      <Modal
        title="Edit Exhibitor Details"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditExhibitorSubmit}
        >
          <Form.Item
            name="companyName"
            label="Company Name"
            rules={[{ required: true, message: 'Please enter company name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="contactPerson"
            label="Contact Person"
            rules={[{ required: true, message: 'Please enter contact person' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="Address"
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="website"
            label="Website"
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={4} />
          </Form.Item>
          
          <Form.Item
            name="isActive"
            label="Active Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={editLoading}>
                Save Changes
              </Button>
              <Button onClick={() => setIsEditModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExhibitorManagement; 