import { useTableContext } from "../context";
import joinStrings from "../helpers/joinStrings";

const TableFooter: React.FC = () => {
  const {
    tableProps: { footer, cx, sx },
    tableState: { table, flexRender },
  } = useTableContext();
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

export default TableFooter;
