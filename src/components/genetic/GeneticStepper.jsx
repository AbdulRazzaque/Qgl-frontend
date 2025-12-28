import React, { useEffect, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import Dashhead from "../Dashhead";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import { DataGrid } from "@mui/x-data-grid";
import Breadcrumb from "../ui/Breadcrumb";
import { useReceipts } from "../receipts/useReceipts";
import moment from "moment";
import GeneticForm from "./GeneticForm";


const GeneticStepper = () => {
  const [display, setDisplay] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [receipts, setReceipts] = useState([]);
const [selectedReceipt, setSelectedReceipt] = useState(null);
  const steps = [
    "Select master blaster campaign settings",
    "Create an ad group",
  ];

  const breadcrumbItems = [
    { title: "Genetic", link: "/Genetic" },
    { title: "Genetic Submit Form", link: "/Genetic/GeneticStepper" },
  ];



  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "doc", headerName: "Doc", width: 80 },
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
      valueGetter: (param) =>
        param.row.microchip
          ? moment.parseZone(param.row.microchip).local().format("DD/MM/YYYY")
          : "",
    },
  ];

  const handleNext = () =>
    setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));
  const handleReset = () => setActiveStep(0);

  const { data, isLoading, isError } = useReceipts();
 
  useEffect(() => {
    if (data) {
      setReceipts(data.receipts);
    }
  }, [data]);
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

  return (
    <>
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <Dashhead id={5} display={display} />
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

          <h1 className="text-center attractive-header">
            Genetic Report Details
          </h1>

          <Breadcrumb items={breadcrumbItems} />

          {/* Stepper (labels only) */}
          <Box sx={{ width: "100%", mb: 2 }}>
         
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
              {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button onClick={handleReset}>Reset</Button>
                <Button variant="contained" color="success">
                  Finish
                </Button>
              </Box>
            )}
          {/* Step content area */}
          <Box sx={{ mt: 2 }}>
            {activeStep === 0 && (
              <>
                {/* Table for Step 1 */}
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Records table
                </Typography>

                <div style={{ height: 1000, width: "100%" }}>
                  <DataGrid
                    rows={receipts}
                    columns={columns}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                      },
                    }}
                    pageSizeOptions={[5, 10]}
                    onRowClick={(params)=>{
                      // setSelectedRow(params.row)
                      // navigate("/GeneticForm",{state:{ data:[params.row] } });
                      setSelectedReceipt(params.row);
                      setActiveStep(1)
                    }}
                   
                 
                    getRowId={(row) => row._id}
                  />
                </div>
              </>
            )}

            {activeStep === 1 && (
              <>
                {/* Simple text for Step 2 */}
                <Typography variant="h6" gutterBottom>
                  Step 2 — Selected Summary
                </Typography>
                <GeneticForm  data={selectedReceipt}/>
              </>
            )}
          </Box>

          {/* Step navigation buttons */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
          >
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>

           
          </Box>
        </div>
      </div>
    </>
  );
};

export default GeneticStepper;
