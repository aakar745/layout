import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Row, Col, App, Empty, Tabs, Card, Space, Radio } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchExhibitions } from '../../store/slices/exhibitionSlice';
import { fetchBookings } from '../../store/slices/bookingSlice';
import { BookOutlined, AppstoreOutlined, CalculatorOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import api from '../../services/api';

// Import components
import { AmenitiesFilter, AmenitiesStats, AmenitiesTable } from './components';

// Import CSS
import './styles.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Helper function to export data to Excel
const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Amenities');
  
  // Generate and save the Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${fileName}.xlsx`);
};

const AmenitiesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { message } = App.useApp();
  const { exhibitions, loading } = useSelector((state: RootState) => state.exhibition);
  const { bookings, loading: bookingsLoading } = useSelector((state: RootState) => state.booking);
  
  // State for selected exhibition
  const [selectedExhibition, setSelectedExhibition] = useState<string | null>(null);
  
  // State for amenities data
  const [basicAmenities, setBasicAmenities] = useState<any[]>([]);
  const [extraAmenities, setExtraAmenities] = useState<any[]>([]);
  const [calculatedAmenities, setCalculatedAmenities] = useState<any[]>([]);
  
  // State for complete booking data (with full details including amenities)
  const [completeBookings, setCompleteBookings] = useState<any[]>([]);
  const [loadingCompleteBookings, setLoadingCompleteBookings] = useState<boolean>(false);
  
  // State for stall types
  const [stallTypes, setStallTypes] = useState<Record<string, string>>({});
  const [loadingStallTypes, setLoadingStallTypes] = useState<boolean>(false);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // State for filters
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  
  // State for stats
  const [bookedStalls, setBookedStalls] = useState<number>(0);
  const [totalCalculatedAmenities, setTotalCalculatedAmenities] = useState<number>(0);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>('basic');
  
  // State for amenity view type in calculated tab
  const [amenityViewType, setAmenityViewType] = useState<'basic' | 'extra' | 'all'>('basic');

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchExhibitions());
    dispatch(fetchBookings({
      page: 1,
      limit: 100 // Use a larger limit to try to get all bookings in one request
    }));
  }, [dispatch]);

  // Function to fetch complete booking data with all fields and pagination
  const fetchCompleteBookingData = async (exhibitionId: string, page = 1, pageSize = 10) => {
    try {
      setLoadingCompleteBookings(true);
      
      // Fetch all bookings for this exhibition with complete details and pagination
      const response = await api.get(`/bookings`, {
        params: {
          exhibitionId,
          includeDetails: true,
          populate: 'stallIds.stallTypeId', // Ensure stallTypeId is fully populated
          page,
          limit: pageSize
        }
      });
      
      if (response && response.data) {
        // Transform stalls to include type from stallTypeId like in the booking controller
        const transformedBookings = response.data.data.map((booking: any) => {
          const bookingObj = {...booking};
          if (bookingObj.stallIds) {
            bookingObj.stallIds = bookingObj.stallIds.map((stall: any) => {
              if (stall.stallTypeId && typeof stall.stallTypeId === 'object') {
                // Add the type field based on stallTypeId name
                stall.type = stall.stallTypeId.name;
              }
              return stall;
            });
          }
          return bookingObj;
        });
        
        // Update bookings data with transformed data
        const filteredBookings = transformedBookings.filter(
          (booking: any) => booking.exhibitionId._id === exhibitionId && 
          ['confirmed', 'approved'].includes(booking.status)
        );
        
        setCompleteBookings(filteredBookings);
        
        // Update pagination info
        setPagination({
          current: response.data.pagination.page,
          pageSize: response.data.pagination.limit,
          total: response.data.pagination.total
        });
      } else {
        setCompleteBookings([]);
        setPagination({
          current: 1,
          pageSize: 10,
          total: 0
        });
      }
    } catch (error) {
      console.error('Error fetching complete booking data:', error);
      setCompleteBookings([]);
      setPagination({
        current: 1,
        pageSize: 10,
        total: 0
      });
    } finally {
      setLoadingCompleteBookings(false);
    }
  };

  // When exhibition is selected, load its amenities
  useEffect(() => {
    if (selectedExhibition && exhibitions.length > 0) {
      const exhibition = exhibitions.find(e => e._id === selectedExhibition);
      if (exhibition) {
        // Set basic and extra amenities from the selected exhibition
        setBasicAmenities(exhibition.basicAmenities || []);
        setExtraAmenities(exhibition.amenities || []);

        // Fetch complete booking data for this exhibition
        fetchCompleteBookingData(selectedExhibition, pagination.current, pagination.pageSize);
      }
    } else {
      setBasicAmenities([]);
      setExtraAmenities([]);
      setCalculatedAmenities([]);
      setBookedStalls(0);
      setTotalCalculatedAmenities(0);
      setCompleteBookings([]);
    }
  }, [selectedExhibition, exhibitions]);
        
  // Process booking data to calculate amenities
  useEffect(() => {
    if (selectedExhibition && exhibitions.length > 0 && completeBookings.length > 0) {
      const exhibition = exhibitions.find(e => e._id === selectedExhibition);
      if (exhibition) {
        // Process all stalls from the bookings
        const stallsFromBookings = completeBookings.flatMap(
          booking => booking.stallIds.map((stall: any) => {
            // Use the stall's type property from the populated data, or fall back to stall types map without 'Standard' fallback
            const stallTypeName = stall.type || (stall.stallTypeId && typeof stall.stallTypeId === 'object' ? 
              stall.stallTypeId.name : stallTypes[stall.stallTypeId]) || '-';
            
            return {
              stallId: stall._id,
              stallNumber: stall.number,
              bookingId: booking._id,
              exhibitorName: booking.companyName,
              bookingDate: booking.createdAt,
              dimensions: stall.dimensions,
              area: stall.dimensions.width * stall.dimensions.height,
              status: booking.status,
              stallType: stallTypeName
            };
          })
        );
        
        // Process basic amenities from real booking data
        const calculatedBasic = completeBookings
          .flatMap(booking => {
            if (!booking.basicAmenities || booking.basicAmenities.length === 0) {
              // If no basicAmenities in booking, calculate them from exhibition settings
              // for each stall based on area
              return booking.stallIds.flatMap((stall: any) => {
                const stallArea = stall.dimensions.width * stall.dimensions.height;
                // Use the stall's type property from the populated data, or fall back to stall types map without 'Standard' fallback
                const stallTypeName = stall.type || (stall.stallTypeId && typeof stall.stallTypeId === 'object' ? 
                  stall.stallTypeId.name : stallTypes[stall.stallTypeId]) || '-';
                
                return (exhibition.basicAmenities || []).map(amenity => {
                  const calculatedQuantity = Math.floor(stallArea / amenity.perSqm) * amenity.quantity;
                  return {
                    ...amenity,
                    calculatedQuantity: calculatedQuantity > 0 ? calculatedQuantity : amenity.quantity,
                    stallId: stall._id,
                    stallNumber: stall.number,
                    bookingId: booking._id,
                    exhibitorId: booking.exhibitorId || '',
                    exhibitorName: booking.companyName,
                    bookingDate: booking.createdAt,
                    dimensions: stall.dimensions,
                    area: stallArea,
                    bookingStatus: booking.status,
                    stallType: stallTypeName
                  };
                });
              });
            } else {
              // Use the booking's basicAmenities data
              return booking.basicAmenities.flatMap((amenity: any) => 
                booking.stallIds.map((stall: any) => {
                  // Use the stall's type property from the populated data, or fall back to stall types map without 'Standard' fallback
                  const stallTypeName = stall.type || (stall.stallTypeId && typeof stall.stallTypeId === 'object' ? 
                    stall.stallTypeId.name : stallTypes[stall.stallTypeId]) || '-';
                  
                  return {
                    ...amenity,
                    stallId: stall._id,
                    stallNumber: stall.number,
                    bookingId: booking._id,
                    exhibitorId: booking.exhibitorId || '',
                    exhibitorName: booking.companyName,
                    bookingDate: booking.createdAt,
                    dimensions: stall.dimensions,
                    area: stall.dimensions.width * stall.dimensions.height,
                    bookingStatus: booking.status,
                    stallType: stallTypeName
                  };
                })
              );
            }
          });
        
        // Process extra amenities from real booking data
        const calculatedExtra = completeBookings
          .flatMap(booking => {
            if (!booking.extraAmenities || booking.extraAmenities.length === 0) {
              return []; // No extra amenities for this booking
            }
            
            return booking.extraAmenities.flatMap((amenity: any) => 
              booking.stallIds.map((stall: any) => {
                // Use the stall's type property from the populated data, or fall back to stall types map without 'Standard' fallback
                const stallTypeName = stall.type || (stall.stallTypeId && typeof stall.stallTypeId === 'object' ? 
                  stall.stallTypeId.name : stallTypes[stall.stallTypeId]) || '-';
                
                return {
                  ...amenity,
                  booked: true,
                  stallId: stall._id,
                  stallNumber: stall.number,
                  bookingId: booking._id,
                  exhibitorId: booking.exhibitorId || '',
                  exhibitorName: booking.companyName,
                  bookingDate: booking.createdAt,
                  dimensions: stall.dimensions,
                  area: stall.dimensions.width * stall.dimensions.height,
                  bookingStatus: booking.status,
                  stallType: stallTypeName,
                  // Add these fields to clearly mark them as extra amenities
                  isExtraAmenity: true,
                  // Ensure quantity from the original booking is preserved
                  quantity: amenity.quantity || 1 // Make sure we use the actual quantity from the booking
                };
              })
            );
          });
        
        // If no extra amenities were found, create simulated ones from the exhibition data
        let finalCalculatedExtra = calculatedExtra;
        
        if (calculatedExtra.length === 0 && exhibition.amenities && exhibition.amenities.length > 0) {
          // Get the stalls from bookings
          const bookedStalls = completeBookings.flatMap(booking => booking.stallIds);
          
          // Create simulated extra amenities by associating exhibition amenities with booked stalls
          finalCalculatedExtra = bookedStalls.flatMap((stall: any, stallIndex: number) => 
            (exhibition.amenities || []).map((amenity: any, amenityIndex: number) => {
              // Find the booking that contains this stall
              const matchingBooking = completeBookings.find(b => 
                b.stallIds.some((s: any) => s._id === stall._id)
              );
              
              // Check if this booking has this amenity in its extraAmenities
              const matchingAmenity = matchingBooking?.extraAmenities?.find((a: any) => a.name === amenity.name);
              const wasBooked = !!matchingAmenity;
              
              // Create a unique ID for this simulated amenity
              const simulatedId = `sim-${stallIndex}-${amenityIndex}-${Date.now()}`;
              
              // Use the stall's type property from the populated data, or fall back to stall types map without 'Standard' fallback
              const stallTypeName = stall.type || (stall.stallTypeId && typeof stall.stallTypeId === 'object' ? 
                stall.stallTypeId.name : stallTypes[stall.stallTypeId]) || '-';
              
              return {
                ...amenity,
                id: simulatedId,
                booked: wasBooked,
                stallId: stall._id,
                stallNumber: stall.number,
                bookingId: matchingBooking?._id || '',
                exhibitorId: matchingBooking?.exhibitorId || '',
                exhibitorName: matchingBooking?.companyName || 'Unknown',
                bookingDate: matchingBooking?.createdAt || new Date().toISOString(),
                dimensions: stall.dimensions,
                area: stall.dimensions.width * stall.dimensions.height,
                bookingStatus: matchingBooking?.status || 'approved',
                stallType: stallTypeName,
                isExtraAmenity: true,
                // Use the actual quantity from the booking if available, or 0 if not booked
                quantity: wasBooked ? (matchingAmenity?.quantity || 1) : 0
              };
            })
          );
        }
        
        // Combine the amenities arrays and set state
        setCalculatedAmenities([...calculatedBasic, ...finalCalculatedExtra]);
        setBookedStalls(stallsFromBookings.length);
        setTotalCalculatedAmenities(calculatedBasic.length + finalCalculatedExtra.length);
      }
    } else if (selectedExhibition && exhibitions.length > 0) {
      // If we have an exhibition but no bookings, reset the calculated amenities
      setCalculatedAmenities([]);
      setBookedStalls(0);
      setTotalCalculatedAmenities(0);
    }
  }, [selectedExhibition, exhibitions, completeBookings, stallTypes]);

  // Filter amenities based on search and filters
  const filteredBasicAmenities = useMemo(() => {
    let filtered = basicAmenities;
    
    // Apply type filter
    if (typeFilter.length > 0) {
      filtered = filtered.filter(amenity => typeFilter.includes(amenity.type));
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(amenity => 
        amenity.name.toLowerCase().includes(query) ||
        amenity.type.toLowerCase().includes(query) ||
        (amenity.description && amenity.description.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [basicAmenities, typeFilter, searchQuery]);

  const filteredExtraAmenities = useMemo(() => {
    let filtered = extraAmenities;
    
    // Apply type filter
    if (typeFilter.length > 0) {
      filtered = filtered.filter(amenity => typeFilter.includes(amenity.type));
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(amenity => 
        amenity.name.toLowerCase().includes(query) ||
        amenity.type.toLowerCase().includes(query) ||
        (amenity.description && amenity.description.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [extraAmenities, typeFilter, searchQuery]);

  const filteredCalculatedAmenities = useMemo(() => {
    let filtered = calculatedAmenities;
    
    // Apply type filter
    if (typeFilter.length > 0) {
      filtered = filtered.filter(amenity => typeFilter.includes(amenity.type));
    }
    
    // Apply status filter
    if (bookingStatusFilter.length > 0) {
      filtered = filtered.filter(amenity => {
        // Filter by booking status
        return bookingStatusFilter.includes(amenity.bookingStatus);
      });
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(amenity => 
        amenity.name.toLowerCase().includes(query) ||
        amenity.type.toLowerCase().includes(query) ||
        (amenity.description && amenity.description.toLowerCase().includes(query)) ||
        (amenity.stallNumber && amenity.stallNumber.toLowerCase().includes(query)) ||
        (amenity.exhibitorName && amenity.exhibitorName.toLowerCase().includes(query))
      );
    }
    
    // Apply date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day');
      const endDate = dateRange[1].endOf('day');
      
      filtered = filtered.filter(amenity => {
        if (!amenity.bookingDate) return false;
        const bookingDate = dayjs(amenity.bookingDate);
        return bookingDate.isAfter(startDate) && bookingDate.isBefore(endDate);
      });
    }
    
    return filtered;
  }, [calculatedAmenities, typeFilter, bookingStatusFilter, searchQuery, dateRange]);

  // Reset all filters
  const resetFilters = () => {
    setTypeFilter([]);
    setBookingStatusFilter([]);
    setSearchQuery('');
    setDateRange(null);
  };

  // Export basic amenities to Excel
  const exportBasicAmenities = () => {
    if (filteredBasicAmenities.length === 0) {
      message.warning('No basic amenities to export');
      return;
    }

    const dataToExport = filteredBasicAmenities.map(amenity => ({
      Name: amenity.name,
      Type: amenity.type,
      Description: amenity.description || '',
      'Per Sq. Meter': amenity.perSqm,
      'Quantity Per Unit': amenity.quantity,
      ID: amenity._id || amenity.id
    }));

    const exhibition = exhibitions.find(e => e._id === selectedExhibition);
    const fileName = `${exhibition?.name || 'Exhibition'}_Basic_Amenities`;
    
    exportToExcel(dataToExport, fileName);
    message.success('Basic amenities exported successfully');
  };

  // Export extra amenities to Excel
  const exportExtraAmenities = () => {
    if (filteredExtraAmenities.length === 0) {
      message.warning('No extra amenities to export');
      return;
    }

    const dataToExport = filteredExtraAmenities.map(amenity => ({
      Name: amenity.name,
      Type: amenity.type,
      Description: amenity.description || '',
      Rate: amenity.rate,
      ID: amenity._id || amenity.id
    }));

    const exhibition = exhibitions.find(e => e._id === selectedExhibition);
    const fileName = `${exhibition?.name || 'Exhibition'}_Extra_Amenities`;
    
    exportToExcel(dataToExport, fileName);
    message.success('Extra amenities exported successfully');
  };
  
  // Export calculated amenities to Excel
  const exportCalculatedAmenities = () => {
    if (filteredCalculatedAmenities.length === 0) {
      message.warning('No calculated amenities to export');
      return;
    }

    // Create a map to organize amenities by stall (similar to what happens in AmenitiesTable)
    const stallMap = new Map();
    
    // Filter amenities based on the current view type
    const viewFilteredAmenities = filteredCalculatedAmenities.filter(amenity => {
      if (amenityViewType === 'all') {
        return true;
      } else if (amenityViewType === 'basic') {
        // Only include basic amenities (with calculatedQuantity or perSqm)
        return amenity.hasOwnProperty('calculatedQuantity') || 
               amenity.hasOwnProperty('perSqm');
      } else if (amenityViewType === 'extra') {
        // Only include extra amenities (with rate but no perSqm)
        return amenity.hasOwnProperty('rate') && 
               !amenity.hasOwnProperty('perSqm');
      }
      return true;
    });
    
    // Process all amenities - focus on real data
    viewFilteredAmenities.forEach(amenity => {
      // Only process if amenity has stall info
      if (amenity.stallId && amenity.stallNumber) {
        // Check if this stall already exists in our map
        if (!stallMap.has(amenity.stallId)) {
          // Add null checks for dimensions
          const dimensions = amenity.dimensions || { width: 0, height: 0 };
          const area = amenity.area || 
            (dimensions.width && dimensions.height ? dimensions.width * dimensions.height : 0);
          
          // Create stall entry if it doesn't exist
          stallMap.set(amenity.stallId, {
            'Company Name': amenity.exhibitorName || 'Unknown',
            'Stall No.': amenity.stallNumber,
            'Dimension': dimensions ? `${dimensions.width}x${dimensions.height}m` : '-',
            'Stall Type': amenity.stallType || '-',
            'Area (SQM)': typeof area === 'number' ? area : 0,
            'Booking Date': amenity.bookingDate ? new Date(amenity.bookingDate).toLocaleDateString() : '-',
            'Booking Status': amenity.bookingStatus || '-'
          });
        }
        
        // Get stall and add this amenity
        const stall = stallMap.get(amenity.stallId);
        
        // Add amenity based on type
        if (amenity.hasOwnProperty('calculatedQuantity')) {
          // For basic amenities with calculated quantities
          stall[amenity.name] = amenity.calculatedQuantity;
        } else if (amenity.hasOwnProperty('perSqm')) {
          // Fallback calculation if calculatedQuantity is not provided for basic amenities
          const stallArea = typeof stall['Area (SQM)'] === 'number' ? stall['Area (SQM)'] : 0;
          const calculatedQuantity = Math.floor(stallArea / amenity.perSqm) * amenity.quantity;
          stall[amenity.name] = calculatedQuantity > 0 ? calculatedQuantity : amenity.quantity;
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
          
          stall[amenity.name] = quantity; // Use actual quantity from booking
        } else if (amenity.hasOwnProperty('rate')) {
          // For extra amenities with rate (available but not booked)
          stall[amenity.name] = 0; // Show as 0 instead of checkmark
        }
      }
    });
    
    // Convert map to array 
    const dataToExport = Array.from(stallMap.values());

    const exhibition = exhibitions.find(e => e._id === selectedExhibition);
    const viewTypeName = amenityViewType === 'basic' ? 'Basic' : amenityViewType === 'extra' ? 'Extra' : 'All';
    const fileName = `${exhibition?.name || 'Exhibition'}_${viewTypeName}_Calculated_Amenities`;
    
    exportToExcel(dataToExport, fileName);
    message.success(`${viewTypeName} calculated amenities exported successfully`);
  };

  // Handle pagination changes
  const handlePaginationChange = (page: number, pageSize?: number) => {
    const newPageSize = pageSize || pagination.pageSize;
    setPagination({
      ...pagination,
      current: page,
      pageSize: newPageSize
    });
    
    if (selectedExhibition) {
      fetchCompleteBookingData(selectedExhibition, page, newPageSize);
    }
  };

  // Add a function to fetch stall types
  const fetchStallTypes = async () => {
    try {
      setLoadingStallTypes(true);
      // Import and use the stallService
      const { default: stallService } = await import('../../services/stall');
      const response = await stallService.getStallTypes();
      
      if (response && response.data) {
        // Create a map of stall type IDs to names
        const typeMap: Record<string, string> = {};
        response.data.forEach(type => {
          if (type._id) {
            typeMap[type._id] = type.name;
          }
        });
        setStallTypes(typeMap);
      }
    } catch (error) {
      console.error('Error fetching stall types:', error);
    } finally {
      setLoadingStallTypes(false);
    }
  };

  // Call fetchStallTypes when exhibition is selected
  useEffect(() => {
    if (selectedExhibition) {
      fetchStallTypes();
    }
  }, [selectedExhibition]);

  return (
    <div className="amenities-container">
      {/* Header Section */}
      <div className="amenities-header">
        <Title level={4} className="amenities-title">Amenities Management</Title>
        <Text type="secondary">View, filter, and export amenities data. See calculated amenities for booked stalls.</Text>
      </div>

      {/* Filters Section */}
      <AmenitiesFilter
        exhibitionId={selectedExhibition}
        exhibitions={exhibitions}
        exhibitionsLoading={loading}
        onExhibitionChange={setSelectedExhibition}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        bookingStatusFilter={bookingStatusFilter}
        setBookingStatusFilter={setBookingStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dateRange={dateRange}
        setDateRange={setDateRange}
        resetFilters={resetFilters}
      />
      
      {/* Stats Section */}
      {selectedExhibition && (
        <div style={{ marginBottom: 24 }}>
          <AmenitiesStats
            basicAmenities={basicAmenities}
            extraAmenities={extraAmenities}
            bookedStalls={bookedStalls}
            calculatedAmenities={totalCalculatedAmenities}
          />
        </div>
      )}
      
      {/* Tabs for Different Amenity Views */}
      {selectedExhibition ? (
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          className="amenities-tabs"
          items={[
            {
              key: "basic",
              label: (
                <span>
                  <BookOutlined />
                  Basic Amenities
                </span>
              ),
              children: (
                <AmenitiesTable
                  title="Basic Amenities"
                  amenities={filteredBasicAmenities}
                  loading={loading}
                  onExport={exportBasicAmenities}
                  exhibitionId={selectedExhibition}
                />
              )
            },
            {
              key: "extra",
              label: (
                <span>
                  <AppstoreOutlined />
                  Extra Amenities
                </span>
              ),
              children: (
                <AmenitiesTable
                  title="Additional Amenities"
                  amenities={filteredExtraAmenities}
                  loading={loading}
                  onExport={exportExtraAmenities}
                  exhibitionId={selectedExhibition}
                />
              )
            },
            {
              key: "calculated",
              label: (
                <span>
                  <CalculatorOutlined />
                  Calculated Amenities
                </span>
              ),
              children: (
                <>
                  <Row gutter={[0, 16]}>
                    <Col span={24}>
                      <Card className="filter-card">
                        <Space>
                          <Text strong>View: </Text>
                          <Radio.Group 
                            value={amenityViewType}
                            onChange={e => setAmenityViewType(e.target.value)}
                            optionType="button"
                            buttonStyle="solid"
                          >
                            <Radio.Button value="basic">Basic Amenities</Radio.Button>
                            <Radio.Button value="extra">Extra Amenities</Radio.Button>
                            <Radio.Button value="all">All Amenities</Radio.Button>
                          </Radio.Group>
                        </Space>
                      </Card>
                    </Col>
                  </Row>
                  
                  <AmenitiesTable
                    title="Calculated Amenities"
                    amenities={filteredCalculatedAmenities}
                    loading={loading}
                    onExport={exportCalculatedAmenities}
                    isDynamicColumns={true}
                    isCalculated={true}
                    exhibitionId={selectedExhibition}
                    amenityViewType={amenityViewType}
                  />
                </>
              )
            }
          ]}
        />
      ) : (
        <div style={{ marginTop: 24, textAlign: 'center', padding: 48, background: '#fff', borderRadius: 8 }}>
          <Empty 
            description="Please select an exhibition to view amenities" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      )}
    </div>
  );
};

export default AmenitiesPage; 