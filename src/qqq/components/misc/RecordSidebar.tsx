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

import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QTableSection} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableSection";
import {QWidgetMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QWidgetMetaData";
import {Box} from "@mui/material";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import {Theme} from "@mui/material/styles";
import React from "react";
import {HashLink} from "react-router-hash-link";
import MDTypography from "qqq/components/legacy/MDTypography";

interface Props
{
   tableSections: QTableSection[];
   metaData?: QTableMetaData;
   widgetMetaDataList?: QWidgetMetaData[];
   light?: boolean;
   stickyTop?: string;
}

QRecordSidebar.defaultProps = {
   light: false,
   stickyTop: "1rem",
};

interface SidebarEntry
{
   iconName: string;
   name: string;
   label: string;
}

function QRecordSidebar({tableSections, widgetMetaDataList, light, stickyTop}: Props): JSX.Element
{
   /////////////////////////////////////////////////////////
   // insert widgets after identity (first) table section //
   /////////////////////////////////////////////////////////
   const sidebarEntries = [] as SidebarEntry[];
   tableSections && tableSections.forEach((section, index) =>
   {
      if(section.isHidden)
      {
         return;
      }

      if (index === 1 && widgetMetaDataList)
      {
         widgetMetaDataList.forEach((widget) =>
         {
            sidebarEntries.push({iconName: widget.icon, name: widget.name, label: widget.label});
         });
      }
      sidebarEntries.push({iconName: section.iconName, name: section.name, label: section.label});
   });


   return (
      <Card sx={{borderRadius: "0.75rem", position: "sticky", top: stickyTop, overflow: "hidden", maxHeight: "calc(100vh - 2rem)"}}>
         <Box component="ul" display="flex" flexDirection="column" p={2} m={0} sx={{listStyle: "none", overflow: "auto", height: "100%"}}>
            {
               sidebarEntries ? sidebarEntries.map((entry: SidebarEntry, key: number) => (

                  <Box key={`section-link-${entry.name}`} onClick={() => document.getElementById(entry.name).scrollIntoView()} sx={{cursor: "pointer"}}>
                     <Box key={`section-${entry.name}`} component="li" pt={key === 0 ? 0 : 1}>
                        <MDTypography
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
                           <Box mr={1.5} lineHeight={1} color="black">
                              <Icon fontSize="small">{entry.iconName}</Icon>
                           </Box>
                           <Box mr={1.5} lineHeight={1} color="black">
                              {entry.label}
                           </Box>

                        </MDTypography>
                     </Box>
                  </Box>
               )) : null
            }
         </Box>
      </Card>
   );
}

export default QRecordSidebar;
