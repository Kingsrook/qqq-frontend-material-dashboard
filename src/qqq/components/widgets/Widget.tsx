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

import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QWidgetMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QWidgetMetaData";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import colors from "qqq/components/legacy/colors";
import DropdownMenu, {DropdownOption} from "qqq/components/widgets/components/DropdownMenu";

export interface WidgetData
{
   label?: string;
   dropdownLabelList?: string[];
   dropdownNameList?: string[];
   dropdownDataList?: {
      id: string,
      label: string
   }[][];
   dropdownNeedsSelectedText?: string;
   hasPermission?: boolean;
}


interface Props
{
   labelAdditionalComponentsLeft: LabelComponent[];
   labelAdditionalComponentsRight: LabelComponent[];
   widgetMetaData?: QWidgetMetaData;
   widgetData?: WidgetData;
   children: JSX.Element;
   reloadWidgetCallback?: (params: string) => void;
   isChild?: boolean;
   storeDropdownSelections?: boolean;
}

Widget.defaultProps = {
   isChild: false,
   widgetMetaData: {},
   widgetData: {},
   labelAdditionalComponentsLeft: [],
   labelAdditionalComponentsRight: [],
};


export class LabelComponent
{

}



export class HeaderLink extends LabelComponent
{
   label: string;
   to: string

   constructor(label: string, to: string)
   {
      super();
      this.label = label;
      this.to = to;
   }
}



export class AddNewRecordButton extends LabelComponent
{
   table: QTableMetaData;
   label: string;
   defaultValues: any;
   disabledFields: any;

   constructor(table: QTableMetaData, defaultValues: any, label: string = "Add new", disabledFields: any = defaultValues)
   {
      super();
      this.table = table;
      this.label = label;
      this.defaultValues = defaultValues;
      this.disabledFields = disabledFields;
   }
}


export class Dropdown extends LabelComponent
{
   label: string;
   options: DropdownOption[];
   onChangeCallback: any

   constructor(label: string, options: DropdownOption[], onChangeCallback: any)
   {
      super();
      this.label = label;
      this.options = options;
      this.onChangeCallback = onChangeCallback;
   }
}


export const WIDGET_DROPDOWN_SELECTION_LOCAL_STORAGE_KEY_ROOT = "qqq.widgets.dropdownData";


function Widget(props: React.PropsWithChildren<Props>): JSX.Element
{
   const navigate = useNavigate();
   const [dropdownData, setDropdownData] = useState([]);
   const [counter, setCounter] = useState(0);

   function openEditForm(table: QTableMetaData, id: any = null, defaultValues: any, disabledFields: any)
   {
      navigate(`#/createChild=${table.name}/defaultValues=${JSON.stringify(defaultValues)}/disabledFields=${JSON.stringify(disabledFields)}`)
   }

   function renderComponent(component: LabelComponent, index: number)
   {
      if(component instanceof HeaderLink)
      {
         const link = component as HeaderLink
         return (
            <Typography variant="body2" p={2} display="inline" fontSize=".875rem">
               {link.to ? <Link to={link.to}>{link.label}</Link> : null}
            </Typography>
         );
      }

      if (component instanceof AddNewRecordButton)
      {
         const addNewRecordButton = component as AddNewRecordButton
         return (
            <Typography variant="body2" p={2} pr={1} display="inline">
               <Button sx={{mt: 0.75}} onClick={() => openEditForm(addNewRecordButton.table, null, addNewRecordButton.defaultValues, addNewRecordButton.disabledFields)}>{addNewRecordButton.label}</Button>
            </Typography>
         );
      }

      if (component instanceof Dropdown)
      {
         let defaultValue = null;
         const dropdownName = props.widgetData.dropdownNameList[index];
         const localStorageKey = `${WIDGET_DROPDOWN_SELECTION_LOCAL_STORAGE_KEY_ROOT}.${props.widgetMetaData.name}.${dropdownName}`;
         if(props.storeDropdownSelections)
         {
            ///////////////////////////////////////////////////////////////////////////////////////
            // see if an existing value is stored in local storage, and if so set it in dropdown //
            ///////////////////////////////////////////////////////////////////////////////////////
            defaultValue = JSON.parse(localStorage.getItem(localStorageKey));
         }

         const dropdown = component as Dropdown
         return (
            <Box my={2} sx={{float: "right"}}>
               <DropdownMenu
                  defaultValue={defaultValue}
                  sx={{width: 200, marginLeft: "15px"}}
                  label={`Select ${dropdown.label}`}
                  dropdownOptions={dropdown.options}
                  onChangeCallback={dropdown.onChangeCallback}
               />
            </Box>
         );
      }

      return (<div>Unsupported component type.</div>)
   }


   ///////////////////////////////////////////////////////////////////
   // make dropdowns from the widgetData appear as label-components //
   ///////////////////////////////////////////////////////////////////
   const effectiveLabelAdditionalComponentsRight: LabelComponent[] = [];
   if(props.labelAdditionalComponentsRight)
   {
      props.labelAdditionalComponentsRight.map((component) => effectiveLabelAdditionalComponentsRight.push(component));
   }
   if(props.widgetData && props.widgetData.dropdownDataList)
   {
      props.widgetData.dropdownDataList?.map((dropdownData: any, index: number) =>
      {
         effectiveLabelAdditionalComponentsRight.push(new Dropdown(props.widgetData.dropdownLabelList[index], dropdownData, handleDataChange))
      });
   }


   function handleDataChange(dropdownLabel: string, changedData: any)
   {
      if(dropdownData)
      {
         ///////////////////////////////////////////
         // find the index base on selected label //
         ///////////////////////////////////////////
         const tableName = dropdownLabel.replace("Select ", "");
         let dropdownName = "";
         let index = -1;
         for (let i = 0; i < props.widgetData.dropdownLabelList.length; i++)
         {
            if (tableName === props.widgetData.dropdownLabelList[i])
            {
               index = i;
               dropdownName = props.widgetData.dropdownNameList[i];
               break;
            }
         }

         if (index < 0)
         {
            throw(`Could not find table name for label ${tableName}`);
         }

         dropdownData[index] = (changedData) ? changedData.id : null;
         setDropdownData(dropdownData);
         setCounter(counter + 1);

         /////////////////////////////////////////////////
         // if should store in local storage, do so now //
         // or remove if dropdown was cleared out       //
         /////////////////////////////////////////////////
         if(props.storeDropdownSelections)
         {
            if (changedData?.id)
            {
               localStorage.setItem(`${WIDGET_DROPDOWN_SELECTION_LOCAL_STORAGE_KEY_ROOT}.${props.widgetMetaData.name}.${dropdownName}`, JSON.stringify(changedData));
            }
            else
            {
               localStorage.removeItem(`${WIDGET_DROPDOWN_SELECTION_LOCAL_STORAGE_KEY_ROOT}.${props.widgetMetaData.name}.${dropdownName}`);
            }
         }
      }
   }

   useEffect(() =>
   {
      if(dropdownData && counter > 0)
      {
         let params = "";
         for (let i = 0; i < dropdownData.length; i++)
         {
            if (i > 0)
            {
               params += "&";
            }
            params += `${props.widgetData.dropdownNameList[i]}=`;
            if(dropdownData[i])
            {
               params += `${dropdownData[i]}`;

            }
         }

         if(props.reloadWidgetCallback)
         {
            props.reloadWidgetCallback(params);
         }
         else
         {
            console.log(`No reload widget callback in ${props.widgetMetaData.label}`)
         }
      }
   }, [counter]);

   const hasPermission = props.widgetData?.hasPermission === undefined || props.widgetData?.hasPermission === true;
   const widgetContent =
      <Box sx={{width: "100%", height: "100%", minHeight: props.widgetMetaData?.minHeight ? props.widgetMetaData?.minHeight : "initial"}}>
         <Box pr={3} display="flex" justifyContent="space-between" alignItems="flex-start" sx={{width: "100%"}}>
            <Box pt={2}>
               {
                  hasPermission ?
                     props.widgetMetaData?.icon && (
                        <Box
                           ml={3}
                           mt={-4}
                           sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "64px",
                              height: "64px",
                              borderRadius: "8px",
                              background: colors.info.main,
                              color: "#ffffff",
                              float: "left"
                           }}
                        >
                           <Icon fontSize="medium" color="inherit">
                              {props.widgetMetaData.icon}
                           </Icon>
                        </Box>

                     ) : (
                        <Box
                           ml={3}
                           mt={-4}
                           sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "64px",
                              height: "64px",
                              borderRadius: "8px",
                              background: colors.info.main,
                              color: "#ffffff",
                              float: "left"
                           }}
                        >
                           <Icon fontSize="medium" color="inherit">lock</Icon>
                        </Box>
                     )
               }
               {
                  //////////////////////////////////////////////////////////////////////////////////////////
                  // first look for a label in the widget data, which would override that in the metadata //
                  //////////////////////////////////////////////////////////////////////////////////////////
                  hasPermission && props.widgetData?.label? (
                     <Typography sx={{position: "relative", top: -4}} variant="h6" fontWeight="medium" pl={2} display="inline">
                        {props.widgetData.label}
                     </Typography>
                  ) : (
                     hasPermission && props.widgetMetaData?.label && (
                        <Typography sx={{position: "relative", top: -4}} variant="h6" fontWeight="medium" pl={3} display="inline">
                           {props.widgetMetaData.label}
                        </Typography>
                     )
                  )
               }
               {
                  hasPermission && (
                     props.labelAdditionalComponentsLeft.map((component, i) =>
                     {
                        return (<span key={i}>{renderComponent(component, i)}</span>);
                     })
                  )
               }
            </Box>
            <Box>
               {
                  hasPermission && (
                     effectiveLabelAdditionalComponentsRight.map((component, i) =>
                     {
                        return (<span key={i}>{renderComponent(component, i)}</span>);
                     })
                  )
               }
            </Box>
         </Box>
         {
            hasPermission && props.widgetData?.dropdownNeedsSelectedText ? (
               <Box pb={3} pr={3} sx={{width: "100%", textAlign: "right"}}>
                  <Typography variant="body2">
                     {props.widgetData?.dropdownNeedsSelectedText}
                  </Typography>
               </Box>
            ) : (
               hasPermission ? (
                  props.children
               ) : (
                  <Box mt={2} mb={5} sx={{display: "flex", justifyContent: "center"}}><Typography variant="body2">You do not have permission to view this data.</Typography></Box>
               )
            )
         }
      </Box>;

   return props.widgetMetaData?.isCard ? <Card sx={{marginTop: props.widgetMetaData?.icon ? 2 : 0, width: "100%"}}>{widgetContent}</Card> : widgetContent;
}

export default Widget;
