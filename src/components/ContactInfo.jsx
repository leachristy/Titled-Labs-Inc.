import { useTheme } from "../contexts/ThemeContext";

export default function ContactInfo({ info }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const InfoSection = ({ title, children }) => (
    <div>
      <h3
        className={`font-medium ${
          isEarthy ? "text-brown-800" : "text-charcoal-grey"
        }`}
        style={{ color: isEarthy ? undefined : "var(--charcoal-grey)" }}
      >
        {title}
      </h3>
      <div
        className={`${isEarthy ? "text-brown-600" : "text-slate-blue"}`}
        style={{ color: isEarthy ? undefined : "var(--slate-blue)" }}
      >
        {children}
      </div>
    </div>
  );

  return (
    <div
      className={`card ${isEarthy ? "border-tan-200" : "border-cool-grey"}`}
      style={{ borderColor: isEarthy ? undefined : "var(--cool-grey)" }}
    >
      <h2
        className={`text-xl font-semibold mb-4 ${
          isEarthy ? "text-brown-800" : "text-charcoal-grey"
        }`}
        style={{ color: isEarthy ? undefined : "var(--charcoal-grey)" }}
      >
        Contact Information
      </h2>
      <div className="space-y-4">
        <InfoSection title="Address">
          <p>
            {info.address.street}
            <br />
            {info.address.district}
            <br />
            {info.address.city}
          </p>
        </InfoSection>

        <InfoSection title="Phone">
          <p>{info.phone}</p>
        </InfoSection>

        <InfoSection title="Email">
          <p>{info.email}</p>
        </InfoSection>

        <InfoSection title="Crisis Hotline">
          <p
            className={`font-semibold ${
              isEarthy ? "text-rust-600" : "text-slate-blue"
            }`}
            style={{ color: isEarthy ? undefined : "var(--slate-blue)" }}
          >
            {info.crisisHotline.availability}: {info.crisisHotline.number}
          </p>
        </InfoSection>

        <InfoSection title="Office Hours">
          <p>
            {info.officeHours.weekdays}
            <br />
            {info.officeHours.saturday}
            <br />
            {info.officeHours.sunday}
          </p>
        </InfoSection>
      </div>
    </div>
  );
}
