"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Orders = {
  id: string;
  dateOrder: string;
  customer: {
    email: string;
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
    accessorKey: "customer.email",
    header: "Correo electrónico",
  },
  {
    // Mostrar los productos en una celda concatenada
    accessorKey: "products",
    header: "Productos",
    cell: ({ row }) => {
      const products = row.getValue("products") as {
        name: string;
        quantity: number;
        price: number;
      }[];

      // Formatear cada producto como "nombre (cantidad x precio)"
      const productList = products
        .map(
          (product) =>
            `${product.name} (${product.quantity} x $${product.price})`
        )
        .join(", ");

      return <div>{productList}</div>;
    },
  },
  {
    // Mostrar el total del pedido
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const total = parseFloat(row.getValue("total"));
      const formatted = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(total);

      return <div>{formatted}</div>;
    },
  },
];
