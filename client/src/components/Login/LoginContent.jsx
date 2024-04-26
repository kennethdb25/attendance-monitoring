import React from "react";
import { Box } from "@mui/material";
import useStyles from "./style";
import LoginForm from "./LoginForm";

const LoginContent = () => {
  const classes = useStyles();

  return (
    <Box className={classes.loginContainer}>
      <LoginForm />
    </Box>
  );
};

export default LoginContent;
