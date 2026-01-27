import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, LayoutDashboard, Bell, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Minhas Placas', path: '/devices', icon: LayoutDashboard },
        { name: 'Alertas', path: '/alerts', icon: Bell },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Sun className="h-8 w-8 text-yellow-600" />
                        <span className="text-xl font-bold text-gray-900">Lumina</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                            title="Sair"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
                <aside className="w-64 hidden md:block">
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                    location.pathname.startsWith(item.path)
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
