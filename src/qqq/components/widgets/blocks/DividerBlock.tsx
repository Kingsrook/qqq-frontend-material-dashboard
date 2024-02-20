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

import {StandardBlockComponentProps} from "qqq/components/widgets/blocks/BlockModels";


/*******************************************************************************
 ** Block that renders a simple dividing line
 ** margins & width are set such that it covers the padding of a card.
 ** if we need to use it differently, a style attribute should be added to its backend data.
 *******************************************************************************/
export default function DividerBlock({}: StandardBlockComponentProps): JSX.Element
{
   return (<div style={{margin: "1rem -1rem", width: "calc(100% + 2rem)", borderBottom: "1px solid #E0E0E0"}} />);
}
