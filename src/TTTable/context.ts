import { createContext, useContext } from "react";
import { TTTableProps, TTTableState } from "./types";

const TableContext = createContext<{
  tableProps?: TTTableProps<any>;
  tableState?: TTTableState<any>;
}>({});

export default TableContext;

/**
 * Extrapolates data from the useContext hook only if it's been set.
 * @returns {TTTableProps<any>, TTTableState<any>}
 */
export const useTableContext = () => {
  const { tableProps, tableState } = useContext(TableContext);
  if (!tableProps)
    throw new Error(
      "No TableContext.Provider.tableProps found when calling useTableContext."
    );
  if (!tableState)
    throw new Error(
      "No TableContext.Provider.tableState found when calling useTableContext."
    );
  return { tableProps, tableState };
};
