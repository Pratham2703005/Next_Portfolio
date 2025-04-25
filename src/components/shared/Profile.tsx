"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { LogOut } from "lucide-react";

export default function Profile() {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center justify-center rounded-full overflow-hidden border-2 border-violet-500 transition-all hover:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
        onClick={() => setShowMenu(!showMenu)}
      >
        <div className="w-10 h-10 relative">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="Profile"
              width={40}
              height={40}
              className="object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-violet-600 flex items-center justify-center text-white text-lg font-medium">
              {session?.user?.name?.charAt(0) || "U"}
            </div>
          )}
        </div>
      </button>

      {showMenu && (
        <div className="absolute top-12 right-0 bg-gray-800 text-white rounded-lg shadow-xl py-2 w-48 z-50 overflow-hidden border border-gray-700 animate-fadeIn">
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="font-medium truncate">{session?.user?.name || "User"}</p>
            <p className="text-xs text-gray-400 truncate">{session?.user?.email || ""}</p>
          </div>
          
        
          
          <button 
            className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors text-red-400 flex items-center gap-2" 
            onClick={() => signOut()}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}