import { makeStyles } from "@mui/styles";
import { createTheme } from "@mui/material/styles";

const theme = createTheme();
const useStyles = makeStyles(() => ({
  attendanceContainer: {
    backgroundImage: "url(/cp-login.png)",
    backgroundPosition: "center",
    backgroundSize: "cover",
    minHeight: "100vh",
    margin: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    [theme.breakpoints.up("md")]: {
      justifyContent: "end",
    },
    [theme.breakpoints.down("md")]: {
      backgroundImage: "url(/cp-login.png)",
      paddingLeft: "0px",
      justifyContent: "center",
    },
  },
  attendanceCard: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    background: "white",
    border: "1px lightgray solid",
    borderRadius: "10px",

    [theme.breakpoints.up("md")]: {
      width: "400px",
    },
  },
  loginContainer: {
    backgroundImage: "url(/home-login.png)",
    backgroundPosition: "center",
    backgroundSize: "cover",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",

    [theme.breakpoints.up("md")]: {
      paddingRight: "100px",
      justifyContent: "end",
    },
    [theme.breakpoints.down("md")]: {
      backgroundImage: "url(/cp-login.png)",
      paddingLeft: "0px",
      justifyContent: "center",
    },
  },
  loginCard: {
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
      width: "400px",
    },
    [theme.breakpoints.down("md")]: {
      width: "80%",
    },
  },
  loginDetails: {
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
    paddingTop: "20px",
  },
}));

export default useStyles;
