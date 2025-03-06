
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Error handling for React 18's createRoot
const container = document.getElementById("root");

if (!container) {
  console.error("Failed to find the root element");
  document.body.innerHTML = '<div style="color: red; padding: 20px;">Failed to find the root element for rendering the app.</div>';
} else {
  try {
    const root = createRoot(container);
    
    // Add error boundary
    window.addEventListener('error', (event) => {
      console.error('Global error caught in main.tsx:', event.error);
    });
    
    // Render app with error handling
    try {
      root.render(<App />);
      console.log('Application rendered successfully');
    } catch (error) {
      console.error('Error rendering application:', error);
      root.render(
        <div style={{ 
          maxWidth: '500px', 
          margin: '50px auto', 
          padding: '20px', 
          backgroundColor: '#fff', 
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f56565'
        }}>
          <h2 style={{ color: '#e53e3e', marginBottom: '10px' }}>Failed to render the application</h2>
          <p style={{ color: '#4a5568', marginBottom: '15px' }}>
            An unexpected error occurred while trying to render the application.
          </p>
          <pre style={{ 
            backgroundColor: '#f7fafc', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '14px'
          }}>
            {error instanceof Error ? error.message : 'Unknown error'}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '15px',
              width: '100%'
            }}
          >
            Reload Application
          </button>
        </div>
      );
    }
  } catch (error) {
    console.error('Error creating React root:', error);
    container.innerHTML = `
      <div style="color: red; padding: 20px;">
        Failed to initialize the React application. Please check console for more details.
        <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    `;
  }
}
