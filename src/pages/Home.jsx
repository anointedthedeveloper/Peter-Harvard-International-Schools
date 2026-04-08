import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Users, BookOpen, Globe } from 'lucide-react';

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://peterharvardschools.com/wp-content/uploads/2025/07/20250715_152546_0000.png"
            alt="School Campus"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              Peter Harvard <br />
              <span className="text-secondary">International Schools</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-200">
              Nurturing Excellence, Inspiring Innovation, and Building Global Leaders for Tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-secondary hover:bg-red-700 text-white px-10 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2"
              >
                Apply Now <ChevronRight size={20} />
              </Link>
              <Link
                to="/portal"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full text-lg font-bold transition-all"
              >
                Visit Portal
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
            <div className="w-1 h-2 bg-secondary rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* About Preview */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1544391682-1717387ce370?auto=format&fit=crop&q=80"
                  alt="Students Studying"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-secondary text-white p-8 rounded-2xl shadow-xl hidden sm:block">
                  <p className="text-4xl font-bold">25+</p>
                  <p className="text-sm font-medium">Years of Excellence</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-6"
            >
              <h2 className="text-secondary font-bold tracking-widest uppercase text-sm">Our Philosophy</h2>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Where Academic Rigor Meets Global Citizenship.
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                At PHIS, we believe every child has the potential to become a leader. Our curriculum is designed 
                to challenge minds, inspire curiosity, and foster a deep sense of social responsibility.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center text-secondary font-bold hover:gap-3 transition-all"
              >
                Learn more about our mission <ChevronRight size={20} className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Why PHIS?</h2>
            <div className="w-20 h-1 bg-secondary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, title: "Premium Curriculum", desc: "International standard curriculum focused on holistic development." },
              { icon: Users, title: "Expert Educators", desc: "Highly qualified teachers dedicated to student success." },
              { icon: Award, title: "Modern Facilities", desc: "State-of-the-art labs, libraries, and sports complexes." },
              { icon: Globe, title: "Global Mindset", desc: "Preparing students for success in an interconnected world." },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 hover:border-secondary transition-all group"
              >
                <div className="w-14 h-14 bg-red-50 dark:bg-red-900/30 text-secondary rounded-xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-all">
                  <feature.icon size={28} />
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Campus Life</h2>
              <p className="text-gray-600 dark:text-gray-400">Experience the vibrant life at Peter Harvard.</p>
            </div>
            <Link to="/gallery" className="text-secondary font-bold hidden sm:block">View All Gallery</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[500px]">
            <div className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl group">
              <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80" alt="Students" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold text-lg">Academics</span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl group">
              <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80" alt="Sports" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="relative overflow-hidden rounded-2xl group">
              <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80" alt="Lab" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="col-span-2 relative overflow-hidden rounded-2xl group">
              <img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80" alt="Library" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-5xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to join the PHIS family?</h2>
          <p className="text-xl mb-10 opacity-90">Enrollment is currently open for the upcoming academic session.</p>
          <Link
            to="/contact"
            className="bg-white text-secondary hover:bg-gray-100 px-12 py-4 rounded-full text-lg font-bold transition-all shadow-xl inline-block"
          >
            Start Admission Process
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
