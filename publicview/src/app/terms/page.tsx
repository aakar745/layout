import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Aakar Exhibition',
  description: 'Please read these terms and conditions carefully before using our services',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using our services
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Effective Date Notice */}
        <div className="mb-12 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Effective Date</h3>
              <p className="text-blue-800">These terms and conditions are effective as of January 1, 2024, and may be updated from time to time.</p>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {/* Acceptance of Terms */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Aakar Exhibition services, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the terms and conditions of this agreement, you are not authorized to use or access our services.
            </p>
          </div>

          {/* Exhibition Booking Terms */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Exhibition Booking Terms</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">2.1 Booking Process</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>All bookings are subject to availability and confirmation by Aakar Exhibition</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Booking confirmation will be provided via email within 24-48 hours</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Full payment or advance payment as specified must be made to secure the booking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Stall allocation is final once confirmed and cannot be changed without mutual agreement</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">2.2 Exhibitor Responsibilities</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Exhibitors must comply with all exhibition rules and regulations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Setup and breakdown must be completed within specified timeframes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Exhibitors are responsible for their own property and materials</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">•</span>
                    <span>Professional conduct is required at all times during the exhibition</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Terms</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">3.1 Payment Schedule</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">•</span>
                    <span>Advance payment: 50% of total amount at time of booking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">•</span>
                    <span>Balance payment: 50% at least 15 days before exhibition start date</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">•</span>
                    <span>Service charges: Payable as per agreed terms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">•</span>
                    <span>Late payment may result in cancellation of booking</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">3.2 Payment Methods</h4>
                <p className="text-gray-700">
                  We accept payments through bank transfer, online payment gateways, cheques, and digital wallets. 
                  All payments should be made in Indian Rupees (INR) unless otherwise specified.
                </p>
              </div>
            </div>
          </div>

          {/* Cancellation & Refund Policy */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Cancellation & Refund Policy</h2>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-600 mr-2 mt-1">•</span>
                <span>Cancellations made 30+ days before exhibition: 80% refund</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2 mt-1">•</span>
                <span>Cancellations made 15-29 days before: 50% refund</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2 mt-1">•</span>
                <span>Cancellations made 7-14 days before: 25% refund</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2 mt-1">•</span>
                <span>Cancellations made less than 7 days before: No refund</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2 mt-1">•</span>
                <span>Processing fee of 5% applicable on all refunds</span>
              </li>
            </ul>
          </div>

          {/* Additional Terms */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Force Majeure</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Aakar Exhibition shall not be liable for any failure or delay in performance under this agreement which is due to 
                fire, casualty, flood, earthquake, other acts of God, strikes, labor disputes, wars, government regulations, 
                communications or power failures, equipment or software malfunctions, or other circumstances beyond our reasonable control.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Liability & Insurance</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-900">Limitation of Liability</h4>
                  <p className="text-gray-700">
                    Aakar Exhibition&apos;s liability is limited to the amount paid by the exhibitor for the specific service.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Insurance</h4>
                  <p className="text-gray-700">
                    Exhibitors are strongly advised to obtain comprehensive insurance coverage for their exhibits, equipment, and personnel.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Intellectual Property</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                All content, trademarks, and intellectual property on our platform remain the property of Aakar Exhibition 
                or respective owners. Exhibitors retain rights to their own materials but grant us permission to use 
                exhibition-related content for promotional purposes.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Dispute Resolution</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Any disputes arising from these terms shall be resolved through arbitration in Ahmedabad, Gujarat, India. 
                The courts of Ahmedabad shall have exclusive jurisdiction over any legal proceedings.
              </p>
            </div>
          </div>

          {/* Final Sections */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Modifications</h3>
            <p className="text-gray-700 leading-relaxed">
              Aakar Exhibition reserves the right to modify these terms and conditions at any time. 
              Updated terms will be posted on our website, and continued use of our services constitutes acceptance of the modified terms.
            </p>
          </div>
        </div>

        {/* Contact Footer */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-xl font-bold mb-4">Questions about these terms?</h3>
          <p className="text-blue-100 mb-4">Contact us: support@aakarexhibition.com | 7016727956</p>
          <p className="text-sm text-blue-200">Last updated: January 1, 2024</p>
        </div>
      </div>
    </div>
  );
}
