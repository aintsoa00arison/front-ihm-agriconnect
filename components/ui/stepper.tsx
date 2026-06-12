import * as React from "react"
import { cn } from "@/lib/utils"

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: string[]
  currentStep: number // Index de l'étape active (commence à 1)
}

function Stepper({ steps, currentStep, className, ...props }: StepperProps) {
  return (
    <div className={cn("flex items-center justify-between px-1 sm:px-4 md:px-6 mb-4 mt-2 overflow-x-auto", className)} {...props}>
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <React.Fragment key={step}>
            {/* Rond de l'étape */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={cn(
                  "w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-bold shadow-sm transition-all duration-300",
                  isActive && "bg-primary text-white scale-105",
                  isCompleted && "bg-primary/20 text-primary",
                  !isActive && !isCompleted && "bg-separator text-label opacity-40"
                )}
              >
                {stepNumber}
              </div>
              
              {/* Label toujours visible avec taille très réduite sur mobile */}
              <span
                className={cn(
                  "text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] mt-0.5 xs:mt-1 transition-all duration-300 text-center max-w-[50px] xs:max-w-[60px] sm:max-w-none truncate xs:truncate-none",
                  isActive && "font-bold text-primary",
                  isCompleted && "font-medium text-primary/70",
                  !isActive && !isCompleted && "font-medium text-label opacity-60"
                )}
                title={step} // Tooltip pour voir le texte complet au survol
              >
                {step}
              </span>
            </div>

            {/* Trait de liaison (sauf après la dernière étape) */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-[1.5px] sm:h-[2px] mx-0.5 xs:mx-1 sm:mx-2 md:mx-4 -mt-2 xs:-mt-3 sm:-mt-4 transition-all duration-500 min-w-[10px] xs:min-w-[15px]",
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