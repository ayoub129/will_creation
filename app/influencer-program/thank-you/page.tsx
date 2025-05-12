import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BrandHeader } from "@/components/brand-header"
import { GlobalFooter } from "@/components/global-footer"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <BrandHeader />

      <main className="flex-1 pt-16 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-md">
            <Card className="border-0 shadow-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Application Received</CardTitle>
                <CardDescription>Thank you for applying to the My Easy Will Influencer Program</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-4">
                  We've received your application and will review it shortly. You can expect to hear back from us within
                  48 hours.
                </p>
                <p className="mb-4">
                  In the meantime, you might want to familiarize yourself with our product by creating your own will.
                </p>
                <div className="mt-6">
                  <Link href="/create-will">
                    <Button className="brand-button">
                      Create Your Will
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t p-6">
                <p className="text-sm text-gray-500">
                  Have questions? Contact us at{" "}
                  <a href="mailto:influencers@makewillonline.com" className="text-[#007BFF] hover:underline">
                    influencers@makewillonline.com
                  </a>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  )
}
