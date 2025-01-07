"use client";

import * as React from "react";
import { api } from "~/trpc/react";

import {
  type ColumnDef,
  ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { type Department } from "@prisma/client";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  userType: string;
  handleStatus: (row: Department) => void; // Add a new prop for editing a row
  handleEdit: (row: Department) => void;
}

// Custom filter function for exact text match
const exactTextFilter = (row: { getValue: (arg0: any) => any; }, columnId: any, filterValue: string) => {
  const cellValue = row.getValue(columnId);
  return cellValue === filterValue || filterValue === "All";
};

export function DataTable<TData, TValue>({
  columns,
  data,
  userType,
  handleStatus,
  handleEdit,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  // Append the edit button column definition to the columns
  const columnsWithEditButton = React.useMemo(() => {
    return [
      ...columns,
      {
        id: "edit",
        header: "Actions",
        cell: ({ row }: { row: { original: Department } }) => (
          <div className="flex justify-between gap-6">
            <button
              onClick={() => handleStatus(row.original)} // Call handleStatus with the original row data
              className={`${row.original.status === "Active" ? "text-red-500 hover:text-red-600" : "text-green-500 hover:text-green-600"}`}
            >
              {row.original.status === "Active" ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={() => handleEdit(row.original)} // Call handleEdit with the original row data
              className="text-blue-500 hover:text-blue-600"
            >
              Edit
            </button>
          </div>
        ),
      },
    ] as ColumnDef<TData, unknown>[];
  }, [columns, handleEdit, handleStatus]);

  const table = useReactTable({
    data,
    columns: userType === "admin" ? columnsWithEditButton : columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    filterFns: {
      exactText: exactTextFilter,
    },
    defaultColumn: {
      filterFn: "exactText",
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(event.target.value);
  };

  const handleColumnFilterChange = (
    value: string | undefined,
    columnId: string,
  ) => {
    table.getColumn(columnId)?.setFilterValue(value);
  };

  // Get list of managers
  const { data: managers } = api.employee.getManagers.useQuery();

  return (
    <div>
      <div className="mb-10 flex flex-col items-center justify-between rounded-md border border-black">
        <h1 className="self-start p-4">Filters</h1>
        <div className="flex w-2/3 flex-col pb-10">
          <div className="mb-4 flex items-center justify-between">
            <h1>Status</h1>
            <Select
              onValueChange={(value) =>
                handleColumnFilterChange(value, "status")
              }
              defaultValue={
                (table.getColumn("status")?.getFilterValue() as string) ?? ""
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex justify-between py-4">
        <div className="w-40">
          <Select
            onValueChange={(value) =>
              table.setPageSize(
                value === "All"
                  ? table.getFilteredRowModel().rows.length
                  : Number(value),
              )
            }
            defaultValue="10"
          >
            <SelectTrigger>
              <SelectValue placeholder="Show" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="All">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={handleSearchChange}
          className="w-30"
        />
      </div>
      <div className="rounded-md border border-black px-4 py-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
