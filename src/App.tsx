import React from 'react';
import './App.scss';
import Navbar from './components/navbar/Navbar';
import MainLayout from "./view/MainLayout";
import {BrowserRouter} from "react-router-dom";
import {NotificationContextProvider} from "./context/NotificationContext";
import Footer from "./components/footer/Footer";
import Sidebar from "./components/navbar/Sidebar";

function App() {
    return (
        <BrowserRouter>
            <NotificationContextProvider>
                {/*<div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>*/}
                    {/*<Navbar/>*/}
                    <Sidebar/>
                    <MainLayout/>
                    <Footer/>
                {/*</div>*/}
            </NotificationContextProvider>
        </BrowserRouter>
    );
}

export default App;
