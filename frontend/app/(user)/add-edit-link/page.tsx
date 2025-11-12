"use client"

import type React from "react"

import { useState } from "react"
import { SubmitLinkModal } from "@/components/proposal-link-modal"
import { Button } from "@/components/ui/button"
import { CustomDropdown } from "@/components/custom-dropdown"

export default function AddEditLinkPage() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    action: "",
    name: "",
    url: "",
    category: "",
    description: "",
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Submitted:", formData)
    // Show success modal instead of alert
    setShowSuccessModal(true)
  }

  // Action options
  const actionOptions = ["add", "modify"]
  const actionLabels = {
    add: "Add New",
    modify: "Modify Existing",
  }

  // Branch options
  const branchOptions = ["Army", "Navy", "Air Force", "Marines", "Space Force", "Coast Guard", "VA", "Other"]

  return (
    <div className="min-h-screen flex flex-col bg-secondary">

      {/* Add/Edit Link Content */}
      <main className="flex-grow w-full px-6 py-4 pb-24">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-foreground mb-2">Add/Edit Link</h1>
            <p className="text-foreground/70">Submit a new resource or modify an existing one</p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-xl shadow-2xl p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Action *</label>
                <CustomDropdown
                  options={actionOptions}
                  value={formData.action}
                  onChange={(value) => setFormData({ ...formData, action: value })}
                  placeholder="Select an action"
                  displayLabels={actionLabels}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Resource Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="e.g., MyPay - Military Pay Portal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">URL *</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Branch</label>
                <CustomDropdown
                  options={branchOptions}
                  value={formData.category}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                  placeholder="Select a branch"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  maxLength={500}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="Brief description of the resource..."
                />
                <p className="text-xs text-foreground/60 mt-1">{formData.description.length}/500 characters</p>
              </div>

              {/* Cloudflare Verification */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Verification</label>
                <div className="bg-accent rounded-lg p-1">
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

              {/* Submit Button */}
              <div className="flex gap-4 pt-2">
                <Button type="button" variant="outline" onClick={() => (window.location.href = "/")} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold">
                  Submit Link
                </Button>
              </div>
            </form>
          </div>

          {/* Back to Home Link */}
          <div className="text-center mt-3">
            <a href="/" className="text-foreground/70 hover:text-primary text-sm font-medium transition-colors">
              ← Back to LinkEnlist Home
            </a>
          </div>
        </div>
      </main>

      <SubmitLinkModal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} />
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">
                Your link submission has been received successfully. We'll review it and add it to our directory soon.
              </p>
            </div>
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold"
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
