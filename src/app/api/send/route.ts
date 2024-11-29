import { EmailTemplate } from "@/components/email/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const {
      email,
      products,
      totalAmount,
      businessName,
      rfc,
      orderNumber,
      billingDetails,
    } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "Cloud Store <tickets@cloudstore.mx>",
      to: [email],
      subject: "Detalles de tu pedido",
      react: EmailTemplate({
        products,
        totalAmount,
        businessName,
        rfc,
        orderNumber,
        billingDetails,
      }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
