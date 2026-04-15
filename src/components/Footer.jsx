import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FooterNewsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('newsletter_subscribers').insert({ email: email.trim() });
    if (error) {
      setStatus(error.code === '23505' ? 'already' : 'error');
    } else {
      setStatus('success');
      setEmail('');
    }
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <input
        type="email" required value={email} onChange={e => setEmail(e.target.value)}
        placeholder="Your email address"
        className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary dark:text-white transition-all"
      />
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.85, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="w-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg py-2.5 flex items-center justify-center gap-2"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 15 }}
            >
              <CheckCircle size={16} className="text-green-600" />
            </motion.div>
            <span className="text-green-700 dark:text-green-400 text-sm font-bold">You're subscribed!</span>
          </motion.div>
        ) : (
          <motion.button
            key="btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            disabled={status === 'loading'}
            className="w-full bg-secondary hover:bg-red-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-lg transition-colors text-sm shadow-md shadow-red-500/20 flex items-center justify-center gap-2"
          >
            {status === 'loading' ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={13} /> Subscribe</>}
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {status === 'already' && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-yellow-600 text-xs font-semibold">Already subscribed.</motion.p>
        )}
        {status === 'error' && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-xs font-semibold">Something went wrong.</motion.p>
        )}
      </AnimatePresence>
    </form>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Logo & Info */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <img src="/assets/Badge.jpg" alt="PHIS" className="w-10 h-10 rounded-xl object-cover shadow" />
              <div className="leading-tight">
                <p className="font-extrabold text-secondary dark:text-white text-base">Peter Harvard</p>
                <p className="text-xs text-green-600 dark:text-green-500 font-semibold uppercase tracking-widest">International Schools</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Peter Harvard International Schools (PHIS) is dedicated to excellence in education,
              providing a nurturing environment for students to thrive.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: 'https://www.facebook.com/peterharvardschools/' },
                { icon: Instagram, href: 'https://www.instagram.com/peterharvard1/' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
              <a href="https://wa.me/2348062134991" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all duration-200">
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold mb-5 text-gray-900 dark:text-white uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Gallery', path: '/gallery' },
                { label: 'Blog', path: '/blog' },
                { label: 'Contact Us', path: '/contact' },
                { label: 'Apply Now', path: '/admission' },
                { label: 'Portal', path: '/portal' },
              ].map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-secondary transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-0.5 bg-secondary rounded-full transition-all duration-200 overflow-hidden" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-bold mb-5 text-gray-900 dark:text-white uppercase tracking-widest">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="text-secondary flex-shrink-0 mt-0.5" size={16} />
                <span>No 1/2 Dr Peter Agunloye Dr, Kubwa, Abuja 901101, FCT</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
                <Phone className="text-secondary flex-shrink-0 mt-0.5" size={16} />
                <span>08182277020<br />08033570685<br />08062134991</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <Mail className="text-secondary flex-shrink-0" size={16} />
                <a href="mailto:peterharvardschools@yahoo.com" className="hover:text-secondary transition-colors">peterharvardschools@yahoo.com</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-bold mb-5 text-gray-900 dark:text-white uppercase tracking-widest">Newsletter</h3>
            <p className="text-sm mb-4 text-gray-500 dark:text-gray-400">Subscribe for latest updates and news.</p>
            <FooterNewsletter />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <p>&copy; {new Date().getFullYear()} Peter Harvard International Schools. All rights reserved.</p>
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center">
              <span>
                Designed by{' '}
                <Link to="/developer" className="text-secondary hover:underline font-semibold">
                  Anointed Agunloye
                </Link>
              </span>
              <span className="hidden sm:inline text-gray-300 dark:text-gray-700">·</span>
              <span>
                Powered by{' '}
                <a href="https://anobyte.online" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-semibold">
                  Anobyte
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
