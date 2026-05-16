import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Film, Calendar, LayoutDashboard } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  const sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Movie List', path: '/admin/movies', icon: <Film size={20} /> },
    { name: 'Add Movie', path: '/admin/add-movie', icon: <PlusCircle size={20} /> },
    { name: 'Show List', path: '/admin/shows', icon: <Calendar size={20} /> },
    { name: 'Add Show', path: '/admin/add-show', icon: <PlusCircle size={20} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 space-y-2">
        {sidebarLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              location.pathname === link.path
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                : 'text-slate-600 hover:bg-white hover:shadow-sm'
            }`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm min-h-[600px]"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;
