import React, { Fragment, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useGeneticRecord, useDeleteGeneticRecord } from "./useGenetic";
import moment from "moment";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const GeneticTable = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGeneticRecord();
  const [openDialog, setOpenDialog] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const { mutateAsync: deleteGeneticRecord, isLoading: isDeleting } = useDeleteGeneticRecord();
  const handleDelete = async (id) => {
    await deleteGeneticRecord(id);
    setOpenDialog(false);
    setPendingDeleteId(null);
  };

  if (isLoading) {
    return <p>Loading genetic records...</p>;
  }

  if (error) {
    return <p>Error loading data</p>;
  }

  const records = data?.data || [];
  const rows = records.map((item, index) => ({
    id: index + 1,
    ...item,
  }));

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
       { field: "createdAt", headerName: "Date", width: 150 , valueGetter: (params) =>
        params.row?.createdAt ? moment.parseZone(params.row.createdAt).local().format("YYYY-MM-DD")  : "N/A",},
    {
      field: "name", headerName: "Customer", width: 230, valueGetter: (params) =>
        params.row?.receiptId?.name || "N/A",
    },
    { field: "telephone", headerName: "Telephone", width: 160,valueGetter: (params) =>
        params.row?.receiptId?.telephone || "N/A", },
    {
      field: "sampleType",
      headerName: "Sample Type",
      width: 160,
      valueGetter: (params) =>
        params.row?.sampleType || "N/A",
    },
    {field: "processing", headerName: "Processing", width: 150,valueGetter: (params) =>
        params.row?.processing || "N/A"}, 
    {field: "submissionDate", headerName: "Submission Date", width: 150,valueGetter: (params) =>
      moment.parseZone(params.row?.customer?.submissionDate).local().format("YYYY-MM-DD") || "N/A"}, 
      {
    title: "Action",
    field: "Action",
    width: 100,
    renderCell: (params) => (
      <Fragment>
        <Button onClick={() => navigate("/Genetic/GeneticStepper", { state: { ...params.row, mode: 'update' } })}>
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
        <Button color="error" onClick={() => {
          setPendingDeleteId(params.row._id);
          setOpenDialog(true);
        }}>
          <DeleteIcon />
        </Button>
      </Fragment>
    ),
  },
 

  ];

  return (
    <>
      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Paper>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            No
          </Button>
          <Button onClick={() => handleDelete(pendingDeleteId)} color="error" autoFocus disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Yes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GeneticTable;
