/* eslint-disable no-unused-vars */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };
 
export function cnCard(...inputs) {
  return twMerge(clsx(inputs));
}
