"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SubmitLinkModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SubmitLinkModal({ isOpen, onClose }: SubmitLinkModalProps) {
  const [formData, setFormData] = useState({
    action: "",
    name: "",
    url: "",
    category: "",
    description: "",
  })

  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [captchaCode, setCaptchaCode] = useState("")
  const [userCaptchaInput, setUserCaptchaInput] = useState("")

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaCode(result)
    setCaptchaVerified(false)
    setUserCaptchaInput("")
  }

  useEffect(() => {
    if (isOpen) {
      generateCaptcha()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Handle form submission here
    console.log("Submitted:", formData)
    onClose()
    setFormData({ action: "", name: "", url: "", category: "", description: "" })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#222222]">Submit a Link</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#F4F4F4] rounded">
            <X className="h-5 w-5 text-[#222222]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#222222] mb-1">Action *</label>
            <select
              required
              value={formData.action || ""}
              onChange={(e) => setFormData({ ...formData, action: e.target.value })}
              className="w-full px-3 py-2 border border-[#F4F4F4] rounded-md focus:border-[#FFDD00] focus:outline-none"
            >
              <option value="">Select an action</option>
              <option value="add">Add New</option>
              <option value="modify">Modify Existing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#222222] mb-1">Resource Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-[#F4F4F4] rounded-md focus:border-[#FFDD00] focus:outline-none"
              placeholder="e.g., MyPay - Military Pay Portal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#222222] mb-1">URL *</label>
            <input
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 border border-[#F4F4F4] rounded-md focus:border-[#FFDD00] focus:outline-none"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#222222] mb-1">Branch</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-[#F4F4F4] rounded-md focus:border-[#FFDD00] focus:outline-none"
            >
              <option value="">Select a branch</option>
              <option value="Army">Army</option>
              <option value="Navy">Navy</option>
              <option value="Air Force">Air Force</option>
              <option value="Marines">Marines</option>
              <option value="Space Force">Space Force</option>
              <option value="Coast Guard">Coast Guard</option>
              <option value="VA">VA</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#222222] mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 border border-[#F4F4F4] rounded-md focus:border-[#FFDD00] focus:outline-none resize-none"
              placeholder="Brief description of the resource..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#222222] mb-1">Verification *</label>
            <div className="bg-[#FFDD00] rounded-lg p-1 mb-2">
              <div className="bg-[#2D2D2D] rounded-md p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Success!</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-sm tracking-wider">CLOUDFLARE</div>
                  <div className="text-gray-400 text-xs">
                    <a href="#privacy" className="hover:text-gray-300 transition-colors">
                      Privacy
                    </a>
                    <span className="mx-1">•</span>
                    <a href="#terms" className="hover:text-gray-300 transition-colors">
                      Terms
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-[#222222]">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
