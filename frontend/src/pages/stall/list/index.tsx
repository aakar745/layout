import React, { useEffect, useState } from 'react';
import { Card, Table, Space, Input, Typography, Row, Col, Select, message, Tag, Slider, InputNumber, Statistic, Button } from 'antd';
import { SearchOutlined, FilterOutlined, LayoutOutlined, ApartmentOutlined, DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchExhibition, fetchHalls, fetchStalls } from '../../../store/slices/exhibitionSlice';
import exhibitionService from '../../../services/exhibition';
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

  // Calculate max price from stalls
  const maxStallPrice = React.useMemo(() => {
    return Math.max(
      ...reduxStalls.map(stall => 
        stall.ratePerSqm * stall.dimensions.width * stall.dimensions.height
      ),
      1000000 // Minimum default max price
    );
  }, [reduxStalls]);

  // Round up maxPrice to next significant figure for better UX
  const roundedMaxPrice = React.useMemo(() => {
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxStallPrice)));
    return Math.ceil(maxStallPrice / magnitude) * magnitude;
  }, [maxStallPrice]);

  // State for filters and pagination
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, roundedMaxPrice]);
  const [sortField, setSortField] = useState<string>('number');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Ref to store current filter values for debounced search
  const filtersRef = React.useRef({
    statusFilter,
    priceRange,
    sortField,
    sortOrder,
    pageSize,
    roundedMaxPrice
  });

  // Update ref when filters change
  React.useEffect(() => {
    filtersRef.current = {
      statusFilter,
      priceRange,
      sortField,
      sortOrder,
      pageSize,
      roundedMaxPrice
    };
  }, [statusFilter, priceRange, sortField, sortOrder, pageSize, roundedMaxPrice]);

  // Function to fetch stalls with specific parameters
  const fetchStallsWithParams = React.useCallback((params: {
    page?: number;
    size?: number;
    search?: string;
    status?: string | null;
    sortBy?: string;
    sortOrder?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    if (selectedExhibition && selectedHall) {
      dispatch(fetchStalls({ 
        exhibitionId: selectedExhibition, 
        hallId: selectedHall,
        page: params.page || currentPage,
        limit: params.size || pageSize,
        search: params.search || undefined,
        status: params.status || undefined,
        sortBy: params.sortBy || sortField,
        sortOrder: params.sortOrder || (sortOrder === 'ascend' ? 'asc' : 'desc'),
        minPrice: params.minPrice,
        maxPrice: params.maxPrice
      }));
    }
  }, [dispatch, selectedExhibition, selectedHall, currentPage, pageSize, sortField, sortOrder]);

  // Debounced search effect - only for search text changes
  React.useEffect(() => {
    if (!selectedExhibition || !selectedHall) return;
    
    const timeoutId = setTimeout(() => {
      if (selectedExhibition && selectedHall) {
        const filters = filtersRef.current;
        dispatch(fetchStalls({
          exhibitionId: selectedExhibition,
          hallId: selectedHall,
          page: 1,
          limit: filters.pageSize,
          search: searchText || undefined,
          status: filters.statusFilter || undefined,
          sortBy: filters.sortField,
          sortOrder: filters.sortOrder === 'ascend' ? 'asc' : 'desc',
          minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
          maxPrice: filters.priceRange[1] < filters.roundedMaxPrice ? filters.priceRange[1] : undefined
        }));
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText, selectedExhibition, selectedHall, dispatch]); // Include necessary stable dependencies

  // Filter change handlers
  const handleStatusFilterChange = (value: string | null) => {
    setStatusFilter(value);
    setCurrentPage(1);
    fetchStallsWithParams({
      page: 1,
      search: searchText || undefined,
      status: value,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < roundedMaxPrice ? priceRange[1] : undefined
    });
  };

  const handlePriceRangeChange = (value: [number, number] | number | number[]) => {
    let rangeValue: [number, number];
    if (Array.isArray(value) && value.length === 2) {
      rangeValue = [value[0], value[1]];
    } else if (typeof value === 'number') {
      rangeValue = [0, value];
    } else {
      rangeValue = [0, roundedMaxPrice];
    }
    setPriceRange(rangeValue);
    setCurrentPage(1);
    fetchStallsWithParams({
      page: 1,
      search: searchText || undefined,
      status: statusFilter,
      minPrice: rangeValue[0] > 0 ? rangeValue[0] : undefined,
      maxPrice: rangeValue[1] < roundedMaxPrice ? rangeValue[1] : undefined
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
      sortOrder: order === 'ascend' ? 'asc' : 'desc',
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < roundedMaxPrice ? priceRange[1] : undefined
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
      status: statusFilter,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < roundedMaxPrice ? priceRange[1] : undefined
    });
  };

  // Export functionality
  const handleExportToExcel = async (exportAll = true) => {
    try {
      let dataToExport = displayStalls;
      
      // If exporting all, fetch all stalls without pagination
      if (exportAll && selectedExhibition && selectedHall) {
        const response = await exhibitionService.getStalls(selectedExhibition, selectedHall, {
          page: 1,
          limit: 10000, // Large number to get all stalls
          search: searchText || undefined,
          status: statusFilter || undefined,
          sortBy: sortField,
          sortOrder: sortOrder === 'ascend' ? 'asc' : 'desc',
          minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
          maxPrice: priceRange[1] < roundedMaxPrice ? priceRange[1] : undefined
        });
        
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
        'Area (sq.m)': stall.dimensions.width * stall.dimensions.height,
        'Rate per Sq.m': `₹${stall.ratePerSqm.toLocaleString()}`,
        'Total Price': `₹${(stall.ratePerSqm * stall.dimensions.width * stall.dimensions.height).toLocaleString()}`,
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
      const hallName = halls.find(h => h._id === selectedHall)?.name || 'Hall';
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
  };

  // Clear and fetch stalls when hall changes
  const handleHallChange = (value: string | null) => {
    setSelectedHall(value);
    setCurrentPage(1); // Reset to first page
    if (selectedExhibition && value) {
      // Use a direct dispatch call for hall change to avoid dependency issues
      dispatch(fetchStalls({ 
        exhibitionId: selectedExhibition, 
        hallId: value,
        page: 1,
        limit: pageSize,
        search: searchText || undefined,
        status: statusFilter || undefined,
        sortBy: sortField,
        sortOrder: sortOrder === 'ascend' ? 'asc' : 'desc',
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < roundedMaxPrice ? priceRange[1] : undefined
      }));
    } else {
      dispatch({ type: 'exhibition/clearStalls' });
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

  // Calculate totals
  const calculateTotals = (stalls: any[]) => {
    const totalSize = stalls.reduce((sum, stall) => {
      if (stall?.dimensions?.width && stall?.dimensions?.height) {
        return sum + (stall.dimensions.width * stall.dimensions.height);
      }
      return sum;
    }, 0);
    return {
      totalStalls: stalls.length,
      totalSize
    };
  };

  const totals = calculateTotals(displayStalls);

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
              </Row>
            </Card>
          </Col>

          {/* Price Range Filter */}
          <Col span={24}>
            <Card size="small" title="Price Range Filter">
              <Row gutter={16}>
                <Col span={24} style={{ marginBottom: 16 }}>
                  <Space>
                    <Button 
                      size="small" 
                      onClick={() => handlePriceRangeChange([0, 500000])}
                    >
                      Under ₹5L
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => handlePriceRangeChange([500000, 1000000])}
                    >
                      ₹5L - ₹10L
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => handlePriceRangeChange([1000000, 2000000])}
                    >
                      ₹10L - ₹20L
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => handlePriceRangeChange([2000000, roundedMaxPrice])}
                    >
                      Above ₹20L
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => handlePriceRangeChange([0, roundedMaxPrice])}
                    >
                      All
                    </Button>
                  </Space>
                </Col>
                <Col span={16}>
                  <Slider
                    range
                    min={0}
                    max={roundedMaxPrice}
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                    step={Math.max(1000, Math.floor(roundedMaxPrice / 1000))}
                    tooltip={{
                      formatter: (value) => `₹${(value || 0).toLocaleString()}`
                    }}
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={value => setPriceRange([value || 0, priceRange[1]])}
                    formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value ? Number(value.replace(/[^\d.-]/g, '')) : 0}
                    step={1000}
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    style={{ width: '100%' }}
                    min={priceRange[0]}
                    max={roundedMaxPrice}
                    value={priceRange[1]}
                    onChange={value => setPriceRange([priceRange[0], value || roundedMaxPrice])}
                    formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value ? Number(value.replace(/[^\d.-]/g, '')) : 0}
                    step={1000}
                  />
                </Col>
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
                    if (record?.dimensions?.width && record?.dimensions?.height) {
                      const area = record.dimensions.width * record.dimensions.height;
                      return `${area} sqm`;
                    }
                    return 'N/A';
                  },
                  sorter: (a: any, b: any) => {
                    const areaA = (a.dimensions?.width || 0) * (a.dimensions?.height || 0);
                    const areaB = (b.dimensions?.width || 0) * (b.dimensions?.height || 0);
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
                    if (record?.dimensions?.width && record?.dimensions?.height && record.ratePerSqm) {
                      const total = record.ratePerSqm * record.dimensions.width * record.dimensions.height;
                      return `₹${total.toLocaleString()}`;
                    }
                    return 'N/A';
                  },
                  sorter: (a: any, b: any) => {
                    const totalA = (a.ratePerSqm || 0) * (a.dimensions?.width || 0) * (a.dimensions?.height || 0);
                    const totalB = (b.ratePerSqm || 0) * (b.dimensions?.width || 0) * (b.dimensions?.height || 0);
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
                {
                  title: 'Actions',
                  key: 'actions',
                  render: (_: any, record: any) => (
                    <Space>
                      <a onClick={() => navigate(`/stall/edit/${record._id || record.id}`)}>Edit</a>
                      <a onClick={() => navigate(`/stall/view/${record._id || record.id}`)}>View</a>
                    </Space>
                  ),
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