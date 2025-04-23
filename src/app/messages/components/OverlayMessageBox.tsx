import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import React from 'react'

const OverlayMessageBox = () => {
  return (
    <div className="absolute inset-0 z-10 backdrop-blur-sm bg-black/60 flex flex-col justify-center items-center p-4">
          <p className="mb-4 text-center text-white">Please sign in to post messages.</p>
          <Button
            onClick={() => signIn("github")}
            className="bg-[#8e2de2] hover:bg-[#4a00e0] text-white"
          >
            Sign in with GitHub
          </Button>
        </div>
  )
}

export default OverlayMessageBox
