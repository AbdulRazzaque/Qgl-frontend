import React, { Fragment, useEffect, useState } from "react";
import "./Home.scss";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Dashhead from "./Dashhead";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Autocomplete, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from "@mui/icons-material/Print";
import { Link } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import {useForm} from 'react-hook-form'
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import dayjs from "dayjs";
import date from "date-and-time";
import Receiptpdf from "./Receiptpdf";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
function Home() {
  const [display, setDisplay] = React.useState(false);
  const [data,setData] = React.useState([])
  const [alert, setAlert] = useState(false);
  const [value, setValue] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState();
  const [update, setUpdate] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [updatedate, setupdatedate] = React.useState(dayjs());
  const [updateMicrochip, setupdateMicrochip] = React.useState(dayjs());

  const [microchip,setMicrochip] = useState([])
  const [printData,setprintData] = useState([])

  const [count, setCount] = useState();
  const history = useHistory();

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'doc', headerName: 'Doc', width: 50 },
    // { field: 'date', headerName: 'Date', width: 130 },
    {headerName: "Date",field: "date",width: 130,renderCell: (param) =>moment.parseZone(param.value).local().format("DD/MM/YYYY"),},
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'amount', headerName: 'Amount', width: 100 },
    { field: 'membership', headerName: 'Membership', width: 130 },
    { field: 'cash', headerName: 'Payment Method', width: 130 },
    { field: 'being', headerName: 'Being', width: 130 },
    {headerName: "Microchip ",field: "microchip",width: 150,renderCell: (param) =>moment.parseZone(param.value).local().format("DD/MM/YYYY"),},

        {
      title: "Action",
      field: "Action",
      width: 100,
      renderCell: () => (
        <Fragment>
          <Button onClick={() => setShowDialog(true)}>
            <EditIcon />
          </Button>
        </Fragment>
      ),
    },
    {
      title: "Delete",
      field: "Delete",
      width: 100,
      renderCell: () => (
        <Fragment>
          <Button color="error" onClick={() => setAlert(true)}>
            <DeleteIcon />
          </Button>
        </Fragment>
      ),
    },
    {
      title: "Print",
      field: "Print",
      width: 100,
      renderCell: (params) => (
        <Fragment>
          <Button color="success" onClick={()=>clickPrintIcon(params.row)}>
            <PrintIcon />
          </Button>
        </Fragment>
      ),
    },
  ];

  // ------------------------------------------Post api here -------------------------------------------------------------

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const onSubmit = async (data,action)=>{
 
    if(action === 'save'){
      var obj = {
        date: selectedDate,
        doc:count,
        microchip:microchip,
        ...data,
      };
      try {
        await axios.post(`${process.env.REACT_APP_DEVELOPMENT}/api/qgl`,obj)
        // setCount(count + 1);
        setCount((prevCount) => prevCount + 1);
        console.log('Data saved successfully');
     
       } catch(error) {
         console.log(error,"This is error")
       }
    }
    else if(action === 'print'){
      var obj = {
        date: selectedDate,
        doc:count,
        microchip:microchip,
        ...data,
      };
      const combinedObj = {...data ,...obj};
      try {
        await axios.post(`${process.env.REACT_APP_DEVELOPMENT}/api/qgl`,obj)
        .then(response=>{
          // setCount((prevCount) => prevCount + 1);
          history.push('/Receiptpdf', { data:combinedObj });
       })
       } catch(error) {
         console.log(error,"This is error")
       }
    }
     
    alldata();
    reset();
    }
   
    
     
 
  // const {register,handleSubmit}=useForm();
  const handleSaveButtonClick = () => {
    // Trigger the form submission with the 'save' action
    handleSubmit((formData) => onSubmit(formData, 'save'))();
  };

  const handlePrintButtonClick = () => {
    // Trigger the form submission with the 'print' action
    handleSubmit((formData) => onSubmit(formData, 'print'))();
  };
  
  // ------------------------------------------update api here -------------------------------------------------------------

  const updateData = (e)=>{
    setUpdate({...update,[e.target.name]:e.target.value})
    console.log(update)
  }
  const updateRow = async()=>{
    var obj = {
      date:updatedate ,
      microchip:updateMicrochip,
      ...date,
    } 

    const combinedObj = {...update ,...obj};
    console.log(combinedObj)
        try {
          await axios.put(`${process.env.REACT_APP_DEVELOPMENT}/api/updatereceipt/${update._id}`,combinedObj)
          .then(response=>{
            console.log(response)
          })
          setShowDialog(false)
        } catch (error) {
          console.log(error)
          
        }
        alldata()
      }
  
  // ------------------------------------------Get api here -------------------------------------------------------------

      const alldata= async()=>{
        try {
         
          await axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/getreceipt`)
          .then(response=>{
              if(response){

                // setCount(parseInt(response.data[0].doc) + 1);
                // console.log(response.data[0].doc)
                // console.log(response.data[0].doc + 1);
                const highestDocNumber = response.data.reduce((max, item) => Math.max(max, item.doc), 0);

                // Update the count to the next available document number
                setCount(highestDocNumber + 1);
              } 
              if (response) {
                const existingDocuments = response.data.map((doc, index) => ({ ...doc, id: index + 1 }));
                setCount(existingDocuments.length + 1);
              }
              // setCount(response.data[0].doc + 1)
            let arr = response.data.map((item,index) =>({
              ...item,
              id:index +1,
            }));
 
            setData(arr)

          })
        } catch (error) {
          console.log(error)
          
        }
      }

useEffect(()=>{
  alldata()
  deleteRow()
},[])
// console.log(data,'here i am cheack the data')


  // ------------------------------------------Delete api here -------------------------------------------------------------
  const deleteRow = async (update)=> {
    try {
      await axios.delete(`${process.env.REACT_APP_DEVELOPMENT}/api/deletereceipt/${update._id}`,update)
      .then(response=>{
        console.log(response)
    
        // setData(data.filter(item => item._id !== update._id));
        // Remove the deleted document from the local data
      const updatedData = data.filter(item => item._id !== update._id);
      // setData(updatedData);

      // After deletion, update the count to reflect the correct next available document number
      // setCount(updatedData.length + 1);

      window.location.reload();
    })

      setAlert(false)
    } catch (error) {
      console.log(error)
    }
    // alldata()
  }
 


  const clickPrintIcon=(row)=>{
    // setprintData(row)
    history.push('/Receiptpdf', { data:row });
    console.log(row,"After clicking clickpritn icon")
  }

  return (
    <div className="row">
      <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <Dashhead id={1} display={display} />
      </div>

      <div
        className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 dashboard-container"
        onClick={() => display && setDisplay(false)}
      >
        <span className="iconbutton display-mobile">
          <IconButton
            size="large"
            aria-label="Menu"
            onClick={() => setDisplay(true)}
          >
            <MenuIcon fontSize="inherit" />
          </IconButton>
        </span>
<div className="container">
 
   {/* Thsi Diloag box for Delete Alert  */}
   <Container>
        {alert && (
          <Dialog open={alert} style={{ height: 600 }}>
            <DialogTitle>Delete Row</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are You sure You want to delete this.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={() => deleteRow(update)}>
                Yes
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setAlert(false);
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* This Dialog box is update  */}
        {update && (
          <Dialog open={showDialog} style={{ height: 600 }}>
            <DialogTitle>Update Data</DialogTitle>
            <DialogContent>
            <form>

   
      <div className="row ">

        </div>
        <div className="row  ">
          <div className="col ">
            <TextField
              id="outlined-basic"
              sx={{ width: 230 }}
              label="Doc No"
              variant="outlined"
              name="doc"
              value={update.doc}
              onChange={updateData}
              required
            />
          </div>
          <div className="col ">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                  
                  name="date"
                    sx={{ width: 230 }}
                    label="Date"
                    value={updatedate}
                      onChange={(newValue) => {
                        setupdatedate(newValue);
                      }}
                      
                    renderInput={(params) => (
                      <TextField name="date" {...params}      />
                    )}
                  />
                </LocalizationProvider>
          </div>
        </div>
        <div className="row my-3 ">
          <div className="col ">
            <TextField
              id="outlined-basic"
              sx={{ width: 500 }}
              label="Received From Mr/Mrs"
              variant="outlined"
              name="name"
              value={update.name}
              onChange={updateData}
              required
              
            />
          </div>
        </div>
        <div className="row my-3 ">
          <div className="col ">
            <TextField
              id="outlined-basic"
              sx={{ width: 500 }}
              label="The Amount Piad"
              variant="outlined"
              type="number"
              required
              name='amount'
              value={update.amount}
              onChange={updateData}
            />
          </div>
        </div>
        <div className="row my-3 ">
          <div className="col ">
            <TextField
              id="outlined-basic"
              sx={{ width: 500 }}
              label="Membership No"
              variant="outlined"
              type="number"
              required
              name='membership'
              value={update.membership}
              onChange={updateData}
            />
          </div>
        </div>
        <div className="row my-3 ">
          <div className="col ">
            <TextField
              id="outlined-basic"
              sx={{ width: 500 }}
              label="Cash"
              variant="outlined"
              // type="number"
              required
              name='cash'
              value={update.cash}
              onChange={updateData}
            />
          </div>
        </div>
        <div className="row my-3 ">
          <div className="col ">
            <TextField
              id="outlined-basic"
              sx={{ width: 500 }}
              label="Being for"
              variant="outlined"
              type="number"
              name='being'
              value={update.being}
              onChange={updateData}
            />
          </div>
        </div>
        <div className="row my-3 ">
          <div className="col ">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                  name="date"
                    sx={{ width: 500 }}
                    label="Date of Microchip implementation"
                    value={updateMicrochip}
                      onChange={(newValue) => {
                        setupdateMicrochip(newValue);
                      }}
                    renderInput={(params) => (
                      <TextField name="date" {...params}      />
                    )}
                  />
                </LocalizationProvider>
          </div>
        </div>
     
        </form>
            </DialogContent>
            <DialogActions>
              <Button type="submit" variant="contained" onClick={updateRow}>
                Update
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setShowDialog(false);
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        )}

</Container>

    <form onSubmit={handleSubmit(onSubmit)}>
<div className="row my-3 ">
      
             <h1 className="text-center attractive-header ">Qatar Genetic Lab</h1>
        </div>
        <div className="row my-3 ">
          <div className="col ">
            <TextField
              id="outlined-basic"
              sx={{ width: 230 }}
             
              value={count} 
       
              variant="outlined"
              {...register('doc', { required: true })}
      
              required
            />
          </div>
          <div className="col ">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
           
                    sx={{ width: 230 }}
                    label="Date"
                    value={selectedDate}
                    onChange={(newValue) => {
                      setSelectedDate(newValue)}}
                      required
                    renderInput={(params) => (
                      <TextField name="date" {...params}      />
                    )}
                  />
                </LocalizationProvider>
          </div>
        </div>
        <div className="row my-3 ">
          <div className="col ">
            <TextField
              id="outlined-basic"
              sx={{ width: 500 }}
              label="Received From Mr/Mrs"
              variant="outlined"
              // {...register("name")}
              required
              {...register('name', { required: true })}
            />
          </div>
        </div>
        <div className="row my-3 ">
          <div className="col ">
            <TextField
              id="outlined-basic"
              sx={{ width: 500 }}
              label="The Amount Piad"
              variant="outlined"
              type="number"
              // {...register("amount")}
              required
              {...register('amount', { required: true })}
            />
          </div>
        </div>
        <div className="row my-3 ">
          <div className="col ">
            <TextField
              id="outlined-basic"
              sx={{ width: 500 }}
              label="Membership No"
              variant="outlined"
              type="number"
              required
              // {...register("membership")}
             
              {...register('membership', { required: true })}
            />
          </div>
        </div>
        <div className="row my-3 ">
          <div className="col" >
            <TextField
              id="outlined-basic"
              sx={{ width: 500 }}
              value="ATM"
              label="Payment Method"
              variant="outlined"
              // type="number"
              
              required
              // {...register("cash")}
             
              {...register('cash', { required: true })}
            />
          </div>
        </div>
        <div className="row my-3 ">
          <div className="col ">
            <TextField
              id="outlined-basic"
              sx={{ width: 500 }}
              label="Being for"
              variant="outlined"
              // type="number"
              required
              // {...register("being")}
            
              {...register('being', { required: true })}
            />
          </div>
        </div>
        <div className="row my-3 ">
          <div className="col ">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
           
                    sx={{ width: 500 }}
                    label="Date of Microchip implementation"
                    value={microchip}
                    onChange={(newValue) => {
                      setMicrochip(newValue)}}
                    renderInput={(params) => (
                      <TextField name="date" {...params}      />
                    )}
                  />
                </LocalizationProvider>
          </div>
        </div>
        <Stack spacing={2} direction="row" marginBottom={2}  justifyContent="center">
           <Button variant="contained" color="success"   onClick={handleSaveButtonClick}  > <SaveIcon className="mr-1"/> Save Form</Button>
          <Button  variant="contained"  onClick={handlePrintButtonClick}><PrintIcon className="mr-1" /> Print Form</Button> 
           </Stack>
        </form>
</div>
<div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        // checkboxSelection
        // getRowId={(row)=>row._id}
        onRowClick={(item)=>setUpdate(item.row)}

      />
    </div>
      </div>
    </div>
  );
}

export default Home;
