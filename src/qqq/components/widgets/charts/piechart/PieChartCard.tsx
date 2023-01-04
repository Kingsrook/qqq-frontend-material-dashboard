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
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import parse from "html-react-parser";
import MDBadgeDot from "qqq/components/legacy/MDBadgeDot";
import MDTypography from "qqq/components/legacy/MDTypography";
import PieChart, {PieChartData} from "qqq/components/widgets/charts/piechart/PieChart";

// Declaring props types for PieChart
interface Props
{
   title?: string;
   description?: string;
   data: PieChartData;

   [key: string]: any;
}

function PieChartCard({title, description, data}: Props): JSX.Element
{
   const allBackgroundColors = ["info", "warning", "primary", "success", "error", "secondary", "dark"];

   if (data && data.dataset)
   {
      data.dataset.backgroundColors = allBackgroundColors;
   }

   return (
      <Card sx={{height: "100%", width: "100%", display: "flex"}}>
         <Box display="flex" pt={2} px={2}>
            <MDTypography variant="h5">{title}</MDTypography>
         </Box>
         <Box mt={3}>
            <Grid container alignItems="center">
               <Grid item xs={7}>
                  <PieChart chart={data} height="9.5rem" />
               </Grid>
               <Grid item xs={5}>
                  <Box pr={1}>
                     {
                        data && data.labels ? (
                           (data.labels.map((label: string, index: number) => (
                              <Box key={index}>
                                 <MDBadgeDot color={allBackgroundColors[index]} size="sm" badgeContent={label} />
                              </Box>
                           )
                           ))) : null
                     }
                  </Box>
               </Grid>
            </Grid>
            <Divider />
            {
               description && (
                  <Grid container>
                     <Grid item xs={12}>
                        <Box pb={2} px={2} display="flex" flexDirection={{xs: "column", sm: "row"}} mt="auto">
                           <MDTypography variant="button" color="text" fontWeight="light">
                              {parse(description)}
                           </MDTypography>
                        </Box>
                     </Grid>
                  </Grid>
               )
            }
         </Box>
      </Card>
   );
}

export default PieChartCard;
