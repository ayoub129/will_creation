"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [accessToken, setAccessToken] = useState("")

  useEffect(() => {
    const hash = window.location.hash
    const token = new URLSearchParams(hash.replace("#", "?")).get("access_token")
    if (token) {
      setAccessToken(token)
      supabase.auth.setSession({ access_token: token, refresh_token: token }) // 👈 Required for update
    } else {
      setError("Missing token. Try the link in your email again.")
    }
  }, [])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })

      if (error) {
        setError(error.message || "Failed to update password.")
        return
      }

      setIsSuccess(true)
    } catch (err: any) {
      setError(err.message || "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4">
      <div className="max-w-md w-full mx-auto bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-bold text-center mb-2">Set New Password</h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Enter your new password below to reset your account.
        </p>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isSuccess ? (
          <div className="text-center py-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-green-800 mb-2">Password Updated</h3>
            <p className="text-gray-600 mb-4">You can now log in using your new password.</p>
            <Link href="/auth">
              <Button variant="outline">Back to Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter a new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
