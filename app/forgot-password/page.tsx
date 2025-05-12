"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QuillIcon } from "@/components/quill-icon"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await resetPassword(email)
      setIsSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Password reset failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 z-10 w-full border-b bg-white shadow-sm">
        <div className="brand-gradient h-1 w-full"></div>
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#007BFF] text-white">
              <QuillIcon className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">My Easy Will</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-md">
            <Card className="border-0 shadow-md">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
                <CardDescription className="text-center">
                  Enter your email to receive password reset instructions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isSubmitted ? (
                  <div className="text-center py-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-green-800 mb-2">Email Sent</h3>
                    <p className="text-gray-600 mb-4">
                      If an account exists with the email {email}, you'll receive instructions to reset your password.
                    </p>
                    <Link href="/auth">
                      <Button variant="outline" className="mt-2">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>
                    <Button type="submit" className="w-full h-12 brand-button" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Reset Instructions"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 border-t p-6">
                <div className="text-center text-sm">
                  <Link href="/auth" className="text-[#007BFF] hover:underline">
                    <ArrowLeft className="inline mr-1 h-3 w-3" />
                    Back to login
                  </Link>
                </div>
              </CardFooter>
            </Card>
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
