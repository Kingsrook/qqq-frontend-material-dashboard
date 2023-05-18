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
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import parse from "html-react-parser";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, NavigateFunction} from "react-router-dom";
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
   [other: string]: any;
}


interface Props
{
   labelAdditionalComponentsLeft: LabelComponent[];
   labelAdditionalComponentsRight: LabelComponent[];
   widgetMetaData?: QWidgetMetaData;
   widgetData?: WidgetData;
   children: JSX.Element;
   reloadWidgetCallback?: (params: string) => void;
   showReloadControl: boolean;
   isChild?: boolean;
   footerHTML?: string;
   storeDropdownSelections?: boolean;
}

Widget.defaultProps = {
   isChild: false,
   showReloadControl: true,
   widgetMetaData: {},
   widgetData: {},
   labelAdditionalComponentsLeft: [],
   labelAdditionalComponentsRight: [],
};


interface LabelComponentRenderArgs
{
   navigate: NavigateFunction;
   widgetProps: Props;
   dropdownData: any[];
   componentIndex: number;
   reloadFunction: () => void;
}


export class LabelComponent
{
   render = (args: LabelComponentRenderArgs): JSX.Element =>
   {
      return (<div>Unsupported component type</div>)
   }
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

   render = (args: LabelComponentRenderArgs): JSX.Element =>
   {
      return (
         <Typography variant="body2" p={2} display="inline" fontSize=".875rem" pt="0" position="relative" top="-0.25rem">
            {this.to ? <Link to={this.to}>{this.label}</Link> : null}
         </Typography>
      );
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

   openEditForm = (navigate: any, table: QTableMetaData, id: any = null, defaultValues: any, disabledFields: any) =>
   {
      navigate(`#/createChild=${table.name}/defaultValues=${JSON.stringify(defaultValues)}/disabledFields=${JSON.stringify(disabledFields)}`)
   }

   render = (args: LabelComponentRenderArgs): JSX.Element =>
   {
      return (
         <Typography variant="body2" p={2} pr={0} display="inline" position="relative" top="0.25rem">
            <Button sx={{mt: 0.75}} onClick={() => this.openEditForm(args.navigate, this.table, null, this.defaultValues, this.disabledFields)}>{this.label}</Button>
         </Typography>
      );
   }
}


export class ExportDataButton extends LabelComponent
{
   callbackToExport: any;
   label: string;
   isDisabled: boolean;

   constructor(callbackToExport: any, isDisabled = false, label: string = "Export")
   {
      super();
      this.callbackToExport = callbackToExport;
      this.isDisabled = isDisabled;
      this.label = label;
   }

   render = (args: LabelComponentRenderArgs): JSX.Element =>
   {
      return (
         <Typography variant="body2" py={2} px={1} display="inline" position="relative" top="-0.25rem">
            <Button sx={{px: 1}} onClick={() => this.callbackToExport()} disabled={this.isDisabled}><Icon>save_alt</Icon>&nbsp;{this.label}</Button>
         </Typography>
      );
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

   render = (args: LabelComponentRenderArgs): JSX.Element =>
   {
      let defaultValue = null;
      const dropdownName = args.widgetProps.widgetData.dropdownNameList[args.componentIndex];
      const localStorageKey = `${WIDGET_DROPDOWN_SELECTION_LOCAL_STORAGE_KEY_ROOT}.${args.widgetProps.widgetMetaData.name}.${dropdownName}`;
      if(args.widgetProps.storeDropdownSelections)
      {
         ///////////////////////////////////////////////////////////////////////////////////////
         // see if an existing value is stored in local storage, and if so set it in dropdown //
         ///////////////////////////////////////////////////////////////////////////////////////
         defaultValue = JSON.parse(localStorage.getItem(localStorageKey));
         args.dropdownData[args.componentIndex] = defaultValue?.id;
      }

      return (
         <Box my={2} sx={{float: "right"}}>
            <DropdownMenu
               name={dropdownName}
               defaultValue={defaultValue}
               sx={{width: 200, marginLeft: "15px"}}
               label={`Select ${this.label}`}
               dropdownOptions={this.options}
               onChangeCallback={this.onChangeCallback}
            />
         </Box>
      );
   }
}


export class ReloadControl extends LabelComponent
{
   callback: () => void;

   constructor(callback: () => void)
   {
      super();
      this.callback = callback;
   }

   render = (args: LabelComponentRenderArgs): JSX.Element =>
   {
      return (
         <Typography variant="body2" py={2} px={1} display="inline" position="relative" top="-0.25rem">
            <Button sx={{px: 1}} onClick={() => this.callback()}><Icon>refresh</Icon> Refresh</Button>
         </Typography>
      );
   }
}


export const WIDGET_DROPDOWN_SELECTION_LOCAL_STORAGE_KEY_ROOT = "qqq.widgets.dropdownData";


function Widget(props: React.PropsWithChildren<Props>): JSX.Element
{
   const navigate = useNavigate();
   const [dropdownData, setDropdownData] = useState([]);
   const [fullScreenWidgetClassName, setFullScreenWidgetClassName] = useState("");
   const [reloading, setReloading] = useState(false);

   function renderComponent(component: LabelComponent, componentIndex: number)
   {
      return component.render({navigate: navigate, widgetProps: props, dropdownData: dropdownData, componentIndex: componentIndex, reloadFunction: doReload})
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

   const doReload = () =>
   {
      setReloading(true);
      reloadWidget(dropdownData);
   }

   useEffect(() =>
   {
      setReloading(false);
   }, [props.widgetData]);

   const effectiveLabelAdditionalComponentsLeft: LabelComponent[] = [];
   if(props.labelAdditionalComponentsLeft)
   {
      props.labelAdditionalComponentsLeft.map((component) => effectiveLabelAdditionalComponentsLeft.push(component));
   }

   if(props.reloadWidgetCallback && props.widgetData && props.showReloadControl)
   {
      effectiveLabelAdditionalComponentsLeft.push(new ReloadControl(doReload))
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

         reloadWidget(dropdownData)
      }
   }

   const reloadWidget = (dropdownData: any[]) =>
   {
      let params = "";
      for (let i = 0; i < dropdownData.length; i++)
      {
         if (i > 0)
         {
            params += "&";
         }
         params += `${props.widgetData.dropdownNameList[i]}=`;
         if (dropdownData[i])
         {
            params += `${dropdownData[i]}`;
         }
      }

      if (props.reloadWidgetCallback)
      {
         props.reloadWidgetCallback(params);
      }
      else
      {
         console.log(`No reload widget callback in ${props.widgetMetaData.label}`);
      }
   }

   const toggleFullScreenWidget = () =>
   {
      if(fullScreenWidgetClassName)
      {
         setFullScreenWidgetClassName("");
      }
      else
      {
         setFullScreenWidgetClassName("fullScreenWidget");
      }
   }

   const hasPermission = props.widgetData?.hasPermission === undefined || props.widgetData?.hasPermission === true;
   const widgetContent =
      <Box sx={{width: "100%", height: "100%", minHeight: props.widgetMetaData?.minHeight ? props.widgetMetaData?.minHeight : "initial"}}>
         <Box pr={2} display="flex" justifyContent="space-between" alignItems="flex-start" sx={{width: "100%"}} height={"3.5rem"}>
            <Box pt={2} pb={1}>
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
                     <Typography sx={{position: "relative", top: -4}} variant="h6" fontWeight="medium" pl={2} display="inline-block">
                        {props.widgetData.label}
                     </Typography>
                  ) : (
                     hasPermission && props.widgetMetaData?.label && (
                        <Typography sx={{position: "relative", top: -4}} variant="h6" fontWeight="medium" pl={3} display="inline-block">
                           {props.widgetMetaData.label}
                        </Typography>
                     )
                  )
               }
               {/*
               <Button onClick={() => toggleFullScreenWidget()}>
                  {fullScreenWidgetClassName ? "-" : "+"}
               </Button>
               */}
               {
                  hasPermission && (
                     effectiveLabelAdditionalComponentsLeft.map((component, i) =>
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
            props.widgetMetaData?.isCard && (reloading ? <LinearProgress color="info" sx={{overflow: "hidden", borderRadius: "0"}} /> : <Box height="0.375rem"/>)
         }
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
         {
            props?.footerHTML && (
               <Box mt={1} ml={3} mr={3} mb={2} sx={{fontWeight: 300, color: "#7b809a", display: "flex", alignContent: "flex-end", fontSize: "14px"}}>{parse(props.footerHTML)}</Box>
            )
         }
      </Box>;

   return props.widgetMetaData?.isCard
      ? <Card sx={{marginTop: props.widgetMetaData?.icon ? 2 : 0, width: "100%"}} className={fullScreenWidgetClassName}>
         {widgetContent}
      </Card>
      : widgetContent;
}

export default Widget;
