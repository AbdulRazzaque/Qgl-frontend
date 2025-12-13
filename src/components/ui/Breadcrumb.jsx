import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Breadcrumb = ({ items = [] }) => {

  const navigate = useNavigate();

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return isLast ? (
          <Typography key={item.title} sx={{ color: "text.primary" }}>
            {item.title}
          </Typography>
        ) : (
          <Link
            key={item.title}
            underline="hover"
            color="inherit"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(item.link)}
          >
            {item.title}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      link: PropTypes.string,
    })
  ),

}

export default Breadcrumb