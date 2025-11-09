"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/user-context";
import {
  User,
  ChevronDown,
  ChevronUp,
  Mail,
  Lock,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Camera,
  Building,
} from "lucide-react";

export default function SettingsPage() {
  const [isAccountActionsOpen, setIsAccountActionsOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [publicProfile, setPublicProfile] = useState({
    firstName: "Sarah",
    lastName: "Martinez",
    title: "Real Estate Agent",
    phone: "(555) 123-4567",
    email: "sarah.martinez@exprealty.com",
    avatar: "",
    companyName: "EXP Realty",
  });

  const { user, updateSettings, logout } = useUser();

  const handleToggleDisclaimer = () => {
    updateSettings({ showDisclaimer: !user.showDisclaimer });
  };

  const handlePasswordVerification = async (action: string) => {
    if (!currentPassword) {
      setMessage({ type: "error", text: "Please enter your current password" });
      return;
    }

    setIsLoading(true);

    // Simulate password verification
    setTimeout(() => {
      if (currentPassword === "password123") {
        // Demo password
        setMessage({
          type: "success",
          text: "A verification link has been sent to your email to complete this action.",
        });
        setActiveAction(null);
        setCurrentPassword("");
        setNewEmail("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({
          type: "error",
          text: "Incorrect password. Please try again.",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleDeleteAccount = () => {
    // In a real app, this would call an API
    alert(
      "Account deletion would be processed here. For demo purposes, logging out instead."
    );
    logout();
    window.location.href = "/";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const resetForm = () => {
    setActiveAction(null);
    setCurrentPassword("");
    setNewEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage(null);
  };

  const handlePublicProfileUpdate = (field: string, value: string) => {
    setPublicProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSavePublicProfile = () => {
    // In a real app, this would save to the backend
    setMessage({
      type: "success",
      text: "Public profile updated successfully!",
    });
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPublicProfile((prev) => ({
          ...prev,
          avatar: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setPublicProfile((prev) => ({
      ...prev,
      avatar: "",
    }));
  };

  return (
    <main className="flex-grow w-full px-6 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#222222] mb-2">Settings</h1>
          <p className="text-[#222222]/70">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account Info Section */}
          <div className="bg-white rounded-xl border border-primary/30 p-6">
            <h2 className="text-xl font-bold text-[#222222] mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Account Information
            </h2>
            <div className="space-y-4">
              {/* Username */}
              <div className="flex justify-between items-center py-2 border-b border-primary/20">
                <span className="text-[#222222]/70 font-medium">Username</span>
                <span className="text-[#222222] font-bold">
                  {user.username || "sarah_martinez"}
                </span>
              </div>

              {/* Email */}
              <div className="flex justify-between items-center py-2 border-b border-primary/20">
                <span className="text-[#222222]/70 font-medium">Email</span>
                <span className="text-[#222222] font-bold">{user.email}</span>
              </div>

              <div className="text-sm text-[#222222]/60 italic">
                This e-mail is private and not visible to other users.
              </div>
            </div>
          </div>

          {/* Public Profile Section */}
          <div className="bg-white rounded-xl border border-primary/30 p-6">
            <h2 className="text-xl font-bold text-[#222222] mb-4 flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Public Profile
            </h2>
            <div className="space-y-6">
              {/* Profile Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden">
                  {publicProfile.avatar ? (
                    <img
                      src={publicProfile.avatar || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    `${publicProfile.firstName[0]}${publicProfile.lastName[0]}`
                  )}
                  {publicProfile.avatar && (
                    <button
                      onClick={handleDeleteAvatar}
                      className="absolute -bottom-1 -left-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors shadow-md"
                      title="Delete avatar"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="photo-upload"
                  />
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Camera className="h-4 w-4" />
                    Change Photo
                  </Button>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={publicProfile.firstName}
                    onChange={(e) =>
                      handlePublicProfileUpdate("firstName", e.target.value)
                    }
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={publicProfile.lastName}
                    onChange={(e) =>
                      handlePublicProfileUpdate("lastName", e.target.value)
                    }
                    placeholder="Enter your last name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    value={publicProfile.title}
                    onChange={(e) =>
                      handlePublicProfileUpdate("title", e.target.value)
                    }
                    placeholder="e.g., Real Estate Agent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={publicProfile.companyName}
                    onChange={(e) =>
                      handlePublicProfileUpdate("companyName", e.target.value)
                    }
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={publicProfile.phone}
                    onChange={(e) =>
                      handlePublicProfileUpdate("phone", e.target.value)
                    }
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publicEmail">Public Email</Label>
                  <Input
                    id="publicEmail"
                    value={publicProfile.email}
                    onChange={(e) =>
                      handlePublicProfileUpdate("email", e.target.value)
                    }
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-primary/20">
                <div className="text-left">
                  <span className="text-sm text-[#222222]/70 font-medium">
                    Member since:{" "}
                  </span>
                  <span className="text-sm text-[#222222] font-bold">
                    {formatDate(user.registrationDate)}
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSavePublicProfile}
                  className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold"
                >
                  Save Public Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Display Preferences */}
          <div className="bg-white rounded-xl border border-primary/30 p-6">
            <h2 className="text-xl font-bold text-[#222222] mb-4">
              Display Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                <div className="flex-1">
                  <label className="text-[#222222] font-medium block">
                    Show footer disclaimer
                  </label>
                  <p className="text-sm text-[#222222]/70 mt-1">
                    Display disclaimer about government affiliation in footer
                  </p>
                </div>
                <div className="flex items-center justify-start sm:justify-end">
                  <button
                    onClick={handleToggleDisclaimer}
                    className={`relative inline-flex h-7 w-12 sm:h-6 sm:w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95 ${
                      user.showDisclaimer
                        ? "bg-primary shadow-md"
                        : "bg-gray-300"
                    }`}
                    aria-label={`${
                      user.showDisclaimer ? "Hide" : "Show"
                    } footer disclaimer`}
                  >
                    <span
                      className={`inline-block h-5 w-5 sm:h-4 sm:w-4 transform rounded-full bg-white transition-all duration-200 shadow-sm ${
                        user.showDisclaimer
                          ? "translate-x-6 sm:translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="ml-3 text-sm font-medium text-[#222222] sm:hidden">
                    {user.showDisclaimer ? "On" : "Off"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions - Collapsible Dropdown */}
          <div className="bg-white rounded-xl border border-primary/30 p-6">
            <button
              onClick={() => setIsAccountActionsOpen(!isAccountActionsOpen)}
              className="w-full flex items-center justify-between text-xl font-bold text-[#222222] mb-4 hover:text-primary transition-colors"
            >
              <span>Account Actions</span>
              {isAccountActionsOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            {isAccountActionsOpen && (
              <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                {/* Change Email */}
                <div className="border border-primary/30 rounded-lg p-4">
                  <button
                    onClick={() =>
                      setActiveAction(activeAction === "email" ? null : "email")
                    }
                    className="w-full flex items-center gap-3 text-left font-medium text-[#222222] hover:text-primary transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    Change Email
                  </button>

                  {activeAction === "email" && (
                    <div className="mt-4 space-y-3 border-t border-primary/20 pt-4">
                      <div>
                        <label className="block text-sm font-medium text-[#222222] mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#222222] mb-1">
                          New Email
                        </label>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Enter new email address"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handlePasswordVerification("email")}
                          disabled={isLoading || !currentPassword || !newEmail}
                          className="bg-accent hover:bg-accent/90 text-white font-bold"
                        >
                          {isLoading ? "Verifying..." : "Send Verification"}
                        </Button>
                        <Button
                          onClick={resetForm}
                          variant="outline"
                          className="border-primary text-[#222222] hover:bg-primary/10 bg-transparent"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Change Password */}
                <div className="border border-primary/30 rounded-lg p-4">
                  <button
                    onClick={() =>
                      setActiveAction(
                        activeAction === "password" ? null : "password"
                      )
                    }
                    className="w-full flex items-center gap-3 text-left font-medium text-[#222222] hover:text-primary transition-colors"
                  >
                    <Lock className="h-5 w-5" />
                    Change Password
                  </button>

                  {activeAction === "password" && (
                    <div className="mt-4 space-y-3 border-t border-primary/20 pt-4">
                      <div>
                        <label className="block text-sm font-medium text-[#222222] mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#222222] mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#222222] mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handlePasswordVerification("password")}
                          disabled={
                            isLoading ||
                            !currentPassword ||
                            !newPassword ||
                            newPassword !== confirmPassword
                          }
                          className="bg-accent hover:bg-accent/90 text-white font-bold"
                        >
                          {isLoading ? "Verifying..." : "Send Verification"}
                        </Button>
                        <Button
                          onClick={resetForm}
                          variant="outline"
                          className="border-primary text-[#222222] hover:bg-primary/10 bg-transparent"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4"></div>

                {/* Delete Account */}
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <button
                    onClick={() =>
                      setActiveAction(
                        activeAction === "delete" ? null : "delete"
                      )
                    }
                    className="w-full flex items-center gap-3 text-left font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                    Delete Account
                  </button>

                  {activeAction === "delete" && (
                    <div className="mt-4 space-y-3 border-t border-red-200 pt-4">
                      <p className="text-sm text-red-600">
                        This action cannot be undone. This will permanently
                        delete your account and remove all your data.
                      </p>
                      <div>
                        <label className="block text-sm font-medium text-red-600 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handlePasswordVerification("delete")}
                          disabled={isLoading || !currentPassword}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold"
                        >
                          {isLoading ? "Verifying..." : "Send Verification"}
                        </Button>
                        <Button
                          onClick={resetForm}
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-[#222222]/70 hover:text-primary text-sm font-medium transition-colors"
          >
            ← Back to LinkEnlist Home
          </a>
        </div>
      </div>
    </main>
  );
}
