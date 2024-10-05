"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteProduct } from "@/actions";
import { toast } from "@/hooks/use-toast";

export type Product = {
  id: number;
  product: string;
  price: number;
  internalSku: string;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "product",
    header: "Producto",
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(price);

      return formatted;
    },
  },
  {
    accessorKey: "internalSku",
    header: "SKU Interno",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      const handleDelete = () => {
        const response = deleteProduct(product.id);

        if (!response) {
          toast({
            variant: "destructive",
            title: "Algo salió mal 😢",
            description: "No se pudo eliminar el producto.",
          });
        } else {
          toast({
            variant: "success",
            title: "Producto eliminado 🥳",
            description: "El producto ha sido eliminado correctamente.",
          });
          window.location.reload();
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                (window.location.href = `/productos/actualizar-producto/${product.id}`)
              }
            >
              Editar
            </DropdownMenuItem>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Eliminar
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    ¿Seguro que deseas eliminar el producto?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Continuar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
