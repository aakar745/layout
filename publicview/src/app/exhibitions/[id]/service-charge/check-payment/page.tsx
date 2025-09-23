import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PaymentLookupClient from '@/components/service-charge/PaymentLookupClient';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `Check Payment Status | Exhibition ${id}`,
    description: 'Check your service charge payment status and download receipt.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PaymentLookupPage({ params }: Props) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <PaymentLookupClient exhibitionId={id} />;
}
