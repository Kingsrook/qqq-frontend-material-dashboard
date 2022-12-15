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
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import colors from "qqq/components/Temporary/colors";
import DropdownMenu, {DropdownOption} from "qqq/pages/dashboards/Widgets/Components/DropdownMenu";

export interface WidgetData
{
   dropdownLabelList?: string[];
   dropdownNameList?: string[];
   dropdownDataList?: {
      id: string,
      label: string
   }[][];
   dropdownNeedsSelectedText?: string;
}


interface Props
{
   icon?: string;
   label: string;
   labelAdditionalComponentsLeft: LabelComponent[];
   labelAdditionalComponentsRight: LabelComponent[];
   widgetData?: WidgetData;
   children: JSX.Element;
   reloadWidgetCallback?: (params: string) => void;
   isChild?: boolean;
   isCard?: boolean;
}

Widget.defaultProps = {
   isCard: true,
   isChild: false,
   label: null,
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



function Widget(props: React.PropsWithChildren<Props>): JSX.Element
{
   const navigate = useNavigate();
   const [dropdownData, setDropdownData] = useState([]);
   const [counter, setCounter] = useState(0);

   function openEditForm(table: QTableMetaData, id: any = null, defaultValues: any, disabledFields: any)
   {
      navigate(`#/createChild=${table.name}/defaultValues=${JSON.stringify(defaultValues)}/disabledFields=${JSON.stringify(disabledFields)}`)
   }

   function renderComponent(component: LabelComponent)
   {
      if(component instanceof HeaderLink)
      {
         const link = component as HeaderLink
         return (
            <Typography variant="body2" p={2} display="inline">
               {link.to ? <Link to={link.to}>{link.label}</Link> : null}
            </Typography>
         );
      }

      if (component instanceof AddNewRecordButton)
      {
         const addNewRecordButton = component as AddNewRecordButton
         return (
            <Typography variant="body2" p={2} pr={1} display="inline">
               <Button onClick={() => openEditForm(addNewRecordButton.table, null, addNewRecordButton.defaultValues, addNewRecordButton.disabledFields)}>{addNewRecordButton.label}</Button>
            </Typography>
         );
      }

      if (component instanceof Dropdown)
      {
         const dropdown = component as Dropdown
         return (
            <Box my={2} mr={2} sx={{float: "right"}}>
               <DropdownMenu
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
         let index = -1;
         for (let i = 0; i < props.widgetData.dropdownLabelList.length; i++)
         {
            if (tableName === props.widgetData.dropdownLabelList[i])
            {
               index = i;
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
      }
   }

   useEffect(() =>
   {
      if(dropdownData)
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
            console.log(`No reload widget callback in ${props.label}`)
         }
      }
   }, [counter]);

   const widgetContent =
      <Box sx={{width: "100%"}}>
         {
            (props.icon || props.label) && (
               <Box display="flex" justifyContent="space-between" alignItems="center" sx={{width: "100%"}}>
                  <Box py={2}>
                     {
                        props.icon && (
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
                                 {props.icon}
                              </Icon>
                           </Box>
                        )
                     }
                     <Typography variant={props.isChild ? "h6" : "h5"} fontWeight="medium" p={3} display="inline">
                        {props.label}
                     </Typography>
                     {
                        props.labelAdditionalComponentsLeft.map((component, i) =>
                        {
                           return (<span key={i}>{renderComponent(component)}</span>);
                        })
                     }
                  </Box>
                  <Box pr={1}>
                     {
                        effectiveLabelAdditionalComponentsRight.map((component, i) =>
                        {
                           return (<span key={i}>{renderComponent(component)}</span>);
                        })
                     }
                  </Box>
               </Box>
            )
         }
         {
            props.widgetData?.dropdownNeedsSelectedText ? (
               <Box pb={3} pr={3} sx={{width: "100%", textAlign: "right"}}>
                  <Typography variant="body2">
                     {props.widgetData?.dropdownNeedsSelectedText}
                  </Typography>
               </Box>
            ) : (
               props.children
            )
         }
      </Box>;

   return props.isCard ? <Card sx={{width: "100%"}}>{widgetContent}</Card> : widgetContent;
}

export default Widget;
