"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { subDays, isAfter } from "date-fns";
import { Orders } from "./columns";

interface DataTableProps<TData extends { dateOrder: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TValue>({
  columns,
  data,
}: DataTableProps<Orders, TValue>) {
  const [showLast30Days, setShowLast30Days] = useState(false);

  // Memoizamos `displayedData` para que solo cambie cuando `showLast30Days` o `data` cambien
  const displayedData = useMemo(() => {
    if (showLast30Days) {
      const thirtyDaysAgo = subDays(new Date(), 30);
      return data.filter((order) =>
        isAfter(new Date(order.dateOrder), thirtyDaysAgo)
      );
    }
    return data;
  }, [showLast30Days, data]);

  const table = useReactTable({
    data: displayedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      {/* <div className="flex items-center py-4">
        <Button onClick={() => setShowLast30Days((prev) => !prev)}>
          {showLast30Days ? "Ver todos" : "Últimos 30 días"}
        </Button>
      </div> */}
      <div className="rounded-md border">
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
                          header.getContext()
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
                        cell.getContext()
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
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="space-x-2 py-4 flex justify-between items-center">
        <Select onValueChange={(value) => table.setPageSize(+value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10 filas" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filas por página</SelectLabel>
              <SelectItem value="10">10 filas</SelectItem>
              <SelectItem value="20">20 filas</SelectItem>
              <SelectItem value="30">30 filas</SelectItem>
              <SelectItem value="40">40 filas</SelectItem>
              <SelectItem value="50">50 filas</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
