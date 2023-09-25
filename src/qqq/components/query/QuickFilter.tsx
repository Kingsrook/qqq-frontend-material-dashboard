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
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QCriteriaOperator} from "@kingsrook/qqq-frontend-core/lib/model/query/QCriteriaOperator";
import {QFilterCriteria} from "@kingsrook/qqq-frontend-core/lib/model/query/QFilterCriteria";
import {Badge, Tooltip} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import TextField from "@mui/material/TextField";
import React, {SyntheticEvent, useState} from "react";
import {QFilterCriteriaWithId} from "qqq/components/query/CustomFilterPanel";
import {getDefaultCriteriaValue, getOperatorOptions, OperatorOption, validateCriteria} from "qqq/components/query/FilterCriteriaRow";
import FilterCriteriaRowValues from "qqq/components/query/FilterCriteriaRowValues";
import TableUtils from "qqq/utils/qqq/TableUtils";

type CriteriaParamType = QFilterCriteriaWithId | null | "tooComplex";

interface QuickFilterProps
{
   tableMetaData: QTableMetaData;
   fullFieldName: string;
   fieldMetaData: QFieldMetaData;
   criteriaParam: CriteriaParamType;
   updateCriteria: (newCriteria: QFilterCriteria, needDebounce: boolean, doRemoveCriteria: boolean) => void;
   defaultOperator?: QCriteriaOperator;
   toggleQuickFilterField?: (fieldName: string) => void;
}

const criteriaParamIsCriteria = (param: CriteriaParamType): boolean =>
{
   return (param != null && param != "tooComplex");
};

QuickFilter.defaultProps =
   {
      defaultOperator: QCriteriaOperator.EQUALS,
      toggleQuickFilterField: null
   };

let seedId = new Date().getTime() % 173237;

const getOperatorSelectedValue = (operatorOptions: OperatorOption[], criteria: QFilterCriteriaWithId, defaultOperator: QCriteriaOperator): OperatorOption =>
{
   if(criteria)
   {
      const filteredOptions = operatorOptions.filter(o => o.value == criteria.operator);
      if(filteredOptions.length > 0)
      {
         return (filteredOptions[0]);
      }
   }

   const filteredOptions = operatorOptions.filter(o => o.value == defaultOperator);
   if(filteredOptions.length > 0)
   {
      return (filteredOptions[0]);
   }

   return (null);
}

export default function QuickFilter({tableMetaData, fullFieldName, fieldMetaData, criteriaParam, updateCriteria, defaultOperator, toggleQuickFilterField}: QuickFilterProps): JSX.Element
{
   const operatorOptions = fieldMetaData ? getOperatorOptions(tableMetaData, fullFieldName) : [];
   const tableForField = tableMetaData; // todo!! const [_, tableForField] = TableUtils.getFieldAndTable(tableMetaData, fullFieldName);

   const [isOpen, setIsOpen] = useState(false);
   const [anchorEl, setAnchorEl] = useState(null);

   const [criteria, setCriteria] = useState(criteriaParamIsCriteria(criteriaParam) ? criteriaParam as QFilterCriteriaWithId : null);
   const [id, setId] = useState(criteriaParamIsCriteria(criteriaParam) ? (criteriaParam as QFilterCriteriaWithId).id : ++seedId);

   const [operatorSelectedValue, setOperatorSelectedValue] = useState(getOperatorSelectedValue(operatorOptions, criteria, defaultOperator));
   const [operatorInputValue, setOperatorInputValue] = useState(operatorSelectedValue?.label);

   const maybeNewOperatorSelectedValue = getOperatorSelectedValue(operatorOptions, criteria, defaultOperator);
   if(JSON.stringify(maybeNewOperatorSelectedValue) !== JSON.stringify(operatorSelectedValue))
   {
      setOperatorSelectedValue(maybeNewOperatorSelectedValue)
      setOperatorInputValue(maybeNewOperatorSelectedValue.label)
   }

   if(!fieldMetaData)
   {
      return (null);
   }

   //////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // handle a change to the criteria from outside this component (e.g., the prop isn't the same as the state) //
   //////////////////////////////////////////////////////////////////////////////////////////////////////////////
   if (criteriaParamIsCriteria(criteriaParam) && JSON.stringify(criteriaParam) !== JSON.stringify(criteria))
   {
      const newCriteria = criteriaParam as QFilterCriteriaWithId;
      setCriteria(newCriteria);
      const operatorOption = operatorOptions.filter(o => o.value == newCriteria.operator)[0];
      setOperatorSelectedValue(operatorOption);
      setOperatorInputValue(operatorOption.label);
   }

   const criteriaNeedsReset = (): boolean =>
   {
      if(criteria != null && criteriaParam == null)
      {
         const defaultOperatorOption = operatorOptions.filter(o => o.value == defaultOperator)[0];
         if(criteria.operator !== defaultOperatorOption.value || JSON.stringify(criteria.values) !== JSON.stringify(getDefaultCriteriaValue()))
         {
            return (true);
         }
      }

      return (false);
   }

   const makeNewCriteria = (): QFilterCriteria =>
   {
      const operatorOption = operatorOptions.filter(o => o.value == defaultOperator)[0];
      const criteria = new QFilterCriteriaWithId(fullFieldName, operatorOption.value, getDefaultCriteriaValue());
      criteria.id = id;
      setOperatorSelectedValue(operatorOption);
      setOperatorInputValue(operatorOption.label);
      setCriteria(criteria);
      return(criteria);
   }

   if (criteria == null || criteriaNeedsReset())
   {
      makeNewCriteria();
   }

   const toggleOpen = (event: any) =>
   {
      setIsOpen(!isOpen);
      setAnchorEl(event.currentTarget);
   };

   const closeMenu = () =>
   {
      setIsOpen(false);
      setAnchorEl(null);
   };

   /////////////////////////////////////////////
   // event handler for operator Autocomplete //
   // todo - too dupe?
   /////////////////////////////////////////////
   const handleOperatorChange = (event: any, newValue: any, reason: string) =>
   {
      criteria.operator = newValue ? newValue.value : null;

      if (newValue)
      {
         setOperatorSelectedValue(newValue);
         setOperatorInputValue(newValue.label);

         if (newValue.implicitValues)
         {
            criteria.values = newValue.implicitValues;
         }
      }
      else
      {
         setOperatorSelectedValue(null);
         setOperatorInputValue("");
      }

      updateCriteria(criteria, false, false);
   };

   function isOperatorOptionEqual(option: OperatorOption, value: OperatorOption)
   {
      return (option?.value == value?.value && JSON.stringify(option?.implicitValues) == JSON.stringify(value?.implicitValues));
   }

   //////////////////////////////////////////////////
   // event handler for value field (of all types) //
   // todo - too dupe!
   //////////////////////////////////////////////////
   const handleValueChange = (event: React.ChangeEvent | SyntheticEvent, valueIndex: number | "all" = 0, newValue?: any) =>
   {
      // @ts-ignore
      const value = newValue !== undefined ? newValue : event ? event.target.value : null;

      if (!criteria.values)
      {
         criteria.values = [];
      }

      if (valueIndex == "all")
      {
         criteria.values = value;
      }
      else
      {
         criteria.values[valueIndex] = value;
      }

      updateCriteria(criteria, true, false);
   };

   const noop = () =>
   {
   };

   const getValuesString = (): string =>
   {
      let valuesString = "";
      if (criteria.values && criteria.values.length)
      {
         let labels = [] as string[];

         let maxLoops = criteria.values.length;
         if (maxLoops > 5)
         {
            maxLoops = 3;
         }

         for (let i = 0; i < maxLoops; i++)
         {
            if (criteria.values[i] && criteria.values[i].label)
            {
               labels.push(criteria.values[i].label);
            }
            else
            {
               labels.push(criteria.values[i]);
            }
         }

         if (maxLoops < criteria.values.length)
         {
            labels.push(" and " + (criteria.values.length - maxLoops) + " other values.");
         }

         valuesString = (labels.join(", "));
      }
      return valuesString;
   }

   const [startIconName, setStartIconName] = useState("filter_alt");
   const {criteriaIsValid, criteriaStatusTooltip} = validateCriteria(criteria, operatorSelectedValue);

   const resetCriteria = (e: React.MouseEvent<HTMLSpanElement>) =>
   {
      if(criteriaIsValid)
      {
         e.stopPropagation();
         const newCriteria = makeNewCriteria();
         updateCriteria(newCriteria, false, true);
         setStartIconName("filter_alt");
      }
   }

   const startIconMouseOver = () =>
   {
      if(criteriaIsValid)
      {
         setStartIconName("clear");
      }
   }
   const startIconMouseOut = () =>
   {
      setStartIconName("filter_alt");
   }

   const tooComplex = criteriaParam == "tooComplex";
   const tooltipEnterDelay = 500;
   let startIcon = <Badge badgeContent={criteriaIsValid && !tooComplex ? 1 : 0} color="warning" variant="dot" onMouseOver={startIconMouseOver} onMouseOut={startIconMouseOut} onClick={resetCriteria}><Icon>{startIconName}</Icon></Badge>
   if(criteriaIsValid)
   {
      startIcon = <Tooltip title={"Remove this condition"} enterDelay={tooltipEnterDelay}>{startIcon}</Tooltip>
   }

   let buttonContent = <span>{tableForField?.name != tableMetaData.name ? `${tableForField.label}: ` : ""}{fieldMetaData.label}</span>
   if (criteriaIsValid)
   {
      buttonContent = (
         <Tooltip title={`${operatorSelectedValue.label} ${getValuesString()}`} enterDelay={tooltipEnterDelay}>
            {buttonContent}
         </Tooltip>
      );
   }

   let button = fieldMetaData && <Button
      sx={{mr: "0.25rem", px: "1rem", border: isOpen ? "1px solid gray" : "1px solid transparent"}}
      startIcon={startIcon}
      onClick={tooComplex ? noop : toggleOpen}
      disabled={tooComplex}
   >{buttonContent}</Button>;

   if (tooComplex)
   {
      // wrap button in span, so disabled button doesn't cause disabled tooltip
      return (
         <Tooltip title={`Your current filter is too complex to do a Quick Filter on ${fieldMetaData.label}.  Use the Filter button to edit.`} enterDelay={tooltipEnterDelay} slotProps={{popper: {sx: {top: "-0.75rem!important"}}}}>
            <span>{button}</span>
         </Tooltip>
      );
   }

   const doToggle = () =>
   {
      closeMenu()
      toggleQuickFilterField(criteria?.fieldName);
   }

   const widthAndMaxWidth = 250
   return (
      <>
         {button}
         {
            isOpen && <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu} sx={{overflow: "visible"}}>
               {
                  toggleQuickFilterField &&
                  <Tooltip title={"Remove this field from Quick Filters"} placement="right">
                     <IconButton size="small" sx={{position: "absolute", top: "-8px", right: "-8px", zIndex: 1}} onClick={doToggle}><Icon color="secondary">highlight_off</Icon></IconButton>
                  </Tooltip>
               }
               <Box display="inline-block" width={widthAndMaxWidth} maxWidth={widthAndMaxWidth} className="operatorColumn">
                  <Autocomplete
                     id={"criteriaOperator"}
                     renderInput={(params) => (<TextField {...params} label={"Operator"} variant="standard" autoComplete="off" type="search" InputProps={{...params.InputProps}} />)}
                     options={operatorOptions}
                     value={operatorSelectedValue as any}
                     inputValue={operatorInputValue}
                     onChange={handleOperatorChange}
                     onInputChange={(e, value) => setOperatorInputValue(value)}
                     isOptionEqualToValue={(option, value) => isOperatorOptionEqual(option, value)}
                     getOptionLabel={(option: any) => option.label}
                     autoSelect={true}
                     autoHighlight={true}
                     disableClearable
                     slotProps={{popper: {style: {padding: 0, maxHeight: "unset", width: "250px"}}}}
                  />
               </Box>
               <Box width={widthAndMaxWidth} maxWidth={widthAndMaxWidth} className="quickFilter filterValuesColumn">
                  <FilterCriteriaRowValues
                     operatorOption={operatorSelectedValue}
                     criteria={criteria}
                     field={fieldMetaData}
                     table={tableMetaData} // todo - joins?
                     valueChangeHandler={(event, valueIndex, newValue) => handleValueChange(event, valueIndex, newValue)}
                     initiallyOpenMultiValuePvs={true} // todo - maybe not?
                  />
               </Box>
            </Menu>
         }
      </>
   );
}
