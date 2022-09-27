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

// Declaring props types for ProductCell
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";

interface Props
{
   imageUrl: string;
   label: string;
   total?: string | number;
   totalType?: string;
}

function ImageCell({imageUrl, label, total, totalType}: Props): JSX.Element
{
   return (
      <MDBox display="flex" alignItems="center" pr={2}>
         <MDBox mr={2}>
            <img src={imageUrl} alt={label} />
         </MDBox>
         <MDBox display="flex" flexDirection="column">
            <MDTypography variant="button" fontWeight="medium">
               {label}
            </MDTypography>
            <MDTypography variant="button" fontWeight="regular" color="secondary">
               <MDTypography component="span" variant="button" fontWeight="regular" color="success">
                  {total}
               </MDTypography>{" "}
               {totalType}
            </MDTypography>
         </MDBox>
      </MDBox>
   );
}

export default ImageCell;
