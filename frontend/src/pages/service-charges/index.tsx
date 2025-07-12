import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  Modal,
  Form,
  message,
  Drawer,
  Statistic,
  Row,
  Col,
  Typography,
  Tabs,
  Dropdown,
  MenuProps
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  SettingOutlined,
  FileTextOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined as WarningOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import './ServiceCharges.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ServiceCharge {
  _id: string;
  receiptNumber: string;
  vendorName: string;
  vendorPhone: string;
  companyName: string;
  exhibitorCompanyName?: string;
  stallNumber?: string;
  stallArea?: number; // Add stall area field
  uploadedImage?: string;
  serviceType: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: 'submitted' | 'paid' | 'completed' | 'cancelled';
  paidAt?: string;
  createdAt: string;
  updatedAt?: string;
  exhibitionId: {
    _id: string;
    name: string;
    venue: string;
    startDate?: string;
    endDate?: string;
  };
  adminNotes?: string;
  receiptGenerated: boolean;
  receiptPath?: string;
  // PhonePe fields
  phonePeOrderId?: string;
  phonePeTransactionId?: string;
  phonePeMerchantTransactionId?: string;
}

interface ServiceChargeStats {
  totalCharges: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paidCount: number;
  pendingCount: number;
  // GST breakdown
  totalGSTAmount?: number;
  paidGSTAmount?: number;
  pendingGSTAmount?: number;
}

interface Filters {
  exhibitionId?: string;
  paymentStatus?: string;
  status?: string;
  serviceType?: string;
  search?: string;
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
}

// GST calculation utilities (assuming 18% GST rate)
const GST_RATE = 18;

const calculateGSTFromInclusive = (inclusiveAmount: number) => {
  // GST Amount = (Inclusive Amount * GST_RATE) / (100 + GST_RATE)
  return Math.round((inclusiveAmount * GST_RATE) / (100 + GST_RATE));
};

const calculateBaseAmountFromInclusive = (inclusiveAmount: number) => {
  // Base Amount = Inclusive Amount - GST Amount
  return inclusiveAmount - calculateGSTFromInclusive(inclusiveAmount);
};

const ServiceChargesPage: React.FC = () => {
  const [serviceCharges, setServiceCharges] = useState<ServiceCharge[]>([]);
  const [stats, setStats] = useState<ServiceChargeStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState<Filters>({});
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [selectedServiceCharge, setSelectedServiceCharge] = useState<ServiceCharge | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteAllModalVisible, setDeleteAllModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Fetch exhibitions for filter dropdown
  useEffect(() => {
    fetchExhibitions();
  }, []);

  // Fetch service charges when component mounts or filters change
  useEffect(() => {
    fetchServiceCharges();
    fetchStats();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchExhibitions = async () => {
    try {
      const response = await fetch('/api/exhibitions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setExhibitions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
    }
  };

  const fetchServiceCharges = async () => {
    setLoading(true);
    try {
      const queryParams: Record<string, string> = {
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
      };

      // Add defined filter values
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && key !== 'dateRange') {
          queryParams[key] = String(value);
        }
      });

      // Add date range if present
      if (filters.dateRange) {
        queryParams.startDate = filters.dateRange[0].toISOString();
        queryParams.endDate = filters.dateRange[1].toISOString();
      }

      const params = new URLSearchParams(queryParams);

      const response = await fetch(`/api/service-charges?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setServiceCharges(data.data || []);
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0
        }));
      } else {
        message.error('Failed to fetch service charges');
      }
    } catch (error) {
      console.error('Error fetching service charges:', error);
      message.error('Error fetching service charges');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const queryParams: Record<string, string> = { period: 'all' };
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && key !== 'dateRange') {
          queryParams[key] = String(value);
        }
      });

      const params = new URLSearchParams(queryParams);

      const response = await fetch(`/api/service-charges/stats?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data?.overview || null);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusUpdate = async (values: any) => {
    if (!selectedServiceCharge) return;

    try {
      const response = await fetch(`/api/service-charges/${selectedServiceCharge._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        message.success('Status updated successfully');
        setStatusModalVisible(false);
        fetchServiceCharges();
        fetchStats();
      } else {
        message.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Error updating status');
    }
  };

  const handleExport = async () => {
    try {
      message.loading('Preparing export...', 0);
      
      const queryParams: Record<string, string> = {
        export: 'true',
        limit: '10000' // Export all records
      };
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && key !== 'dateRange') {
          queryParams[key] = String(value);
        }
      });

      if (filters.dateRange) {
        queryParams.startDate = filters.dateRange[0].toISOString();
        queryParams.endDate = filters.dateRange[1].toISOString();
      }

      const params = new URLSearchParams(queryParams);

      const response = await fetch(`/api/service-charges?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      message.destroy();

      if (response.ok) {
        const data = await response.json();
        const serviceCharges = data.data || [];
        
        if (serviceCharges.length === 0) {
          message.warning('No data to export');
          return;
        }

        // Define CSV headers matching the table columns
        const csvHeaders = [
          'Receipt Number',
          'Vendor Name',
          'Company Name',
          'Exhibitor Company',
          'Mobile',
          'Uploaded Image',
          'Stall Number',
          'Stall Area (sqm)',
          'Base Amount (₹) - Excl. GST',
          'GST Amount (₹) - 18%',
          'Total Amount (₹) - Incl. GST',
          'Payment Status',
          'Status',
          'Created Date',
          'Created Time',
          'Paid Date',
          'Paid Time',
          'Admin Notes'
        ];

        // Convert service charges to CSV rows
        const csvRows = serviceCharges.map((charge: ServiceCharge) => {
          const baseAmount = calculateBaseAmountFromInclusive(charge.amount);
          const gstAmount = calculateGSTFromInclusive(charge.amount);
          
          return [
            charge.receiptNumber,
            charge.vendorName,
            charge.companyName,
            charge.exhibitorCompanyName || '',
            charge.vendorPhone,
            charge.uploadedImage ? 
              (charge.uploadedImage.toLowerCase().includes('heic') ? 
                `HEIC Image (converted): ${charge.uploadedImage}` : 
                `Image: ${charge.uploadedImage}`) : 
              'No image',
            charge.stallNumber || '',
            charge.stallArea || '',
            baseAmount,
            gstAmount,
            charge.amount,
            charge.paymentStatus.toUpperCase(),
            charge.status.toUpperCase(),
            dayjs(charge.createdAt).format('DD/MM/YYYY'),
            dayjs(charge.createdAt).format('HH:mm:ss'),
            charge.paidAt ? dayjs(charge.paidAt).format('DD/MM/YYYY') : '',
            charge.paidAt ? dayjs(charge.paidAt).format('HH:mm:ss') : '',
            charge.adminNotes || ''
          ];
        });

        // Escape and quote CSV values
        const escapeCSV = (value: any) => {
          const str = String(value || '');
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };

        const csvContent = [
          csvHeaders.map(escapeCSV).join(','),
          ...csvRows.map((row: any[]) => row.map(escapeCSV).join(','))
        ].join('\n');

        // Add BOM for proper Excel encoding
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `service-charges-${dayjs().format('YYYY-MM-DD-HHmm')}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        message.success(`Export completed! ${serviceCharges.length} records exported.`);
      } else {
        message.error('Failed to export data');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      message.destroy();
      message.error('Error exporting data');
    }
  };

  const handleDownloadReceipt = async (serviceChargeId: string, receiptNumber?: string) => {
    try {
      message.loading({ content: 'Preparing receipt for download...', key: 'receipt-download' });
      
      const response = await fetch(`/api/service-charges/${serviceChargeId}/receipt`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Receipt-${receiptNumber || serviceChargeId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        message.success({ content: 'Receipt downloaded successfully', key: 'receipt-download' });
      } else {
        const errorText = await response.text();
        let errorMessage = 'Failed to download receipt';
        
        if (response.status === 404) {
          errorMessage = 'Receipt not found or not yet generated';
        } else if (response.status === 403) {
          errorMessage = 'Access denied - insufficient permissions';
        }
        
        message.error({ content: errorMessage, key: 'receipt-download' });
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      message.error({ content: 'Network error - please try again', key: 'receipt-download' });
    }
  };

  const handleDeleteServiceCharge = async () => {
    if (!selectedServiceCharge) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/service-charges/${selectedServiceCharge._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        message.success('Service charge deleted successfully');
        setDeleteModalVisible(false);
        setSelectedServiceCharge(null);
        
        // Refresh data
        fetchServiceCharges();
        fetchStats();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to delete service charge');
      }
    } catch (error) {
      console.error('Error deleting service charge:', error);
      message.error('Error deleting service charge');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteAllServiceCharges = async () => {
    setDeleteLoading(true);
    try {
      const response = await fetch('/api/service-charges', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        message.success(data.message || 'All service charges deleted successfully');
        setDeleteAllModalVisible(false);
        
        // Refresh data
        fetchServiceCharges();
        fetchStats();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to delete service charges');
      }
    } catch (error) {
      console.error('Error deleting all service charges:', error);
      message.error('Error deleting service charges');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'green';
      case 'pending':
      case 'submitted':
        return 'orange';
      case 'cancelled':
      case 'failed':
        return 'red';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'green';
      case 'pending':
        return 'orange';
      case 'failed':
        return 'red';
      case 'refunded':
        return 'purple';
      default:
        return 'default';
    }
  };

  const actionItems: MenuProps['items'] = [
    {
      key: 'view',
      label: 'View Details',
      icon: <EyeOutlined />,
    },
    {
      key: 'status',
      label: 'Update Status',
      icon: <EditOutlined />,
    },
    {
      key: 'receipt',
      label: 'Download Receipt',
      icon: <FileTextOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const handleActionClick = (key: string, record: ServiceCharge) => {
    switch (key) {
      case 'view':
        setSelectedServiceCharge(record);
        setDetailsVisible(true);
        break;
      case 'status':
        setSelectedServiceCharge(record);
        setStatusModalVisible(true);
        form.setFieldsValue({
          status: record.status,
          adminNotes: record.adminNotes
        });
        break;
      case 'receipt':
        handleDownloadReceipt(record._id, record.receiptNumber);
        break;
      case 'delete':
        setSelectedServiceCharge(record);
        setDeleteModalVisible(true);
        break;
    }
  };

  const columns = [
    {
      title: 'Receipt #',
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      width: 140,
      fixed: 'left' as const,
      render: (text: string) => (
        <Text strong copyable style={{ fontSize: '15px' }}>{text}</Text>
      )
    },
    {
      title: 'Vendor Details',
      key: 'vendor',
      width: 180,
      render: (record: ServiceCharge) => (
        <div style={{ lineHeight: '1.3' }}>
          <div><Text strong style={{ fontSize: '13px' }}>{record.vendorName}</Text></div>
          <div><Text type="secondary" style={{ fontSize: '12px' }}>{record.companyName}</Text></div>
        </div>
      )
    },
    {
      title: 'Exhibitor Company',
      key: 'exhibitorCompany',
      width: 160,
      render: (record: ServiceCharge) => (
        <div style={{ lineHeight: '1.3' }}>
          {record.exhibitorCompanyName ? (
            <Text strong style={{ fontSize: '13px', color: '#1890ff' }}>
              {record.exhibitorCompanyName}
            </Text>
          ) : (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              -
            </Text>
          )}
        </div>
      )
    },
    {
      title: 'Image',
      key: 'uploadedImage',
      width: 80,
      align: 'center' as const,
      render: (record: ServiceCharge) => {
        if (!record.uploadedImage) {
          return <Text type="secondary" style={{ fontSize: '12px' }}>No image</Text>;
        }
        
        const imageUrl = `/api/public/uploads/${record.uploadedImage}`;
        const wasHeicFile = record.uploadedImage.toLowerCase().includes('heic');
        
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={imageUrl}
              alt="Service charge attachment"
              className="service-charge-image"
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'cover',
                borderRadius: '4px',
                border: '1px solid #d9d9d9'
              }}
              onClick={() => {
                // Open image in new tab for full view
                window.open(imageUrl, '_blank');
              }}
              onError={(e) => {
                // Handle broken image
                const target = e.target as HTMLImageElement;
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="service-charge-image-error">❌</div>';
                }
              }}
              onLoad={(e) => {
                // Add a subtle success indicator
                const target = e.target as HTMLImageElement;
                target.style.border = '1px solid #52c41a';
              }}
              title={wasHeicFile ? 
                "Originally HEIC, converted to JPEG - Click to view full size" : 
                "Click to view full size"}
            />
          </div>
        );
      }
    },
    {
      title: 'Mobile',
      dataIndex: 'vendorPhone',
      key: 'mobile',
      width: 120,
      align: 'center' as const, 
      render: (phone: string) => (
        <Text style={{ fontSize: '15px', fontFamily: 'monospace' }}>{phone}</Text>
      )
    },
    {
      title: 'Stall No.',
      dataIndex: 'stallNumber',
      key: 'stallNumber',
      width: 100,
      align: 'center' as const,
      render: (text: string) => (
        <Tag color="blue" style={{ fontSize: '13px', margin: 0 }}>{text}</Tag>
      )
    },
    {
      title: 'Stall Area',
      dataIndex: 'stallArea',
      key: 'stallArea',
      width: 100,
      align: 'center' as const,
      render: (stallArea: number) => (
        stallArea ? (
          <div style={{ lineHeight: '1.2' }}>
            <Text strong style={{ fontSize: '13px', color: '#52c41a' }}>
              {stallArea} sqm
            </Text>
            <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
              {stallArea <= 50 ? 'Small' : 'Large'}
            </div>
          </div>
        ) : (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            -
          </Text>
        )
      )
    },
    {
      title: 'Transaction ID',
      key: 'transactionId',
      width: 160,
      align: 'center' as const,
      render: (record: ServiceCharge) => {
        // Show PhonePe Transaction ID if payment is completed
        if (record.phonePeTransactionId && record.paymentStatus === 'paid') {
          return (
            <div style={{ lineHeight: '1.2' }}>
              <Text 
                copyable 
                style={{ 
                  fontSize: '12px', 
                  fontFamily: 'monospace',
                  color: '#52c41a',
                  fontWeight: 500
                }}
                title="PhonePe Transaction ID - Click to copy"
              >
                {record.phonePeTransactionId}
              </Text>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                PhonePe TXN
              </div>
            </div>
          );
        }
        
        // Show Merchant Transaction ID for pending/failed payments
        if (record.phonePeMerchantTransactionId) {
          return (
            <div style={{ lineHeight: '1.2' }}>
              <Text 
                copyable 
                style={{ 
                  fontSize: '12px', 
                  fontFamily: 'monospace',
                  color: '#1890ff',
                  fontWeight: 500
                }}
                title="Merchant Transaction ID - Click to copy"
              >
                {record.phonePeMerchantTransactionId}
              </Text>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                Merchant ID
              </div>
            </div>
          );
        }
        
        // No transaction ID available
        return (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            -
          </Text>
        );
      }
    },
    {
      title: 'Base Amount',
      dataIndex: 'amount',
      key: 'baseAmount',
      width: 110,
      align: 'center' as const,
      render: (amount: number) => {
        const baseAmount = calculateBaseAmountFromInclusive(amount);
        return (
          <div style={{ lineHeight: '1.2' }}>
            <Text strong style={{ fontSize: '13px', color: '#1890ff' }}>₹{baseAmount.toLocaleString('en-IN')}</Text>
            <div style={{ fontSize: '9px', color: '#666', marginTop: '2px' }}>
              (Excl. GST)
            </div>
          </div>
        );
      }
    },
    {
      title: 'GST Amount',
      dataIndex: 'amount',
      key: 'gstAmount',
      width: 100,
      align: 'center' as const,
      render: (amount: number) => {
        const gstAmount = calculateGSTFromInclusive(amount);
        return (
          <div style={{ lineHeight: '1.2' }}>
            <Text strong style={{ fontSize: '13px', color: '#f5222d' }}>₹{gstAmount.toLocaleString('en-IN')}</Text>
            <div style={{ fontSize: '9px', color: '#666', marginTop: '2px' }}>
              ({GST_RATE}% GST)
            </div>
          </div>
        );
      }
    },
    {
      title: 'Total Amount',
      dataIndex: 'amount',
      key: 'totalAmount',
      width: 110,
      align: 'center' as const,
      render: (amount: number) => (
        <div style={{ lineHeight: '1.2' }}>
          <Text strong style={{ fontSize: '15px', color: '#52c41a' }}>₹{amount.toLocaleString('en-IN')}</Text>
          <div style={{ fontSize: '9px', color: '#666', marginTop: '2px' }}>
            (Incl. GST)
          </div>
        </div>
      )
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 120,
      align: 'center' as const,
      render: (status: string) => (
        <Tag color={getPaymentStatusColor(status)} style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      align: 'center' as const,
      render: (status: string) => (
        <Tag color={getStatusColor(status)} style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      width: 100,
      align: 'center' as const,
      render: (date: string) => (
        <div style={{ lineHeight: '1.2' }}>
          <div style={{ fontSize: '13px', fontWeight: 500 }}>
            <CalendarOutlined style={{ marginRight: 4, color: '#1890ff' }} />
            {dayjs(date).format('DD/MM/YY')}
          </div>
        </div>
      )
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'time',
      width: 90,
      align: 'center' as const,
      render: (date: string) => (
        <div style={{ fontSize: '13px', color: '#666' }}>
          <FieldTimeOutlined style={{ marginRight: 4 }} />
          {dayjs(date).format('HH:mm')}
        </div>
      )
    },
    {
      title: 'Paid At',
      dataIndex: 'paidAt',
      key: 'paidAt',
      width: 100,
      align: 'center' as const,
      render: (paidAt: string | undefined, record: ServiceCharge) => {
        if (!paidAt || record.paymentStatus !== 'paid') {
          return <Text type="secondary" style={{ fontSize: '13px' }}>-</Text>;
        }
        return (
          <div style={{ lineHeight: '1.2' }}>
            <div style={{ fontSize: '13px', color: '#52c41a', fontWeight: 500 }}>
              {dayjs(paidAt).format('DD/MM/YY')}
            </div>
            <div style={{ fontSize: '10px', color: '#52c41a' }}>
              {dayjs(paidAt).format('HH:mm')}
            </div>
          </div>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (record: ServiceCharge) => (
        <Dropdown
          menu={{
            items: actionItems,
            onClick: ({ key }) => handleActionClick(key, record)
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button 
            type="text" 
            size="small" 
            icon={<MoreOutlined />}
            style={{ 
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #d9d9d9',
              backgroundColor: '#fafafa'
            }}
          />
        </Dropdown>
      )
    }
  ];

  return (
    <div className="service-charges-page">
      <div className="page-header">
        <Title level={2}>Service Charges</Title>
        <Space>
          <Input
            placeholder="Search by receipt, vendor, company, mobile, stall no."
            prefix={<SearchOutlined />}
            style={{ width: 350 }}
            value={filters.search || ''}
            onChange={(e) => {
              const searchValue = e.target.value;
              setFilters(prev => ({ ...prev, search: searchValue }));
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
            allowClear
          />
          <Button
            icon={<FilterOutlined />}
            onClick={() => setFilterDrawerVisible(true)}
          >
            Filters
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            type="primary"
          >
            Export
          </Button>
          <Button
            icon={<SettingOutlined />}
            onClick={() => navigate('/service-charges/settings')}
          >
            Settings
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => setDeleteAllModalVisible(true)}
            danger
            disabled={!stats || stats.totalCharges === 0}
          >
            Delete All
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <Row gutter={16} className="stats-row">
          <Col span={4}>
            <Card>
              <Statistic
                title="Total Charges"
                value={stats.totalCharges}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card>
              <Statistic
                title="Total Amount"
                value={stats.totalAmount}
                prefix={<DollarOutlined />}
                formatter={(value) => `₹${value?.toLocaleString('en-IN')}`}
              />
              <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                (Inclusive of GST)
              </div>
            </Card>
          </Col>
          <Col span={5}>
            <Card>
              <Statistic
                title="Total GST"
                value={stats.totalGSTAmount || calculateGSTFromInclusive(stats.totalAmount || 0)}
                prefix={<span style={{ color: '#f5222d' }}>📊</span>}
                formatter={(value) => `₹${value?.toLocaleString('en-IN')}`}
                valueStyle={{ color: '#f5222d' }}
              />
              <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                ({GST_RATE}% GST Amount)
              </div>
            </Card>
          </Col>
          <Col span={5}>
            <Card>
              <Statistic
                title="Paid Amount"
                value={stats.paidAmount}
                prefix={<CheckCircleOutlined />}
                formatter={(value) => `₹${value?.toLocaleString('en-IN')}`}
                valueStyle={{ color: '#3f8600' }}
              />
              <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                (Inclusive of GST)
              </div>
            </Card>
          </Col>
          <Col span={5}>
            <Card>
              <Statistic
                title="Pending Amount"
                value={stats.pendingAmount}
                prefix={<ClockCircleOutlined />}
                formatter={(value) => `₹${value?.toLocaleString('en-IN')}`}
                valueStyle={{ color: '#cf1322' }}
              />
              <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                (Inclusive of GST)
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* GST Breakdown Row */}
      {stats && (
        <Row gutter={16} className="stats-row" style={{ marginTop: '16px' }}>
          <Col span={8}>
            <Card style={{ background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)', border: '1px solid #91d5ff' }}>
              <Statistic
                title="Total Base Amount"
                value={calculateBaseAmountFromInclusive(stats.totalAmount || 0)}
                prefix={<span style={{ color: '#1890ff' }}>💰</span>}
                formatter={(value) => `₹${value?.toLocaleString('en-IN')}`}
                valueStyle={{ color: '#1890ff' }}
              />
              <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                (Exclusive of GST)
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)', border: '1px solid #b7eb8f' }}>
              <Statistic
                title="Paid GST Amount"
                value={calculateGSTFromInclusive(stats.paidAmount || 0)}
                prefix={<span style={{ color: '#52c41a' }}>✅</span>}
                formatter={(value) => `₹${value?.toLocaleString('en-IN')}`}
                valueStyle={{ color: '#52c41a' }}
              />
              <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                (Collected GST)
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ background: 'linear-gradient(135deg, #fff2e8 0%, #ffd8bf 100%)', border: '1px solid #ffbb96' }}>
              <Statistic
                title="Pending GST Amount"
                value={calculateGSTFromInclusive(stats.pendingAmount || 0)}
                prefix={<span style={{ color: '#fa8c16' }}>⏳</span>}
                formatter={(value) => `₹${value?.toLocaleString('en-IN')}`}
                valueStyle={{ color: '#fa8c16' }}
              />
              <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                (Pending GST)
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Main Table */}
      <Card className="service-charges-table-card">
        <Table
          columns={columns}
          dataSource={serviceCharges}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || 10
              }));
            }
          }}
          scroll={{ 
            x: 1560, // Increased width to accommodate Transaction ID and Exhibitor Company columns
            y: 'calc(100vh - 380px)' // Dynamic height based on viewport
          }}
          size="middle"
          bordered
          className="modern-table"
          rowClassName={(record, index) => 
            index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
          }
        />
      </Card>

      {/* Filter Drawer */}
      <Drawer
        title="Filters"
        placement="right"
        open={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        width={400}
      >
        <Form
          layout="vertical"
          onFinish={(values) => {
            setFilters(values);
            setFilterDrawerVisible(false);
            setPagination(prev => ({ ...prev, current: 1 }));
          }}
          initialValues={filters}
        >
          <Form.Item name="exhibitionId" label="Exhibition">
            <Select placeholder="Select exhibition" allowClear>
              {exhibitions.map(exhibition => (
                <Option key={exhibition._id} value={exhibition._id}>
                  {exhibition.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="paymentStatus" label="Payment Status">
            <Select placeholder="Select payment status" allowClear>
              <Option value="pending">Pending</Option>
              <Option value="paid">Paid</Option>
              <Option value="failed">Failed</Option>
              <Option value="refunded">Refunded</Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select placeholder="Select status" allowClear>
              <Option value="submitted">Submitted</Option>
              <Option value="paid">Paid</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Form.Item>

          <Form.Item name="serviceType" label="Service Type">
            <Select placeholder="Select service type" allowClear>
              <Option value="positioning">Positioning</Option>
              <Option value="setup">Setup</Option>
              <Option value="maintenance">Maintenance</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="search" label="Search">
            <Input placeholder="Search by receipt, vendor, company, mobile, stall no." />
          </Form.Item>

          <Form.Item name="dateRange" label="Date Range">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Apply Filters
              </Button>
              <Button onClick={() => {
                setFilters({});
                setFilterDrawerVisible(false);
                setPagination(prev => ({ ...prev, current: 1 }));
              }}>
                Clear
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>

      {/* Status Update Modal */}
      <Modal
        title="Update Status"
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleStatusUpdate}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              <Option value="submitted">Submitted</Option>
              <Option value="paid">Paid</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Form.Item>

          <Form.Item name="adminNotes" label="Admin Notes">
            <Input.TextArea rows={4} placeholder="Add notes..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Status
              </Button>
              <Button onClick={() => setStatusModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Details Modal */}
      <Modal
        title="Service Charge Details"
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsVisible(false)}>
            Close
          </Button>,
          <Button 
            key="download" 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={() => selectedServiceCharge && handleDownloadReceipt(selectedServiceCharge._id, selectedServiceCharge.receiptNumber)}
            disabled={!selectedServiceCharge?.receiptGenerated}
          >
            {selectedServiceCharge?.receiptGenerated ? 'Download Receipt' : 'Receipt Not Available'}
          </Button>
        ]}
        width={800}
      >
        {selectedServiceCharge && (
          <div className="service-charge-details">
            <Tabs>
              <TabPane tab="Basic Info" key="basic">
                <Row gutter={24}>
                  <Col span={12}>
                    <p><strong>Receipt Number:</strong> {selectedServiceCharge.receiptNumber}</p>
                    <p><strong>Vendor Name:</strong> {selectedServiceCharge.vendorName}</p>
                    <p><strong>Company:</strong> {selectedServiceCharge.companyName}</p>
                    {selectedServiceCharge.exhibitorCompanyName && (
                      <p><strong>Exhibitor Company:</strong> <span style={{ color: '#1890ff' }}>{selectedServiceCharge.exhibitorCompanyName}</span></p>
                    )}
                    <p><strong>Phone:</strong> {selectedServiceCharge.vendorPhone}</p>
                    {selectedServiceCharge.stallNumber && (
                      <p><strong>Stall Number:</strong> {selectedServiceCharge.stallNumber}</p>
                    )}
                    <p><strong>Exhibition:</strong> {selectedServiceCharge.exhibitionId.name}</p>
                    <p><strong>Venue:</strong> {selectedServiceCharge.exhibitionId.venue}</p>
                  </Col>
                  <Col span={12}>
                    <p><strong>Service Type:</strong> {selectedServiceCharge.serviceType}</p>
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ marginBottom: '8px' }}><strong>Amount Breakdown:</strong></p>
                      <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '6px', border: '1px solid #e8e8e8' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span>Base Amount:</span>
                          <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                            ₹{calculateBaseAmountFromInclusive(selectedServiceCharge.amount).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span>GST ({GST_RATE}%):</span>
                          <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
                            ₹{calculateGSTFromInclusive(selectedServiceCharge.amount).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div style={{ borderTop: '1px solid #d9d9d9', paddingTop: '4px', marginTop: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 'bold' }}>Total Amount:</span>
                            <span style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '16px' }}>
                              ₹{selectedServiceCharge.amount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p><strong>Created:</strong> {dayjs(selectedServiceCharge.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                    {selectedServiceCharge.paidAt && (
                      <p><strong>Paid At:</strong> {dayjs(selectedServiceCharge.paidAt).format('DD/MM/YYYY HH:mm')}</p>
                    )}
                    
                    <div style={{ marginTop: '20px' }}>
                      <p><strong>Uploaded Image:</strong></p>
                      {selectedServiceCharge.uploadedImage ? (
                        <div style={{ marginTop: '10px' }}>
                          <img
                            src={`/api/public/uploads/${selectedServiceCharge.uploadedImage}`}
                            alt="Service charge attachment"
                            className="service-charge-image-preview"
                            style={{
                              maxWidth: '250px',
                              maxHeight: '250px',
                              objectFit: 'contain',
                              border: '1px solid #d9d9d9',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'block',
                              transition: 'all 0.2s ease-in-out'
                            }}
                            onClick={() => {
                              window.open(`/api/public/uploads/${selectedServiceCharge.uploadedImage}`, '_blank');
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div style="
                                    color: #ff4d4f; 
                                    padding: 20px; 
                                    border: 1px dashed #ff4d4f; 
                                    border-radius: 6px; 
                                    text-align: center;
                                    background-color: #fff2f0;
                                    font-size: 14px;
                                  ">
                                    ❌ Image could not be loaded<br/>
                                    <small style="font-size: 12px; opacity: 0.8;">File may have been moved or deleted</small>
                                  </div>
                                `;
                              }
                            }}
                            onLoad={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.border = '1px solid #52c41a';
                            }}
                            onMouseEnter={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.transform = 'scale(1.02)';
                              target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.transform = 'scale(1)';
                              target.style.boxShadow = 'none';
                            }}
                          />
                          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px', textAlign: 'center' }}>
                            📱 Click to view full size
                            {selectedServiceCharge.uploadedImage.toLowerCase().includes('heic') && (
                              <span style={{ color: '#1890ff', marginLeft: '8px' }}>
                                (Originally HEIC, converted to JPEG)
                              </span>
                            )}
                          </Text>
                        </div>
                      ) : (
                        <div style={{ 
                          padding: '20px', 
                          border: '1px dashed #d9d9d9', 
                          borderRadius: '4px', 
                          textAlign: 'center',
                          color: '#999',
                          backgroundColor: '#fafafa'
                        }}>
                          📷 No image uploaded
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Status" key="status">
                <Row gutter={16}>
                  <Col span={12}>
                    <p><strong>Payment Status:</strong> 
                      <Tag color={getPaymentStatusColor(selectedServiceCharge.paymentStatus)} style={{ marginLeft: 8 }}>
                        {selectedServiceCharge.paymentStatus.toUpperCase()}
                      </Tag>
                    </p>
                    <p><strong>Status:</strong> 
                      <Tag color={getStatusColor(selectedServiceCharge.status)} style={{ marginLeft: 8 }}>
                        {selectedServiceCharge.status.toUpperCase()}
                      </Tag>
                    </p>
                    <p><strong>Receipt Generated:</strong> 
                      <Tag color={selectedServiceCharge.receiptGenerated ? 'green' : 'orange'} style={{ marginLeft: 8 }}>
                        {selectedServiceCharge.receiptGenerated ? 'Yes' : 'No'}
                      </Tag>
                    </p>
                  </Col>
                  <Col span={12}>
                    {/* Transaction ID Information */}
                    <div style={{ 
                      border: '1px solid #e8e8e8', 
                      borderRadius: '6px', 
                      padding: '12px', 
                      backgroundColor: '#fafafa' 
                    }}>
                      <p style={{ 
                        fontWeight: 600, 
                        marginBottom: '8px', 
                        color: '#1890ff',
                        fontSize: '14px'
                      }}>
                        📊 Transaction Details
                      </p>
                      
                      {selectedServiceCharge.phonePeTransactionId ? (
                        <div style={{ marginBottom: '8px' }}>
                          <Text strong style={{ fontSize: '12px' }}>PhonePe Transaction ID:</Text>
                          <br />
                          <Text 
                            copyable 
                            style={{ 
                              fontFamily: 'monospace', 
                              fontSize: '11px',
                              color: '#52c41a',
                              fontWeight: 500,
                              padding: '2px 4px',
                              backgroundColor: '#f0f9f0',
                              borderRadius: '3px'
                            }}
                          >
                            {selectedServiceCharge.phonePeTransactionId}
                          </Text>
                        </div>
                      ) : null}
                      
                      {selectedServiceCharge.phonePeMerchantTransactionId ? (
                        <div style={{ marginBottom: '8px' }}>
                          <Text strong style={{ fontSize: '12px' }}>Merchant Transaction ID:</Text>
                          <br />
                          <Text 
                            copyable 
                            style={{ 
                              fontFamily: 'monospace', 
                              fontSize: '11px',
                              color: '#1890ff',
                              fontWeight: 500,
                              padding: '2px 4px',
                              backgroundColor: '#f0f7ff',
                              borderRadius: '3px'
                            }}
                          >
                            {selectedServiceCharge.phonePeMerchantTransactionId}
                          </Text>
                        </div>
                      ) : null}
                      
                      {selectedServiceCharge.phonePeOrderId ? (
                        <div style={{ marginBottom: '8px' }}>
                          <Text strong style={{ fontSize: '12px' }}>PhonePe Order ID:</Text>
                          <br />
                          <Text 
                            copyable 
                            style={{ 
                              fontFamily: 'monospace', 
                              fontSize: '11px',
                              color: '#722ed1',
                              fontWeight: 500,
                              padding: '2px 4px',
                              backgroundColor: '#f9f0ff',
                              borderRadius: '3px'
                            }}
                          >
                            {selectedServiceCharge.phonePeOrderId}
                          </Text>
                        </div>
                      ) : null}
                      
                      {!selectedServiceCharge.phonePeTransactionId && 
                       !selectedServiceCharge.phonePeMerchantTransactionId && 
                       !selectedServiceCharge.phonePeOrderId ? (
                        <Text type="secondary" style={{ fontSize: '12px', fontStyle: 'italic' }}>
                          No transaction IDs available yet
                        </Text>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                {selectedServiceCharge.adminNotes && (
                  <div style={{ marginTop: '16px' }}>
                    <p><strong>Admin Notes:</strong></p>
                    <p style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                      {selectedServiceCharge.adminNotes}
                    </p>
                  </div>
                )}
              </TabPane>
            </Tabs>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Service Charge"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={null}
        width={500}
      >
        <div style={{ textAlign: 'center' }}>
          <WarningOutlined style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '20px' }} />
          <h3 style={{ marginBottom: '16px' }}>Are you sure you want to delete this service charge?</h3>
          
          {selectedServiceCharge && (
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '16px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              <p><strong>Receipt Number:</strong> {selectedServiceCharge.receiptNumber}</p>
              <p><strong>Vendor:</strong> {selectedServiceCharge.vendorName}</p>
              <p><strong>Company:</strong> {selectedServiceCharge.companyName}</p>
              <p><strong>Amount:</strong> ₹{selectedServiceCharge.amount.toLocaleString('en-IN')}</p>
              <p><strong>Status:</strong> {selectedServiceCharge.status}</p>
            </div>
          )}
          
          <div style={{ color: '#ff4d4f', marginBottom: '20px' }}>
            <p><strong>⚠️ Warning:</strong></p>
            <p>This action cannot be undone. The service charge record and associated receipt will be permanently deleted.</p>
          </div>
          
          <Space>
            <Button onClick={() => setDeleteModalVisible(false)}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              danger 
              loading={deleteLoading}
              onClick={handleDeleteServiceCharge}
              icon={<DeleteOutlined />}
            >
              Delete Service Charge
            </Button>
          </Space>
        </div>
      </Modal>

      {/* Delete All Confirmation Modal */}
      <Modal
        title="Delete All Service Charges"
        open={deleteAllModalVisible}
        onCancel={() => setDeleteAllModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ textAlign: 'center' }}>
          <WarningOutlined style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '20px' }} />
          <h3 style={{ marginBottom: '16px' }}>Are you sure you want to delete ALL service charges?</h3>
          
          {stats && (
            <div style={{ 
              backgroundColor: '#fff2f0', 
              border: '1px solid #ffccc7',
              padding: '16px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              <p><strong>Total Service Charges:</strong> {stats.totalCharges}</p>
              <p><strong>Total Amount:</strong> ₹{stats.totalAmount.toLocaleString('en-IN')}</p>
              <p><strong>Paid Amount:</strong> ₹{stats.paidAmount.toLocaleString('en-IN')}</p>
              <p><strong>Pending Amount:</strong> ₹{stats.pendingAmount.toLocaleString('en-IN')}</p>
            </div>
          )}
          
          <div style={{ color: '#ff4d4f', marginBottom: '20px' }}>
            <p><strong>🚨 DANGER ZONE:</strong></p>
            <p>This action cannot be undone. ALL service charge records and associated receipts will be permanently deleted.</p>
            <p>This includes both paid and pending service charges.</p>
          </div>
          
          <Space>
            <Button onClick={() => setDeleteAllModalVisible(false)}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              danger 
              loading={deleteLoading}
              onClick={handleDeleteAllServiceCharges}
              icon={<DeleteOutlined />}
            >
              Delete All Service Charges
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default ServiceChargesPage; 