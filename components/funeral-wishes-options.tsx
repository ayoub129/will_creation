"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface FuneralWishesOptionsProps {
  value: string
  onChange: (value: string) => void
  onSkip: () => void
}

export function FuneralWishesOptions({ value, onChange, onSkip }: FuneralWishesOptionsProps) {
  const [customWishes, setCustomWishes] = useState(value || "")
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  // Common funeral wishes options
  const commonOptions = [
    "I wish to be cremated",
    "I wish to be buried",
    "I would like a religious ceremony",
    "I would like a non-religious ceremony",
    "I would like my ashes scattered",
    "I would like a simple/minimal ceremony",
    "I would like a celebration of life rather than a traditional funeral",
    "I would like specific music played at my funeral",
    "I would like donations to charity instead of flowers",
  ]

  // Handle selecting a pre-defined option
  const handleOptionSelect = (option: string) => {
    let newSelectedOptions: string[]

    if (selectedOptions.includes(option)) {
      // Remove the option if already selected
      newSelectedOptions = selectedOptions.filter((item) => item !== option)
    } else {
      // Add the option if not already selected
      newSelectedOptions = [...selectedOptions, option]
    }

    setSelectedOptions(newSelectedOptions)

    // Combine selected options with custom wishes
    const combinedWishes =
      [...newSelectedOptions, customWishes ? customWishes : ""].filter(Boolean).join(". ") + (customWishes ? "" : ".")

    onChange(combinedWishes)
  }

  // Handle custom wishes input
  const handleCustomWishesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCustomWishes = e.target.value
    setCustomWishes(newCustomWishes)

    // Combine selected options with new custom wishes
    const combinedWishes =
      [...selectedOptions, newCustomWishes ? newCustomWishes : ""].filter(Boolean).join(". ") +
      (newCustomWishes ? "" : ".")

    onChange(combinedWishes)
  }

  return (
    <div className="space-y-6">
      {/* Skip button */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-base">No specific funeral wishes?</h4>
            <p className="text-sm text-gray-600">
              You can skip this step if you don't have any specific funeral wishes
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            className="border-[#007BFF] text-[#007BFF] hover:bg-blue-50"
            data-testid="skip-funeral-wishes-button"
          >
            Skip this step
          </Button>
        </div>
      </div>

      {/* Common options */}
      <div className="space-y-3">
        <Label className="text-base">Common Funeral Wishes (Select any that apply)</Label>
        <div className="flex flex-col gap-3">
          {commonOptions.map((option) => (
            <Button
              key={option}
              type="button"
              variant={selectedOptions.includes(option) ? "default" : "outline"}
              className={`h-auto py-3 px-4 text-left justify-start ${
                selectedOptions.includes(option)
                  ? "bg-[#007BFF] text-white hover:bg-[#0056b3]"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#007BFF] hover:border-[#007BFF]"
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom wishes */}
      <div className="space-y-3">
        <Label htmlFor="customWishes" className="text-base">
          Additional Custom Wishes (Optional)
        </Label>
        <Textarea
          id="customWishes"
          value={customWishes}
          onChange={handleCustomWishesChange}
          placeholder="Add any other specific wishes here..."
          className="min-h-[120px] text-base"
        />
      </div>
    </div>
  )
}
