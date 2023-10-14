import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      className={"footer"}
      textAlign={"center"}
      p={2}
      sx={{
        backgroundColor: "gray",
        color: "white",
        position: "fixed",
        bottom: 0,
        zIndex: "3",
        display: "flex",
        width: "100%",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        justifyContent: "center",
        pl: 25,
      }}
    >
      <Typography>Copyright © 2023 SRB Bank. All Rights Reserved.</Typography>
    </Box>
  );
};

export default Footer;
