"use client";

import { useEffect } from "react";

export default function FAQPage() {
  // Auto-scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqSections = [
    {
      title: "Getting started",
      questions: [
        {
          question: "Is LinkEnlist free to browse?",
          answer:
            "Yes. Search and save homes, resources, and deals for free. You only pay if you post a property.",
        },
        {
          question: "Who is LinkEnlist for?",
          answer:
            "Active duty, Guard/Reserve, veterans, DoD civilians, and military families looking for housing and on-base/off-base resources near installations. It is also for those who are searching for the direct links to the websites, military deals and resources.",
        },
        {
          question: "Do you cover on-base housing?",
          answer:
            "We don't list on-base units for rent, but in the future we plan to link the official housing offices and operators on each base page, so you can check availability there.",
        },
      ],
    },
    {
      title: "Search & map",
      questions: [
        {
          question: "How do I search?",
          answer:
            "Type a base, city, or ZIP. You can also tap a state on the map to jump to results for that state.",
        },
        {
          question: "Can I filter by what matters to military families?",
          answer:
            "Yes - filter by price, beds/baths, pets, lease length, furnished, commute time to base, and more. Saved searches notify you when new matches hit.",
        },
        {
          question: "How accurate are map pins?",
          answer:
            "Pins are as accurate as the address provided by the lister. If something looks off, report it and we'll verify.",
        },
        {
          question: "Do you support BAH-aware searches?",
          answer:
            "You can filter by price and save a search that matches your BAH. We're adding a BAH quick filter that auto-fills local rates as well as the BAH calculator in each description of the listing.",
        },
      ],
    },
    {
      title: "Listings & pricing",
      questions: [
        {
          question: "How do listings get on LinkEnlist?",
          answer:
            "Owners and agents create them directly. We review new posts for obvious issues before they go live.",
        },
        {
          question: "What are the listing packages?",
          answer:
            "• $40: 1 photo, runs up to 45 days, 200-word description.\n• $60: 5 photos, runs 90 days, 500-word description.\n• $80: 60 photos, 180 days, 750-word description, 1 virtual-tour link, and a red Visibility Tag on the card.",
        },
        {
          question: "Can I edit my listing after publishing?",
          answer:
            "Yes. You can update photos, price, and details anytime. Changes go live right after review.",
        },
        {
          question: "Can I upgrade or extend my listing?",
          answer:
            "You can upgrade to a higher tier or renew before it expires so you don't lose momentum.",
        },
        {
          question: "Do you offer refunds?",
          answer:
            "If you purchased by mistake or have a duplicate, contact us and we will make sure to issue you a full refund.",
        },
      ],
    },
    {
      title: "Messaging & leads",
      questions: [
        {
          question: "How do messages work?",
          answer:
            "Buyers/renters send an inquiry from the listing. Owners get an email and an in-app message thread to reply. Users can send messages about property and track the discussion in their accounts.",
        },
        {
          question: "Is my email shared?",
          answer:
            "We use a relay so you can reply without exposing your email address. Share contact info only if you choose. There is also an option to update your public profile which could list information such as your name, email, phone, title and the date when you registered on LinkEnlist.com.",
        },
      ],
    },
    {
      title: "Safety & quality",
      questions: [
        {
          question: "Do you verify listings?",
          answer:
            "We run automated checks, review reports, and remove suspicious posts. Always tour in person or use a trusted agent before sending money. Please share your feedback with us using Contact Us form.",
        },
        {
          question: "How do I report a scam or problem?",
          answer:
            "Use Report on the listing or message thread. Tell us what happened and we'll investigate.",
        },
        {
          question: "Are pets allowed?",
          answer:
            "Check the Pet policy on each listing. You can filter for pet-friendly homes and any breed/size notes.",
        },
      ],
    },
    {
      title: "Resources, links & deals",
      questions: [
        {
          question: 'What are the "Links" on your site?',
          answer:
            "A curated directory of official DoD portals and trusted resources (pay, medical, travel, education). You can favorite items for quick access.",
        },
        {
          question: "A link looks broken or outdated—what do I do?",
          answer:
            "Click Report link on the card. We audit links regularly and fix or replace them.",
        },
      ],
    },
    {
      title: "Accounts & notifications",
      questions: [
        {
          question: "Do I need an account?",
          answer:
            "You can browse without one. You'll need an account to save homes, message others, favorite links, or post a listing.",
        },
        {
          question: "How do saved searches work?",
          answer:
            "Set filters, save, and we'll email you when new listings match. You can pause or delete alerts anytime.",
        },
        {
          question: "Can I use LinkEnlist on my phone?",
          answer:
            "Yes. The site is mobile-friendly. You can add it to your home screen for quick access.",
        },
      ],
    },
    {
      title: "Landlords & agents",
      questions: [
        {
          question: "Who can post a listing?",
          answer:
            "Owners and licensed agents. Choose a package, add details, and publish. We recommend clear photos and a complete description.",
        },
        {
          question: "Do you support virtual tours?",
          answer:
            "Yes - our top package supports one tour link. Add it on the listing form.",
        },
        {
          question: "Can I see lead stats?",
          answer:
            "Your owner dashboard shows inquiries and basic activity so you can follow up quickly.",
        },
      ],
    },
    {
      title: "Policies & privacy",
      questions: [
        {
          question: "Do you sell user data?",
          answer:
            "No. We collect only what's needed to run the service and follow our posted privacy policy.",
        },
        {
          question: "Can I delete my data?",
          answer:
            "Yes. You can delete listings and request account deletion from settings.",
        },
      ],
    },
    {
      title: "Moving & life around base",
      questions: [
        {
          question: "Do you have info on schools, commute, and local rules?",
          answer:
            "Base pages include official links and local resources. We're expanding guides with commute tips, STR/HOA rules, and checklists that matter to military families.",
        },
      ],
    },
  ];

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#222222] mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Everything you need to know about LinkEnlist - from getting started to
          managing listings and finding the resources you need.
        </p>
      </div>

      <div className="space-y-8">
        {faqSections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Section Header */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#222222] capitalize">
                {section.title}
              </h2>
            </div>

            {/* Questions in Section */}
            <div className="divide-y divide-gray-200">
              {section.questions.map((faq, questionIndex) => (
                <details key={questionIndex} className="group">
                  <summary className="w-full px-6 py-5 cursor-pointer hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50 list-none">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#222222] pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0 w-6 h-6 text-gray-400 group-open:rotate-180 transition-transform duration-200">
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </summary>
                  <div className="px-6 pb-5">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Help Section */}
      <div className="mt-16 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-bold text-[#222222] mb-4">
          Still have questions?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          If you couldn't find the answer you were looking for, we're here to
          help. Feel free to reach out to us through our contact form or check
          our additional resources.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/contact"
            className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors shadow-sm"
          >
            Contact Us
          </a>
          <a
            href="/privacy"
            className="text-[#222222] px-8 py-3 rounded-lg border border-gray-300 hover:bg-white transition-colors shadow-sm"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-[#222222] px-8 py-3 rounded-lg border border-gray-300 hover:bg-white transition-colors shadow-sm"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </main>
  );
}
