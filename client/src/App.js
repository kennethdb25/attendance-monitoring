import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import "./App.css";
import ROUTE from "./Routes/Route";
import LoginContent from "./components/Login/LoginContent";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import HomeDashboard from "./components/Dashboard/Dashboard";

function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setData(true);
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <ToastContainer />
      {data ? (
        <>
          <Routes>
            <Route path={ROUTE.HOMEPAGE} element={<LoginContent />} />
            <Route path={ROUTE.FORGOTPASSWORD} element={<ForgotPassword />} />
            <Route path={ROUTE.DASHBOARD} element={<HomeDashboard />} />
          </Routes>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          Loading Portal &nbsp;
          <CircularProgress />
        </Box>
      )}
    </div>
  );
}

export default App;
