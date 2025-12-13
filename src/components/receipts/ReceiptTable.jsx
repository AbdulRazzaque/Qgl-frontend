import React, { Fragment, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import {  Box, Button, CircularProgress, Dialog, Typography } from '@mui/material';
import moment from 'moment';
import { useReceipts } from './useReceipts';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateReceipt from './UpdateReceip';
import DeleteReceipt from './DeleteReceipt';

import QrCode2Icon from '@mui/icons-material/QrCode2';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import { useNavigate } from 'react-router-dom';
import config from '../login/Config';
const ReceiptTable = () => {
    const [selectedData,setSelectedData]= useState([])
    const [receipts,setReceipts]= useState([])
    const [selectedRows,setSelectedRows] = useState([])
  //  const [selectedReceipt, setSelectedReceipt] = useState(null);
      const [dialog, setDialog] = useState({
      open: false,
      type: null,   
      data: null,        
    });


    const { data, isLoading, isError } = useReceipts();
    const navigate = useNavigate()


    useEffect(()=>{
      if(data){
        setReceipts(data.receipts)
      }
    },[data])
  // handle empty or error states
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography color="error">Error loading receipts</Typography>
      </Box>
    );
  }

  const columns = [
  { field: "id", headerName: "ID", width: 50 },
  { field: "doc", headerName: "Doc", width: 80 },
  // { field: 'date', headerName: 'Date', width: 130 },
  {
    headerName: "Date",
    field: "date",
    width: 130,
    renderCell: (param) =>
    moment.parseZone(param.value).local().format("DD/MM/YYYY"),
  },
  { field: "name", headerName: "Name", width: 150 },
  { field: "membership", headerName: "Membership", width: 130 },
  { field: "telephone", headerName: "TelePhone", width: 130 },
  { field: "amount", headerName: "Amount", width: 100 },
  { field: "cash", headerName: "Payment Method", width: 130 },
  { field: "being", headerName: "Being", width: 130 },
  { field: "category", headerName: "Category", width: 130 },
  {
    headerName: "Microchip ",
    field: "microchip",
    width: 150,
    // valueGetter: (param) =>
      // moment.parseZone(param.value !== null ?.local().format("DD/MM/YYYY") :"" ),
      valueGetter:(param)=>param.row.microchip ? moment.parseZone(param.row.microchip).local().format("DD/MM/YYYY"):""
  },

  

  {
    title: "Action",
    field: "Action",
    width: 100,
    renderCell: (params) => (
      <Fragment>
        <Button onClick={() => openDialog("edit", params.row)}>
          <EditIcon />
        </Button>
      </Fragment>
    ),
  },
  {
    title: "Delete",
    field: "Delete",
    width: 100,
    renderCell: (params) => (
      <Fragment>
        <Button color="error" onClick={() =>openDialog("delete", params.row._id)}>
          <DeleteIcon />
        </Button>
      </Fragment>
    ),
  },
 
];

  const openDialog = (type, data) => {
    setDialog({ open: true, type, data });
  };

  const closeDialog = () => {
    setDialog({ open: false, type: null, data: null });
  };

  const handleSelectionModelChange = (ids) => {
    const selectedRowData = data.receipts.filter(row => ids.includes(row._id));
    setSelectedData(selectedRowData);
    setSelectedRows(ids);
}

  const handleBarcodeClick = () => {
    if (selectedRows) {
      navigate("/Barcode", { state: { data: selectedData } });
};
  }
  const clickPrintIcon = () => {
    if(selectedRows){
      navigate("/Receiptpdf",{state:{ data:selectedData } });
    }
  };



  return (
<>

<div className="my-3">
         { config.accessToken === "M.Radwan" ?  
         <Button variant="contained" color="error"  disabled={selectedRows.length === 0} onClick={() => openDialog("delete", selectedRows)}> Delete Rows  <DeleteIcon/></Button>
          :""}
       
        <Button variant="contained" color="success" disabled={selectedData.length === 0} className="mx-5" onClick={() => clickPrintIcon()}> select Pritn <LibraryAddCheckIcon className="mx-2"/></Button>
        <Button variant="contained" disabled={selectedData.length === 0} className="" onClick={handleBarcodeClick}> select Barcode <QrCode2Icon className="mx-2"/></Button>
        </div>

     <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={receipts}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            // onRowClick={(item) => setUpdate(item.row)}
            checkboxSelection
            getRowId={(row)=>row._id}
            onSelectionModelChange={handleSelectionModelChange}
            
          />

               <Dialog
        open={dialog.open}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        {dialog.type === "edit" && (
          <UpdateReceipt selectedReceipt={dialog.data} onClose={closeDialog} />
        )}

        {dialog.type === "delete" && (
          <DeleteReceipt
            selectedReceipt={dialog.data}
            onClose={closeDialog}
          />
        )}
      </Dialog>
      
        </div>
</>
  )
}

export default ReceiptTable