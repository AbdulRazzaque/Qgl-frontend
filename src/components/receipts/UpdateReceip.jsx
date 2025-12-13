import React, { useState } from 'react'
import { Button} from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useUpdateReceipt } from './useReceipts';

const UpdateReceipt = ({selectedReceipt, onClose }) => {
const [update, setUpdate] = useState(selectedReceipt || {});
  const [updateDate, setUpdateDate] = useState();
  const [updateMicrochip,setUpdateMicrochip]=useState();

  const mutation = useUpdateReceipt();


   const updateData = (e) => {
    setUpdate({ ...update, [e.target.name]: e.target.value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...update,
      date: updateDate,
      microchip: updateMicrochip,
    };

    mutation.mutate(
      { id: update._id, payload },
      {
        onSuccess: () => {
          onClose(); // close dialog/modal
        },
      }
    );
  };
  return (
    <div>

        
      
             
                  <form  onSubmit={handleSubmit}>
                    <div className="row "></div>
                    <div className="row  ">
                      <div className="col ">
                        <TextField
                          id="outlined-basic"
                          sx={{ width: 230 }}
                          label="Doc No"
                          variant="outlined"
                          name="doc"
                          value={update.doc}
                          onChange={updateData}
                          required
                        />
                      </div>
                      <div className="col ">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            name="date"
                            sx={{ width: 230 }}
                            label="Date"
                            format="DD/MM/YYYY"
                            value={update.date ? dayjs(update.date):''}
                            onChange={(newValue) => {
                              setUpdateDate(newValue);
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
                          sx={{ width: 500 }}
                          label="Membership No"
                          variant="outlined"
                          type="text"
                          required
                          name="membership"
                          value={update.membership}
                          onChange={updateData}
                        />
                      </div>
                    </div>
                    <div className="row my-3 ">
                      <div className="col ">
                        <TextField
                          id="outlined-basic"
                          sx={{ width: 500 }}
                          label="Received From Mr/Mrs"
                          variant="outlined"
                          name="name"
                          value={update.name}
                          onChange={updateData}
                          required
                        />
                      </div>
                    </div>
                    <div className="row my-3 ">
                      <div className="col ">
                        <TextField
                          id="outlined-basic"
                          sx={{ width: 500 }}
                          label="TelePhone"
                          variant="outlined"
                          name="telephone"
                          value={update.telephone}
                          onChange={updateData}
                          required
                        />
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
                          name="amount"
                          value={update.amount}
                          onChange={updateData}
                        />
                      </div>
                    </div>
                    
                    <div className="row my-3 ">
                      <div className="col ">
                        <TextField
                          id="outlined-basic"
                          sx={{ width: 500 }}
                          label="category"
                          variant="outlined"
                          type="text"
                          required
                          name="category"
                          value={update.category}
                          onChange={updateData}
                        />
                      </div>
                    </div>
                    <div className="row my-3 ">
                      <div className="col ">
                        <TextField
                          id="outlined-basic"
                          sx={{ width: 500 }}
                          label="Cash"
                          variant="outlined"
                          // type="number"
                          required
                          name="cash"
                          value={update.cash}
                          onChange={updateData}
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
                          name="being"
                          value={update.being}
                          onChange={updateData}
                        />
                      </div>
                    </div>
                    <div className="row my-3 ">
                      <div className="col ">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            name="microchip"
                            sx={{ width: 500 }}
                            label="Date of Microchip implementation"
                            // value={updateMicrochip}
                            format="DD/MM/YYYY"
                            value={update.microchip ? dayjs(update.microchip):''}
                            onChange={(newValue) => {
                              setUpdateMicrochip(newValue);
                            }}
                            // onChange={updateData}
                            renderInput={(params) => (
                              <TextField name="date" {...params} />
                            )}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  </form>
              
             
                  <Button type="submit" variant="contained" onClick={handleSubmit}>
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                   onClick={onClose}
                  >
                    Cancel
                  </Button>
           
         
    </div>
  )
}

export default UpdateReceipt