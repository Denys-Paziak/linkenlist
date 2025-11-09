"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure site settings and preferences</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic site configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Site Name</label>
            <Input defaultValue="LinkEnlist" />
          </div>
          <div>
            <label className="text-sm font-medium">Site Description</label>
            <Input defaultValue="Military community platform" />
          </div>
        </CardContent>
      </Card>

      {/* Homepage Testimonials */}
      <Card>
        <CardHeader>
          <CardTitle>Homepage Testimonials</CardTitle>
          <CardDescription>Edit the 6 testimonial cards displayed on the main page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Testimonial 1 */}
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900">Testimonial 1</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <Input defaultValue="Sarah M." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <Input defaultValue="Aug 2025" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Input defaultValue="Quantico, VA" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Comment</label>
              <Textarea
                defaultValue="LinkEnlist helped me find the perfect home near Quantico. Amazing service!"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900">Testimonial 2</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <Input defaultValue="David C." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <Input defaultValue="Jun 2025" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Input defaultValue="Norfolk, VA" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Comment</label>
              <Textarea
                defaultValue="Great resources for military families. The BAH calculator is spot on."
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900">Testimonial 3</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <Input defaultValue="Mike R." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <Input defaultValue="Jul 2025" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Input defaultValue="Fort Bragg, NC" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Comment</label>
              <Textarea
                defaultValue="PCS move made easy thanks to this platform. Highly recommend!"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* Testimonial 4 */}
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900">Testimonial 4</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <Input defaultValue="Amanda F." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <Input defaultValue="Jun 2025" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Input defaultValue="Fayetteville, NC" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Comment</label>
              <Textarea
                defaultValue="Smooth home buying process near Fort Bragg. Excellent support team!"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* Testimonial 5 */}
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900">Testimonial 5</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <Input defaultValue="Jennifer K." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <Input defaultValue="Jul 2025" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Input defaultValue="San Diego, CA" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Comment</label>
              <Textarea
                defaultValue="Found our dream home with VA loan assistance. Thank you LinkEnlist!"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* Testimonial 6 */}
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900">Testimonial 6</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <Input defaultValue="Robert J." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <Input defaultValue="May 2025" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Input defaultValue="Colorado Springs, CO" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Comment</label>
              <Textarea
                defaultValue="LinkEnlist connected me with the right realtor. Couldn't be happier!"
                className="min-h-[80px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>Customize email templates sent to users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">New User Registration</label>
            <Textarea
              placeholder="Welcome to LinkEnlist! Thank you for joining our military community..."
              className="min-h-[100px]"
              defaultValue="Welcome to LinkEnlist! Thank you for joining our military community platform. Please verify your email address to get started."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Email Verification</label>
            <Textarea
              placeholder="Please verify your email address..."
              className="min-h-[100px]"
              defaultValue="Please click the link below to verify your email address and activate your LinkEnlist account."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Password Reset</label>
            <Textarea
              placeholder="You requested a password reset..."
              className="min-h-[100px]"
              defaultValue="You requested a password reset for your LinkEnlist account. Click the link below to create a new password."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Real Estate Listing Status Change</label>
            <Textarea
              placeholder="Your real estate listing status has been updated..."
              className="min-h-[100px]"
              defaultValue="Your real estate listing status has been updated. Please log in to your account to view the changes."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Listing Expiration Reminder (10 Days)</label>
            <Textarea
              placeholder="Your listing will expire in 10 days..."
              className="min-h-[100px]"
              defaultValue="Your real estate listing will expire in 10 days. Please renew your listing to keep it active on LinkEnlist."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Listing Expiration Reminder (3 Days)</label>
            <Textarea
              placeholder="Your listing will expire in 3 days..."
              className="min-h-[100px]"
              defaultValue="URGENT: Your real estate listing will expire in 3 days. Please renew immediately to avoid removal from LinkEnlist."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button>Save Changes</Button>
        <Button variant="outline">Reset to Defaults</Button>
      </div>
    </div>
  )
}
