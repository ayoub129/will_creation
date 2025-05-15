"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BrandHeader } from "@/components/brand-header"
import { GlobalFooter } from "@/components/global-footer"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  Download,
  ExternalLink,
  Eye,
  Loader2,
  MoreHorizontal,
  Search,
  Trash2,
  UserCheck,
  UserX,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"


interface SocialProfiles {
  instagram?: string
  twitter?: string
  tiktok?: string
  youtube?: string
  facebook?: string
  linkedin?: string
  website?: string
}

interface Influencer {
  id: string
  name: string
  email: string
  status: "active" | "inactive"
  dateJoined: string
  referrals: number
  earnings: number
  pending_payment: number
  paypal: string
  socialProfiles: SocialProfiles
}

interface Application {
  id: string
  name: string
  email: string
  dateApplied: string
  socialProfiles: SocialProfiles
}

export default function AdminInfluencersPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | Application | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
const [paymentInfluencers, setPaymentInfluencers] = useState<Influencer[]>([])


const loadPaymentData = async () => {
  const { data, error } = await supabase
    .from("influencers")
    .select("*")
    .gt("pending_payment", 50)

  if (error) {
    toast({ title: "Error", description: error.message, variant: "destructive" })
    return
  }

  const formatted = data.map((inf) => ({
    id: inf.id.toString(),
    name: inf.name,
    email: inf.email,
    dateJoined: inf.created_at,
    referrals: inf.total_conversions ?? 0,
    earnings: inf.total_earnings ?? 0,
    socialProfiles: {
      instagram: inf.instagram,
      twitter: inf.twitter,
      tiktok: inf.tiktok,
      youtube: inf.youtube,
      facebook: inf.facebook,
      linkedin: inf.linkedin,
    },
    pending_payment: inf.pending_payment ?? 0,
    paypal: inf.paypal,
    status: inf.is_approved ? "active" as const : "inactive" as const,
  }))

  setPaymentInfluencers(formatted)
}

const handleMarkAsPaid = async (influencerId: string, email: string, name: string, amount: number) => {
  // 1. Update influencer's pending_payment to 0
  const { error: updateError } = await supabase
    .from("influencers")
    .update({ pending_payment: 0 })
    .eq("id", influencerId)

  if (updateError) {
    toast({ title: "Error", description: "Failed to update payment", variant: "destructive" })
    return
  }

  // 2. Insert payment record
  const { error: insertError } = await supabase
    .from("influencer_payments")
    .insert({
      influencer_email: email,
      amount: amount,
      method: "paypal",
    })

  if (insertError) {
    toast({ title: "Warning", description: "Marked as paid but failed to log payment", variant: "destructive" })
    console.error("Failed to insert influencer payment record:", insertError.message)
    return
  }

  // 3. Debug log
  console.log(`[DEBUG] Payment confirmation email for ${name} <${email}> - Amount: £${amount}`)

  // 4. Success toast + refresh
  toast({ title: "Payment Marked", description: `Marked ${name} as paid.` })
  loadPaymentData()
}


function exportToCSV(data: Influencer[], filename: string) {
  const csvHeaders = ["Name", "Email", "Status", "Date Joined", "Referrals", "Earnings"]
  const csvRows = data.map((inf) => [
    inf.name,
    inf.email,
    inf.status,
    new Date(inf.dateJoined).toLocaleDateString(),
    inf.referrals,
    inf.earnings,
  ])

  const csvContent =
    [csvHeaders, ...csvRows]
      .map(row => row.map(val => `"${val}"`).join(","))
      .join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}


    const loadData = async () => {
    const { data, error } = await supabase.from("influencers").select("*")

    if (error) {
      toast({ title: "Failed to load influencers", description: error.message, variant: "destructive" })
      return
    }

    const formatted = data.map((inf) => ({
      id: inf.id.toString(),
      name: inf.name,
      email: inf.email,
      status: inf.is_approved ? "active" as const : "inactive" as const,
      dateJoined: inf.created_at,
      referrals: inf.total_conversions ?? 0,
      earnings: (inf.total_earnings ?? 0), // example £10 per conversion
      socialProfiles: {
        instagram: inf.instagram,
        twitter: inf.twitter,
        tiktok: inf.tiktok,
        youtube: inf.youtube,
        facebook: inf.facebook,
        linkedin: inf.linkedin,
      },
      pending_payment: inf.pending_payment ?? 0,
      paypal: inf.paypal,
    }))

    setInfluencers(formatted)
  }

    const loadApplications = async () => {
    const { data, error } = await supabase.from("influencers").select("*").eq("is_approved", false)

    if (error) {
      toast({ title: "Failed to load applications", description: error.message, variant: "destructive" })
      return
    }

    const formatted = data.map((app) => ({
      id: app.id.toString(),
      name: app.name,
      email: app.email,
      dateApplied: app.created_at,
      socialProfiles: {
        instagram: app.instagram,
        twitter: app.twitter,
        tiktok: app.tiktok,
        youtube: app.youtube,
        facebook: app.facebook,
        linkedin: app.linkedin,
      },
    }))

    setApplications(formatted)
  }


  // Mock data loading
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth?redirect=/admin/influencers")
      return
    }

    // In a real implementation, this would check if the user has admin privileges
    if (user && user?.role !== "admin") {
      router.push("/dashboard")
      return
    }



    if (user) {
      setIsLoading(true)
      loadData()
      loadApplications()
      loadPaymentData()
      setIsLoading(false)
    }
  }, [user, authLoading, router])

  const filteredInfluencers = influencers.filter((influencer) => {
    if (activeTab === "active" && influencer.status !== "active") return false
    if (activeTab === "inactive" && influencer.status !== "inactive") return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        influencer.name.toLowerCase().includes(query) ||
        influencer.email.toLowerCase().includes(query) ||
        influencer.id.toLowerCase().includes(query)
      )
    }

    return true
  })

  const paginatedInfluencers = filteredInfluencers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )


  const filteredApplications = applications.filter((application) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        application.name.toLowerCase().includes(query) ||
        application.email.toLowerCase().includes(query) ||
        application.id.toLowerCase().includes(query)
      )
    }

    return true
  })

const handleViewInfluencer = (influencer: Influencer) => {
    setSelectedInfluencer(influencer)
    setIsViewDialogOpen(true)
  }

const handleViewApplication = (application: Application) => {
    setSelectedInfluencer(application)
    setIsViewDialogOpen(true)
  }

  const handleApproveApplication = (application: Application) => {
    setSelectedInfluencer(application)
    setIsApproveDialogOpen(true)
  }

  const handleRejectApplication = (application: Application) => {
    setSelectedInfluencer(application)
    setIsRejectDialogOpen(true)
  }

  const handleDeleteInfluencer = (influencer: Influencer) => {
    setSelectedInfluencer(influencer)
    setIsDeleteDialogOpen(true)
  }

  const confirmApproveApplication = async () => {
    if (!selectedInfluencer) return

    const { error } = await supabase
      .from("influencers")
      .update({ is_approved: true })
      .eq("id", selectedInfluencer.id)

    if (error) {
      toast({ title: "Failed to approve", description: error.message, variant: "destructive" })
      return
    }

    await fetch("/api/send-influencer-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: selectedInfluencer.email,
        name: selectedInfluencer.name,
        status: "approved",
      }),
    })


    toast({
      title: "Application approved",
      description: `${selectedInfluencer.name}'s application has been approved.`,
    })

    setApplications((prev) => prev.filter((app) => app.id !== selectedInfluencer.id))
    loadData() // Refresh the list
    loadApplications()
    setIsApproveDialogOpen(false)
  }

  const confirmRejectApplication = async () => {
    if (!selectedInfluencer) return

    const { error } = await supabase
      .from("influencers")
      .delete()
      .eq("id", selectedInfluencer.id)

    if (error) {
      toast({ title: "Failed to reject", description: error.message, variant: "destructive" })
      return
    }

       await fetch("/api/send-influencer-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: selectedInfluencer.email,
        name: selectedInfluencer.name,
        status: "rejected",
      }),
    })


    toast({
      title: "Application rejected",
      description: `${selectedInfluencer.name}'s application has been removed.`,
    })

    setApplications((prev) => prev.filter((app) => app.id !== selectedInfluencer.id))
    setIsRejectDialogOpen(false)
  }

  const confirmDeleteInfluencer = async () => {
    if (!selectedInfluencer) return

    const { error } = await supabase
      .from("influencers")
      .delete()
      .eq("id", selectedInfluencer.id)

    if (error) {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" })
      return
    }

   await fetch("/api/send-influencer-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: selectedInfluencer.email,
        name: selectedInfluencer.name,
        status: "rejected",
      }),
    })


    toast({
      title: "Influencer deleted",
      description: `${selectedInfluencer.name} has been removed from the program.`,
    })

    setInfluencers((prev) => prev.filter((inf) => inf.id !== selectedInfluencer.id))
    setIsDeleteDialogOpen(false)
  }

  const toggleInfluencerStatus = async (influencer: Influencer) => {
    const newStatus = influencer.status === "active" ? "inactive" : "active"

    // Update local state immediately
    setInfluencers((prev) =>
      prev.map((inf) => (inf.id === influencer.id ? { ...inf, status: newStatus } : inf))
    )

    toast({
      title: `Influencer ${newStatus}`,
      description: `${influencer.name} is now ${newStatus}.`,
    })

    // Send status update email
    try {
      await fetch("/api/send-influencer-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: influencer.email,
          name: influencer.name,
          status: newStatus, // 👈 This will be "active" or "inactive"
        }),
      })
    } catch (err) {
      console.error("Error sending status change email:", err)
    }

    // Optional: update in Supabase (if you're persisting the change)
    const { error } = await supabase
      .from("influencers")
      .update({ is_approved: newStatus === "active" })
      .eq("id", influencer.id)

    if (error) {
      toast({
        title: "Status update failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  
  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <BrandHeader />
        <main className="flex-1 pt-16 pb-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#007BFF]" />
              <p className="mt-4 text-gray-600">Loading influencer data...</p>
            </div>
          </div>
        </main>
        <GlobalFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <BrandHeader />

      <main className="flex-1 pt-16 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-6 text-2xl font-bold">Influencer Management</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Influencers</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                </TabsList>

                <div className="mb-6 flex items-center">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search influencers..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <TabsContent value="all">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>All Influencers</CardTitle>
                    <CardDescription>Manage all influencers in the program</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date Joined</TableHead>
                          <TableHead>Referrals</TableHead>
                          <TableHead className="text-right">Earnings</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedInfluencers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                              No influencers found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedInfluencers.map((influencer) => (
                            <TableRow key={influencer.id}>
                              <TableCell className="font-medium">{influencer.name}</TableCell>
                              <TableCell>{influencer.email}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    influencer.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {influencer.status}
                                </span>
                              </TableCell>
                              <TableCell>{new Date(influencer.dateJoined).toLocaleDateString()}</TableCell>
                              <TableCell>{influencer.referrals}</TableCell>
                              <TableCell className="text-right">£{influencer.earnings}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleViewInfluencer(influencer)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => toggleInfluencerStatus(influencer)}>
                                      {influencer.status === "active" ? (
                                        <>
                                          <UserX className="mr-2 h-4 w-4" />
                                          Deactivate
                                        </>
                                      ) : (
                                        <>
                                          <UserCheck className="mr-2 h-4 w-4" />
                                          Activate
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleDeleteInfluencer(influencer)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-gray-500">Showing {paginatedInfluencers.length} influencers</div>
                    <Button
                      variant="outline"
                      onClick={() => exportToCSV(filteredInfluencers, "influencers.csv")}
                    >
                      Export CSV
                      <Download className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="active">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Active Influencers</CardTitle>
                    <CardDescription>Manage active influencers in the program</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Date Joined</TableHead>
                          <TableHead>Referrals</TableHead>
                          <TableHead className="text-right">Earnings</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedInfluencers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              No active influencers found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedInfluencers.map((influencer) => (
                            <TableRow key={influencer.id}>
                              <TableCell className="font-medium">{influencer.name}</TableCell>
                              <TableCell>{influencer.email}</TableCell>
                              <TableCell>{new Date(influencer.dateJoined).toLocaleDateString()}</TableCell>
                              <TableCell>{influencer.referrals}</TableCell>
                              <TableCell className="text-right">£{influencer.earnings}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleViewInfluencer(influencer)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => toggleInfluencerStatus(influencer)}>
                                      <UserX className="mr-2 h-4 w-4" />
                                      Deactivate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleDeleteInfluencer(influencer)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-gray-500">Showing {paginatedInfluencers.length} active influencers</div>
                    <Button variant="outline">
                      Export CSV
                      <Download className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="inactive">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Inactive Influencers</CardTitle>
                    <CardDescription>Manage inactive influencers in the program</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Date Joined</TableHead>
                          <TableHead>Referrals</TableHead>
                          <TableHead className="text-right">Earnings</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedInfluencers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              No inactive influencers found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedInfluencers.map((influencer) => (
                            <TableRow key={influencer.id}>
                              <TableCell className="font-medium">{influencer.name}</TableCell>
                              <TableCell>{influencer.email}</TableCell>
                              <TableCell>{new Date(influencer.dateJoined).toLocaleDateString()}</TableCell>
                              <TableCell>{influencer.referrals}</TableCell>
                              <TableCell className="text-right">£{influencer.earnings}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleViewInfluencer(influencer)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => toggleInfluencerStatus(influencer)}>
                                      <UserCheck className="mr-2 h-4 w-4" />
                                      Activate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleDeleteInfluencer(influencer)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-gray-500">
                      Showing {paginatedInfluencers.length} inactive influencers
                    </div>
                    <Button variant="outline">
                      Export CSV
                      <Download className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="applications">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Pending Applications</CardTitle>
                    <CardDescription>Review and manage influencer applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Date Applied</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredApplications.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              No pending applications found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredApplications.map((application) => (
                            <TableRow key={application.id}>
                              <TableCell className="font-medium">{application.name}</TableCell>
                              <TableCell>{application.email}</TableCell>
                              <TableCell>{new Date(application.dateApplied).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleViewApplication(application)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-green-600"
                                    onClick={() => handleApproveApplication(application)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-600"
                                    onClick={() => handleRejectApplication(application)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-gray-500">
                      Showing {filteredApplications.length} pending applications
                    </div>
                    <Button variant="outline">
                      Export CSV
                      <Download className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

          <TabsContent value="payments">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Pending Payments</CardTitle>
                <CardDescription>Mark influencers as paid once their commissions are processed</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>paypal email</TableHead>
                      <TableHead>Pending (£)</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentInfluencers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-6">
                          No influencers pending payment
                        </TableCell>
                      </TableRow>
                    ) : (
                      paymentInfluencers.map((inf) => (
                        <TableRow key={inf.id}>
                          <TableCell>{inf.name}</TableCell>
                          <TableCell>{inf.email}</TableCell>
                          <TableCell>{inf.paypal}</TableCell>
                          <TableCell>£{inf.pending_payment}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsPaid(inf.id, inf.email, inf.name, inf.pending_payment)}
                            >
                              Mark as Paid
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

            <div className="flex justify-end mt-4 gap-2">
              <Button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                Previous
              </Button>
              <span className="self-center text-sm text-gray-600">Page {currentPage}</span>
              <Button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage * itemsPerPage >= filteredInfluencers.length}
              >
                Next
              </Button>
            </div>

            </Tabs>
          </div>
        </div>
      </main>

      <GlobalFooter />

      {/* View Influencer/Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{activeTab === "applications" ? "Application Details" : "Influencer Details"}</DialogTitle>
            <DialogDescription>
              {activeTab === "applications" ? "Review the application details" : "View influencer information"}
            </DialogDescription>
          </DialogHeader>
          {selectedInfluencer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Name</Label>
                  <p className="font-medium">{selectedInfluencer.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Email</Label>
                  <p className="font-medium">{selectedInfluencer.email}</p>
                </div>
                {activeTab === "applications" && "dateApplied" in selectedInfluencer  ? (
                  <>
                    <div>
                      <Label className="text-xs text-gray-500">Date Applied</Label>
                      <p className="font-medium">{new Date(selectedInfluencer.dateApplied).toLocaleDateString()}</p>
                    </div>
                  </>
                ) : "dateJoined" in selectedInfluencer ? (
                  <>
                    <div>
                      <Label className="text-xs text-gray-500">Date Joined</Label>
                      <p className="font-medium">{new Date(selectedInfluencer.dateJoined).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Status</Label>
                      <p className="font-medium capitalize">{selectedInfluencer.status}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Referrals</Label>
                      <p className="font-medium">{selectedInfluencer.referrals}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Earnings</Label>
                      <p className="font-medium">£{selectedInfluencer.earnings}</p>
                    </div>
                  </>
                ): null}
              </div>

              <div>
                <Label className="text-xs text-gray-500">Social Profiles</Label>
                <div className="mt-2 space-y-2">
                  {selectedInfluencer.socialProfiles.instagram && (
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-pink-600" />
                      <span>{selectedInfluencer.socialProfiles.instagram}</span>
                    </div>
                  )}
                  {selectedInfluencer.socialProfiles.twitter && (
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-blue-400" />
                      <span>{selectedInfluencer.socialProfiles.twitter}</span>
                    </div>
                  )}
                  {selectedInfluencer.socialProfiles.linkedin && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-blue-600" />
                      <span>{selectedInfluencer.socialProfiles.linkedin}</span>
                    </div>
                  )}
                  {selectedInfluencer.socialProfiles.website && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-gray-600" />
                      <a
                        href={selectedInfluencer.socialProfiles.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedInfluencer.socialProfiles.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {activeTab === "applications" && selectedInfluencer && "dateApplied" in selectedInfluencer && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    handleRejectApplication(selectedInfluencer)
                  }}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    handleApproveApplication(selectedInfluencer)
                  }}
                >
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Application Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Application</DialogTitle>
            <DialogDescription>Are you sure you want to approve this application?</DialogDescription>
          </DialogHeader>
          {selectedInfluencer && (
            <div>
              <p>
                <span className="font-medium">{selectedInfluencer.name}</span> will be added as an active influencer in
                the program.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApproveApplication}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Application Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>Are you sure you want to reject this application?</DialogDescription>
          </DialogHeader>
          {selectedInfluencer && (
            <div>
              <p>
                <span className="font-medium">{selectedInfluencer.name}</span>'s application will be rejected and
                removed from the system.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRejectApplication}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Influencer Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Influencer</DialogTitle>
            <DialogDescription>Are you sure you want to delete this influencer?</DialogDescription>
          </DialogHeader>
          {selectedInfluencer && (
            <div>
              <p>
                <span className="font-medium">{selectedInfluencer.name}</span> will be permanently removed from the
                influencer program.
              </p>
              <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteInfluencer}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
