import React, { useState } from "react";
import "./Dashhead.scss";
import { withRouter } from "react-router";
import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import PersonIcon from "@mui/icons-material/Person";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { connect } from "react-redux";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import LogoutIcon from '@mui/icons-material/Logout';
import InfoIcon from "@mui/icons-material/Info";
import SummarizeIcon from '@mui/icons-material/Summarize';
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const Dashhead = (props) => {
  console.log(props);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const history = useHistory();
  const logout = () => {
    sessionStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    history.push('/');
  };
  let { id, display } = props;
  
  return (
    <div   className={display ? "shadow-lg dashhead" : "dashhead displayhidden min-vh-100 "}id="sidebar-wrapper">
      <h1>QGL</h1>

      {id === 1 ? (
        <div className="menu-container-active">
          <p onClick={() => props.history.push("/")}>
            <ControlPointIcon /> Entry Mode
          </p>
        </div>
      ) : (
        <div className="menu-container" onClick={() => props.history.push("/Home")}>
          <p>
            <ControlPointIcon /> Entry Mode
          </p>
        </div>
      )}

{id === 2 ? (
        <div className="menu-container-active">
          <p onClick={() => props.history.push("Previousreport")}>
            <NoteAddIcon /> Previous Details
          </p>
        </div>
      ) : (
        <div
          className="menu-container"
          onClick={() => props.history.push("Previousreport")}
        >
          <p>
            <NoteAddOutlinedIcon /> Previous Details
          </p>
        </div>
      )}

{id === 3 ? (
        <div className="menu-container-active">
          <p onClick={() => props.history.push("Monthlyreport")}>
            <SummarizeIcon /> Monthly Details
          </p>
        </div>
      ) : (
        <div
          className="menu-container"
          onClick={() => props.history.push("Monthlyreport")}
        >
          <p>
            <SummarizeIcon /> Monthly Details
          </p>
        </div>
      )}
      


      {id === 4 ? (
        <div className="menu-container-active">
          <p onClick={() => props.history.push("Membership")}>
            <CardMembershipIcon /> MemberShip Form
          </p>
        </div>
      ) : (
        <div
          className="menu-container"
          onClick={() => props.history.push("Membership")}
        >
          <p>
            <CardMembershipIcon />  MemberShip Form
          </p>
        </div>
      )}

<div className="sticky-bottom fixed-bottom ml-1 mb-1 bt">
       <button className="btn btn-danger"  style={{ width: "14%" }} onClick={logout}>
            Logout <LogoutIcon className="mx-3"  />
          </button>
        </div>

    </div>
    
  );
};


const mapStateToProps = ({ EventUser }) => {
  return {
    user: EventUser,
  };
};

export default connect(mapStateToProps)(withRouter(Dashhead));
