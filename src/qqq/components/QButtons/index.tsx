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

import MDBox from "components/MDBox";
import {Link} from "react-router-dom";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import React from "react";

// eslint-disable import/prefer-default-export

const standardWidth = "150px";

export function QCreateNewButton(): JSX.Element
{
   return (
      <MDBox ml={3} mr={2} width={standardWidth}>
         <Link to="create">
            <MDButton variant="gradient" color="info" fullWidth startIcon={<Icon>add</Icon>}>
               Create New
            </MDButton>
         </Link>
      </MDBox>
   );
}

export function QSaveButton(): JSX.Element
{
   return (
      <MDBox ml={3} width={standardWidth}>
         <MDButton type="submit" variant="gradient" color="info" size="small" fullWidth startIcon={<Icon>save</Icon>}>
            Save
         </MDButton>
      </MDBox>
   );
}

interface QDeleteButtonProps
{
   onClickHandler: any
}

export function QDeleteButton({onClickHandler}: QDeleteButtonProps): JSX.Element
{
   return (
      <MDBox ml={3} mr={3}>
         <MDBox width={standardWidth}>
            <MDButton variant="gradient" color="primary" size="small" onClick={onClickHandler} fullWidth startIcon={<Icon>delete</Icon>}>
               Delete
            </MDButton>
         </MDBox>
      </MDBox>
   );
}

export function QEditButton(): JSX.Element
{
   return (
      <MDBox>
         <Link to="edit">
            <MDBox width={standardWidth}>
               <MDButton variant="gradient" color="dark" size="small" fullWidth startIcon={<Icon>edit</Icon>}>
                  Edit
               </MDButton>
            </MDBox>
         </Link>
      </MDBox>
   );
}

interface QActionsMenuButtonProps
{
   isOpen: boolean;
   onClickHandler: any;
}

export function QActionsMenuButton({isOpen, onClickHandler}: QActionsMenuButtonProps): JSX.Element
{
   return (
      <MDBox width={standardWidth}>
         <MDButton
            variant={isOpen ? "contained" : "outlined"}
            color="dark"
            onClick={onClickHandler}
            fullWidth
         >
            actions&nbsp;
            <Icon>keyboard_arrow_down</Icon>
         </MDButton>
      </MDBox>
   );
}

interface QCancelButtonProps
{
   onClickHandler: any;
}

export function QCancelButton({onClickHandler}: QCancelButtonProps): JSX.Element
{
   return (
      <MDBox ml="auto" width={standardWidth}>
         <MDButton type="button" variant="outlined" color="dark" size="small" fullWidth startIcon={<Icon>cancel</Icon>} onClick={onClickHandler}>
            Cancel
         </MDButton>
      </MDBox>
   );
}
