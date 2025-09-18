
import React, { useState, useEffect } from 'react';
import { Customer } from '../../types';
import { useData } from '../../hooks/useData';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

const CustomerFormModal: React.FC<CustomerFormModalProps> = ({ isOpen, onClose, customer }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { addCustomer, updateCustomer, loading } = useData();

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
      });
    } else {
      setFormData({ name: '', email: '', phone: '', company: '' });
    }
  }, [customer, isOpen]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.company) newErrors.company = 'Company is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (customer) {
        await updateCustomer({ ...customer, ...formData });
      } else {
        await addCustomer(formData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save customer', error);
      setErrors({ form: 'Failed to save customer. Please try again.' });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={customer ? 'Edit Customer' : 'Add Customer'}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
        <div>
          <Input label="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <Input label="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
        </div>
        <div>
          <Input label="Company" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} required />
          {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={loading}>{customer ? 'Save Changes' : 'Add Customer'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerFormModal;
