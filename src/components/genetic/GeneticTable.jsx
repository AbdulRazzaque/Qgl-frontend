import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useGeneticRecord } from "./useGenetic";
import moment from "moment";


const GeneticTable = () => {
  const {
    data,
    isLoading,
    error,
  } = useGeneticRecord();

  if (isLoading) {
    return <p>Loading genetic records...</p>;
  }

  if (error) {
    return <p>Error loading data</p>;
  }

  const records = data?.data || [];
  console.log(records.customer)
  const rows = records.map((item, index) => ({
    id: index + 1,
    ...item,
  }));

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
       { field: "createdAt", headerName: "Date", width: 150 },
    {
      field: "customerName", headerName: "Customer", width: 180, valueGetter: (params) =>
        params.row?.customer?.name || "N/A",
    },
    { field: "tel", headerName: "Telephone", width: 160,valueGetter: (params) =>
        params.row?.customer?.tel || "N/A", },
    {
      field: "sampleType",
      headerName: "Sample Type",
      width: 160,
      valueGetter: (params) =>
        params.row?.customer?.sampleType || "N/A",
    },
    {field: "processing", headerName: "Processing", width: 150,valueGetter: (params) =>
        params.row?.customer?.processing || "N/A"}, 
    {field: "submissionDate", headerName: "Submission Date", width: 150,valueGetter: (params) =>
      moment.parseZone(params.row?.customer?.submissionDate).local().format("YYYY-MM-DD") || "N/A"}, 
  ];

  return (
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
  );
};

export default GeneticTable;
