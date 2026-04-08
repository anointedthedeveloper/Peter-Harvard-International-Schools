import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Images, BookOpen, LogOut, Upload, Trash2, Plus, X, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

const inputClass = 'w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary text-sm dark:text-white transition-all';

const Toast = ({ msg, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
  >
    {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
    {msg}
    <button onClick={onClose}><X size={16} /></button>
  </motion.div>
);

// ── Gallery Tab ──────────────────────────────────────────────
const GalleryTab = ({ toast }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Campus' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const CATEGORIES = ['Campus', 'Academics', 'Sports', 'Events'];

  const fetchImages = async () => {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (data) setImages(data);
  };

  useEffect(() => { fetchImages(); }, []);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast('Please select an image', 'error');
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `gallery/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('phis-media').upload(path, file);
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from('phis-media').getPublicUrl(path);
      const { error: dbErr } = await supabase.from('gallery').insert({ title: form.title, category: form.category, src: publicUrl, storage_path: path });
      if (dbErr) throw dbErr;
      toast('Image uploaded successfully!', 'success');
      setForm({ title: '', category: 'Campus' });
      setFile(null); setPreview(null);
      fileRef.current.value = '';
      fetchImages();
    } catch (err) {
      toast(err.message || 'Upload failed', 'error');
    }
    setUploading(false);
  };

  const handleDelete = async (img) => {
    if (!confirm(`Delete "${img.title}"?`)) return;
    await supabase.storage.from('phis-media').remove([img.storage_path]);
    await supabase.from('gallery').delete().eq('id', img.id);
    toast('Image deleted', 'success');
    fetchImages();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Upload form */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><Plus size={18} className="text-secondary" /> Add Image</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Science Lab" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Image</label>
              {preview
                ? <div className="relative"><img src={preview} className="w-full h-36 object-cover rounded-xl" /><button type="button" onClick={() => { setFile(null); setPreview(null); fileRef.current.value = ''; }} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"><X size={14} /></button></div>
                : <button type="button" onClick={() => fileRef.current.click()} className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-secondary rounded-xl p-6 flex flex-col items-center gap-2 transition-colors group">
                    <Upload size={20} className="text-gray-400 group-hover:text-secondary transition-colors" />
                    <span className="text-xs text-gray-400">Click to upload</span>
                  </button>
              }
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>
            <motion.button type="submit" disabled={uploading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-secondary hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-red-500/20">
              {uploading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Upload size={15} /> Upload</>}
            </motion.button>
          </form>
        </div>
      </div>

      {/* Image grid */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-5">{images.length} Images in Gallery</h3>
          {images.length === 0
            ? <p className="text-gray-400 text-sm text-center py-12">No images yet. Upload one to get started.</p>
            : <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map(img => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square shadow-sm">
                    <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      <p className="text-white text-xs font-bold text-center truncate w-full">{img.title}</p>
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-white">{img.category}</span>
                      <button onClick={() => handleDelete(img)} className="mt-1 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  );
};

// ── Blog Tab ─────────────────────────────────────────────────
const BlogTab = ({ toast }) => {
  const [posts, setPosts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: 'News' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const CATEGORIES = ['News', 'Events', 'Academics', 'Sports', 'Announcement'];

  const fetchPosts = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let cover_url = null;
      if (file) {
        const ext = file.name.split('.').pop();
        const path = `blog/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('phis-media').upload(path, file);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from('phis-media').getPublicUrl(path);
        cover_url = publicUrl;
      }
      const { error } = await supabase.from('blog_posts').insert({ ...form, cover_url });
      if (error) throw error;
      toast('Post published!', 'success');
      setForm({ title: '', excerpt: '', content: '', category: 'News' });
      setFile(null); setPreview(null);
      if (fileRef.current) fileRef.current.value = '';
      fetchPosts();
    } catch (err) {
      toast(err.message || 'Failed to publish', 'error');
    }
    setUploading(false);
  };

  const handleDelete = async (post) => {
    if (!confirm(`Delete "${post.title}"?`)) return;
    await supabase.from('blog_posts').delete().eq('id', post.id);
    toast('Post deleted', 'success');
    fetchPosts();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Form */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><Plus size={18} className="text-secondary" /> New Post</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Post title" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Short Summary</label>
              <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} required rows={2} placeholder="Brief description shown on cards..." className={`${inputClass} resize-none`} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Content</label>
              <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required rows={5} placeholder="Write the full post content here..." className={`${inputClass} resize-none`} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cover Image (optional)</label>
              {preview
                ? <div className="relative"><img src={preview} className="w-full h-28 object-cover rounded-xl" /><button type="button" onClick={() => { setFile(null); setPreview(null); fileRef.current.value = ''; }} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"><X size={14} /></button></div>
                : <button type="button" onClick={() => fileRef.current.click()} className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-secondary rounded-xl p-4 flex items-center justify-center gap-2 transition-colors group">
                    <Upload size={16} className="text-gray-400 group-hover:text-secondary transition-colors" />
                    <span className="text-xs text-gray-400">Upload cover image</span>
                  </button>
              }
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>
            <motion.button type="submit" disabled={uploading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-secondary hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-red-500/20">
              {uploading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><BookOpen size={15} /> Publish Post</>}
            </motion.button>
          </form>
        </div>
      </div>

      {/* Posts list */}
      <div className="lg:col-span-3">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-5">{posts.length} Published Posts</h3>
          {posts.length === 0
            ? <p className="text-gray-400 text-sm text-center py-12">No posts yet. Create your first post.</p>
            : <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {posts.map(post => (
                  <div key={post.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-secondary/30 transition-colors group">
                    {post.cover_url
                      ? <img src={post.cover_url} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      : <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0"><BookOpen size={20} className="text-gray-400" /></div>
                    }
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{post.title}</p>
                        <button onClick={() => handleDelete(post)} className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
                      <span className="inline-block text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-semibold mt-1">{post.category}</span>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{post.excerpt}</p>
                      <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">{new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  );
};

// ── Dashboard ────────────────────────────────────────────────
const Dashboard = () => {
  const { authed, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('gallery');
  const [toastMsg, setToastMsg] = useState(null);

  const toast = (msg, type = 'success') => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  if (!authed) {
    navigate('/login');
    return null;
  }

  const tabs = [
    { key: 'gallery', icon: Images, label: 'Gallery' },
    { key: 'blog', icon: BookOpen, label: 'Blog Posts' },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <img src="/assets/Badge.jpg" className="w-7 h-7 rounded-lg object-cover" />
                <span className="font-extrabold text-gray-900 dark:text-white text-sm">Admin Dashboard</span>
              </div>
              <div className="flex gap-1">
                {tabs.map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === key ? 'bg-secondary text-white shadow-md shadow-red-500/20' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-secondary transition-colors font-semibold">
                <Eye size={14} /> View Site
              </button>
              <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors font-semibold">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {tab === 'gallery' ? <GalleryTab toast={toast} /> : <BlogTab toast={toast} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && <Toast {...toastMsg} onClose={() => setToastMsg(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
