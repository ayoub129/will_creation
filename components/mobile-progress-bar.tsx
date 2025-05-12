export function MobileProgressBar({ currentStep, totalSteps, className = "" }) {
  const percentage = Math.round((currentStep / (totalSteps - 1)) * 100)

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-base font-medium text-[#007BFF]">{percentage}% Complete</span>
        </div>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="brand-progress-bar transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            animation: "pulse 2s infinite",
          }}
        />
      </div>
    </div>
  )
}
