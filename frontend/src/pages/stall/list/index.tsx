import React, { useEffect, useState, useMemo } from 'react';
import { Card, Table, Space, Input, Typography, Row, Col, Select, message, Tag, Statistic, Button, Modal, Tooltip } from 'antd';
import { SearchOutlined, FilterOutlined, LayoutOutlined, ApartmentOutlined, DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchExhibition, fetchHalls, fetchStalls } from '../../../store/slices/exhibitionSlice';
import exhibitionService from '../../../services/exhibition';
import { calculateStallArea } from '../../../utils/stallUtils';
import '../../dashboard/Dashboard.css';

const { Title, Text } = Typography;
const { Option } = Select;

const StallList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Get data from Redux store
  const { stalls: reduxStalls, loading: reduxLoading, stallsPagination } = useSelector((state: RootState) => state.exhibition);
  
  // State for data
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [halls, setHalls] = useState<any[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<string | null>(null);
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // State for total statistics (across all pages)
  const [totalStats, setTotalStats] = useState({
    totalStalls: 0,
    totalArea: 0
  });

  // State for filters and pagination
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('number');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Ref to store current filter values for debounced search
  const filtersRef = React.useRef({
    statusFilter,
    sortField,
    sortOrder,
    pageSize
  });

  // Update ref when filters change
  React.useEffect(() => {
    filtersRef.current = {
      statusFilter,
      sortField,
      sortOrder,
      pageSize
    };
  }, [statusFilter, sortField, sortOrder, pageSize]);

  // Function to fetch total statistics (all stalls for accurate totals)
  const fetchTotalStats = React.useCallback(async () => {
    if (!selectedExhibition || !selectedHall) {
      setTotalStats({ totalStalls: 0, totalArea: 0 });
      return;
    }

    try {
      const fetchParams = {
        page: 1,
        limit: 10000, // Large number to get all stalls
        search: searchText || undefined,
        status: statusFilter || undefined,
        sortBy: sortField,
        sortOrder: sortOrder === 'ascend' ? 'asc' : 'desc'
      };

      const response = selectedHall === 'all' 
        ? await exhibitionService.getStalls(selectedExhibition, undefined, fetchParams)
        : await exhibitionService.getStalls(selectedExhibition, selectedHall, fetchParams);
      
      const payload = response.data as any;
      const isNewFormat = payload && typeof payload === 'object' && 'stalls' in payload;
      const allStalls = isNewFormat ? payload.stalls : payload;

      // Calculate total area from all stalls
      const totalArea = allStalls.reduce((sum: number, stall: any) => {
        if (stall?.dimensions?.width && stall?.dimensions?.height) {
          return sum + (stall.dimensions.width * stall.dimensions.height);
        }
        return sum;
      }, 0);

      setTotalStats({
        totalStalls: allStalls.length,
        totalArea: totalArea
      });
    } catch (error) {
      console.error('Failed to fetch total stats:', error);
      setTotalStats({ totalStalls: 0, totalArea: 0 });
    }
  }, [selectedExhibition, selectedHall, searchText, statusFilter, sortField, sortOrder]);

  // Function to fetch stalls with specific parameters
  const fetchStallsWithParams = React.useCallback((params: {
    page?: number;
    size?: number;
    search?: string;
    status?: string | null;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    if (selectedExhibition && selectedHall) {
      dispatch(fetchStalls({ 
        exhibitionId: selectedExhibition, 
        hallId: selectedHall === 'all' ? undefined : selectedHall,
        page: params.page || currentPage,
        limit: params.size || pageSize,
        search: params.search || undefined,
        status: params.status || undefined,
        sortBy: params.sortBy || sortField,
        sortOrder: params.sortOrder || (sortOrder === 'ascend' ? 'asc' : 'desc')
      }));
      
      // Also fetch total stats when filters change
      fetchTotalStats();
    }
  }, [dispatch, selectedExhibition, selectedHall, currentPage, pageSize, sortField, sortOrder, fetchTotalStats]);

  // Debounced search effect - only for search text changes
  React.useEffect(() => {
    if (!selectedExhibition || !selectedHall) return;
    
    const timeoutId = setTimeout(() => {
      if (selectedExhibition && selectedHall) {
        const filters = filtersRef.current;
        dispatch(fetchStalls({
          exhibitionId: selectedExhibition,
          hallId: selectedHall === 'all' ? undefined : selectedHall,
          page: 1,
          limit: filters.pageSize,
          search: searchText || undefined,
          status: filters.statusFilter || undefined,
          sortBy: filters.sortField,
          sortOrder: filters.sortOrder === 'ascend' ? 'asc' : 'desc'
        }));
        setCurrentPage(1);
        
        // Also fetch total stats when search changes
        fetchTotalStats();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText, selectedExhibition, selectedHall, dispatch, fetchTotalStats]); // Include necessary stable dependencies

  // Filter change handlers
  const handleStatusFilterChange = (value: string | null) => {
    setStatusFilter(value);
    setCurrentPage(1);
    fetchStallsWithParams({
      page: 1,
      search: searchText || undefined,
      status: value
    });
  };

  const handleSortChange = (field: string, order: 'ascend' | 'descend') => {
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1);
    fetchStallsWithParams({
      page: 1,
      search: searchText || undefined,
      status: statusFilter,
      sortBy: field,
      sortOrder: order === 'ascend' ? 'asc' : 'desc'
    });
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
    fetchStallsWithParams({
      page,
      size: size || pageSize,
      search: searchText || undefined,
      status: statusFilter
    });
  };

  // Export functionality
  const handleExportToExcel = async (exportAll = true) => {
    try {
      let dataToExport = displayStalls;
      
      // If exporting all, fetch all stalls without pagination
      if (exportAll && selectedExhibition && selectedHall) {
        const fetchParams = {
          page: 1,
          limit: 10000, // Large number to get all stalls
          search: searchText || undefined,
          status: statusFilter || undefined,
          sortBy: sortField,
          sortOrder: sortOrder === 'ascend' ? 'asc' : 'desc'
        };

        const response = selectedHall === 'all' 
          ? await exhibitionService.getStalls(selectedExhibition, undefined, fetchParams)
          : await exhibitionService.getStalls(selectedExhibition, selectedHall, fetchParams);
        
        const payload = response.data as any;
        const isNewFormat = payload && typeof payload === 'object' && 'stalls' in payload;
        dataToExport = isNewFormat ? payload.stalls : payload;
      }

      // Prepare data for Excel export
      const excelData = dataToExport.map((stall: any) => ({
        'Stall Number': stall.number,
        'Hall': halls.find(h => h._id === stall.hallId)?.name || 'N/A',
        'Stall Type': stall.stallType?.name || 'N/A',
        'Dimensions (W×H)': `${stall.dimensions.width}×${stall.dimensions.height}`,
        'Area (sq.m)': calculateStallArea(stall.dimensions),
        'Rate per Sq.m': `₹${stall.ratePerSqm.toLocaleString()}`,
        'Total Price': `₹${(stall.ratePerSqm * calculateStallArea(stall.dimensions)).toLocaleString()}`,
        'Status': stall.status.charAt(0).toUpperCase() + stall.status.slice(1),
        'Position (X,Y)': `${stall.dimensions.x},${stall.dimensions.y}`,
        'Created Date': new Date(stall.createdAt || Date.now()).toLocaleDateString(),
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths for better formatting
      const columnWidths = [
        { wch: 15 }, // Stall Number
        { wch: 20 }, // Hall
        { wch: 15 }, // Stall Type
        { wch: 15 }, // Dimensions
        { wch: 12 }, // Area
        { wch: 15 }, // Rate per Sq.m
        { wch: 18 }, // Total Price
        { wch: 12 }, // Status
        { wch: 15 }, // Position
        { wch: 15 }, // Created Date
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Stalls');

      // Generate filename
      const exhibitionName = exhibitions.find(e => e._id === selectedExhibition)?.name || 'Exhibition';
      const hallName = selectedHall === 'all' ? 'All-Halls' : (halls.find(h => h._id === selectedHall)?.name || 'Hall');
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${exhibitionName}-${hallName}-Stalls-${timestamp}.xlsx`;

      // Save file
      XLSX.writeFile(workbook, filename);
      
      message.success(`Exported ${dataToExport.length} stalls to Excel successfully!`);
    } catch (error) {
      console.error('Export failed:', error);
      message.error('Failed to export stalls. Please try again.');
    }
  };

  // Clear stalls when exhibition changes
  const handleExhibitionChange = (value: string | null) => {
    setSelectedExhibition(value);
    setSelectedHall(null);
    dispatch({ type: 'exhibition/clearStalls' });
    setTotalStats({ totalStalls: 0, totalArea: 0 });
  };

  // Clear and fetch stalls when hall changes
  const handleHallChange = (value: string | null) => {
    setSelectedHall(value);
    setCurrentPage(1); // Reset to first page
    if (selectedExhibition && value) {
      // Use unified approach for both 'all' and specific hall
      dispatch(fetchStalls({ 
        exhibitionId: selectedExhibition, 
        hallId: value === 'all' ? undefined : value,
        page: 1,
        limit: pageSize,
        search: searchText || undefined,
        status: statusFilter || undefined,
        sortBy: sortField,
        sortOrder: sortOrder === 'ascend' ? 'asc' : 'desc'
      }));
      
      // Fetch total stats for the new hall selection
      fetchTotalStats();
    } else {
      dispatch({ type: 'exhibition/clearStalls' });
      setTotalStats({ totalStalls: 0, totalArea: 0 });
    }
  };

  // Fetch exhibitions on component mount
  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        setLoading(true);
        console.log('Fetching exhibitions...');
        const response = await exhibitionService.getActiveExhibitions();
        console.log('Exhibitions response:', response.data);
        setExhibitions(response.data);
      } catch (error) {
        console.error('Failed to fetch exhibitions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExhibitions();
  }, []);

  // Fetch halls when exhibition is selected
  useEffect(() => {
    if (selectedExhibition) {
      const fetchHallsData = async () => {
        try {
          setLoading(true);
          console.log('Fetching halls for exhibition:', selectedExhibition);
          const response = await exhibitionService.getHalls(selectedExhibition);
          console.log('Halls response:', response.data);
          setHalls(response.data);
        } catch (error) {
          console.error('Failed to fetch halls:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchHallsData();
    } else {
      setHalls([]);
    }
  }, [selectedExhibition]);

  // Use stalls directly from Redux (server-side filtering)
  const displayStalls = reduxStalls;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'booked':
        return 'warning';
      case 'reserved':
        return 'processing';
      case 'sold':
        return 'error';
      default:
        return 'default';
    }
  };

  // Use total stats from state (calculated from all pages)
  const totals = {
    totalStalls: totalStats.totalStalls,
    totalSize: totalStats.totalArea
  };

  return (
    <div className="dashboard-container">
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Row justify="space-between" align="middle">
              <Col>
                <Space direction="vertical" size={4}>
                  <Title level={4} style={{ margin: 0 }}>Stalls</Title>
                  <Text type="secondary">Manage your exhibition stalls</Text>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() => handleExportToExcel(false)}
                    disabled={!selectedHall || displayStalls.length === 0}
                  >
                    Export Current Page
                  </Button>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => handleExportToExcel(true)}
                    disabled={!selectedHall}
                  >
                    Export All Stalls
                  </Button>
                </Space>
              </Col>
            </Row>
          </Col>

          {/* Filters Row */}
          <Col span={24}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select Exhibition"
                  value={selectedExhibition}
                  onChange={handleExhibitionChange}
                  allowClear
                >
                  {exhibitions.map((exhibition) => (
                    <Option key={exhibition._id || exhibition.id} value={exhibition._id || exhibition.id}>
                      {exhibition.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select Hall"
                  value={selectedHall}
                  onChange={handleHallChange}
                  disabled={!selectedExhibition || halls.length === 0}
                  allowClear
                >
                  <Option key="all-halls" value="all">
                    All Halls ({halls.length} halls)
                  </Option>
                  {halls.map((hall) => (
                    <Option key={hall._id || hall.id} value={hall._id || hall.id}>
                      {hall.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder="Search by stall number"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Filter by status"
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  allowClear
                >
                  <Option value="available">Available</Option>
                  <Option value="booked">Booked</Option>
                  <Option value="reserved">Reserved</Option>
                  <Option value="sold">Sold</Option>
                </Select>
              </Col>
            </Row>
          </Col>

          {/* Statistics Row */}
          <Col span={24}>
            <Card size="small">
              <Row gutter={16}>
                <Col xs={12} sm={12} md={6}>
                  <Statistic
                    title="Total Stalls"
                    value={totals.totalStalls}
                    prefix={<ApartmentOutlined />}
                  />
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <Statistic
                    title="Total Area"
                    value={totals.totalSize}
                    suffix="sqm"
                    prefix={<LayoutOutlined />}
                    precision={2}
                  />
                </Col>
                {selectedHall === 'all' && (
                  <Col xs={12} sm={12} md={6}>
                    <Statistic
                      title="Halls"
                      value={halls.length}
                      prefix={<ApartmentOutlined />}
                    />
                  </Col>
                )}
                {selectedHall !== 'all' && selectedHall && (
                  <Col xs={12} sm={12} md={6}>
                    <Statistic
                      title="Current Hall"
                      value={halls.find(h => (h._id || h.id) === selectedHall)?.name || 'N/A'}
                      prefix={<ApartmentOutlined />}
                    />
                  </Col>
                )}
              </Row>
            </Card>
          </Col>

          {/* Table */}
          <Col span={24}>
            <Table
              columns={[
                {
                  title: 'Stall Number',
                  dataIndex: 'number',
                  key: 'number',
                  sorter: (a: any, b: any) => a.number.localeCompare(b.number),
                  defaultSortOrder: 'ascend' as 'ascend',
                },
                ...(selectedHall === 'all' ? [{
                  title: 'Hall',
                  key: 'hall',
                  render: (_: any, record: any) => {
                    const hall = halls.find(h => (h._id || h.id) === record.hallId);
                    return hall?.name || 'N/A';
                  },
                }] : []),
                {
                  title: 'Type',
                  dataIndex: ['stallType', 'name'],
                  key: 'type',
                  render: (_: any, record: any) => {
                    return record.stallType?.name || 'N/A';
                  },
                },
                {
                  title: 'Rate (per sqm)',
                  dataIndex: 'ratePerSqm',
                  key: 'ratePerSqm',
                  render: (rate: number) => rate ? `₹${rate.toLocaleString()}` : 'N/A',
                  sorter: (a: any, b: any) => (a.ratePerSqm || 0) - (b.ratePerSqm || 0),
                },
                {
                  title: 'Area (sqm)',
                  key: 'area',
                  render: (_: any, record: any) => {
                    if (record?.dimensions) {
                      const area = calculateStallArea(record.dimensions);
                      return `${area} sqm`;
                    }
                    return 'N/A';
                  },
                  sorter: (a: any, b: any) => {
                    const areaA = a.dimensions ? calculateStallArea(a.dimensions) : 0;
                    const areaB = b.dimensions ? calculateStallArea(b.dimensions) : 0;
                    return areaA - areaB;
                  },
                },
                {
                  title: 'Dimensions',
                  key: 'dimensions',
                  render: (_: any, record: any) => {
                    if (record?.dimensions?.width && record?.dimensions?.height) {
                      return `${record.dimensions.width}m × ${record.dimensions.height}m`;
                    }
                    return 'N/A';
                  },
                },
                {
                  title: 'Total Price',
                  key: 'totalPrice',
                  render: (_: any, record: any) => {
                    if (record?.dimensions && record.ratePerSqm) {
                      const area = calculateStallArea(record.dimensions);
                      const total = record.ratePerSqm * area;
                      return `₹${total.toLocaleString()}`;
                    }
                    return 'N/A';
                  },
                  sorter: (a: any, b: any) => {
                    const areaA = a.dimensions ? calculateStallArea(a.dimensions) : 0;
                    const areaB = b.dimensions ? calculateStallArea(b.dimensions) : 0;
                    const totalA = (a.ratePerSqm || 0) * areaA;
                    const totalB = (b.ratePerSqm || 0) * areaB;
                    return totalA - totalB;
                  },
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => (
                    <Tag color={getStatusColor(status)} style={{ textTransform: 'capitalize' }}>
                      {status || 'N/A'}
                    </Tag>
                  ),
                  filters: [
                    { text: 'Available', value: 'available' },
                    { text: 'Booked', value: 'booked' },
                    { text: 'Reserved', value: 'reserved' },
                    { text: 'Sold', value: 'sold' },
                  ],
                  onFilter: (value: any, record: any) => record.status === value,
                },
              ]}
              dataSource={displayStalls}
              rowKey={(record) => record._id || record.id}
              loading={loading || reduxLoading}
              pagination={{
                current: stallsPagination.currentPage,
                pageSize: stallsPagination.pageSize,
                total: stallsPagination.totalCount,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} stalls`,
                onChange: handlePageChange,
                onShowSizeChange: handlePageChange,
                pageSizeOptions: ['10', '25', '50', '100'],
              }}
              onChange={(pagination, filters, sorter: any) => {
                if (sorter.field && sorter.order) {
                  handleSortChange(sorter.field, sorter.order);
                }
              }}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StallList; 