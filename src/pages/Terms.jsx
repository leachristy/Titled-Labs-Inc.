import { useTheme } from "../contexts/ThemeContext";
import NavBar from "../components/navigation/NavBar";
import { useNavigate } from "react-router-dom";

export default function Terms() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const navigate = useNavigate();

  return (
    <>
      <title>Terms of Service - Tilted | Mental Wellness</title>
      <NavBar />
      <div
        className={`min-h-screen ${
          isEarthy ? "bg-cream-100" : "bg-pale-lavender"
        } py-12 px-4 sm:px-6 lg:px-8`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/signup")}
            className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isEarthy
                ? "text-rust-600 hover:bg-cream-200"
                : "text-light-lavender hover:bg-cool-grey"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Sign Up
          </button>

          <div className={`${isEarthy ? "card" : "card-new"} p-8`}>
            <h1
              className={`text-4xl font-bold mb-6 ${
                isEarthy ? "text-brown-800" : "text-charcoal-grey"
              }`}
            >
              Terms of Service
            </h1>
            
            <p
              className={`mb-4 ${
                isEarthy ? "text-brown-600" : "text-slate-blue"
              }`}
            >
              <strong>Last Updated:</strong> November 23, 2025
            </p>

            <div
              className={`space-y-6 ${
                isEarthy ? "text-brown-700" : "text-slate-blue"
              }`}
            >
              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing and using Tilted ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
                </p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  2. Description of Service
                </h2>
                <p>
                  Tilted provides mental wellness support, resources, and community features. The Service includes but is not limited to:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>AI-powered wellness guidance</li>
                  <li>Community forums and support groups</li>
                  <li>Self-care tools and tracking features</li>
                  <li>Educational resources</li>
                  <li>Crisis support information</li>
                </ul>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  3. Not a Substitute for Professional Care
                </h2>
                <p className="font-semibold">
                  IMPORTANT: Tilted is not a substitute for professional medical advice, diagnosis, or treatment.
                </p>
                <p className="mt-2">
                  The Service is designed to supplement, not replace, the relationship between you and your healthcare providers. Always seek the advice of qualified health providers with any questions you may have regarding a medical or mental health condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this Service.
                </p>
                <p className="mt-2">
                  If you are experiencing a mental health emergency, please call 911 or your local emergency number immediately, or contact the National Suicide Prevention Lifeline at 988.
                </p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  4. User Accounts
                </h2>
                <p>
                  To access certain features of the Service, you must create an account. You agree to:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information to keep it accurate</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept all risks of unauthorized access to your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  5. User Conduct
                </h2>
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Post content that is harmful, threatening, abusive, harassing, or otherwise objectionable</li>
                  <li>Impersonate any person or entity</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on the intellectual property rights of others</li>
                  <li>Transmit any viruses, malware, or harmful code</li>
                  <li>Attempt to gain unauthorized access to the Service or other users' accounts</li>
                </ul>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  6. Privacy and Data Protection
                </h2>
                <p>
                  Your privacy is important to us. Please review our Privacy Policy, which governs your use of the Service and explains how we collect, use, and protect your personal information.
                </p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  7. Intellectual Property
                </h2>
                <p>
                  All content on the Service, including text, graphics, logos, images, and software, is the property of Tilted or its content suppliers and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                </p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  8. Disclaimer of Warranties
                </h2>
                <p>
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                </p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  9. Limitation of Liability
                </h2>
                <p>
                  TO THE FULLEST EXTENT PERMITTED BY LAW, TILTED SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  10. Termination
                </h2>
                <p>
                  We reserve the right to suspend or terminate your account and access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
                </p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  11. Changes to Terms
                </h2>
                <p>
                  We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last Updated" date. Your continued use of the Service after such changes constitutes your acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  12. Contact Information
                </h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <p className="mt-2">
                  Email: legal@tilted.com<br />
                  Address: 123 Wellness Street, San Francisco, CA 94102
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
