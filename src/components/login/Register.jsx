import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Paper, Typography, Box, MenuItem } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const res = await axios.post(`${process.env.REACT_APP_DEVELOPMENT}/api/register`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User registered successfully!');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper elevation={4} sx={{ p: 4, maxWidth: 420, width: '100%', borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} align="center" gutterBottom>
          Register New User
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            {...register('name', { required: true })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register('email', { required: true })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('password', { required: true })}
          />
          <TextField
            select
            label="Role"
            fullWidth
            margin="normal"
            defaultValue="User"
            {...register('role', { required: true })}
          >
            <MenuItem value="SuperAdmin">SuperAdmin</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
        <ToastContainer />
      </Paper>
    </Box>
  );
};

export default Register;
