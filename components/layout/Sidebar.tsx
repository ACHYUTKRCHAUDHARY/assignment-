
import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { ChartPieIcon, UsersIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const navigation = [
    { name: 'Dashboard', href: '/', icon: ChartPieIcon },
    { name: 'Customers', href: '/customers', icon: UsersIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
        isActive
            ? 'bg-primary-500 text-white'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`;
    
    const sidebarContent = (
         <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center h-16 flex-shrink-0 px-4">
                <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">CRM</h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={navLinkClasses}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );


    return (
        <>
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className="relative flex-1 flex flex-col max-w-xs w-full">
                     <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="sr-only">Close sidebar</span>
                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </button>
                    </div>
                    {sidebarContent}
                </div>
                <div className="flex-shrink-0 w-14" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64">
                    {sidebarContent}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
