import { GeneralSettings } from "./components/general-settings";
import { HomepageTestimonials } from "./components/homepage-testimonials";
import { EmailTemplates } from "./components/email-templates";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure site settings and preferences</p>
      </div>

      <GeneralSettings />

      <HomepageTestimonials />

      <EmailTemplates />
    </div>
  );
}
