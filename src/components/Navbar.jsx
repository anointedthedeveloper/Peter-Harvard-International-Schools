import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ChevronRight } from 'lucide-react';

const Navbar = ({ darkMode, setDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  // Transparent only on home page before scroll
  const isTransparent = isHome && !isScrolled;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      isTransparent
        ? 'py-5 bg-transparent'
        : 'py-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-100/50 dark:border-gray-800/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`transition-all duration-300 ${isTransparent ? 'w-14 h-14' : 'w-11 h-11'}`}
            >
              <img src="/assets/Badge.jpg" alt="PHIS Logo" className="w-full h-full object-cover rounded-xl" />
            </motion.div>
            <div className="flex flex-col leading-tight">
              <span className={`font-extrabold tracking-tight transition-all duration-300 ${
                isTransparent ? 'text-xl text-white' : 'text-base text-secondary dark:text-white'
              }`}>
                Peter Harvard
              </span>
              <span className={`text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
                isTransparent ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'
              }`}>
                Int'l Schools
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 group ${
                  isTransparent
                    ? 'text-white/90 hover:text-white hover:bg-white/10'
                    : isActive(link.path)
                      ? 'text-secondary'
                      : 'text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {link.name}
                {/* Active underline */}
                {isActive(link.path) && (
                  <motion.span
                    layoutId="nav-pill"
                    className={`absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full ${isTransparent ? 'bg-white' : 'bg-secondary'}`}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                {/* Hover underline for non-active */}
                {!isActive(link.path) && (
                  <span className={`absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left ${
                    isTransparent ? 'bg-white/50' : 'bg-secondary/40'
                  }`} />
                )}
              </Link>
            ))}

            <div className={`w-px h-5 mx-2 ${isTransparent ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'}`} />

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/portal"
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold transition-all shadow-md ${
                  isActive('/portal')
                    ? 'bg-red-700 text-white shadow-red-500/30'
                    : 'bg-secondary hover:bg-red-700 text-white shadow-red-500/20 hover:shadow-red-500/40'
                }`}
              >
                Portal <ChevronRight size={14} />
              </Link>
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`ml-1 p-2.5 rounded-full transition-all duration-200 ${
                isTransparent
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={darkMode ? 'sun' : 'moon'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-colors ${
                isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isTransparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isOpen ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-2xl"
          >
            {/* Logo strip */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <img src="/assets/Badge.jpg" alt="PHIS" className="w-10 h-10 rounded-lg object-cover shadow" />
              <div>
                <p className="font-extrabold text-gray-900 dark:text-white text-sm leading-tight">Peter Harvard Int'l Schools</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Kubwa, Abuja</p>
              </div>
            </div>

            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive(link.path)
                        ? 'bg-secondary/10 text-secondary border border-secondary/20'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
                    }`}
                  >
                    {link.name}
                    {isActive(link.path)
                      ? <span className="w-2 h-2 rounded-full bg-secondary" />
                      : <ChevronRight size={14} className="text-gray-400" />
                    }
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="pt-2"
              >
                <Link
                  to="/portal"
                  className="flex items-center justify-center gap-2 w-full bg-secondary hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-bold transition-colors shadow-lg shadow-red-500/20"
                >
                  Student / Staff Portal <ChevronRight size={16} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
