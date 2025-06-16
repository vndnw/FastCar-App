import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import { Outlet } from "react-router-dom";

function UserLayout() {
    return (<>
        <div className="app">
            <Navbar />
            <div className="content">
                <Outlet />
            </div>
        </div>
        <Footer />
        <ScrollToTop />
    </>
    );
}

export default UserLayout;
