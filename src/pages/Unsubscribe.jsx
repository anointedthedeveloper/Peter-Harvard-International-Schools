import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState('loading'); // loading | success | invalid | error

  useEffect(() => {
    if (!token) { setStatus('invalid'); return; }

    const run = async () => {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('unsubscribe_token', token)
        .select('email');

      if (error) { setStatus('error'); return; }
      setStatus(data?.length ? 'success' : 'invalid');
    };

    run();
  }, [token]);

  const states = {
    loading: {
      icon: <Loader size={40} className="text-gray-400 animate-spin" />,
      title: 'Processing…',
      desc: 'Please wait while we update your preferences.',
      color: 'bg-gray-50',
    },
    success: {
      icon: <CheckCircle size={40} className="text-green-500" />,
      title: 'You\'ve been unsubscribed',
      desc: 'You will no longer receive newsletter emails from Peter Harvard International Schools. We\'re sorry to see you go.',
      color: 'bg-green-50',
    },
    invalid: {
      icon: <XCircle size={40} className="text-yellow-500" />,
      title: 'Link not found',
      desc: 'This unsubscribe link is invalid or has already been used.',
      color: 'bg-yellow-50',
    },
    error: {
      icon: <XCircle size={40} className="text-red-500" />,
      title: 'Something went wrong',
      desc: 'We could not process your request. Please try again or contact us directly.',
      color: 'bg-red-50',
    },
  };

  const s = states[status];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-10 max-w-md w-full text-center"
      >
        <div className={`w-20 h-20 ${s.color} dark:bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
          {s.icon}
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3">{s.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">{s.desc}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-secondary hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          Return to Website
        </Link>
      </motion.div>
    </div>
  );
};

export default Unsubscribe;
