import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { App as AntApp, Spin } from 'antd';
import { RootState } from './store/store';
import MainLayout from './layouts/MainLayout';
import ExhibitorLayout from './layouts/ExhibitorLayout';
import ErrorBoundary from './components/common/ErrorBoundary';
import LazyLoad from './components/common/LazyLoad';
import Home from './pages/home/Home';
import './styles/modal.css';

// Lazy loaded components
const Login = lazy(() => import('./pages/auth/Login'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const ExhibitorDashboard = lazy(() => import('./pages/exhibitor/Dashboard'));
const ExhibitorBookings = lazy(() => import('./pages/exhibitor/Bookings'));
const ExhibitorBookingDetails = lazy(() => import('./pages/exhibitor/BookingDetails'));
const ExhibitorProfile = lazy(() => import('./pages/exhibitor/Profile'));
const ExhibitorInvoiceDetails = lazy(() => import('./pages/exhibitor/InvoiceDetails'));
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
const PublicLayoutView = lazy(() => import('./components/exhibition/public_view/PublicLayoutView'));
const PublicExhibitionDetails = lazy(() => import('./components/exhibition/public_view/PublicExhibitionDetails'));
const PublicExhibitionList = lazy(() => import('./components/exhibition/public_view/PublicExhibitionList'));
const StallList = lazy(() => import('./pages/stall/list'));
const StallType = lazy(() => import('./pages/stall/type'));
const StallBookingManager = lazy(() => import('./pages/booking/manage'));
const CreateBooking = lazy(() => import('./pages/booking/create'));
const InvoiceDetails = lazy(() => import('./pages/invoice/[id]'));
const InvoiceList = lazy(() => import('./pages/invoice/list'));
const ExhibitorManagement = lazy(() => import('./pages/exhibitors'));
const AmenitiesPage = lazy(() => import('./pages/amenities/index'));

// Admin private route
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? <LazyLoad>{children}</LazyLoad> : <Navigate to="/login" />;
};

// Exhibitor private route
const ExhibitorRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.exhibitorAuth.isAuthenticated);
  return isAuthenticated ? <LazyLoad>{children}</LazyLoad> : <Navigate to="/" />;
};

function App() {
  return (
    <AntApp>
      <ErrorBoundary>
        <Router>
          <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <Spin size="large" />
            </div>
          }>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LazyLoad><Login /></LazyLoad>} />
              
              {/* Public Exhibition Routes */}
              <Route path="/exhibitions" element={<LazyLoad><PublicExhibitionList /></LazyLoad>} />
              <Route path="/exhibitions/:id" element={<LazyLoad><PublicExhibitionDetails /></LazyLoad>} />
              <Route path="/exhibitions/:id/layout" element={<LazyLoad><PublicLayoutView /></LazyLoad>} />
              
              {/* Exhibitor Routes */}
              <Route
                path="/exhibitor/dashboard"
                element={
                  <ExhibitorRoute>
                    <ExhibitorLayout>
                      <ExhibitorDashboard />
                    </ExhibitorLayout>
                  </ExhibitorRoute>
                }
              />
              <Route
                path="/exhibitor/profile"
                element={
                  <ExhibitorRoute>
                    <ExhibitorLayout>
                      <ExhibitorProfile />
                    </ExhibitorLayout>
                  </ExhibitorRoute>
                }
              />
              <Route
                path="/exhibitor/bookings"
                element={
                  <ExhibitorRoute>
                    <ExhibitorLayout>
                      <ExhibitorBookings />
                    </ExhibitorLayout>
                  </ExhibitorRoute>
                }
              />
              <Route
                path="/exhibitor/bookings/:id"
                element={
                  <ExhibitorRoute>
                    <ExhibitorLayout>
                      <ExhibitorBookingDetails />
                    </ExhibitorLayout>
                  </ExhibitorRoute>
                }
              />
              <Route
                path="/exhibitor/support"
                element={
                  <ExhibitorRoute>
                    <ExhibitorLayout>
                      <div>Help & Support</div>
                    </ExhibitorLayout>
                  </ExhibitorRoute>
                }
              />
              <Route
                path="/exhibitor/invoice/:id"
                element={
                  <ExhibitorRoute>
                    <ExhibitorLayout>
                      <ExhibitorInvoiceDetails />
                    </ExhibitorLayout>
                  </ExhibitorRoute>
                }
              />
              
              {/* Private Admin Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <Dashboard />
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
                      <StallBookingManager />
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