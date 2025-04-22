import React, { useEffect } from 'react';

interface FixturePreviewProps {
  name: string;
  type: string;
  color: string;
  rotation: number;
  showName: boolean;
  iconUrl?: string;
  defaultIcons: Record<string, string>;
  borderColor?: string | null;
  borderRadius?: number;
}

/**
 * Displays a preview of a fixture with current settings
 */
const FixturePreview: React.FC<FixturePreviewProps> = ({
  name,
  type,
  color,
  rotation,
  showName,
  iconUrl,
  defaultIcons,
  borderColor = null,
  borderRadius = 0
}) => {
  // Log when the component renders with props for debugging
  useEffect(() => {
    console.log('FixturePreview rendering with props:', {
      name,
      type,
      color,
      rotation,
      showName,
      iconUrl,
      defaultIconAvailable: !!defaultIcons[type],
      borderColor,
      borderRadius
    });
  }, [name, type, color, rotation, showName, iconUrl, defaultIcons, borderColor, borderRadius]);

  // Get the default icon for this fixture type
  const defaultIcon = defaultIcons[type] || '📦';

  return (
    <div 
      style={{ 
        padding: '24px',
        textAlign: 'center',
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #f0f0f0',
        borderRadius: '8px 8px 0 0'
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '120px',
          height: '120px',
          borderRadius: `${borderRadius || 4}px`,
          backgroundColor: color || '#f0f0f0',
          transform: `rotate(${rotation}deg)`,
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          position: 'relative',
          border: borderColor ? `1px solid ${borderColor}` : '1px solid rgba(0,0,0,0.05)'
        }}
      >
        {/* Display either uploaded icon or default icon */}
        {iconUrl ? (
          <img 
            src={iconUrl}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '8px'
            }}
          />
        ) : (
          <div
            style={{
              fontSize: '48px',
              lineHeight: '1',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {defaultIcon}
          </div>
        )}
      </div>
      
      {showName && (
        <div
          style={{
            marginTop: '12px',
            fontSize: '16px',
            fontWeight: 500,
            color: '#333'
          }}
        >
          {name}
        </div>
      )}
      
      <div
        style={{
          marginTop: '4px',
          fontSize: '14px',
          color: '#888',
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
        <span>•</span>
        <span>{color}</span>
        {rotation > 0 && (
          <>
            <span>•</span>
            <span>{rotation}°</span>
          </>
        )}
        {borderColor && (
          <>
            <span>•</span>
            <span>Border: {borderColor}</span>
          </>
        )}
        {borderRadius > 0 && (
          <>
            <span>•</span>
            <span>Radius: {borderRadius}px</span>
          </>
        )}
      </div>
    </div>
  );
};

export default FixturePreview; 