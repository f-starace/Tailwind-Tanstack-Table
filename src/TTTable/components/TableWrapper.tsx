import { PropsWithChildren } from "react";
import { useTableContext } from "../context";
import joinStrings from "../helpers/joinStrings";

const TableWrapper: React.FC<PropsWithChildren> = ({ children, ...props }) => {
  const {
    tableProps: { bordered },
  } = useTableContext();
  return (
    <div
      className={joinStrings(
        "table-wrapper",
        "my-5 max-w-full overflow-x-auto",
        bordered &&
          "relative -mx-4 mt-10 ring-1 ring-gray-300 sm:-mx-6 md:mx-0 md:rounded-lg"
      )}
    >
      {children}
    </div>
  );
};

export default TableWrapper;
