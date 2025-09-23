'use client';

import { Check, CreditCard, Receipt, User } from 'lucide-react';

interface StepsIndicatorProps {
  currentStep: number;
}

const steps = [
  {
    id: 0,
    title: 'Service Details',
    description: 'Enter vendor and stall information',
    icon: User,
  },
  {
    id: 1,
    title: 'Payment',
    description: 'Review and complete payment',
    icon: CreditCard,
  },
  {
    id: 2,
    title: 'Success',
    description: 'Payment confirmation and receipt',
    icon: Receipt,
  },
];

export default function StepsIndicator({ currentStep }: StepsIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-center mb-4 max-w-4xl mx-auto px-4">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;
          
          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex items-center">
                <div
                  className={`
                    w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isCompleted ? 'bg-green-600 border-green-600 text-white' : ''}
                    ${isCurrent ? 'bg-blue-600 border-blue-600 text-white' : ''}
                    ${isUpcoming ? 'bg-gray-100 border-gray-300 text-gray-400' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </div>
                
                {/* Step Info */}
                <div className="ml-3 sm:ml-4 hidden sm:block">
                  <div
                    className={`
                      text-sm font-medium transition-colors whitespace-nowrap
                      ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}
                    `}
                  >
                    {step.title}
                  </div>
                  <div
                    className={`
                      text-xs transition-colors whitespace-nowrap
                      ${isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'}
                    `}
                  >
                    {step.description}
                  </div>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-12 sm:w-16 md:w-20 h-0.5 mx-4 sm:mx-6 transition-colors duration-300
                    ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Mobile Step Info */}
      <div className="sm:hidden text-center">
        <div className="text-sm font-medium text-gray-900">
          {steps[currentStep].title}
        </div>
        <div className="text-xs text-gray-600">
          {steps[currentStep].description}
        </div>
      </div>
    </div>
  );
}
