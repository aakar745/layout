import React from 'react';
import { Menu } from 'antd';
import { LayoutOutlined, AppstoreOutlined, ShopOutlined, TableOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

interface LayoutContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  onExhibitionClick: () => void;
  onHallClick: () => void;
  onStallClick?: () => void;
  onFixtureClick?: () => void;
  onClose: () => void;
}

const LayoutContextMenu: React.FC<LayoutContextMenuProps> = ({
  visible,
  x,
  y,
  onExhibitionClick,
  onHallClick,
  onStallClick,
  onFixtureClick,
  onClose
}) => {
  if (!visible) return null;

  // Create menu items, filtering out undefined items
  const menuItems: MenuProps['items'] = [
    {
      key: 'exhibition',
      icon: <LayoutOutlined />,
      label: 'Exhibition Space',
      onClick: () => {
        onExhibitionClick();
        onClose();
      }
    },
    {
      key: 'hall',
      icon: <AppstoreOutlined />,
      label: 'Add Hall',
      onClick: () => {
        onHallClick();
        onClose();
      }
    }
  ];

  // Conditionally add stall option
  if (onStallClick) {
    menuItems.push({
      key: 'stall',
      icon: <ShopOutlined />,
      label: 'Add Stall',
      onClick: () => {
        onStallClick();
        onClose();
      }
    });
  }

  // Conditionally add fixture option
  if (onFixtureClick) {
    menuItems.push({
      key: 'fixture',
      icon: <TableOutlined />,
      label: 'Add Fixture',
      onClick: () => {
        onFixtureClick();
        onClose();
      }
    });
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: y,
        left: x,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        borderRadius: '4px',
        backgroundColor: '#fff',
        width: '200px'
      }}
    >
      <Menu items={menuItems} />
    </div>
  );
};

export default LayoutContextMenu; 