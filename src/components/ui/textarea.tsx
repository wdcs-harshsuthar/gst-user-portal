import * as React from "react";

import { cn } from "./utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "resize-none placeholder:text-gray-400 flex field-sizing-content min-h-16 w-full rounded-lg",
        "border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-none",
        "focus:border-gray-400 focus:ring-0 transition-colors duration-150",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
        "md:text-sm",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
