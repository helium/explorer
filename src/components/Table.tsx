import React, { ReactElement } from "react";
import { useTable } from "react-table";

export interface TableProps {
  columns: {
    heading: string;
    render?: (value: any) => React.ReactNode;
    key: string;
  }[];
  data: { [key: string]: any }[];
}

function Table({ columns, data }: TableProps) {
  const memoColumns = React.useMemo(
    () =>
      columns.map((c) => {
        const out = {
          Header: c.heading,
          accessor: c.key,
        };

        if (c.render) {
          out["Cell"] = ({ value }) => c.render(value);
        }

        return out;
      }),
    []
  );

  const memoData = React.useMemo(() => data, []);

  const tableInstance = useTable({ columns: memoColumns, data: memoData });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <div style={{ maxWidth: "100%" }}>
      <div
        style={{ maxWidth: "100%" }}
        className="overflow-x-scroll overflow-y-hidden"
      >
        <table
          {...getTableProps()}
          className="w-full text-gray-600 font-thin"
          style={{ borderSpacing: 0 }}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="bg-gray-100 text-left text-gray-600 p-3"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className="m-0 p-4 bg-white border-b border-gray-100"
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { Table };
