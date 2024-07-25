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
import Icon from "@mui/material/Icon";
import {Theme} from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import colors from "qqq/assets/theme/base/colors";
import {useMaterialUIController} from "qqq/context";
import {ReactNode} from "react";

// Declaring props types for DataTableHeadCell
interface Props
{
   width?: string | number;
   children: ReactNode;
   sorted?: false | "none" | "asce" | "desc";
   align?: "left" | "right" | "center";
   tooltip?: string | JSX.Element;
}

function DataTableHeadCell({width, children, sorted, align, tooltip, ...rest}: Props): JSX.Element
{
   const [controller] = useMaterialUIController();
   const {darkMode} = controller;

   return (
      <Box
         component="div"
         width={width}
         py={1.5}
         px={1.5}
         sx={({palette: {light}, borders: {borderWidth}}: Theme) => ({
            borderBottom: `${borderWidth[1]} solid ${colors.grayLines.main}`,
            position: "sticky", top: 0, background: "white"
         })}
      >
         <Box
            {...rest}
            sx={({typography: {size, fontWeightBold}}: Theme) => ({
               position: "relative",
               color: colors.grey[700],
               textAlign: align,
               "@media (min-width: 1440px)": {
                  fontSize: "1rem"
               },
               "@media (max-width: 1440px)": {
                  fontSize: "0.875rem"
               },
               fontWeight: 600,
               cursor: sorted && "pointer",
               userSelect: sorted && "none",
            })}
         >
            <>
               {
                  tooltip ? <Tooltip title={tooltip}><span style={{cursor: "default"}}>{children}</span></Tooltip> : children
               }
               {sorted && (
                  <Box
                     position="absolute"
                     top={0}
                     right={align !== "right" ? "16px" : 0}
                     left={align === "right" ? "-5px" : "unset"}
                     sx={({typography: {size}}: any) => ({
                        fontSize: size.lg,
                     })}
                  >
                     <Box
                        sx={{
                           position: "absolute",
                           top: -6,
                           color: sorted === "asce" ? "text" : "secondary",
                           opacity: sorted === "asce" ? 1 : 0.5
                        }}
                     >
                        <Icon>arrow_drop_up</Icon>
                     </Box>
                     <Box
                        sx={{
                           position: "absolute",
                           top: 0,
                           color: sorted === "desc" ? "text" : "secondary",
                           opacity: sorted === "desc" ? 1 : 0.5
                        }}
                     >
                        <Icon>arrow_drop_down</Icon>
                     </Box>
                  </Box>
               )}
            </>
         </Box>
      </Box>
   );
}

// Declaring default props for DataTableHeadCell
DataTableHeadCell.defaultProps = {
   width: "auto",
   sorted: "none",
   align: "left",
};

export default DataTableHeadCell;
