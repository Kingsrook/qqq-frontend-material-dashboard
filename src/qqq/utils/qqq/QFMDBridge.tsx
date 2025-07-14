/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2025.  Kingsrook, LLC
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

import {QController} from "@kingsrook/qqq-frontend-core/lib/controllers/QController";
import {QFieldMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QFieldMetaData";
import {QTableMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QTableMetaData";
import {QWidgetMetaData} from "@kingsrook/qqq-frontend-core/lib/model/metaData/QWidgetMetaData";
import {QRecord} from "@kingsrook/qqq-frontend-core/lib/model/QRecord";
import {Alert} from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {ThemeProvider} from "@mui/material/styles";
import {Formik} from "formik";
import QContext from "QContext";
import QDynamicForm from "qqq/components/forms/DynamicForm";
import DynamicFormUtils from "qqq/components/forms/DynamicFormUtils";
import MDButton from "qqq/components/legacy/MDButton";
import theme from "qqq/components/legacy/Theme";
import DashboardWidgets from "qqq/components/widgets/DashboardWidgets";
import {MaterialUIControllerProvider} from "qqq/context";
import Client from "qqq/utils/qqq/Client";
import React, {ReactElement, ReactNode, useContext, useEffect, useState} from "react";
import {BrowserRouter} from "react-router-dom";
import * as Yup from "yup";


// todo - deploy this interface somehow out of this file
export interface QFMDBridge
{
   qController?: QController;
   makeAlert: (text: string, color: string) => JSX.Element;
   makeButton: (label: string, onClick: () => void, extra?: { [key: string]: any }) => JSX.Element;
   makeForm: (fields: QFieldMetaData[], record: QRecord, handleChange: (fieldName: string, newValue: any) => void, handleSubmit: (values: any) => void) => JSX.Element;
   makeModal: (children: ReactElement, onClose?: (setIsOpen: (isOpen: boolean) => void, event: {}, reason: "backdropClick" | "escapeKeyDown") => void) => JSX.Element;
   makeWidget: (widgetName: string, tableName?: string, entityPrimaryKey?: string, record?: QRecord, actionCallback?: (data: any, eventValues?: { [name: string]: any }) => boolean) => JSX.Element;
}


/***************************************************************************
 ** Component to generate a form for the QFMD Bridge
 ***************************************************************************/
interface QFMDBridgeFormProps
{
   fields: QFieldMetaData[],
   record: QRecord,
   handleChange: (fieldName: string, newValue: any) => void,
   handleSubmit: (values: any) => void
}

QFMDBridgeForm.defaultProps = {};

function QFMDBridgeForm({fields, record, handleChange, handleSubmit}: QFMDBridgeFormProps): JSX.Element
{
   const initialValues: any = {};
   for (let field of fields)
   {
      initialValues[field.name] = record.values.get(field.name);
      if(initialValues[field.name] === undefined && field.defaultValue !== undefined)
      {
         initialValues[field.name] = field.defaultValue;
      }

   }
   const [lastValues, setLastValues] = useState(initialValues);
   const [loaded, setLoaded] = useState(false);

   ///////////////////////////////////////////////////////////////////////////////
   // store reference to record display values in a state var - see usage below //
   ///////////////////////////////////////////////////////////////////////////////
   const [recordDisplayValues, setRecordDisplayValues] = useState(record?.displayValues ?? new Map<string, string>())

   useEffect(() =>
   {
      (async () =>
      {
         const qController = Client.getInstance();

         for (let field of fields)
         {
            const value = record.values.get(field.name);
            if (field.possibleValueSourceName && value)
            {
               const possibleValues = await qController.possibleValues(null, null, field.possibleValueSourceName, null, [value], [], record.values, "form");
               if (possibleValues && possibleValues.length > 0)
               {
                  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  // originally, we put this in record.displayValues, but, sometimes that would then be empty at the usage point below... //
                  // this works, so, we'll go with it                                                                                     //
                  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  recordDisplayValues.set(field.name, possibleValues[0].label)
                  setRecordDisplayValues(recordDisplayValues);
               }
            }
         }

         setLoaded(true);
      })();
   }, []);

   if (!loaded)
   {
      return (<Box py={"1rem"}>Loading...</Box>);
   }

   const {
      dynamicFormFields,
      formValidations,
   } = DynamicFormUtils.getFormData(fields);
   DynamicFormUtils.addPossibleValueProps(dynamicFormFields, fields, null, null, recordDisplayValues);

   const otherValuesMap = new Map<string, any>();
   record.values.forEach((value, key) => otherValuesMap.set(key, value));

   for (let fieldName in dynamicFormFields)
   {
      const dynamicFormField = dynamicFormFields[fieldName];
      if (dynamicFormField.possibleValueProps)
      {
         dynamicFormField.possibleValueProps.otherValues = otherValuesMap;
      }
   }

   /////////////////////////////////////////////////////////////////////////////////
   // re-introduce these two context providers, in case the child calls this      //
   // method under a different root... maybe this should be optional per a param? //
   /////////////////////////////////////////////////////////////////////////////////
   return (<MaterialUIControllerProvider>
      <ThemeProvider theme={theme}>
         <Formik initialValues={initialValues} validationSchema={Yup.object().shape(formValidations)} onSubmit={handleSubmit}>
            {({values, errors, touched}) =>
            {
               const formData: any = {};
               formData.values = values;
               formData.touched = touched;
               formData.errors = errors;
               formData.formFields = dynamicFormFields;

               try
               {
                  let anyDiffs = false;
                  for (let fieldName in values)
                  {
                     const value = values[fieldName];
                     if (lastValues[fieldName] != value)
                     {
                        handleChange(fieldName, value);
                        lastValues[fieldName] = value;
                        anyDiffs = true;
                     }
                  }

                  if (anyDiffs)
                  {
                     setLastValues(lastValues);
                  }
               }
               catch (e)
               {
                  console.error(e);
               }

               return (<QDynamicForm formData={formData} record={record} />);
            }}
         </Formik>
      </ThemeProvider>
   </MaterialUIControllerProvider>);
}


/***************************************************************************
 ** Component to render a widget for the QFMD Bridge
 ***************************************************************************/
interface QFMDBridgeWidgetProps
{
   widgetName?: string,
   tableName?: string,
   record?: QRecord,
   entityPrimaryKey?: string,
   actionCallback?: (data: any, eventValues?: { [p: string]: any }) => boolean
}

QFMDBridgeWidget.defaultProps = {};

function QFMDBridgeWidget({widgetName, tableName, record, entityPrimaryKey, actionCallback}: QFMDBridgeWidgetProps): JSX.Element
{
   const qContext = useContext(QContext);

   const [ready, setReady] = useState(false);

   const [widgetMetaData, setWidgetMetaData] = useState(null as QWidgetMetaData);
   const [widgetData, setWidgetData] = useState(null as any);

   const [tableMetaData, setTableMetaData] = useState(null as QTableMetaData);

   useEffect(() =>
   {
      (async () =>
      {
         const qController = Client.getInstance();
         const qInstance = await qController.loadMetaData();

         const queryStringParts: string[] = [];
         for (let key of record?.values?.keys())
         {
            queryStringParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(record.values.get(key))}`);
         }

         setWidgetMetaData(qInstance.widgets.get(widgetName));
         setWidgetData(await qController.widget(widgetName, queryStringParts.join("&")));

         setReady(true);
      })();
   }, []);

   if (!ready)
   {
      return (<Box py={"1rem"}>Loading...</Box>);
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
   // internally in some widgets, useNavigate happens... so we must re-introduce the browser-router context //
   // plus the contexts too, as indicated.                                                                  //
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
   return (<BrowserRouter>
      <MaterialUIControllerProvider>
         <ThemeProvider theme={theme}>
            <QContext.Provider value={{
               ...qContext,
               setTableMetaData: (tableMetaData: QTableMetaData) => setTableMetaData(tableMetaData),
            }}>
               <div className={`bridgedWidget ${widgetMetaData.type}`}>
                  <DashboardWidgets tableName={tableName} widgetMetaDataList={[widgetMetaData]} initialWidgetDataList={[widgetData]} record={record} entityPrimaryKey={entityPrimaryKey} omitWrappingGridContainer={true} actionCallback={actionCallback} />
               </div>
            </QContext.Provider>
         </ThemeProvider>
      </MaterialUIControllerProvider>
   </BrowserRouter>);
}


/***************************************************************************
 ** Component to render a modal for the QFMD Bridge
 ***************************************************************************/
interface QFMDBridgeModalProps
{
   children: ReactNode;
   onClose?: (setIsOpen: (isOpen: boolean) => void, event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
}

QFMDBridgeModal.defaultProps = {};

function QFMDBridgeModal({children, onClose}: QFMDBridgeModalProps): JSX.Element
{
   const [isOpen, setIsOpen] = useState(true);

   function closeModalProcess(event: {}, reason: "backdropClick" | "escapeKeyDown")
   {
      if (onClose)
      {
         onClose(setIsOpen, event, reason);
      }
      else
      {
         setIsOpen(false);
      }
   }

   return (
      <Modal open={isOpen} onClose={(event, reason) => closeModalProcess(event, reason)}>
         <Box className="bridgeModal" height="calc(100vh)">
            {children}
         </Box>
      </Modal>
   );
}


/***************************************************************************
 ** Component to render an alert for the QFMD Bridge
 ***************************************************************************/
interface QFMDBridgeAlertProps
{
   color: string,
   children: ReactNode,
   mayManuallyClose?: boolean
}

QFMDBridgeAlert.defaultProps = {};

function QFMDBridgeAlert({color, children, mayManuallyClose}: QFMDBridgeAlertProps): JSX.Element
{
   const [isOpen, setIsOpen] = useState(true);

   function onClose()
   {
      setIsOpen(false);
   }

   if (isOpen)
   {
      //@ts-ignore color
      return (<Alert color={color} onClose={mayManuallyClose ? onClose : null}>{children}</Alert>);
   }
   else
   {
      return (<React.Fragment />);
   }
}


/***************************************************************************
 ** define the default qfmd bridge object
 ***************************************************************************/
export const qfmdBridge =
   {
      qController: Client.getInstance(),

      makeButton: (label: string, onClick: () => void, extra?: { [key: string]: any }): JSX.Element =>
      {
         return (<MDButton {...extra} onClick={onClick} fullWidth>{label}</MDButton>);
      },

      makeAlert: (text: string, color: string, mayManuallyClose?: boolean): JSX.Element =>
      {
         return (<QFMDBridgeAlert color={color} mayManuallyClose={mayManuallyClose}>{text}</QFMDBridgeAlert>);
      },

      makeModal: (children: ReactElement, onClose?: (setIsOpen: (isOpen: boolean) => void, event: {}, reason: "backdropClick" | "escapeKeyDown") => void): JSX.Element =>
      {
         return (<QFMDBridgeModal onClose={onClose}>{children}</QFMDBridgeModal>);
      },

      makeWidget: (widgetName: string, tableName?: string, entityPrimaryKey?: string, record?: QRecord, actionCallback?: (data: any, eventValues?: { [name: string]: any }) => boolean): JSX.Element =>
      {
         return (<QFMDBridgeWidget widgetName={widgetName} tableName={tableName} record={record} entityPrimaryKey={entityPrimaryKey} actionCallback={actionCallback} />);
      },

      makeForm: (fields: QFieldMetaData[], record: QRecord, handleChange: (fieldName: string, newValue: any) => void, handleSubmit: (values: any) => void): JSX.Element =>
      {
         return (<QFMDBridgeForm fields={fields} record={record} handleChange={handleChange} handleSubmit={handleSubmit} />);
      }
   };

