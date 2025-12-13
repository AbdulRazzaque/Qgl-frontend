import React, { useEffect, useState } from 'react'
import { Button, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useForm } from 'react-hook-form';
import { useCreateReceipt, useReceipts } from './useReceipts';
import config from '../login/Config';
import { useAutocompleteMembers } from '../membership/useMembers';
import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
import SaveIcon from "@mui/icons-material/Save";
import { ToastContainer } from 'react-toastify';


const ReceiptForm = () => {



  const mutation = useCreateReceipt();
  const [microchip, setMicrochip] = useState([]);

  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const [category, SetCategory] = React.useState("");
  const [duplicate, setDuplicate] = useState(1);
  const [doc, setDocNo] = React.useState(0);
  const [inputValue, setInputValue] = useState(""); // user ke typing ke liye
  const { data: members = [], isLoading, isError } = useAutocompleteMembers(inputValue);

  const { data: receipts = [], } = useReceipts();


  const { register, handleSubmit, formState: { errors } ,reset} = useForm();

  const onSubmit = async (formValues) => {
    const payload = {
      ...formValues,
      userName: config?.accessToken,
      date: selectedDate,
      membership: selectedMember?.membershipno,
      name: selectedMember?.ownername,
      telephone: selectedMember?.telephone,
      microchip,
      category,
      duplicate,
      doc,
    };

      mutation.mutate(payload, {
    onSuccess: () => {
      // Reset React Hook Form fields
      reset();

      // Reset local state fields
      setSelectedMember(null);
      setSelectedDate(dayjs());
      setMicrochip([]);
      SetCategory("");
      setDuplicate(1);
      setDocNo(0);
    },
  });
  };

  const handleChange = (event) => {
    SetCategory(event.target.value);
  };


  useEffect(()=>{
    if(receipts?.nextDocNo){
      setDocNo(receipts.nextDocNo)
    }
  },[receipts])

  return (
    <div>
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row my-3 ">

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
              InputProps={{
                readOnly: true, // Makes it readonly
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
              options={members}
              loading={isLoading}
              getOptionLabel={(option) =>
                option?.membershipno && option?.ownername
                  ? `${option.membershipno} - ${option.ownername}`
                  : ""
              }
              isOptionEqualToValue={(option, value) =>
                option.membershipno === value?.membershipno
              }
              value={selectedMember}
              onChange={(event, newValue) => setSelectedMember(newValue)}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
              sx={{ width: 500 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Member"
                  error={isError}
                  helperText={isError ? "Failed to fetch members" : ""}
                />
              )}
            />
          </div>
        </div>
        <div className="row my-3 ">
          <div className="col ">
            <TextField
              label="Owner Name"
              value={selectedMember ? selectedMember.ownername : ""}
              sx={{ width: 500 }}
              InputProps={{
                readOnly: true, // Make position field read-only
              }}
            />
          </div>
        </div>
        <div className="row my-3 ">
          <div className="col ">
            <TextField
              label="Telephone"
              value={selectedMember ? selectedMember.telephone : ""}
              sx={{ width: 500 }}
              disabled
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
              label="The Amount Paid"
              variant="outlined"
              required
              inputProps={{ min: 1 }}
              autoComplete="off"
              {...register("amount", { required: true })}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, ''); // Remove any non-numeric characters
                e.target.value = value;
              }}
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
              required
              {...register('duplicate', { required: "This field is required", min: 1 })}
              error={!!errors.duplicate}
              helperText={errors.duplicate ? errors.duplicate.message : ''}
              value={duplicate}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if ((value >= 1 && value <= 30) || e.target.value === "") {
                  setDuplicate(e.target.value);
                }
              }}
              inputProps={{ min: 1, max: 30 }}
              autoComplete="off"
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
            type="submit"
            disabled={mutation.isPending}
          >
            {" "}
            <SaveIcon className="mr-1" />
            {mutation.isPending ? "Saving..." : "Submit"}
          </Button>
        </Stack>
      </form>
      <div
        style={{ textAlign: "left", position: "relative", bottom: "35px" }}
      >

      </div>
    </div>

  )
}

export default ReceiptForm

