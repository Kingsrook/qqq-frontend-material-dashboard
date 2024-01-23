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

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import {QCancelButton, QSaveButton} from "qqq/components/buttons/DefaultButtons";


/*******************************************************************************
 ** Component that is the dialog for the user to enter the selection-subset
 *******************************************************************************/
export default function SelectionSubsetDialog(props: { isOpen: boolean; initialValue: number; closeHandler: (value?: number) => void })
{
   const [value, setValue] = useState(props.initialValue);

   const handleChange = (newValue: string) =>
   {
      setValue(parseInt(newValue));
   };

   const keyPressed = (e: React.KeyboardEvent<HTMLDivElement>) =>
   {
      if (e.key == "Enter" && value)
      {
         props.closeHandler(value);
      }
   };

   return (
      <Dialog open={props.isOpen} onClose={() => props.closeHandler()} onKeyPress={(e) => keyPressed(e)}>
         <DialogTitle>Subset of the Query Result</DialogTitle>
         <DialogContent>
            <DialogContentText>How many records do you want to select?</DialogContentText>
            <TextField
               autoFocus
               name="selection-subset-size"
               inputProps={{width: "100%", type: "number", min: 1}}
               onChange={(e) => handleChange(e.target.value)}
               value={value}
               sx={{width: "100%"}}
               onFocus={event => event.target.select()}
            />
         </DialogContent>
         <DialogActions>
            <QCancelButton disabled={false} onClickHandler={() => props.closeHandler()} />
            <QSaveButton label="OK" iconName="check" disabled={value == undefined || isNaN(value)} onClickHandler={() => props.closeHandler(value)} />
         </DialogActions>
      </Dialog>
   );
}

