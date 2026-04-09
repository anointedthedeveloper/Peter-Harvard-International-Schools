import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Users, BookOpen, Globe, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
    <div ref={ref} className="text-center px-4">
      <p className="text-4xl md:text-5xl font-extrabold text-white tabular-nums">{count}{suffix}</p>
      <p className="text-white/60 mt-2 text-sm font-medium">{label}</p>
    </div>
  );
};

const BlogSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).limit(3)
      .then(({ data }) => { if (data) setPosts(data); setLoading(false); });
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="flex justify-between items-end mb-12">
          <div>
            <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-2">Stay Updated</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Latest News &amp; Updates</h2>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:border-secondary/30 hover:shadow-lg transition-shadow group cursor-default"
              >
                {post.cover_url
                  ? <img src={post.cover_url} alt={post.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-44 bg-gradient-to-br from-secondary/10 to-red-100 dark:from-secondary/20 dark:to-gray-800 flex items-center justify-center"><BookOpen size={36} className="text-secondary/40" /></div>
                }
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-secondary/10 text-secondary font-bold px-2.5 py-1 rounded-full">{post.category}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={11} />{new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 leading-snug line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{post.excerpt}</p>
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
  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative h-screen flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <img
          src="https://peterharvardschools.com/wp-content/uploads/2025/07/20250715_152546_0000.png"
          alt="School Campus"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/90" />
        {/* Subtle vignette sides */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/50 text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-8 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Est. 2017 · Kubwa, Abuja
            </motion.span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1]">
              Peter Harvard <br />
              <span className="text-secondary">International Schools</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-300 leading-relaxed">
              Nurturing Excellence, Inspiring Innovation, and Building Global Leaders for Tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/admission"
                  className="flex items-center gap-2 bg-secondary hover:bg-red-700 text-white px-8 py-4 rounded-full text-base font-bold transition-colors shadow-2xl shadow-red-500/30"
                >
                  Apply Now <ChevronRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/portal"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full text-base font-bold transition-colors"
                >
                  Visit Portal
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-secondary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── About Preview ── */}
      <section className="py-20 md:py-28 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:w-1/2 w-full"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1544391682-1717387ce370?auto=format&fit=crop&w=800&q=70"
                  alt="Students Studying"
                  loading="lazy"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-5 -right-5 bg-secondary text-white p-6 rounded-2xl shadow-xl hidden sm:block">
                  <p className="text-3xl font-bold">{yearsRunning}+</p>
                  <p className="text-xs font-semibold mt-0.5">Years of Excellence</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:w-1/2 space-y-5"
            >
              <p className="text-secondary font-bold tracking-widest uppercase text-xs">Our Philosophy</p>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Where Academic Rigor Meets Global Citizenship.
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                At PHIS, we believe every child has the potential to become a leader. Our curriculum is designed
                to challenge minds, inspire curiosity, and foster a deep sense of social responsibility.
              </p>
              <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400 }}>
                <Link to="/about" className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all">
                  Learn more about our mission <ChevronRight size={18} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Why PHIS ── */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-3">Our Strengths</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Why Choose PHIS?</h2>
            <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: idx * 0.08, duration: 0.45, ease: 'easeOut' }}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="bg-white dark:bg-gray-900 p-7 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 hover:border-secondary/50 hover:shadow-xl transition-shadow group cursor-default"
              >
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 text-secondary rounded-xl flex items-center justify-center mb-5 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  <feature.icon size={24} />
                </div>
                <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── School Life ── */}
      <section className="py-20 md:py-28 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fadeUp} className="flex justify-between items-end mb-10">
            <div>
              <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-2">Our Environment</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">School Life at PHIS</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">A glimpse into the vibrant world of Peter Harvard.</p>
            </div>
            <motion.div whileHover={{ x: 3 }}>
              <Link to="/gallery" className="text-secondary font-bold text-sm hidden sm:flex items-center gap-1 hover:gap-2 transition-all">
                View Gallery <ChevronRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 h-[420px] md:h-[500px]">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className={`relative overflow-hidden rounded-2xl group ${img.span}`}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-bold text-base tracking-wide">{img.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog / Latest News ── */}
      <BlogSection />

      {/* ── Stats ── */}
      <section className="py-16 md:py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value={yearsRunning} suffix="+" label="Years of Excellence" />
            <StatCard value={1000} suffix="+" label="Active Students" />
            <StatCard value={180} suffix="+" label="Expert Educators" />
            <StatCard value={98} suffix="%" label="University Placement" />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <motion.div {...fadeUp} className="max-w-4xl mx-auto px-4 text-center text-white relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-5">Ready to join the PHIS family?</h2>
          <p className="text-lg mb-10 opacity-80">Enrollment is currently open for the upcoming academic session.</p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link
              to="/admission"
              className="bg-white text-secondary hover:bg-gray-100 px-10 py-4 rounded-full text-base font-bold transition-colors shadow-2xl"
            >
              Start Admission Process
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;
