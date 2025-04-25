// utils/noteSpacing.ts
import type { AllMessages } from "@/utils/type"

// Configuration for note spacing
const SPACING_CONFIG = {
  NOTE_WIDTH: 256, // w-64 = 16rem = 256px
  NOTE_HEIGHT: 180, // Estimated height based on content
  MIN_DISTANCE: 40, // Minimum distance between notes
  SEARCH_RADIUS: 300, // How far to search for an empty spot
  SPIRAL_STEP: 20, // Step size when searching in spiral pattern
}

/**
 * Check if two notes would overlap based on their positions
 */
export const wouldNotesOverlap = (
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number
): boolean => {
  const { NOTE_WIDTH, NOTE_HEIGHT, MIN_DISTANCE } = SPACING_CONFIG

  // Calculate the horizontal and vertical distances between the centers
  const dx = Math.abs(x1 - x2)
  const dy = Math.abs(y1 - y2)

  // Calculate minimum required distance to avoid overlap
  const requiredX = (NOTE_WIDTH + MIN_DISTANCE) / 2
  const requiredY = (NOTE_HEIGHT + MIN_DISTANCE) / 2

  // Check if the notes overlap
  return dx < requiredX && dy < requiredY
}

/**
 * Find the nearest available position for a new note
 */
export const findAvailablePosition = (
  desiredX: number, 
  desiredY: number, 
  existingNotes: AllMessages[]
): { x: number, y: number } => {
  // If no existing notes or empty array, return the desired position
  if (!existingNotes || existingNotes.length === 0) {
    return { x: desiredX, y: desiredY }
  }

  // Check if the desired position is available
  const isOverlapping = existingNotes.some(note => 
    wouldNotesOverlap(desiredX, desiredY, note.x, note.y)
  )

  // If not overlapping, return the desired position
  if (!isOverlapping) {
    return { x: desiredX, y: desiredY }
  }

  // Start spiral search for an available position
  const { SEARCH_RADIUS, SPIRAL_STEP } = SPACING_CONFIG
  
  // Spiral search pattern
  let angle = 0
  let radius = SPIRAL_STEP
  
  while (radius <= SEARCH_RADIUS) {
    // Calculate position in spiral
    const testX = Math.round(desiredX + radius * Math.cos(angle))
    const testY = Math.round(desiredY + radius * Math.sin(angle))
    
    // Check if this position overlaps with any existing note
    const hasOverlap = existingNotes.some(note => 
      wouldNotesOverlap(testX, testY, note.x, note.y)
    )
    
    if (!hasOverlap) {
      return { x: testX, y: testY }
    }
    
    // Move to next position in spiral
    angle += Math.PI / 4 // 45 degree steps
    if (angle >= 2 * Math.PI) {
      angle = 0
      radius += SPIRAL_STEP
    }
  }
  
  // If we couldn't find a spot in the search radius, return a position
  // far enough from the last checked note
  return { 
    x: desiredX + SEARCH_RADIUS, 
    y: desiredY + SEARCH_RADIUS 
  }
}

/**
 * Suggest a position for a new note that won't overlap with existing notes
 */
export const getSuggestedPosition = (
  desiredX: number, 
  desiredY: number, 
  existingNotes: AllMessages[]
): { x: number, y: number } => {
  return findAvailablePosition(desiredX, desiredY, existingNotes)
}