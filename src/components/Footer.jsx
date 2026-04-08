import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

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
                <p className="text-xs text-gray-400 uppercase tracking-widest">Int'l Schools</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Peter Harvard International Schools (PHIS) is dedicated to excellence in education,
              providing a nurturing environment for students to thrive.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
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
                { label: 'Contact Us', path: '/contact' },
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
                <span>info@phis.edu</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-bold mb-5 text-gray-900 dark:text-white uppercase tracking-widest">Newsletter</h3>
            <p className="text-sm mb-4 text-gray-500 dark:text-gray-400">Subscribe for latest updates and news.</p>
            <form className="space-y-2" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary dark:text-white transition-all"
              />
              <button className="w-full bg-secondary hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition-colors text-sm shadow-md shadow-red-500/20">
                Subscribe
              </button>
            </form>
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
