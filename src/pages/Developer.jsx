import { motion } from 'framer-motion';
import { Mail, Phone, Github, Instagram, MessageCircle, ExternalLink, Code2, Palette } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const Developer = () => {
  const contacts = [
    {
      icon: Mail,
      label: 'Email',
      value: 'anointedthedeveloper@gmail.com',
      href: 'mailto:anointedthedeveloper@gmail.com',
      color: 'bg-red-50 dark:bg-red-900/20 text-red-500',
    },
    {
      icon: Phone,
      label: 'Phone / WhatsApp',
      value: '08101209470',
      href: 'https://wa.me/2348101209470',
      color: 'bg-green-50 dark:bg-green-900/20 text-green-500',
      whatsapp: true,
    },
    {
      icon: Phone,
      label: 'Phone / WhatsApp',
      value: '09016471351',
      href: 'https://wa.me/2349016471351',
      color: 'bg-green-50 dark:bg-green-900/20 text-green-500',
      whatsapp: true,
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'github.com/anointedthedeveloper',
      href: 'https://github.com/anointedthedeveloper',
      color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: '@anointedddeveloper',
      href: 'https://instagram.com/anointedddeveloper',
      color: 'bg-pink-50 dark:bg-pink-900/20 text-pink-500',
    },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Hero */}
      <section className="relative py-24 bg-gray-900 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
            <Code2 size={13} /> Developer & Designer
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="w-28 h-28 rounded-3xl bg-gradient-to-br from-secondary to-red-700 mx-auto flex items-center justify-center text-white text-4xl font-extrabold shadow-2xl shadow-red-500/30 mb-8">
            AA
          </motion.div>
          <motion.h1 {...fadeUp(0.2)} className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
            Anointed Agunloye
          </motion.h1>
          <motion.p {...fadeUp(0.3)} className="text-gray-400 text-lg max-w-md mx-auto">
            Full-Stack Developer & UI/UX Designer — crafting fast, beautiful digital experiences.
          </motion.p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Skills chips */}
          <motion.div {...fadeUp(0)} className="flex flex-wrap justify-center gap-2 mb-14">
            {['React', 'Tailwind CSS', 'Node.js', 'UI/UX Design', 'JavaScript', 'Framer Motion'].map(skill => (
              <span key={skill} className="px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm">
                {skill}
              </span>
            ))}
          </motion.div>

          {/* Contact links */}
          <div className="space-y-4">
            {contacts.map((c, i) => (
              <motion.a
                key={i}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
                whileHover={{ x: 6, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-secondary/40 hover:shadow-md transition-shadow group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${c.color}`}>
                  {c.whatsapp ? <MessageCircle size={22} /> : <c.icon size={22} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{c.label}</p>
                  <p className="text-gray-900 dark:text-white font-semibold text-sm truncate">{c.value}</p>
                </div>
                <ExternalLink size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-secondary transition-colors flex-shrink-0" />
              </motion.a>
            ))}
          </div>

          {/* Built with love note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-14 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 shadow-sm">
              <Palette size={18} className="text-secondary" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Designed & built for{' '}
                <span className="font-bold text-gray-900 dark:text-white">Peter Harvard Int'l Schools</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Developer;
