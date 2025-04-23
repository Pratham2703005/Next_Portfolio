'use server';
import { prisma } from "@/lib/db"
import { User } from "next-auth";

export async function getUser(email:string ): Promise<User | undefined> {
    try {
        const user = await prisma.user.findFirst({
            where: {email :email},
            include: {
                messages: true, // this will return an array of full Message objects
              },
        })
        if(!user){
            throw new Error('User does not exist')
        }
        return user;

    } catch (error) {
        if(error instanceof Error){
            window.alert(error.message)
        }
    }
}