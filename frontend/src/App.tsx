import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { App as AntApp } from 'antd';
import { RootState } from './store/store';
import MainLayout from './layouts/MainLayout';
import ExhibitorLayout from './layouts/ExhibitorLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ExhibitorDashboard from './pages/exhibitor/Dashboard';
import Home from './pages/home/Home';
import ErrorBoundary from './components/common/ErrorBoundary';
import { PublicLayoutView, PublicExhibitionDetails, PublicExhibitionList } from './components/exhibition/public_view';
import lazyLoad from './utils/lazyLoad';

// Lazily load components that aren't critical for initial render
const Profile = lazyLoad(() => import('./pages/account/Profile'));
const Settings = lazyLoad(() => import('./pages/settings/Settings'));
const Roles = lazyLoad(() => import('./pages/roles/index'));
const Users = lazyLoad(() => import('./pages/users/index'));
const NotificationsPage = lazyLoad(() => import('./pages/notifications/index'));
const ExhibitionList = lazyLoad(() => import('./pages/exhibition/list'));
const ExhibitionCreate = lazyLoad(() => import('./pages/exhibition/create'));
const ExhibitionDetails = lazyLoad(() => import('./pages/exhibition/[id]'));
const ExhibitionEdit = lazyLoad(() => import('./pages/exhibition/[id]/edit'));
const ExhibitionSpace = lazyLoad(() => import('./pages/exhibition/[id]/space'));
const LayoutBuilder = lazyLoad(() => import('./pages/exhibition/[id]/layout'));
const HallManager = lazyLoad(() => import('./pages/exhibition/[id]/halls'));
const StallManager = lazyLoad(() => import('./pages/exhibition/[id]/stalls'));
const FixtureManager = lazyLoad(() => import('./pages/exhibition/[id]/fixtures'));
const StallList = lazyLoad(() => import('./pages/stall/list'));
const StallType = lazyLoad(() => import('./pages/stall/type'));
const StallBookingManager = lazyLoad(() => import('./pages/booking/manage'));
const CreateBooking = lazyLoad(() => import('./pages/booking/create'));
const InvoiceDetails = lazyLoad(() => import('./pages/invoice/[id]'));
const InvoiceList = lazyLoad(() => import('./pages/invoice/list'));
const ExhibitorManagement = lazyLoad(() => import('./pages/exhibitors'));
const AmenitiesPage = lazyLoad(() => import('./pages/amenities/index'));

// These are used more frequently by exhibitors, so keep them eagerly loaded
import ExhibitorBookings from './pages/exhibitor/Bookings';
import ExhibitorBookingDetails from './pages/exhibitor/BookingDetails';
import ExhibitorProfile from './pages/exhibitor/Profile';
import ExhibitorInvoiceDetails from './pages/exhibitor/InvoiceDetails';

import './styles/modal.css';

// Admin private route
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Exhibitor private route
const ExhibitorRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((state: RootState) => state.exhibitorAuth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AntApp>
      <ErrorBoundary>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Public Exhibition Routes */}
            <Route path="/exhibitions" element={<PublicExhibitionList />} />
            <Route path="/exhibitions/:id" element={<PublicExhibitionDetails />} />
            <Route path="/exhibitions/:id/layout" element={<PublicLayoutView />} />
            
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
        </Router>
      </ErrorBoundary>
    </AntApp>
  );
}

export default App; 