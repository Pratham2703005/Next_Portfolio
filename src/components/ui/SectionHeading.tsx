import { ReactNode } from "react";

export default function SectionHeading({ children }:{children:ReactNode}) {
  return (
    <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
      {children}
    </h2>
  )
}
