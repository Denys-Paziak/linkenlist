"use client";

import { useState } from "react";
import { useUser } from "../contexts/user-context";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Eye, EyeOff } from "lucide-react";

export function LoginModal() {
  const { showLoginModal, setShowLoginModal } = useUser();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
      <DialogContent className="w-[95vw] max-w-sm sm:max-w-md bg-white rounded-xl border border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-[#222222] flex items-center justify-between">
            Sign in.
          </DialogTitle>
        </DialogHeader>

        {/* Sign In Form Container */}
        <div>
          {/* OAuth Buttons */}
          <div className="space-y-3 mb-4">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                G
              </div>
              <span className="text-foreground font-medium">
                Continue with Google
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-foreground/60 font-medium">
                OR
              </span>
            </div>
          </div>

          {/* Login/Registration Form */}
          <form className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-foreground/50" />
                  ) : (
                    <Eye className="h-5 w-5 text-foreground/50" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 transition-colors"
            >
              Sign In
            </Button>
          </form>

          {/* Additional Links */}
          <div className="mt-4 text-center space-y-3">
            <div className="flex justify-center gap-4 text-sm">
              <button className="text-foreground hover:text-accent font-medium transition-colors">
                Create Account
              </button>
              <span className="text-foreground/30">•</span>
              <button
                onClick={() => (window.location.href = "/reset-password")}
                className="text-foreground hover:text-accent text-sm font-medium transition-colors"
              >
                Reset Password
              </button>
            </div>

            {/* reCAPTCHA - Cloudflare Style */}
            <div className="bg-accent rounded-lg p-1">
              <div className="bg-[#2D2D2D] rounded-md p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Success!</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-sm tracking-wider">
                    CLOUDFLARE
                  </div>
                  <div className="text-gray-400 text-xs">
                    <a
                      href="#privacy"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Privacy
                    </a>
                    <span className="mx-1">•</span>
                    <a
                      href="#terms"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Terms
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Policy */}
            <p className="text-xs text-foreground/60">
              By signing in, you agree to our{" "}
              <a
                href="/privacy"
                className="text-foreground hover:text-accent underline"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="/terms"
                className="text-foreground hover:text-accent underline"
              >
                Terms of Service
              </a>
              .
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
