"use client"

import { useState, useEffect } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import dynamic from "next/dynamic"
import { Note } from "./note"
import { PreviewNote } from "./preview-note" // Import the new component
import { UserAvatar } from "./user-avatar"
import { AllMessages } from '@/utils/type'
import { CANVAS_SIZE, MESSAGE_ZOOM_THRESHOLD, CENTER_POINT, DEFAULT_CANVAS_MESSAGE_POSITION } from '@/utils/default-data'
import { useSession } from "next-auth/react"
import useSWR, { mutate } from 'swr'

const Sidebar = dynamic(() => import("./sidebar").then(mod => mod.default), { ssr: false })

// SWR fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  return response.json()
}

export default function Home() {
  const [transform, setTransform] = useState({ scale: 1, positionX: 0, positionY: 0 })
  const [viewportDimensions, setViewportDimensions] = useState({ width: 0, height: 0 })
  const { data: session } = useSession()
  
  // New state for preview note
  const [previewNote, setPreviewNote] = useState<{
    content: string;
    isPublic: boolean;
    x: number;
    y: number;
    isVisible: boolean;
    userName?: string;
    userImage?: string;
  }>({
    content: "",
    isPublic: true,
    x: DEFAULT_CANVAS_MESSAGE_POSITION,
    y: DEFAULT_CANVAS_MESSAGE_POSITION,
    isVisible: false,
    userName: "",
    userImage: ""
  })
  
  // SWR for messages
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  const email = session?.user?.email || ""
  const messagesUrl = isAdmin 
    ? '/api/messages/forAdmin' 
    : `/api/messages/forUsers?email=${encodeURIComponent(email)}`
    
  const { data: messages = [], error } = useSWR(
     messagesUrl,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 10000, // Refresh every 10 seconds
      dedupingInterval: 2000, // Deduplicate requests within 2 seconds
    }
  )

  // Track viewport dimensions
  useEffect(() => {
    const updateViewportDimensions = () => {
      const contentEl = document.querySelector('.react-transform-component')
      if (contentEl) {
        setViewportDimensions({
          width: contentEl.clientWidth,
          height: contentEl.clientHeight
        })
      }
    }

    window.addEventListener('resize', updateViewportDimensions)
    
    // Initial viewport dimensions
    setTimeout(updateViewportDimensions, 100)
    
    return () => {
      window.removeEventListener('resize', updateViewportDimensions)
    }
  }, [])

  const addNote = (note: AllMessages) => {
    mutate(messagesUrl, [...messages, note], false)
    mutate(messagesUrl)
    
    // Reset preview note after adding
    setPreviewNote(prev => ({
      ...prev,
      isVisible: false,
      content: ""
    }))
  }

  // New function to update preview note
  const updatePreviewNote = (previewData: Partial<typeof previewNote>) => {
    setPreviewNote(prev => ({
      ...prev,
      ...previewData
    }))
  }

  const updateNotePosition = async (id: string, x: number, y: number) => {
    // Optimistic update
    const updatedMessages = messages.map((note:AllMessages) =>
      note.id === id ? { ...note, x, y } : note
    )
    
    mutate(messagesUrl, updatedMessages, false)
    
    // Update in the backend
    try {
      await fetch('/api/messages', {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, x, y }),
      })
      
      // Revalidate after backend update
      mutate(messagesUrl)
    } catch (error) {
      console.error("Failed to update note position:", error)
      // Revert optimistic update on error
      mutate(messagesUrl)
    }
  }

  const deleteNote = async (noteId: string) => {
    // Optimistic UI update
    const updatedMessages = messages.filter((message : AllMessages) => message.id !== noteId)
    mutate(messagesUrl, updatedMessages, false)
  
    try {
      await fetch('/api/messages', {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: noteId }),
      })
      
      // Revalidate after backend update
      mutate(messagesUrl)
    } catch (error) {
      console.error("Failed to delete message:", error)
      // Revert optimistic update on error
      mutate(messagesUrl)
    }
  }
  
  // Calculate visible canvas dimensions
  const visibleArea = {
    width: Math.round(viewportDimensions.width / transform.scale),
    height: Math.round(viewportDimensions.height / transform.scale)
  }

  // Display loading state or error when fetching messages
  if (error) {
    return <div className="flex h-full items-center justify-center text-red-500">Failed to load messages</div>
  }

  return (
    <div className="flex overflow-hidden h-[calc(100vh-4rem)]">
      <Sidebar 
        addNote={addNote}
        defaultX={DEFAULT_CANVAS_MESSAGE_POSITION} 
        defaultY={DEFAULT_CANVAS_MESSAGE_POSITION}
        existingNotes={messages} // Pass existing notes to Sidebar
        updatePreviewNote={updatePreviewNote} // Pass the new function
      />
      <div className="flex-1 overflow-hidden relative">
        {/* Grid overlay that moves with the canvas */}
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundSize: `${50 * transform.scale}px ${50 * transform.scale}px`,
            backgroundImage: `
              linear-gradient(to right, #010101 1px, transparent 1px),
              linear-gradient(to bottom, #010101 1px, transparent 1px)
            `,
            backgroundPosition: `${transform.positionX}px ${transform.positionY}px`
          }}
        />
        
        {/* Status display at bottom right */}
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-75 p-2 rounded shadow-md text-xs font-mono z-10">
          <div>Zoom: {(transform.scale * 100).toFixed(0)}%</div>
          <div>Visible: {visibleArea.width} × {visibleArea.height}</div>
        </div>
        
        <TransformWrapper
          initialScale={0.6}
          minScale={0.11} // Allow much further zooming out
          maxScale={7}   // Allow more zooming in
          limitToBounds={false}
          wheel={{ step: 0.05 }} // Smoother zoom steps
          onTransformed={({ state }) => {
            setTransform({
              scale: state.scale,
              positionX: state.positionX,
              positionY: state.positionY
            })
          }}
          centerOnInit={true}
          doubleClick={{ disabled: true }} // Disable default double-click behavior
        >
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%" }}
            contentStyle={{ width: "100%", height: "100%" }}
          >
            <div 
              className="relative" 
              style={{ 
                width: `${CANVAS_SIZE}px`, 
                height: `${CANVAS_SIZE}px` 
              }}
            >
              {/* Center indicator */}
              <div 
                className="absolute rounded-full bg-gray-300" 
                style={{ 
                  left: `${CENTER_POINT}px`, 
                  top: `${CENTER_POINT}px`, 
                  width: '8px', 
                  height: '8px',
                  transform: 'translate(-50%, -50%)'
                }} 
              />
              
              {/* Display notes or avatars based on zoom threshold */}
              {messages.map((message: AllMessages) => {
                // Show avatar if below threshold, show note if above threshold
                return transform.scale >= MESSAGE_ZOOM_THRESHOLD ? (
                  <Note key={message.id} message={message} updatePosition={updateNotePosition} deleteNote={deleteNote}/>
                ) : (
                  <UserAvatar 
                    name={message?.user_name}
                    image={message?.user_image}
                    key={message.id}
                    x={message.x} 
                    y={message.y} 
                    scale={transform.scale}
                    isPublic={message.isPublic}
                    userEmail={message.user_email}
                  />
                )
              })}
              
              {/* Display preview note if visible and above zoom threshold */}
              {previewNote.isVisible && transform.scale >= MESSAGE_ZOOM_THRESHOLD && (
                <PreviewNote 
                  content={previewNote.content}
                  isPublic={previewNote.isPublic}
                  x={previewNote.x}
                  y={previewNote.y}
                  userName={previewNote.userName}
                  userImage={previewNote.userImage}
                />
              )}
              
              {/* Display preview avatar if visible and below zoom threshold */}
              {previewNote.isVisible && transform.scale < MESSAGE_ZOOM_THRESHOLD && (
                <UserAvatar 
                  name={previewNote.userName}
                  image={previewNote.userImage}
                  x={previewNote.x}
                  y={previewNote.y}
                  scale={transform.scale}
                  isPublic={previewNote.isPublic}
                  userEmail={session?.user?.email || ""}
                />
              )}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  )
}