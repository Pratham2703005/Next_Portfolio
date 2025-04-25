// First, let's create a PreviewNote component that will show in the canvas

// preview-note.tsx
"use client"

import { useRef, memo } from "react"
import { LockIcon, UnlockIcon } from "lucide-react"
// import { useSession } from "next-auth/react"
import Image from "next/image"

interface PreviewNoteProps {
  content: string
  isPublic: boolean
  x: number
  y: number
  userImage?: string
  userName?: string
}

const PreviewNote = memo(function PreviewNote({ 
  content, 
  isPublic, 
  x, 
  y,
  userImage,
  userName
}: PreviewNoteProps) {
  const nodeRef = useRef<HTMLDivElement>(null!)
//   const { data: session } = useSession()

  // Dynamic border color logic - same as in Note component
  const getBorderClass = () => {
    return isPublic ? "border-blue-400" : "border-pink-500"
  }
  
  return (
    <div
      ref={nodeRef}
      className={`absolute w-64 p-4 rounded-lg shadow-lg z-30 ${
        isPublic ? "bg-[#1e1e2e]" : "bg-[#27272a]"
      } ${getBorderClass()} border-2 cursor-default opacity-75`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-50%, -50%)`,
      }}
    >
      <div className="flex justify-between items-start mb-2">
        {/* User Name and Image */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full overflow-hidden">
            {userImage ? (
              <Image
                src={userImage || "/placeholder.svg"}
                alt={userName || "User"}
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">
                {userName?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">{userName}</div>
        </div>

        {/* Message Privacy Icon */}
        <div className="text-gray-400">
          {isPublic ? <UnlockIcon size={16} /> : <LockIcon size={16} />}
        </div>
      </div>

      {/* Message Content */}
      <div className="text-[#eee] whitespace-pre-wrap break-words">
        {content || "Your message preview..."}
      </div>

      {/* Message Timestamp */}
      <div className="text-xs text-gray-500 mt-2">
        {new Date().toLocaleString()} (Preview)
      </div>
    </div>
  )
})

export { PreviewNote }