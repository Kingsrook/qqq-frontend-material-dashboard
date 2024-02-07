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
import React, {SyntheticEvent, useContext, useState} from "react";
import QContext from "QContext";
import {QFilterCriteriaWithId} from "qqq/components/query/CustomFilterPanel";
import {getDefaultCriteriaValue, getOperatorOptions, OperatorOption, validateCriteria} from "qqq/components/query/FilterCriteriaRow";
import FilterCriteriaRowValues from "qqq/components/query/FilterCriteriaRowValues";
import XIcon from "qqq/components/query/XIcon";
import FilterUtils from "qqq/utils/qqq/FilterUtils";
import TableUtils from "qqq/utils/qqq/TableUtils";

export type CriteriaParamType = QFilterCriteriaWithId | null | "tooComplex";

interface QuickFilterProps
{
   tableMetaData: QTableMetaData;
   fullFieldName: string;
   fieldMetaData: QFieldMetaData;
   criteriaParam: CriteriaParamType;
   updateCriteria: (newCriteria: QFilterCriteria, needDebounce: boolean, doRemoveCriteria: boolean) => void;
   defaultOperator?: QCriteriaOperator;
   handleRemoveQuickFilterField?: (fieldName: string) => void;
}

QuickFilter.defaultProps =
   {
      defaultOperator: QCriteriaOperator.EQUALS,
      handleRemoveQuickFilterField: null
   };

let seedId = new Date().getTime() % 173237;

export const quickFilterButtonStyles = {
   fontSize: "0.75rem",
   fontWeight: 600,
   color: "#757575",
   textTransform: "none",
   borderRadius: "2rem",
   border: "1px solid #757575",
   minWidth: "3.5rem",
   minHeight: "auto",
   padding: "0.375rem 0.625rem",
   whiteSpace: "nowrap",
   marginBottom: "0.5rem"
}

/*******************************************************************************
 ** Test if a CriteriaParamType represents an actual query criteria - or, if it's
 ** null or the "tooComplex" placeholder.
 *******************************************************************************/
const criteriaParamIsCriteria = (param: CriteriaParamType): boolean =>
{
   return (param != null && param != "tooComplex");
};

/*******************************************************************************
 ** Test of an OperatorOption equals a query Criteria - that is - that the
 ** operators within them are equal - AND - if the OperatorOption has implicit
 ** values (e.g., the booleans), then those options equal the criteria's options.
 *******************************************************************************/
const doesOperatorOptionEqualCriteria = (operatorOption: OperatorOption, criteria: QFilterCriteriaWithId): boolean =>
{
   if(operatorOption.value == criteria.operator)
   {
      if(operatorOption.implicitValues)
      {
         if(JSON.stringify(operatorOption.implicitValues) == JSON.stringify(criteria.values))
         {
            return (true);
         }
         else
         {
            return (false);
         }
      }

      return (true);
   }

   return (false);
}


/*******************************************************************************
 ** Get the object to use as the selected OperatorOption (e.g., value for that
 ** autocomplete), given an array of options, the query's active criteria in this
 ** field, and the default operator to use for this field
 *******************************************************************************/
const getOperatorSelectedValue = (operatorOptions: OperatorOption[], criteria: QFilterCriteriaWithId, defaultOperator: QCriteriaOperator): OperatorOption =>
{
   if(criteria)
   {
      const filteredOptions = operatorOptions.filter(o => doesOperatorOptionEqualCriteria(o, criteria));
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

/*******************************************************************************
 ** Component to render a QuickFilter - that is - a button, with a Menu under it,
 ** with Operator and Value controls.
 *******************************************************************************/
export default function QuickFilter({tableMetaData, fullFieldName, fieldMetaData, criteriaParam, updateCriteria, defaultOperator, handleRemoveQuickFilterField}: QuickFilterProps): JSX.Element
{
   const operatorOptions = fieldMetaData ? getOperatorOptions(tableMetaData, fullFieldName) : [];
   const [_, tableForField] = TableUtils.getFieldAndTable(tableMetaData, fullFieldName);

   const [isOpen, setIsOpen] = useState(false);
   const [anchorEl, setAnchorEl] = useState(null);

   const [criteria, setCriteria] = useState(criteriaParamIsCriteria(criteriaParam) ? criteriaParam as QFilterCriteriaWithId : null);
   const [id, setId] = useState(criteriaParamIsCriteria(criteriaParam) ? (criteriaParam as QFilterCriteriaWithId).id : ++seedId);

   const [operatorSelectedValue, setOperatorSelectedValue] = useState(getOperatorSelectedValue(operatorOptions, criteria, defaultOperator));
   const [operatorInputValue, setOperatorInputValue] = useState(operatorSelectedValue?.label);

   const [startIconName, setStartIconName] = useState("filter_alt");

   const {criteriaIsValid, criteriaStatusTooltip} = validateCriteria(criteria, operatorSelectedValue);

   const {accentColor} = useContext(QContext);


   //////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // handle a change to the criteria from outside this component (e.g., the prop isn't the same as the state) //
   //////////////////////////////////////////////////////////////////////////////////////////////////////////////
   if (criteriaParamIsCriteria(criteriaParam) && JSON.stringify(criteriaParam) !== JSON.stringify(criteria))
   {
      const newCriteria = criteriaParam as QFilterCriteriaWithId;
      setCriteria(newCriteria);
      const operatorOption = operatorOptions.filter(o => o.value == newCriteria.operator)[0];
      console.log(`B: setOperatorSelectedValue [${JSON.stringify(operatorOption)}]`);
      setOperatorSelectedValue(operatorOption);
      setOperatorInputValue(operatorOption.label);
   }

   /*******************************************************************************
    ** Test if we need to construct a new criteria object
    *******************************************************************************/
   const criteriaNeedsReset = (): boolean =>
   {
      if(criteria != null && criteriaParam == null)
      {
         const defaultOperatorOption = operatorOptions.filter(o => o.value == defaultOperator)[0];
         if(criteria.operator !== defaultOperatorOption?.value || JSON.stringify(criteria.values) !== JSON.stringify(getDefaultCriteriaValue()))
         {
            return (true);
         }
      }

      return (false);
   }

   /*******************************************************************************
    ** Construct a new criteria object - resetting the values tied to the oprator
    ** autocomplete at the same time.
    *******************************************************************************/
   const makeNewCriteria = (): QFilterCriteria =>
   {
      const operatorOption = operatorOptions.filter(o => o.value == defaultOperator)[0];
      const criteria = new QFilterCriteriaWithId(fullFieldName, operatorOption?.value, getDefaultCriteriaValue());
      criteria.id = id;
      console.log(`C: setOperatorSelectedValue [${JSON.stringify(operatorOption)}]`);
      setOperatorSelectedValue(operatorOption);
      setOperatorInputValue(operatorOption?.label);
      setCriteria(criteria);
      return(criteria);
   }

   /*******************************************************************************
    ** event handler to open the menu in response to the button being clicked.
    *******************************************************************************/
   const handleOpenMenu = (event: any) =>
   {
      setIsOpen(!isOpen);
      setAnchorEl(event.currentTarget);
   };

   /*******************************************************************************
    ** handler for the Menu when being closed
    *******************************************************************************/
   const closeMenu = () =>
   {
      setIsOpen(false);
      setAnchorEl(null);
   };

   /*******************************************************************************
    ** event handler for operator Autocomplete having its value changed
    *******************************************************************************/
   const handleOperatorChange = (event: any, newValue: any, reason: string) =>
   {
      criteria.operator = newValue ? newValue.value : null;

      if (newValue)
      {
         console.log(`D: setOperatorSelectedValue [${JSON.stringify(newValue)}]`);
         setOperatorSelectedValue(newValue);
         setOperatorInputValue(newValue.label);

         if (newValue.implicitValues)
         {
            criteria.values = newValue.implicitValues;
         }
      }
      else
      {
         console.log("E: setOperatorSelectedValue [null]");
         setOperatorSelectedValue(null);
         setOperatorInputValue("");
      }

      updateCriteria(criteria, false, false);
   };

   /*******************************************************************************
    ** implementation of isOptionEqualToValue for Autocomplete - compares both the
    ** value (e.g., what operator it is) and the implicitValues within the option
    *******************************************************************************/
   function isOperatorOptionEqual(option: OperatorOption, value: OperatorOption)
   {
      return (option?.value == value?.value && JSON.stringify(option?.implicitValues) == JSON.stringify(value?.implicitValues));
   }

   /*******************************************************************************
    ** event handler for the value field (of all types), when it changes
    *******************************************************************************/
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

   /*******************************************************************************
    ** a noop event handler, e.g., for a too-complex
    *******************************************************************************/
   const noop = () =>
   {
   };

   /*******************************************************************************
    ** event handler that responds to 'x' button that removes the criteria from the
    ** quick-filter, resetting it to a new filter.
    *******************************************************************************/
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

   /*******************************************************************************
    ** event handler for mouse-over on the filter icon - that changes to an 'x'
    ** if there's a valid criteria in the quick-filter
    *******************************************************************************/
   const startIconMouseOver = () =>
   {
      if(criteriaIsValid)
      {
         setStartIconName("clear");
      }
   }

   /*******************************************************************************
    ** event handler for mouse-out on the filter icon - always resets it.
    *******************************************************************************/
   const startIconMouseOut = () =>
   {
      setStartIconName("filter_alt");
   }

   /*******************************************************************************
    ** event handler for clicking the (x) icon that turns off this quick filter field.
    ** hands off control to the function that was passed in (e.g., from RecordQueryOrig).
    *******************************************************************************/
   const handleTurningOffQuickFilterField = () =>
   {
      closeMenu()
      if(handleRemoveQuickFilterField)
      {
         handleRemoveQuickFilterField(criteria?.fieldName);
      }
   }

   ////////////////////////////////////////////////////////////////////////////////////
   // if no field was input (e.g., record-query is still loading), return null early //
   ////////////////////////////////////////////////////////////////////////////////////
   if(!fieldMetaData)
   {
      return (null);
   }

   //////////////////////////////////////////////////////////////////////////////////////////
   // if there should be a selected value in the operator autocomplete, and it's different //
   // from the last selected one, then set the state vars that control that autocomplete   //
   //////////////////////////////////////////////////////////////////////////////////////////
   const maybeNewOperatorSelectedValue = getOperatorSelectedValue(operatorOptions, criteria, defaultOperator);
   if(JSON.stringify(maybeNewOperatorSelectedValue) !== JSON.stringify(operatorSelectedValue))
   {
      console.log(`A: setOperatorSelectedValue [${JSON.stringify(maybeNewOperatorSelectedValue)}]`);
      setOperatorSelectedValue(maybeNewOperatorSelectedValue)
      setOperatorInputValue(maybeNewOperatorSelectedValue?.label)
   }

   /////////////////////////////////////////////////////////////////////////////////////
   // if there wasn't a criteria, or we need to reset it (make a new one), then do so //
   /////////////////////////////////////////////////////////////////////////////////////
   if (criteria == null || criteriaNeedsReset())
   {
      makeNewCriteria();
   }

   /////////////////////////
   // build up the button //
   /////////////////////////
   const tooComplex = criteriaParam == "tooComplex";
   const tooltipEnterDelay = 500;
   let startIcon = <Badge badgeContent={criteriaIsValid && !tooComplex ? 1 : 0} color="warning" variant="dot" onMouseOver={startIconMouseOver} onMouseOut={startIconMouseOut} onClick={resetCriteria}><Icon>{startIconName}</Icon></Badge>
   if(criteriaIsValid)
   {
      startIcon = <Tooltip title={"Remove this condition from your filter"} enterDelay={tooltipEnterDelay}>{startIcon}</Tooltip>
   }

   let buttonAdditionalStyles: any = {};
   let buttonContent = <span>{tableForField?.name != tableMetaData.name ? `${tableForField.label}: ` : ""}{fieldMetaData.label}</span>
   let buttonClassName = "filterNotActive";
   if (criteriaIsValid)
   {
      buttonAdditionalStyles.backgroundColor = accentColor + " !important";
      buttonAdditionalStyles.borderColor = accentColor + " !important";
      buttonAdditionalStyles.color = "white !important";
      buttonClassName = "filterActive";

      let valuesString = FilterUtils.getValuesString(fieldMetaData, criteria);
      if(fieldMetaData.type == QFieldType.BOOLEAN)
      {
         //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // for booleans, in here, the operator-label is "equals yes" or "equals no", so we don't want the values string //
         //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         valuesString = "";
      }

      buttonContent = (
         <Tooltip title={`${operatorSelectedValue.label} ${valuesString}`} enterDelay={tooltipEnterDelay}>
            {buttonContent}
         </Tooltip>
      );
   }

   let button = fieldMetaData && <Button
      id={`quickFilter.${fullFieldName}`}
      className={buttonClassName}
      sx={{...quickFilterButtonStyles, ...buttonAdditionalStyles, mr: "0.5rem"}}
      onClick={tooComplex ? noop : handleOpenMenu}
      disabled={tooComplex}
   >{buttonContent}</Button>;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // if the criteria on this field is the "tooComplex" sentinel, then wrap the button in a tooltip stating such, and return early. //
   // note this was part of original design on this widget, but later deprecated...                                                 //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   if (tooComplex)
   {
      ////////////////////////////////////////////////////////////////////////////
      // wrap button in span, so disabled button doesn't cause disabled tooltip //
      ////////////////////////////////////////////////////////////////////////////
      return (
         <Tooltip title={`Your current filter is too complex to do a Quick Filter on ${fieldMetaData.label}.  Use the Filter button to edit.`} enterDelay={tooltipEnterDelay} slotProps={{popper: {sx: {top: "-0.75rem!important"}}}}>
            <span>{button}</span>
         </Tooltip>
      );
   }

   /*******************************************************************************
    ** event handler for 'x' button - either resets the criteria or turns off the field.
    *******************************************************************************/
   const xClicked = (e: React.MouseEvent<HTMLSpanElement>) =>
   {
      e.stopPropagation();
      if(criteriaIsValid)
      {
         resetCriteria(e);
      }
      else
      {
         handleTurningOffQuickFilterField();
      }
   }

   //////////////////////////////
   // return the button & menu //
   //////////////////////////////
   const widthAndMaxWidth = 250
   return (
      <>
         {button}
         {
            /////////////////////////////////////////////////////////////////////////////////////
            // only show the 'x' if it's to clear out a valid criteria on the field,           //
            // or if we were given a callback to remove the quick-filter field from the screen //
            /////////////////////////////////////////////////////////////////////////////////////
            (criteriaIsValid || handleRemoveQuickFilterField) && <XIcon shade={criteriaIsValid ? "accent" : "default"} position="forQuickFilter" onClick={xClicked} />
         }
         {
            isOpen && <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu} sx={{overflow: "visible"}}>
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
                     table={tableForField}
                     valueChangeHandler={(event, valueIndex, newValue) => handleValueChange(event, valueIndex, newValue)}
                     initiallyOpenMultiValuePvs={true} // todo - maybe not?
                  />
               </Box>
            </Menu>
         }
      </>
   );
}
