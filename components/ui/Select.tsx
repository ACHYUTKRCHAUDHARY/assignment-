
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
    const baseClasses = "block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md";

    return (
        <div>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <select id={id} className={baseClasses} {...props}>
                {children}
            </select>
        </div>
    );
};

export default Select;
