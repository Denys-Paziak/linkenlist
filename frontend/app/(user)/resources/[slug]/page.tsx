"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  ArrowLeft,
  ThumbsUp,
  Twitter,
  Linkedin,
  Copy,
  CheckCircle,
  ThumbsDown,
  X,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollButtons } from "@/components/scroll-buttons"
// import { ResourceCard } from "@/components/resource-card"
import { EnhancedResourceCard } from "@/components/enhanced-resource-card"
import { DealCard } from "@/components/deal-card"

// Enhanced mock article data with more realistic military content
const getArticleBySlug = (slug: string) => {
  const articles = {
    "complete-pcs-checklist-2024": {
      id: "1",
      slug: "complete-pcs-checklist-2024",
      title: "Complete PCS Checklist: Your 90-Day Moving Guide",
      subtitle:
        "Everything you need to know for a successful Permanent Change of Station move, from orders to settling in at your new duty station.",
      author: "SSG Sarah Johnson",
      publishDate: "2024-01-15",
      readTime: "12 min read",
      category: "PCS",
      tags: ["PCS", "Moving", "Checklist", "Military Life"],
      verified: true,
      content: `
Moving with the military can be overwhelming, but with proper planning and organization, your PCS can be smooth and stress-free. This comprehensive guide breaks down everything you need to do in the 90 days leading up to your move.

## 90 Days Before Your Move

### Administrative Tasks

**Receive your PCS orders** - Review them carefully for accuracy. Check your reporting date, new duty station, and any special instructions. If you notice any errors, contact your personnel office immediately.

**Contact your losing unit** - Inform your chain of command about your upcoming move. Schedule a meeting with your supervisor to discuss transition plans and handover procedures.

**Research your new duty station** - Learn about the climate, housing options, schools, and local amenities. Visit the base website and connect with current personnel stationed there.

**Start your household goods shipment planning** - Decide what to ship, store, or take personally. Begin decluttering and organizing your belongings.

> **Pro Tip:** Start a PCS binder or digital folder to keep all your important documents organized throughout the process. Include copies of orders, medical records, school transcripts, and important contacts.

### Financial Preparation

**Review your PCS entitlements** - Use the Joint Travel Regulations (JTR) to understand what expenses you're entitled to claim. Familiarize yourself with per diem rates and mileage allowances.

**Open a savings account** for PCS expenses if you don't have one. Set aside funds for unexpected costs and temporary lodging.

**Research cost of living** at your new duty station. Use online calculators to compare housing costs, utilities, and general expenses.

**Plan for temporary lodging expenses** - Budget for hotels, meals, and incidental expenses during your travel and initial days at your new station.

## 60 Days Before Your Move

### Housing Arrangements

**Apply for on-base housing** at your new duty station if desired. Contact the housing office early as waiting lists can be long.

**Research off-base housing options** - Use resources like MilLife App, AHRN, or local Facebook groups to explore neighborhoods and rental properties.

**Schedule house hunting trip** if authorized by your orders. Coordinate with your sponsor and the housing office at your new duty station.

**Arrange temporary lodging** for your first few days. Book reservations early, especially during peak PCS season (summer months).

### School and Family Considerations

**Research schools** at your new location. Contact the School Liaison Officer at your new base for guidance on enrollment procedures.

**Request school records** for your children. Ensure all transcripts, immunization records, and special education documents are current.

**Research spouse employment opportunities** - Look into remote work options, local job markets, and military spouse-friendly employers.

**Plan for pet transportation** if applicable. Research quarantine requirements, health certificates, and pet-friendly lodging options.

## 30 Days Before Your Move

### Final Preparations

**Confirm your moving company** and shipment dates. Review the inventory list and understand your rights and responsibilities.

**Start using up frozen and perishable foods** - Plan meals to minimize waste and avoid packing items that won't survive the move.

**Begin packing personal items** you'll take in your car. Include essentials for the first few days at your new location.

**Arrange mail forwarding** with USPS. Submit your change of address form and notify important contacts of your new address.

### Medical and Administrative

**Schedule final medical appointments** - Complete any ongoing treatments and ensure all family members are up to date on routine care.

**Request medical records** for all family members. Obtain copies of immunization records, prescription histories, and any specialist reports.

**Update your will and insurance beneficiaries** - Ensure all documents reflect your current situation and new address.

**Notify creditors and banks** of your address change. Update automatic payments and direct deposits.

## Moving Week

### Last-Minute Tasks

**Pack a survival kit** for your first few days. Include clothing, toiletries, medications, important documents, and basic household items.

**Take photos** of valuable items before packing. Document the condition of electronics, furniture, and other high-value possessions.

**Keep important documents** with you during travel. Never pack birth certificates, passports, medical records, or financial documents in your household goods shipment.

**Do a final walkthrough** of your current home. Check all rooms, closets, and storage areas to ensure nothing is left behind.

## Important Resources

### Essential Websites

**Military OneSource** - Offers free PCS coaching, moving calculators, and comprehensive guides. Their counselors can provide personalized assistance throughout your move.

**MyPCS Mobile App** - Track your shipment in real-time and manage your move details. Available for both iOS and Android devices.

**Base Housing Offices** - Contact information for your losing and gaining duty stations. They can provide housing wait list information and local area guidance.

### Emergency Contacts

Keep these numbers easily accessible during your move:

- **Transportation Office:** Both losing and gaining base numbers
- **Moving Company:** Primary contact and 24-hour emergency line
- **Temporary Lodging:** Confirmation numbers and front desk contacts
- **Sponsor:** Your point of contact at the new duty station

## Common PCS Mistakes to Avoid

### Documentation Errors

**Not keeping receipts** for reimbursable expenses. Save all receipts for gas, meals, lodging, and other travel-related costs.

**Failing to document damaged items** immediately. Take photos and note any damage on the delivery inventory before signing.

**Not having copies of important documents** - Keep digital and physical copies of all critical paperwork.

### Planning Oversights

**Underestimating travel time** with family and pets. Plan for frequent stops and potential delays.

**Not researching temporary lodging** options in advance. Book early and have backup options ready.

**Forgetting about plants** - Remember that household goods companies cannot transport plants or hazardous materials.

## Financial Tips for Your PCS

### Maximize Your Reimbursements

**Keep all receipts** - Document every expense related to your move. Use a dedicated envelope or digital app to organize receipts.

**Understand your mileage allowance** - Plan your route to maximize reimbursement while ensuring safe travel.

**Know your per diem rates** - Use the GSA website to find current rates for your travel dates and locations.

### Budget Planning

Create a comprehensive PCS budget that includes:

- Travel expenses (gas, food, lodging)
- Temporary lodging expenses (TLE/TLA)
- Utility deposits and connection fees
- Emergency fund for unexpected expenses
- House hunting trip costs (if applicable)

## Settling In at Your New Duty Station

### First Week Priorities

**In-process at your new unit** - Complete all required check-ins and administrative tasks. Attend newcomer briefings and orientation sessions.

**Register for base services** - Get new ID cards if needed, register for commissary and exchange privileges, and enroll in base medical facilities.

**Explore your new community** - Locate essential services like grocery stores, gas stations, and medical facilities.

**Connect with other military families** - Join spouse groups, attend social events, and participate in newcomer activities.

### Long-term Integration

**Get involved in base activities** - Join sports leagues, hobby clubs, or volunteer organizations to build connections.

**Explore local attractions** - Take advantage of your new location's unique offerings and cultural opportunities.

**Build a support network** - Develop relationships with neighbors, coworkers, and community members.

**Document your experience** - Keep a journal or photo album of your PCS journey and new experiences.

## Conclusion

A successful PCS requires careful planning, attention to detail, and flexibility when things don't go as expected. By following this 90-day timeline and staying organized, you'll be well-prepared for your move and ready to thrive at your new duty station.

Remember that every PCS is a learning experience. Each move teaches you something new about the process and helps you develop strategies that work best for your family. Don't hesitate to reach out for help when you need it – the military community is built on mutual support and shared experiences.

**Final reminder:** This checklist provides general guidance, but always refer to your specific orders and consult with your transportation office for the most current and relevant information for your particular situation. Regulations and procedures can change, so verify all details with official sources.

Your PCS is not just a move – it's an opportunity for new experiences, career growth, and personal development. Embrace the adventure and make the most of this exciting chapter in your military journey.
      `,
      tableOfContents: [
        { id: "90-days-before", title: "90 Days Before Your Move", level: 2 },
        { id: "administrative-tasks", title: "Administrative Tasks", level: 3 },
        { id: "financial-preparation", title: "Financial Preparation", level: 3 },
        { id: "60-days-before", title: "60 Days Before Your Move", level: 2 },
        { id: "housing-arrangements", title: "Housing Arrangements", level: 3 },
        { id: "school-and-family", title: "School and Family Considerations", level: 3 },
        { id: "30-days-before", title: "30 Days Before Your Move", level: 2 },
        { id: "final-preparations", title: "Final Preparations", level: 3 },
        { id: "medical-and-administrative", title: "Medical and Administrative", level: 3 },
        { id: "moving-week", title: "Moving Week", level: 2 },
        { id: "important-resources", title: "Important Resources", level: 2 },
        { id: "common-mistakes", title: "Common PCS Mistakes to Avoid", level: 2 },
        { id: "financial-tips", title: "Financial Tips for Your PCS", level: 2 },
        { id: "settling-in", title: "Settling In at Your New Duty Station", level: 2 },
        { id: "conclusion", title: "Conclusion", level: 2 },
      ],
    },
    "va-disability-claims-guide": {
      id: "2",
      slug: "va-disability-claims-guide",
      title: "VA Disability Claims: Complete Step-by-Step Guide",
      subtitle: "Navigate the VA disability claims process with confidence and maximize your benefits.",
      author: "MSG Robert Chen",
      publishDate: "2024-01-12",
      readTime: "15 min read",
      category: "VA Benefits",
      tags: ["VA", "Disability", "Benefits", "Claims"],
      verified: true,
      content: `
Filing a VA disability claim can seem overwhelming, but understanding the process and preparing properly can significantly improve your chances of success. This comprehensive guide walks you through every step of the claims process.

## Understanding VA Disability Ratings

### How Ratings Work

The VA uses a percentage-based system to rate disabilities, from 0% to 100% in increments of 10%. These ratings determine your monthly compensation amount and eligibility for additional benefits.

**Combined Ratings** - If you have multiple disabilities, the VA uses a specific formula to calculate your combined rating. It's not simple addition – a 50% and 30% rating doesn't equal 80%.

**Effective Dates** - Your effective date determines when your benefits begin. Generally, it's the date you filed your claim or the date your disability began, whichever is later.

> **Pro Tip:** File your claim as soon as possible after separation or when you first notice symptoms. The effective date can significantly impact your total compensation.

## Before You File: Preparation Steps

### Gather Your Evidence

**Service Medical Records** - Collect all medical documentation from your time in service. This includes sick call visits, physical therapy records, and any injury reports.

**Current Medical Evidence** - Obtain recent medical records that show your current condition and how it affects your daily life.

**Buddy Statements** - Get written statements from fellow service members who witnessed your injury or can attest to how your condition affects you.

### Understand the Three Elements

Every successful VA claim must establish three key elements:

1. **Current Disability** - You must have a current medical condition
2. **Service Connection** - The condition must be related to your military service
3. **Nexus** - There must be a medical link between your service and current condition

## Filing Your Claim

### Choose Your Filing Method

**Online (VA.gov)** - The fastest and most convenient method. You can upload documents and track your claim status in real-time.

**By Mail** - Send your completed forms to your regional VA office. Use certified mail to ensure delivery confirmation.

**In Person** - Visit your local VA regional office or work with a Veterans Service Organization (VSO) representative.

### Required Forms

**VA Form 21-526EZ** - Application for Disability Compensation and Related Compensation Benefits. This is the primary form for most disability claims.

**VA Form 21-4142** - Authorization to release medical information. This allows the VA to request your medical records.

**Additional Forms** - Depending on your situation, you may need forms for specific conditions or circumstances.

## The Claims Process Timeline

### Initial Review (30-60 days)

The VA reviews your claim for completeness and requests any missing information. They may schedule you for a Compensation & Pension (C&P) exam during this phase.

### Development Phase (60-120 days)

The VA gathers evidence, including:
- Requesting your military and medical records
- Scheduling medical examinations
- Obtaining expert medical opinions

### Decision Phase (30-60 days)

A rating specialist reviews all evidence and makes a decision on your claim. You'll receive a decision letter explaining the outcome and your appeal rights.

## C&P Examinations

### What to Expect

**Purpose** - The exam helps the VA understand your current condition and its relationship to your military service.

**Preparation** - Bring all relevant medical records, a list of current medications, and be prepared to discuss how your condition affects your daily activities.

**Honesty** - Be completely honest about your symptoms and limitations. Don't exaggerate, but don't downplay your condition either.

### Common Exam Types

**General Medical** - Overall health assessment and review of claimed conditions.

**Mental Health** - Psychological evaluation for PTSD, depression, anxiety, and other mental health conditions.

**Specialty Exams** - Specific evaluations for conditions like hearing loss, vision problems, or orthopedic issues.

## Understanding Your Decision

### Rating Decision Elements

**Service Connection** - Whether the VA agrees your condition is related to military service.

**Disability Rating** - The percentage assigned to your condition based on severity and impact on earning capacity.

**Effective Date** - When your benefits begin, which affects back pay calculations.

### Types of Decisions

**Fully Granted** - All claimed conditions are service-connected and rated.

**Partially Granted** - Some conditions are approved, others are denied.

**Denied** - No conditions are found to be service-connected.

## If Your Claim is Denied

### Appeal Options

**Supplemental Claim** - Submit new evidence and have your claim reviewed again.

**Higher-Level Review** - Have a senior reviewer look at your case without submitting new evidence.

**Board Appeal** - Request a hearing before the Board of Veterans' Appeals.

### Working with Representatives

**Veterans Service Organizations (VSOs)** - Free assistance from organizations like DAV, VFW, or American Legion.

**VA-Accredited Attorneys** - Legal representation for complex cases, typically for a fee.

**Claims Agents** - Accredited individuals who can represent you for a fee.

## Maximizing Your Benefits

### Secondary Conditions

Many veterans don't realize they can claim conditions that result from their service-connected disabilities. For example, if you have a service-connected knee injury that causes you to walk differently, resulting in back problems, the back condition may also be service-connected.

### Individual Unemployability (IU)

If your service-connected disabilities prevent you from maintaining substantially gainful employment, you may be eligible for IU benefits, which pay at the 100% rate even if your combined rating is less than 100%.

### Dependency Benefits

Veterans with ratings of 30% or higher may be eligible for additional compensation for dependents, including spouses, children, and dependent parents.

## Common Mistakes to Avoid

### Filing Errors

**Incomplete Applications** - Missing information can delay your claim significantly.

**Poor Medical Evidence** - Weak or insufficient medical documentation is a leading cause of denials.

**Missing Deadlines** - Pay attention to all deadlines, especially for appeals and additional evidence submission.

### Strategic Mistakes

**Filing Too Early** - Filing before you have sufficient medical evidence can hurt your case.

**Not Using Professional Help** - VSOs and other representatives can significantly improve your chances of success.

**Giving Up After Denial** - Many successful claims are approved on appeal with additional evidence.

## Resources and Support

### Official VA Resources

**VA.gov** - The primary portal for filing claims and checking status.

**VA Regional Offices** - Local offices that can provide in-person assistance.

**Veterans Crisis Line** - 24/7 support for veterans in crisis: 1-800-273-8255.

### Veteran Organizations

**Disabled American Veterans (DAV)** - Provides free claim assistance and representation.

**Veterans of Foreign Wars (VFW)** - Offers claim support and advocacy services.

**American Legion** - Provides veterans service officers and claim assistance.

### Online Communities

**Reddit Veterans Communities** - Peer support and advice from other veterans.

**Facebook Groups** - Condition-specific groups and general VA claims support.

**HadIt.com** - Database of veteran experiences with various conditions and claims.

## Conclusion

Filing a successful VA disability claim requires patience, preparation, and persistence. The process can be complex and time-consuming, but the benefits – both financial and medical – can be life-changing for veterans and their families.

Remember that you have allies in this process. Veterans Service Organizations, fellow veterans, and VA staff are there to help you navigate the system and get the benefits you've earned through your service.

Don't be discouraged if your initial claim is denied or rated lower than expected. Many veterans succeed on appeal with additional evidence and proper representation. Your service-connected disabilities are real, and you deserve compensation for the sacrifices you made in service to our country.

**Take action today:** If you haven't filed yet, start gathering your evidence and consider reaching out to a VSO for assistance. If you have a pending claim, stay engaged in the process and respond promptly to any VA requests for information.

Your benefits are not charity – they are earned compensation for injuries and illnesses connected to your military service. Pursue them with confidence and determination.
      `,
      tableOfContents: [
        { id: "understanding-ratings", title: "Understanding VA Disability Ratings", level: 2 },
        { id: "preparation-steps", title: "Before You File: Preparation Steps", level: 2 },
        { id: "filing-your-claim", title: "Filing Your Claim", level: 2 },
        { id: "claims-timeline", title: "The Claims Process Timeline", level: 2 },
        { id: "cp-examinations", title: "C&P Examinations", level: 2 },
        { id: "understanding-decision", title: "Understanding Your Decision", level: 2 },
        { id: "if-denied", title: "If Your Claim is Denied", level: 2 },
        { id: "maximizing-benefits", title: "Maximizing Your Benefits", level: 2 },
        { id: "common-mistakes", title: "Common Mistakes to Avoid", level: 2 },
        { id: "resources-support", title: "Resources and Support", level: 2 },
        { id: "conclusion", title: "Conclusion", level: 2 },
      ],
    },
  }

  return articles[slug as keyof typeof articles] || null
}

// Related articles data - Updated to link to internal pages
const relatedArticles = [
  {
    id: "military-finance-basics",
    title: "Military Finance Basics: TSP and Beyond",
    description: "Essential financial planning strategies for service members and their families.",
    url: "/resources/military-finance-basics",
    tags: ["Finance", "TSP", "Investment"],
    screenshotImage: "/placeholder.svg?height=170&width=370&text=Military+Finance",
  },
  {
    id: "tricare-enrollment-guide",
    title: "TRICARE Enrollment Made Simple",
    description: "Navigate TRICARE options and enrollment with this comprehensive guide.",
    url: "/resources/tricare-enrollment-guide",
    tags: ["TRICARE", "Healthcare", "Benefits"],
    screenshotImage: "/placeholder.svg?height=170&width=370&text=TRICARE+Guide",
  },
  {
    id: "gi-bill-benefits-explained",
    title: "GI Bill Benefits Explained",
    description: "Maximize your education benefits and understand transfer options.",
    url: "/resources/gi-bill-benefits-explained",
    tags: ["GI Bill", "Education", "Benefits"],
    screenshotImage: "/placeholder.svg?height=170&width=370&text=GI+Bill+Guide",
  },
]

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export default function ResourceDetailPage({ params }: { params: { slug: string } }) {
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState("")
  const [helpfulCount, setHelpfulCount] = useState(42) // Start with some initial count
  const [hasVoted, setHasVoted] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)
  const [copied, setCopied] = useState(false)
  const [tocItems, setTocItems] = useState<Array<{ id: string; text: string; level: number }>>([])
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const [tocCollapsed, setTocCollapsed] = useState(true)

  const [showAllComments, setShowAllComments] = useState(false)

  const [showCommentForm, setShowCommentForm] = useState(false)

  const [likedComments, setLikedComments] = useState<Set<number>>(new Set())
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [editingComment, setEditingComment] = useState<number | null>(null)
  const [editText, setEditText] = useState("")
  const [dislikedComments, setDislikedComments] = useState<Set<number>>(new Set())

  const mockComments = [
    {
      id: 1,
      author: "SSgt Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=SJ",
      content:
        "This guide was incredibly helpful during my recent PCS move. The timeline breakdown saved me so much stress!",
      timestamp: "2 days ago",
      likes: 12,
    },
    {
      id: 2,
      author: "CPT Martinez",
      avatar: "/placeholder.svg?height=40&width=40&text=CM",
      content: "Great resource! I wish I had this during my last move. The housing section is particularly detailed.",
      timestamp: "5 days ago",
      likes: 8,
    },
    {
      id: 3,
      author: "TSgt Williams",
      avatar: "/placeholder.svg?height=40&width=40&text=TW",
      content: "The financial planning tips are spot on. Helped me budget properly for my upcoming PCS.",
      timestamp: "1 week ago",
      likes: 15,
    },
    {
      id: 4,
      author: "LT Davis",
      avatar: "/placeholder.svg?height=40&width=40&text=LD",
      content: "As a first-time PCS'er, this guide answered all my questions. Thank you for putting this together!",
      timestamp: "1 week ago",
      likes: 6,
    },
    {
      id: 5,
      author: "MSgt Thompson",
      avatar: "/placeholder.svg?height=40&width=40&text=MT",
      content: "The checklist format makes it easy to track progress. I'm sharing this with my entire unit.",
      timestamp: "2 weeks ago",
      likes: 20,
    },
  ]

  const visibleComments = showAllComments ? mockComments : mockComments.slice(0, 3)

  const article = getArticleBySlug(params.slug)

  const handleUserProfileClick = (comment: any) => {
    // Mock user data based on comment author
    const userData = {
      name: comment.author,
      role: "Military Member",
      avatar: comment.avatar,
      initials: comment.author
        .split(" ")
        .map((n: string) => n[0])
        .join(""),
      phone: "(555) 123-4567",
      email: `${comment.author.toLowerCase().replace(/\s+/g, ".")}.${Math.floor(Math.random() * 1000)}@military.mil`,
      companyName: "U.S. Military",
      memberSince: "January 2020 (4 years, 8 months)",
      resourcesShared: Math.floor(Math.random() * 50) + 10,
      commentsPosted: Math.floor(Math.random() * 200) + 50,
      listings: {
        forSale: Math.floor(Math.random() * 20),
        forRent: Math.floor(Math.random() * 15),
      },
    }
    setSelectedUser(userData)
    setShowUserProfile(true)
  }

  const handleLike = (commentId: number) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  const handleDislike = (commentId: number) => {
    setDislikedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  const handleReply = (commentId: number) => {
    setReplyingTo(replyingTo === commentId ? null : commentId)
  }

  const handleEdit = (commentId: number, currentText: string) => {
    setEditingComment(commentId)
    setEditText(currentText)
  }

  const saveEdit = (commentId: number) => {
    // Here you would typically update the comment in your data source
    setEditingComment(null)
    setEditText("")
  }

  const cancelEdit = () => {
    setEditingComment(null)
    setEditText("")
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      // Use native scrollTo for better compatibility
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })

      // Set active section after a brief delay to ensure scroll completes
      setTimeout(() => {
        setActiveSection(sectionId)
      }, 100)
    }
  }

  const shareOnTwitter = () => {
    const text = `Check out this helpful military resource: ${article?.title}`
    const url = window.location.href
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
    )
  }

  const shareOnLinkedIn = () => {
    const url = window.location.href
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
  }

  const generateTOCRef = useRef<() => void>(() => {})
  const [firstRender, setFirstRender] = useState(true)
  const generateTOC = useCallback(() => {
    const headings = document.querySelectorAll("h2, h3")
    const items: Array<{ id: string; text: string; level: number }> = []

    headings.forEach((heading, index) => {
      const level = Number.parseInt(heading.tagName.charAt(1))
      const headingText = heading.textContent || ""

      // Skip "Related Resources" section
      if (headingText.toLowerCase().includes("related resources")) {
        return
      }

      let id = heading.id

      // Generate ID if it doesn't exist
      if (!id) {
        id =
          headingText
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || `heading-${index}`
        heading.id = id
      }

      items.push({
        id,
        text: headingText,
        level,
      })
    })

    setTocItems(items)
  }, [])

  useEffect(() => {
    generateTOCRef.current = generateTOC
  }, [generateTOC])

  useEffect(() => {
    // Generate TOC from DOM
    if (firstRender) {
      generateTOCRef.current()
      setFirstRender(false)
    }
  }, [firstRender])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(Math.min(progress, 100))

      // Find active section with improved logic
      const currentActiveSection = ""
      let bestMatch = { distance: Number.MAX_VALUE, id: "" }

      tocItems.forEach((item) => {
        const element = document.getElementById(item.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + scrollTop
          const distance = Math.abs(scrollTop + 150 - elementTop)

          // Only consider sections that are currently visible or above the viewport
          if (rect.top <= 200 && distance < bestMatch.distance) {
            bestMatch = { distance, id: item.id }
          }
        }
      })

      if (bestMatch.id && bestMatch.id !== activeSection) {
        setActiveSection(bestMatch.id)
      }
    }

    // Only add scroll listener if we have TOC items
    if (tocItems.length === 0) return

    // Use passive scroll listener to improve performance
    const throttledHandleScroll = () => {
      requestAnimationFrame(handleScroll)
    }

    window.addEventListener("scroll", throttledHandleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll)
    }
  }, [tocItems, activeSection])

  if (!article) {
    return (
      <>
        <Header onSubmitLink={() => {}} />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-3xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8 text-lg">
              The resource you're looking for doesn't exist or may have been moved.
            </p>
            <Link href="/resources">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Resources
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }
  return (
    <>
      <style jsx global>{`
  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
  .scale-102 {
    transform: scale(1.02);
  }
`}</style>
      <Header onSubmitLink={() => {}} />

      <div className="min-h-screen bg-background">
        {/* Reading Progress Bar */}
        <div className="fixed top-[56px] left-0 right-0 z-30">
          <div className="h-1 bg-gray-200">
            <div
              className="h-full bg-accent transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-0">
          <div className="flex gap-4 lg:gap-8 pb-12">
            {/* Table of Contents - Desktop Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-20">
                {/* Back Button */}
                <div className="mb-4">
                  <Link href="/resources">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary/50 group"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                      Back to Resources
                    </Button>
                  </Link>
                </div>

                {/* Table of Contents */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-800 text-sm">Contents</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTocCollapsed(!tocCollapsed)}
                      className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                    >
                      {tocCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </Button>
                  </div>
                  {!tocCollapsed && (
                    <nav className="space-y-2" id="toc-nav">
                      {tocItems
                        .filter((item) => item.level === 2)
                        .map((item, index) => {
                          const isActive = activeSection === item.id

                          return (
                            <button
                              key={item.id}
                              data-section={item.id}
                              onClick={() => scrollToSection(item.id)}
                              className={`group flex items-start gap-2 w-full text-left py-2 px-2 rounded transition-all duration-200 text-sm
                            ${
                              isActive
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                            }
                          `}
                            >
                              <div
                                className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 transition-all duration-200
                            ${isActive ? "bg-blue-500" : "bg-gray-300 group-hover:bg-gray-400"}
                          `}
                              ></div>
                              <span className="leading-relaxed break-words">{item.text}</span>
                            </button>
                          )
                        })}
                    </nav>
                  )}
                </div>

                {/* Featured Resource */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">Featured Deal</h3>

                  <div className="space-y-3">
                    <DealCard
                      deal={{
                        id: "1",
                        title: "ADOBE CREATIVE CLOUD MILITARY DISCOUNT",
                        description:
                          "Get 60% off Adobe Creative Cloud All Apps plan. Includes Photoshop, Illustrator, Premiere Pro, After Effects, and more creative tools for military members and veterans.",
                        provider: "Adobe",
                        category: "software",
                        discountType: "Percentage",
                        discountAmount: "60% OFF",
                        url: "https://adobe.com/military",
                        dateAdded: "2024-01-15",
                        isVerified: true,
                        isPopular: true,
                        screenshotImage: "/placeholder.svg?height=170&width=370&text=Adobe+Creative+Cloud",
                      }}
                      onClick={() => window.open("/deals/1", "_blank")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile TOC Toggle */}
            <div className="fixed bottom-6 right-6 z-50 lg:hidden">
              <Button
                onClick={() => setMobileTocOpen(!mobileTocOpen)}
                className="bg-white border border-gray-200 shadow-lg text-gray-700 hover:bg-gray-50 rounded-full w-12 h-12 p-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>

            {/* Mobile TOC Overlay */}
            {mobileTocOpen && (
              <div
                className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                onClick={() => setMobileTocOpen(false)}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-6 max-h-[70vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-base">Table of Contents</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMobileTocOpen(false)}
                      className="h-6 w-6 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <nav className="space-y-1">
                    {tocItems.map((item) => {
                      const isActive = activeSection === item.id
                      const isH3 = item.level === 3

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            scrollToSection(item.id)
                            setMobileTocOpen(false)
                          }}
                          className={`group flex items-start gap-2 w-full text-left py-2 px-3 rounded-md transition-all duration-200 text-sm
                            ${
                              isActive
                                ? "bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-500"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }
                            ${isH3 ? "ml-4 text-xs" : ""}
                          `}
                        >
                          <div className={`flex-shrink-0 mt-1.5 ${isActive ? "text-blue-500" : "text-gray-300"}`}>
                            {isH3 ? (
                              <div className={`w-1 h-1 rounded-full ${isActive ? "bg-blue-500" : "bg-gray-300"}`}></div>
                            ) : (
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-blue-500" : "bg-gray-400"}`}
                              ></div>
                            )}
                          </div>
                          <span className="leading-relaxed">{item.text}</span>
                        </button>
                      )
                    })}
                  </nav>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 max-w-full lg:max-w-4xl min-w-0">
              {/* Hero Image */}
              <div className="bg-white rounded-lg shadow-sm border border-border mb-6 lg:mb-8 mt-6 overflow-hidden">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=400&width=800&text=PCS+Moving+Guide"
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Title and Summary Section */}
              <div className="bg-white rounded-lg shadow-sm border border-border p-8 mb-8">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                  {article.verified && (
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-200 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">{article.title}</h1>

                {/* Summary */}
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Moving with the military can be overwhelming, but with proper planning and organization, your PCS can
                  be smooth and stress-free. This comprehensive guide breaks down everything you need to do in the 90
                  days leading up to your move.
                </p>

                {/* Metadata */}
              </div>

              {/* Article Content - Split into organized sections */}
              <div className="space-y-6 lg:space-y-8">
                {/* 90 Days Before Section */}
                <div className="bg-white rounded-lg shadow-sm border border-border p-4 sm:p-6 lg:p-8">
                  <h2
                    id="90-days-before"
                    className="text-2xl font-bold text-foreground mb-6 pb-3 border-b border-border scroll-mt-24"
                  >
                    90 Days Before Your Move
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 id="administrative-tasks" className="text-xl font-semibold text-foreground mb-4 scroll-mt-24">
                        Administrative Tasks
                      </h3>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          <strong>Receive your PCS orders</strong> - Review them carefully for accuracy. Check your
                          reporting date, new duty station, and any special instructions.
                        </p>
                        <p>
                          <strong>Contact your losing unit</strong> - Inform your chain of command about your upcoming
                          move.
                        </p>
                        <p>
                          <strong>Research your new duty station</strong> - Learn about the climate, housing options,
                          schools, and local amenities.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3
                        id="financial-preparation"
                        className="text-xl font-semibold text-foreground mb-4 scroll-mt-24"
                      >
                        Financial Preparation
                      </h3>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          <strong>Review your PCS entitlements</strong> - Use the Joint Travel Regulations (JTR) to
                          understand expenses.
                        </p>
                        <p>
                          <strong>Open a savings account</strong> for PCS expenses if you don't have one.
                        </p>
                        <p>
                          <strong>Research cost of living</strong> at your new duty station.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Download className="h-5 w-5 text-primary" />
                      Download Attachment
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <a
                        href="#"
                        className="flex items-center justify-between group"
                        onClick={(e) => {
                          e.preventDefault()
                          // In a real app, this would trigger the file download
                          console.log("Downloading: Guide on how to use this discount.pdf")
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                              Guide on how to use this discount.pdf
                            </p>
                            <p className="text-sm text-muted-foreground">PDF Document</p>
                          </div>
                        </div>
                        <Download className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* 60 Days Before Section */}
                <div className="bg-white rounded-lg shadow-sm border border-border p-4 sm:p-6 lg:p-8">
                  <h2
                    id="60-days-before"
                    className="text-2xl font-bold text-foreground mb-6 pb-3 border-b border-border scroll-mt-24"
                  >
                    60 Days Before Your Move
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 id="housing-arrangements" className="text-xl font-semibold text-foreground mb-4 scroll-mt-24">
                        Housing Arrangements
                      </h3>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          <strong>Apply for on-base housing</strong> at your new duty station if desired.
                        </p>
                        <p>
                          <strong>Research off-base housing options</strong> - Use resources like MilLife App, AHRN, or
                          local Facebook groups.
                        </p>
                        <p>
                          <strong>Schedule house hunting trip</strong> if authorized by your orders.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Resources Section */}
                <div className="bg-white rounded-lg shadow-sm border border-border p-4 sm:p-6 lg:p-8">
                  <h2
                    id="important-resources"
                    className="text-2xl font-bold text-foreground mb-6 pb-3 border-b border-border scroll-mt-24"
                  >
                    Important Resources
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">Essential Websites</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>
                          <strong>Military OneSource</strong> - Free PCS coaching and guides
                        </li>
                        <li>
                          <strong>MyPCS Mobile App</strong> - Track shipments in real-time
                        </li>
                        <li>
                          <strong>Base Housing Offices</strong> - Contact information for duty stations
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">Emergency Contacts</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>Transportation Office numbers</li>
                        <li>Moving Company contacts</li>
                        <li>Temporary Lodging confirmations</li>
                        <li>Sponsor contact information</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Tips and Conclusion Section */}
                <div className="bg-white rounded-lg shadow-sm border border-border p-4 sm:p-6 lg:p-8">
                  <h2
                    id="conclusion"
                    className="text-2xl font-bold text-foreground mb-6 pb-3 border-b border-border scroll-mt-24"
                  >
                    Final Tips & Conclusion
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      A successful PCS requires careful planning, attention to detail, and flexibility when things don't
                      go as expected. By following this 90-day timeline and staying organized, you'll be well-prepared
                      for your move.
                    </p>
                    <p>
                      Remember that every PCS is a learning experience. Don't hesitate to reach out for help when you
                      need it – the military community is built on mutual support and shared experiences.
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                      <p className="text-blue-800 font-medium">
                        <strong>Pro Tip:</strong> Start a PCS binder or digital folder to keep all your important
                        documents organized throughout the process.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share & Feedback Section */}
              <div className="bg-white rounded-lg shadow-sm border border-border p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-8">
                  {/* Share Buttons */}
                  <div>
                    <h3 className="font-bold text-foreground mb-4 text-base">Share this article</h3>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 bg-white"
                      >
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied!" : "Copy Link"}
                      </Button>
                      
                      
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <h3 className="font-bold text-foreground mb-4 text-base">Was this helpful?</h3>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Button
                          variant={hasVoted ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (!hasVoted) {
                              setHelpfulCount((prev) => prev + 1)
                              setHasVoted(true)
                              setShowFireworks(true)
                              setTimeout(() => setShowFireworks(false), 1000)
                            }
                          }}
                          disabled={hasVoted}
                          className={`flex items-center gap-2 transition-all duration-200 ${
                            hasVoted
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "border-green-300 text-green-600 hover:border-green-500 hover:bg-green-50"
                          }`}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          {hasVoted ? "Thanks!" : "Yes"}
                        </Button>

                        {/* Fireworks Animation */}
                        {showFireworks && (
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              {[...Array(6)].map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                                  style={{
                                    transform: `rotate(${i * 60}deg) translateY(-20px)`,
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: "0.6s",
                                  }}
                                />
                              ))}
                              {[...Array(6)].map((_, i) => (
                                <div
                                  key={i + 6}
                                  className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
                                  style={{
                                    transform: `rotate(${i * 60 + 30}deg) translateY(-15px)`,
                                    animationDelay: `${i * 0.1 + 0.3}s`,
                                    animationDuration: "0.6s",
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <span className="text-sm text-muted-foreground font-medium">
                        {helpfulCount} people found this helpful
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-border p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-foreground text-lg">Comments ({mockComments.length})</h3>
                </div>

                <div className="mb-8 pb-6 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Leave a comment</h4>
                  <div className="space-y-4">
                    <div>
                      <textarea
                        id="comment-text"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Share your thoughts about this resource..."
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Button className="bg-[#003366] hover:bg-[#003366]/90 text-white">Post Comment</Button>
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:border-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-transparent"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6 relative">
                  {visibleComments.map((comment, index) => (
                    <div key={comment.id} className="flex gap-4">
                      <button
                        onClick={() => handleUserProfileClick(comment)}
                        className="flex-shrink-0 hover:opacity-80 transition-opacity"
                      >
                        <div className="w-10 h-10 rounded-full cursor-pointer bg-slate-800 flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {comment.author
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                        </div>
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">
                            @{comment.author.toLowerCase().replace(/\s+/g, "")}
                          </span>
                          <span className="text-gray-500 text-xs">{comment.timestamp}</span>
                        </div>

                        {editingComment === comment.id ? (
                          <div className="mb-2">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                              rows={3}
                            />
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                size="sm"
                                onClick={() => saveEdit(comment.id)}
                                className="bg-[#003366] hover:bg-[#003366]/90 text-white text-xs px-3 py-1"
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEdit}
                                className="text-xs px-3 py-1 bg-transparent"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">{comment.content}</p>
                        )}

                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleLike(comment.id)}
                            className={`flex items-center gap-1 text-xs transition-all duration-200 px-2 py-1 rounded-md ${
                              likedComments.has(comment.id)
                                ? "text-blue-600 bg-blue-50"
                                : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            <ThumbsUp className={`h-3 w-3 ${likedComments.has(comment.id) ? "fill-current" : ""}`} />
                            <span>{comment.likes + (likedComments.has(comment.id) ? 1 : 0)}</span>
                          </button>

                          <button
                            onClick={() => handleDislike(comment.id)}
                            className={`flex items-center gap-1 text-xs transition-all duration-200 px-2 py-1 rounded-md ${
                              dislikedComments.has(comment.id)
                                ? "text-red-600 bg-red-50"
                                : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                            }`}
                          >
                            <ThumbsDown
                              className={`h-3 w-3 ${dislikedComments.has(comment.id) ? "fill-current" : ""}`}
                            />
                          </button>

                          <button
                            onClick={() => handleReply(comment.id)}
                            className="text-gray-500 hover:text-white hover:bg-gray-700 text-xs transition-all duration-200 px-2 py-1 rounded-md"
                          >
                            Reply
                          </button>

                          {comment.author === "You" && editingComment !== comment.id && (
                            <button
                              onClick={() => handleEdit(comment.id, comment.content)}
                              className="text-gray-500 hover:text-white hover:bg-gray-700 text-xs transition-all duration-200 px-2 py-1 rounded-md"
                            >
                              Edit
                            </button>
                          )}
                        </div>

                        {replyingTo === comment.id && (
                          <div className="mt-4 pl-4 border-l-2 border-gray-200">
                            <textarea
                              placeholder="Write a reply..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                              rows={2}
                            />
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                size="sm"
                                className="bg-[#003366] hover:bg-[#003366]/90 text-white text-xs px-3 py-1"
                              >
                                Reply
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setReplyingTo(null)}
                                className="text-xs px-3 py-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Fading Effect */}
                  {!showAllComments && mockComments.length > 3 && (
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                  )}
                </div>

                {/* Show More/Less Buttons */}
                {!showAllComments && mockComments.length > 3 && (
                  <div className="text-center mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAllComments(true)
                        setShowCommentForm(true)
                      }}
                      className="border-gray-300 text-gray-700 hover:border-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-transparent"
                    >
                      Show more comments ({mockComments.length - 3} more)
                    </Button>
                  </div>
                )}

                {showAllComments && mockComments.length > 3 && (
                  <div className="text-center mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAllComments(false)
                        setShowCommentForm(false)
                      }}
                      className="border-gray-300 text-gray-700 hover:border-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-transparent"
                    >
                      Show less
                    </Button>
                  </div>
                )}
              </div>

              {/* Related Resources */}
              <div className="bg-white rounded-lg shadow-sm border border-border p-4 sm:p-6 lg:p-8">
                <h2 className="font-bold text-foreground text-lg mb-6">Related Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                  {relatedArticles.map((resource) => (
                    <EnhancedResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </div>

              <div className="lg:hidden bg-white rounded-lg shadow-sm border border-border p-4 sm:p-6 mb-6 lg:mb-8">
                <h3 className="font-bold text-foreground text-lg mb-6">Featured Deal</h3>
                <div className="space-y-3">
                  <DealCard
                    deal={{
                      id: "1",
                      title: "ADOBE CREATIVE CLOUD MILITARY DISCOUNT",
                      description:
                        "Get 60% off Adobe Creative Cloud All Apps plan. Includes Photoshop, Illustrator, Premiere Pro, After Effects, and more creative tools for military members and veterans.",
                      provider: "Adobe",
                      category: "software",
                      discountType: "Percentage",
                      discountAmount: "60% OFF",
                      url: "https://adobe.com/military",
                      dateAdded: "2024-01-15",
                      isVerified: true,
                      isPopular: true,
                      screenshotImage: "/placeholder.svg?height=170&width=370&text=Adobe+Creative+Cloud",
                    }}
                    onClick={() => window.open("/deals/1", "_blank")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showUserProfile} onOpenChange={setShowUserProfile}>
        <DialogContent className="w-[95vw] max-w-sm sm:max-w-md bg-white rounded-xl border border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-[#222222] flex items-center justify-between">
              Agent Profile
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 sm:space-y-6 pt-2">
              {/* Profile Header */}
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-white text-xl sm:text-2xl font-bold">{selectedUser.initials}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#222222] mb-1">{selectedUser.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-2">Real Estate Agent</p>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-[#222222] mb-2 sm:mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#222222]/70 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{selectedUser.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#222222]/70 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{selectedUser.email}</span>
                  </div>
                </div>
              </div>

              {/* Company Name */}
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-[#222222] mb-2">Company Name</h4>
                <p className="text-[#222222]/70 text-sm">{selectedUser.companyName}</p>
              </div>

              {/* LinkEnlist Experience */}
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-[#222222] mb-2">LinkEnlist Experience</h4>
                <p className="text-[#222222]/70 text-sm">Member since: {selectedUser.memberSince}</p>
              </div>

              {/* Property Listings */}
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-[#222222] mb-2 sm:mb-3">Property Listings</h4>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-primary mb-1">
                      {selectedUser.listings.forSale}
                    </div>
                    <div className="text-xs sm:text-sm text-[#222222]/70">For Sale</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-red-600 mb-1">
                      {selectedUser.listings.forRent}
                    </div>
                    <div className="text-xs sm:text-sm text-[#222222]/70">For Rent</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ScrollButtons />
      <Footer />
    </>
  )
}
