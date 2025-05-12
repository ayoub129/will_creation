"use client"

import { Play } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function VideoModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border-blue-100 hover:bg-white hover:border-blue-200 text-blue-600 font-medium rounded-full px-4 py-2 shadow-md transition-all duration-300 hover:shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
            <Play className="h-4 w-4 ml-0.5" />
          </div>
          <span>Watch Video</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 bg-black overflow-hidden">
        <div className="relative aspect-video w-full">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
            title="Why You Need a Will"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="p-4 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Why Everyone Needs a Will</DialogTitle>
            <DialogDescription>
              Learn about the importance of having a legally valid will and how it protects your loved ones.
            </DialogDescription>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}
