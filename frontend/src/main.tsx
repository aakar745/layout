import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider, App as AntApp } from 'antd';
import App from './App';
import { store } from './store/store';
import './assets/styles/index.css';
import suppressFindDOMNodeWarning from './utils/suppressWarnings';

// Suppress findDOMNode warnings from Ant Design components
suppressFindDOMNodeWarning();

const theme = {
  token: {
    colorPrimary: '#7C3AED', // Modern purple
    borderRadius: 8,
    colorBgContainer: '#FFFFFF',
    colorBgLayout: '#F9FAFB',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Layout: {
      siderBg: '#FFFFFF',
      headerBg: '#FFFFFF',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#F3F4F6',
      itemHoverBg: '#F3F4F6',
      itemSelectedColor: '#7C3AED',
      itemColor: '#6B7280',
    },
    Card: {
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    },
    Button: {
      borderRadius: 8,
      primaryShadow: '0 1px 2px 0 rgb(124 58 237 / 0.05)',
    },
    Table: {
      borderRadius: 8,
      headerBg: '#F9FAFB',
    }
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <AntApp>
          <App />
        </AntApp>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
); 