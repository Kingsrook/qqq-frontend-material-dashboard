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

package com.kingsrook.qqq.frontend.materialdashboard.selenium.lib;


/*******************************************************************************
 ** constants to define css selectors for common QQQ material dashboard elements.
 *******************************************************************************/
public interface QQQMaterialDashboardSelectors
{
   String SIDEBAR_ITEM      = ".MuiDrawer-paperAnchorDockedLeft li.MuiListItem-root";
   String BREADCRUMB_HEADER = "h3";

   String QUERY_GRID_CELL    = ".MuiDataGrid-root .MuiDataGrid-cellContent";
   String QUERY_FILTER_INPUT = ".customFilterPanel input.MuiInput-input";
}
