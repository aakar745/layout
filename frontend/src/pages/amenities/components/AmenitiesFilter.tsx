import React from 'react';
import { Card, Select, DatePicker, Input, Button, Row, Col, Typography, Space, Divider, Tag } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface AmenitiesFilterProps {
  exhibitionId: string | null;
  exhibitions: any[];
  exhibitionsLoading: boolean;
  onExhibitionChange: (value: string) => void;
  typeFilter: string[];
  setTypeFilter: (types: string[]) => void;
  bookingStatusFilter: string[];
  setBookingStatusFilter: (statuses: string[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: [any, any] | null;
  setDateRange: (range: [any, any] | null) => void;
  resetFilters: () => void;
}

const AmenitiesFilter: React.FC<AmenitiesFilterProps> = ({
  exhibitionId,
  exhibitions,
  exhibitionsLoading,
  onExhibitionChange,
  typeFilter,
  setTypeFilter,
  bookingStatusFilter,
  setBookingStatusFilter,
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  resetFilters
}) => {
  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle date range selection
  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
  };

  return (
    <Card className="amenities-filters">
      <Title level={5} className="filter-heading">Filters</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8} lg={6}>
          <div className="filter-group">
            <Text className="filter-label">Exhibition</Text>
            <Select
              placeholder="Select an exhibition"
              style={{ width: '100%' }}
              loading={exhibitionsLoading}
              onChange={onExhibitionChange}
              value={exhibitionId}
            >
              {exhibitions.map(exhibition => (
                <Option key={exhibition._id} value={exhibition._id}>
                  {exhibition.name}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        
        <Col xs={24} md={8} lg={6}>
          <div className="filter-group">
            <Text className="filter-label">Amenity Type</Text>
            <Select
              mode="multiple"
              placeholder="Select types"
              style={{ width: '100%' }}
              value={typeFilter}
              onChange={setTypeFilter}
              maxTagCount={2}
            >
              <Option value="facility">Facility</Option>
              <Option value="service">Service</Option>
              <Option value="equipment">Equipment</Option>
              <Option value="other">Other</Option>
            </Select>
          </div>
        </Col>
        
        <Col xs={24} md={8} lg={6}>
          <div className="filter-group">
            <Text className="filter-label">Booking Status</Text>
            <Select
              mode="multiple"
              placeholder="Select statuses"
              style={{ width: '100%' }}
              value={bookingStatusFilter}
              onChange={setBookingStatusFilter}
              maxTagCount={2}
            >
              <Option value="booked">Booked</Option>
              <Option value="available">Available</Option>
              <Option value="reserved">Reserved</Option>
              <Option value="pending">Pending</Option>
            </Select>
          </div>
        </Col>
        
        <Col xs={24} md={8} lg={6}>
          <div className="filter-group">
            <Text className="filter-label">Search</Text>
            <Input 
              placeholder="Search amenities" 
              prefix={<SearchOutlined />} 
              value={searchQuery}
              onChange={handleSearch}
              allowClear
            />
          </div>
        </Col>
        
        <Col xs={24} md={16} lg={12}>
          <div className="filter-group">
            <Text className="filter-label">Booking Date Range</Text>
            <RangePicker 
              style={{ width: '100%' }}
              onChange={handleDateRangeChange}
              value={dateRange}
            />
          </div>
        </Col>
        
        <Col xs={24} md={8} lg={12}>
          <div className="filter-group" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', height: '100%' }}>
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={resetFilters}
              >
                Reset
              </Button>
              <Button 
                type="primary" 
                icon={<FilterOutlined />}
              >
                Apply Filters
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
      
      {/* Active Filters Display */}
      {(typeFilter.length > 0 || bookingStatusFilter.length > 0 || searchQuery || dateRange) && (
        <>
          <Divider className="filter-divider" />
          <div>
            <Text className="filter-label">Active Filters:</Text>
            <div style={{ marginTop: 8 }}>
              {typeFilter.map(type => (
                <Tag 
                  key={`type-${type}`} 
                  closable 
                  onClose={() => setTypeFilter(typeFilter.filter(t => t !== type))}
                  className={`amenity-tag amenity-tag-${type}`}
                >
                  Type: {type}
                </Tag>
              ))}
              
              {bookingStatusFilter.map(status => (
                <Tag 
                  key={`status-${status}`} 
                  closable 
                  onClose={() => setBookingStatusFilter(bookingStatusFilter.filter(s => s !== status))}
                  color="blue"
                >
                  Status: {status}
                </Tag>
              ))}
              
              {searchQuery && (
                <Tag 
                  closable 
                  onClose={() => setSearchQuery('')}
                  color="purple"
                >
                  Search: {searchQuery}
                </Tag>
              )}
              
              {dateRange && (
                <Tag 
                  closable 
                  onClose={() => setDateRange(null)}
                  color="green"
                >
                  Date Range: {dateRange[0]?.format('MMM DD, YYYY')} - {dateRange[1]?.format('MMM DD, YYYY')}
                </Tag>
              )}
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default AmenitiesFilter; 