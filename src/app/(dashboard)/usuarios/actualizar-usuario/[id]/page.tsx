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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserById, updateUser } from "@/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Role } from "@prisma/client";

const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
      .max(50, { message: "El nombre no puede exceder los 50 caracteres." })
      .optional(),
    email: z
      .string()
      .email({ message: "Debe ser un correo electrónico válido." })
      .optional(),
    role: z
      .enum(["USER", "ADMIN"], { message: "El rol debe ser 'USER' o 'ADMIN'." })
      .default("USER"),
    password: z.string().optional().nullable(), // Permitir null o vacío
    confirmPassword: z.string().optional().nullable(), // Permitir null o vacío
  })
  .refine(
    (data) => {
      // Si se proporciona una contraseña, se requiere confirmación
      if (data.password) {
        return (
          data.password.length >= 8 && data.password === data.confirmPassword
        );
      }
      return true; // Si no se proporciona la contraseña, no validar
    },
    {
      message: "Las contraseñas no coinciden o la contraseña es muy corta.",
      path: ["confirmPassword"],
    }
  );

const UpdateUserPage = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "USER",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Función asíncrona para obtener los datos del usuario
    const fetchUser = async () => {
      try {
        const userData = await getUserById(params.id); // Llamada asíncrona
        if (userData) {
          form.reset({
            name: userData.name || "",
            email: userData.email || "",
            role: userData.role || "USER",
            password: "", // No es seguro prellenar la contraseña
            confirmPassword: "",
          });
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      } finally {
        setLoading(false); // Terminamos de cargar
      }
    };

    fetchUser();
  }, [params.id, form]);

  const handleUpdateClick = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setOpenAlertDialog(true);
    } else {
      toast({
        variant: "destructive",
        title: "Error en el formulario",
        description: "Por favor, complete todos los campos requeridos.",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name, email, role, password } = values;

    const updateData: {
      name?: string;
      email?: string;
      role?: Role;
      password?: string;
    } = {
      name,
      email,
      role: role as Role,
    };

    // Solo añade la contraseña si se proporcionó
    if (password) {
      updateData.password = password;
    }

    try {
      const updatedUser = await updateUser(params.id, updateData);

      if (!updatedUser) {
        toast({
          variant: "destructive",
          title: "Algo salió mal 😢",
          description: "No se pudo actualizar el usuario.",
        });
      } else {
        toast({
          variant: "success",
          title: "Usuario actualizado 🥳",
          description: "El usuario ha sido actualizado correctamente.",
        });
        router.push("/usuarios");
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al actualizar el usuario.",
      });
    }
  };

  if (loading) {
    return <div>Cargando datos del usuario...</div>;
  }

  return (
    <>
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Agregar usuario
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Llena el formulario para agregar un nuevo usuario.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo</FormLabel>
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
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el role del usuario" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USER">USER</SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
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
              </div>

              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Dejar en blanco para no cambiarla"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Dejar en blanco para no cambiarla"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* <div className="flex justify-end">
              <Button className="text-white" type="submit">
                Editar usuario
              </Button>
            </div> */}

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
                      ¿Estás seguro de que deseas actualizar a este usuario?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
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

export default UpdateUserPage;
