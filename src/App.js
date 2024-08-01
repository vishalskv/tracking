import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "./component/sidebar/sidebar";
import ProList from "./page/project-list";
import NewDep from "./page/new-departments";
import Dashboard from "./page/dashboard";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Sidebar>
        <Routes>
            <Route path="/" element={<Navigate to="/tracking" />} />
            <Route path="/project-list" element={<NewDep />} />
            <Route path="/clients" element={<ProList />} />
            <Route path="/tracking" element={<Dashboard />} />
          </Routes>
        </Sidebar>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
};

export default App;
