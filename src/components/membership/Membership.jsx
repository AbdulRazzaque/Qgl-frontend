import React, { useEffect, useState, useCallback } from "react";
import "../Home.scss";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Dashhead from "../Dashhead";
import { Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from "@mui/material";
import { useForm } from 'react-hook-form'
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
  const [data, setData] = useState([])
  const [showDialog, setShowDialog] = useState(false);
  const [alert, setAlert] = useState(false);
  const [update, setUpdate] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingBulk, setLoadingBulk] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  //--------------------------------------------------------- Get Data by date request ------------------------------------------------------------
  const url = process.env.REACT_APP_DEVELOPMENT;

  // get all members
  const allData = useCallback(() => {
    axios
      .get(`${url}/api/getmembers`)
      .then((response) => {
        let arr = response.data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setData(arr);
      })
      .catch((err) => {
        console.error("getmembers error", err);
        toast("Failed to load members list");
      });
  }, [url]);

  useEffect(() => {
    allData();
  }, [allData]);

  //  ========================= Form Data submit api here ===========================================
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
      toast("Member added successfully.");
      // if backend returns created doc
      if (resp && resp.data) {
        // refresh list
        allData();
      }
      reset();
    } catch (error) {
      const msg = error?.response?.data || error.message || "Error while adding member";
      toast(msg, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
      });
    } finally {
      setSubmitting(false);
    }
  };
  //  ========================= Exel Data submit api here ===========================================
const upload = (e) => {
  try {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingBulk(true);

    readXlsxFile(file).then((rows) => {
      if (!rows || rows.length <= 1) {
        toast.warn("Excel file is empty or invalid.", { theme: "dark" });
        e.target.value = "";
        setLoadingBulk(false);
        return;
      }

      // build members array (skip header at index 0)
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

      // quick required-field check (first missing)
      const missing = members.findIndex((m) => !m.membershipno || !m.ownername);
      if (missing !== -1) {
        toast.error(
          <div style={{ lineHeight: "1.4" }}>
            <strong>⚠️ Required fields missing!</strong>
            <br />
            Please fill <b>Membership No</b> and <b>Owner Name</b> at <b>Row {missing + 2}</b>.
          </div>,
          { position: "top-right", autoClose: 7000, theme: "dark" }
        );
        e.target.value = "";
        setLoadingBulk(false);
        return;
      }

      // check duplicates INSIDE file and show each duplicate in separate toast
      const mapRows = new Map(); // membershipno -> [rowNumbers]
      for (let i = 0; i < members.length; i++) {
        const no = members[i].membershipno;
        const rowNumber = i + 2; // header is row 1
        if (!mapRows.has(no)) mapRows.set(no, []);
        mapRows.get(no).push(rowNumber);
      }

      const dupesArray = [];
      for (const [membershipno, rowsArr] of mapRows.entries()) {
        if (rowsArr.length > 1) dupesArray.push({ membershipno, rows: rowsArr });
      }

      if (dupesArray.length > 0) {
        // show each duplicate as separate toast with small stagger
        const MAX_TOASTS = 50; // cap to avoid flooding
        dupesArray.slice(0, MAX_TOASTS).forEach((d, idx) => {
          setTimeout(() => {
            toast.error(
              <div style={{ lineHeight: "1.2" }}>
                <strong>{d.membershipno}</strong>
                <div style={{ fontSize: 12 }}>Duplicate in file at rows: {d.rows.join(", ")} — upload cancelled.</div>
              </div>,
              { position: "top-right", autoClose: 4500, theme: "dark" }
            );
          }, idx * 200);
        });

        if (dupesArray.length > MAX_TOASTS) {
          setTimeout(() => {
            toast.info(`And ${dupesArray.length - MAX_TOASTS} more duplicate(s) not shown.`, { theme: "dark" });
          }, MAX_TOASTS * 200 + 250);
        }

        e.target.value = "";
        setLoadingBulk(false);
        return;
      }

      // send single bulk request to backend
      axios
        .post(`${process.env.REACT_APP_DEVELOPMENT}/api/addmemberships`, { members })
        .then((res) => {
          const data = res?.data;
          if (data && typeof data === "object" && data.code === "BULK_MEMBERS_RESULT") {
            const added = Number(data.insertedCount || 0);
            const skipped = Number(data.skippedCount || 0);
            toast.success(`Uploaded: ${added} new member(s). Skipped: ${skipped} existing.`, { theme: "dark" });
          } else if (Array.isArray(data)) {
            // backward: older API returned inserted docs array
            toast.success(`Uploaded: ${data.length} new member(s).`, { theme: "dark" });
          } else {
            toast.success("Bulk upload completed.", { theme: "dark" });
          }
          allData();
        })
        .catch((err) => {
          const data = err?.response?.data;

          // New structured error from backend
          if (data && typeof data === "object" && data.code === "DUPLICATE_MEMBERS" && Array.isArray(data.duplicates)) {
            const dups = data.duplicates;
            const MAX_TOASTS = 50;
            dups.slice(0, MAX_TOASTS).forEach((no, idx) => {
              setTimeout(() => {
                toast.error(
                  <div style={{ lineHeight: "1.2" }}>
                    <strong>{String(no)}</strong>
                    <div style={{ fontSize: 12 }}>Already exists in database. Upload cancelled.</div>
                  </div>,
                  { position: "top-right", autoClose: 4500, theme: "dark" }
                );
              }, idx * 200);
            });
            if (dups.length > MAX_TOASTS) {
              setTimeout(() => {
                toast.info(`And ${dups.length - MAX_TOASTS} more duplicate(s) not shown.`, { theme: "dark" });
              }, Math.min(dups.length, MAX_TOASTS) * 200 + 250);
            }
            return; // handled (older backend behavior)
          }

          // Backward compatibility: string message
          if (typeof data === "string") {
            toast.error(data, { theme: "dark" });
            return;
          }

          // fallback: network or unknown server error
          toast.error("Upload failed due to network or server issue.", { theme: "dark" });
        })
        .finally(() => {
          e.target.value = "";
          setLoadingBulk(false);
        });
    });
  } catch (error) {
    console.error("upload error:", error);
    toast.error("Unexpected error occurred.", { theme: "dark" });
    e.target.value = "";
    setLoadingBulk(false);
  }
};


  // ------------------------------------------Row Data get  code here -------------------------------------------------------------

  const handleRowClick = (event, rowData) => {
    setUpdate(rowData);
  };
  // ------------------------------------------Update code api here -------------------------------------------------------------
  const updateData = (e) => {
    setUpdate({ ...update, [e.target.name]: e.target.value })
  }

  const updateRow = async () => {
    try {
      await axios.put(`${url}/api/updatamembers/${update._id}`, update);
      toast("Row updated");
      setShowDialog(false);
      allData();
    } catch (error) {
      console.error("update error", error);
      toast("Update failed");
    }
  };

  // =================================Delete api Here=================================================================
  const deleteRow = async (updateRowObj) => {
    try {
      await axios.delete(`${url}/api/deletemembers/${updateRowObj._id}`);
      toast("Row deleted");
      setAlert(false);
      allData();
    } catch (error) {
      console.error("delete error", error);
      toast("Delete failed");
    }
  };

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
      export: false,
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
      export: false,
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
    const filteredData = data.map((item) => ({
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
                      <button type="submit" className="btn btn-primary mx-3" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                    <div className="custom-file">
                      <input onChange={upload} accept=".xlsx,.xls,.csv" id="contained-button-file" type="file" className="custom-file-input d-none" disabled={loadingBulk} />
                      <label className="custom-file-label" htmlFor="contained-button-file">
                        {loadingBulk ? "Uploading..." : "Choose file"}
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
        <div className="my-5">
          <MaterialTable
            title="Members Details"
            columns={columns}
            data={data}
            onRowClick={(event, rowData) => handleRowClick(event, rowData)}
            options={{

              headerStyle: {
                fontWeight: 'bold',
              },
              exportButton: true,
              pageSizeOptions: [100, 200, 500, 1000],
              // paging: false, // Disable pagination
              search: true,
              filtering: true
            }}

            components={{
              Container: props => <Paper {...props} style={{ overflowX: 'auto' }} />,
            }}
          />
        </div>
      </div>
    </div>

  )
}

export default Membership