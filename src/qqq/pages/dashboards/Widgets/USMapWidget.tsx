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

import {QInstance} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QInstance";
import {Box, Grid} from "@mui/material";
import {VectorMap} from "@react-jvectormap/core";
import {usAea} from "@react-jvectormap/unitedstates";
import React, {useEffect, useState} from "react";
import QClient from "qqq/utils/QClient";


////////////////////////////////////////////////
// structure of expected US and A widget data //
////////////////////////////////////////////////
export interface MapMarkerData
{
   name: string;
   latitude: number;
   longitude: number;
}
export interface USMapWidgetData
{
   height: string;
   markers?: MapMarkerData[];
}


////////////////////////////////////
// define properties and defaults //
////////////////////////////////////
interface Props
{
   widgetIndex: number;
   label: string;
   icon?: string;
   reloadWidgetCallback?: (widgetIndex: number, params: string) => void;
   data: USMapWidgetData;
}


const qController = QClient.getInstance();
function USMapWidget(props: Props, ): JSX.Element
{
   const [qInstance, setQInstance] = useState(null as QInstance);

   useEffect(() =>
   {
      (async () =>
      {
         const newQInstance = await qController.loadMetaData();
         setQInstance(newQInstance);
      })();
   }, []);

   return (
      <Grid container>
         <Grid item xs={12} sx={{height: props.data?.height}}>
            {
               props.data?.height && (
                  <Box mt={3} sx={{height: "100%"}}>
                     <VectorMap
                        map={usAea}
                        zoomOnScroll={false}
                        zoomButtons={false}
                        markersSelectable
                        backgroundColor="transparent"
                        markers={[
                           {
                              name: "edison",
                              latLng: [40.5274, -74.3933],
                           },
                           {
                              name: "stockton",
                              latLng: [37.975556, -121.300833],
                           },
                           {
                              name: "patterson",
                              latLng: [37.473056, -121.132778],
                           },
                        ]}
                        regionStyle={{
                           initial: {
                              fill: "#dee2e7",
                              "fill-opacity": 1,
                              stroke: "none",
                              "stroke-width": 0,
                              "stroke-opacity": 0,
                           },
                        }}
                        markerStyle={{
                           initial: {
                              fill: "#e91e63",
                              stroke: "#ffffff",
                              "stroke-width": 5,
                              "stroke-opacity": 0.5,
                              r: 7,
                           },
                           hover: {
                              fill: "E91E63",
                              stroke: "#ffffff",
                              "stroke-width": 5,
                              "stroke-opacity": 0.5,
                           },
                           selected: {
                              fill: "E91E63",
                              stroke: "#ffffff",
                              "stroke-width": 5,
                              "stroke-opacity": 0.5,
                           },
                        }}
                        style={{
                           marginTop: "-1.5rem",
                        }}
                        onRegionTipShow={() => false}
                        onMarkerTipShow={() => false}
                     />
                  </Box>
               )
            }

         </Grid>
      </Grid>
   );
}

export default USMapWidget;
