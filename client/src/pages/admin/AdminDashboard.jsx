import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Calendar, Users, BarChart3, TrendingUp, ShoppingBag } from 'lucide-react';
import { fadeIn, staggerContainer } from '../../animations/variants';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Movies', value: '24', icon: Film, color: 'bg-blue-500', trend: '+2 this week' },
    { label: 'Active Shows', value: '142', icon: Calendar, color: 'bg-emerald-500', trend: '+12% from last month' },
    { label: 'Total Users', value: '1.2k', icon: Users, color: 'bg-amber-500', trend: '+45 today' },
    { label: 'Revenue', value: '₹4.2L', icon: TrendingUp, color: 'bg-rose-500', trend: '+18% growth' },
  ];

  const quickActions = [
    { title: 'Add New Movie', desc: 'Add a blockbuster to your catalog', link: '/admin/movies/add', icon: Film },
    { title: 'Schedule Show', desc: 'Assign movies to show timings', link: '/admin/shows/add', icon: Calendar },
    { title: 'Manage Users', desc: 'Review and promote theater staff', link: '/admin/users', icon: Users },
    { title: 'View Reports', desc: 'Check ticket sales and revenue', link: '/admin', icon: BarChart3 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gray-900 rounded-[2.5rem] p-10 md:p-16 text-white shadow-2xl">
        <div className="relative z-10 space-y-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-black tracking-tight"
          >
            Cinema Command Center
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-xl font-medium"
          >
            Welcome back! Monitor your theater performance and manage your catalog from one central hub.
          </motion.p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeIn}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-50 flex items-center gap-2 text-xs font-bold text-emerald-600">
              <TrendingUp size={14} /> {stat.trend}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
          <ShoppingBag className="text-red-600" />
          Quick Operations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => (
            <Link 
              key={action.title}
              to={action.link} 
              className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-red-100 transition-all group flex items-center gap-6"
            >
              <div className="bg-gray-50 p-5 rounded-2xl group-hover:bg-red-50 transition-colors">
                <action.icon className="text-gray-400 group-hover:text-red-600 transition-colors" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">{action.title}</h3>
                <p className="text-gray-500 text-sm font-medium">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
