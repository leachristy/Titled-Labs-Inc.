import { useState } from "react";
import UntiltNavBar from "../../components/navigation/UntiltNavBar";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const RESOURCE_CATEGORIES = {
  crisis: {
    title: "Crisis Support",
    resources: [
      {
        name: "National Suicide Prevention Lifeline",
        description: "The National Suicide Prevention Lifeline provides confidential emotional support to people in suicidal crisis or emotional distress 24 hours a day, 7 days a week, across the United States. 9-8-8 is available via call or text, and online chat.",
        phone: "988", 
        url: "https://www.988california.org/",
        type: "phone",
        image: "/images/988.png"
      },
      {
        name: "Crisis Text Line",
        description: "Chat with live volunteer Crisis Counselors",
        phone: "text HOME to 741741",
        url: "https://www.crisistextline.org/",
        type: "text",
        image: "/images/crisistext.png"
      },
      {
        name: "211 network",
        description: "Comprehensive source of information about local resources",
        phone: "211",
        url: "https://www.211.org/",
        type: "phone",
        image: "/images/211.jpg"
      }
    ]
  },
  anxiety: {
    title: "Anxiety Support",
    resources: [
      {
        name: "Anxiety and Depression Association of America (ADAA)",
        description: "The ADAA is an international nonprofit organization dedicated to the prevention, treatment, and cure of anxiety, depression, OCD, PTSD, and co-occurring disorders through education, practice, and research.",
        phone: "(240)485-1018",
        url: "https://adaa.org/",
        type: "phone",
        image: "/images/adaa.jpg"
      },
      {
        name: "National Health Service (NHS) - Anxiety",
        description: "The NHS provides information on anxiety symptoms, treatments, and self-help strategies.",
        phone: "",
        url: "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/anxiety-fear-panic/",
        type: "website",
        image: "/images/nhs.png"
      },
      {
        name: "Calm",
        description: "Calm is a popular app for meditation and sleep, offering guided sessions to help reduce anxiety and improve mental well-being.",
        url: "https://www.calm.com/",
        type: "app",
        image: "/images/calm.jpg"
      }
    ]
  },
  depression: {
    title: "Depression Support",
    resources: [
      {
        name: "National Alliance on Mental Illness (NAMI)",
        description: "NAMI provides education, support, and advocacy for individuals affected by depression and other mental health conditions.",
        phone: "703-524-7600 ",
        url: "https://www.nami.org/",
        type: "phone",
        image: "/images/nami.jpg"
      },
      {
        name: "Mental Health America (MHA)",
        description: "MHA offers resources and support for individuals dealing with depression, including screening tools and educational materials.",
        phone: "(703)684-7722",
        url: "https://www.mhanational.org/",
        type: "phone",
        image: "/images/mha.png"
      },
      {
        name: "Depression and Bipolar Support Alliance (DBSA)",
        description: "DBSA provides peer-led support groups and educational resources for individuals living with depression and bipolar disorder.",
        phone: "(312)642-0049",
        url: "https://www.dbsalliance.org/",
        type: "phone",
        image: "/images/dbsa.png"
      }
    ]
  }
};

export default function Resources(){
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("crisis");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResources = Object.entries(RESOURCE_CATEGORIES)
    .filter(([key, category]) => 
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.resources.some(resource => 
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .reduce((acc, [key, category]) => {
      acc[key] = category;
      return acc;
    }, {});

  const getTypeColor = (type) => {
    const colors = {
      phone: isEarthy ? "bg-rust-500" : "bg-[#c7b4e2]",
      text: isEarthy ? "bg-terracotta-400" : "bg-[#a8d0e6]",
      website: isEarthy ? "bg-tan-500" : "bg-[#88b4b9]",
      app: isEarthy ? "bg-olive-400" : "bg-[#f08a5d]",
      directory: isEarthy ? "bg-brown-400" : "bg-[#b83b5e]"
    };
    return colors[type] || (isEarthy ? "bg-gray-400" : "bg-gray-400");
  };

  const getTypeText = (type) => {
    const types = {
      phone: "Phone",
      text: "Text",
      website: "Website",
      app: "App",
      directory: "Directory"
    };
    return types[type] || "Resource";
  };

  return (
    <>
      <UntiltNavBar />
      <div className={`min-h-screen mt-15 px-6 py-10 ${isEarthy ? "bg-cream-100" : "bg-[#373E4F]"}`}>
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/selfcare")}
            className={`mb-6 px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-sm ${
              isEarthy
                ? "bg-tan-300 hover:bg-tan-400 text-brown-900"
                : "bg-[#c7b4e2] hover:bg-[#b49fd3] text-gray-900"
            } transition`}
          >
            ← Back to Self-Care
          </button>

          <div className="mb-8 text-center">
            <h1 className={`text-4xl font-bold ${isEarthy ? "text-brown-800" : "text-gray-900"}`}>
              Mental Health Resources
            </h1>
            <p className={`mt-2 ${isEarthy ? "text-brown-600" : "text-gray-600"}`}>
              Find support, information, and tools for your mental wellness journey
            </p>
          </div>

          <div className="mb-8 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 ${
                isEarthy
                  ? "bg-cream-50 border-tan-300 focus:border-rust-500 focus:ring-rust-200 text-brown-800"
                  : "bg-white border-[#c7b4e2] focus:border-[#a8d0e6] focus:ring-[#a8d0e6] text-gray-800"
              }`}
            />
          </div>

          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {Object.entries(filteredResources).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  selectedCategory === key
                    ? isEarthy
                      ? "bg-rust-500 text-white shadow-lg transform -translate-y-0.5"
                      : "bg-[#c7b4e2] text-gray-900 shadow-lg transform -translate-y-0.5"
                    : isEarthy
                    ? "bg-tan-300 text-brown-800 hover:bg-tan-400"
                    : "bg-[#a8d0e6] text-gray-900 hover:bg-[#95c1d8]"
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources[selectedCategory]?.resources.map((resource, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl shadow-md border transition-transform duration-200 hover:transform hover:-translate-y-1 ${
                  isEarthy
                    ? "bg-cream-50 border-tan-300 hover:shadow-lg"
                    : "bg-white border-[#c7b4e2] hover:shadow-lg"
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  {resource.image && (
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border">
                      <img 
                        src={resource.image} 
                        alt={resource.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg leading-tight mb-2 ${isEarthy ? "text-brown-800" : "text-gray-800"}`}>
                      {resource.name}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${getTypeColor(resource.type)}`}>
                      {getTypeText(resource.type)}
                    </span>
                  </div>
                </div>
                
                <p className={`mb-4 text-sm ${isEarthy ? "text-brown-600" : "text-gray-600"}`}>
                  {resource.description}
                </p>

                <div className="space-y-3">
                  {resource.phone && (
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isEarthy ? "text-rust-600" : "text-[#c7b4e2]"}`}>
                        {resource.phone}
                      </span>
                    </div>
                  )}
                  
                  {resource.url && (
                    <div className="space-y-2">
                      <div className={`text-sm break-all ${isEarthy ? "text-brown-500" : "text-gray-500"}`}>
                        {resource.url.replace(/^https?:\/\//, '')}
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition w-full justify-center ${
                          isEarthy
                            ? "bg-tan-300 hover:bg-tan-400 text-brown-800"
                            : "bg-[#c7b4e2] hover:bg-[#b49fd3] text-gray-900"
                        }`}
                      >
                        <span>Visit Website</span>
                        <span>↗</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-12 p-6 rounded-xl text-center ${
            isEarthy ? "bg-rust-50 border border-rust-200" : "bg-[#373E4F] border border-[#c7b4e2]"
          }`}>
            <h3 className={`text-xl font-bold mb-2 ${isEarthy ? "text-rust-700" : "text-white"}`}>
              In Case of Emergency
            </h3>
            <p className={isEarthy ? "text-brown-600" : "text-gray-300"}>
              If you're in immediate danger or experiencing a mental health emergency, 
              please call <strong>911</strong> or go to your nearest emergency room.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}