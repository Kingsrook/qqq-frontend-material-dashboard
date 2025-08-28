/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2024.  Kingsrook, LLC
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


import {AdornmentType} from "@qrunio/qqq-frontend-core/lib/model/metaData/AdornmentType";
import {QFieldMetaData} from "@qrunio/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import Grid from "@mui/material/Grid";
import MDTypography from "qqq/components/legacy/MDTypography";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

interface ProcessViewFormProps
{
   fields: QFieldMetaData[];
   values: { [fieldName: string]: any };
   columns?: number;
}

ProcessViewForm.defaultProps = {
   columns: 2
};

/***************************************************************************
 ** a "view form" within a process step
 **
 ***************************************************************************/
export default function ProcessViewForm({fields, values, columns}: ProcessViewFormProps): JSX.Element
{
   const sm = Math.floor(12 / columns);

   return <Grid container>
      {fields.map((field: QFieldMetaData) => (
         field.hasAdornment(AdornmentType.ERROR) ? (
            values[field.name] && (
               <Grid item xs={12} sm={sm} key={field.name} display="flex" py={1} pr={2}>
                  <MDTypography variant="button" fontWeight="regular">
                     {ValueUtils.getValueForDisplay(field, values[field.name], undefined, "view")}
                  </MDTypography>
               </Grid>
            )
         ) : (
            <Grid item xs={12} sm={sm} key={field.name} display="flex" py={1} pr={2}>
               <MDTypography variant="button" fontWeight="bold">
                  {field.label}
                  : &nbsp;
               </MDTypography>
               <MDTypography variant="button" fontWeight="regular" color="text">
                  {ValueUtils.getValueForDisplay(field, values[field.name], undefined, "view")}
               </MDTypography>
            </Grid>
         )))
      }
   </Grid>;
}
