import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from './utils';

interface StepperStep {
  id: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface StepperProps {
  steps: StepperStep[];
  currentStep: string;
  completedSteps: Set<string>;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'compact' | 'minimal';
}

export function Stepper({
  steps,
  currentStep,
  completedSteps,
  className,
  orientation = 'horizontal',
  variant = 'default'
}: StepperProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const getStepStatus = (stepId: string, index: number) => {
    if (completedSteps.has(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    if (index < currentStepIndex) return 'completed';
    return 'upcoming';
  };

  if (variant === 'minimal') {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">
              Step {currentStepIndex + 1} of {steps.length}
            </h4>
            <p className="text-lg font-semibold text-gray-900">
              {steps[currentStepIndex]?.title}
            </p>
          </div>
          <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute top-2 left-0 w-full h-0.5 bg-gray-100 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id, index);
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 transition-all duration-300 relative z-10",
                      status === 'completed' && "bg-primary border-primary",
                      status === 'current' && "bg-primary border-primary shadow-lg shadow-primary/25",
                      status === 'upcoming' && "bg-white border-gray-300"
                    )}
                  >
                    {status === 'completed' && (
                      <CheckCircle2 className="w-3 h-3 text-white absolute -top-0.5 -left-0.5" />
                    )}
                  </div>
                  
                  <div className="mt-3 text-center max-w-[100px] hidden md:block">
                    <span
                      className={cn(
                        "text-xs transition-colors duration-200",
                        status === 'current' && "text-primary font-medium",
                        status === 'completed' && "text-gray-600",
                        status === 'upcoming' && "text-gray-400"
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (orientation === 'vertical') {
    return (
      <div className={cn("flex flex-col space-y-4", className)}>
        {steps.map((step, index) => {
          const status = getStepStatus(step.id, index);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-start">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                    status === 'completed' && "bg-primary border-primary text-primary-foreground",
                    status === 'current' && "bg-primary border-primary text-primary-foreground",
                    status === 'upcoming' && "bg-background border-gray-300 text-gray-500"
                  )}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : step.icon ? (
                    <step.icon className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-px h-8 mt-2 transition-colors",
                      status === 'completed' ? "bg-primary" : "bg-gray-300"
                    )}
                  />
                )}
              </div>
              <div className="ml-4 flex-1 pb-8">
                <h4
                  className={cn(
                    "text-sm font-medium transition-colors",
                    status === 'current' && "text-primary",
                    status === 'completed' && "text-foreground",
                    status === 'upcoming' && "text-gray-500"
                  )}
                >
                  {step.title}
                </h4>
                {step.description && variant !== 'compact' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <nav className={cn("w-full", className)} aria-label="Progress">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id, index);
          const isLast = index === steps.length - 1;

          return (
            <li key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200",
                    status === 'completed' && "bg-primary border-primary text-primary-foreground shadow-sm",
                    status === 'current' && "bg-primary border-primary text-primary-foreground shadow-lg scale-110",
                    status === 'upcoming' && "bg-background border-gray-300 text-gray-500"
                  )}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : step.icon ? (
                    <step.icon className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="mt-3 text-center max-w-[120px]">
                  <h4
                    className={cn(
                      "text-xs font-medium transition-colors leading-tight",
                      status === 'current' && "text-primary",
                      status === 'completed' && "text-foreground",
                      status === 'upcoming' && "text-gray-500"
                    )}
                  >
                    {step.title}
                  </h4>
                  {step.description && variant !== 'compact' && (
                    <p className="text-xs text-muted-foreground mt-1 leading-tight">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              {!isLast && (
                <div className="flex-1 px-2 pt-2">
                  <div
                    className={cn(
                      "h-0.5 w-full transition-colors duration-300",
                      status === 'completed' ? "bg-primary" : "bg-gray-300"
                    )}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export type { StepperStep, StepperProps };