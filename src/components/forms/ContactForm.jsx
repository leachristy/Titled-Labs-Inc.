import { useTheme } from "../../contexts/ThemeContext";

export default function ContactForm({ fields, onSubmit }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    onSubmit?.(data);
  };

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
        Get in Touch
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              className={`form-label ${
                isEarthy ? "text-brown-700" : "text-slate-blue"
              }`}
              style={{ color: isEarthy ? undefined : "var(--slate-blue)" }}
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.id}
                name={field.id}
                rows={field.rows || 4}
                required={field.required}
                className={`form-input ${
                  isEarthy
                    ? "border-tan-200 focus:ring-rust-500 focus:border-rust-500"
                    : "border-cool-grey focus:ring-slate-blue focus:border-slate-blue"
                }`}
                style={{
                  borderColor: isEarthy ? undefined : "var(--cool-grey)",
                }}
              />
            ) : (
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                required={field.required}
                className={`form-input ${
                  isEarthy
                    ? "border-tan-200 focus:ring-rust-500 focus:border-rust-500"
                    : "border-cool-grey focus:ring-slate-blue focus:border-slate-blue"
                }`}
                style={{
                  borderColor: isEarthy ? undefined : "var(--cool-grey)",
                }}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className={`w-full ${
            isEarthy
              ? "btn-primary"
              : "font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 text-white"
          }`}
          style={{
            backgroundColor: isEarthy ? undefined : "var(--slate-blue)",
            color: "white",
          }}
          onMouseEnter={(e) =>
            !isEarthy &&
            (e.target.style.backgroundColor = "var(--charcoal-grey)")
          }
          onMouseLeave={(e) =>
            !isEarthy &&
            (e.target.style.backgroundColor = "var(--slate-blue)")
          }
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
