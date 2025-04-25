// sidebar.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import type { AllMessages } from "@/utils/type"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import OverlayMessageBox from "./components/OverlayMessageBox"
import useSWR from "swr"
import Image from "next/image"
import { getSuggestedPosition } from "@/utils/noteSpacing" // Import our new utility

interface SidebarProps {
  addNote: (note: AllMessages) => void
  defaultX: number
  defaultY: number
  existingNotes: AllMessages[] // Add this prop to pass existing notes
  updatePreviewNote: (previewData: {
    content: string;
    isPublic: boolean;
    x: number;
    y: number;
    isVisible: boolean;
    userName?: string;
    userImage?: string;
  }) => void
}

// SWR fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  return response.json()
}

const Sidebar = ({ addNote, defaultX, defaultY, existingNotes, updatePreviewNote }: SidebarProps) => {
  const { data: session } = useSession()
  const [message, setMessage] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [x, setX] = useState(defaultX)
  const [y, setY] = useState(defaultY)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [positionAdjusted, setPositionAdjusted] = useState(false)

  // Fetch user data with SWR
  const { data: user, error } = useSWR(
    session?.user?.email ? `/api/users?email=${encodeURIComponent(session.user.email)}` : null,
    fetcher
  )

  // Update coordinates when user interacts with the form
  const updateCoordinates = (newX: number, newY: number) => {
    setX(newX)
    setY(newY)
    
    // Check if these coordinates would overlap and suggest new ones
    if (existingNotes && existingNotes.length > 0) {
      const { x: suggestedX, y: suggestedY } = getSuggestedPosition(newX, newY, existingNotes)
      
      // If suggested position is different, update
      if (suggestedX !== newX || suggestedY !== newY) {
        setX(suggestedX)
        setY(suggestedY)
        setPositionAdjusted(true)
      } else {
        setPositionAdjusted(false)
      }
    }
    
    // Update preview note position
    if (user && message.trim()) {
      updatePreviewNote({
        content: message,
        isPublic,
        x: newX,
        y: newY,
        isVisible: true,
        userName: user.name,
        userImage: user.image
      })
    }
  }

  // Update preview note when content changes
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value
    setMessage(newMessage)
    
    // Only show preview if there's content
    const isVisible = newMessage.trim().length > 0
    
    // Update preview with new message
    if (user) {
      updatePreviewNote({
        content: newMessage,
        isPublic,
        x,
        y,
        isVisible,
        userName: user.name,
        userImage: user.image
      })
    }
  }
  
  // Update preview when privacy toggle changes
  const handlePrivacyToggle = () => {
    const newIsPublic = !isPublic
    setIsPublic(newIsPublic)
    
    // Update preview with new privacy setting
    if (user && message.trim()) {
      updatePreviewNote({
        content: message,
        isPublic: newIsPublic,
        x,
        y,
        isVisible: true,
        userName: user.name,
        userImage: user.image
      })
    }
  }

  // Effect to suggest non-overlapping position when component mounts
  useEffect(() => {
    if (existingNotes && existingNotes.length > 0) {
      const { x: suggestedX, y: suggestedY } = getSuggestedPosition(defaultX, defaultY, existingNotes)
      setX(suggestedX)
      setY(suggestedY)
      setPositionAdjusted(suggestedX !== defaultX || suggestedY !== defaultY)
    }
  }, [existingNotes, defaultX, defaultY])
  
  // Update preview when user data loads
  useEffect(() => {
    if (user && message.trim()) {
      updatePreviewNote({
        content: message,
        isPublic,
        x,
        y,
        isVisible: true,
        userName: user.name,
        userImage: user.image
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !user || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      if(user){
        // Get non-overlapping position one more time before submission
        const { x: finalX, y: finalY } = getSuggestedPosition(x, y, existingNotes)
        
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: message,
            isPublic,
            x: finalX, // Use calculated non-overlapping position
            y: finalY, // Use calculated non-overlapping position
            userId: user.id,
            user_name: user.name,
            user_image: user.image,
            user_email: user.email
          })
        })
        if (!response.ok) {
          throw new Error('Failed to create message')
        }
  
        const data = await response.json()
        addNote(data)
        setMessage("")
        
        // Hide preview after submission
        updatePreviewNote({
          content: "",
          isPublic,
          x: defaultX,
          y: defaultY,
          isVisible: false
        })
      }      
      setX(defaultX)
      setY(defaultY)
      setPositionAdjusted(false)
    } catch (error) {
      console.error('Error creating message:', error)
      window.alert('Something went wrong while creating message')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative w-80 h-full p-4 overflow-y-auto  border-r border-[#2b2b2b] shadow-[0_0_10px_#35184d] text-white">
      <h2 className="text-xl font-bold mb-4 text-white">Message Box</h2>

      {/* 🔒 Overlay if not logged in */}
      {!session && (
        <OverlayMessageBox />
      )}

      {/* Show loading state while fetching user data */}
      {session && !user && !error && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8e2de2]"></div>
        </div>
      )}

      {/* Show error state */}
      {error && (
        <div className="text-red-500 text-center p-4">
          Failed to load user data. Please refresh the page.
        </div>
      )}

      {/* 👇 Form content */}
      {session && user && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User info display */}
          <div className="flex items-center space-x-2 mb-4">
            {user.image && (
              <Image
                height={24}
                width={24}
                src={user.image} 
                alt={user.name || 'User'} 
                className="w-6 h-6 rounded-full"
              />
            )}
            <span className="text-sm text-zinc-300">Posting as {user.name}</span>
          </div>

          {/* Message textarea */}
          <div className="space-y-2">
            <Textarea
              id="message"
              placeholder="Enter your note..."
              value={message}
              onChange={handleMessageChange}
              className="min-h-[100px] text-white border border-[#333]"
              required
            />
          </div>

          {/* Toggle public/private */}
          <div className="flex items-center justify-between px-2 py-2 rounded-lg border border-[#333] hover:border-[#8e2de2] transition-all duration-300">
            <Label htmlFor="public-mode" className="text-zinc-300 flex items-center gap-2">
              <span className="text-sm">{isPublic ? "🌐 Public" : "🔒 Private"}</span>
            </Label>
            <button
              id="public-mode"
              type="button"
              onClick={handlePrivacyToggle}
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
                onChange={(e) => updateCoordinates(Number(e.target.value), y)}
                className="text-white border border-[#333]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="y-coord" className="text-sm text-zinc-300">Y</Label>
              <Input
                id="y-coord"
                type="number"
                value={y}
                onChange={(e) => updateCoordinates(x, Number(e.target.value))}
                className="text-white border border-[#333]"
              />
            </div>
          </div>

          {/* Position adjusted notice */}
          {positionAdjusted && (
            <div className="text-xs text-amber-300 px-2 py-1 bg-amber-900 bg-opacity-20 rounded-md">
              Position adjusted to avoid overlapping with existing notes
            </div>
          )}
          
          {/* Preview info message */}
          {message.trim() && (
            <div className="text-xs text-blue-300 px-2 py-1 bg-blue-900 bg-opacity-20 rounded-md">
              Your note preview is visible on the canvas
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting || !message.trim()} 
            className="w-full bg-[#8e2de2] hover:bg-[#4a00e0] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Adding...
              </span>
            ) : (
              "Add to Canvas"
            )}
          </Button>
        </form>
      )}
    </div>
  )
}

export default Sidebar