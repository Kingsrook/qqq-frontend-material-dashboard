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

import {Chip} from "@mui/material";
import TextField from "@mui/material/TextField";
import {makeStyles} from "@mui/styles";
import Downshift from "downshift";
import {arrayOf, func, string} from "prop-types";
import React, {useEffect, useState} from "react";

const useStyles = makeStyles((theme: any) => ({
   chip: {
      margin: theme.spacing(0.5, 0.25)
   }
}));

function ChipTextField({...props})
{
   const classes = useStyles();
   const {handleChipChange, label, chipType, disabled, placeholder, chipData, multiline, rows, ...other} = props;
   const [inputValue, setInputValue] = useState("");
   const [chips, setChips] = useState([]);


   useEffect(() =>
   {
      setChips(chipData);
   }, [chipData]);

   useEffect(() =>
   {
      handleChipChange(chips);
   }, [chips, handleChipChange]);

   function handleKeyDown(event: any)
   {
      if (event.key === "Enter")
      {
         const newChipList = [...chips];
         const duplicatedValues = newChipList.indexOf(
            event.target.value.trim()
         );

         if (duplicatedValues !== -1)
         {
            setInputValue("");
            return;
         }
         if (!event.target.value.replace(/\s/g, "").length) return;

         newChipList.push(event.target.value.trim());
         setChips(newChipList);
         setInputValue("");
      }
      else if (chips.length && !inputValue.length && event.key === "Backspace" )
      {
         setChips(chips.slice(0, chips.length - 1));
      }
   }

   function handleChange(item: any)
   {
      let newChipList = [...chips];
      if (newChipList.indexOf(item) === -1)
      {
         newChipList = [...newChipList, item];
      }
      setInputValue("");
      setChips(newChipList);
   }

   const handleDelete = (item: any) => () =>
   {
      const newChipList = [...chips];
      newChipList.splice(newChipList.indexOf(item), 1);
      setChips(newChipList);
   };

   function handleInputChange(event: { target: { value: React.SetStateAction<string>; }; })
   {
      setInputValue(event.target.value);
   }


   return (
      <React.Fragment>
         <Downshift
            id="downshift-multiple"
            inputValue={inputValue}
            onChange={handleChange}
            selectedItem={chips}
         >
            {({getInputProps}) =>
            {
               const {onBlur, onChange, onFocus} = getInputProps({
                  onKeyDown: handleKeyDown,
                  placeholder
               });
               // @ts-ignore
               return (
                  <div id="chip-text-field-container" style={{flexWrap: "wrap", display:"flex"}}>
                     <TextField
                        sx={{width: "100%"}}
                        disabled={disabled}
                        label={label}
                        InputProps={{
                           startAdornment:
                              <div>
                                 {
                                    chips.map((item, i) => (
                                       <Chip
                                          color={(chipType !== "number" || ! Number.isNaN(Number(item))) ? "info" : "error"}
                                          key={`${item}-${i}`}
                                          variant="outlined"
                                          tabIndex={-1}
                                          label={item}
                                          className={classes.chip}
                                       />

                                    ))
                                 }
                              </div>,
                           onBlur,
                           multiline,
                           rows,
                           onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                           {
                              handleInputChange(event);
                              onChange(event);
                           },
                           onFocus,
                           placeholder,
                           onKeyDown: handleKeyDown
                        }}
                     />
                  </div>
               );
            }}
         </Downshift>
      </React.Fragment>
   );
}
ChipTextField.defaultProps = {
   chipData: []
};
ChipTextField.propTypes = {
   handleChipChange: func.isRequired,
   chipData: arrayOf(string)
};

export default ChipTextField
