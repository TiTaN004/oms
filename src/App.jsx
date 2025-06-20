import { useState } from "react";
import Login from "./pages/login/Login";
import FogotPassword from "./pages/login/FogotPassword";
import Layout from "./components/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./pages/login/ProtectedRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<FogotPassword />} />
          <Route
            path="/dashboard/*"
            element={
              //<ProtectedRoute>
                <Layout />
              //</ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
