import React, { useState, useRef } from 'react';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

const ImportCamels = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef();
 const url = process.env.REACT_APP_DEVELOPMENT;
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
    setSuccess(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setMessage('');
      setError('');
      setSuccess(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClick = () => {
    inputRef.current.click();
  };
  console.log(file)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an Excel file.');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');
    setSuccess(false);
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const res = await axios.post(`${url}/api/import-camels`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message || 'Import successful!');
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Import failed.');
    }
    setLoading(false);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper elevation={4} sx={{ p: 4, maxWidth: 420, width: '100%', borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} align="center" gutterBottom>
          Import Camels from Excel
        </Typography>
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick}
          sx={{
            border: '2px dashed #1976d2',
            borderRadius: 2,
            p: 3,
            mb: 2,
            textAlign: 'center',
            cursor: 'pointer',
            background: '#f8fafc',
            transition: 'border 0.2s',
            '&:hover': { border: '2px solid #1976d2', background: '#f0f6ff' },
          }}
        >
          <input
            type="file"
            accept=".xlsx,.xls"
            ref={inputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
          <Typography variant="body1" color="textSecondary">
            {file ? file.name : 'Drag & drop or click to select Excel file'}
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ py: 1.2, fontWeight: 600, fontSize: '1rem' }}
            startIcon={loading ? <CircularProgress size={22} color="inherit" /> : <CloudUploadIcon />}
          >
            {loading ? 'Importing...' : 'Import'}
          </Button>
        </form>
        {success && message && (
          <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert icon={<ErrorIcon fontSize="inherit" />} severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default ImportCamels;
