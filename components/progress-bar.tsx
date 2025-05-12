export function ProgressBar({ currentStep, totalSteps, className = "" }) {
  const percentage = (currentStep / (totalSteps - 1)) * 100

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Start</span>
        <span>Review</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-[#007BFF] transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
