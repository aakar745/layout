import React, { useState, useEffect, useMemo } from 'react';
import { Table, Card, Typography, Tag, Space, Button, Tooltip, Badge, Dropdown, Menu, Empty, Alert, message } from 'antd';
import { DownloadOutlined, EllipsisOutlined, EyeOutlined, EditOutlined, SettingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

const { Text, Title } = Typography;

interface AmenitiesTableProps {
  title: string;
  amenities: any[];
  loading: boolean;
  onExport: () => void;
  isDynamicColumns?: boolean;
  isCalculated?: boolean;
  exhibitionId?: string;
  amenityViewType?: 'basic' | 'extra' | 'all';
}

// Function to get color based on amenity type
const getTypeColor = (type: string) => {
  switch (type) {
    case 'facility':
      return { color: '#e6f7ff', borderColor: '#91d5ff', textColor: '#1890ff' };
    case 'service':
      return { color: '#f6ffed', borderColor: '#b7eb8f', textColor: '#52c41a' };
    case 'equipment':
      return { color: '#fff7e6', borderColor: '#ffd591', textColor: '#fa8c16' };
    default:
      return { color: '#f9f0ff', borderColor: '#d3adf7', textColor: '#722ed1' };
  }
};

const AmenitiesTable: React.FC<AmenitiesTableProps> = ({
  title,
  amenities,
  loading,
  onExport,
  isDynamicColumns = false,
  isCalculated = false,
  exhibitionId,
  amenityViewType = 'all'
}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);
  
  // Filter amenities based on the view type for calculated view
  const filteredAmenities = useMemo(() => {
    if (!isCalculated || amenityViewType === 'all') {
      return amenities;
    }
    
    if (amenityViewType === 'basic') {
      // Only show basic amenities (with calculatedQuantity or perSqm)
      return amenities.filter(amenity => 
        amenity.hasOwnProperty('calculatedQuantity') || 
        amenity.hasOwnProperty('perSqm')
      );
    } else if (amenityViewType === 'extra') {
      // Only show extra amenities (with rate but no perSqm)
      return amenities.filter(amenity => 
        amenity.hasOwnProperty('rate') && 
        !amenity.hasOwnProperty('perSqm')
      );
    }
    
    return amenities;
  }, [amenities, isCalculated, amenityViewType]);
  
  // Fetch bookings data for this exhibition
  useEffect(() => {
    if (!exhibitionId) {
      setBookings([]);
      setLoadingBookings(false);
      return;
    }
    
    // Set loading state initially
    setLoadingBookings(true);
    
    // In a real implementation with an API, this would be where you'd fetch bookings
    // Since we're now using data from the Redux store, we just simulate the loading state
    setTimeout(() => {
      setLoadingBookings(false);
    }, 500);
    
  }, [exhibitionId]);
  
  // This function consolidates amenities by stall for all views
  const consolidateAmenitiesByStall = () => {
    // Create a map to organize amenities by stall
    const stallMap = new Map();
    
    // Process all amenities - focus on real data
    filteredAmenities.forEach(amenity => {
      // If amenity has stall info, use that (for real data from bookings)
      if (amenity.stallId && amenity.stallNumber) {
        // Check if this stall already exists in our map
        if (!stallMap.has(amenity.stallId)) {
          // Create stall entry if it doesn't exist
          stallMap.set(amenity.stallId, {
            key: amenity.stallId,
            companyName: amenity.exhibitorName || 'Unknown',
            stallNumber: amenity.stallNumber,
            dimension: amenity.dimensions ? `${amenity.dimensions.width}x${amenity.dimensions.height}m` : '-',
            stallType: amenity.stallType || '-',
            area: amenity.area || (amenity.dimensions?.width && amenity.dimensions?.height ? 
              amenity.dimensions.width * amenity.dimensions.height : '-'),
            bookingDate: amenity.bookingDate ? new Date(amenity.bookingDate).toISOString().slice(0, 10) : '-',
            status: amenity.bookingStatus || '-',
            amenities: {}
          });
        }
        
        // Get stall and add this amenity
        const stall = stallMap.get(amenity.stallId);
        
        // Add amenity based on type
        if (amenity.hasOwnProperty('calculatedQuantity')) {
          // For basic amenities with calculated quantities
          stall.amenities[amenity.name] = amenity.calculatedQuantity;
        } else if (amenity.hasOwnProperty('perSqm')) {
          // Fallback calculation if calculatedQuantity is not provided for basic amenities
          const stallArea = typeof stall.area === 'number' ? stall.area : 0;
          const calculatedQuantity = Math.floor(stallArea / amenity.perSqm) * amenity.quantity;
          stall.amenities[amenity.name] = calculatedQuantity > 0 ? calculatedQuantity : amenity.quantity;
        } else if (amenity.hasOwnProperty('booked') && amenity.booked) {
          // For extra amenities that are booked
          
          // Handle different possible formats for quantity
          let quantity = 1;
          if (typeof amenity.quantity === 'number') {
            quantity = amenity.quantity;
          } else if (typeof amenity.quantity === 'string') {
            quantity = parseInt(amenity.quantity, 10);
            if (isNaN(quantity)) quantity = 1;
          }
          
          stall.amenities[amenity.name] = quantity; // Use actual quantity from booking
        } else if (amenity.hasOwnProperty('rate')) {
          // For extra amenities with rate (available but not booked)
          stall.amenities[amenity.name] = 0; // Show as 0 instead of checkmark
        }
      }
    });
    
    // Convert map to array and only include stalls with amenities
    const result = Array.from(stallMap.values()).filter(stall => Object.keys(stall.amenities).length > 0);
    return result;
  };
  
  // Get all unique amenity names for the current view
  const getUniqueAmenityNames = () => {
    const amenityNames = new Set();
    
    filteredAmenities.forEach(amenity => {
      // Filter amenities based on the current view
      const shouldIncludeAmenity = (amenity: any) => {
        if (isCalculated) {
          // Include all amenities in calculated view
          return true;
        } else if (title.toLowerCase().includes('basic')) {
          // Only include basic amenities in basic view (has perSqm property)
          return amenity.hasOwnProperty('perSqm');
        } else if (title.toLowerCase().includes('additional') || title.toLowerCase().includes('extra')) {
          // Only include extra amenities in extra view (has rate property)
          return amenity.hasOwnProperty('rate');
        }
        return true;
      };
      
      if (amenity.name && shouldIncludeAmenity(amenity)) {
        amenityNames.add(amenity.name);
      }
    });
    
    return Array.from(amenityNames) as string[];
  };
  
  // Generate columns for the stall-based table
  const getStallColumns = (): ColumnsType<any> => {
    // Base columns for stall info
    const baseColumns: ColumnsType<any> = [
      {
        title: 'Company Name',
        dataIndex: 'companyName',
        key: 'companyName',
        fixed: 'left',
        width: 180,
        render: (text: string) => <Text strong>{text}</Text>,
        sorter: (a: any, b: any) => a.companyName.localeCompare(b.companyName),
      },
      {
        title: 'Stall No.',
        dataIndex: 'stallNumber',
        key: 'stallNumber',
        width: 100,
        render: (text: string) => <Badge status="success" text={text} />,
        sorter: (a: any, b: any) => a.stallNumber.localeCompare(b.stallNumber),
      },
      {
        title: 'Dimension',
        dataIndex: 'dimension',
        key: 'dimension',
        width: 120,
      },
      {
        title: 'Stall Type',
        dataIndex: 'stallType',
        key: 'stallType',
        width: 120,
      },
      {
        title: 'Area (SQM)',
        dataIndex: 'area',
        key: 'area',
        width: 100,
        render: (value: any) => (typeof value === 'number' ? value.toFixed(2) : value),
        sorter: (a: any, b: any) => {
          const aValue = typeof a.area === 'number' ? a.area : 0;
          const bValue = typeof b.area === 'number' ? b.area : 0;
          return aValue - bValue;
        },
      },
    ];
    
    // Get all unique amenity names to create dynamic columns
    const amenityNames = getUniqueAmenityNames();
    
    // Create a column for each amenity
    const amenityColumns = amenityNames.map(name => ({
      title: name,
      dataIndex: ['amenities', name],
      key: name,
      width: 100,
      render: (value: any) => {
        if (value === undefined || value === null) return '-';
        if (value === 0) return <Text type="secondary">0</Text>;
        if (value === '✓') return <Badge status="success" />;
        return <Text strong>{value}</Text>;
      },
      sorter: (a: any, b: any) => {
        const aValue = a.amenities[name] || 0;
        const bValue = b.amenities[name] || 0;
        return aValue - bValue;
      },
    }));
    
    // Add actions column
    const actionsColumn = {
      title: 'Actions',
      key: 'actions',
      width: 80,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Dropdown 
          overlay={
            <Menu>
              <Menu.Item key="view" icon={<EyeOutlined />}>View Details</Menu.Item>
              <Menu.Item key="edit" icon={<EditOutlined />}>Edit</Menu.Item>
              <Menu.Item key="settings" icon={<SettingOutlined />}>Settings</Menu.Item>
            </Menu>
          } 
          trigger={['click']}
        >
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      )
    };
    
    // Combine all columns
    return [...baseColumns, ...amenityColumns, actionsColumn];
  };
  
  // Handle row expansion
  const handleExpandedRowsChange = (expandedKeys: readonly React.Key[]) => {
    setExpandedRowKeys(expandedKeys as string[]);
  };
  
  // Process stall data once
  const stallData = consolidateAmenitiesByStall();
  
  // Expanded row for stall-based view
  const renderExpandedRow = (record: any) => {
    return (
      <div style={{ padding: '20px' }}>
        <Title level={5}>Stall Details</Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {Object.entries(record).map(([key, value]) => {
            // Skip certain fields
            if (['key', 'amenities'].includes(key)) return null;
            
            return (
              <div key={key} style={{ marginBottom: '8px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                </Text>
                <div>
                  <Text strong>
                    {value === null || value === undefined ? '-' : 
                     typeof value === 'object' ? JSON.stringify(value) : 
                     String(value)}
                  </Text>
                </div>
              </div>
            );
          })}
          
          <div style={{ marginBottom: '8px', gridColumn: '1 / -1' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Amenities:
            </Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
              {Object.entries(record.amenities || {}).map(([amenityName, quantity]: [string, any]) => (
                <Tag key={amenityName} color="blue">
                  {amenityName}: {quantity === '✓' ? 'Available' : quantity}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card 
      className="amenities-card"
      title={
        <Space>
          <Title level={5} style={{ margin: 0 }}>{title}</Title>
          {isCalculated && (
            <>
              <Tag color="green">Calculated</Tag>
              {amenityViewType === 'basic' && <Tag color="blue">Basic Amenities</Tag>}
              {amenityViewType === 'extra' && <Tag color="purple">Extra Amenities</Tag>}
              {amenityViewType === 'all' && <Tag color="orange">All Amenities</Tag>}
            </>
          )}
        </Space>
      }
      extra={
        <Space>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={onExport}
            disabled={filteredAmenities.length === 0}
          >
            Export
          </Button>
        </Space>
      }
    >
      {filteredAmenities.length === 0 ? (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No amenities data available" 
        />
      ) : title.toLowerCase().includes('basic') && !isCalculated ? (
        // Special view for basic amenities tab - shows amenities directly without needing stall data
        <Table 
          dataSource={filteredAmenities.map((amenity, index) => ({
            key: amenity._id || amenity.id || `basic-${index}`,
            ...amenity
          }))}
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              render: (text: string, record: any) => (
                <Space>
                  <Text strong>{text}</Text>
                  <Tag color={getTypeColor(record.type).textColor}>{record.type}</Tag>
                </Space>
              )
            },
            {
              title: 'Description',
              dataIndex: 'description',
              key: 'description'
            },
            {
              title: 'Per SQM',
              dataIndex: 'perSqm',
              key: 'perSqm',
              render: (value: number) => value ? `1 per ${value} sqm` : '-'
            },
            {
              title: 'Quantity',
              dataIndex: 'quantity',
              key: 'quantity',
              render: (qty: number) => <Tag color="blue">{qty}</Tag>
            }
          ]}
          loading={loading}
          pagination={{ pageSize: 10 }}
          className="amenities-table"
        />
      ) : (title.toLowerCase().includes('additional') || title.toLowerCase().includes('extra')) && !isCalculated ? (
        // Special view for extra amenities tab - shows amenities directly without needing stall data
        <Table 
          dataSource={filteredAmenities.map((amenity, index) => ({
            key: amenity._id || amenity.id || `extra-${index}`,
            ...amenity
          }))}
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              render: (text: string, record: any) => (
                <Space>
                  <Text strong>{text}</Text>
                  <Tag color={getTypeColor(record.type).textColor}>{record.type}</Tag>
                </Space>
              )
            },
            {
              title: 'Description',
              dataIndex: 'description',
              key: 'description'
            },
            {
              title: 'Rate',
              dataIndex: 'rate',
              key: 'rate',
              render: (value: number) => <Text style={{ color: '#1890ff' }}>₹{value.toLocaleString()}</Text>
            }
          ]}
          loading={loading}
          pagination={{ pageSize: 10 }}
          className="amenities-table"
        />
      ) : stallData.length === 0 ? (
        <Alert
          message="No stall data available"
          description="Amenities exist but could not be linked to stalls. Make sure stalls are booked and have amenities assigned."
          type="info"
          showIcon
        />
      ) : (
        <Table 
          dataSource={stallData}
          columns={getStallColumns()}
          loading={loading || loadingBookings}
          pagination={{ pageSize: 10 }}
          className="amenities-table"
          scroll={{ x: 'max-content' }}
          expandable={{
            expandedRowKeys,
            onExpandedRowsChange: handleExpandedRowsChange,
            expandedRowRender: renderExpandedRow
          }}
        />
      )}
    </Card>
  );
};

export default AmenitiesTable; 