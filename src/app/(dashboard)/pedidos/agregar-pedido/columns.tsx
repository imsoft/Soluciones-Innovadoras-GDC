"use client";

import { Product } from "@/interfaces";
import { formatCurrency } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@heroicons/react/24/outline";

interface CustomTableMeta {
  removeProduct: (productId: number) => void;
}

export const columns: ColumnDef<
  Product & { quantity: number; amount: number }
>[] = [
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
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row, table }) => {
      const handleRemove = () => {
        const productId = row.original.id;
        // Ahora TypeScript sabe que `removeProduct` existe en `meta`
        (table.options.meta as CustomTableMeta)?.removeProduct(productId);
      };

      return (
        <Button onClick={handleRemove} variant="destructive" size="sm" className="w-16">
          <TrashIcon className="h-5 w-5" />
        </Button>
      );
    },
  },
];
