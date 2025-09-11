"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";

import { cn } from "./utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-4", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // Base styles
        "group relative h-5 w-5 shrink-0 rounded-full border-2 transition-all duration-200 ease-in-out",
        // Default state
        "border-gray-300 bg-white shadow-sm",
        // Hover state
        "hover:border-blue-400 hover:bg-blue-50 hover:shadow-md",
        // Focus state
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        // Checked state
        "data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600",
        "data-[state=checked]:shadow-md data-[state=checked]:hover:border-blue-700 data-[state=checked]:hover:bg-blue-700",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-white",
        // Invalid state
        "aria-invalid:border-red-500 aria-invalid:ring-red-200",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center h-full w-full"
      >
        <div className="h-2.5 w-2.5 rounded-full bg-white animate-in zoom-in-50 duration-200" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

// Enhanced Radio Card Component for better form experiences
const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    badge?: string;
  }
>(({ className, title, description, icon, badge, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "group relative flex cursor-pointer items-start space-x-4 rounded-lg border-2 bg-white p-4 transition-all duration-200 ease-in-out",
        "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-white",
        "data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-50 data-[state=checked]:shadow-md",
        "data-[state=checked]:ring-1 data-[state=checked]:ring-blue-600/20",
        className
      )}
      {...props}
    >
      <div className="flex h-5 w-5 items-center justify-center mt-0.5">
        <div className={cn(
          "h-5 w-5 rounded-full border-2 bg-white transition-all duration-200",
          "border-gray-300 group-hover:border-blue-400",
          "group-focus:ring-2 group-focus:ring-blue-500 group-focus:ring-offset-2",
          "group-data-[state=checked]:border-blue-600 group-data-[state=checked]:bg-blue-600"
        )}>
          <RadioGroupPrimitive.Indicator className="flex items-center justify-center h-full w-full">
            <div className="h-2.5 w-2.5 rounded-full bg-white animate-in zoom-in-50 duration-200" />
          </RadioGroupPrimitive.Indicator>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200",
                "text-gray-500 group-data-[state=checked]:text-blue-600"
              )}>
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h4 className={cn(
                  "font-medium transition-colors duration-200",
                  "text-gray-900 group-data-[state=checked]:text-blue-900"
                )}>
                  {title}
                </h4>
              )}
              {description && (
                <p className={cn(
                  "text-sm transition-colors duration-200 mt-1",
                  "text-gray-600 group-data-[state=checked]:text-blue-700"
                )}>
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {badge && (
            <span className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-200",
              "bg-gray-100 text-gray-800 group-data-[state=checked]:bg-blue-100 group-data-[state=checked]:text-blue-800"
            )}>
              {badge}
            </span>
          )}
        </div>
        
        {children && (
          <div className="mt-3">
            {children}
          </div>
        )}
      </div>
    </RadioGroupPrimitive.Item>
  );
});
RadioCard.displayName = "RadioCard";

// Simple Radio Option Component for inline choices
const RadioOption = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    label: string;
    description?: string;
  }
>(({ className, label, description, children, ...props }, ref) => {
  return (
    <label className="flex items-start space-x-3 cursor-pointer group">
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          "mt-0.5 h-5 w-5 rounded-full border-2 bg-white transition-all duration-200 ease-in-out",
          "border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:bg-white",
          "data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600",
          "data-[state=checked]:shadow-sm data-[state=checked]:hover:border-blue-700 data-[state=checked]:hover:bg-blue-700",
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center h-full w-full">
          <div className="h-2.5 w-2.5 rounded-full bg-white animate-in zoom-in-50 duration-200" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
          {label}
        </div>
        {description && (
          <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-500 transition-colors duration-200">
            {description}
          </p>
        )}
        {children && (
          <div className="mt-2">
            {children}
          </div>
        )}
      </div>
    </label>
  );
});
RadioOption.displayName = "RadioOption";

export { RadioGroup, RadioGroupItem, RadioCard, RadioOption };