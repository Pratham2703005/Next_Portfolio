import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        const {content, isPublic, x,y, userId, user_name, user_image, user_email} = await req.json();
        console.log(content , " " , isPublic, " ", x , " ",y ," ", userId, " ", user_name, " ",user_email, " ", user_image);
        if(!content || !x || !y || !userId || !user_image || !user_name || !user_email) {
            throw new Error('Need all Credentials')
        }
        const newMessage = await prisma.message.create({
            data: {
                content,
                isPublic,
                x,
                y,
                userId,
                user_name,
                user_image,
                user_email
            }  
        })
        await prisma.user.update({
            where: {id: userId},
            data:{
                messages: {
                    connect: { id: newMessage.id }, // 👈 push message to user
                },
            }
        })
        return NextResponse.json(newMessage);
    } catch (error ) {
        if(error instanceof Error) {
            console.log(error.message);
            return NextResponse.json({error: error.message})
        }
        
    }
}

export async function DELETE(req:NextRequest){
    try{

        const {id} = await req.json();
        //updating user 
        const messageUserId = await prisma.message.delete({
            where:{id: id},
            select:{
                userId:true
            }
        })
        if(messageUserId){
            await prisma.user.update({
                where: {id :messageUserId.userId},
                data: {
                    messages:{
                        disconnect: {id : id}
                    }
                }
            })
        }
        return NextResponse.json({success:true})
    }catch(e){
        if(e instanceof Error){
            console.log(e.message)
            return NextResponse.json({error:e.message})
        }
    }

}   