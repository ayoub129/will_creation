"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check } from "lucide-react"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubmitted(true)
    setIsSubmitting(false)
  }

  const resetForm = () => {
    setName("")
    setEmail("")
    setMessage("")
    setSubmitted(false)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
          // Reset form when closing if it was submitted
          if (submitted) {
            setTimeout(resetForm, 300)
          }
        }
      }}
    >
      <DialogContent className="max-w-md border-0 shadow-lg rounded-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-emerald-700">Get in Touch</DialogTitle>
        </DialogHeader>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                Message
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you?"
                rows={4}
                required
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        ) : (
          <div className="py-10 text-center space-y-5">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-emerald-700">Message Sent!</h3>
            <p className="text-gray-600">
              Thank you for reaching out. Our team will get back to you as soon as possible.
            </p>
            <Button
              onClick={resetForm}
              variant="outline"
              className="mt-6 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium rounded-lg"
            >
              Send Another Message
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
