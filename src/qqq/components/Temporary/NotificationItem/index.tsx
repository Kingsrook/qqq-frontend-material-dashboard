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

import {MenuItemProps} from "@mui/material";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import {forwardRef, FC, ReactNode} from "react";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";
import menuItem from "qqq/components/Temporary/NotificationItem/styles";

// Declaring props types for NotificationItem
interface Props extends MenuItemProps {
  icon: ReactNode;
  title: string;
  [key: string]: any;
}

const NotificationItem : FC<Props> = forwardRef(({icon, title, ...rest}, ref) => (
   <MenuItem {...rest} ref={ref} sx={(theme) => menuItem(theme)}>
      <MDBox component={Link} py={0.5} display="flex" alignItems="center" lineHeight={1}>
         <MDTypography variant="body1" color="secondary" lineHeight={0.75}>
            {icon}
         </MDTypography>
         <MDTypography variant="button" fontWeight="regular" sx={{ml: 1}}>
            {title}
         </MDTypography>
      </MDBox>
   </MenuItem>
));

export default NotificationItem;
