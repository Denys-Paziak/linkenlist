"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ScrollButtons } from "@/components/scroll-buttons"

export default function PrivacyPolicy() {
  // Auto-scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <main className="flex-1">
        {/* Title Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#222222] mb-4">Privacy Policy</h1>
              <p className="text-lg text-gray-600">How we collect, use, and protect your information</p>
            </div>
          </div>
        </div>

        {/* Quick Links Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="w-full max-w-4xl mx-auto px-4 py-6">
            <h2 className="text-xl font-bold text-[#222222] mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <button
                onClick={() => scrollToSection("introduction")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">1. Introduction</span>
              </button>
              <button
                onClick={() => scrollToSection("information-we-collect")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">2. Information We Collect</span>
              </button>
              <button
                onClick={() => scrollToSection("how-we-collect")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">3. How We Collect Information</span>
              </button>
              <button
                onClick={() => scrollToSection("cookies-tracking")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">4. Cookies and Tracking</span>
              </button>
              <button
                onClick={() => scrollToSection("data-retention")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">5. Data Retention</span>
              </button>
              <button
                onClick={() => scrollToSection("data-security")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">6. Data Security</span>
              </button>
              <button
                onClick={() => scrollToSection("childrens-privacy")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">7. Children's Privacy</span>
              </button>
              <button
                onClick={() => scrollToSection("your-rights")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">8. Your Rights and Choices</span>
              </button>
              <button
                onClick={() => scrollToSection("do-not-track")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">9. Do Not Track</span>
              </button>
              <button
                onClick={() => scrollToSection("california-residents")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">10. California Residents</span>
              </button>
              <button
                onClick={() => scrollToSection("international-transfers")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">11. International Transfers</span>
              </button>
              <button
                onClick={() => scrollToSection("updates-contact")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">12. Updates & Contact</span>
              </button>
              <button
                onClick={() => scrollToSection("mobile-applications")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">13. Mobile Applications</span>
              </button>
              <button
                onClick={() => scrollToSection("third-party-services")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">14. Third-Party Services</span>
              </button>
              <button
                onClick={() => scrollToSection("legal-disclosures")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">15. Legal Disclosures</span>
              </button>
              <button
                onClick={() => scrollToSection("marketing-optout")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">16. Marketing & Opt-Out</span>
              </button>
              <button
                onClick={() => scrollToSection("state-specific-rights")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">17. State-Specific Rights</span>
              </button>
              <button
                onClick={() => scrollToSection("shine-the-light")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">18. Shine the Light</span>
              </button>
              <button
                onClick={() => scrollToSection("legal-disclaimer")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">19. Legal Disclaimer</span>
              </button>
              <button
                onClick={() => scrollToSection("security-antibot")}
                className="text-left p-3 bg-gray-50 hover:bg-primary/10 rounded-lg transition-colors border border-gray-200 hover:border-primary/30"
              >
                <span className="font-medium text-[#222222]">20. Security & Anti-Bot</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <div className="space-y-8">
              <section id="introduction">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  1. INTRODUCTION
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    NodEd LLC, doing business as LinkEnlist ("LinkEnlist," "Company," "we," or "us") values your privacy
                    and is committed to protecting your personal information. This Privacy Policy explains how we
                    collect, use, disclose, and safeguard your data when you interact with our website, mobile
                    applications, or any services provided by LinkEnlist (collectively referred to as the "Site" or
                    "Services").
                  </p>
                  <p>
                    This Policy applies to information collected through{" "}
                    <a href="https://www.linkenlist.com" className="text-primary hover:underline">
                      www.linkenlist.com
                    </a>
                    , our affiliated domains, and any future mobile or web applications. It also extends to
                    communications sent to us via email, contact forms, or social media, as well as information
                    collected through affiliate or partner programs featured on the platform. By accessing or using the
                    Site, you acknowledge that you have read and understood this Privacy Policy and agree to the data
                    practices described herein.
                  </p>
                  <p>
                    If you do not agree with this Policy, please discontinue use of the Site and Services. We may update
                    this Policy periodically to reflect changes in technology, applicable law, or business operations.
                    The date of the most recent update will appear at the end of this document. Continued use of the
                    Site following changes to this Policy constitutes acceptance of the revised terms.
                  </p>
                  <p>
                    This Privacy Policy applies to all users, regardless of geographic location, to the extent permitted
                    by applicable law. LinkEnlist's goal is to maintain transparent and responsible data practices that
                    respect the rights of every user.
                  </p>
                  <p>
                    LinkEnlist was created to serve the U.S. military and veteran community by providing verified
                    listings, resources, and deals related to real estate and relocation. Because of the nature of these
                    services, some information we collect is necessary to connect users with property listings, service
                    providers, and verified resources while maintaining safety and accountability. We only collect and
                    process the information needed to operate efficiently, comply with legal obligations, and enhance
                    user experience.
                  </p>
                </div>
              </section>

              <section id="information-we-collect">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  2. INFORMATION WE COLLECT
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    We collect both personal and non-personal information to provide and improve our Services. "Personal
                    information" refers to any information that identifies or can reasonably be linked to a specific
                    individual or household. We collect such information through direct input, automated technologies,
                    and trusted third-party integrations. Information that has been aggregated or de-identified so that
                    it cannot reasonably be associated with an individual is not considered personal information.
                  </p>

                  <p className="font-semibold text-lg text-[#222222]">Types of Information We Collect:</p>

                  <p>
                    <strong>Account Information:</strong> When you create an account, we collect your name, email
                    address, password, and verification details. This information enables us to authenticate your
                    identity, manage your profile, and facilitate communication between users.
                  </p>

                  <p>
                    <strong>Listing Information:</strong> If you post a real estate listing, we collect information
                    about the property, such as its address, price, description, photos, and related metadata. We may
                    also collect information about your professional affiliation if you are a real estate agent or
                    property manager.
                  </p>

                  <p>
                    <strong>Contact and Communication Data:</strong> When you contact a seller, submit a form, or email
                    us directly, we collect the content of your communication, your contact details, and any additional
                    data you choose to include.
                  </p>

                  <p>
                    <strong>Payment and Transactional Data:</strong> For paid listings or promotional upgrades, we
                    collect transaction-related information, including billing addresses and payment confirmations from
                    our secure third-party payment processors. We do not store full credit card or banking details.
                  </p>

                  <p>
                    <strong>Usage Data and Device Information:</strong> We collect details about how you interact with
                    our Site, such as pages visited, listings viewed, time spent on specific pages, and actions taken.
                    We may also gather device identifiers, IP addresses, browser types, operating systems, and referring
                    URLs to analyze user activity and improve Site performance.
                  </p>

                  <p>
                    <strong>Location Data:</strong> To display nearby listings and relevant resources, we may collect
                    approximate location data based on your IP address. We will only collect precise geolocation
                    information if you grant explicit permission through your device or browser settings.
                  </p>

                  <p>
                    <strong>Cookies and Tracking Data:</strong> We use cookies, web beacons, and analytics scripts to
                    personalize content, maintain sessions, and measure traffic. These technologies may record
                    preferences, login status, and interactions with our features. For more information, see the
                    "Cookies and Tracking Technologies" section below.
                  </p>

                  <p>
                    <strong>Affiliate and Partner Data:</strong> When you interact with affiliate offers or third-party
                    deals through our platform, we may receive basic referral data or performance metrics from those
                    partners. This helps us track engagement and maintain compliance with affiliate agreements.
                  </p>

                  <p>
                    <strong>Social Media Login Data:</strong> If you choose to sign in or register using a third-party
                    service such as Google, Apple, or another single sign-on provider, we may collect limited
                    authentication data such as your name, email address, and account ID in accordance with that
                    provider's privacy settings.
                  </p>

                  <p>
                    <strong>Non-Personal and Aggregated Data:</strong> We collect statistical data that does not
                    directly identify individuals. This includes overall user activity, page traffic, and search
                    patterns used to improve our content and site design.
                  </p>

                  <p>
                    We collect only what is necessary to fulfill our legitimate business interests, deliver our Services
                    effectively, and comply with legal obligations.
                  </p>
                </div>
              </section>

              <section id="how-we-collect" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  3. HOW WE COLLECT INFORMATION
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    We collect information about you through several methods, including direct submission, automated
                    tracking, and data provided by third-party services that help us operate efficiently.
                  </p>

                  <p className="font-semibold text-lg text-[#222222]">Information You Provide Directly:</p>
                  <p>
                    You may provide personal information when registering for an account, creating or editing listings,
                    contacting another user, or completing forms on the Site. This also includes information provided
                    when requesting support, subscribing to updates, or submitting feedback. Any data you voluntarily
                    submit through public-facing areas of the Site (such as property listings or comments) may be
                    visible to other users.
                  </p>

                  <p className="font-semibold text-lg text-[#222222]">Information Collected Automatically:</p>
                  <p>
                    As you use the Site, we automatically collect certain information through cookies, log files,
                    analytics tools, and similar technologies. This includes device data, IP address, browser version,
                    session duration, and referral sources. We may also log error reports, performance data, and
                    security events to maintain reliability. These technologies help us enhance navigation, detect
                    fraudulent activity, and analyze overall engagement.
                  </p>
                  <p>
                    We may use automated systems to detect and prevent fraudulent listings, spamming, or suspicious user
                    activity, as well as to enforce content moderation standards to maintain a safe and trustworthy
                    platform.
                  </p>

                  <p className="font-semibold text-lg text-[#222222]">Information from Third Parties:</p>
                  <p>
                    We may receive limited personal or transactional data from trusted third-party services. These may
                    include payment processors confirming completed transactions, analytics providers that help us
                    understand user trends, or affiliate partners that inform us of referrals. We also may receive lead
                    information when users interact with partner services integrated into the LinkEnlist platform.
                  </p>

                  <p className="font-semibold text-lg text-[#222222]">Communications and Interaction Data:</p>
                  <p>
                    When you send messages through the Site or our "Contact Seller" function, your name, email address,
                    and message are shared with the intended recipient. We also retain copies of these communications
                    where appropriate to prevent fraud and improve support. By using these features, you consent to this
                    exchange.
                  </p>

                  <p>
                    We always aim to collect information in a fair and transparent manner and to use it only for
                    purposes consistent with this Policy. Wherever required by law, we obtain your explicit consent
                    before collecting or processing personal data, particularly for location-based or marketing
                    activities.
                  </p>
                </div>
              </section>

              <section id="cookies-tracking" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  4. COOKIES AND TRACKING TECHNOLOGIES
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    LinkEnlist uses cookies and similar technologies to improve functionality, security, and user
                    experience. Cookies are small text files placed on your device that store data about your browsing
                    preferences and enable key features of our Site, such as login persistence, saved filters, and user
                    authentication. We also use cookies to collect statistical information that helps us measure
                    performance and analyze how visitors use the Site.
                  </p>

                  <p className="font-semibold text-lg text-[#222222]">Types of Cookies Used:</p>

                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Essential Cookies:</strong> Necessary for the operation of the Site, including login
                      sessions, security, and page navigation. The Site cannot function properly without these cookies.
                    </li>
                    <li>
                      <strong>Analytics Cookies:</strong> Used to gather aggregate information about traffic, navigation
                      patterns, and engagement to help us improve our content and design. For example, we may use Google
                      Analytics, which collects anonymized visitor data and reports usage trends without identifying
                      individual users.
                    </li>
                    <li>
                      <strong>Functional Cookies:</strong> Enable personalization features, such as saving preferences
                      or displaying listings based on prior interactions.
                    </li>
                    <li>
                      <strong>Affiliate or Referral Cookies:</strong> If you visit the Site through an affiliate link, a
                      tracking cookie may record limited referral data to attribute the source of traffic and measure
                      engagement.
                    </li>
                  </ul>

                  <p className="font-semibold text-lg text-[#222222]">Managing Your Cookie Preferences:</p>
                  <p>
                    You may configure your browser to refuse or delete cookies; however, doing so may limit certain
                    functions, such as remaining logged in or retaining saved searches. To learn more about managing
                    cookies, consult your browser's help documentation. Google Analytics users can also opt out of
                    tracking at{" "}
                    <a
                      href="https://tools.google.com/dlpage/gaoptout"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      https://tools.google.com/dlpage/gaoptout
                    </a>
                    .
                  </p>

                  <p>
                    We do not use invasive fingerprinting or third-party tracking scripts outside our analytics tools,
                    nor do we engage in cross-site behavioral advertising without your consent. Where required by law,
                    we display a cookie notice and request your permission before using non-essential cookies.
                  </p>
                </div>
              </section>

              <section id="data-retention" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  5. DATA RETENTION
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    LinkEnlist retains personal data only for as long as necessary to fulfill the purposes outlined in
                    this Policy or as required by applicable laws and regulations. Data retention periods vary based on
                    the nature of the information and the reasons for collection.
                  </p>

                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Account Data:</strong> Stored as long as your account remains active. If you delete your
                      account, we remove or anonymize personal data within a reasonable timeframe, except where
                      retention is legally required (for example, fraud prevention or dispute resolution).
                    </li>
                    <li>
                      <strong>Listing Information:</strong> Retained while the listing is active and for a limited
                      period thereafter for operational, auditing, or legal purposes.
                    </li>
                    <li>
                      <strong>Payment and Transaction Records:</strong> Kept in accordance with accounting, tax, and
                      compliance requirements.
                    </li>
                    <li>
                      <strong>Communications and Support Data:</strong> Stored as long as necessary to manage inquiries
                      and maintain service records.
                    </li>
                    <li>
                      <strong>Affiliate and Analytics Data:</strong> Retained for performance verification, trend
                      analysis, and service optimization.
                    </li>
                  </ul>

                  <p>
                    Backup systems may retain limited copies of deleted data for a short duration as part of standard
                    security and recovery protocols. When retention is no longer necessary, personal data is securely
                    deleted or de-identified to prevent reconstruction or misuse.
                  </p>

                  <p>
                    We apply consistent criteria for retention across all systems, balancing operational necessity with
                    privacy best practices. Our deletion processes use secure overwriting and anonymization methods that
                    comply with industry standards.
                  </p>
                </div>
              </section>

              <section id="data-security" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  6. DATA SECURITY
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    We implement administrative, technical, and physical safeguards designed to protect your information
                    from unauthorized access, alteration, disclosure, or destruction. These include SSL encryption for
                    data transmission, restricted access to personal information, firewall protection, and regular
                    security monitoring.
                  </p>
                  <p>
                    Only authorized personnel and vetted service providers have access to user data, and each is
                    required to maintain confidentiality. We evaluate our vendors' security practices and require that
                    they implement safeguards equivalent to our own. LinkEnlist also conducts periodic risk assessments
                    and maintains an incident response plan designed to contain and address potential breaches promptly.
                  </p>
                  <p>
                    Despite these efforts, no online system is entirely secure. Users share responsibility for
                    safeguarding their data, including maintaining strong passwords, logging out after using shared
                    devices, and exercising caution when sharing information publicly. If you believe your account has
                    been compromised or detect suspicious activity, contact support@linkenlist.com immediately.
                  </p>
                </div>
              </section>

              <section id="childrens-privacy" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  7. CHILDREN'S PRIVACY
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    LinkEnlist is intended for use by adults and families connected to the U.S. military community,
                    including service members, veterans, and their dependents. The platform is not directed to children
                    under the age of eighteen (18), and we do not knowingly collect personal information from minors.
                  </p>
                  <p>
                    If you are under the age of 18, please do not register for an account, submit a listing, or provide
                    any personal information on the Site. We strongly encourage parents and guardians to monitor their
                    children's online activity and to teach them about responsible internet use and privacy protection.
                  </p>
                  <p>
                    If LinkEnlist becomes aware that we have inadvertently collected personal information from a child
                    under the age of 18 without verified parental consent, we will take prompt steps to delete that
                    information from our records. Parents or guardians who believe their child has provided personal
                    data through the Site may contact us at support@linkenlist.com with a request for deletion.
                  </p>
                  <p>
                    Our policy is to comply fully with all applicable laws governing children's privacy, including the
                    Children's Online Privacy Protection Act (COPPA) in the United States. As LinkEnlist expands, we
                    will continue to update our procedures to meet evolving privacy standards designed to protect
                    minors.
                  </p>
                </div>
              </section>

              <section id="your-rights" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  8. YOUR RIGHTS AND CHOICES
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    LinkEnlist respects your right to access, manage, and control your personal data. Depending on your
                    location and applicable privacy laws, you may have certain rights regarding the information we
                    collect about you. These may include the right to:
                  </p>

                  <ol className="list-decimal pl-6 space-y-2">
                    <li>
                      <strong>Access and Portability:</strong> You may request a copy of the personal information we
                      hold about you and, where feasible, obtain it in a commonly used and machine-readable format.
                    </li>
                    <li>
                      <strong>Correction and Updates:</strong> You may review and correct inaccurate or incomplete
                      information in your account by logging in to your profile or contacting us directly.
                    </li>
                    <li>
                      <strong>Deletion:</strong> You may request deletion of your account and associated personal data
                      at any time. Upon verification, we will delete your data except where retention is required for
                      legal, accounting, or security reasons (e.g., dispute resolution or fraud prevention).
                    </li>
                    <li>
                      <strong>Consent Withdrawal:</strong> If we rely on your consent for data processing—such as for
                      marketing communications—you may withdraw that consent at any time by using the unsubscribe link
                      in our emails or contacting us at support@linkenlist.com.
                    </li>
                    <li>
                      <strong>Restriction and Objection:</strong> In certain jurisdictions, you may have the right to
                      restrict or object to our processing of your personal data, particularly when processing is based
                      on legitimate interests rather than contract or consent.
                    </li>
                    <li>
                      <strong>Marketing Preferences:</strong> You can manage your marketing communication preferences
                      within your profile settings or by contacting our support team. Even if you opt out of marketing
                      messages, we may still send you transactional or administrative communications, such as password
                      resets or security alerts, where applicable.
                    </li>
                    <li>
                      <strong>Non-Discrimination:</strong> LinkEnlist will not deny services, charge different rates, or
                      provide a different level of quality to users who choose to exercise their privacy rights.
                    </li>
                  </ol>

                  <p>
                    To exercise any of these rights, please contact us at support@linkenlist.com or through the Contact
                    Us form on our website. For security purposes, we may request additional information to verify your
                    identity before processing certain requests.
                  </p>

                  <p>
                    We will respond to all valid requests within the time frame required by applicable law. If
                    additional time is needed, we will notify you with an explanation.
                  </p>
                </div>
              </section>

              <section id="do-not-track" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  9. DO NOT TRACK
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Some web browsers and mobile devices include a "Do Not Track" (DNT) setting that sends a signal to
                    websites requesting that your browsing activity not be tracked across different sites or online
                    services. At this time, there is no consistent industry standard for recognizing or responding to
                    DNT signals, and LinkEnlist does not currently alter its data collection or usage practices in
                    response to these signals.
                  </p>
                  <p>
                    However, you can manage tracking technologies through your browser settings or by using third-party
                    tools to block cookies and trackers. Please note that certain essential functions of the Site—such
                    as authentication, saved searches, or property listing management—may not function properly if
                    cookies are disabled.
                  </p>
                  <p>
                    As privacy standards evolve, LinkEnlist will continue to evaluate and update its practices to
                    reflect new technologies and regulatory expectations concerning user tracking and behavioral data.
                  </p>
                </div>
              </section>

              <section id="california-residents" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  10. NOTICES FOR CALIFORNIA RESIDENTS (CCPA / CPRA)
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    This section applies to residents of California in accordance with the California Consumer Privacy
                    Act (CCPA) and the California Privacy Rights Act (CPRA). It supplements the information provided
                    elsewhere in this Privacy Policy.
                  </p>

                  <p className="font-semibold text-lg text-[#222222]">Your Privacy Rights under California Law:</p>
                  <p>If you are a California resident, you may have the right to:</p>

                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Request that we disclose what personal information we have collected, used, disclosed, or sold
                      about you over the past twelve (12) months.
                    </li>
                    <li>
                      Request deletion of your personal information, subject to certain exceptions (such as completing
                      transactions, detecting security incidents, or complying with legal obligations).
                    </li>
                    <li>Opt out of the sale or sharing of your personal information.</li>
                    <li>Correct inaccurate personal information.</li>
                    <li>Limit the use and disclosure of sensitive personal information.</li>
                    <li>Request a list of categories of third parties to whom we have disclosed your personal data.</li>
                  </ul>

                  <p>
                    To exercise these rights, contact us at support@linkenlist.com or use the Contact Us form on our
                    website. You may also designate an authorized agent to submit a request on your behalf. To verify
                    the request, we may require written authorization and proof of identity for both the requesting
                    party and the agent. We will respond to verified requests within the timeframe required by
                    California law.
                  </p>

                  <p className="font-semibold text-lg text-[#222222]">Collection and Use of Personal Information:</p>
                  <p>
                    In the past 12 months, LinkEnlist has collected the following categories of personal information:
                    identifiers (name, email, IP address), commercial information (listings and transactions), and
                    internet activity data (browsing behavior and interactions with our Site). We do not sell personal
                    information to third parties.
                  </p>

                  <p>
                    While LinkEnlist does not intentionally collect sensitive personal information such as precise
                    geolocation or government identification numbers, any data that may be considered sensitive under
                    California law is used only to facilitate requested services and is never sold or shared for
                    unrelated purposes.
                  </p>

                  <p>
                    We may disclose personal data to our affiliates, service providers, or trusted partners strictly for
                    operational purposes such as hosting, analytics, or payment processing. Each party is required to
                    maintain confidentiality and process information only for authorized purposes.
                  </p>

                  <p>
                    To comply with the CCPA/CPRA, LinkEnlist maintains records of consumer privacy requests and
                    responses for at least twenty-four (24) months. LinkEnlist does not engage in discriminatory
                    practices against California residents who exercise their privacy rights under applicable law.
                  </p>

                  <p className="font-semibold text-lg text-[#222222]">California "Shine the Light" Law:</p>
                  <p>
                    In accordance with California Civil Code Section 1798.83, also known as the "Shine the Light" law,
                    California residents may request information, once per year and free of charge, regarding categories
                    of personal data (if any) that LinkEnlist disclosed to third parties for direct marketing purposes,
                    as well as the names and addresses of such third parties. Requests can be submitted to
                    support@linkenlist.com or via the Contact Us form on our website.
                  </p>
                </div>
              </section>

              <section id="international-transfers" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  11. INTERNATIONAL DATA TRANSFERS
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Although LinkEnlist primarily serves users located in the United States, some of our service
                    providers, data storage systems, or affiliated partners may operate in other countries. As a result,
                    your information may be transferred to or processed in jurisdictions that may not provide the same
                    level of data protection as your home country.
                  </p>
                  <p>
                    By using our Site and Services, you consent to the transfer, processing, and storage of your data
                    outside your country of residence where permitted by law. Regardless of location, LinkEnlist ensures
                    that any transfer of personal data is protected by appropriate safeguards, such as contractual
                    clauses, encryption standards, and vendor data protection agreements that comply with applicable
                    privacy regulations.
                  </p>
                  <p>
                    Where applicable, data transfers outside your jurisdiction are protected under recognized safeguards
                    such as the European Commission's Standard Contractual Clauses (SCCs) or similar legally approved
                    mechanisms. Users may contact us at any time to request details about international data transfer
                    mechanisms or safeguards that apply to their personal information.
                  </p>
                  <p>
                    If you are located in a region with data protection laws that differ from those in the United
                    States, such as the European Union, we process personal information under legitimate interest or
                    consent-based principles and comply with all relevant cross-border data transfer requirements.
                  </p>
                </div>
              </section>

              <section id="updates-contact" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  12. UPDATES TO THIS POLICY AND CONTACT INFORMATION
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    LinkEnlist may update this Privacy Policy from time to time to reflect changes in our practices,
                    legal requirements, or technological advancements. Updates will be posted on this page with a
                    revised "Last Updated" date. Significant changes will be communicated to users by email or through
                    an in-site notice when appropriate.
                  </p>
                  <p>
                    We encourage users to review this Policy periodically to stay informed about how we protect their
                    personal information. Your continued use of our Site or Services after updates are published
                    constitutes your acceptance of the revised terms.
                  </p>
                  <p>
                    If you have any questions or concerns regarding this Privacy Policy, your data, or your rights,
                    please contact us:
                  </p>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                    <p className="mb-2">
                      <strong>Email:</strong> support@linkenlist.com
                    </p>
                    <p className="mb-2">
                      <strong>Contact Form:</strong> Available through the LinkEnlist website
                    </p>
                    <p className="mb-0">
                      <strong>Mailing Address:</strong>
                      <br />
                      NodEd LLC
                      <br />
                      30 N Gould St Ste N
                      <br />
                      Sheridan, WY 82801
                    </p>
                  </div>

                  <p>
                    We aim to respond to all privacy-related inquiries within thirty (30) days, or sooner if required by
                    law. If your inquiry involves complex data protection matters, it may be directed to our Data
                    Protection Officer or equivalent privacy contact for further review.
                  </p>
                </div>
              </section>

              <section id="mobile-applications" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  13. PRIVACY OF MOBILE APPLICATIONS
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    If LinkEnlist develops or provides a mobile application (the "App"), this section explains how we
                    collect, use, and manage information through that App. The App may automatically collect certain
                    data such as your device type, unique identifiers, IP address, operating system, and activity within
                    the App. This information helps us ensure compatibility, security, and performance.
                  </p>
                  <p>
                    The App may also request permission to access certain device features (e.g., location services or
                    camera) when needed for functionality, such as identifying properties near you or enabling photo
                    uploads for listings. These permissions are always optional and can be managed or revoked through
                    your device settings.
                  </p>
                  <p>
                    We may use mobile analytics software and crash-reporting tools (such as Firebase or Sentry) to
                    better understand user behavior, troubleshoot performance issues, and enhance the App's stability.
                    These tools may collect information about your device, usage frequency, operating system, and crash
                    diagnostics. All such data is anonymized and used exclusively for legitimate operational purposes.
                  </p>
                  <p>
                    If you enable push notifications, we may use device identifiers to send updates relevant to your
                    account or listings. You can disable notifications at any time in your device settings. We do not
                    use mobile data for targeted advertising or sell mobile user data.
                  </p>
                  <p>
                    Device identifiers and associated data may be retained for a reasonable period to comply with legal
                    or security requirements, even after the App is uninstalled. However, the App does not access or
                    collect any information from your device without consent or while inactive in the background.
                  </p>
                  <p>
                    Uninstalling the App will stop all information collection through it. Any account or listing data
                    tied to your LinkEnlist profile remains subject to this Privacy Policy until deleted in accordance
                    with Section 8 (Your Rights and Choices).
                  </p>
                </div>
              </section>

              <section id="third-party-services" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  14. THIRD-PARTY SERVICES AND INTEGRATIONS
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    LinkEnlist may include links, integrations, or embedded tools provided by third parties, such as
                    mortgage calculators, map embeds, or affiliate resources. When you access or interact with these
                    third-party services, your information may be collected directly by those providers under their own
                    privacy policies.
                  </p>
                  <p>
                    We do not control and are not responsible for the privacy practices, security standards, or content
                    of these third-party sites or applications. Users should review the privacy statements of any linked
                    or integrated services before providing personal information or engaging with them.
                  </p>
                  <p>
                    Some third-party links or partner offers on LinkEnlist may include affiliate tracking codes. When
                    you click on such links, LinkEnlist may receive a commission from your purchase or sign-up. This
                    does not affect your pricing or user experience. We may share limited, non-personal data—such as
                    click metrics or referral information—with partners to measure performance and detect misuse.
                  </p>
                  <p>
                    Embedded tools, calculators, or other integrations displayed on the Site may collect information
                    directly from you. Their privacy practices are governed by the respective provider's policies.
                    Examples include Google Maps (for geographic visualizations), AWS (for file storage), and payment
                    processors (for billing and transactions). Each third party operates independently, and your use of
                    those services is subject to their respective terms.
                  </p>
                </div>
              </section>

              <section id="legal-disclosures" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  15. LEGAL DISCLOSURES AND BUSINESS TRANSFERS
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    We may disclose your personal information if required to do so by law or in good-faith belief that
                    such action is necessary to:
                  </p>

                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Comply with applicable laws, regulations, subpoenas, legal processes, or government requests.
                    </li>
                    <li>Protect and defend the rights, property, or safety of LinkEnlist, our users, or the public.</li>
                    <li>Prevent, detect, or investigate fraud, unauthorized access, or other illegal activities.</li>
                  </ul>

                  <p>
                    Where legally permissible, we will make reasonable efforts to notify users of any law enforcement or
                    governmental request before disclosing personal data.
                  </p>

                  <p>
                    In the event of a merger, acquisition, restructuring, bankruptcy, or sale of all or part of our
                    business, user data may be transferred as part of that transaction. Any acquiring or successor
                    entity will be required to honor this Privacy Policy or provide equal or greater protection of
                    personal information. Users will be notified of any material change to data practices resulting from
                    such a transfer.
                  </p>

                  <p>
                    We may also disclose aggregated, de-identified, or statistical information that cannot reasonably be
                    used to identify individual users. Such data may be shared for analytics, business research, or
                    improvement of our Services.
                  </p>

                  <p>
                    All disclosures are handled in accordance with applicable data protection laws and internal
                    safeguards to ensure that your privacy is maintained.
                  </p>
                </div>
              </section>

              <section id="marketing-optout" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  16. MARKETING AND OPT-OUT RIGHTS
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    LinkEnlist may use your personal information to send communications about new listings, services, or
                    relevant offers. These messages are intended to improve your experience, notify you about
                    opportunities that match your preferences, and provide updates regarding your account or activity on
                    the platform.
                  </p>
                  <p>
                    We may tailor marketing communications based on your interactions with the Site, such as viewed
                    listings, preferred locations, or property types, to provide more relevant updates and offers.
                    Additionally, we may use trusted third-party platforms (such as Mailchimp or HubSpot) to manage and
                    distribute marketing emails, and these providers are bound by confidentiality and data protection
                    agreements.
                  </p>
                  <p>
                    You may opt out of receiving promotional communications at any time by clicking the "Unsubscribe"
                    link in our emails or by contacting us at support@linkenlist.com. Opting out of marketing messages
                    will not affect your ability to receive essential transactional or administrative communications,
                    such as account updates, password resets, or service notifications.
                  </p>
                  <p>
                    If you delete your account, we may retain limited contact information to ensure your prior opt-out
                    preferences remain honored. All marketing practices comply with applicable laws, including the
                    CAN-SPAM Act, the Telephone Consumer Protection Act (TCPA), and similar international standards.
                  </p>
                  <p>
                    For SMS or mobile notifications, users must opt in before receiving any messages. Message frequency
                    may vary, and standard carrier rates may apply. You may opt out at any time by following the
                    instructions provided in the message or within your LinkEnlist account settings.
                  </p>
                </div>
              </section>

              <section id="state-specific-rights" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  17. STATE-SPECIFIC RIGHTS BEYOND CALIFORNIA
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    In addition to California, several U.S. states—including Virginia, Colorado, Utah, Connecticut, and
                    Nevada—have enacted consumer data privacy laws that grant residents specific rights. If you reside
                    in one of these states, you may have the right to:
                  </p>

                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access the personal information we hold about you.</li>
                    <li>Correct inaccuracies in your personal data.</li>
                    <li>Request deletion of your personal information, subject to legal exceptions.</li>
                    <li>Obtain a copy of your data in a portable format.</li>
                    <li>Opt out of targeted advertising or the sale of personal information.</li>
                  </ul>

                  <p>
                    To exercise these rights, please contact us at support@linkenlist.com or through the Contact Us form
                    on our website. We will verify your identity and respond within the timeframe established by the
                    relevant state law, typically within forty-five (45) days.
                  </p>

                  <p>
                    LinkEnlist does not sell personal data or engage in profiling that produces legal or similarly
                    significant effects on users. We also do not knowingly share user data for targeted advertising
                    purposes.
                  </p>

                  <p>
                    Nevada residents may request that we do not sell certain personal information as defined under
                    Nevada law (NRS 603A) by contacting us at support@linkenlist.com.
                  </p>

                  <p>
                    As additional states enact consumer privacy laws, LinkEnlist will extend comparable rights and
                    processes to all U.S. users, regardless of residency.
                  </p>

                  <p>
                    If you are unsatisfied with our response to your data request, certain states—such as Virginia and
                    Colorado—permit you to appeal by emailing support@linkenlist.com with the subject line "Privacy
                    Appeal." We will review your appeal and provide a written response within sixty (60) days.
                  </p>

                  <p>
                    LinkEnlist does not engage in automated decision-making or profiling that significantly affects
                    users' legal rights or access to services.
                  </p>
                </div>
              </section>

              <section id="shine-the-light" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  18. "SHINE THE LIGHT" AND ADDITIONAL DISCLOSURES
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Under California Civil Code Section 1798.83, known as the "Shine the Light" law, California
                    residents have the right to request details regarding personal information shared with third parties
                    for direct marketing purposes. LinkEnlist does not currently share user information for such
                    purposes. However, if this practice changes, we will update this Policy accordingly and provide
                    users the ability to opt out.
                  </p>
                  <p>
                    LinkEnlist does not sell or share personal information for monetary or advertising purposes. All
                    information sharing is limited to operational necessity, such as maintaining service functionality
                    or analytics.
                  </p>
                  <p>
                    To make a "Shine the Light" request, send an email to support@linkenlist.com with the subject line
                    "California Privacy Request" or contact us via the website's Contact Us form. We will respond within
                    forty-five (45) days as required by law.
                  </p>
                  <p>
                    LinkEnlist complies with applicable federal privacy standards, including the Gramm-Leach-Bliley Act
                    (GLBA) for financial data, the Electronic Communications Privacy Act (ECPA) for communications, and
                    the Children's Online Privacy Protection Act (COPPA) for users under the age of 13. We are committed
                    to transparency and will update this section as new state or federal privacy laws take effect.
                  </p>
                </div>
              </section>

              <section id="legal-disclaimer" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  19. GENERAL LEGAL DISCLAIMER
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    This Privacy Policy is intended to provide transparency and explain our data practices but does not
                    create contractual or legal rights beyond those expressly stated in the LinkEnlist Terms of Service.
                    The interpretation and enforcement of this Policy are governed by the same laws and jurisdiction as
                    the Terms of Service.
                  </p>
                  <p>
                    This Privacy Policy is governed by the laws of the State of Wyoming, without regard to its conflict
                    of law provisions. Any disputes arising from this Policy or LinkEnlist's data practices shall be
                    resolved through arbitration or small claims court, as outlined in the Terms of Service.
                  </p>
                  <p>
                    If any provision of this Privacy Policy is found to be invalid, illegal, or unenforceable, the
                    remaining provisions will continue in full force and effect. Failure by LinkEnlist to enforce any
                    part of this Policy shall not be deemed a waiver of any rights or remedies.
                  </p>
                  <p>
                    This version of the Privacy Policy supersedes all prior versions and is effective as of the date
                    listed below. Users are encouraged to review this document regularly to stay informed of updates.
                  </p>
                </div>
              </section>

              <section id="security-antibot" className="mb-8">
                <h2 className="text-2xl font-bold text-[#222222] mb-4 border-b-2 border-primary pb-2">
                  20. SECURITY MEASURES AND ANTI-BOT PROTECTION
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    LinkEnlist takes the protection of user information and the stability of our platform seriously. We
                    use a combination of technical, administrative, and procedural safeguards designed to detect and
                    prevent unauthorized access, automated abuse, and other malicious activity.
                  </p>
                  <p>
                    Our systems may employ security tools that monitor network traffic, filter potentially harmful
                    requests, and help ensure that only legitimate users can access the Site. These measures may include
                    automated verification processes that analyze limited technical data, such as IP addresses or
                    browser characteristics, to distinguish normal usage from automated or suspicious activity.
                  </p>
                  <p>
                    Any data collected through these protective mechanisms is used strictly for maintaining system
                    security and performance. It is not shared, sold, or used for marketing, analytics, or user
                    profiling.
                  </p>
                  <p>
                    We regularly review and update our security infrastructure to stay aligned with evolving standards
                    and to address emerging threats. While no online system can guarantee absolute protection,
                    LinkEnlist is committed to maintaining a secure, trustworthy environment for all users.
                  </p>
                </div>
              </section>

              <div className="mt-12 pt-8 border-t-2 border-primary">
                <p className="text-sm text-gray-600 text-center">
                  <strong>Last Updated:</strong> October 11, 2025
                </p>
                <p className="text-sm text-gray-600 text-center mt-2">
                  For questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:support@linkenlist.com" className="text-primary hover:underline">
                    support@linkenlist.com
                  </a>{" "}
                  or use our{" "}
                  <Link href="/contact" className="text-primary hover:underline font-medium">
                    Contact Us
                  </Link>{" "}
                  form.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ScrollButtons />
    </div>
  )
}
