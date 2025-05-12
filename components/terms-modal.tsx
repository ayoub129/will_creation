"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Terms of Service</DialogTitle>
          <DialogDescription className="text-gray-500">Last updated: May 5, 2025</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By accessing or using My Easy Will, you agree to be bound by these Terms of Service. If you do not agree to
            these terms, please do not use our service.
          </p>

          <h2 className="text-xl font-semibold">2. Description of Service</h2>
          <p>
            My Easy Will provides an online platform for creating legally valid wills. Our service is designed to help
            individuals create basic wills and is not a substitute for legal advice for complex estates.
          </p>

          <h2 className="text-xl font-semibold">3. User Accounts</h2>
          <p>
            To use certain features of our service, you must create an account. You are responsible for maintaining the
            confidentiality of your account information and for all activities that occur under your account.
          </p>

          <h2 className="text-xl font-semibold">4. Fees and Payment</h2>
          <p>
            The current fee for creating a will through our service is £15. We reserve the right to change our fees at
            any time. All payments are processed securely through our payment processor.
          </p>

          <h2 className="text-xl font-semibold">5. Influencer Program</h2>
          <p>
            Participants in our influencer program earn £5 for each successful referral. Payments are made according to
            our influencer program terms, which are provided separately to program participants.
          </p>

          <h2 className="text-xl font-semibold">6. Disclaimer of Warranties</h2>
          <p>
            Our service is provided "as is" without warranties of any kind, either express or implied. We do not
            guarantee that our service will meet your requirements or be error-free.
          </p>

          <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
          <p>
            In no event shall My Easy Will be liable for any indirect, incidental, special, consequential, or punitive
            damages arising out of or relating to your use of our service.
          </p>

          <h2 className="text-xl font-semibold">8. Governing Law</h2>
          <p>
            These Terms of Service shall be governed by the laws of the United Kingdom, without regard to its conflict
            of law provisions.
          </p>

          <h2 className="text-xl font-semibold">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. We will notify users of any significant
            changes by posting a notice on our website.
          </p>

          <h2 className="text-xl font-semibold">10. Contact Us</h2>
          <p>If you have any questions about these Terms of Service, please contact us at terms@makewillonline.com.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
