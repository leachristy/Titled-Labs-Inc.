/**
 * ========================================
 * CONTACT PAGE
 * ========================================
 * 
 * Purpose:
 * Provides users with multiple ways to contact Tilted support team.
 * Displays contact information and a form for submitting inquiries.
 * 
 * Features:
 * - Contact form with fields for name, email, subject, and message
 * - Contact information display (phone, email, address, hours)
 * - Form validation and submission handling
 * - Success alert on form submission
 * - Two-column responsive layout
 * 
 * Components Used:
 * - NavBar: Navigation header
 * - ContactForm: Form component with validation
 * - ContactInfo: Displays contact details
 * 
 * Data Sources:
 * - contact.js: Contact information and form field definitions
 * 
 * Form Handling:
 * - handleFormSubmit: Logs form data and shows success alert
 * - Currently uses console.log (ready for backend integration)
 * 
 * Theme Support:
 * - Earthy: Cream background, brown/tan accents
 * - Cool: Pale lavender background, slate/charcoal accents
 */

import NavBar from "../components/navigation/NavBar";
import { useTheme } from "../contexts/ThemeContext";
import ContactForm from "../components/forms/ContactForm";
import ContactInfo from "../components/cards/ContactInfo";
import { contactInfo, contactFormFields } from "../data/contact";

export default function Contact() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const handleFormSubmit = (data) => {
    console.log("Form submitted:", data);
    alert("Thank you for your message! We will get back to you soon.");
  };

  return (
    <>
      <title>Contact - Tilted | Mental Wellness</title>
      <NavBar />
      <div
        className={`min-h-screen pt-24 px-4 ${
          isEarthy ? "bg-cream-100" : "bg-pale-lavender"
        }`}
        style={{
          backgroundColor: isEarthy ? undefined : "var(--pale-lavender)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1
            className={`text-heading text-center mb-8 ${
              isEarthy ? "text-brown-800" : "text-charcoal-grey"
            }`}
            style={{ color: isEarthy ? undefined : "var(--charcoal-grey)" }}
          >
            Contact Us
          </h1>

          <div className="grid gap-8 md:grid-cols-2">
            <ContactForm fields={contactFormFields} onSubmit={handleFormSubmit} />
            <ContactInfo info={contactInfo} />
          </div>
        </div>
      </div>
    </>
  );
}
