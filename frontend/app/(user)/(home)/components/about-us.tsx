import Link from "next/link";

export function AboutUs() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-8 md:py-16">
      <div className="grid md:grid-cols-12 gap-6 md:gap-8">
        {/* Left Column - Content */}
        <div className="md:col-span-7">
          <div className="flex items-center justify-center md:justify-start mb-4 md:mb-6">
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-red-600 mr-2 md:mr-3"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
            </svg>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              About Us
            </h2>
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-red-600 ml-2 md:ml-3"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
            </svg>
          </div>
          <p
            className="text-base md:text-lg text-slate-600 leading-relaxed text-center md:text-left"
            style={{ maxWidth: "60ch" }}
          >
            LinkEnlist was started by a military family who has done the PCS
            shuffle, and built for other military families who do the same. We
            know the scramble of PCS season, finding a home near a new base, and
            tracking down the right resources. Our goal is simple: put trusted
            listings, official links, and helpful deals in one place so you
            spend less time hunting and more time settling in.
          </p>
        </div>

        {/* Right Column - Stats and CTA */}
        <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
          {/* Inspirational Quote */}
          <div className="mb-4 md:mb-6">
            <p className="text-lg md:text-xl font-semibold text-slate-800 leading-relaxed">
              "If it links you to what you need, when you need it, we're doing
              it right."
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Link
              href="/auth/signin?tab=register"
              className="bg-[#003366] hover:bg-[#003366]/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Sign Up
            </Link>
            <Link
              href="/about"
              className="text-[#003366] hover:text-[#003366]/80 underline underline-offset-4 transition-colors duration-200 font-normal text-sm"
            >
              Learn more about our mission
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
