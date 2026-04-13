import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, User } from 'lucide-react';
import { useAuth } from '../lib/auth';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (username !== 'admin') {
      setError('Invalid username or password.');
      return;
    }
    setLoading(true);
    const ok = await login(password);
    setLoading(false);
    if (ok) navigate('/dashboard');
    else setError('Invalid username or password.');
  };

  const inputClass = 'w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary text-sm transition-all';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl shadow-red-500/20 mb-5">
            <img src="/assets/Badge.jpg" alt="PHIS" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Admin Access</h1>
          <p className="text-gray-500 text-sm mt-1">Peter Harvard INT'L School</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              className={`${inputClass} pl-11`}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-secondary transition-colors"
            >
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-secondary hover:bg-red-700 disabled:opacity-60 text-white font-black py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
          >
            {loading
              ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><LogIn size={17} /> Sign In</>
            }
          </motion.button>
        </form>

        <p className="text-center text-xs text-gray-700 mt-8">
          This page is restricted. Unauthorised access is prohibited.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
