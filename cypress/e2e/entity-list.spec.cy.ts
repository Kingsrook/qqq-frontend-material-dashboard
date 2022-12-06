/// <reference types="cypress-wait-for-stable-dom" />

import QLib from "./lib/qLib";

describe("table query screen", () =>
{
   before(() =>
   {
      QLib.init(cy);

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

   it.skip("can be loaded from app screen", () =>
   {
      cy.visit("https://localhost:3000/peopleApp/greetingsApp/");
      cy.contains("Person").click();
      cy.location().should((loc) =>
      {
         expect(loc.pathname).to.eq("/peopleApp/greetingsApp/person");
      });
   });

   it.skip("can add query filters", () =>
   {
      /////////////////////////////////////////////////////////////
      // go to table, wait for filter to run, and rows to appear //
      /////////////////////////////////////////////////////////////
      cy.visit("https://localhost:3000/peopleApp/greetingsApp/person");
      QLib.waitForQueryScreen();

      /////////////////////////////////////////////////////////////////////
      // open the filter window, enter a value, wait for query to re-run //
      /////////////////////////////////////////////////////////////////////
      cy.contains("Filters").click();
      cy.get(".MuiDataGrid-filterForm input.MuiInput-input").should("be.focused").type("1");

      ///////////////////////////////////////////////////////////////////
      // assert that query & count both have the expected filter value //
      ///////////////////////////////////////////////////////////////////
      let expectedFilterContents = JSON.stringify({fieldName: "id", operator: "EQUALS", values: ["1"]});
      cy.wait("@personQuery").its("request.body").should((body) => expect(body).to.contain(expectedFilterContents));
      cy.wait("@personCount").its("request.body").should((body) => expect(body).to.contain(expectedFilterContents));

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

      ////////////////////////////////////////////////////////////////////
      // assert that query & count both no longer have the filter value //
      ////////////////////////////////////////////////////////////////////
      cy.wait("@personQuery").its("request.body").should((body) => expect(body).not.to.contain(expectedFilterContents));
      cy.wait("@personCount").its("request.body").should((body) => expect(body).not.to.contain(expectedFilterContents));
      cy.contains(".MuiDataGrid-toolbarContainer .MuiBadge-root", "1").should("not.exist");
   });

   it.skip("can do a boolean or query", () => // :( failed in CI
   {
      /////////////////////////////////////////
      // go to table, wait for filter to run //
      /////////////////////////////////////////
      cy.visit("https://localhost:3000/peopleApp/greetingsApp/person");
      QLib.waitForQueryScreen();

      QLib.buildEntityListQueryFilter([
         {fieldLabel: "First Name", operator: "contains", textValue: "Dar"},
         {fieldLabel: "First Name", operator: "contains", textValue: "Jam"}
      ], "or");

      let expectedFilterContents0 = JSON.stringify({fieldName: "firstName", operator: "CONTAINS", values: ["Dar"]});
      let expectedFilterContents1 = JSON.stringify({fieldName: "firstName", operator: "CONTAINS", values: ["Jam"]});
      cy.wait("@personQuery").its("request.body").should((body) =>
      {
         expect(body).to.contain(expectedFilterContents0);
         expect(body).to.contain(expectedFilterContents1);
         expect(body).to.contain("asdf");
      });
   });

   // tests to add:
   // - sort column
   // - all field types and operators
   // - pagination, page size
   // - check marks, select all
   // - column chooser

});
