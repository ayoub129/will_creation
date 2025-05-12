"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QuillIcon } from "@/components/quill-icon"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      // Redirect is handled in the auth context
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.")
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
                <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
                <CardDescription className="text-center">Log in to access your will and account</CardDescription>
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/forgot-password" className="text-sm text-[#007BFF] hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 brand-button" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 border-t p-6">
                <div className="text-center text-sm">
                  <span className="text-gray-600">Don't have an account? </span>
                  <Link href="/register" className="text-[#007BFF] hover:underline">
                    Create one now
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
