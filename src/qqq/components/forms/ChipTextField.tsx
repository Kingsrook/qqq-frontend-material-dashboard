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
import {debounce} from "lodash";
import {arrayOf, func, string} from "prop-types";
import Client from "qqq/utils/qqq/Client";
import React, {useEffect, useRef, useState} from "react";

const useStyles = makeStyles((theme: any) => ({
   chip: {
      margin: theme.spacing(0.5, 0.25)
   }
}));

function ChipTextField({...props})
{
   const qController = Client.getInstance();
   const classes = useStyles();
   const {table, field, handleChipChange, label, chipType, disabled, placeholder, chipData, multiline, rows, ...other} = props;
   const [inputValue, setInputValue] = useState("");
   const [chips, setChips] = useState([]);
   const [chipColors, setChipColors] = useState([]);
   const [chipValidity, setChipValidity] = useState([] as boolean[]);
   const [chipPVSIds, setChipPVSIds] = useState([] as any[]);
   const [isMakingRequest, setIsMakingRequest] = useState(false);

   ////////////////////////////////////////////////////////////////////
   // these refs are used for the async api call for possible values //
   ////////////////////////////////////////////////////////////////////
   const chipsRef = useRef<string[]>([]);

   /////////////////////////////////////////////////////////////////////////////////////////////
   // use debounce library to not flood server as user types, wait a second before requesting //
   /////////////////////////////////////////////////////////////////////////////////////////////
   async function fetchPVSLabelsAndColorChips()
   {
      //////////////////////////////////////////////////////////
      // make a request for the possible value labels (chips) //
      //////////////////////////////////////////////////////////
      setIsMakingRequest(true);
      const currentChips = chipsRef.current;
      setChipColors([]);

      ///////////////////////////////////////////////////////////////////////////////
      // Determine chip colors based on whether each chip value appears in results //
      ///////////////////////////////////////////////////////////////////////////////
      const newChipColors = [] as string[];
      const chipValidity = [] as boolean[];
      const chipPVSIds = [] as any[];

      ////////////////////////////////////////////////////////////////////////////
      // make the request for all 'chips' with pagination to handle large sizes //
      ////////////////////////////////////////////////////////////////////////////
      const BATCH_SIZE = 250;
      for (let i = 0; i < currentChips.length; i += BATCH_SIZE)
      {
         const batch = currentChips.slice(i, i + BATCH_SIZE);
         const page = await qController.possibleValues(
            table.name,
            null,
            field.name,
            "",
            null,
            batch
         );
         for (let j = 0; j < batch.length; j++)
         {
            let found = false;
            for (let k = 0; k < page.length; k++)
            {
               const result = page[k];
               if (result.label.toLowerCase() === batch[j].toLowerCase())
               {
                  chipPVSIds.push(result.id);
                  newChipColors.push("info");
                  chipValidity.push(true);
                  found = true;
                  break;
               }
            }

            if (!found)
            {
               chipPVSIds.push(null);
               chipValidity.push(false);
               newChipColors.push("error");
            }
         }
      }

      setChipPVSIds(chipPVSIds);
      setChipColors(newChipColors);
      setChipValidity(chipValidity);
      setIsMakingRequest(false);
   }

   const debouncedApiCall = useRef(debounce(fetchPVSLabelsAndColorChips, 500)).current;

   useEffect(() =>
   {
      setChips(chipData);
      chipsRef.current = chipData;
      determineChipColors();

      if (chipType !== "pvs")
      {
         const currentChipValidity = chips.map((chip, i) =>
            (chipType !== "number" || !Number.isNaN(Number(chips[i])))
         );
         setChipValidity(currentChipValidity);
      }
   }, [JSON.stringify(chipData), chips]);

   useEffect(() =>
   {
      handleChipChange(isMakingRequest, chipValidity, chipPVSIds);
   }, [chipValidity, chipPVSIds, isMakingRequest]);

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
         if (!event.target.value.replace(/\s/g, "").length)
         {
            return;
         }

         setInputValue("");
         newChipList.push(event.target.value.trim());
         setChips(newChipList);
      }
      else if (chips.length && !inputValue.length && event.key === "Backspace")
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

   function handleInputChange(event: { target: { value: React.SetStateAction<string>; }; })
   {
      setInputValue(event.target.value);
   }

   function determineChipColors(): any
   {
      if (chipType === "pvs")
      {
         debouncedApiCall();
      }
      else
      {
         const newChipColors = chips.map((chip, i) =>
            (chipType !== "number" || !Number.isNaN(Number(chips[i]))) ? "info" : "error"
         );
         setChipColors(newChipColors);
      }
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
                  <div id="chip-text-field-container" style={{flexWrap: "wrap", display: "flex"}}>
                     <TextField
                        sx={{width: "99%"}}
                        disabled={disabled}
                        label={label}
                        InputProps={{
                           startAdornment:
                              <div style={{overflowY: "auto", overflowX: "hidden", margin: "-10px", width: "calc(100% + 20px)", padding: "10px", marginBottom: "-20px", height: "calc(100% + 10px)"}}>
                                 {
                                    chips.map((item, index) => (
                                       <Chip
                                          onChange={determineChipColors}
                                          color={chipColors[index]}
                                          key={`${item}-${index}`}
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

export default ChipTextField;
