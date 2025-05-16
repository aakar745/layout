import React, { Suspense } from 'react';
import { Spin } from 'antd';

interface LazyLoadProps {
  children: React.ReactNode;
}

const LazyLoad: React.FC<LazyLoadProps> = ({ children }) => {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '2rem' }}>
        <Spin size="large" />
      </div>
    }>
      {children}
    </Suspense>
  );
};

export default LazyLoad; 