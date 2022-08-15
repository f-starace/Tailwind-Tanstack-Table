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

// ** types
import { TableProps } from "../types";

// ** icons
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/solid";
import joinStrings from "../helpers/joinStrings";
import Filter from "../helpers/Filter";
import DebouncedInput from "../helpers/DebouncedInput";
import { useExportData } from "../plugins/useExportData";

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
}: TableProps<Tdata>) {
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

  const GlobalFilter: React.FC = () => (
    <div>
      <DebouncedInput
        value={globalFilter ?? ""}
        type="text"
        onChange={(value) => setGlobalFilter(value as string)}
        className="p-2 font-lg shadow border border-block"
        placeholder="Search all columns..."
      />
    </div>
  );

  const TableHeader: React.FC = () => (
    <thead className="bg-gray-50">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr
          key={headerGroup.id}
          className={joinStrings(verticalLines && "divide-x divide-gray-200")}
          style={sx?.header?.row}
        >
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              scope="col"
              className={joinStrings(
                "py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6",
                resizable && "relative",
                sticky &&
                  "sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75backdrop-blur backdrop-filter lg:pl-8",
                condensed && "whitespace-nowrap",
                cx?.header
              )}
              colSpan={header.colSpan}
              // width: header.getSize() required for resizing
              style={{ ...sx?.header?.cell, width: header.getSize() }}
            >
              {/* if column header exists */}
              {!header.isPlaceholder && (
                <>
                  {/* handles column sorting  */}
                  <div
                    {...{
                      className: header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : "",
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: (
                        <ChevronUpIcon
                          className="h-5 w-5  inline-block"
                          aria-hidden="true"
                        />
                      ),
                      desc: (
                        <ChevronDownIcon
                          className="h-5 w-5  inline-block"
                          aria-hidden="true"
                        />
                      ),
                    }[header.column.getIsSorted() as string] ?? null}
                    {/* handles column filters */}
                  </div>
                  {header.column.getCanFilter() ? (
                    <div>
                      <Filter column={header.column} table={table} />
                    </div>
                  ) : null}
                  {/* handles column resizing */}
                  {resizable && (
                    <div
                      {...{
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: joinStrings(
                          "absolute right-0 top-0 h-full w-1 bg-gray-200 cursor-col-resize",
                          header.column.getIsResizing()
                            ? "isResizing" && "bg-gray-300"
                            : ""
                        ),
                        style: {
                          transform:
                            columnResizeMode === "onEnd" &&
                            header.column.getIsResizing()
                              ? `translateX(${
                                  table.getState().columnSizingInfo.deltaOffset
                                }px)`
                              : "",
                        },
                      }}
                    />
                  )}{" "}
                </>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );

  const TableBody: React.FC = () => (
    <tbody
      className={joinStrings("bg-white", cx?.body?.root)}
      style={sx?.body?.root}
    >
      {table.getRowModel().rows.map((row, rowIdx) => (
        <tr
          key={row.id}
          className={joinStrings(
            verticalLines && "divide-x divide-gray-200",
            cx?.body?.row,
            striped && rowIdx % 2 !== 0 && "bg-gray-50" && cx?.body?.striped
          )}
          style={
            rowIdx % 2 !== 0
              ? { ...sx?.body?.row, ...sx?.body?.striped } // style for striped rows
              : sx?.body?.row
          }
        >
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className={joinStrings(
                "border-b border-gray-200",
                "py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8",
                condensed && "whitespace-nowrap px-2 py-2",
                cx?.body?.cell
              )}
              style={{
                ...sx?.body?.cell,
                width: resizable ? cell.column.getSize() : undefined,
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  const TableFooter: React.FC = () => {
    if (!footer) {
      return null;
    }
    return (
      <tfoot className={joinStrings(cx?.footer?.root)} style={sx?.footer?.root}>
        {table.getFooterGroups().map((footerGroup) => (
          <tr
            key={footerGroup.id}
            className={joinStrings(cx?.footer?.row)}
            style={sx?.footer?.row}
          >
            {footerGroup.headers.map((header) => (
              <th
                key={header.id}
                className={joinStrings(cx?.footer?.cell)}
                style={sx?.footer?.cell}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    );
  };

  const TablePagination: React.FC = () => {
    if (!pagination) {
      return null;
    }
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="relative z-0 inline-flex shadow-sm rounded-md grow">
          <button
            type="button"
            className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronDoubleLeftIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronDoubleRightIcon className="w-4 h-4" />
          </button>
        </span>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {(
            (typeof pagination === "object" && pagination?.pageSizeOptions) || [
              10, 20, 30, 40, 50,
            ]
          ).map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div>
      <GlobalFilter />
      <div
        className={joinStrings(
          "table-wrapper",
          "max-w-full overflow-x-auto my-5",
          bordered &&
            "-mx-4 mt-10 ring-1 ring-gray-300 sm:-mx-6 md:mx-0 md:rounded-lg relative"
        )}
      >
        <table
          className={joinStrings(
            "divide-y divide-gray-300",
            sticky && "border-separate",
            resizable && "w-fit",
            cx?.table
          )}
          {...{
            style: {
              width: resizable ? table.getCenterTotalSize() : "100%",
              borderSpacing: 0,
            },
          }}
        >
          <TableHeader />
          <TableBody />
          <TableFooter />
        </table>
      </div>
      <TablePagination />
    </div>
  );
}

export default TTTable;
