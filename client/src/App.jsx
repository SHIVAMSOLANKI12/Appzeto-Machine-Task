// BookMyShow Lite++ Entry Point
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <GlobalProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '10px',
              },
            }}
          />
        </AuthProvider>
      </GlobalProvider>
    </Router>
  );
}

export default App;
