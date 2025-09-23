import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceChargeClient from '@/components/service-charge/ServiceChargeClient';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `Service Charge Payment | Exhibition ${id}`,
    description: 'Pay service charges for your exhibition stall with secure PhonePe payment gateway.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ServiceChargePage({ params }: Props) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <ServiceChargeClient exhibitionId={id} />;
}
