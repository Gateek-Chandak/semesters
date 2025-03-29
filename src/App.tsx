import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// UI
import { Toaster } from "@/components/ui/toaster";
// Pages
import LandingPage from './pages/landing/Landing.js';
import HomePage from './pages/user/HomePage.js';
import CoursePage from './pages/user/CoursePage.js';
import Dashboard from './pages/user/Dashboard.js';
import TermPage from './pages/user/TermPage.js';
import PrivacyPolicyTermsConditions from './pages/landing/PP&TC.js';
import ProtectedRoute from './components/shared/ProtectedRoute.js'

function App() {

  return (
    <Router>
      <div className="h-full bg-[#f7f7f7]">
        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy-policy-and-terms-conditions" element={<PrivacyPolicyTermsConditions />} />
          {/* Home route with nested routes */}
          <Route path="/home" 
                 element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  }>
            {/* Nested routes for dynamic courses */}
            <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path=":term/:course" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
            <Route path=":term" element={<ProtectedRoute><TermPage /></ProtectedRoute>} />
          </Route>
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
