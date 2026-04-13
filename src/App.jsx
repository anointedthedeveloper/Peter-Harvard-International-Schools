import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import TickerBar from './components/TickerBar';
import PageLoader from './components/PageLoader';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Portal from './pages/Portal';
import Developer from './pages/Developer';
import Admission from './pages/Admission';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Blog from './pages/Blog';
import NotFound from './pages/NotFound';
import { AuthProvider } from './lib/auth';

const HIDDEN_ROUTES = ['/login', '/dashboard'];

const RouteScrollReset = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const hideChrome = HIDDEN_ROUTES.includes(location.pathname);

  return (
    <>
      {!hideChrome && <Navbar darkMode={window.__darkMode} setDarkMode={window.__setDarkMode} />}
      <RouteScrollReset />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/portal" element={<PageTransition><Portal /></PageTransition>} />
          <Route path="/developer" element={<PageTransition><Developer /></PageTransition>} />
          <Route path="/admission" element={<PageTransition><Admission /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      {!hideChrome && <Footer />}
    </>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  // Expose to AnimatedRoutes via window (avoids prop drilling through router)
  window.__darkMode = darkMode;
  window.__setDarkMode = setDarkMode;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <PageLoader />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
          <ScrollToTop />
          <TickerBar />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
