import NavBar from "../components/NavBar";
import { useTheme } from "../contexts/ThemeContext";
import ContactForm from "../components/ContactForm";
import ContactInfo from "../components/ContactInfo";
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
