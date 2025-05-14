import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Row, Col, App, Empty, Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchExhibitions } from '../../store/slices/exhibitionSlice';
import { BookOutlined, AppstoreOutlined, CalculatorOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

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
  
  // State for selected exhibition
  const [selectedExhibition, setSelectedExhibition] = useState<string | null>(null);
  
  // State for amenities data
  const [basicAmenities, setBasicAmenities] = useState<any[]>([]);
  const [extraAmenities, setExtraAmenities] = useState<any[]>([]);
  const [calculatedAmenities, setCalculatedAmenities] = useState<any[]>([]);
  
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

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchExhibitions());
  }, [dispatch]);

  // When exhibition is selected, load its amenities
  useEffect(() => {
    if (selectedExhibition && exhibitions.length > 0) {
      const exhibition = exhibitions.find(e => e._id === selectedExhibition);
      if (exhibition) {
        // Set basic and extra amenities from the selected exhibition
        setBasicAmenities(exhibition.basicAmenities || []);
        setExtraAmenities(exhibition.amenities || []);

        // Fake calculated amenities data for demonstration
        // In a real implementation, this would come from an API endpoint
        const stalls = ['A101', 'B205', 'C304', 'D408'];
        const calculatedBasic = (exhibition.basicAmenities || []).flatMap(amenity => {
          return stalls.map((stallNumber, index) => ({
            ...amenity,
            calculatedQuantity: Math.floor(Math.random() * 5) + 1,
            stallNumber,
            stallId: `stall-${index + 1}`,
            bookingId: `booking-${index + 1}`,
            exhibitorId: `exhibitor-${index + 1}`,
            exhibitorName: `Exhibitor ${index + 1}`,
            bookingDate: dayjs().subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD')
          }));
        });
        
        const calculatedExtra = (exhibition.amenities || []).flatMap(amenity => {
          // Only include about half of the amenities as booked
          if (Math.random() > 0.5) return [];
          
          return stalls.slice(0, Math.floor(Math.random() * stalls.length) + 1).map((stallNumber, index) => ({
            ...amenity,
            booked: true,
            stallNumber,
            stallId: `stall-${index + 1}`,
            bookingId: `booking-${index + 1}`,
            exhibitorId: `exhibitor-${index + 1}`,
            exhibitorName: `Exhibitor ${index + 1}`,
            bookingDate: dayjs().subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD')
          }));
        });
        
        setCalculatedAmenities([...calculatedBasic, ...calculatedExtra]);
        setBookedStalls(stalls.length);
        setTotalCalculatedAmenities(calculatedBasic.length + calculatedExtra.length);
      }
    } else {
      setBasicAmenities([]);
      setExtraAmenities([]);
      setCalculatedAmenities([]);
      setBookedStalls(0);
      setTotalCalculatedAmenities(0);
    }
  }, [selectedExhibition, exhibitions]);

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
        // Check if the status filter matches the amenity's status
        // In this example, we're just using "booked" status
        return amenity.booked ? bookingStatusFilter.includes('booked') : bookingStatusFilter.includes('available');
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

    const dataToExport = filteredCalculatedAmenities.map(amenity => {
      // Create a base object with common properties
      const exportObj: Record<string, any> = {
        Name: amenity.name,
        Type: amenity.type,
        Description: amenity.description || '',
        'Stall Number': amenity.stallNumber,
        'Exhibitor': amenity.exhibitorName,
        'Booking Date': amenity.bookingDate
      };
      
      // Add specific properties based on amenity type
      if (amenity.hasOwnProperty('calculatedQuantity')) {
        exportObj['Calculated Quantity'] = amenity.calculatedQuantity;
        exportObj['Per Sq. Meter'] = amenity.perSqm;
        exportObj['Base Quantity'] = amenity.quantity;
      }
      
      if (amenity.hasOwnProperty('rate')) {
        exportObj['Rate'] = amenity.rate;
        exportObj['Booked'] = amenity.booked ? 'Yes' : 'No';
      }
      
      return exportObj;
    });

    const exhibition = exhibitions.find(e => e._id === selectedExhibition);
    const fileName = `${exhibition?.name || 'Exhibition'}_Calculated_Amenities`;
    
    exportToExcel(dataToExport, fileName);
    message.success('Calculated amenities exported successfully');
  };

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
        >
          <TabPane 
            tab={
              <span>
                <BookOutlined />
                Basic Amenities
              </span>
            } 
            key="basic"
          >
            <AmenitiesTable
              title="Basic Amenities"
              amenities={filteredBasicAmenities}
              loading={loading}
              onExport={exportBasicAmenities}
              exhibitionId={selectedExhibition}
            />
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <AppstoreOutlined />
                Extra Amenities
              </span>
            } 
            key="extra"
          >
            <AmenitiesTable
              title="Additional Amenities"
              amenities={filteredExtraAmenities}
              loading={loading}
              onExport={exportExtraAmenities}
              exhibitionId={selectedExhibition}
            />
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <CalculatorOutlined />
                Calculated Amenities
              </span>
            } 
            key="calculated"
          >
            <AmenitiesTable
              title="Calculated Amenities"
              amenities={filteredCalculatedAmenities}
              loading={loading}
              onExport={exportCalculatedAmenities}
              isDynamicColumns={true}
              isCalculated={true}
              exhibitionId={selectedExhibition}
            />
          </TabPane>
        </Tabs>
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