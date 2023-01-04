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

import Box from "@mui/material/Box";
import {ReactNode, useEffect, useState} from "react";
import Footer from "qqq/components/horseshoe/Footer";
import NavBar from "qqq/components/horseshoe/NavBar";
import DashboardLayout from "qqq/layouts/DashboardLayout";

interface Props
{
   stickyNavbar?: boolean;
   children: ReactNode;
}

export const breakpoints = {
   values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
   }
};

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
         <NavBar />
         <Box mt={stickyNavbar ? 3 : 6}>{children}</Box>
         <Footer />
      </DashboardLayout>
   );
}

// Declaring default props for BaseLayout
BaseLayout.defaultProps = {
   stickyNavbar: false,
};

export default BaseLayout;
