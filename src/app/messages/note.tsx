"use client"

import { useState, useRef } from "react"
import Draggable, { DraggableEvent } from "react-draggable"
import type { AllMessages } from "@/utils/type"
import { LockIcon, Trash, UnlockIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"

interface NoteProps {
  message: AllMessages
  updatePosition: (id: string, x: number, y: number) => void
  deleteNode : ()=>void
}

export function Note({ message, updatePosition, deleteNode }: NoteProps) {
  const nodeRef = useRef<HTMLDivElement>(null!)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: message.x, y: message.y })

  const handleDrag = (_e: DraggableEvent, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y })
  }

  const handleStop = () => {
    setIsDragging(false)
    updatePosition(message.id, position.x, position.y)
  }

  const session = useSession();
  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStart={() => setIsDragging(true)}
      onDrag={handleDrag}
      onStop={handleStop}
      bounds={false}
    >
      <div
        ref={nodeRef}
        className={`absolute w-64 p-4 rounded-lg shadow-lg cursor-move ${isDragging ? "z-50" : "z-10"} ${message.isPublic ? "bg-[#1e1e2e]" : "bg-[#27272a]"} ${session.data?.user?.email === message.user_email ? 'border-white border-2' : 'border-black border-2'}`}
        style={{
          transform: `translate(${message.x}px, ${message.y}px)`,
        }}
      >
        <div className="flex justify-between items-start mb-2">
          {/* User Name and Image */}
          <div className="flex items-center space-x-2">
            <Image
              height={24}
              width={24}
              src={message.user_image || "/default-avatar.png"} // Fallback image if user image is missing
              alt={message.user_name || "User"} // Fallback text if user name is missing
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="text-xs text-gray-500">{message.user_name}</div>
            {session.data?.user?.email === message.user_email && (
              <button onClick={deleteNode}> <Trash className="size-8" /> </button>
            )}
          </div>

          {/* Message Privacy Icon */}
          <div className="text-gray-400">
            {message.isPublic ? <UnlockIcon size={16} /> : <LockIcon size={16} />}
          </div>
        </div>

        {/* Message Content */}
        <div className="text-[#eee] whitespace-pre-wrap break-words">
          {message.content}
        </div>

        {/* Message Timestamp */}
        <div className="text-xs text-gray-500 mt-2">
          {new Date(message.createdAt).toLocaleString()}
        </div>
      </div>
    </Draggable>
  )
}
