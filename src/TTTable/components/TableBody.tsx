import { useTableContext } from "../context";
import joinStrings from "../helpers/joinStrings";

const TableBody: React.FC = () => {
  const {
    tableProps: { sx, cx, verticalLines, striped, condensed, resizable },
    tableState: { table, flexRender },
  } = useTableContext();

  return (
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
};

export default TableBody;
