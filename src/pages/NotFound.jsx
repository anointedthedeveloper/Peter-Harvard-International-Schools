import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <div className="text-center max-w-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Big 404 */}
        <div className="relative mb-6 select-none">
          <p className="text-[10rem] font-extrabold text-gray-100 dark:text-gray-800 leading-none tracking-tighter">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/assets/Badge.jpg" alt="PHIS" className="w-20 h-20 rounded-2xl object-cover shadow-2xl" />
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3"
        >
          Page Not Found
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed"
        >
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            to="/"
            className="flex items-center gap-2 bg-secondary hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold text-sm transition-colors shadow-lg shadow-red-500/20"
          >
            <Home size={16} /> Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-full font-bold text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </motion.div>
      </motion.div>
    </div>
  </div>
);

export default NotFound;
