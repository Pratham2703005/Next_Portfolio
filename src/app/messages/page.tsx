"use client"

import { useState, useEffect } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import dynamic from "next/dynamic"
import { Note } from "./note"
import { PreviewNote } from "./preview-note"
import { UserAvatar } from "./user-avatar"
import { AllMessages } from '@/utils/type'
import { CANVAS_SIZE, MESSAGE_ZOOM_THRESHOLD, CENTER_POINT, DEFAULT_CANVAS_MESSAGE_POSITION } from '@/utils/default-data'
import { useSession } from "next-auth/react"
import useSWR, { mutate } from 'swr'
import { ChevronLeft, ChevronRight } from "lucide-react" // Import icons for toggle

const Sidebar = dynamic(() => import("./sidebar").then(mod => mod.default), { ssr: false })

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  return response.json()
}

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)
  const [transform, setTransform] = useState({ scale: 1, positionX: 0, positionY: 0 })
  const [viewportDimensions, setViewportDimensions] = useState({ width: 0, height: 0 })
  const { data: session } = useSession()
  // State for sidebar visibility on mobile
  const [sidebarVisible, setSidebarVisible] = useState(true)
  
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
      refreshInterval: 10000,
      dedupingInterval: 2000, 
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
  
    // Set initial sidebar state based on screen size
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      
      // Keep sidebar always visible on larger screens
      if (!mobile) {
        setSidebarVisible(true)
      }
    }
  
    window.addEventListener('resize', updateViewportDimensions)
    window.addEventListener('resize', checkScreenSize)
    
    // Initial checks
    checkScreenSize()
    setTimeout(updateViewportDimensions, 100)
    
    return () => {
      window.removeEventListener('resize', updateViewportDimensions)
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  const addNote = (note: AllMessages) => {
    setSidebarVisible(false);
    mutate(messagesUrl, [...messages, note], false)
    mutate(messagesUrl)
    
    // Reset preview note after adding
    setPreviewNote(prev => ({
      ...prev,
      isVisible: false,
      content: ""
    }))
    
    // Auto-hide sidebar on mobile after adding a note
    if (window.innerWidth < 768) {
      setSidebarVisible(false)
    }
  }

  // New function to update preview note
  const updatePreviewNote = (previewData: Partial<typeof previewNote>) => {
    setPreviewNote(prev => ({
      ...prev,
      ...previewData
    }))
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
  
  const visibleArea = {
    width: Math.round(viewportDimensions.width / transform.scale),
    height: Math.round(viewportDimensions.height / transform.scale)
  }

  const toggleSidebar = () => {
    // Only toggle if on mobile
    if (isMobile) {
      setSidebarVisible(!sidebarVisible)
    }
  }

  // Display loading state or error when fetching messages
  if (error) {
    return <div className="flex h-full items-center justify-center text-red-500">Failed to load messages</div>
  }

  return (
    <div className="flex flex-col md:flex-row overflow-hidden h-[calc(100dvh-4rem)] relative">
      {/* Sidebar with responsive behavior */}
      <div 
        className={`
          ${isMobile ? (sidebarVisible ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'} 
          ${sidebarVisible ? 'w-full md:w-80 bg-black' : 'w-0 md:w-80'} 
          absolute md:relative z-20 transition-all duration-300 h-full
        `}
      >
        <Sidebar 
          className={`${sidebarVisible ? 'p-4 md:p-4 md:bg-black' : 'p-0 md:p-4 md:bg-black'}`}
          addNote={addNote}
          defaultX={DEFAULT_CANVAS_MESSAGE_POSITION} 
          defaultY={DEFAULT_CANVAS_MESSAGE_POSITION}
          existingNotes={messages}
          updatePreviewNote={updatePreviewNote}
        />
      </div>
      
      {/* Toggle button for sidebar */}
      <button 
        onClick={toggleSidebar}
        className={`${isMobile ? 'block' : 'hidden'} absolute top-4 right-4 z-30 bg-[#2b2b2b] rounded-full p-2 shadow-[0_0_10px_#35184d]`}
      >
        {sidebarVisible ? <ChevronLeft size={20} className="text-white" /> : <ChevronRight size={20} className="text-white" />}
      </button>
      
      {/* Canvas container */}
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
        <div className="absolute bottom-4 right-4 bg-black border-gray-800 text-white bg-opacity-75 p-2 rounded shadow-md text-xs font-mono z-10">
          <div>Zoom: {(transform.scale * 100).toFixed(0)}%</div>
          <div className="hidden sm:block">Visible: {visibleArea.width} × {visibleArea.height}</div>
        </div>
        
        <TransformWrapper
          initialScale={0.6}
          minScale={0.11}
          maxScale={7}
          limitToBounds={false}
          wheel={{ step: 0.05 }}
          onTransformed={({ state }) => {
            setTransform({
              scale: state.scale,
              positionX: state.positionX,
              positionY: state.positionY
            })
          }}
          centerOnInit={true}
          doubleClick={{ disabled: true }}
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
                  <Note key={message.id} message={message}  deleteNote={deleteNote}/>
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