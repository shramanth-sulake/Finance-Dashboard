import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { removeAuthToken } from '../services/api';
import { LayoutDashboard, Receipt, LogOut } from 'lucide-react';
import './Layout.css';

interface LayoutProps {
  setAuth: (val: boolean) => void;
}

export default function Layout({ setAuth }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuthToken();
    setAuth(false);
    navigate('/login');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="text-gradient">Zorvyn Fin</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/records" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Receipt size={20} /> Records
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
