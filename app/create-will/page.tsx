"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, HelpCircle, AlertCircle } from "lucide-react"
import { FormStep } from "@/components/form-step"
import { HelpPanel } from "@/components/help-panel"
import { BrandHeader } from "@/components/brand-header"
import { useToast } from "@/hooks/use-toast"
import { SolicitorReferral } from "@/components/solicitor-referral"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { AmazonProgressBar } from "@/components/amazon-progress-bar"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

type FormField = {
  name: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  options?: string[]
  tooltip?: string
  defaultValue?: string
  skipOption?: {
    show: boolean
    text: string
  }
}

type Step = {
  title: string
  description: string
  fields: FormField[]
  helpContent?: {
    title: string
    content: string[]
    example?: string
    examples?: string[]
    note?: string
  }
}

type Section = {
  title: string
  steps: Step[]
}

type SectionKey = "personal" | "estate" | "executors" | "beneficiaries" | "wishes" | "legal"

export default function CreateWill() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [currentSection, setCurrentSection] = useState<SectionKey>("personal")
  const [showHelp, setShowHelp] = useState<boolean>(false)
  const [isComplexEstate, setIsComplexEstate] = useState<boolean>(false)
  const [showReferral, setShowReferral] = useState<boolean>(false)
  const [hasAcknowledgedComplexEstate, setHasAcknowledgedComplexEstate] = useState<boolean>(false)
  const searchParams = useSearchParams()

  const [formData, setFormData] = useState<Record<string, any>>({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    maritalStatus: "",
    children: [],
    estateValue: "",
    hasOverseasAssets: false,
    hasBusinessAssets: false,
    hasTrusts: false,
    primaryExecutor: { name: "", relationship: "", email: "", phone: "" },
    backupExecutor: { name: "", relationship: "", email: "", phone: "" },
    mainBeneficiary: { name: "", relationship: "", percentage: "" },
    additionalBeneficiaries: [],
    specificGifts: [],
    residualEstate: "",
    funeralWishes: "",
    petCare: "",
    digitalAssets: "",
    legalDeclaration: false,
  })

  const [isFormValid, setIsFormValid] = useState<boolean>(false)

  // Load saved progress if available
  useEffect(() => {
    const savedData = localStorage.getItem("myEasyWill_savedProgress")
    const editId = searchParams.get("edit")
    if (editId) {
      const fetchWill = async () => {
        const sessionRes = await supabase.auth.getUser()
        const userId = sessionRes.data?.user?.id

        if (!userId) {
          router.push("/create-will")
          return
        }

        const { data, error } = await supabase
          .from("wills")
          .select("*")
          .eq("id", editId)
          .single()

        if (data.user_id !== userId) {
          router.push("/create-will") // or show 403 page
          return
        }


        if (error) {
          console.error("Failed to fetch will for editing:", error.message)
          return
        }

        // Map database fields to formData structure
        const mappedForm = {
          firstName: data.first_name,
          middleName: data.middle_name,
          lastName: data.last_name,
          dateOfBirth: data.date_of_birth,
          addressLine1: data.address_line1,
          addressLine2: data.address_line2,
          city: data.city,
          postcode: data.postcode,
          maritalStatus: data.marital_status,
          children: data.children || [],
          estateValue: data.estate_value,
          hasOverseasAssets: data.has_overseas_assets,
          hasBusinessAssets: data.has_business_assets,
          hasTrusts: data.has_trusts,
          primaryExecutor: data.primary_executor || { name: "", relationship: "", email: "", phone: "" },
          backupExecutor: data.backup_executor || { name: "", relationship: "", email: "", phone: "" },
          mainBeneficiary: data.main_beneficiary || { name: "", relationship: "", percentage: "100" },
          additionalBeneficiaries: data.additional_beneficiaries || [],
          specificGifts: data.specific_gifts || [],
          residualEstate: data.residual_estate,
          funeralWishes: data.funeral_wishes,
          petCare: data.pet_care,
          digitalAssets: data.digital_assets,
          legalDeclaration: data.legal_declaration,
        }

        setFormData(mappedForm)
      }

      fetchWill()
    } else if(savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData.formData)
        setCurrentStep(parsedData.step)
        setCurrentSection(parsedData.section || "personal")
        // Also restore the acknowledged complex estate flag if it exists
        if (parsedData.hasAcknowledgedComplexEstate !== undefined) {
          setHasAcknowledgedComplexEstate(parsedData.hasAcknowledgedComplexEstate)
        }
      } catch (e) {
        console.error("Error loading saved progress", e)
      }

    }
  }, [searchParams])

  // Check for complex estate conditions
  useEffect(() => {
    const isComplex =
      formData.hasOverseasAssets ||
      formData.hasBusinessAssets ||
      formData.hasTrusts ||
      (formData.estateValue && parseEstateValue(formData.estateValue) > 1000000)

    setIsComplexEstate(isComplex)
  }, [formData.hasOverseasAssets, formData.hasBusinessAssets, formData.hasTrusts, formData.estateValue])

  // Validate current step
  useEffect(() => {
    validateCurrentStep()
  }, [formData, currentStep, currentSection])

  // Define sections and their steps
const sections: Record<SectionKey, Section> = {    personal: {
      title: "Personal Details",
      steps: [
        {
          title: "Your Name",
          description: "Let's start with your full legal name",
          fields: [
            {
              name: "firstName",
              label: "First Name",
              type: "text",
              required: true,
              placeholder: "e.g. John",
            },
            {
              name: "middleName",
              label: "Middle Name(s)",
              type: "text",
              required: false,
              placeholder: "e.g. Robert (leave blank if none)",
            },
            {
              name: "lastName",
              label: "Last Name",
              type: "text",
              required: true,
              placeholder: "e.g. Smith",
            },
          ],
          helpContent: {
            title: "Your Legal Name",
            content: [
              "Use your full name as it appears on official documents.",
              "This helps identify you clearly as the will creator.",
            ],
            example: "Example: Sarah Jane Wilson (not just Sarah Wilson)",
          },
        },
        {
          title: "Your Date of Birth",
          description: "When were you born?",
          fields: [
            {
              name: "dateOfBirth",
              label: "Your Date of Birth",
              type: "dob-dropdown",
              required: true,
            },
          ],
          helpContent: {
            title: "Why We Need Your Date of Birth",
            content: [
              "Your date of birth helps confirm your identity.",
              "You must be at least 18 years old to make a valid will in the UK.",
            ],
          },
        },
        {
          title: "Your Address",
          description: "Where do you currently live?",
          fields: [
            {
              name: "address",
              label: "Your Home Address",
              type: "address-fields",
              required: true,
            },
          ],
          helpContent: {
            title: "Your Home Address",
            content: [
              "Use your main home address where you currently live.",
              "This helps identify you legally in your will.",
            ],
          },
        },
        {
          title: "Marital Status",
          description: "Are you married or in a civil partnership?",
          fields: [
            {
              name: "maritalStatus",
              label: "Your Marital Status",
              type: "select",
              options: ["Single", "Married", "Civil Partnership", "Divorced", "Widowed", "Separated"],
              required: true,
            },
          ],
          helpContent: {
            title: "Why Marital Status Matters",
            content: [
              "Your marital status affects how your estate might be distributed.",
              "If you're married or in a civil partnership, your spouse has certain legal rights.",
            ],
            note: "If you get married after making this will, you should create a new one.",
          },
        },
        {
          title: "Your Children",
          description: "Do you have any children?",
          fields: [
            {
              name: "children",
              label: "Add Your Children",
              type: "children",
              required: false,
              skipOption: {
                show: true,
                text: "I don't have any children",
              },
            },
          ],
          helpContent: {
            title: "Including Your Children",
            content: [
              "List all your children, including those from previous relationships.",
              "Include legally adopted children and step-children you wish to provide for.",
            ],
            note: "For children under 18, you can appoint guardians later in the process.",
          },
        },
      ],
    },
    estate: {
      title: "Estate Details",
      steps: [
        {
          title: "Estate Value",
          description: "Approximately how much is your estate worth?",
          fields: [
            {
              name: "estateValue",
              label: "Approximate Total Value",
              type: "currency",
              required: true,
              placeholder: "e.g. £350,000",
            },
          ],
          helpContent: {
            title: "Estimating Your Estate Value",
            content: [
              "Include the total value of your property, savings, and possessions.",
              "A rough estimate is fine - just add up the main things you own.",
            ],
            note: "Estates valued over £325,000 may be subject to inheritance tax.",
          },
        },
        {
          title: "Complex Assets",
          description: "Do you have any of the following?",
          fields: [
            {
              name: "hasOverseasAssets",
              label: "I own property or assets outside the UK",
              type: "checkbox",
              required: false,
            },
            {
              name: "hasBusinessAssets",
              label: "I own a business or have business interests",
              type: "checkbox",
              required: false,
            },
            {
              name: "hasTrusts",
              label: "I am a beneficiary or trustee of a trust",
              type: "checkbox",
              required: false,
            },
          ],
          helpContent: {
            title: "Special Assets",
            content: [
              "Some assets need special consideration in your will.",
              "If you check any of these boxes, we'll provide guidance on next steps.",
            ],
            note: "Don't worry if you're not sure - you can always seek advice later.",
          },
        },
      ],
    },
    executors: {
      title: "Executors",
      steps: [
        {
          title: "Primary Executor",
          description: "Who will handle your estate?",
          fields: [
            {
              name: "primaryExecutor.name",
              label: "Executor's Full Name",
              type: "text",
              required: true,
              placeholder: "e.g. Jane Mary Smith",
            },
            {
              name: "primaryExecutor.relationship",
              label: "Their Relationship to You",
              type: "select",
              options: ["Spouse/Partner", "Child", "Sibling", "Parent", "Friend", "Professional", "Other"],
              required: true,
            },
            {
              name: "primaryExecutor.email",
              label: "Email Address",
              type: "email",
              required: false,
              placeholder: "e.g. jane.smith@email.com",
              tooltip: "This will help your family contact your executor when needed",
            },
            {
              name: "primaryExecutor.phone",
              label: "Phone Number",
              type: "tel",
              required: false,
              placeholder: "e.g. 07700 900123",
              tooltip: "An alternative way to contact your executor",
            },
          ],
          helpContent: {
            title: "Choosing Your Executor",
            content: [
              "Your executor is the person who will carry out your wishes after you're gone.",
              "Choose someone reliable who's good with paperwork and handling responsibilities.",
              "They'll need to collect your assets, pay any debts, and distribute what's left.",
              "Most people choose their spouse, adult child, sibling, or close friend.",
            ],
            note: "It's perfectly fine for your executor to also be someone who inherits from your will.",
          },
        },
        {
          title: "Backup Executor",
          description: "It's good to have a backup, just in case",
          fields: [
            {
              name: "backupExecutor.name",
              label: "Backup Executor's Name",
              type: "text",
              required: false,
              placeholder: "e.g. Thomas James Smith",
            },
            {
              name: "backupExecutor.relationship",
              label: "Their Relationship to You",
              type: "select",
              options: ["Spouse/Partner", "Child", "Sibling", "Parent", "Friend", "Professional", "Other"],
              required: false,
            },
            {
              name: "backupExecutor.email",
              label: "Email Address",
              type: "email",
              required: false,
              placeholder: "e.g. thomas.smith@email.com",
              tooltip: "This will help your family contact your backup executor if needed",
            },
            {
              name: "backupExecutor.phone",
              label: "Phone Number",
              type: "tel",
              required: false,
              placeholder: "e.g. 07700 900123",
              tooltip: "An alternative way to contact your backup executor",
            },
          ],
          helpContent: {
            title: "Why Have a Backup Executor?",
            content: [
              "A backup steps in if your first choice is unable or unwilling to act.",
              "It's good to have a backup, but this step is optional.",
            ],
          },
        },
      ],
    },
    beneficiaries: {
      title: "Beneficiaries",
      steps: [
        {
          title: "Main Beneficiary",
          description: "Who should inherit most of your estate?",
          fields: [
            {
              name: "mainBeneficiary.name",
              label: "Main Beneficiary's Name",
              type: "text",
              required: true,
              placeholder: "e.g. Jane Smith",
            },
            {
              name: "mainBeneficiary.relationship",
              label: "Their Relationship to You",
              type: "select",
              options: ["Spouse/Partner", "Child", "Sibling", "Parent", "Friend", "Charity", "Other"],
              required: true,
            },
            {
              name: "mainBeneficiary.percentage",
              label: "Percentage of Estate",
              type: "percentage",
              required: true,
              placeholder: "e.g. 100",
              defaultValue: "100", // Add default value
            },
          ],
          helpContent: {
            title: "Your Main Beneficiary",
            content: [
              "This is usually the person closest to you, like your spouse or partner.",
              "You'll be able to add more people in the next step if you wish.",
              "Specify what percentage of your estate they should receive.",
            ],
          },
        },
        {
          title: "Additional Beneficiaries",
          description: "Who else should inherit from your estate?",
          fields: [
            {
              name: "additionalBeneficiaries",
              label: "Add More Beneficiaries",
              type: "beneficiaries",
              required: false,
              skipOption: {
                show: true,
                text: "Skip additional beneficiaries",
              },
            },
          ],
          helpContent: {
            title: "Adding More Beneficiaries",
            content: [
              "These are other people you want to leave something to.",
              "You can add children, other family members, friends, or charities.",
              "Make sure the total percentage allocation equals 100%.",
            ],
            note: "Skip this if you want everything to go to your main beneficiary.",
          },
        },
        {
          title: "Specific Gifts",
          description: "Leave specific items or money to people",
          fields: [
            {
              name: "specificGifts",
              label: "Add Specific Gifts (Optional)",
              type: "gifts",
              required: false,
            },
          ],
          helpContent: {
            title: "Specific Gifts",
            content: [
              "These are particular items or money you want to leave to specific people.",
              "Examples: jewelry, artwork, family heirlooms, or specific amounts of money.",
              "These gifts are distributed before the percentage allocations are calculated.",
            ],
            examples: [
              "My grandmother's ring to my daughter Emma",
              "£5,000 to my nephew James",
              "My book collection to my friend Sarah",
            ],
          },
        },
        {
          title: "Residual Estate",
          description: "Who gets everything else?",
          fields: [
            {
              name: "residualEstate",
              label: "How should your remaining estate be distributed?",
              type: "select",
              options: [
                "Everything to my main beneficiary",
                "According to percentage allocations",
                "Equally between all beneficiaries",
                "Equally between my children only",
              ],
              required: true,
            },
          ],
          helpContent: {
            title: "Everything Else You Own",
            content: [
              "Your residual estate is everything not specifically mentioned elsewhere.",
              "This includes your home, savings, and other possessions.",
              "The distribution will follow the percentage allocations you've specified.",
            ],
            note: "Most people leave everything to their spouse or divide it between their children.",
          },
        },
      ],
    },
    wishes: {
      title: "Additional Wishes",
      steps: [
        {
          title: "Funeral Wishes",
          description: "Any specific wishes for your funeral?",
          fields: [
            {
              name: "funeralWishes",
              label: "Your Funeral Wishes (Optional)",
              type: "textarea",
              required: false,
              placeholder: "e.g., I would like to be cremated and have my ashes scattered at...",
            },
          ],
          helpContent: {
            title: "Funeral Preferences",
            content: [
              "Let your family know your preferences for your funeral.",
              "You can specify burial or cremation, music, or other requests.",
            ],
            note: "This section is optional but helpful for your loved ones.",
          },
        },
        {
          title: "Pet Care",
          description: "Do you have pets that need care after you're gone?",
          fields: [
            {
              name: "petCare",
              label: "Pet Care Instructions (Optional)",
              type: "textarea",
              required: false,
              placeholder: "e.g., I would like my dog Max to be cared for by my sister Jane...",
              skipOption: {
                show: true,
                text: "I don't have pets",
              },
            },
          ],
          helpContent: {
            title: "Planning for Your Pets",
            content: [
              "Specify who you'd like to take care of your pets.",
              "You can also leave money to help with their care.",
            ],
            example: "Example: I leave my cat Whiskers to my brother John, with £500 for her care.",
          },
        },
        {
          title: "Digital Assets",
          description: "What should happen to your online accounts and digital assets?",
          fields: [
            {
              name: "digitalAssets",
              label: "Digital Assets Instructions (Optional)",
              type: "textarea",
              required: false,
              placeholder: "e.g., My password manager details are stored with my executor...",
              skipOption: {
                show: true,
                text: "Skip digital assets",
              },
            },
          ],
          helpContent: {
            title: "Your Online Accounts",
            content: [
              "Digital assets include social media, email, and online accounts.",
              "You can leave instructions on what to do with these accounts.",
            ],
            note: "Don't include passwords in your will - store these separately and securely.",
          },
        },
      ],
    },
    legal: {
      title: "Legal & Verification",
      steps: [
        {
          title: "Legal Declaration",
          description: "Confirm your will meets UK legal requirements",
          fields: [
            {
              name: "legalDeclaration",
              label: "Legal Declaration",
              type: "legal-confirmation",
              required: true,
            },
          ],
          helpContent: {
            title: "Making Your Will Legal",
            content: [
              "For your will to be valid in the UK, you must:",
              "1. Be 18+ and of sound mind",
              "2. Sign it with two witnesses present",
              "3. Have your witnesses sign it in your presence",
            ],
            note: "Your witnesses cannot be beneficiaries or their spouses.",
          },
        },
      ],
    },
  }

  // Get current section and step data
  const currentSectionData = sections[currentSection]
  const currentStepData = currentSectionData.steps[currentStep]

  // Calculate total steps across all sections
  const totalSteps = Object.values(sections).reduce((total, section) => total + section.steps.length, 0)

  // Calculate current overall step number
  const calculateOverallStep = () => {
    let step = 0
      const sectionKeys = Object.keys(sections) as SectionKey[]
      const currentSectionIndex = sectionKeys.indexOf(currentSection)


    // Add steps from previous sections
    for (let i = 0; i < currentSectionIndex; i++) {
      step += sections[sectionKeys[i]].steps.length
    }

    // Add current step
    step += currentStep + 1

    return step
  }

  // Get full name from first, middle, and last name
  const getFullName = () => {
    const { firstName, middleName, lastName } = formData
    return [firstName, middleName, lastName].filter(Boolean).join(" ")
  }


  useEffect(() => {
    const sectionParam = searchParams.get("section")

    if (sectionParam && Object.keys(sections).includes(sectionParam)) {
      setCurrentSection(sectionParam as SectionKey)
      setCurrentStep(0)
    }
  }, [searchParams])


  const validateCurrentStep = () => {
    const currentStepData = sections[currentSection].steps[currentStep]
    let valid = true

    currentStepData.fields.forEach((field) => {
      if (field.required) {
        if (field.name.includes(".")) {
          // Handle nested fields like primaryExecutor.name
          const [parent, child] = field.name.split(".")
          valid = valid && !!formData[parent] && !!formData[parent][child]
        } else if (field.name === "children" || field.name === "additionalBeneficiaries") {
          // These are optional even if marked required
          valid = true
        } else if (field.name === "specificGifts") {
          // Specific gifts are optional
          valid = true
        } else if (field.name === "dateOfBirth") {
          // Check if all three date parts exist
          valid = valid && formData.dateOfBirthDay && formData.dateOfBirthMonth && formData.dateOfBirthYear
        } else if (field.type === "checkbox" && field.required) {
          // For required checkboxes, they must be checked
          valid = valid && formData[field.name] === true
        } else if (field.type === "address-fields") {
          // For address fields, check required address components
          valid = valid && formData.addressLine1 && formData.city && formData.postcode
        } else {
          valid = valid && !!formData[field.name]
        }
      }
    })

    // Special validation for beneficiary percentages
    if (currentSection === "beneficiaries" && currentStepData.title === "Additional Beneficiaries") {
      // Only enforce percentage validation if there are additional beneficiaries
      if (formData.additionalBeneficiaries && formData.additionalBeneficiaries.length > 0) {
        // Check if percentages add up to 100%
        let totalPercentage = 0

        // Add main beneficiary percentage
        if (formData.mainBeneficiary && formData.mainBeneficiary.percentage) {
          totalPercentage += Number.parseInt(formData.mainBeneficiary.percentage) || 0
        }

        // Add additional beneficiaries percentages
      formData.additionalBeneficiaries.forEach((beneficiary: { percentage: string }) => {
        totalPercentage += Number.parseInt(beneficiary.percentage) || 0;
      });

        // Only allow continuing if total is exactly 100%
        if (totalPercentage !== 100) {
          valid = false
        }
      }
    }

    setIsFormValid(valid)
  }

const handleInputChange = (name: string, value: any) => {
    if (name.includes(".")) {
      // Handle nested fields like primaryExecutor.name
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    // If setting the main beneficiary name and there's no percentage yet, default to 100%
    if (name === "mainBeneficiary.name" && value && !formData.mainBeneficiary?.percentage) {
      setFormData((prev) => ({
        ...prev,
        mainBeneficiary: {
          ...prev.mainBeneficiary,
          percentage: "100",
        },
      }))
    }
  }

  const handleDateOfBirthChange = (part: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [`dateOfBirth${part}`]: value,
    }))

    // If all three parts are filled, combine them into a single date string
    setTimeout(() => {
      const day = formData.dateOfBirthDay
      const month = formData.dateOfBirthMonth
      const year = formData.dateOfBirthYear

      if (day && month && year) {
        // Format as YYYY-MM-DD for storage
        const monthIndex =
          [
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
          ].indexOf(month) + 1
        const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`
        const formattedDay = day < 10 ? `0${day}` : `${day}`
        const dateString = `${year}-${formattedMonth}-${formattedDay}`

        setFormData((prev) => ({
          ...prev,
          dateOfBirth: dateString,
        }))
      }
    }, 0)
  }

  const handleNext = () => {
    if (!isFormValid) {
      toast({
        title: "Please complete this step",
        description: "All fields marked with * are required to continue.",
        variant: "destructive",
      })
      return
    }

    // Check if complex estate is detected and show referral if needed
    // Only show the referral if the user hasn't already acknowledged the complex estate
    if (isComplexEstate && !showReferral && !hasAcknowledgedComplexEstate) {
      setShowReferral(true)
      return
    }

    // If we're at the last step of the current section
    if (currentStep >= currentSectionData.steps.length - 1) {
      // Get all section keys
      const sectionKeys = Object.keys(sections) as SectionKey[]
      const currentSectionIndex = sectionKeys.indexOf(currentSection)

      // If there's another section
      if (currentSectionIndex < sectionKeys.length - 1) {
        setCurrentSection(sectionKeys[currentSectionIndex + 1])
        setCurrentStep(0)
      } else {
        // We're at the very end, go to review
        saveProgress()
        router.push("/create-will/review")
      }
    } else {
      // Special case: If we're on the Estate Value step and the value is below £350,000,
      // skip the Complex Assets step and go to the next section
      if (
        currentSection === "estate" &&
        currentStep === 0 &&
        formData.estateValue &&
        parseEstateValue(formData.estateValue) < 350000
      ) {
        const sectionKeys = Object.keys(sections) as SectionKey[]
        const currentSectionIndex = sectionKeys.indexOf(currentSection)

        if (currentSectionIndex < sectionKeys.length - 1) {
          setCurrentSection(sectionKeys[currentSectionIndex + 1])
          setCurrentStep(0)
        }
      } else {
        // Move to next step within current section
        setCurrentStep(currentStep + 1)
      }
    }

    window.scrollTo(0, 0)
    setShowHelp(false)
  }

  // Add a helper function to parse the estate value
  const parseEstateValue = (value: string): number => {
    if (!value) return 0
    // Remove pound sign, commas, and any non-numeric characters
    const numericValue = value.replace(/[^0-9.]/g, "")
    return Number.parseFloat(numericValue) || 0
  }

  const handleBack = () => {
    // If we're at the first step of the current section
    if (currentStep === 0) {
      // Get all section keys
      const sectionKeys = Object.keys(sections) as SectionKey[]
      const currentSectionIndex = sectionKeys.indexOf(currentSection)

      // If there's a previous section
      if (currentSectionIndex > 0) {
        const previousSection = sectionKeys[currentSectionIndex - 1]
        setCurrentSection(previousSection)
        setCurrentStep(sections[previousSection].steps.length - 1)
      } else {
        // We're at the very beginning, go to home
        router.push("/")
      }
    } else {
      // Move to previous step within current section
      setCurrentStep(currentStep - 1)
    }

    window.scrollTo(0, 0)
  }

  const handleSectionChange = (section: SectionKey) => {
    setCurrentSection(section)
    setCurrentStep(0)
    window.scrollTo(0, 0)
  }

  const saveProgress = () => {
    try {
      localStorage.setItem(
        "myEasyWill_savedProgress",
        JSON.stringify({
          step: currentStep,
          section: currentSection,
          formData: formData,
          timestamp: new Date().toISOString(),
          hasAcknowledgedComplexEstate: hasAcknowledgedComplexEstate,
        }),
      )

      toast({
        title: "Progress saved",
        description: "You can return and continue later.",
      })
    } catch (e) {
      console.error("Error saving progress", e)
      toast({
        title: "Could not save progress",
        description: "Please ensure your browser supports local storage.",
        variant: "destructive",
      })
    }
  }

  const toggleHelp = () => {
    setShowHelp(!showHelp)
  }

  const handleContinueAnyway = () => {
    // First, hide the referral
    setShowReferral(false)

    // Mark that the user has acknowledged the complex estate warning
    // This prevents showing it again during this session
    setHasAcknowledgedComplexEstate(true)

    // Then proceed to the next step or section
    if (currentStep >= currentSectionData.steps.length - 1) {
      const sectionKeys = Object.keys(sections) as SectionKey[]
      const currentSectionIndex = sectionKeys.indexOf(currentSection)

      if (currentSectionIndex < sectionKeys.length - 1) {
        setCurrentSection(sectionKeys[currentSectionIndex + 1])
        setCurrentStep(0)
      } else {
        saveProgress()
        router.push("/create-will/review")
      }
    } else {
      setCurrentStep(currentStep + 1)
    }

    // Scroll to top and keep help minimized
    window.scrollTo(0, 0)
    setShowHelp(false)

    // Add a toast to confirm the action
    toast({
      title: "Continuing with basic will",
      description: "You can always seek legal advice later if needed.",
    })
  }

  const handleSkipStep = () => {
    // Handle skipping different steps
    if (currentSection === "personal" && currentStepData.title === "Your Children") {
      // Set empty children array
      setFormData((prev) => ({
        ...prev,
        children: [],
      }))

      toast({
        title: "Step skipped",
        description: "You've indicated you don't have any children.",
      })
    } else if (currentSection === "wishes" && currentStepData.title === "Funeral Wishes") {
      // Clear funeral wishes
      setFormData((prev) => ({
        ...prev,
        funeralWishes: "",
      }))

      toast({
        title: "Step skipped",
        description: "No funeral wishes have been specified.",
      })
    } else if (currentSection === "executors" && currentStepData.title === "Backup Executor") {
      // Clear backup executor data
      setFormData((prev) => ({
        ...prev,
        backupExecutor: {
          name: "",
          relationship: "",
          email: "",
          phone: "",
        },
      }))

      toast({
        title: "Step skipped",
        description: "No backup executor has been specified.",
      })
    } else if (currentSection === "beneficiaries" && currentStepData.title === "Additional Beneficiaries") {
      // Clear additional beneficiaries
      setFormData((prev) => ({
        ...prev,
        additionalBeneficiaries: [],
      }))

      toast({
        title: "Step skipped",
        description: "No additional beneficiaries have been specified.",
      })
    } else if (currentSection === "beneficiaries" && currentStepData.title === "Specific Gifts") {
      // Clear specific gifts
      setFormData((prev) => ({
        ...prev,
        specificGifts: [],
      }))

      toast({
        title: "Step skipped",
        description: "No specific gifts have been specified.",
      })
    } else if (currentSection === "wishes" && currentStepData.title === "Pet Care") {
      // Clear pet care instructions
      setFormData((prev) => ({
        ...prev,
        petCare: "",
      }))

      toast({
        title: "Step skipped",
        description: "No pet care instructions have been specified.",
      })
    } else if (currentSection === "wishes" && currentStepData.title === "Digital Assets") {
      // Clear digital assets instructions
      setFormData((prev) => ({
        ...prev,
        digitalAssets: "",
      }))

      toast({
        title: "Step skipped",
        description: "No digital assets instructions have been specified.",
      })
    } 

    // Move to next step
    handleNext()
  }

  // Define the main steps for the Amazon-style progress bar
  const mainProgressSteps = ["Personal", "Estate", "Executors", "Beneficiaries", "Wishes", "Legal"]

  // Calculate the current main step based on the current section
  const getCurrentMainStep = () => {
    const sectionKeys = Object.keys(sections)
    return sectionKeys.indexOf(currentSection)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Fixed Header */}
      <BrandHeader showSave={true} onSave={saveProgress} />

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-24 quill-pattern">
        <div className="container mx-auto px-4 py-4">
          {/* Replace the mobile progress bar with the Amazon-style progress bar */}
          <div className="mx-auto max-w-3xl">
            <AmazonProgressBar steps={mainProgressSteps} currentStep={getCurrentMainStep()} className="mb-6" />
          </div>

          <div className="mx-auto max-w-md">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="brand-section-title">{currentSectionData.title}</h1>
              <Button
                variant="default"
                size="default"
                onClick={toggleHelp}
                className="flex items-center gap-2 bg-[#007BFF] hover:bg-[#0056b3] text-white font-medium px-4 py-2 rounded-md shadow-sm transition-all"
              >
                <HelpCircle className="h-5 w-5" />
                <span className="text-base">{showHelp ? "Hide Help" : "Show Help"}</span>
              </Button>
            </div>

            {showHelp && currentStepData.helpContent && (
              <HelpPanel
                title={currentStepData.helpContent.title}
                content={currentStepData.helpContent.content}
                example={currentStepData.helpContent.example}
                examples={currentStepData.helpContent.examples}
                note={currentStepData.helpContent.note}
              />
            )}

            {/* Show complex estate alert if detected - only if not already acknowledged */}
            {isComplexEstate && !showReferral && !hasAcknowledgedComplexEstate && (
              <Alert className="mb-6 border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Complex Estate Detected</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Your estate may have complex elements that could benefit from professional legal advice.
                </AlertDescription>
              </Alert>
            )}

            {/* Show solicitor referral if needed */}
            {showReferral ? (
              <SolicitorReferral
                onContinueAnyway={handleContinueAnyway}
                complexityFactors={{
                  hasOverseasAssets: formData.hasOverseasAssets,
                  hasBusinessAssets: formData.hasBusinessAssets,
                  hasTrusts: formData.hasTrusts,
                  highValue:
                    formData.estateValue && Number.parseInt(formData.estateValue.replace(/[^0-9]/g, "")) > 1000000,
                }}
              />
            ) : (
              <Card className="rounded-lg border bg-white p-6 shadow-sm brand-card">
                {/* Skip children step button - now handled in the FormStep component */}
                <FormStep
                  step={currentStepData}
                  formData={formData}
                  onChange={handleInputChange}
                  onDateOfBirthChange={handleDateOfBirthChange}
                  onSkipStep={handleSkipStep}
                />
              </Card>
            )}

            {/* Step indicator */}
            <div className="mt-6 text-center text-sm text-gray-500">
              Step {calculateOverallStep()} of {totalSteps}
            </div>
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
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {currentStep === 0 && currentSection === "personal" ? "Cancel" : "Back"}
          </Button>
          <Button
            size="lg"
            className={`flex-1 h-14 brand-button ${!isFormValid && "opacity-70"}`}
            onClick={handleNext}
            disabled={!isFormValid}
          >
            {currentStep === sections[currentSection].steps.length - 1 && currentSection === "legal"
              ? "Review Will"
              : "Continue"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
