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

import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QTableVariant} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableVariant";
import Autocomplete from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import React, {useEffect, useState} from "react";
import {TABLE_VARIANT_LOCAL_STORAGE_KEY_ROOT} from "qqq/pages/records/query/RecordQuery";
import Client from "qqq/utils/qqq/Client";

const qController = Client.getInstance();

/*******************************************************************************
 ** Component that is the dialog for the user to select a variant on tables with variant backends //
 *******************************************************************************/
export default function TableVariantDialog(props: { isOpen: boolean; table: QTableMetaData; closeHandler: (value?: QTableVariant) => void })
{
   const [value, setValue] = useState(null);
   const [dropDownOpen, setDropDownOpen] = useState(false);
   const [variants, setVariants] = useState(null);

   const handleVariantChange = (event: React.SyntheticEvent, value: any | any[], reason: string, details?: string) =>
   {
      const tableVariantLocalStorageKey = `${TABLE_VARIANT_LOCAL_STORAGE_KEY_ROOT}.${props.table.name}`;
      if (value != null)
      {
         localStorage.setItem(tableVariantLocalStorageKey, JSON.stringify(value));
      }
      else
      {
         localStorage.removeItem(tableVariantLocalStorageKey);
      }
      props.closeHandler(value);
   };

   const keyPressed = (e: React.KeyboardEvent<HTMLDivElement>) =>
   {
      if (e.key == "Enter" && value)
      {
         props.closeHandler(value);
      }
   };

   useEffect(() =>
   {
      console.log("queryVariants");
      try
      {
         (async () =>
         {
            const variants = await qController.tableVariants(props.table.name);
            console.log(JSON.stringify(variants));
            setVariants(variants);
         })();
      }
      catch (e)
      {
         console.log(e);
      }
   }, []);


   return variants && (
      <Dialog open={props.isOpen} onKeyPress={(e) => keyPressed(e)}>
         <DialogTitle>{props.table.variantTableLabel}</DialogTitle>
         <DialogContent>
            <DialogContentText>Select the {props.table.variantTableLabel} to be used on this table:</DialogContentText>
            <Autocomplete
               id="tableVariantId"
               sx={{width: "400px", marginTop: "10px"}}
               open={dropDownOpen}
               size="small"
               onOpen={() =>
               {
                  setDropDownOpen(true);
               }}
               onClose={() =>
               {
                  setDropDownOpen(false);
               }}
               // @ts-ignore
               onChange={handleVariantChange}
               isOptionEqualToValue={(option, value) => option.id === value.id}
               options={variants}
               renderInput={(params) => <TextField {...params} label={props.table.variantTableLabel} />}
               getOptionLabel={(option) =>
               {
                  if (typeof option == "object")
                  {
                     return (option as QTableVariant).name;
                  }
                  return option;
               }}
            />
         </DialogContent>
      </Dialog>
   );
}

