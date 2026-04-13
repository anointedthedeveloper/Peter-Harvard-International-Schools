import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Images, BookOpen, LogOut, Upload, Trash2, Plus, X,
  CheckCircle, AlertCircle, Eye, LayoutDashboard, TrendingUp,
  FileText, Download, Pencil, Save, ChevronDown, ChevronUp, Megaphone,
  GripVertical, Menu, ArrowRight, MessageSquare, Mail, MailOpen, Send, Users,
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

// ── Ticker Tab ───────────────────────────────────────────────
const TickerTab = ({ toast }) => {
  const [items, setItems] = useState([]);
  const [newText, setNewText] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase.from('ticker_items').select('*').order('position', { ascending: true });
    if (data) setItems(data);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('ticker_items').insert({ text: newText.trim(), position: items.length });
    if (error) toast(error.message, 'error');
    else { toast('Item added!', 'success'); setNewText(''); fetchItems(); }
    setSaving(false);
  };

  const handleDelete = async (item) => {
    await supabase.from('ticker_items').delete().eq('id', item.id);
    toast('Item removed', 'success');
    fetchItems();
  };

  const handleEdit = async (item, text) => {
    if (!text.trim()) return;
    await supabase.from('ticker_items').update({ text: text.trim() }).eq('id', item.id);
    fetchItems();
  };

  const moveItem = async (idx, dir) => {
    const next = [...items];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setItems(next);
    await Promise.all(next.map((item, i) => supabase.from('ticker_items').update({ position: i }).eq('id', item.id)));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Items list */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 dark:text-white mb-5">{items.length} Item{items.length !== 1 ? 's' : ''}</h3>
        {items.length === 0
          ? <p className="text-gray-400 text-sm text-center py-12">No items yet. Add one to get started.</p>
          : <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <TickerItemRow
                  key={item.id}
                  item={item}
                  idx={idx}
                  total={items.length}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onMove={moveItem}
                />
              ))}
            </div>
        }
      </div>

      {/* Add new + preview */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 dark:text-white mb-1">
          Ticker Announcements
        </h3>
        <p className="text-xs text-gray-400 mb-5">These scroll across the green ticker bar on the site.</p>
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="e.g. Term 2 Results Out Now!"
            className={inputClass + ' flex-1'}
          />
          <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 text-sm whitespace-nowrap">
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus size={15} /> Add</>}
          </motion.button>
        </form>

        {/* Live preview */}
        <div className="rounded-xl overflow-hidden bg-green-600">
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest px-4 pt-2.5 pb-1">Live Preview</p>
          <div className="relative overflow-hidden py-2 px-4">
            {items.length === 0
              ? <span className="text-white/50 text-xs">Add items to see preview</span>
              : <div className="flex gap-8 animate-ticker whitespace-nowrap">
                  {[...items, ...items, ...items].map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                      {item.text}
                    </span>
                  ))}
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

const TickerItemRow = ({ item, idx, total, onDelete, onEdit, onMove }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(item.text);

  const save = () => { onEdit(item, val); setEditing(false); };

  return (
    <div className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-900/40 transition-colors group">
      <GripVertical size={14} className="text-gray-300 shrink-0" />
      <div className="flex flex-col gap-0.5 shrink-0">
        <button onClick={() => onMove(idx, -1)} disabled={idx === 0} className="text-gray-300 hover:text-gray-500 disabled:opacity-20 transition-colors"><ChevronUp size={12} /></button>
        <button onClick={() => onMove(idx, 1)} disabled={idx === total - 1} className="text-gray-300 hover:text-gray-500 disabled:opacity-20 transition-colors"><ChevronDown size={12} /></button>
      </div>
      {editing
        ? <input autoFocus value={val} onChange={e => setVal(e.target.value)} onBlur={save} onKeyDown={e => e.key === 'Enter' && save()} className="flex-1 text-sm bg-gray-50 dark:bg-gray-800 border border-green-300 rounded-lg px-2 py-1 focus:outline-none dark:text-white" />
        : <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 font-medium truncate">{item.text}</span>
      }
      <button onClick={() => setEditing(e => !e)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"><Pencil size={13} /></button>
      <button onClick={() => onDelete(item)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={13} /></button>
    </div>
  );
};

// ── Overview Tab ─────────────────────────────────────────────
const OverviewTab = ({ onNavigate }) => {
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { key: 'admissions', label: 'Admissions', icon: FileText, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
          { key: 'gallery',    label: 'Gallery',    icon: Images,    color: 'text-secondary bg-red-50 dark:bg-red-900/20' },
          { key: 'blog',       label: 'Blog Posts', icon: BookOpen,  color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
          { key: 'ticker',     label: 'Ticker',     icon: Megaphone, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
        ].map(({ key, label, icon: Icon, color }) => (
          <button key={key} onClick={() => onNavigate(key)}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm flex items-center justify-between hover:border-gray-300 dark:hover:border-gray-600 transition-colors group text-left">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={16} />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
            </div>
            <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          </button>
        ))}
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

// ── Messages Tab ─────────────────────────────────────────────
const MessagesTab = ({ toast, onRead }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id) => {
    await supabase.from('messages').update({ read: true }).eq('id', id);
    setMessages(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, read: true } : m);
      const remaining = updated.filter(m => !m.read).length;
      onRead?.(remaining);
      return updated;
    });
  };

  const handleDelete = async (msg) => {
    if (!confirm(`Delete message from "${msg.name}"?`)) return;
    await supabase.from('messages').delete().eq('id', msg.id);
    toast('Message deleted', 'success');
    fetchMessages();
  };

  const unread = messages.filter(m => !m.read).length;

  if (loading) return <p className="text-gray-400 text-sm text-center py-16">Loading messages…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="font-bold text-gray-900 dark:text-white">{messages.length} Message{messages.length !== 1 ? 's' : ''}</h3>
        {unread > 0 && (
          <span className="bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-full">{unread} unread</span>
        )}
      </div>

      {messages.length === 0
        ? <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-16 text-center">
            <MessageSquare size={36} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No messages yet.</p>
          </div>
        : messages.map(msg => (
          <div key={msg.id} className={`bg-white dark:bg-gray-900 rounded-2xl border shadow-sm overflow-hidden transition-colors ${
            msg.read ? 'border-gray-100 dark:border-gray-800' : 'border-secondary/30 dark:border-secondary/30'
          }`}>
            <div className="flex items-center gap-4 p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.read ? 'bg-gray-100 dark:bg-gray-800' : 'bg-secondary/10'
              }`}>
                {msg.read
                  ? <MailOpen size={18} className="text-gray-400" />
                  : <Mail size={18} className="text-secondary" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{msg.name}</p>
                  {!msg.read && <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-400 truncate">{msg.email} · {msg.subject}</p>
              </div>
              <p className="text-xs text-gray-400 hidden sm:block flex-shrink-0">
                {new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => { setExpanded(expanded === msg.id ? null : msg.id); if (!msg.read) markRead(msg.id); }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  {expanded === msg.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
                <button onClick={() => handleDelete(msg)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {expanded === msg.id && (
              <div className="border-t border-gray-100 dark:border-gray-800 p-5 bg-gray-50 dark:bg-gray-800/50 space-y-3">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Subject</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">{msg.subject}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Message</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-red-700 transition-colors"
                >
                  <Mail size={13} /> Reply via Email
                </a>
              </div>
            )}
          </div>
        ))
      }
    </div>
  );
};

// ── Newsletter Tab ─────────────────────────────────────────────
const NewsletterTab = ({ toast }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [sends, setSends] = useState([]);
  const [form, setForm] = useState({ subject: '', body: '' });
  const [sending, setSending] = useState(false);

  const fetchData = async () => {
    const [{ data: subs }, { data: sent }] = await Promise.all([
      supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }),
      supabase.from('newsletter_sends').select('*').order('sent_at', { ascending: false }).limit(10),
    ]);
    if (subs) setSubscribers(subs);
    if (sent) setSends(sent);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (subscribers.length === 0) return toast('No subscribers yet', 'error');
    if (!confirm(`Send to ${subscribers.length} subscriber${subscribers.length !== 1 ? 's' : ''}?`)) return;
    setSending(true);
    try {
      const { error } = await supabase.from('newsletter_sends').insert({
        subject: form.subject,
        body: form.body,
        recipient_count: subscribers.length,
      });
      if (error) throw error;
      toast(`Newsletter sent to ${subscribers.length} subscriber${subscribers.length !== 1 ? 's' : ''}!`, 'success');
      setForm({ subject: '', body: '' });
      fetchData();
    } catch (err) {
      toast(err.message || 'Failed to send', 'error');
    }
    setSending(false);
  };

  const handleDeleteSub = async (id) => {
    await supabase.from('newsletter_subscribers').delete().eq('id', id);
    toast('Subscriber removed', 'success');
    fetchData();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Compose */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <Send size={16} className="text-secondary" /> Compose Newsletter
          </h3>
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</label>
              <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required placeholder="e.g. Term 2 Newsletter" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message Body</label>
              <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} required rows={8} placeholder="Write your newsletter content here..." className={`${inputClass} resize-none`} />
            </div>
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-gray-400">
                Will be sent to <span className="font-bold text-gray-700 dark:text-gray-300">{subscribers.length}</span> subscriber{subscribers.length !== 1 ? 's' : ''}
              </p>
              <motion.button type="submit" disabled={sending} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="bg-secondary hover:bg-red-700 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm shadow-md shadow-red-500/20">
                {sending ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={14} /> Send Newsletter</>}
              </motion.button>
            </div>
          </form>
        </div>

        {/* Send history */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Send History</h3>
          {sends.length === 0
            ? <p className="text-gray-400 text-sm text-center py-8">No newsletters sent yet.</p>
            : <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {sends.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{s.subject}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(s.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {s.recipient_count} recipients</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-3">Sent</span>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {/* Subscribers list */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center justify-between">
            <span className="flex items-center gap-2"><Users size={16} className="text-blue-500" /> {subscribers.length} Subscriber{subscribers.length !== 1 ? 's' : ''}</span>
          </h3>
          {subscribers.length === 0
            ? <p className="text-gray-400 text-sm text-center py-12">No subscribers yet.</p>
            : <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {subscribers.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-medium truncate">{sub.email}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(sub.subscribed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <button onClick={() => handleDeleteSub(sub.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0 ml-2">
                      <Trash2 size={13} />
                    </button>
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
  const [tab, setTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      const { count } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('read', false);
      setUnreadCount(count || 0);
    };
    fetchUnread();
  }, [tab]);

  const toast = (msg, type = 'success') => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  if (!authed) { navigate('/'); return null; }

  const tabs = [
    { key: 'overview',   icon: LayoutDashboard, label: 'Overview' },
    { key: 'admissions', icon: FileText,         label: 'Admissions' },
    { key: 'gallery',    icon: Images,           label: 'Gallery' },
    { key: 'blog',       icon: BookOpen,         label: 'Blog Posts' },
    { key: 'ticker',     icon: Megaphone,        label: 'Ticker' },
    { key: 'messages',   icon: MessageSquare,    label: 'Messages' },
    { key: 'newsletter',  icon: Send,             label: 'Newsletter' },
  ];

  const tabLabels = { overview: 'Overview', admissions: 'Admissions', gallery: 'Gallery', blog: 'Blog Posts', ticker: 'Ticker', messages: 'Messages', newsletter: 'Newsletter' };

  const Sidebar = () => (
    <aside className="flex flex-col w-60 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 h-[calc(100vh-7.5rem)] sticky top-[7.5rem] overflow-y-auto">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <img src="/assets/Badge.jpg" className="w-14 h-14 rounded-2xl object-cover shadow-md" />
          <div>
            <p className="font-extrabold text-gray-900 dark:text-white text-sm leading-tight">Admin Panel</p>
            <p className="text-[11px] text-gray-400 font-medium">Peter Harvard Int'l</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {tabs.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => { setTab(key); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === key
                ? 'bg-secondary text-white shadow-md shadow-red-500/20'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Icon size={16} />
            {label}
            {key === 'messages' && unreadCount > 0 && (
              <span className="ml-auto bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{unreadCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
        <button
          onClick={() => window.open('/', '_blank')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <Eye size={16} /> View Site
        </button>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col pt-0">

      {/* Top bar — full width, sits right below the site navbar */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30 h-14 flex items-center px-4 sm:px-6 gap-4">
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu size={18} />
        </button>
        <h1 className="font-extrabold text-gray-900 dark:text-white text-sm">{tabLabels[tab]}</h1>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-secondary transition-colors font-semibold px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Eye size={14} /> <span className="hidden sm:inline">View Site</span>
          </button>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors font-semibold px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Body row */}
      <div className="flex flex-1 min-h-0">

        {/* Sidebar — toggleable on all screen sizes */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="overflow-hidden shrink-0"
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {tab === 'overview'   && <OverviewTab onNavigate={setTab} />}
              {tab === 'admissions' && <AdmissionsTab toast={toast} />}
              {tab === 'gallery'    && <GalleryTab toast={toast} />}
              {tab === 'blog'       && <BlogTab toast={toast} />}
              {tab === 'ticker'     && <TickerTab toast={toast} />}
              {tab === 'messages'   && <MessagesTab toast={toast} onRead={(n) => setUnreadCount(n)} />}
              {tab === 'newsletter' && <NewsletterTab toast={toast} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {toastMsg && <Toast {...toastMsg} onClose={() => setToastMsg(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
