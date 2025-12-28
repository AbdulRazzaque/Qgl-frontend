import React, { useRef, useState } from "react";
import readXlsxFile from "read-excel-file";
import { toast } from "react-toastify";
import { useGetFatherCamels, useImportFatherCamel } from "./useCamel";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import Dashhead from "../Dashhead";

const FatherCamel = () => {
  const fileInputRef = useRef(null);
  const [loadingBulk, setLoadingBulk] = useState(false);
  const importMutation = useImportFatherCamel();
  const [display, setDisplay] = useState(false);

 const upload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    setLoadingBulk(true);

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File too large. Max 20MB allowed.");
      return;
    }

    const rows = await readXlsxFile(file);
    if (!rows || rows.length <= 1) {
      toast.warn("Excel file is empty or invalid.");
      return;
    }

    const camels = [];
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i] || [];
      camels.push({
        ownerName: String(r[0] || "").trim(),
        camelName: String(r[1] || "").trim(),
        microChipId: String(r[2] || "").trim(),
        labNO: String(r[3] || "").trim(),
        breed: String(r[4] || "").trim(),
        category: String(r[5] || "").trim(),
      });
    }

    console.log('Parsed camels:', camels.length, camels);

    const missing = camels.findIndex(
      (c) => !c.ownerName || !c.camelName
    );
    if (missing !== -1) {
      const missingCamel = camels[missing];
      const missingFields = [];
      if (!missingCamel.ownerName) missingFields.push('ownerName');
      if (!missingCamel.camelName) missingFields.push('camelName');
      console.error(`Row ${missing + 2} is missing:`, missingFields.join(', '), missingCamel);
      toast.error(`Required fields missing at row ${missing + 2}: ${missingFields.join(', ')}`);
      return;
    }

    // ✅ CHUNK UPLOAD
    const chunkSize = 500; // 500 rows per request
    let uploaded = 0;

    console.log('Starting chunk upload:', camels.length);
    for (let i = 0; i < camels.length; i += chunkSize) {
      const chunk = camels.slice(i, i + chunkSize);
      console.log('Uploading chunk:', i, 'to', i + chunkSize, 'size:', chunk.length);
      await importMutation.mutateAsync(chunk);
      uploaded += chunk.length;
      toast.info(`Uploaded ${uploaded}/${camels.length}`, {
        autoClose: 1000,
      });
    }

    toast.success(`All ${camels.length} camels imported successfully.`);
  } catch (err) {
    console.error('Upload failed:', err);
    toast.error("Upload failed.");
  } finally {
    e.target.value = "";
    setLoadingBulk(false);
  }
};


  // ✅ GET API
  const { data, isLoading, error } = useGetFatherCamels();

  const rows = (data?.data || []).map((r, index) => ({
    id: index + 1,
    ...r,
  }));

 const columns = [
  { field: "id", headerName: "SNO", width: 80 },
  { field: "ownerName", headerName: "Owner Name", width: 260 },
  { field: "camelName", headerName: "Camel Name", width: 220 },
  {
    field: "microChipId",
    headerName: "Microchip",
    width: 200,
    valueFormatter: (params) => `${params.value}`, // ✅ Excel ko text force karega
  },
  { field: "labNO", headerName: "Lab No", width: 140 },
  { field: "breed", headerName: "Breed", width: 140 },
  { field: "category", headerName: "Category", width: 260 },
];


  return (
    <div className="row">
      <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <Dashhead id={6} display={display} />
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

        <h1 className="text-center attractive-header">Father Camels</h1>

        {/* Upload */}
        <div className="custom-file" style={{ marginBottom: 16 }}>
          {/* <input
            ref={fileInputRef}
            onChange={upload}
            accept=".xlsx,.xls,.csv"
            id="contained-button-file"
            type="file"
            className="custom-file-input d-none"
            disabled={loadingBulk}
          /> */}
          {/* <label
            className="custom-file-label"
            htmlFor="contained-button-file"
            style={{ cursor: "pointer" }}
          >
            {loadingBulk ? "Uploading..." : "Choose file"}
          </label> */}
        </div>

        {/* DataGrid */}
        <Paper sx={{ height: 1000, width: "100%" }} className="my-5">
         <DataGrid
  rows={rows}
  columns={columns}
  pageSize={25}
  rowsPerPageOptions={[10, 25, 50, 100]}
  loading={isLoading}
  disableSelectionOnClick
  getRowId={(row) => row.id}
  components={{
    Toolbar: GridToolbar,
  }}
  componentsProps={{
    toolbar: {
      csvOptions: {
        utf8WithBom: true,   // ✅ Arabic fix
        fileName: "father_camels",
      },
    },
  }}
/>

        </Paper>

        {error && <div style={{ color: "red" }}>Error loading data</div>}
      </div>
    </div>
  );
};

export default FatherCamel;
