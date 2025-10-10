import { useTheme } from "../contexts/ThemeContext";

export default function Community() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === 'earthy';

  return (
    <>
      <title>Community</title>
      <div className={`min-h-screen pt-24 px-4 ${isEarthy ? 'bg-cream-100' : 'bg-pale-lavender'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--pale-lavender)'}}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold mb-6 text-center ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
            Community Chat
          </h1>

          <div className={`rounded-lg shadow-lg h-96 mb-4 p-4 overflow-y-auto bg-white ${isEarthy ? 'border-tan-200' : 'border-cool-grey'} border`} style={{borderColor: isEarthy ? undefined : 'var(--cool-grey)'}}>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${isEarthy ? 'bg-rust-500' : 'bg-slate-blue'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--slate-blue)'}}>
                  A
                </div>
                <div className={`rounded-lg p-3 max-w-xs ${isEarthy ? 'bg-cream-100 border-tan-200' : 'bg-pale-lavender border-cool-grey'} border`} style={{backgroundColor: isEarthy ? undefined : 'var(--pale-lavender)', borderColor: isEarthy ? undefined : 'var(--cool-grey)'}}>
                  <p className={`text-sm ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
                    Welcome everyone! How is everyone feeling today?
                  </p>
                  <span className={`text-xs ${isEarthy ? 'text-brown-600' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>Alex - 2:30 PM</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${isEarthy ? 'bg-terracotta-400' : 'bg-blue-grey'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--blue-grey)'}}>
                  M
                </div>
                <div className={`rounded-lg p-3 max-w-xs ${isEarthy ? 'bg-cream-100 border-tan-200' : 'bg-pale-lavender border-cool-grey'} border`} style={{backgroundColor: isEarthy ? undefined : 'var(--pale-lavender)', borderColor: isEarthy ? undefined : 'var(--cool-grey)'}}>
                  <p className={`text-sm ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
                    Having a better day today, thanks for asking!
                  </p>
                  <span className={`text-xs ${isEarthy ? 'text-brown-600' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>Maria - 2:32 PM</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${isEarthy ? 'bg-rust-600' : 'bg-charcoal-grey'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
                  J
                </div>
                <div className={`rounded-lg p-3 max-w-xs ${isEarthy ? 'bg-cream-100 border-tan-200' : 'bg-pale-lavender border-cool-grey'} border`} style={{backgroundColor: isEarthy ? undefined : 'var(--pale-lavender)', borderColor: isEarthy ? undefined : 'var(--cool-grey)'}}>
                  <p className={`text-sm ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>
                    The breathing exercises really helped me this week.
                  </p>
                  <span className={`text-xs ${isEarthy ? 'text-brown-600' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>
                    Jordan - 2:35 PM
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={`rounded-lg shadow-lg p-4 bg-white ${isEarthy ? 'border-tan-200' : 'border-cool-grey'} border`} style={{borderColor: isEarthy ? undefined : 'var(--cool-grey)'}}>
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Type your message..."
                className={`flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${isEarthy ? 'border-tan-300 focus:ring-rust-500' : 'border-cool-grey focus:ring-slate-blue'}`}
                style={{borderColor: isEarthy ? undefined : 'var(--cool-grey)'}}
              />
              <button className={`px-6 py-2 text-white rounded-lg transition ${isEarthy ? 'bg-rust-500 hover:bg-rust-600' : 'bg-slate-blue hover:bg-charcoal-grey'}`} style={{backgroundColor: isEarthy ? undefined : 'var(--slate-blue)'}} onMouseEnter={(e) => !isEarthy && (e.target.style.backgroundColor = 'var(--charcoal-grey)')} onMouseLeave={(e) => !isEarthy && (e.target.style.backgroundColor = 'var(--slate-blue)')}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
