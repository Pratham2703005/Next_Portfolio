import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

  
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { isPublic: true },
          {
            AND: [
              { isPublic: false },
              { user: { email } } 
            ]
          }
        ]
      },
      // 👇 This ensures no user data is fetched
      select: {
        id: true,
        content: true,
        isPublic: true,
        x: true,
        y: true,
        userId: true,
        user_name: true,
        user_image: true,
        user_email: true,
        createdAt: true,
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in GET messages:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}


