import React from 'react'

import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useDeleteReceipt } from './useReceipts';

const DeleteReceipt = ({selectedReceipt, onClose }) => {
     const mutation  = useDeleteReceipt();

 const handleDelete = () => {
    mutation.mutate(selectedReceipt, { onSuccess: onClose });

  };


  return (
    <div>
          <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        Are you sure you want to delete <b>{selectedReceipt?.doc}</b>?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </div>
  )
}

export default DeleteReceipt