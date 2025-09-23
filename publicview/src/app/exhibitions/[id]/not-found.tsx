import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ExhibitionNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="text-6xl mb-4">🏢</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Exhibition Not Found
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The exhibition you&apos;re looking for doesn&apos;t exist or has been removed. 
          It may have been deactivated or the URL might be incorrect.
        </p>
        <div className="space-y-4">
          <Link href="/exhibitions">
            <Button size="lg" className="w-full">
              Browse All Exhibitions
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
