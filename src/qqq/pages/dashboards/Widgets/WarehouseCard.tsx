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

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import {ReactNode} from "react";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";

interface Props {
  image: string;
  title: string;
  description: string | ReactNode;
  price: string;
  location: ReactNode;
  action?: ReactNode | boolean;
  [key: string]: any;
}

function WarehouseCard({image, title, description, price, location, action}: Props): JSX.Element
{
   return (
      <Card>
         <MDBox
            position="relative"
            borderRadius="lg"
            mt={-3}
            mx={2}
            className="card-header"
            sx={{transition: "transform 300ms cubic-bezier(0.34, 1.61, 0.7, 1)"}}
         >
            <MDBox
               component="img"
               src={image}
               alt={title}
               borderRadius="lg"
               shadow="md"
               width="100%"
               height="100%"
               position="relative"
               zIndex={1}
            />
            <MDBox
               borderRadius="lg"
               shadow="md"
               width="100%"
               height="100%"
               position="absolute"
               left={0}
               top="0"
               sx={{
                  backgroundImage: `url(${image})`,
                  transform: "scale(0.94)",
                  filter: "blur(12px)",
                  backgroundSize: "cover",
               }}
            />
         </MDBox>
         <MDBox textAlign="center" pt={3} px={3}>
            <MDBox display="flex" justifyContent="center" alignItems="center" mt={action ? -8 : -4.25}>
               {action}
            </MDBox>
            <MDTypography variant="h5" fontWeight="regular" sx={{mt: 4}}>
               {title}
            </MDTypography>
            <MDTypography variant="body2" color="text" sx={{mt: 1.5, mb: 1}}>
               {description}
            </MDTypography>
         </MDBox>
         <Divider />
         <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            pt={0.5}
            pb={3}
            px={3}
            lineHeight={1}
         >
            <MDTypography variant="body2" fontWeight="regular" color="text">
               {price}
            </MDTypography>
            <MDBox color="text" display="flex" alignItems="center">
               <Icon color="inherit" sx={{m: 0.5}}>
            place
               </Icon>
               <MDTypography variant="button" fontWeight="light" color="text">
                  {location}
               </MDTypography>
            </MDBox>
         </MDBox>
      </Card>
   );
}

WarehouseCard.defaultProps = {
   action: false,
};

export default WarehouseCard;
