
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { Customer, Lead, LeadStatus } from '../types';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { LEAD_STATUSES } from '../constants';
import LeadFormModal from '../components/leads/LeadFormModal';
import LeadListItem from '../components/leads/LeadListItem';
import ConfirmDeleteModal from '../components/customers/ConfirmDeleteModal';

const CustomerDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { customers, leads, loading, fetchLeadsByCustomerId, deleteLead } = useData();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');
    const [isLeadFormOpen, setLeadFormOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    useEffect(() => {
        if (id) {
            const foundCustomer = customers.find(c => c.id === id);
            setCustomer(foundCustomer || null);
            if (!leads[id]) {
                fetchLeadsByCustomerId(id);
            }
        }
    }, [id, customers, leads, fetchLeadsByCustomerId]);
    
    const customerLeads = useMemo(() => leads[id!] || [], [leads, id]);

    const filteredLeads = useMemo(() => {
        if (statusFilter === 'All') return customerLeads;
        return customerLeads.filter(lead => lead.status === statusFilter);
    }, [customerLeads, statusFilter]);
    
    const handleAddLeadClick = () => {
        setSelectedLead(null);
        setLeadFormOpen(true);
    };

    const handleEditLeadClick = (lead: Lead) => {
        setSelectedLead(lead);
        setLeadFormOpen(true);
    };
    
    const handleDeleteLeadClick = (lead: Lead) => {
        setSelectedLead(lead);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if(selectedLead && id) {
            await deleteLead(selectedLead.id, id);
            setDeleteModalOpen(false);
            setSelectedLead(null);
        }
    };

    if (loading && !customer) {
        return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
    }
    if (!customer) {
        return <div className="text-center">Customer not found.</div>;
    }

    return (
        <div className="container mx-auto">
            <Link to="/customers" className="inline-flex items-center mb-6 text-primary-600 hover:text-primary-800">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Customers
            </Link>
            
            <Card className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{customer.name}</h1>
                <p className="text-gray-500 dark:text-gray-400">{customer.company}</p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p><span className="font-semibold">Email:</span> {customer.email}</p>
                    <p><span className="font-semibold">Phone:</span> {customer.phone}</p>
                </div>
            </Card>

            <Card>
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold">Leads ({customerLeads.length})</h2>
                    <Button onClick={handleAddLeadClick} size="sm"><PlusIcon className="h-4 w-4 mr-1"/>Add Lead</Button>
                </div>
                <div className="p-4 border-b dark:border-gray-700">
                    <div className="flex space-x-2">
                        <button onClick={() => setStatusFilter('All')} className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'All' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>All</button>
                        {LEAD_STATUSES.map(status => (
                            <button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1 text-sm rounded-full ${statusFilter === status ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{status}</button>
                        ))}
                    </div>
                </div>
                <div className="divide-y dark:divide-gray-700">
                    {loading && customerLeads.length === 0 ? (
                        <div className="p-8 text-center"><Spinner /></div>
                    ) : filteredLeads.length > 0 ? (
                       filteredLeads.map(lead => <LeadListItem key={lead.id} lead={lead} onEdit={handleEditLeadClick} onDelete={handleDeleteLeadClick} />)
                    ) : (
                        <p className="p-8 text-center text-gray-500">No leads found for this status.</p>
                    )}
                </div>
            </Card>

            <LeadFormModal 
                isOpen={isLeadFormOpen}
                onClose={() => setLeadFormOpen(false)}
                customerId={id!}
                lead={selectedLead}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={selectedLead?.title || ''}
                itemType="Lead"
            />
        </div>
    );
};

export default CustomerDetailPage;
