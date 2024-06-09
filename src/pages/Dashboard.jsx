// src/pages/Dashboard.jsx
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-10 text-white"> {/* Your main content goes here */} </div>
      </div>
    </div>
  );
};

export default Dashboard;
