import React, { useState, useEffect } from 'react';
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
  exhibitionId
}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);
  
  // Fetch bookings data for this exhibition
  useEffect(() => {
    if (!exhibitionId) return;
    
    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);
        // In a real implementation, this would be an actual API call
        // For demo purposes, we're creating mock booking data
        
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create mock data - in real app this would be fetched from backend
        const mockBookings = [
          {
            id: 'booking-1',
            exhibitorId: 'exhibitor-1',
            exhibitorName: 'TechCorp Solutions',
            stallId: 'stall-1',
            stallNumber: 'A101',
            stallDimension: '3x3m',
            stallType: 'Standard',
            area: 9,
            status: 'confirmed',
            bookingDate: '2023-10-15',
          },
          {
            id: 'booking-2',
            exhibitorId: 'exhibitor-2',
            exhibitorName: 'Innovation Labs',
            stallId: 'stall-2',
            stallNumber: 'B205',
            stallDimension: '4x3m',
            stallType: 'Premium',
            area: 12,
            status: 'confirmed',
            bookingDate: '2023-10-18',
          },
          {
            id: 'booking-3',
            exhibitorId: 'exhibitor-3',
            exhibitorName: 'Global Gadgets Inc.',
            stallId: 'stall-3',
            stallNumber: 'C304',
            stallDimension: '5x4m',
            stallType: 'Premium',
            area: 20,
            status: 'confirmed',
            bookingDate: '2023-10-20',
          },
          {
            id: 'booking-4',
            exhibitorId: 'exhibitor-4',
            exhibitorName: 'Future Products Co.',
            stallId: 'stall-4',
            stallNumber: 'D408',
            stallDimension: '6x5m',
            stallType: 'Deluxe',
            area: 30,
            status: 'confirmed',
            bookingDate: '2023-10-22',
          }
        ];
        
        setBookings(mockBookings);
        setLoadingBookings(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        message.error('Failed to load exhibition bookings');
        setLoadingBookings(false);
      }
    };
    
    fetchBookings();
  }, [exhibitionId]);
  
  // This function consolidates amenities by stall for all views
  const consolidateAmenitiesByStall = () => {
    // Create a map to organize amenities by stall
    const stallMap = new Map();
    
    // If we have no bookings data but have amenities, create temporary bookings for demonstration
    if (bookings.length === 0 && amenities.length > 0) {
      // Create sample bookings for demonstration
      const sampleBookings = [
        {
          stallId: 'sample-stall-1',
          exhibitorName: 'Sample Company 1',
          stallNumber: 'A101',
          stallDimension: '3x3m',
          stallType: 'Standard',
          area: 9,
          bookingDate: new Date().toISOString().slice(0, 10),
          status: 'confirmed'
        },
        {
          stallId: 'sample-stall-2',
          exhibitorName: 'Sample Company 2',
          stallNumber: 'B205',
          stallDimension: '4x3m',
          stallType: 'Premium',
          area: 12,
          bookingDate: new Date().toISOString().slice(0, 10),
          status: 'confirmed'
        },
        {
          stallId: 'sample-stall-3',
          exhibitorName: 'Sample Company 3',
          stallNumber: 'C304',
          stallDimension: '5x4m',
          stallType: 'Deluxe',
          area: 20,
          bookingDate: new Date().toISOString().slice(0, 10),
          status: 'confirmed'
        }
      ];
      
      // Add sample bookings to stall map
      sampleBookings.forEach(booking => {
        stallMap.set(booking.stallId, {
          key: booking.stallId,
          companyName: booking.exhibitorName,
          stallNumber: booking.stallNumber,
          dimension: booking.stallDimension,
          stallType: booking.stallType,
          area: booking.area,
          bookingDate: booking.bookingDate,
          status: booking.status,
          amenities: {}
        });
      });
      
      // Process all amenities for these sample stalls
      amenities.forEach(amenity => {
        // For basic amenities (with perSqm property)
        if (title.toLowerCase().includes('basic') && amenity.hasOwnProperty('perSqm')) {
          sampleBookings.forEach(booking => {
            const stallId = booking.stallId;
            const stall = stallMap.get(stallId);
            if (!stall) return;
            
            const amenityName = amenity.name;
            // Calculate quantity based on stall area
            const stallArea = booking.area;
            const calculatedQuantity = Math.floor(stallArea / amenity.perSqm) * amenity.quantity;
            stall.amenities[amenityName] = calculatedQuantity > 0 ? calculatedQuantity : amenity.quantity;
          });
        }
        // For extra amenities (with rate property)
        else if ((title.toLowerCase().includes('additional') || title.toLowerCase().includes('extra')) && 
                 amenity.hasOwnProperty('rate')) {
          // Randomly assign extras to stalls
          const randomStallId = sampleBookings[Math.floor(Math.random() * sampleBookings.length)].stallId;
          const stall = stallMap.get(randomStallId);
          if (stall && Math.random() > 0.6) {
            stall.amenities[amenity.name] = Math.ceil(Math.random() * 2); // Random quantity 1-2
          }
        }
        // For calculated view
        else if (isCalculated) {
          sampleBookings.forEach(booking => {
            const stall = stallMap.get(booking.stallId);
            if (!stall) return;
            
            if (amenity.hasOwnProperty('perSqm')) {
              const amenityName = amenity.name;
              const stallArea = booking.area;
              const calculatedQuantity = Math.floor(stallArea / amenity.perSqm) * amenity.quantity;
              stall.amenities[amenityName] = calculatedQuantity > 0 ? calculatedQuantity : amenity.quantity;
            }
            else if (amenity.hasOwnProperty('rate') && Math.random() > 0.7) {
              stall.amenities[amenity.name] = Math.ceil(Math.random() * 2);
            }
          });
        }
      });
      
      return Array.from(stallMap.values()).filter(stall => Object.keys(stall.amenities).length > 0);
    }
    
    // Create stall entries from bookings
    bookings.forEach(booking => {
      stallMap.set(booking.stallId, {
        key: booking.stallId,
        companyName: booking.exhibitorName,
        stallNumber: booking.stallNumber,
        dimension: booking.stallDimension,
        stallType: booking.stallType,
        area: booking.area,
        bookingDate: booking.bookingDate,
        status: booking.status,
        amenities: {}
      });
    });
    
    // Process all amenities
    amenities.forEach(amenity => {
      // For basic amenities (those with perSqm property)
      if (title.toLowerCase().includes('basic') && amenity.hasOwnProperty('perSqm')) {
        // Calculate amenities for each stall based on its area
        bookings.forEach(booking => {
          const stallId = booking.stallId;
          const stall = stallMap.get(stallId);
          if (!stall) return;
          
          const amenityName = amenity.name;
          // Calculate quantity based on stall area and perSqm value
          const stallArea = booking.area;
          const calculatedQuantity = Math.floor(stallArea / amenity.perSqm) * amenity.quantity;
          stall.amenities[amenityName] = calculatedQuantity > 0 ? calculatedQuantity : amenity.quantity;
        });
      } 
      // For extra amenities (those with rate property)
      else if ((title.toLowerCase().includes('additional') || title.toLowerCase().includes('extra')) && 
               amenity.hasOwnProperty('rate')) {
        // If this were a real app, we'd have data about which extra amenities each stall has booked
        // For demo purposes, we'll randomly assign extras to some stalls
        if (Math.random() > 0.7) { // 30% chance of a stall having this extra amenity
          const randomStallIndex = Math.floor(Math.random() * bookings.length);
          const randomStall = bookings[randomStallIndex];
          const stall = stallMap.get(randomStall.stallId);
          if (stall) {
            stall.amenities[amenity.name] = Math.ceil(Math.random() * 3); // Random quantity 1-3
          }
        }
      }
      // For calculated view (all amenities)
      else if (isCalculated) {
        // Assign all amenities to all stalls for demonstration
        bookings.forEach(booking => {
          const stallId = booking.stallId;
          const stall = stallMap.get(stallId);
          if (!stall) return;
          
          // Add basic amenities
          if (amenity.hasOwnProperty('perSqm')) {
            const amenityName = amenity.name;
            const stallArea = booking.area;
            const calculatedQuantity = Math.floor(stallArea / amenity.perSqm) * amenity.quantity;
            stall.amenities[amenityName] = calculatedQuantity > 0 ? calculatedQuantity : amenity.quantity;
          }
          // Add extra amenities (if they would be booked)
          else if (amenity.hasOwnProperty('rate') && Math.random() > 0.7) {
            stall.amenities[amenity.name] = Math.ceil(Math.random() * 3); // Random quantity 1-3
          }
        });
      }
      
      // If amenity has stall info, use that instead (for real data)
      if (amenity.stallId && amenity.stallNumber) {
        // Check if this stall already exists in our map
        if (!stallMap.has(amenity.stallId)) {
          // Create stall entry if it doesn't exist
          stallMap.set(amenity.stallId, {
            key: amenity.stallId,
            companyName: amenity.exhibitorName || 'Unknown',
            stallNumber: amenity.stallNumber,
            dimension: amenity.stallDimension || '-',
            stallType: amenity.stallType || '-',
            area: amenity.area || (amenity.dimensions?.width && amenity.dimensions?.height ? 
              amenity.dimensions.width * amenity.dimensions.height : '-'),
            amenities: {}
          });
        }
        
        // Get stall and add this amenity
        const stall = stallMap.get(amenity.stallId);
        
        // Add amenity based on type
        if (amenity.hasOwnProperty('calculatedQuantity')) {
          stall.amenities[amenity.name] = amenity.calculatedQuantity;
        } else if (amenity.hasOwnProperty('perSqm')) {
          const stallArea = typeof stall.area === 'number' ? stall.area : 0;
          const calculatedQuantity = Math.floor(stallArea / amenity.perSqm) * amenity.quantity;
          stall.amenities[amenity.name] = calculatedQuantity > 0 ? calculatedQuantity : amenity.quantity;
        } else if (amenity.hasOwnProperty('booked') && amenity.booked) {
          stall.amenities[amenity.name] = 1; // Mark as booked
        } else if (amenity.hasOwnProperty('rate')) {
          stall.amenities[amenity.name] = '✓'; // Mark as available
        }
      }
    });
    
    // Convert map to array and only include stalls with amenities
    return Array.from(stallMap.values()).filter(stall => Object.keys(stall.amenities).length > 0);
  };
  
  // Get all unique amenity names for the current view
  const getUniqueAmenityNames = () => {
    const amenityNames = new Set();
    
    amenities.forEach(amenity => {
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
  
  // Process data for the table - use stall-based approach for all views
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
          {isCalculated && <Tag color="green">Calculated</Tag>}
        </Space>
      }
      extra={
        <Space>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={onExport}
            disabled={amenities.length === 0 || stallData.length === 0}
          >
            Export
          </Button>
        </Space>
      }
    >
      {amenities.length === 0 ? (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No amenities data available" 
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