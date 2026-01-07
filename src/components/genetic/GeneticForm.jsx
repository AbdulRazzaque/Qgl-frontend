import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import "./genetic.css"; // updated styles (see below)
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import GeneticBarcode from "../barcode/GeneticBarcode";
import { useGetFatherCamels } from "../camel/useCamel";
import { toast } from "react-toastify";
import { useCreateGeneticRecord,useUpdateGeneticRecord } from "./useGenetic";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";


function makeEmptyPerson() {
  return {
    name: "",
    id: "",
    age: "",
    sex: "",
    breed: "",
    owner: "",
    labNo: "",
  };
}


function makeEmptyRecord() {
  return {
    uid: uuidv4(),
    camel: makeEmptyPerson(),
    father: makeEmptyPerson(),
    mother: makeEmptyPerson(),
  };
}


export default function GeneticForm({ data }) {
  // Determine mode
  const mode = data && data.mode === 'update' ? 'update' : 'create';
console.log(data?.receiptId,'data customer')
console.log(data,'data')
  const [customer, setCustomer] = useState({
    name: "",
    tel: "",
    submissionDate: "",
    sampleType: "Blood",
    processing: "Normal",
  });

  const [animals, setAnimals] = useState([makeEmptyRecord()]);
 
  const navigate = useNavigate();
useEffect(() => {
  if (mode === "update" && data?.receiptId) {
    // UPDATE MODE (GeneticRecord + populated Receipt)
    setCustomer({
      name: data.receiptId.name || "",
      tel: data.receiptId.telephone || "",
      submissionDate: data.receiptId.microchip || "",
      sampleType: data.sampleType || "Blood",
      processing: data.processing || "Normal",
    });

    // Ensure each animal has a unique uid
    let usedUids = new Set();
    const animalsWithUid = (Array.isArray(data.animals) && data.animals.length > 0
      ? data.animals
      : [makeEmptyRecord()]
    ).map(animal => {
      let uid = animal.uid && !usedUids.has(animal.uid) ? animal.uid : uuidv4();
      usedUids.add(uid);
      return { ...animal, uid };
    });
    setAnimals(animalsWithUid);
  } else if (data) {
    // CREATE MODE (Receipt selected from stepper)
    setCustomer({
      name: data.name || "",
      tel: data.telephone || "",
      submissionDate: data.microchip || "",
      sampleType: "Blood",
      processing: "Normal",
    });

    setAnimals([makeEmptyRecord()]);
  }
}, [data, mode]);
  // --- customer handlers


  // --- animal handlers (section is 'camel' | 'father' | 'mother')
  function updateAnimal(uid, section, field, value) {
    setAnimals((prev) =>
      prev.map((rec) => {
        if (rec.uid !== uid) return rec;
        return { ...rec, [section]: { ...rec[section], [field]: value } };
      })
    );
  }

  function addAnimal() {
    setAnimals((prev) => [...prev, makeEmptyRecord()]);
  }

  function removeAnimal(uid) {
    setAnimals((prev) => {
      if (prev.length === 1) return prev; // Prevent removing last
      return prev.filter((r) => r.uid !== uid);
    });
  }
const { mutateAsync: createRecord, isLoading:isCreating } = useCreateGeneticRecord();
const { mutateAsync: updateRecord, isLoading:isUpdating } = useUpdateGeneticRecord();


  const [openDialog, setOpenDialog] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Array.isArray(animals) || animals.length === 0) {
      toast.error("At least one animal record is required");
      return;
    }

    if (mode === "update") {
      setPendingSubmit({});
      setOpenDialog(true);
      return;
    }

    // CREATE MODE
    if (!data?._id) {
      toast.error("Receipt not selected");
      return;
    }

    try {
      const payload = {
        receiptId: data._id, // receipt id
        animals,
        sampleType: customer.sampleType,
        processing: customer.processing,
      };
      await createRecord(payload);
      navigate("/Genetic");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Operation failed"
      );
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setPendingSubmit(null);
  };

  const handleDialogConfirm = async () => {
    setOpenDialog(false);
    try {
      const payload = {
        animals,
        sampleType: customer.sampleType,
        processing: customer.processing,
      };
      await updateRecord({
        id: data._id, // GeneticRecord id
        payload,
      });
      navigate("/Genetic");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Operation failed"
      );
    }
    setPendingSubmit(null);
  };


  const handleCamelSelect = (uid, section) => (event, newValue) => {
    if (newValue) {
      updateAnimal(uid, section, "name", newValue.camelName || "");
      updateAnimal(uid, section, "id", newValue.microChipId || "");
      updateAnimal(uid, section, "labNo", newValue.labNO || "");
      updateAnimal(uid, section, "owner", newValue.ownerName || "");
      updateAnimal(uid, section, "breed", newValue.breed || "");
    } else {
      updateAnimal(uid, section, "name", "");
      updateAnimal(uid, section, "id", "");
      updateAnimal(uid, section, "labNo", "");
      updateAnimal(uid, section, "owner", "");
      updateAnimal(uid, section, "breed", "");
    }
  };

  const {
    data: fatherCamelData,
    isLoading: fatherCamelLoading,
    error: fatherCamelError,
  } = useGetFatherCamels();


  const fatherOptions = fatherCamelData?.data || [];

  const mapBarcodeData = (data) => {
      if (!data) return null;

  // UPDATE MODE (genetic record)
  if (data.receiptId) {
    return {
      name: data.receiptId.name || "",
      membership:data.receiptId.membership ||  "",        // not available in genetic record
      doc: data.receiptId.doc || "",
      amount: data.receiptId.amount || "",
      date: data.receiptId.date || "",
      telephone: data.receiptId.telephone || "",
      microchip: data.receiptId.microchip || "",
      userName: data.receiptId.userName || "",
    };
  }

  // CREATE MODE (receipt)
  return data;
  }

  return (
    <div className="gen-container py-4">
      <form onSubmit={handleSubmit} className="gen-card">
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Confirm Update</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to update this record?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              No
            </Button>
            <Button onClick={handleDialogConfirm} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <div className="gen-card-body">
          <header className="gen-header d-flex justify-content-between align-items-start mb-3">
            <div>
              <h3 className="gen-title mb-1">Genetic Sample Request</h3>
              <p className="text-muted small mb-0">
                Fill sample details. Har column ka data independent hai — pehle
                camel, phir father & mother.
              </p>
            </div>

            <div className="text-end text-muted small gen-meta">
              <div>
                Member No: <span className="gen-meta-strong">{data.membership || data?.receiptId?.membership || "N/A"}</span>
              </div>
              <div>
                Receipt: <span className="gen-meta-strong">{data.doc || data?.receiptId?.doc || "N/A"}</span>
              </div>
              <div>
                Amount: <span className="gen-meta-strong">{ data.amount || data?.receiptId?.amount || "N/A"} QAR</span>
              </div>
            </div>
          </header>

          {/* Top details */}
          <section className="row g-3">
            <div className="col-lg-8">
              <div className="row g-2 align-items-center">
                <Typography className="col-sm-3 col-form-label ">
                  Customer Name
                </Typography>
                <div className="col-sm-9">
                  <TextField
                    label="Owner Name"
                    value={customer.name}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>

                <Typography className="col-sm-3 col-form-label ">
                  TelePhone Number
                </Typography>
                <div className="col-sm-9 my-3">
                  <TextField
                    label="TelePhone Number"
                    value={customer.tel}
                    fullWidth
                    placeholder="+974 5xx xxxxx"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>

                <Typography className="col-sm-3 col-form-label ">
                  Date of Microchip
                </Typography>
                <div className="col-sm-9">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ width: "100%" }}
                      label="Date of Microchip implementation"
                      value={dayjs(customer.submissionDate)}
                      format="DD/MM/YYYY"
                      renderInput={(params) => (
                        <TextField name="date" {...params} />
                      )}
                    />
                  </LocalizationProvider>
                </div>
                <Typography className="col-sm-3 col-form-label ">
                  Sample Type
                </Typography>
                <div className="col-sm-9">
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="sampleType"
                      value={customer.sampleType}
                      onChange={(e) =>
                        setCustomer((prev) => ({
                          ...prev,
                          sampleType: e.target.value,
                        }))
                      }
                    >
                      <FormControlLabel
                        value="Blood"
                        control={<Radio />}
                        label="Blood"
                      />
                      <FormControlLabel
                        value="Hair"
                        control={<Radio />}
                        label="Hair"
                      />
                      <FormControlLabel
                        value="Others"
                        control={<Radio />}
                        label="Others"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
                <Typography className="col-sm-3 col-form-label ">
                  Sample processing
                </Typography>
                <div className="col-sm-9">
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      defaultValue="normal"
                    >
                      <FormControlLabel
                        value="normal"
                        control={<Radio />}
                        label="Normal"
                      />
                      <FormControlLabel
                        value="urgent"
                        control={<Radio />}
                        label="Urgent"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
            </div>

            <div className="col-lg-4 d-flex align-items-start justify-content-center">
              <div className="barcode-wrapper">
                 {data && <GeneticBarcode data={mapBarcodeData(data)} />}
              </div>
            </div>
          </section>

          {/* Animal records */}
          <section className="mt-4">
            {animals.map((rec, idx) => (
              <div key={rec.uid} className="gen-record card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center gen-record-head">
                  <div>
                    <h4>Request #{idx + 1}</h4>
                    <span className="badge bg-secondary ms-2">
                      ID: {rec.uid ? rec.uid.slice(-6) : '------'}
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon color="error" />}
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeAnimal(rec.uid)}
                      disabled={animals.length === 1}
                      title={
                        animals.length === 1
                          ? "At least one request required"
                          : "Remove this request"
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                <Card sx={{ padding: 3, boxShadow: 4, borderRadius: 3 }}>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 3,
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Animal Information
                    </Typography>

                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Verify"
                      />
                    </FormGroup>
                  </Box>
                  <div className="row">
                    {[
                      { key: "camel", title: "Camel Information" },
                      { key: "father", title: "Father Information" },
                      { key: "mother", title: "Mother Information" },
                    ].map((col) => (
                      <div key={col.key} className="col-md-4 mb-4">
                        <Card
                          sx={{ padding: 2, borderRadius: 2, boxShadow: 2 }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              marginBottom: 2,
                              borderBottom: "1px solid #ccc",
                              paddingBottom: 1,
                            }}
                          >
                            {col.title}
                          </Typography>

                          <div className="mb-2">

                            <Autocomplete
                              disablePortal
                              options={fatherOptions}
                              loading={fatherCamelLoading}
                              error={fatherCamelError}
                              getOptionLabel={(option) => `${option.camelName} - ${option.microChipId}` || ""}
                              value={
                                fatherOptions.find(
                                  (c) => c.camelName === rec[col.key].name
                                ) || null
                              }
                              
                              onChange={handleCamelSelect(rec.uid, col.key)}
                              fullWidth
                              renderInput={(params) => (
                                <TextField {...params} label="Search Camel Name" required />
                              )}
                            />

                          </div>

                          <div className="mb-2">
                            <TextField
                              label="Microchip"
                              value={rec[col.key].id}
                              onChange={(e) =>
                                updateAnimal(
                                  rec.uid,
                                  col.key,
                                  "id",
                                  e.target.value
                                )
                              }
                              fullWidth
                              placeholder="Enter Microchip"
                            />
                          </div>
                          {col.key === "camel" ? (
                            // For camel: show Age and Sex side-by-side
                            <div className="row mb-2">
                              <div className="col-6">
                                <TextField
                                  label="Age"
                                  value={rec[col.key].age}
                                  onChange={(e) =>
                                    updateAnimal(
                                      rec.uid,
                                      col.key,
                                      "age",
                                      e.target.value
                                    )
                                  }
                                  fullWidth
                                  placeholder="Enter Age"
                                />
                              </div>
                              <div className="col-6">
                                <FormControl fullWidth>
                                  <InputLabel id={`sex-label-${rec.uid}`}>
                                    Sex
                                  </InputLabel>
                                  <Select
                                    labelId={`sex-label-${rec.uid}`}
                                    value={rec[col.key].sex}
                                    label="Sex"
                                    onChange={(e) =>
                                      updateAnimal(
                                        rec.uid,
                                        col.key,
                                        "sex",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                  </Select>
                                </FormControl>
                              </div>
                            </div>
                          ) : (
                            // For father and mother: only Age (full width)
                            <div className="mb-2">
                              <TextField
                                label="Age"
                                value={rec[col.key].age}
                                onChange={(e) =>
                                  updateAnimal(
                                    rec.uid,
                                    col.key,
                                    "age",
                                    e.target.value
                                  )
                                }
                                fullWidth
                                placeholder="Enter Age"
                              />
                            </div>
                          )}

                          <div className="mb-2">
                            <TextField
                              label="Breed"
                              value={rec[col.key].breed}
                              onChange={(e) =>
                                updateAnimal(
                                  rec.uid,
                                  col.key,
                                  "breed",
                                  e.target.value
                                )
                              }
                              fullWidth
                              placeholder="Enter Breed"
                            />
                          </div>

                          <div className="mb-2">
                            <TextField
                              label="Owner"
                              value={rec[col.key].owner}
                              onChange={(e) =>
                                updateAnimal(
                                  rec.uid,
                                  col.key,
                                  "owner",
                                  e.target.value
                                )
                              }
                              fullWidth
                              placeholder="Enter Owner Name"
                            />
                          </div>

                          <div>
                            <TextField
                              label="Lab No"
                              value={rec[col.key].labNo}
                              onChange={(e) =>
                                updateAnimal(
                                  rec.uid,
                                  col.key,
                                  "labNo",
                                  e.target.value
                                )
                              }
                              fullWidth
                              placeholder="Enter Lab Number"
                            />
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ))}

            <div className="d-flex align-items-center gap-2">
              <Button
                variant="contained"
                onClick={addAnimal}
                className="btn btn-primary btn-sm"
              >
                + Add another request
              </Button>
            </div>
          </section>

          <footer className="mt-4 d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Note: Required fields are marked.
            </small>
            <div>
<Button
  variant="contained"
  type="submit"
  color="success"
disabled={
  isCreating ||
  isUpdating ||
  !animals ||
  animals.length === 0
}
  startIcon={
    (isCreating || isUpdating) && (
      <CircularProgress size={18} color="inherit" />
    )
  }
>
  {mode === "update" ? "Update" : "Submit"}
</Button>
            </div>
          </footer>
        </div>
      </form>
    </div>
  );
}
