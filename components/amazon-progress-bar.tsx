import { Check } from "lucide-react"

interface AmazonProgressBarProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function AmazonProgressBar({ steps, currentStep, className = "" }: AmazonProgressBarProps) {
  return (
    <div className={`w-full mb-6 ${className}`}>
      <div className="relative flex justify-between">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-gray-200"></div>

        {/* Colored progress line with animation */}
        <div
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-[#007BFF] transition-all duration-700 ease-in-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              {/* Step circle with animation */}
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-[#007BFF] border-[#007BFF] text-white"
                      : isCurrent
                        ? "bg-white border-[#007BFF] text-[#007BFF] animate-pulse"
                        : "bg-white border-gray-300 text-gray-300"
                  }
                `}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-sm font-medium">{index + 1}</span>}
              </div>

              {/* Step label */}
              <span
                className={`
                  mt-2 text-xs font-medium text-center transition-all duration-300
                  ${isCompleted || isCurrent ? "text-[#007BFF]" : "text-gray-400"}
                  hidden sm:block
                `}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
