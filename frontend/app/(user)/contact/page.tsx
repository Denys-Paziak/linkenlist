import { ContactForm } from "./components/contact-form";

export default function ContactPage() {
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
          <ContactForm />
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#222222] mb-6">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
