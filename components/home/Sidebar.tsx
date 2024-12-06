import { FaProjectDiagram, FaUsers, FaBell } from 'react-icons/fa';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <div className="h-screen w-64 bg-blue-700 text-white flex flex-col overflow-hidden">
      <div className="text-2xl font-bold p-6">
        <Link href="/">G.Stream</Link>
      </div>
      <nav className="flex flex-col space-y-4 p-6">
        {/* Dashboard */}
        <Link href="/dashboard" className="flex items-center space-x-3 hover:bg-blue-600 p-2 rounded-lg transition duration-300">
            <FaBell size={20} />
            <span>Dashboard</span>
        </Link>

        {/* Projects */}
        <Link href="/dashboard/projects" className="flex items-center space-x-3 hover:bg-blue-600 p-2 rounded-lg transition duration-300">
            <FaProjectDiagram size={20} />
            <span>Projects</span>
        </Link>

        {/* Users */}
        <Link href="/dashboard/users" className="flex items-center space-x-3 hover:bg-blue-600 p-2 rounded-lg transition duration-300">
            <FaUsers size={20} />
            <span>Users</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
