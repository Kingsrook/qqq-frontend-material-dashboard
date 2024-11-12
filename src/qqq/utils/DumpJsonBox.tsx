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
import React from "react";

interface DumpJsonBoxProps
{
   data: any;
   title?: string;
}

/***************************************************************************
 ** Utillity for debugging an object as JSON
 ***************************************************************************/
export default function DumpJsonBox({data, title}: DumpJsonBoxProps): JSX.Element
{
   return (
      <Box border="1px solid gray" my="1rem" borderRadius="0.5rem">
         {
            title &&
            <Box borderBottom="1px solid gray" mb="0.5rem" px="0.25rem" borderRadius="0.5rem 0.5rem 0 0" fontSize="1rem" fontWeight="600kkk" sx={{backgroundColor: "#D0D0D0"}}>
               {title}
            </Box>
         }
         <Box maxHeight="200px" p="0.25rem" overflow="auto" sx={{whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "0.75rem", lineHeight: "1.2"}}>
            {JSON.stringify(data, null, 3)}
         </Box>
      </Box>
   );
}
