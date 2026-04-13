import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, MapPin, Upload, ChevronRight, X, CheckCircle, Eye, Edit2, PhoneCall, GraduationCap, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const inputClass = 'w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary transition-all dark:text-white text-sm';

const CLASSES = [
  'Crèche', 'Playgroup', 'Pre-Nursery',
  'Nursery 1', 'Nursery 2',
  'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5',
  'JSS 1', 'JSS 2', 'JSS 3',
  'SSS 1', 'SSS 2', 'SSS 3',
];

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
    <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5 break-words">{value || '—'}</p>
  </div>
);

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
    <div className="w-7 h-7 bg-secondary/10 rounded-lg flex items-center justify-center">
      <Icon size={14} className="text-secondary" />
    </div>
    <h3 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">{title}</h3>
  </div>
);

const Admission = () => {
  const [form, setForm] = useState({
    studentName: '', dob: '', gender: '',
    classApplying: '', parentName: '', phone: '',
    email: '', address: '', photo: null,
  });
  const [preview, setPreview] = useState(null);
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, photo: file });
    setPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setForm({ ...form, photo: null });
    setPreview(null);
    fileRef.current.value = '';
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handlePreview = (e) => {
    e.preventDefault();
    setStep('preview');
    scrollTop();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let photo_url = null, photo_path = null;
      if (form.photo) {
        const ext = form.photo.name.split('.').pop();
        photo_path = `admissions/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('phis-media').upload(photo_path, form.photo);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from('phis-media').getPublicUrl(photo_path);
        photo_url = publicUrl;
      }
      const { error } = await supabase.from('admissions').insert({
        student_name: form.studentName, dob: form.dob, gender: form.gender,
        class_applying: form.classApplying, parent_name: form.parentName,
        phone: form.phone, email: form.email || null,
        address: form.address, photo_url, photo_path,
      });
      if (error) throw error;
      setStep('success');
      scrollTop();
    } catch {
      setStep('form');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">

      {/* ── Hero Banner ── */}
      <section className="relative h-[42vh] min-h-[280px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=70"
          alt="Admission"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-8 pt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-3">
              Enrolment Open · {new Date().getFullYear()} Session
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Start Your Application
            </h1>
            <p className="text-white/80 mt-2 text-sm sm:text-base max-w-xl">
              Join the Peter Harvard family. Fill in the form below to begin your admission process.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">

          {/* SUCCESS */}
          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-12 text-center max-w-lg mx-auto mt-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <img src="/assets/Badge.jpg" alt="PHIS" className="w-16 h-16 object-cover rounded-2xl mx-auto mb-4 shadow" />
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Application Received!</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                Thank you for applying to Peter Harvard INT'L Schools. We will review your application and reach out to you shortly.
              </p>
              <div className="p-4 bg-secondary/8 border border-secondary/20 rounded-2xl text-sm text-secondary font-semibold flex items-center justify-center gap-2 mb-6">
                <PhoneCall size={15} /> 08182277020 · 08033570685
              </div>
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:underline">
                Back to Home <ChevronRight size={14} />
              </Link>
            </motion.div>
          )}

          {/* PREVIEW */}
          {step === 'preview' && (
            <motion.div key="preview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                {/* Preview header */}
                <div className="bg-secondary px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="/assets/Badge.jpg" alt="PHIS" className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <p className="font-black text-white text-sm">Peter Harvard INT'L Schools</p>
                      <p className="text-white/70 text-xs">Admission Application — {new Date().getFullYear()} Session</p>
                    </div>
                  </div>
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full">Preview</span>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Photo + name */}
                  <div className="flex gap-5 items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    {preview
                      ? <img src={preview} alt="Passport" className="w-20 h-20 object-cover flex-shrink-0 shadow-md" style={{ borderRadius: 0 }} />
                      : <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"><User size={28} className="text-gray-400" /></div>
                    }
                    <div>
                      <p className="font-black text-gray-900 dark:text-white text-xl">{form.studentName}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{form.classApplying} · {form.gender}</p>
                      <p className="text-sm text-gray-400">DOB: {form.dob}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Parent / Guardian" value={form.parentName} />
                    <Field label="Phone" value={form.phone} />
                    <Field label="Email" value={form.email || '—'} />
                    <Field label="Class Applying" value={form.classApplying} />
                    <div className="sm:col-span-2"><Field label="Home Address" value={form.address} /></div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setStep('form')}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:border-secondary hover:text-secondary transition-colors">
                      <Edit2 size={14} /> Edit
                    </button>
                    <motion.button onClick={handleSubmit} disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-secondary hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2">
                      {loading
                        ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <><CheckCircle size={16} /> Confirm & Submit</>
                      }
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* FORM */}
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left — info sidebar */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-secondary rounded-2xl p-6 text-white">
                    <img src="/assets/Badge.jpg" alt="PHIS" className="w-14 h-14 rounded-2xl object-cover mb-4 shadow-lg" />
                    <h2 className="font-black text-xl leading-tight mb-1">Peter Harvard Int'l Schools</h2>
                    <p className="text-white/75 text-sm mb-4">Admissions are open for the {new Date().getFullYear()} academic session.</p>
                    <div className="space-y-2 text-sm text-white/80">
                      <div className="flex items-center gap-2"><CheckCircle size={14} className="text-green-300 flex-shrink-0" /> Crèche to SSS 3</div>
                      <div className="flex items-center gap-2"><CheckCircle size={14} className="text-green-300 flex-shrink-0" /> World-class facilities</div>
                      <div className="flex items-center gap-2"><CheckCircle size={14} className="text-green-300 flex-shrink-0" /> Expert educators</div>
                      <div className="flex items-center gap-2"><CheckCircle size={14} className="text-green-300 flex-shrink-0" /> Holistic development</div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h4 className="font-black text-gray-900 dark:text-white text-sm mb-3">Need Help?</h4>
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <a href="tel:+2348182277020" className="flex items-center gap-2 hover:text-secondary transition-colors">
                        <Phone size={13} className="text-secondary" /> 08182277020
                      </a>
                      <a href="tel:+2348033570685" className="flex items-center gap-2 hover:text-secondary transition-colors">
                        <Phone size={13} className="text-secondary" /> 08033570685
                      </a>
                      <a href="https://wa.me/2348062134991" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-600 transition-colors">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-green-500"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp Us
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right — form */}
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
                    <h2 className="font-black text-gray-900 dark:text-white text-xl mb-6">Application Form</h2>

                    <form onSubmit={handlePreview} className="space-y-7">

                      {/* Student Info */}
                      <div>
                        <SectionTitle icon={User} title="Student Information" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Full Name *</label>
                            <input name="studentName" required value={form.studentName} onChange={handleChange} placeholder="Student's full name" className={inputClass} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date of Birth *</label>
                            <input type="date" name="dob" required value={form.dob} onChange={handleChange} className={inputClass} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gender *</label>
                            <select name="gender" required value={form.gender} onChange={handleChange} className={inputClass}>
                              <option value="">Select gender</option>
                              <option>Male</option>
                              <option>Female</option>
                            </select>
                          </div>
                          <div className="sm:col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Class Applying For *</label>
                            <select name="classApplying" required value={form.classApplying} onChange={handleChange} className={inputClass}>
                              <option value="">Select class</option>
                              {CLASSES.map(c => <option key={c}>{c}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Parent Info */}
                      <div>
                        <SectionTitle icon={Phone} title="Parent / Guardian Information" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Parent / Guardian Name *</label>
                            <input name="parentName" required value={form.parentName} onChange={handleChange} placeholder="Full name" className={inputClass} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone Number *</label>
                            <input type="tel" name="phone" required value={form.phone} onChange={handleChange} placeholder="e.g. 08012345678" className={inputClass} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Address</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Optional" className={inputClass} />
                          </div>
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <SectionTitle icon={MapPin} title="Home Address" />
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Full Address *</label>
                          <textarea name="address" required rows={3} value={form.address} onChange={handleChange} placeholder="House number, street, area, city, state" className={`${inputClass} resize-none`} />
                        </div>
                      </div>

                      {/* Photo */}
                      <div>
                        <SectionTitle icon={Upload} title="Passport Photograph" />
                        {preview ? (
                          <div className="flex items-center gap-5 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <img src={preview} alt="Preview" className="w-20 h-20 object-cover flex-shrink-0 shadow" style={{ borderRadius: 0 }} />
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">{form.photo?.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{(form.photo?.size / 1024).toFixed(1)} KB</p>
                              <button type="button" onClick={removePhoto} className="mt-2 flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold transition-colors">
                                <X size={12} /> Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button type="button" onClick={() => fileRef.current.click()}
                            className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-secondary rounded-xl p-6 flex flex-col items-center gap-2 transition-colors group">
                            <div className="w-11 h-11 bg-gray-100 dark:bg-gray-800 group-hover:bg-secondary/10 rounded-xl flex items-center justify-center transition-colors">
                              <Upload size={20} className="text-gray-400 group-hover:text-secondary transition-colors" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Click to upload passport photo</p>
                            <p className="text-xs text-gray-400">JPG, PNG — max 5MB</p>
                          </button>
                        )}
                        <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                      </div>

                      <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        className="w-full bg-secondary hover:bg-red-700 text-white font-black py-4 rounded-xl transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 text-base">
                        <Eye size={18} /> Preview Application <ChevronRight size={18} />
                      </motion.button>
                      <p className="text-xs text-center text-gray-400">You'll be able to review your details before final submission.</p>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admission;
