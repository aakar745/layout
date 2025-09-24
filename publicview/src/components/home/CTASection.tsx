'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, Mail, MessageCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function CTASection() {
  const { openRegisterModal } = useAuthStore();
  
  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        {/* Animated background patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05)_0%,transparent_50%)]"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float hidden lg:block"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-float-reverse hidden lg:block"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Main Heading */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight px-2 sm:px-0">
              Ready to Showcase Your
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                {" "}Business?
              </span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              Join thousands of successful exhibitors who&apos;ve grown their business through our platform. 
              Start your journey today with just a few clicks.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0">
            <Button 
              size="lg" 
              asChild 
              className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 shadow-lg text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 font-medium"
            >
              <Link href="/exhibitions">
                <span className="text-blue-600">Browse Exhibitions</span>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => openRegisterModal()}
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-transparent font-medium"
              style={{ color: 'white' }}
            >
              <span className="text-white">Create Account</span>
            </Button>
          </div>

          {/* Contact Options */}
          <div className="pt-6 sm:pt-8 border-t border-white/20">
            <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base">Need help getting started? We&apos;re here for you!</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <a 
                href="tel:+917926575777" 
                className="flex items-center justify-center space-x-2 text-white hover:text-blue-200 transition-colors p-3 rounded-lg bg-white/10 backdrop-blur-sm"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">+91 79265 75777</span>
              </a>
              <a 
                href="mailto:info@aakarexhibition.com" 
                className="flex items-center justify-center space-x-2 text-white hover:text-blue-200 transition-colors p-3 rounded-lg bg-white/10 backdrop-blur-sm"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Email Us</span>
              </a>
              <a 
                href="https://wa.me/917926575777" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 text-white hover:text-blue-200 transition-colors p-3 rounded-lg bg-white/10 backdrop-blur-sm"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 sm:pt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
              <div className="space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl font-bold">25+</div>
                <div className="text-blue-200 text-xs sm:text-sm px-1">Years Experience</div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl font-bold">50+</div>
                <div className="text-blue-200 text-xs sm:text-sm px-1">Trade Exhibitions</div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl font-bold">10000+</div>
                <div className="text-blue-200 text-xs sm:text-sm px-1">Exhibitors Served</div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl font-bold">1000000+</div>
                <div className="text-blue-200 text-xs sm:text-sm px-1">Trade Visitors</div>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="pt-6 sm:pt-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-blue-100">Secured by 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
