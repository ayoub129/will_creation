"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clipboard, Download, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Referral {
  id: string
  date: string
  status: string
  amount: number
  paid: boolean
}

interface Payment {
  id: string
  date: string
  amount: number
  method: string
}

interface MarketingMaterial {
  id: string
  title: string
  type: string
  format: string
  url: string
}


export default function InfluencerDashboardPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [referralLink, setReferralLink] = useState("")
  const [referralStats, setReferralStats] = useState({
    conversions: 0,
    earnings: 0,
    pendingPayment: 0,
  })
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [marketingMaterials, setMarketingMaterials] = useState<MarketingMaterial[]>([])
  const [timeframe, setTimeframe] = useState("all-time")

  // Mock data loading
  useEffect(() => {
  const protectInfluencerRoute = async () => {
    if (authLoading) return

    if (!user) {
      router.push("/auth?redirect=/dashboard/influencer")
      return
    }

    // Check if user is a valid influencer
    const { data, error } = await supabase
      .from("influencers")
      .select("id")
      .eq("email", user.email)
      .eq("is_approved", true)
      .single()

    if (error || !data) {
      router.push("/dashboard")
    }
  }

  protectInfluencerRoute()
const loadData = async () => {
  if (!user?.email) return

  setIsLoading(true)

  // 1. Fetch influencer data
  const { data: influencer, error: influencerError } = await supabase
    .from("influencers")
    .select("*")
    .eq("email", user.email)
    .single()

  if (influencerError || !influencer) {
    toast({ title: "Failed to load influencer data", description: influencerError?.message, variant: "destructive" })
    setIsLoading(false)
    return
  }

  setReferralLink(`https://makewillonline.com/r/${influencer.referral_code}`)

  setReferralStats({
    conversions: influencer.total_conversions ?? 0,
    earnings: influencer.total_earnings ?? 0,
    pendingPayment: influencer.pending_payment ?? 0,
  })

  // 2. Fetch referrals
  const { data: referralsData, error: referralsError } = await supabase
    .from("referrals")
    .select("*")
    .eq("referred_email", user.email)
    .order("created_at", { ascending: false })

  if (referralsError) {
    toast({ title: "Failed to load referrals", description: referralsError.message, variant: "destructive" })
  } else {
    setReferrals(
      referralsData.map((r) => ({
        id: r.id,
        date: r.created_at,
        status: r.status,
        amount: 5,
        paid: r.paid,
      }))
    )
  }

const { data: paymentsData, error: paymentsError } = await supabase
  .from("influencer_payments")
  .select("*")
  .eq("influencer_email", user.email)
  .order("created_at", { ascending: false })

if (paymentsError) {
  toast({ title: "Failed to load payment history", description: paymentsError.message, variant: "destructive" })
} else {
  setPayments(
    paymentsData.map((p) => ({
      id: p.id,
      date: p.created_at,
      amount: p.amount,
      method: p.method,
    }))
  )
}

  // 4. Set static marketing materials (still hardcoded unless you store them in DB)
  setMarketingMaterials([
    {
      id: "mat-001",
      title: "Social Media Banner",
      type: "image",
      format: "PNG",
      url: "/marketing/social-banner.png",
    },
    {
      id: "mat-002",
      title: "Email Template",
      type: "html",
      format: "HTML",
      url: "/marketing/email-template.html",
    },
    {
      id: "mat-003",
      title: "Promotional Video",
      type: "video",
      format: "MP4",
      url: "/marketing/promo-video.mp4",
    },
    {
      id: "mat-004",
      title: "Instagram Story Template",
      type: "image",
      format: "PNG",
      url: "/marketing/instagram-story.png",
    },
  ])

  setIsLoading(false)
}

    loadData()
  }, [authLoading, router, user])

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Link copied!",
      description: "Referral link copied to clipboard",
    })
  }

const shareOnSocial = (platform: "twitter" | "facebook" | "instagram" | 'linkedin') => {
    let url = ""
    const message = "Create your will online in minutes with MyEasyWill! Use my referral link for a special discount:"

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`
        break
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(message)}`
        break
      case "instagram":
        // Instagram doesn't have a direct share URL, so we'll just copy the text
        navigator.clipboard.writeText(`${message} ${referralLink}`)
        toast({
          title: "Caption copied!",
          description: "Share caption copied to clipboard. Open Instagram to share.",
        })
        return
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`
        break

    }

    window.open(url, "_blank")
  }

const downloadMaterial = (material: MarketingMaterial) => {
  const link = document.createElement("a")
  link.href = material.url
  link.download = material.title.replace(/\s+/g, "_").toLowerCase() + "." + material.format.toLowerCase()
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toast({
    title: "Download started",
    description: `${material.title} is downloading...`,
  })
}

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Influencer Dashboard</h1>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Earnings</CardTitle>
                <CardDescription>All time earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">£{referralStats.earnings}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Conversions</CardTitle>
                <CardDescription>Successful referrals</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{referralStats.conversions}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pending Payment</CardTitle>
                <CardDescription>To be paid out</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">£{referralStats.pendingPayment}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
              <CardDescription>Share this link to earn £5 per successful referral</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Input value={referralLink} readOnly className="flex-1" />
                <Button variant="outline" size="icon" onClick={copyReferralLink}>
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => shareOnSocial("twitter")}>
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" size="sm" onClick={() => shareOnSocial("facebook")}>
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button variant="outline" size="sm" onClick={() => shareOnSocial("instagram")}>
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </Button>
                <Button variant="outline" size="sm" onClick={() => shareOnSocial("linkedin")}>
                  <Linkedin className="h-4 w-4 mr-2" />
                  Linkedin
                </Button>

              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
              <CardDescription>Your latest 5 referrals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.slice(0, 5).map((referral) => (
                    <TableRow key={referral.id}>
                    <TableCell>{new Date(referral.date).toISOString().split("T")[0]}</TableCell>
                      <TableCell className="capitalize">{referral.status}</TableCell>
                      <TableCell>£{referral.amount}</TableCell>
                      <TableCell>{referral.paid ? "Yes" : "Pending"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Referrals</CardTitle>
                <CardDescription>Complete history of your referrals</CardDescription>
              </div>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Referral ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>{new Date(referral.date).toISOString().split("T")[0]}</TableCell>
                      <TableCell>{referral.id}</TableCell>
                      <TableCell className="capitalize">{referral.status}</TableCell>
                      <TableCell>£{referral.amount}</TableCell>
                      <TableCell>{referral.paid ? "Yes" : "Pending"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Record of all payments made to you</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{new Date(payment.date).toISOString().split("T")[0]}</TableCell>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell>£{payment.amount}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell className="capitalize">Paid</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Payments are processed on the last day of each month for amounts over £50.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="marketing">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Materials</CardTitle>
              <CardDescription>Resources to help promote MyEasyWill</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketingMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell>{material.title}</TableCell>
                      <TableCell className="capitalize">{material.type}</TableCell>
                      <TableCell>{material.format}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => downloadMaterial(material)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Need custom marketing materials? Contact us at support@makewillonline.com
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
