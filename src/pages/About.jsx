import { motion } from 'framer-motion';
import { Target, Eye, ShieldCheck, Heart } from 'lucide-react';

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="pt-20">
      {/* Header Section */}
      <section className="bg-secondary py-24 text-white text-center px-4 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Our School</h1>
          <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-xl max-w-3xl mx-auto opacity-90 leading-relaxed font-medium">
            Building a legacy of academic excellence and character since 2000.
          </p>
        </motion.div>
        
        {/* Background Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      {/* History Section */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div {...fadeIn} className="lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80"
                alt="School History"
                className="rounded-3xl shadow-2xl border-8 border-gray-50 dark:border-gray-800"
              />
            </motion.div>
            
            <motion.div {...fadeIn} className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white border-l-4 border-secondary pl-4">Our History</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Founded with a vision to revolutionize the educational landscape in our community, 
                Peter Harvard International Schools (PHIS) began as a small initiative with just 50 students. 
                Over the past two decades, we have grown into one of the most respected academic institutions 
                in the region.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Our journey has been defined by a relentless pursuit of excellence, a commitment 
                to student-centered learning, and the continuous integration of global best practices 
                into our curriculum.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              {...fadeIn}
              className="bg-white dark:bg-gray-900 p-12 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 text-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Target size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                To provide an inclusive, stimulating, and technologically advanced learning environment 
                where students are empowered to develop their intellectual, emotional, and social capacities.
              </p>
            </motion.div>

            <motion.div
              {...fadeIn}
              className="bg-white dark:bg-gray-900 p-12 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 text-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Eye size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Vision</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                To be a world-class center of academic excellence, producing globally competitive leaders 
                who are equipped to solve the challenges of the 21st century.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Core Values</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              These principles guide everything we do at Peter Harvard International Schools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Integrity", desc: "Honesty and ethical behavior in all our interactions." },
              { icon: Heart, title: "Compassion", desc: "Fostering empathy and kindness within our community." },
              { icon: Target, title: "Excellence", desc: "Striving for the highest standards in academics and character." },
              { icon: Users, title: "Collaboration", desc: "Working together as a community of learners and educators." },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                {...fadeIn}
                className="bg-gray-50 dark:bg-gray-800 p-10 rounded-2xl text-center group border border-transparent hover:border-secondary/30 transition-all"
              >
                <div className="w-14 h-14 bg-white dark:bg-gray-900 text-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:bg-secondary group-hover:text-white transition-all">
                  <value.icon size={28} />
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{value.title}</h4>
                <p className="text-gray-600 dark:text-gray-400">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team/Leadership Placeholder */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Leadership</h2>
            <p className="text-gray-600 dark:text-gray-400">The visionaries behind our school's success.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { name: "Dr. Elizabeth Harvard", role: "School Proprietress", img: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80" },
              { name: "Mr. Peter Johnson", role: "Principal", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80" },
              { name: "Mrs. Sarah Smith", role: "Head of Academics", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80" },
            ].map((member, idx) => (
              <motion.div
                key={idx}
                {...fadeIn}
                className="group flex flex-col items-center"
              >
                <div className="w-64 h-80 overflow-hidden rounded-2xl mb-6 shadow-xl relative">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{member.name}</h4>
                <p className="text-secondary font-semibold uppercase text-sm tracking-widest mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Simple Users icon mock since I didn't import it
const Users = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

export default About;
