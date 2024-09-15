"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";

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
import { products } from "@/data";
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

const FormSchema = z.object({
  products: z.string({
    required_error: "Por favor, seleccione un producto.",
  }),
  quantity: z
    .number({
      required_error: "Por favor, ingrese la cantidad del producto.",
    })
    .min(1, "La cantidad debe ser mayor que 0"),
});

const AddOrderPage = () => {
  const [productList, setProductList] = useState<
    (Product & { quantity: number; amount: number })[]
  >([]);

  const [email, setEmail] = useState<string>("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      products: "",
      quantity: 0,
    },
  });

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

    form.reset();
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    addToList({
      ...data,
      quantity: Number(data.quantity),
    });
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

  // Función para manejar el envío de correos

  const handleSendEmail = async () => {
    const productDetails = productList
      .map(
        (product) =>
          `${product.product} - ${product.quantity} pcs - ${formatCurrency(
            product.amount
          )}`
      )
      .join("<br />");

    const emailContent = `
    <h2>Detalles del pedido</h2>
    <p>${productDetails}</p>
    <p>Total: ${formatCurrency(totalAmount)}</p>
  `;

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: "Detalles de tu pedido",
          html: emailContent,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Correo enviado exitosamente");
      } else {
        alert("Error al enviar el correo");
      }
    } catch (error) {
      alert("Error al enviar el correo");
      console.error(error);
    }
  };

  return (
    <>
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Ingreso de pedido
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Complete los campos a continuación para ingresar un nuevo pedido.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <div className="flex justify-end ">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                type="button"
                className="text-white"
              >
                Agregar a la lista
              </Button>
            </div>

            <div className="py-10">
              <DataTable columns={columns} data={productList} />
            </div>

            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">
                Total: {formatCurrency(totalAmount)}
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    disabled={productList.length === 0}
                    type="button"
                    className="text-white"
                  >
                    Enviar por correo electrónico
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Enviar por correo electrónico</DialogTitle>
                    <DialogDescription>
                      Ingrese el correo electrónico al que desea enviar el
                      pedido.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel htmlFor="email" className="text-right">
                        Correo electrónico
                      </FormLabel>
                      <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="col-span-3"
                        placeholder="ejemplo@correo.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <h3 className="font-semibold">Productos:</h3>
                      {productList.map((product, index) => (
                        <div key={index} className="flex justify-between">
                          <span>
                            {product.product} - {product.quantity} pcs
                          </span>
                          <span>{formatCurrency(product.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={handleSendEmail}>
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
