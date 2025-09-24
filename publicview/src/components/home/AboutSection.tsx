import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Trophy, Users, TrendingUp, Shield, Award } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm">
            About Aakar Exhibition
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-2 sm:px-0">
            Creating Business
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Opportunities
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0 leading-relaxed">
            With over 25 years of experience, Aakar Exhibition has been organizing premier trade shows and exhibitions across India, 
            connecting businesses, fostering innovation, and driving growth in diverse industries.
          </p>
        </div>


        {/* Mission & Values */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
          {/* Mission */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Our Mission</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              To create world-class exhibition platforms that foster business growth, innovation, and networking 
              opportunities across diverse industries. We connect businesses, showcase cutting-edge products, 
              and drive economic development through strategic events.
            </p>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-600">Premium venue partnerships nationwide</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-600">Industry-focused specialized exhibitions</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-600">Comprehensive event management</span>
              </li>
            </ul>
          </div>

          {/* Values */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Our Values</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Excellence, integrity, and innovation drive everything we do. We are committed to creating memorable 
              experiences that deliver tangible business results for our exhibitors and visitors alike.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2 p-3 rounded-lg bg-white/50">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Excellence</h4>
                <p className="text-xs sm:text-sm text-gray-600">World-class event standards</p>
              </div>
              <div className="space-y-1 sm:space-y-2 p-3 rounded-lg bg-white/50">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Partnership</h4>
                <p className="text-xs sm:text-sm text-gray-600">Long-term business relationships</p>
              </div>
              <div className="space-y-1 sm:space-y-2 p-3 rounded-lg bg-white/50">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Innovation</h4>
                <p className="text-xs sm:text-sm text-gray-600">Technology-driven solutions</p>
              </div>
              <div className="space-y-1 sm:space-y-2 p-3 rounded-lg bg-white/50">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Impact</h4>
                <p className="text-xs sm:text-sm text-gray-600">Driving industry growth</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
