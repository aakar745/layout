'use client';

import { Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Exhibition Details</h2>
        <p className="text-gray-600">Please wait while we fetch the service charge configuration...</p>
      </div>
    </div>
  );
}
