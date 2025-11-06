import { useNavigate } from "react-router";
import { useTheme } from "../contexts/ThemeContext";
import HeroSection from "../components/home/HeroSection";
import StatsBar from "../components/home/StatsBar";
import FeaturesGrid from "../components/home/FeaturesGrid";
import DetailedFeature from "../components/home/DetailedFeature";
import DetailedFeatureMockup from "../components/home/DetailedFeatureMockup";
import Testimonial from "../components/home/Testimonial";
import CTASection from "../components/home/CTASection";
import NavBar from "../components/NavBar";
import ServiceCard from "../components/home/ServiceCard";
import ResourceCard from "../components/home/ResourceCard";
import {
  detailedFeaturesData,
  whoWeServeData,
  resourcesData,
} from "../data/home";

export default function UnifiedHome() {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isEarthy = currentTheme === "earthy";

  return (
    <>
      <title>Home - Tilted | Mental Wellness App</title>
      <NavBar />
      <HeroSection onNavigate={handleNavigation} />
      <StatsBar />
      <FeaturesGrid />

      <section className="py-20 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {detailedFeaturesData.map((feature) => (
            <DetailedFeature
              key={feature.id}
              badge={feature.badge}
              title={feature.title}
              description={feature.description}
              linkText={feature.linkText}
              onNavigate={() => handleNavigation(feature.link)}
              reverse={feature.reverse}
            >
              <DetailedFeatureMockup type={feature.mockupType} />
            </DetailedFeature>
          ))}
        </div>
      </section>

      <Testimonial />

      <div className={`py-20 ${isEarthy ? "bg-cream-100" : "bg-pale-lavender"}`}>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className={`text-3xl sm:text-4xl font-semibold ${isEarthy ? "text-brown-800" : "text-charcoal-grey"} mb-4`}>
              Who we are for
            </h2>
            <p className={`text-base ${isEarthy ? "text-brown-700" : "text-charcoal-grey"} max-w-2xl mx-auto`}>
              Tilted supports individuals at every stage of their mental wellness journey.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {whoWeServeData.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onNavigate={handleNavigation}
              />
            ))}
          </div>
        </div>
      </div>

      <CTASection onNavigate={handleNavigation} />

      <div className={`py-20 ${isEarthy ? "bg-cream-100 border-t border-tan-200" : "bg-pale-lavender border-t border-cool-grey"}`}>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className={`text-3xl font-semibold ${isEarthy ? "text-brown-800" : "text-charcoal-grey"} mb-4`}>
              More from Tilted
            </h2>
            <p className={`text-base ${isEarthy ? "text-brown-700" : "text-charcoal-grey"}`}>
              Explore resources designed to support your mental wellness journey
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {resourcesData.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button className={`${isEarthy ? "text-rust-500 hover:text-rust-600" : "text-[#c7b4e2] hover:text-[#b49fd3]"} font-medium inline-flex items-center gap-2 group`}>
              View all resources
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
