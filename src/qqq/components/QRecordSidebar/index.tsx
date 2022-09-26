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

import {QTableSection} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableSection";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import {Theme} from "@mui/material/styles";
import React from "react";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";

interface Props
{
   tableSections: QTableSection[];
   widgetNames?: string[];
   light?: boolean;
}

interface SidebarEntry
{
   iconName: string;
   name: string;
   label: string;
}

function QRecordSidebar({tableSections, widgetNames, light}: Props): JSX.Element
{
   /////////////////////////////////////////////////////////
   // insert widgets after identity (first) table section //
   /////////////////////////////////////////////////////////
   const sidebarEntries = [] as SidebarEntry[];
   tableSections && tableSections.forEach((section, index) =>
   {
      if (index === 1 && widgetNames)
      {
         widgetNames.forEach((name) =>
         {
            sidebarEntries.push({iconName: "troubleshoot", name: name, label: name});
         });
      }
      sidebarEntries.push({iconName: section.iconName, name: section.name, label: section.label});
   });


   return (
      <Card sx={{borderRadius: ({borders: {borderRadius}}) => borderRadius.lg, position: "sticky", top: "1%"}}>
         <MDBox component="ul" display="flex" flexDirection="column" p={2} m={0} sx={{listStyle: "none"}}>
            {
               sidebarEntries ? sidebarEntries.map((entry: SidebarEntry, key: number) => (

                  <MDBox key={`section-${entry.name}`} component="li" pt={key === 0 ? 0 : 1}>
                     <MDTypography
                        component="a"
                        href={`#${entry.name}`}
                        variant="button"
                        fontWeight="regular"
                        sx={({
                           borders: {borderRadius}, functions: {pxToRem}, palette: {light}, transitions,
                        }: Theme) => ({
                           display: "flex",
                           alignItems: "center",
                           borderRadius: borderRadius.md,
                           padding: `${pxToRem(10)} ${pxToRem(16)}`,
                           transition: transitions.create("background-color", {
                              easing: transitions.easing.easeInOut,
                              duration: transitions.duration.shorter,
                           }),

                           "&:hover": {
                              backgroundColor: light.main,
                           },
                        })}
                     >
                        <MDBox mr={1.5} lineHeight={1} color="black">
                           <Icon fontSize="small">{entry.iconName}</Icon>
                        </MDBox>
                        {entry.label}
                     </MDTypography>
                  </MDBox>
               )) : null
            }
         </MDBox>
      </Card>
   );
}

QRecordSidebar.defaultProps = {
   light: false,
};

export default QRecordSidebar;
