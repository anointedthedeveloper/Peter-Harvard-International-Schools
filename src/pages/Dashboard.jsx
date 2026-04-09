import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Images, BookOpen, LogOut, Upload, Trash2, Plus, X,
  CheckCircle, AlertCircle, Eye, LayoutDashboard, TrendingUp,
  FileText, Download, Pencil, Save, ChevronDown, ChevronUp,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

// Invalidate public page caches on mutation
const invalidateGalleryCache = () => { window.__galleryCache = null; };
const invalidateBlogCache = () => { window.__blogCache = null; };

const inputClass = 'w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary text-sm dark:text-white transition-all';

const Toast = ({ msg, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.95 }}
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
  >
    {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
    {msg}
    <button onClick={onClose}><X size={16} /></button>
  </motion.div>
);

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-400 font-semibold mt-0.5">{label}</p>
    </div>
  </div>
);

// ── Gallery Tab ──────────────────────────────────────────────
const GalleryTab = ({ toast }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Campus' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const CATS = ['Campus', 'Academics', 'Sports', 'Events'];

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
      toast('Image uploaded!', 'success');
      setForm({ title: '', category: 'Campus' });
      setFile(null); setPreview(null);
      fileRef.current.value = '';
      invalidateGalleryCache();
      fetchImages();
    } catch (err) {
      toast(err.message || 'Upload failed', 'error');
    }
    setUploading(false);
  };

  const handleDelete = async (img) => {
    if (!confirm(`Delete "${img.title}"?`)) return;
    if (img.storage_path) await supabase.storage.from('phis-media').remove([img.storage_path]);
    await supabase.from('gallery').delete().eq('id', img.id);
    toast('Image deleted', 'success');
    invalidateGalleryCache();
    fetchImages();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <Plus size={18} className="text-secondary" /> Add Image
          </h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Science Lab" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Image</label>
              {preview
                ? <div className="relative">
                    <img src={preview} className="w-full h-36 object-cover rounded-xl" />
                    <button type="button" onClick={() => { setFile(null); setPreview(null); fileRef.current.value = ''; }} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"><X size={14} /></button>
                  </div>
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

      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-5">{images.length} Images in Gallery</h3>
          {images.length === 0
            ? <p className="text-gray-400 text-sm text-center py-12">No images yet. Upload one to get started.</p>
            : <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto pr-1">
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

  const CATS = ['News', 'Events', 'Academics', 'Sports', 'Announcement'];

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
      invalidateBlogCache();
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
    invalidateBlogCache();
    fetchPosts();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <Plus size={18} className="text-secondary" /> New Post
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Post title" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {CATS.map(c => <option key={c}>{c}</option>)}
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

// ── Admissions Tab ───────────────────────────────────────────
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400',
};

const downloadAdmission = (app) => {
  const win = window.open('', '_blank');
  win.document.write(`
    <html><head><title>Admission - ${app.student_name}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 32px; max-width: 700px; margin: auto; }
      h1 { color: #c0392b; } table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      td { padding: 8px 12px; border: 1px solid #ddd; font-size: 14px; }
      td:first-child { font-weight: bold; width: 40%; background: #f9f9f9; }
      img { width: 120px; height: 120px; object-fit: cover; border-radius: 8px; border: 2px solid #c0392b; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; }
    </style></head><body>
    <div class="header">
      <div><h1>Peter Harvard INT'L School</h1><h2>Admission Application</h2>
      <p style="color:#888;font-size:13px">Submitted: ${new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
      ${app.photo_url ? `<img src="${app.photo_url}" alt="passport" />` : ''}
    </div>
    <table>
      <tr><td>Student Name</td><td>${app.student_name}</td></tr>
      <tr><td>Date of Birth</td><td>${app.dob}</td></tr>
      <tr><td>Gender</td><td>${app.gender}</td></tr>
      <tr><td>Class Applying</td><td>${app.class_applying}</td></tr>
      <tr><td>Parent / Guardian</td><td>${app.parent_name}</td></tr>
      <tr><td>Phone</td><td>${app.phone}</td></tr>
      <tr><td>Email</td><td>${app.email || '—'}</td></tr>
      <tr><td>Address</td><td>${app.address}</td></tr>
      <tr><td>Status</td><td>${app.status}</td></tr>
      ${app.notes ? `<tr><td>Notes</td><td>${app.notes}</td></tr>` : ''}
    </table>
    <script>window.onload=()=>window.print();<\/script>
    </body></html>
  `);
  win.document.close();
};

const AdmissionsTab = ({ toast }) => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [editing, setEditing] = useState(null); // { id, status, notes }

  const fetchApps = async () => {
    setLoading(true);
    const { data } = await supabase.from('admissions').select('*').order('created_at', { ascending: false });
    if (data) setApps(data);
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, []);

  const saveEdit = async (id) => {
    const { error } = await supabase.from('admissions').update({ status: editing.status, notes: editing.notes }).eq('id', id);
    if (error) return toast(error.message, 'error');
    toast('Application updated', 'success');
    setEditing(null);
    fetchApps();
  };

  const handleDelete = async (app) => {
    if (!confirm(`Delete application for "${app.student_name}"?`)) return;
    if (app.photo_path) await supabase.storage.from('phis-media').remove([app.photo_path]);
    await supabase.from('admissions').delete().eq('id', app.id);
    toast('Application deleted', 'success');
    fetchApps();
  };

  if (loading) return <p className="text-gray-400 text-sm text-center py-16">Loading applications…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 dark:text-white">{apps.length} Application{apps.length !== 1 ? 's' : ''}</h3>
      </div>
      {apps.length === 0
        ? <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-16 text-center">
            <FileText size={36} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No applications yet.</p>
          </div>
        : apps.map(app => (
          <div key={app.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            {/* Row header */}
            <div className="flex items-center gap-4 p-5">
              {app.photo_url
                ? <img src={app.photo_url} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border-2 border-secondary/20" />
                : <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0"><FileText size={20} className="text-gray-400" /></div>
              }
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{app.student_name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{app.class_applying} · {app.parent_name} · {app.phone}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize flex-shrink-0 ${statusColors[app.status] || statusColors.pending}`}>{app.status}</span>
              <p className="text-xs text-gray-400 hidden sm:block flex-shrink-0">{new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => downloadAdmission(app)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Download"><Download size={15} /></button>
                <button onClick={() => { setEditing({ id: app.id, status: app.status, notes: app.notes || '' }); setExpanded(expanded === app.id ? null : app.id); }} className="p-2 text-gray-400 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors" title="Edit"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(app)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete"><Trash2 size={15} /></button>
                <button onClick={() => setExpanded(expanded === app.id ? null : app.id)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">{expanded === app.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</button>
              </div>
            </div>

            {/* Expanded detail + edit */}
            {expanded === app.id && (
              <div className="border-t border-gray-100 dark:border-gray-800 p-5 bg-gray-50 dark:bg-gray-800/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm mb-5">
                  {[['Date of Birth', app.dob], ['Gender', app.gender], ['Email', app.email || '—'], ['Address', app.address]].map(([k, v]) => (
                    <div key={k}><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{k}</span><p className="text-gray-800 dark:text-gray-200 mt-0.5">{v}</p></div>
                  ))}
                </div>
                {editing?.id === app.id && (
                  <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex gap-3 flex-wrap">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                        <select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })} className={inputClass + ' w-auto'}>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Admin Notes</label>
                      <textarea value={editing.notes} onChange={e => setEditing({ ...editing, notes: e.target.value })} rows={2} placeholder="Add notes about this application…" className={`${inputClass} resize-none`} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(app.id)} className="flex items-center gap-1.5 bg-secondary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"><Save size={13} /> Save Changes</button>
                      <button onClick={() => setEditing(null)} className="text-xs text-gray-400 hover:text-gray-600 px-3 py-2 rounded-xl transition-colors">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      }
    </div>
  );
};

// ── Overview Tab ─────────────────────────────────────────────
const OverviewTab = () => {
  const [stats, setStats] = useState({ gallery: 0, posts: 0, admissions: 0 });
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [{ count: gc }, { count: bc }, { count: ac }, { data: rp }] = await Promise.all([
        supabase.from('gallery').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('admissions').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id,title,category,created_at').order('created_at', { ascending: false }).limit(5),
      ]);
      setStats({ gallery: gc || 0, posts: bc || 0, admissions: ac || 0 });
      if (rp) setRecentPosts(rp);
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Gallery Images" value={stats.gallery} icon={Images} color="bg-secondary" />
        <StatCard label="Blog Posts" value={stats.posts} icon={BookOpen} color="bg-blue-500" />
        <StatCard label="Admissions" value={stats.admissions} icon={FileText} color="bg-purple-500" />
        <StatCard label="Total Content" value={stats.gallery + stats.posts} icon={TrendingUp} color="bg-emerald-500" />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 dark:text-white mb-5">Recent Posts</h3>
        {recentPosts.length === 0
          ? <p className="text-gray-400 text-sm text-center py-8">No posts yet.</p>
          : <div className="space-y-3">
              {recentPosts.map(post => (
                <div key={post.id} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <span className="text-xs bg-secondary/10 text-secondary px-2.5 py-1 rounded-full font-bold">{post.category}</span>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
};

// ── Dashboard ────────────────────────────────────────────────
const Dashboard = () => {
  const { authed, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [toastMsg, setToastMsg] = useState(null);

  const toast = (msg, type = 'success') => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  if (!authed) { navigate('/'); return null; }

  const tabs = [
    { key: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { key: 'admissions', icon: FileText, label: 'Admissions' },
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
              <div className="flex items-center gap-2.5">
                <img src="/assets/Badge.jpg" className="w-7 h-7 rounded-lg object-cover" />
                <span className="font-extrabold text-gray-900 dark:text-white text-sm hidden sm:block">Admin Dashboard</span>
              </div>
              <div className="flex gap-1">
                {tabs.map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === key ? 'bg-secondary text-white shadow-md shadow-red-500/20' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    <Icon size={14} /> <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-secondary transition-colors font-semibold">
                <Eye size={14} /> <span className="hidden sm:inline">View Site</span>
              </button>
              <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors font-semibold">
                <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
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
            transition={{ duration: 0.2 }}
          >
            {tab === 'overview' && <OverviewTab />}
            {tab === 'admissions' && <AdmissionsTab toast={toast} />}
            {tab === 'gallery' && <GalleryTab toast={toast} />}
            {tab === 'blog' && <BlogTab toast={toast} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toastMsg && <Toast {...toastMsg} onClose={() => setToastMsg(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
