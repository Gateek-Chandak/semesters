import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// UI
import { Toaster } from "@/components/ui/toaster";
// Pages
import LandingPage from './pages/welcomePages/Landing.js';
import HomePage from './pages/userPages/HomePage.js';
import CoursePage from './pages/userPages/CoursePage.js';
import Dashboard from './pages/userPages/Dashboard.js';
import TermPage from './pages/userPages/TermPage.js';
import PrivacyPolicyTermsConditions from './pages/welcomePages/PP&TC.js';
import ProtectedRoute from './components/ProtectedRoute.js'

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
