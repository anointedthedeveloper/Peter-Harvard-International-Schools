import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, UserCircle, ShieldCheck, ArrowRight } from 'lucide-react';

const inputClass = 'w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary dark:text-white text-sm transition-all';

const LoginForm = ({ type, onBack }) => {
  const [form, setForm] = useState({ id: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = type === 'admin';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setError('Portal is currently under maintenance. Please try again later.');
    }, 1500);
  };

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-secondary transition-colors mb-6 group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to portal selection
      </button>

      <div className="flex items-center gap-3 mb-7">
        <div className="w-11 h-11 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
          {isAdmin ? <ShieldCheck size={22} /> : <UserCircle size={22} />}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isAdmin ? 'Admin & Staff Login' : 'Student & Parent Login'}
          </h2>
          <p className="text-xs text-gray-400">Enter your credentials to continue</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {isAdmin ? 'Staff ID' : 'Student / Parent ID'}
          </label>
          <input
            type="text"
            required
            value={form.id}
            onChange={e => setForm({ ...form, id: e.target.value })}
            placeholder={isAdmin ? 'e.g. STAFF-001' : 'e.g. STU-2024-001'}
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Password</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary transition-colors"
            >
              {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-gray-500 dark:text-gray-400 cursor-pointer">
            <input type="checkbox" className="accent-secondary" /> Remember me
          </label>
          <span className="text-secondary hover:underline cursor-pointer font-semibold">Forgot password?</span>
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl">{error}</p>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-secondary hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 mt-2"
        >
          {loading
            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <><LogIn size={17} /> Sign In</>
          }
        </motion.button>
      </form>
    </motion.div>
  );
};

const portals = [
  { key: 'student', icon: UserCircle, title: 'Student & Parent', desc: 'Access academic records, attendance, assignments, and results.', href: 'https://portal.peterharvardschools.com' },
  { key: 'admin', icon: ShieldCheck, title: 'Admin & Staff', desc: 'Manage school operations, student data, and staff information.', href: '/login' },
];

const Portal = () => {
  const navigate = useNavigate();

  const handlePortalClick = (portal) => {
    if (portal.key === 'admin') {
      navigate('/login');
    } else {
      window.open(portal.href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="pt-20 min-h-screen flex">

      {/* Left — decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=70"
          alt="PHIS Portal"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/70 to-secondary/60" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <img src="/assets/Badge.jpg" alt="PHIS" className="w-12 h-12 rounded-xl object-cover shadow-lg" />
            <div>
              <p className="font-extrabold text-white text-lg leading-tight">Peter Harvard</p>
              <p className="text-white/60 text-xs uppercase tracking-widest">Int'l Schools</p>
            </div>
          </div>
          <div>
            <div className="w-12 h-1 bg-secondary rounded-full mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Your Gateway to<br />Academic Excellence
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Access your academic records, results, attendance, and school resources — all in one secure place.
            </p>
          </div>
          <div className="flex items-center gap-4 text-white/50 text-xs">
            <span className="flex items-center gap-1.5"><Lock size={11} className="text-green-400" /> SSL Secured</span>
            <span>·</span><span>2FA Protected</span>
            <span>·</span><span>Data Encrypted</span>
          </div>
        </div>
      </div>

      {/* Right — portal selection */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <img src="/assets/Badge.jpg" alt="PHIS" className="w-10 h-10 rounded-xl object-cover shadow" />
            <div>
              <p className="font-extrabold text-gray-900 dark:text-white text-base leading-tight">Peter Harvard Int'l Schools</p>
              <p className="text-gray-400 text-xs uppercase tracking-widest">Portal Access</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">Welcome Back</h1>
            <p className="text-sm text-gray-400">Select your portal to continue</p>
          </div>

          <div className="space-y-4">
            {portals.map(({ key, icon: Icon, title, desc }, i) => (
              <motion.button
                key={key}
                onClick={() => handlePortalClick(portals[i])}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-secondary/50 hover:shadow-lg transition-shadow text-left group"
              >
                <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
                </div>
                <ArrowRight size={18} className="text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all flex-shrink-0" />
              </motion.button>
            ))}
          </div>

          <p className="text-xs text-center text-gray-400 mt-8">
            Having trouble? Contact{' '}
            <a href="mailto:peterharvardschools@yahoo.com" className="text-secondary hover:underline font-semibold">peterharvardschools@yahoo.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Portal;
