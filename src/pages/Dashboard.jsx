import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Images, BookOpen, LogOut, Upload, Trash2, Plus, X,
  CheckCircle, AlertCircle, Eye, LayoutDashboard, TrendingUp,
  FileText, Download, Pencil, Save, ChevronDown, ChevronUp, Megaphone,
  GripVertical, Menu, ArrowRight, MessageSquare, Mail, MailOpen, Send, Users,
  RefreshCw, KeyRound,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
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

// â”€â”€ Gallery Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const compressImage = (file, maxW = 1200, quality = 0.82) =>
  new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        URL.revokeObjectURL(url);
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
      }, 'image/jpeg', quality);
    };
    img.src = url;
  });

const GalleryTab = ({ toast }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Campus' });
  const [files, setFiles] = useState([]);       // bulk files
  const [previews, setPreviews] = useState([]);  // bulk previews
  const fileRef = useRef();

  const CATS = ['Campus', 'Academics', 'Sports', 'Events'];

  const fetchImages = async () => {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (data) setImages(data);
  };

  useEffect(() => { fetchImages(); }, []);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    if (!selected.length) return;
    setFiles(selected);
    setPreviews(selected.map(f => URL.createObjectURL(f)));
  };

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) return toast('Please select at least one image', 'error');
    setUploading(true);
    let successCount = 0;
    try {
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressImage(files[i]);
        const path = `gallery/${Date.now()}_${i}.jpg`;
        const { error: upErr } = await supabase.storage.from('phis-media').upload(path, compressed);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from('phis-media').getPublicUrl(path);
        const title = files.length === 1 ? form.title : `${form.title} ${i + 1}`;
        const { error: dbErr } = await supabase.from('gallery').insert({ title, category: form.category, src: publicUrl, storage_path: path });
        if (dbErr) throw dbErr;
        successCount++;
      }
      toast(`${successCount} image${successCount !== 1 ? 's' : ''} uploaded!`, 'success');
      setForm({ title: '', category: 'Campus' });
      setFiles([]); setPreviews([]);
      fileRef.current.value = '';
      invalidateGalleryCache();
      fetchImages();
    } catch (err) {
      toast(err.message || 'Upload failed', 'error');
    }
    setUploading(false);
  };

  const handleDelete = async (img) => {
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
            <Plus size={18} className="text-secondary" /> Upload Images
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
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Images {files.length > 0 && <span className="text-secondary">({files.length} selected)</span>}
              </label>
              {previews.length > 0 ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto">
                    {previews.map((p, i) => (
                      <div key={i} className="relative aspect-square">
                        <img src={p} className="w-full h-full object-cover rounded-lg" />
                        <button type="button" onClick={() => removeFile(i)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => fileRef.current.click()} className="w-full text-xs text-secondary font-semibold py-1.5 border border-secondary/30 rounded-lg hover:bg-secondary/5 transition-colors">
                    + Add more images
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current.click()} className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-secondary rounded-xl p-6 flex flex-col items-center gap-2 transition-colors group">
                  <Upload size={20} className="text-gray-400 group-hover:text-secondary transition-colors" />
                  <span className="text-xs text-gray-400">Click to select images</span>
                  <span className="text-[10px] text-gray-300">Select multiple for bulk upload</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
            </div>
            <motion.button type="submit" disabled={uploading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-secondary hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-red-500/20">
              {uploading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploadingâ€¦</>
                : <><Upload size={15} /> Upload {files.length > 1 ? `${files.length} Images` : 'Image'}</>
              }
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
                    <img src={img.src} alt={img.title} loading="lazy" className="w-full h-full object-cover" />
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

// â”€â”€ Blog Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BlogTab = ({ toast }) => {
  const [posts, setPosts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: 'News' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
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

  const resetForm = () => {
    setForm({ title: '', excerpt: '', content: '', category: 'News' });
    setFile(null); setPreview(null); setEditingId(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setForm({ title: post.title, excerpt: post.excerpt || '', content: post.content || '', category: post.category });
    setPreview(post.cover_url || null);
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let cover_url = editingId ? (preview && !file ? preview : null) : null;
      if (file) {
        const ext = file.name.split('.').pop();
        const path = `blog/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('phis-media').upload(path, file);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from('phis-media').getPublicUrl(path);
        cover_url = publicUrl;
      }
      if (editingId) {
        const update = { ...form };
        if (cover_url !== undefined) update.cover_url = cover_url;
        const { error } = await supabase.from('blog_posts').update(update).eq('id', editingId);
        if (error) throw error;
        toast('Post updated!', 'success');
      } else {
        const { error } = await supabase.from('blog_posts').insert({ ...form, cover_url });
        if (error) throw error;
        toast('Post published!', 'success');
      }
      resetForm();
      invalidateBlogCache();
      fetchPosts();
    } catch (err) {
      toast(err.message || 'Failed', 'error');
    }
    setUploading(false);
  };

  const handleDelete = async (post) => {
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
            <Plus size={18} className="text-secondary" /> {editingId ? 'Edit Post' : 'New Post'}
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
                ? <div className="relative"><img src={preview} className="w-full h-28 object-cover rounded-xl" /><button type="button" onClick={() => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ''; }} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"><X size={14} /></button></div>
                : <button type="button" onClick={() => fileRef.current.click()} className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-secondary rounded-xl p-4 flex items-center justify-center gap-2 transition-colors group"><Upload size={16} className="text-gray-400 group-hover:text-secondary transition-colors" /><span className="text-xs text-gray-400">Upload cover image</span></button>
              }
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>
            <div className="flex gap-2">
              <motion.button type="submit" disabled={uploading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex-1 bg-secondary hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-red-500/20">
                {uploading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><BookOpen size={15} /> {editingId ? 'Update Post' : 'Publish Post'}</>}
              </motion.button>
              {editingId && (
                <button type="button" onClick={resetForm} className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
              )}
            </div>
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
                      ? <img src={post.cover_url} loading="lazy" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      : <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0"><BookOpen size={20} className="text-gray-400" /></div>
                    }
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{post.title}</p>
                        <div className="flex gap-1 flex-shrink-0">
                          <button onClick={() => startEdit(post)} className="p-1.5 text-gray-400 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"><Pencil size={13} /></button>
                          <button onClick={() => handleDelete(post)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </div>
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
// â”€â”€ Admissions Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400',
};

const downloadAdmission = async (app) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, margin = 18;

  // Red header bar
  doc.setFillColor(193, 18, 31);
  doc.rect(0, 0, W, 32, 'F');

  // Badge logo
  try {
    const res = await fetch('/assets/Badge.jpg');
    const blob = await res.blob();
    const reader = new FileReader();
    await new Promise(resolve => { reader.onload = resolve; reader.readAsDataURL(blob); });
    doc.addImage(reader.result, 'JPEG', margin, 6, 20, 20);
  } catch {}

  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14); doc.setFont('helvetica', 'bold');
  doc.text("Peter Harvard INT'L Schools", margin + 24, 14);
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.text('Admission Application Form', margin + 24, 20);
  doc.text(`Submitted: ${new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin + 24, 26);

  // Passport photo (top right)
  if (app.photo_url) {
    try {
      const res = await fetch(app.photo_url);
      const blob = await res.blob();
      const reader = new FileReader();
      await new Promise(resolve => { reader.onload = resolve; reader.readAsDataURL(blob); });
      doc.addImage(reader.result, 'JPEG', W - margin - 22, 5, 22, 22);
    } catch {}
  }

  // Section helper
  let y = 42;
  const row = (label, value) => {
    doc.setFillColor(249, 249, 249);
    doc.rect(margin, y, 60, 8, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(margin, y, W - margin * 2, 8, 'S');
    doc.setTextColor(100, 100, 100); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
    doc.text(label, margin + 2, y + 5.5);
    doc.setTextColor(30, 30, 30); doc.setFont('helvetica', 'normal');
    doc.text(String(value || 'â€”'), margin + 62, y + 5.5);
    y += 8;
  };

  const section = (title) => {
    y += 4;
    doc.setFillColor(193, 18, 31);
    doc.rect(margin, y, W - margin * 2, 7, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 2, y + 5);
    y += 9;
  };

  section('Student Information');
  row('Full Name', app.student_name);
  row('Date of Birth', app.dob);
  row('Gender', app.gender);
  row('Class Applying', app.class_applying);

  section('Parent / Guardian');
  row('Name', app.parent_name);
  row('Phone', app.phone);
  row('Email', app.email || 'â€”');
  row('Address', app.address);

  section('Application Status');
  row('Status', app.status?.toUpperCase());
  if (app.notes) row('Admin Notes', app.notes);

  // Footer
  doc.setFillColor(193, 18, 31);
  doc.rect(0, 287, W, 10, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
  doc.text("Peter Harvard INT'L Schools â€” Kubwa, Abuja", margin, 293);
  doc.text('Confidential', W - margin, 293, { align: 'right' });

  doc.save(`Admission_${app.student_name.replace(/\s+/g, '_')}.pdf`);
};

const AdmissionsTab = ({ toast }) => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [editing, setEditing] = useState(null);

  const fetchApps = async () => {
    setLoading(true);
    const { data } = await supabase.from('admissions').select('*').order('created_at', { ascending: false });
    if (data) setApps(data);
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, []);

  const saveEdit = async (id) => {
    const fields = {
      student_name: editing.student_name,
      dob: editing.dob,
      gender: editing.gender,
      class_applying: editing.class_applying,
      parent_name: editing.parent_name,
      phone: editing.phone,
      email: editing.email,
      address: editing.address,
      status: editing.status,
      notes: editing.notes,
    };
    const { error } = await supabase.from('admissions').update(fields).eq('id', id);
    if (error) return toast(error.message, 'error');
    toast('Application updated', 'success');
    setEditing(null);
    fetchApps();
  };

  const handleDelete = async (app) => {
    if (app.photo_path) await supabase.storage.from('phis-media').remove([app.photo_path]);
    await supabase.from('admissions').delete().eq('id', app.id);
    toast('Application deleted', 'success');
    fetchApps();
  };

  const CLASSES = ['CrÃ¨che','Playgroup','Pre-Nursery','Nursery 1','Nursery 2','Primary 1','Primary 2','Primary 3','Primary 4','Primary 5','JSS 1','JSS 2','JSS 3','SSS 1','SSS 2','SSS 3'];

  if (loading) return <p className="text-gray-400 text-sm text-center py-16">Loading applicationsâ€¦</p>;

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-gray-900 dark:text-white">{apps.length} Application{apps.length !== 1 ? 's' : ''}</h3>
      {apps.length === 0
        ? <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-16 text-center">
            <FileText size={36} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No applications yet.</p>
          </div>
        : apps.map(app => (
          <div key={app.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              {app.photo_url
                ? <img src={app.photo_url} className="w-11 h-11 object-cover flex-shrink-0" style={{borderRadius:0}} />
                : <div className="w-11 h-11 bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0"><FileText size={18} className="text-gray-400" /></div>
              }
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{app.student_name}</p>
                <p className="text-xs text-gray-400">{app.class_applying} Â· {app.parent_name} Â· {app.phone}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize flex-shrink-0 ${statusColors[app.status] || statusColors.pending}`}>{app.status}</span>
              <p className="text-xs text-gray-400 hidden sm:block flex-shrink-0">{new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => downloadAdmission(app)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Download PDF"><Download size={15} /></button>
                <button onClick={() => { setEditing({ id: app.id, student_name: app.student_name, dob: app.dob, gender: app.gender, class_applying: app.class_applying, parent_name: app.parent_name, phone: app.phone, email: app.email || '', address: app.address, status: app.status, notes: app.notes || '' }); setExpanded(app.id); }} className="p-2 text-gray-400 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors" title="Edit"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(app)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete"><Trash2 size={15} /></button>
                <button onClick={() => setExpanded(expanded === app.id ? null : app.id)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">{expanded === app.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</button>
              </div>
            </div>

            {expanded === app.id && (
              <div className="border-t border-gray-100 dark:border-gray-800 p-5 bg-gray-50 dark:bg-gray-800/50">
                {editing?.id === app.id ? (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Edit Application</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                        <input value={editing.student_name} onChange={e => setEditing({...editing, student_name: e.target.value})} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date of Birth</label>
                        <input type="date" value={editing.dob} onChange={e => setEditing({...editing, dob: e.target.value})} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gender</label>
                        <select value={editing.gender} onChange={e => setEditing({...editing, gender: e.target.value})} className={inputClass}>
                          <option>Male</option><option>Female</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Class</label>
                        <select value={editing.class_applying} onChange={e => setEditing({...editing, class_applying: e.target.value})} className={inputClass}>
                          {CLASSES.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Parent / Guardian</label>
                        <input value={editing.parent_name} onChange={e => setEditing({...editing, parent_name: e.target.value})} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</label>
                        <input value={editing.phone} onChange={e => setEditing({...editing, phone: e.target.value})} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                        <input value={editing.email} onChange={e => setEditing({...editing, email: e.target.value})} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                        <select value={editing.status} onChange={e => setEditing({...editing, status: e.target.value})} className={inputClass}>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address</label>
                        <textarea value={editing.address} onChange={e => setEditing({...editing, address: e.target.value})} rows={2} className={`${inputClass} resize-none`} />
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Admin Notes</label>
                        <textarea value={editing.notes} onChange={e => setEditing({...editing, notes: e.target.value})} rows={2} placeholder="Add notesâ€¦" className={`${inputClass} resize-none`} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(app.id)} className="flex items-center gap-1.5 bg-secondary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"><Save size={13} /> Save Changes</button>
                      <button onClick={() => setEditing(null)} className="text-xs text-gray-400 hover:text-gray-600 px-3 py-2 rounded-xl transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    {[['Date of Birth', app.dob], ['Gender', app.gender], ['Email', app.email || 'â€”'], ['Address', app.address], ['Notes', app.notes || 'â€”']].map(([k, v]) => (
                      <div key={k}><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{k}</span><p className="text-gray-800 dark:text-gray-200 mt-0.5">{v}</p></div>
                    ))}
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

// â”€â”€ Ticker Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        <h3 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          <Megaphone size={18} className="text-green-500" /> Ticker Announcements
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

// â”€â”€ Overview Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ Messages Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    await supabase.from('messages').delete().eq('id', msg.id);
    toast('Message deleted', 'success');
    fetchMessages();
  };

  const unread = messages.filter(m => !m.read).length;

  if (loading) return <p className="text-gray-400 text-sm text-center py-16">Loading messagesâ€¦</p>;

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
                <p className="text-xs text-gray-400 truncate">{msg.email} Â· {msg.subject}</p>
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

// â”€â”€ Newsletter Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NewsletterTab = ({ toast }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [sends, setSends] = useState([]);
  const [form, setForm] = useState({ subject: '', body: '' });
  const [sending, setSending] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const fetchData = async () => {
    const [{ data: subs }, { data: sent }] = await Promise.all([
      supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }),
      supabase.from('newsletter_sends').select('*').order('sent_at', { ascending: false }).limit(10),
    ]);
    if (subs) setSubscribers(subs);
    if (sent) setSends(sent);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSend = async () => {
    setConfirm(false);
    setSending(true);
    try {
      const res = await fetch('https://wmoxdrmleucowwaaqsrq.supabase.co/functions/v1/send-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtb3hkcm1sZXVjb3d3YWFxc3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwODQ0OTAsImV4cCI6MjA5MTY2MDQ5MH0.uiNoLWygeeQ9d56iMdCgjvaT_scSAhVQMT_ELYDxUpc`,
        },
        body: JSON.stringify({ subject: form.subject, body: form.body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Send failed');
      await supabase.from('newsletter_sends').insert({
        subject: form.subject, body: form.body, recipient_count: data.sent ?? subscribers.length,
      });
      toast(`Sent to ${data.sent ?? subscribers.length} subscriber${subscribers.length !== 1 ? 's' : ''}!`, 'success');
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
    <>
      {/* Confirm modal */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-100 dark:border-gray-800"
            >
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                <Send size={20} className="text-secondary" />
              </div>
              <h3 className="font-black text-gray-900 dark:text-white text-lg mb-1">Send Newsletter?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                This will email <span className="font-bold text-gray-900 dark:text-white">{subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}</span> with the subject <span className="font-bold text-secondary">"{form.subject}"</span>.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirm(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                <button onClick={handleSend} className="flex-1 px-4 py-2.5 rounded-xl bg-secondary hover:bg-red-700 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  <Send size={14} /> Send Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Compose */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            {/* Compose header */}
            <div className="bg-secondary px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-black text-white text-base">Compose Newsletter</h3>
                <p className="text-white/70 text-xs mt-0.5">{subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''} will receive this</p>
              </div>
              <Send size={20} className="text-white/60" />
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject Line</label>
                <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Term 2 Newsletter â€” Peter Harvard" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message Body</label>
                <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} rows={10} placeholder="Write your newsletter content here..." className={`${inputClass} resize-none`} />
              </div>

              {/* Email preview strip */}
              {(form.subject || form.body) && (
                <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                  <div className="bg-secondary px-4 py-2 flex items-center justify-between">
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Preview</span>
                    <span className="text-white/60 text-xs">newsletter@anobyte.online</span>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800">
                    {form.subject && <p className="font-bold text-secondary text-sm mb-1">{form.subject}</p>}
                    {form.body && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 whitespace-pre-wrap">{form.body}</p>}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  Powered by{' '}
                  <a href="https://anobyte.online" target="_blank" rel="noopener noreferrer" className="text-secondary font-bold hover:underline">Anobyte</a>
                </p>
                <motion.button
                  type="button"
                  disabled={sending || !form.subject.trim() || !form.body.trim() || subscribers.length === 0}
                  onClick={() => setConfirm(true)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="bg-secondary hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm shadow-md shadow-red-500/20"
                >
                  {sending
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sendingâ€¦</>
                    : <><Send size={14} /> Send to {subscribers.length}</>}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Send history */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-gray-900 dark:text-white text-sm">Send History</h3>{sends.length > 0 && (<button onClick={async () => { await supabase.from('newsletter_sends').delete().gte('sent_at', '2000-01-01'); toast('Send history cleared', 'success'); fetchData(); }} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={12} /> Clear History</button>)}</div>
            {sends.length === 0
              ? <p className="text-gray-400 text-sm text-center py-6">No newsletters sent yet.</p>
              : <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {sends.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{s.subject}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(s.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} Â· {s.recipient_count} recipients</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-3">Sent</span>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>

        {/* Subscribers */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="bg-gray-50 dark:bg-gray-800 px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Subscribers</h3>
                <p className="text-xs text-gray-400 mt-0.5">{subscribers.length} total</p>
              </div>
              <Users size={16} className="text-gray-400" />
            </div>
            {subscribers.length === 0
              ? <p className="text-gray-400 text-sm text-center py-12">No subscribers yet.</p>
              : <div className="divide-y divide-gray-50 dark:divide-gray-800 max-h-[520px] overflow-y-auto">
                  {subscribers.map((sub, i) => (
                    <div key={sub.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 dark:text-gray-200 font-medium truncate">{sub.email}</p>
                        <p className="text-xs text-gray-400">{new Date(sub.subscribed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <button onClick={() => handleDeleteSub(sub.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0 ml-2">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

// â”€â”€ Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// ── Change Password Tab ──────────────────────────────────────────────────────
const ChangePasswordTab = ({ toast }) => {
  const [form, setForm] = useState({ newPass: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPass !== form.confirm) return toast('Passwords do not match', 'error');
    if (form.newPass.length < 6) return toast('Password must be at least 6 characters', 'error');
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: form.newPass });
    if (error) toast(error.message, 'error');
    else { toast('Password updated successfully!', 'success'); setForm({ newPass: '', confirm: '' }); }
    setLoading(false);
  };
  return (
    <div className="max-w-md">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
            <KeyRound size={18} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Change Password</h3>
            <p className="text-xs text-gray-400">Update your admin account password</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
            <input type="password" value={form.newPass} onChange={e => setForm({ ...form, newPass: e.target.value })} required minLength={6} placeholder="Min. 6 characters" className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm New Password</label>
            <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required placeholder="Repeat new password" className={inputClass} />
          </div>
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full bg-secondary hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-red-500/20">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><KeyRound size={15} /> Update Password</>}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { authed, loading, logout } = useAuth();
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

  useEffect(() => {
    if (!loading && !authed) navigate('/');
  }, [authed, loading, navigate]);

  const mainTabs = [
    { key: 'overview',   icon: LayoutDashboard, label: 'Overview' },
    { key: 'admissions', icon: FileText,         label: 'Admissions' },
    { key: 'gallery',    icon: Images,           label: 'Gallery' },
    { key: 'blog',       icon: BookOpen,         label: 'Blog Posts' },
    { key: 'ticker',     icon: Megaphone,        label: 'Ticker' },
    { key: 'messages',   icon: MessageSquare,    label: 'Messages' },
    { key: 'newsletter', icon: Send,             label: 'Newsletter' },
  ];

  const tabLabels = { overview: 'Overview', admissions: 'Admissions', gallery: 'Gallery', blog: 'Blog Posts', ticker: 'Ticker', messages: 'Messages', newsletter: 'Newsletter', password: 'Change Password' };
  const allTabs = [...mainTabs, { key: 'password', icon: KeyRound, label: 'Change Password' }];
  const currentTab = allTabs.find(t => t.key === tab);

  const NavBtn = ({ tabKey, icon: Icon, label, badge }) => (
    <button
      onClick={() => setTab(tabKey)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
        tab === tabKey
          ? 'bg-secondary/10 text-secondary dark:text-red-400'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      {tab === tabKey && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-secondary rounded-r-full" />}
      <Icon size={16} className={tab === tabKey ? 'text-secondary' : ''} />
      {label}
      {badge > 0 && (
        <span className="ml-auto bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{badge}</span>
      )}
    </button>
  );

  const Sidebar = () => (
    <aside className={`flex flex-col w-64 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 fixed top-14 bottom-0 left-0 overflow-y-auto z-20 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Brand */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900">
        <div className="flex items-center gap-3">
          <img src="/assets/Badge.jpg" className="w-10 h-10 rounded-xl object-cover shadow-sm ring-2 ring-secondary/20 shrink-0" />
          <div className="min-w-0">
            <p className="font-black text-gray-900 dark:text-white text-[13px] leading-tight truncate">Peter Harvard Int'l</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[11px] text-green-600 dark:text-green-500 font-bold">Admin Panel</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pt-2 pb-2">Menu</p>
        {mainTabs.map(({ key, icon, label }) => (
          <NavBtn key={key} tabKey={key} icon={icon} label={label} badge={key === 'messages' ? unreadCount : 0} />
        ))}
        <div className="pt-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pb-2">Account</p>
          <NavBtn tabKey="password" icon={KeyRound} label="Change Password" />
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-800 space-y-0.5">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">

      {/* Top bar */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30 h-14 flex items-center px-4 sm:px-6 gap-3">
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-gray-400 hidden sm:block">Dashboard</span>
          <span className="text-gray-300 dark:text-gray-700 hidden sm:block">/</span>
          <div className="flex items-center gap-1.5">
            {currentTab && <currentTab.icon size={14} className="text-secondary shrink-0" />}
            <h1 className="font-bold text-gray-900 dark:text-white text-sm truncate">{tabLabels[tab]}</h1>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-400 hover:text-secondary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-secondary transition-colors font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Eye size={14} /> <span className="hidden sm:inline">View Site</span>
          </button>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Body row */}
      <div className="flex flex-1 min-h-0">

        {/* Fixed sidebar */}
        <Sidebar />

        {/* Spacer that pushes content right when sidebar open */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 256 }}
              exit={{ width: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="shrink-0"
            />
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-8 overflow-y-auto min-h-[calc(100vh-3.5rem)]">
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
              {tab === 'password'   && <ChangePasswordTab toast={toast} />}
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
