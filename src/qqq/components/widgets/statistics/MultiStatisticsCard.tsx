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

import {Skeleton} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import React from "react";
import {NavLink} from "react-router-dom";
import MDTypography from "qqq/components/legacy/MDTypography";

/////////////////////////////////////
// structure of location card data //
/////////////////////////////////////
export interface MultiStatisticsCardData
{
   imageUrl: string;
   title: string;
   statisticsGroupData: {
      icon: string;
      iconColor: string;
      header: string;
      subheader: string;
      statisticList: {
         label: string;
         value: number;
         url?: string;
      }[]

   }[];
}


/////////////////////////
// inputs and defaults //
/////////////////////////
interface Props
{
   title: string;
   data: MultiStatisticsCardData;

   [key: string]: any;
}

function MultiStatisticsCard({title, data}: Props): JSX.Element
{
   return (
      <Card sx={{alignItems: "stretch", flexGrow: 1, display: "flex", marginTop: "0px", paddingTop: "0px"}}>

         <Grid container>
            <Grid item xs={12}>
               <Box pt={3} px={3}>
                  <MDTypography variant="h5" fontWeight="medium">
                     {title}
                  </MDTypography>
               </Box>
            </Grid>
         </Grid>
         <Grid container>
            {
               data && data.statisticsGroupData ? (
                  data.statisticsGroupData.map((statisticsGroup, i1) =>
                     <Grid key={`statgroup-${i1}`} item xs={3} lg={3} sx={{textAlign: "center"}}>
                        <Box p={3} pt={3} sx={{alignItems: "center"}}>
                           {
                              statisticsGroup.icon && (
                                 <Box>
                                    <MDTypography variant="h6">
                                       <Icon sx={{fontSize: "30px", margin: "5px", color: statisticsGroup.iconColor}} fontSize="medium">{statisticsGroup.icon}</Icon>
                                    </MDTypography>
                                 </Box>
                              )
                           }
                           <Box>
                              <MDTypography variant="h6">
                                 {statisticsGroup.header}
                              </MDTypography>
                              <MDTypography variant="subtitle2">
                                 {statisticsGroup.subheader}
                              </MDTypography>
                           </Box>
                           <Divider sx={{margin: "10px"}}></Divider>
                           <Box sx={{alignItems: "center"}}>
                              {
                                 statisticsGroup.statisticList.map((stat, i2) =>
                                    <Box key={`stat-${i1}-${i2}`}>
                                       <MDTypography variant="subtitle2">
                                          {stat.label}: <NavLink to={stat.url}>{stat.value.toLocaleString()}</NavLink>
                                       </MDTypography>
                                    </Box>
                                 )
                              }
                           </Box>
                        </Box>
                     </Grid>
                  )
               ) : (
                  Array(4).fill(0).map((_, i) =>
                     <Grid key={`item-${i}`} item xs={3} lg={3} sx={{textAlign: "center"}}>
                        <Box p={3} pt={3} sx={{alignItems: "center"}}>
                           <Box>
                              <MDTypography variant="h6">
                                 <Icon sx={{fontSize: "30px", margin: "5px", color: "grey"}} fontSize="medium">pending</Icon>
                              </MDTypography>
                           </Box>
                           <Box>
                              <MDTypography variant="h6">
                                 <Skeleton />
                              </MDTypography>
                              <MDTypography variant="subtitle2">
                                 <Skeleton />
                              </MDTypography>
                           </Box>
                           <Divider sx={{margin: "10px"}}></Divider>
                           <Box sx={{alignItems: "center"}}>
                              <Box key={`stat-${i}`}>
                                 <MDTypography variant="subtitle2">
                                    <Skeleton />
                                 </MDTypography>
                              </Box>
                           </Box>
                        </Box>
                     </Grid>
                  )
               )
            }
         </Grid>

      </Card>
   );
}

export default MultiStatisticsCard;
