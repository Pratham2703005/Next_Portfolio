// components/Profile.tsx
"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Profile() {
  const {data: session}=useSession();
  
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div
      className="relative"
      onClick={()=>setShowMenu(!showMenu)}
    >
      <img
        src={session?.user?.image || "/default-avatar.png"}
        alt="Profile"
        className="w-10 h-10 rounded-full cursor-pointer border border-white/20"
      />
      {showMenu && (
        <div className="absolute top-12 right-0 bg-white text-black rounded-md shadow-lg py-2 w-40 z-50">
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Settings</button>
          
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={()=> signOut()} >Logout</button>
          
        </div>
      )}
    </div>
  );
}
