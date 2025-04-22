import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import './styles/index.css';

// Add custom styles to fix the message notification container
const style = document.createElement('style');
style.innerHTML = `
  .ant-message .ant-message-notice-content {
    display: inline-block !important;
    max-width: 300px !important;
    width: auto !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    border-radius: 8px !important;
  }
  
  .ant-message {
    text-align: center !important;
  }
`;
document.head.appendChild(style);

// Fix for passive event listener warnings
// This adds a global method to mark touch listeners as non-passive when needed
document.addEventListener('DOMContentLoaded', () => {
  // Add non-passive event listener support
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    let newOptions = options;
    if (type.startsWith('touch') || type === 'wheel') {
      if (typeof options === 'boolean') {
        newOptions = { capture: options, passive: false };
      } else if (options === undefined) {
        newOptions = { passive: false };
      } else if (typeof options === 'object' && options.passive === undefined) {
        newOptions = { ...options, passive: false };
      }
    }
    originalAddEventListener.call(this, type, listener, newOptions);
  };
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
); 