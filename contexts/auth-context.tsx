"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

interface User {
  id: string
  email: string
  name?: string
  role?: string // ✅ Add role field
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  updateProfile: (payload: { name?: string }) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const getSessionUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) console.error("Session fetch error", error)

      if (data?.user) {
        const { id, email, user_metadata } = data.user
        if (!id || !email) {
          setUser(null)
          return
        }

        setUser({
          id,
          email,
          name: user_metadata?.fullName || "",
          role: user_metadata?.role , // ✅ Default role fallback
        })
      } else {
        setUser(null)
      }

      setIsLoading(false)
    }

    getSessionUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user
      if (u) {
        setUser({
          id: u.id,
          email: u.email!,
          name: u.user_metadata?.fullName || "",
          role: u.user_metadata?.role , // ✅ Keep role updated
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullName: name,
            role: "user", 
          },
        },
      })

      if (error) {
        toast({ title: "Registration failed", description: error.message, variant: "destructive" })
        throw error
      }

      toast({
        title: "Account created",
        description: "Check your email to verify your account before logging in.",
      })
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error || !data.user) {
        toast({ title: "Login failed", description: error?.message || "Invalid credentials", variant: "destructive" })
        throw error
      }

      const { id, email: refreshedEmail, user_metadata } = data.user
      if (!id || !refreshedEmail) {
          setUser(null)
          return
      }

      setUser({ id, email: refreshedEmail, name: user_metadata?.fullName, role: user_metadata?.role }) // 👈 include role here

      toast({ title: "Login successful", description: "Welcome back!" })

      const redirect = new URLSearchParams(window.location.search).get("redirect")
      if (redirect) {
        router.push(redirect)
      } else if (typeof window !== "undefined" && window.location.pathname === "/create-will/payment") {
        router.refresh() // stay on the same page and just refresh it
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.message || "An error occurred during login.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })

      const redirect = new URLSearchParams(window.location.search).get("redirect")
      if (redirect) {
        router.push(redirect)
      } else if (typeof window !== "undefined" && window.location.pathname === "/create-will/payment") {
        router.refresh() // stay on the same page and just refresh it
      } else {
        router.push("/dashboard")
      }


      if (error) {
        toast({ title: "Google login failed", description: error.message, variant: "destructive" })
      }
    } catch (err: any) {
      toast({
        title: "Google login failed",
        description: err.message || "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const updateProfile = async ({ name }: { name?: string }) => {
    if (!user) return
    try {
      const { error } = await supabase.auth.updateUser({
        data: { fullName: name },
      })

      if (error) throw error

      setUser((prev) => (prev ? { ...prev, name } : prev))
      toast({ title: "Profile updated", description: "Your name was updated successfully." })
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err.message || "Something went wrong",
        variant: "destructive",
      })
      throw err
    }
  }

  const updatePassword = async (newPassword: string) => {
    if (!user) return
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      toast({ title: "Password updated", description: "Your password has been changed successfully." })
    } catch (err: any) {
      toast({
        title: "Password update failed",
        description: err.message || "An error occurred",
        variant: "destructive",
      })
      throw err
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })

      if (error) {
        toast({
          title: "Reset failed",
          description: error.message,
          variant: "destructive",
        })
        throw error
      }

      toast({
        title: "Check your email",
        description: "We sent you a link to reset your password.",
      })
    } catch (err: any) {
      throw err
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
    } catch (err: any) {
      toast({ title: "Logout failed", description: err.message || "Please try again.", variant: "destructive" })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loginWithGoogle,
        updateProfile,
        updatePassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
