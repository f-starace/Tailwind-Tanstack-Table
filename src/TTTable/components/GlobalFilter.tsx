import { useTableContext } from "../context";
import DebouncedInput from "../helpers/DebouncedInput";

const GlobalFilter: React.FC = () => {
  const {
    tableState: { globalFilter, setGlobalFilter },
  } = useTableContext();

  return (
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
};

export default GlobalFilter;
