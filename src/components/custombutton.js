import React from "react";
import { Button, IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const CustomStyledButton = withStyles({
  root: {
    boxShadow: "none",
    textTransform: "none",
    borderRadius: "9px",
    border: "1px solid",
    backgroundColor: "#32735F",
    borderColor: "#707070",
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: "#32735F",
      borderColor: "#707070",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#32735F",
      borderColor: "#707070",
    },
    "&:focus": {
      boxShadow: "0 0 0 0.2rem gba(50, 115, 95, 1)",
    },
  },
})(Button);

const CustomIconButton = withStyles({
  root: {
    boxShadow: "none",
    textTransform: "none",
    height: "39px",
    width: "36px",
    borderRadius: "9px",
    backgroundColor: "rgba(0, 145, 124, 1)",
    "&:hover": {
      backgroundColor: "rgba(0, 145, 124, 1)",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "rgba(0, 145, 124, 1)",
    },
    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0, 145, 124, 1)",
    },
  },
})(IconButton);

const CustomButton = ({
  variant = "contained",
  label,
  styleObject,
  isIconButton,
  Icon,
  ...props
}) => {
  return (
    <>
      {isIconButton ? (
        // <CustomIconButton
        //   aria-label={label}
        //   component="span"
        //   style={{ ...styleObject }}
        //   {...props}
        // >
        //   {Icon}
        // </CustomIconButton>
        <CustomStyledButton
          variant={variant}
          style={{ ...styleObject }}
          {...props}
        >
          {Icon}
        </CustomStyledButton>
      ) : (
        <CustomStyledButton
          variant={variant}
          style={{ ...styleObject }}
          {...props}
        >
          {label}
        </CustomStyledButton>
      )}
    </>
  );
};

CustomButton.propTypes = {
  variant: PropTypes.string,
  label: PropTypes.string.isRequired,
  styleObject: PropTypes.objectOf(PropTypes.string),
  isIconButton: PropTypes.bool,
  Icon: PropTypes.objectOf(PropTypes.object),
};

CustomButton.defaultProps = {
  variant: "",
  styleObject: {},
  isIconButton: false,
  Icon: {},
};

export default CustomButton;
