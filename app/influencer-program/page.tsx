"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BrandHeader } from "@/components/brand-header"
import { GlobalFooter } from "@/components/global-footer"
import { ArrowRight, CheckCircle, Users, TrendingUp, PoundSterling, Gift, Star, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function InfluencerProgramPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFF]">
      <BrandHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#EEF2FF] via-white to-[#F0F7FF] py-20 md:py-28">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-[30%] -right-[10%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl"></div>
            <div className="absolute top-[60%] -left-[10%] h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-blue-400/10 to-emerald-400/10 blur-3xl"></div>
          </div>

          <div className="container relative mx-auto px-4">
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex items-center rounded-full bg-blue-600/10 px-3 py-1.5 text-sm font-medium text-blue-600">
                  Earn while helping others secure their future
                </div>
                <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                  <span className="text-gray-900">Become a </span>
                  <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
                    My Easy Will
                  </span>
                  <span className="text-gray-900"> Influencer</span>
                </h1>
                <p className="mb-8 text-lg text-gray-600 md:text-xl">
                  Share valuable content with your audience and earn £5 for every completed will. Join our network of
                  creators making a difference.
                </p>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link href="/influencer-program/apply">
                    <Button size="lg" className="group w-full bg-blue-600 py-6 text-lg hover:bg-blue-700 sm:w-auto">
                      Apply Now
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    className="w-full border-2 border-blue-600 bg-white py-6 text-lg text-blue-600 hover:bg-blue-50 sm:w-auto"
                    onClick={() => setVideoOpen(true)}
                  >
                    Watch Video
                    <svg
                      className="ml-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
              <div className="relative hidden md:block">
                <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-2xl"></div>
                <div className="relative backdrop-blur-sm bg-white/30 rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold">
                          M
                        </div>
                        <div>
                          <p className="font-medium">My Easy Will</p>
                          <p className="text-xs text-gray-500">Influencer Dashboard</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Total Earned</p>
                        <p className="text-2xl font-bold text-blue-600">£1,230</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex justify-between">
                          <p className="font-medium">This Month</p>
                          <p className="font-bold">£420</p>
                        </div>
                        <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                          <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"></div>
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-gray-500">
                          <p>14 referrals</p>
                          <p>Goal: 20</p>
                        </div>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Recent Activity</p>
                          <button className="text-xs text-blue-600">View all</button>
                        </div>
                        <div className="mt-2 space-y-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-md bg-gray-50 p-2 text-sm"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                </div>
                                <p>Will completed</p>
                              </div>
                              <p className="font-medium text-green-600">+£30</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <StatCard
                  icon={<PoundSterling className="h-8 w-8 text-blue-600" />}
                  value="£5"
                  label="Per successful referral"
                />
                <StatCard icon={<Users className="h-8 w-8 text-blue-600" />} value="500+" label="Active influencers" />
                <StatCard
                  icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
                  value="£50,000+"
                  label="Paid to influencers"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-[#FAFBFF]">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">How It Works</h2>
              <p className="mb-12 text-lg text-gray-600">
                Our influencer program is designed to be simple, transparent, and rewarding.
              </p>
            </div>

            <div className="mx-auto max-w-6xl">
              <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 hidden md:block"></div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                  <StepCard
                    number="1"
                    title="Connect Your Socials"
                    description="Fill out our simple application with your social profiles."
                  />
                  <StepCard
                    number="2"
                    title="Get Approved"
                    description="We'll review and approve your application within 24 hours."
                  />
                  <StepCard
                    number="3"
                    title="Share Your Link"
                    description="Share your unique referral link with your audience."
                  />
                  <StepCard
                    number="4"
                    title="Earn Rewards"
                    description="Earn £5 for every completed will through your link."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why Join Our Program?</h2>
              <p className="mb-12 text-lg text-gray-600">
                Beyond the financial rewards, there are many reasons to partner with My Easy Will.
              </p>
            </div>

            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <BenefitCard
                  icon={<PoundSterling className="h-6 w-6 text-blue-600" />}
                  title="High Commission"
                  description="Earn £30 for every successful referral, with no cap on earnings."
                />
                <BenefitCard
                  icon={<Gift className="h-6 w-6 text-blue-600" />}
                  title="Valuable Service"
                  description="Offer your audience a genuinely useful service that everyone needs."
                />
                <BenefitCard
                  icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
                  title="Real-Time Tracking"
                  description="Monitor your performance with our comprehensive dashboard."
                />
                <BenefitCard
                  icon={<CheckCircle className="h-6 w-6 text-blue-600" />}
                  title="Quality Product"
                  description="Promote a legally valid, affordable will creation service."
                />
                <BenefitCard
                  icon={<Users className="h-6 w-6 text-blue-600" />}
                  title="Dedicated Support"
                  description="Get personalized support from our influencer team."
                />
                <BenefitCard
                  icon={<Star className="h-6 w-6 text-blue-600" />}
                  title="Exclusive Content"
                  description="Access exclusive content and promotional materials."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-[#FAFBFF]">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">What Our Influencers Say</h2>
              <p className="mb-12 text-lg text-gray-600">
                Hear from content creators who are already part of our program.
              </p>
            </div>

            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <TestimonialCard
                  quote="I've been promoting My Easy Will for 6 months and it's been one of my most successful partnerships. My audience appreciates the service, and I love the passive income."
                  author="Sarah Johnson"
                  role="Financial Blogger"
                  image="/blonde-woman-portrait.png"
                />
                <TestimonialCard
                  quote="As a family law solicitor, I'm very careful about what I recommend. My Easy Will offers a genuinely good service for straightforward wills, and the referral program is excellent."
                  author="James Wilson"
                  role="Legal Content Creator"
                  image="/man-with-glasses-portrait.png"
                />
                <TestimonialCard
                  quote="The dashboard makes it so easy to track my referrals and earnings. I can see exactly how many people have clicked my link and completed their wills."
                  author="Emma Thompson"
                  role="Lifestyle Influencer"
                  image="/brown-haired-woman-portrait.png"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
              <p className="mb-12 text-lg text-gray-600">
                Got questions about our influencer program? Find answers below.
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <div className="space-y-6">
                <FaqItem
                  question="Who can join the influencer program?"
                  answer="Anyone with an audience interested in family planning, personal finance, or legal matters. We welcome bloggers, social media influencers, podcasters, and content creators of all sizes."
                />
                <FaqItem
                  question="How much can I earn?"
                  answer="You earn £5 for every customer who creates a will through your unique referral link. There's no cap on earnings, so the more people you refer, the more you earn."
                />
                <FaqItem
                  question="When and how do I get paid?"
                  answer="Payments are processed monthly for all earnings accumulated in the previous month. You can choose to receive payments via bank transfer or PayPal."
                />
                <FaqItem
                  question="How do I track my referrals?"
                  answer="You'll have access to a comprehensive dashboard where you can track clicks, conversions, and earnings in real-time."
                />
                <FaqItem
                  question="What marketing materials are available?"
                  answer="We provide a variety of marketing materials including banner ads, social media templates, email copy, and more. You can access these from your influencer dashboard."
                />
                <FaqItem
                  question="How long does the application process take?"
                  answer="We typically review and approve applications within 24 hours. Once approved, you'll receive immediate access to your dashboard and referral links."
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-violet-600 text-white">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Start Earning?</h2>
              <p className="mb-8 text-lg text-white/90">
                Join our influencer program today and start earning while helping your audience protect their loved
                ones.
              </p>
              <Link href="/influencer-program/apply">
                <Button size="lg" className="bg-white py-6 text-lg text-blue-600 hover:bg-gray-100">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Video Modal */}
        <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Influencer Program Overview</DialogTitle>
            </DialogHeader>
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Influencer Program Overview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="aspect-video"
              ></iframe>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <GlobalFooter />
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">{icon}</div>
      <h3 className="text-3xl font-bold">{value}</h3>
      <p className="text-gray-600">{label}</p>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center relative z-10">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white text-2xl font-bold shadow-lg">
        {number}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">{icon}</div>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}

function TestimonialCard({
  quote,
  author,
  role,
  image,
}: {
  quote: string
  author: string
  role: string
  image: string
}) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="mb-4 text-blue-600/30">
          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        <p className="mb-6 text-gray-700 flex-grow">{quote}</p>
        <div className="flex items-center mt-auto">
          <Image src={image || "/placeholder.svg"} alt={author} width={50} height={50} className="rounded-full" />
          <div className="ml-4">
            <h4 className="font-bold">{author}</h4>
            <p className="text-sm text-gray-600">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FaqItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-6 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
      <h3 className="mb-2 text-xl font-bold flex items-center">
        {question}
        <ChevronRight className="ml-auto h-5 w-5 text-blue-500" />
      </h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  )
}
