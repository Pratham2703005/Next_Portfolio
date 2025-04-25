

export interface UserType {
  id: string
  name: string
  email: string
  image: string | null
}

export interface UserMessageType {
  id: string
  content: string
  isPublic: boolean
  x: number
  y: number
  createdAt: string
}

import type { Account, Session, Authenticator } from "@prisma/client"
export type AllMessages = {
  id:string,
  content:string,
  isPublic:boolean,
  x : number,
  y : number,
  userId: string,
  user : MyUser,
  user_name?:string,
  user_image?:string,
  user_email?:string,
  createdAt: Date,
  updatedAt: Date
}
export type MyUser= {
  id: string
  name?: string
  email?: string
  emailVerified?: Date
  image?: string
  accounts?: Account[]
  sessions?: Session[]
  Authenticator?: Authenticator[]
  messages?: AllMessages[]
  createdAt?: Date
  updatedAt?: Date
}
