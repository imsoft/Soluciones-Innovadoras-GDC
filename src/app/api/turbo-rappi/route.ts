import { NextResponse, NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const { title } = await req.json();

  return NextResponse.json({ title: { title } }, { status: 201 });
};
