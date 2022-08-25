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

import {QSection} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QSection";
import {Breadcrumbs as MuiBreadcrumbs} from "@mui/material";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import {Theme} from "@mui/material/styles";
import React, {ReactNode} from "react";
import {Link} from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

interface Props {
   tableSections: QSection[];
   light?: boolean;
}

function QRecordSidebar({tableSections, light}: Props): JSX.Element
{
   return (
      <Card sx={{borderRadius: ({borders: {borderRadius}}) => borderRadius.lg, position: "sticky", top: "1%"}}>
         <MDBox component="ul" display="flex" flexDirection="column" p={2} m={0} sx={{listStyle: "none"}}>
            {
               tableSections ? tableSections.map((section: QSection, key: number) => (
                  <MDBox key={`section-${section.name}`} component="li" pt={key === 0 ? 0 : 1}>
                     <MDTypography
                        component="a"
                        href={`#${section.name}`}
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
                           <Icon fontSize="small">{section.iconName}</Icon>
                        </MDBox>
                        {section.label}
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
