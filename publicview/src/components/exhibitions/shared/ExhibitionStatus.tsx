import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, CheckCircle } from 'lucide-react';
import { 
  getExhibitionStatus, 
  calculateDaysInfo 
} from '@/lib/utils/exhibitions';

interface ExhibitionStatusProps {
  startDate: string;
  endDate: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'pill' | 'minimal';
}

export default function ExhibitionStatus({ 
  startDate, 
  endDate, 
  showIcon = true,
  size = 'md',
  variant = 'badge'
}: ExhibitionStatusProps) {
  const status = getExhibitionStatus(startDate, endDate);
  const daysInfo = calculateDaysInfo(startDate, endDate);

  const getIcon = () => {
    if (!showIcon) return null;
    
    const iconProps = { className: size === 'sm' ? 'h-3 w-3' : 'h-4 w-4' };
    
    switch (status.status) {
      case 'upcoming':
        return <Clock {...iconProps} />;
      case 'active':
        return <Calendar {...iconProps} />;
      case 'completed':
        return <CheckCircle {...iconProps} />;
      default:
        return null;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-sm px-4 py-2';
      default:
        return 'text-xs px-3 py-1.5';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = 'inline-flex items-center gap-1.5 font-medium transition-colors';
    
    switch (variant) {
      case 'pill':
        return `${baseClasses} rounded-full`;
      case 'minimal':
        return `${baseClasses} border-0 bg-transparent`;
      default:
        return `${baseClasses} rounded-md`;
    }
  };

  const statusText = status.status.charAt(0).toUpperCase() + status.status.slice(1);

  if (variant === 'minimal') {
    return (
      <div 
        className={`${getVariantClasses()} ${getSizeClasses()}`}
        style={{ color: status.color }}
      >
        {getIcon()}
        <span>{statusText}</span>
      </div>
    );
  }

  return (
    <Badge 
      className={`${getVariantClasses()} ${getSizeClasses()}`}
      style={{ 
        backgroundColor: status.bgColor,
        color: status.textColor,
        border: `1px solid ${status.color}30`
      }}
    >
      {getIcon()}
      <span>{statusText}</span>
    </Badge>
  );
}

// Compact status with days info
export function ExhibitionStatusWithDays({ 
  startDate, 
  endDate,
  showDaysInfo = true 
}: ExhibitionStatusProps & { showDaysInfo?: boolean }) {
  const status = getExhibitionStatus(startDate, endDate);
  const daysInfo = calculateDaysInfo(startDate, endDate);

  return (
    <div className="flex flex-col items-start gap-1">
      <ExhibitionStatus 
        startDate={startDate} 
        endDate={endDate}
        size="sm"
        variant="pill"
      />
      {showDaysInfo && (
        <div className="text-xs text-gray-500">
          {daysInfo.label}
        </div>
      )}
    </div>
  );
}
