import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: '🏠 Dashboard' },
  { to: '/notices', label: '📢 Notices' },
  { to: '/complaints', label: '🛠️ Complaints' },
  { to: '/visitors', label: '🚪 Visitors' },
  { to: '/bills', label: '🧾 Bills' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <aside className="bg-slate-900 text-white md:w-60 p-4 flex md:flex-col gap-2 overflow-x-auto">
        <div className="hidden md:block mb-6">
          <div className="text-3xl">🏢</div>
          <h1 className="text-lg font-bold">Society Portal</h1>
          <p className="text-xs text-slate-400">{user?.name} ({user?.role})</p>
        </div>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              'px-3 py-2 rounded-lg whitespace-nowrap ' +
              (isActive ? 'bg-blue-600' : 'hover:bg-slate-700')
            }
          >
            {l.label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="md:mt-auto px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 whitespace-nowrap"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}