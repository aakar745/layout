'use client';

import React, { useEffect, useState } from 'react';
import { Group, Rect, Text, Image } from 'react-konva';
import { Fixture, LayoutViewConfig } from '@/lib/types/layout';
import useImage from 'use-image';

interface FixtureRendererProps {
  fixture: Fixture;
  viewConfig: LayoutViewConfig;
  scale?: number;
}

// Helper function to get authenticated image URL (matching old frontend)
const getAuthenticatedImageUrl = (path: string): string => {
  if (!path) return '';
  
  // Use API base URL from environment or default
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const backendUrl = apiUrl.replace('/api', '');
  
  // Clean the path
  const cleanPath = path.replace(/^\/?(api\/uploads\/)?/, '');
  
  // For fixture icons, allow public access
  if (cleanPath.includes('fixtures/')) {
    return `${backendUrl}/api/uploads/${cleanPath}`;
  }
  
  // For other resources, require authentication
  const token = localStorage.getItem('token');
  if (!token) return '';
  
  return `${backendUrl}/api/uploads/${cleanPath}?token=${token}`;
};

export default function FixtureRenderer({ fixture, viewConfig, scale = 1 }: FixtureRendererProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  
  // Set up authenticated image URL when fixture icon changes (exactly like old frontend)
  useEffect(() => {
    if (fixture.icon) {
      const authenticatedUrl = getAuthenticatedImageUrl(fixture.icon);
      setImageUrl(authenticatedUrl);
    } else {
      setImageUrl('');
    }
  }, [fixture.icon]);
  
  // Use the authenticated image URL 
  const [image] = useImage(imageUrl);

  // Helper function to format dimensions for display (exactly like old frontend)
  const formatDimensions = (width: number, height: number): string => {
    return `${Math.round(width)} m x ${Math.round(height)} m`;
  };

  // Helper function to calculate appropriate font size (exactly like old frontend)
  const calculateFontSize = (width: number, height: number): number => {
    const baseSize = Math.min(width, height) * 0.12; // 12% of smaller dimension
    const minSize = 8 / scale; // Minimum readable size
    const maxSize = 16 / scale; // Maximum size to prevent oversized text
    return Math.max(minSize, Math.min(maxSize, baseSize));
  };

  const renderFixture = () => {
    // Define border properties with defaults (exactly like old frontend)
    const borderColor = fixture.borderColor || "#d9d9d9";
    const borderRadius = fixture.borderRadius !== undefined ? fixture.borderRadius / scale : 3 / scale;
    
    // If we have an image, render it, otherwise render a basic shape (exactly like old frontend)
    if (image) {
      return (
        <Image
          image={image}
          width={fixture.dimensions.width}
          height={fixture.dimensions.height}
          fill={fixture.color || '#ffffff'}
          stroke={borderColor}
          strokeWidth={1 / scale}
          cornerRadius={borderRadius}
          shadowColor="rgba(0,0,0,0.1)"
          shadowBlur={5 / scale}
          shadowOffset={{ x: 2 / scale, y: 2 / scale }}
          shadowOpacity={0.5}
        />
      );
    }

    // Fallback to rectangle for fixtures without icons (exactly like old frontend)
    return (
      <Rect
        width={fixture.dimensions.width}
        height={fixture.dimensions.height}
        fill={fixture.color || '#f0f2f5'}
        stroke={borderColor}
        strokeWidth={1 / scale}
        cornerRadius={borderRadius}
        shadowColor="rgba(0,0,0,0.1)"
        shadowBlur={5 / scale}
        shadowOffset={{ x: 2 / scale, y: 2 / scale }}
        shadowOpacity={0.5}
      />
    );
  };

  return (
    <Group
      x={fixture.position.x}
      y={fixture.position.y}
      width={fixture.dimensions.width}
      height={fixture.dimensions.height}
      rotation={fixture.rotation || 0}
      listening={false}
    >
      {renderFixture()}
      
      {/* For fixtures WITH images, show name based on showName setting (exactly like old frontend) */}
      {image && fixture.name && fixture.showName !== false && (
        <Text
          text={fixture.name}
          fontSize={12 / scale}
          fill="#000000"
          width={fixture.dimensions.width}
          align="center"
          y={-16 / scale}
        />
      )}
      
      {/* For fixtures WITHOUT images, always show name and dimensions (exactly like old frontend) */}
      {!image && (
        <>
          {/* Fixture Name */}
          {fixture.name && (
            <Text
              text={fixture.name}
              fontSize={calculateFontSize(fixture.dimensions.width, fixture.dimensions.height)}
              fill="#333333"
              fontStyle="bold"
              width={fixture.dimensions.width}
              height={fixture.dimensions.height * 0.6}
              align="center"
              verticalAlign="middle"
              wrap="word"
              x={0}
              y={fixture.dimensions.height * 0.2}
            />
          )}
          
          {/* Fixture Dimensions */}
          <Text
            text={formatDimensions(fixture.dimensions.width, fixture.dimensions.height)}
            fontSize={calculateFontSize(fixture.dimensions.width, fixture.dimensions.height) * 0.8}
            fill="#666666"
            width={fixture.dimensions.width}
            align="center"
            x={0}
            y={fixture.dimensions.height * 0.75}
          />
        </>
      )}
    </Group>
  );
}
