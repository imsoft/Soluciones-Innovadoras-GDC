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
  user: z
    .string()
    .min(2, {
      message: "El usuario debe tener al menos 2 caracteres",
    })
    .max(50, {
      message: "El usuario no puede tener más de 50 caracteres",
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
  const [authenticatedData, setAuthenticatedData] = useState<any | null>(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: "rappi_user",
      password: "rappi_password",
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

      // Codificar en Base64 el user y password
      const base64Credentials = btoa(`${values.user}:${values.password}`);

      const response = await fetch("/api/turbo-rappi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${base64Credentials}`, // Agregar el header de Authorization
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
      console.error(err);
      setError("Error de conexión con el servidor: " + (err as Error).message);
    }
  };

  const makeAuthenticatedRequest = async () => {
    try {
      if (!token) {
        setError("Token no proporcionado");
        return;
      }

      // Hacer la solicitud con el token JWT en el header
      const response = await fetch("/api/turbo-rappi/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-token": token, // Aquí se envía el token
        },
        body: JSON.stringify({ key1: "valor1", key2: "valor2", key3: "valor3" }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthenticatedData(data); // Guardar los datos en el estado
        setIsAuthDialogOpen(true); // Abrir el diálogo
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error en la solicitud autenticada");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Soluciones Innovadoras GDC"
            src="/logoipsum-332.svg"
            className="h-auto w-auto mx-auto"
            width={32}
            height={32}
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
                name="user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Input type="text" autoComplete="username" {...field} />
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
                      <Input
                        type="password"
                        autoComplete="current-password"
                        {...field}
                      />
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
          {token && (
            <Button
              className="flex w-full text-white mt-7"
              onClick={makeAuthenticatedRequest}
            >
              Mandar orden autenticada
            </Button>
          )}

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

          {authenticatedData && (
            <AlertDialog
              open={isAuthDialogOpen}
              onOpenChange={setIsAuthDialogOpen}
            >
              <AlertDialogTrigger />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Solicitud autenticada exitosa 🎉
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    ¡Aquí está la respuesta de la solicitud autenticada!:
                    <br />
                    <strong className="block break-all max-w-full text-sm mt-2">
                      {JSON.stringify(authenticatedData, null, 2)}
                    </strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction onClick={() => setIsAuthDialogOpen(false)}>
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
