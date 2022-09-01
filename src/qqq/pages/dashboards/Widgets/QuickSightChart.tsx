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

import Card from "@mui/material/Card";
import React from "react";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";

interface Props
{
   label: string;
   url: string;
}

interface IframeProps
{
   iframe: string;
}

function Iframe({iframe}: IframeProps)
{
   return (<div dangerouslySetInnerHTML={{__html: iframe || ""}} />);
}

function QuickSightChart({label, url}: Props): JSX.Element
{
   const iframe = `<iframe style='border: 0 solid #04aaef; height: 411px; width: 99%' title=${label} src=${url} />`;

   return (
      <Card sx={{height: "100%"}}>
         <MDBox padding="1rem">
            <MDTypography variant="h5">{label}</MDTypography>
            <Iframe iframe={iframe} />
         </MDBox>
      </Card>
   );
}

export default QuickSightChart;
