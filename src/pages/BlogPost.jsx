import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Tag, ChevronRight, ArrowLeft, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [recent, setRecent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ data: p }, { data: all }] = await Promise.all([
        supabase.from('blog_posts').select('*').eq('id', id).single(),
        supabase.from('blog_posts').select('id,title,cover_url,created_at,category').order('created_at', { ascending: false }).limit(6),
      ]);
      if (!p) { navigate('/blog'); return; }
      setPost(p);
      setRecent(all || []);
      const cats = [...new Set((all || []).map(x => x.category))];
      setCategories(cats);
      setLoading(false);
    };
    load();
  }, [id, navigate]);

  if (loading) return (
    <div className="pt-16 min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
      <span className="w-8 h-8 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin" />
    </div>
  );

  if (!post) return null;

  return (
    <div className="pt-16 bg-white dark:bg-gray-950 min-h-screen">

      {/* Category banner */}
      <div className="bg-secondary py-3 text-center">
        <span className="text-white text-xs font-black uppercase tracking-[0.3em]">{post.category}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

              {/* Back */}
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-secondary transition-colors font-semibold mb-6">
                <ArrowLeft size={15} /> Back to Blog
              </Link>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tight mb-4">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                <span className="flex items-center gap-1.5 font-semibold">
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                    <img src="/assets/Badge.jpg" alt="PHIS" className="w-full h-full object-cover" />
                  </div>
                  Peter Harvard
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-secondary" />
                  {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag size={13} className="text-secondary" />
                  {post.category}
                </span>
              </div>

              {/* Cover image */}
              {post.cover_url && (
                <div className="rounded-2xl overflow-hidden mb-8 shadow-lg bg-gray-50 dark:bg-gray-900">
                  <img src={post.cover_url} alt={post.title} className="w-full object-contain max-h-[520px]" />
                </div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-lg text-gray-600 dark:text-gray-400 italic border-l-4 border-secondary pl-5 mb-8 leading-relaxed font-medium">
                  {post.excerpt}
                </p>
              )}

              {/* Content */}
              <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
                {post.content}
              </div>

              {/* Tags */}
              <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category:</span>
                <span className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1.5 rounded-full">{post.category}</span>
              </div>
            </motion.div>
          </main>

          {/* ── Sidebar ── */}
          <aside className="lg:w-72 shrink-0 space-y-8">

            {/* Categories */}
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4 pb-2 border-b-2 border-secondary inline-block">
                Categories
              </h3>
              <ul className="space-y-2 mt-4">
                {categories.map(cat => (
                  <li key={cat}>
                    <Link to={`/blog?category=${cat}`} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-secondary transition-colors font-medium group">
                      <ChevronRight size={13} className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4 pb-2 border-b-2 border-secondary inline-block">
                Read Also
              </h3>
              <div className="space-y-4 mt-4">
                {recent.filter(r => r.id !== post.id).map(r => (
                  <Link key={r.id} to={`/blog/${r.id}`} className="flex gap-3 group">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                      {r.cover_url
                        ? <img src={r.cover_url} alt={r.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center"><BookOpen size={18} className="text-gray-400" /></div>
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-secondary transition-colors line-clamp-2 leading-tight">{r.title}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-secondary rounded-2xl p-6 text-white">
              <h4 className="font-black text-lg mb-2">Admissions Open</h4>
              <p className="text-white/80 text-sm mb-4 leading-relaxed">Join the Peter Harvard family today.</p>
              <Link to="/admission" className="block text-center bg-white text-secondary font-black text-sm py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                Apply Now
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
