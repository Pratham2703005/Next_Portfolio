import { MESSAGE_ZOOM_THRESHOLD } from "@/utils/default-data"
import { useSession } from "next-auth/react"

interface UserAvatarProps {
  name?: string,
  image?: string,
  x: number
  y: number
  scale: number
  isPublic?: boolean
  userEmail?: string
}

export function UserAvatar({name, image, x, y, scale, isPublic = true, userEmail }: UserAvatarProps) {
  // Fixed size for avatar
  const AVATAR_SIZE = 40
  const TEXT_SIZE = 14
  
  // Min scale threshold - below this, avatar will maintain fixed size
  
  
  // Calculate the scale factor to apply
  // If current scale is above threshold, use actual scale
  // If below threshold, use the minimum size threshold
  const displayScale = scale > MESSAGE_ZOOM_THRESHOLD ? MESSAGE_ZOOM_THRESHOLD : scale
  
  // Get session to determine if the message is from the current user
  const { data: session } = useSession()
  const isOwnMessage = session?.user?.email === userEmail
  
  // Dynamic border color logic
  const getBorderColor = () => {
    if (isOwnMessage) {
      return "border-green-500" // Green border for own messages
    } else if (isPublic) {
      return "border-blue-400" // Blue border for public messages
    } else {
      return "border-pink-500" // Pink border for private messages
    }
  }
  
  return (
    <div 
      className="absolute flex flex-col items-center"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-50%, -50%) scale(${1/displayScale})`,
        zIndex: Math.floor(y)
      }}
    >
      <div 
        className={`rounded-full bg-violet-500 shadow-md overflow-hidden flex items-center justify-center border-2 ${getBorderColor()}`}
        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
      >
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
            {name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      {scale > MESSAGE_ZOOM_THRESHOLD - 0.2 && ( 
        <div 
          className="px-2 py-1 text-white bg-opacity-80 rounded mt-1 text-center whitespace-nowrap"
          style={{ fontSize: TEXT_SIZE }}
        >
          {name}
        </div>
      )}
    </div>
  )
}