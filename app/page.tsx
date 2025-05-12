import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Clock, PoundSterling, CheckCircle, ArrowRight } from "lucide-react"
import { QuillIcon } from "@/components/quill-icon"
import { SampleWillPopup } from "@/components/sample-will-popup"
import { VideoModal } from "@/components/video-modal"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="fixed top-0 z-10 w-full border-b bg-white shadow-sm">
        <div className="brand-gradient h-1 w-full"></div>
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#007BFF] text-white">
              <QuillIcon className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">My Easy Will</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-sm font-medium text-gray-600 hover:text-[#007BFF]">
              Sign In
            </Link>
            <Link href="/create-will">
              <Button size="sm" className="brand-button">
                Start My Will
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section - Redesigned & Responsive */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
          <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16 md:py-24">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              {/* Left Column - Content */}
              <div className="text-center md:text-left">
                <div className="mb-4 inline-flex items-center rounded-full bg-[#007BFF]/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-[#007BFF]">
                  Create your will in just 5 minutes
                </div>
                <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  <span className="text-gray-900">Protect Your</span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                    Family's Future
                  </span>
                </h1>
                <p className="mx-auto mb-6 max-w-md text-base sm:text-lg text-gray-600 md:mx-0 md:text-xl">
                  A legally valid UK will for just £15 — saving you £100+ compared to solicitors.
                </p>
                <div className="flex flex-col sm:flex-row">
                  <Link href="/create-will" className="w-full sm:w-auto">
                    <Button size="lg" className="group w-full brand-button py-4 sm:py-6 text-base sm:text-lg">
                      Start My Will
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>

                {/* Video Button */}
                <div className="mt-6 flex justify-center md:justify-start">
                  <VideoModal />
                </div>

                <div className="mt-6 flex items-center justify-center md:justify-start">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-white bg-gray-200"
                        style={{
                          backgroundImage: `url(/placeholder.svg?height=32&width=32&query=person)`,
                          backgroundSize: "cover",
                        }}
                      />
                    ))}
                  </div>
                  <div className="ml-3 flex items-center text-xs sm:text-sm font-medium">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="h-3 w-3 sm:h-4 sm:w-4 fill-current text-yellow-500"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-.181h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-gray-600">Trusted by 10,000+ customers</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Document Preview - Hidden on Mobile */}
              <div className="hidden md:block relative mt-6 md:mt-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-sky-300/20 blur-2xl"></div>
                <div className="relative mx-auto w-[360px] lg:w-[400px] transition-all duration-500 hover:scale-105">
                  {/* Document Container */}
                  <div className="relative h-[460px] lg:h-[500px] rounded-xl border border-blue-100 bg-white shadow-xl overflow-hidden">
                    {/* Document Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-4 flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600">
                        <QuillIcon className="h-5 w-5" />
                      </div>
                      <div className="ml-3 text-white">
                        <h3 className="text-sm font-semibold">LAST WILL AND TESTAMENT</h3>
                        <p className="text-xs text-white/80">My Easy Will Document</p>
                      </div>
                    </div>

                    {/* Document Content */}
                    <div className="p-6 space-y-5">
                      {/* Title */}
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-gray-800">LAST WILL AND TESTAMENT</h4>
                        <div className="h-px w-24 mx-auto my-2 bg-gray-300"></div>
                        <p className="text-sm text-gray-600">of</p>
                        <p className="text-base font-medium text-gray-800">JOHN SMITH</p>
                      </div>

                      {/* Document Sections */}
                      <div className="space-y-4">
                        {/* Section 1 */}
                        <div>
                          <h5 className="text-sm font-semibold text-gray-800">1. REVOCATION</h5>
                          <p className="text-xs text-gray-600 mt-1">
                            I hereby revoke all former wills and testamentary dispositions made by me and declare this
                            to be my last will and testament.
                          </p>
                        </div>

                        {/* Section 2 */}
                        <div>
                          <h5 className="text-sm font-semibold text-gray-800">2. APPOINTMENT OF EXECUTORS</h5>
                          <p className="text-xs text-gray-600 mt-1">
                            I appoint <span className="text-blue-600">JANE SMITH</span> to be the executor and trustee
                            of my will.
                          </p>
                        </div>

                        {/* Section 3 */}
                        <div>
                          <h5 className="text-sm font-semibold text-gray-800">3. GIFTS</h5>
                          <p className="text-xs text-gray-600 mt-1">
                            I give my <span className="text-blue-600">RESIDENCE</span> to my{" "}
                            <span className="text-blue-600">SPOUSE</span> absolutely.
                          </p>
                        </div>

                        {/* Section 4 - Faded */}
                        <div className="opacity-50">
                          <h5 className="text-sm font-semibold text-gray-800">4. RESIDUARY ESTATE</h5>
                          <p className="text-xs text-gray-600 mt-1">I give my residuary estate to...</p>
                        </div>

                        {/* Watermark */}
                        <div className="absolute bottom-20 right-0 left-0 flex justify-center opacity-10 rotate-45">
                          <div className="flex items-center">
                            <QuillIcon className="h-16 w-16" />
                            <span className="text-3xl font-bold ml-2">DRAFT</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Document Footer */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-50 p-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          <p>Page 1 of 3</p>
                        </div>
                        <div className="flex items-center">
                          <div className="h-8 w-24 rounded bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                            Sign Here
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Animated Elements */}
                    <div className="absolute top-1/3 right-4 h-4 w-4 rounded-full bg-green-500 opacity-0 animate-ping-slow"></div>
                    <div className="absolute top-2/3 left-4 h-3 w-3 rounded-full bg-blue-500 opacity-0 animate-ping-delayed"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Pills - Responsive */}
            <div className="mt-8 md:mt-12">
              <div className="mx-auto grid max-w-4xl grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center rounded-xl bg-white p-3 shadow-sm">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                  <span className="ml-3 text-xs sm:text-sm font-medium">Legally Valid</span>
                </div>
                <div className="flex items-center rounded-xl bg-white p-3 shadow-sm">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-blue-100">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                  <span className="ml-3 text-xs sm:text-sm font-medium">5 Min Process</span>
                </div>
                <div className="flex items-center rounded-xl bg-white p-3 shadow-sm">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-amber-100">
                    <PoundSterling className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  </div>
                  <span className="ml-3 text-xs sm:text-sm font-medium">Just £15</span>
                </div>
                <div className="flex items-center rounded-xl bg-white p-3 shadow-sm">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-purple-100">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                  <span className="ml-3 text-xs sm:text-sm font-medium">Secure & Private</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative diagonal divider */}
          <div className="relative h-8 sm:h-12 md:h-16 bg-gradient-to-br from-blue-50 via-white to-sky-50">
            <svg
              className="absolute -bottom-1 left-0 h-8 sm:h-12 md:h-16 w-full fill-white"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path d="M1200 0L0 0 598.97 114.72 1200 0z"></path>
            </svg>
          </div>
        </section>

        {/* Rest of the sections remain unchanged */}
        {/* Trust Indicators - Responsive */}
        <section className="border-y bg-white px-4 py-10 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 sm:mb-10 text-center text-2xl sm:text-3xl font-bold text-gray-900">
              Trusted by <span className="text-[#007BFF]">Thousands</span>
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
              <TrustIndicator number="10,000+" text="Wills Created" />
              <TrustIndicator number="4.8/5" text="Customer Rating" />
              <TrustIndicator number="100%" text="UK Law Compliant" />
              <TrustIndicator number="£100+" text="Average Savings" />
            </div>
          </div>
        </section>

        {/* How It Works - Responsive */}
        <section className="bg-gray-50 px-4 py-10 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 sm:mb-10 text-center text-2xl sm:text-3xl font-bold text-gray-900">
              Simple <span className="text-[#007BFF]">4-Step</span> Process
            </h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <StepCard
                number="1"
                title="Answer Simple Questions"
                description="Basic questions about you and your wishes in plain English."
                icon={<Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#007BFF]" />}
              />
              <StepCard
                number="2"
                title="Review Your Will"
                description="Check everything is correct before proceeding."
                icon={<CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-[#007BFF]" />}
              />
              <StepCard
                number="3"
                title="Secure Payment"
                description="Pay just £15 with any major credit card."
                icon={<PoundSterling className="h-5 w-5 sm:h-6 sm:w-6 text-[#007BFF]" />}
              />
              <StepCard
                number="4"
                title="Download & Sign"
                description="Print, sign with two witnesses, and store safely."
                icon={<Shield className="h-5 w-5 sm:h-6 sm:w-6 text-[#007BFF]" />}
              />
            </div>
          </div>
        </section>

        {/* Testimonials - Responsive */}
        <section className="px-4 py-10 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 sm:mb-10 text-center text-2xl sm:text-3xl font-bold text-gray-900">
              What Our <span className="text-[#007BFF]">Customers</span> Say
            </h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              <Testimonial
                quote="So easy to use. I was putting off making a will for years because I thought it would be complicated. This took me 5 minutes!"
                author="Sarah, 42"
              />
              <Testimonial
                quote="After having our first child, we knew we needed wills. This was affordable and straightforward - exactly what we needed."
                author="James & Emma, 35"
              />
              <Testimonial
                quote="As a retiree, I wanted to make sure everything was in order. The process was simple and the instructions for signing were very clear."
                author="Robert, 68"
              />
            </div>
          </div>
        </section>

        {/* Final CTA - Responsive */}
        <section className="px-4 py-10 sm:py-16 brand-gradient text-white">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold">Ready to secure your family's future?</h2>
            <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-white/90">
              It only takes 5 minutes to create your will.
            </p>
            <div className="mt-6 sm:mt-8">
              <Link href="/create-will">
                <Button
                  size="lg"
                  className="w-full max-w-md bg-white py-4 sm:py-6 text-base sm:text-lg text-[#007BFF] hover:bg-gray-100"
                >
                  Create My Will Now
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
            <p className="mt-4 sm:mt-6 text-sm text-white/80">
              Not sure? <SampleWillPopup />
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

function TrustIndicator({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-white p-4 sm:p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#007BFF]">{number}</span>
      <span className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">{text}</span>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start space-x-3 sm:space-x-4 rounded-lg border bg-white p-4 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
      <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#007BFF]/10 text-[#007BFF]">
        {icon}
      </div>
      <div>
        <h3 className="text-lg sm:text-xl font-medium">{title}</h3>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">{description}</p>
      </div>
    </div>
  )
}

function Testimonial({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-lg bg-white p-4 sm:p-6 shadow-sm">
      <div>
        <svg className="h-6 w-6 sm:h-8 sm:w-8 text-[#007BFF]/30" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-700">{quote}</p>
      </div>
      <p className="mt-4 sm:mt-6 text-right text-xs sm:text-sm font-medium text-gray-500">— {author}</p>
    </div>
  )
}
