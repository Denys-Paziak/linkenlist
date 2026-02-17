import Link from "next/link";

export default function SuccessPage() {
    return (
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
                <div
                    className="rounded-lg border bg-card text-card-foreground shadow-2xs max-w-2xl w-full"
                    data-v0-t="card"
                >
                    <div className="p-8 text-center">
                        <div className="mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-circle-check-big h-16 w-16 text-green-600 mx-auto mb-4"
                            >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <path d="m9 11 3 3L22 4"></path>
                            </svg>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Thanks for adding your property to LinkEnlist!
                            </h1>
                        </div>
                        <div className="text-gray-600 mb-8 space-y-4">
                            <p>
                                Our team will review your listing before it goes live. You can
                                track its status under Profile → My Real Estate.
                            </p>
                            <p>
                                <strong>Please note:</strong> Any changes to the listing will require review by a moderator. Seller information and Pricing can be edited without review by a moderator.
                            </p>
                        </div>
                        <Link href={'/profile/realestate'} className="w-fit ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-10 px-4 py-2 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 mx-auto">
                            Go to My Real Estate
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-arrow-right h-4 w-4"
                            >
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
