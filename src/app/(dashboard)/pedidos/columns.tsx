"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Orders = {
  id: string;
  dateOrder: string;
  customer: {
    name: string;
    email: string;
    address: string;
  };
  products: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
};

export const columns: ColumnDef<Orders>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "dateOrder",
    header: "Fecha de pedido",
  },
  {
    accessorKey: "customer.name",
    header: "Nombre del cliente",
  },
  {
    accessorKey: "customer.email",
    header: "Correo electrónico",
  },
  {
    accessorKey: "customer.address",
    header: "Dirección",
  },
  {
    accessorKey: "products.name",
    header: "Producto",
  },
  {
    accessorKey: "products.quantity",
    header: "Cantidad",
  },
  {
    accessorKey: "products.price",
    header: "Precio",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
];
