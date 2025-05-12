"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BrandHeader } from "@/components/brand-header"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle, ArrowLeft, Loader2, Save } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AccountPage() {
const { user, isLoading, updateProfile, updatePassword } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user) {
      // Initialize form with user data
      setName(user.name || "")
      setEmail(user.email || "")
    }
  }, [user, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#007BFF]" />
        <p className="mt-4 text-gray-600">Loading your account...</p>
      </div>
    )
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)

    try {
      await updateProfile({ name })
      setSuccess("Profile updated successfully")
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long")
      return
    }

    setIsSaving(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      })

      if (signInError) {
        throw new Error("Current password is incorrect")
      }

      await updatePassword( newPassword)
      setSuccess("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      setError(err.message || "Failed to update password")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <BrandHeader />

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center">
              <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold">Account Settings</h1>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="password">Password & Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    {success && (
                      <Alert className="mb-4 border-green-200 bg-green-50">
                        <AlertDescription className="text-green-800">{success}</AlertDescription>
                      </Alert>
                    )}
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={email} disabled className="h-12 bg-gray-50" />
                        <p className="text-xs text-gray-500">Email cannot be changed for security reasons</p>
                      </div>
                      <Button type="submit" className="brand-button" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Password & Security</CardTitle>
                    <CardDescription>Update your password and security settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    {success && (
                      <Alert className="mb-4 border-green-200 bg-green-50">
                        <AlertDescription className="text-green-800">{success}</AlertDescription>
                      </Alert>
                    )}
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="h-12"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="h-12"
                          required
                        />
                        <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="h-12"
                          required
                        />
                      </div>
                      <Button type="submit" className="brand-button" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Update Password
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
