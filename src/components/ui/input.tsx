import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "flex h-11 w-full min-w-0 rounded-lg border-2 border-gray-200 bg-background text-foreground px-4 py-3 text-base",
        "transition-all duration-200 ease-in-out outline-none",
        "hover:border-gray-300 hover:shadow-sm",
        "focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-md",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
        "file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:rounded file:px-2 file:mr-3",
        "file:hover:bg-gray-100 file:transition-colors",
        "aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/10",
        "md:text-sm md:h-10 md:py-2.5",
        className,
      )}
      {...props}
    />
  );
}

export { Input };