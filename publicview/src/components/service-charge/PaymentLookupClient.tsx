'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Phone, Building, Download, FileText, Home, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import Link from 'next/link';
import { serviceChargeAPI } from '@/lib/api/serviceCharge';
import { 
  ServiceChargeExhibition, 
  ServiceChargeResult,
  ServiceChargeLookupParams 
} from '@/lib/types/serviceCharge';
import LoadingScreen from './LoadingScreen';
import ErrorScreen from './ErrorScreen';

const searchSchema = z.object({
  phone: z.string().optional(),
  stallNumber: z.string().optional(),
}).refine(
  (data) => data.phone || data.stallNumber,
  {
    message: "Please enter either phone number or stall number",
    path: ["phone"], // This will highlight the phone field
  }
);

type SearchFormData = z.infer<typeof searchSchema>;

interface PaymentLookupClientProps {
  exhibitionId: string;
}

export default function PaymentLookupClient({ exhibitionId }: PaymentLookupClientProps) {
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [exhibition, setExhibition] = useState<ServiceChargeExhibition | null>(null);
  const [searchResults, setSearchResults] = useState<ServiceChargeResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      phone: '',
      stallNumber: '',
    },
  });

  // Load exhibition info
  useEffect(() => {
    const loadExhibition = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await serviceChargeAPI.getExhibitionConfig(exhibitionId);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to load exhibition');
        }

        if (!response.data.config.isEnabled) {
          throw new Error('Service charges are not enabled for this exhibition');
        }

        setExhibition(response.data);
      } catch (err) {
        console.error('Error loading exhibition:', err);
        setError(err instanceof Error ? err.message : 'Failed to load exhibition');
      } finally {
        setLoading(false);
      }
    };

    if (exhibitionId) {
      loadExhibition();
    }
  }, [exhibitionId]);

  const handleSearch = async (data: SearchFormData) => {
    if (!data.phone && !data.stallNumber) {
      toast.error('Please enter either phone number or stall number');
      return;
    }

    try {
      setSearching(true);
      setHasSearched(true);

      const searchParams: ServiceChargeLookupParams = {};
      if (data.phone?.trim()) {
        searchParams.phone = data.phone.trim();
      }
      if (data.stallNumber?.trim()) {
        searchParams.stallNumber = data.stallNumber.trim();
      }

      const response = await serviceChargeAPI.lookupServiceCharges(exhibitionId, searchParams);
      
      if (response.success) {
        setSearchResults(response.data);
        if (response.data.length > 0) {
          toast.success(`Found ${response.data.length} service charge(s)`);
        } else {
          toast.info('No service charges found for the provided information');
        }
      } else {
        setSearchResults([]);
        toast.error(response.message || 'Search failed');
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
      
      if (err instanceof Error && err.message.includes('404')) {
        toast.info('No service charges found for the provided information');
      } else {
        toast.error('Search failed. Please try again.');
      }
    } finally {
      setSearching(false);
    }
  };

  const handleDownloadReceipt = async (serviceChargeId: string, receiptNumber: string) => {
    try {
      toast.loading('Preparing receipt for download...', { id: 'receipt-download' });
      
      const blob = await serviceChargeAPI.downloadReceipt(serviceChargeId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Receipt-${receiptNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Receipt downloaded successfully!', { id: 'receipt-download' });
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Failed to download receipt', { id: 'receipt-download' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return '✅';
      case 'pending':
        return '⏳';
      case 'failed':
        return '❌';
      case 'refunded':
        return '↩️';
      default:
        return '❓';
    }
  };

  // Loading screen
  if (loading) {
    return <LoadingScreen />;
  }

  // Error screen
  if (error) {
    return <ErrorScreen error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Check Payment Status
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 mb-4 sm:mb-6">
            Enter your mobile number or stall number to check your service charge payment status
          </p>
          <div className="text-xs sm:text-sm text-gray-500">
            {exhibition?.name} • {exhibition?.venue}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        {/* Search Form */}
        <Card className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Search Your Payment</h2>
          
          <Alert className="mb-4 sm:mb-6 border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              <strong>Search Options:</strong> You can search using either your mobile number OR stall number. 
              For stall numbers, you can enter partial matches (e.g., &apos;A2&apos; will find &apos;A2 (5x5)&apos;, &apos;A2-B&apos;, etc.).
            </AlertDescription>
          </Alert>

          <form onSubmit={form.handleSubmit(handleSearch)} className="space-y-4 sm:space-y-6">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    {...form.register('phone')}
                    placeholder="Enter 10-digit mobile number"
                    className="pl-10 h-11 text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                    maxLength={10}
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
                    }}
                  />
                </div>
                {form.formState.errors.phone && (
                  <p className="text-xs sm:text-sm text-red-500 mt-1">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              {/* OR Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <div>
                <Label htmlFor="stallNumber" className="text-sm font-medium text-gray-700 mb-2 block">Stall Number</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="stallNumber"
                    {...form.register('stallNumber')}
                    placeholder="Enter stall number (e.g., A2, B15)"
                    className="pl-10 h-11 text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4 sm:mb-6">
                Enter either your mobile number or stall number to find your payment records.
              </p>
              
              <Button
                type="submit"
                disabled={searching}
                size="lg"
                className="w-full sm:w-auto sm:min-w-48 h-12 text-sm sm:text-base"
              >
                {searching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <span className="hidden sm:inline">Searching...</span>
                    <span className="sm:hidden">Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Search Payments</span>
                    <span className="sm:hidden">Search</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <Card className="p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Search Results</h3>
            
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Found {searchResults.length} service charge(s) matching your search.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4">
                  {searchResults.map((result) => (
                    <Card key={result.id} className="p-4 sm:p-6 border-l-4 border-l-blue-600">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                            <Badge variant="outline" className="font-mono text-xs sm:text-sm w-fit">
                              {result.receiptNumber}
                            </Badge>
                            <Badge className={`${getStatusColor(result.paymentStatus)} text-xs w-fit`}>
                              {getStatusIcon(result.paymentStatus)} {result.paymentStatus.toUpperCase()}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-base sm:text-lg text-gray-900">{result.vendorName}</h4>
                          <p className="text-gray-600 text-sm sm:text-base break-words">{result.companyName}</p>
                          {result.exhibitorCompanyName && (
                            <p className="text-sm text-gray-500 break-words">Exhibitor: {result.exhibitorCompanyName}</p>
                          )}
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-xl sm:text-2xl font-bold text-blue-600">
                            ₹{result.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">(Incl. GST)</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Stall:</span>
                          <div className="font-medium">{result.stallNumber}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <div className="font-medium">
                            {new Date(result.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        {result.paidAt && (
                          <div>
                            <span className="text-gray-500">Paid:</span>
                            <div className="font-medium text-green-600">
                              {new Date(result.paidAt).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500">Service:</span>
                          <div className="font-medium">{result.serviceType}</div>
                        </div>
                      </div>

                      {result.paymentStatus === 'paid' && result.receiptGenerated && (
                        <div className="pt-4 border-t">
                          <Button
                            onClick={() => handleDownloadReceipt(result.id, result.receiptNumber)}
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Receipt
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Payments Found</h4>
                <p className="text-gray-600 mb-6">
                  No service charges found for the provided information. Please check your details and try again.
                </p>
                <Button onClick={() => form.reset()} variant="outline">
                  Search Again
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Help Section */}
        <Card className="p-4 sm:p-6 mt-6 sm:mt-8 bg-gray-50">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Need Help?</h4>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <strong className="text-gray-900">Can&apos;t find your payment?</strong>
            </div>
            <ul className="space-y-2 sm:space-y-1 ml-3 sm:ml-4">
              <li>• Make sure you&apos;re using the same mobile number used during payment</li>
              <li>• For stall numbers, you can use partial matches (e.g., &apos;A2&apos; finds &apos;A2 (5x5)&apos;, &apos;A2-Block1&apos;)</li>
              <li>• Search is case-insensitive, so &apos;a2&apos; and &apos;A2&apos; both work</li>
              <li>• Check if you&apos;re searching in the correct exhibition</li>
              <li>• If you just made a payment, please wait a few minutes for processing</li>
            </ul>
            
            <div className="pt-3 sm:pt-4 border-t">
              <Link 
                href={`/exhibitions/${exhibitionId}/service-charge`}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
              >
                Make a new service charge payment →
              </Link>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="text-center mt-6 sm:mt-8">
          <Link href="/exhibitions">
            <Button variant="outline" size="lg" className="text-sm sm:text-base">
              <Home className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Browse More Exhibitions</span>
              <span className="sm:hidden">Browse Exhibitions</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
