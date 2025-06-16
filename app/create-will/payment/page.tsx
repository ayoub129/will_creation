"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, Lock, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BrandHeader } from "@/components/brand-header"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder")
type InsertedWill = {
  id: number
  [key: string]: any
}

export default function Payment() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [clientSecret, setClientSecret] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [willData, setWillData] = useState<Record<string, any> | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentIntentId, setPaymentIntentId] = useState("")

  useEffect(() => {
    // Load saved will data
    const savedData = localStorage.getItem("myEasyWill_savedProgress")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setWillData(parsedData.formData)
      } catch (e) {
        console.error("Error loading saved progress", e)
      }
    }

    // Create a payment intent when the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1500 }), // £15.00
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error)
        setIsLoading(false)
      })
  }, [])

  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  if (!willData) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <BrandHeader />
        <main className="flex-1 pt-16 pb-24">
          <div className="container mx-auto px-4 py-4">
            <div className="mx-auto max-w-md">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="text-center text-red-500">
                    <p>No will data found.</p>
                    <p className="mt-2">Please start over from the beginning.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Fixed Header */}
      <BrandHeader />

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto px-4 py-4">
          <div className="mx-auto max-w-md">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Payment</h1>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Lock className="h-4 w-4" />
                Secure Payment
              </div>
            </div>

            <Card className="mb-6 border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex justify-between">
                    <span className="font-medium">My Easy Will</span>
                    <span className="font-medium">£15.00</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">Legally compliant UK will with signing instructions</div>
                  <div className="mt-4 flex justify-between border-t border-gray-200 pt-2">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">£15.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isLoading || authLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#007BFF] border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Preparing secure payment...</p>
              </div>
            ) : paymentSuccess ? (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Create Account</CardTitle>
                  <CardDescription>Create an account to access your will</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="register" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="register">Sign Up</TabsTrigger>
                      <TabsTrigger value="login">Sign In</TabsTrigger>
                    </TabsList>
                    <TabsContent value="register">
                      <form onSubmit={async (e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        const name = formData.get("name") as string
                        const email = formData.get("email") as string
                        const password = formData.get("password") as string
                        const confirmPassword = formData.get("confirmPassword") as string

                        if (password !== confirmPassword) {
                          toast({ title: "Error", description: "Passwords do not match", variant: "destructive" })
                          return
                        }

                        try {
                          const { data, error } = await supabase.auth.signUp({
                            email,
                            password,
                            options: {
                              data: {
                                fullName: name,
                                role: "user",
                              },
                            },
                          })

                          if (error) throw error
                          if (!data.user) throw new Error("Failed to create user")

                          // Save will data
                          const insertedWill = await handleSubmitToSupabase(willData, data.user, toast)
                          if (insertedWill) {
                            await savePaymentRecord({
                              userId: data.user.id,
                              willId: insertedWill.id,
                              stripeSession: paymentIntentId,
                              status: "succeeded",
                              amount: 15,
                            })
                            router.push("/create-will/download")
                          }
                        } catch (err: any) {
                          toast({ title: "Error", description: err.message, variant: "destructive" })
                        }
                      }} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input id="password" name="password" type="password" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <Input id="confirmPassword" name="confirmPassword" type="password" required />
                        </div>
                        <Button type="submit" className="w-full">Create Account</Button>
                      </form>
                    </TabsContent>
                    <TabsContent value="login">
                      <form onSubmit={async (e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        const email = formData.get("email") as string
                        const password = formData.get("password") as string

                        try {
                          const { data, error } = await supabase.auth.signInWithPassword({
                            email,
                            password,
                          })

                          if (error) throw error
                          if (!data.user) throw new Error("Failed to sign in")

                          // Save will data
                          const insertedWill = await handleSubmitToSupabase(willData, data.user, toast)
                          if (insertedWill) {
                            await savePaymentRecord({
                              userId: data.user.id,
                              willId: insertedWill.id,
                              stripeSession: paymentIntentId,
                              status: "succeeded",
                              amount: 15,
                            })
                            router.push("/create-will/download")
                          }
                        } catch (err: any) {
                          toast({ title: "Error", description: err.message, variant: "destructive" })
                        }
                      }} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email</Label>
                          <Input id="login-email" name="email" type="email" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password">Password</Label>
                          <Input id="login-password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full">Sign In</Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret, 
                appearance: { theme: 'stripe' },
                loader: 'auto', // Automatically shows a loading spinner
               }}>
                {willData && (
                  <CheckoutForm 
                    router={router} 
                    willData={willData} 
                    isAuthenticated={!!user}
                    onPaymentSuccess={(intentId) => {
                      setPaymentSuccess(true)
                      setPaymentIntentId(intentId)
                    }}
                  />
                )}
              </Elements>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="text-center text-red-500">
                    <p>Unable to initialize payment system.</p>
                    <p className="mt-2">Please try again later or contact support.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 z-10 w-full border-t bg-white p-4 shadow-md">
        <div className="brand-gradient h-1 w-full absolute top-0 left-0"></div>
        <div className="mx-auto flex max-w-md justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-14 border-[#007BFF] text-[#007BFF]"
            onClick={() => router.push("/create-will/review")}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
        </div>
      </div>
    </div>
  )
}

async function handleSubmitToSupabase(
  willData: Record<string, any>,
  user: { id: string } | null,
  toast: (props: { title: string; description: string; variant?: "default" | "destructive" }) => void
): Promise<InsertedWill | null>
{
  const {
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    addressLine1,
    addressLine2,
    city,
    postcode,
    maritalStatus,
    children,
    estateValue,
    hasOverseasAssets,
    hasBusinessAssets,
    hasTrusts,
    primaryExecutor,
    backupExecutor,
    mainBeneficiary,
    additionalBeneficiaries,
    specificGifts,
    residualEstate,
    funeralWishes,
    petCare,
    digitalAssets,
    verifyIdentity,
    legalDeclaration
  } = willData

  if (!user) {
    toast({ title: "Not signed in", description: "Please sign in to save your will", variant: "destructive" })
    return null
  }

  const { data, error } = await supabase.from("wills").insert({
    user_id: user.id,
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
    date_of_birth: dateOfBirth || null,
    address_line1: addressLine1,
    address_line2: addressLine2,
    city,
    postcode,
    marital_status: maritalStatus,
    children,
    estate_value: estateValue,
    has_overseas_assets: hasOverseasAssets,
    has_business_assets: hasBusinessAssets,
    has_trusts: hasTrusts,
    primary_executor: primaryExecutor,
    backup_executor: backupExecutor,
    main_beneficiary: mainBeneficiary,
    additional_beneficiaries: additionalBeneficiaries,
    specific_gifts: specificGifts,
    residual_estate: residualEstate,
    funeral_wishes: funeralWishes,
    pet_care: petCare,
    digital_assets: digitalAssets,
    verify_identity: verifyIdentity,
    legal_declaration: legalDeclaration
  })

  if (error) {
    toast({ title: "Save failed", description: error.message, variant: "destructive" })
    return null
  }

  toast({ title: "Will saved", description: "Your will has been saved successfully." })
  localStorage.removeItem("myEasyWill_savedProgress")
  return data
}

function CheckoutForm({
  router,
  willData,
  isAuthenticated,
  onPaymentSuccess,
}: {
  router: ReturnType<typeof useRouter>
  willData: Record<string, any>
  isAuthenticated: boolean
  onPaymentSuccess: (intentId: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage("")

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/create-will/download`,
      },
      redirect: "if_required",
    })

    if (error) {
      setErrorMessage(error.message || "Payment failed. Please try again.")
      setIsProcessing(false)
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsComplete(true)
      onPaymentSuccess(paymentIntent.id)

      if (isAuthenticated) {
        // If user is authenticated, proceed with normal flow
        try {
          const insertedWill = await handleSubmitToSupabase(willData, user, toast)
          if (!user) {
            toast({ title: "Not logged in", description: "Please sign in first", variant: "destructive" })
            return
          }

          let willId = insertedWill?.id

          if (!willId) {
            const { data: latestWill, error: fetchError } = await supabase
              .from("wills")
              .select("id")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single()

            if (fetchError || !latestWill) {
              toast({ title: "Save failed", description: "Could not find a saved will.", variant: "destructive" })
              return
            }

            willId = latestWill.id
          }

          await savePaymentRecord({
            userId: user.id,
            willId: willId!,
            stripeSession: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100,
          })

          // Track referral if exists
          const referralCode = localStorage.getItem("referral_code")
          if (referralCode) {
            await trackReferral(referralCode, user.id, willId!)
          }

          // Clear saved progress
          localStorage.removeItem("myEasyWill_savedProgress")
          localStorage.removeItem("referral_code")

          // Redirect to download page
          router.push("/create-will/download")
        } catch (error) {
          console.error("Error saving will:", error)
          toast({
            title: "Error",
            description: "There was an error saving your will. Please contact support.",
            variant: "destructive",
          })
        }
      }
    }
  }

  return (
    <Card className="mb-6 border-0 shadow-sm">
      {!isComplete ? (
        <>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Payment Details</CardTitle>
            <CardDescription>Enter your card information securely</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <PaymentElement />
              </div>

              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span>Your payment information is encrypted and secure</span>
              </div>

              {errorMessage && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{errorMessage}</div>}

              <Button
                type="submit"
                disabled={isProcessing || !stripe || !elements}
                className="w-full bg-[#007BFF] hover:bg-[#0056b3] h-14"
              >
                {isProcessing ? "Processing..." : "Pay £15.00"}
              </Button>
            </form>
          </CardContent>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 text-center py-12">
          <div className="rounded-full bg-green-100 p-6">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Payment Successful!</h2>
          <p className="text-gray-600">Thank you for your purchase.</p>
          <p className="text-gray-600">Please create an account to access your will...</p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-2 animate-pulse rounded-full bg-green-500" style={{ width: "100%" }} />
          </div>
        </div>
      )}
    </Card>
  )
}

async function savePaymentRecord({
  userId,
  willId,
  stripeSession,
  status,
  amount,
}: {
  userId: string
  willId: number
  stripeSession: string
  status: string
  amount: number
}) {
  const { error } = await supabase.from("payments").insert({
    user_id: userId,
    will_id: willId,
    stripe_session_id: stripeSession,
    status,
    amount,
  })

  if (error) {
    console.error("Error saving payment:", error.message)
    throw error
  }
}

async function trackReferral(referralCode: string, userId: string, willId: number) {
  const { data: influencer, error: refErr } = await supabase
    .from("influencers")
    .select("*")
    .eq("referral_code", referralCode)
    .single()

  if (influencer) {
    // 1. Add referral entry
    await supabase.from("referrals").insert({
      referrer_id: referralCode,
      referred_email: influencer.email,
      will_id: willId,
      status: "completed",
      amount: 5,
      created_at: new Date().toISOString()
    })

    // 2. Update influencer stats
    await supabase
      .from("influencers")
      .update({
        total_conversions: (influencer.total_conversions || 0) + 1,
        total_earnings: (influencer.total_earnings || 0) + 5,
        pending_payment: (influencer.pending_payment || 0) + 5,
      })
      .eq("id", influencer.id)

    // 3. Remove referral code to avoid double-counting
    localStorage.removeItem("referral_code")
  }
}
