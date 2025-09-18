
import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Customer } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import { PencilIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import CustomerFormModal from '../components/customers/CustomerFormModal';
import ConfirmDeleteModal from '../components/customers/ConfirmDeleteModal';

const PAGE_LIMIT = 10;

const CustomersPage: React.FC = () => {
    const { customers, totalCustomers, loading, fetchCustomers, deleteCustomer } = useData();
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        fetchCustomers(currentPage, PAGE_LIMIT, searchTerm);
    }, [currentPage, searchTerm, fetchCustomers]);
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); 
    };
    
    const handleAddClick = () => {
        setSelectedCustomer(null);
        setFormModalOpen(true);
    };

    const handleEditClick = (customer: Customer) => {
        setSelectedCustomer(customer);
        setFormModalOpen(true);
    };

    const handleDeleteClick = (customer: Customer) => {
        setSelectedCustomer(customer);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if(selectedCustomer) {
            await deleteCustomer(selectedCustomer.id);
            setDeleteModalOpen(false);
            setSelectedCustomer(null);
            // Refetch if the deleted item was the last on the page
            if (customers.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        }
    };

    const totalPages = Math.ceil(totalCustomers / PAGE_LIMIT);

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Customers</h1>
                <Button onClick={handleAddClick}><UserPlusIcon className="h-5 w-5 mr-2"/>Add Customer</Button>
            </div>
            
            <Card>
                <div className="p-4">
                    <Input 
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                {loading && customers.length === 0 ? (
                    <div className="flex justify-center items-center p-8"><Spinner /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {customers.map(customer => (
                                    <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link to={`/customers/${customer.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-800">{customer.name}</Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{customer.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{customer.company}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEditClick(customer)} className="text-primary-600 hover:text-primary-900 mr-4"><PencilIcon className="h-5 w-5"/></button>
                                            {user?.role === 'Admin' && <button onClick={() => handleDeleteClick(customer)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5"/></button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                        Showing <span className="font-medium">{(currentPage - 1) * PAGE_LIMIT + 1}</span> to <span className="font-medium">{Math.min(currentPage * PAGE_LIMIT, totalCustomers)}</span> of <span className="font-medium">{totalCustomers}</span> results
                    </p>
                    <div className="flex-1 flex justify-end space-x-2">
                        <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</Button>
                        <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</Button>
                    </div>
                </div>
            </Card>

            <CustomerFormModal 
                isOpen={isFormModalOpen}
                onClose={() => setFormModalOpen(false)}
                customer={selectedCustomer}
            />
            <ConfirmDeleteModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={selectedCustomer?.name || ''}
            />
        </div>
    );
};

export default CustomersPage;
