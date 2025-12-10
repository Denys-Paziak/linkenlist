import { DollarSign, Home, MapPin, Shield } from "lucide-react";

export function WhyLinkEnlist() {
  const benefits = [
    {
      icon: Home,
      title: "Homes near duty stations",
      description: "BAH filters, VA-ready options, verified details.",
    },
    {
      icon: DollarSign,
      title: "Military discounts and deals",
      description: "Curated savings on travel, retail, and services.",
    },
    {
      icon: Shield,
      title: "Official resources, fast",
      description: "Direct links to pay, health, training, and support.",
    },
    {
      icon: MapPin,
      title: "Your hub for military life",
      description:
        "Trusted sites for benefits, PCS checklists, and legal tools.",
    },
  ];

  return (
    <section className="bg-gray-50 py-6 md:py-11">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-6 md:mb-7">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-4 ">
            Why LinkEnlist?
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="w-10 h-10 md:w-20 md:h-20 bg-[#003366] rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-6 group-hover:bg-[#003366]/90 transition-colors duration-300">
                <benefit.icon className="w-5 h-5 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1 md:mb-4 line-clamp-2">
                {benefit.title}
              </h3>
              <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
