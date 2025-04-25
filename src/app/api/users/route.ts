import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        if(!email){
            throw new Error('Email not found')
        }
        const user = await prisma.user.findFirst({
            where:{email:email},
           
        })
        if(!user){
            throw new Error('User not found')
        }
        return NextResponse.json(user);

    } catch (e) {
        if(e instanceof Error){
            console.log(e.message);
            NextResponse.json({error: e.message})
        }
    }
}