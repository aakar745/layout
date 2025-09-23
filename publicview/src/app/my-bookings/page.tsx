'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { 
  Calendar, 
  MapPin, 
  Building, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  AlertTriangle,
  Download,
  Search,
  Filter,
  Loader2,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// Types for booking data (matching backend response)
interface BookingStall {
  _id: string;
  number: string;
  dimensions: {
    width: number;
    height: number;
  };
  ratePerSqm: number;
  status: string;
  stallTypeId?: {
    name: string;
    description: string;
  };
}

interface Exhibition {
  _id: string;
  name: string;
  venue: string;
  startDate: string;
  endDate: string;
}

interface Booking {
  _id: string;
  exhibitionId: Exhibition;
  stallIds: BookingStall[];
  amount?: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  companyName?: string;
}


interface ActionLoadingState {
  [bookingId: string]: {
    cancel?: boolean;
    download?: boolean;
  };
}

export default function MyBookingsPage() {
  const { isAuthenticated, exhibitor, token } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  
  // Action loading states
  const [actionLoading, setActionLoading] = useState<ActionLoadingState>({});
  
  // Dialog states
  const [cancelDialog, setCancelDialog] = useState<{open: boolean; booking: Booking | null}>({
    open: false,
    booking: null
  });
  


  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !exhibitor) {
      redirect('/');
    }
  }, [isAuthenticated, exhibitor]);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/exhibitor-bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch bookings (${response.status})`);
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      console.error('Error fetching bookings:', error);
      setError(error instanceof Error ? error.message : 'Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        booking.exhibitionId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.exhibitionId.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

      // Payment filter
      const matchesPayment = paymentFilter === 'all' || booking.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [bookings, searchTerm, statusFilter, paymentFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Action handlers
  const handleCancelBooking = async (booking: Booking) => {
    if (!token) return;

    setActionLoading(prev => ({
      ...prev,
      [booking._id]: { ...prev[booking._id], cancel: true }
    }));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/exhibitor-bookings/${booking._id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to cancel booking');
      }

      // Update the booking in local state
      setBookings(prev => prev.map(b => 
        b._id === booking._id ? { ...b, status: 'cancelled' as const } : b
      ));

      setCancelDialog({ open: false, booking: null });
      
      // Show success message (you could add a toast notification here)
      setError(null);
      
    } catch (error: unknown) {
      console.error('Error cancelling booking:', error);
      setError(error instanceof Error ? error.message : 'Failed to cancel booking');
    } finally {
      setActionLoading(prev => ({
        ...prev,
        [booking._id]: { ...prev[booking._id], cancel: false }
      }));
    }
  };


  const handleDownloadInvoice = async (booking: Booking) => {
    if (!token) return;

    // Check if booking status allows invoice access
    if (booking.status !== 'confirmed' && booking.status !== 'completed') {
      setError('Invoice download is only available for confirmed or completed bookings');
      return;
    }

    setActionLoading(prev => ({
      ...prev,
      [booking._id]: { ...prev[booking._id], download: true }
    }));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/exhibitor-bookings/${booking._id}/invoice/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        // Try to parse error response
        let errorMessage = `Failed to download invoice (${response.status})`;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          }
        } catch {
          // If we can't parse the error, use the default message
        }
        throw new Error(errorMessage);
      }

      // Get the content type to ensure it's a PDF
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/pdf')) {
        throw new Error('Invalid response format. Expected PDF file.');
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Generate a more descriptive filename
      const fileName = `invoice-${booking.exhibitionId.name.replace(/\s+/g, '-')}-${booking._id}.pdf`;
      a.download = fileName;
      
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      // Clear any existing error
      setError(null);
      
    } catch (error: unknown) {
      console.error('Error downloading invoice:', error);
      setError(error instanceof Error ? error.message : 'Failed to download invoice');
    } finally {
      setActionLoading(prev => ({
        ...prev,
        [booking._id]: { ...prev[booking._id], download: false }
      }));
    }
  };

  if (!isAuthenticated || !exhibitor) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600 mt-2">
                Track and manage your exhibition stall bookings.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={fetchBookings}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
              <div className="hidden sm:block">
                <Link href="/exhibitions">
                  <Button>
                    <Building className="h-4 w-4 mr-2" />
                    Browse Exhibitions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        {bookings.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>
                Overview of your exhibition bookings {filteredBookings.length !== bookings.length && 
                `(${filteredBookings.length} of ${bookings.length} shown)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {bookings.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </div>
                  <div className="text-sm text-gray-600">Confirmed</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {bookings.filter(b => b.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {bookings.reduce((sum, b) => sum + b.stallIds.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Stalls</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-gray-500" />
              <CardTitle className="text-lg">Search & Filter</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Search</label>
                <Input
                  placeholder="Search exhibitions, venues, companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Booking Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Payment Status</label>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Payments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {(searchTerm || statusFilter !== 'all' || paymentFilter !== 'all') && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredBookings.length} of {bookings.length} bookings
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPaymentFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Bookings List */}
        {filteredBookings.length === 0 && !error ? (
          bookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven&apos;t made any exhibition bookings yet. Start exploring available exhibitions to book your stalls.
                </p>
                <Link href="/exhibitions">
                  <Button>
                    <Building className="h-4 w-4 mr-2" />
                    Browse Exhibitions
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600 mb-6">
                  No bookings match your current filters. Try adjusting your search or filter criteria.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPaymentFilter('all');
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <Card key={booking._id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        {booking.exhibitionId.name}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(booking.exhibitionId.startDate).toLocaleDateString()} - 
                          {new Date(booking.exhibitionId.endDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {booking.stallIds.length} Stall{booking.stallIds.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 capitalize">{booking.status}</span>
                      </Badge>
                      <div>
                        <Badge variant="outline" className={getPaymentStatusColor(booking.paymentStatus || 'pending')}>
                          <CreditCard className="h-3 w-3 mr-1" />
                          {booking.paymentStatus === 'paid' ? 'Paid' : 
                           booking.paymentStatus === 'pending' ? 'Payment Pending' :
                           booking.paymentStatus === 'failed' ? 'Payment Failed' : 
                           booking.paymentStatus === 'refunded' ? 'Refunded' : 'Payment Pending'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Stalls Information */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Booked Stalls:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {booking.stallIds.map((stall) => (
                        <div 
                          key={stall._id}
                          className="bg-gray-50 rounded-lg p-3 border"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">
                              Stall {stall.number}
                            </span>
                            <span className="text-sm text-gray-600">
                              ₹{stall.ratePerSqm.toLocaleString()}/sq.m
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {stall.stallTypeId?.name || 'Standard'} • {stall.dimensions.width}m x {stall.dimensions.height}m
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Booking Date:</span>
                        <p className="font-medium">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Amount:</span>
                        <p className="font-medium text-lg">
                          ₹{booking.amount?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Company:</span>
                        <p className="font-medium">
                          {booking.companyName || booking.customerName || 'N/A'}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/exhibitions/${booking.exhibitionId._id}/layout`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Layout
                          </Button>
                        </Link>
                        
                         {/* Download Invoice - Only available for confirmed/completed bookings */}
                         {(booking.status === 'confirmed' || booking.status === 'completed') && (
                           <Button 
                             variant="outline" 
                             size="sm"
                             onClick={() => handleDownloadInvoice(booking)}
                             disabled={actionLoading[booking._id]?.download}
                             title="Download invoice as PDF"
                           >
                             {actionLoading[booking._id]?.download ? (
                               <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                             ) : (
                               <Download className="h-4 w-4 mr-2" />
                             )}
                             Download Invoice
                           </Button>
                         )}
                        
                         {/* Helper text for pending bookings */}
                         {booking.status === 'pending' && (
                           <div className="text-xs text-gray-500 mt-1">
                             Invoice download will be available after booking confirmation
                           </div>
                         )}
                        
                        {booking.status === 'pending' && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => setCancelDialog({ open: true, booking })}
                            disabled={actionLoading[booking._id]?.cancel}
                          >
                            {actionLoading[booking._id]?.cancel ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-2" />
                            )}
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}


        {/* Cancel Confirmation Dialog */}
        <Dialog open={cancelDialog.open} onOpenChange={(open) => 
          setCancelDialog({ open, booking: open ? cancelDialog.booking : null })
        }>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this booking? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {cancelDialog.booking && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">{cancelDialog.booking.exhibitionId.name}</p>
                <p className="text-sm text-gray-600">
                  {cancelDialog.booking.stallIds.length} stall(s) • 
                  ₹{cancelDialog.booking.amount?.toLocaleString() || 'N/A'}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setCancelDialog({ open: false, booking: null })}
              >
                Keep Booking
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => cancelDialog.booking && handleCancelBooking(cancelDialog.booking)}
                disabled={cancelDialog.booking ? actionLoading[cancelDialog.booking._id]?.cancel : false}
              >
                {cancelDialog.booking && actionLoading[cancelDialog.booking._id]?.cancel ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Cancel Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
