import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  { id: 1, src: "https://images.unsplash.com/photo-1523050335392-9bef867a0083?auto=format&fit=crop&q=80", title: "Main Campus", category: "Campus" },
  { id: 2, src: "https://images.unsplash.com/photo-1544391682-1717387ce370?auto=format&fit=crop&q=80", title: "Student Library", category: "Academics" },
  { id: 3, src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80", title: "Chemistry Lab", category: "Academics" },
  { id: 4, src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80", title: "Sports Complex", category: "Sports" },
  { id: 5, src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80", title: "Art Studio", category: "Events" },
  { id: 6, src: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80", title: "Auditorium", category: "Campus" },
  { id: 7, src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80", title: "Graduation", category: "Events" },
  { id: 8, src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80", title: "Classroom", category: "Academics" },
  { id: 9, src: "https://images.unsplash.com/photo-1524178232363-1fb28f74b573?auto=format&fit=crop&q=80", title: "Digital Lab", category: "Academics" },
  { id: 10, src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80", title: "Athletics Track", category: "Sports" },
  { id: 11, src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80", title: "Annual Day", category: "Events" },
  { id: 12, src: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80", title: "School Grounds", category: "Campus" },
];

const categories = ['All', 'Campus', 'Academics', 'Sports', 'Events'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIdx, setSelectedIdx] = useState(null);

  const filtered = activeCategory === 'All' ? images : images.filter(i => i.category === activeCategory);
  const selectedImage = selectedIdx !== null ? filtered[selectedIdx] : null;

  const navigate = (dir) => {
    setSelectedIdx(prev => (prev + dir + filtered.length) % filtered.length);
  };

  return (
    <div className="pt-20">
      {/* Hero Cover */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=70"
          loading="eager"
          alt="PHIS Gallery"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-secondary/80"></div>
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-secondary bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-6">Visual Tour</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our School Gallery</h1>
          <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
          <p className="text-xl opacity-80">Capturing the moments that define the PHIS experience.</p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  activeCategory === cat
                    ? 'bg-secondary text-white shadow-lg shadow-red-500/30'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((image, idx) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8 }}
                  onClick={() => setSelectedIdx(idx)}
                  className="relative cursor-pointer group rounded-2xl overflow-hidden shadow-lg aspect-square"
                >
                  <img src={image.src} alt={image.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-3 right-3 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                    {image.category}
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                    <div className="p-3 bg-secondary rounded-full text-white mb-4 transform translate-y-10 group-hover:translate-y-0 transition-transform">
                      <Maximize2 size={24} />
                    </div>
                    <h3 className="text-white text-xl font-bold translate-y-10 group-hover:translate-y-0 transition-transform delay-75">{image.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedIdx(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl w-full max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <img src={selectedImage.src} alt={selectedImage.title} className="w-full h-full object-contain bg-black max-h-[80vh]" />

              <button onClick={() => navigate(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-colors">
                <ChevronLeft size={28} />
              </button>
              <button onClick={() => navigate(1)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-colors">
                <ChevronRight size={28} />
              </button>
              <button onClick={() => setSelectedIdx(null)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-colors">
                <X size={24} />
              </button>

              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/50 to-transparent text-white">
                <span className="text-xs font-semibold bg-secondary px-3 py-1 rounded-full mb-2 inline-block">{selectedImage.category}</span>
                <h3 className="text-2xl font-bold">{selectedImage.title}</h3>
                <p className="text-sm opacity-60 mt-1">{selectedIdx + 1} / {filtered.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
