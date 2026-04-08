import { motion } from 'framer-motion';
import { Target, Eye, ShieldCheck, Heart, Users } from 'lucide-react';

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

const leaders = [
  { name: 'Dr. Elizabeth Harvard', role: 'School Proprietress', img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=70' },
  { name: 'Mr. Peter Johnson', role: 'Principal', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=70' },
  { name: 'Mrs. Sarah Smith', role: 'Head of Academics', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=70' },
];

const About = () => {
  return (
    <div className="pt-20">

      {/* Hero Cover */}
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
            Est. 2017 · Kubwa, Abuja
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-5">About Our School</h1>
          <div className="w-20 h-1 bg-secondary mx-auto mb-6 rounded-full" />
          <p className="text-lg max-w-2xl mx-auto opacity-85 leading-relaxed">
            Building a legacy of academic excellence and character since 2017.
          </p>
        </motion.div>
      </section>

      {/* History */}
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
                  alt="School History"
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
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white border-l-4 border-secondary pl-4">Our History</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Founded in 2017 with a vision to revolutionize the educational landscape in Kubwa, Abuja,
                Peter Harvard International Schools (PHIS) began as a small initiative with a passionate team
                and a handful of dedicated students.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                In just a few years, we have grown into one of the most respected academic institutions
                in the FCT — defined by a relentless pursuit of excellence, student-centered learning,
                and the continuous integration of global best practices into our curriculum.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group cursor-default"
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

      {/* Core Values */}
      <section className="py-20 md:py-28 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Core Values</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm">
              These principles guide everything we do at Peter Harvard International Schools.
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
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl text-center group border border-transparent hover:border-secondary/30 hover:shadow-lg transition-shadow cursor-default"
              >
                <div className="w-12 h-12 bg-white dark:bg-gray-900 text-secondary rounded-full flex items-center justify-center mx-auto mb-5 shadow-md group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  <value.icon size={24} />
                </div>
                <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{value.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Our Leadership</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">The visionaries behind our school's success.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {leaders.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: idx * 0.1, duration: 0.5, ease: 'easeOut' }}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="group flex flex-col items-center cursor-default"
              >
                <div className="w-56 h-72 overflow-hidden rounded-2xl mb-5 shadow-xl relative">
                  <img
                    src={member.img}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h4>
                <p className="text-secondary font-semibold uppercase text-xs tracking-widest mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
