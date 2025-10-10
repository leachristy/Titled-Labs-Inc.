export default function Contact() {
  return (
    <>
      <title>Contact - Untilted | Mental Wellness</title>
      <div className="min-h-screen bg-cream-100 pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-heading text-center mb-8">
            Contact Us
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="card">
              <h2 className="text-xl font-semibold text-brown-800 mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Name</label>
                  <input type="text" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input type="tel" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Message</label>
                  <textarea rows="4" className="form-input"></textarea>
                </div>
                <button className="btn-primary w-full">
                  Send Message
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card">
              <h2 className="text-xl font-semibold text-brown-800 mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-brown-800">Address</h3>
                  <p className="text-brown-600">
                    13 Willow Street
                    <br />
                    Willow District
                    <br />
                    Therapy City, Somewhere
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-brown-800">Phone</h3>
                  <p className="text-brown-600">(657) 333-TILTED</p>
                </div>
                <div>
                  <h3 className="font-medium text-brown-800">Email</h3>
                  <p className="text-brown-600">support@Untilted.com</p>
                </div>
                <div>
                  <h3 className="font-medium text-brown-800">Crisis Hotline</h3>
                  <p className="text-rust-600 font-semibold">
                    24/7: (555) 999-TILT
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-brown-800">Office Hours</h3>
                  <p className="text-brown-600">
                    Mon–Fri: 8AM–8PM
                    <br />
                    Sat: 9AM–5PM
                    <br />
                    Sun: 10AM–4PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
