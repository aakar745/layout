import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Aakar Exhibition',
  description: 'Your privacy is important to us. This policy explains how we collect, use, and protect your information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Last Updated Notice */}
        <div className="mb-12 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Last Updated</h3>
              <p className="text-blue-800">This Privacy Policy was last updated on January 1, 2024. We may update this policy from time to time.</p>
            </div>
          </div>
        </div>

        {/* Privacy Policy Sections */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">1.1 Personal Information</h4>
                <p className="text-gray-700 mb-4">We collect information you provide directly to us when you:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Register for exhibitions or events</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Create an account on our platform</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Contact us for support or inquiries</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Subscribe to our newsletters</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Make payments for our services</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">1.2 Technical Information</h4>
                <p className="text-gray-700">
                  We automatically collect certain technical information including IP addresses, browser types, 
                  device information, and usage patterns to improve our services.
                </p>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            <p className="text-gray-700 mb-4">We use the collected information for the following purposes:</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">•</span>
                <span className="text-gray-700">Process and manage exhibition bookings</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">•</span>
                <span className="text-gray-700">Provide customer support and respond to inquiries</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">•</span>
                <span className="text-gray-700">Send important updates about your bookings</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">•</span>
                <span className="text-gray-700">Improve our services and user experience</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">•</span>
                <span className="text-gray-700">Comply with legal obligations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">•</span>
                <span className="text-gray-700">Prevent fraud and ensure platform security</span>
              </li>
            </ul>
          </div>

          {/* Data Protection & Security */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">3. Data Protection & Security</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">3.1 Security Measures</h4>
                <p className="text-gray-700">
                  We implement appropriate technical and organizational security measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">3.2 Data Encryption</h4>
                <p className="text-gray-700">
                  All sensitive data, including payment information, is encrypted using industry-standard 
                  encryption protocols (SSL/TLS) during transmission and storage.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">3.3 Access Controls</h4>
                <p className="text-gray-700">
                  Access to personal information is restricted to authorized personnel only and is provided 
                  on a need-to-know basis for business operations.
                </p>
              </div>
            </div>
          </div>

          {/* Information Sharing */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Information Sharing</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">4.1 Third-Party Service Providers</h4>
                <p className="text-gray-700 mb-4">We may share your information with trusted third-party service providers who assist us in:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Payment processing (PhonePe, bank partners)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Email communication services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Cloud hosting and storage services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Analytics and performance monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700">Customer support platforms</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">4.2 Legal Requirements</h4>
                <p className="text-gray-700">
                  We may disclose your information when required by law, legal process, or government authorities.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">4.3 Business Transfers</h4>
                <p className="text-gray-700">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred 
                  as part of the business transaction.
                </p>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">5</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
            </div>
            <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-red-600 mr-2 mt-1">•</span>
                <span className="text-gray-700">Access: Request a copy of your personal data</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2 mt-1">•</span>
                <span className="text-gray-700">Correction: Update or correct inaccurate information</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2 mt-1">•</span>
                <span className="text-gray-700">Deletion: Request deletion of your personal data</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2 mt-1">•</span>
                <span className="text-gray-700">Portability: Request transfer of your data to another service</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2 mt-1">•</span>
                <span className="text-gray-700">Objection: Object to certain processing of your data</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2 mt-1">•</span>
                <span className="text-gray-700">Restriction: Request restriction of data processing</span>
              </li>
            </ul>
          </div>

          {/* Additional Sections in Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Data Retention</h3>
              <p className="text-gray-700 mb-4 text-sm">
                We retain your personal information only for as long as necessary to fulfill the purposes 
                outlined in this privacy policy. Typically, we retain:
              </p>
              <ul className="space-y-1 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700">Account information: Account duration plus 2 years</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700">Booking records: 7 years for compliance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700">Communication records: 3 years</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700">Payment info: As required by regulations</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cookies & Tracking</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-900">Cookie Usage</h4>
                  <p className="text-gray-700">
                    We use cookies to enhance your browsing experience and provide personalized content.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Cookie Types</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Essential cookies for basic functionality</li>
                    <li>• Performance cookies for analytics</li>
                    <li>• Functional cookies for user experience</li>
                    <li>• Targeting cookies (with consent)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">International Data Transfers</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. 
                We ensure appropriate safeguards are in place to protect your data during such transfers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Children&apos;s Privacy</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Our services are not intended for children under 18 years of age. We do not knowingly collect 
                personal information from children under 18.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="space-y-2 text-sm">
                <p className="text-gray-900"><span className="font-semibold">Privacy Officer</span></p>
                <p className="text-gray-700">Email: support@aakarexhibition.com</p>
                <p className="text-gray-700">Phone: 7016727956</p>
                <p className="text-gray-700">Address: B-2, Wall Street 2, opp. Orient Club, Ellisbridge, Ahmedabad, Gujarat 380006</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 mb-2">
            This Privacy Policy is governed by the laws of India and any disputes will be resolved in the courts of Ahmedabad, Gujarat.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: January 1, 2024
          </p>
        </div>
      </div>
    </div>
  );
}
