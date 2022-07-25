// noinspection ES6UnusedImports
import * as cypress from "cypress";

describe("empty spec", () =>
{
   it("passes", () =>
   {
      cy.intercept("GET", "/metaData", {fixture: "metaData/index.json"}).as("metaData");
      cy.intercept("GET", "/data/person?*", {fixture: "data/person/index.json"}).as("personQuery");
      cy.intercept("GET", "/data/person/count?*", {fixture: "data/person/count.json"}).as("personCount")
      cy.intercept("GET", "/metaData/process/person.bulkEdit", {fixture: "metaData/process/person.bulkEdit.json"}).as("personBulkEditMetaData")
      cy.intercept("POST", "/processes/person.bulkEdit/init?recordsParam=recordIds&recordIds=1,2,3,4,5", {fixture: "processes/person.bulkEdit/init.json"}).as("personBulkEditInit")
      cy.intercept("POST", "/processes/person.bulkEdit/74a03a7d-2f53-4784-9911-3a21f7646c43/step/edit", {fixture: "processes/person.bulkEdit/step/edit.json"}).as("personBulkEditStepEdit")
      cy.intercept("GET", "/processes/person.bulkEdit/74a03a7d-2f53-4784-9911-3a21f7646c43/records?skip=0&limit=10", {fixture: "processes/person.bulkEdit/records.json"}).as("personBulkEditRecords")

      /////////////////
      // home screen //
      /////////////////
      cy.visit("http://localhost:3000/");
      cy.wait(["@metaData"])

      cy.contains(".MuiListItem-root", "Tables").click();
      cy.contains(".MuiListItem-root", "Person").click();

      /////////////////////////
      // person query screen //
      /////////////////////////
      cy.location().should((loc) =>
      {
         expect(loc.pathname).to.eq("/person")
      });
      cy.wait(["@personQuery", "@personCount"])

      cy.get(".MuiDataGrid-columnHeaders input[type='checkbox']").click();
      cy.contains("button", "Bulk Actions").click();
      cy.contains("li", "Bulk Edit").click();

      ////////////////////////////
      // bulk edit process init //
      ////////////////////////////
      cy.location().should((loc) =>
      {
         expect(loc.pathname).to.eq("/processes/person.bulkEdit");
         expect(loc.search).to.eq("?recordsParam=recordIds&recordIds=1,2,3,4,5");
      });
      cy.wait(["@personBulkEditMetaData"])
      cy.wait(["@personBulkEditInit"])

      cy.contains("p[variation='h5']", "Edit Values");
      cy.get("#bulkEditSwitch-firstName").click();
      cy.get("input[name='firstName']").click()
         .type("Kahhhhn");
      cy.contains("button", "next").click();

      ///////////////////////////
      // bulk edit review step //
      ///////////////////////////
      cy.contains("p[variation='h5']", "Review");
      cy.contains(".MuiDataGrid-cellContent", "Kahhhhn");

      cy.contains("button", "submit").click();
      cy.wait(["@personBulkEditStepEdit"])
      cy.wait(["@personBulkEditRecords"])

      ////////////////////////////
      // bulk edit result step //
      ////////////////////////////
      cy.contains("p[variation='h5']", "Results");
      cy.wait(["@personBulkEditRecords"])
   });

});
