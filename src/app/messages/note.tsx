// In note.tsx
"use client"

import { useRef, memo } from "react"
import type { AllMessages } from "@/utils/type"
import { LockIcon, Trash, UnlockIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"

interface NoteProps {
  message: AllMessages
  deleteNote: (id: string) => void
}

const Note = memo(function Note({ message, deleteNote }: NoteProps) {
  const nodeRef = useRef<HTMLDivElement>(null!)
  const { data: session } = useSession()

  const isOwnMessage = session?.user?.email === message.user_email
  const isAdminLive = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  const getBorderClass = () => {
    if (isOwnMessage) {
      return "border-green-500"
    } else if (message.isPublic) {
      return "border-blue-400"
    } else {
      return "border-pink-500"
    }
  }

  return (
    <div
      ref={nodeRef}
      className={`custom-scrollbar w-64 p-4 max-h-64 overflow-y-auto rounded-lg shadow-lg ${
        message.isPublic ? "bg-[#1e1e2e]" : "bg-[#27272a]"
      } ${getBorderClass()} border-2`}
      style={{
        position: "absolute",
        left: `${message.x}px`,
        top: `${message.y}px`,
        transform: "translate(-50%, -50%)",
        zIndex: Math.floor(message.y) // Dynamic z-index based on y-position
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

        {/* Privacy Icon */}
        <div className="text-gray-400">{message.isPublic ? <UnlockIcon size={16} /> : <LockIcon size={16} />}</div>
      </div>

      {/* Message Content */}
      <div className="text-[#eee] whitespace-pre-wrap break-words">{message.content}</div>

      {/* Timestamp */}
      <div className="text-xs text-gray-500 mt-2">
        {new Date(message.createdAt).toLocaleString()}
      </div>
    </div>
  )
})

export { Note }