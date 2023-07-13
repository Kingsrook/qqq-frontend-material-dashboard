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
import {NowWithOffsetExpression, NowWithOffsetOperator, NowWithOffsetUnit} from "@kingsrook/qqq-frontend-core/lib/model/query/NowWithOffsetExpression";
import {ThisOrLastPeriodExpression, ThisOrLastPeriodOperator, ThisOrLastPeriodUnit} from "@kingsrook/qqq-frontend-core/lib/model/query/ThisOrLastPeriodExpression";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment/InputAdornment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectChangeEvent} from "@mui/material/Select/Select";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import React, {ReactNode, SyntheticEvent, useReducer, useState} from "react";
import DynamicSelect from "qqq/components/forms/DynamicSelect";
import AdvancedDateTimeFilterValues from "qqq/components/query/AdvancedDateTimeFilterValues";
import {QFilterCriteriaWithId} from "qqq/components/query/CustomFilterPanel";
import FilterCriteriaPaster from "qqq/components/query/FilterCriteriaPaster";
import {OperatorOption, ValueMode} from "qqq/components/query/FilterCriteriaRow";
import ValueUtils from "qqq/utils/qqq/ValueUtils";

interface Props
{
   operatorOption: OperatorOption;
   criteria: QFilterCriteriaWithId;
   field: QFieldMetaData;
   table: QTableMetaData;
   valueChangeHandler: (event: React.ChangeEvent | SyntheticEvent, valueIndex?: number | "all", newValue?: any, newExpression?: any) => void;
}

FilterCriteriaRowValues.defaultProps = {
};

function FilterCriteriaRowValues({operatorOption, criteria, field, table, valueChangeHandler}: Props): JSX.Element
{
   const [relativeDateTimeMenuAnchorElement, setRelativeDateTimeMenuAnchorElement] = useState(null);

   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   if (!operatorOption)
   {
      return <br />;
   }

   const getTypeForTextField = (): string =>
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

   const makeTextField = (valueIndex: number = 0, label = "Value", idPrefix = "value-") =>
   {
      let type = getTypeForTextField();
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

      const inputProps: any = {};
      inputProps.endAdornment = (
         <InputAdornment position="end">
            <IconButton sx={{visibility: value ? "visible" : "hidden"}} onClick={(event) => clearValue(event, valueIndex)}>
               <Icon>close</Icon>
            </IconButton>
         </InputAdornment>
      );

      return <TextField
         id={`${idPrefix}${criteria.id}`}
         label={label}
         variant="standard"
         autoComplete="off"
         type={type}
         onChange={(event) => valueChangeHandler(event, valueIndex)}
         value={value}
         InputLabelProps={inputLabelProps}
         InputProps={inputProps}
         fullWidth
      />;
   };

   const makeDateTimeExpressionTextField = (expression: any, valueIndex: number = 0, label = "Value", idPrefix = "value-") =>
   {
      const clearValue = (event: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, index: number) =>
      {
         valueChangeHandler(event, index, "");
         forceUpdate()
         document.getElementById(`${idPrefix}${criteria.id}`).focus();
      };

      const inputProps: any = {};
      inputProps.endAdornment = (
         <InputAdornment position="end">
            <IconButton sx={{visibility: expression ? "visible" : "hidden"}} onClick={(event) => clearValue(event, valueIndex)}>
               <Icon>close</Icon>
            </IconButton>
         </InputAdornment>
      );

      let displayValue = expression.toString();
      if (expression?.type == "ThisOrLastPeriod")
      {
         if(field.type == QFieldType.DATE_TIME || (field.type == QFieldType.DATE && expression.timeUnit != "DAYS"))
         {
            displayValue = "start of " + displayValue;
         }
      }

      return <TextField
         id={`${idPrefix}${criteria.id}`}
         label={label}
         variant="standard"
         autoComplete="off"
         InputProps={{readOnly: true, unselectable: "off", ...inputProps}}
         value={displayValue}
         fullWidth
      />;
   }

   const makeDateField = (valueIndex: number = 0, label = "Value", idPrefix = "value-") =>
   {
      return <Box display="flex" alignItems="flex-end">
         {
            criteria.expression == null && makeTextField(valueIndex, label, idPrefix)
         }
         {
            criteria.expression != null && makeDateTimeExpressionTextField(criteria.expression, valueIndex, label, idPrefix)
         }
         <Box>
            <Tooltip title="Choose a common relative date expression" placement="top">
               <Icon fontSize="small" color="info" sx={{mx: 0.25, cursor: "pointer"}} onClick={openRelativeDateTimeMenu}>date_range</Icon>
            </Tooltip>
            <Menu
               open={relativeDateTimeMenuAnchorElement}
               anchorEl={relativeDateTimeMenuAnchorElement}
               transformOrigin={{horizontal: "center", vertical: "top"}}
               onClose={closeRelativeDateTimeMenu}
            >
               <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 1, "DAYS")}>1 day ago</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "DAYS")}>today</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "DAYS")}>yesterday</MenuItem>
               <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 7, "DAYS")}>7 days ago</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "WEEKS")}>start of this week</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "WEEKS")}>start of last week</MenuItem>
               <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 14, "DAYS")}>14 days ago</MenuItem>
               <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 30, "DAYS")}>30 days ago</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "MONTHS")}>start of this month</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "MONTHS")}>start of last month</MenuItem>
               <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 90, "DAYS")}>90 days ago</MenuItem>
               <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 180, "DAYS")}>180 days ago</MenuItem>
               <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 1, "YEARS")}>1 year ago</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "YEARS")}>start of this year</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "YEARS")}>start of last year</MenuItem>
            </Menu>
         </Box>
         <Box>
            <AdvancedDateTimeFilterValues type={"date"} expression={criteria.expression} onSave={(expression: any) => saveNewDateTimeExpression(valueIndex, expression)} />
         </Box>
      </Box>;
   }

   const makeDateTimeField = (valueIndex: number = 0, label = "Value", idPrefix = "value-") =>
   {
      return <Box display="flex" alignItems="flex-end">
         {
            criteria.expression == null && makeTextField(valueIndex, label, idPrefix)
         }
         {
            criteria.expression != null && makeDateTimeExpressionTextField(criteria.expression, valueIndex, label, idPrefix)
         }
         <Box>
            <Tooltip title="Choose a common relative date-time expression" placement="top">
               <Icon fontSize="small" color="info" sx={{mx: 0.25, cursor: "pointer"}} onClick={openRelativeDateTimeMenu}>date_range</Icon>
            </Tooltip>
            <Menu
               open={relativeDateTimeMenuAnchorElement}
               anchorEl={relativeDateTimeMenuAnchorElement}
               transformOrigin={{horizontal: "center", vertical: "top"}}
               onClose={closeRelativeDateTimeMenu}
            >
               <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 1, "HOURS")}>1 hour ago</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "HOURS")}>start of this hour</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "HOURS")}>start of last hour</MenuItem>
               <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 12, "HOURS")}>12 hours ago</MenuItem>
               <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 24, "HOURS")}>24 hours ago</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "DAYS")}>start of today</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "DAYS")}>start of yesterday</MenuItem>
               <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 7, "DAYS")}>7 days ago</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "WEEKS")}>start of this week</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "WEEKS")}>start of last week</MenuItem>
               <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 14, "DAYS")}>14 days ago</MenuItem>
               <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 30, "DAYS")}>30 days ago</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "MONTHS")}>start of this month</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "MONTHS")}>start of last month</MenuItem>
               <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 90, "DAYS")}>90 days ago</MenuItem>
               <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 180, "DAYS")}>180 days ago</MenuItem>
               <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 1, "YEARS")}>1 year ago</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "YEARS")}>start of this year</MenuItem>
               <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "YEARS")}>start of last year</MenuItem>
            </Menu>
         </Box>
         <Box>
            <AdvancedDateTimeFilterValues type={"datetime"} expression={criteria.expression} onSave={(expression: any) => saveNewDateTimeExpression(valueIndex, expression)} />
         </Box>
      </Box>;
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

   const openRelativeDateTimeMenu = (event: React.MouseEvent<HTMLElement>) =>
   {
      setRelativeDateTimeMenuAnchorElement(event.currentTarget);
   };

   const closeRelativeDateTimeMenu = () =>
   {
      setRelativeDateTimeMenuAnchorElement(null);
   };

   const setExpressionNowWithOffset = (valueIndex: number, operator: NowWithOffsetOperator, amount: number, timeUnit: NowWithOffsetUnit) =>
   {
      const expression = new NowWithOffsetExpression()
      expression.operator = operator;
      expression.amount = amount;
      expression.timeUnit = timeUnit;

      saveNewDateTimeExpression(valueIndex, expression);

      closeRelativeDateTimeMenu();
   };

   const setExpressionThisOrLastPeriod = (valueIndex: number, operator: ThisOrLastPeriodOperator, timeUnit: ThisOrLastPeriodUnit) =>
   {
      const expression = new ThisOrLastPeriodExpression()
      expression.operator = operator;
      expression.timeUnit = timeUnit;

      saveNewDateTimeExpression(valueIndex, expression);

      closeRelativeDateTimeMenu();
   };

   function saveNewDateTimeExpression(valueIndex: number, expression: any)
   {
      criteria.expression = expression;
      criteria.values = null;
      valueChangeHandler(null, valueIndex, null, expression);
      forceUpdate();
   }

   switch (operatorOption.valueMode)
   {
      case ValueMode.NONE:
         return <br />;
      case ValueMode.SINGLE:
         return makeTextField();
      case ValueMode.SINGLE_DATE:
         return makeDateField();
      case ValueMode.DOUBLE_DATE:
         return <Box>
            {makeDateField(0, "From", "from-")}
            {makeDateField(1, "To", "to-")}
         </Box>
      case ValueMode.SINGLE_DATE_TIME:
         return makeDateTimeField();
      case ValueMode.DOUBLE:
         return <Box>
            <Box width="50%" display="inline-block">
               { makeTextField(0, "From", "from-") }
            </Box>
            <Box width="50%" display="inline-block">
               {makeTextField(1, "To", "to-")}
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
               <FilterCriteriaPaster type={getTypeForTextField()} onSave={(newValues: any[]) => saveNewPasterValues(newValues)} />
            </Box>
         </Box>;
      case ValueMode.PVS_SINGLE:
         console.log("Doing pvs single: " + criteria.values);
         let selectedPossibleValue = null;
         if (criteria.values && criteria.values.length > 0)
         {
            selectedPossibleValue = criteria.values[0];
         }
         return <Box mb={-1.5}>
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
            />
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
         return <Box mb={-1.5}>
            <DynamicSelect
               tableName={table.name}
               fieldName={field.name}
               overrideId={field.name + "-multi-" + criteria.id}
               key={field.name + "-multi-" + criteria.id}
               isMultiple
               fieldLabel="Values"
               initialValues={initialValues}
               inForm={false}
               onChange={(value: any) => valueChangeHandler(null, "all", value)}
            />
         </Box>
   }

   return (<br />);
}

export default FilterCriteriaRowValues;