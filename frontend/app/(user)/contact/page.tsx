"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general",
  });

  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isRecaptchaVerified) {
      alert("Please complete the reCAPTCHA verification.");
      return;
    }

    // Handle form submission here
    console.log("Contact form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      type: "general",
    });
    setIsRecaptchaVerified(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#222222] mb-4">Contact Us</h1>
          <p className="text-[#222222]/70 text-lg max-w-2xl mx-auto">
            Have a question, suggestion, or need help? We'd love to hear from
            you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#222222] mb-6">
                Get in Touch
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-[#222222] mb-2">
                    General Support
                  </h3>
                  <p className="text-[#222222]/70 text-sm">
                    For general questions about LinkEnlist, resource
                    submissions, or technical issues.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#222222] mb-2">
                    Resource Updates
                  </h3>
                  <p className="text-[#222222]/70 text-sm">
                    Report broken links, outdated information, or suggest new
                    resources to add.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#222222] mb-2">
                    Partnerships
                  </h3>
                  <p className="text-[#222222]/70 text-sm">
                    Interested in partnering with LinkEnlist or featuring your
                    military resource.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-[#222222]/70 text-sm">
                    Independently operated
                  </span>
                </div>
                <p className="text-xs text-[#222222]/60">
                  LinkEnlist is not affiliated with the Department of Defense
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#222222] mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#222222] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#222222] mb-2">
                    Message Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  >
                    <option value="general">General Question</option>
                    <option value="technical">Technical Issue</option>
                    <option value="resource">Resource Submission/Update</option>
                    <option value="deal">Deal Submission</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="feedback">Feedback/Suggestion</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#222222] mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Brief description of your message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#222222] mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-vertical"
                    placeholder="Please provide as much detail as possible..."
                  />
                  <div className="text-right text-xs text-[#222222]/60 mt-1">
                    {formData.message.length}/1000 characters
                  </div>
                </div>

                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="recaptcha"
                      checked={isRecaptchaVerified}
                      onChange={(e) => setIsRecaptchaVerified(e.target.checked)}
                      className="w-5 h-5 text-accent border-2 border-gray-300 rounded focus:ring-accent focus:ring-2"
                    />
                    <label
                      htmlFor="recaptcha"
                      className="text-sm text-[#222222] cursor-pointer"
                    >
                      I'm not a robot
                    </label>
                    <div className="ml-auto">
                      <div className="text-xs text-gray-500 text-right">
                        <div>reCAPTCHA</div>
                        <div className="flex gap-1 text-[10px]">
                          <span>Privacy</span>
                          <span>-</span>
                          <span>Terms</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    href="/"
                    className="px-6 py-3 border-2 border-[#222222] text-[#222222] rounded-lg hover:bg-[#222222] hover:text-white transition-colors text-center"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={!isRecaptchaVerified}
                    className={`flex-1 px-6 py-3 rounded-lg border-2 transition-colors font-medium ${
                      isRecaptchaVerified
                        ? "bg-accent text-white border-accent hover:bg-accent/90"
                        : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#222222] mb-6">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-[#222222] mb-2">
                How do I submit a new resource?
              </h3>
              <p className="text-[#222222]/70 text-sm">
                Use the "Add/Edit Link" button in the header to submit new
                military resources for review.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#222222] mb-2">
                Is LinkEnlist officially affiliated with the military?
              </h3>
              <p className="text-[#222222]/70 text-sm">
                No, LinkEnlist is independently operated and not affiliated with
                the Department of Defense.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#222222] mb-2">
                How often are resources updated?
              </h3>
              <p className="text-[#222222]/70 text-sm">
                We regularly review and update resources. Report any broken
                links or outdated information.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#222222] mb-2">
                Can I suggest new features?
              </h3>
              <p className="text-[#222222]/70 text-sm">
                We welcome feedback and suggestions to improve LinkEnlist for
                our users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
