import { Form } from "./components/form";

export default function LoginPage() {
  return (
    <div className="h-screen bg-gray-50 flex items-center min-h-0">
      <main className="flex-grow w-fit max-w-md p-6 mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            LinkEnlist.com
          </h1>
          <p className="text-foreground/70">Admin login</p>
        </div>

        {/* Sign In Form Container */}
        <div className="bg-white rounded-xl shadow-2xl p-4">
          {/* Login Form */}
          <Form />
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-3">
          <a
            href="/"
            className="text-foreground/70 hover:text-accent text-sm font-medium transition-colors"
          >
            ← Back to LinkEnlist Home
          </a>
        </div>
      </main>
    </div>
  );
}
