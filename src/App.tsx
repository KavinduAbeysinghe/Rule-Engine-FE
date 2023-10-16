import React from "react";
import "./App.scss";
import Navbar from "./components/navbar/Navbar";
import MainLayout from "./view/MainLayout";
import { BrowserRouter } from "react-router-dom";
import { NotificationContextProvider } from "./context/NotificationContext";

function App() {
  return (
    <BrowserRouter>
      <NotificationContextProvider>
        <MainLayout />
      </NotificationContextProvider>
    </BrowserRouter>
  );
}

export default App;
