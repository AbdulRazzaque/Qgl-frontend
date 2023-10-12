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
function Previousreport() {
    const [display,setDisplay]=React.useState(false)
    const [data,setData] = React.useState([])
    const [alert, setAlert] = useState(false);
    const [value, setValue] = React.useState("");
    const [selectedDate, setSelectedDate] = React.useState();
    const [update, setUpdate] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [updatedate, setupdatedate] = React.useState(dayjs());
    const columns = [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'doc', headerName: 'Doc', width: 130 },
      // { field: 'date', headerName: 'Date', width: 130 },
      {headerName: "Date",field: "date",width: 150,renderCell: (param) =>moment.parseZone(param.value).local().format("DD/MM/YYYY"),},
      { field: 'name', headerName: 'Name', width: 130 },
      { field: 'amount', headerName: 'Amount', width: 130 },
      { field: 'membership', headerName: 'Membership', width: 130 },
      { field: 'cash', headerName: 'Cash', width: 130 },
      { field: 'being', headerName: 'Being', width: 130 },
  
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
    ];
  // ------------------------------------------update api here -------------------------------------------------------------

  const updateData = (e)=>{
    setUpdate({...update,[e.target.name]:e.target.value})
    console.log(update)
  }
  const updateRow = async()=>{
    var obj = {
      date:updatedate ,
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
            // setData(response.data)
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
},[])
// console.log(data,'here i am cheack the data')


  // ------------------------------------------Delete api here -------------------------------------------------------------
  const deleteRow = async (update)=> {
    try {
      await axios.delete(`${process.env.REACT_APP_DEVELOPMENT}/api/deletereceipt/${update._id}`,update)
      .then(response=>{
        console.log(response)
        alldata()
      })
      setAlert(false)
    } catch (error) {
      console.log(error)
    }
    
  }

    return (
        <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <Dashhead id={2} display={display} />
            </div>

            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 dashboard-container" onClick={()=>display&&setDisplay(false)}>
            <span className="iconbutton display-mobile">
            <IconButton  size="large" aria-label="Menu" onClick={()=>setDisplay(true)}>
            <MenuIcon fontSize="inherit" />
             </IconButton>
             </span>

                <h1 className='title text-center my-5'>Previous Details</h1>
                <div style={{ height: 400, width: '100%' }}>

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
              type="number"
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
<div style={{ height: 1000, width: '100%' }}>
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
    </div>
    )
}

export default Previousreport
