import {
  Box,
  CSSObject,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import PaidIcon from "@mui/icons-material/Paid";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import MuiDrawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React from "react";

interface SidebarProps {
  theme: any;
}

const Sidebar = ({ theme }: SidebarProps) => {
  const drawerWidth = 240;

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

  const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Drawer variant="permanent" anchor="left" open={open}>
        <DrawerHeader sx={{ mt: 1.7 }}>
          {open ? (
            <Box
              display={"flex"}
              width={"100%"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Box>
                <img
                  src={require("../../assets/images/bank.png")}
                  alt={"srb-logo"}
                  height={"40"}
                  width={"auto"}
                />
                <Typography sx={{ color: "white" }}>SRB Bank</Typography>
              </Box>
            </Box>
          ) : (
            <></>
          )}

          {open ? (
            <IconButton onClick={handleDrawerClose} sx={{ color: "gray" }}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          ) : (
            <IconButton
              onClick={handleDrawerOpen}
              sx={{ color: "gray", margin: "auto" }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </DrawerHeader>
        <hr style={{ marginLeft: 10, marginRight: 10 }} className={"divider"} />
        <List>
          {navList.map((nav: any, index) => (
            <ListItem
              disablePadding
              onClick={() => navigate(nav.navPath)}
              key={index}
              button
              sx={{ color: "gray", display: "block" }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "gray",
                  }}
                >
                  {nav.icon}
                </ListItemIcon>
                <ListItemText
                  primary={nav.title}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
