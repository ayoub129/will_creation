"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { BrandHeader } from "@/components/brand-header"
import { GlobalFooter } from "@/components/global-footer"
import {
  ArrowLeft,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  Loader2,
  CheckCircle2,
  TwitterIcon as TikTok,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase"

export default function InfluencerApplicationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    socialProfiles: {
      instagram: "",
      twitter: "",
      tiktok: "",
      youtube: "",
      facebook: "",
      linkedin: "",
    },
    agreeTerms: false,
  })

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target

  if (name.includes(".")) {
    const [parent, child] = name.split(".") as [keyof typeof formData, string]
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [child]: value,
      },
    }))
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
}

const handleCheckboxChange = (name: keyof typeof formData, checked: boolean | "indeterminate") => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()

  if (!formData.fullName || !formData.email) {
    toast({
      title: "Required fields missing",
      description: "Please fill in your name and email to continue.",
      variant: "destructive",
    })
    return
  }

  if (!formData.agreeTerms) {
    toast({
      title: "Please agree to the terms",
      description: "You must agree to the terms and conditions to proceed.",
      variant: "destructive",
    })
    return
  }

  const hasSocialProfile = Object.values(formData.socialProfiles).some((profile) => profile.trim() !== "")
  if (!hasSocialProfile) {
    toast({
      title: "Social profile required",
      description: "Please provide at least one social media profile.",
      variant: "destructive",
    })
    return
  }

  setIsSubmitting(true)

  try {
    const { error } = await supabase.from("influencers").insert({
      email: formData.email, 
      name: formData.fullName, 
      referral_code: crypto.randomUUID().split("-")[0], // Generate a short unique code
      instagram: formData.socialProfiles.instagram,
      twitter: formData.socialProfiles.twitter,
      tiktok: formData.socialProfiles.tiktok,
      youtube: formData.socialProfiles.youtube,
      facebook: formData.socialProfiles.facebook,
      linkedin: formData.socialProfiles.linkedin,
      is_approved: false, 
    })

    if (error) throw error

    toast({
      title: "Application submitted",
      description: "We've received your application and will review it shortly.",
    })

    router.push("/influencer-program/thank-you")
  } catch (error: any) {
    toast({
      title: "Submission failed",
      description: error.message || "There was an error submitting your application.",
      variant: "destructive",
    })
  } finally {
    setIsSubmitting(false)
  }
}

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white">
      <BrandHeader />

      <main className="flex-1 pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <Button
              variant="ghost"
              className="mb-6 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => router.push("/influencer-program")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Influencer Program
            </Button>

            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Our Influencer Program</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Connect your socials, share with your audience, and earn £5 for every completed will.
              </p>
            </div>

            <Card className="border-0 shadow-lg overflow-hidden backdrop-blur-sm bg-white/80">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-700 font-medium text-lg">Your Social Profiles</Label>
                      <span className="text-sm text-gray-500">Add at least one profile</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <SocialInput
                        icon={<Instagram className="text-pink-500" />}
                        name="socialProfiles.instagram"
                        placeholder="Instagram username or URL"
                        value={formData.socialProfiles.instagram}
                        onChange={handleChange}
                      />

                      <SocialInput
                        icon={<TikTok className="text-black" />}
                        name="socialProfiles.tiktok"
                        placeholder="TikTok username or URL"
                        value={formData.socialProfiles.tiktok}
                        onChange={handleChange}
                      />

                      <SocialInput
                        icon={<Youtube className="text-red-500" />}
                        name="socialProfiles.youtube"
                        placeholder="YouTube channel URL"
                        value={formData.socialProfiles.youtube}
                        onChange={handleChange}
                      />

                      <SocialInput
                        icon={<Twitter className="text-blue-400" />}
                        name="socialProfiles.twitter"
                        placeholder="Twitter/X username or URL"
                        value={formData.socialProfiles.twitter}
                        onChange={handleChange}
                      />

                      <SocialInput
                        icon={<Facebook className="text-blue-600" />}
                        name="socialProfiles.facebook"
                        placeholder="Facebook page URL"
                        value={formData.socialProfiles.facebook}
                        onChange={handleChange}
                      />

                      <SocialInput
                        icon={<Linkedin className="text-blue-700" />}
                        name="socialProfiles.linkedin"
                        placeholder="LinkedIn profile URL"
                        value={formData.socialProfiles.linkedin}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 text-blue-500">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-800">Quick Application Process</h3>
                        <p className="mt-1 text-sm text-blue-700">
                          We've simplified our application to get you started faster. Once approved, you'll receive your
                          unique referral link and access to our influencer dashboard.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 bg-gray-50 p-4 rounded-lg">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => handleCheckboxChange("agreeTerms", checked)}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="agreeTerms" className="text-sm font-normal leading-snug">
                        I agree to the{" "}
                        <Link href="/influencer-program/terms" className="text-blue-600 hover:underline">
                          terms and conditions
                        </Link>{" "}
                        of the My Easy Will Influencer Program.
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8 text-center text-sm text-gray-500">
              Have questions? Contact us at{" "}
              <a href="mailto:influencers@makewillonline.com" className="text-blue-600 hover:underline">
                influencers@makewillonline.com
              </a>
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  )
}

function SocialInput({
  icon,
  name,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode
  name: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="relative group">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5">{icon}</div>
      <Input
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 transition-all group-hover:border-gray-400"
      />
    </div>
  )
}
