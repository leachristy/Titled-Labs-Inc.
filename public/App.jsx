import logoImage from './assets/logo.png'
import './App.css'

export default function App() {
  return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Logo Placeholder */}
      <div className="mb-8">
        <img 
          src={logoImage} 
          alt="Tilted Labs Logo" 
          className="w-26 h-24 object-contain shadow-lg rounded-full"
          style={{filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 1))' }}
        />
      </div>
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
        Tilted Labs Inc.
      </h1>
      {/* Subtitle */}
      <h2 className="text-2xl font-semibold text-blue-500 mb-6 text-center">
        Tilted — Therapy Website
      </h2>
      {/* Description */}
      <p className="text-lg text-gray-700 max-w-xl text-center mb-8">
        Welcome to Tilted, your online destination for accessible, compassionate therapy. 
        Discover resources, connect with professionals, and start your journey to well-being.
      </p>
      {/* Placeholder for future buttons/links */}
      <div>
        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition">
          Get Started
        </button>
      </div>
    </div>
  )
}