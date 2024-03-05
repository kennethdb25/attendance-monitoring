import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  cardContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  gridContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    marginTop: 40,
    marginBottom: 40,
    // backgroundColor: '#fff',
  },
  customModal: {
    backgroundImage: "url(/modal.png)",
    backgroundPosition: "center",
    // backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundSize: "700px 700px",
  },
}));

export default useStyles;
