import React from 'react'
import Dashhead from '../Dashhead'
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import GeneticTable from './GeneticTable';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";

const Genetic = () => {
    const [display, setDisplay] = React.useState(false);
      const navigate = useNavigate();
    return (
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

                <h1 className="text-center attractive-header ">Genetic Report Details</h1>

                <Box display="flex" className="my-3" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        sx={{ textTransform: 'none', width: '150px' }}
                        onClick={() =>navigate("/Genetic/GeneticStepper")}
                    >
                        Add New Entry
                    </Button>
                </Box>
                <GeneticTable />
            </div>
        </div>
    )
}

export default Genetic