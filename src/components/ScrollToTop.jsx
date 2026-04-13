import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const [bottom, setBottom] = useState(24);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // How much of the footer is visible
          const visible = window.innerHeight - entry.boundingClientRect.top;
          setBottom(Math.max(24, visible + 16));
        } else {
          setBottom(24);
        }
      },
      { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
    );

    obs.observe(footer);
    return () => obs.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, bottom }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ bottom: { type: 'spring', stiffness: 300, damping: 30 } }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed right-6 z-50 w-11 h-11 bg-secondary hover:bg-red-700 text-white rounded-full shadow-xl flex items-center justify-center transition-colors"
          aria-label="Scroll to top"
        >
          <ArrowUp size={22} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
