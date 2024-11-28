"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Product } from "@/interfaces";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { createOrder, getProducts } from "@/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const FormSchema = z.object({
  products: z.string({
    required_error: "Por favor, seleccione un producto.",
  }),
  quantity: z
    .number({
      required_error: "Por favor, ingrese la cantidad del producto.",
    })
    .min(1, "La cantidad debe ser mayor que 0"),
  email: z.string().email({ message: "Ingrese un correo electrónico válido." }),
});

const AddOrderPage = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [productList, setProductList] = useState<
    (Product & { quantity: number; amount: number })[]
  >([]);
  const [openDialog, setOpenDialog] = useState(false); // Control del estado del Dialog

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      products: "",
      quantity: 1,
      email: "", // Valor inicial para el campo email
    },
  });

  // Cargar productos desde la base de datos cuando el componente se monta
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();

        // Normalizar los datos o adaptarlos al tipo esperado
        const normalizedProducts = fetchedProducts.map((product) => ({
          ...product,
          product: product.product || "Producto sin nombre",
          createdAt: product.createdAt || new Date(),
          updatedAt: product.updatedAt || new Date(),
          userId: product.userId || "Desconocido",
          price: product.price || 0,
          internalSku: product.internalSku || "SKU desconocido",
          ean: product.ean || "EAN desconocido",
        }));

        setProducts(normalizedProducts); // Guardar los datos normalizados
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProducts();
  }, []);

  const addToList = (data: z.infer<typeof FormSchema>) => {
    const selectedProduct = products.find((p) => p.product === data.products);

    if (selectedProduct) {
      const amount = selectedProduct.price * data.quantity;

      setProductList((prevList) => [
        ...prevList,
        {
          ...selectedProduct,
          quantity: data.quantity,
          amount: amount,
        },
      ]);
    }

    form.reset({
      products: "",
      quantity: 1,
      email: form.getValues("email"), // Mantener el valor de email al hacer reset
    });
  };

  const handleAddToList = () => {
    const formData = form.getValues(); // Obtener valores del formulario
    if (formData.products && formData.quantity > 0) {
      addToList(formData); // Añadir a la lista si los datos son válidos
    }
  };

  const removeProduct = (productId: number) => {
    setProductList((prevList) =>
      prevList.filter((product) => product.id !== productId)
    );
  };

  const totalAmount = productList.reduce(
    (total, product) => total + product.amount,
    0
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const productsForOrder = productList.map((product) => ({
      productId: product.id,
      product: product.product,
      quantity: product.quantity,
      amount: product.amount,
    }));

    try {
      const response = await axios.post("/api/send", {
        email: data.email,
        products: productsForOrder,
        totalAmount,
      });

      // Crear el pedido en el backend
      await createOrder({
        customerEmail: data.email,
        products: productsForOrder,
        totalAmount,
      });

      if (response.status === 200) {
        toast({
          variant: "success",
          title: "Pedido enviado 🥳",
          description: "El pedido ha sido enviado correctamente.",
        });
        router.push("/pedidos");
      }
    } catch (error) {
      console.error(
        "Error al crear el pedido:",
        (error as any).response?.data || error
      );
      toast({
        variant: "destructive",
        title: "Algo salió mal 😢",
        description: "No se pudo enviar el correo.",
      });
    }
  };

  return (
    <>
      <div className="">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Ingreso de pedido
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Complete los campos a continuación para ingresar un nuevo pedido.
        </p>

        <Form {...form}>
          <form className="space-y-6">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="products"
                  render={({ field }) => (
                    <FormItem className="flex flex-col mt-2">
                      <FormLabel className="mb-0.5">Producto</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? products.find(
                                    (product) => product.product === field.value
                                  )?.product
                                : "Selecciona un producto"}
                              <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput
                              placeholder="Busca tu producto..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                No se encontró el producto.
                              </CommandEmpty>
                              <CommandGroup>
                                {products.map((product) => (
                                  <CommandItem
                                    value={product.product}
                                    key={product.product}
                                    onSelect={() => {
                                      form.setValue(
                                        "products",
                                        product.product
                                      );
                                    }}
                                  >
                                    {product.product}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        product.product === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription className="mt-1">
                        Seleccione el producto que desea agregar al pedido.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Ingrese la cantidad del producto que desea agregar al
                        pedido.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleAddToList} // Agregar a la lista
                type="button"
                className="text-white"
              >
                Agregar a la lista
              </Button>
            </div>

            <div className="py-10">
              <DataTable
                columns={columns}
                data={productList}
                removeProduct={removeProduct}
              />
            </div>

            <div className="flex justify-between items-center py-2">
              {/* Mostrar el total debajo de la tabla */}
              <div className="py-2">
                <p className="text-lg font-semibold text-left">
                  Total: {formatCurrency(totalAmount)}
                </p>
              </div>

              {/* Botón para abrir el Dialog con el resumen del pedido */}
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button
                    disabled={productList.length === 0}
                    type="button"
                    className="text-white"
                    onClick={() => setOpenDialog(true)} // Abrir Dialog
                  >
                    Ver resumen y enviar
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Enviar por correo electrónico</DialogTitle>
                    <DialogDescription>
                      Revise el pedido antes de enviarlo.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <h3 className="font-semibold">Resumen del pedido:</h3>
                    {productList.map((product, index) => (
                      <div key={index} className="flex justify-between">
                        <span>
                          {product.product} - {product.quantity} pcs
                        </span>
                        <span>{formatCurrency(product.amount)}</span>
                      </div>
                    ))}

                    <p className="text-lg font-semibold">
                      Total: {formatCurrency(totalAmount)}
                    </p>

                    <Separator />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo Electrónico</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="ejemplo@correo.com"
                            />
                          </FormControl>
                          <FormDescription>
                            Ingrese el correo electrónico al que desea enviar el
                            pedido.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                      Enviar pedido
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AddOrderPage;
