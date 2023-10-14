import { Route, Routes } from "react-router-dom";
import SearchCustomerCategory from "./customerCategory/SearchCustomerCategory";
import { Box, Grid } from "@mui/material";
import LandingPageCard from "../components/cards/LandingPageCard";
import SearchMainBenefit from "./benefitManagement/mainBenefit/SearchMainBenefit";
import SearchSubBenefit from "./benefitManagement/mainBenefit/SearchSubBenefit";
import LoanBenefitAllocation from "./loan&BenefitAllocation/Loan&BenefitAllocation";
import CategoryIdentificationPage from "./categoryIdentification/CategoryIdentificationPage";
import React from "react";

const landingPageCards: any[] = [
  {
    title: "Customer Category",
    description: "Create, view, edit and delete customer category",
    icon: require("../assets/images/customer-cat.jpg"),
    navPath: "search-customer-category",
  },
  {
    title: "Benefit Management",
    description: "Create, view, edit and benefits",
    icon: require("../assets/images/loan.png"),
    navPath: "benefit-management",
  },
  {
    title: "Loan & Benefit Allocation",
    description: "Allocate, edit and delete loans and benefits limits",
    icon: require("../assets/images/banks.jpg"),
    navPath: "loan-&-benefit-allocation",
  },
  {
    title: "Category Identification",
    description: "Identify category by customer details",
    icon: require("../assets/images/category.jpg"),
    navPath: "category-identification",
  },
];

const LandingPage = () => {
  return (
    <>
      <h2 className={"landing-heading"}>Control Desk</h2>
      <hr />
      <Box mt={5}>
        <Grid container spacing={2} justifyContent={"center"}>
          {landingPageCards.map((c) => (
            <Grid
              item
              key={c.title}
              xs={12}
              sm={6}
              md={3}
              display={"flex"}
              justifyContent={"center"}
            >
              <LandingPageCard
                title={c.title}
                description={c.description}
                image={c.icon}
                navPath={c.navPath}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

const MainLayout = () => {
  return (
    <Box ml={34} mr={5} mt={5} pb={10}>
      <Routes>
        <Route path={""} element={<LandingPage />} />
        <Route
          path={"/search-customer-category"}
          element={<SearchCustomerCategory />}
        />
        <Route path={"/benefit-management"} element={<SearchMainBenefit />} />
        <Route
          path={"/benefit-management/sub-benefits/*"}
          element={<SearchSubBenefit />}
        />
        <Route
          path={"/loan-&-benefit-allocation"}
          element={<LoanBenefitAllocation />}
        />
        <Route
          path={"/category-identification"}
          element={<CategoryIdentificationPage />}
        />
      </Routes>
    </Box>
  );
};

export default MainLayout;
