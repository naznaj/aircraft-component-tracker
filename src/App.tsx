import './App.css';
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import SDSSubmission from './pages/SDSSubmission';
import { Toaster } from './components/ui/sonner';
import { RobbingProvider } from './context/RobbingContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <RobbingProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sds-submission" element={<SDSSubmission />} />
              <Route path="/sds-submission/:requestId" element={<SDSSubmission />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </RobbingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
