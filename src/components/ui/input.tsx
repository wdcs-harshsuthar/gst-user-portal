import * as React from "react";

import { cn } from "./utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      data-slot="input"
      className={cn(
        "placeholder:text-gray-400 selection:bg-gray-200 selection:text-gray-900",
        "flex h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900",
        "transition-colors duration-150 ease-in-out outline-none",
        "hover:border-gray-400",
        "focus:border-gray-400 focus:ring-0",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
        "file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:rounded file:px-2 file:mr-3",
        "file:hover:bg-gray-100 file:transition-colors",
        "aria-invalid:border-red-500",
        "md:text-sm md:h-10 md:py-2.5",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };