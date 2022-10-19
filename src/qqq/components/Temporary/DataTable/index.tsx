/* QQQ - Low-code Application Framework for Engineers.
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

import {tooltipClasses, TooltipProps} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Icon from "@mui/material/Icon";
import {styled} from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import parse from "html-react-parser";
import {useEffect, useMemo, useState} from "react";
import {useAsyncDebounce, useGlobalFilter, usePagination, useSortBy, useTable} from "react-table";
import DataTableBodyCell from "qqq/components/Temporary/DataTable/DataTableBodyCell";
import DataTableHeadCell from "qqq/components/Temporary/DataTable/DataTableHeadCell";
import DefaultCell from "qqq/components/Temporary/DefaultCell";
import MDBox from "qqq/components/Temporary/MDBox";
import MDInput from "qqq/components/Temporary/MDInput";
import MDPagination from "qqq/components/Temporary/MDPagination";
import MDTypography from "qqq/components/Temporary/MDTypography";
import ImageCell from "qqq/pages/dashboards/Tables/ImageCell";

export interface TableDataInput
{
   columns: { [key: string]: any }[];
   rows: { [key: string]: any }[];
}

interface Props
{
   entriesPerPage?:
      | false
      | {
      defaultValue: number;
      entries: number[];
   };
   canSearch?: boolean;
   showTotalEntries?: boolean;
   table: TableDataInput;
   pagination?: {
      variant: "contained" | "gradient";
      color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "light";
   };
   isSorted?: boolean;
   noEndBorder?: boolean;
}

const NoMaxWidthTooltip = styled(({className, ...props}: TooltipProps) => (
   <Tooltip {...props} classes={{popper: className}} />
))({
   [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: "none",
      textAlign: "left"
   },
});

function DataTable({
   entriesPerPage,
   canSearch,
   showTotalEntries,
   table,
   pagination,
   isSorted,
   noEndBorder,
}: Props): JSX.Element
{
   let defaultValue: any;
   let entries: any[];

   if (entriesPerPage)
   {
      defaultValue = entriesPerPage.defaultValue ? entriesPerPage.defaultValue : "10";
      entries = entriesPerPage.entries ? entriesPerPage.entries : ["10", "25", "50", "100"];
   }

   const columns = useMemo<any>(() => table.columns, [table]);
   const data = useMemo<any>(() => table.rows, [table]);

   if (!columns || !data)
   {
      return null;
   }

   const tableInstance = useTable(
      {columns, data, initialState: {pageIndex: 0}},
      useGlobalFilter,
      useSortBy,
      usePagination
   );

   const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      rows,
      page,
      pageOptions,
      canPreviousPage,
      canNextPage,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      setGlobalFilter,
      state: {pageIndex, pageSize, globalFilter},
   }: any = tableInstance;

   // Set the default value for the entries per page when component mounts
   useEffect(() => setPageSize(defaultValue || 10), [defaultValue]);

   // Set the entries per page value based on the select value
   const setEntriesPerPage = (value: any) => setPageSize(value);

   // Render the paginations
   const renderPagination = pageOptions.map((option: any) => (
      <MDPagination
         item
         key={option}
         onClick={() => gotoPage(Number(option))}
         active={pageIndex === option}
      >
         {option + 1}
      </MDPagination>
   ));

   // Handler for the input to set the pagination index
   const handleInputPagination = ({target: {value}}: any) =>
      value > pageOptions.length || value < 0 ? gotoPage(0) : gotoPage(Number(value));

   // Customized page options starting from 1
   const customizedPageOptions = pageOptions.map((option: any) => option + 1);

   // Setting value for the pagination input
   const handleInputPaginationValue = ({target: value}: any) => gotoPage(Number(value.value - 1));

   // Search input value state
   const [search, setSearch] = useState(globalFilter);

   // Search input state handle
   const onSearchChange = useAsyncDebounce((value) =>
   {
      setGlobalFilter(value || undefined);
   }, 100);

   // A function that sets the sorted value for the table
   const setSortedValue = (column: any) =>
   {
      let sortedValue;

      if (isSorted && column.isSorted)
      {
         sortedValue = column.isSortedDesc ? "desc" : "asce";
      }
      else if (isSorted)
      {
         sortedValue = "none";
      }
      else
      {
         sortedValue = false;
      }

      return sortedValue;
   };

   // Setting the entries starting point
   const entriesStart = pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1;

   // Setting the entries ending point
   let entriesEnd;

   if (pageIndex === 0)
   {
      entriesEnd = pageSize;
   }
   else if (pageIndex === pageOptions.length - 1)
   {
      entriesEnd = rows.length;
   }
   else
   {
      entriesEnd = pageSize * (pageIndex + 1);
   }

   return (
      <TableContainer sx={{boxShadow: "none"}}>
         {entriesPerPage || canSearch ? (
            <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
               {entriesPerPage && (
                  <MDBox display="flex" alignItems="center">
                     <Autocomplete
                        disableClearable
                        value={pageSize.toString()}
                        options={entries}
                        onChange={(event, newValue) =>
                        {
                           setEntriesPerPage(parseInt(newValue, 10));
                        }}
                        size="small"
                        sx={{width: "5rem"}}
                        renderInput={(params) => <MDInput {...params} />}
                     />
                     <MDTypography variant="caption" color="secondary">
                        &nbsp;&nbsp;entries per page
                     </MDTypography>
                  </MDBox>
               )}
               {canSearch && (
                  <MDBox width="12rem" ml="auto">
                     <MDInput
                        placeholder="Search..."
                        value={search}
                        size="small"
                        fullWidth
                        onChange={({currentTarget}: any) =>
                        {
                           setSearch(search);
                           onSearchChange(currentTarget.value);
                        }}
                     />
                  </MDBox>
               )}
            </MDBox>
         ) : null}
         <Table {...getTableProps()}>
            <MDBox component="thead">
               {headerGroups.map((headerGroup: any, i: number) => (
                  <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
                     {headerGroup.headers.map((column: any) => (
                        column.type !== "hidden" && (
                           <DataTableHeadCell
                              key={i++}
                              {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
                              width={column.width ? column.width : "auto"}
                              align={column.align ? column.align : "left"}
                              sorted={setSortedValue(column)}
                           >
                              {column.render("header")}
                           </DataTableHeadCell>
                        )
                     ))}
                  </TableRow>
               ))}
            </MDBox>
            <TableBody {...getTableBodyProps()}>
               {page.map((row: any, key: any) =>
               {
                  prepareRow(row);
                  return (
                     <TableRow sx={{verticalAlign: "top"}} key={key} {...row.getRowProps()}>
                        {row.cells.map((cell: any) => (
                           cell.column.type !== "hidden" && (
                              <DataTableBodyCell
                                 key={key}
                                 noBorder={noEndBorder && rows.length - 1 === key}
                                 align={cell.column.align ? cell.column.align : "left"}
                                 {...cell.getCellProps()}
                              >
                                 {
                                    cell.column.type === "default" && (
                                       cell.value && "number" === typeof cell.value ? (
                                          <DefaultCell>{cell.value.toLocaleString()}</DefaultCell>
                                       ) : (<DefaultCell>{cell.render("Cell")}</DefaultCell>)
                                    )
                                 }
                                 {
                                    cell.column.type === "htmlAndTooltip" && (
                                       <DefaultCell>

                                          <NoMaxWidthTooltip title={parse(row.values["tooltip"])}>
                                             <MDBox>
                                                {parse(cell.value)}
                                             </MDBox>
                                          </NoMaxWidthTooltip>
                                       </DefaultCell>
                                    )
                                 }
                                 {
                                    cell.column.type === "html" && (
                                       <DefaultCell>{parse(cell.value)}</DefaultCell>
                                    )
                                 }
                                 {
                                    cell.column.type === "image" && row.values["imageTotal"] && (
                                       <ImageCell imageUrl={row.values["imageUrl"]} label={row.values["imageLabel"]} total={row.values["imageTotal"].toLocaleString()} totalType={row.values["imageTotalType"]} />
                                    )
                                 }
                                 {
                                    cell.column.type === "image" && !row.values["imageTotal"] && (
                                       <ImageCell imageUrl={row.values["imageUrl"]} label={row.values["imageLabel"]} />
                                    )
                                 }
                              </DataTableBodyCell>
                           )
                        ))}
                     </TableRow>
                  );
               })}
            </TableBody>
         </Table>

         <MDBox
            display="flex"
            flexDirection={{xs: "column", sm: "row"}}
            justifyContent="space-between"
            alignItems={{xs: "flex-start", sm: "center"}}
            p={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
         >
            {showTotalEntries && (
               <MDBox mb={{xs: 3, sm: 0}}>
                  <MDTypography variant="button" color="secondary" fontWeight="regular">
                     Showing {entriesStart} to {entriesEnd} of {rows.length} entries
                  </MDTypography>
               </MDBox>
            )}
            {pageOptions.length > 1 && (
               <MDPagination
                  variant={pagination.variant ? pagination.variant : "gradient"}
                  color={pagination.color ? pagination.color : "info"}
               >
                  {canPreviousPage && (
                     <MDPagination item onClick={() => previousPage()}>
                        <Icon sx={{fontWeight: "bold"}}>chevron_left</Icon>
                     </MDPagination>
                  )}
                  {renderPagination.length > 6 ? (
                     <MDBox width="5rem" mx={1}>
                        <MDInput
                           inputProps={{type: "number", min: 1, max: customizedPageOptions.length}}
                           value={customizedPageOptions[pageIndex]}
                           onChange={(event: any) =>
                           {
                              handleInputPagination(event);
                              handleInputPaginationValue(event);
                           }}
                        />
                     </MDBox>
                  ) : (
                     renderPagination
                  )}
                  {canNextPage && (
                     <MDPagination item onClick={() => nextPage()}>
                        <Icon sx={{fontWeight: "bold"}}>chevron_right</Icon>
                     </MDPagination>
                  )}
               </MDPagination>
            )}
         </MDBox>
      </TableContainer>
   );
}

// Declaring default props for DataTable
DataTable.defaultProps = {
   entriesPerPage: {defaultValue: 10, entries: ["5", "10", "15", "20", "25"]},
   canSearch: false,
   showTotalEntries: true,
   pagination: {variant: "gradient", color: "info"},
   isSorted: true,
   noEndBorder: false,
};

export default DataTable;
