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
  alert:{
    width: '526px',
    height: '67px',
    marginBottom:' 13px',
    border: '1px',
    border:'solid',
    borderRadius: '52px'
  }
 
};
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);


  const [isValid,setIsValid] = useState(false)
  const history = useHistory();
  const url = process.env.REACT_APP_DEVELOPMENT;
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTQ3NzdlNzEwZTA2OGZjODFjNDg1MjEiLCJpYXQiOjE2OTkzNTE4MjUsImV4cCI6MTczMDkwOTQyNX0.5VeraM1Lbr5Q5et-xTNYMi8JuAc05pAYuVKDahgL5YU"
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = async(data)=>{
    try {
    await axios.post(`${url}/api/login`,data,
    {
      headers:{token:`${accessToken}`}
    }).then(response=>{
      console.log(response,'res')
      history.push('/Home');
    }).catch(error=>{
      setIsValid(error.response.data.message)
      setTimeout(()=>{
        setIsValid(false)
      },3000)
    })
    } catch (error) {
      console.log(error)
      
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
 
   
    <div style={useStyles.container}>
    {
        isValid && 
        <Alert severity='error' style={useStyles.alert}>
          <AlertTitle>Error</AlertTitle>
        <span>  <strong>{isValid}</strong></span> 
        </Alert>
      }
   
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} style={useStyles.formContainer}>
          <img src={logo} alt="Logo" style={useStyles.logo} />
          <Typography component="h1" variant="h4" style={useStyles.portal}>
          Payment Portal
          </Typography>
          <Typography component="h1" variant="h4" style={useStyles.title}>
          مرحباً
          </Typography>
          <form style={useStyles.form} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
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
              autoComplete="current-password"
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
          </form>
          {/* <Link href="#" color="primary" style={useStyles.link}>
            signUp
          </Link> */}
        </Paper>
      </Container>
    </div>
    </>
  );
};

export default Signup;
