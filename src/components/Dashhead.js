import React from "react";
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
import InfoIcon from "@mui/icons-material/Info";
const Dashhead = (props) => {
  console.log(props);
  let { id, display } = props;
  return (
    <div className={display ? "shadow-lg dashhead" : "dashhead displayhidden"}>
      <h1>QGL</h1>

      {id === 1 ? (
        <div className="menu-container-active">
          <p onClick={() => props.history.push("/")}>
            <PersonIcon /> Employees
          </p>
        </div>
      ) : (
        <div className="menu-container" onClick={() => props.history.push("/Home")}>
          <p>
            <PersonOutlineOutlinedIcon /> Employees
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
    </div>
  );
};

const mapStateToProps = ({ EventUser }) => {
  return {
    user: EventUser,
  };
};

export default connect(mapStateToProps)(withRouter(Dashhead));
