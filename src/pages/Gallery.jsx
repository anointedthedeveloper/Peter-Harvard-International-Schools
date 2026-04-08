import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, ZoomIn } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    { id: 1, src: "https://images.unsplash.com/photo-1523050335392-9bef867a0083?auto=format&fit=crop&q=80", title: "Main Campus" },
    { id: 2, src: "https://images.unsplash.com/photo-1544391682-1717387ce370?auto=format&fit=crop&q=80", title: "Student Library" },
    { id: 3, src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80", title: "Chemistry Lab" },
    { id: 4, src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80", title: "Sports Complex" },
    { id: 5, src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80", title: "Art Studio" },
    { id: 6, src: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80", title: "Auditorium" },
    { id: 7, src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80", title: "Graduation" },
    { id: 8, src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80", title: "Classroom" },
    { id: 9, src: "https://images.unsplash.com/photo-1524178232363-1fb28f74b573?auto=format&fit=crop&q=80", title: "Digital Lab" },
  ];

  return (
    <div className="pt-20">
      <section className="bg-secondary py-20 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our School Gallery</h1>
          <p className="text-xl opacity-80">Capturing the moments that define the PHIS experience.</p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image) => (
              <motion.div
                key={image.id}
                layoutId={`image-${image.id}`}
                onClick={() => setSelectedImage(image)}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="relative cursor-pointer group rounded-2xl overflow-hidden shadow-lg aspect-square"
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                  <div className="p-3 bg-secondary rounded-full text-white mb-4 transform translate-y-10 group-hover:translate-y-0 transition-transform">
                    <Maximize2 size={24} />
                  </div>
                  <h3 className="text-white text-xl font-bold translate-y-10 group-hover:translate-y-0 transition-transform delay-75">{image.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              layoutId={`image-${selectedImage.id}`}
              className="relative max-w-5xl w-full h-auto max-h-[90vh] bg-white dark:bg-gray-950 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full h-full object-contain bg-black"
              />
              
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-md"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/50 to-transparent text-white">
                <h3 className="text-3xl font-bold">{selectedImage.title}</h3>
                <p className="opacity-80 mt-2">Peter Harvard International Schools - Excellence in Every Detail</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
