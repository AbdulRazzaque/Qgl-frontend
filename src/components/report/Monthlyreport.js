import React, { Fragment, useEffect, useState } from "react";
// import "./Home.scss";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Dashhead from "../Dashhead";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Autocomplete, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Pagination, Paper, Stack, TextField } from "@mui/material";
import { DatePicker, DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
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
import Receiptpdf from "../Receiptpdf";
import MaterialTable from 'material-table';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import idLocale from 'date-fns/locale/id';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function Monthlyreport() {
    const [display,setDisplay]=React.useState(false)
    const [data,setData] = React.useState([])
    const [alert, setAlert] = useState(false);
    const [value, setValue] = React.useState("");
    const [value1, setValue1] = React.useState("");
    const [selectedDate, setSelectedDate] = React.useState();
    const [update, setUpdate] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [updatedate, setupdatedate] = React.useState(dayjs());
    const [updateMicrochip, setupdateMicrochip] = React.useState(dayjs()); 
  const [microchip,setMicrochip] = useState([])
  const {register,handleSubmit,reset} = useForm()
  const history = useHistory();
 
  const columns = [
    { field: 'id', title: 'ID', width: 50 },
    { field: 'doc', title: 'Doc', width: 50, customExport: (dataExport) => dataExport.toString() },
    // { field: 'date', title: 'Date', width: 130 },
    {field: "date",title: "Date",width: 130, type:'date',render:(rowData)=>moment(rowData.date).format("DD/MM/YYYY")},
    { field: 'name', title: 'Name', width: 130 ,cellStyle: { direction: 'rtl' }  },
    { field: 'amount', title: 'Amount', width: 100 },
    { field: 'membership', title: 'Membership', width: 100 },
    { field: 'telephone', title: 'TelePhone', width: 100 },
    { field: 'cash', title: 'Payment Method', width: 100 },
    { field: 'being', title: 'Being', width: 100 },
    { field: 'category', title: 'category', width: 100 },
    // {title: "Microchip ",field: "microchip",width: 150,renderCell: (param) =>moment.parseZone(param.value).local().format("DD/MM/YYYY"),},
    {field: "microchip",title: "Microchip", type:'date',width: 150,render:(rowData)=>rowData.microchip? moment(rowData.microchip).format("DD/MM/YYYY"):""},
    { 
      title: 'Actions',
      field: 'actions',
      export:false,
       width: 90,
      render: () => (
        <IconButton
        onClick={() => setShowDialog(true)} // Add your click handler for the icon action
        >
          <EditIcon /> {/* Display the icon */}
        </IconButton>
      ),
    },
    {
      title: 'Actions',
      field: 'actions',
      export:false,
      width: 90,
      render: (rowData) => (
        <IconButton
        onClick={() => setAlert(true)} // Add your click handler for the icon action
        >
          <DeleteIcon /> {/* Display the icon */}
        </IconButton>
      ),
    },
    {
      title: 'Actions',
      field: 'actions',
      export:false,
      width: 90,
      render: (rowData) => (
        <IconButton
        onClick={() =>clickPrintIcon(rowData)} // Add your click handler for the icon action
        >
        <PrintIcon /> {/* Display the icon */}
        </IconButton>
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

    //--------------------------------------------------------- Get Data by date request ------------------------------------------------------------

    const onSubmit=(data)=>{
      console.log(data,'data')
      try {
        let obj={
          value,
          value1,
          ...data
        
        }
        console.log(obj,'obj')
        axios.post(`${process.env.REACT_APP_DEVELOPMENT}/api/monthlyreportQGl`,{from:date.format(value,'YYYY/MM/DD'),to:date.format(value1,'YYYY/MM/DD'), ...obj},)
        .then(response=>{
         setData(response.data.pre ,"thisis data")
        })
      } catch (error) {
        console.log(error)
      }
 
    }

      
  
  // ------------------------------------------Get api here -------------------------------------------------------------

      const alldata= async()=>{
        try {
          await axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/getreceipt`)
          .then(response=>{
            // setData(response.data)
            let arr = response.data.map((item,index) =>({
              ...item,
              doc: `\u200B${item.doc}`,
              id:index +1,
             
            }));
            setData(arr)
          })
        } catch (error) {
          console.log(error)
          
        }
      }


// useEffect(()=>{
//   alldata()
// },[])
console.log(data,'here i am cheack the data')


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

  // ------------------------------------------Print code here -------------------------------------------------------------

  const clickPrintIcon=(row)=>{
    // setprintData(row)
    history.push('/Receiptpdf', { data:row });
    console.log(row,"After clicking clickpritn icon")
  }

  // ------------------------------------------Row Data get  code here -------------------------------------------------------------

const handleRowClick=(event,rowData)=>{
  setUpdate(rowData)
}


    return (
        <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <Dashhead id={3} display={display} />
            </div>

            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 dashboard-container" onClick={()=>display&&setDisplay(false)}>
            <span className="iconbutton display-mobile">
            <IconButton  size="large" aria-label="Menu" onClick={()=>setDisplay(true)}>
            <MenuIcon fontSize="inherit" />
             </IconButton>
             </span>

                <h1 className='title text-center my-5'>Monthly Report Details</h1>
                <div style={{ height: 400, width: '100%' }}>

                <Container>
   
{alert && (
  <div class="modal" style={{ display: alert ? "block" : "none" }}>
    <div class="modal-dialog" style={{ height: 600 }}>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Row</h5>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this?</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            onClick={() => deleteRow(update)}
          >
            Yes
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
            onClick={() => setAlert(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

     {/* This Dialog box is update  */}
        {update && (
 
      <Dialog open={showDialog} style={{ height: 600 }}>
  <DialogTitle>Update Data</DialogTitle>
  <DialogContent>
    <form>
      <div className="row">
        <div className="col-6">
          <div className="mb-3">
            <label for="doc" class="form-label">Doc No</label>
            <input
              type="text"
              class="form-control"
              id="doc"
              name="doc"
              value={update.doc}
              onChange={updateData}
              required
            />
          </div>
        </div>
        <div className="col-6 mt-4">

          <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                  name="date"
                  // Adjust the padding value as needed
                    sx={{ width: 230 }}
                    label="Date"
                    value={dayjs(update.date)}
                      onChange={(newValue) => {
                        setupdatedate(newValue);
                      }}
                      format ="DD/MM/YYYY"
                    renderInput={(params) => (
                      <TextField name="date" {...params}      />
                    )}
                  />
                </LocalizationProvider>
        </div>

        <div class="col-12">
          <div class="mb-3">
            <label for="name" class="form-label">Received From Mr/Mrs</label>
            <input
              type="text"
              class="form-control"
              id="name"
              name="name"
              value={update.name}
              onChange={updateData}
              required
            />
          </div>
        </div>
        <div class="col-12">
          <div class="mb-3">
            <label for="name" class="form-label">Tele Phone</label>
            <input
              type="text"
              class="form-control"
              id="name"
              name="name"
              value={update.telephone}
              onChange={updateData}
              required
            />
          </div>
        </div>

        <div class="col-12">
          <div class="mb-3">
            <label for="amount" class="form-label">The Amount Paid</label>
            <input
              type="number"
              class="form-control"
              id="amount"
              name="amount"
              value={update.amount}
              onChange={updateData}
              required
            />
          </div>
        </div>

        <div class="col-12">
          <div class="mb-3">
            <label for="membership" class="form-label">Membership No</label>
            <input
              type="text"
              class="form-control"
              id="membership"
              name="membership"
              value={update.membership}
              onChange={updateData}
              required
            />
          </div>
        </div>
        <div class="col-12">
          <div class="mb-3">
            <label for="membership" class="form-label">category</label>
            <input
              type="text"
              class="form-control"
              id="membership"
              name="category"
              value={update.category}
              onChange={updateData}
              required
            />
          </div>
        </div>

        <div class="col-12">
          <div class="mb-3">
            <label for="cash" class="form-label">Cash</label>
            <input
              type="text"
              class="form-control"
              id="cash"
              name="cash"
              value={update.cash}
              onChange={updateData}
              required
            />
          </div>
        </div>

        <div class="col-12">
          <div class="mb-3">
            <label for="being" class="form-label">Being for</label>
            <input
              type="text"
              class="form-control"
              id="being"
              name="being"
              value={update.being}
              onChange={updateData}
            />
          </div>
        </div>

        <div class="col-12">
   
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                  name="date"
                    sx={{ width: 500 }}
                    format="DD/MM/YYYY"
                    label="Date of Microchip implementation"
                    value={update.microchip?dayjs(update.microchip):""}
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
    <button type="button" class="btn btn-primary" onClick={updateRow}>Update</button>
    <button type="button" class="btn btn-danger" onClick={() => setShowDialog(false)}>Cancel</button>
  </DialogActions>
</Dialog>

        )}

</Container>
<form onSubmit={handleSubmit(onSubmit)}>
<Stack
            direction="row"
            spacing={2}
            margin="23px"
            justifyContent="center"
          >
            {/* <TextField type="Date" sx={{width:200}} id="outlined-basic" label="" variant="outlined"  /> */}
            {/* <TextField type="Date"  format="yyyy-MM-dd HH:mm:ss" sx={{width:200}} id="outlined-basic" label="" variant="outlined"  /> */}

            <section>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="From"
                  inputFormat="dd/MM/yyyy"
                  value={value}
                  onChange={(newValue) => {
                    console.log(newValue);
                    setValue(newValue);
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </LocalizationProvider>
            </section>
            <section>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="To"
                  inputFormat="dd/MM/yyyy"
                  value={value1}
                  onChange={(newValue) => {
                    console.log(newValue);
                    setValue1(newValue);
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </LocalizationProvider>
            </section>
            <button type="submit" class="btn btn-primary" >submit</button>
          </Stack>
            </form>
          <div>
          <Paper>
  <MaterialTable
      title="Previous Details"
      columns={columns}
      data={data}       
     onRowClick={(event,rowData)=>handleRowClick(event,rowData)}
      options={{
        maxBodyHeight: '600px', // Adjust height as needed
        maxBodyWidth: '600px', // Adjust width as needed
        headerStyle: {
          fontWeight: 'bold',
        },
        exportButton: true,
        // pageSize: 50, // Set the initial page size to 100
        // pageSizeOptions: [100,300,400], // Provide an array of possible page sizes
        paging: false, // Disable pagination
        search: true,
        filtering:true
      }}
     

    /> 
    </Paper>
          </div>
      
    </div>



             </div>
    </div>
    )
}

export default Monthlyreport


