import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(){
    return NextResponse.json({
        "message": "SUCCESS!"
    })
}

export async function POST(req: Request) {
  let body: any;

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
        ...(body.apiKey
          ? {
              apiKey: {
                connect: {
                  id: body.apiKey,
                },
              },
            }
          : {}),

        // 🔥 CREATE ITEMS HERE
        items: {
          create: (body.items ?? []).map((item: any) => ({
            type: item.type,
            name: item.name,
            quantity: item.quantity ?? 1,

            // only if it's a pet
            pet:
              item.type === "PET"
                ? {
                    create: {
                      variant: item.variant, // NORMAL / NEON / MEGA
                      potion: item.potion,   // NONE / RIDE / FLY / FLY_RIDE
                    },
                  }
                : undefined,
          })),
        },
      },

      // 🔥 include items in response
      include: {
        items: {
          include: {
            pet: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "SUCCESS!",
      saved: savedAccount,
    });
  } catch (error) {
    console.error("Create player account error:", error);

    return NextResponse.json(
      {
        message: "Failed to save to database",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}