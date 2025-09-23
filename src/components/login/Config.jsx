// config.js
const config = {
    baseUrl: process.env.REACT_APP_DEVELOPMENT,
   get accessToken() {
  return sessionStorage.getItem('accessToken') || null // Access the token from sessionStorage
   },
  }

  export default config;
  