import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, Search, X, ChevronRight, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';

const CACHE_TTL = 5 * 60 * 1000;
const CATEGORIES = ['All', 'News', 'Events', 'Academics', 'Sports', 'Announcement'];

const PostModal = ({ post, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800"
        >
          {post.cover_url && (
            <div className="relative h-64 overflow-hidden rounded-t-[2rem]">
              <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}
          <div className="p-8">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] bg-secondary text-white font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-red-500/20">
                {post.category}
              </span>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3 leading-tight tracking-tight">
              {post.title}
            </h2>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-6 font-bold uppercase tracking-widest">
              <Calendar size={12} className="text-secondary" />
              {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400 italic mb-6 border-l-4 border-secondary pl-5 leading-relaxed font-medium">
              {post.excerpt}
            </p>
            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchPosts = useCallback(async () => {
    const c = window.__blogCache;
    if (c && Date.now() - c.ts < CACHE_TTL) { setPosts(c.data); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (data) { window.__blogCache = { data, ts: Date.now() }; setPosts(data); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const filtered = posts.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-16 overflow-x-hidden bg-white dark:bg-gray-950">

      {/* ── Hero ── */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-secondary/70" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-red-400/10 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative z-10 text-center text-white px-4"
        >
          <p className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-[0.25em] px-5 py-2 rounded-full inline-block mb-6">
            School Blog
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-5 leading-[1.1]">News &amp; Updates</h1>
          <div className="w-20 h-1 bg-secondary mx-auto mb-6 rounded-full" />
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-85 leading-relaxed font-medium">
            Stay informed with the latest happenings, events, and achievements at Peter Harvard.
          </p>
        </motion.div>
      </section>

      {/* ── Posts ── */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mb-16 items-start sm:items-center"
          >
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-11 pr-10 py-3.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary dark:text-white transition-all font-medium"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-1.5 px-5 py-3 rounded-2xl text-xs font-bold transition-all duration-300 ${
                    category === cat
                      ? 'bg-secondary text-white shadow-lg shadow-red-500/30 scale-105'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-secondary/50 hover:text-secondary'
                  }`}
                >
                  {cat !== 'All' && <Tag size={10} />} {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-96 bg-gray-100 dark:bg-gray-900 rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32"
            >
              <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-gray-800">
                <BookOpen size={40} className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-900 dark:text-white font-black text-2xl mb-2">No posts found</p>
              <p className="text-gray-400 font-medium mb-6">Try adjusting your search or filters.</p>
              {(search || category !== 'All') && (
                <button
                  onClick={() => { setSearch(''); setCategory('All'); }}
                  className="bg-secondary text-white font-bold px-6 py-3 rounded-2xl hover:bg-red-700 transition-colors text-sm"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: 'easeOut' }}
                  whileHover={{ y: -10, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                  onClick={() => setSelected(post)}
                  className="bg-white dark:bg-gray-950 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:border-secondary/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer group flex flex-col"
                >
                  {/* Cover */}
                  <div className="relative h-56 overflow-hidden">
                    {post.cover_url
                      ? <img src={post.cover_url} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      : <div className="w-full h-full bg-gradient-to-br from-secondary/5 to-red-100/20 dark:from-secondary/10 dark:to-gray-800 flex items-center justify-center">
                          <BookOpen size={48} className="text-secondary/20" />
                        </div>
                    }
                    <div className="absolute top-5 left-5">
                      <span className="text-[10px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-secondary font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                      <Calendar size={13} className="text-secondary" />
                      {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 className="font-black text-xl text-gray-900 dark:text-white mb-3 leading-tight tracking-tight group-hover:text-secondary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed mb-6 flex-grow font-medium">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                      Read Story <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {selected && <PostModal post={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Blog;
