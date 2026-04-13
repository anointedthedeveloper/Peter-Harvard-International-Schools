import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const FALLBACK = [
  'Excellence in Education', 'Admissions Open', 'World-Class Facilities',
  'Expert Faculty', 'Global Curriculum', 'Nurturing Future Leaders',
  "Peter Harvard Int'l Schools",
];

const TickerBar = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    supabase
      .from('ticker_items')
      .select('text')
      .order('position', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setItems(data.map(d => d.text));
      });
  }, []);

  return (
    <>
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 left-6 z-50 w-11 h-11 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-xl flex items-center justify-center transition-colors"
        aria-label="Toggle announcements"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'x' : 'mega'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="block"
          >
            {open ? <X size={18} /> : <Megaphone size={18} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 48, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-40 overflow-hidden bg-green-600 shadow-[0_-4px_20px_rgba(22,163,74,0.45)] py-2.5"
          >
            <div className="flex animate-ticker whitespace-nowrap">
              {[...Array(3)].map((_, ri) => (
                <div key={ri} className="flex items-center gap-8 px-8 shrink-0">
                  {items.map((text, i) => (
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

export default TickerBar;
