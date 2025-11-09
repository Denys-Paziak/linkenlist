"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollButtons } from "@/components/scroll-buttons"

export default function TermsOfService() {
  // Auto-scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">
        {/* Title Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#222222] mb-4">Terms of Service</h1>
              <p className="text-lg text-gray-600">Legal terms and conditions for using LinkEnlist.com</p>
              <p className="text-sm text-gray-500 mt-2">Last updated: October 11, 2025</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border-2 border-primary p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">📋 Terms Summary</h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg font-medium text-[#222222]">
                By using LinkEnlist.com, you agree to these key terms:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Eligibility:</strong> You must be at least 18 years old and legally able to enter into this
                    agreement
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Account Responsibility:</strong> You're responsible for keeping your account secure and
                    providing accurate information
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Property Listings:</strong> Provide accurate information and comply with fair housing laws
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Payment Terms:</strong> Listing fees are non-refundable once published; subscriptions renew
                    automatically
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>User Content:</strong> You grant us license to use content you submit; we may remove content
                    at any time
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Disclaimers:</strong> Service provided "as-is" with no warranties; we're not liable for
                    third-party content
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Privacy:</strong> Your data is protected according to our Privacy Policy; we don't sell
                    personal information
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong>Not Affiliated:</strong> LinkEnlist is not affiliated with or endorsed by the Department of
                    Defense or any military branch
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-8 space-y-8">
            {/* Introduction */}
            <section>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="font-semibold text-lg text-[#222222]">TERMS OF SERVICE</p>
                <p>
                  These Terms of Service (the "Terms") apply to the LinkEnlist website and platform (the "Site"),
                  operated by NodEd LLC, a Wyoming limited liability company ("LinkEnlist," "Company," "we," or "us").
                  By accessing or using LinkEnlist.com or any of its services, including real estate listings, military
                  resources, deals, and associated tools (collectively, the "Services"), you agree to be bound by these
                  Terms. If you do not agree, you may not use the Site or Services.
                </p>
                <p>
                  For all support or legal inquiries, contact us at support@linkenlist.com or through the Contact Us
                  form available on the website.
                </p>
              </div>
            </section>

            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                1. ACCEPTANCE OF TERMS
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  By using the Site, you affirm that you are at least 18 years old and legally able to enter into this
                  agreement. If you are using the Site on behalf of an organization or entity, you represent that you
                  are authorized to bind that organization to these Terms.
                </p>
                <p>
                  We may update or revise these Terms from time to time. The latest version will always be posted on
                  this page, with the date of the most recent update listed at the bottom. Continued use of the Site
                  after changes means you accept those changes.
                </p>
                <p>
                  Certain Services may also be subject to additional terms, feature-specific rules, or policies
                  ("Additional Terms"). By using such Services, you agree to those Additional Terms, which become part
                  of these Terms by reference.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                2. ABOUT LINKENLIST
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  LinkEnlist is an independently operated website designed to connect military members, veterans, and
                  their families with verified resources, tools, and opportunities. Our platform provides:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Real Estate Listings:</strong> Homes for sale or rent near military bases, submitted by
                    property owners, agents, and verified users.
                  </li>
                  <li>
                    <strong>Deals and Discounts:</strong> Curated military and veteran deals from trusted sources.
                  </li>
                  <li>
                    <strong>Resources:</strong> Links to official DoD websites, benefits programs, and verified support
                    organizations.
                  </li>
                  <li>
                    <strong>Calculators and Tools:</strong> Financial and housing calculators including BAH and PCS cost
                    estimators.
                  </li>
                </ul>
                <p>
                  While we strive to ensure accuracy, LinkEnlist does not guarantee the completeness or reliability of
                  external links, listings, or benefit data. Users should independently verify all information with the
                  relevant source or agency.
                </p>
                <p>
                  LinkEnlist is not affiliated with, endorsed by, or officially connected to the Department of Defense
                  (DoD), any military branch, or any government agency. Some materials on the Site may include content
                  from public-domain government sources, used in compliance with applicable attribution guidelines.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                3. ELIGIBILITY AND ACCOUNT CREATION
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  You may access parts of LinkEnlist without creating an account; however, certain features—such as
                  posting listings, saving favorites, or contacting property owners—require registration.
                </p>
                <p>When creating an account, you must:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information.</li>
                  <li>Maintain the confidentiality of your login credentials.</li>
                  <li>Be responsible for all activities that occur under your account.</li>
                </ul>
                <p>
                  We reserve the right to suspend or terminate your account if information is inaccurate, fraudulent, or
                  used for unauthorized purposes.
                </p>
                <p>
                  You agree not to create multiple accounts, impersonate another user, or misrepresent your identity or
                  affiliation with any organization.
                </p>
                <p>
                  You are solely responsible for ensuring that your use of LinkEnlist complies with all applicable
                  housing, advertising, and local business laws, including the Fair Housing Act and state real estate
                  regulations.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                4. LICENSE AND ACCESS
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  LinkEnlist grants you a limited, non-exclusive, non-transferable, and revocable license to access and
                  use the Site and Services for personal, non-commercial use in accordance with these Terms. You may
                  not:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Copy, modify, distribute, or display content from LinkEnlist without our written consent.</li>
                  <li>Use automated tools, scrapers, or crawlers to extract data.</li>
                  <li>Reproduce or exploit the Site for commercial gain.</li>
                  <li>Interfere with the security, functionality, or integrity of the platform.</li>
                </ul>
                <p>Any unauthorized use of the Site automatically terminates this license.</p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                5. INTELLECTUAL PROPERTY
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  All content on LinkEnlist—including text, design, graphics, code, logos, images, and interactive
                  elements—is owned by or licensed to NodEd LLC. The entire compilation of content is protected by U.S.
                  and international copyright laws.
                </p>
                <p>
                  You may not use, copy, reproduce, distribute, or display any trademarks, logos, or trade dress of
                  LinkEnlist without prior written consent. The look and feel of the Site, including its layout, color
                  scheme, and user interface, are also protected as proprietary trade dress.
                </p>
                <p>
                  Third-party trademarks appearing on the Site are the property of their respective owners and are used
                  for identification purposes only.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                6. USER-GENERATED CONTENT
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Users may post property listings, comments, reviews, or other materials ("User Content"). By
                  submitting User Content, you grant LinkEnlist a non-exclusive, worldwide, royalty-free, perpetual, and
                  transferable license to use, display, reproduce, modify, and distribute such content in connection
                  with the operation of the Site and its marketing.
                </p>
                <p>You represent and warrant that:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You own or have permission to post the User Content.</li>
                  <li>Your submission does not infringe on any third-party rights.</li>
                  <li>Your content complies with all laws and these Terms.</li>
                </ul>
                <p>
                  We reserve the right to remove or modify any User Content at any time, for any reason, including
                  technical, legal, or operational considerations. We may also remove or edit content that we believe
                  violates these Terms, without notice.
                </p>
                <p>
                  You acknowledge and agree that LinkEnlist is not responsible for verifying the accuracy or
                  completeness of any User Content, including property listings. Listings and details are provided by
                  users and should be independently verified by interested parties.
                </p>
              </div>
            </section>

            {/* Section 6A */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                6A. USER REVIEWS, COMMENTS, AND FEEDBACK
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Users may provide reviews, comments, feedback, or suggestions regarding listings or the Site. By
                  submitting such content, you grant LinkEnlist a perpetual, royalty-free, non-exclusive, and
                  transferable license to use, reproduce, or display this content for any purpose, including marketing,
                  analytics, or product improvement.
                </p>
                <p>
                  You agree not to post unlawful, defamatory, obscene, or infringing material. LinkEnlist reserves the
                  right to remove, edit, or moderate such content and may suspend or terminate accounts that repeatedly
                  violate this policy.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                7. UNACCEPTABLE USES
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>You agree not to use LinkEnlist to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Post or distribute misleading, false, or fraudulent information.</li>
                  <li>Engage in spam, phishing, or other deceptive activities.</li>
                  <li>Promote or facilitate discrimination, harassment, or illegal activity.</li>
                  <li>Attempt to hack, probe, or interfere with the Site's infrastructure.</li>
                  <li>
                    Use the platform to advertise non-real-estate-related products or services without authorization.
                  </li>
                </ul>
                <p>
                  We reserve the right to suspend or permanently remove users who engage in any of the above activities
                  or who otherwise disrupt the community experience.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                8. PROPERTY LISTINGS
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>When you create or manage a listing, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate property information (price, location, features, availability).</li>
                  <li>Update or remove listings that are sold, rented, or no longer available.</li>
                  <li>Comply with fair housing laws and all applicable regulations.</li>
                </ul>
                <p>
                  LinkEnlist does not own, manage, or verify any properties listed on the Site and is not a party to any
                  transactions between users. The Company does not guarantee visibility, performance, or leads for any
                  listing. Listing visibility may depend on package selection, keyword filters, or platform algorithms.
                  Paid listings or promotional placements may be labeled as such.
                </p>
                <p>
                  All images uploaded must be owned or properly licensed by the uploader. You may not use watermarked,
                  copyrighted, or stock images without permission.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                9. COMMUNICATION WITH SELLERS AND BUYERS
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  When a user contacts a property owner or agent through LinkEnlist, the platform may automatically
                  generate an email containing the user's message and contact information. By using this feature, you
                  consent to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Have your message and email address shared with the listing owner.</li>
                  <li>Receive follow-up messages from that owner or agent.</li>
                </ul>
                <p>
                  LinkEnlist is not responsible for any off-platform communication that occurs between users, nor does
                  it verify the legitimacy of inquiries or offers made outside the Site.
                </p>
                <p>
                  Users are encouraged to report suspicious or fraudulent listings using the on-site reporting tools.
                </p>
              </div>
            </section>

            {/* Section 9A */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                9A. COMMUNICATIONS AND NOTIFICATIONS
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  By creating an account or using LinkEnlist's contact features, you consent to receive transactional
                  emails and service-related messages. These may include updates about your listings, inquiries, or
                  policy changes. If mobile or browser notifications are introduced, you may opt out through your
                  account settings or device preferences at any time.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                10. PAYMENT TERMS
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="font-semibold">10.1 Listing Packages and Pricing</p>
                <p>
                  Certain Services on LinkEnlist, such as premium or featured listings, may require payment. Pricing,
                  listing durations, and package features are clearly displayed at checkout and are subject to change at
                  any time without notice. All prices are in U.S. dollars unless stated otherwise.
                </p>
                <p>
                  By purchasing a paid listing, you agree to pay all fees associated with that service. Payment must be
                  made through approved methods provided on the Site. We use secure third-party processors to handle
                  payment transactions. LinkEnlist does not store full credit card information.
                </p>

                <p className="font-semibold mt-4">10.2 Refund Policy</p>
                <p>
                  All listing payments, upgrades, or visibility add-ons are non-refundable once the listing has been
                  created and published. Refunds may be considered only in cases of duplicate transactions or verified
                  technical errors. To request a review, contact us at support@linkenlist.com within seven (7) days of
                  purchase.
                </p>
                <p>If a listing is removed due to a violation of these Terms, no refund will be issued.</p>

                <p className="font-semibold mt-4">10.3 Subscription Services (If Applicable)</p>
                <p>
                  If LinkEnlist introduces subscription-based plans, you authorize the Company to charge the
                  subscription fee on a recurring basis until you cancel. You may cancel anytime through your account
                  settings before the next billing cycle to avoid renewal charges. Cancellation requests made after a
                  renewal date are not eligible for refunds.
                </p>
                <p>
                  By subscribing, you authorize automatic billing for each renewal period until cancellation. You will
                  not receive advance notice of renewal charges unless required by law.
                </p>

                <p className="font-semibold mt-4">10.4 Taxes</p>
                <p>
                  You are responsible for any taxes, levies, or duties imposed by taxing authorities on any purchase,
                  excluding only taxes based on our net income. If we are required to collect taxes, they will be added
                  to your payment total.
                </p>

                <p className="font-semibold mt-4">10.5 Payment Processor Disclaimer</p>
                <p>
                  Payments are processed by trusted third-party providers such as Stripe or PayPal. LinkEnlist does not
                  store full payment card details and is not responsible for errors, delays, chargebacks, or
                  unauthorized transactions caused by third-party processors. If any billing issue arises, please
                  contact both the payment provider and LinkEnlist support for resolution.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                11. THIRD-PARTY LINKS AND SERVICES
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The Site may contain links to third-party websites, listings, or resources, including partner
                  organizations, affiliates, advertisers, or government agencies. These links are provided solely as a
                  convenience to you.
                </p>
                <p>
                  We do not control and are not responsible for the content, policies, or practices of any third-party
                  websites. Accessing third-party sites from LinkEnlist is at your own risk. You should review their
                  respective terms of service and privacy policies before engaging with them.
                </p>
                <p>
                  In some cases, LinkEnlist may include affiliate links to third-party products or services. When you
                  click an affiliate link, we may earn a commission. LinkEnlist may receive compensation when you click
                  on affiliate links or make purchases through partner offers. We only include affiliates relevant to
                  our audience, and compensation does not influence placement or endorsement.
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                12. DATA PRIVACY AND SECURITY
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="font-semibold">12.1 Privacy Policy</p>
                <p>
                  Your use of the Site is also governed by our Privacy Policy, which explains how we collect, use, and
                  protect your personal information. By using LinkEnlist, you consent to the collection and handling of
                  your data as described in our Privacy Policy.
                </p>
                <p>
                  We take reasonable administrative, physical, and technical measures to safeguard your data. We may
                  share limited information, such as inquiry details or listing data, with trusted third-party service
                  providers solely for the purpose of fulfilling your requests or improving the Site's functionality.
                  However, no online platform is completely secure. By using the Site, you acknowledge and accept that
                  the transmission of information over the Internet carries inherent risks.
                </p>

                <p className="font-semibold mt-4">12.2 Data Retention</p>
                <p>
                  We retain personal information as long as necessary to provide Services, comply with legal
                  obligations, and resolve disputes. When data is no longer needed, it will be securely deleted or
                  anonymized.
                </p>

                <p className="font-semibold mt-4">12.3 User Responsibilities</p>
                <p>
                  You are responsible for maintaining the confidentiality of your account and all information associated
                  with it. If you suspect unauthorized access or any security breach, notify us immediately at
                  support@linkenlist.com.
                </p>
                <p>
                  You agree not to upload, share, or store personal or confidential information of others without their
                  consent.
                </p>
                <p>
                  All data is processed and stored in the United States. By using the Site, you consent to the transfer
                  and processing of your information in the United States, regardless of your location.
                </p>
              </div>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                13. DISCLAIMERS OF WARRANTIES
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The Site and Services, including all content, listings, resources, calculators, and tools, are
                  provided on an "as-is" and "as-available" basis without warranties of any kind, either express or
                  implied. To the fullest extent permitted by law, LinkEnlist disclaims all warranties, including but
                  not limited to implied warranties of merchantability, fitness for a particular purpose, title, and
                  non-infringement.
                </p>
                <p>LinkEnlist does not warrant that:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The Site will operate uninterrupted, secure, or error-free.</li>
                  <li>
                    The information provided through listings, links, or third-party resources is accurate or up to
                    date.
                  </li>
                  <li>
                    Any calculations or estimates (such as BAH, PCS, or affordability calculators) are guaranteed to be
                    correct or applicable to every user's situation.
                  </li>
                </ul>
                <p>
                  We do not control or guarantee the accuracy, completeness, or reliability of any content posted by
                  users or linked third parties. You use the Site and its contents at your own discretion and risk.
                </p>
                <p>
                  LinkEnlist makes no representation that the Site will be available in all locations or that the
                  Services or content are appropriate for use outside the United States.
                </p>
              </div>
            </section>

            {/* Section 13A */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                13A. MODIFICATION AND TERMINATION OF SERVICES
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We reserve the right to modify, suspend, or discontinue any part of the Site or Services at any time,
                  with or without notice. LinkEnlist may terminate or restrict your access if we believe you have
                  violated these Terms, engaged in fraudulent behavior, or misused the Services. Upon termination, your
                  right to use the Site will immediately cease. Any provisions that by nature should survive termination
                  (including indemnities, limitations of liability, and ownership clauses) shall continue in effect.
                </p>
              </div>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                14. DMCA NOTICE – NOTICE AND PROCEDURE FOR MAKING CLAIMS OF COPYRIGHT INFRINGEMENT
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  LinkEnlist respects the intellectual property rights of others and expects its users to do the same.
                  Our policy is to respond to notices of alleged infringement that comply with the Digital Millennium
                  Copyright Act ("DMCA"). Copyright-infringing materials found on the Site can be identified and removed
                  using the process outlined below, and you agree to comply with such process in the event you are
                  involved in any claim of copyright infringement.
                </p>
                <p>
                  If you believe in good faith that your work has been copied in a way that constitutes copyright
                  infringement, please provide the Company's copyright agent the written information specified below.
                  Please note that this procedure is exclusively for notifying LinkEnlist that your copyrighted material
                  has been infringed. We do not make legal determinations about the validity of any claim.
                </p>
                <p>
                  When a valid notice is received pursuant to the guidelines set forth below, LinkEnlist will respond by
                  taking down the allegedly infringing content or blocking access to it. We may contact the notice
                  provider to request additional information and will take reasonable steps to notify the user who
                  posted the allegedly infringing content ("Alleged Infringer"). The Alleged Infringer is allowed under
                  law to send us a counter-notification.
                </p>
                <p>
                  Anyone making a false or fraudulent notice or counter-notice may be liable for damages under the DMCA,
                  including costs and attorneys' fees. Any person unsure of whether material infringes a copyright
                  should consult an attorney.
                </p>
                <p>A DMCA notice must include the following:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Identification of the copyrighted work(s) believed to have been infringed.</li>
                  <li>
                    Identification of the material that is claimed to be infringing, with information reasonably
                    sufficient to locate it on the Site.
                  </li>
                  <li>Your name, address, telephone number, and email address.</li>
                  <li>
                    A statement: "I have a good faith belief that use of the material in the manner complained of is not
                    authorized by the copyright owner, its agent, or the law."
                  </li>
                  <li>
                    A statement: "I swear, under penalty of perjury, that the information in this notification is
                    accurate and that I am the copyright owner or am authorized to act on behalf of the owner of an
                    exclusive right that is allegedly infringed."
                  </li>
                  <li>Your electronic or physical signature.</li>
                </ol>
                <p>
                  Please send the DMCA notice to:
                  <br />
                  <strong>DMCA Agent</strong>
                  <br />
                  Email: support@linkenlist.com
                  <br />
                  Subject: "DMCA Takedown Request"
                </p>
                <p>
                  Upon receiving a valid notice, LinkEnlist will remove or disable access to the allegedly infringing
                  content and notify the content provider. A counter-notification may be submitted by the Alleged
                  Infringer if they believe the removed material was not infringing. Upon receipt of a valid
                  counter-notification, we may reinstate the removed content unless we receive notice that the original
                  complainant has filed a court action seeking to restrain the user from engaging in infringing
                  activity.
                </p>
              </div>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                15. LIMITATION OF LIABILITY
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  To the fullest extent permitted by law, LinkEnlist, NodEd LLC, and their respective officers,
                  employees, contractors, and agents shall not be liable for any direct, indirect, incidental,
                  consequential, punitive, or special damages arising out of or relating to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The use or inability to use the Site or Services.</li>
                  <li>Any errors, omissions, or inaccuracies in content.</li>
                  <li>Unauthorized access to or use of our systems or your information.</li>
                  <li>Any dealings, transactions, or communications between users.</li>
                </ul>
                <p>
                  This limitation applies regardless of whether the claim is based in contract, tort, negligence, strict
                  liability, or any other legal theory, even if we have been advised of the possibility of such damages.
                </p>
                <p>
                  If, notwithstanding the foregoing, LinkEnlist is found to be liable for any damages or losses arising
                  out of or related to your use of the Site, our total liability shall not exceed the amount you paid
                  (if any) for access to the Services during the twelve (12) months preceding the claim.
                </p>
                <p>
                  Certain jurisdictions do not allow the exclusion or limitation of incidental or consequential damages,
                  so some of these limitations may not apply to you.
                </p>
              </div>
            </section>

            {/* Section 16 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                16. INDEMNIFICATION
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  You agree to indemnify, defend, and hold harmless LinkEnlist, NodEd LLC, and their officers,
                  directors, employees, contractors, and affiliates from and against any and all claims, damages,
                  liabilities, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or
                  related to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your use of the Site or Services.</li>
                  <li>Any User Content you submit or make available.</li>
                  <li>Your violation of these Terms or any applicable law.</li>
                  <li>Your infringement or misappropriation of the rights of any third party.</li>
                </ul>
                <p>
                  We reserve the right to assume the exclusive defense and control of any matter subject to
                  indemnification, in which case you agree to cooperate with our defense.
                </p>
              </div>
            </section>

            {/* Section 16A */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">16A. RELEASE</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  You hereby release and forever discharge LinkEnlist, its officers, employees, agents, and affiliates
                  from any and all claims, demands, or damages arising out of disputes with other users or third parties
                  encountered through the Site. LinkEnlist does not mediate, guarantee, or assume responsibility for any
                  transaction, agreement, or interaction between users.
                </p>
              </div>
            </section>

            {/* Section 17 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                17. GOVERNING LAW AND DISPUTE RESOLUTION
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the State of Wyoming,
                  without regard to its conflict of law principles. Any legal action or proceeding arising under these
                  Terms shall be brought exclusively in the state or federal courts located in Wyoming, and you hereby
                  consent to the personal jurisdiction of such courts.
                </p>
                <p>
                  You agree that all claims must be brought in your individual capacity and not as a class action,
                  collective action, or representative proceeding. Any claim or dispute arising under these Terms must
                  be filed within one (1) year after the cause of action arises, or it will be permanently barred.
                </p>
                <p>
                  The Site is controlled and operated from the United States and is intended for users located within
                  the United States. We make no representations that the Services are appropriate or available for use
                  in other jurisdictions. Users accessing the Site from outside the U.S. do so at their own risk and are
                  responsible for compliance with local laws.
                </p>
              </div>
            </section>

            {/* Section 18 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                18. NOTICE FOR CALIFORNIA RESIDENTS
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Under California Civil Code Section 1789.3, California users are entitled to the following consumer
                  rights notice: If you have a complaint regarding the Services, contact us at support@linkenlist.com.
                  You may also reach the Complaint Assistance Unit of the Division of Consumer Services, Department of
                  Consumer Affairs, 1625 North Market Blvd., Sacramento, CA 95834, or (800) 952-5210.
                </p>
              </div>
            </section>

            {/* Section 19 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                19. NOT A GOVERNMENT WEBSITE
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  LinkEnlist is privately operated and is not an official government or Department of Defense (DoD)
                  website. While many resources link to official military or government sites, LinkEnlist is not
                  affiliated with or endorsed by the U.S. Government, DoD, or any military branch. Users should always
                  verify official information directly with the appropriate agency.
                </p>
              </div>
            </section>

            {/* Section 20 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                20. MISCELLANEOUS PROVISIONS
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="font-semibold">20.1 Entire Agreement</p>
                <p>
                  These Terms of Service, together with our Privacy Policy and any Additional Terms incorporated by
                  reference, constitute the entire agreement between you and LinkEnlist with respect to your use of the
                  Site and Services, superseding all prior or contemporaneous communications, agreements, or
                  understandings.
                </p>

                <p className="font-semibold mt-4">20.2 Severability</p>
                <p>
                  If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will
                  continue in full force and effect. The invalid or unenforceable provision shall be replaced by a valid
                  provision that most closely reflects the original intent of the parties.
                </p>

                <p className="font-semibold mt-4">20.3 No Waiver</p>
                <p>
                  No failure or delay by LinkEnlist in enforcing any right or provision of these Terms shall be deemed a
                  waiver of such right or provision.
                </p>

                <p className="font-semibold mt-4">20.4 Assignment</p>
                <p>
                  You may not assign or transfer any rights or obligations under these Terms without our prior written
                  consent. LinkEnlist may freely assign or transfer these Terms or any of its rights and obligations
                  without restriction.
                </p>

                <p className="font-semibold mt-4">20.5 Force Majeure</p>
                <p>
                  LinkEnlist shall not be liable or responsible for any delay or failure in performance due to causes
                  beyond its reasonable control, including natural disasters, government actions, labor disputes, acts
                  of war, Internet disruptions, or other force majeure events.
                </p>

                <p className="font-semibold mt-4">20.6 Headings</p>
                <p>
                  Section titles and headings are for convenience only and shall not affect the interpretation of these
                  Terms.
                </p>
              </div>
            </section>

            {/* Section 21 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                21. CONTACT INFORMATION
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  If you have questions, feedback, or concerns regarding these Terms or your use of LinkEnlist, please
                  contact us:
                </p>
                <p>
                  <strong>LinkEnlist Support Team</strong>
                  <br />
                  Email: support@linkenlist.com
                  <br />
                  Online: Contact Us form available at www.linkenlist.com
                </p>
              </div>
            </section>

            {/* Section 22 */}
            <section>
              <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                22. LAST UPDATED
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>These Terms of Service were last updated on October 11, 2025.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <ScrollButtons />
    </div>
  )
}
