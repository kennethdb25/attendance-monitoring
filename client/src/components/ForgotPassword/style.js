import { makeStyles } from "@mui/styles";
import { createTheme } from "@mui/material/styles";

const theme = createTheme();
const useStyles = makeStyles(() => ({
  forgotPassContainer: {
    backgroundImage: "url(/home-login.png)",
    backgroundPosition: "center",
    backgroundSize: "cover",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",

    [theme.breakpoints.up("md")]: {
      // paddingRight: "75px",
      justifyContent: "center",
    },
    [theme.breakpoints.down("md")]: {
      backgroundImage: "url(/cp-login.png)",
      paddingLeft: "0px",
      justifyContent: "center",
    },
  },
  forgotPassCard: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "20px",
    background: "white",
    border: "1px lightgray solid",
    borderRadius: "10px",

    [theme.breakpoints.up("md")]: {
      width: "450px",
    },
    [theme.breakpoints.down("md")]: {
      width: "80%",
    },
  },
  forgotPassDetails: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "20px",
    background: "white",

    [theme.breakpoints.up("md")]: {
      width: "360px",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  whoComplaint: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "20px",
    background: "white",
    border: "1px lightgray solid",
    borderRadius: "10px",

    [theme.breakpoints.up("md")]: {
      width: "120%",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  Form: {
    width: "100%",
  },
}));

export default useStyles;
