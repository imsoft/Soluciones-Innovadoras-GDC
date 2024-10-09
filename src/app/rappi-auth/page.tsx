"use client";

import Image from "next/image";
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "El correo electrónico no es válido" })
    .min(2, {
      message: "El correo electrónico debe tener al menos 2 caracteres",
    })
    .max(50, {
      message: "El correo electrónico no puede tener más de 50 caracteres",
    }),
  password: z
    .string()
    .min(2, { message: "La contraseña debe tener al menos 2 caracteres" })
    .max(50, { message: "La contraseña no puede tener más de 50 caracteres" }),
});

const RappiAuthPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setError(null);
      const response = await fetch("/api/turbo-rappi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setIsDialogOpen(true);
        setCopied(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error desconocido");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Soluciones Innovadoras GDC"
            src="/logoipsum-332.svg"
            className="mx-auto h-10 w-auto"
            width={40}
            height={40}
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Inicia sesión en tu cuenta
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="flex w-full text-white" type="submit">
                Iniciar sesión
              </Button>
            </form>
          </Form>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {token && (
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Inicio de sesión exitoso 🎉
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    ¡Has iniciado sesión correctamente! Aquí está tu token 👨‍💻:
                    <br />
                    <strong className="block break-all max-w-full text-sm mt-2">
                      {token}
                    </strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex items-center">
                  <Button
                    className=""
                    variant="secondary"
                    onClick={handleCopyToken}
                  >
                    {copied ? "Token copiado ✅" : "Copiar token"}
                  </Button>
                  <AlertDialogAction onClick={() => setIsDialogOpen(false)}>
                    Aceptar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </>
  );
};

export default RappiAuthPage;
