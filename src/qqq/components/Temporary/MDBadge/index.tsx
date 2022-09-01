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

import {BadgeProps} from "@mui/material";
import {FC, ReactNode, forwardRef} from "react";
import MDBadgeRoot from "qqq/components/Temporary/MDBadge/MDBadgeRoot";

interface Props extends Omit<BadgeProps, "color" | "variant"> {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  variant?: "gradient" | "contained";
  size?: "xs" | "sm" | "md" | "lg";
  circular?: boolean;
  indicator?: boolean;
  border?: boolean;
  children?: ReactNode;
  container?: boolean;
  [key: string]: any;
}

const MDBadge: FC<Props | any> = forwardRef(
   ({color, variant, size, circular, indicator, border, container, children, ...rest}, ref) => (
      <MDBadgeRoot
         {...rest}
         ownerState={{color, variant, size, circular, indicator, border, container, children}}
         ref={ref}
         color="default"
      >
         {children}
      </MDBadgeRoot>
   )
);

// declaring default props for MDBadge
MDBadge.defaultProps = {
   color: "info",
   variant: "gradient",
   size: "sm",
   circular: false,
   indicator: false,
   border: false,
   container: false,
   children: false,
};

export default MDBadge;
