"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from "lucide-react"

export function ComplexityCheck({ onContinue, onGetAdvice }) {
  const [complexFactors, setComplexFactors] = useState({
    overseas: false,
    business: false,
    trusts: false,
    complex: false,
  })

  const handleCheckboxChange = (factor) => {
    setComplexFactors((prev) => ({
      ...prev,
      [factor]: !prev[factor],
    }))
  }

  const hasComplexFactors = Object.values(complexFactors).some(Boolean)

  return (
    <Card className="border-amber-200 shadow-md">
      <CardHeader className="bg-amber-50 border-b border-amber-100">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-amber-100 p-2">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-amber-800">Estate Complexity Check</CardTitle>
            <CardDescription className="text-amber-700 mt-1">
              Please check if any of these apply to your situation
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <p className="mb-2">
          Our service is designed for straightforward wills. Please check any of the following that apply to you:
        </p>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="overseas"
              checked={complexFactors.overseas}
              onCheckedChange={() => handleCheckboxChange("overseas")}
            />
            <Label htmlFor="overseas" className="text-base">
              I own property or assets outside the UK
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="business"
              checked={complexFactors.business}
              onCheckedChange={() => handleCheckboxChange("business")}
            />
            <Label htmlFor="business" className="text-base">
              I own a business or have business interests
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="trusts"
              checked={complexFactors.trusts}
              onCheckedChange={() => handleCheckboxChange("trusts")}
            />
            <Label htmlFor="trusts" className="text-base">
              I am a beneficiary or trustee of a trust
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="complex"
              checked={complexFactors.complex}
              onCheckedChange={() => handleCheckboxChange("complex")}
            />
            <Label htmlFor="complex" className="text-base">
              My estate is worth over £1 million
            </Label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 border-t border-amber-100 pt-4 bg-amber-50/50">
        <Button
          variant="outline"
          className="w-full sm:w-auto border-amber-500 text-amber-700 hover:bg-amber-100"
          onClick={() => onContinue(complexFactors)}
        >
          Continue with basic will
        </Button>
        {hasComplexFactors && (
          <Button
            className="w-full sm:w-auto bg-[#007BFF] hover:bg-[#0056b3]"
            onClick={() => onGetAdvice(complexFactors)}
          >
            Get professional advice
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
