import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import Filter from "../helpers/Filter";
import joinStrings from "../helpers/joinStrings";

// ** Imports from context
import { useTableContext } from "../context";

const TableHeader: React.FC = () => {
  const {
    tableProps: {
      verticalLines,
      sx,
      resizable,
      sticky,
      condensed,
      cx,
      filterColumns,
    },
    tableState: { table, flexRender, columnResizeMode },
  } = useTableContext();
  return (
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
                  "bg-opacity-75backdrop-blur sticky top-0 z-10 border-b border-gray-300 bg-gray-50 backdrop-filter lg:pl-8",
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
                          className="inline-block h-5  w-5"
                          aria-hidden="true"
                        />
                      ),
                      desc: (
                        <ChevronDownIcon
                          className="inline-block h-5  w-5"
                          aria-hidden="true"
                        />
                      ),
                    }[header.column.getIsSorted() as string] ?? null}
                    {/* handles column filters */}
                  </div>
                  {filterColumns && header.column.getCanFilter() ? (
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
                  )}
                </>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};

export default TableHeader;
