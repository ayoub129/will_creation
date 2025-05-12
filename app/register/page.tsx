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
import { AlertCircle, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    try {
      await register(name, email, password)
      // Redirect is handled in the auth context
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
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
                <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
                <CardDescription className="text-center">Sign up to create and manage your will</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12"
                    />
                    <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 brand-button" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 border-t p-6">
                <div className="text-center text-sm">
                  <span className="text-gray-600">Already have an account? </span>
                  <Link href="/login" className="text-[#007BFF] hover:underline">
                    Log in
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
