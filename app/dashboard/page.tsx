"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BrandHeader } from "@/components/brand-header"
import { useAuth } from "@/contexts/auth-context"
import { FileText, Plus, Settings, LogOut, Loader2, Pencil } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  const [wills, setWills] = useState<any[]>([])
  const [loadingWills, setLoadingWills] = useState(false)
  console.log(user)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

    useEffect(() => {
    const fetchWills = async () => {
      if (!user) return

      setLoadingWills(true)
      const { data, error } = await supabase
        .from("wills")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching wills:", error.message)
      } else {
        setWills(data || [])
      }

      setLoadingWills(false)
    }

    fetchWills()
  }, [user])

  // Show loading state while checking authentication
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#007BFF]" />
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <BrandHeader />

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
                <p className="mt-1 text-gray-600">Manage your wills and account settings</p>
              </div>
              <div className="mt-4 flex space-x-2 md:mt-0">
                <Button variant="outline" onClick={() => router.push("/account")} className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Account Settings
                </Button>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="flex items-center gap-2 text-red-500 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </div>

            {/* My Wills Section */}
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">My Wills</h2>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Create New Will Card */}
                <Card className="border-dashed border-2 hover:border-[#007BFF] transition-colors">
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                    <div className="rounded-full bg-[#007BFF]/10 p-4 mb-4">
                      <Plus className="h-8 w-8 text-[#007BFF]" />
                    </div>
                    <h3 className="text-xl font-medium text-center mb-2">Create a New Will</h3>
                    <p className="text-gray-500 text-center mb-4">Start the process of creating a new will</p>
                    <Link href="/create-will">
                      <Button className="brand-button">Create Will</Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Existing Wills */}
                {loadingWills ? (
                  <p className="text-gray-500">Loading your wills...</p>
                ) : wills.length === 0 ? (
                  <p className="text-gray-500">You haven’t created any wills yet.</p>
                ) : (
                  wills.map((will) => (
                    <Card key={will.id} className="border hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">
                          {will.first_name} {will.last_name}
                        </CardTitle>
                        <CardDescription>
                          Last updated: {new Date(will.created_at).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-2 text-green-600 mb-4">
                          <div className="h-2 w-2 rounded-full bg-green-600"></div>
                          <span className="text-sm font-medium">Saved</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Executor:</span>
                            <span className="font-medium">{will.primary_executor?.name || "-"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Main Beneficiary:</span>
                            <span className="font-medium">{will.main_beneficiary?.name || "-"}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => {
                            localStorage.removeItem("myEasyWill_savedProgress")
                            router.push(`/create-will/review?view=${will.id}`)
                          }}
                        >
                          <FileText className="h-4 w-4" />
                          View Will
                        </Button>

                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => {
                            localStorage.removeItem("myEasyWill_savedProgress")
                            router.push(`/create-will?edit=${will.id}`)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          Edit Will
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </section>

            {/* Quick Actions Section */}
            {/* <section>
              <h2 className="mb-4 text-2xl font-bold">Quick Actions</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <ActionCard
                  title="Update Beneficiaries"
                  description="Add or remove people who will inherit your estate"
                  href="/update-beneficiaries"
                />
                <ActionCard
                  title="Change Executors"
                  description="Update who will handle your estate"
                  href="/update-executors"
                />
                <ActionCard
                  title="Download Documents"
                  description="Access your will and related documents"
                  href="/documents"
                />
              </div>
            </section> */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6 text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} My Easy Will</p>
        </div>
      </footer>
    </div>
  )
}

interface ActionCardProps {
  title: string
  description: string
  href: string
}

function ActionCard({ title, description, href }: ActionCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
