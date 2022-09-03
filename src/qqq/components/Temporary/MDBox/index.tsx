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

import {BoxProps} from "@mui/material";
import {forwardRef, FC} from "react";
import MDBoxRoot from "qqq/components/Temporary/MDBox/MDBoxRoot";


// declaring props types for MDBox
interface Props extends BoxProps {
  variant?: "contained" | "gradient";
  bgColor?: string;
  color?: string;
  opacity?: number;
  borderRadius?: string;
  shadow?: string;
  coloredShadow?: string;
  [key: string]: any;
}

const MDBox: FC<Props> = forwardRef(
   ({variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow, ...rest}, ref) => (
      <MDBoxRoot
         {...rest}
         ref={ref}
         ownerState={{variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow}}
      />
   )
);

// Declaring default props for MDBox
MDBox.defaultProps = {
   variant: "contained",
   bgColor: "transparent",
   color: "dark",
   opacity: 1,
   borderRadius: "none",
   shadow: "none",
   coloredShadow: "none",
};

export default MDBox;
