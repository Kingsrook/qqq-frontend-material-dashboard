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
import {TextFieldProps} from "@mui/material";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import {getGridNumericOperators, getGridStringOperators, GridColDef, GridFilterInputValueProps, GridFilterItem} from "@mui/x-data-grid-pro";
import {GridFilterInputValue} from "@mui/x-data-grid/components/panel/filterPanel/GridFilterInputValue";
import {GridApiCommunity} from "@mui/x-data-grid/internals";
import {GridFilterOperator} from "@mui/x-data-grid/models/gridFilterOperator";
import React, {useEffect, useRef, useState} from "react";
import QDynamicSelect from "qqq/components/QDynamicSelect/QDynamicSelect";

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

let gridStringOperators = getGridStringOperators();
let equals = gridStringOperators.splice(1, 1)[0];
let contains = gridStringOperators.splice(0, 1)[0];
let startsWith = gridStringOperators.splice(0, 1)[0];
let endsWith = gridStringOperators.splice(0, 1)[0];
gridStringOperators = [ equals, stringNotEqualsOperator, contains, stringNotContainsOperator, startsWith, stringNotStartsWithOperator, endsWith, stringNotEndWithOperator, ...gridStringOperators ];

export const QGridStringOperators = gridStringOperators;


///////////////////////////////////////
// input element for numbers-between //
///////////////////////////////////////
function InputNumberInterval(props: GridFilterInputValueProps)
{
   const SUBMIT_FILTER_STROKE_TIME = 500;
   const {item, applyValue, focusElementRef = null} = props;

   const filterTimeout = useRef<any>();
   const [ filterValueState, setFilterValueState ] = useState<[ string, string ]>(
      item.value ?? "",
   );
   const [ applying, setIsApplying ] = useState(false);

   useEffect(() =>
   {
      return () =>
      {
         clearTimeout(filterTimeout.current);
      };
   }, []);

   useEffect(() =>
   {
      const itemValue = item.value ?? [ undefined, undefined ];
      setFilterValueState(itemValue);
   }, [ item.value ]);

   const updateFilterValue = (lowerBound: string, upperBound: string) =>
   {
      clearTimeout(filterTimeout.current);
      setFilterValueState([ lowerBound, upperBound ]);

      setIsApplying(true);
      filterTimeout.current = setTimeout(() =>
      {
         setIsApplying(false);
         applyValue({...item, value: [ lowerBound, upperBound ]});
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

export const QGridNumericOperators = [ ...getGridNumericOperators(), betweenOperator, notBetweenOperator ];


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

export const QGridBooleanOperators = [ booleanTrueOperator, booleanFalseOperator, booleanEmptyOperator, booleanNotEmptyOperator ];


///////////////////////////////////////
// input element for possible values //
///////////////////////////////////////
function InputPossibleValueSourceSingle(tableName: string, field: QFieldMetaData, props: GridFilterInputValueProps)
{
   const SUBMIT_FILTER_STROKE_TIME = 500;
   const {item, applyValue, focusElementRef = null} = props;

   console.log("Item.value?  " + item.value);

   const filterTimeout = useRef<any>();
   const [ filterValueState, setFilterValueState ] = useState<any>(item.value ?? null);
   const [ selectedPossibleValue, setSelectedPossibleValue ] = useState((item.value ?? null) as QPossibleValue);
   const [ applying, setIsApplying ] = useState(false);

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
   }, [ item.value ]);

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
         <QDynamicSelect
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
         InputComponent: (props: GridFilterInputValueProps<GridApiCommunity>) => InputPossibleValueSourceSingle(tableName, field, props)
      },
      {
         label: "is not",
         value: "isNot",
         getApplyFilterFn: () => null,
         InputComponent: (props: GridFilterInputValueProps<GridApiCommunity>) => InputPossibleValueSourceSingle(tableName, field, props)
      },
      {
         label: "is empty",
         value: "isEmpty",
         getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => null
      },
      {
         label: "is not empty",
         value: "isNotEmpty",
         getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => null
      }
   ]);
};