"use client"

import { Button } from "@/components/ui/button"

interface ButtonSelectProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  name: string
}

export function ButtonSelect({ options, value, onChange, name }: ButtonSelectProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => (
        <Button
          key={option}
          type="button"
          variant={value === option ? "default" : "outline"}
          className={`h-14 text-base ${
            value === option
              ? "bg-[#007BFF] text-white hover:bg-[#0056b3]"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#007BFF] hover:border-[#007BFF]"
          }`}
          onClick={() => onChange(option)}
          data-testid={`${name}-${option.toLowerCase().replace(/\s+/g, "-")}`}
        >
          {option}
        </Button>
      ))}
    </div>
  )
}
