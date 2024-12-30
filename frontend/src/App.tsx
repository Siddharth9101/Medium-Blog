import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Create from "./pages/Create";
import Blog from "./pages/Blog";

const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage?.getItem("token") || null;
    if (token) {
      try {
        axios
          .get(`${BACKEND_URL}/api/v1/user/me?token=${token}`)
          .then((response) => {
            if (response.status === 200) {
              setUserLoggedIn(true);
            }
          });
      } catch (error) {
        setUserLoggedIn(false);
      }
    }
  }, []);
  return (
    <>
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route
          path="/"
          element={
            userLoggedIn ? <Navigate to="/home" /> : <Navigate to="/signin" />
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/compose" element={<Create />} />
        <Route path="/blog/:id" element={<Blog />} />
      </Routes>
    </>
  );
};

export default App;
