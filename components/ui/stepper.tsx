import * as React from "react"
import { cn } from "@/lib/utils"

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: string[]
  currentStep: number // Index de l'étape active (commence à 1)
}

function Stepper({ steps, currentStep, className, ...props }: StepperProps) {
  return (
    <div className={cn("flex items-center justify-between px-6 mb-4 mt-2", className)} {...props}>
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <React.Fragment key={step}>
            {/* Rond de l'étape */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-300",
                  isActive && "bg-primary text-white scale-105",
                  isCompleted && "bg-primary/20 text-primary",
                  !isActive && !isCompleted && "bg-separator text-label opacity-40"
                )}
              >
                {stepNumber}
              </div>
              <span
                className={cn(
                  "text-[10px] mt-1 transition-all duration-300 whitespace-nowrap",
                  isActive && "font-bold text-primary",
                  isCompleted && "font-medium text-primary/70",
                  !isActive && !isCompleted && "font-medium text-label opacity-40"
                )}
              >
                {step}
              </span>
            </div>

            {/* Trait de liaison (sauf après la dernière étape) */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-[2px] mx-4 -mt-4 transition-all duration-500",
                  isCompleted ? "bg-primary" : "bg-separator/30"
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export { Stepper }