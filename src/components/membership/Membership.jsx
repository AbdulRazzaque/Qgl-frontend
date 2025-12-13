// Membership.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import "../Home.scss";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Dashhead from "../Dashhead";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Paper,
  Box,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import readXlsxFile from "read-excel-file";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { saveAs } from "file-saver";
import GetAppIcon from "@mui/icons-material/GetApp";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarExport,
} from "@mui/x-data-grid";

const Membership = () => {
  const [display, setDisplay] = useState(false);
  const [data, setData] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [alert, setAlert] = useState(false);
  const [update, setUpdate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingBulk, setLoadingBulk] = useState(false);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, reset } = useForm();

  const url = process.env.REACT_APP_DEVELOPMENT;

  // fetch members
  const allData = useCallback(async () => {
    try {
      const resp = await axios.get(`${url}/api/getmembers`);
      const arr = (resp.data || []).map((item, index) => ({
        ...item,
        // ensure DataGrid unique id
        id: index + 1,
      }));
      setData(arr);
    } catch (err) {
      console.error("getmembers error", err);
      toast.error("Failed to load members list", { theme: "dark" });
    }
  }, [url]);

  useEffect(() => {
    allData();
  }, [allData]);

  // submit single member
  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const payload = {
        membershipno: String(formData.membershipno || "").trim(),
        ownername: String(formData.ownername || "").trim(),
        nationality: formData.nationality || "",
        nationalid: formData.nationalid || "",
        telephone: formData.telephone ? String(formData.telephone).trim() : "",
        extratelelphone: formData.extratelelphone ? String(formData.extratelelphone).trim() : "",
      };

      const resp = await axios.post(`${url}/api/addmembership`, payload);
      toast.success("Member added successfully.", { theme: "dark" });
      if (resp && resp.data) {
        allData();
      }
      reset();
    } catch (error) {
      const msg = error?.response?.data?.message || error?.response?.data || error.message || "Error while adding member";
      toast.error(String(msg), { theme: "dark" });
    } finally {
      setSubmitting(false);
    }
  };

  // bulk upload
  const upload = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setLoadingBulk(true);

      const rows = await readXlsxFile(file);
      if (!rows || rows.length <= 1) {
        toast.warn("Excel file is empty or invalid.", { theme: "dark" });
        e.target.value = "";
        setLoadingBulk(false);
        return;
      }

      const members = [];
      for (let i = 1; i < rows.length; i++) {
        const item = rows[i] || [];
        members.push({
          membershipno: item[0] !== undefined && item[0] !== null ? String(item[0]).trim() : "",
          ownername: item[1] !== undefined && item[1] !== null ? String(item[1]).trim() : "",
          nationality: item[2] !== undefined && item[2] !== null ? String(item[2]).trim() : "",
          nationalid: item[3] !== undefined && item[3] !== null ? String(item[3]).trim() : "",
          telephone: item[4] !== undefined && item[4] !== null ? String(item[4]).trim() : "",
          extratelelphone: item[5] !== undefined && item[5] !== null ? String(item[5]).trim() : "",
        });
      }

      // required field check
      const missing = members.findIndex((m) => !m.membershipno || !m.ownername);
      if (missing !== -1) {
        toast.error(
          <div style={{ lineHeight: "1.4" }}>
            <strong>⚠️ Required fields missing!</strong>
            <br />
            Please fill <b>Membership No</b> and <b>Owner Name</b> at <b>Row {missing + 2}</b>.
          </div>,
          { theme: "dark", autoClose: 7000 }
        );
        e.target.value = "";
        setLoadingBulk(false);
        return;
      }

      // duplicates inside file
      const mapRows = new Map();
      for (let i = 0; i < members.length; i++) {
        const no = members[i].membershipno;
        const rowNumber = i + 2;
        if (!mapRows.has(no)) mapRows.set(no, []);
        mapRows.get(no).push(rowNumber);
      }
      const dupesArray = [];
      for (const [membershipno, rowsArr] of mapRows.entries()) {
        if (rowsArr.length > 1) dupesArray.push({ membershipno, rows: rowsArr });
      }
      if (dupesArray.length > 0) {
        dupesArray.slice(0, 50).forEach((d, idx) => {
          setTimeout(() => {
            toast.error(
              <div style={{ lineHeight: "1.2" }}>
                <strong>{d.membershipno}</strong>
                <div style={{ fontSize: 12 }}>Duplicate in file at rows: {d.rows.join(", ")}</div>
              </div>,
              { theme: "dark", autoClose: 4500 }
            );
          }, idx * 200);
        });
        e.target.value = "";
        setLoadingBulk(false);
        return;
      }

      // send bulk
      try {
        const res = await axios.post(`${url}/api/addmemberships`, { members });
        const payload = res?.data;
        if (payload && typeof payload === "object" && payload.code === "BULK_MEMBERS_RESULT") {
          const added = Number(payload.insertedCount || 0);
          const skipped = Number(payload.skippedCount || 0);
          toast.success(`Uploaded: ${added} new member(s). Skipped: ${skipped} existing.`, { theme: "dark" });
        } else if (Array.isArray(payload)) {
          toast.success(`Uploaded: ${payload.length} new member(s).`, { theme: "dark" });
        } else {
          toast.success("Bulk upload completed.", { theme: "dark" });
        }
        allData();
      } catch (err) {
        const dataErr = err?.response?.data;
        if (dataErr && typeof dataErr === "object" && dataErr.code === "DUPLICATE_MEMBERS" && Array.isArray(dataErr.duplicates)) {
          const dups = dataErr.duplicates;
          dups.slice(0, 50).forEach((no, idx) => {
            setTimeout(() => {
              toast.error(
                <div style={{ lineHeight: "1.2" }}>
                  <strong>{String(no)}</strong>
                  <div style={{ fontSize: 12 }}>Already exists in database.</div>
                </div>,
                { theme: "dark", autoClose: 4500 }
              );
            }, idx * 200);
          });
        } else if (typeof dataErr === "string") {
          toast.error(dataErr, { theme: "dark" });
        } else {
          toast.error("Upload failed due to server or network error.", { theme: "dark" });
        }
      } finally {
        e.target.value = "";
        setLoadingBulk(false);
      }
    } catch (error) {
      console.error("upload error:", error);
      toast.error("Unexpected error occurred.", { theme: "dark" });
      e.target.value = "";
      setLoadingBulk(false);
    }
  };

  // update handlers
  const handleRowClick = (params) => {
    setUpdate(params.row);
  };

  const updateData = (e) => {
    setUpdate({ ...update, [e.target.name]: e.target.value });
  };

  const updateRow = async () => {
    try {
      await axios.put(`${url}/api/updatamembers/${update._id}`, update);
      toast.success("Row updated", { theme: "dark" });
      setShowDialog(false);
      allData();
    } catch (error) {
      console.error("update error", error);
      toast.error("Update failed", { theme: "dark" });
    }
  };

  const deleteRow = async (updateRowObj) => {
    try {
      await axios.delete(`${url}/api/deletemembers/${updateRowObj._id}`);
      toast.success("Row deleted", { theme: "dark" });
      setAlert(false);
      allData();
    } catch (error) {
      console.error("delete error", error);
      toast.error("Delete failed", { theme: "dark" });
    }
  };

  // export
  const handleExport = (selectedRows = []) => {
    const filteredData = (selectedRows.length > 0 ? selectedRows : data).map((item) => ({
      membershipno: item.membershipno,
      ownername: item.ownername,
      nationality: item.nationality,
      nationalid: item.nationalid,
      telephone: item.telephone,
      extratelelphone: item.extratelelphone,
    }));
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Members.xlsx");
  };

  // DataGrid toolbar
  function CustomToolbar({ selectedRows }) {
    return (
      <GridToolbarContainer>
        <Box sx={{ flexGrow: 1 }}>
          <GridToolbarQuickFilter />
        </Box>

        <Button size="small" onClick={() => handleExport(selectedRows)} variant="contained" sx={{ mr: 1 }}>
          Export Excel
        </Button>

        <GridToolbarExport csvOptions={{ fileName: "members" }} />
      </GridToolbarContainer>
    );
  }

  // columns
  const columns = [
    { field: "id", headerName: "SNO", width: 80 },
    { field: "membershipno", headerName: "Membership No", width: 160 },
    { field: "ownername", headerName: "Owner Name", width: 200 },
    { field: "nationality", headerName: "Nationality", width: 140 },
    { field: "nationalid", headerName: "National Id", width: 140 },
    { field: "telephone", headerName: "Telephone", width: 140 },
    { field: "extratelelphone", headerName: "Extra Telephone", width: 140 },
    {
      field: "edit",
      headerName: "Edit",
      width: 90,
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
  ];

  const [selectedRowIds, setSelectedRowIds] = useState([]);

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
          <IconButton size="large" aria-label="Menu" onClick={() => setDisplay(true)}>
            <MenuIcon fontSize="inherit" />
          </IconButton>
        </span>

        <div>
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
                    <button type="button" className="btn btn-primary" onClick={() => deleteRow(update)}>
                      Yes
                    </button>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setAlert(false)}>
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
                        <label htmlFor="membershipno" className="form-label">
                          Member Shipno
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="membershipno"
                          name="membershipno"
                          value={update.membershipno || ""}
                          onChange={updateData}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="mb-3">
                        <label htmlFor="ownername" className="form-label">
                          Owner Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="ownername"
                          name="ownername"
                          value={update.ownername || ""}
                          onChange={updateData}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="mb-3">
                        <label htmlFor="nationality" className="form-label">
                          Nationality
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="nationality"
                          name="nationality"
                          value={update.nationality || ""}
                          onChange={updateData}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="mb-3">
                        <label htmlFor="nationalid" className="form-label">
                          National Id
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="nationalid"
                          name="nationalid"
                          value={update.nationalid || ""}
                          onChange={updateData}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="mb-3">
                        <label htmlFor="telephone" className="form-label">
                          Telephone
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
                        <label htmlFor="extratelelphone" className="form-label">
                          Extra telephone
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="extratelelphone"
                          name="extratelelphone"
                          value={update.extratelelphone || ""}
                          onChange={updateData}
                        />
                      </div>
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
        </div>

        <h1 className="text-center attractive-header ">Members</h1>
        <ToastContainer />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="form-outline mb-4">
                  <input
                    type="text"
                    placeholder="Please Enter your membership number"
                    className="form-control p-4"
                    {...register("membershipno", { required: true })}
                  />
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    placeholder="Please Enter your owner name"
                    className="form-control p-4"
                    {...register("ownername", { required: true })}
                  />
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    placeholder="Please Enter Nationality"
                    className="form-control p-4"
                    {...register("nationality", { required: true })}
                  />
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    placeholder="Please Enter Nationality Id"
                    className="form-control p-4"
                    {...register("nationalid", { required: true })}
                  />
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    placeholder="Please Enter Telephone"
                    className="form-control p-4"
                    {...register("telephone", { required: true })}
                  />
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    placeholder="Please Enter Extra Telephone"
                    className="form-control p-4"
                    {...register("extratelelphone")}
                  />
                </div>

                <div className="row justify-content-center">
                  <div className="col-md-6 mb-3 ">
                    <button type="submit" className="btn btn-primary mx-3" disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>

                  <div className="custom-file">
                    <input
                      ref={fileInputRef}
                      onChange={upload}
                      accept=".xlsx,.xls,.csv"
                      id="contained-button-file"
                      type="file"
                      className="custom-file-input d-none"
                      disabled={loadingBulk}
                    />
                    <label className="custom-file-label" htmlFor="contained-button-file" style={{ cursor: "pointer" }}>
                      {loadingBulk ? "Uploading..." : "Choose file"}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="icondiv text-right my-3">
          <Tooltip title="Export in xl">
            <GetAppIcon className="exporticon" onClick={() => handleExport(selectedRowIds.map((id) => data.find((r) => r.id === id)))} />
          </Tooltip>
        </div>

        <div className="my-5">
          <Paper sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={data}
              columns={columns}
              pageSize={25}
              rowsPerPageOptions={[10, 25, 50, 100]}
              checkboxSelection
              disableSelectionOnClick
              onRowClick={handleRowClick}
              onSelectionModelChange={(ids) => setSelectedRowIds(ids)}
              getRowId={(row) => row.id}
              components={{
                Toolbar: (props) => (
                  <CustomToolbar selectedRows={selectedRowIds.map((id) => data.find((r) => r.id === id))} {...props} />
                ),
              }}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Membership;
