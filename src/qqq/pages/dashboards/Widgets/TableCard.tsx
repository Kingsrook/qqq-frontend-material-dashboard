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

import {Icon} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import parse from "html-react-parser";
import React, {useEffect, useState} from "react";
import DataTable, {TableDataInput} from "qqq/components/Temporary/DataTable";
import MDBox from "qqq/components/Temporary/MDBox";
import MDTypography from "qqq/components/Temporary/MDTypography";


/////////////////////////
// inputs and defaults //
/////////////////////////
interface Props
{
   title: string;
   noRowsFoundHTML?: string;
   data: TableDataInput;
   dropdownOptions?: {
      id: string,
      name: string
   }[];
   dropdownOnChange?: (selectedValue: string, widgetIndex: number) => void;
   widgetIndex?: number;

   [key: string]: any;
}

function TableCard({title, noRowsFoundHTML, data, dropdownOptions, dropdownOnChange, widgetIndex}: Props): JSX.Element
{
   const openArrowIcon = "arrow_drop_down";
   const closeArrowIcon = "arrow_drop_up";
   const [dropdown, setDropdown] = useState<string | null>(null);
   const [dropdownValue, setDropdownValue] = useState("");
   const [dropdownLabel, setDropdownLabel] = useState<string>("");
   const [dropdownIcon, setDropdownIcon] = useState<string>(openArrowIcon);

   const openDropdown = ({currentTarget}: any) =>
   {
      setDropdown(currentTarget);
      setDropdownIcon(closeArrowIcon);
   };
   const closeDropdown = ({currentTarget}: any) =>
   {
      setDropdown(null);
      setDropdownValue(currentTarget.innerText || dropdownValue);
      setDropdownIcon(openArrowIcon);
      alert(widgetIndex);
      dropdownOnChange(currentTarget.innerText || dropdownValue, widgetIndex);
   };

   const renderMenu = (state: any, open: any, close: any, icon: string) => (
      dropdownOptions && (
         <span style={{whiteSpace: "nowrap"}}>
            <Icon onClick={open} fontSize={"medium"} style={{cursor: "pointer", float: "right"}}>{icon}</Icon>
            <Menu
               anchorEl={state}
               transformOrigin={{vertical: "top", horizontal: "center"}}
               open={Boolean(state)}
               onClose={close}
               keepMounted
               disableAutoFocusItem
            >
               {
                  dropdownOptions.map((optionMap, index: number) =>
                     <MenuItem id={optionMap["id"]} key={index} onClick={close}>{optionMap["name"]}</MenuItem>
                  )
               }
            </Menu>
         </span>
      )
   );

   useEffect(() =>
   {
      console.log(dropdownOptions);
      if (dropdownOptions)
      {
         setDropdownValue(dropdownOptions[0]["id"]);
         setDropdownLabel(dropdownOptions[0]["name"]);
      }
   }, [dropdownOptions]);

   return (
      <Card>
         <Grid container>
            <Grid item xs={7}>
               <MDBox pt={3} px={3}>
                  <MDTypography variant="h5" fontWeight="medium">
                     {title}
                  </MDTypography>
               </MDBox>
            </Grid>
            <Grid item xs={5}>
               {dropdownOptions && (
                  <MDBox p={2} width="100%" textAlign="right" lineHeight={1}>
                     <MDTypography
                        variant="caption"
                        color="secondary"
                        fontWeight="regular"
                     >
                        <strong>Billing Period: </strong>
                     </MDTypography>
                     <MDTypography
                        variant="caption"
                        color="secondary"
                        fontWeight="regular"
                        sx={{cursor: "pointer"}}
                        onClick={openDropdown}
                     >
                        {dropdownLabel}
                     </MDTypography>
                     {renderMenu(dropdown, openDropdown, closeDropdown, dropdownIcon)}
                  </MDBox>
               )}

            </Grid>
         </Grid>
         <MDBox py={1}>
            {
               data && data.rows ? (
                  <DataTable
                     table={data}
                     entriesPerPage={false}
                     showTotalEntries={false}
                     isSorted={false}
                     noEndBorder
                  />
               )
                  :
                  <MDBox p={3} pt={1} pb={1} sx={{textAlign: "center"}}>
                     <MDTypography
                        variant="subtitle2"
                        color="secondary"
                        fontWeight="regular"
                     >
                        {
                           noRowsFoundHTML ? (
                              parse(noRowsFoundHTML)
                           ) : "No rows found"
                        }
                     </MDTypography>
                  </MDBox>
            }
         </MDBox>
      </Card>
   );
}

export default TableCard;
