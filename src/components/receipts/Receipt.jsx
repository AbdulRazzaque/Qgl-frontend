import React from 'react'
import Dashhead from '../Dashhead'
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import ReceiptForm from './ReceiptForm';
import ReceiptTable from './ReceiptTable';
function Receipt() {
     const [display, setDisplay] = React.useState(false);
  return (
    <div className="row">
      <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <Dashhead id={1} display={display} />
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
        <h1 className="text-center attractive-header ">Qatar Genetic Lab</h1>
        <ReceiptForm/>
        <ReceiptTable/>  
        </div>
        </div>
  )
}

export default Receipt