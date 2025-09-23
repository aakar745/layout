'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSettingsStore } from '@/store/settingsStore';
import { Mail, Phone, MapPin, Facebook, Linkedin } from 'lucide-react';

export default function Footer() {
  const [logoError, setLogoError] = useState(false);
  
  const { 
    getSiteName, 
    getFooterText, 
    getLogoUrl, 
    logoExists,
    isInitialized,
    isLoading,
    fetchSettings 
  } = useSettingsStore();
  
  // Ensure settings are fetched on component mount (backup)
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      fetchSettings();
    }
  }, [isInitialized, isLoading, fetchSettings]);
  
  // Get the footer text or use default
  const footerText = getFooterText() || "Aakar is about Knowledge, Ideas, Evaluations and Implementation in creating world class exhibitions - a marketplace where we bring together end users, traders & manufacturers under one roof.";
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            {/* Site logo or name */}
            {!isInitialized ? (
              // Loading placeholder to prevent flash
              <div className="h-8 w-24 bg-gray-700 animate-pulse rounded"></div>
            ) : logoExists && getLogoUrl() && !logoError ? (
              <div className="relative h-8 w-auto">
                <Image
                  src={getLogoUrl()!}
                  alt={`${getSiteName()} Logo`}
                  width={100}
                  height={32}
                  className="object-contain max-h-8"
                  onError={() => setLogoError(true)}
                  loading="lazy"
                />
              </div>
            ) : (
              <h3 
                className="text-lg font-semibold"
                suppressHydrationWarning
              >
                {getSiteName()}
              </h3>
            )}
            <p 
              className="text-gray-400 text-sm"
              suppressHydrationWarning
            >
              {footerText}
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/ExhibitionOrganisor" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/@aakarexhibitionofficial" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://in.linkedin.com/company/aakar-exhibition-expo-pvt-ltd" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/exhibitions" className="text-gray-400 hover:text-white transition-colors">
                  Exhibitions
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-refund" className="text-gray-400 hover:text-white transition-colors">
                  Cancellation & Refund
                </Link>
              </li>
              <li>
                <Link href="/pricing-policy" className="text-gray-400 hover:text-white transition-colors">
                  Pricing Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-blue-400 mt-0.5" />
                <span className="text-gray-400">
                  B-2, Wall Street 2, opp. Orient Club,<br />
                  Ellisbridge, Ahmedabad, Gujarat 380006
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400">7016727956</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400">support@aakarexhibition.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p 
            className="text-gray-400 text-sm"
            suppressHydrationWarning
          >
            © 2025 {getSiteName()}. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
