"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Save, User, LogOut } from "lucide-react"
import { QuillIcon } from "@/components/quill-icon"
import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function BrandHeader({ showSave = false, onSave = () => {} }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith("/auth")

  return (
    <header className="fixed top-0 z-10 w-full border-b bg-white shadow-sm">
      <div className="brand-gradient h-1 w-full"></div>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#007BFF] text-white">
            <QuillIcon className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">My Easy Will</span>
        </Link>
        <div className="flex items-center gap-3">
          {showSave && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              className="flex items-center gap-1 border-[#007BFF] text-[#007BFF]"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save Progress</span>
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
                  <User className="h-4 w-4" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">{user.name}</div>
                <div className="px-2 py-1 text-xs text-muted-foreground">{user.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account">Account Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !isAuthPage && (
              <Link href="/auth">
                <Button variant="outline" size="sm" className="flex items-center gap-1 border-[#007BFF] text-[#007BFF]">
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  )
}
