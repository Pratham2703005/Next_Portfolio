
interface UserAvatarProps {
  name?: string,
  image?: string,
  x: number
  y: number
  scale: number
}

export function UserAvatar({name,image, x, y, scale }: UserAvatarProps) {
  // Fixed size for avatar
  const AVATAR_SIZE = 30
  const TEXT_SIZE = 10
  
  // Min scale threshold - below this, avatar will maintain fixed size
  const MIN_SCALE_THRESHOLD = 0.3
  
  // Calculate the scale factor to apply
  // If current scale is above threshold, use actual scale
  // If below threshold, use the minimum size threshold
  const displayScale = scale > MIN_SCALE_THRESHOLD ? MIN_SCALE_THRESHOLD : scale
  
  
  return (
    <div 
    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
    style={{
      left: `${x}px`,
      top: `${y}px`,
      transform: `translate(-50%, -50%) scale(${1/displayScale})`,
      zIndex: Math.floor(y)
    }}
  >
    <div 
      className="rounded-full bg-violet-500 shadow-md overflow-hidden flex items-center justify-center"
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
    {scale > MIN_SCALE_THRESHOLD + 0.001 && ( 
      <div 
        className="px-2 py-1 text-white  bg-opacity-80 rounded mt-1 text-center whitespace-nowrap"
        style={{ fontSize: TEXT_SIZE }}
      >
        {name}
      </div>
    )}
  </div>
  
  )
}