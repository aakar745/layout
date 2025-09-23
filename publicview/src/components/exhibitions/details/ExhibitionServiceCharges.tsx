import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, ArrowRight, Wrench, Shield } from 'lucide-react';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';
import { getExhibitionUrl } from '@/lib/utils/exhibitions';

interface ExhibitionServiceChargesProps {
  exhibition: ExhibitionWithStats;
}

export default function ExhibitionServiceCharges({ exhibition }: ExhibitionServiceChargesProps) {
  // Note: serviceCharges would come from the API call
  // For now, we'll check if service charges are mentioned in the exhibition data
  const hasServiceCharges = exhibition.headerDescription?.toLowerCase().includes('service') ||
                           exhibition.description?.toLowerCase().includes('service');

  // This would be fetched from the API in a real implementation
  const mockServiceCharges = {
    isEnabled: hasServiceCharges,
    title: 'Additional Services',
    description: 'Professional services to enhance your exhibition experience',
    serviceTypes: [
      {
        type: 'Setup & Installation',
        description: 'Professional setup and installation of your stall',
        amount: 5000
      },
      {
        type: 'Electrical Services',
        description: 'Additional electrical connections and lighting',
        amount: 3000
      },
      {
        type: 'Cleaning Services',
        description: 'Daily cleaning and maintenance during the event',
        amount: 2000
      }
    ]
  };

  if (!mockServiceCharges.isEnabled) {
    return null;
  }

  return (
    <div className="mb-12">
      <Card className="overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">
                {mockServiceCharges.title}
              </h3>
              <p className="text-blue-100 mt-1">
                {mockServiceCharges.description}
              </p>
            </div>
          </div>

          {/* Services Grid */}
          {mockServiceCharges.serviceTypes && mockServiceCharges.serviceTypes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {mockServiceCharges.serviceTypes.map((service, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Wrench className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">
                        {service.type}
                      </h4>
                      <p className="text-blue-100 text-sm mb-3">
                        {service.description}
                      </p>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-white">
                          ₹{service.amount.toLocaleString()}
                        </span>
                        <span className="text-blue-200 text-sm ml-1">
                          per service
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center">
            <Link href={`${getExhibitionUrl(exhibition)}/service-charge`}>
              <Button 
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Pay Service Charges
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            
            <div className="flex items-center justify-center space-x-2 mt-4 text-blue-100">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Secure payment powered by PhonePe</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
