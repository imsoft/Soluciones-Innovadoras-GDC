"use server";

import db from "@/lib/db";
import { Role } from "@prisma/client";

// Crear un nuevo usuario
export const createUser = async (data: {
  name: string;
  email: string;
  role?: Role;
  password?: string;
}) => {
  try {
    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role || Role.USER, // Rol por defecto
        password: data.password || "",
      },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al crear el usuario: ${error.message}`);
    } else {
      throw new Error(`Error desconocido al crear el usuario`);
    }
  }
};

// Obtener todos los usuarios
export const getUsers = async () => {
  try {
    const users = await db.user.findMany();
    return users;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al crear el usuario: ${error.message}`);
    } else {
      throw new Error(`Error desconocido al crear el usuario`);
    }
  }
};

// Obtener un usuario por ID
export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al crear el usuario: ${error.message}`);
    } else {
      throw new Error(`Error desconocido al crear el usuario`);
    }
  }
};

// Actualizar un usuario por ID
export const updateUser = async (
  id: string,
  data: { name?: string; email?: string; role?: Role; password?: string }
) => {
  try {
    const updatedUser = await db.user.update({
      where: { id },
      data,
    });
    return updatedUser;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al actualizar el usuario: ${error.message}`);
    } else {
      throw new Error(`Error desconocido al actualizar el usuario`);
    }
  }
};

// Eliminar un usuario por ID
export const deleteUser = async (id: string) => {
  try {
    const deletedUser = await db.user.delete({
      where: { id },
    });
    return deletedUser;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al crear el usuario: ${error.message}`);
    } else {
      throw new Error(`Error desconocido al crear el usuario`);
    }
  }
};
