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
import ExhibitorBookings from './pages/exhibitor/Bookings';
import ExhibitorBookingDetails from './pages/exhibitor/BookingDetails';
import ExhibitorProfile from './pages/exhibitor/Profile';
import ExhibitorInvoiceDetails from './pages/exhibitor/InvoiceDetails';
import Profile from './pages/account/Profile';
import Settings from './pages/settings/Settings';
import Roles from './pages/roles/index';
import Users from './pages/users/index';
import NotificationsPage from './pages/notifications/index';
import ErrorBoundary from './components/common/ErrorBoundary';
import ExhibitionList from './pages/exhibition/list';
import ExhibitionCreate from './pages/exhibition/create';
import ExhibitionDetails from './pages/exhibition/[id]';
import ExhibitionEdit from './pages/exhibition/[id]/edit';
import ExhibitionSpace from './pages/exhibition/[id]/space';
import LayoutBuilder from './pages/exhibition/[id]/layout';
import HallManager from './pages/exhibition/[id]/halls';
import StallManager from './pages/exhibition/[id]/stalls';
import FixtureManager from './pages/exhibition/[id]/fixtures';
import { PublicLayoutView, PublicExhibitionDetails, PublicExhibitionList } from './components/exhibition/public_view';
import StallList from './pages/stall/list';
import StallType from './pages/stall/type';
import StallBookingManager from './pages/booking/manage';
import CreateBooking from './pages/booking/create';
import InvoiceDetails from './pages/invoice/[id]';
import Home from './pages/home/Home';
import ExhibitorManagement from './pages/exhibitors';
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