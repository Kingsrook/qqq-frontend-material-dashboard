/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2022.  Kingsrook, LLC
 * 651 N Broad St Ste 205 # 6917 | Middletown DE 19709 | United States
 * contact@kingsrook.com
 * https://github.com/Kingsrook/
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {useState, useEffect} from "react";

// react-router components
import {useLocation} from "react-router-dom";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDBadge from "components/MDBadge";

// Material Dashboard 2 PRO React TS examples components
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for Navbar
import {
   navbar,
   navbarContainer,
   navbarRow,
   navbarIconButton,
   navbarDesktopMenu,
   navbarMobileMenu,
} from "qqq/components/Navbar/styles";

// Material Dashboard 2 PRO React context
import {
   useMaterialUIController,
   setTransparentNavbar,
   setMiniSidenav,
   setOpenConfigurator,
} from "context";

// qqq
import QBreadcrumbs from "qqq/components/QBreadcrumbs";

// Declaring prop types for Navbar
interface Props
{
   absolute?: boolean;
   light?: boolean;
   isMini?: boolean;
}

function Navbar({absolute, light, isMini}: Props): JSX.Element
{
   const [navbarType, setNavbarType] = useState<"fixed" | "absolute" | "relative" | "static" | "sticky">();
   const [controller, dispatch] = useMaterialUIController();
   const {
      miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode,
   } = controller;
   const [openMenu, setOpenMenu] = useState<any>(false);
   const route = useLocation().pathname.split("/").slice(1);

   useEffect(() =>
   {
      // Setting the navbar type
      if (fixedNavbar)
      {
         setNavbarType("sticky");
      }
      else
      {
         setNavbarType("static");
      }

      // A function that sets the transparent state of the navbar.
      function handleTransparentNavbar()
      {
         setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
      }

      /**
       The event listener that's calling the handleTransparentNavbar function when
       scrolling the window.
       */
      window.addEventListener("scroll", handleTransparentNavbar);

      // Call the handleTransparentNavbar function to set the state with the initial value.
      handleTransparentNavbar();

      // Remove event listener on cleanup
      return () => window.removeEventListener("scroll", handleTransparentNavbar);
   }, [dispatch, fixedNavbar]);

   const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
   const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
   const handleOpenMenu = (event: any) => setOpenMenu(event.currentTarget);
   const handleCloseMenu = () => setOpenMenu(false);

   // Render the notifications menu
   const renderMenu = () => (
      <Menu
         anchorEl={openMenu}
         anchorReference={null}
         anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
         }}
         open={Boolean(openMenu)}
         onClose={handleCloseMenu}
         sx={{mt: 2}}
      >
         <NotificationItem icon={<Icon>email</Icon>} title="0 messages available" />
         {/*
         <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
         <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
         */}
      </Menu>
   );

   // Styles for the navbar icons
   const iconsStyle = ({
      palette: {dark, white, text},
      functions: {rgba},
   }: {
      palette: any;
      functions: any;
   }) => ({
      color: () =>
      {
         let colorValue = light || darkMode ? white.main : dark.main;

         if (transparentNavbar && !light)
         {
            colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
         }

         return colorValue;
      },
   });

   const breadcrumbTitle = route[route.length - 1].replace(/([A-Z])/g, " $1").trim();

   return (
      <AppBar
         position={absolute ? "absolute" : navbarType}
         color="inherit"
         sx={(theme) => navbar(theme, {
            transparentNavbar, absolute, light, darkMode,
         })}
      >
         <Toolbar sx={navbarContainer}>
            <MDBox color="inherit" mb={{xs: 1, md: 0}} sx={(theme) => navbarRow(theme, {isMini})}>
               <QBreadcrumbs icon="home" title={breadcrumbTitle} route={route} light={light} />
               <IconButton sx={navbarDesktopMenu} onClick={handleMiniSidenav} size="small" disableRipple>
                  <Icon fontSize="medium" sx={iconsStyle}>
                     {miniSidenav ? "menu_open" : "menu"}
                  </Icon>
               </IconButton>
            </MDBox>
            {isMini ? null : (
               <MDBox sx={(theme) => navbarRow(theme, {isMini})}>
                  <MDBox pr={1}>
                     <MDInput label="Search here" />
                  </MDBox>
                  <MDBox color={light ? "white" : "inherit"}>
                     <IconButton
                        size="small"
                        disableRipple
                        color="inherit"
                        sx={navbarMobileMenu}
                        onClick={handleMiniSidenav}
                     >
                        <Icon sx={iconsStyle} fontSize="medium">
                           {miniSidenav ? "menu_open" : "menu"}
                        </Icon>
                     </IconButton>
                     <IconButton
                        size="small"
                        disableRipple
                        color="inherit"
                        sx={navbarIconButton}
                        onClick={handleConfiguratorOpen}
                     >
                        <Icon sx={iconsStyle}>settings</Icon>
                     </IconButton>
                     <IconButton
                        size="small"
                        color="inherit"
                        sx={navbarIconButton}
                        onClick={handleOpenMenu}
                     >
                        <MDBadge badgeContent={0} color="error" size="xs" circular>
                           <Icon sx={iconsStyle}>notifications</Icon>
                        </MDBadge>
                     </IconButton>
                     {renderMenu()}
                  </MDBox>
               </MDBox>
            )}
         </Toolbar>
      </AppBar>
   );
}

// Declaring default props for Navbar
Navbar.defaultProps = {
   absolute: false,
   light: false,
   isMini: false,
};

export default Navbar;
