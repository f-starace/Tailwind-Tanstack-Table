import { ReactNode } from "react";
import { useTableContext } from "../context";
import joinStrings from "../helpers/joinStrings";

const Table: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    tableProps: { sticky, resizable, cx },
    tableState: { table },
  } = useTableContext();
  return (
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
      {children}
    </table>
  );
};

export default Table;
