import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Trophy, Users, TrendingUp, Shield, Award } from 'lucide-react';
import { ABOUT_TIMELINE } from '@/lib/constants';

export default function AboutSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Our Story
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Transforming Exhibition
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Management
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing how exhibitions are managed across India, making it easier for 
            businesses to showcase their products and connect with their audience.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">5+ Years</h3>
            <p className="text-gray-600">Industry Experience</p>
          </Card>
          
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">1000+</h3>
            <p className="text-gray-600">Satisfied Exhibitors</p>
          </Card>
          
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">98%</h3>
            <p className="text-gray-600">Success Rate</p>
          </Card>
        </div>

        {/* Mission & Values */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Mission */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To democratize exhibition participation by providing a seamless, technology-driven platform 
              that connects exhibitors with the right opportunities, eliminates bureaucracy, and ensures 
              successful events for all stakeholders.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">Transparent pricing and processes</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">Real-time booking and management</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">24/7 customer support</span>
              </li>
            </ul>
          </div>

          {/* Values */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Our Values</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We believe in transparency, innovation, and putting our customers first. Every decision we make 
              is guided by our commitment to excellence and our desire to make exhibition management effortless.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Innovation</h4>
                <p className="text-sm text-gray-600">Cutting-edge technology solutions</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Trust</h4>
                <p className="text-sm text-gray-600">Reliable and secure platform</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Support</h4>
                <p className="text-sm text-gray-600">Always here when you need us</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Growth</h4>
                <p className="text-sm text-gray-600">Helping businesses expand</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Our Journey</h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-200 h-full hidden md:block"></div>
            
            <div className="space-y-8">
              {ABOUT_TIMELINE.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:space-x-8`}>
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center`}>
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="font-bold text-blue-600 text-lg mb-2">{item.year}</div>
                      <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0 w-4 h-4 bg-blue-600 rounded-full hidden md:block">
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                  
                  <div className="w-full md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
