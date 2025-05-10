import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Tag, 
  Space, 
  Button, 
  Input, 
  Card, 
  Typography, 
  Select, 
  message, 
  DatePicker, 
  Tooltip,
  Modal,
  App,
  Progress
} from 'antd';
import { 
  SearchOutlined, 
  DownloadOutlined, 
  EyeOutlined, 
  ReloadOutlined,
  MailOutlined,
  FilterOutlined,
  ClearOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useGetInvoicesQuery, useShareViaEmailMutation } from '../../../store/services/invoice';
import { downloadFile } from '../../../services/api';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExhibitions } from '../../../store/slices/exhibitionSlice';
import { AppDispatch, RootState } from '../../../store/store';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const InvoiceList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [exhibitionFilter, setExhibitionFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');
  const [messageApi, contextHolder] = message.useMessage();
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  // Fetch exhibitions for the filter dropdown
  const { exhibitions, loading: exhibitionsLoading } = useSelector((state: RootState) => state.exhibition);

  useEffect(() => {
    dispatch(fetchExhibitions());
  }, [dispatch]);

  const { data: invoiceData, isLoading, refetch } = useGetInvoicesQuery({ 
    page, 
    limit: pageSize,
    // Additional query params could be added here for server-side filtering
  });

  const [shareViaEmail, { isLoading: isEmailSending }] = useShareViaEmailMutation();

  // Filter invoices locally since the API might not support all filter combinations
  const filteredInvoices = React.useMemo(() => {
    if (!invoiceData?.data) return [];
    
    return invoiceData.data.filter(invoice => {
      // Search text filter
      const searchLower = searchText.toLowerCase();
      const matchesSearch = 
        searchText === '' || 
        (invoice.invoiceNumber && invoice.invoiceNumber.toLowerCase().includes(searchLower)) ||
        invoice._id.toLowerCase().includes(searchLower) ||
        (invoice.bookingId.customerName && invoice.bookingId.customerName.toLowerCase().includes(searchLower)) ||
        (invoice.bookingId.companyName && invoice.bookingId.companyName.toLowerCase().includes(searchLower));
      
      // Status filter
      const matchesStatus = !statusFilter || invoice.status === statusFilter;
      
      // Exhibition filter
      const matchesExhibition = !exhibitionFilter || 
        (invoice.bookingId.exhibitionId && 
        (invoice.bookingId.exhibitionId._id === exhibitionFilter));
      
      // Date range filter
      let matchesDateRange = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const invoiceDate = dayjs(invoice.createdAt);
        matchesDateRange = invoiceDate.isAfter(dateRange[0]) && invoiceDate.isBefore(dateRange[1]);
      }
      
      return matchesSearch && matchesStatus && matchesExhibition && matchesDateRange;
    });
  }, [invoiceData, searchText, statusFilter, exhibitionFilter, dateRange]);

  const handleDownload = async (id: string) => {
    try {
      setDownloadingInvoiceId(id);
      setDownloadProgress(0);
      messageApi.loading({ content: 'Preparing invoice...', key: id });
      
      // Use the enhanced downloadFile function with progress tracking
      const response = await downloadFile(
        `/invoices/${id}/download?force=false`, 
        false,
        (progressEvent) => {
          const total = progressEvent.total;
          const loaded = progressEvent.loaded;
          
          if (total) {
            // Calculate and update progress percentage
            const percentage = Math.round((loaded * 100) / total);
            setDownloadProgress(percentage);
            
            // Update message when progress changes significantly
            if (percentage % 25 === 0) {
              messageApi.loading({ 
                content: `Downloading: ${percentage}% complete`, 
                key: id 
              });
            }
          }
        }
      );
      
      // Process the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      messageApi.success({ content: 'Invoice downloaded successfully', key: id });
    } catch (error) {
      console.error('Download error:', error);
      messageApi.error({ content: 'Failed to download invoice', key: id });
    } finally {
      setDownloadingInvoiceId(null);
      setDownloadProgress(0);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedInvoiceId || !emailRecipient) return;
    
    try {
      messageApi.loading({ content: 'Sending email...', key: 'email' });
      
      // Make sure we're sending the exact payload format that the API expects
      await shareViaEmail({
        id: selectedInvoiceId,
        email: emailRecipient,
        message: emailMessage || undefined  // Only send if there's actually a message
      }).unwrap();
      
      messageApi.success({ content: 'Invoice sent via email successfully', key: 'email' });
      setEmailModalVisible(false);
      setEmailRecipient('');
      setEmailMessage('');
      setSelectedInvoiceId(null);
    } catch (error) {
      console.error('Email error:', error);
      messageApi.error({ content: 'Failed to send invoice via email', key: 'email' });
    }
  };

  const openEmailModal = (id: string) => {
    setSelectedInvoiceId(id);
    setEmailModalVisible(true);
  };

  const resetFilters = () => {
    setSearchText('');
    setStatusFilter(null);
    setExhibitionFilter(null);
    setDateRange(null);
  };

  const columns = [
    {
      title: 'Invoice #',
      dataIndex: ['invoiceNumber'],
      key: 'invoiceNumber',
      sorter: true,
      sortOrder: sortField === 'invoiceNumber' ? sortOrder : null,
      render: (invoiceNumber: string, record: any) => (
        <a onClick={() => navigate(`/invoice/${record._id}`)}>
          {invoiceNumber || 'N/A'}
        </a>
      ),
    },
    {
      title: 'Company',
      dataIndex: ['bookingId', 'companyName'],
      key: 'companyName',
      sorter: true,
      sortOrder: sortField === 'companyName' ? sortOrder : null,
      render: (companyName: string) => companyName || 'N/A',
    },
    {
      title: 'Exhibition',
      dataIndex: ['bookingId', 'exhibitionId', 'name'],
      key: 'exhibitionName',
      sorter: true,
      sortOrder: sortField === 'exhibitionName' ? sortOrder : null,
      render: (name: string, record: any) => (
        <a onClick={() => navigate(`/exhibition/${record.bookingId.exhibitionId._id}`)}>
          {name}
        </a>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      sortOrder: sortField === 'amount' ? sortOrder : null,
      render: (amount: number) => `₹${amount.toLocaleString('en-IN')}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      sortOrder: sortField === 'status' ? sortOrder : null,
      render: (status: string) => (
        <Tag color={
          status === 'paid' ? 'green' :
          status === 'pending' ? 'gold' :
          status === 'cancelled' ? 'red' :
          'blue'
        }>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: true,
      sortOrder: sortField === 'dueDate' ? sortOrder : null,
      render: (date: string) => date ? dayjs(date).format('DD MMM YYYY') : 'N/A',
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortOrder: sortField === 'createdAt' ? sortOrder : null,
      render: (date: string) => dayjs(date).format('DD MMM YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Space>
            <Tooltip title="View Invoice">
              <Button 
                type="text" 
                icon={<EyeOutlined />} 
                onClick={() => navigate(`/invoice/${record._id}`)}
              />
            </Tooltip>
            <Tooltip title="Download">
              <Button 
                type="text" 
                icon={<DownloadOutlined />} 
                onClick={() => handleDownload(record._id)}
                loading={downloadingInvoiceId === record._id && downloadProgress < 100}
                disabled={downloadingInvoiceId !== null && downloadingInvoiceId !== record._id}
              />
            </Tooltip>
            <Tooltip title="Email">
              <Button 
                type="text" 
                icon={<MailOutlined />} 
                onClick={() => openEmailModal(record._id)}
                disabled={downloadingInvoiceId !== null}
              />
            </Tooltip>
          </Space>
          {downloadingInvoiceId === record._id && (
            <Progress 
              percent={downloadProgress} 
              size="small" 
              status="active" 
              style={{ marginBottom: 0, marginTop: 4 }}
            />
          )}
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter && sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order || 'descend');
    }
  };

  return (
    <App>
      {contextHolder}
      <div className="invoice-list-container">
        <Card>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={2} style={{ margin: 0 }}>Invoices</Title>
              <Space>
                <Tooltip title="Refresh">
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={() => refetch()}
                    loading={isLoading}
                  />
                </Tooltip>
              </Space>
            </div>
            
            <Card size="small" title={<Space><FilterOutlined /> Filters</Space>}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ minWidth: '200px', flex: 1 }}>
                  <Text strong>Search</Text>
                  <Input
                    placeholder="Search by invoice #, company..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    prefix={<SearchOutlined />}
                    allowClear
                  />
                </div>
                
                <div style={{ minWidth: '150px' }}>
                  <Text strong>Status</Text>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Filter by status"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    allowClear
                  >
                    <Option value="pending">Pending</Option>
                    <Option value="paid">Paid</Option>
                    <Option value="cancelled">Cancelled</Option>
                  </Select>
                </div>
                
                <div style={{ minWidth: '200px' }}>
                  <Text strong>Exhibition</Text>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Filter by exhibition"
                    value={exhibitionFilter}
                    onChange={setExhibitionFilter}
                    loading={exhibitionsLoading}
                    allowClear
                  >
                    {exhibitions.map(exhibition => (
                      <Option key={exhibition._id || exhibition.id} value={exhibition._id || exhibition.id}>
                        {exhibition.name}
                      </Option>
                    ))}
                  </Select>
                </div>
                
                <div style={{ minWidth: '300px' }}>
                  <Text strong>Date Range</Text>
                  <RangePicker 
                    style={{ width: '100%' }}
                    value={dateRange}
                    onChange={setDateRange}
                  />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Button 
                    icon={<ClearOutlined />} 
                    onClick={resetFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Card>
            
            <Table
              columns={columns}
              dataSource={filteredInvoices}
              rowKey="_id"
              loading={isLoading}
              pagination={{
                current: page,
                pageSize: pageSize,
                total: invoiceData?.pagination?.total || 0,
                onChange: (page, pageSize) => {
                  setPage(page);
                  if (pageSize) setPageSize(pageSize);
                },
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} invoices`,
              }}
              onChange={handleTableChange}
            />
          </Space>
        </Card>
        
        <Modal
          title="Send Invoice via Email"
          open={emailModalVisible}
          onCancel={() => setEmailModalVisible(false)}
          onOk={handleSendEmail}
          okText="Send"
          confirmLoading={isEmailSending}
        >
          <div style={{ marginBottom: 16 }}>
            <Text strong>Email Address</Text>
            <Input
              placeholder="Enter recipient email"
              value={emailRecipient}
              onChange={(e) => setEmailRecipient(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <Text strong>Message (Optional)</Text>
            <Input.TextArea
              placeholder="Enter optional message"
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              rows={4}
            />
          </div>
        </Modal>
      </div>
    </App>
  );
};

export default InvoiceList; 