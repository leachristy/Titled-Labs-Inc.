import { useState } from 'react'
import logoImage from './assets/logo.png'
import leaImage from './assets/lea.png'
import carolImage from './assets/carol.png'
import thongImage from './assets/thong.png'
import kainoahImage from './assets/kai.png'
import hungImage from './assets/hung.png'
import backgroundImage from './assets/background.png'
import './App.css'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const Navigation = () => (
    <nav className="bg-white shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="Tilted Logo" 
              className="w-15 h-10 object-contain"
            />
            <span className="text-xl font-bold text-gray-800">Tilted Lab Inc.</span>
          </div>
          <div className="flex space-x-6">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentPage('about')}
              className={`nav-button ${currentPage === 'about' ? 'active' : ''}`}
            >
              About Us
            </button>
            <button 
              onClick={() => setCurrentPage('community')}
              className={`nav-button ${currentPage === 'community' ? 'active' : ''}`}
            >
              Community
            </button>
            <button 
              onClick={() => setCurrentPage('ai-chat')}
              className={`nav-button ${currentPage === 'ai-chat' ? 'active' : ''}`}
            >
              AI Chat
            </button>
            <button 
              onClick={() => setCurrentPage('contact')}
              className={`nav-button ${currentPage === 'contact' ? 'active' : ''}`}
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </nav>
  )

  const HomePage = () => (
    <div className="page-container home-page">
      <div className="max-w-4xl mx-auto text-center">
        <img 
          src={logoImage} 
          alt="Tilted Logo" 
          className="logo-image"
        />
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Welcome to Tilted Lab Inc.
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your journey to mental wellness starts here. Connect with licensed therapists, 
          join supportive communities, and access AI-powered mental health resources.
        </p>
        <div className="button-group">
          <button 
            onClick={() => setCurrentPage('ai-chat')}
            className="primary-button blue"
          >
            Start AI Chat
          </button>
          <button 
            onClick={() => setCurrentPage('community')}
            className="primary-button green"
          >
            Join Community
          </button>
        </div>
      </div>
    </div>
  )

  const AboutPage = () => {
    const team = [
      {
        name: "Lea Christy",
        role: "CEO of Tilted Lab Inc",
        bio: "Let's go Tilted Lab!!!",
        image: leaImage
      },
      {
        name: "Carol Balleza",
        role: "Lead Developer",
        bio: "Let me do it for you",
        image: carolImage
      },
      {
        name: "Thong Nguyen",
        role: "Backend developer",
        bio: "Let me spam meta comps.",
        image: thongImage
      },
      {
        name: "Kainoah Vann",
        role: "Addiction Specialist",
        bio: "Let's jump at Tilted Towers guys...",
        image: kainoahImage
      },
      {
        name: "Hung Anh Ho",
        role: "Front End Developer",
        bio: "Stress, I am Stress, Stress is me.",
        image: hungImage
      }
    ]

    return (
      <div className="min-h-screen bg-gray-50 pt-30 px-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-5">About Tilted Lab Inc.</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're dedicated to making mental health care accessible, affordable, and effective. 
              Our team of licensed professionals is here to support you on your wellness journey.
            </p>
          </div>
          
          <div className="grid-team">
            {team.map((member, index) => (
              <div key={index} className="card team-card">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="profile-image-fixed"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-500 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const CommunityPage = () => (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Community Chat</h1>
        
        <div className="bg-white rounded-lg shadow-lg h-96 mb-4 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">A</div>
              <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                <p className="text-sm">Welcome everyone! How is everyone feeling today?</p>
                <span className="text-xs text-gray-500">Alex - 2:30 PM</span>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">M</div>
              <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                <p className="text-sm">Having a better day today, thanks for asking!</p>
                <span className="text-xs text-gray-500">Maria - 2:32 PM</span>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">J</div>
              <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                <p className="text-sm">The breathing exercises really helped me this week.</p>
                <span className="text-xs text-gray-500">Jordan - 2:35 PM</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex space-x-3">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const AIChatPage = () => (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">AI Therapy Assistant</h1>
        
        <div className="bg-white rounded-lg shadow-lg h-96 mb-4 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">🤖</div>
              <div className="bg-blue-100 rounded-lg p-3 max-w-xs">
                <p className="text-sm">Hello! I'm your AI therapy assistant. How can I help you today?</p>
                <span className="text-xs text-gray-500">AI Assistant - Just now</span>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 justify-end">
              <div className="bg-gray-200 rounded-lg p-3 max-w-xs">
                <p className="text-sm">I've been feeling anxious lately about work.</p>
                <span className="text-xs text-gray-500">You - Just now</span>
              </div>
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">You</div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">🤖</div>
              <div className="bg-blue-100 rounded-lg p-3 max-w-xs">
                <p className="text-sm">I understand work anxiety can be overwhelming. Would you like to try a breathing exercise or talk about what specifically is causing you stress?</p>
                <span className="text-xs text-gray-500">AI Assistant - Just now</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex space-x-3">
            <input 
              type="text" 
              placeholder="Type your message to the AI assistant..." 
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Note: This AI assistant provides general support and is not a replacement for professional therapy.
          </p>
        </div>
      </div>
    </div>
  )

  const ContactPage = () => (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows="4" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                Send Message
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Address</h3>
                <p className="text-gray-600">13 Willow Street<br />Willow District<br />Therapy City, Somewhere</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Phone</h3>
                <p className="text-gray-600">(657) 333-TILTED</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <p className="text-gray-600">support@tilted.com</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Crisis Hotline</h3>
                <p className="text-red-600 font-semibold">24/7: (555) 999-TILT</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Office Hours</h3>
                <p className="text-gray-600">Monday - Friday: 8AM - 8PM<br />Saturday: 9AM - 5PM<br />Sunday: 10AM - 4PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <HomePage />
      case 'about': return <AboutPage />
      case 'community': return <CommunityPage />
      case 'ai-chat': return <AIChatPage />
      case 'contact': return <ContactPage />
      default: return <HomePage />
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      {renderPage()}
    </div>
  )
}