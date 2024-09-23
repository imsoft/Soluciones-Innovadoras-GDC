export const sendEmail = async (
  recipientEmail: string,
  productList: { product: string; quantity: number; amount: number }[],
  totalAmount: string
) => {
  const messageBody = {
    recipientEmail,
    productList,
    totalAmount,
  };

  const response = await fetch("/api/emailContact", {
    method: "POST",
    body: JSON.stringify(messageBody),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) throw new Error("Hubo un error al enviar tu mensaje...");
  return response.json();
};
