"use client"

import { useState, useEffect } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import dynamic from "next/dynamic"
import { Note } from "./note"
import { UserAvatar } from "./user-avatar"
import { AllMessages } from '@/utils/type';
import { CANVAS_SIZE, MESSAGE_ZOOM_THRESHOLD,CENTER_POINT } from '@/utils/default-canvas-data'
import { useSession } from "next-auth/react"
const Sidebar = dynamic(() => import("./sidebar").then(mod => mod.default), { ssr: false })


export default function Home() {
  const [transform, setTransform] = useState({ scale: 1, positionX: 0, positionY: 0 })
  const [viewportDimensions, setViewportDimensions] = useState({ width: 0, height: 0 })
  const [messages, setMessages] = useState<AllMessages[]>([])
  const session = useSession();

  useEffect(()=>{
    async function fetchMessages(){
      if(session && session.data?.user?.email === process.env.ADMIN_EMAIL){
        //admin messages
        const response = await fetch('/api/messages/forAdmin');
        if(!response.ok) window.alert('Something went Wrong while fetching messages for Admin');
        const data = await response.json();
        if(data.length !== 0) setMessages(data);
      }else{
        const email = session?.data?.user?.email
        const response = await fetch(`/api/messages/forUsers?email=${encodeURIComponent(email || "")}`);
        if (!response.ok) window.alert("Something went wrong while fetching messages for Users");
        const data = await response.json();
        if (data.length !== 0) setMessages(data);

      }
    } 
    fetchMessages()
  },[session])

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
    
    // Load notes from dummy data
    // const initialNotes = dummyUsers.flatMap(user => 
    //   user.messages.map((msg : UserMessageType) => ({
    //     id: msg.id,
    //     message: msg.content,
    //     isPublic: msg.isPublic,
    //     x: msg.x,
    //     y: msg.y,
    //     createdAt: msg.createdAt,
    //     userId: user.id
    //   }))
    // )
    
    // setNotes(initialNotes)
    
    return () => {
      window.removeEventListener('resize', updateViewportDimensions)
    }
  }, [])

  const addNote = (note: AllMessages) => {
    setMessages([...messages, note])
  }

  const updateNotePosition = (id: string, x: number, y: number) => {
    setMessages(
      messages.map((note) =>
        note.id === id ? { ...note, x, y } : note
      )
    )
  }

  const deleteNote = async(noteId:string) =>{
    
    const newMessages = messages.filter((message)=>message.id !== noteId);
    setMessages(newMessages)

    const response = await fetch('/api/messages',{
      body:JSON.stringify({id:noteId}),
      headers: {'Content-Type' : 'application/json'},
      method:"DELETE"
    })
    if(!response.ok){
      window.alert('Something went wrong while deleting Message');
    }
    const data = await response.json();
    setMessages(data);
  }

  // Calculate visible canvas dimensions
  const visibleArea = {
    width: Math.round(viewportDimensions.width / transform.scale),
    height: Math.round(viewportDimensions.height / transform.scale)
  }

  // Find user by note
 

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar 
        addNote={addNote}
        defaultX={CENTER_POINT} 
        defaultY={CENTER_POINT} 
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
          <div>Position: {Math.round(CENTER_POINT - transform.positionX/transform.scale)}, {Math.round(CENTER_POINT - transform.positionY/transform.scale)}</div>
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
              {messages.map((message) => {
                
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
                  />
                )
              })}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  )
}