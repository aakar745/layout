'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Users, Building2, TrendingUp } from 'lucide-react';
import { HERO_STATS } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';

export default function HeroSection() {
  const { openLoginModal } = useAuthStore();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
        {/* Animated background patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3)_0%,transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(120,119,198,0.2)_0%,transparent_50%)]"></div>
        
        {/* Dot pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              🚀 India's #1 Exhibition Management Platform
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Book Your
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                {" "}Perfect Stall
              </span>
              <br />
              in Seconds
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Discover thousands of exhibition opportunities across India. 
              Real-time booking, instant confirmation, and seamless management.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg font-medium">
              <Link href="/exhibitions">
                <span className="text-blue-600">Browse Exhibitions</span>
                <ArrowRight className="ml-2 h-5 w-5 text-blue-600" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => openLoginModal()}
              className="border-white/30 text-white hover:bg-white/10 bg-transparent font-medium"
              style={{ color: 'white' }}
            >
              <span className="text-white">Exhibitor Login</span>
            </Button>
          </div>

          {/* Stats */}
          <div className="pt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {HERO_STATS.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg backdrop-blur-sm">
                      <Icon className="h-6 w-6 text-blue-200" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                    <div className="text-blue-200 text-sm">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="pt-12">
            <div className="flex justify-center">
              <div className="animate-bounce">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl animate-float hidden lg:block"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-300/10 rounded-full blur-xl animate-float-reverse hidden lg:block"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/10 rounded-full blur-xl animate-float hidden lg:block"></div>
    </section>
  );
}
