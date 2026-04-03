import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  return NextResponse.json({
    message: "SUCCESS!",
  });
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

  if (!body?.account || !body?.device || !body?.apiKey) {
    return NextResponse.json(
      { message: "account, device, and apiKey are required" },
      { status: 400 }
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 🔹 1. Get API key
      const apiKeyRecord = await tx.apiKey.findUnique({
        where: { key: body.apiKey },
        select: {
          id: true,
          isActive: true,
          maxRequests: true,
          expiresAt: true,
          _count: {
            select: { playerAccounts: true },
          },
        },
      });

      if (!apiKeyRecord) throw new Error("Invalid API key");
      if (!apiKeyRecord.isActive) throw new Error("API key is inactive");
      if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
        throw new Error("API key has expired");
      }

      // 🔹 2. Check if account already exists
      const existing = await tx.playerAccount.findFirst({
        where: {
          account: body.account,
          apiKeyId: apiKeyRecord.id,
        },
        include: {
          items: {
            include: { pet: true },
          },
        },
      });

      // ============================================
      // ✅ UPDATE FLOW
      // ============================================
      if (existing) {
        // optional: reset items
        await tx.item.deleteMany({
          where: {
            playerAccountId: existing.id,
          },
        });

        const updated = await tx.playerAccount.update({
          where: { id: existing.id },
          data: {
            potions: body.potions ?? existing.potions,
            bucks: body.bucks ?? existing.bucks,
            eventCurrency: body.eventCurrency ?? existing.eventCurrency,
            tickets: body.tickets ?? existing.tickets,
            lastSeen: new Date(),
            status: "ONLINE",

            items: {
              create: (body.items ?? []).map((item: any) => ({
                type: item.type,
                name: item.name,
                quantity: item.quantity ?? 1,
                pet:
                  item.type === "PET"
                    ? {
                      create: {
                        variant: item.variant,
                        potion: item.potion,
                      },
                    }
                    : undefined,
              })),
            },
          },
          include: {
            items: {
              include: { pet: true },
            },
          },
        });

        return {
          type: "UPDATED",
          data: updated,
        };
      }

      // ============================================
      // 🆕 CREATE FLOW (with limit check)
      // ============================================

      const currentAccounts = apiKeyRecord._count.playerAccounts;
      const maxAllowed = apiKeyRecord.maxRequests;

      if (currentAccounts >= maxAllowed) {
        throw new Error(
          `Account limit reached. Maximum allowed is ${maxAllowed}`
        );
      }

      const created = await tx.playerAccount.create({
        data: {
          account: body.account,
          device: body.device,
          potions: body.potions ?? 0,
          bucks: body.bucks ?? 0,
          eventCurrency: body.eventCurrency ?? 0,
          tickets: body.tickets ?? 0,
          lastSeen: new Date(),
          status: "ONLINE",
          upTime: body.upTime ? new Date(body.upTime) : null,

          apiKey: {
            connect: { id: apiKeyRecord.id },
          },

          items: {
            create: (body.items ?? []).map((item: any) => ({
              type: item.type,
              name: item.name,
              quantity: item.quantity ?? 1,
              pet:
                item.type === "PET"
                  ? {
                    create: {
                      variant: item.variant,
                      potion: item.potion,
                    },
                  }
                  : undefined,
            })),
          },
        },
        include: {
          items: {
            include: { pet: true },
          },
        },
      });

      return {
        type: "CREATED",
        data: created,
      };
    });

    return NextResponse.json({
      success: true,
      message:
        result.type === "UPDATED"
          ? "Player account updated"
          : "Player account created",
      saved: result.data,
    });
  } catch (error) {
    console.error("Upsert player account error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 }
    );
  }
}