import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Forcefully unregister old aggressive PWA Service Workers to ensure latest UI updates
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister().then(function () {
        console.log('Old ServiceWorker unregistered forcefully.');
        if (!window.sessionStorage.getItem('pwa_cleared')) {
          window.sessionStorage.setItem('pwa_cleared', 'true');
          window.location.reload(true);
        }
      });
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
