import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const contactItems = [
  {
    icon: MapPin,
    title: 'Our Location',
    content: 'No 1/2 Dr Peter Agunloye Dr, Kubwa, Abuja 901101, FCT',
    href: 'https://maps.google.com/?q=Peter+Harvard+Int\'l+Sch+Kubwa+Abuja',
  },
  {
    icon: Phone,
    title: 'Phone Numbers',
    content: '08182277020 · 08033570685 · 08062134991',
    href: 'tel:+2348182277020',
  },
  {
    icon: Mail,
    title: 'Email Address',
    content: 'info@phis.edu',
    href: 'mailto:info@phis.edu',
  },
  {
    icon: Clock,
    title: 'School Hours',
    content: 'Mon – Fri: 7:00 AM – 5:00 PM',
    href: null,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('messages').insert({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const inputClass = 'w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary transition-all dark:text-white text-sm font-medium placeholder:text-gray-400';

  return (
    <div className="overflow-x-hidden bg-white dark:bg-gray-950">

      {/* ── Hero ── */}
      <section className="relative h-[55vh] sm:h-[65vh] flex items-center justify-center overflow-hidden pt-24">
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=70"
          alt="Contact PHIS"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/75" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative z-10 text-center text-white px-4"
        >
          <p className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-[0.25em] px-5 py-2 rounded-full inline-block mb-6">
            Reach Out
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight mb-5 leading-[1.1]">Get In Touch</h1>
          <div className="w-20 h-1 bg-secondary mx-auto mb-6 rounded-full" />
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-85 leading-relaxed font-medium">
            Have questions? We're here to help you every step of the way.
          </p>
        </motion.div>
      </section>

      {/* ── Contact Section ── */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

            {/* ── Info side ── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:w-2/5 space-y-8"
            >
              <div className="space-y-4">
                <span className="text-secondary text-xs font-bold uppercase tracking-[0.25em] block">Contact Information</span>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-[1.15] tracking-tight">
                  We'd love to <span className="text-secondary">hear from you.</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  Feel free to reach out during our school hours. Our team is always ready to assist you.
                </p>
              </div>

              <div className="space-y-4">
                {contactItems.map((item, idx) => {
                  const Wrapper = item.href ? motion.a : motion.div;
                  const wrapperProps = item.href ? { href: item.href, target: item.href.startsWith('http') ? '_blank' : undefined, rel: 'noopener noreferrer' } : {};
                  return (
                    <Wrapper
                      key={idx}
                      {...wrapperProps}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ delay: idx * 0.08, duration: 0.5, ease: 'easeOut' }}
                      whileHover={{ x: 6, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                      className="flex items-start gap-5 p-5 rounded-[1.5rem] bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-secondary/30 hover:shadow-lg transition-all duration-300 group cursor-default"
                    >
                      <div className="w-12 h-12 bg-white dark:bg-gray-800 text-secondary rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 dark:text-white text-sm tracking-tight">{item.title}</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium leading-relaxed">{item.content}</p>
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            </motion.div>

            {/* ── Form side ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:w-3/5 bg-white dark:bg-gray-900 p-6 sm:p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-800"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-[1.5rem] flex items-center justify-center mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium max-w-xs">
                    Thank you for reaching out. We'll get back to you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <span className="text-secondary text-xs font-bold uppercase tracking-[0.25em] block mb-2">Send a Message</span>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Fill out the form below</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Full Name</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" className={inputClass} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Email Address</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" className={inputClass} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Subject</label>
                    <input type="text" name="subject" required value={formData.subject} onChange={handleChange} placeholder="Inquiry about admissions" className={inputClass} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Message</label>
                    <textarea name="message" required rows="6" value={formData.message} onChange={handleChange} placeholder="Write your message here..." className={`${inputClass} resize-none`} />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-secondary hover:bg-red-700 text-white font-black py-5 rounded-2xl transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-3 group text-sm uppercase tracking-widest"
                  >
                    Send Message
                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Map ── */}
      <section className="py-24 md:py-32 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-secondary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Find Us</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Our Location</h2>
            <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-800 h-[480px]"
          >
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
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
