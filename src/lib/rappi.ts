import { apiClient } from "./apiClient";

// Función para obtener órdenes de RAPPI
export const getOrders = async () => {
  try {
    const response = await apiClient.get("/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
