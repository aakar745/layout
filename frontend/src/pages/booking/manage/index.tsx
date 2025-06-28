/**
 * Booking Management Component
 * 
 * This component provides a comprehensive interface for managing stall bookings with features:
 * - Booking list with filtering and search
 * - Booking status management
 * - Statistics dashboard
 * - Detailed booking information
 * - Actions (View, Update Status, Delete)
 */

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Card, Space, Button, Row, Col,
  Typography, message
} from 'antd';
import { 
  PlusOutlined, DownloadOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchBookings, deleteBooking, Exhibition, fetchBookingStats } from '../../../store/slices/bookingSlice';
import { fetchExhibition, fetchExhibitions, fetchActiveExhibitions } from '../../../store/slices/exhibitionSlice';
import { useNavigate } from 'react-router-dom';
import { useGetInvoicesQuery } from '../../../store/services/invoice';
import BookingStatistics from './BookingStatistics';
import BookingFilters from './BookingFilters';
import { BookingType, BookingStatus, FilterState } from './types';
import '../../dashboard/Dashboard.css';
import { usePermission } from '../../../hooks/reduxHooks';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import BookingTable from './BookingTable';
import { BookingDetailsModal, StatusUpdateModal } from './BookingModals';

// Inline utility function to calculate stall area
const calculateStallArea = (dimensions: any) => {
  if (!dimensions) return 0;
  
  const shapeType = dimensions.shapeType || 'rectangle';
  
  if (shapeType === 'rectangle') {
    return dimensions.width * dimensions.height;
  }
  
  if (shapeType === 'l-shape' && dimensions.lShape) {
    const { rect1Width, rect1Height, rect2Width, rect2Height } = dimensions.lShape;
    return (rect1Width * rect1Height) + (rect2Width * rect2Height);
  }
  
  // Fallback to rectangle
  return dimensions.width * dimensions.height;
};

const { Title, Text } = Typography;

/**
 * Main booking management component
 * Provides functionality for:
 * - Viewing and filtering bookings
 * - Managing booking statuses
 * - Accessing detailed booking information
 * - Generating statistics
 */
const StallBookingManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, loading, pagination, stats, statsLoading } = useSelector((state: RootState) => state.booking);
  const { exhibitions, activeExhibitions } = useSelector((state: RootState) => state.exhibition);
  const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>('pending');
  const [rejectionReasonText, setRejectionReasonText] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: [],
    dateRange: null,
    exhibition: null
  });
  const navigate = useNavigate();
  const { data: invoices, isLoading: isLoadingInvoices, error: invoiceError, refetch: refetchInvoices } = useGetInvoicesQuery({ 
    page: 1, 
    limit: 200 
  }, {
    // More aggressive cache invalidation for fresher data
    refetchOnMountOrArgChange: 10, // Refetch if data is older than 10 seconds
    refetchOnFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when connection is restored
  });
  const { hasPermission } = usePermission();

  // Function to fetch bookings with pagination and filters
  const fetchBookingsWithPagination = useCallback((page = 1, pageSize = 10, customFilters?: FilterState) => {
    const activeFilters = customFilters || filters;
    const params: any = { page, limit: pageSize };
    
    // Add filter parameters
    if (activeFilters.search) {
      params.search = activeFilters.search;
    }
    
    if (activeFilters.exhibition) {
      params.exhibitionId = activeFilters.exhibition;
    }
    
    if (activeFilters.status && activeFilters.status.length > 0) {
      params.status = activeFilters.status;
    }
    
    if (activeFilters.dateRange && activeFilters.dateRange.length === 2) {
      params.startDate = activeFilters.dateRange[0];
      params.endDate = activeFilters.dateRange[1];
    }
    
    dispatch(fetchBookings(params));
  }, [dispatch, filters]);
  
  // Fetch booking stats separately to ensure accurate counts
  const fetchStats = useCallback((exhibitionFilter?: string) => {
    const params = exhibitionFilter ? { exhibitionId: exhibitionFilter } : {};
    dispatch(fetchBookingStats(params));
  }, [dispatch]);

  // Define refresh function that updates both bookings and stats
  const refreshAfterAction = useCallback(() => {
    fetchBookingsWithPagination(pagination.page, pagination.limit);
    fetchStats(filters.exhibition || undefined);
  }, [fetchBookingsWithPagination, fetchStats, pagination.page, pagination.limit, filters.exhibition]);

  // Initial fetch of bookings and stats on component mount
  useEffect(() => {
    fetchBookingsWithPagination(pagination.page, pagination.limit);
    fetchStats(filters.exhibition || undefined);
  }, [fetchBookingsWithPagination, fetchStats, pagination.page, pagination.limit, filters.exhibition]);

  // First, fetch all exhibitions to ensure we have the complete list
  useEffect(() => {
    dispatch(fetchExhibitions());
    // Also fetch active exhibitions for the filter dropdown
    dispatch(fetchActiveExhibitions());
  }, [dispatch]);

  // Then fetch details for the current exhibition when needed
  useEffect(() => {
    if (bookings.length > 0) {
      // Get unique exhibition IDs from all bookings
      const uniqueExhibitionIds = [...new Set(bookings.map(b => b.exhibitionId._id))];
      
      // Fetch details for each unique exhibition
      uniqueExhibitionIds.forEach(exhibitionId => {
        dispatch(fetchExhibition(exhibitionId));
      });
    }
  }, [bookings, dispatch]);

  // Handle search filter with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBookingsWithPagination(1, pagination.limit);
    }, filters.search ? 500 : 0); // No delay when clearing search

    return () => clearTimeout(timeoutId);
  }, [filters.search, fetchBookingsWithPagination, pagination.limit]);

  /**
   * Deletes a booking
   * - Requires confirmation
   * - Updates stall availability
   * - Removes booking and related invoice
   */
  const handleDelete = async (bookingId: string) => {
    try {
      await dispatch(deleteBooking(bookingId)).unwrap();
      message.success('Booking deleted successfully');
      refreshAfterAction();
    } catch (error: any) {
      message.error(error?.message || 'Failed to delete booking');
    }
  };

  // Handle filter changes
  const handleFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Reset to first page when filters change and pass the new filters directly
    fetchBookingsWithPagination(1, pagination.limit, newFilters);
    // Update stats with the new exhibition filter
    fetchStats(newFilters.exhibition || undefined);
  };

  // Ensure bookings is an array and filter out bookings from inactive exhibitions
  const allBookingsArray = Array.isArray(bookings) ? bookings : [];
  
  // Filter bookings to only show those from active exhibitions
  const bookingsArray = allBookingsArray.filter(booking => {
    const exhibition = exhibitions.find(e => e._id === booking.exhibitionId._id);
    return exhibition && exhibition.status === 'published' && exhibition.isActive;
  });

  // Apply current filters to bookings for statistics (same logic as table filtering)
  const filteredBookingsForStats = bookingsArray.filter(booking => {
    // Filter by selected exhibition
    if (filters.exhibition) {
      const exhibitionId = typeof booking.exhibitionId === 'string' 
        ? booking.exhibitionId 
        : booking.exhibitionId._id;
      if (exhibitionId !== filters.exhibition) {
        return false;
      }
    }

    // Filter by selected status
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(booking.status)) {
        return false;
      }
    }

    // Filter by date range
    if (filters.dateRange && filters.dateRange.length === 2) {
      const bookingDate = new Date(booking.createdAt);
      const startDate = new Date(filters.dateRange[0]);
      const endDate = new Date(filters.dateRange[1]);
      if (bookingDate < startDate || bookingDate > endDate) {
        return false;
      }
    }

    // Filter by search text
    if (filters.search) {
      const searchText = filters.search.toLowerCase();
      const searchableText = [
        booking.companyName,
        booking.customerName,
        booking.customerEmail,
        booking.customerPhone
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchText)) {
        return false;
      }
    }

    return true;
  });

  /**
   * Formats a booking ID into a user-friendly booking number using the exhibition's invoice prefix
   */
  const formatBookingNumber = (id: string, createdAt: string): string => {
    // Handle invalid date
    const createdDate = new Date(createdAt);
    if (isNaN(createdDate.getTime())) {
      return `--/--/--`;
    }
    
    const year = createdDate.getFullYear();
    
    // Find the current booking's exhibition - check both arrays for export functionality
    let booking = bookingsArray.find(b => b._id === id) as BookingType | undefined;
    
    // If not found in filtered array, it might be from export data
    if (!booking) {
      booking = allBookingsArray.find(b => b._id === id) as BookingType | undefined;
    }
    
    if (!booking || !booking.exhibitionId) {
      return `--/${year}/--`;
    }

    // Get exhibition ID safely
    const exhibitionId = typeof booking.exhibitionId === 'string' 
      ? booking.exhibitionId 
      : booking.exhibitionId._id;
    if (!exhibitionId) {
      return `--/${year}/--`;
    }

    // Get all bookings for this specific exhibition, sorted by creation date
    const exhibitionBookings = allBookingsArray
      .filter(b => {
        const bExhibitionId = typeof b.exhibitionId === 'string' 
          ? b.exhibitionId 
          : b.exhibitionId?._id;
        return bExhibitionId === exhibitionId;
      })
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    // Find the sequence number by getting this booking's position in the sorted array
    const sequenceNum = exhibitionBookings.findIndex(b => b._id === id) + 1;
    if (sequenceNum === 0) {
      return `--/${year}/--`;
    }
    
    // Pad the sequence number to 2 digits (01, 02, etc.)
    const sequence = sequenceNum.toString().padStart(2, '0');
    
    // Get the exhibition details from the Redux store
    const exhibition = exhibitions.find(e => e._id === exhibitionId) as Exhibition | undefined;
    
    // Use exhibition's invoice prefix or fall back to booking's exhibition prefix or 'BK'
    const prefix = exhibition?.invoicePrefix || 
                   (booking.exhibitionId as Exhibition)?.invoicePrefix || 
                   'BK';
    
    return `${prefix}/${year}/${sequence}`;
  };

  /**
   * Exports booking data to Excel file
   * Processes all current filtered bookings and formats them for export
   */
  const handleExportBookings = async () => {
    try {
      message.loading({ content: 'Preparing export...', key: 'export' });
      
      // Ensure exhibitions are loaded before proceeding
      if (!exhibitions || exhibitions.length === 0) {
        message.warning('Exhibitions data is still loading. Please wait and try again.');
        message.destroy('export');
        return;
      }
      
      // Prepare export parameters - use current filters
      const params: any = {};
      
      if (filters.search) {
        params.search = filters.search;
      }
      
      if (filters.exhibition) {
        params.exhibitionId = filters.exhibition;
      }
      
      if (filters.status && filters.status.length > 0) {
        params.status = filters.status;
      }
      
      if (filters.dateRange && filters.dateRange.length === 2) {
        params.startDate = filters.dateRange[0];
        params.endDate = filters.dateRange[1];
      }
      
      // Use the API client instead of direct fetch to ensure proper authentication
      // Import the api client from services directory
      const api = (await import('../../../services/api')).default;
      
      // Fetch data for export using the dedicated export endpoint with proper authentication
      const response = await api.get('/bookings/export', { params });
      const result = response.data;
      
      if (!Array.isArray(result)) {
        throw new Error('Invalid data format received');
      }
      
      // Filter out bookings from inactive exhibitions before formatting
      const filteredBookings = result.filter((booking: BookingType) => {
        // Handle different possible structures of exhibitionId
        const exhibitionId = typeof booking.exhibitionId === 'string' 
          ? booking.exhibitionId 
          : booking.exhibitionId?._id;
        if (!exhibitionId || !exhibitions || exhibitions.length === 0) {
          // If we can't determine the exhibition or exhibitions aren't loaded, include the booking
          return true;
        }
        
        const exhibition = exhibitions.find(e => e._id === exhibitionId);
        return exhibition && exhibition.status === 'published' && exhibition.isActive;
      });
      
      // Format booking data for Excel
      const exportData = filteredBookings.map((booking: BookingType) => {
        // Safely handle stallIds array
        const stallIds = booking.stallIds || [];
        
        // Calculate total area for all stalls
        const totalArea = stallIds.reduce(
          (sum, stall) => {
            if (!(stall as any)?.dimensions) return sum;
            return sum + calculateStallArea((stall as any).dimensions);
          }, 
          0
        );
        
        return {
          'Booking Number': formatBookingNumber(booking._id, booking.createdAt),
          'Exhibition': booking.exhibitionId?.name || 'Unknown Exhibition',
          'Company Name': booking.companyName || 'N/A',
          'Customer Name': booking.customerName,
          'Customer Email': booking.customerEmail,
          'Customer Phone': booking.customerPhone,
          'Stall Numbers': stallIds.length > 0 ? stallIds.map(stall => stall?.number || 'N/A').join(', ') : 'No stalls',
          'Stall Types': stallIds.length > 0 ? Array.from(new Set(stallIds.map(stall => 
            stall?.type || ((stall as any)?.stallTypeId && typeof (stall as any).stallTypeId === 'object' ? 
            (stall as any).stallTypeId.name : '-')
          ))).join(', ') : 'No types',
          'Dimensions': stallIds.length > 0 ? stallIds.map(stall => {
              const dimensions = (stall as any)?.dimensions;
              if (!dimensions) return 'No dimensions';
              
              return dimensions.shapeType === 'l-shape' 
                ? 'L-Shape' 
                : `${dimensions.width}m × ${dimensions.height}m`;
            }).join(', ') : 'No dimensions',
          'Total Area (sqm)': Math.round(totalArea),
          'Base Amount': Math.round(booking.calculations?.totalBaseAmount || 0),
          'Discount': Math.round(booking.calculations?.totalDiscountAmount || 0),
          'Total Amount': Math.round(booking.calculations?.totalAmount || booking.amount || 0),
          'Status': booking.status?.toUpperCase() || 'UNKNOWN',
          'Booked By': booking.bookingSource === 'exhibitor' && booking.exhibitorId ? 
            `${booking.exhibitorId?.contactPerson || 'Unknown'} (Exhibitor)` : 
            booking.userId ? 
              `${booking.userId?.name || booking.userId?.username || 'Unknown'} (Admin)` : 
              'System',
          'Created Date': new Date(booking.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        };
      });
      
      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Get formatted date for filename
      const date = new Date().toISOString().split('T')[0];
      
      // Save file
      saveAs(data, `bookings_export_${date}.xlsx`);
      
      message.success({ content: 'Export successful!', key: 'export', duration: 2 });
    } catch (error) {
      console.error('Export error:', error);
      message.error({ content: 'Failed to export bookings', key: 'export', duration: 2 });
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 24]} align="middle">
          <Col flex="auto">
            <Space direction="vertical" size={4}>
              <Title level={4} style={{ margin: 0 }}>Stall Bookings</Title>
              <Text type="secondary">Manage exhibition stall bookings</Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExportBookings}
                size="large"
              >
                Export
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => navigate('/bookings/create')}
              >
                Create Booking
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Statistics */}
      <BookingStatistics 
        bookings={filteredBookingsForStats as unknown as BookingType[]} 
        paginationTotal={filteredBookingsForStats.length} 
        stats={stats}
        statsLoading={statsLoading}
      />

      {/* Filters */}
      <BookingFilters 
        filters={filters} 
        exhibitions={activeExhibitions as any[]}
        onFilterChange={handleFilter}
        onRefresh={refreshAfterAction}
      />

      {/* Table */}
      <Card 
        className="info-card"
        styles={{ 
          body: { padding: 0, overflow: 'auto' },
          header: { paddingBottom: 12 }
        }}
        title="Booking List"
      >
        <BookingTable
          bookings={bookingsArray as unknown as BookingType[]}
          loading={loading}
          fetchBookingsWithPagination={fetchBookingsWithPagination}
          pagination={pagination}
          setSelectedBooking={setSelectedBooking}
          setIsDetailsModalVisible={setIsDetailsModalVisible}
          setIsStatusModalVisible={setIsStatusModalVisible}
          setSelectedStatus={setSelectedStatus}
          setRejectionReasonText={setRejectionReasonText}
          formatBookingNumber={formatBookingNumber}
          handleDelete={handleDelete}
          hasPermission={hasPermission}
        />
      </Card>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        selectedBooking={selectedBooking}
        isDetailsModalVisible={isDetailsModalVisible}
        setIsDetailsModalVisible={setIsDetailsModalVisible}
        setSelectedBooking={setSelectedBooking}
        setIsStatusModalVisible={setIsStatusModalVisible}
        setSelectedStatus={setSelectedStatus}
        setRejectionReasonText={setRejectionReasonText}
        formatBookingNumber={formatBookingNumber}
      />

      {/* Status Update Modal */}
      <StatusUpdateModal
        selectedBooking={selectedBooking}
        isStatusModalVisible={isStatusModalVisible}
        setIsStatusModalVisible={setIsStatusModalVisible}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        rejectionReasonText={rejectionReasonText}
        setRejectionReasonText={setRejectionReasonText}
        formatBookingNumber={formatBookingNumber}
        refreshAfterAction={refreshAfterAction}
      />
    </div>
  );
};

export default StallBookingManager; 