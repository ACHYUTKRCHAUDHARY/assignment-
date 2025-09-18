
import React from 'react';
import { Lead, LeadStatus } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface LeadListItemProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const statusColors: { [key in LeadStatus]: string } = {
  [LeadStatus.New]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [LeadStatus.Contacted]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  [LeadStatus.Converted]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [LeadStatus.Lost]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};


const LeadListItem: React.FC<LeadListItemProps> = ({ lead, onEdit, onDelete }) => {
    const { user } = useAuth();
    
    return (
        <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="flex-1 mb-4 sm:mb-0">
                <p className="font-semibold text-gray-800 dark:text-gray-200">{lead.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{lead.description}</p>
                 <div className="flex items-center mt-2 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                        {lead.status}
                    </span>
                    <span className="mx-2 text-gray-400 dark:text-gray-500">|</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">${lead.value.toLocaleString()}</span>
                    <span className="mx-2 text-gray-400 dark:text-gray-500">|</span>
                    <span className="text-gray-500 dark:text-gray-400">Created: {new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <div className="flex-shrink-0 flex space-x-2">
                <button onClick={() => onEdit(lead)} className="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"><PencilIcon className="h-5 w-5" /></button>
                {user?.role === 'Admin' && <button onClick={() => onDelete(lead)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"><TrashIcon className="h-5 w-5" /></button>}
            </div>
        </div>
    );
};

export default LeadListItem;
