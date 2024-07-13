import React from "react";
import {
  styled,
 createTheme,
  useMediaQuery,
} from "@mui/material";
import { Outlet } from "react-router-dom";

import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
/**
 * The width of the sidebar in pixels.
 *
 * @constant
 * @type {string}
 */
const drawerWidth = "0px"; // Updated width to 250px for better spacing

/**
 * A styled main component that handles the layout of the main content area.
 *
 * This component takes an `open` prop that determines whether the sidebar
 * is open or closed. It also uses the `theme` prop to access the current
 * theme and apply styles accordingly.
 *
 * @example
 * <Main open={true}>
 *   <Header />
 *   <MainPage />
 *   <Footer />
 * </Main>
 */
const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: open ? drawerWidth : "0",
  width: open ? "80vw" : "100%",
  [theme.breakpoints.down("sm")]: {
    marginLeft: 0,
  },
}));

const SubMain = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  padding: theme.spacing(2),
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: open ? drawerWidth : "0",
  [theme.breakpoints.down("sm")]: {
    marginLeft: 0,
  },
}));

const FullLayout = () => {
  const theme = createTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = React.useState(!isMobile);

  /**
   * Handles the toggling of the sidebar.
   *
   * @function
   */
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        isMobile={isMobile}
        open={open}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Main open={open}>
        <Header open={open} handleDrawerToggle={handleDrawerToggle} />
        <SubMain>
          <Outlet />
        </SubMain>
        {/* <Footer /> */}
      </Main>
    </div>
  );
};

export default FullLayout;
