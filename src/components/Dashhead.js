// Dashhead.jsx
import React, { memo, useCallback } from "react";
import "./Dashhead.scss";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import LogoutIcon from "@mui/icons-material/Logout";
import SummarizeIcon from "@mui/icons-material/Summarize";
import BiotechIcon from "@mui/icons-material/Biotech";

const MENU_ITEMS = [
  {
    id: 1,
    label: "Entry Mode",
    path: "/Receipt",
    icon: <ControlPointIcon />,
    activeIcon: <ControlPointIcon />,
  },
  {
    id: 2,
    label: "Previous Details",
    path: "/Previousreport",
    icon: <NoteAddOutlinedIcon />,
    activeIcon: <NoteAddIcon />,
  },
  {
    id: 3,
    label: "Monthly Details",
    path: "/Monthlyreport",
    icon: <SummarizeIcon />,
    activeIcon: <SummarizeIcon />,
  },
  {
    id: 4,
    label: "MemberShip Form",
    path: "/Membership",
    icon: <CardMembershipIcon />,
    activeIcon: <CardMembershipIcon />,
  },
  {
    id: 5,
    label: "Genetic",
    path: "/Genetic",
    icon: <BiotechIcon  />,
    activeIcon: <BiotechIcon  />,
  },
  {
    id: 6,
    label: "Import Camels",
    path: "/FatherCamel",
    icon: <NoteAddIcon />,
    activeIcon: <NoteAddOutlinedIcon />,
  },
];

const Dashhead = ({ id = null, display = true }) => {
  const navigate = useNavigate();


 const handleNavigate = useCallback(
    (path) => {
      if (path) navigate(path); // history.push -> navigate
    },
    [navigate]
  );

   const logout = useCallback(() => {
    sessionStorage.removeItem("accessToken");
    navigate("/"); // history.push -> navigate
  }, [navigate]);

  const rootClass = display
    ? "shadow-lg dashhead"
    : "dashhead displayhidden min-vh-100";

  return (
    <aside className={rootClass} id="sidebar-wrapper" aria-label="sidebar">
      <h1 className="dashhead-brand">QGL</h1>

      <nav className="dashhead-menu" aria-label="main menu">
        {MENU_ITEMS.map((item) => {
          const isActive = id === item.id;
          return (
            <div
              key={item.id}
              className={isActive ? "menu-container-active" : "menu-container"}
              onClick={() => handleNavigate(item.path)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") handleNavigate(item.path);
              }}
              aria-current={isActive ? "page" : undefined}
            >
              <p>
                {isActive ? item.activeIcon : item.icon} {item.label}
              </p>
            </div>
          );
        })}
      </nav>

      <div className="sticky-bottom fixed-bottom ml-1 mb-1 bt">
        <button
          type="button"
          className="btn btn-danger"
          style={{ width: "14%" }}
          onClick={logout}
        >
          Logout <LogoutIcon className="mx-3" />
        </button>
      </div>
    </aside>
  );
};

Dashhead.propTypes = {
  id: PropTypes.number,
  display: PropTypes.bool,
};

export default memo(Dashhead);
