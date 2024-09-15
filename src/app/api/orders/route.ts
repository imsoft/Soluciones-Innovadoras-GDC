import { generateTicketHtml } from "@/app/utils/helpers";
import { sendEmail } from "@/lib/email";
import { getOrders } from "@/lib/rappi";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  try {
    const orders = await getOrders();

    for (const order of orders) {
      if (order.status === "successful") {
        const ticketHtml = generateTicketHtml(order);
        await sendEmail(
          order.customer.email,
          "Tu ticket de Pod Store",
          ticketHtml
        );
      }
    }

    return NextResponse.json(
      { message: "Emails sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch orders or send emails" },
      { status: 500 }
    );
  }
}
