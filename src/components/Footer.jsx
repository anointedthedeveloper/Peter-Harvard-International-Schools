import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 border-t dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="font-bold text-xl tracking-tighter text-secondary dark:text-white">
                PHIS
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Peter Harvard International Schools (PHIS) is dedicated to excellence in education, 
              providing a nurturing environment for students to thrive.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-secondary hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-secondary hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-secondary hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-secondary hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Gallery', 'Contact Us', 'Portal'].map((link) => (
                <li key={link}>
                  <Link
                    to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '')}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors inline-block relative group"
                  >
                    {link}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white uppercase tracking-wider">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-600 dark:text-gray-400">
                <MapPin className="text-secondary flex-shrink-0" size={18} />
                <span>123 PHIS Avenue, School District, City, Country</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <Phone className="text-secondary flex-shrink-0" size={18} />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <Mail className="text-secondary flex-shrink-0" size={18} />
                <span>info@phis.edu</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white uppercase tracking-wider">Newsletter</h3>
            <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">Subscribe to our newsletter for latest updates.</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded focus:outline-none focus:ring-1 focus:ring-secondary"
              />
              <button className="w-full bg-secondary hover:bg-red-700 text-white font-bold py-2 rounded transition-colors shadow-lg">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t dark:border-gray-800 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Peter Harvard International Schools (PHIS). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
