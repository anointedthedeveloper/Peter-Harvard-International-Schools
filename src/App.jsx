import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
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
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';
import { supabase } from './lib/supabase';
import { AuthProvider } from './lib/auth';

const HIDDEN_ROUTES = ['/login', '/dashboard'];

const RouteScrollReset = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);
  return null;
};

const FloatingIcons = () => {
  const [visible, setVisible] = useState(false);
  const [footerOffset, setFooterOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 100);
      const footer = document.querySelector('footer');
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const winH = window.innerHeight;
        setFooterOffset(footerTop < winH ? winH - footerTop : 0);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [tickerOpen, setTickerOpen] = useState(false);
  const [tickerItems, setTickerItems] = useState([
    'Excellence in Education', 'Admissions Open', 'World-Class Facilities',
    'Expert Faculty', 'Global Curriculum', "Peter Harvard Int'l Schools",
  ]);

  useEffect(() => {
    supabase.from('ticker_items').select('text').order('position', { ascending: true })
      .then(({ data }) => { if (data && data.length > 0) setTickerItems(data.map(d => d.text)); });
  }, []);

  // ticker bar height ~40px, button height 44px, gap 8px
  const TICKER_H = 40;
  const BTN_GAP = 8;
  const btnBottom = tickerOpen
    ? footerOffset + TICKER_H + BTN_GAP
    : footerOffset + 24;
  const waBottom = footerOffset + 24;

  return (
    <>
      {/* WhatsApp */}
      <motion.a
        href="https://wa.me/2348062134991"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ y: -80, opacity: 0, rotate: -15 }}
        animate={visible
          ? { y: 0, opacity: 1, rotate: 0 }
          : { y: -80, opacity: 0, rotate: -15 }
        }
        transition={{ type: 'spring', stiffness: 400, damping: 12, mass: 1.2 }}
        style={{ bottom: waBottom }}
        className="fixed right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-xl flex items-center justify-center transition-colors hover:scale-110"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>

      {/* Megaphone / Ticker toggle */}
      <motion.button
        onClick={() => setTickerOpen(o => !o)}
        aria-label="Toggle announcements"
        initial={{ y: -80, opacity: 0, rotate: 15 }}
        animate={visible
          ? { y: 0, opacity: 1, rotate: 0 }
          : { y: -80, opacity: 0, rotate: 15 }
        }
        transition={{ type: 'spring', stiffness: 400, damping: 12, mass: 1.2, delay: 0.08 }}
        style={{ bottom: btnBottom, transition: 'bottom 0.25s ease' }}
        className="fixed left-6 z-50 w-11 h-11 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-xl flex items-center justify-center"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={tickerOpen ? 'x' : 'mega'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }} className="block">
            {tickerOpen
              ? <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
            }
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Ticker bar — always glued to bottom, rides up over footer */}
      <AnimatePresence>
        {tickerOpen && (
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ bottom: footerOffset }}
            className="fixed left-0 right-0 z-40 overflow-hidden bg-green-600 shadow-[0_-4px_20px_rgba(22,163,74,0.45)] py-2.5"
          >
            <div className="flex animate-ticker whitespace-nowrap">
              {[...Array(3)].map((_, ri) => (
                <div key={ri} className="flex items-center gap-8 px-8 shrink-0">
                  {tickerItems.map((text, i) => (
                    <span key={i} className="flex items-center gap-3 text-white font-bold text-sm uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                      {text}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
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
          <Route path="/blog/:id" element={<PageTransition><BlogPost /></PageTransition>} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      {!hideChrome && <Footer />}
      {!hideChrome && <FloatingIcons />}
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
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen flex flex-col">
          <PageLoader />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
          <ScrollToTop />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
