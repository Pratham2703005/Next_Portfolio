"use client"

import { useState, useRef, memo } from "react"
import Draggable, { type DraggableEvent } from "react-draggable"
import type { AllMessages } from "@/utils/type"
import { LockIcon, Trash, UnlockIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"

interface NoteProps {
  message: AllMessages
  updatePosition: (id: string, x: number, y: number) => void
  deleteNote: (id: string) => void
}

// Using memo to prevent unnecessary re-renders
const Note = memo(function Note({ message, updatePosition, deleteNote}: NoteProps) {
  const nodeRef = useRef<HTMLDivElement>(null!)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: message.x, y: message.y })
  const { data: session } = useSession()

  const isOwnMessage = session?.user?.email === message.user_email
  const isAdminLive = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  // Dynamic border color logic
  const getBorderClass = () => {
    if (isOwnMessage) {
      return "border-green-500" // Green border for own messages (both public and private)
    } else if (message.isPublic) {
      return "border-blue-400" // Blue border for public messages
    } else {
      return "border-pink-500" // Pink border for private messages
    }
  }

  const handleDrag = (_e: DraggableEvent, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y })
  }

  const handleStop = () => {
    setIsDragging(false)
    updatePosition(message.id, position.x, position.y)
  }
  
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
        className={`absolute w-64 p-4 rounded-lg shadow-lg ${
          isDragging ? "z-50" : "z-10"
        } ${message.isPublic ? "bg-[#1e1e2e]" : "bg-[#27272a]"} ${
          getBorderClass()
        } border-2 cursor-move`}
        style={{
          transform: `translate(-50%, -50%)`,
        }}
      >
        <div className="flex justify-between items-start mb-2">
          {/* User Name and Image */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              {message.user_image ? (
                <Image
                  src={message.user_image || "/placeholder.svg"}
                  alt={message.user_name || "User"}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">
                  {message.user_name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500">{message.user_name}</div>
            {(isOwnMessage || isAdminLive) && (
              <button
                onClick={() => deleteNote(message.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash className="size-4" />
              </button>
            )}
          </div>

          {/* Message Privacy Icon */}
          <div className="text-gray-400">{message.isPublic ? <UnlockIcon size={16} /> : <LockIcon size={16} />}</div>
        </div>

        {/* Message Content */}
        <div className="text-[#eee] whitespace-pre-wrap break-words">{message.content}</div>

        {/* Message Timestamp */}
        <div className="text-xs text-gray-500 mt-2">
          {new Date(message.createdAt).toLocaleString()}
        </div>
      </div>
    </Draggable>
  )
})

export { Note }