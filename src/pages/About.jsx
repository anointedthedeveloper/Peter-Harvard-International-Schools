import { motion } from 'framer-motion';
import { Target, Eye, ShieldCheck, Heart, Users, Phone, Linkedin, MessageCircle } from 'lucide-react';

const FOUNDED = 2017;
const yearsRunning = new Date().getFullYear() - FOUNDED;

const fadeIn = {
  initial: { opacity: 0, y: 22 },
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

const About = () => {
  return (
    <div className="pt-20">

      {/* ── Hero Cover ── */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=70"
          alt="About PHIS"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-secondary/80" />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative z-10 text-center text-white px-4"
        >
          <p className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-6">
            Est. {FOUNDED} · Kubwa, Abuja
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-5">About Our School</h1>
          <div className="w-20 h-1 bg-secondary mx-auto mb-6 rounded-full" />
          <p className="text-lg max-w-2xl mx-auto opacity-85 leading-relaxed">
            A beacon of academic excellence and character development since {FOUNDED}.
          </p>
        </motion.div>
      </section>

      {/* ── School Overview ── */}
      <section className="py-20 md:py-28 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:w-1/2 w-full"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=70"
                  alt="School"
                  loading="lazy"
                  className="rounded-3xl shadow-2xl border-8 border-gray-50 dark:border-gray-800 w-full"
                />
                <div className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700">
                  <img src="/assets/Badge.jpg" alt="PHIS Badge" className="w-24 h-24 object-contain rounded-xl" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:w-1/2 space-y-5 lg:pl-4"
            >
              <p className="text-secondary text-xs font-bold uppercase tracking-widest">Our Story</p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white border-l-4 border-secondary pl-4">
                Peter Harvard INT'L School
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Founded in {FOUNDED} by Dr. Peter Oyedotun Agunloye, Peter Harvard INT'L School has been a beacon
                of academic excellence and character development for {yearsRunning} years. The school has produced
                graduates who have gone on to make significant contributions across various fields.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Rooted in a commitment to holistic development, we combine rigorous academics with strong moral
                values — preparing every student to thrive in an interconnected world.
              </p>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                {[
                  { value: `${FOUNDED}`, label: 'Founded' },
                  { value: `${yearsRunning}+`, label: 'Years Running' },
                  { value: '98%', label: 'Pass Rate' },
                ].map(({ value, label }) => (
                  <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-extrabold text-secondary">{value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Founder Profile ── */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center mb-14">
            <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-3">Leadership</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Meet the Founder</h2>
            <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
            {/* Photo + contact */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:w-2/5 w-full flex flex-col items-center lg:items-start"
            >
              <div className="relative w-full max-w-sm mx-auto lg:mx-0">
                <div className="aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src="/assets/Drpeter.png"
                    alt="Dr. Peter Oyedotun Agunloye"
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Credential badges */}
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-2 flex-wrap justify-center px-4">
                  {credentials.map(c => (
                    <span key={c} className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-red-500/20">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mt-12 w-full max-w-sm mx-auto lg:mx-0">
                <motion.a
                  href="tel:+2348033570685"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2.5 bg-secondary hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg shadow-red-500/20 text-sm"
                >
                  <Phone size={17} /> Call Directly
                </motion.a>
                <motion.a
                  href="https://wa.me/2348033570685"
                  target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg shadow-green-500/20 text-sm"
                >
                  <MessageCircle size={17} /> WhatsApp
                </motion.a>
                <motion.a
                  href="https://ng.linkedin.com/in/dr-peter-oyedotun-agunloye"
                  target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2.5 bg-[#0A66C2] hover:bg-[#0958a8] text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg text-sm"
                >
                  <Linkedin size={17} /> LinkedIn
                </motion.a>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:w-3/5 space-y-6"
            >
              <div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  Dr. Peter Oyedotun Agunloye
                </h3>
                <p className="text-secondary font-bold uppercase text-sm tracking-widest mt-2">
                  Founder &amp; Proprietor, Peter Harvard INT'L School
                </p>
              </div>

              {/* Credential chips inline */}
              <div className="flex flex-wrap gap-2">
                {credentials.map(c => (
                  <span key={c} className="bg-red-50 dark:bg-red-900/20 text-secondary border border-secondary/20 text-xs font-bold px-3 py-1 rounded-full">
                    {c}
                  </span>
                ))}
              </div>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                A distinguished economist, chartered accountant, stockbroker, and forensic expert,
                Dr. Peter Oyedotun Agunloye founded Peter Harvard INT'L School in {FOUNDED} with a vision
                to raise a generation of excellence. His career spans finance, capital markets, and forensic
                accounting — and his passion for education drives the school's commitment to holistic development.
              </p>

              {/* Expertise tags */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Areas of Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {['Economics', 'Chartered Accounting', 'Capital Markets', 'Forensic Accounting', 'Stockbroking', 'Education Leadership'].map(tag => (
                    <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <blockquote className="border-l-4 border-secondary pl-5 py-1">
                <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  "My vision is simple — to raise a generation that is not just academically sound, but morally
                  grounded and globally competitive."
                </p>
                <footer className="text-secondary font-bold text-sm mt-2">— Dr. Peter Oyedotun Agunloye</footer>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-20 md:py-28 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center mb-14">
            <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-3">What Drives Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Mission &amp; Vision</h2>
            <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Target, title: 'Our Mission', text: 'To provide an inclusive, stimulating, and technologically advanced learning environment where students are empowered to develop their intellectual, emotional, and social capacities.' },
              { icon: Eye, title: 'Our Vision', text: 'To be a world-class center of academic excellence, producing globally competitive leaders who are equipped to solve the challenges of the 21st century.' },
            ].map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
                whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="bg-gray-50 dark:bg-gray-800 p-10 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center group cursor-default"
              >
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 text-secondary rounded-2xl flex items-center justify-center mb-7 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  <Icon size={30} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center mb-14">
            <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-3">What We Stand For</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Core Values</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm">
              These principles guide everything we do at Peter Harvard INT'L School.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: idx * 0.08, duration: 0.45, ease: 'easeOut' }}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center group border border-gray-100 dark:border-gray-800 hover:border-secondary/30 hover:shadow-lg transition-shadow cursor-default"
              >
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 text-secondary rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  <value.icon size={24} />
                </div>
                <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{value.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
