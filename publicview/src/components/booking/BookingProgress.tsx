'use client';

import React from 'react';
import { useBookingStore } from '@/store/bookingStore';
import { CheckCircle, Circle } from 'lucide-react';

export default function BookingProgress() {
  const { steps, currentStep } = useBookingStore();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex items-center">
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                step.isComplete 
                  ? 'bg-green-500 border-green-500 text-white'
                  : step.isActive
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}>
                {step.isComplete ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
            </div>

            {/* Step Info */}
            <div className="ml-4">
              <div className={`text-sm font-medium transition-colors ${
                step.isActive ? 'text-blue-600' : step.isComplete ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step.title}
              </div>
              <div className="text-xs text-gray-500 hidden sm:block">
                {step.description}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`hidden lg:block w-20 h-0.5 mx-6 transition-colors ${
                steps[index + 1].isComplete || steps[index + 1].isActive
                  ? 'bg-blue-300'
                  : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Mobile Progress Bar */}
      <div className="mt-4 lg:hidden">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round((currentStep / (steps.length - 1)) * 100)}% Complete</span>
        </div>
      </div>
    </div>
  );
}
