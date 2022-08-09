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

import {useState, useEffect, ReactNode} from "react";

// Material Dashboard 2 PRO React TS Base Styles
import breakpoints from "assets/theme/base/breakpoints";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Navbar from "qqq/components/Navbar";
import Footer from "qqq/components/Footer";
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
         <MDBox mt={stickyNavbar ? 3 : 6}>{children}</MDBox>
         <Footer />
      </DashboardLayout>
   );
}

// Declaring default props for BaseLayout
BaseLayout.defaultProps = {
   stickyNavbar: false,
};

export default BaseLayout;
