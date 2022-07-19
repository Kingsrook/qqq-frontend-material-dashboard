/**
 =========================================================
 * Material Dashboard 2 PRO React TS - v1.0.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import {useState, useEffect, ReactNode} from "react";

// Material Dashboard 2 PRO React TS Base Styles
import breakpoints from "assets/theme/base/breakpoints";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Navbar from "qqq/components/Navbar";
import Footer from "qqq/components/Footer";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "../../../components/MDBox";

// Declaring props types for BaseLayout
interface Props {
  stickyNavbar?: boolean;
  children: ReactNode;
}

function BaseLayout({stickyNavbar, children}: Props): JSX.Element
{
   const [tabsOrientation, setTabsOrientation] = useState<"horizontal" | "vertical">("horizontal");

   useEffect(() =>
   {
      // A function that sets the orientation state of the tabs.
      function handleTabsOrientation()
      {
         return window.innerWidth < breakpoints.values.sm
            ? setTabsOrientation("vertical")
            : setTabsOrientation("horizontal");
      }

      /**
         The event listener that's calling the handleTabsOrientation function when resizing the window.
         */
      window.addEventListener("resize", handleTabsOrientation);

      // Call the handleTabsOrientation function to set the state with the initial value.
      handleTabsOrientation();

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleTabsOrientation);
   }, [tabsOrientation]);

   return (
      <DashboardLayout>
         <Navbar />
         <MDBox mt={stickyNavbar ? 3 : 10}>{children}</MDBox>
         <Footer />
      </DashboardLayout>
   );
}

// Declaring default props for BaseLayout
BaseLayout.defaultProps = {
   stickyNavbar: false,
};

export default BaseLayout;
