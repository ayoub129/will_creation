"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SquircleIcon as QuillIcon, Download, Mail, Printer, Home, CheckCircle, Share2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { WillDocument } from "@/components/pdf/WillDocument"
import { pdf } from "@react-pdf/renderer";
import { useSearchParams } from "next/navigation"

export default function DownloadWill() {
  const router = useRouter()
  const [isDownloading, setIsDownloading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [emailAddress, setEmailAddress] = useState("")
  const [showEmailForm, setShowEmailForm] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const [willData, setWillData] = useState<any>(null)
  const searchParams = useSearchParams()
  const willId = searchParams.get("will")

  const handlePrint = async () => {
    if (!willData) return;

    const blob = await pdf(<WillDocument will={willData} />).toBlob();
    const blobUrl = URL.createObjectURL(blob);

    const printWindow = window.open(blobUrl);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  };

useEffect(() => {
  const fetchWillWithPaymentCheck = async () => {
    if (!user) return;

    let willQuery = supabase.from("wills").select("*");

    if (willId) {
      willQuery = willQuery.eq("id", willId);
    } else {
      willQuery = willQuery.eq("user_id", user.id).order("created_at", { ascending: false }).limit(1);
    }

    const { data: will, error: willError } = await willQuery.single();
    if (willError || !will) {
      console.error("Error fetching will:", willError);
      return;
    }

    // Check if payment exists for this will
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("id")
      .eq("will_id", will.id)
      .single();

    if (paymentError || !payment) {
      toast({
        title: "Access Denied",
        description: "You must complete your payment before downloading the will.",
        variant: "destructive",
      });
      router.push("/create-will/payment?will=" + will.id);
      return;
    }

    setWillData(will);
  };

  fetchWillWithPaymentCheck();
}, [user, willId]);


const handleEmailWill = async () => {
  if (!showEmailForm) return setShowEmailForm(true);

  if (!emailAddress || !emailAddress.includes("@")) {
    toast({
      title: "Invalid Email",
      description: "Please enter a valid email address.",
      variant: "destructive",
    });
    return;
  }

  try {
    if (!willData || !user) return;

    // Generate PDF blob
    const blob = await pdf(<WillDocument will={willData} />).toBlob();

    // Generate filename
    const fileName = `wills/will-${user.id}-${Date.now()}.pdf`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("public-wills")
      .upload(fileName, blob, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage.from("public-wills").getPublicUrl(fileName);
    const publicUrl = urlData?.publicUrl;

    // Update will record with pdf_url
    await supabase
      .from("wills")
      .update({ pdf_url: publicUrl })
      .eq("id", willData.id);

    // Call backend to send email
    const res = await fetch("/api/send-will-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailAddress, pdfUrl: publicUrl }),
    });

    if (!res.ok) throw new Error("Failed to send email");

    setIsEmailSent(true);
    toast({ title: "Success", description: "Will sent to email." });
    setTimeout(() => {
      setIsEmailSent(false);
      setShowEmailForm(false);
      setEmailAddress("");
    }, 3000);
  } catch (err) {
    console.error("Email send error:", err);
    toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
  }
};

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 z-10 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <QuillIcon className="h-8 w-8 text-[#007BFF]" />
            <span className="text-xl font-bold">My Easy Will</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto px-4 py-4">
          <div className="mx-auto max-w-md">
            <div className="mb-6 rounded-lg bg-green-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-600" />
                <div>
                  <h2 className="text-lg font-bold text-green-800">Your Will is Ready!</h2>
                  <p className="mt-1 text-green-700">
                    Thank you for your purchase. Your legally valid will is now ready to download.
                  </p>
                </div>
              </div>
            </div>

            {isEmailSent && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Email Sent</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your will has been sent to your email address.
                </AlertDescription>
              </Alert>
            )}

            <Card className="mb-6 border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Download Your Will</CardTitle>
                <CardDescription>Your legally compliant will is ready</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center py-6">
                  <div className="relative h-[220px] w-[170px] overflow-hidden rounded-md border bg-white p-4 shadow">
                    <div className="space-y-3">
                      <div className="flex items-center justify-center">
                        <QuillIcon className="h-8 w-8 text-[#007BFF]" />
                      </div>
                      <div className="h-px bg-gray-200" />
                      <div className="text-center text-base font-medium">Last Will and Testament</div>
                      <div className="text-center text-sm text-gray-500">John Smith</div>
                      <div className="space-y-2 pt-4">
                        <div className="h-1 w-full rounded bg-gray-200" />
                        <div className="h-1 w-full rounded bg-gray-200" />
                        <div className="h-1 w-3/4 rounded bg-gray-200" />
                        <div className="h-1 w-full rounded bg-gray-200" />
                        <div className="h-1 w-1/2 rounded bg-gray-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4 pt-2">
                {willData && (
                  <PDFDownloadLink
                    document={<WillDocument will={willData} />}
                    fileName="my-will.pdf"
                    className="w-full"
                  >
                    {({ loading }) => (
                      <Button className="w-full bg-green-600 hover:bg-green-700 h-14 text-base" disabled={loading}>
                        <Download className="mr-2 h-5 w-5" />
                        {loading ? "Preparing..." : "Download Will (PDF)"}
                      </Button>
                    )}
                  </PDFDownloadLink>
                )}

                {showEmailForm ? (
                  <div className="w-full space-y-3">
                    <Label htmlFor="email" className="text-base">
                      Email Address
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="h-12 flex-1"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                      />
                      <Button variant="outline" className="h-12" onClick={handleEmailWill}>
                        Send
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full gap-4">
                    <Button variant="outline" className="flex-1 h-12" onClick={handleEmailWill}>
                      <Mail className="mr-2 h-5 w-5" />
                      Email Will
                    </Button>
                    <Button variant="outline" className="flex-1 h-12" onClick={handlePrint}>
                      <Printer className="mr-2 h-5 w-5" />
                      Print Will
                    </Button>
                  </div>
                )}

                {/* <Button variant="ghost" className="w-full h-12 text-gray-500">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share with Executor
                </Button> */}
              </CardFooter>
            </Card>

            <Card className="mb-6 border-0 shadow-sm">
              <CardHeader className="pb-3 bg-blue-50">
                <CardTitle className="text-xl text-blue-800">Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-5">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#007BFF] text-white text-lg font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Print your will</h3>
                    <p className="text-gray-600">Print on good quality paper. Make at least two copies.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#007BFF] text-white text-lg font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Sign with witnesses</h3>
                    <p className="text-gray-600">
                      Sign in the presence of two witnesses who are not beneficiaries or spouses of beneficiaries.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#007BFF] text-white text-lg font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Store safely</h3>
                    <p className="text-gray-600">Keep your will in a safe place and tell your executor where it is.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Legal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-5">
                <p className="text-gray-700">This will complies with the UK Wills Act 1837.</p>
                <div className="rounded-lg bg-gray-50 p-4 text-sm">
                  <p className="font-medium">For your will to be legally valid:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
                    <li>You must be 18+ and of sound mind</li>
                    <li>You must sign it in the presence of two witnesses</li>
                    <li>Your witnesses must sign it in your presence</li>
                    <li>Your witnesses cannot be beneficiaries or spouses of beneficiaries</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-500">
                  Disclaimer: This is not legal advice. For complex estates or specific legal questions, please consult
                  a solicitor.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 z-10 w-full border-t bg-white p-4 shadow-md">
        <div className="mx-auto flex max-w-md justify-center">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2 h-14 px-8"
            onClick={() => router.push("/")}
          >
            <Home className="h-5 w-5" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
