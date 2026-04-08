import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';

const contactItems = [
  { icon: MapPin, title: 'Our Location', content: 'No 1/2 Dr Peter Agunloye Dr, Kubwa, Abuja 901101, FCT' },
  { icon: Phone, title: 'Phone Numbers', content: '08182277020 · 08033570685 · 08062134991' },
  { icon: Mail, title: 'Email Address', content: 'info@phis.edu' },
  { icon: Clock, title: 'School Hours', content: 'Mon - Fri: 7:00 AM - 5:00 PM' },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const inputClass = 'w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary transition-all dark:text-white text-sm';

  return (
    <div className="pt-20">

      {/* Hero Cover */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=70"
          alt="Contact PHIS"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-secondary/80" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-6"
          >
            Reach Out
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-5"
          >
            Get In Touch
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="w-20 h-1 bg-secondary mx-auto mb-6 rounded-full"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-lg opacity-85"
          >
            Have questions? We're here to help you every step of the way.
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 md:py-28 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="lg:w-1/3 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Contact Information</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Feel free to reach out during our school hours. We look forward to hearing from you.
                </p>
              </div>

              <div className="space-y-4">
                {contactItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: idx * 0.07, duration: 0.4, ease: 'easeOut' }}
                    whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group cursor-default"
                  >
                    <div className="w-11 h-11 bg-white dark:bg-gray-900 text-secondary rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{item.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="lg:w-2/3 bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full py-16 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-5 text-3xl">✓</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400">Thank you for reaching out. We'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Full Name</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Email Address</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" className={inputClass} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Subject</label>
                    <input type="text" name="subject" required value={formData.subject} onChange={handleChange} placeholder="Inquiry about admissions" className={inputClass} />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Message</label>
                    <textarea name="message" required rows="6" value={formData.message} onChange={handleChange} placeholder="Write your message here..." className={`${inputClass} resize-none`} />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-secondary hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 group"
                  >
                    Send Message
                    <Send size={17} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-[450px] w-full">
        <iframe
          title="PHIS Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d634.678531031748!2d7.332127200601352!3d9.15707472915974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104dd9823d2417f7%3A0x983d3ab23afc4691!2sPeter%20Harvard%20Int&#39;l%20Sch!5e0!3m2!1sen!2sng!4v1775657823399!5m2!1sen!2sng"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

    </div>
  );
};

export default Contact;
