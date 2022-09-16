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

import {Theme} from "@mui/material/styles";
import {ReactNode} from "react";
import MDBox from "qqq/components/Temporary/MDBox";

// Declaring prop types for DataTableBodyCell
interface Props
{
   children: ReactNode;
   noBorder?: boolean;
   align?: "left" | "right" | "center";
}

function DataTableBodyCell({noBorder, align, children}: Props): JSX.Element
{
   return (
      <MDBox
         component="td"
         textAlign={align}
         py={1.5}
         px={3}
         sx={({palette: {light}, typography: {size}, borders: {borderWidth}}: Theme) => ({
            fontSize: size.sm,
            borderBottom: noBorder ? "none" : `${borderWidth[1]} solid ${light.main}`,
         })}
      >
         <MDBox
            display="inline-block"
            width="max-content"
            color="text"
            sx={{verticalAlign: "middle"}}
         >
            {children}
         </MDBox>
      </MDBox>
   );
}

// Declaring default props for DataTableBodyCell
DataTableBodyCell.defaultProps = {
   noBorder: false,
   align: "left",
};

export default DataTableBodyCell;
