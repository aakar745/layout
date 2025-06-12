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
import { fetchExhibition, fetchExhibitions } from '../../../store/slices/exhibitionSlice';
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
  const { exhibitions } = useSelector((state: RootState) => state.exhibition);
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
  const { data: invoices, isLoading: isLoadingInvoices, error: invoiceError, refetch: refetchInvoices } = useGetInvoicesQuery({ page: 1, limit: 100 });
  const { hasPermission } = usePermission();

  // Function to fetch bookings with pagination and filters
  const fetchBookingsWithPagination = useCallback((page = 1, pageSize = 10) => {
    const params: any = { page, limit: pageSize };
    
    // Add filter parameters
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
    
    dispatch(fetchBookings(params));
  }, [dispatch, filters]);
  
  // Fetch booking stats separately to ensure accurate counts
  const fetchStats = useCallback(() => {
    dispatch(fetchBookingStats());
  }, [dispatch]);

  // Define refresh function that updates both bookings and stats
  const refreshAfterAction = useCallback(() => {
    fetchBookingsWithPagination(pagination.page, pagination.limit);
    fetchStats();
  }, [fetchBookingsWithPagination, fetchStats, pagination.page, pagination.limit]);

  // Initial fetch of bookings and stats on component mount
  useEffect(() => {
    fetchBookingsWithPagination(pagination.page, pagination.limit);
    fetchStats();
  }, [fetchBookingsWithPagination, fetchStats, pagination.page, pagination.limit]);

  // First, fetch all exhibitions to ensure we have the complete list
  useEffect(() => {
    dispatch(fetchExhibitions());
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
    // Reset to first page when filters change
    fetchBookingsWithPagination(1, pagination.limit);
  };

  // Ensure bookings is an array before passing it down
  const bookingsArray = Array.isArray(bookings) ? bookings : [];

  /**
   * Formats a booking ID into a user-friendly booking number using the exhibition's invoice prefix
   */
  const formatBookingNumber = (id: string, createdAt: string): string => {
    const year = new Date(createdAt).getFullYear();
    
    // Find the current booking's exhibition
    const booking = bookingsArray.find(b => b._id === id) as BookingType | undefined;
    if (!booking) return `--/${year}/--`;

    // Get all bookings for this specific exhibition, sorted by creation date
    const exhibitionBookings = bookingsArray
      .filter(b => b.exhibitionId._id === booking.exhibitionId._id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    // Find the sequence number by getting this booking's position in the sorted array
    const sequenceNum = exhibitionBookings.findIndex(b => b._id === id) + 1;
    // Pad the sequence number to 2 digits (01, 02, etc.)
    const sequence = sequenceNum.toString().padStart(2, '0');
    
    // Get the exhibition details from the Redux store
    const exhibition = exhibitions.find(e => e._id === booking.exhibitionId._id) as Exhibition | undefined;
    
    // Use exhibition's invoice prefix or fall back to booking's exhibition prefix or 'BK'
    const prefix = exhibition?.invoicePrefix || (booking.exhibitionId as Exhibition).invoicePrefix || 'BK';
    
    return `${prefix}/${year}/${sequence}`;
  };

  /**
   * Exports booking data to Excel file
   * Processes all current filtered bookings and formats them for export
   */
  const handleExportBookings = async () => {
    try {
      message.loading({ content: 'Preparing export...', key: 'export' });
      
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
      
      // Format booking data for Excel
      const exportData = result.map((booking: BookingType) => {
        // Calculate total area for all stalls
        const totalArea = booking.stallIds.reduce(
          (sum, stall) => {
            if (!(stall as any).dimensions) return sum;
            return sum + ((stall as any).dimensions.width * (stall as any).dimensions.height);
          }, 
          0
        );
        
        return {
          'Booking Number': formatBookingNumber(booking._id, booking.createdAt),
          'Exhibition': booking.exhibitionId.name,
          'Company Name': booking.companyName || 'N/A',
          'Customer Name': booking.customerName,
          'Customer Email': booking.customerEmail,
          'Customer Phone': booking.customerPhone,
          'Stall Numbers': booking.stallIds.map(stall => stall.number).join(', '),
          'Stall Types': Array.from(new Set(booking.stallIds.map(stall => 
            stall.type || ((stall as any).stallTypeId && typeof (stall as any).stallTypeId === 'object' ? 
            (stall as any).stallTypeId.name : '-')
          ))).join(', '),
          'Dimensions': booking.stallIds.map(stall => 
              (stall as any).dimensions ? 
              `${(stall as any).dimensions.width}m × ${(stall as any).dimensions.height}m` : 
              'No dimensions'
            ).join(', '),
          'Total Area (sqm)': Math.round(totalArea),
          'Base Amount': Math.round(booking.calculations.totalBaseAmount),
          'Discount': Math.round(booking.calculations.totalDiscountAmount),
          'Total Amount': Math.round(booking.calculations.totalAmount),
          'Status': booking.status.toUpperCase(),
          'Booked By': booking.bookingSource === 'exhibitor' && booking.exhibitorId ? 
            `${booking.exhibitorId.contactPerson} (Exhibitor)` : 
            booking.userId ? 
              `${booking.userId.name || booking.userId.username} (Admin)` : 
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
        bookings={bookings as unknown as BookingType[]} 
        paginationTotal={pagination.total} 
        stats={stats}
        statsLoading={statsLoading}
      />

      {/* Filters */}
      <BookingFilters 
        filters={filters} 
        exhibitions={exhibitions as any[]}
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