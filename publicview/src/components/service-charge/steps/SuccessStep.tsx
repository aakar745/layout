'use client';

import { useState } from 'react';
import { CheckCircle, Download, Home, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { serviceChargeAPI } from '@/lib/api/serviceCharge';
import { PaymentResult } from '@/lib/types/serviceCharge';

interface SuccessStepProps {
  paymentResult: PaymentResult;
  onNavigateHome: () => void;
}

export default function SuccessStep({ paymentResult, onNavigateHome }: SuccessStepProps) {
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownloadReceipt = async () => {
    try {
      setDownloadLoading(true);
      
      const blob = await serviceChargeAPI.downloadReceipt(paymentResult.serviceChargeId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Receipt-${paymentResult.receiptNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Failed to download receipt. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleCopyReceiptNumber = async () => {
    try {
      await navigator.clipboard.writeText(paymentResult.receiptNumber);
      setCopied(true);
      toast.success('Receipt number copied to clipboard!');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy receipt number');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Success Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h2>
        
        <p className="text-base sm:text-lg text-gray-600 mb-2">
          Your service charge payment of{' '}
          <span className="font-semibold text-green-600">
            ₹{paymentResult.amount.toLocaleString()}
          </span>{' '}
          has been processed successfully.
        </p>
        
        <p className="text-sm text-gray-500">
          A confirmation email will be sent to your registered email address.
        </p>
      </div>

      {/* Payment Details */}
      <Card className="p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
        
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b gap-2">
            <span className="text-gray-600 text-sm">Receipt Number</span>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="font-mono text-xs sm:text-sm break-all">
                {paymentResult.receiptNumber}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyReceiptNumber}
                className="h-6 w-6 p-0 flex-shrink-0"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>

          {paymentResult.paymentId && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b gap-1">
              <span className="text-gray-600 text-sm">Payment ID</span>
              <span className="font-mono text-xs sm:text-sm break-all">{paymentResult.paymentId}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b gap-1">
            <span className="text-gray-600 text-sm">Amount Paid</span>
            <div className="text-left sm:text-right">
              <div className="font-semibold">₹{paymentResult.amount.toLocaleString()}</div>
              <div className="text-xs text-gray-500">(Inclusive of GST)</div>
            </div>
          </div>

          {paymentResult.paidAt && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b gap-1">
              <span className="text-gray-600 text-sm">Payment Date</span>
              <span className="font-medium text-sm">
                {new Date(paymentResult.paidAt).toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Status</span>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Paid
            </Badge>
          </div>

          {paymentResult.state && (
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">PhonePe Status</span>
              <Badge variant="outline">{paymentResult.state}</Badge>
            </div>
          )}
        </div>
      </Card>

      {/* Receipt Download Section */}
      {paymentResult.receiptGenerated && (
        <Card className="p-4 sm:p-6 mb-6 bg-blue-50 border-blue-200">
          <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 w-full">
              <h4 className="font-semibold text-blue-900 mb-1">Receipt Available</h4>
              <p className="text-blue-700 text-sm mb-3">
                Your payment receipt has been generated and is ready for download.
              </p>
              <Button
                onClick={handleDownloadReceipt}
                disabled={downloadLoading}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              >
                {downloadLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Preparing Download...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Important Information */}
      <Alert className="mb-6">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Important:</strong> Please save your receipt number{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm break-all">
            {paymentResult.receiptNumber}
          </code>{' '}
          for future reference. You can use this number to check your payment status 
          or download your receipt later.
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex justify-center mb-6">
        <Button
          onClick={onNavigateHome}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
        >
          <Home className="w-4 h-4 mr-2" />
          Browse More Exhibitions
        </Button>
      </div>

      {/* Help Section */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Need Help?</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Keep your receipt number safe for future reference</li>
          <li>• Contact support if you don&apos;t receive a confirmation email within 24 hours</li>
          <li>• You can check your payment status anytime using the receipt number</li>
          <li>• For technical issues, please contact the exhibition organizers</li>
        </ul>
      </div>
    </div>
  );
}
