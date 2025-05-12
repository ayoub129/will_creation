import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BrandHeader } from "@/components/brand-header"
import { GlobalFooter } from "@/components/global-footer"
import { ArrowLeft } from "lucide-react"

export default function InfluencerTermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <BrandHeader />

      <main className="flex-1 pt-16 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-3xl">
            <Link href="/influencer-program">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Influencer Program
              </Button>
            </Link>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h1 className="mb-6 text-3xl font-bold">Influencer Program Terms and Conditions</h1>

              <div className="prose max-w-none">
                <p className="text-gray-600">Last updated: May 5, 2025</p>

                <h2 className="mt-8 text-xl font-bold">1. Introduction</h2>
                <p>
                  These Terms and Conditions govern your participation in the My Easy Will Influencer Program. By
                  applying to or participating in the program, you agree to these terms in full.
                </p>

                <h2 className="mt-6 text-xl font-bold">2. Eligibility</h2>
                <p>To be eligible for the My Easy Will Influencer Program, you must:</p>
                <ul className="list-disc pl-6">
                  <li>Be at least 18 years of age</li>
                  <li>Have an active online presence with an engaged audience</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Have a valid bank account or PayPal account for receiving payments</li>
                  <li>Not be engaged in any activities that could harm the reputation of My Easy Will</li>
                </ul>

                <h2 className="mt-6 text-xl font-bold">3. Application and Approval</h2>
                <p>
                  All applications to the Influencer Program are subject to review and approval by My Easy Will. We
                  reserve the right to reject any application without providing a reason. Approval decisions are final.
                </p>

                <h2 className="mt-6 text-xl font-bold">4. Commission Structure</h2>
                <p>
                  As an approved influencer, you will earn £10 for each customer who creates a will through your unique
                  referral link. Commissions are only paid for completed and paid will creations.
                </p>

                <h2 className="mt-6 text-xl font-bold">5. Tracking and Reporting</h2>
                <p>
                  We use cookies and tracking technology to attribute referrals to your account. A referral is valid if:
                </p>
                <ul className="list-disc pl-6">
                  <li>The customer clicks your unique referral link</li>
                  <li>
                    The customer completes the will creation process and makes payment within 30 days of clicking your
                    link
                  </li>
                  <li>The customer has not previously created a will with My Easy Will</li>
                </ul>

                <h2 className="mt-6 text-xl font-bold">6. Payment Terms</h2>
                <p>
                  Payments are processed monthly for all commissions earned in the previous month. The minimum payment
                  threshold is £20. If your earnings do not reach the minimum threshold, they will roll over to the next
                  month.
                </p>

                <h2 className="mt-6 text-xl font-bold">7. Marketing Guidelines</h2>
                <p>When promoting My Easy Will, you must:</p>
                <ul className="list-disc pl-6">
                  <li>
                    Clearly disclose your relationship with My Easy Will in accordance with applicable laws and
                    regulations
                  </li>
                  <li>
                    Only use approved marketing materials or create content that accurately represents our services
                  </li>
                  <li>Not make false or misleading claims about My Easy Will or its services</li>
                  <li>Not engage in spamming or any other unethical marketing practices</li>
                  <li>
                    Not use the My Easy Will name or logo in a way that suggests you are an employee or official
                    representative
                  </li>
                </ul>

                <h2 className="mt-6 text-xl font-bold">8. Term and Termination</h2>
                <p>
                  Your participation in the Influencer Program continues until terminated by either party. My Easy Will
                  reserves the right to terminate your participation at any time, with or without cause. You may
                  withdraw from the program at any time by notifying us in writing.
                </p>

                <h2 className="mt-6 text-xl font-bold">9. Modifications to the Program</h2>
                <p>
                  My Easy Will reserves the right to modify these terms, commission rates, or any aspect of the
                  Influencer Program at any time. We will notify you of significant changes via email.
                </p>

                <h2 className="mt-6 text-xl font-bold">10. Limitation of Liability</h2>
                <p>
                  My Easy Will is not liable for any direct, indirect, incidental, special, or consequential damages
                  arising out of or in any way connected with your participation in the Influencer Program.
                </p>

                <h2 className="mt-6 text-xl font-bold">11. Governing Law</h2>
                <p>
                  These terms are governed by the laws of the United Kingdom. Any disputes arising from the Influencer
                  Program shall be resolved in the courts of the United Kingdom.
                </p>

                <h2 className="mt-6 text-xl font-bold">12. Contact Information</h2>
                <p>
                  If you have any questions about these terms or the Influencer Program, please contact us at{" "}
                  <a href="mailto:influencers@makewillonline.com" className="text-[#007BFF] hover:underline">
                    influencers@makewillonline.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  )
}
