import React, { useEffect, useState } from 'react';
import { Card, Table, Space, Input, Typography, Row, Col, Select, message, Tag, Slider, InputNumber, Statistic, Button } from 'antd';
import { SearchOutlined, FilterOutlined, LayoutOutlined, ApartmentOutlined } from '@ant-design/icons';
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
  const { stalls: reduxStalls, loading: reduxLoading } = useSelector((state: RootState) => state.exhibition);
  
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

  // State for filters
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, roundedMaxPrice]);
  const [sortField, setSortField] = useState<string>('number');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend');

  // Clear stalls when exhibition changes
  const handleExhibitionChange = (value: string | null) => {
    setSelectedExhibition(value);
    setSelectedHall(null);
    dispatch({ type: 'exhibition/clearStalls' });
  };

  // Clear and fetch stalls when hall changes
  const handleHallChange = (value: string | null) => {
    setSelectedHall(value);
    if (selectedExhibition && value) {
      dispatch(fetchStalls({ exhibitionId: selectedExhibition, hallId: value }));
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

  // Filter and sort stalls
  const filteredStalls = React.useMemo(() => {
    console.log('Filtering stalls from Redux:', reduxStalls);
    const filtered = reduxStalls
      .filter(stall => {
        const matchesSearch = !searchText || 
          stall.number.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = !statusFilter || stall.status === statusFilter;
        const matchesHall = !selectedHall || stall.hallId === selectedHall;
        const price = stall.ratePerSqm * stall.dimensions.width * stall.dimensions.height;
        const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
        return matchesSearch && matchesStatus && matchesHall && matchesPrice;
      })
      .sort((a, b) => {
        if (sortField === 'number') {
          return sortOrder === 'ascend' 
            ? a.number.localeCompare(b.number)
            : b.number.localeCompare(a.number);
        }
        return 0;
      });
    console.log('Filtered stalls:', filtered);
    return filtered;
  }, [reduxStalls, searchText, statusFilter, selectedHall, priceRange, sortField, sortOrder]);

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

  const totals = calculateTotals(filteredStalls);

  return (
    <div className="dashboard-container">
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Title level={4} style={{ margin: 0 }}>Stalls</Title>
              <Text type="secondary">Manage your exhibition stalls</Text>
            </Space>
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
                  onChange={setStatusFilter}
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
                      onClick={() => setPriceRange([0, 500000])}
                    >
                      Under ₹5L
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => setPriceRange([500000, 1000000])}
                    >
                      ₹5L - ₹10L
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => setPriceRange([1000000, 2000000])}
                    >
                      ₹10L - ₹20L
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => setPriceRange([2000000, roundedMaxPrice])}
                    >
                      Above ₹20L
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => setPriceRange([0, roundedMaxPrice])}
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
                    onChange={(value) => setPriceRange(value as [number, number])}
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
              dataSource={filteredStalls}
              rowKey={(record) => record._id || record.id}
              loading={loading || reduxLoading}
              pagination={{
                total: filteredStalls.length,
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} stalls`,
              }}
              onChange={(pagination, filters, sorter: any) => {
                if (sorter.field) {
                  setSortField(sorter.field);
                  setSortOrder(sorter.order);
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