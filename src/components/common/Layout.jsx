// src/components/common/Layout.jsx
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeaderAndSidebar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {!hideHeaderAndSidebar && <Sidebar />}
      <div className="flex-1 flex flex-col">
        {!hideHeaderAndSidebar && <Header />}
        <main className="flex-1 overflow-auto bg-gray-900 text-white">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
