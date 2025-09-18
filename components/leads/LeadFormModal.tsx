
import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus } from '../../types';
import { useData } from '../../hooks/useData';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { LEAD_STATUSES } from '../../constants';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  customerId: string;
}

const LeadFormModal: React.FC<LeadFormModalProps> = ({ isOpen, onClose, lead, customerId }) => {
    const initialState = {
        title: '',
        description: '',
        status: LeadStatus.New,
        value: 0,
    };
    const [formData, setFormData] = useState(initialState);
    const { addLead, updateLead, loading } = useData();

    useEffect(() => {
        if (lead) {
            setFormData({
                title: lead.title,
                description: lead.description,
                status: lead.status,
                value: lead.value,
            });
        } else {
            setFormData(initialState);
        }
    }, [lead, isOpen]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (lead) {
                await updateLead({ ...lead, ...formData, value: Number(formData.value) });
            } else {
                await addLead({ ...formData, customerId, value: Number(formData.value) });
            }
            onClose();
        } catch (error) {
            console.error('Failed to save lead', error);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={lead ? 'Edit Lead' : 'Add Lead'}>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input label="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                <Input label="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                <Input label="Value ($)" type="number" value={formData.value} onChange={e => setFormData({ ...formData, value: Number(e.target.value) })} required />
                <Select label="Status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as LeadStatus })}>
                    {LEAD_STATUSES.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </Select>
                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" isLoading={loading}>{lead ? 'Save Changes' : 'Add Lead'}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default LeadFormModal;
