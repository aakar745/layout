import React from 'react';
import { Card, Space, Input, Select, DatePicker, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { FilterState } from './types';

const { RangePicker } = DatePicker;

// Create a more generic Exhibition interface that works with both Redux and API sources
interface GenericExhibition {
  _id: string;
  name: string;
  status?: string;
  isActive?: boolean;
}

interface BookingFiltersProps {
  filters: FilterState;
  exhibitions: GenericExhibition[];
  onFilterChange: (filters: FilterState) => void;
  onRefresh: () => void;
}

const BookingFilters: React.FC<BookingFiltersProps> = ({
  filters,
  exhibitions,
  onFilterChange,
  onRefresh
}) => {
  return (
    <Card style={{ marginBottom: '24px' }}>
      <Space wrap>
        <Input
          placeholder="Search by company, customer, email, phone, or stall number"
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={e => onFilterChange({ ...filters, search: e.target.value })}
          style={{ width: 280 }}
          allowClear
        />
        <Select
          placeholder="Filter by exhibition"
          value={filters.exhibition}
          onChange={exhibition => onFilterChange({ ...filters, exhibition })}
          style={{ minWidth: 200 }}
          allowClear
          options={exhibitions.map(exhibition => ({
            label: exhibition.name,
            value: exhibition._id
          }))}
        />
        <Select
          mode="multiple"
          placeholder="Filter by status"
          value={filters.status}
          onChange={status => onFilterChange({ ...filters, status })}
          style={{ minWidth: 200 }}
          options={[
            { label: 'Pending', value: 'pending' },
            { label: 'Approved', value: 'approved' },
            { label: 'Rejected', value: 'rejected' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Cancelled', value: 'cancelled' }
          ]}
        />
        <RangePicker
          onChange={(dates) => onFilterChange({
            ...filters,
            dateRange: dates ? [dates[0]?.toISOString() || '', dates[1]?.toISOString() || ''] : null
          })}
        />
        <Button
          icon={<ReloadOutlined />}
          onClick={onRefresh}
        >
          Refresh
        </Button>
      </Space>
    </Card>
  );
};

export default BookingFilters; 