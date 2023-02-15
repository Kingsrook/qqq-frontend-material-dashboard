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

import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QPossibleValue} from "@kingsrook/qqq-frontend-core/lib/model/QPossibleValue";
import {FormControl, InputLabel, Select, SelectChangeEvent, TextFieldProps} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {getGridNumericOperators, getGridStringOperators, GridColDef, GridFilterInputMultipleValue, GridFilterInputMultipleValueProps, GridFilterInputValueProps, GridFilterItem} from "@mui/x-data-grid-pro";
import {GridFilterInputValue} from "@mui/x-data-grid/components/panel/filterPanel/GridFilterInputValue";
import {GridApiCommunity} from "@mui/x-data-grid/internals";
import {GridFilterOperator} from "@mui/x-data-grid/models/gridFilterOperator";
import React, {useEffect, useRef, useState} from "react";
import {QCancelButton, QSaveButton} from "qqq/components/buttons/DefaultButtons";
import ChipTextField from "qqq/components/forms/ChipTextField";
import DynamicSelect from "qqq/components/forms/DynamicSelect";


////////////////////////////////
// input element for 'is any' //
////////////////////////////////
function CustomIsAnyInput(type: "number" | "text", props: GridFilterInputValueProps)
{
   enum Delimiter
   {
      DETECT_AUTOMATICALLY = "Detect Automatically",
      COMMA = "Comma",
      NEWLINE = "Newline",
      PIPE = "Pipe",
      SPACE = "Space",
      TAB = "Tab",
      CUSTOM = "Custom",
   }

   const delimiterToCharacterMap: { [key: string]: string } = {};

   delimiterToCharacterMap[Delimiter.COMMA] = "[,\n\r]";
   delimiterToCharacterMap[Delimiter.TAB] = "[\t,\n,\r]";
   delimiterToCharacterMap[Delimiter.NEWLINE] = "[\n\r]";
   delimiterToCharacterMap[Delimiter.PIPE] = "[\\|\r\n]";
   delimiterToCharacterMap[Delimiter.SPACE] = "[ \n\r]";

   const delimiterDropdownOptions = Object.values(Delimiter);

   const mainCardStyles: any = {};
   mainCardStyles.width = "60%";
   mainCardStyles.minWidth = "500px";

   const [gridFilterItem, setGridFilterItem] = useState(props.item);
   const [pasteModalIsOpen, setPasteModalIsOpen] = useState(false);
   const [inputText, setInputText] = useState("");
   const [delimiter, setDelimiter] = useState("");
   const [delimiterCharacter, setDelimiterCharacter] = useState("");
   const [customDelimiterValue, setCustomDelimiterValue] = useState("");
   const [chipData, setChipData] = useState(undefined);
   const [detectedText, setDetectedText] = useState("");
   const [errorText, setErrorText] = useState("");

   //////////////////////////////////////////////////////////////
   // handler for when paste icon is clicked in 'any' operator //
   //////////////////////////////////////////////////////////////
   const handlePasteClick = (event: any) =>
   {
      event.target.blur();
      setPasteModalIsOpen(true);
   };

   const applyValue = (item: GridFilterItem) =>
   {
      console.log(`updating grid values: ${JSON.stringify(item.value)}`);
      setGridFilterItem(item);
      props.applyValue(item);
   };

   const clearData = () =>
   {
      setDelimiter("");
      setDelimiterCharacter("");
      setChipData([]);
      setInputText("");
      setDetectedText("");
      setCustomDelimiterValue("");
      setPasteModalIsOpen(false);
   };

   const handleCancelClicked = () =>
   {
      clearData();
      setPasteModalIsOpen(false);
   };

   const handleSaveClicked = () =>
   {
      if (gridFilterItem)
      {
         ////////////////////////////////////////
         // if numeric remove any non-numerics //
         ////////////////////////////////////////
         let saveData = [];
         for (let i = 0; i < chipData.length; i++)
         {
            if (type !== "number" || !Number.isNaN(Number(chipData[i])))
            {
               saveData.push(chipData[i]);
            }
         }

         if (gridFilterItem.value)
         {
            gridFilterItem.value = [...gridFilterItem.value, ...saveData];
         }
         else
         {
            gridFilterItem.value = saveData;
         }

         setGridFilterItem(gridFilterItem);
         props.applyValue(gridFilterItem);
      }

      clearData();
      setPasteModalIsOpen(false);
   };

   ////////////////////////////////////////////////////////////////
   // when user selects a different delimiter on the parse modal //
   ////////////////////////////////////////////////////////////////
   const handleDelimiterChange = (event: SelectChangeEvent) =>
   {
      const newDelimiter = event.target.value;
      console.log(`Delimiter Changed to ${JSON.stringify(newDelimiter)}`);

      setDelimiter(newDelimiter);
      if (newDelimiter === Delimiter.CUSTOM)
      {
         setDelimiterCharacter(customDelimiterValue);
      }
      else
      {
         setDelimiterCharacter(delimiterToCharacterMap[newDelimiter]);
      }
   };

   const handleTextChange = (event: any) =>
   {
      const inputText = event.target.value;
      setInputText(inputText);
   };

   const handleCustomDelimiterChange = (event: any) =>
   {
      let inputText = event.target.value;
      setCustomDelimiterValue(inputText);
   };

   ///////////////////////////////////////////////////////////////////////////////////////
   // iterate over each character, putting them into 'buckets' so that we can determine //
   // a good default to use when data is pasted into the textarea                       //
   ///////////////////////////////////////////////////////////////////////////////////////
   const calculateAutomaticDelimiter = (text: string): string =>
   {
      const buckets = new Map();
      for (let i = 0; i < text.length; i++)
      {
         let bucketName = "";

         switch (text.charAt(i))
         {
            case "\t":
               bucketName = Delimiter.TAB;
               break;
            case "\n":
            case "\r":
               bucketName = Delimiter.NEWLINE;
               break;
            case "|":
               bucketName = Delimiter.PIPE;
               break;
            case " ":
               bucketName = Delimiter.SPACE;
               break;
            case ",":
               bucketName = Delimiter.COMMA;
               break;
         }

         if (bucketName !== "")
         {
            let currentCount = (buckets.has(bucketName)) ? buckets.get(bucketName) : 0;
            buckets.set(bucketName, currentCount + 1);
         }
      }

      ///////////////////////
      // default is commas //
      ///////////////////////
      let highestCount = 0;
      let delimiter = Delimiter.COMMA;
      for (let j = 0; j < delimiterDropdownOptions.length; j++)
      {
         let bucketName = delimiterDropdownOptions[j];
         if (buckets.has(bucketName) && buckets.get(bucketName) > highestCount)
         {
            delimiter = bucketName;
            highestCount = buckets.get(bucketName);
         }
      }

      setDetectedText(`${delimiter} Detected`);
      return (delimiterToCharacterMap[delimiter]);
   };

   useEffect(() =>
   {
      let currentDelimiter = delimiter;
      let currentDelimiterCharacter = delimiterCharacter;

      /////////////////////////////////////////////////////////////////////////////
      // if no delimiter already set in the state, call function to determine it //
      /////////////////////////////////////////////////////////////////////////////
      if (!currentDelimiter || currentDelimiter === Delimiter.DETECT_AUTOMATICALLY)
      {
         currentDelimiterCharacter = calculateAutomaticDelimiter(inputText);
         if (!currentDelimiterCharacter)
         {
            return;
         }

         currentDelimiter = Delimiter.DETECT_AUTOMATICALLY;
         setDelimiter(Delimiter.DETECT_AUTOMATICALLY);
         setDelimiterCharacter(currentDelimiterCharacter);
      }
      else if (currentDelimiter === Delimiter.CUSTOM)
      {
         ////////////////////////////////////////////////////
         // if custom, make sure to split on new lines too //
         ////////////////////////////////////////////////////
         currentDelimiterCharacter = `[${customDelimiterValue}\r\n]`;
      }

      console.log(`current delimiter is: ${currentDelimiter}, delimiting on: ${currentDelimiterCharacter}`);

      let regex = new RegExp(currentDelimiterCharacter);
      let parts = inputText.split(regex);
      let chipData = [] as string[];

      ///////////////////////////////////////////////////////
      // if delimiter is empty string, dont split anything //
      ///////////////////////////////////////////////////////
      setErrorText("");
      if (currentDelimiterCharacter !== "")
      {
         for (let i = 0; i < parts.length; i++)
         {
            let part = parts[i].trim();
            if (part !== "")
            {
               chipData.push(part);

               ///////////////////////////////////////////////////////////
               // if numeric, check that first before pushing as a chip //
               ///////////////////////////////////////////////////////////
               if (type === "number" && Number.isNaN(Number(part)))
               {
                  setErrorText("Some values are not numbers");
               }
            }
         }
      }

      setChipData(chipData);

   }, [inputText, delimiterCharacter, customDelimiterValue, detectedText]);

   return (
      <Box>
         {
            props &&
            (
               <Box id="testId" sx={{width: "100%", display: "inline-flex", flexDirection: "row", alignItems: "end", height: 48}}>
                  <GridFilterInputMultipleValue
                     sx={{width: "100%"}}
                     variant="standard"
                     type={type} {...props}
                     applyValue={applyValue}
                     item={gridFilterItem}
                  />
                  <Tooltip title="Quickly add many values to your filter by pasting them from a spreadsheet or any other data source.">
                     <Icon onClick={handlePasteClick} fontSize="small" color="info" sx={{marginLeft: "10px", cursor: "pointer"}}>paste_content</Icon>
                  </Tooltip>
               </Box>
            )
         }
         {
            pasteModalIsOpen &&
            (
               <Modal open={pasteModalIsOpen}>
                  <Box sx={{position: "absolute", overflowY: "auto", width: "100%"}}>
                     <Box py={3} justifyContent="center" sx={{display: "flex", mt: 8}}>
                        <Card sx={mainCardStyles}>
                           <Box p={4} pb={2}>
                              <Grid container>
                                 <Grid item pr={3} xs={12} lg={12}>
                                    <Typography variant="h5">Bulk Add Filter Values</Typography>
                                    <Typography sx={{display: "flex", lineHeight: "1.7", textTransform: "revert"}} variant="button">
                                       Paste into the box on the left.
                                       Review the filter values in the box on the right.
                                       If the filter values are not what are expected, try changing the separator using the dropdown below.
                                    </Typography>
                                 </Grid>
                              </Grid>
                           </Box>
                           <Grid container pl={3} pr={3} justifyContent="center" alignItems="stretch" sx={{display: "flex", height: "100%"}}>
                              <Grid item pr={3} xs={6} lg={6} sx={{width: "100%", display: "flex", flexDirection: "column", flexGrow: 1}}>
                                 <FormControl sx={{m: 1, width: "100%"}}>
                                    <TextField
                                       id="outlined-multiline-static"
                                       label="PASTE TEXT"
                                       multiline
                                       onChange={handleTextChange}
                                       rows={16}
                                       value={inputText}
                                    />
                                 </FormControl>
                              </Grid>
                              <Grid item xs={6} lg={6} sx={{display: "flex", flexGrow: 1}}>
                                 <FormControl sx={{m: 1, width: "100%"}}>
                                    <ChipTextField
                                       handleChipChange={() =>
                                       {
                                       }}
                                       chipData={chipData}
                                       chipType={type}
                                       multiline
                                       fullWidth
                                       variant="outlined"
                                       id="tags"
                                       rows={0}
                                       name="tags"
                                       label="FILTER VALUES REVIEW"
                                    />
                                 </FormControl>
                              </Grid>
                           </Grid>
                           <Grid container pl={3} pr={3} justifyContent="center" alignItems="stretch" sx={{display: "flex", height: "100%"}}>
                              <Grid item pl={1} pr={3} xs={6} lg={6} sx={{width: "100%", display: "flex", flexDirection: "column", flexGrow: 1}}>
                                 <Box sx={{display: "inline-flex", alignItems: "baseline"}}>
                                    <FormControl sx={{mt: 2, width: "50%"}}>
                                       <InputLabel htmlFor="select-native">
                                          SEPARATOR
                                       </InputLabel>
                                       <Select
                                          multiline
                                          native
                                          value={delimiter}
                                          onChange={handleDelimiterChange}
                                          label="SEPARATOR"
                                          size="medium"
                                          inputProps={{
                                             id: "select-native",
                                          }}
                                       >
                                          {delimiterDropdownOptions.map((delimiter) => (
                                             <option key={delimiter} value={delimiter}>
                                                {delimiter}
                                             </option>
                                          ))}
                                       </Select>
                                    </FormControl>
                                    {delimiter === Delimiter.CUSTOM.valueOf() && (

                                       <FormControl sx={{pl: 2, top: 5, width: "50%"}}>
                                          <TextField
                                             name="custom-delimiter-value"
                                             placeholder="Custom Separator"
                                             label="Custom Separator"
                                             variant="standard"
                                             value={customDelimiterValue}
                                             onChange={handleCustomDelimiterChange}
                                             inputProps={{maxLength: 1}}
                                          />
                                       </FormControl>
                                    )}
                                    {inputText && delimiter === Delimiter.DETECT_AUTOMATICALLY.valueOf() && (

                                       <Typography pl={2} variant="button" sx={{top: "1px", textTransform: "revert"}}>
                                          <i>{detectedText}</i>
                                       </Typography>
                                    )}
                                 </Box>
                              </Grid>
                              <Grid sx={{display: "flex", justifyContent: "flex-start", alignItems: "flex-start"}} item pl={1} xs={3} lg={3}>
                                 {
                                    errorText && chipData.length > 0 && (
                                       <Box sx={{display: "flex", justifyContent: "flex-start", alignItems: "flex-start"}}>
                                          <Icon color="error">error</Icon>
                                          <Typography sx={{paddingLeft: "4px", textTransform: "revert"}} variant="button">{errorText}</Typography>
                                       </Box>
                                    )
                                 }
                              </Grid>
                              <Grid sx={{display: "flex", justifyContent: "flex-end", alignItems: "flex-start"}} item pr={1} xs={3} lg={3}>
                                 {
                                    chipData && chipData.length > 0 && (
                                       <Typography sx={{textTransform: "revert"}} variant="button">{chipData.length.toLocaleString()} {chipData.length === 1 ? "value" : "values"}</Typography>
                                    )
                                 }
                              </Grid>
                           </Grid>
                           <Box p={3} pt={0}>
                              <Grid container pl={1} pr={1} justifyContent="right" alignItems="stretch" sx={{display: "flex-inline "}}>
                                 <QCancelButton
                                    onClickHandler={handleCancelClicked}
                                    iconName="cancel"
                                    disabled={false} />
                                 <QSaveButton onClickHandler={handleSaveClicked} label="Add Filters" disabled={false} />
                              </Grid>
                           </Box>
                        </Card>
                     </Box>
                  </Box>
               </Modal>

            )
         }
      </Box>
   );
}

//////////////////////
// string operators //
//////////////////////
const stringNotEqualsOperator: GridFilterOperator = {
   label: "does not equal",
   value: "isNot",
   getApplyFilterFn: () => null,
   // @ts-ignore
   InputComponent: GridFilterInputValue,
};

const stringNotContainsOperator: GridFilterOperator = {
   label: "does not contain",
   value: "notContains",
   getApplyFilterFn: () => null,
   // @ts-ignore
   InputComponent: GridFilterInputValue,
};

const stringNotStartsWithOperator: GridFilterOperator = {
   label: "does not start with",
   value: "notStartsWith",
   getApplyFilterFn: () => null,
   // @ts-ignore
   InputComponent: GridFilterInputValue,
};

const stringNotEndWithOperator: GridFilterOperator = {
   label: "does not end with",
   value: "notEndsWith",
   getApplyFilterFn: () => null,
   // @ts-ignore
   InputComponent: GridFilterInputValue,
};

const stringIsAnyOfOperator: GridFilterOperator = {
   label: "is any of",
   value: "isAnyOf",
   getApplyFilterFn: () => null,
   // @ts-ignore
   InputComponent: (props: GridFilterInputMultipleValueProps<GridApiCommunity>) => CustomIsAnyInput("text", props)
};

let gridStringOperators = getGridStringOperators();
let equals = gridStringOperators.splice(1, 1)[0];
let contains = gridStringOperators.splice(0, 1)[0];
let startsWith = gridStringOperators.splice(0, 1)[0];
let endsWith = gridStringOperators.splice(0, 1)[0];

///////////////////////////////////
// remove default isany operator //
///////////////////////////////////
gridStringOperators.splice(2, 1)[0];
gridStringOperators = [equals, stringNotEqualsOperator, contains, stringNotContainsOperator, startsWith, stringNotStartsWithOperator, endsWith, stringNotEndWithOperator, ...gridStringOperators, stringIsAnyOfOperator];

export const QGridStringOperators = gridStringOperators;


///////////////////////////////////////
// input element for numbers-between //
///////////////////////////////////////
function InputNumberInterval(props: GridFilterInputValueProps)
{
   const SUBMIT_FILTER_STROKE_TIME = 500;
   const {item, applyValue, focusElementRef = null} = props;

   const filterTimeout = useRef<any>();
   const [filterValueState, setFilterValueState] = useState<[string, string]>(
      item.value ?? "",
   );
   const [applying, setIsApplying] = useState(false);

   useEffect(() =>
   {
      return () =>
      {
         clearTimeout(filterTimeout.current);
      };
   }, []);

   useEffect(() =>
   {
      const itemValue = item.value ?? [undefined, undefined];
      setFilterValueState(itemValue);
   }, [item.value]);

   const updateFilterValue = (lowerBound: string, upperBound: string) =>
   {
      clearTimeout(filterTimeout.current);
      setFilterValueState([lowerBound, upperBound]);

      setIsApplying(true);
      filterTimeout.current = setTimeout(() =>
      {
         setIsApplying(false);
         applyValue({...item, value: [lowerBound, upperBound]});
      }, SUBMIT_FILTER_STROKE_TIME);
   };

   const handleUpperFilterChange: TextFieldProps["onChange"] = (event) =>
   {
      const newUpperBound = event.target.value;
      updateFilterValue(filterValueState[0], newUpperBound);
   };
   const handleLowerFilterChange: TextFieldProps["onChange"] = (event) =>
   {
      const newLowerBound = event.target.value;
      updateFilterValue(newLowerBound, filterValueState[1]);
   };

   return (
      <Box
         sx={{
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "end",
            height: 48,
            pl: "20px",
         }}
      >
         <TextField
            name="lower-bound-input"
            placeholder="From"
            label="From"
            variant="standard"
            value={Number(filterValueState[0])}
            onChange={handleLowerFilterChange}
            type="number"
            inputRef={focusElementRef}
            sx={{mr: 2}}
         />
         <TextField
            name="upper-bound-input"
            placeholder="To"
            label="To"
            variant="standard"
            value={Number(filterValueState[1])}
            onChange={handleUpperFilterChange}
            type="number"
            InputProps={applying ? {endAdornment: <Icon>sync</Icon>} : {}}
         />
      </Box>
   );
}


//////////////////////
// number operators //
//////////////////////
const betweenOperator: GridFilterOperator = {
   label: "is between",
   value: "between",
   getApplyFilterFn: () => null,
   // @ts-ignore
   InputComponent: InputNumberInterval
};

const notBetweenOperator: GridFilterOperator = {
   label: "is not between",
   value: "notBetween",
   getApplyFilterFn: () => null,
   // @ts-ignore
   InputComponent: InputNumberInterval
};

const numericIsAnyOfOperator: GridFilterOperator = {
   label: "is any of",
   value: "isAnyOf",
   getApplyFilterFn: () => null,
   // @ts-ignore
   InputComponent: (props: GridFilterInputMultipleValueProps<GridApiCommunity>) => CustomIsAnyInput("number", props)
};

//////////////////////////////
// remove default is any of //
//////////////////////////////
let gridNumericOperators = getGridNumericOperators();
gridNumericOperators.splice(8, 1)[0];
export const QGridNumericOperators = [...gridNumericOperators, betweenOperator, notBetweenOperator, numericIsAnyOfOperator];

///////////////////////
// boolean operators //
///////////////////////
const booleanTrueOperator: GridFilterOperator = {
   label: "is yes",
   value: "isTrue",
   getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => null
};

const booleanFalseOperator: GridFilterOperator = {
   label: "is no",
   value: "isFalse",
   getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => null
};

const booleanEmptyOperator: GridFilterOperator = {
   label: "is empty",
   value: "isEmpty",
   getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => null
};

const booleanNotEmptyOperator: GridFilterOperator = {
   label: "is not empty",
   value: "isNotEmpty",
   getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => null
};

export const QGridBooleanOperators = [booleanTrueOperator, booleanFalseOperator, booleanEmptyOperator, booleanNotEmptyOperator];


///////////////////////////////////////
// input element for possible values //
///////////////////////////////////////
function InputPossibleValueSourceSingle(tableName: string, field: QFieldMetaData, props: GridFilterInputValueProps)
{
   const SUBMIT_FILTER_STROKE_TIME = 500;
   const {item, applyValue, focusElementRef = null} = props;

   console.log("Item.value?  " + item.value);

   const filterTimeout = useRef<any>();
   const [filterValueState, setFilterValueState] = useState<any>(item.value ?? null);
   const [selectedPossibleValue, setSelectedPossibleValue] = useState((item.value ?? null) as QPossibleValue);
   const [applying, setIsApplying] = useState(false);

   useEffect(() =>
   {
      return () =>
      {
         clearTimeout(filterTimeout.current);
      };
   }, []);

   useEffect(() =>
   {
      const itemValue = item.value ?? null;
      setFilterValueState(itemValue);
   }, [item.value]);

   const updateFilterValue = (value: QPossibleValue) =>
   {
      clearTimeout(filterTimeout.current);
      setFilterValueState(value);

      setIsApplying(true);
      filterTimeout.current = setTimeout(() =>
      {
         setIsApplying(false);
         applyValue({...item, value: value});
      }, SUBMIT_FILTER_STROKE_TIME);
   };

   const handleChange = (value: QPossibleValue) =>
   {
      updateFilterValue(value);
   };

   return (
      <Box
         sx={{
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "end",
            height: 48,
         }}
      >
         <DynamicSelect
            tableName={tableName}
            fieldName={field.name}
            fieldLabel="Value"
            initialValue={selectedPossibleValue?.id}
            initialDisplayValue={selectedPossibleValue?.label}
            inForm={false}
            onChange={handleChange}
            // InputProps={applying ? {endAdornment: <Icon>sync</Icon>} : {}}
         />
      </Box>
   );
}


////////////////////////////////////////////////
// input element for multiple possible values //
////////////////////////////////////////////////
function InputPossibleValueSourceMultiple(tableName: string, field: QFieldMetaData, props: GridFilterInputValueProps)
{
   const SUBMIT_FILTER_STROKE_TIME = 500;
   const {item, applyValue, focusElementRef = null} = props;

   console.log("Item.value?  " + item.value);

   const filterTimeout = useRef<any>();
   const [selectedPossibleValues, setSelectedPossibleValues] = useState(item.value as QPossibleValue[]);
   const [applying, setIsApplying] = useState(false);

   useEffect(() =>
   {
      return () =>
      {
         clearTimeout(filterTimeout.current);
      };
   }, []);

   useEffect(() =>
   {
      const itemValue = item.value ?? null;
   }, [item.value]);

   const updateFilterValue = (value: QPossibleValue) =>
   {
      clearTimeout(filterTimeout.current);

      setIsApplying(true);
      filterTimeout.current = setTimeout(() =>
      {
         setIsApplying(false);
         applyValue({...item, value: value});
      }, SUBMIT_FILTER_STROKE_TIME);
   };

   const handleChange = (value: QPossibleValue) =>
   {
      updateFilterValue(value);
   };

   return (
      <Box
         sx={{
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "end",
            height: 48,
         }}
      >
         <DynamicSelect
            tableName={tableName}
            fieldName={field.name}
            isMultiple={true}
            fieldLabel="Value"
            initialValues={selectedPossibleValues}
            inForm={false}
            onChange={handleChange}
         />
      </Box>
   );
}

const getPvsValueString = (value: GridFilterItem["value"]): string =>
{
   console.log("get pvs value", value);
   if (value && value.length)
   {
      let labels = [] as string[];
      for (let i = 0; i < value.length; i++)
      {
         if(value[i] && value[i].label)
         {
            labels.push(value[i].label);
         }
         else
         {
            labels.push(value);
         }
      }
      return (labels.join(", "));
   }
   else if (value && value.label)
   {
      return (value.label);
   }
   return (value);
};

//////////////////////////////////
// possible value set operators //
//////////////////////////////////
export const buildQGridPvsOperators = (tableName: string, field: QFieldMetaData): GridFilterOperator[] =>
{
   return ([
      {
         label: "is",
         value: "is",
         getApplyFilterFn: () => null,
         getValueAsString: getPvsValueString,
         InputComponent: (props: GridFilterInputValueProps<GridApiCommunity>) => InputPossibleValueSourceSingle(tableName, field, props)
      },
      {
         label: "is not",
         value: "isNot",
         getApplyFilterFn: () => null,
         getValueAsString: getPvsValueString,
         InputComponent: (props: GridFilterInputValueProps<GridApiCommunity>) => InputPossibleValueSourceSingle(tableName, field, props)
      },
      {
         label: "is any of",
         value: "isAnyOf",
         getValueAsString: getPvsValueString,
         getApplyFilterFn: () => null,
         InputComponent: (props: GridFilterInputValueProps<GridApiCommunity>) => InputPossibleValueSourceMultiple(tableName, field, props)
      },
      {
         label: "is none of",
         value: "isNone",
         getValueAsString: getPvsValueString,
         getApplyFilterFn: () => null,
         InputComponent: (props: GridFilterInputValueProps<GridApiCommunity>) => InputPossibleValueSourceMultiple(tableName, field, props)
      },
      {
         label: "is empty",
         value: "isEmpty",
         getValueAsString: getPvsValueString,
         getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => null
      },
      {
         label: "is not empty",
         value: "isNotEmpty",
         getValueAsString: getPvsValueString,
         getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => null
      }
   ]);
};
