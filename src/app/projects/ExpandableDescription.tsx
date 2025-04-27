'use client';

import { useState, useEffect } from "react";

interface ExpandableDescriptionProps {
  description: string;
}

export function ExpandableDescription({ description }: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const charLimit = isMobile ? 150 : 300;

  const handleToggle = () => setIsExpanded(!isExpanded);

  return (
    <p className="w-full text-sm mt-2 text-neutral-300 p-3 md:p-5">
      {isExpanded ? description : `${description.substring(0, charLimit)}...`}
      <span
        onClick={handleToggle}
        className="text-blue-500 hover:text-blue-400 ml-2 cursor-pointer"
      >
        {isExpanded ? "Read Less" : "Read More"}
      </span>
    </p>
  );
}
