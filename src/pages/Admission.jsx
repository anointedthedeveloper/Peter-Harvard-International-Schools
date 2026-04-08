import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, MapPin, Upload, ChevronRight, X, CheckCircle, BookOpen } from 'lucide-react';

const inputClass = 'w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary transition-all dark:text-white text-sm';

const CLASSES = [
  'Nursery 1', 'Nursery 2',
  'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
  'JSS 1', 'JSS 2', 'JSS 3',
  'SSS 1', 'SSS 2', 'SSS 3',
];

const Admission = () => {
  const [form, setForm] = useState({
    studentName: '', dob: '', gender: '',
    classApplying: '', parentName: '', phone: '',
    email: '', address: '', photo: null,
  });
  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // TODO: replace with real API endpoint
    // const data = new FormData();
    // Object.entries(form).forEach(([k, v]) => data.append(k, v));
    // await fetch('/api/admissions', { method: 'POST', body: data });

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1800);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=70"
          alt="Admission"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-secondary/80" />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative z-10 text-center text-white px-4"
        >
          <p className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-6">
            Enrolment Open
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-5">Start Your Application</h1>
          <div className="w-20 h-1 bg-secondary mx-auto mb-6 rounded-full" />
          <p className="text-lg max-w-xl mx-auto opacity-85 leading-relaxed">
            Join the Peter Harvard family. Fill in the form below to begin your admission process.
          </p>
        </motion.div>
      </section>

      {/* Form */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-16 text-center"
              >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Application Received!</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                  Thank you for applying to Peter Harvard INT'L School. We will review your application and reach out to you shortly.
                </p>
                <div className="mt-8 p-4 bg-secondary/10 border border-secondary/20 rounded-2xl text-sm text-secondary font-semibold">
                  📞 For enquiries call: 08182277020 · 08033570685
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
              >
                {/* Form header */}
                <div className="bg-secondary px-8 py-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <BookOpen size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white">Admission Application Form</h2>
                    <p className="text-white/70 text-xs mt-0.5">Peter Harvard INT'L School — {new Date().getFullYear()} Session</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">

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

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-secondary hover:bg-red-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 text-base"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <> Submit Application <ChevronRight size={18} /> </>
                    )}
                  </motion.button>

                  <p className="text-xs text-center text-gray-400">
                    By submitting, you agree that the information provided is accurate. Our admissions team will contact you within 2–3 working days.
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
