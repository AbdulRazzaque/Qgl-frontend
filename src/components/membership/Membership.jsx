import React, { Fragment, useEffect, useState } from "react";
import "../Home.scss";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Dashhead from "../Dashhead";
import {  Dialog, DialogActions, DialogContent, DialogTitle,Tooltip } from "@mui/material";
import {useForm} from 'react-hook-form'
import axios from "axios";
import readXlsxFile from "read-excel-file";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { saveAs } from 'file-saver';
import MaterialTable from 'material-table';
import GetAppIcon from '@mui/icons-material/GetApp';
import * as XLSX from 'xlsx'
import Paper from '@mui/material/Paper';
import { ToastContainer, toast } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';
const Membership = () => {
    const [display, setDisplay] = React.useState(false);
    const [data,setData]=useState([])
    const [showDialog, setShowDialog] = useState(false);
    const [alert, setAlert] = useState(false);
    const [update, setUpdate] = useState([]);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
    //--------------------------------------------------------- Get Data by date request ------------------------------------------------------------
   const url=process.env.REACT_APP_DEVELOPMENT; 
   const allData=()=>{
    axios.get(`${url}/api/getmembers`)
    .then(response=>{
         let arr = response.data.map((item,index)=>({
          ...item,
          id:index+1
        }))
      setData(arr)
    })
  }
  useEffect(()=>{
    allData()
  },[])
   //  ========================= Form Data submit api here ===========================================
    const onSubmit=async(data)=>{
      
   try{
  await axios.post(`${url}/api/addmembership`,data)
    
    .then(response=>{
     
      setData(response.data)
      reset()
    }).catch(error=>{
      toast(error.response.data,{
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      
    })
   }catch(error){
   console.log(error)
   }
   allData();
      }
  //  ========================= Exel Data submit api here ===========================================
  
  const upload = (e) => {
    try {
      console.log("inside upload");
      console.log(e.target.files[0]);
      let array = [];
      readXlsxFile(e.target.files[0]).then((rows) => {
        // console.log(rows)
        // setData(rows)

        rows.map((item, id) => {
          if (id !== 0) {
            let obj = {
              extratelelphone: item[5],
              telephone: item[4],
                        nationalid: item[3],
                        membershipno: item[0],
                        ownername: item[1],
                        nationality: item[2],
            };
            console.log(item,'item')
            axios
              .post(`${process.env.REACT_APP_DEVELOPMENT}/api/addmembership`, obj)
              .then((response) => {
                console.log("Response", response);
                setData(response.data);
                allData();
              }).catch(error=>{
                toast(error.response.data,{
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                });
                
              })
              setData(data);
            }
        });

        console.log(array);
        e.target.value = "";
      });
    } catch (error) {
      console.log(error);
    }
  };



// ------------------------------------------Row Data get  code here -------------------------------------------------------------

const handleRowClick=(event,rowData)=>{
  setUpdate(rowData)
}

// ------------------------------------------Update code api here -------------------------------------------------------------
const updateData=(e)=>{
  setUpdate({...update,[e.target.name]:e.target.value})
  console.log(update)
}

const updateRow = async()=>{
  try {
  await  axios.put(`${url}/api/updatamembers/${update._id}`,update)
    .then(response=>{
      console.log(response.data)
    })
    setShowDialog(false)
  } catch (error) {
    console.log(error)
    
  } 
  allData()
}
// =================================Delete api Here=================================================================
const deleteRow =async(update)=>{
  try{
    await axios.delete(`${url}/api/deletemembers/${update._id}`,update)
    .then(response=>{
      console.log(response.data)
      allData()
    })
    setAlert(false)
  }catch(error){
    console.log(error)
  }
}
  const columns = [
    { field: 'id', title: 'SNO', width: 50 },
    { field: 'membershipno', title: 'Member shipno', width: 50 },
    { field: 'ownername', title: 'Owner name', width: 50 },
    { field: 'nationality', title: 'Nationality', width: 130 },
    { field: 'nationalid', title: 'National Id', width: 100 },
    { field: 'telephone', title: 'Telephone', width: 100 },
    { field: 'extratelelphone', title: 'Extra telelphone', width: 100 },
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

  ];
  
// ============================================Xl code export=================================================================================

const handleExport = () => {
  const filteredData = data.map(item=>(item
    // return (itme)
  //   {
  //   membershipno:item.membershipno,
  //   ownername:item.ownername,
  //   nationalid:item.nationalid,
  //   nationality:item.nationality,
  //   telephone:item.telephone,
  //   extratelelphone:item.extratelelphone
  // }
))
  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'Members.xlsx');
};
  return (
    <div className="row">
    <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
      <Dashhead id={4} display={display} />
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
      <div>
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
            <label for="doc" class="form-label">Member Shipno</label>
            <input
              type="text"
              class="form-control"
              id="doc"
              name="membershipno"
              value={update.membershipno}
              onChange={updateData}
              required
            />
          </div>
        </div>
    

        <div class="col-12">
          <div class="mb-3">
            <label for="name" class="form-label">Owner Name</label>
            <input
              type="text"
              class="form-control"
              id="name"
              name="ownername"
              value={update.ownername}
              onChange={updateData}
              required
            />
          </div>
        </div>

        <div class="col-12">
          <div class="mb-3">
            <label for="amount" class="form-label">Nationality</label>
            <input
              type="text"
              class="form-control"
              id="amount"
              name="nationality"
              value={update.nationality}
              onChange={updateData}
              required
            />
          </div>
        </div>

        <div class="col-12">
          <div class="mb-3">
            <label for="membership" class="form-label">National Id</label>
            <input
              type="text"
              class="form-control"
              id="membership"
              name="nationalid"
              value={update.nationalid}
              onChange={updateData}
              required
            />
          </div>
        </div>

        <div class="col-12">
          <div class="mb-3">
            <label for="cash" class="form-label">Telephone</label>
            <input
              type="number"
              class="form-control"
              id="cash"
              name="telephone"
              value={update.telephone}
              onChange={updateData}
              required
            />
          </div>
        </div>

        <div class="col-12">
          <div class="mb-3">
            <label for="being" class="form-label">Extra telelphone</label>
            <input
              type="number"
              class="form-control"
              id="being"
              name="extratelelphone"
              value={update.extratelelphone}
              onChange={updateData}
            />
          </div>
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
     
        <h1 className="text-center attractive-header ">Members</h1>
        <ToastContainer />
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="form-outline mb-4">
              <input
                type="text"
                id="form4Example1"
                placeholder="Please Enter your membership number"
                className="form-control p-4"
                {...register('membershipno', { required: true })}
              />
              <label className="form-label" htmlFor="form4Example1">
                Membership No
              </label>
            </div>

            <div className="form-outline mb-4">
              <input
                type="text"
                id="form4Example2"
                placeholder="Please Enter your owner name"
                className="form-control p-4"
                {...register('ownername', { required: true })}
              />
              <label className="form-label" htmlFor="form4Example2">
                Owner Name
              </label>
            </div>

            <div className="form-outline mb-4">
              <input
                type="text"
                id="form4Example3"
                placeholder="Please Enter Nationality"
                className="form-control p-4"
                {...register('nationality', { required: true })}
              />
              <label className="form-label" htmlFor="form4Example3">
                Nationality
              </label>
            </div>

            <div className="form-outline mb-4">
              <input
                type="text"
                id="form4Example4"
                placeholder="Please Enter Nationality Id"
                className="form-control p-4"
                {...register('nationalid', { required: true })}
              />
              <label className="form-label" htmlFor="form4Example4">
                Nationality Id
              </label>
            </div>

            <div className="form-outline mb-4">
              <input
                type="number"
                id="form4Example5"
                placeholder="Please Enter Telephone"
                className="form-control p-4"
                {...register('telephone', { required: true })}
              />
              <label className="form-label" htmlFor="form4Example5">
                Telephone
              </label>
            </div>

            <div className="form-outline mb-4">
              <input
                type="number"
                id="form4Example6"
                placeholder="Please Enter Extra Telephone"
                className="form-control p-4"
                {...register('extratelelphone')}
              />
              <label className="form-label" htmlFor="form4Example6">
                Extra Telephone
              </label>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-6 mb-3 ">
                <button type="submit" className="btn btn-primary mx-3">
                  Submit
                </button>
               
              </div>
              <div className="custom-file">
        <input
          onChange={upload}
          accept=".xlsx,.xls,.csv"
          id="contained-button-file"
          type="file"
          className="custom-file-input d-none"
        />
        <label className="custom-file-label" htmlFor="contained-button-file">
          Choose file
        </label>
      </div>
     
            </div>
          </div>
        </div>
      </div>
    </form>
        </div>
        <div className='icondiv text-right my-3'>
      <Tooltip title="Export in xl"> <GetAppIcon className='exporticon' onClick={handleExport} /></Tooltip> 
        </div>
        <MaterialTable
      title="Members Details"
      columns={columns}
      data={data}       
     onRowClick={(event,rowData)=>handleRowClick(event,rowData)}
      options={{

        headerStyle: {
          fontWeight: 'bold',
        },
        exportButton: true,
        // paging: false, // Disable pagination
        search: true,
        filtering:true
      }}

      components={{
        Container: props => <Paper {...props} style={{ overflowX: 'auto' }} />,
      }}
    />
      </div>
      </div>
     
  )
}

export default Membership