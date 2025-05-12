"use client"

import { useState } from "react"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { PrivacyModal } from "./privacy-modal"
import { TermsModal } from "./terms-modal"
import { ContactModal } from "./contact-modal"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { SolicitorReferral } from "./solicitor-referral"

export function SiteFooter() {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isSolicitorOpen, setIsSolicitorOpen] = useState(false)

  return (
    <>
      <footer className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 py-12 relative">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.5),rgba(255,255,255,0.8))] opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-6 md:mb-0">
              <Link href="/" className="flex items-center group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <span className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                  My Easy Will
                </span>
              </Link>
              <span className="text-sm text-gray-500 ml-4">© {new Date().getFullYear()} All rights reserved</span>
            </div>

            <nav className="flex flex-wrap justify-center gap-8 mb-6 md:mb-0">
              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Privacy
              </button>
              <button
                onClick={() => setIsTermsOpen(true)}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Terms
              </button>
              <button
                onClick={() => setIsContactOpen(true)}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Contact
              </button>
              <Link
                href="/influencer-program"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                onClick={() => {
                  // Ensure page loads at top when clicking this link
                  if (typeof window !== "undefined") {
                    setTimeout(() => window.scrollTo(0, 0), 100)
                  }
                }}
              >
                Earn £5 Per Referral
              </Link>
            </nav>

            <div className="flex space-x-5 mt-4 md:mt-0">
              <Link
                href="#"
                aria-label="Facebook"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
              >
                <Facebook size={22} />
              </Link>
              <Link
                href="#"
                aria-label="Twitter"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
              >
                <Twitter size={22} />
              </Link>
              <Link
                href="#"
                aria-label="Instagram"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
              >
                <Instagram size={22} />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
              >
                <Linkedin size={22} />
              </Link>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 pt-4 border-t border-blue-100">
            Not legal advice.{" "}
            <button
              onClick={() => setIsSolicitorOpen(true)}
              className="text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              Consult a solicitor for complex estates
            </button>
            .
          </div>
        </div>
      </footer>

      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <Dialog open={isSolicitorOpen} onOpenChange={setIsSolicitorOpen}>
        <DialogContent className="sm:max-w-2xl">
          <SolicitorReferral
            onContinueAnyway={() => setIsSolicitorOpen(false)}
            complexityFactors={{
              hasOverseasAssets: true,
              hasBusinessAssets: true,
              hasTrusts: true,
              highValue: true,
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
