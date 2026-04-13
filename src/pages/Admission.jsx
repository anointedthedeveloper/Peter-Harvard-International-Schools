import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, MapPin, Upload, ChevronRight, X, CheckCircle, Eye, Edit2, PhoneCall } from 'lucide-react';
import { supabase } from '../lib/supabase';

const inputClass = 'w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary transition-all dark:text-white text-sm';

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

const Admission = () => {
  const [form, setForm] = useState({
    studentName: '', dob: '', gender: '',
    classApplying: '', parentName: '', phone: '',
    email: '', address: '', photo: null,
  });
  const [preview, setPreview] = useState(null);
  const [step, setStep] = useState('form'); // 'form' | 'preview' | 'success'
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
      let photo_url = null;
      let photo_path = null;
      if (form.photo) {
        const ext = form.photo.name.split('.').pop();
        photo_path = `admissions/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('phis-media').upload(photo_path, form.photo);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from('phis-media').getPublicUrl(photo_path);
        photo_url = publicUrl;
      }
      const { error } = await supabase.from('admissions').insert({
        student_name: form.studentName,
        dob: form.dob,
        gender: form.gender,
        class_applying: form.classApplying,
        parent_name: form.parentName,
        phone: form.phone,
        email: form.email || null,
        address: form.address,
        photo_url,
        photo_path,
      });
      if (error) throw error;
      setStep('success');
      scrollTop();
    } catch (err) {
      alert(err.message || 'Submission failed. Please try again.');
      setStep('form');
    }
    setLoading(false);
  };

  const FormHeader = () => null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col pt-[65px]">

      {/* Header */}
      <div className="bg-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 flex items-center gap-3">
          <img src="/assets/Badge.jpg" alt="PHIS" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Enrolment Open · {new Date().getFullYear()} Session</p>
            <h1 className="text-lg sm:text-2xl font-black text-white leading-tight">Admission Application</h1>
          </div>
          <span className="ml-auto bg-white/15 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1.5 rounded-full border border-white/20 flex-shrink-0 hidden xs:block">Peter Harvard Int'l Schools</span>
        </div>
      </div>

      {/* Form / Preview / Success */}
      <section className="flex-1 py-4 sm:py-6">
        <div className="max-w-3xl mx-auto px-3 sm:px-6">
          <AnimatePresence mode="wait">

            {/* ── SUCCESS ── */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-16 text-center"
              >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <img src="/assets/phislogoremovebg.png" alt="PHIS" className="w-20 h-20 object-contain mx-auto mb-4" />
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Application Received!</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                  Thank you for applying to Peter Harvard INT'L School. We will review your application and reach out to you shortly.
                </p>
                <div className="mt-8 p-4 bg-secondary/10 border border-secondary/20 rounded-2xl text-sm text-secondary font-semibold flex items-center justify-center gap-2">
                  <PhoneCall size={16} /> For enquiries call: 08182277020 · 08033570685
                </div>
              </motion.div>
            )}

            {/* ── PREVIEW ── */}
            {step === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
              >
                <FormHeader />
                <div className="p-5 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-gray-900 dark:text-white text-lg">Review Your Application</h3>
                    <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 font-bold px-3 py-1 rounded-full">Preview</span>
                  </div>

                  {/* Photo + basic info */}
                  <div className="flex gap-5 items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    {preview
                      ? <img src={preview} alt="Passport" className="w-24 h-24 rounded-xl object-cover border-4 border-secondary/20 flex-shrink-0 shadow" />
                      : <div className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"><User size={32} className="text-gray-400" /></div>
                    }
                    <div className="space-y-1">
                      <p className="font-extrabold text-gray-900 dark:text-white text-lg">{form.studentName}</p>
                      <p className="text-sm text-gray-500">{form.classApplying} · {form.gender}</p>
                      <p className="text-sm text-gray-500">DOB: {form.dob}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Parent / Guardian" value={form.parentName} />
                    <Field label="Phone" value={form.phone} />
                    <Field label="Email" value={form.email} />
                    <Field label="Class Applying" value={form.classApplying} />
                    <div className="sm:col-span-2"><Field label="Home Address" value={form.address} /></div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setStep('form')}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:border-secondary hover:text-secondary transition-colors"
                    >
                      <Edit2 size={15} /> Edit
                    </button>
                    <motion.button
                      onClick={handleSubmit}
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-secondary hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                    >
                      {loading
                        ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <><CheckCircle size={17} /> Confirm & Submit</>
                      }
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── FORM ── */}
            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
              >
                <FormHeader />

                <form onSubmit={handlePreview} className="p-5 sm:p-8 space-y-6">

                  {/* Student Info */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <User size={13} /> Student Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Full Name *</label>
                        <input name="studentName" required value={form.studentName} onChange={handleChange} placeholder="Student's full name" className={inputClass} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Date of Birth *</label>
                        <input type="date" name="dob" required value={form.dob} onChange={handleChange} className={inputClass} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Gender *</label>
                        <select name="gender" required value={form.gender} onChange={handleChange} className={inputClass}>
                          <option value="">Select gender</option>
                          <option>Male</option>
                          <option>Female</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Class Applying For *</label>
                        <select name="classApplying" required value={form.classApplying} onChange={handleChange} className={inputClass}>
                          <option value="">Select class</option>
                          {CLASSES.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Parent / Guardian */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Phone size={13} /> Parent / Guardian Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Parent / Guardian Name *</label>
                        <input name="parentName" required value={form.parentName} onChange={handleChange} placeholder="Full name" className={inputClass} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Phone Number *</label>
                        <input type="tel" name="phone" required value={form.phone} onChange={handleChange} placeholder="e.g. 08012345678" className={inputClass} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Email Address</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Optional" className={inputClass} />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <MapPin size={13} /> Home Address
                    </h3>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Full Address *</label>
                      <textarea name="address" required rows={3} value={form.address} onChange={handleChange} placeholder="House number, street, area, city, state" className={`${inputClass} resize-none`} />
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Upload size={13} /> Passport Photograph
                    </h3>
                    {preview ? (
                      <div className="flex items-center gap-5">
                        <img src={preview} alt="Preview" className="w-24 h-24 rounded-2xl object-cover shadow-lg border-4 border-secondary/20" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{form.photo?.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{(form.photo?.size / 1024).toFixed(1)} KB</p>
                          <button type="button" onClick={removePhoto} className="mt-2 flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold transition-colors">
                            <X size={13} /> Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileRef.current.click()}
                        className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-secondary dark:hover:border-secondary rounded-2xl p-8 flex flex-col items-center gap-3 transition-colors group"
                      >
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 group-hover:bg-secondary/10 rounded-xl flex items-center justify-center transition-colors">
                          <Upload size={22} className="text-gray-400 group-hover:text-secondary transition-colors" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Click to upload passport photo</p>
                          <p className="text-xs text-gray-400 mt-1">JPG, PNG — max 5MB</p>
                        </div>
                      </button>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                  </div>

                  {/* Preview button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-secondary hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 text-base"
                  >
                    <Eye size={18} /> Preview Application <ChevronRight size={18} />
                  </motion.button>

                  <p className="text-xs text-center text-gray-400">
                    You'll be able to review your details before final submission.
                  </p>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Admission;
