'use client';

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ErrorScreenProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Unable to Load Service Charges
        </h1>
        
        <p className="text-gray-600 mb-8">
          {error}
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={onRetry}
            className="w-full"
            size="lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Link href="/exhibitions">
            <Button variant="outline" className="w-full" size="lg">
              <Home className="w-4 h-4 mr-2" />
              Browse Exhibitions
            </Button>
          </Link>
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Common Issues:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Service charges may not be enabled for this exhibition</li>
            <li>• The exhibition may no longer be active</li>
            <li>• There may be a temporary connectivity issue</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
