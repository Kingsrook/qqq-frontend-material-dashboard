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

import {FC, forwardRef} from "react";
import MDProgressRoot from "components/MDProgress/MDProgressRoot";
import MDTypography from "components/MDTypography";

// Delcare props types for MDProgress
interface Props {
  variant?: "contained" | "gradient";
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  value: number;
  label?: boolean;
  [key: string]: any;
}

const MDProgress: FC<Props> = forwardRef(({variant, color, value, label, ...rest}, ref) => (
   <>
      {label && (
         <MDTypography variant="button" fontWeight="medium" color="text">
            {value}%
         </MDTypography>
      )}
      <MDProgressRoot
         {...rest}
         ref={ref}
         variant="determinate"
         value={value}
         ownerState={{color, value, variant}}
      />
   </>
));

// Declaring default props for MDProgress
MDProgress.defaultProps = {
   variant: "contained",
   color: "info",
   value: 0,
   label: false,
};

export default MDProgress;
