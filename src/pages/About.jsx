import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Eye, ShieldCheck, Heart, Users, Phone, MessageCircle, ChevronRight, Award, BookOpen, Globe } from 'lucide-react';

const FOUNDED = 2017;
const yearsRunning = new Date().getFullYear() - FOUNDED;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const values = [
  { icon: ShieldCheck, title: 'Integrity', desc: 'Honesty and ethical behavior in all our interactions.' },
  { icon: Heart, title: 'Compassion', desc: 'Fostering empathy and kindness within our community.' },
  { icon: Target, title: 'Excellence', desc: 'Striving for the highest standards in academics and character.' },
  { icon: Users, title: 'Collaboration', desc: 'Working together as a community of learners and educators.' },
];

const credentials = ['FCA', 'FCIT', 'ACS', 'DBA', 'Ph.D', 'M.Sc'];

const milestones = [
  { icon: Award, value: `${FOUNDED}`, label: 'Founded' },
  { icon: BookOpen, value: `${yearsRunning}+`, label: 'Years Running' },
  { icon: Users, value: '2,000+', label: 'Alumni & Students' },
  { icon: Globe, value: '98%', label: 'Pass Rate' },
];

const About = () => {
  return (
    <div className="overflow-x-hidden bg-white dark:bg-gray-950">

      {/* ── Hero Cover ── */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden pt-24">
        <img
          src="/assets/aboutus/image2.png"
          alt="About PHIS"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative z-10 text-center text-white px-4"
        >
          <p className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-[0.25em] px-5 py-2 rounded-full inline-block mb-6">
            Est. {FOUNDED} · Kubwa, Abuja
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-5 leading-[1.1]">About Our School</h1>
          <div className="w-20 h-1 bg-secondary mx-auto mb-6 rounded-full" />
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-85 leading-relaxed font-medium">
            A beacon of academic excellence and character development since {FOUNDED}.
          </p>
        </motion.div>
      </section>

      {/* ── School Overview ── */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:w-1/2 w-full"
            >
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                >
                  <img
                    src="/assets/aboutus/image1.png"
                    alt="School"
                    loading="lazy"
                    className="rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] w-full border border-gray-100 dark:border-gray-800"
                  />
                  <div className="absolute -bottom-8 -right-8 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 hidden sm:block">
                    <p className="text-5xl font-black text-secondary">{yearsRunning}<span className="text-2xl">+</span></p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Years of Academic<br />Excellence</p>
                  </div>
                </motion.div>
                <div className="absolute -top-6 -left-6 grid grid-cols-6 gap-2 opacity-20 dark:opacity-40">
                  {[...Array(24)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  ))}
                </div>
                <div className="absolute -bottom-5 left-6 bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 sm:hidden">
                  <img src="/assets/Badge.jpg" alt="PHIS Badge" className="w-16 h-16 object-contain rounded-xl" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:w-1/2 space-y-8"
            >
              <div className="space-y-4">
                <span className="text-secondary text-xs font-bold uppercase tracking-[0.25em] block">Our Story</span>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-[1.15] tracking-tight">
                  Peter Harvard <span className="text-secondary">INT'L School</span>
                </h2>
              </div>
              <div className="space-y-5">
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  Founded in {FOUNDED} by Dr. Peter Oyedotun Agunloye, Peter Harvard INT'L School has been a beacon
                  of academic excellence and character development for {yearsRunning} years.
                </p>
                <p className="text-gray-500 dark:text-gray-500 leading-relaxed">
                  Rooted in a commitment to holistic development, we combine rigorous academics with strong moral
                  values — preparing every student to thrive in an interconnected world.
                </p>
              </div>
              <motion.div whileHover={{ x: 6 }} transition={{ type: 'spring', stiffness: 400 }}>
                <Link to="/admission" className="inline-flex items-center gap-3 bg-gray-50 dark:bg-gray-900 hover:bg-secondary hover:text-white dark:hover:bg-secondary text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-bold transition-all border border-gray-200 dark:border-gray-800 hover:border-secondary shadow-sm">
                  Apply for Admission <ChevronRight size={20} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Milestones Strip ── */}
      <section className="py-24 md:py-32 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-secondary to-red-800" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
            {milestones.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center px-4 group"
              >
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors">
                  <Icon size={26} className="text-white" />
                </div>
                <p className="text-4xl md:text-5xl font-black text-white tabular-nums tracking-tighter group-hover:scale-110 transition-transform duration-500">{value}</p>
                <div className="w-8 h-1 bg-white/30 mx-auto my-3 rounded-full group-hover:w-12 transition-all duration-500" />
                <p className="text-white/80 text-xs font-bold uppercase tracking-[0.2em]">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder Profile ── */}
      <section className="py-24 md:py-32 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-secondary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Leadership</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Meet the Founder</h2>
            <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
            {/* Photo + contact */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:w-2/5 w-full flex flex-col items-center lg:items-start"
            >
              <div className="relative w-full max-w-sm mx-auto lg:mx-0">
                <div className="aspect-[3/4] overflow-hidden rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)]">
                  <img
                    src="/assets/Drpeter.png"
                    alt="Dr. Peter Oyedotun Agunloye"
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-2 flex-wrap justify-center px-4">
                  {credentials.map(c => (
                    <span key={c} className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-red-500/20">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mt-12 w-full max-w-sm mx-auto lg:mx-0">
                <motion.a
                  href="tel:+2348033570685"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2.5 bg-secondary hover:bg-red-700 text-white font-bold py-4 px-6 rounded-2xl transition-colors shadow-lg shadow-red-500/20 text-sm"
                >
                  <Phone size={17} /> Call Directly
                </motion.a>
                <motion.a
                  href="https://wa.me/2348033570685"
                  target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl transition-colors shadow-lg shadow-green-500/20 text-sm"
                >
                  <MessageCircle size={17} /> WhatsApp
                </motion.a>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:w-3/5 space-y-6"
            >
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                  Dr. Peter Oyedotun Agunloye
                </h3>
                <p className="text-secondary font-bold uppercase text-sm tracking-widest mt-2">
                  Founder &amp; Proprietor, Peter Harvard INT'L School
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {credentials.map(c => (
                  <span key={c} className="bg-red-50 dark:bg-red-900/20 text-secondary border border-secondary/20 text-xs font-bold px-3 py-1 rounded-full">
                    {c}
                  </span>
                ))}
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                A distinguished economist, chartered accountant, stockbroker, and forensic expert,
                Dr. Peter Oyedotun Agunloye founded Peter Harvard INT'L School in {FOUNDED} with a vision
                to raise a generation of excellence. His career spans finance, capital markets, and forensic
                accounting — and his passion for education drives the school's commitment to holistic development.
              </p>

              <blockquote className="border-l-4 border-secondary pl-5 py-1">
                <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed text-lg">
                  "My vision is simple — to raise a generation that is not just academically sound, but morally
                  grounded and globally competitive."
                </p>
                <footer className="text-secondary font-bold text-sm mt-3">— Dr. Peter Oyedotun Agunloye</footer>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-secondary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">What Drives Us</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Mission &amp; Vision</h2>
            <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Target, title: 'Our Mission', text: 'To provide an inclusive, stimulating, and technologically advanced learning environment where students are empowered to develop their intellectual, emotional, and social capacities.' },
              { icon: Eye, title: 'Our Vision', text: 'To be a world-class center of academic excellence, producing globally competitive leaders who are equipped to solve the challenges of the 21st century.' },
            ].map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
                whileHover={{ y: -10, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="bg-gray-50 dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all border border-gray-100 dark:border-gray-800 hover:border-secondary/30 flex flex-col items-center text-center group cursor-default"
              >
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-secondary rounded-[1.25rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-lg shadow-red-500/5">
                  <Icon size={30} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white tracking-tight">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="py-24 md:py-32 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-secondary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">What We Stand For</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Core Values</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              These principles guide everything we do at Peter Harvard INT'L School.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: 'easeOut' }}
                whileHover={{ y: -10, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="group relative bg-white dark:bg-gray-950 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 hover:border-secondary/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-default overflow-hidden text-center"
              >
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-secondary rounded-[1.25rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-lg shadow-red-500/5">
                    <value.icon size={28} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-xl font-black mb-3 text-gray-900 dark:text-white group-hover:text-secondary transition-colors">{value.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Team ── */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-secondary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">The People Behind PHIS</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Our Team</h2>
            <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Founder card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="group flex flex-col items-center text-center cursor-default"
            >
              <div className="w-full aspect-[3/4] overflow-hidden rounded-[2rem] mb-4 shadow-xl relative">
                <img
                  src="/assets/Drpeter.png"
                  alt="Dr. Peter Oyedotun Agunloye"
                  loading="lazy"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h4 className="font-black text-gray-900 dark:text-white text-sm">Dr. Peter Oyedotun Agunloye</h4>
              <p className="text-secondary text-xs font-bold uppercase tracking-widest mt-1">Founder &amp; Proprietor</p>
              <div className="flex gap-1.5 mt-2 flex-wrap justify-center">
                {['FCA', 'Ph.D'].map(c => (
                  <span key={c} className="text-xs bg-red-50 dark:bg-red-900/20 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full font-bold">{c}</span>
                ))}
              </div>
            </motion.div>

            {/* Blank slots */}
            {[1, 2, 3].map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: (idx + 1) * 0.08, duration: 0.5, ease: 'easeOut' }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-full aspect-[3/4] rounded-[2rem] mb-4 shadow-sm bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Users size={24} className="text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-xs text-gray-300 dark:text-gray-600 font-semibold">Coming Soon</p>
                </div>
                <h4 className="font-bold text-gray-300 dark:text-gray-600 text-sm">Team Member</h4>
                <p className="text-gray-300 dark:text-gray-600 text-xs font-semibold uppercase tracking-widest mt-1">Role — TBA</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="bg-secondary p-12 md:p-20 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(220,38,38,0.3)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-white/15 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full -ml-48 -mb-48 blur-3xl" />

            <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center text-white relative z-10">
              <span className="text-white/80 text-xs font-bold uppercase tracking-[0.4em] mb-6 block">Admissions Open</span>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight">
                Ready to be part of <br /><span className="underline decoration-white/30 underline-offset-8">the PHIS family?</span>
              </h2>
              <p className="text-lg md:text-xl mb-12 text-white/90 font-medium leading-relaxed max-w-2xl mx-auto">
                Discover a community where your child's potential is nurtured and their future is built on a foundation of excellence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/admission" className="bg-white text-secondary hover:bg-gray-100 px-12 py-5 rounded-2xl text-lg font-black transition-all shadow-2xl block">
                    Apply for Admission
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/contact" className="bg-transparent text-white border-2 border-white/30 hover:bg-white/10 px-12 py-5 rounded-2xl text-lg font-black transition-all block">
                    Contact Registrar
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
