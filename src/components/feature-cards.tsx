
import { useState } from "react";
import { Shield, Search, MessageCircle, Star, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Reviews",
    description: "All reviews are verified from real customers",
    details: "Our advanced verification system ensures every review comes from genuine customers who have actually used the service. We verify through purchase history, email confirmation, and behavioral analysis to maintain review authenticity."
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Find any brand instantly with our AI-powered search",
    details: "Our intelligent search algorithm understands context and provides instant suggestions as you type. Search by brand name, category, product, or even describe what you're looking for in natural language."
  },
  {
    icon: MessageCircle,
    title: "Direct Contact",
    description: "Get direct contact info for customer service",
    details: "Access verified contact information including phone numbers, email addresses, live chat links, and social media handles. We regularly update and verify all contact details to ensure they're current and functional."
  },
  {
    icon: Star,
    title: "Honest Ratings",
    description: "Transparent ratings based on real experiences",
    details: "Our rating system is based on multiple factors including customer satisfaction, response time, resolution quality, and overall experience. Ratings are continuously updated and cannot be manipulated by brands."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join millions of users sharing their experiences",
    details: "Be part of a growing community of consumers helping each other make informed decisions. Share your experiences, learn from others, and contribute to making customer service better for everyone."
  }
];

export function FeatureCards() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setFlippedCard(flippedCard === index ? null : index);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Why Choose Brandthropic?
          </h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            We're revolutionizing how you connect with brands and share your experiences
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group perspective-1000 cursor-pointer"
              onClick={() => handleCardClick(index)}
            >
              <div 
                className={`relative w-full h-48 transition-transform duration-700 transform-style-preserve-3d ${
                  flippedCard === index ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front of card */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col items-center justify-center border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 text-center mb-2 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-3 text-xs text-primary font-medium">
                    Click for details
                  </div>
                </div>
                
                {/* Back of card */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-primary rounded-xl shadow-sm p-4 flex items-center justify-center text-center">
                  <div>
                    <h3 className="text-white font-semibold mb-2 text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-white/90 text-xs leading-relaxed">
                      {feature.details}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
