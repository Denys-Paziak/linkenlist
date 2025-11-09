"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Tag,
  Users,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Phone,
  Mail,
  ChevronDown,
  FileText,
  Download,
} from "lucide-react"
import { ScrollButtons } from "@/components/scroll-buttons"
import { EnhancedResourceCard } from "@/components/enhanced-resource-card"
import { mockResources } from "@/data/mock-resources"
import { Button } from "@/components/ui/button"
import { DealCard } from "@/components/deal-card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Deal {
  id: string
  title: string
  description: string
  longDescription: string
  provider: string
  category: string
  discountType: string
  discountAmount: string
  url: string
  dateAdded: string
  expiresAt?: string
  isVerified: boolean
  isPopular: boolean
  screenshotImage: string
  eligibility: string[]
  howToRedeem: string[]
  offerDetails: {
    originalPrice?: string
    discountedPrice?: string
    savings?: string
    validUntil?: string
    provider: string
  }
}

// Mock API response - in real app this would come from an API
const mockDealsAPI: Record<string, Deal> = {
  "1": {
    id: "1",
    title: "Adobe Creative Cloud Military Discount",
    description: "Get 60% off Adobe Creative Cloud All Apps plan with exclusive military pricing.",
    longDescription:
      "Adobe Creative Cloud is the industry-standard suite of creative applications used by professionals worldwide. This exclusive military discount provides access to over 20 desktop and mobile apps including Photoshop, Illustrator, InDesign, Premiere Pro, After Effects, and more. Perfect for military members pursuing creative careers, side projects, or personal interests in design, photography, and video editing. The subscription includes cloud storage, premium fonts, and regular updates to all applications.",
    provider: "Adobe",
    category: "Software",
    discountType: "Percentage",
    discountAmount: "60% OFF",
    url: "https://adobe.com/military",
    dateAdded: "2024-01-15",
    isVerified: true,
    isPopular: true,
    screenshotImage: "/placeholder.svg?height=400&width=800&text=Adobe+Creative+Cloud+Military+Discount",
    eligibility: [
      "Active duty military personnel (all branches)",
      "Veterans with DD-214 documentation",
      "Military spouses and dependents with valid ID",
      "National Guard and Reserve members",
      "Retired military personnel",
    ],
    howToRedeem: [
      "Visit the Adobe military discount page using the link below",
      "Click 'Verify Military Status' and complete ID.me verification",
      "Upload required military documentation (CAC, DD-214, etc.)",
      "Wait for verification approval (usually 24-48 hours)",
      "Apply the discount to your Creative Cloud subscription",
      "Download and start using all Creative Cloud applications",
    ],
    offerDetails: {
      originalPrice: "$52.99/month",
      discountedPrice: "$19.99/month",
      savings: "$33.00/month ($396/year)",
      validUntil: "Ongoing offer - no expiration",
      provider: "Adobe Systems",
    },
  },
  "2": {
    id: "2",
    title: "Microsoft Office 365 Military",
    description: "Free Microsoft Office 365 for active duty military and veterans with full premium features.",
    longDescription:
      "Microsoft Office 365 provides essential productivity tools for work, school, and personal use. This military benefit includes the complete suite of Office applications (Word, Excel, PowerPoint, Outlook), cloud storage through OneDrive, collaboration tools via Teams, and access to premium features typically reserved for paid subscribers. The offer is completely free for eligible military members and includes regular updates and security patches.",
    provider: "Microsoft",
    category: "Software",
    discountType: "Free",
    discountAmount: "FREE",
    url: "https://microsoft.com/military",
    dateAdded: "2024-01-10",
    isVerified: true,
    isPopular: true,
    screenshotImage: "/placeholder.svg?height=400&width=800&text=Microsoft+Office+365+Military",
    eligibility: [
      "Active duty military personnel",
      "Veterans with honorable discharge",
      "Military family members with dependent ID",
      "Department of Defense employees",
      "Military contractors with valid credentials",
    ],
    howToRedeem: [
      "Go to Microsoft's military portal",
      "Sign in with your military email address (.mil domain)",
      "Alternatively, verify your status through ID.me",
      "Complete the account setup process",
      "Download Office 365 applications to your devices",
      "Access OneDrive cloud storage and Teams collaboration tools",
    ],
    offerDetails: {
      originalPrice: "$99.99/year",
      discountedPrice: "FREE",
      savings: "$99.99/year",
      validUntil: "While military status remains active",
      provider: "Microsoft Corporation",
    },
  },
  "3": {
    id: "3",
    title: "Amazon Prime Military Discount",
    description: "Get Amazon Prime for $6.99/month instead of $14.99 with exclusive military pricing.",
    longDescription:
      "Amazon Prime offers fast, free shipping on millions of items, access to Prime Video streaming service with thousands of movies and TV shows, Prime Music with ad-free listening, exclusive deals during Prime Day, and much more. The military discount makes this premium service even more affordable for service members and their families, providing significant savings on everyday purchases and entertainment.",
    provider: "Amazon",
    category: "Subscriptions",
    discountType: "Fixed Amount",
    discountAmount: "$8 OFF/MONTH",
    url: "https://amazon.com/prime/military",
    dateAdded: "2024-01-08",
    isVerified: true,
    isPopular: false,
    screenshotImage: "/placeholder.svg?height=400&width=800&text=Amazon+Prime+Military",
    eligibility: [
      "Active duty military members",
      "Veterans with valid military ID",
      "Military spouses with dependent ID",
      "National Guard and Reserve personnel",
      "Military retirees",
    ],
    howToRedeem: [
      "Visit Amazon Prime military discount page",
      "Sign in to your Amazon account or create one",
      "Click 'Verify Military Status' button",
      "Complete verification through SheerID or ID.me",
      "Upload military documentation if required",
      "Apply discount and enjoy Prime benefits",
    ],
    offerDetails: {
      originalPrice: "$14.99/month",
      discountedPrice: "$6.99/month",
      savings: "$8.00/month ($96/year)",
      validUntil: "Ongoing offer",
      provider: "Amazon.com",
    },
  },
}

// Mock more deals data
const moreDeals = [
  {
    id: "2",
    title: "Microsoft Office 365 Military",
    description: "Free Microsoft Office 365 for active duty military and veterans with full premium features.",
    provider: "Microsoft",
    category: "Software",
    discountType: "Free",
    discountAmount: "FREE",
    url: "https://microsoft.com/military",
    dateAdded: "2024-01-10",
    isVerified: true,
    isPopular: true,
    screenshotImage: "/placeholder.svg?height=200&width=300&text=Microsoft+Office",
  },
  {
    id: "3",
    title: "Amazon Prime Military Discount",
    description: "Get Amazon Prime for $6.99/month instead of $14.99 with exclusive military pricing.",
    provider: "Amazon",
    category: "Subscriptions",
    discountType: "Fixed Amount",
    discountAmount: "$8 OFF/MONTH",
    url: "https://amazon.com/prime/military",
    dateAdded: "2024-01-08",
    isVerified: true,
    isPopular: false,
    screenshotImage: "/placeholder.svg?height=200&width=300&text=Amazon+Prime",
  },
  {
    id: "4",
    title: "Nike Military Discount",
    description: "Get 10% off Nike products with military verification through ID.me.",
    provider: "Nike",
    category: "Retail",
    discountType: "Percentage",
    discountAmount: "10% OFF",
    url: "https://nike.com/military",
    dateAdded: "2024-01-05",
    isVerified: true,
    isPopular: false,
    screenshotImage: "/placeholder.svg?height=200&width=300&text=Nike+Military",
  },
  {
    id: "5",
    title: "Spotify Premium Military",
    description: "Get Spotify Premium for military members and veterans at a discounted rate.",
    provider: "Spotify",
    category: "Entertainment",
    discountType: "Fixed Amount",
    discountAmount: "$5 OFF",
    url: "https://spotify.com/military",
    dateAdded: "2024-01-03",
    isVerified: true,
    isPopular: true,
    screenshotImage: "/placeholder.svg?height=200&width=300&text=Spotify+Premium",
  },
]

// Mock API function
const fetchDeal = async (id: string): Promise<Deal | null> => {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockDealsAPI[id] || null
}

// Mock comments data for the comments section
const mockComments = [
  {
    id: 1,
    author: "John Smith",
    content: "This Adobe discount saved me hundreds! Perfect for my photography side business.",
    timestamp: "2 hours ago",
    likes: 12,
    avatar: "/placeholder.svg?height=40&width=40&text=JS",
  },
  {
    id: 2,
    author: "Sarah Johnson",
    content: "Verification process was quick and easy. Highly recommend this deal to all military families.",
    timestamp: "5 hours ago",
    likes: 8,
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
  },
  {
    id: 3,
    author: "Mike Rodriguez",
    content:
      "Been using this for 6 months now. The creative tools are incredible and the military pricing makes it affordable.",
    timestamp: "1 day ago",
    likes: 15,
    avatar: "/placeholder.svg?height=40&width=40&text=MR",
  },
  {
    id: 4,
    author: "Lisa Chen",
    content: "Great deal! The verification through ID.me was straightforward and I was approved within 24 hours.",
    timestamp: "2 days ago",
    likes: 6,
    avatar: "/placeholder.svg?height=40&width=40&text=LC",
  },
  {
    id: 5,
    author: "David Wilson",
    content:
      "This discount is a game-changer for military creatives. All the professional tools you need at an unbeatable price.",
    timestamp: "3 days ago",
    likes: 9,
    avatar: "/placeholder.svg?height=40&width=40&text=DW",
  },
]

// Mock user profile data for the profile modal
const mockUserProfiles: Record<string, any> = {
  "John Smith": {
    name: "John Smith",
    initials: "JS",
    role: "Military Veteran",
    phone: "(555) 123-4567",
    email: "john.smith@email.com",
    companyName: "Smith Photography LLC",
    memberSince: "January 2022 (2 years, 8 months)",
    listings: { forSale: 0, forRent: 0 },
    professionalTitle: "Real Estate Agent",
  },
  "Sarah Johnson": {
    name: "Sarah Johnson",
    initials: "SJ",
    role: "Active Duty Military",
    phone: "(555) 987-6543",
    email: "sarah.johnson@mil.gov",
    companyName: "Johnson Consulting",
    memberSince: "March 2021 (3 years, 6 months)",
    listings: { forSale: 2, forRent: 1 },
    professionalTitle: "Real Estate Agent",
  },
  "Mike Rodriguez": {
    name: "Mike Rodriguez",
    initials: "MR",
    role: "Military Spouse",
    phone: "(555) 456-7890",
    email: "mike.rodriguez@email.com",
    companyName: "Rodriguez Creative Studio",
    memberSince: "June 2020 (4 years, 3 months)",
    listings: { forSale: 5, forRent: 3 },
    professionalTitle: "Real Estate Agent",
  },
  "Lisa Chen": {
    name: "Lisa Chen",
    initials: "LC",
    role: "Veteran",
    phone: "(555) 321-0987",
    email: "lisa.chen@email.com",
    companyName: "Chen Design Co.",
    memberSince: "September 2023 (1 year)",
    listings: { forSale: 1, forRent: 0 },
    professionalTitle: "Real Estate Agent",
  },
  "David Wilson": {
    name: "David Wilson",
    initials: "DW",
    role: "Military Retiree",
    phone: "(555) 654-3210",
    email: "david.wilson@email.com",
    companyName: "Wilson Media Group",
    memberSince: "December 2019 (4 years, 9 months)",
    listings: { forSale: 8, forRent: 4 },
    professionalTitle: "Real Estate Agent",
  },
}

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const [showAllComments, setShowAllComments] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set())
  const [dislikedComments, setDislikedComments] = useState<Set<number>>(new Set())
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [editingComment, setEditingComment] = useState<number | null>(null)
  const [editText, setEditText] = useState("")

  const [showUserProfile, setShowUserProfile] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [tocCollapsed, setTocCollapsed] = useState(true)

  const [copied, setCopied] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(42)
  const [hasVoted, setHasVoted] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)

  useEffect(() => {
    const loadDeal = async () => {
      setLoading(true)
      const dealId = params.id as string
      const dealData = await fetchDeal(dealId)
      setDeal(dealData)
      setLoading(false)
    }

    loadDeal()
  }, [params.id])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight

      if (docHeight <= 0) {
        setScrollProgress(0)
        return
      }

      const progress = Math.max(0, Math.min((scrollTop / docHeight) * 100, 100))
      setScrollProgress(progress)
    }

    const throttledHandleScroll = () => {
      requestAnimationFrame(handleScroll)
    }

    window.addEventListener("scroll", throttledHandleScroll, { passive: true })
    setTimeout(handleScroll, 100)

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll)
    }
  }, [])

  const handleImageError = () => {
    setImageError(true)
  }

  const getImageSrc = () => {
    if (imageError || !deal?.screenshotImage) {
      return "/placeholder.svg?height=400&width=800&text=Deal+Preview"
    }
    return deal.screenshotImage
  }

  const handleGoToDeal = () => {
    if (deal?.url) {
      window.open(deal.url, "_blank", "noopener,noreferrer")
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  const filteredMoreDeals = moreDeals.filter((moreDeal) => moreDeal.id !== params.id)

  const handleLike = (commentId: number) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
        setDislikedComments((prevDislikes) => {
          const newDislikes = new Set(prevDislikes)
          newDislikes.delete(commentId)
          return newDislikes
        })
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
        setLikedComments((prevLikes) => {
          const newLikes = new Set(prevLikes)
          newLikes.delete(commentId)
          return newLikes
        })
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
    setEditingComment(null)
    setEditText("")
  }

  const cancelEdit = () => {
    setEditingComment(null)
    setEditText("")
  }

  const visibleComments = showAllComments ? mockComments : mockComments.slice(0, 3)

  const handleUserProfileClick = (userName: string) => {
    const userProfile = mockUserProfiles[userName]
    if (userProfile) {
      setSelectedUser(userProfile)
      setShowUserProfile(true)
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-0">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading deal details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-background relative flex flex-col">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-4">Deal Not Found</h1>
            <p className="text-muted-foreground mb-6">The deal you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push("/deals")}
              className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Back to All Deals
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">

      <div className="fixed top-[56px] left-0 right-0 z-30">
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-0">
        <div className="flex gap-4 lg:gap-8 pb-12">
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-20">
              <div className="mb-4">
                <button
                  onClick={() => router.push("/deals")}
                  className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary/50 group flex items-center gap-2 py-2 px-3 rounded-lg transition-all duration-200 bg-white border border-border shadow-sm hover:shadow-md"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Deals
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-800 text-sm">Contents</h3>
                  <button
                    onClick={() => setTocCollapsed(!tocCollapsed)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <ChevronDown
                      className={`h-4 w-4 text-gray-600 transition-transform ${tocCollapsed ? "" : "rotate-180"}`}
                    />
                  </button>
                </div>
                {!tocCollapsed && (
                  <nav className="space-y-2">
                    <button
                      onClick={() => scrollToSection("about-deal")}
                      className="group flex items-start gap-2 w-full text-left py-2 px-2 rounded transition-all duration-200 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    >
                      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 transition-all duration-200 bg-gray-300 group-hover:bg-gray-400"></div>
                      <span className="leading-relaxed break-words">About This Deal</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("eligibility")}
                      className="group flex items-start gap-2 w-full text-left py-2 px-2 rounded transition-all duration-200 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    >
                      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 transition-all duration-200 bg-gray-300 group-hover:bg-gray-400"></div>
                      <span className="leading-relaxed break-words">Eligibility</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("how-to-redeem")}
                      className="group flex items-start gap-2 w-full text-left py-2 px-2 rounded transition-all duration-200 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    >
                      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 transition-all duration-200 bg-gray-300 group-hover:bg-gray-400"></div>
                      <span className="leading-relaxed break-words">How to Redeem</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("offer-details")}
                      className="group flex items-start gap-2 w-full text-left py-2 px-2 rounded transition-all duration-200 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    >
                      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 transition-all duration-200 bg-gray-300 group-hover:bg-gray-400"></div>
                      <span className="leading-relaxed break-words">Offer Details</span>
                    </button>
                  </nav>
                )}
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Featured Resource</h3>
                <div className="space-y-3">
                  <EnhancedResourceCard
                    resource={{
                      ...mockResources[1], // Military OneSource
                      id: Number.parseInt(mockResources[1].id),
                      category: "Support",
                      format: "Tool",
                      publishDate: "2024-01-15",
                      views: 1250,
                      isVerified: true,
                      isFeatured: true,
                      author: "Military OneSource Team",
                      readTime: "5 min",
                    }}
                  />
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 max-w-full lg:max-w-4xl min-w-0">
            <div className="space-y-8">
              <div className="relative bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                <img
                  src={getImageSrc() || "/placeholder.svg"}
                  alt={deal.title}
                  className="w-full h-64 md:h-80 lg:h-96 object-cover"
                  onError={handleImageError}
                />
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={handleGoToDeal}
                    className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 text-lg shadow-2xl backdrop-blur-sm border border-white/20"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Go to Deal
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-border p-8">
                <div className="relative mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">{deal.title}</h1>
                </div>

                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{deal.description}</p>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
                    {deal.category}
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
                    {deal.discountAmount}
                  </span>
                  {deal.isPopular && (
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
                      Popular
                    </span>
                  )}
                  {deal.isVerified && (
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-200 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <section id="about-deal" className="bg-white rounded-lg shadow-sm border border-border p-8 scroll-mt-24">
                <h2 className="text-2xl font-bold text-foreground mb-6 pb-3 border-b border-border flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  About This Deal
                </h2>
                <div className="text-muted-foreground leading-relaxed mb-6">{deal.longDescription}</div>

                <div className="mt-6 pt-6 border-t border-border">
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
              </section>

              <section id="eligibility" className="bg-white rounded-lg shadow-sm border border-border p-8 scroll-mt-24">
                <h2 className="text-2xl font-bold text-foreground mb-6 pb-3 border-b border-border flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Eligibility
                </h2>
                <ul className="space-y-3">
                  {deal.eligibility.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                id="how-to-redeem"
                className="bg-white rounded-lg shadow-sm border border-border p-8 scroll-mt-24"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6 pb-3 border-b border-border flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-primary" />
                  How to Redeem
                </h2>
                <ol className="space-y-4">
                  {deal.howToRedeem.map((step, index) => (
                    <li key={index} className="flex gap-4 text-muted-foreground">
                      <span className="bg-primary text-white font-bold rounded-full w-7 h-7 flex items-center justify-center text-sm flex-shrink-0 mt-0.5 shadow-sm">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section
                id="offer-details"
                className="bg-white rounded-lg shadow-sm border border-border p-8 scroll-mt-24"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6 pb-3 border-b border-border flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Offer Details
                </h2>
                <div className="space-y-4">
                  {deal.offerDetails.originalPrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Original Price:</span>
                      <span className="font-medium text-foreground line-through text-lg">
                        {deal.offerDetails.originalPrice}
                      </span>
                    </div>
                  )}

                  {deal.offerDetails.discountedPrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Your Price:</span>
                      <span className="font-bold text-green-600 text-xl">{deal.offerDetails.discountedPrice}</span>
                    </div>
                  )}

                  {deal.offerDetails.savings && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">You Save:</span>
                      <span className="font-bold text-primary bg-primary/20 px-3 py-1 rounded-lg">
                        {deal.offerDetails.savings}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Provider:</span>
                      <span className="font-medium text-foreground">{deal.offerDetails.provider}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valid Until:</span>
                      <span className="font-medium text-foreground">{deal.offerDetails.validUntil}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Action Bar - Horizontal Layout */}
              <div className="bg-white rounded-lg shadow-sm border border-border p-6 mb-6 lg:mb-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  {/* Go to Deal Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={handleGoToDeal}
                      className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 text-base shadow-md"
                    >
                      <ExternalLink className="h-5 w-5" />
                      Go to Deal
                    </button>
                  </div>

                  {/* Share Section */}

                  {/* Feedback Section */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Helpful?</span>
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
                              : "border-green-200 text-green-600 hover:border-green-400 hover:bg-green-50"
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
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{helpfulCount} people found this helpful</span>
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
                        placeholder="Share your thoughts about this deal..."
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
                        onClick={() => handleUserProfileClick(comment.author)}
                        className="flex-shrink-0 hover:opacity-80 transition-opacity"
                      >
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
                          {comment.author
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
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

              <div className="bg-white rounded-lg shadow-sm border border-border p-8 mb-8 py-3.5">
                <h3 className="font-bold text-foreground text-lg mb-6">Related Deals</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredMoreDeals.slice(0, 3).map((relatedDeal) => (
                    <DealCard
                      key={relatedDeal.id}
                      deal={relatedDeal}
                      onClick={() => router.push(`/deals/${relatedDeal.id}`)}
                    />
                  ))}
                </div>
                {filteredMoreDeals.length > 3 && <div className="text-center mt-6"></div>}
              </div>
            </div>
          </main>
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
                <p className="text-sm text-gray-600 mb-2">{selectedUser.professionalTitle}</p>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-semibold text-[#222222] mb-2 sm:mb-3 text-sm sm:text-base">Contact Information</h4>
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
                <h4 className="font-semibold text-[#222222] mb-2 text-sm sm:text-base">Company Name</h4>
                <p className="text-[#222222]/70 text-sm">{selectedUser.companyName}</p>
              </div>

              {/* LinkEnlist Experience */}
              <div>
                <h4 className="font-semibold text-[#222222] mb-2 text-sm sm:text-base">LinkEnlist Experience</h4>
                <p className="text-[#222222]/70 text-sm">Member since: {selectedUser.memberSince}</p>
              </div>

              {/* Property Listings */}
              <div>
                <h4 className="font-semibold text-[#222222] mb-2 sm:mb-3 text-sm sm:text-base">Property Listings</h4>
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

      <div>
        <ScrollButtons />
      </div>
    </div>
  )
}
