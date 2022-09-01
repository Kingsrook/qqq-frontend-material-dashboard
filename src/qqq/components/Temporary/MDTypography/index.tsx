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

import {TypographyProps} from "@mui/material";
import {FC, ReactNode, forwardRef} from "react";
import {useMaterialUIController} from "context";
import MDTypographyRoot from "qqq/components/Temporary/MDTypography/MDTypographyRoot";

// Declaring props types for MDTypography
interface Props extends TypographyProps
{
   color?:
      | "inherit"
      | "primary"
      | "secondary"
      | "info"
      | "success"
      | "warning"
      | "error"
      | "light"
      | "dark"
      | "text"
      | "white";
   fontWeight?: "light" | "regular" | "medium" | "bold" | undefined;
   textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
   verticalAlign?:
      | "unset"
      | "baseline"
      | "sub"
      | "super"
      | "text-top"
      | "text-bottom"
      | "middle"
      | "top"
      | "bottom";
   textGradient?: boolean;
   children: ReactNode;
   opacity?: number;

   [key: string]: any;
}

const MDTypography: FC<Props | any> = forwardRef(
   (
      {color, fontWeight, textTransform, verticalAlign, textGradient, opacity, children, ...rest},
      ref
   ) =>
   {
      const [controller] = useMaterialUIController();
      const {darkMode} = controller;

      return (
         <MDTypographyRoot
            {...rest}
            ref={ref}
            ownerState={{
               color,
               textTransform,
               verticalAlign,
               fontWeight,
               opacity,
               textGradient,
               darkMode,
            }}
         >
            {children}
         </MDTypographyRoot>
      );
   }
);

// Declaring default props for MDTypography
MDTypography.defaultProps = {
   color: "dark",
   fontWeight: undefined,
   textTransform: "none",
   verticalAlign: "unset",
   textGradient: false,
   opacity: 1,
};

export default MDTypography;
