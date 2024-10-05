"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProductById, updateProduct } from "@/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  product: z
    .string()
    .min(2, {
      message: "El nombre del producto debe tener al menos 2 caracteres.",
    })
    .max(100, {
      message: "El nombre del producto no puede exceder los 100 caracteres.",
    }),
  price: z
    .number()
    .min(0, { message: "El precio debe ser un número positivo." }),
  internalSku: z
    .string()
    .min(1, { message: "El SKU es obligatorio." })
    .max(50, { message: "El SKU no puede exceder los 50 caracteres." }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const UpdateProductPage = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const router = useRouter();

  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: "",
      price: undefined,
      internalSku: "",
      createdAt: undefined,
      updatedAt: undefined,
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = parseInt(params.id); // Convertir params.id de string a number
        if (isNaN(productId)) {
          throw new Error("ID inválido");
        }

        const productData = await getProductById(productId); // Utilizar el ID convertido
        if (productData) {
          form.reset({
            product: productData.product || "",
            price: productData.price || 0,
            internalSku: productData.internalSku || "",
          });
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, form]);

  const handleUpdateClick = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setOpenAlertDialog(true); // Abre el diálogo de confirmación
    } else {
      toast({
        variant: "destructive",
        title: "Error en el formulario",
        description: "Por favor, complete todos los campos requeridos.",
      });
    }
  };

  const onSubmit = async (
    values: z.infer<typeof formSchema>,
    productId: number
  ) => {
    const { product, price, internalSku } = values;

    const updateData: {
      product?: string;
      price?: number;
      internalSku?: string;
    } = {
      product,
      price,
      internalSku,
    };

    try {
      const updatedProduct = await updateProduct(productId, updateData); // Usar el ID convertido

      if (!updatedProduct) {
        toast({
          variant: "destructive",
          title: "Algo salió mal 😢",
          description: "No se pudo actualizar el producto.",
        });
      } else {
        toast({
          variant: "success",
          title: "Producto actualizado 🥳",
          description: "El producto ha sido actualizado correctamente.",
        });
        router.push("/productos");
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al actualizar el producto.",
      });
    }
  };

  if (loading) {
    return <div>Cargando datos del producto...</div>;
  }

  return (
    <>
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Actualizar producto
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Llena el formulario para actualizar el producto.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateClick)}
            className="space-y-6"
          >
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del producto</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="internalSku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU Interno</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button type="button" onClick={handleUpdateClick}>
                Actualizar
              </Button>
              <AlertDialog
                open={openAlertDialog}
                onOpenChange={setOpenAlertDialog}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      ¿Estás seguro de que deseas actualizar este producto?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={form.handleSubmit((values) =>
                        onSubmit(values, parseInt(params.id))
                      )}
                    >
                      Aceptar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default UpdateProductPage;
