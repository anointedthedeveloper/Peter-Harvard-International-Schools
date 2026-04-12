import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Users, BookOpen, Globe, Calendar, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

const heroSlides = [
  {
    image: 'assets/slideshow/hero',
    title: 'Peter Harvard',
    subtitle: 'International Schools',
    desc: 'Nurturing Excellence, Inspiring Innovation, and Building Global Leaders for Tomorrow.'
  },
  {
    image: 'https://images.unsplash.com/photo-1523050853064-dbad3219756a?auto=format&fit=crop&w=1920&q=80',
    title: 'Excellence in',
    subtitle: 'Academic Achievement',
    desc: 'Empowering students to reach their full potential through rigorous academic programs.'
  },
  {
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1920&q=80',
    title: 'Holistic',
    subtitle: 'Student Development',
    desc: 'Fostering creativity, leadership, and character in a vibrant school community.'
  }
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const useCountUp = (target, duration = 1800, inView = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setCount(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return count;
};

const StatCard = ({ value, suffix, label }) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const count = useCountUp(value, 1800, inView);
  return (
    <div ref={ref} className="text-center px-4 group">
      <p className="text-5xl md:text-6xl font-black text-white tabular-nums tracking-tighter group-hover:scale-110 transition-transform duration-500">{count}{suffix}</p>
      <div className="w-8 h-1 bg-white/30 mx-auto my-3 rounded-full group-hover:w-12 transition-all duration-500" />
      <p className="text-white/80 mt-2 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
};

const BlogSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).limit(3)
      .then(({ data, error }) => {
        if (data) setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-gray-50/50 dark:bg-gray-900/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div {...fadeUp} className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-left">
          <div>
            <span className="text-secondary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Stay Updated</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Latest News & Events</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Keep up with the heartbeat of Peter Harvard.</p>
          </div>
          <motion.div whileHover={{ x: 6 }} transition={{ type: 'spring', stiffness: 400 }}>
            <Link to="/blog" className="bg-white dark:bg-gray-950 hover:bg-secondary hover:text-white dark:hover:bg-secondary text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-bold transition-all border border-gray-200 dark:border-gray-800 hover:border-secondary shadow-sm inline-flex items-center gap-2">
              Read All News <ChevronRight size={20} />
            </Link>
          </motion.div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="h-96 bg-gray-200/50 dark:bg-gray-800/50 rounded-[2.5rem] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="bg-white dark:bg-gray-950 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:border-secondary/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 group cursor-default h-full flex flex-col"
              >
                <div className="relative h-60 overflow-hidden">
                  {post.cover_url
                    ? <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    : <div className="w-full h-full bg-gradient-to-br from-secondary/5 to-red-100/20 dark:from-secondary/10 dark:to-gray-800 flex items-center justify-center"><BookOpen size={48} className="text-secondary/20" /></div>
                  }
                  <div className="absolute top-6 left-6">
                    <span className="text-[10px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-secondary font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">{post.category}</span>
                  </div>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    <Calendar size={14} className="text-secondary" />
                    {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="font-black text-xl text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-secondary transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed mb-6 flex-grow">{post.excerpt}</p>
                  <Link to={`/blog/${post.slug || post.id}`} className="text-secondary font-black text-xs uppercase tracking-widest flex items-center gap-2 group/btn hover:gap-3 transition-all">
                    Read Story <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const FOUNDED = 2017;
const yearsRunning = new Date().getFullYear() - FOUNDED;

const features = [
  { icon: BookOpen, title: 'Premium Curriculum', desc: 'International standard curriculum focused on holistic development.' },
  { icon: Users, title: 'Expert Educators', desc: 'Highly qualified teachers dedicated to student success.' },
  { icon: Award, title: 'Modern Facilities', desc: 'State-of-the-art labs, libraries, and sports complexes.' },
  { icon: Globe, title: 'Global Mindset', desc: 'Preparing students for success in an interconnected world.' },
];

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=70', label: 'Academics', span: 'col-span-2 row-span-2' },
  { src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=400&q=70', label: 'Sports', span: '' },
  { src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=70', label: 'Science', span: '' },
  { src: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=70', label: 'Library', span: 'col-span-2' },
];

const Home = () => {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextCarousel = () => setActiveCarouselIndex((prev) => (prev + 1) % galleryImages.length);
  const prevCarousel = () => setActiveCarouselIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  return (
    <div className="overflow-x-hidden bg-white dark:bg-gray-950">

      {/* ── MAD HERO (Just Text and Slideshow) ── */}
      <section className="relative h-screen flex items-center justify-center bg-gray-950 text-white overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHeroSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={heroSlides[currentHeroSlide].image}
              alt="School Campus"
              className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale-[20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 w-full px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-[12vw] md:text-[14vw] font-black tracking-[-0.05em] leading-[0.85] select-none text-white drop-shadow-2xl">
              PETER <br />
              <span className="text-secondary drop-shadow-[0_0_50px_rgba(220,38,38,0.3)]">HARVARD</span>
            </h1>
            <div className="mt-12 overflow-hidden py-4 border-y border-white/10 backdrop-blur-sm max-w-4xl mx-auto">
              <motion.div 
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="flex whitespace-nowrap gap-20 text-2xl md:text-4xl font-bold uppercase tracking-[0.4em] text-white/40"
              >
                <span>International Schools · Kubwa Abuja · Excellence in Education · Nurturing Global Leaders</span>
                <span>International Schools · Kubwa Abuja · Excellence in Education · Nurturing Global Leaders</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Hero Dots */}
        <div className="absolute bottom-12 z-20 flex gap-4">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentHeroSlide(i)}
              className={`w-12 h-1.5 transition-all duration-500 rounded-full ${i === currentHeroSlide ? 'bg-secondary' : 'bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* ── 3D COVERFLOW SLIDESHOW (Gallery) ── */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative flex flex-col items-center">
          <div className="text-center mb-16">
            <span className="text-secondary text-xs font-black uppercase tracking-[0.4em] mb-4 block">Our Environment</span>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight">School Life Gallery</h2>
          </div>

          <div className="relative w-full h-[350px] md:h-[550px] flex items-center justify-center perspective-[2000px]">
            {galleryImages.map((img, i) => {
              const offset = i - activeCarouselIndex;
              const absOffset = Math.abs(offset);
              const isCenter = offset === 0;
              
              if (absOffset > 2) return null;

              return (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{
                    x: offset * (window.innerWidth > 768 ? 320 : 180),
                    scale: isCenter ? 1 : 0.75,
                    rotateY: offset * -35,
                    zIndex: 10 - absOffset,
                    opacity: 1 - absOffset * 0.4,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  onClick={() => setActiveCarouselIndex(i)}
                  className="absolute w-[85%] max-w-[650px] aspect-[16/10] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] cursor-pointer"
                >
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${isCenter ? 'opacity-0' : 'opacity-100'}`} />
                  {isCenter && (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="absolute bottom-12 left-12 text-white"
                    >
                      <h3 className="text-4xl font-black tracking-tight">{img.label}</h3>
                      <p className="text-white/60 font-bold uppercase tracking-widest text-xs mt-3">Peter Harvard INT'L Schools</p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Carousel Controls (Matching Image Style) */}
          <div className="mt-16 flex flex-col items-center gap-10">
            <div className="flex items-center gap-6">
              <button 
                onClick={prevCarousel} 
                className="p-3 bg-gray-100 dark:bg-gray-900 rounded-full hover:text-secondary hover:bg-white transition-all shadow-sm"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="flex items-center gap-3">
                {galleryImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCarouselIndex(i)}
                    className={`h-3 transition-all duration-500 rounded-full ${i === activeCarouselIndex ? 'w-10 bg-secondary' : 'w-3 bg-gray-300 dark:bg-gray-800'}`}
                  />
                ))}
              </div>

              <button 
                onClick={nextCarousel} 
                className="p-3 bg-gray-100 dark:bg-gray-900 rounded-full hover:text-secondary hover:bg-white transition-all shadow-sm"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
