"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
export default function Profile() {
  const { data: session } = useSession();
    

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center rounded-full overflow-hidden border-2 border-violet-500 transition-all hover:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
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

    
    </div>
  );
}