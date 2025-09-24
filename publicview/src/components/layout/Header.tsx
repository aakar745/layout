'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NAVIGATION_ITEMS } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { Menu, X, User, LogIn, LogOut, Building, Settings } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  const { 
    isAuthenticated, 
    exhibitor, 
    openLoginModal, 
    logout 
  } = useAuthStore();
  
  const { 
    getSiteName, 
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

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              {!isInitialized ? (
                // Loading placeholder to prevent flash
                <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
              ) : logoExists && getLogoUrl() && !logoError ? (
                <div className="relative h-10 w-auto">
                  <Image
                    src={getLogoUrl()!}
                    alt={`${getSiteName()} Logo`}
                    width={0}
                    height={40}
                    className="w-auto h-10 object-contain"
                    onError={() => setLogoError(true)}
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 768px) 100vw, 200px"
                  />
                </div>
              ) : (
                <span 
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  suppressHydrationWarning
                >
                  {getSiteName()}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && exhibitor ? (
              // Authenticated user dropdown
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span className="max-w-32 truncate">{exhibitor.companyName}</span>
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{exhibitor.companyName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {exhibitor.contactPerson}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-bookings" className="cursor-pointer">
                      <Building className="mr-2 h-4 w-4" />
                      <span>My Bookings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Unauthenticated user buttons
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => openLoginModal()}
                >
                  <User className="h-4 w-4 mr-2" />
                  Exhibitor Login
                </Button>
                <Button size="sm" asChild>
                  <Link href="/exhibitions">
                    View Exhibitions
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-3 space-y-2 flex-col space-y-2">
                {isAuthenticated && exhibitor ? (
                  // Mobile authenticated user section
                  <>
                    <div className="w-full px-3 py-2 text-base font-medium text-gray-900 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-2">
                        <Building className="h-5 w-5 text-gray-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {exhibitor.companyName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {exhibitor.contactPerson}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                      <Link href="/profile">
                        <Settings className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                      <Link href="/my-bookings">
                        <Building className="h-4 w-4 mr-2" />
                        My Bookings
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  // Mobile unauthenticated user buttons
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        openLoginModal();
                        setIsMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Exhibitor Login
                    </Button>
                    <Button size="sm" asChild className="w-full">
                      <Link href="/exhibitions">
                        View Exhibitions
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
