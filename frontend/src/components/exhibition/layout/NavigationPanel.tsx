import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { InfoCircleOutlined, LayoutOutlined, EditOutlined } from '@ant-design/icons';
import { getExhibitionUrl, getPublicExhibitionUrl } from '../../../utils/url';

interface NavLink {
  name: string;
  path: string;
  icon: React.ReactNode;
  active: boolean;
}

/**
 * Helper function to extract the exhibition ID from a URL path
 */
const getExhibitionIdFromUrl = (path: string): string => {
  // For admin routes: /exhibition/{id} or /exhibition/{id}/...
  if (path.includes('/exhibition/')) {
    const match = path.match(/\/exhibition\/([^\/]+)/);
    return match?.[1] || '';
  }
  
  // For public routes: /exhibitions/{id} or /exhibitions/{id}/...
  if (path.includes('/exhibitions/')) {
    const match = path.match(/\/exhibitions\/([^\/]+)/);
    return match?.[1] || '';
  }
  
  return '';
};

/**
 * Helper function to check if two paths are essentially the same
 */
const isSamePath = (path1: string, path2: string): boolean => {
  // Remove trailing slashes for comparison
  const normalizedPath1 = path1.replace(/\/$/, '');
  const normalizedPath2 = path2.replace(/\/$/, '');
  
  return normalizedPath1 === normalizedPath2;
};

const NavigationPanel: React.FC = () => {
  const location = useLocation();
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);

  useEffect(() => {
    // Generate navigation links based on the user role and current location
    let links: NavLink[] = [];

    if (location.pathname.includes('/exhibition/')) {
      // Admin exhibition pages
      const exhibitionId = getExhibitionIdFromUrl(location.pathname);
      
      links = [
        {
          name: 'Details',
          path: getExhibitionUrl({ _id: exhibitionId }),
          icon: <InfoCircleOutlined />,
          active: isSamePath(location.pathname, `/exhibition/${exhibitionId}`)
        },
        {
          name: 'Layout',
          path: getExhibitionUrl({ _id: exhibitionId }, 'layout'),
          icon: <LayoutOutlined />,
          active: location.pathname.includes(`/exhibition/${exhibitionId}/layout`)
        },
        {
          name: 'Edit',
          path: getExhibitionUrl({ _id: exhibitionId }, 'edit'),
          icon: <EditOutlined />,
          active: location.pathname.includes(`/exhibition/${exhibitionId}/edit`)
        }
      ];
    } else if (location.pathname.includes('/exhibitions/')) {
      // Public exhibition pages
      const exhibitionId = getExhibitionIdFromUrl(location.pathname);
      
      links = [
        {
          name: 'Details',
          path: getPublicExhibitionUrl({ _id: exhibitionId }),
          icon: <InfoCircleOutlined />,
          active: isSamePath(location.pathname, `/exhibitions/${exhibitionId}`)
        },
        {
          name: 'Layout',
          path: getPublicExhibitionUrl({ _id: exhibitionId }, 'layout'),
          icon: <LayoutOutlined />,
          active: location.pathname.includes(`/exhibitions/${exhibitionId}/layout`)
        }
      ];
    }

    setNavLinks(links);
  }, [location.pathname]);

  return (
    <div className="navigation-panel">
      {navLinks.map((link, index) => (
        <a 
          key={index} 
          href={link.path} 
          className={`nav-link ${link.active ? 'active' : ''}`}
        >
          {link.icon}
          <span>{link.name}</span>
        </a>
      ))}
    </div>
  );
};

export default NavigationPanel; 