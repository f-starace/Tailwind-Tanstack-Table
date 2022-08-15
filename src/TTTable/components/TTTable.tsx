import * as React from "react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  //   ** sorting
  getSortedRowModel,
  SortingState,
  //   ** filters
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  //   ** pagination
  getPaginationRowModel,
  //   ** column resizing
  ColumnResizeMode,
} from "@tanstack/react-table";

// ** Imports from types
import { TTTableProps } from "../types";

// ** Imports from components
import TableWrapper from "./TableWrapper";
import GlobalFilter from "./GlobalFilter";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TableFooter from "./TableFooter";
import TablePagination from "./TablePagination";
import TableContext from "../context";
import TableBase from "./TableBase";

function TTTable<Tdata>({
  inputColumns = [],
  inputData,
  defaultColumn = {},
  sticky,
  condensed,
  bordered,
  verticalLines,
  striped,
  cx,
  sx,
  footer,
  pagination,
  selectable,
  expandable,
  resizable,
  filterColumns,
  filterGlobal,
}: TTTableProps<Tdata>) {
  // ** Table State
  //  ** integrating inputData and inputColumns to state
  const [data, setData] = React.useState(() => [...inputData]);
  const [columns] = React.useState<typeof inputColumns>(() => [
    ...inputColumns,
  ]);
  const rerender = React.useReducer(() => ({}), {})[1];
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnResizeMode, setColumnResizeMode] =
    React.useState<ColumnResizeMode>("onChange");

  const table = useReactTable({
    data,
    columns,
    // defaultColumn,

    state: {
      sorting,
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),

    // ** for sorting
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    // ** for filtering
    getFilteredRowModel: getFilteredRowModel(),

    // ** for pagination
    getPaginationRowModel: getPaginationRowModel(),

    // ** for row selection
    onRowSelectionChange: setRowSelection,

    // ** for column resizing
    columnResizeMode,

    // ** for data export
    // useExportData: useExportData,

    // ** debugging
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  // we update the table context so that the sub-components
  // can access the table props and state without prop-drilling

  const tableProps = {
    inputColumns,
    inputData,
    defaultColumn,
    sticky,
    condensed,
    bordered,
    verticalLines,
    striped,
    cx,
    sx,
    footer,
    pagination,
    selectable,
    expandable,
    resizable,
    filterColumns,
    filterGlobal,
  };

  const tableState = {
    table: table,
    sorting: sorting,
    setSorting: setSorting,
    globalFilter: globalFilter,
    setGlobalFilter: setGlobalFilter,
    columnResizeMode: columnResizeMode,
    setColumnResizeMode: setColumnResizeMode,
    data: data,
    setData: setData,
    columns: columns,
    flexRender: flexRender,
  };

  return (
    <TableContext.Provider
      value={{
        tableProps: tableProps,
        tableState: tableState,
      }}
    >
      <GlobalFilter />
      <TableWrapper>
        <TableBase>
          <TableHeader />
          <TableBody />
          <TableFooter />
        </TableBase>
      </TableWrapper>
      <TablePagination />
    </TableContext.Provider>
  );
}

export default TTTable;
