"use client";

import { Product } from "@/interfaces";
import { formatCurrency } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "internalSku",
    header: "SKU Interno",
  },
  {
    accessorKey: "product",
    header: "Producto",
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ getValue }) => formatCurrency(getValue<number>()), // Renderizamos como moneda
  },
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ getValue }) => formatCurrency(getValue<number>()), // Renderizamos como moneda
  },
];
