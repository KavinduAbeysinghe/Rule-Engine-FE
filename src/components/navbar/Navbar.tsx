import {Route, useNavigate} from "react-router-dom";
import SearchCustomerCategory from "../../view/customerCategory/SearchCustomerCategory";
import SearchMainBenefit from "../../view/benefitManagement/mainBenefit/SearchMainBenefit";
import SearchSubBenefit from "../../view/benefitManagement/mainBenefit/SearchSubBenefit";
import LoanBenefitAllocation from "../../view/loan&BenefitAllocation/Loan&BenefitAllocation";
import CategoryIdentificationPage from "../../view/categoryIdentification/CategoryIdentificationPage";
import React from "react";

const Navbar = () => {

    const navigate = useNavigate();

    return (
        <nav className="navbar bg-body-tertiary fixed-top navbar-expand-lg">
            <div className="container-fluid">
                <a className="navbar-brand" href="/" style={{fontWeight: 600, color: "black"}}>
                    <img src={require("../../assets/images/bank.png")} alt="Bootstrap" width="auto" height="40"/>
                    <span style={{marginLeft: "20px"}}>SRB BANK</span>
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" aria-current="page" onClick={() => navigate("/search-customer-category")}>Customer Category</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => navigate("/benefit-management")}>Benefit Management</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => navigate("/loan-&-benefit-allocation")}>Loan & Benefits</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => navigate("/category-identification")}>Category Identification</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;