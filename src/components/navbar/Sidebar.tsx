import {
  Box,
  Drawer,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import PaidIcon from "@mui/icons-material/Paid";
import FindInPageIcon from "@mui/icons-material/FindInPage";

const Sidebar = () => {
  const navList = [
    {
      title: "Control Desk",
      navPath: "/",
      id: "controlDesk",
      icon: <DashboardCustomizeIcon />,
    },
    {
      title: "Customer Category",
      navPath: "search-customer-category",
      id: "customerCategory",
      icon: <CategoryIcon />,
    },
    {
      title: "Benefit Management",
      navPath: "benefit-management",
      id: "benefitManagement",
      icon: <LoyaltyIcon />,
    },
    {
      title: "Loans & Benefits",
      navPath: "loan-&-benefit-allocation",
      id: "loansBenefits",
      icon: <PaidIcon />,
    },
    {
      title: "Category Identification",
      navPath: "category-identification",
      id: "categoryIdentification",
      icon: <FindInPageIcon />,
    },
  ];

  const navigate = useNavigate();

  const location = useLocation();

  return (
    <div>
      <Drawer variant="persistent" anchor="left" open={true}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          sx={{ mt: 1.6 }}
        >
          <img
            src={require("../../assets/images/bank.png")}
            alt={"logo"}
            width="auto"
            height="40"
          />
          <Typography sx={{ color: "white" }}>SRB Bank</Typography>
        </Box>
        <hr
          style={{ color: "gray", marginLeft: 10, marginRight: 10 }}
          className={"divider"}
        />
        <List>
          {navList.map((nav: any, index) => (
            <ListItem
              id={nav.id}
              onClick={() => navigate(nav.navPath)}
              key={index}
              button
              sx={{ color: "gray" }}
            >
              <Icon sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                {nav.icon}
              </Icon>
              <ListItemText primary={nav.title} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
