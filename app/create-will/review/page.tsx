"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Edit2, CheckCircle, AlertCircle, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BrandHeader } from "@/components/brand-header"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"


type Child = {
  id: number
  name: string
  age: string
}

type Beneficiary = {
  id: number
  name: string
  relationship: string
}

type Gift = {
  id: number
  item: string
  recipient: string
}

type Executor = {
  name: string
  relationship: string
  email: string
  phone: string
}

type MainBeneficiary = {
  name: string
  relationship: string
}

function formatDate(formData: any) {
  const { dateOfBirthDay, dateOfBirthMonth, dateOfBirthYear } = formData

  if (!dateOfBirthDay || !dateOfBirthMonth || !dateOfBirthYear) return ""

  try {
    // Convert month name to a numeric index (0-based for JS Date)
    const monthIndex = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ].indexOf(dateOfBirthMonth)

    if (monthIndex === -1) return ""

    const date = new Date(Number(dateOfBirthYear), monthIndex, Number(dateOfBirthDay))
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch (e) {
    return ""
  }
}

function formatAddress(formData: any) {
  const addressParts = [formData.addressLine1, formData.addressLine2, formData.city, formData.postcode].filter(Boolean)

  return addressParts.join(", ")
}

function formatName(formData: any) {
  const nameParts = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean)

  return nameParts.join(" ")
}

export default function ReviewWill() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    middleName: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    address: "",
    maritalStatus: "",
    children: [] as Child[],
    primaryExecutor: { name: "", relationship: "", email: "", phone: "" } as Executor,
    backupExecutor: { name: "", relationship: "", email: "", phone: "" } as Executor,
    mainBeneficiary: { name: "", relationship: "" } as MainBeneficiary,
    additionalBeneficiaries: [] as Beneficiary[],
    specificGifts: [] as Gift[],
    residualEstate: "",
    funeralWishes: "",
    verifyIdentity: false,
    legalDeclaration: false,
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    petCare: "",
    digitalAssets: ""
  })
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const viewId = searchParams.get("view") // this is the will ID
const [isViewMode, setIsViewMode] = useState(false)

useEffect(() => {
  const fetchData = async () => {
    if (viewId) {
      const sessionRes = await supabase.auth.getUser()
      const userId = sessionRes.data?.user?.id

      if (!userId) {
        router.push("/create-will/review")
        return
      }

      // Supabase fetch by will ID
        setIsViewMode(true)

      const { data, error } = await supabase
        .from("wills")
        .select("*")
        .eq("id", viewId)
        .single()

      if (data.user_id !== userId) {
        router.push("/create-will/review") // or show 403 page
        return
      }


      if (error) {
        console.error("Error fetching will by ID:", error)
        return
      }

      // Convert DB structure to match your `formData` state structure
      const transformed = {
        firstName: data.first_name,
        middleName: data.middle_name,
        lastName: data.last_name,
        dateOfBirth: data.date_of_birth,
        addressLine1: data.address_line1,
        addressLine2: data.address_line2,
        city: data.city,
        postcode: data.postcode,
        address: `${data.address_line1}, ${data.city}, ${data.postcode}`,
        maritalStatus: data.marital_status,
        children: data.children || [],
        primaryExecutor: data.primary_executor || {},
        backupExecutor: data.backup_executor || {},
        mainBeneficiary: data.main_beneficiary || {},
        additionalBeneficiaries: data.additional_beneficiaries || [],
        specificGifts: data.specific_gifts || [],
        residualEstate: data.residual_estate,
        funeralWishes: data.funeral_wishes,
        verifyIdentity: data.verify_identity,
        legalDeclaration: data.legal_declaration,
        petCare: data.pet_care,
        digitalAssets: data.digital_assets
      }

      setFormData(transformed)
    } else {
      const savedData = localStorage.getItem("myEasyWill_savedProgress")
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          setFormData(parsed.formData)
        } catch {
          loadMockData()
        }
      } else {
        loadMockData()
      }
    }

    setIsLoading(false)
  }

  fetchData()
}, [viewId])

  console.log( formData)

  const loadMockData = () => {
    setFormData({
      firstName: "John",
      middleName: "",
      lastName: "Smith",
      dateOfBirth: "1975-05-15",
      address: "123 High Street, London, SW1A 1AA",
      maritalStatus: "Married",
      children: [
        { id: 1, name: "Thomas Smith", age: "Under 18" },
        { id: 2, name: "Emily Smith", age: "Under 18" },
      ],
      primaryExecutor: {
        name: "Jane Smith",
        relationship: "Spouse/Partner",
        email: "jane.smith@email.com",
        phone: "07700 900123",
      },
      backupExecutor: {
        name: "Robert Jones",
        relationship: "Friend",
        email: "robert.jones@email.com",
        phone: "07700 900456",
      },
      mainBeneficiary: {
        name: "Jane Smith",
        relationship: "Spouse/Partner",
      },
      additionalBeneficiaries: [
        { id: 1, name: "Thomas Smith", relationship: "Child" },
        { id: 2, name: "Emily Smith", relationship: "Child" },
      ],
      specificGifts: [
        { id: 1, item: "My vintage watch collection", recipient: "Thomas Smith" },
        { id: 2, item: "£5,000", recipient: "Cancer Research UK" },
      ],
      residualEstate: "Equally between all beneficiaries",
      funeralWishes: "I would like to be cremated and have my ashes scattered in the garden.",
      verifyIdentity: true,
      legalDeclaration: true,
      addressLine1: "123 High Street",
      addressLine2: "Apt 4B",
      city: "London",
      postcode: "SW1A 1AA",
      petCare: "",
      digitalAssets: ""
    })
  }

  const handleEdit = (section: string) => {
    if (viewId) {
      router.push(`/create-will?section=${section}&edit=${viewId}`);
    } else {
      router.push(`/create-will?section=${section}`);
    }
  }


  const handlePayment = () => {
    router.push("/create-will/payment")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#007BFF] border-t-transparent"></div>
          <p>Loading your will...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 quill-pattern">
      {/* Fixed Header */}
      <BrandHeader />

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-24">
        <div className="container mx-auto px-4 py-4">
          <div className="mx-auto max-w-md">
            <div className="mb-6 rounded-lg bg-blue-50 p-4 border-l-4 border-[#007BFF]">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#007BFF] text-white">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#007BFF]">Almost Done!</h2>
                  <p className="mt-1 text-blue-800">
                    Please review your will details carefully. You can edit any section before proceeding to payment.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <ReviewCard
                title="Your Details"
                items={[
                  { label: "Full Name", value: formatName(formData) },
                  { label: "Date of Birth", value: formatDate(formData) },
                  { label: "Address", value: formatAddress(formData) },
                  { label: "Marital Status", value: formData.maritalStatus },
                ]}
                onEdit={() => handleEdit("personal")}
              />

              {formData.children && formData.children.length > 0 && (
                <ReviewCard
                  title="Your Children"
                  items={formData.children.map((child) => ({
                    label: child.age,
                    value: child.name,
                  }))}
                  onEdit={() => handleEdit("children")}
                />
              )}

              <ReviewCard
                title="Your Primary Executor"
                items={[
                  {
                    label: "Name",
                    value: formData.primaryExecutor.name,
                  },
                  {
                    label: "Relationship",
                    value: formData.primaryExecutor.relationship,
                  },
                  ...(formData.primaryExecutor.email
                    ? [
                        {
                          label: "Email",
                          value: formData.primaryExecutor.email,
                        },
                      ]
                    : []),
                  ...(formData.primaryExecutor.phone
                    ? [
                        {
                          label: "Phone",
                          value: formData.primaryExecutor.phone,
                        },
                      ]
                    : []),
                ]}
                onEdit={() => handleEdit("executors")}
              />

              {formData.backupExecutor.name && (
                <ReviewCard
                  title="Your Backup Executor"
                  items={[
                    {
                      label: "Name",
                      value: formData.backupExecutor.name,
                    },
                    {
                      label: "Relationship",
                      value: formData.backupExecutor.relationship,
                    },
                    ...(formData.backupExecutor.email
                      ? [
                          {
                            label: "Email",
                            value: formData.backupExecutor.email,
                          },
                        ]
                      : []),
                    ...(formData.backupExecutor.phone
                      ? [
                          {
                            label: "Phone",
                            value: formData.backupExecutor.phone,
                          },
                        ]
                      : []),
                  ]}
                  onEdit={() => handleEdit("executors")}
                />
              )}

              <ReviewCard
                title="Your Beneficiaries"
                items={[
                  {
                    label: "Main",
                    value: `${formData.mainBeneficiary.name} (${formData.mainBeneficiary.relationship})`,
                  },
                  ...(formData.additionalBeneficiaries && formData.additionalBeneficiaries.length > 0
                    ? formData.additionalBeneficiaries.map((b) => ({
                        label: b.relationship,
                        value: b.name,
                      }))
                    : []),
                ]}
                onEdit={() => handleEdit("beneficiaries")}
              />

              {formData.specificGifts && formData.specificGifts.length > 0 && (
                <ReviewCard
                  title="Specific Gifts"
                  items={formData.specificGifts.map((g) => ({
                    label: g.recipient,
                    value: g.item,
                  }))}
                  onEdit={() => handleEdit("gifts")}
                />
              )}

              <ReviewCard
                title="Residual Estate"
                items={[{ label: "Distribution", value: formData.residualEstate }]}
                onEdit={() => handleEdit("beneficiaries")}
              />

              {formData.funeralWishes && (
                <ReviewCard
                  title="Funeral Wishes"
                  items={[{ label: "Wishes", value: formData.funeralWishes }]}
                  onEdit={() => handleEdit("wishes")}
                />
              )}

              {formData.verifyIdentity && (
                <ReviewCard
                  title="Identity Verification"
                  items={[{ label: "Status", value: "Will be verified after payment" }]}
                  onEdit={() => handleEdit("identity")}
                  icon={<Shield className="h-4 w-4 text-green-600" />}
                />
              )}
              {formData.petCare  && (
                  <ReviewCard
                    title="Pet Care"
                    items={[{ label: "Pet Care", value: formData.petCare }]}
                    onEdit={() => handleEdit("wishes")}
                  />
                )}

                {formData.digitalAssets && (
                  <ReviewCard
                    title="Digital Assets"
                    items={[{ label: "Digital Assets", value: formData.digitalAssets }]}
                    onEdit={() => handleEdit("wishes")}
                  />
                )}

            </div>

            <Alert className="mt-6 border-amber-200 bg-amber-50 border-l-4 border-l-amber-500">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Important</AlertTitle>
              <AlertDescription className="text-amber-700">
                <p className="mt-2">For your will to be legally valid, you must:</p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>Sign it in the presence of two witnesses</li>
                  <li>Have both witnesses sign it in your presence</li>
                  <li>Ensure witnesses are not beneficiaries or their spouses</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 z-10 w-full border-t bg-white p-4 shadow-md">
        <div className="brand-gradient h-1 w-full absolute top-0 left-0"></div>
        <div className="mx-auto flex max-w-md justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-14 border-[#007BFF] text-[#007BFF]"
            onClick={() => router.push("/create-will")}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          {isViewMode ? (
            <Button
              size="lg"
              className="flex-1 h-14 brand-button"
              onClick={() => router.push(`/create-will/download?will=${viewId}`)}
            >
              Download Will (PDF)
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button
              size="lg"
              className="flex-1 h-14 brand-button"
              onClick={handlePayment}
            >
              Continue to Payment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function ReviewCard({ title, items, onEdit, icon }: { title: any; items: any; onEdit: () => void; icon?: any }) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 brand-card-header">
        <CardTitle className="text-lg text-[#007BFF] flex items-center gap-2">
          {icon && icon}
          {title}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 flex items-center gap-1 text-[#007BFF]">
          <Edit2 className="h-4 w-4" />
          <span>Edit</span>
        </Button>
      </CardHeader>
      <CardContent className="px-4 py-3">
        <dl className="space-y-2">
          {items.map((item: any, index: number) => (
            <div key={index} className="flex justify-between py-1 border-b border-gray-100 last:border-0">
              <dt className="text-gray-500">{item.label}:</dt>
              <dd className="font-medium text-right max-w-[60%] break-words">{item.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
