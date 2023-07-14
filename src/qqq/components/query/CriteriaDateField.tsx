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
import {NowExpression} from "@kingsrook/qqq-frontend-core/lib/model/query/NowExpression";
import {NowWithOffsetExpression, NowWithOffsetOperator, NowWithOffsetUnit} from "@kingsrook/qqq-frontend-core/lib/model/query/NowWithOffsetExpression";
import {ThisOrLastPeriodExpression, ThisOrLastPeriodOperator, ThisOrLastPeriodUnit} from "@kingsrook/qqq-frontend-core/lib/model/query/ThisOrLastPeriodExpression";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment/InputAdornment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import React, {SyntheticEvent, useReducer, useState} from "react";
import AdvancedDateTimeFilterValues from "qqq/components/query/AdvancedDateTimeFilterValues";
import {QFilterCriteriaWithId} from "qqq/components/query/CustomFilterPanel";
import {makeTextField} from "qqq/components/query/FilterCriteriaRowValues";

interface CriteriaDateFieldProps
{
   valueIndex: number;
   label: string;
   idPrefix: string;
   field: QFieldMetaData;
   criteria: QFilterCriteriaWithId;
   valueChangeHandler: (event: React.ChangeEvent | SyntheticEvent, valueIndex?: number | "all", newValue?: any) => void;
}

CriteriaDateField.defaultProps = {
   valueIndex: 0,
   label: "Value",
   idPrefix: "value-"
};

export default function CriteriaDateField({valueIndex, label, idPrefix, field, criteria, valueChangeHandler}: CriteriaDateFieldProps): JSX.Element
{
   const [relativeDateTimeMenuAnchorElement, setRelativeDateTimeMenuAnchorElement] = useState(null);
   const [, forceUpdate] = useReducer((x) => x + 1, 0);

   const openRelativeDateTimeMenu = (event: React.MouseEvent<HTMLElement>) =>
   {
      setRelativeDateTimeMenuAnchorElement(event.currentTarget);
   };

   const closeRelativeDateTimeMenu = () =>
   {
      setRelativeDateTimeMenuAnchorElement(null);
   };

   const setExpressionNow = (valueIndex: number) =>
   {
      const expression = new NowExpression()
      saveNewDateTimeExpression(valueIndex, expression);

      closeRelativeDateTimeMenu();
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
      valueChangeHandler(null, valueIndex, expression);
      forceUpdate();
   }

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
         InputLabelProps={{shrink: true}}
         value={displayValue}
         fullWidth
      />;
   }

   const isExpression = criteria.values && criteria.values[valueIndex] && criteria.values[valueIndex].type;
   const currentExpression = isExpression ? criteria.values[valueIndex] : null;

   return <Box display="flex" alignItems="flex-end">
      {
         isExpression ? makeDateTimeExpressionTextField(criteria.values[valueIndex], valueIndex, label, idPrefix)
            : makeTextField(field, criteria, valueChangeHandler, valueIndex, label, idPrefix)
      }
      <Box>
         <Tooltip title={`Choose a common relative ${field.type == QFieldType.DATE ? "date" : "date-time"} expression`} placement="top">
            <Icon fontSize="small" color="info" sx={{mx: 0.25, cursor: "pointer"}} onClick={openRelativeDateTimeMenu}>date_range</Icon>
         </Tooltip>
         <Menu
            open={relativeDateTimeMenuAnchorElement}
            anchorEl={relativeDateTimeMenuAnchorElement}
            transformOrigin={{horizontal: "left", vertical: "top"}}
            onClose={closeRelativeDateTimeMenu}
         >
            {
               field.type == QFieldType.DATE ?
                  <Box display="flex">
                     <Box>
                        <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 7, "DAYS")}>7 days ago</MenuItem>
                        <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 14, "DAYS")}>14 days ago</MenuItem>
                        <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 30, "DAYS")}>30 days ago</MenuItem>
                        <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 90, "DAYS")}>90 days ago</MenuItem>
                        <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 180, "DAYS")}>180 days ago</MenuItem>
                        <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 1, "YEARS")}>1 year ago</MenuItem>
                     </Box>
                     <Box>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "DAYS")}>today</MenuItem>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "DAYS")}>yesterday</MenuItem>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "WEEKS")}>start of this week</MenuItem>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "WEEKS")}>start of last week</MenuItem>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "MONTHS")}>start of this month</MenuItem>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "MONTHS")}>start of last month</MenuItem>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "YEARS")}>start of this year</MenuItem>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "YEARS")}>start of last year</MenuItem>
                     </Box>
                  </Box>
                  :
                  <Box display="flex">
                     <Box>
                        <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 1, "HOURS")}>1 hour ago</MenuItem>
                        <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 12, "HOURS")}>12 hours ago</MenuItem>
                        <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 24, "HOURS")}>24 hours ago</MenuItem>
                        <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 7, "DAYS")}>7 days ago</MenuItem>
                        <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 14, "DAYS")}>14 days ago</MenuItem>
                        <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 30, "DAYS")}>30 days ago</MenuItem>
                        <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 90, "DAYS")}>90 days ago</MenuItem>
                        <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 180, "DAYS")}>180 days ago</MenuItem>
                        <MenuItem onClick={() => setExpressionNowWithOffset(valueIndex, "MINUS", 1, "YEARS")}>1 year ago</MenuItem>
                     </Box>
                     <Box>
                        <MenuItem onClick={() => setExpressionNow(valueIndex)}>now</MenuItem>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "HOURS")}>start of this hour</MenuItem>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "HOURS")}>start of last hour</MenuItem>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "DAYS")}>start of today</MenuItem>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "DAYS")}>start of yesterday</MenuItem>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "WEEKS")}>start of this week</MenuItem>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "WEEKS")}>start of last week</MenuItem>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "MONTHS")}>start of this month</MenuItem>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "MONTHS")}>start of last month</MenuItem>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "THIS", "YEARS")}>start of this year</MenuItem>
                        <MenuItem onClick={() => setExpressionThisOrLastPeriod(valueIndex, "LAST", "YEARS")}>start of last year</MenuItem>
                     </Box>
                  </Box>
            }
         </Menu>
      </Box>
      <Box>
         <AdvancedDateTimeFilterValues type={field.type} expression={currentExpression} onSave={(expression: any) => saveNewDateTimeExpression(valueIndex, expression)} />
      </Box>
   </Box>;
}
