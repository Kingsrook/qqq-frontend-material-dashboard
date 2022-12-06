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
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import EntityForm from "qqq/components/EntityForm";

interface Props
{
   label: string;
   labelAdditionalComponentsLeft: LabelComponent[];
   labelAdditionalComponentsRight: LabelComponent[];
   children: JSX.Element;
   reloadWidgetCallback?: (widgetIndex: number, params: string) => void;
}

Widget.defaultProps = {
   label: null,
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
   label:string;
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



function Widget(props: React.PropsWithChildren<Props>): JSX.Element
{
   const navigate = useNavigate();

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

   }

   return (
      <>
         <Card sx={{width: "100%"}}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
               <Box py={2}>
                  <Typography variant="h5" fontWeight="medium" p={3} display="inline">
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
                     props.labelAdditionalComponentsRight.map((component, i) =>
                     {
                        return (<span key={i}>{renderComponent(component)}</span>);
                     })
                  }
               </Box>
            </Box>
            {props.children}
         </Card>
      </>
   );
}

export default Widget;
