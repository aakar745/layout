import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Aakar Exhibition',
  description: 'Get in touch with our team. We\'re here to help you create exceptional exhibitions.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Get in touch with our team. We&apos;re here to help you create exceptional exhibitions.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Main Contact Information */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Primary Contact */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Primary Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start p-6 bg-blue-50 rounded-xl border-l-4 border-blue-600">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Tanvir Pathan</h4>
                    <p className="text-gray-600">Contact Person</p>
                  </div>
                </div>

                <div className="flex items-start p-6 bg-blue-50 rounded-xl border-l-4 border-blue-600">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Phone</h4>
                    <a href="tel:+918155001192" className="text-blue-600 hover:text-blue-800 text-lg font-medium">
                      +91 81550 01192
                    </a>
                  </div>
                </div>

                <div className="flex items-start p-6 bg-blue-50 rounded-xl border-l-4 border-blue-600">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Email</h4>
                    <a href="mailto:tanvir@aakarexhibition.com" className="text-blue-600 hover:text-blue-800 text-lg font-medium">
                      tanvir@aakarexhibition.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Office Information */}
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Office Information</h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Address</h4>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        B-2, Wall Street 2, opp. Orient Club,<br />
                        Ellisbridge, Ahmedabad,<br />
                        Gujarat 380006
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Support</h4>
                      <a href="tel:7016727956" className="text-blue-600 hover:text-blue-800 font-medium">
                        7016727956
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">General Inquiry</h4>
                      <a href="mailto:support@aakarexhibition.com" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        support@aakarexhibition.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Business Hours</h3>
              
              <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="p-6 bg-blue-50 rounded-xl">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">Monday - Friday</h4>
                  <p className="text-gray-600">10:30 AM - 7:00 PM</p>
                </div>
                <div className="p-6 bg-blue-50 rounded-xl">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">Saturday</h4>
                  <p className="text-gray-600">9:00 AM - 2:00 PM</p>
                </div>
              </div>
              
              <p className="text-gray-600 mt-6">
                We&apos;re closed on Sundays and public holidays
              </p>
            </div>
          </div>
        </div>

        {/* Quick Response CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h3 className="text-2xl font-bold mb-4">Quick Response</h3>
          <p className="text-blue-100 mb-8 max-w-3xl mx-auto">
            For immediate assistance, please call our direct contact number. 
            We typically respond to emails within 24 hours during business days.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+918155001192" 
              className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Call Now: +91 81550 01192
            </a>
            <a 
              href="mailto:tanvir@aakarexhibition.com" 
              className="inline-block px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
