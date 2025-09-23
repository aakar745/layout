import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing Policy - Aakar Exhibition',
  description: 'Transparent and competitive pricing for all our exhibition services',
};

export default function PricingPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Pricing Policy
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Transparent and competitive pricing for all our exhibition services
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Important Notice */}
        <div className="mb-12 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Important Notice</h3>
              <p className="text-blue-800">All prices are subject to change based on exhibition requirements and market conditions. Final pricing will be confirmed during the booking process.</p>
            </div>
          </div>
        </div>

        {/* Exhibition Stall Booking */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Exhibition Stall Booking</h2>
            </div>
            
            <p className="text-gray-700 mb-8">
              Our stall pricing is designed to be fair and competitive, offering excellent value for exhibitors of all sizes.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-6">Standard Pricing Structure:</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-900 mb-3">Premium Stalls (Front Row)</h4>
                <p className="text-gray-600 text-sm">Pricing varies based on location and exhibition type</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-900 mb-3">Standard Stalls</h4>
                <p className="text-gray-600 text-sm">Competitive rates for general exhibition areas</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-900 mb-3">Corner Stalls</h4>
                <p className="text-gray-600 text-sm">Premium pricing for enhanced visibility</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-900 mb-3">Island Stalls</h4>
                <p className="text-gray-600 text-sm">Special pricing for large exhibition spaces</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Charges */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Service Charges</h2>
            </div>
            
            <p className="text-gray-700 mb-8">
              Additional services are charged separately to provide flexibility and cost-effectiveness.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-6">Service Charge Details:</h3>

            <div className="space-y-4">
              <div className="flex items-start p-6 bg-purple-50 rounded-xl border-l-4 border-purple-600">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2">Setup Services</h4>
                  <p className="text-gray-600 text-sm">Professional stall setup and configuration services</p>
                </div>
              </div>

              <div className="flex items-start p-6 bg-purple-50 rounded-xl border-l-4 border-purple-600">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2">Power & Utilities</h4>
                  <p className="text-gray-600 text-sm">Electrical connections and utility services</p>
                </div>
              </div>

              <div className="flex items-start p-6 bg-purple-50 rounded-xl border-l-4 border-purple-600">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2">Security Services</h4>
                  <p className="text-gray-600 text-sm">24/7 security coverage during exhibition period</p>
                </div>
              </div>

              <div className="flex items-start p-6 bg-purple-50 rounded-xl border-l-4 border-purple-600">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2">Cleaning Services</h4>
                  <p className="text-gray-600 text-sm">Daily cleaning and maintenance services</p>
                </div>
              </div>

              <div className="flex items-start p-6 bg-purple-50 rounded-xl border-l-4 border-purple-600">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2">Technical Support</h4>
                  <p className="text-gray-600 text-sm">On-site technical assistance and troubleshooting</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Payment Terms</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Booking Process:</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-white font-bold text-xs">1</span>
                    </div>
                    <p className="text-gray-700">Initial inquiry and requirement assessment</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-white font-bold text-xs">2</span>
                    </div>
                    <p className="text-gray-700">Customized quote preparation based on specific needs</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-white font-bold text-xs">3</span>
                    </div>
                    <p className="text-gray-700">Booking confirmation with advance payment</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-white font-bold text-xs">4</span>
                    </div>
                    <p className="text-gray-700">Service delivery as per agreed terms</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-white font-bold text-xs">5</span>
                    </div>
                    <p className="text-gray-700">Final payment upon completion</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment Methods:</h3>
                <p className="text-gray-700 mb-4">We accept multiple payment methods for your convenience:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Online payment via secure payment gateway</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Bank transfer (NEFT/RTGS)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Cheque payments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Cash payments (for smaller amounts)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Digital wallets (UPI, PhonePe, GooglePay)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Additional Information</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">What&apos;s Included:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Basic stall space allocation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Standard exhibition infrastructure</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Basic promotional support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Visitor management system access</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Certificate of participation</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Pricing Factors:</h3>
                <p className="text-gray-700 mb-4">Final pricing may vary based on:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Exhibition duration and dates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Stall size and location preferences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Additional services required</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Advance booking discounts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Package deals for multiple exhibitions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Seasonal pricing adjustments</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Get Custom Quote */}
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-green-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold text-green-900 mb-1">Get Custom Quote</h3>
              <p className="text-green-800">For detailed pricing information specific to your requirements, please contact our team. We provide customized quotes based on your exhibition needs and budget.</p>
            </div>
          </div>
        </div>

        {/* Contact for Pricing */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Contact us for detailed pricing</h3>
          <div className="space-y-2">
            <p><span className="font-semibold">Email:</span> support@aakarexhibition.com</p>
            <p><span className="font-semibold">Phone:</span> 7016727956</p>
          </div>
        </div>
      </div>
    </div>
  );
}
