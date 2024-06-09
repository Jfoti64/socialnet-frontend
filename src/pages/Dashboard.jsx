// src/pages/Dashboard.jsx
import Sidebar from '../components/common/Sidebar';

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10 text-white"></div>
    </div>
  );
};

export default Dashboard;
