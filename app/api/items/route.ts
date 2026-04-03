import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(){
    return NextResponse.json({
        "message": "SUCCESS!"
    })
}

export async function POST(req: Request) {
  let body: {
    account?: string;
    device?: string;
    potions?: number;
    bucks?: number;
    eventCurrency?: number;
    tickets?: number;
    lastSeen?: string;
    upTime?: string;
  } | null = null;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!body?.account || !body?.device) {
    return NextResponse.json(
      { message: "account and device are required" },
      { status: 400 }
    );
  }

  try {
    const savedAccount = await prisma.playerAccount.create({
      data: {
        account: body.account,
        device: body.device,
        potions: body.potions ?? 0,
        bucks: body.bucks ?? 0,
        eventCurrency: body.eventCurrency ?? 0,
        tickets: body.tickets ?? 0,
        lastSeen: body.lastSeen ? new Date(body.lastSeen) : null,
        upTime: body.upTime ? new Date(body.upTime) : null,
      },
    });

    return NextResponse.json({
      message: "SUCCESS!",
      saved: savedAccount,
    });
  } catch (error) {
    console.error("Create player account error:", error);

    return NextResponse.json(
      { message: "Failed to save to database" },
      { status: 500 }
    );
  }
}