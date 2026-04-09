import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, Search, X, ChevronRight, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ── Shared window cache (invalidated by Dashboard on mutation) ──
const CACHE_TTL = 5 * 60 * 1000;

const CATEGORIES = ['All', 'News', 'Events', 'Academics', 'Sports', 'Announcement'];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' },
};

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
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {post.cover_url && (
            <img src={post.cover_url} alt={post.title} className="w-full h-56 object-cover rounded-t-2xl" />
          )}
          <div className="p-7">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs bg-secondary/10 text-secondary font-bold px-3 py-1 rounded-full">{post.category}</span>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 leading-snug">{post.title}</h2>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-5">
              <Calendar size={12} />
              {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-5 border-l-4 border-secondary/40 pl-4">{post.excerpt}</p>
            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</div>
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
    if (c && Date.now() - c.ts < CACHE_TTL) {
      setPosts(c.data);
      setLoading(false);
      return;
    }
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
    <div className="pt-24 pb-20 min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <motion.p {...fadeUp} className="text-secondary text-xs font-bold uppercase tracking-widest mb-3">School Blog</motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4"
          >
            News &amp; Updates
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm"
          >
            Stay informed with the latest happenings, events, and achievements at Peter Harvard International Schools.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary dark:text-white transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  category === cat
                    ? 'bg-secondary text-white shadow-md shadow-red-500/20'
                    : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-secondary/50'
                }`}
              >
                {cat !== 'All' && <Tag size={10} />} {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-72 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen size={40} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 font-semibold">No posts found.</p>
            {(search || category !== 'All') && (
              <button onClick={() => { setSearch(''); setCategory('All'); }} className="mt-3 text-secondary text-sm font-bold hover:underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                onClick={() => setSelected(post)}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:border-secondary/30 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                {post.cover_url
                  ? <img src={post.cover_url} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-48 bg-gradient-to-br from-secondary/10 to-red-100 dark:from-secondary/20 dark:to-gray-800 flex items-center justify-center">
                      <BookOpen size={36} className="text-secondary/40" />
                    </div>
                }
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-secondary/10 text-secondary font-bold px-2.5 py-1 rounded-full">{post.category}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 leading-snug line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-secondary font-bold group-hover:gap-2 transition-all">
                    Read more <ChevronRight size={13} />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {selected && <PostModal post={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Blog;
