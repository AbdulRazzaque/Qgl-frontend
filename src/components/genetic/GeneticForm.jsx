import React, { useEffect, useState } from "react";
import "./genetic.css"; // updated styles (see below)
import {
  Button,
  Card,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from "dayjs";
import Barcode from "../barcode/Barcode";
import GeneticBarcode from "../barcode/GeneticBarcode";
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
    uid: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    camel: makeEmptyPerson(),
    father: makeEmptyPerson(),
    mother: makeEmptyPerson(),
  };
}

export default function GeneticFormImproved({data}) {
  const [customer, setCustomer] = useState({
    name: "",
    tel: "",
    submissionDate: "",
    sampleType: "Blood",
    processing: "Normal",
  });

  useEffect(()=>{
    if(data){
        setCustomer({
        name: data.name || "",
        tel: data.telephone || "",
        submissionDate: data.microchip || "",
        sampleType: "Blood",
        processing: "Normal",
      });
    }
  },[data])
  const [animals, setAnimals] = useState([makeEmptyRecord()]);
 const [age, setAge] = useState('');
  // --- customer handlers
  function updateCustomer(field, value) {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  }

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
    setAnimals((prev) => prev.filter((r) => r.uid !== uid));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Basic validation example (visual only). You can extend as needed.
    const missingCustomer = !customer.name || !customer.tel;
    if (missingCustomer) {
      alert("Customer name and telephone required.");
      return;
    }
    const payload = { customer, animals };
    console.log("Submitting payload:", payload);
    alert("Form submitted — open console for payload");
  }
  

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div className="gen-container py-4">
      <form onSubmit={handleSubmit} className="gen-card">
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
                Member No: <span className="gen-meta-strong">QRAX36</span>
              </div>
              <div>
                Receipt: <span className="gen-meta-strong">29210</span>
              </div>
              <div>
                Amount: <span className="gen-meta-strong">850.00 QAR</span>
              </div>
            </div>
          </header>

          {/* Top details */}
          <section className="row g-3">
            <div className="col-lg-10">
              <div className="row g-2 align-items-center">
                <Typography className="col-sm-3 col-form-label ">
                  Customer Name
                </Typography>
                <div className="col-sm-9">
                  <TextField
                    label="Owner Name"
                    value={customer.name}
                    sx={{ width: 500 }}
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
                    sx={{ width: 500 }}
                    placeholder="+974 5xx xxxxx"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>

                <Typography className="col-sm-3 col-form-label ">
                  TelePhone Number
                </Typography>
                <div className="col-sm-9">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ width: 500 }}
                      label="Date of Microchip implementation"
                      value={dayjs( customer.submissionDate)}
                      format="DD/MM/YYYY"
                      // onChange={(newValue) => {
                      //   setMicrochip(newValue);
                      // }}
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
                      defaultValue='blood'
                      name="row-radio-buttons-group"
                    >
                      <FormControlLabel
                        value="blood"
                        control={<Radio />}
                        label="Blood"
                      />
                      <FormControlLabel
                        value="hair"
                        control={<Radio />}
                        label="Hair"
                      />
                      <FormControlLabel
                        value="others"
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
                      defaultValue='normal'
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
                <div>
                </div>
              </div>
            </div>
          
 <div className="col-2">
  <div className="barcode-wrapper">
    {data && <GeneticBarcode data={data} />}
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
                      ID: {rec.uid.slice(-6)}
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="outlined" color="error" startIcon={<DeleteIcon color="error"/>}
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
  <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: 3 }}>
    Animal Information
  </Typography>

  <div className="row">
    {[
      { key: "camel", title: "Camel Information" },
      { key: "father", title: "Father Information" },
      { key: "mother", title: "Mother Information" },
    ].map((col) => (
      <div key={col.key} className="col-md-4 mb-4">
        <Card sx={{ padding: 2, borderRadius: 2, boxShadow: 2 }}>
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
            <TextField
              label="Name"
              value={rec[col.key].name}
              onChange={(e) =>
                updateAnimal(rec.uid, col.key, "name", e.target.value)
              }
              fullWidth
              placeholder="Enter Camel Name"
            />
          </div>

          <div className="mb-2">
            <TextField
              label="Microchip"
              value={rec[col.key].id}
              onChange={(e) =>
                updateAnimal(rec.uid, col.key, "id", e.target.value)
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
          updateAnimal(rec.uid, col.key, "age", e.target.value)
        }
        fullWidth
        placeholder="Enter Age"
      />
    </div>
    <div className="col-6">
      <FormControl fullWidth>
        <InputLabel id={`sex-label-${rec.uid}`}>Sex</InputLabel>
        <Select
          labelId={`sex-label-${rec.uid}`}
          value={rec[col.key].sex}
          label="Sex"
          onChange={(e) =>
            updateAnimal(rec.uid, col.key, "sex", e.target.value)
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
        updateAnimal(rec.uid, col.key, "age", e.target.value)
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
                updateAnimal(rec.uid, col.key, "breed", e.target.value)
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
                updateAnimal(rec.uid, col.key, "owner", e.target.value)
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
                updateAnimal(rec.uid, col.key, "labNo", e.target.value)
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
              <Button variant="contained" type="submit"color="success" className="mx-2">
                Submit
              </Button>
              {/* <Button
                variant="contained"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setCustomer({
                    name: "",
                    tel: "",
                    submissionDate: "",
                    sampleType: "Blood",
                    processing: "Normal",
                  });
                  setAnimals([makeEmptyRecord()]);
                }}
              >
                Reset
              </Button> */}
            </div>
          </footer>
        </div>
      </form>
    </div>
  );
}
