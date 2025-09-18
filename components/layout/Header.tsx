
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { SunIcon, MoonIcon, UserCircleIcon, ArrowRightOnRectangleIcon, Bars3Icon } from '@heroicons/react/24/outline';

interface HeaderProps {
    setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="relative bg-white dark:bg-gray-800 shadow-sm z-20">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 -mb-px">
                    <div className="flex">
                        <button
                            className="text-gray-500 hover:text-gray-600 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                        </button>
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                <UserCircleIcon className="h-8 w-8" />
                            </button>
                            {dropdownOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-600">
                                        <p className="font-semibold">{user?.name}</p>
                                        <p className="text-xs truncate">{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
