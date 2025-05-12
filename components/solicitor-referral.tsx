"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface SolicitorReferralProps {
  onContinueAnyway: () => void
  complexityFactors: {
    hasOverseasAssets: boolean
    hasBusinessAssets: boolean
    hasTrusts: boolean
    highValue: boolean
  }
}

export function SolicitorReferral({ onContinueAnyway, complexityFactors }: SolicitorReferralProps) {
  const { hasOverseasAssets, hasBusinessAssets, hasTrusts, highValue } = complexityFactors

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 sm:p-6 mx-auto w-full max-w-3xl">
      <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-amber-800">Professional Advice Recommended</h2>

      <p className="mb-3 sm:mb-4 text-sm sm:text-base text-amber-700">
        Based on your answers, your estate has complex elements that may benefit from professional legal advice:
      </p>

      <ul className="mb-4 sm:mb-6 ml-4 sm:ml-5 list-disc space-y-1 sm:space-y-2 text-sm sm:text-base text-amber-700">
        {highValue && <li>Minimize inheritance tax implications</li>}
        {hasOverseasAssets && <li>Ensure cross-border legal compliance</li>}
        {hasBusinessAssets && <li>Properly structure business succession</li>}
        {hasTrusts && <li>Address complex family arrangements</li>}
        {hasTrusts && <li>Establish appropriate trusts if needed</li>}
      </ul>

      <div className="mb-4 sm:mb-6 rounded-md bg-blue-50 p-3 sm:p-4">
        <h3 className="mb-2 flex items-center text-base sm:text-lg font-medium text-blue-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
            />
          </svg>
          Recommended Solicitors
        </h3>

        <p className="mb-2 text-sm sm:text-base text-blue-700">
          These UK solicitors specialize in complex estate planning:
        </p>

        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-medium text-sm sm:text-base text-blue-800">Farrer & Co</p>
              <p className="text-xs sm:text-sm text-blue-600">
                Specialists in high-value estates and inheritance planning
              </p>
            </div>
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-blue-500" />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-medium text-sm sm:text-base text-blue-800">Irwin Mitchell</p>
              <p className="text-xs sm:text-sm text-blue-600">
                Expertise in international assets and business succession
              </p>
            </div>
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-blue-500" />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-medium text-sm sm:text-base text-blue-800">Withers Worldwide</p>
              <p className="text-xs sm:text-sm text-blue-600">Global expertise for complex cross-border estates</p>
            </div>
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
        <Button
          variant="outline"
          className="border-amber-500 text-amber-600 hover:bg-amber-50 w-full"
          onClick={onContinueAnyway}
          data-testid="continue-basic-will"
        >
          Continue with basic will anyway
        </Button>

        <Button className="bg-blue-600 hover:bg-blue-700 w-full">Find a solicitor near me</Button>
      </div>
    </div>
  )
}
