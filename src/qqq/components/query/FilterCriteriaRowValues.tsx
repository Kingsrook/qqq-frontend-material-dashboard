/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2023.  Kingsrook, LLC
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
import {QFieldType} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldType";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {FilterVariableExpression} from "@kingsrook/qqq-frontend-core/lib/model/query/FilterVariableExpression";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment/InputAdornment";
import TextField from "@mui/material/TextField";
import DynamicSelect from "qqq/components/forms/DynamicSelect";
import AssignFilterVariable from "qqq/components/query/AssignFilterVariable";
import CriteriaDateField, {NoWrapTooltip} from "qqq/components/query/CriteriaDateField";
import {QFilterCriteriaWithId} from "qqq/components/query/CustomFilterPanel";
import {EvaluatedExpression} from "qqq/components/query/EvaluatedExpression";
import FilterCriteriaPaster from "qqq/components/query/FilterCriteriaPaster";
import {OperatorOption, ValueMode} from "qqq/components/query/FilterCriteriaRow";
import {QueryScreenUsage} from "qqq/pages/records/query/RecordQuery";
import ValueUtils from "qqq/utils/qqq/ValueUtils";
import React, {SyntheticEvent, useReducer, useState} from "react";

interface Props
{
   operatorOption: OperatorOption;
   criteria: QFilterCriteriaWithId;
   field: QFieldMetaData;
   table: QTableMetaData;
   valueChangeHandler: (event: React.ChangeEvent | SyntheticEvent, valueIndex?: number | "all", newValue?: any) => void;
   initiallyOpenMultiValuePvs?: boolean;
   queryScreenUsage?: QueryScreenUsage;
}

FilterCriteriaRowValues.defaultProps =
   {
      initiallyOpenMultiValuePvs: false
   };

export const getTypeForTextField = (field: QFieldMetaData): string =>
{
   let type = "search";

   if (field.type == QFieldType.INTEGER)
   {
      type = "number";
   }
   else if (field.type == QFieldType.DATE)
   {
      type = "date";
   }
   else if (field.type == QFieldType.DATE_TIME)
   {
      type = "datetime-local";
   }

   return (type);
};

export const makeTextField = (field: QFieldMetaData, criteria: QFilterCriteriaWithId, valueChangeHandler?: (event: (React.ChangeEvent | React.SyntheticEvent), valueIndex?: (number | "all"), newValue?: any) => void, valueIndex: number = 0, label = "Value", idPrefix = "value-", allowVariables = false) =>
{
   const isExpression = criteria.values && criteria.values[valueIndex] && criteria.values[valueIndex].type;

   let type = getTypeForTextField(field);
   const inputLabelProps: any = {};

   if (field.type == QFieldType.DATE || field.type == QFieldType.DATE_TIME)
   {
      inputLabelProps.shrink = true;
   }

   let value = criteria.values[valueIndex];
   if (field.type == QFieldType.DATE_TIME && value && String(value).indexOf("Z") > -1)
   {
      value = ValueUtils.formatDateTimeValueForForm(value);
   }

   const clearValue = (event: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, index: number) =>
   {
      valueChangeHandler(event, index, "");
      document.getElementById(`${idPrefix}${criteria.id}`).focus();
   };


   /*******************************************************************************
    ** Event handler for key-down events - specifically added here, to stop pressing
    ** 'tab' in a date or date-time from closing the quick-filter...
    *******************************************************************************/
   const handleKeyDown = (e: any) =>
   {
      if (field.type == QFieldType.DATE || field.type == QFieldType.DATE_TIME)
      {
         if (e.code == "Tab")
         {
            console.log("Tab on date or date-time - don't close me, just move to the next sub-field!...");
            e.stopPropagation();
         }
      }
   };


   const makeFilterVariableTextField = (expression: FilterVariableExpression, valueIndex: number = 0, label = "Value", idPrefix = "value-") =>
   {
      const clearValue = (event: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, index: number) =>
      {
         valueChangeHandler(event, index, "");
         document.getElementById(`${idPrefix}${criteria.id}`).focus();
      };

      const inputProps2: any = {};
      inputProps2.endAdornment = (
         <InputAdornment position="end">
            <IconButton sx={{visibility: expression ? "visible" : "hidden"}} onClick={(event) => clearValue(event, valueIndex)}>
               <Icon>closer</Icon>
            </IconButton>
         </InputAdornment>
      );

      return <NoWrapTooltip title={<EvaluatedExpression field={field} expression={expression} />} placement="bottom" enterDelay={1000} sx={{marginLeft: "-75px !important", marginTop: "-8px !important"}}><TextField
         id={`${idPrefix}${criteria.id}`}
         label={label}
         variant="standard"
         autoComplete="off"
         InputProps={{disabled: true, readOnly: true, unselectable: "off", ...inputProps2}}
         InputLabelProps={{shrink: true}}
         value="${VARIABLE}"
         fullWidth
      /></NoWrapTooltip>;
   };

   const inputProps: any = {};
   inputProps.endAdornment = (
      <InputAdornment position="end">
         <IconButton sx={{visibility: value ? "visible" : "hidden"}} onClick={(event) => clearValue(event, valueIndex)}>
            <Icon>close</Icon>
         </IconButton>
      </InputAdornment>
   );

   return <Box sx={{margin: 0, padding: 0, display: "flex"}}>
      {
         isExpression ? (
            makeFilterVariableTextField(criteria.values[valueIndex], valueIndex, label, idPrefix)
         ) : (
            <TextField
               id={`${idPrefix}${criteria.id}`}
               label={label}
               variant="standard"
               autoComplete="off"
               type={type}
               onChange={(event) => valueChangeHandler(event, valueIndex)}
               onKeyDown={handleKeyDown}
               value={value}
               InputLabelProps={inputLabelProps}
               InputProps={inputProps}
               fullWidth
               autoFocus={true}
            />
         )
      }
      {
         allowVariables && (
            <AssignFilterVariable field={field} valueChangeHandler={valueChangeHandler} valueIndex={valueIndex} />
         )
      }
   </Box>;
};


function FilterCriteriaRowValues({operatorOption, criteria, field, table, valueChangeHandler, initiallyOpenMultiValuePvs, queryScreenUsage}: Props): JSX.Element
{
   const [, forceUpdate] = useReducer((x) => x + 1, 0);
   const [allowVariables, setAllowVariables] = useState(queryScreenUsage == "reportSetup");

   if (!operatorOption)
   {
      return null;
   }

   function saveNewPasterValues(newValues: any[])
   {
      if (criteria.values)
      {
         criteria.values = [...criteria.values, ...newValues];
      }
      else
      {
         criteria.values = newValues;
      }

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // we are somehow getting some empty-strings as first-value leaking through.  they aren't cool, so, remove them if we find them //
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      if (criteria.values.length > 0 && criteria.values[0] == "")
      {
         criteria.values = criteria.values.splice(1);
      }

      valueChangeHandler(null, "all", criteria.values);
      forceUpdate();
   }

   const isExpression = criteria.values && criteria.values[0] && criteria.values[0].type;

   switch (operatorOption.valueMode)
   {
      case ValueMode.NONE:
         return null;
      case ValueMode.SINGLE:
         return makeTextField(field, criteria, valueChangeHandler, 0, undefined, undefined, allowVariables);
      case ValueMode.SINGLE_DATE:
         return <CriteriaDateField field={field} valueChangeHandler={valueChangeHandler} criteria={criteria} allowVariables={allowVariables} />;
      case ValueMode.DOUBLE_DATE:
         return <Box>
            <CriteriaDateField field={field} valueChangeHandler={valueChangeHandler} criteria={criteria} valueIndex={0} label="From" idPrefix="from-" allowVariables={allowVariables} />
            <CriteriaDateField field={field} valueChangeHandler={valueChangeHandler} criteria={criteria} valueIndex={1} label="To" idPrefix="to-" allowVariables={allowVariables} />
         </Box>;
      case ValueMode.SINGLE_DATE_TIME:
         return <CriteriaDateField field={field} valueChangeHandler={valueChangeHandler} criteria={criteria} allowVariables={allowVariables} />;
      case ValueMode.DOUBLE_DATE_TIME:
         return <Box>
            <CriteriaDateField field={field} valueChangeHandler={valueChangeHandler} criteria={criteria} valueIndex={0} label="From" idPrefix="from-" allowVariables={allowVariables} />
            <CriteriaDateField field={field} valueChangeHandler={valueChangeHandler} criteria={criteria} valueIndex={1} label="To" idPrefix="to-" allowVariables={allowVariables} />
         </Box>;
      case ValueMode.DOUBLE:
         return <Box>
            <Box width="50%" display="inline-block">
               {makeTextField(field, criteria, valueChangeHandler, 0, "From", "from-", allowVariables)}
            </Box>
            <Box width="50%" display="inline-block">
               {makeTextField(field, criteria, valueChangeHandler, 1, "To", "to-", allowVariables)}
            </Box>
         </Box>;
      case ValueMode.MULTI:
         let values = criteria.values;
         if (values && values.length == 1 && (values[0] == "" || values[0] == undefined))
         {
            values = [];
         }
         return <Box display="flex" alignItems="flex-end" className="multiValue">
            <Autocomplete
               renderInput={(params) => (<TextField {...params} variant="standard" label="Values" />)}
               options={[]}
               multiple
               freeSolo // todo - no debounce after enter?
               selectOnFocus
               clearOnBlur
               fullWidth
               limitTags={5}
               value={values}
               onChange={(event, value) => valueChangeHandler(event, "all", value)}
            />
            <Box>
               <FilterCriteriaPaster type={getTypeForTextField(field)} onSave={(newValues: any[]) => saveNewPasterValues(newValues)} />
            </Box>
         </Box>;
      case ValueMode.PVS_SINGLE:
         console.log("Doing pvs single: " + criteria.values);
         let selectedPossibleValue = null;
         if (criteria.values && criteria.values.length > 0)
         {
            selectedPossibleValue = criteria.values[0];
         }
         return <Box display="flex">
            {
               isExpression ? (
                  makeTextField(field, criteria, valueChangeHandler, 0, undefined, undefined, allowVariables)
               ) : (
                  <Box mb={-1.5} width={allowVariables && !isExpression ? "100%" : "100%"}>
                     <DynamicSelect
                        tableName={table.name}
                        fieldName={field.name}
                        overrideId={field.name + "-single-" + criteria.id}
                        key={field.name + "-single-" + criteria.id}
                        fieldLabel="Value"
                        initialValue={selectedPossibleValue?.id}
                        initialDisplayValue={selectedPossibleValue?.label}
                        inForm={false}
                        onChange={(value: any) => valueChangeHandler(null, 0, value)}
                        variant="standard"
                     />
                  </Box>
               )
            }
            {
               allowVariables && !isExpression && <Box mt={2.0}><AssignFilterVariable field={field} valueChangeHandler={valueChangeHandler} valueIndex={0} /></Box>
            }
         </Box>;
      case ValueMode.PVS_MULTI:
         console.log("Doing pvs multi: " + criteria.values);
         let initialValues: any[] = [];
         if (criteria.values && criteria.values.length > 0)
         {
            if (criteria.values.length == 1 && criteria.values[0] == "")
            {
               // we never want a tag that's just ""...
            }
            else
            {
               initialValues = criteria.values;
            }
         }
         return <Box display="flex">
            {
               isExpression ? (
                  makeTextField(field, criteria, valueChangeHandler, 0, undefined, undefined, allowVariables)
               ) : (
                  <Box mb={-1.5} width={allowVariables && !isExpression ? "90%" : "100%"}>
                     <DynamicSelect
                        tableName={table.name}
                        fieldName={field.name}
                        overrideId={field.name + "-multi-" + criteria.id}
                        key={field.name + "-multi-" + criteria.id}
                        isMultiple
                        fieldLabel="Values"
                        initialValues={initialValues}
                        initiallyOpen={false /*initiallyOpenMultiValuePvs*/}
                        inForm={false}
                        onChange={(value: any) => valueChangeHandler(null, "all", value)}
                        variant="standard"
                     />
                  </Box>
               )
            }
            {
               allowVariables && !isExpression && <Box mt={2.0} sx={{width: "10%"}}><AssignFilterVariable field={field} valueChangeHandler={valueChangeHandler} valueIndex={0} /></Box>
            }
         </Box>;
   }

   return (<br />);
}

export default FilterCriteriaRowValues;
