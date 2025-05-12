"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Camera, Upload, Shield, CheckCircle, Smartphone } from "lucide-react"

interface IdentityVerificationFlowProps {
  onComplete: (verified: boolean) => void
  onSkip: () => void
}

export function IdentityVerificationFlow({ onComplete, onSkip }: IdentityVerificationFlowProps) {
  const [activeTab, setActiveTab] = useState("id")
  const [verificationStep, setVerificationStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [idType, setIdType] = useState<string | null>(null)
  const [idNumber, setIdNumber] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const { toast } = useToast()

  const handleIdSubmit = () => {
    if (!idType || !idNumber) {
      toast({
        title: "Missing information",
        description: "Please select an ID type and enter your ID number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call to verify ID
    setTimeout(() => {
      setIsLoading(false)
      setVerificationStep(2)
    }, 1500)
  }

  const handlePhoneSubmit = () => {
    if (!phoneNumber) {
      toast({
        title: "Missing information",
        description: "Please enter your phone number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate sending verification code
    setTimeout(() => {
      setIsLoading(false)
      setVerificationStep(3)
      toast({
        title: "Verification code sent",
        description: "We've sent a code to your phone number",
      })
    }, 1500)
  }

  const handleCodeSubmit = () => {
    if (!verificationCode || verificationCode.length < 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit verification code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate verifying code
    setTimeout(() => {
      setIsLoading(false)
      setShowSuccess(true)

      // After showing success for 2 seconds, complete the verification
      setTimeout(() => {
        onComplete(true)
      }, 2000)
    }, 1500)
  }

  const handleSkip = () => {
    toast({
      title: "Verification skipped",
      description: "You can always verify your identity later",
    })
    onSkip()
  }

  if (showSuccess) {
    return (
      <Card className="border-green-200">
        <CardHeader className="bg-green-50 border-b border-green-100">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-green-800">Verification Successful</CardTitle>
              <CardDescription className="text-green-700">Your identity has been verified successfully</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="rounded-full bg-green-100 p-4">
              <Shield className="h-12 w-12 text-green-600" />
            </div>
            <p className="text-lg font-medium">Your will now has added security protection</p>
            <p className="text-gray-600">
              This helps prevent fraud and ensures your will is legally recognized as yours.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Verify Your Identity</CardTitle>
        <CardDescription>This quick process adds extra security to your will</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="id" disabled={verificationStep !== 1}>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>ID Verification</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="phone" disabled={verificationStep < 2}>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>Phone Verification</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="id" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select ID Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={idType === "passport" ? "default" : "outline"}
                    className={`h-14 text-base ${
                      idType === "passport"
                        ? "bg-[#007BFF] text-white hover:bg-[#0056b3]"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#007BFF] hover:border-[#007BFF]"
                    }`}
                    onClick={() => setIdType("passport")}
                  >
                    Passport
                  </Button>
                  <Button
                    type="button"
                    variant={idType === "driving" ? "default" : "outline"}
                    className={`h-14 text-base ${
                      idType === "driving"
                        ? "bg-[#007BFF] text-white hover:bg-[#0056b3]"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#007BFF] hover:border-[#007BFF]"
                    }`}
                    onClick={() => setIdType("driving")}
                  >
                    Driving Licence
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number</Label>
                <Input
                  id="idNumber"
                  placeholder={idType === "passport" ? "Passport number" : "Driving licence number"}
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="h-14 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label>Upload ID Document (Optional)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-14 text-base border-dashed flex flex-col items-center justify-center py-4"
                  >
                    <Camera className="h-5 w-5 mb-1" />
                    <span>Take Photo</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-14 text-base border-dashed flex flex-col items-center justify-center py-4"
                  >
                    <Upload className="h-5 w-5 mb-1" />
                    <span>Upload File</span>
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  For enhanced security, you can upload a photo of your ID document
                </p>
              </div>

              <Button className="w-full brand-button h-14" onClick={handleIdSubmit} disabled={isLoading}>
                {isLoading ? "Verifying..." : "Continue"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="phone" className="space-y-4 mt-4">
            {verificationStep === 2 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="Enter your mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-14 text-base"
                    type="tel"
                  />
                  <p className="text-xs text-gray-500">We'll send a verification code to this number</p>
                </div>

                <Button className="w-full brand-button h-14" onClick={handlePhoneSubmit} disabled={isLoading}>
                  {isLoading ? "Sending Code..." : "Send Verification Code"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="h-14 text-base text-center tracking-widest font-bold"
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500">Enter the 6-digit code we sent to your phone</p>
                </div>

                <Button className="w-full brand-button h-14" onClick={handleCodeSubmit} disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>

                <Button variant="link" className="w-full" onClick={() => setVerificationStep(2)}>
                  Didn't receive the code? Send again
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Why verify your identity?</h4>
              <p className="text-sm text-blue-700 mt-1">
                Identity verification helps prevent fraud and ensures your will is legally recognized as yours. Your
                information is securely encrypted and protected.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" onClick={handleSkip}>
          Skip for now
        </Button>
      </CardFooter>
    </Card>
  )
}
