import { motion } from 'framer-motion';
import { User, ShieldCheck, ArrowRight, Lock, UserCircle, Settings } from 'lucide-react';

const Portal = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-secondary rounded-3xl mx-auto flex items-center justify-center text-white mb-6 shadow-2xl"
          >
            <Lock size={40} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight"
          >
            School Portal Access
          </motion.h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Welcome to the PHIS digital ecosystem. Please select your login portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student/Parent Login */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -10 }}
            className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 text-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
              <UserCircle size={32} />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Student & Parent</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Access your academic records, attendance, assignments, and results.
            </p>
            <button className="w-full bg-gray-900 dark:bg-gray-800 hover:bg-secondary text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 group-hover:shadow-xl group-hover:shadow-red-500/20">
              <span>Student Login</span>
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <p className="mt-6 text-sm text-gray-500 hover:text-secondary cursor-pointer transition-colors">Forgot your credentials?</p>
          </motion.div>

          {/* Admin/Staff Login */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -10 }}
            className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 text-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Admin & Staff</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Manage school operations, student data, and staff information.
            </p>
            <button className="w-full bg-secondary hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-xl shadow-red-500/20">
              <span>Admin Login</span>
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <p className="mt-6 text-sm text-gray-500 hover:text-secondary cursor-pointer transition-colors flex items-center space-x-1">
              <Settings size={14} />
              <span>Staff Support Portal</span>
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center text-gray-500 dark:text-gray-500 text-sm"
        >
          <p>Security Warning: Always ensure you are on the official PHIS domain before entering your credentials.</p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <span className="flex items-center space-x-1">
              <Lock size={12} className="text-green-500" />
              <span>SSL Secured</span>
            </span>
            <span>&bull;</span>
            <span>2FA Protection</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Portal;
