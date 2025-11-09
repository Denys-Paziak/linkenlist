"use client"

import { useEffect } from "react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      const authWindow = window.open(
        "",
        "LinkEnlistAuth",
        "width=600,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no",
      )

      if (authWindow) {
        authWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Sign In - LinkEnlist.com</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { margin: 0; padding: 20px; background: #F4F4F4; font-family: system-ui, -apple-system, sans-serif; }
            </style>
          </head>
          <body>
            <div class="max-w-md mx-auto bg-white rounded-xl p-8 shadow-2xl">
              <!-- Header -->
              <div class="text-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">LinkEnlist.com</h2>
                <p class="text-sm text-gray-600">Welcome back</p>
              </div>

              <!-- OAuth Buttons -->
              <div class="space-y-3 mb-6">
                <button onclick="handleOAuth('Google')" class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>
                  <span class="text-gray-800 font-medium">Continue with Google</span>
                </button>
                
                <button onclick="handleOAuth('Apple')" class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div class="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-xs">🍎</div>
                  <span class="text-gray-800 font-medium">Continue with Apple</span>
                </button>
                
                <button onclick="handleOAuth('Microsoft')" class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div class="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">M</div>
                  <span class="text-gray-800 font-medium">Continue with Microsoft</span>
                </button>
                
                <button onclick="handleOAuth('Reddit')" class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div class="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">R</div>
                  <span class="text-gray-800 font-medium">Continue with Reddit</span>
                </button>
              </div>

              <!-- Divider -->
              <div class="relative mb-6">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-4 bg-white text-gray-500 font-medium">OR</span>
                </div>
              </div>

              <!-- Login Form -->
              <form onsubmit="handleLogin(event)" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-800 mb-2">Email Address</label>
                  <input type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors" placeholder="Enter your email">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-800 mb-2">Password</label>
                  <div class="relative">
                    <input type="password" id="password" required class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors" placeholder="Enter your password">
                    <button type="button" onclick="togglePassword()" class="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <span id="eye-icon">👁️</span>
                    </button>
                  </div>
                </div>

                <div class="flex items-center">
                  <input type="checkbox" id="remember" class="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded">
                  <label for="remember" class="ml-2 text-sm text-gray-800">Remember me</label>
                </div>

                <button type="submit" class="w-full bg-gray-800 hover:bg-yellow-400 hover:text-gray-800 text-white font-bold py-3 rounded-lg transition-colors">
                  Log In
                </button>
              </form>

              <!-- Additional Links -->
              <div class="mt-6 text-center space-y-3">
                <div class="flex justify-center gap-4 text-sm">
                  <button onclick="handleRegister()" class="text-gray-800 hover:text-yellow-600 font-medium transition-colors">Create Account</button>
                  <span class="text-gray-300">•</span>
                  <button onclick="handleReset()" class="text-gray-800 hover:text-yellow-600 font-medium transition-colors">Reset Password</button>
                </div>

                <!-- reCAPTCHA Placeholder -->
                <div class="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
                  <div class="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <div class="w-4 h-4 border border-gray-400 rounded"></div>
                    <span>I'm not a robot</span>
                    <div class="text-xs">reCAPTCHA</div>
                  </div>
                </div>

                <p class="text-xs text-gray-600">
                  By signing in, you agree to our 
                  <a href="#privacy" class="text-gray-800 hover:text-yellow-600 underline">Privacy Policy</a>
                  and Terms of Service.
                </p>
              </div>
            </div>

            <script>
              function togglePassword() {
                const passwordInput = document.getElementById('password');
                const eyeIcon = document.getElementById('eye-icon');
                if (passwordInput.type === 'password') {
                  passwordInput.type = 'text';
                  eyeIcon.textContent = '🙈';
                } else {
                  passwordInput.type = 'password';
                  eyeIcon.textContent = '👁️';
                }
              }

              function handleLogin(event) {
                event.preventDefault();
                alert('Login functionality would be implemented here');
                window.close();
              }

              function handleOAuth(provider) {
                alert('OAuth login with ' + provider + ' would be implemented here');
                window.close();
              }

              function handleRegister() {
                alert('Registration functionality would be implemented here');
              }

              function handleReset() {
                alert('Password reset functionality would be implemented here');
              }

              // Close window when parent window closes
              window.addEventListener('beforeunload', function() {
                if (window.opener && !window.opener.closed) {
                  window.opener.focus();
                }
              });
            </script>
          </body>
          </html>
        `)
        authWindow.document.close()
      }

      // Close the modal state after opening the window
      onClose()
    }
  }, [isOpen, onClose])

  return null // Don't render anything in the main window
}
