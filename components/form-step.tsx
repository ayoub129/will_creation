"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  PlusCircle,
  Trash2,
  Calendar,
  Info,
  PoundSterlingIcon as Pound,
  Percent,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { ButtonSelect } from "./button-select"
import { FuneralWishesOptions } from "./funeral-wishes-options"
import { IdentityVerificationFlow } from "./identity-verification-flow"
import { Shield, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function FormStep({ step, formData, onChange, onDateOfBirthChange, onSkipStep }) {
  const [childInput, setChildInput] = useState({ name: "", age: "" })
  const [beneficiaryInput, setBeneficiaryInput] = useState({ name: "", relationship: "", percentage: "" })
  const [giftInput, setGiftInput] = useState({ item: "", recipient: "" })
  const [showVerificationFlow, setShowVerificationFlow] = useState(false)
  const [totalPercentage, setTotalPercentage] = useState(0)
  const [percentageError, setPercentageError] = useState("")
  const { toast } = useToast()

  // Calculate total percentage allocated whenever beneficiaries change
  useEffect(() => {
    if (formData.additionalBeneficiaries && formData.additionalBeneficiaries.length > 0) {
      const total = formData.additionalBeneficiaries.reduce((sum, beneficiary) => {
        return sum + (Number.parseInt(beneficiary.percentage) || 0)
      }, 0)

      // Add main beneficiary percentage if it exists
      const mainPercentage = formData.mainBeneficiary?.percentage
        ? Number.parseInt(formData.mainBeneficiary.percentage)
        : 0
      const calculatedTotal = total + mainPercentage

      setTotalPercentage(calculatedTotal)

      if (calculatedTotal > 100) {
        setPercentageError("Total allocation exceeds 100%")
      } else if (calculatedTotal < 100 && formData.additionalBeneficiaries.length > 0) {
        setPercentageError(`${100 - calculatedTotal}% still unallocated (you can continue and fix later)`)
      } else if (calculatedTotal === 100) {
        setPercentageError("")
      }
    } else if (formData.mainBeneficiary?.percentage) {
      const mainPercentage = Number.parseInt(formData.mainBeneficiary.percentage) || 0
      setTotalPercentage(mainPercentage)

      if (mainPercentage > 100) {
        setPercentageError("Total allocation exceeds 100%")
      } else if (mainPercentage < 100) {
        // If there are no additional beneficiaries, main beneficiary should get 100%
        setPercentageError(`${100 - mainPercentage}% still unallocated (you can continue and fix later)`)
      } else if (mainPercentage === 100) {
        setPercentageError("")
      }
    } else {
      setTotalPercentage(0)
      setPercentageError("")
    }
  }, [formData.additionalBeneficiaries, formData.mainBeneficiary])

  // Add custom styles for Amazon-style dropdowns
  const amazonSelectStyle = `
  h-14 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-base 
  ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
  hover:border-[#007BFF] cursor-pointer
`

  // Add a hover effect for the dropdown arrow
  const amazonArrowStyle = `
  pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500
  group-hover:text-[#007BFF]
`

  // Generate arrays for date dropdowns
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 99 + i)

  const handleChange = (e) => {
    const { name, value } = e.target
    onChange(name, value)
  }

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target

    // Remove non-numeric characters except for the pound sign
    let numericValue = value.replace(/[^0-9£,.]/g, "")

    // Remove existing pound sign and commas to work with clean number
    numericValue = numericValue.replace(/£/g, "").replace(/,/g, "")

    // If it's empty after cleaning, just set to pound sign
    if (!numericValue) {
      onChange(name, "£")
      return
    }

    // Format the number with commas for thousands
    const formattedNumber = new Intl.NumberFormat("en-GB").format(Number.parseFloat(numericValue))

    // Add pound sign back
    const formattedValue = `£${formattedNumber}`

    // Handle special case for decimal input
    if (value.endsWith(".")) {
      onChange(name, `£${numericValue}.`)
    } else if (value.includes(".")) {
      // Handle decimal places correctly
      const parts = numericValue.split(".")
      const wholeNumber = new Intl.NumberFormat("en-GB").format(Number.parseFloat(parts[0]))
      onChange(name, `£${wholeNumber}.${parts[1]}`)
    } else {
      // Normal case - just the formatted value
      onChange(name, formattedValue)
    }
  }

  const handlePercentageChange = (e, id = null) => {
    const { value } = e.target

    // Only allow numbers between 0-100
    let numericValue = value.replace(/[^0-9]/g, "")

    // If empty, treat as 0
    const newPercentage = numericValue === "" ? 0 : Number.parseInt(numericValue)

    // Calculate what the new total would be
    let newTotal = 0

    if (id === null) {
      // For main beneficiary
      // Calculate total from additional beneficiaries
      if (formData.additionalBeneficiaries) {
        newTotal = formData.additionalBeneficiaries.reduce((sum, ben) => {
          return sum + (Number.parseInt(ben.percentage) || 0)
        }, 0)
      }

      // Add the new value
      newTotal += newPercentage

      // If total would exceed 100%, cap the value
      if (newTotal > 100) {
        // Calculate the maximum allowed value
        const maxAllowed = 100 - (newTotal - newPercentage)
        numericValue = maxAllowed.toString()

        toast({
          title: "Maximum allocation reached",
          description: `Value adjusted to ${maxAllowed}% to prevent exceeding 100% total.`,
          variant: "warning",
        })
      }

      // Update main beneficiary
      const updatedMainBeneficiary = {
        ...formData.mainBeneficiary,
        percentage: numericValue,
      }
      onChange("mainBeneficiary", updatedMainBeneficiary)
    } else {
      // For additional beneficiaries
      // Find the current percentage of the beneficiary being updated
      let currentBeneficiaryPercentage = 0
      if (formData.additionalBeneficiaries) {
        const currentBeneficiary = formData.additionalBeneficiaries.find((b) => b.id === id)
        if (currentBeneficiary) {
          currentBeneficiaryPercentage = Number.parseInt(currentBeneficiary.percentage) || 0
        }
      }

      // Calculate total from all beneficiaries except the one being updated
      const mainPercentage = formData.mainBeneficiary?.percentage
        ? Number.parseInt(formData.mainBeneficiary.percentage)
        : 0

      newTotal = mainPercentage

      if (formData.additionalBeneficiaries) {
        formData.additionalBeneficiaries.forEach((ben) => {
          if (ben.id !== id) {
            newTotal += Number.parseInt(ben.percentage) || 0
          }
        })
      }

      // Add the new value
      newTotal += newPercentage

      // If total would exceed 100%, cap the value
      if (newTotal > 100) {
        // Calculate the maximum allowed value
        const maxAllowed = 100 - (newTotal - newPercentage)
        numericValue = maxAllowed.toString()

        toast({
          title: "Maximum allocation reached",
          description: `Value adjusted to ${maxAllowed}% to prevent exceeding 100% total.`,
          variant: "warning",
        })
      }

      // Update the beneficiary
      const updatedBeneficiaries = formData.additionalBeneficiaries.map((beneficiary) => {
        if (beneficiary.id === id) {
          return { ...beneficiary, percentage: numericValue }
        }
        return beneficiary
      })
      onChange("additionalBeneficiaries", updatedBeneficiaries)
    }
  }

  const handleSelectChange = (name, value) => {
    onChange(name, value)
  }

  const handleCheckboxChange = (name, checked) => {
    if (name === "verifyIdentity" && checked) {
      setShowVerificationFlow(true)
    } else {
      onChange(name, checked)
    }
  }

  const handleChildChange = (field, value) => {
    setChildInput((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleBeneficiaryChange = (field, value) => {
    if (field === "percentage") {
      // Only allow numbers between 0-100
      value = value.replace(/[^0-9]/g, "")
      if (value && Number.parseInt(value) > 100) {
        value = "100"
      }
    }

    setBeneficiaryInput((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleGiftChange = (field, value) => {
    setGiftInput((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleVerificationComplete = (verified) => {
    setShowVerificationFlow(false)
    onChange("verifyIdentity", verified)
  }

  const handleVerificationSkip = () => {
    setShowVerificationFlow(false)
    onSkipStep()
  }

  const addChild = () => {
    if (childInput.name) {
      const newChildren = [...(formData.children || []), { ...childInput, id: Date.now() }]
      onChange("children", newChildren)
      setChildInput({ name: "", age: "" })
    }
  }

  const removeChild = (id) => {
    const newChildren = formData.children.filter((c) => c.id !== id)
    onChange("children", newChildren)
  }

  const addBeneficiary = () => {
    if (beneficiaryInput.name && beneficiaryInput.relationship) {
      // Calculate the current total allocation
      let currentTotal = 0

      if (formData.mainBeneficiary?.percentage) {
        currentTotal += Number.parseInt(formData.mainBeneficiary.percentage) || 0
      }

      if (formData.additionalBeneficiaries) {
        formData.additionalBeneficiaries.forEach((ben) => {
          currentTotal += Number.parseInt(ben.percentage) || 0
        })
      }

      // Calculate a default percentage for the new beneficiary
      let defaultPercentage = ""

      // If there's room, suggest an allocation
      if (currentTotal < 100) {
        // If this is the first additional beneficiary, suggest a 50/50 split
        if (!formData.additionalBeneficiaries || formData.additionalBeneficiaries.length === 0) {
          // Adjust main beneficiary to 50%
          const updatedMainBeneficiary = {
            ...formData.mainBeneficiary,
            percentage: "50",
          }
          onChange("mainBeneficiary", updatedMainBeneficiary)

          // Set new beneficiary to 50%
          defaultPercentage = "50"
        } else {
          // Otherwise, give them the remaining percentage
          defaultPercentage = (100 - currentTotal).toString()
        }
      } else if (currentTotal === 100) {
        // If already at 100%, suggest 0% and show a toast
        defaultPercentage = "0"
        toast({
          title: "Allocation already at 100%",
          description: "New beneficiary added with 0%. Adjust percentages to include them in your estate.",
          variant: "info",
        })
      }

      // Use the input percentage if provided, otherwise use our calculated default
      const percentage = beneficiaryInput.percentage || defaultPercentage

      const newBeneficiaries = [
        ...(formData.additionalBeneficiaries || []),
        { ...beneficiaryInput, percentage, id: Date.now() },
      ]

      onChange("additionalBeneficiaries", newBeneficiaries)
      setBeneficiaryInput({ name: "", relationship: "", percentage: "" })
    }
  }

  const removeBeneficiary = (id) => {
    const newBeneficiaries = formData.additionalBeneficiaries.filter((b) => b.id !== id)
    onChange("additionalBeneficiaries", newBeneficiaries)
  }

  const distributeRemaining = () => {
    if (!formData.additionalBeneficiaries || formData.additionalBeneficiaries.length === 0) {
      // If there are no additional beneficiaries, set main beneficiary to 100%
      const updatedMainBeneficiary = {
        ...formData.mainBeneficiary,
        percentage: "100",
      }
      onChange("mainBeneficiary", updatedMainBeneficiary)
      return
    }

    const remaining = 100 - totalPercentage
    if (remaining <= 0) return

    const beneficiaryCount = formData.additionalBeneficiaries.length
    const sharePerBeneficiary = Math.floor(remaining / beneficiaryCount)
    const extraShare = remaining % beneficiaryCount

    const updatedBeneficiaries = formData.additionalBeneficiaries.map((beneficiary, index) => {
      const currentPercentage = Number.parseInt(beneficiary.percentage) || 0
      let additionalShare = sharePerBeneficiary

      // Give the extra share to the first beneficiary
      if (index === 0) {
        additionalShare += extraShare
      }

      return {
        ...beneficiary,
        percentage: (currentPercentage + additionalShare).toString(),
      }
    })

    onChange("additionalBeneficiaries", updatedBeneficiaries)
  }

  const equallyDistribute = () => {
    const beneficiaryCount = (formData.additionalBeneficiaries?.length || 0) + 1 // +1 for main beneficiary
    if (beneficiaryCount <= 1) {
      // If there's only the main beneficiary, set to 100%
      const updatedMainBeneficiary = {
        ...formData.mainBeneficiary,
        percentage: "100",
      }
      onChange("mainBeneficiary", updatedMainBeneficiary)
      return
    }

    const sharePerBeneficiary = Math.floor(100 / beneficiaryCount)
    const extraShare = 100 % beneficiaryCount

    // Update main beneficiary
    const updatedMainBeneficiary = {
      ...formData.mainBeneficiary,
      percentage: (sharePerBeneficiary + extraShare).toString(), // Give extra to main beneficiary
    }
    onChange("mainBeneficiary", updatedMainBeneficiary)

    // Update additional beneficiaries
    if (formData.additionalBeneficiaries && formData.additionalBeneficiaries.length > 0) {
      const updatedBeneficiaries = formData.additionalBeneficiaries.map((beneficiary) => {
        return {
          ...beneficiary,
          percentage: sharePerBeneficiary.toString(),
        }
      })
      onChange("additionalBeneficiaries", updatedBeneficiaries)
    }
  }

  // New preset distribution functions
  const applyPresetDistribution = (preset) => {
    const totalBeneficiaries = (formData.additionalBeneficiaries?.length || 0) + 1 // +1 for main beneficiary

    // Check if we have enough beneficiaries for this preset
    if (preset === "50-50" && totalBeneficiaries < 2) {
      toast({
        title: "Not enough beneficiaries",
        description: "You need at least 2 beneficiaries for a 50/50 split.",
        variant: "destructive",
      })
      return
    }

    if (preset === "33-33-33" && totalBeneficiaries < 3) {
      toast({
        title: "Not enough beneficiaries",
        description: "You need at least 3 beneficiaries for a 33/33/33 split.",
        variant: "destructive",
      })
      return
    }

    if (preset === "25-25-25-25" && totalBeneficiaries < 4) {
      toast({
        title: "Not enough beneficiaries",
        description: "You need at least 4 beneficiaries for a 25/25/25/25 split.",
        variant: "destructive",
      })
      return
    }

    // Apply the preset distribution
    if (preset === "50-50") {
      // 50/50 split between main beneficiary and first additional beneficiary
      const updatedMainBeneficiary = {
        ...formData.mainBeneficiary,
        percentage: "50",
      }
      onChange("mainBeneficiary", updatedMainBeneficiary)

      if (formData.additionalBeneficiaries && formData.additionalBeneficiaries.length > 0) {
        const updatedBeneficiaries = [...formData.additionalBeneficiaries]

        // Set first beneficiary to 50%
        updatedBeneficiaries[0] = {
          ...updatedBeneficiaries[0],
          percentage: "50",
        }

        // Set all others to 0%
        for (let i = 1; i < updatedBeneficiaries.length; i++) {
          updatedBeneficiaries[i] = {
            ...updatedBeneficiaries[i],
            percentage: "0",
          }
        }

        onChange("additionalBeneficiaries", updatedBeneficiaries)
      }

      toast({
        title: "Applied 50/50 split",
        description: "Estate split equally between main beneficiary and first additional beneficiary.",
      })
    } else if (preset === "33-33-33") {
      // 33/33/33 split between main beneficiary and first two additional beneficiaries
      const updatedMainBeneficiary = {
        ...formData.mainBeneficiary,
        percentage: "34", // Give the extra 1% to main beneficiary
      }
      onChange("mainBeneficiary", updatedMainBeneficiary)

      if (formData.additionalBeneficiaries && formData.additionalBeneficiaries.length > 1) {
        const updatedBeneficiaries = [...formData.additionalBeneficiaries]

        // Set first two beneficiaries to 33%
        updatedBeneficiaries[0] = {
          ...updatedBeneficiaries[0],
          percentage: "33",
        }

        updatedBeneficiaries[1] = {
          ...updatedBeneficiaries[1],
          percentage: "33",
        }

        // Set all others to 0%
        for (let i = 2; i < updatedBeneficiaries.length; i++) {
          updatedBeneficiaries[i] = {
            ...updatedBeneficiaries[i],
            percentage: "0",
          }
        }

        onChange("additionalBeneficiaries", updatedBeneficiaries)
      }

      toast({
        title: "Applied 33/33/33 split",
        description: "Estate split equally between main beneficiary and first two additional beneficiaries.",
      })
    } else if (preset === "25-25-25-25") {
      // 25/25/25/25 split between main beneficiary and first three additional beneficiaries
      const updatedMainBeneficiary = {
        ...formData.mainBeneficiary,
        percentage: "25",
      }
      onChange("mainBeneficiary", updatedMainBeneficiary)

      if (formData.additionalBeneficiaries && formData.additionalBeneficiaries.length > 2) {
        const updatedBeneficiaries = [...formData.additionalBeneficiaries]

        // Set first three beneficiaries to 25%
        updatedBeneficiaries[0] = {
          ...updatedBeneficiaries[0],
          percentage: "25",
        }

        updatedBeneficiaries[1] = {
          ...updatedBeneficiaries[1],
          percentage: "25",
        }

        updatedBeneficiaries[2] = {
          ...updatedBeneficiaries[2],
          percentage: "25",
        }

        // Set all others to 0%
        for (let i = 3; i < updatedBeneficiaries.length; i++) {
          updatedBeneficiaries[i] = {
            ...updatedBeneficiaries[i],
            percentage: "0",
          }
        }

        onChange("additionalBeneficiaries", updatedBeneficiaries)
      }

      toast({
        title: "Applied 25/25/25/25 split",
        description: "Estate split equally between main beneficiary and first three additional beneficiaries.",
      })
    } else if (preset === "60-40") {
      // 60/40 split between main beneficiary and first additional beneficiary
      const updatedMainBeneficiary = {
        ...formData.mainBeneficiary,
        percentage: "60",
      }
      onChange("mainBeneficiary", updatedMainBeneficiary)

      if (formData.additionalBeneficiaries && formData.additionalBeneficiaries.length > 0) {
        const updatedBeneficiaries = [...formData.additionalBeneficiaries]

        // Set first beneficiary to 40%
        updatedBeneficiaries[0] = {
          ...updatedBeneficiaries[0],
          percentage: "40",
        }

        // Set all others to 0%
        for (let i = 1; i < updatedBeneficiaries.length; i++) {
          updatedBeneficiaries[i] = {
            ...updatedBeneficiaries[i],
            percentage: "0",
          }
        }

        onChange("additionalBeneficiaries", updatedBeneficiaries)
      }

      toast({
        title: "Applied 60/40 split",
        description: "Estate split 60% to main beneficiary and 40% to first additional beneficiary.",
      })
    } else if (preset === "70-30") {
      // 70/30 split between main beneficiary and first additional beneficiary
      const updatedMainBeneficiary = {
        ...formData.mainBeneficiary,
        percentage: "70",
      }
      onChange("mainBeneficiary", updatedMainBeneficiary)

      if (formData.additionalBeneficiaries && formData.additionalBeneficiaries.length > 0) {
        const updatedBeneficiaries = [...formData.additionalBeneficiaries]

        // Set first beneficiary to 30%
        updatedBeneficiaries[0] = {
          ...updatedBeneficiaries[0],
          percentage: "30",
        }

        // Set all others to 0%
        for (let i = 1; i < updatedBeneficiaries.length; i++) {
          updatedBeneficiaries[i] = {
            ...updatedBeneficiaries[i],
            percentage: "0",
          }
        }

        onChange("additionalBeneficiaries", updatedBeneficiaries)
      }

      toast({
        title: "Applied 70/30 split",
        description: "Estate split 70% to main beneficiary and 30% to first additional beneficiary.",
      })
    } else if (preset === "80-20") {
      // 80/20 split between main beneficiary and first additional beneficiary
      const updatedMainBeneficiary = {
        ...formData.mainBeneficiary,
        percentage: "80",
      }
      onChange("mainBeneficiary", updatedMainBeneficiary)

      if (formData.additionalBeneficiaries && formData.additionalBeneficiaries.length > 0) {
        const updatedBeneficiaries = [...formData.additionalBeneficiaries]

        // Set first beneficiary to 20%
        updatedBeneficiaries[0] = {
          ...updatedBeneficiaries[0],
          percentage: "20",
        }

        // Set all others to 0%
        for (let i = 1; i < updatedBeneficiaries.length; i++) {
          updatedBeneficiaries[i] = {
            ...updatedBeneficiaries[i],
            percentage: "0",
          }
        }

        onChange("additionalBeneficiaries", updatedBeneficiaries)
      }

      toast({
        title: "Applied 80/20 split",
        description: "Estate split 80% to main beneficiary and 20% to first additional beneficiary.",
      })
    }
  }

  const addGift = () => {
    if (giftInput.item && giftInput.recipient) {
      const newGifts = [...(formData.specificGifts || []), { ...giftInput, id: Date.now() }]
      onChange("specificGifts", newGifts)
      setGiftInput({ item: "", recipient: "" })
    }
  }

  const removeGift = (id) => {
    const newGifts = formData.specificGifts.filter((g) => g.id !== id)
    onChange("specificGifts", newGifts)
  }

  const handleSkipFuneralWishes = () => {
    onChange("funeralWishes", "")
    onSkipStep()
  }

  const handleLegalConfirmation = (name) => {
    onChange(name, true)
    toast({
      title: "Legal requirements confirmed",
      description: "You have confirmed you meet all legal requirements for creating a valid will.",
    })
  }

  // If showing verification flow, render that instead of the normal form
  if (showVerificationFlow) {
    return <IdentityVerificationFlow onComplete={handleVerificationComplete} onSkip={handleVerificationSkip} />
  }

  // Helper function to check if a field has a skip option
  const hasSkipOption = (field) => {
    return field.skipOption && field.skipOption.show
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{step.title}</h2>
        <p className="text-gray-600">{step.description}</p>
      </div>

      <div className="space-y-6">
        {step.fields.map((field) => (
          <div key={field.name} className="space-y-3">
            {field.type === "text" && (
              <>
                <Label htmlFor={field.name} className="text-base flex items-center gap-2">
                  {field.label}
                  {field.required ? (
                    <span className="text-red-500">*</span>
                  ) : field.type === "email" || field.type === "tel" ? (
                    <span className="text-xs text-gray-500">(Optional)</span>
                  ) : null}
                  {field.tooltip && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{field.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Label>
                {/* Add skip button for backup executor */}
                {field.name === "backupExecutor.name" && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-base">No backup executor?</h4>
                        <p className="text-sm text-gray-600">
                          You can skip this step if you don't want to add a backup executor
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onSkipStep}
                        className="border-[#007BFF] text-[#007BFF] hover:bg-blue-50"
                        data-testid="skip-backup-executor-button"
                      >
                        Skip this step
                      </Button>
                    </div>
                  </div>
                )}
                <Input
                  id={field.name}
                  name={field.name}
                  value={
                    field.name.includes(".")
                      ? formData[field.name.split(".")[0]]?.[field.name.split(".")[1]] || ""
                      : formData[field.name] || ""
                  }
                  onChange={handleChange}
                  required={field.required}
                  placeholder={field.placeholder || ""}
                  className="h-14 text-base"
                />
              </>
            )}

            {field.type === "currency" && (
              <>
                <Label htmlFor={field.name} className="text-base flex items-center gap-2">
                  {field.label}
                  {field.required ? (
                    <span className="text-red-500">*</span>
                  ) : field.type === "email" || field.type === "tel" ? (
                    <span className="text-xs text-gray-500">(Optional)</span>
                  ) : null}
                  {field.tooltip && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{field.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || "£"}
                    onChange={handleCurrencyChange}
                    required={field.required}
                    placeholder={field.placeholder || "£0"}
                    className="h-14 text-base pl-12"
                  />
                  <Pound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
              </>
            )}

            {field.type === "email" && (
              <>
                <Label htmlFor={field.name} className="text-base flex items-center gap-2">
                  {field.label}
                  {field.required ? (
                    <span className="text-red-500">*</span>
                  ) : field.type === "email" || field.type === "tel" ? (
                    <span className="text-xs text-gray-500">(Optional)</span>
                  ) : null}
                  {field.tooltip && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{field.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={
                    field.name.includes(".")
                      ? formData[field.name.split(".")[0]]?.[field.name.split(".")[1]] || ""
                      : formData[field.name] || ""
                  }
                  onChange={handleChange}
                  required={field.required}
                  placeholder={field.placeholder || ""}
                  className="h-14 text-base"
                />
                {/* Add notification clarification for executor email */}
                {(field.name === "primaryExecutor.email" || field.name === "backupExecutor.email") && (
                  <p className="text-xs text-gray-500 mt-1">
                    This is for your records only. Your executor will not be notified.
                  </p>
                )}
              </>
            )}

            {field.type === "tel" && (
              <>
                <Label htmlFor={field.name} className="text-base flex items-center gap-2">
                  {field.label}
                  {field.required ? (
                    <span className="text-red-500">*</span>
                  ) : field.type === "email" || field.type === "tel" ? (
                    <span className="text-xs text-gray-500">(Optional)</span>
                  ) : null}
                  {field.tooltip && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{field.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="tel"
                  value={
                    field.name.includes(".")
                      ? formData[field.name.split(".")[0]]?.[field.name.split(".")[1]] || ""
                      : formData[field.name] || ""
                  }
                  onChange={handleChange}
                  required={field.required}
                  placeholder={field.placeholder || ""}
                  className="h-14 text-base"
                />
                {/* Add notification clarification for executor phone */}
                {(field.name === "primaryExecutor.phone" || field.name === "backupExecutor.phone") && (
                  <p className="text-xs text-gray-500 mt-1">
                    This is for your records only. Your executor will not be contacted.
                  </p>
                )}
              </>
            )}

            {field.type === "date" && (
              <>
                <Label htmlFor={field.name} className="text-base">
                  {field.label}
                  {field.required ? (
                    <span className="text-red-500">*</span>
                  ) : field.type === "email" || field.type === "tel" ? (
                    <span className="text-xs text-gray-500">(Optional)</span>
                  ) : null}
                </Label>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type="date"
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                    className="h-14 text-base pl-12"
                  />
                  <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
              </>
            )}

            {field.type === "address-fields" && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="addressLine1" className="text-base">
                    Address Line 1
                    {field.required ? (
                      <span className="text-red-500">*</span>
                    ) : field.type === "email" || field.type === "tel" ? (
                      <span className="text-xs text-gray-500">(Optional)</span>
                    ) : null}
                  </Label>
                  <Input
                    id="addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1 || ""}
                    onChange={handleChange}
                    required={field.required}
                    placeholder="House number and street"
                    className="h-14 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="addressLine2" className="text-base">
                    Address Line 2
                  </Label>
                  <Input
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2 || ""}
                    onChange={handleChange}
                    placeholder="Apartment, suite, unit, etc. (optional)"
                    className="h-14 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="city" className="text-base">
                    Town/City
                    {field.required ? (
                      <span className="text-red-500">*</span>
                    ) : field.type === "email" || field.type === "tel" ? (
                      <span className="text-xs text-gray-500">(Optional)</span>
                    ) : null}
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                    required={field.required}
                    placeholder="Town or city"
                    className="h-14 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="postcode" className="text-base">
                    Postcode
                    {field.required ? (
                      <span className="text-red-500">*</span>
                    ) : field.type === "email" || field.type === "tel" ? (
                      <span className="text-xs text-gray-500">(Optional)</span>
                    ) : null}
                  </Label>
                  <Input
                    id="postcode"
                    name="postcode"
                    value={formData.postcode || ""}
                    onChange={handleChange}
                    required={field.required}
                    placeholder="e.g. SW1A 1AA"
                    className="h-14 text-base uppercase"
                  />
                </div>
              </div>
            )}

            {field.type === "textarea" && field.name === "funeralWishes" ? (
              <FuneralWishesOptions
                value={formData[field.name] || ""}
                onChange={(value) => onChange(field.name, value)}
                onSkip={handleSkipFuneralWishes}
              />
            ) : (
              field.type === "textarea" && (
                <>
                  <Label htmlFor={field.name} className="text-base">
                    {field.label}
                    {field.required ? (
                      <span className="text-red-500">*</span>
                    ) : field.type === "email" || field.type === "tel" ? (
                      <span className="text-xs text-gray-500">(Optional)</span>
                    ) : null}
                  </Label>

                  {/* Add skip button for textarea fields with skip option */}
                  {hasSkipOption(field) && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-base">
                            No {field.name === "petCare" ? "pets" : "digital assets"}?
                          </h4>
                          <p className="text-sm text-gray-600">
                            You can skip this step if{" "}
                            {field.name === "petCare"
                              ? "you don't have any pets"
                              : "you don't have digital assets to manage"}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={onSkipStep}
                          className="border-[#007BFF] text-[#007BFF] hover:bg-blue-50"
                          data-testid={`skip-${field.name}-button`}
                        >
                          Skip this step
                        </Button>
                      </div>
                    </div>
                  )}

                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                    placeholder={field.placeholder || ""}
                    className="min-h-[120px] text-base"
                  />
                </>
              )
            )}

            {field.type === "select" && (
              <>
                <Label htmlFor={field.name} className="text-base">
                  {field.label}
                  {field.required ? (
                    <span className="text-red-500">*</span>
                  ) : field.type === "email" || field.type === "tel" ? (
                    <span className="text-xs text-gray-500">(Optional)</span>
                  ) : null}
                </Label>
                {field.name === "maritalStatus" ? (
                  <ButtonSelect
                    name={field.name}
                    options={field.options}
                    value={formData[field.name] || ""}
                    onChange={(value) => handleSelectChange(field.name, value)}
                  />
                ) : field.name === "primaryExecutor.relationship" ||
                  field.name === "backupExecutor.relationship" ||
                  field.name === "mainBeneficiary.relationship" ? (
                  <ButtonSelect
                    name={field.name}
                    options={field.options}
                    value={
                      field.name.includes(".")
                        ? formData[field.name.split(".")[0]]?.[field.name.split(".")[1]] || ""
                        : formData[field.name] || ""
                    }
                    onChange={(value) => handleSelectChange(field.name, value)}
                  />
                ) : (
                  <Select
                    value={
                      field.name.includes(".")
                        ? formData[field.name.split(".")[0]]?.[field.name.split(".")[1]] || ""
                        : formData[field.name] || ""
                    }
                    onValueChange={(value) => handleSelectChange(field.name, value)}
                  >
                    <SelectTrigger id={field.name} className="h-14 text-base">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option} value={option} className="text-base">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </>
            )}

            {field.type === "checkbox" && field.name !== "legalDeclaration" && (
              <div className="flex flex-col space-y-4">
                {/* Add skip button for identity verification */}
                {hasSkipOption(field) && field.name === "verifyIdentity" && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-base">Skip verification?</h4>
                        <p className="text-sm text-gray-600">
                          Identity verification is optional but adds extra security to your will
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onSkipStep}
                        className="border-[#007BFF] text-[#007BFF] hover:bg-blue-50"
                        data-testid="skip-verification-button"
                      >
                        Skip this step
                      </Button>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={field.name}
                    checked={formData[field.name] || false}
                    onCheckedChange={(checked) => handleCheckboxChange(field.name, checked)}
                  />
                  <Label htmlFor={field.name} className="text-base">
                    {field.label}
                    {field.required ? (
                      <span className="text-red-500">*</span>
                    ) : field.type === "email" || field.type === "tel" ? (
                      <span className="text-xs text-gray-500">(Optional)</span>
                    ) : null}
                  </Label>
                </div>
              </div>
            )}

            {field.type === "legal-confirmation" && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-medium text-blue-800 text-lg">Legal Requirements</h3>
                      <ul className="mt-3 space-y-2 text-blue-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>You must be 18+ years old and of sound mind</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>You must sign your will with two witnesses present</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>Your witnesses must sign it in your presence</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>Witnesses cannot be beneficiaries or their spouses</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-full h-14 brand-button text-base flex items-center justify-center gap-2"
                  onClick={() => handleLegalConfirmation(field.name)}
                  disabled={formData[field.name]}
                >
                  {formData[field.name] ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Confirmed</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5" />
                      <span>I confirm I meet all legal requirements</span>
                    </>
                  )}
                </Button>

                {formData[field.name] && (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-green-700">You have confirmed you meet all legal requirements</p>
                  </div>
                )}
              </div>
            )}

            {field.type === "verification-button" && (
              <div className="space-y-6">
                {/* Add skip button for identity verification */}
                {hasSkipOption(field) && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-base">Skip verification?</h4>
                        <p className="text-sm text-gray-600">
                          Identity verification is optional but adds extra security to your will
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onSkipStep}
                        className="border-[#007BFF] text-[#007BFF] hover:bg-blue-50"
                        data-testid="skip-verification-button"
                      >
                        Skip this step
                      </Button>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mb-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-medium text-blue-800 text-lg">Why Verify Your Identity?</h3>
                      <p className="mt-2 text-blue-700">
                        Identity verification adds an extra layer of security to your will, helping to:
                      </p>
                      <ul className="mt-3 space-y-2 text-blue-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>Prevent fraud and unauthorized changes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>Ensure your will is legally recognized as yours</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>Provide peace of mind for you and your loved ones</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-full h-14 brand-button text-base flex items-center justify-center gap-2"
                  onClick={() => setShowVerificationFlow(true)}
                >
                  <Shield className="h-5 w-5" />
                  <span>Verify My Identity</span>
                </Button>

                {formData.verifyIdentity && (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-green-700">Your identity has been verified successfully</p>
                  </div>
                )}
              </div>
            )}

            {field.type === "children" && (
              <div className="space-y-4">
                <Label className="text-base">
                  {field.label}
                  {field.required ? (
                    <span className="text-red-500">*</span>
                  ) : field.type === "email" || field.type === "tel" ? (
                    <span className="text-xs text-gray-500">(Optional)</span>
                  ) : null}
                </Label>

                {/* Add prominent skip button */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-base">No children?</h4>
                      <p className="text-sm text-gray-600">You can skip this step if you don't have any children</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onSkipStep}
                      className="border-[#007BFF] text-[#007BFF] hover:bg-blue-50"
                      data-testid="skip-children-button"
                    >
                      Skip this step
                    </Button>
                  </div>
                </div>

                <Card className="border-dashed">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label htmlFor="childName" className="text-base">
                          Child's Full Name
                        </Label>
                        <Input
                          id="childName"
                          value={childInput.name}
                          onChange={(e) => handleChildChange("name", e.target.value)}
                          placeholder="e.g. Emma Smith"
                          className="h-14 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="childAge" className="text-base">
                          Child's Age
                        </Label>
                        <Select value={childInput.age} onValueChange={(value) => handleChildChange("age", value)}>
                          <SelectTrigger id="childAge" className="h-14 text-base">
                            <SelectValue placeholder="Select age" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Under 18" className="text-base">
                              Under 18
                            </SelectItem>
                            <SelectItem value="18 or over" className="text-base">
                              18 or over
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        onClick={addChild}
                        className="w-full brand-button h-14 text-base"
                        disabled={!childInput.name || !childInput.age}
                      >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Add Child
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {formData.children && formData.children.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-base">Your Children:</h4>
                    <div className="space-y-3">
                      {formData.children.map((child) => (
                        <Card key={child.id} className="overflow-hidden border-l-4 border-l-green-500">
                          <CardContent className="flex items-center justify-between p-4">
                            <div>
                              <p className="font-medium text-base">{child.name}</p>
                              <p className="text-sm text-gray-500">Age: {child.age}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeChild(child.id)}
                              className="h-10 w-10"
                            >
                              <Trash2 className="h-5 w-5 text-red-500" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {field.type === "beneficiaries" && (
              <div className="space-y-4">
                <Label className="text-base">
                  {field.label}
                  {field.required ? (
                    <span className="text-red-500">*</span>
                  ) : field.type === "email" || field.type === "tel" ? (
                    <span className="text-xs text-gray-500">(Optional)</span>
                  ) : null}
                </Label>

                {/* Percentage allocation visualization */}
                {(formData.mainBeneficiary?.percentage ||
                  (formData.additionalBeneficiaries && formData.additionalBeneficiaries.length > 0)) && (
                  <div className="mb-6 bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-lg">Estate Allocation</h4>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full ${
                          totalPercentage === 100
                            ? "bg-green-100 text-green-800"
                            : totalPercentage > 100
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {totalPercentage}% of 100%
                      </span>
                    </div>

                    {/* Visual allocation bar */}
                    <div className="h-8 w-full bg-gray-100 rounded-md overflow-hidden flex mb-3">
                      {formData.mainBeneficiary?.percentage &&
                        Number.parseInt(formData.mainBeneficiary.percentage) > 0 && (
                          <div
                            className="h-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold"
                            style={{ width: `${Math.min(Number.parseInt(formData.mainBeneficiary.percentage), 100)}%` }}
                          >
                            {Number.parseInt(formData.mainBeneficiary.percentage) >= 10 &&
                              `${formData.mainBeneficiary.percentage}%`}
                          </div>
                        )}

                      {formData.additionalBeneficiaries &&
                        formData.additionalBeneficiaries.map((beneficiary, index) => {
                          const percentage = Number.parseInt(beneficiary.percentage) || 0
                          if (percentage <= 0) return null

                          // Calculate colors for different beneficiaries
                          const colors = [
                            "bg-indigo-500",
                            "bg-purple-500",
                            "bg-pink-500",
                            "bg-orange-500",
                            "bg-teal-500",
                          ]
                          const colorClass = colors[index % colors.length]

                          return (
                            <div
                              key={beneficiary.id}
                              className={`h-full ${colorClass} flex items-center justify-center text-white text-xs font-bold`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            >
                              {percentage >= 10 && `${percentage}%`}
                            </div>
                          )
                        })}

                      {totalPercentage > 100 && (
                        <div
                          className="h-full bg-red-500 flex items-center justify-center text-white text-xs font-bold"
                          style={{ width: `${totalPercentage - 100}%` }}
                        >
                          +{totalPercentage - 100}%
                        </div>
                      )}
                    </div>

                    {/* Status messages */}
                    {totalPercentage > 100 ? (
                      <Alert variant="destructive" className="mt-2 bg-red-50 border-red-200">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-700 text-sm">
                          Total exceeds 100%. Please reduce allocations to continue.
                        </AlertDescription>
                      </Alert>
                    ) : totalPercentage < 100 ? (
                      <Alert variant="warning" className="mt-2 bg-amber-50 border-amber-200">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-700 text-sm">
                          {100 - totalPercentage}% still unallocated. Total must equal 100%.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert variant="success" className="mt-2 bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700 text-sm">
                          Perfect! Your estate is fully allocated.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Beneficiary allocation list */}
                    <div className="mt-4 space-y-3">
                      {formData.mainBeneficiary?.name && (
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                            <div>
                              <p className="font-medium">{formData.mainBeneficiary.name}</p>
                              <p className="text-xs text-gray-500">Main Beneficiary</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="relative">
                              <Input
                                value={formData.mainBeneficiary.percentage || ""}
                                onChange={(e) => handlePercentageChange(e, null)}
                                className="h-8 w-20 pl-7 pr-2 text-sm"
                                type="text"
                                inputMode="numeric"
                              />
                              <Percent className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      )}

                      {formData.additionalBeneficiaries &&
                        formData.additionalBeneficiaries.map((beneficiary, index) => {
                          // Calculate colors for different beneficiaries
                          const colors = [
                            "bg-indigo-500",
                            "bg-purple-500",
                            "bg-pink-500",
                            "bg-orange-500",
                            "bg-teal-500",
                          ]
                          const colorClass = colors[index % colors.length]

                          return (
                            <div
                              key={beneficiary.id}
                              className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                            >
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full ${colorClass} mr-2`}></div>
                                <div>
                                  <p className="font-medium">{beneficiary.name}</p>
                                  <p className="text-xs text-gray-500">{beneficiary.relationship}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="relative mr-2">
                                  <Input
                                    value={beneficiary.percentage || ""}
                                    onChange={(e) => handlePercentageChange(e, beneficiary.id)}
                                    className="h-8 w-20 pl-7 pr-2 text-sm"
                                    type="text"
                                    inputMode="numeric"
                                  />
                                  <Percent className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeBeneficiary(beneficiary.id)}
                                  className="h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                    </div>

                    {/* Quick preset buttons */}
                    <div className="mt-6">
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <span>Quick Distribution Presets</span>
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applyPresetDistribution("50-50")}
                          className="text-xs h-8"
                        >
                          50/50 Split
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applyPresetDistribution("33-33-33")}
                          className="text-xs h-8"
                        >
                          33/33/33 Split
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applyPresetDistribution("25-25-25-25")}
                          className="text-xs h-8"
                        >
                          25/25/25/25 Split
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applyPresetDistribution("60-40")}
                          className="text-xs h-8"
                        >
                          60/40 Split
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applyPresetDistribution("70-30")}
                          className="text-xs h-8"
                        >
                          70/30 Split
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applyPresetDistribution("80-20")}
                          className="text-xs h-8"
                        >
                          80/20 Split
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button type="button" variant="outline" size="sm" onClick={equallyDistribute} className="text-sm">
                        Distribute Equally
                      </Button>

                      {totalPercentage < 100 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={distributeRemaining}
                          className="text-sm"
                        >
                          Distribute Remaining
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Add skip button for beneficiaries - only show when there are no additional beneficiaries */}
                {hasSkipOption(field) &&
                  (!formData.additionalBeneficiaries || formData.additionalBeneficiaries.length === 0) && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-base">No additional beneficiaries?</h4>
                          <p className="text-sm text-gray-600">
                            You can skip this step if you only want your main beneficiary to inherit
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={onSkipStep}
                          className="border-[#007BFF] text-[#007BFF] hover:bg-blue-50"
                          data-testid="skip-additional-beneficiaries-button"
                        >
                          Skip this step
                        </Button>
                      </div>
                    </div>
                  )}

                <Card className="border-dashed">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label htmlFor="beneficiaryName" className="text-base">
                          Full Name
                        </Label>
                        <Input
                          id="beneficiaryName"
                          value={beneficiaryInput.name}
                          onChange={(e) => handleBeneficiaryChange("name", e.target.value)}
                          placeholder="e.g. Thomas Smith"
                          className="h-14 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="beneficiaryRelationship" className="text-base">
                          Relationship to You
                        </Label>
                        <ButtonSelect
                          name="beneficiaryRelationship"
                          options={["Spouse/Partner", "Child", "Parent", "Sibling", "Friend", "Charity", "Other"]}
                          value={beneficiaryInput.relationship}
                          onChange={(value) => handleBeneficiaryChange("relationship", value)}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={addBeneficiary}
                        className="w-full brand-button h-14 text-base"
                        disabled={!beneficiaryInput.name || !beneficiaryInput.relationship}
                      >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Add Beneficiary
                      </Button>
                      <p className="text-xs text-gray-500 text-center">
                        Percentages will be automatically adjusted when adding beneficiaries
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {!formData.additionalBeneficiaries || formData.additionalBeneficiaries.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    This step is optional if you want everything to go to your main beneficiary.
                  </p>
                ) : null}
              </div>
            )}

            {field.type === "gifts" && (
              <div className="space-y-4">
                <Label className="text-base">{field.label}</Label>

                {/* Add skip button for specific gifts */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-base">No specific gifts?</h4>
                      <p className="text-sm text-gray-600">
                        You can skip this step if you don't want to leave specific items or money to particular people
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onSkipStep}
                      className="border-[#007BFF] text-[#007BFF] hover:bg-blue-50"
                      data-testid="skip-specific-gifts-button"
                    >
                      Skip this step
                    </Button>
                  </div>
                </div>

                <Card className="border-dashed">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label htmlFor="giftItem" className="text-base">
                          Item or Amount
                        </Label>
                        <Input
                          id="giftItem"
                          value={giftInput.item}
                          onChange={(e) => handleGiftChange("item", e.target.value)}
                          placeholder="E.g., 'My watch' or '£5,000'"
                          className="h-14 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="giftRecipient" className="text-base">
                          Recipient's Full Name
                        </Label>
                        <Input
                          id="giftRecipient"
                          value={giftInput.recipient}
                          onChange={(e) => handleGiftChange("recipient", e.target.value)}
                          placeholder="Who should receive this gift?"
                          className="h-14 text-base"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={addGift}
                        className="w-full brand-button h-14 text-base"
                        disabled={!giftInput.item || !giftInput.recipient}
                      >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Add Gift
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {formData.specificGifts && formData.specificGifts.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-base">Specific Gifts:</h4>
                    <div className="space-y-3">
                      {formData.specificGifts.map((gift) => (
                        <Card key={gift.id} className="overflow-hidden border-l-4 border-l-amber-500">
                          <CardContent className="flex items-center justify-between p-4">
                            <div>
                              <p className="font-medium text-base">{gift.item}</p>
                              <p className="text-sm text-gray-500">To: {gift.recipient}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeGift(gift.id)}
                              className="h-10 w-10"
                            >
                              <Trash2 className="h-5 w-5 text-red-500" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {!formData.specificGifts || formData.specificGifts.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    This step is optional. You can leave specific items or money to particular people.
                  </p>
                ) : null}
              </div>
            )}

            {field.type === "dob-dropdown" && (
              <>
                <Label htmlFor={field.name} className="text-base">
                  {field.label}
                  {field.required ? (
                    <span className="text-red-500">*</span>
                  ) : field.type === "email" || field.type === "tel" ? (
                    <span className="text-xs text-gray-500">(Optional)</span>
                  ) : null}
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirthDay" className="text-sm text-gray-500">
                      Day
                    </Label>
                    <div className="relative group">
                      <select
                        id="dateOfBirthDay"
                        value={formData.dateOfBirthDay || ""}
                        onChange={(e) => onDateOfBirthChange("Day", e.target.value)}
                        className={amazonSelectStyle}
                      >
                        <option value="" disabled>
                          Day
                        </option>
                        {days.map((day) => (
                          <option key={day} value={day.toString()}>
                            {day}
                          </option>
                        ))}
                      </select>
                      <div className={amazonArrowStyle}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-chevron-down"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirthMonth" className="text-sm text-gray-500">
                      Month
                    </Label>
                    <div className="relative group">
                      <select
                        id="dateOfBirthMonth"
                        value={formData.dateOfBirthMonth || ""}
                        onChange={(e) => onDateOfBirthChange("Month", e.target.value)}
                        className={amazonSelectStyle}
                      >
                        <option value="" disabled>
                          Month
                        </option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                      <div className={amazonArrowStyle}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-chevron-down"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirthYear" className="text-sm text-gray-500">
                      Year
                    </Label>
                    <div className="relative group">
                      <select
                        id="dateOfBirthYear"
                        value={formData.dateOfBirthYear || ""}
                        onChange={(e) => onDateOfBirthChange("Year", e.target.value)}
                        className={amazonSelectStyle}
                      >
                        <option value="" disabled>
                          Year
                        </option>
                        {years.map((year) => (
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <div className={amazonArrowStyle}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-chevron-down"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
