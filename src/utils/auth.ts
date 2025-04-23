import { prisma } from '@/lib/db';
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import {PrismaAdapter} from '@auth/prisma-adapter';
export const {auth, handlers, signIn} = NextAuth({
    adapter : PrismaAdapter(prisma),
    providers : [GitHub]
})