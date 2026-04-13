import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Users, BookOpen, Globe, Calendar, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

const heroSlides = [
  {
    image: '/assets/slideshow/hero1.png',
    title: 'Peter Harvard',
    subtitle: 'International Schools',
    desc: 'Nurturing Excellence, Inspiring Innovation, and Building Global Leaders for Tomorrow.'
  },
  {
    image: '/assets/slideshow/hero2.png',
    title: 'Excellence in',
    subtitle: 'Academic Achievement',
    desc: 'Empowering students to reach their full potential through rigorous academic programs.'
  },
  {
    image: '/assets/slideshow/hero3.png',
    title: 'Holistic',
    subtitle: 'Student Development',
    desc: 'Fostering creativity, leadership, and character in a vibrant school community.'
  },
  {
    image: '/assets/slideshow/hero4.png',
    title: 'Modern',
    subtitle: 'Learning Spaces',
    desc: 'State-of-the-art facilities designed to inspire curiosity and collaboration.'
  },
  {
    image: '/assets/slideshow/hero5.png',
    title: 'Global',
    subtitle: 'Perspective',
    desc: 'Preparing students for success in an increasingly interconnected world.'
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
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className="overflow-x-hidden bg-white dark:bg-gray-950">

      {/* ── Hero Slideshow ── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">

        {/* Full-bleed slide images */}
        {heroSlides.map((slide, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            animate={{ opacity: i === currentSlide ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src={slide.image} alt="" className="w-full h-full object-cover" />
          </motion.div>
        ))}

        {/* Text + controls overlay */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-12 md:px-20 pb-16 pt-16">
          <div className="max-w-3xl">
            <motion.h1
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
              {heroSlides[currentSlide].title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-300">
                {heroSlides[currentSlide].subtitle}
              </span>
            </motion.h1>
            <motion.p
              key={`desc-${currentSlide}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-sm md:text-base text-white mb-6 max-w-xl leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
            >
              {heroSlides[currentSlide].desc}
            </motion.p>
            <div className="flex flex-row items-center gap-3 mb-8">
              <Link to="/admission" className="flex items-center gap-2 bg-secondary hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg text-sm">
                Apply Now <ChevronRight size={15} />
              </Link>
              <Link to="/portal" className="flex items-center gap-2 bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm border border-white/20">
                Visit Portal
              </Link>
            </div>
          </div>

          {/* Dot + arrow controls */}
          <div className="flex items-center gap-4">
            <button onClick={prevSlide} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 backdrop-blur-sm text-white hover:bg-white/30 transition-all">
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              {heroSlides.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)}
                  className={`h-2 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-7 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                />
              ))}
            </div>
            <button onClick={nextSlide} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 backdrop-blur-sm text-white hover:bg-white/30 transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Scroll Ticker ── */}
      <div className="relative overflow-hidden bg-green-600 shadow-[0_4px_20px_rgba(22,163,74,0.4)] py-3">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...Array(3)].map((_, ri) => (
            <div key={ri} className="flex items-center gap-8 px-8 shrink-0">
              {['Excellence in Education', 'Admissions Open', 'World-Class Facilities', 'Expert Faculty', 'Global Curriculum', 'Nurturing Future Leaders', 'Peter Harvard Int\'l Schools'].map((text, i) => (
                <span key={i} className="flex items-center gap-3 text-white font-bold text-sm uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── About Preview ── */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="lg:w-1/2 w-full relative"
            >
              <div className="relative z-10">
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="relative"
                >
                  <img
                    src="https://images.unsplash.com/photo-1544391682-1717387ce370?auto=format&fit=crop&w=800&q=70"
                    alt="Students Studying"
                    loading="lazy"
                    className="rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] w-full border border-gray-100 dark:border-gray-800"
                  />
                  {/* Floating card */}
                  <div className="absolute -bottom-8 -right-8 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 hidden sm:block">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-secondary">{yearsRunning}</span>
                      <span className="text-2xl font-bold text-secondary">+</span>
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Years of Academic <br /> Excellence</p>
                  </div>
                </motion.div>
                
                {/* Decorative dots */}
                <div className="absolute -top-6 -left-6 grid grid-cols-6 gap-2 opacity-20 dark:opacity-40">
                  {[...Array(24)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="lg:w-1/2 space-y-8"
            >
              <div className="space-y-4">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-secondary font-bold tracking-[0.25em] uppercase text-xs block"
                >
                  Our Philosophy
                </motion.span>
                <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-[1.15]">
                  Where Academic Rigor <br /> Meets <span className="text-secondary">Global Citizenship.</span>
                </h3>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  At Peter Harvard International Schools, we believe every child has the potential to become a leader. 
                  Our curriculum is designed to challenge minds, inspire curiosity, and foster a deep sense 
                  of social responsibility.
                </p>
                <p className="text-gray-500 dark:text-gray-500 leading-relaxed">
                  We provide a nurturing environment where students are encouraged to think critically, 
                  work collaboratively, and develop the skills needed for success in the 21st century.
                </p>
              </div>

              <motion.div 
                whileHover={{ x: 6 }} 
                transition={{ type: 'spring', stiffness: 400 }}
                className="pt-4"
              >
                <Link to="/about" className="inline-flex items-center gap-3 bg-gray-50 dark:bg-gray-900 hover:bg-secondary hover:text-white dark:hover:bg-secondary text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-bold transition-all border border-gray-200 dark:border-gray-800 hover:border-secondary shadow-sm">
                  Learn our mission <ChevronRight size={20} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Why PHIS ── */}
      <section className="py-24 md:py-32 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-20 max-w-3xl mx-auto">
            <span className="text-secondary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Our Strengths</span>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Why Choose PHIS?</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              We provide an unparalleled educational experience designed to prepare students for a changing world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: 'easeOut' }}
                whileHover={{ y: -10, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="group relative bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 hover:border-secondary/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-default overflow-hidden"
              >
                {/* Hover decorative element */}
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-secondary rounded-[1.25rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-lg shadow-red-500/5">
                    <feature.icon size={30} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-secondary transition-colors leading-tight">{feature.title}</h4>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── School Life ── */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div {...fadeUp} className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-left">
            <div>
              <span className="text-secondary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Our Environment</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">School Life at PHIS</h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">A glimpse into the vibrant world of Peter Harvard.</p>
            </div>
            <motion.div whileHover={{ x: 6 }} transition={{ type: 'spring', stiffness: 400 }}>
              <Link to="/gallery" className="bg-gray-50 dark:bg-gray-900 hover:bg-secondary hover:text-white dark:hover:bg-secondary text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-bold transition-all border border-gray-200 dark:border-gray-800 hover:border-secondary shadow-sm inline-flex items-center gap-2">
                View Full Gallery <ChevronRight size={20} />
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-auto md:h-[600px]">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.96, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.21, 0.45, 0.32, 0.9] }}
                className={`relative overflow-hidden rounded-[2.5rem] group ${img.span} h-64 md:h-auto`}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                  <motion.span 
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="text-white font-black text-2xl tracking-tight"
                  >
                    {img.label}
                  </motion.span>
                  <p className="text-white/70 text-sm mt-2 font-medium">Explore life at PHIS</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-24 md:py-32 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1523050853064-dbad3219756a?auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover opacity-10 grayscale" 
            alt="Stats Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-30" />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
            <StatCard value={yearsRunning} suffix="+" label="Years of Excellence" />
            <StatCard value={2000} suffix="+" label="Students Enrolled" />
            <StatCard value={150} suffix="+" label="Expert Faculty" />
            <StatCard value={100} suffix="%" label="Success Rate" />
          </div>
        </div>
      </section>

      {/* ── Blog / Latest News ── */}
      <BlogSection />

      {/* ── CTA ── */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="bg-secondary p-12 md:p-20 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(220,38,38,0.3)] relative overflow-hidden group">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-white/15 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full -ml-48 -mb-48 blur-3xl" />
            
            <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center text-white relative z-10">
              <span className="text-white/80 text-xs font-bold uppercase tracking-[0.4em] mb-6 block">Admissions Open</span>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight">Ready to join the <br /> <span className="underline decoration-white/30 underline-offset-8">PHIS Excellence?</span></h2>
              <p className="text-lg md:text-xl mb-12 text-white/90 font-medium leading-relaxed max-w-2xl mx-auto">
                Discover a community where your child's potential is nurtured and their future is built on a foundation of excellence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/admission"
                    className="bg-white text-secondary hover:bg-gray-100 px-12 py-5 rounded-2xl text-lg font-black transition-all shadow-2xl block"
                  >
                    Apply for Admission
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/contact"
                    className="bg-transparent text-white border-2 border-white/30 hover:bg-white/10 px-12 py-5 rounded-2xl text-lg font-black transition-all block"
                  >
                    Contact Registrar
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
