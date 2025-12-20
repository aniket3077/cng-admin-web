import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface LayoutProps {
    children: ReactNode;
    showNewStationButton?: boolean;
}

export default function Layout({ children, showNewStationButton }: LayoutProps) {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('ownerToken');
        localStorage.removeItem('ownerUser');
        localStorage.removeItem('userType');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-800 font-sans">
            <Sidebar onLogout={handleLogout} />

            <div className="flex-1 flex flex-col ml-72 transition-all duration-300">
                <TopBar
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    showNewStationButton={showNewStationButton}
                />

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 scroll-smooth relative">
                    {/* Background Gradients */}
                    <div className="fixed inset-0 pointer-events-none z-0">
                        <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-primary-100/50 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-lime-100/50 rounded-full blur-[100px]" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
