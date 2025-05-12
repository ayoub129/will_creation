"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Privacy Policy</DialogTitle>
          <DialogDescription className="text-gray-500">Last updated: May 5, 2025</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p>
            My Easy Will ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when you use our service.
          </p>

          <h2 className="text-xl font-semibold">2. Information We Collect</h2>
          <p>We collect information that you provide directly to us when you:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create an account</li>
            <li>Create a will</li>
            <li>Contact our customer support</li>
            <li>Participate in our influencer program</li>
          </ul>

          <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze trends, usage, and activities</li>
          </ul>

          <h2 className="text-xl font-semibold">4. Sharing Your Information</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Service providers who perform services on our behalf</li>
            <li>Professional advisors, such as lawyers, when necessary</li>
            <li>Law enforcement or other government agencies, as required by law</li>
          </ul>

          <h2 className="text-xl font-semibold">5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of
            transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute
            security.
          </p>

          <h2 className="text-xl font-semibold">6. Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The right to access your personal information</li>
            <li>The right to correct inaccurate information</li>
            <li>The right to delete your information</li>
            <li>The right to restrict or object to processing</li>
          </ul>

          <h2 className="text-xl font-semibold">7. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2 className="text-xl font-semibold">8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@makewillonline.com.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
