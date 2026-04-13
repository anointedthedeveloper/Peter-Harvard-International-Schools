import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { supabase } from '../lib/supabase';

const CACHE_TTL = 5 * 60 * 1000;
const CATEGORIES = ['All', 'Campus', 'Academics', 'Sports', 'Events'];

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIdx, setSelectedIdx] = useState(null);

  const fetchImages = useCallback(async () => {
    const c = window.__galleryCache;
    if (c && Date.now() - c.ts < CACHE_TTL) { setImages(c.data); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (data) { window.__galleryCache = { data, ts: Date.now() }; setImages(data); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  useEffect(() => {
    if (selectedIdx === null) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'Escape') setSelectedIdx(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedIdx]);

  const filtered = activeCategory === 'All' ? images : images.filter(i => i.category === activeCategory);
  const selectedImage = selectedIdx !== null ? filtered[selectedIdx] : null;
  const navigate = (dir) => setSelectedIdx(prev => (prev + dir + filtered.length) % filtered.length);

  return (
    <div className=overflow-x-hidden bg-white dark:bg-gray-950">

      {/* â”€â”€ Hero â”€â”€ */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=70" alt="Gallery banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/70" />



        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative z-10 text-center text-white px-4"
        >
          <p className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-[0.25em] px-5 py-2 rounded-full inline-block mb-6">
            Visual Tour
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-5 leading-[1.1]">Our Gallery</h1>
          <div className="w-20 h-1 bg-secondary mx-auto mb-6 rounded-full" />
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-85 leading-relaxed font-medium">
            Capturing the moments that define the PHIS experience.
          </p>
        </motion.div>
      </section>

      {/* â”€â”€ Grid â”€â”€ */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-7 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-secondary text-white shadow-lg shadow-red-500/30 scale-105'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-[2rem] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32"
            >
              <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-gray-800">
                <Images size={40} className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-900 dark:text-white font-black text-2xl mb-2">No images yet</p>
              <p className="text-gray-400 font-medium">Upload images from the admin dashboard.</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filtered.map((image, idx) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -10, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                    onClick={() => setSelectedIdx(idx)}
                    className="relative cursor-pointer group rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-800 hover:border-secondary/30 transition-all duration-500 aspect-square"
                  >
                    <img
                      src={image.src}
                      alt={image.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Category pill */}
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-secondary font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                        {image.category}
                      </span>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-4 p-6">
                      <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-white translate-y-6 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                        <Maximize2 size={22} />
                      </div>
                      <h3 className="text-white text-lg font-black text-center translate-y-6 group-hover:translate-y-0 transition-transform duration-300 delay-75 leading-tight">
                        {image.title}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* â”€â”€ Lightbox â”€â”€ */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedIdx(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative max-w-5xl w-full rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full object-contain bg-black max-h-[80vh]"
              />

              {/* Nav buttons */}
              <button
                onClick={() => navigate(-1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/25 text-white rounded-2xl backdrop-blur-md transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => navigate(1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/25 text-white rounded-2xl backdrop-blur-md transition-all"
              >
                <ChevronRight size={24} />
              </button>

              {/* Close */}
              <button
                onClick={() => setSelectedIdx(null)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/25 text-white rounded-xl backdrop-blur-md transition-all"
              >
                <X size={20} />
              </button>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/60 to-transparent text-white">
                <span className="text-[10px] bg-secondary font-black px-3 py-1.5 rounded-full uppercase tracking-widest mb-3 inline-block">
                  {selectedImage.category}
                </span>
                <h3 className="text-2xl font-black tracking-tight">{selectedImage.title}</h3>
                <p className="text-white/50 text-sm font-bold mt-1">{selectedIdx + 1} / {filtered.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
