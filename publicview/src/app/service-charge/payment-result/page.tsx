import { Metadata } from 'next';
import { Suspense } from 'react';
import PaymentResultClient from '@/components/service-charge/PaymentResultClient';

export const metadata: Metadata = {
  title: 'Payment Result | Service Charge',
  description: 'Processing your service charge payment result.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <PaymentResultClient />
    </Suspense>
  );
}
