import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/theme.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import { Provider } from 'react-redux';
import { store } from './store/store.js';

// Hide initial loader once React app is ready
const hideInitialLoader = () => {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.remove();
      }, 500);
    }, 300);
  }
};

// Call hide loader after app mounts
setTimeout(hideInitialLoader, 100);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
