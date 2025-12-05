import { useTheme } from "../contexts/ThemeContext";
import NavBar from "../components/navigation/NavBar";
import { useNavigate } from "react-router-dom";

export default function Privacy() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const navigate = useNavigate();

  return (
    <>
      <title>Privacy Policy - Tilted | Mental Wellness</title>
      <NavBar />
      <div
        className={`min-h-screen ${
          isEarthy ? "bg-cream-100" : "bg-pale-lavender"
        } pt-24 pb-12 px-4 sm:px-6 lg:px-8`}
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
              Privacy Policy
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
                  1. Introduction
                </h2>
                <p>
                  At Tilted, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mental wellness platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Service.
                </p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  2. Information We Collect
                </h2>
                
                <h3 className={`text-lg font-semibold mt-4 mb-2 ${isEarthy ? "text-brown-800" : "text-charcoal-grey"}`}>
                  2.1 Personal Information
                </h3>
                <p>We collect information that you provide directly to us, including:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Profile information (age, gender, location)</li>
                  <li>Payment information (processed securely by third-party providers)</li>
                </ul>

                <h3 className={`text-lg font-semibold mt-4 mb-2 ${isEarthy ? "text-brown-800" : "text-charcoal-grey"}`}>
                  2.2 Health and Wellness Information
                </h3>
                <p>You may choose to provide sensitive information, including:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Mental health assessments and self-reported data</li>
                  <li>Journal entries and mood tracking information</li>
                  <li>Goals and progress tracking</li>
                  <li>Community posts and comments</li>
                  <li>Communications with AI chat features</li>
                </ul>

                <h3 className={`text-lg font-semibold mt-4 mb-2 ${isEarthy ? "text-brown-800" : "text-charcoal-grey"}`}>
                  2.3 Automatically Collected Information
                </h3>
                <p>We automatically collect certain information when you use our Service:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, features used)</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Log files and analytics data</li>
                </ul>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  3. How We Use Your Information
                </h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Provide, maintain, and improve our Service</li>
                  <li>Personalize your experience and deliver tailored content</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you updates, newsletters, and promotional materials (with your consent)</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Monitor and analyze usage patterns and trends</li>
                  <li>Detect, prevent, and address technical issues and security threats</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  4. Information Sharing and Disclosure
                </h2>
                <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
                
                <h3 className={`text-lg font-semibold mt-4 mb-2 ${isEarthy ? "text-brown-800" : "text-charcoal-grey"}`}>
                  4.1 With Your Consent
                </h3>
                <p>We may share your information when you give us explicit consent to do so.</p>

                <h3 className={`text-lg font-semibold mt-4 mb-2 ${isEarthy ? "text-brown-800" : "text-charcoal-grey"}`}>
                  4.2 Service Providers
                </h3>
                <p>We may share your information with third-party vendors who provide services on our behalf, such as:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Cloud hosting providers (e.g., Firebase)</li>
                  <li>Analytics services</li>
                  <li>Payment processors</li>
                  <li>Email service providers</li>
                </ul>

                <h3 className={`text-lg font-semibold mt-4 mb-2 ${isEarthy ? "text-brown-800" : "text-charcoal-grey"}`}>
                  4.3 Legal Requirements
                </h3>
                <p>We may disclose your information if required by law or in response to valid legal requests.</p>

                <h3 className={`text-lg font-semibold mt-4 mb-2 ${isEarthy ? "text-brown-800" : "text-charcoal-grey"}`}>
                  4.4 Emergency Situations
                </h3>
                <p>We may share information if we believe it is necessary to protect the safety of you or others, including sharing information with emergency services or mental health professionals when there is an imminent risk of harm.</p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  5. Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information, including:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and audits</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Employee training on data protection</li>
                </ul>
                <p className="mt-2">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
                </p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  6. Your Rights and Choices
                </h2>
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Update or correct your personal information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Export:</strong> Request a portable copy of your data</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Cookie preferences:</strong> Manage your cookie settings through your browser</li>
                </ul>
                <p className="mt-2">
                  To exercise these rights, please contact us at privacy@tilted.com.
                </p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  7. Data Retention
                </h2>
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. When we no longer need your information, we will securely delete or anonymize it.
                </p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  8. Children's Privacy
                </h2>
                <p>
                  Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
                </p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  9. International Data Transfers
                </h2>
                <p>
                  Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from the laws of your country. We take appropriate safeguards to ensure that your personal information remains protected.
                </p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  10. Third-Party Links
                </h2>
                <p>
                  Our Service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies before providing any information.
                </p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  11. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically.
                </p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  12. HIPAA Compliance
                </h2>
                <p>
                  While Tilted is designed to support mental wellness, we are not a HIPAA-covered entity. If you are seeking HIPAA-protected mental health services, please consult with a licensed healthcare provider through appropriate channels.
                </p>
              </section>

              <section>
                <h2
                  className={`text-2xl font-semibold mb-3 ${
                    isEarthy ? "text-brown-800" : "text-charcoal-grey"
                  }`}
                >
                  13. Contact Us
                </h2>
                <p>
                  If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <p className="mt-2">
                  Email: privacy@tilted.com<br />
                  Address: 123 Wellness Street, San Francisco, CA 94102<br />
                  Phone: (555) 999-TILT
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
