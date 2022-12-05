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

export default class QLib
{
   // @ts-ignore
   private static cy: Cypress.cy;

   // @ts-ignore
   public static init(cy: Cypress.cy)
   {
      QLib.cy = cy;
   }

   /*******************************************************************************
    ** Wait for a query to finish on the entity-list screen.  specifically, wait for
    ** personQuery & personCount requests, and wait for the data grid to have rows.
    *******************************************************************************/
   public static waitForQueryScreen()
   {
      QLib.cy.wait(["@personQuery", "@personCount"]);
      QLib.cy.get(".MuiDataGrid-virtualScrollerRenderZone").children().should("have.length.greaterThan", 3);
   }

   /*******************************************************************************
    ** Open the Filters drop down, and build a query
    *******************************************************************************/
   public static buildEntityListQueryFilter(input: QueryFilterInput | QueryFilterInput[], booleanOperator: ("and" | "or") = "and")
   {
      QLib.cy.contains("Filters").click();

      if ((input as QueryFilterInput).fieldLabel)
      {
         const queryFilterInput = input as QueryFilterInput;
         QLib.addSingleQueryFilterInput(queryFilterInput, 0, booleanOperator);
      }
      else
      {
         const inputArray = input as QueryFilterInput[];
         inputArray.forEach((qfi, index) => QLib.addSingleQueryFilterInput(qfi, index, booleanOperator));
      }
   }

   /*******************************************************************************
    ** private helper - adds 1 query filter input.
    *******************************************************************************/
   private static addSingleQueryFilterInput(queryFilterInput: QueryFilterInput, index: number, booleanOperator: ("and" | "or"))
   {
      if (index > 0)
      {
         QLib.cy.contains("Add filter").click();
         QLib.cy.get(".MuiDataGrid-filterForm").eq(index).find(".MuiDataGrid-filterFormLinkOperatorInput SELECT").select(booleanOperator);
      }

      QLib.cy.get(".MuiDataGrid-filterForm").eq(index).find(".MuiDataGrid-filterFormColumnInput SELECT").select(queryFilterInput.fieldLabel);
      QLib.cy.get(".MuiDataGrid-filterForm").eq(index).find(".MuiDataGrid-filterFormOperatorInput SELECT").select(queryFilterInput.operator);
      QLib.cy.get(".MuiDataGrid-filterForm").eq(index).find(".MuiDataGrid-filterFormValueInput INPUT").type(queryFilterInput.textValue);
   }

}

interface QueryFilterInput
{
   fieldLabel?: string;
   fieldName?: string;
   operator?: string;
   textValue?: string;
}
