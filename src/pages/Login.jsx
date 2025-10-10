import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function Login() {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === 'earthy';
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate login process
    try {
      // Add your Firebase auth logic here
      console.log('Login attempt:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On success, redirect to home
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <title>Login - Tilted | Mental Wellness</title>
      <div className={`mt-10 min-h-screen ${isEarthy ? 'bg-cream-100' : 'bg-pale-lavender'} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className={`text-heading ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`}>
              Welcome back
            </h2>
            <p className={`mt-2 text-subheading ${isEarthy ? 'text-brown-700' : 'text-slate-blue'}`}>
              Sign in to your account to continue your wellness journey
            </p>
          </div>

          {/* Login Form */}
          <div className={`${isEarthy ? 'card' : 'card-new'} p-8`}>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className={`${isEarthy ? 'bg-rust-50 border-rust-200 text-rust-700' : 'bg-blue-grey/10 border-blue-grey text-slate-blue'} border px-4 py-3 rounded`}>
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className={`form-label ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`}>
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`form-input w-full px-3 py-2 border rounded-md ${isEarthy ? 'border-tan-300 focus:border-rust-500 focus:ring-rust-500' : 'border-cool-grey focus:border-slate-blue focus:ring-slate-blue'}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className={`form-label ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`form-input w-full px-3 py-2 border rounded-md ${isEarthy ? 'border-tan-300 focus:border-rust-500 focus:ring-rust-500' : 'border-cool-grey focus:border-slate-blue focus:ring-slate-blue'}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className={`h-4 w-4 ${isEarthy ? 'text-rust-500 focus:ring-rust-500 border-tan-300' : 'text-slate-blue focus:ring-slate-blue border-cool-grey'} rounded`}
                  />
                  <label htmlFor="remember-me" className={`ml-2 block text-sm ${isEarthy ? 'text-brown-700' : 'text-slate-blue'}`}>
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className={`font-medium ${isEarthy ? 'text-rust-500 hover:text-rust-600' : 'text-slate-blue hover:text-charcoal-grey'}`}
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`${isEarthy ? 'btn-primary' : 'btn-primary-new'} w-full flex justify-center py-2 px-4 disabled:opacity-50`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className={`text-sm ${isEarthy ? 'text-brown-600' : 'text-slate-blue'}`}>
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className={`font-medium ${isEarthy ? 'text-rust-500 hover:text-rust-600' : 'text-slate-blue hover:text-charcoal-grey'}`}
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Additional Options */}
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isEarthy ? 'border-tan-300' : 'border-cool-grey'}`} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${isEarthy ? 'bg-cream-100 text-brown-600' : 'bg-pale-lavender text-slate-blue'}`}>Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`w-full inline-flex justify-center py-2 px-4 border ${isEarthy ? 'border-tan-300 bg-white text-brown-700 hover:bg-tan-50' : 'border-cool-grey bg-white text-charcoal-grey hover:bg-pale-lavender'} rounded-md shadow-sm text-sm font-medium`}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                className={`w-full inline-flex justify-center py-2 px-4 border ${isEarthy ? 'border-tan-300 bg-white text-brown-700 hover:bg-tan-50' : 'border-cool-grey bg-white text-charcoal-grey hover:bg-pale-lavender'} rounded-md shadow-sm text-sm font-medium`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                <span className="ml-2">Twitter</span>
              </button>
            </div>
          </div>

          {/* Crisis Support */}
          <div className={`text-center p-4 ${isEarthy ? 'bg-rust-50 border-rust-200' : 'bg-blue-grey/10 border-cool-grey'} rounded-lg border`}>
            <p className={`text-sm ${isEarthy ? 'text-brown-700' : 'text-charcoal-grey'}`}>
              Need immediate support?
            </p>
            <p className={`text-sm font-semibold ${isEarthy ? 'text-rust-600' : 'text-slate-blue'}`}>
              Crisis Hotline: (555) 999-TILT
            </p>
          </div>
        </div>
      </div>
    </>
  );
}


