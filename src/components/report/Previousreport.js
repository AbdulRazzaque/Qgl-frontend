import React, { useEffect, useState } from "react";
import "./report.scss";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Dashhead from "../Dashhead";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Box,
  Button,
} from "@mui/material";
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import PrintIcon from "@mui/icons-material/Print";
import { useForm } from "react-hook-form";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

function Previousreport() {
  const [display, setDisplay] = useState(false);
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(false);
  const [value, setValue] = useState("");
  const [value1, setValue1] = useState("");
  const [update, setUpdate] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [updatedate, setupdatedate] = useState(dayjs());
  const [updateMicrochip, setupdateMicrochip] = useState(dayjs());
  const { handleSubmit } = useForm();
  const navigate = useNavigate();

  // fetch all rows
  const alldata = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/getReceipts`);
      const arr = (response.data || []).map((item, index) => ({
        ...item,
        doc: `\u200B${item.doc}`,
        // ensure unique id for DataGrid
        id:  index + 1,
      }));
      setData(arr);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    alldata();
  }, []);

  // update handlers
  const updateData = (e) => {
    setUpdate({ ...update, [e.target.name]: e.target.value });
  };

  const updateRow = async () => {
    try {
      const obj = {
        date: updatedate,
        microchip: updateMicrochip,
      };
      const combinedObj = { ...update, ...obj };
      await axios.put(
        `${process.env.REACT_APP_DEVELOPMENT}/api/updatereceipt/${update._id}`,
        combinedObj
      );
      setShowDialog(false);
      alldata();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // date-range submit
  const onSubmit = async (formValues) => {
    try {
      const payload = {
        from: dayjs(value).format("YYYY/MM/DD"),
        to: dayjs(value1).format("YYYY/MM/DD"),
        ...formValues,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_DEVELOPMENT}/api/monthlyreportQGl`,
        payload
      );
      setData(response.data.data || []);
    } catch (error) {
      console.error("onSubmit error:", error);
    }
  };

  // delete
  const deleteRow = async (upd) => {
    try {
      await axios.delete(`${process.env.REACT_APP_DEVELOPMENT}/api/deletereceipt/${upd._id}`);
      setAlert(false);
      alldata();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // print
  const clickPrintIcon = (row) => {
    navigate("/Receiptpdf", { state: { data: row } });
  };

  // row click
  const handleRowClick = (params) => {
    setUpdate(params.row);
  };

  // export to excel
  const handleExportExcel = (selectedRows = []) => {
    const handleMoment = (date) =>
      date ? moment.parseZone(date).local().format("DD/MM/YYYY hh:mm:ss A") : null;

    const rowsToExport = (selectedRows.length > 0 ? selectedRows : data).map((item) => ({
      Doc: item.doc,
      Date: handleMoment(item.date),
      Name: item.name,
      Amount: item.amount,
      Membership: item.membership,
      Telephone: item.telephone,
      "Payment Method": item.cash,
      Being: item.being,
      Category: item.category,
      Microchip: handleMoment(item.microchip),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rowsToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Previous Details.xlsx");
  };

  // DataGrid toolbar (search + export button)
  function CustomToolbar({ selectedRows }) {
    return (
      <GridToolbarContainer>
        <Box sx={{ flexGrow: 1 }}>
          <GridToolbarQuickFilter />
        </Box>

        <Button
          size="small"
          onClick={() => handleExportExcel(selectedRows)}
          variant="contained"
          sx={{ mr: 1 }}
        >
          Export Excel
        </Button>

        {/* <GridToolbarExport csvOptions={{ fileName: "previous-details" }} /> */}
      </GridToolbarContainer>
    );
  }

  // columns for DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "doc", headerName: "Doc", width: 90 },
    {
      field: "date",
      headerName: "Date",
      width: 130,
      valueGetter: (params) => params.row.date,
      renderCell: (params) => (params.value ? moment(params.value).format("DD/MM/YYYY") : ""),
    },
    { field: "name", headerName: "Name", width: 180 },
    { field: "amount", headerName: "Amount", width: 120 },
    { field: "membership", headerName: "Membership", width: 140 },
    { field: "telephone", headerName: "Telephone", width: 140 },
    { field: "cash", headerName: "Payment Method", width: 150 },
    { field: "being", headerName: "Being", width: 150 },
    { field: "category", headerName: "Category", width: 120 },
    {
      field: "microchip",
      headerName: "Microchip",
      width: 150,
      renderCell: (params) => (params.value ? moment(params.value).format("DD/MM/YYYY") : ""),
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            setUpdate(params.row);
            setShowDialog(true);
          }}
        >
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            setUpdate(params.row);
            setAlert(true);
          }}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
    {
      field: "print",
      headerName: "Print",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton onClick={() => clickPrintIcon(params.row)}>
          <PrintIcon />
        </IconButton>
      ),
    },
  ];

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  return (
    <div className="page-container">
      <div className="row ">
        <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <Dashhead id={2} display={display} />
        </div>

        <div
          className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 dashboard-container"
          onClick={() => display && setDisplay(false)}
        >
          <span className="iconbutton display-mobile">
            <IconButton size="large" aria-label="Menu" onClick={() => setDisplay(true)}>
              <MenuIcon fontSize="inherit" />
            </IconButton>
          </span>

          <h1 className="title text-center my-5">Previous Details</h1>

          <Container>
            {alert && (
              <div className="modal" style={{ display: alert ? "block" : "none" }}>
                <div className="modal-dialog" style={{ height: 600 }}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Delete Row</h5>
                    </div>
                    <div className="modal-body">
                      <p>Are you sure you want to delete this?</p>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => deleteRow(update)}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
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

            {/* Update dialog */}
            {update && (
              <Dialog open={showDialog} style={{ height: 600 }}>
                <DialogTitle>Update Data</DialogTitle>
                <DialogContent>
                  <form>
                    <div className="row">
                      <div className="col-6">
                        <div className="mb-3">
                          <label htmlFor="doc" className="form-label">
                            Doc No
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="doc"
                            name="doc"
                            value={update.doc || ""}
                            onChange={updateData}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-6 mt-4">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            name="date"
                            sx={{ width: 230 }}
                            label="Date"
                            value={update.date ? dayjs(update.date) : updatedate}
                            onChange={(newValue) => setupdatedate(newValue)}
                            format="DD/MM/YYYY"
                            renderInput={(params) => <TextField name="date" {...params} />}
                          />
                        </LocalizationProvider>
                      </div>

                      <div className="col-12">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            Received From Mr/Mrs
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={update.name || ""}
                            onChange={updateData}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="mb-3">
                          <label htmlFor="telephone" className="form-label">
                            Tele Phone
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="telephone"
                            name="telephone"
                            value={update.telephone || ""}
                            onChange={updateData}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="mb-3">
                          <label htmlFor="amount" className="form-label">
                            The Amount Paid
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="amount"
                            name="amount"
                            value={update.amount || ""}
                            onChange={updateData}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="mb-3">
                          <label htmlFor="membership" className="form-label">
                            Membership No
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="membership"
                            name="membership"
                            value={update.membership || ""}
                            onChange={updateData}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="mb-3">
                          <label htmlFor="category" className="form-label">
                            Category
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="category"
                            name="category"
                            value={update.category || ""}
                            onChange={updateData}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="mb-3">
                          <label htmlFor="cash" className="form-label">
                            Cash
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="cash"
                            name="cash"
                            value={update.cash || ""}
                            onChange={updateData}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="mb-3">
                          <label htmlFor="being" className="form-label">
                            Being for
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="being"
                            name="being"
                            value={update.being || ""}
                            onChange={updateData}
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            name="microchip"
                            sx={{ width: 500 }}
                            format="DD/MM/YYYY"
                            label="Date of Microchip implementation"
                            value={update.microchip ? dayjs(update.microchip) : updateMicrochip}
                            onChange={(newValue) => setupdateMicrochip(newValue)}
                            renderInput={(params) => <TextField name="date" {...params} />}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" onClick={updateRow}>
                    Update
                  </Button>
                  <Button variant="contained" color="error" onClick={() => setShowDialog(false)}>
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </Container>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="row" spacing={2} margin="23px" justifyContent="center">
              <section>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: 300 }}
                    label="From"
                    format="DD/MM/YYYY"
                    views={["year", "month", "day"]}
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                    renderInput={(params) => <TextField name="date" {...params} />}
                  />
                </LocalizationProvider>
              </section>
              <section>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: 300 }}
                    label="To"
                    format="DD/MM/YYYY"
                    views={["year", "month", "day"]}
                    value={value1}
                    onChange={(newValue) => setValue1(newValue)}
                    renderInput={(params) => <TextField name="date" {...params} />}
                  />
                </LocalizationProvider>
              </section>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </Stack>
          </form>

          <Paper sx={{ height: 600, width: "100%", mt: 2 }}>
            <DataGrid
              rows={data}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 25]}
              checkboxSelection
              disableSelectionOnClick
              onRowClick={handleRowClick}
              onSelectionModelChange={(ids) => setSelectedRowIds(ids)}
              getRowId={(row) => row._id}
              components={{
                Toolbar: (props) => (
                  <CustomToolbar
                    selectedRows={selectedRowIds.map((id) => data.find((r) => r.id === id))}
                    {...props}
                  />
                ),
              }}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default Previousreport;
