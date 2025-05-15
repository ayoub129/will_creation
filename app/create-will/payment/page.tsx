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
  const [willData, setWillData] = useState(null)

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
            {/* {user && willData && (
              <div className="mb-6 text-center">
                <Button
                  variant="outline"
                  disabled={isSaving}
                  onClick={async () => {
                    setIsSaving(true)
                    await handleSubmitToSupabase(willData, user ,toast)
                    setIsSaving(false)
                  }}
                >
                  {isSaving ? "Saving..." : "Save to DB Only"}
                </Button>
              </div>
            )} */}

            {isLoading || authLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#007BFF] border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Preparing secure payment...</p>
              </div>
            ) : user ? (
              // User is logged in, show payment form
              clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  {willData && (
                    <CheckoutForm router={router} willData={willData} />
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
              )
            ) : (
              // User is not logged in, show account creation/login tabs
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Create an Account</CardTitle>
                  <CardDescription>Create an account to save your will and access it anytime</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="register" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="register">Create Account</TabsTrigger>
                      <TabsTrigger value="login">Sign In</TabsTrigger>
                    </TabsList>
                    <TabsContent value="register">
                      {willData && (
                      <AccountCreationForm
                        onSuccess={() => {
                          if (clientSecret) {
                            // After successful registration, show payment form
                            // The auth context will handle the user state update
                          }
                        }}
                        willData={willData}
                      />
                      )}
                    </TabsContent>
                    <TabsContent value="login">
                      <LoginForm
                        onSuccess={() => {
                          if (clientSecret) {
                            // After successful login, show payment form
                            // The auth context will handle the user state update
                          }
                        }}
                      />
                    </TabsContent>
                  </Tabs>
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


  console.log(user)
  console.log('we call it')
  if (!user) {
    console.log('no user')
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

  console.log("data" + data)
  console.log("error" + error)

  if (error) {
    toast({ title: "Save failed", description: error.message, variant: "destructive" })
    return null
  }

  toast({ title: "Will saved", description: "Your will has been saved successfully." })
  localStorage.removeItem("myEasyWill_savedProgress")
  return data
}


function AccountCreationForm({
  onSuccess,
  willData,
}: {
  onSuccess: () => void
  willData: Record<string, any>
}){  const { register , loginWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: willData ? `${willData.firstName} ${willData.lastName}` : "",
    email: "",
    password: "",
    confirmPassword: "",
  })

    const handleGoogleLogin = async () => {
    setError("")
    try {
      await loginWithGoogle()
      // Redirect happens in the loginWithGoogle function
    } catch (err) {
      // Error is handled by the toast in the auth context
    }
  }


const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    try {
      await register(formData.name, formData.email, formData.password)
      onSuccess()
    } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message)
  } else {
    setError("Failed to create account")
  }
} finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your full name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your.email@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Create a password"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Confirm your password"
        />
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <Button type="submit" className="w-full brand-button" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Account & Continue"}
      </Button>
                                                            <div className="relative w-full">
                                                              <div className="absolute inset-0 flex items-center">
                                                                <span className="w-full border-t" />
                                                              </div>
                                                              <div className="relative flex justify-center text-xs uppercase">
                                                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                                              </div>
                                                            </div>
                                          
                                                            <Button
                                                              type="button"
                                                              variant="outline"
                                                              className="w-full"
                                                              onClick={handleGoogleLogin}
                                                              disabled={isLoading}
                                                            >
                                                              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                                                <path
                                                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                                  fill="#4285F4"
                                                                />
                                                                <path
                                                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                                  fill="#34A853"
                                                                />
                                                                <path
                                                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                                  fill="#FBBC05"
                                                                />
                                                                <path
                                                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                                  fill="#EA4335"
                                                                />
                                                              </svg>
                                                              Google
                                                            </Button>
      

      <p className="text-xs text-center text-gray-500 mt-4">
        By creating an account, you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  )
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login , loginWithGoogle} = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

      const handleGoogleLogin = async () => {
    setError("")
    try {
      await loginWithGoogle()
      // Redirect happens in the loginWithGoogle function
    } catch (err) {
      // Error is handled by the toast in the auth context
    }
  }


const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      await login(formData.email, formData.password)
      onSuccess()
   } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message)
    } else {
      setError("Failed to create account")
    }
  }
  finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your.email@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Your password"
        />
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <Button type="submit" className="w-full brand-button" disabled={isLoading}>
        {isLoading ? "Signing In..." : "Sign In & Continue"}
      </Button>
                                                            <div className="relative w-full">
                                                              <div className="absolute inset-0 flex items-center">
                                                                <span className="w-full border-t" />
                                                              </div>
                                                              <div className="relative flex justify-center text-xs uppercase">
                                                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                                              </div>
                                                            </div>
                                          
                                                            <Button
                                                              type="button"
                                                              variant="outline"
                                                              className="w-full"
                                                              onClick={handleGoogleLogin}
                                                              disabled={isLoading}
                                                            >
                                                              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                                                <path
                                                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                                  fill="#4285F4"
                                                                />
                                                                <path
                                                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                                  fill="#34A853"
                                                                />
                                                                <path
                                                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                                  fill="#FBBC05"
                                                                />
                                                                <path
                                                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                                  fill="#EA4335"
                                                                />
                                                              </svg>
                                                              Google
                                                            </Button>
      
      <p className="text-xs text-center text-gray-500 mt-2">
        <a href="/forgot-password" className="text-[#007BFF] hover:underline">
          Forgot your password?
        </a>
      </p>
    </form>
  )
}

function CheckoutForm({
  router,
  willData,
}: {
  router: ReturnType<typeof useRouter>
  willData: Record<string, any>
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { toast } = useToast()
  const { user } = useAuth()
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
  console.log('we are in payment')
  console.log(userId)
  console.log(willId)
  console.log(stripeSession)
  console.log(status)
  console.log(amount)
  const { error } = await supabase.from("payments").insert({
    user_id: userId,
    will_id: willId,
    stripe_session: stripeSession,
    status,
    amount,
  })

  if (error) {
    console.error("Error saving payment:", error.message)
    throw error
  }
}

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

      // Save the will to the user's account
      try {
      const insertedWill = await handleSubmitToSupabase(willData, user, toast)
      if (!user) {
        toast({ title: "Not logged in", description: "Please sign in first", variant: "destructive" })
        return
      }

    let willId = insertedWill?.id

    if (!willId) {
      // Try to fetch the latest will for this user
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
        const { data: influencer, error: refErr } = await supabase
          .from("influencers")
          .select("*")
          .eq("referral_code", referralCode)
          .single()

        if (influencer) {
          // 1. Add referral entry
          await supabase.from("referrals").insert({
            referred_email: user?.email,
            referrer_email: influencer.email,
            status: "completed",
            amount: 5,
            commission_paid: false,
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


      } catch (err) {
        console.error("Error saving will:", err)
      }

      // Redirect to download page after successful payment
      setTimeout(() => {
        router.push("/create-will/download")
      }, 2000)
    } else {
      setIsProcessing(false)
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
          <p className="text-gray-600">Redirecting you to download your will...</p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-2 animate-pulse rounded-full bg-green-500" style={{ width: "100%" }} />
          </div>
        </div>
      )}
    </Card>
  )
}
