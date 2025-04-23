"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import type { NoteType, MyUser } from "@/utils/type"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import OverlayMessageBox from "./components/OverlayMessageBox"
import { getUser } from "@/actions/getUser"

interface SidebarProps {
  addNote: (note: NoteType) => void
  defaultX: number
  defaultY: number
}

const Sidebar = ({ addNote, defaultX, defaultY }: SidebarProps) => {
  const { data: session } = useSession()
  const [user ,setUser] = useState<MyUser|null>(null);
  const [message, setMessage] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [x, setX] = useState(defaultX)
  const [y, setY] = useState(defaultY)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    async function createNewMessage(){
      if(user){
        const response = await fetch('/api/messages',{
          body:JSON.stringify({content:message, isPublic, x,y,userId: user.id, user_name: user.name,user_image: user.image, user_email:user.email}),
          headers:{'Content-Type' : 'application/json'},
          method : "POST"
        })
        if(!response.ok)window.alert('Something went wrong while creating message')
        const data = await response.json();
        addNote(data)
        
      }
    }
    createNewMessage()
    setMessage("")
  }

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.email) {
        const fetchedUser : MyUser = await getUser(session.user.email) as MyUser;
        if(!fetchedUser) setUser(null);
        else setUser(fetchedUser);
        console.log(fetchedUser)
      }
    };
  
    fetchData();
  }, [session]);
  

  return (
    <div className="relative w-80 h-full p-4 overflow-y-auto bg-black border-r border-[#2b2b2b] shadow-[0_0_10px_#35184d] text-white">
      <h2 className="text-xl font-bold mb-4 text-white">Message Box</h2>

      {/* 🔒 Overlay if not logged in */}
      {!session && (
        <OverlayMessageBox/>
      )}

      {/* 👇 Form content */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select user */}
        

        {/* Message textarea */}
        <div className="space-y-2">
          <Textarea
            id="message"
            placeholder="Enter your note..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] bg-[#1a1a1a] text-white border border-[#333]"
            required
          />
        </div>

        {/* Toggle public/private */}
        <div className="flex items-center justify-between px-2 py-2 rounded-lg border border-[#333] bg-[#1a1a1a] hover:border-[#8e2de2] transition-all duration-300">
          <Label htmlFor="public-mode" className="text-zinc-300 flex items-center gap-2">
            <span className="text-sm">{isPublic ? "🌐 Public" : "🔒 Private"}</span>
          </Label>
          <button
            id="public-mode"
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${
              isPublic ? "bg-[#8e2de2]" : "bg-[#444]"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ${
                isPublic ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        {/* X & Y coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="x-coord" className="text-sm text-zinc-300">X</Label>
            <Input
              id="x-coord"
              type="number"
              value={x}
              onChange={(e) => setX(Number(e.target.value))}
              className="bg-[#1a1a1a] text-white border border-[#333]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="y-coord" className="text-sm text-zinc-300">Y</Label>
            <Input
              id="y-coord"
              type="number"
              value={y}
              onChange={(e) => setY(Number(e.target.value))}
              className="bg-[#1a1a1a] text-white border border-[#333]"
            />
          </div>
        </div>

        <Button type="submit" disabled={!user} className="w-full bg-[#8e2de2] hover:bg-[#4a00e0] text-white">
          Add to Canvas
        </Button>
      </form>
    </div>
  )
}

export default Sidebar
