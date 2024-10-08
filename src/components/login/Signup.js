import React, { useState } from 'react';
import { CssBaseline, Container, Box, TextField, Typography, Button, Paper, Alert, AlertTitle, IconButton } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material'; // Import icons
import logo from '../../images/logo.png';
import axios from 'axios';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useForm } from 'react-hook-form';
import './signup.scss'
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const useStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(45deg, #0F172A 30%, #0F172A 90%)',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
  },
  logo: {
    width: '121px',
    marginLeft: '260px',
    marginTop: '-28px',

  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    // margin: '20px 0',
  },
  portal: {

    fontSize: '36px',
    fontWeight: 'bold',
    color: '#111315', /* Change the text color */
    textShadow:' 2px 2px 4px rgba(0, 0, 0, 0.5)', /* Add a subtle shadow */
    borderRadius: '10px', /* Rounded corners */
      position: 'relative',
    right: '65px',
    bottom: '65px',
    bottom: '65px',
  },
  customButton: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    color: 'white',
    borderRadius: '20px',
    padding: '12px 20px',
    fontSize: '1.2rem',
    margin: '20px 0',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, 0.3)',
    transition: 'background-color 0.3s',
  },
  customButtonHover: {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
  },
  link: {
    marginTop: '10px',
  },

 
};
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
 
  const history = useHistory();
  const url = process.env.REACT_APP_DEVELOPMENT;
  const { register, handleSubmit, formState: { errors } } = useForm();
  // const onSubmit = async(data)=>{
  //   try {
  //   await axios.post(`${url}/api/login`,data,
  //   {
  //     headers:{token:`${accessToken}`}
  //   }).then(response=>{
  //     console.log(response,'res')
  //     history.push({pathname:'/Home',state:data,});
      
  //   }).catch(error=>{
  //     toast(error.response.data.message,{
  //       position: "top-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     })
  //   })
  //   } catch (error) {
  //     console.log(error)
      
  //   }
  // }


  const onSubmit = async (data) => {
    try {
      console.log(data, 'data');
      
      const res = await axios.post(`${process.env.REACT_APP_DEVELOPMENT}/api/login`, data);
      console.log(res)
      const accessToken = res.data.token;
      console.log(accessToken, 'kkk');
      console.log(res, 'res');
  
      if (accessToken) {
        console.log(accessToken, 'acces');
        sessionStorage.setItem('accessToken', accessToken);
        setIsAuthenticated(true);
        setShowLoginForm(false);
        setTimeout(() => {
          history.push({pathname:'/Home',state:data,});
        }, 500);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.log('Error:', error);
      toast(error.response?.data.message || error.response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
 
   
    <div style={useStyles.container}>
   
      <CssBaseline />
      {showLoginForm ? (

<Container component="main" maxWidth="xs">
        <Paper elevation={3} style={useStyles.formContainer}>
          <img src={logo} alt="Logo" style={useStyles.logo} />
          <Typography component="h1" variant="h4" style={useStyles.portal}>
          Payment Portal
          </Typography>
          <Typography component="h1" variant="h4" style={useStyles.title}>
          مرحباً
          </Typography>
          <form style={useStyles.form} onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="on"
              autoFocus
              {...register("name")}
              InputProps={{
                startAdornment: (
                  <AccountCircle fontSize="medium" style={{ marginRight: '8px' }} />
                ),
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...register("password")}
              // onChange={handlePasswordChange}
              autoComplete="off" // Try setting this to 'off' to disable autocomplete

              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                  
                  <IconButton onClick={togglePasswordVisibility}>
                     {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{
                ...useStyles.customButton,
                ...useStyles.customButtonHover,
              }}
            >
              Login In
            </Button>
            <ToastContainer />
          </form>
          {/* <Link href="#" color="primary" style={useStyles.link}>
            signUp
          </Link> */}
        </Paper>
      </Container>
      ):""
      }
      
    </div>
    </>
  );
};

export default Signup;
