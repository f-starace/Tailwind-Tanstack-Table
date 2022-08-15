import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import defaultData, { Person } from "./sampleData";
import TTTable from "./TTTable";

const Expample = () => {
  const columns = React.useMemo<ColumnDef<Person, any>[]>(
    () => [
      {
        header: "Name",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: "firstName",
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.lastName,
            id: "lastName",
            cell: (info) => info.getValue(),
            header: () => <span>Last Name</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => `${row.firstName} ${row.lastName}`,
            id: "fullName",
            header: "Full Name",
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        header: "Info",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: "age",
            header: () => "Age",
            footer: (props) => props.column.id,
          },
          {
            header: "More Info",
            columns: [
              {
                accessorKey: "visits",
                header: () => <span>Visits</span>,
                footer: (props) => props.column.id,
              },
              {
                accessorKey: "status",
                header: "Status",
                footer: (props) => props.column.id,
              },
              {
                accessorKey: "progress",
                header: "Profile Progress",
                footer: (props) => props.column.id,
              },
            ],
          },
        ],
      },
    ],
    []
  );

  return (
    <TTTable
      condensed
      striped
      bordered
      inputData={defaultData}
      inputColumns={columns}
      pagination
      resizable
      sticky
    />
  );
};

export default Expample;
