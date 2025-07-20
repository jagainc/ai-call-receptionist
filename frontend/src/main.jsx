import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css'; // Global styles for Apple-like aesthetic

// Get the root element and the loading spinner element from index.html
const rootElement = document.getElementById('root');
const loadingSpinner = document.getElementById('loading-spinner');

/**
 * Hides the loading spinner with a fade-out effect and
 * shows the main application content with a fade-in effect.
 */
const hideSpinnerAndShowApp = () => {
  if (loadingSpinner) {
    // Apply fade-out transition to the spinner
    loadingSpinner.style.opacity = '0';
    loadingSpinner.style.transition = 'opacity 0.5s ease-out'; // Smooth transition for opacity

    // After the fade-out, hide the spinner completely
    setTimeout(() => {
      loadingSpinner.style.display = 'none';
    }, 500); // Match the transition duration
  }

  if (rootElement) {
    // Show the root element (React app) and apply fade-in transition
    rootElement.style.display = 'flex'; // Use 'flex' as per your App.jsx layout
    rootElement.style.opacity = '1';
    rootElement.style.transition = 'opacity 0.5s ease-in'; // Smooth transition for opacity
  }
};

// Create a React root and render the App component into the #root element
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// This script ensures the loading spinner is hidden and the app is shown
// after the DOM content is fully loaded and React has had a moment to render.
document.addEventListener('DOMContentLoaded', () => {
  // A small timeout ensures the spinner is visible for a minimum duration (e.g., 500ms).
  // This prevents the spinner from flashing too quickly on fast connections or cached loads,
  // providing a more consistent user experience.
  setTimeout(() => {
    // Check if the root element actually has children. This is a robust way
    // to determine if React has rendered its initial content.
    // This works in conjunction with the MutationObserver in index.html for ultimate reliability.
    if (rootElement && rootElement.children.length > 0) {
      hideSpinnerAndShowApp();
    } else {
      // Fallback: If for some reason React hasn't rendered children yet (e.g., very fast load
      // before MutationObserver fires, or a very complex initial render),
      // we still hide the spinner after the minimum delay.
      hideSpinnerAndShowApp();
    }
  }, 500); // Minimum display time for the spinner in milliseconds
});
