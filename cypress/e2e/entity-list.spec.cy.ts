/// <reference types="cypress-wait-for-stable-dom" />

describe("table query screen", () =>
{

   before(() =>
   {
      cy.intercept("GET", "/metaData/authentication", {fixture: "metaData/authentication.json"}).as("authenticationMetaData");
      cy.intercept("GET", "/metaData", {fixture: "metaData/index.json"}).as("metaData");
      cy.intercept("GET", "/metaData/table/person", {fixture: "metaData/table/person.json"}).as("personMetaData");
      cy.intercept("POST", "/data/person/query?*", {fixture: "data/person/index.json"}).as("personQuery");
      cy.intercept("POST", "/data/person/count", {fixture: "data/person/count.json"}).as("personCount");
      cy.intercept("POST", "/data/city/count", {fixture: "data/city/count.json"}).as("cityCount");

      cy.intercept("GET", "/metaData/process/person.bulkEdit", {fixture: "metaData/process/person.bulkEdit.json"}).as("personBulkEditMetaData");
      cy.intercept("POST", "/processes/person.bulkEdit/init?recordsParam=recordIds&recordIds=1,2,3,4,5", {fixture: "processes/person.bulkEdit/init.json"}).as("personBulkEditInit");
      cy.intercept("POST", "/processes/person.bulkEdit/74a03a7d-2f53-4784-9911-3a21f7646c43/step/edit", {fixture: "processes/person.bulkEdit/step/edit.json"}).as("personBulkEditStepEdit");
      cy.intercept("GET", "/processes/person.bulkEdit/74a03a7d-2f53-4784-9911-3a21f7646c43/records?skip=0&limit=10", {fixture: "processes/person.bulkEdit/records.json"}).as("personBulkEditRecords");
      cy.intercept("GET", "/widget/* ", {fixture: "widget/empty.json"}).as("emptyWidget");
   });

   it("can be loaded from app screen", () =>
   {
      cy.visit("https://localhost:3000/peopleApp/greetingsApp/");
      cy.contains("Person").click();
      cy.location().should((loc) =>
      {
         expect(loc.pathname).to.eq("/peopleApp/greetingsApp/person");
      });
   });

   it.only("can add query filters", () =>
   {
      /////////////////////////////////////////////////////////////
      // go to table, wait for filter to run, and rows to appear //
      /////////////////////////////////////////////////////////////
      cy.visit("https://localhost:3000/peopleApp/greetingsApp/person");
      cy.wait(["@personQuery", "@personCount"]);
      cy.get(".MuiDataGrid-virtualScrollerRenderZone").children().should("have.length.greaterThan", 3);

      /////////////////////////////////////////////////////////////////////
      // open the filter window, enter a value, wait for query to re-run //
      /////////////////////////////////////////////////////////////////////
      cy.contains("Filters").click();
      cy.get(".MuiDataGrid-filterForm input.MuiInput-input").should("be.focused").type("1");
      cy.wait(["@personQuery", "@personCount"]);

      ///////////////////////////////////////
      // click away from the filter window //
      ///////////////////////////////////////
      cy.get("#root").click("topLeft", {force: true});
      cy.contains(".MuiBadge-root", "1").should("be.visible");

      ///////////////////////////////////////////////////////////////////
      // click the 'x' clear icon, then yes, then expect another query //
      ///////////////////////////////////////////////////////////////////
      cy.waitForStableDOM();
      cy.get("#clearFiltersButton").should("be.visible").click();
      cy.contains("button", "Yes").click();
      cy.wait(["@personQuery", "@personCount"]);
      cy.contains(".MuiDataGrid-toolbarContainer .MuiBadge-root", "1").should("not.exist");
   });


   xit("todo delete", () =>
   {
      // cy.get(".MuiDataGrid-columnHeaders input[type='checkbox']").click();
      // cy.contains("button", "Bulk Actions").click();
      // cy.contains("li", "Bulk Edit").click();

      // ////////////////////////////
      // // bulk edit process init //
      // ////////////////////////////
      // cy.location().should((loc) =>
      // {
      //    expect(loc.pathname).to.eq("/processes/person.bulkEdit");
      //    expect(loc.search).to.eq("?recordsParam=recordIds&recordIds=1,2,3,4,5");
      // });
      // cy.wait(["@personBulkEditMetaData"]);
      // cy.wait(["@personBulkEditInit"]);

      // cy.contains("p[variation='h5']", "Edit Values");
      // cy.get("#bulkEditSwitch-firstName").click();
      // cy.get("input[name='firstName']").click()
      //    .type("Kahhhhn");
      // cy.contains("button", "next").click();

      // ///////////////////////////
      // // bulk edit review step //
      // ///////////////////////////
      // cy.contains("p[variation='h5']", "Review");
      // cy.contains(".MuiDataGrid-cellContent", "Kahhhhn");

      // cy.contains("button", "submit").click();
      // cy.wait(["@personBulkEditStepEdit"]);
      // cy.wait(["@personBulkEditRecords"]);

      // ////////////////////////////
      // // bulk edit result step //
      // ////////////////////////////
      // cy.contains("p[variation='h5']", "Results");
      // cy.wait(["@personBulkEditRecords"]);
   });

});
