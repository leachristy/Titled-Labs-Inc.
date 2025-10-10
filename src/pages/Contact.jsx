import { useTheme } from "../contexts/ThemeContext";

export default function Contact() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === 'earthy';

  return (
    <>
      <title>Contact - Tilted | Mental Wellness</title>
      <div className={`min-h-screen pt-24 px-4 ${isEarthy ? 'bg-cream-100' : 'bg-pale-lavender'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--pale-lavender)'}}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-heading text-center mb-8 ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
            Contact Us
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className={`card ${isEarthy ? 'border-tan-200' : 'border-cool-grey'}`} style={{borderColor: isEarthy ? undefined : 'var(--cool-grey)'}}>
              <h2 className={`text-xl font-semibold mb-4 ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>Get in Touch</h2>
              <div className="space-y-4">
                <div>
                  <label className={`form-label ${isEarthy ? 'text-brown-700' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>Name</label>
                  <input type="text" className={`form-input ${isEarthy ? 'border-tan-200 focus:ring-rust-500 focus:border-rust-500' : 'border-cool-grey focus:ring-slate-blue focus:border-slate-blue'}`} style={{borderColor: isEarthy ? undefined : 'var(--cool-grey)'}} />
                </div>
                <div>
                  <label className={`form-label ${isEarthy ? 'text-brown-700' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>Email</label>
                  <input type="email" className={`form-input ${isEarthy ? 'border-tan-200 focus:ring-rust-500 focus:border-rust-500' : 'border-cool-grey focus:ring-slate-blue focus:border-slate-blue'}`} style={{borderColor: isEarthy ? undefined : 'var(--cool-grey)'}} />
                </div>
                <div>
                  <label className={`form-label ${isEarthy ? 'text-brown-700' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>Phone</label>
                  <input type="tel" className={`form-input ${isEarthy ? 'border-tan-200 focus:ring-rust-500 focus:border-rust-500' : 'border-cool-grey focus:ring-slate-blue focus:border-slate-blue'}`} style={{borderColor: isEarthy ? undefined : 'var(--cool-grey)'}} />
                </div>
                <div>
                  <label className={`form-label ${isEarthy ? 'text-brown-700' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>Message</label>
                  <textarea rows="4" className={`form-input ${isEarthy ? 'border-tan-200 focus:ring-rust-500 focus:border-rust-500' : 'border-cool-grey focus:ring-slate-blue focus:border-slate-blue'}`} style={{borderColor: isEarthy ? undefined : 'var(--cool-grey)'}}></textarea>
                </div>
                <button className={`w-full ${isEarthy ? 'btn-primary' : 'font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 text-white'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--slate-blue)', color: 'white'}} onMouseEnter={(e) => !isEarthy && (e.target.style.backgroundColor = 'var(--charcoal-grey)')} onMouseLeave={(e) => !isEarthy && (e.target.style.backgroundColor = 'var(--slate-blue)')}>
                  Send Message
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className={`card ${isEarthy ? 'border-tan-200' : 'border-cool-grey'}`} style={{borderColor: isEarthy ? undefined : 'var(--cool-grey)'}}>
              <h2 className={`text-xl font-semibold mb-4 ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className={`font-medium ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>Address</h3>
                  <p className={`${isEarthy ? 'text-brown-600' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>
                    13 Willow Street
                    <br />
                    Willow District
                    <br />
                    Therapy City, Somewhere
                  </p>
                </div>
                <div>
                  <h3 className={`font-medium ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>Phone</h3>
                  <p className={`${isEarthy ? 'text-brown-600' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>(657) 333-TILTED</p>
                </div>
                <div>
                  <h3 className={`font-medium ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>Email</h3>
                  <p className={`${isEarthy ? 'text-brown-600' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>support@Tilted.com</p>
                </div>
                <div>
                  <h3 className={`font-medium ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>Crisis Hotline</h3>
                  <p className={`font-semibold ${isEarthy ? 'text-rust-600' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>
                    24/7: (555) 999-TILT
                  </p>
                </div>
                <div>
                  <h3 className={`font-medium ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>Office Hours</h3>
                  <p className={`${isEarthy ? 'text-brown-600' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>
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
