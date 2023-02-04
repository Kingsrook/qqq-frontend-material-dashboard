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
import Link from "@mui/material/Link";
import MDTypography from "qqq/components/legacy/MDTypography";
import typography from "qqq/components/legacy/typography";


// Declaring props types for Footer
interface Props
{
   company?: {
      href: string;
      name: string;
   };
   links?: {
      href: string;
      name: string;
   }[];

   [key: string]: any;
}

Footer.defaultProps = {
   company: {href: "", name: ""},
   links: [],
};

function Footer({company, links}: Props): JSX.Element
{
   const {href, name} = company;
   const {size} = typography;

   const renderLinks = () => links.map((link) => (
      <Box key={link.name} component="li" px={2} lineHeight={1}>
         <Link href={link.href} target="_blank">
            <MDTypography variant="button" fontWeight="regular" color="text">
               {link.name}
            </MDTypography>
         </Link>
      </Box>
   ));

   return (
      <Box
         width="100%"
         display="flex"
         flexDirection={{xs: "column", lg: "row"}}
         justifyContent="space-between"
         alignItems="center"
         px={1.5}
         style={{
            position: "fixed", bottom: "0px", zIndex: -1, marginBottom: "10px",
         }}
      >
         {
            href && name &&
            <Box
               display="flex"
               justifyContent="center"
               alignItems="center"
               flexWrap="wrap"
               color="text"
               fontSize={size.sm}
               px={1.5}
            >
               &copy;
               {" "}
               {new Date().getFullYear()}
               ,
               <Link href={href} target="_blank">
                  <MDTypography variant="button" fontWeight="medium">
                     &nbsp;
                     {name}
                     &nbsp;
                  </MDTypography>
               </Link>
            </Box>
         }
         <Box
            component="ul"
            sx={({breakpoints}) => ({
               display: "flex",
               flexWrap: "wrap",
               alignItems: "center",
               justifyContent: "center",
               listStyle: "none",
               mt: 3,
               mb: 0,
               p: 0,

               [breakpoints.up("lg")]: {
                  mt: 0,
               },
            })}
         >
            {renderLinks()}
         </Box>
      </Box>
   );
}

export default Footer;
