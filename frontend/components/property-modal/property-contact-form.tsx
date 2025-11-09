"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, CheckCircle, Loader2, Link } from "lucide-react"

interface PropertyContactFormProps {
  listing: any
  isOpen: boolean
  onClose: () => void
}

export function PropertyContactForm({ listing, isOpen, onClose }: PropertyContactFormProps) {
  const [emailForm, setEmailForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [showCopyTooltip, setShowCopyTooltip] = useState(false)

  // CAPTCHA states
  const [captchaQuestion, setCaptchaQuestion] = useState("")
  const [captchaAnswer, setCaptchaAnswer] = useState(0)
  const [userCaptchaInput, setUserCaptchaInput] = useState("")
  const [isCaptchaCorrect, setIsCaptchaCorrect] = useState(false)
  const [captchaAttempted, setCaptchaAttempted] = useState(false)

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    setCaptchaQuestion(`${num1} + ${num2} = ?`)
    setCaptchaAnswer(num1 + num2)
    setUserCaptchaInput("")
    setIsCaptchaCorrect(false)
    setCaptchaAttempted(false)
  }

  useEffect(() => {
    if (isOpen) {
      generateCaptcha()
    }
  }, [isOpen])

  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setUserCaptchaInput(input)
    setCaptchaAttempted(true)
    if (Number.parseInt(input, 10) === captchaAnswer) {
      setIsCaptchaCorrect(true)
    } else {
      setIsCaptchaCorrect(false)
    }
  }

  const handleEmailFormChange = (field: string, value: string) => {
    setEmailForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSendEmail = async () => {
    if (!isCaptchaCorrect) {
      setCaptchaAttempted(true)
      return
    }

    setIsEmailSending(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsEmailSending(false)
    setIsEmailSent(true)
    setTimeout(() => {
      setIsEmailSent(false)
      onClose()
      setEmailForm({ name: "", email: "", phone: "", message: "" })
      generateCaptcha()
    }, 3000)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShowCopyTooltip(true)
      setTimeout(() => setShowCopyTooltip(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[10004] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Property Owner</h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
              <input
                type="text"
                value={emailForm.name}
                onChange={(e) => handleEmailFormChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002244] focus:border-[#002244]"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
              <input
                type="email"
                value={emailForm.email}
                onChange={(e) => handleEmailFormChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002244] focus:border-[#002244]"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={emailForm.phone}
                onChange={(e) => handleEmailFormChange("phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002244] focus:border-[#002244]"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea
                value={emailForm.message}
                onChange={(e) => handleEmailFormChange("message", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002244] focus:border-[#002244] resize-none"
                placeholder="I'm interested in this property. Please contact me with more information."
              />
            </div>

            {/* CAPTCHA Section */}
            <div>
              <label htmlFor="captcha-input" className="block text-sm font-medium text-gray-700 mb-1">
                CAPTCHA: What is {captchaQuestion} *
              </label>
              <input
                id="captcha-input"
                type="text"
                value={userCaptchaInput}
                onChange={handleCaptchaChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  captchaAttempted && !isCaptchaCorrect
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#002244] focus:border-[#002244]"
                }`}
                placeholder="Enter your answer"
              />
              {captchaAttempted && !isCaptchaCorrect && (
                <p className="text-red-600 text-xs mt-1">Incorrect CAPTCHA. Please try again.</p>
              )}
              {captchaAttempted && isCaptchaCorrect && <p className="text-green-600 text-xs mt-1">CAPTCHA solved!</p>}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={
                isEmailSending ||
                !emailForm.name ||
                !emailForm.email ||
                !emailForm.message ||
                isEmailSent ||
                !isCaptchaCorrect
              }
              className={`flex-1 ${isEmailSent ? "bg-green-600 hover:bg-green-700" : "bg-[#002244] hover:bg-gray-800"} text-white transition-colors`}
            >
              {isEmailSent ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Message Sent!
                </>
              ) : isEmailSending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </div>
        </div>
      </div>
      <PropertySocialShare listing={listing} />
    </div>
  )
}

export function PropertySocialShare({ listing }: { listing: any }) {
  const [showCopyTooltip, setShowCopyTooltip] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShowCopyTooltip(true)
      setTimeout(() => setShowCopyTooltip(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <div className="relative">
          
          {showCopyTooltip && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Copied!
            </div>
          )}
        </div>
      </div>
    </>
  )
}
