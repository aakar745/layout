import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { App as AntApp, Spin } from 'antd';
import { RootState } from './store/store';
import MainLayout from './layouts/MainLayout';
// ExhibitorLayout removed - exhibitor functionality disabled
import Login from './pages/auth/Login';
import ErrorBoundary from './components/common/ErrorBoundary';
// Public components removed - now handled by publicview service
import './styles/modal.css';

// Lazy-loaded components
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
// Exhibitor components removed - exhibitor functionality disabled
const Profile = lazy(() => import('./pages/account/Profile'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const Roles = lazy(() => import('./pages/roles/index'));
const Users = lazy(() => import('./pages/users/index'));
const NotificationsPage = lazy(() => import('./pages/notifications/index'));
const ExhibitionList = lazy(() => import('./pages/exhibition/list'));
const ExhibitionCreate = lazy(() => import('./pages/exhibition/create'));
const ExhibitionDetails = lazy(() => import('./pages/exhibition/[id]'));
const ExhibitionEdit = lazy(() => import('./pages/exhibition/[id]/edit'));
const ExhibitionSpace = lazy(() => import('./pages/exhibition/[id]/space'));
const LayoutBuilder = lazy(() => import('./pages/exhibition/[id]/layout'));
const HallManager = lazy(() => import('./pages/exhibition/[id]/halls'));
const StallManager = lazy(() => import('./pages/exhibition/[id]/stalls'));
const FixtureManager = lazy(() => import('./pages/exhibition/[id]/fixtures'));
const StallList = lazy(() => import('./pages/stall/list'));
const StallType = lazy(() => import('./pages/stall/type'));
const StallBookingManager = lazy(() => import('./pages/booking/manage'));
const CreateBooking = lazy(() => import('./pages/booking/create'));
const InvoiceDetails = lazy(() => import('./pages/invoice/[id]'));
const InvoiceList = lazy(() => import('./pages/invoice/list'));
const ExhibitorManagement = lazy(() => import('./pages/exhibitors'));
const AmenitiesPage = lazy(() => import('./pages/amenities/index'));
const LettersPage = lazy(() => import('./pages/letters/index'));
const ActivityPage = lazy(() => import('./pages/activity/index'));
const AnalyticsPage = lazy(() => import('./pages/analytics'));
const ServiceChargesPage = lazy(() => import('./pages/service-charges/index'));
const ServiceChargeSettings = lazy(() => import('./pages/service-charges/settings'));
const ServiceChargeStallsPage = lazy(() => import('./pages/service-charge-stalls/index'));

// Static Pages removed - now handled by publicview service

// Preload critical routes to avoid loading delays
const preloadCriticalRoutes = () => {
  // Dashboard is commonly visited, so preload it
  const preloadDashboard = import('./pages/dashboard/Dashboard');
  // Booking manager is an important feature, preload it as well
  const preloadBookingManager = import('./pages/booking/manage');
  // Let the preloads happen in the background
  return { preloadDashboard, preloadBookingManager };
};

// Trigger preloading after initial render
setTimeout(preloadCriticalRoutes, 3000);

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" tip="Loading...">
      <div style={{ minHeight: '50px' }} />
    </Spin>
  </div>
);

// Admin private route
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Exhibitor functionality removed

// Wrap components with ErrorBoundary for consistent error handling
const withErrorBoundary = (component: React.ReactNode) => (
  <ErrorBoundary>
    {component}
  </ErrorBoundary>
);

function App() {
  return (
    <AntApp>
      <ErrorBoundary>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Redirect root to login - public routes now handled by publicview service */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              
              {/* Exhibitor Routes removed - functionality disabled */}
              
              {/* Private Admin Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      {withErrorBoundary(<Dashboard />)}
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              
              {/* Account Profile Route */}
              <Route
                path="/account"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <Profile />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              
              {/* Exhibition Routes */}
              <Route
                path="/exhibition"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <ExhibitionList />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/exhibition/create"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <ExhibitionCreate />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/exhibition/:id"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <ExhibitionDetails />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/exhibition/:id/space"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <ExhibitionSpace />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/exhibition/:id/layout"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <LayoutBuilder />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/exhibition/:id/halls"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <HallManager />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/exhibition/:id/stalls"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <StallManager />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/exhibition/:id/fixtures"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <FixtureManager />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/exhibition/:id/edit"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <ExhibitionEdit />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              
              {/* Stall Routes */}
              <Route
                path="/stall/list"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <StallList />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/stall-types"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <StallType />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/bookings"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      {withErrorBoundary(<StallBookingManager />)}
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/bookings/create"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <CreateBooking />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/amenities"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <AmenitiesPage />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/letters"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <LettersPage />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/invoices"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <InvoiceList />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/invoice/:id"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <InvoiceDetails />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/index"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <Users />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              
              {/* Settings Routes */}
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <Settings />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/roles"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <Roles />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/notifications"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <NotificationsPage />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              
              {/* Exhibitor Management Route */}
              <Route
                path="/exhibitors"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <ExhibitorManagement />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              
              {/* Activity Route */}
              <Route
                path="/activity"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <ActivityPage />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              
              {/* Analytics Route */}
              <Route
                path="/analytics"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <AnalyticsPage />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              
                             {/* Service Charges Routes */}
               <Route
                 path="/service-charges"
                 element={
                   <PrivateRoute>
                     <MainLayout>
                       <ServiceChargesPage />
                     </MainLayout>
                   </PrivateRoute>
                 }
               />
               <Route
                 path="/service-charges/settings"
                 element={
                   <PrivateRoute>
                     <MainLayout>
                       <ServiceChargeSettings />
                     </MainLayout>
                   </PrivateRoute>
                 }
               />
               <Route
                 path="/service-charge-stalls"
                 element={
                   <PrivateRoute>
                     <MainLayout>
                       <ServiceChargeStallsPage />
                     </MainLayout>
                   </PrivateRoute>
                 }
               />
              
              {/* Redirect any unmatched routes to the home page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </AntApp>
  );
}

export default App; 

// testcomment