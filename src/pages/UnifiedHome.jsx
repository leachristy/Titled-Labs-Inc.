/**
 * ========================================
 * UNIFIED HOME PAGE
 * ========================================
 * 
 * Purpose:
 * Main landing page for Tilted mental wellness platform.
 * Showcases all features, services, testimonials, and resources in a
 * comprehensive single-page layout designed to convert visitors into users.
 * 
 * Features:
 * - Hero section with Spline 3D animation and animated particle background
 * - Platform statistics bar (users, sessions, satisfaction)
 * - Features grid highlighting key platform capabilities
 * - Detailed feature sections with mockups (AI chat, community, self-care)
 * - User testimonials and success stories
 * - "Who we serve" section with target audience cards
 * - Call-to-action section for signup conversion
 * - Resource cards for additional platform content
 * - Full theme support with smooth transitions
 * 
 * Sections:
 * 1. HeroSection: Main banner with CTA buttons and trust indicators
 * 2. StatsBar: Platform usage statistics
 * 3. FeaturesGrid: Grid of feature cards
 * 4. DetailedFeatures: In-depth feature descriptions with mockups
 * 5. Testimonial: User reviews and ratings
 * 6. WhoWeServe: Target audience cards
 * 7. CTASection: Final conversion section
 * 8. Resources: Additional platform resources
 * 
 * Components Used:
 * - NavBar: Navigation header
 * - HeroSection: Hero with animated background (Finisher Header)
 * - StatsBar: Statistics display
 * - FeaturesGrid: Feature cards grid
 * - DetailedFeature: Feature section with description
 * - DetailedFeatureMockup: Visual mockup for features
 * - Testimonial: User testimonial component
 * - ServiceCard: Who we serve cards
 * - ResourceCard: Resource link cards
 * - CTASection: Call to action section
 * 
 * Data Sources:
 * - home.js: detailedFeaturesData, whoWeServeData, resourcesData
 * 
 * Navigation:
 * - handleNavigation: Programmatic routing to various pages
 * - Passes navigation function to child components
 * 
 * Theme Support:
 * - Earthy: Cream/terracotta backgrounds, brown/rust text
 * - Cool: Charcoal/lavender backgrounds, slate/white text
 * - Animated background adapts to theme changes
 */

import { useNavigate } from "react-router";
import { useTheme } from "../contexts/ThemeContext";
import HeroSection from "../components/home/HeroSection";
import StatsBar from "../components/home/StatsBar";
import FeaturesGrid from "../components/home/FeaturesGrid";
import DetailedFeature from "../components/home/DetailedFeature";
import DetailedFeatureMockup from "../components/home/DetailedFeatureMockup";
import Testimonial from "../components/home/Testimonial";
import CTASection from "../components/home/CTASection";
import NavBar from "../components/navigation/NavBar";
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

      <div className={`py-20 ${isEarthy ? "bg-cream-100" : "bg-charcoal-grey"}`}>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className={`text-3xl sm:text-4xl font-semibold ${isEarthy ? "text-brown-800" : "text-white"} mb-4`}>
              Who we are for
            </h2>
            <p className={`text-base ${isEarthy ? "text-brown-700" : "text-gray-300"} max-w-2xl mx-auto`}>
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

      <div className={`py-20 ${isEarthy ? "bg-cream-100 border-t border-tan-200" : "bg-charcoal-grey border-t border-cool-grey"}`}>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className={`text-3xl font-semibold ${isEarthy ? "text-brown-800" : "text-white"} mb-4`}>
              More from Tilted
            </h2>
            <p className={`text-base ${isEarthy ? "text-brown-700" : "text-gray-300"}`}>
              Explore resources designed to support your mental wellness journey
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {resourcesData.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button className={`${isEarthy ? "text-rust-500 hover:text-rust-600" : "text-light-lavender hover:text-medium-lavender"} font-medium inline-flex items-center gap-2 group`}>
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
