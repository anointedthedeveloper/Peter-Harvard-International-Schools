import { motion } from 'framer-motion';
import { Mail, Github, Instagram, MessageCircle, ExternalLink, Code2, Layers, Zap } from 'lucide-react';

const contacts = [
  {
    icon: Mail,
    label: 'Email',
    value: 'anointedthedeveloper@gmail.com',
    href: 'mailto:anointedthedeveloper@gmail.com',
    light: 'bg-red-50 text-red-500 border-red-100',
    dark: 'dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '08101209470',
    href: 'https://wa.me/2348101209470',
    light: 'bg-green-50 text-green-600 border-green-100',
    dark: 'dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '09016471351',
    href: 'https://wa.me/2349016471351',
    light: 'bg-green-50 text-green-600 border-green-100',
    dark: 'dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'anointedthedeveloper',
    href: 'https://github.com/anointedthedeveloper',
    light: 'bg-gray-100 text-gray-700 border-gray-200',
    dark: 'dark:bg-white/10 dark:text-white dark:border-white/10',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@anointedddeveloper',
    href: 'https://instagram.com/anointedddeveloper',
    light: 'bg-pink-50 text-pink-500 border-pink-100',
    dark: 'dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20',
  },
];

const skills = [
  { icon: Code2, label: 'React & JavaScript' },
  { icon: Layers, label: 'UI / UX Design' },
  { icon: Zap, label: 'Tailwind & Framer' },
];

const Developer = () => (
  <div className="h-screen pt-16 flex flex-col lg:flex-row overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

    {/* ── Left panel ── */}
    <div className="relative lg:w-5/12 flex flex-col justify-between px-8 py-10 lg:px-12 lg:py-14 bg-white dark:bg-gray-900 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-white/5 overflow-hidden transition-colors duration-300">

      {/* Glow blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-secondary/10 dark:bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-400/5 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/25 text-secondary text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          Available for work
        </motion.div>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary via-red-600 to-red-800 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-red-500/20 mb-6"
        >
          AA
        </motion.div>

        {/* Name & title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            Anointed<br />Agunloye
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">
            Full-Stack Developer &amp; UI/UX Designer
          </p>
        </motion.div>
      </div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="relative z-10 space-y-3 my-6 lg:my-0"
      >
        {skills.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center flex-shrink-0">
              <Icon size={15} className="text-secondary" />
            </div>
            {label}
          </div>
        ))}
      </motion.div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 pt-6 border-t border-gray-100 dark:border-white/5"
      >
        <p className="text-xs text-gray-400 dark:text-gray-600">
          Designed &amp; built for{' '}
          <span className="text-gray-600 dark:text-gray-400 font-semibold">Peter Harvard Int'l Schools</span>
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-700 mt-1">
          Powered by{' '}
          <a href="https://anobyte.online" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-semibold">
            Anobyte
          </a>
        </p>
      </motion.div>
    </div>

    {/* ── Right panel ── */}
    <div className="lg:w-7/12 flex flex-col justify-center px-8 py-10 lg:px-14 lg:py-14 overflow-y-auto">

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">Get in touch</h2>
        <p className="text-gray-400 dark:text-gray-500 text-sm">Reach out via any of the channels below.</p>
      </motion.div>

      <div className="space-y-3">
        {contacts.map((c, i) => (
          <motion.a
            key={i}
            href={c.href}
            target={c.href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35, ease: 'easeOut' }}
            whileHover={{ x: 5, transition: { type: 'spring', stiffness: 400, damping: 22 } }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 hover:border-secondary/40 hover:shadow-md dark:hover:bg-white/8 transition-all group"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${c.light} ${c.dark}`}>
              <c.icon size={19} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">{c.label}</p>
              <p className="text-gray-900 dark:text-white font-semibold text-sm truncate">{c.value}</p>
            </div>
            <ExternalLink size={15} className="text-gray-300 dark:text-gray-600 group-hover:text-secondary transition-colors flex-shrink-0" />
          </motion.a>
        ))}
      </div>

      {/* Skill chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="flex flex-wrap gap-2 mt-8"
      >
        {['React', 'Tailwind CSS', 'Node.js', 'JavaScript', 'Framer Motion', 'UI/UX'].map(s => (
          <span key={s} className="px-3 py-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-400">
            {s}
          </span>
        ))}
      </motion.div>
    </div>

  </div>
);

export default Developer;
