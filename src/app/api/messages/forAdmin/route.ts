import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const allMessages = await prisma.message.findMany();
        if(allMessages.length === 0){
            return NextResponse.json([])
        }
        return NextResponse.json(allMessages)
    } catch (error) {
        if(error instanceof Error){
            console.log(error.message);
        }
    }
}