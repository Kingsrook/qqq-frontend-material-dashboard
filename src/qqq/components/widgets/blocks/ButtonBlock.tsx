/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2024.  Kingsrook, LLC
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

import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import {standardWidth} from "qqq/components/buttons/DefaultButtons";
import MDButton from "qqq/components/legacy/MDButton";
import BlockElementWrapper from "qqq/components/widgets/blocks/BlockElementWrapper";
import {StandardBlockComponentProps} from "qqq/components/widgets/blocks/BlockModels";
import React from "react";


/*******************************************************************************
 ** Block that renders ... a button...
 **
 *******************************************************************************/
export default function ButtonBlock({widgetMetaData, data, actionCallback}: StandardBlockComponentProps): JSX.Element
{
   const startIcon = data.values.startIcon?.name ? <Icon>{data.values.startIcon.name}</Icon> : null;
   const endIcon = data.values.endIcon?.name ? <Icon>{data.values.endIcon.name}</Icon> : null;

   function onClick()
   {
      if (actionCallback)
      {
         actionCallback(data, data.values);
      }
      else
      {
         console.log("ButtonBlock onClick with no actionCallback present, so, noop");
      }
   }

   let buttonVariant: "gradient" | "outlined" | "text" = "gradient";
   if (data.styles?.format == "outlined")
   {
      buttonVariant = "outlined";
   }
   else if (data.styles?.format == "text")
   {
      buttonVariant = "text";
   }
   else if (data.styles?.format == "filled")
   {
      buttonVariant = "gradient";
   }

   // todo - button colors... but to do RGB's, might need to move away from MDButton?

   return (
      <BlockElementWrapper metaData={widgetMetaData} data={data} slot="">
         <Box mx={1} my={1} minWidth={standardWidth}>
            <MDButton
               type="button"
               variant={buttonVariant}
               color="dark"
               size="small"
               fullWidth
               startIcon={startIcon}
               endIcon={endIcon}
               onClick={onClick}
            >
               {data.values.label ?? "Button"}
            </MDButton>
         </Box>
      </BlockElementWrapper>
   );
}
