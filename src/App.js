// App.js
import { AuthProvider } from './context/AuthContext';
import AppContent from './components/AppContent';

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}