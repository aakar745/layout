import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy - Aakar Exhibition',
  description: 'Understanding our cancellation and refund procedures for exhibition bookings',
};

export default function CancellationRefundPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Understanding our cancellation and refund procedures for exhibition bookings
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Important Notice */}
        <div className="mb-12 p-6 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Important Information</h3>
              <p className="text-amber-800">Please read this policy carefully before making any booking. Cancellation charges apply based on the timing of your cancellation request.</p>
            </div>
          </div>
        </div>

        {/* Refund Schedule */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Cancellation Timeline & Refund Rates</h2>
            </div>
            
            <p className="text-gray-700 mb-8">
              Refund amounts are calculated based on when you cancel your booking relative to the exhibition start date:
            </p>

            <div className="bg-blue-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-center text-gray-900 mb-8">Refund Schedule</h3>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-900 flex-1 text-center sm:text-left mb-2 sm:mb-0">
                    30+ days before exhibition
                  </div>
                  <div className="text-green-600 font-semibold flex-1 text-center">
                    80% refund
                  </div>
                  <div className="text-red-600 font-semibold flex-1 text-center sm:text-right">
                    20% cancellation charge
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-900 flex-1 text-center sm:text-left mb-2 sm:mb-0">
                    15-29 days before exhibition
                  </div>
                  <div className="text-green-600 font-semibold flex-1 text-center">
                    50% refund
                  </div>
                  <div className="text-red-600 font-semibold flex-1 text-center sm:text-right">
                    50% cancellation charge
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-900 flex-1 text-center sm:text-left mb-2 sm:mb-0">
                    7-14 days before exhibition
                  </div>
                  <div className="text-green-600 font-semibold flex-1 text-center">
                    25% refund
                  </div>
                  <div className="text-red-600 font-semibold flex-1 text-center sm:text-right">
                    75% cancellation charge
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-900 flex-1 text-center sm:text-left mb-2 sm:mb-0">
                    Less than 7 days before
                  </div>
                  <div className="text-red-600 font-semibold flex-1 text-center">
                    No refund
                  </div>
                  <div className="text-red-600 font-semibold flex-1 text-center sm:text-right">
                    100% cancellation charge
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-blue-900">Processing Fee</h4>
                    <p className="text-blue-800 text-sm">A processing fee of 5% will be deducted from all refund amounts to cover administrative costs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation Process */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Cancellation Process</h2>
            </div>

            <p className="text-gray-700 mb-8">Follow these steps to cancel your exhibition booking:</p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Submit Cancellation Request</h4>
                  <p className="text-gray-700">Send a written cancellation request to support@aakarexhibition.com with your booking details</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Verification Process</h4>
                  <p className="text-gray-700">Our team will verify your booking details and calculate the refund amount based on the cancellation timeline</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Refund Processing</h4>
                  <p className="text-gray-700">Approved refunds will be credited within 5-7 business days to your original payment method</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Confirmation</h4>
                  <p className="text-gray-700">You will receive an email confirmation once the refund has been processed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Eligibility */}
        <div className="mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Eligible for Refund</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Cancellations made within the specified timeline</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Exhibition cancellation by organizer</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Force majeure events (natural disasters, government restrictions)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Technical issues preventing exhibition participation</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Not Eligible for Refund</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-700">No-show on exhibition day without prior cancellation</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-700">Exhibitor misconduct leading to removal</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-700">Changes in business circumstances</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-700">Partial participation (attending only some days)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-700">Requests made after exhibition completion</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Circumstances */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Special Circumstances</h2>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Emergency Cancellations</h4>
                <p className="text-gray-700 mb-4">
                  In case of medical emergencies or other exceptional circumstances, please contact us immediately. 
                  Each case will be reviewed individually, and we may consider special refund arrangements.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Exhibition Postponement</h4>
                <p className="text-gray-700 mb-4">If an exhibition is postponed due to unforeseen circumstances:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Full refund will be offered if new dates are not suitable</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Booking can be transferred to new exhibition dates at no additional cost</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">No cancellation charges will apply in such cases</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Venue Changes</h4>
                <p className="text-gray-700 mb-4">If the exhibition venue is changed significantly:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Exhibitors will be notified at least 15 days in advance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Option to cancel with 80% refund regardless of timeline</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Alternative arrangements will be offered where possible</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Important Notes</h2>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Required Information for Cancellation</h4>
              <p className="text-blue-800 text-sm">
                Please include the following in your cancellation request: Booking ID, Exhibitor name, Exhibition name, Contact details, 
                Reason for cancellation, Bank details for refund (if different from original payment method).
              </p>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 mt-1">•</span>
                <span className="text-gray-700">Refunds will be processed in the same currency as the original payment</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 mt-1">•</span>
                <span className="text-gray-700">Bank transfer charges (if any) will be borne by the exhibitor</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 mt-1">•</span>
                <span className="text-gray-700">Partial cancellations (reducing stall count) follow the same timeline rules</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 mt-1">•</span>
                <span className="text-gray-700">Group bookings may have different terms - please check your agreement</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 mt-1">•</span>
                <span className="text-gray-700">Refund timeline starts from the exhibition start date, not booking date</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2 mt-1">•</span>
                <span className="text-gray-700">All cancellation requests must be in writing (email preferred)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-green-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold text-green-900 mb-1">Need Help with Cancellation?</h3>
              <p className="text-green-800">Our customer support team is here to assist you with the cancellation process. Contact us as soon as possible if you need to cancel your booking.</p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Contact Support</h3>
          <div className="space-y-2 mb-6">
            <p><span className="font-semibold">Email:</span> support@aakarexhibition.com</p>
            <p><span className="font-semibold">Phone:</span> 7016727956</p>
            <p><span className="font-semibold">Contact Person:</span> Tanvir Pathan (+91 81550 01192)</p>
          </div>
          <p className="text-sm text-blue-200">
            This policy is effective from January 1, 2024, and applies to all bookings made after this date.
          </p>
        </div>
      </div>
    </div>
  );
}
