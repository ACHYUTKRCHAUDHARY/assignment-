
import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType?: string;
  isLoading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, itemName, itemType = 'Customer', isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Delete ${itemType}`}>
      <div className="p-6">
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to delete <span className="font-bold">{itemName}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="button" variant="danger" onClick={onConfirm} isLoading={isLoading}>Delete</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
