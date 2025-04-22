import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import exhibitionReducer from './slices/exhibitionSlice';
import bookingReducer from './slices/bookingSlice';
import exhibitorAuthReducer from './slices/exhibitorAuthSlice';
import exhibitorReducer from './slices/exhibitorSlice';
import settingsReducer from './slices/settingsSlice';
import { bookingApi } from './services/booking';
import { invoiceApi } from './services/invoice';
import { exhibitorInvoiceApi } from './services/exhibitorInvoice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exhibitorAuth: exhibitorAuthReducer,
    exhibition: exhibitionReducer,
    booking: bookingReducer,
    exhibitor: exhibitorReducer,
    settings: settingsReducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    [exhibitorInvoiceApi.reducerPath]: exhibitorInvoiceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(bookingApi.middleware)
      .concat(invoiceApi.middleware)
      .concat(exhibitorInvoiceApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 