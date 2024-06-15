// src/components/common/Layout.jsx
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const location = useLocation();

  // Determine if the current route is the Dashboard
  const isDashboard = location.pathname === '/';

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Conditionally render the Header based on the current path */}
        {!isDashboard && <Header />}
        <main className="flex-1 overflow-auto bg-gray-900 text-white">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
