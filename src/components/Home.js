import React, { Fragment, useEffect, useState } from "react";
import "./Home.scss";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Dashhead from "./Dashhead";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import Barcode from "./barcode/Barcode";
import {
  Autocomplete,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { set, useForm } from "react-hook-form";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import dayjs from "dayjs";
import date from "date-and-time";
import FormControl from "@mui/material/FormControl";
import Receiptpdf from "./Receiptpdf";
import _ from "lodash";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import crypto from 'crypto';
function Home() {
  const [display, setDisplay] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [alert, setAlert] = useState(false);
  const [value, setValue] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const [update, setUpdate] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [updatedate, setupdatedate] = React.useState(dayjs());
  const [updateMicrochip, setupdateMicrochip] = React.useState();
  const [owner, setOwner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectowner, setSelectedOwner] = useState([]);
  const [selectmemberno, setSelectedMemberNo] = useState([]);
  const [microchip, setMicrochip] = useState([]);
  const [doc, setDocNo] = React.useState(0);
  const [category, Setcategory] = React.useState("");
  const [duplicate, setDuplicate] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [count, setCount] = useState();
  const [selectedRows,setSelectedRows]= useState([])
  const [selectedData,setSelectedData]= useState([])
  const [error, setError] = useState(null);
  const history = useHistory();
  const url = process.env.REACT_APP_DEVELOPMENT;

  const handleBarcodeClick = () => {
    if (selectedRows) {
        history.push('/Barcode',{data:selectedData});
    }
};

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
    { field: "telephone", headerName: "Tele Phone", width: 130 },
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
    { field: 'name', headerName: 'Name', width: 150 },
    
 
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
    // {
    //   title: "Print",
    //   field: "Print",
    //   width: 100,
    //   renderCell: (params) => (
    //     <Fragment>
    //       <Button color="success" onClick={() => clickPrintIcon(params.row)}>
    //         <PrintIcon />
    //       </Button>
    //     </Fragment>
    //   ),
    // },
  ];

  // ------------------------------------------Post api here -------------------------------------------------------------

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();
  const location = useLocation();


  const onSubmit = async (data, action) => {
    if (action === "save") {
      var obj = {
        userName:location.state.name,
        date: selectedDate,
        membership: selectmemberno.membershipno,
        name: selectmemberno.ownername,
        telephone: selectmemberno.telephone,
        microchip: microchip,
        category: category,
        duplicate: duplicate,
        doc,
        ...data,
      };
      try {
        await axios
          .post(`${process.env.REACT_APP_DEVELOPMENT}/api/qgl`, obj)
          .then((response) => {
            // setCount(count + 1);
            // setCount((prevCount) => prevCount + 1);
            console.log( obj,"Data saved successfully");
            reset();
          })
          .catch((error) => {
            toast(error.response.data, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          });
      } catch (error) {
        console.log(error, "This is error");
      }
    } else if (action === "print") {
      var obj = {
        date: selectedDate,
        membership: selectmemberno.membershipno,
        name: selectmemberno.ownername,
        telephone: selectmemberno.telephone,
        microchip: microchip,
        category: category,
        duplicate: duplicate,
        doc,
        ...data,
      };
      const combinedObj = { ...data, ...obj };
      try {
        await axios
          .post(`${process.env.REACT_APP_DEVELOPMENT}/api/qgl`, obj)
          .then((response) => {
            // setCount((prevCount) => prevCount + 1);
            history.push("/Receiptpdf", { data: combinedObj });
            reset();
          })
          .catch((error) => {
            toast(error.response.data, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          });
      } catch (error) {
        console.log(error, "This is error");
      }
    }

    alldata();
  };

  // const {register,handleSubmit}=useForm();
  const handleSaveButtonClick = () => {
    // Trigger the form submission with the 'save' action
    handleSubmit((formData) => onSubmit(formData, "save"))();
  };

  const handlePrintButtonClick = () => {
    // Trigger the form submission with the 'print' action
    handleSubmit((formData) => onSubmit(formData, "print"))();
  };

  // ------------------------------------------update api here -------------------------------------------------------------

  const updateData = (e) => {
    setUpdate({ ...update, [e.target.name]: e.target.value });
    console.log(update);
  };
  const updateRow = async () => {
    var obj = {
      date: updatedate,
      microchip: updateMicrochip,
      ...date,
    };

    const combinedObj = { ...update, ...obj };
    console.log(combinedObj);
    try {
      await axios
        .put(
          `${process.env.REACT_APP_DEVELOPMENT}/api/updatereceipt/${update._id}`,
          combinedObj
        )
        .then((response) => {
          console.log(response);
        });
      setShowDialog(false);
    } catch (error) {
      console.log(error);
    }
    alldata();
  };

  // ------------------------------------------Get api here -------------------------------------------------------------

  const alldata = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_DEVELOPMENT}/api/getreceipt`)
        .then((response) => {
          if (response.data.length > 0) {
            setDocNo(parseInt(response.data[0].doc) + 1);
          }
          let arr = response.data.map((item, index) => ({
            ...item,
            id: index + 1,
          }));

          setData(arr);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(data,'here i am cheack the data')

  // ------------------------------------------Delete api here -------------------------------------------------------------
  const deleteRow = async (update) => {
    try {
      await axios
        .delete(
          `${process.env.REACT_APP_DEVELOPMENT}/api/deletereceipt/${update._id}`,
          update
        )
        .then((response) => {
          console.log(response.data);
        });
      setAlert(false);
    } catch (error) {
      console.log(error);
    }
    alldata();
  };

  // ------------------------------------------Click print  api here -------------------------------------------------------------

  const clickPrintIcon = () => {
      history.push("/Receiptpdf",{ data:selectedData});
  };
  // ------------------------------------------Mulitplel print functionaltiy -------------------------------------------------------------
  const handleSelectionModelChange = (ids) => {
    // Filter data based on selected IDs
    const selecterowdData = data.filter(row => ids.includes(row._id));
    setSelectedData(selecterowdData);
    setSelectedRows(ids);
    console.log(selectedData,"Data"); // Logs the selected row data
    console.log(selectedRows,"row"); // Logs the selected row data
  
}
  // ------------------------------------------Membership owner code  api here -------------------------------------------------------------

  const handleInputChange = async (event, newInputValue) => {
    setInputValue(newInputValue);

    if (newInputValue.length > 0) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${url}/api/autocompleteMembers?q=${newInputValue}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOwner(data);
      } catch (error) {
        console.error('Error calling API:', error);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    } else {
      setOwner([]);
      setLoading(false);
      setError(null);
    }
  };

  useEffect(() => {
    alldata();
    deleteRow();
  }, []);
// ====================================================================Category select Code Here ======================================
  const handleChange = (event) => {
    Setcategory(event.target.value);
  };
  // ====================================================================Cheack Boxd selection Delete row  Code Here ======================================
  
const handleDeleteRow = async (selectedRows) => {
  try {
    await axios.delete(`${url}/api/deletereceipts/${selectedRows}`
    ).then(response=>console.log(response.data))
    alldata();
    setAlert(false)
  } catch (error) {
    console.log(error);
  }
};

// ====*******************************************************************************End*************************************************************************************************************************************************************
  // console.log(doc, "this is Doc NO"); 
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
            {/* this is multple row data detel  */}
            {alert && (
              <Dialog open={alert} style={{ height: 600 }}>
                <DialogTitle>Delete Row</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are You sure You want to delete this.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" onClick={() => handleDeleteRow(selectedRows)}>
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
                    <div className="row "></div>
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
                            format="DD/MM/YYYY"
                            value={dayjs(update.date)}
                            onChange={(newValue) => {
                              setupdatedate(newValue);
                            }}
                            renderInput={(params) => (
                              <TextField name="date" {...params} />
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
                          label="Membership No"
                          variant="outlined"
                          type="text"
                          required
                          name="membership"
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
                          label="TelePhone"
                          variant="outlined"
                          name="telephone"
                          value={update.telephone}
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
                          name="amount"
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
                          label="category"
                          variant="outlined"
                          type="text"
                          required
                          name="category"
                          value={update.category}
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
                          name="cash"
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
                          name="being"
                          value={update.being}
                          onChange={updateData}
                        />
                      </div>
                    </div>
                    <div className="row my-3 ">
                      <div className="col ">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            name="microchip"
                            sx={{ width: 500 }}
                            label="Date of Microchip implementation"
                            // value={updateMicrochip}
                            format="DD/MM/YYYY"
                            value={update.microchip ? dayjs(update.microchip):''}
                            onChange={(newValue) => {
                              setupdateMicrochip(newValue);
                            }}
                            // onChange={updateData}
                            renderInput={(params) => (
                              <TextField name="date" {...params} />
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
          <ToastContainer />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row my-3 ">
              <h1 className="text-center attractive-header ">
                Qatar Genetic Lab
              </h1>
            </div>
            <div className="row my-3 ">
              <div className="col ">
                <TextField
                  id="outlined-basic"
                  sx={{ width: 230 }}
                  //  disabled
                  value={doc}
                  variant="outlined"
                  onChange={(e) => {
                    setDocNo(e.target.value);
                  }}
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
                      setSelectedDate(newValue);
                    }}
                    required
                    renderInput={(params) => (
                      <TextField name="date" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="row my-3 ">
              <div className="col ">
     <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={owner}
      onChange={(event, newValue) => {
        setSelectedMemberNo(newValue);
      }}
      getOptionLabel={(ownerName) =>
        `${ownerName.membershipno} ${ownerName.ownername}`
      }
      inputValue={inputValue}
      onInputChange={handleInputChange}
      loading={loading}
      sx={{ width: 500 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Membership No"
          required
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <span>Loading...</span>}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />

              </div>
            </div>
            <div className="row my-3 ">
              <div className="col ">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  // value={supplierId}
                  // onChange={(event, newValue) => {
                  //   setSelectedOwner(newValue);
                  // }}
                  disabled
                  getOptionLabel={(ownerName) => `${ownerName.ownername}`}
                  value={selectmemberno ? selectmemberno : { ownername: "" }}
                  options={owner}
                  sx={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Owner Name" />
                  )}
                />
              </div>
            </div>
            <div className="row my-3 ">
              <div className="col ">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  // value={supplierId}
                  // onChange={(event, newValue) => {
                  //   setSelectedOwner(newValue);
                  // }}
                  disabled
                  getOptionLabel={(ownerName) => `${ownerName.telephone}`}
                  value={selectmemberno ? selectmemberno : { telephone: "" }}
                  options={owner}
                  sx={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Tele phone" />
                  )}
                />
              </div>
            </div>
            <div className="row my-3 ">
              <div className="col ">
                <FormControl sx={{ width: 500 }}>
                  <InputLabel id="demo-simple-select-label">
                    category
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    label="category"
                    onChange={handleChange}
                  >
                    <MenuItem value="Private">Private</MenuItem>
                    <MenuItem value="Blood parasite">Blood parasite</MenuItem>
                    <MenuItem value="Committee">Committee</MenuItem>
                  </Select>
                </FormControl>
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
                  {...register("amount", { required: true })}
                />
              </div>
            </div>
            <div className="row my-3 ">
              <div className="col">
                <TextField
                  id="outlined-basic"
                  sx={{ width: 500 }}
                  value="ATM"
                  label="Payment Method"
                  variant="outlined"
                  required
                  // {...register("cash")}

                  {...register("cash", { required: true })}
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

                  {...register("being", { required: true })}
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
                    format="DD/MM/YYYY"
                    onChange={(newValue) => {
                      setMicrochip(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField name="date" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="row my-3 ">
              <div className="col ">
                <TextField
                  id="outlined-basic"
                  sx={{ width: 230 }}
                  label="Duplicate"
                  variant="outlined"
                  type="number"
                  value={duplicate}
                  onChange={(e) => setDuplicate(e.target.value)}
                />
              </div>
            </div>
            <Stack
              spacing={2}
              direction="row"
              marginBottom={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                color="success"
                onClick={handleSaveButtonClick}
              >
                {" "}
                <SaveIcon className="mr-1" /> Save Form
              </Button>
            </Stack>
          </form>
          <div
            style={{ textAlign: "left", position: "relative", bottom: "35px" }}
          >
            {/* <Button variant="contained" onClick={handlePrintButtonClick}>
              <PrintIcon className="mr-1" /> Print Form
            </Button> */}
          </div>
        </div>
        <div className="my-3">
        {/* <Button variant="contained" color="error"  disabled={selectedRows.length === 0} onClick={() => setAlert(true)}> Delete Rows  <DeleteIcon/></Button> */}
        <Button variant="contained" color="success" disabled={selectedData.length === 0} className="mx-5" onClick={() => clickPrintIcon()}> select Pritn <LibraryAddCheckIcon className="mx-2"/></Button>
        <Button variant="contained" disabled={selectedData.length === 0} className="" onClick={handleBarcodeClick}> select Barcode <QrCode2Icon className="mx-2"/></Button>
        </div>

        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            onRowClick={(item) => setUpdate(item.row)}
            checkboxSelection
            getRowId={(row)=>row._id}
            onSelectionModelChange={handleSelectionModelChange}
            
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
