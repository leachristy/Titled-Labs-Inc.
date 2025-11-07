// Home page content data
export const therapistMockData = {
  avatar: "DR",
  name: "Dr. Sarah Mitchell",
  specialty: "Licensed Therapist • CBT Specialist",
  sessions: [
    { label: "Next Session", value: "Tomorrow, 3:00 PM", highlight: true },
    { label: "Total Sessions", value: "12 completed", highlight: false },
    { label: "Progress Notes", value: "8 entries", highlight: false }
  ]
};

export const aiChatMockData = [
  {
    sender: "AI",
    avatar: "AI",
    message: "I understand you're feeling anxious about tomorrow. Let's try a grounding exercise together.",
    isUser: false
  },
  {
    sender: "ME",
    avatar: "ME",
    message: "That would be helpful, thank you.",
    isUser: true
  },
  {
    sender: "AI",
    avatar: "AI",
    message: "Great. Let's start by naming 5 things you can see right now...",
    isUser: false
  }
];

export const communityGroupsData = [
  {
    id: 1,
    avatar: "AA",
    name: "Anxiety & Stress Management",
    members: 2453,
    activeNow: 15,
    color: "primary"
  },
  {
    id: 2,
    avatar: "DM",
    name: "Depression & Mood Support",
    members: 1847,
    activeNow: 8,
    color: "secondary"
  },
  {
    id: 3,
    avatar: "CR",
    name: "Coping & Resilience",
    members: 3102,
    activeNow: 22,
    color: "tertiary"
  }
];

export const whoWeServeData = [
  {
    id: 1,
    icon: "user",
    title: "Individual Users",
    description: "Start your personal mental wellness journey with comprehensive tools and support designed for you.",
    features: [
      "24/7 AI support and resources",
      "Access to supportive communities",
      "Progress tracking and insights"
    ],
    ctaText: "Get started",
    ctaLink: "/contact",
    color: "primary"
  },
  {
    id: 2,
    icon: "users",
    title: "Therapists & Practices",
    description: "Streamline your practice management and provide better care with our comprehensive platform.",
    features: [
      "Automated scheduling and billing",
      "Client progress tracking",
      "Secure messaging system"
    ],
    ctaText: "Learn more",
    ctaLink: "/about",
    color: "secondary"
  }
];

export const resourcesData = [
  {
    id: 1,
    type: "ARTICLE",
    title: "5 ways to manage daily stress",
    description: "Discover practical techniques to reduce stress and improve your daily well-being.",
    color: "primary"
  },
  {
    id: 2,
    type: "GUIDE",
    title: "Getting started with therapy",
    description: "Your complete guide to beginning therapy and what to expect.",
    color: "secondary"
  },
  {
    id: 3,
    type: "TEMPLATE",
    title: "Mindfulness journal template",
    description: "Track your thoughts and emotions with our free journal template.",
    color: "tertiary"
  }
];

export const detailedFeaturesData = [
  {
    id: 1,
    badge: "PROFESSIONAL SUPPORT",
    title: "Connect with licensed therapists and supportive communities",
    description: "Join specialized groups, attend sessions, and access evidence-based therapy tools—all in one secure platform.",
    linkText: "Learn more about our team",
    link: "/about",
    mockupType: "therapist",
    reverse: false
  },
  {
    id: 2,
    badge: "WELLNESS SUPPORT",
    title: "Get personalized support for your mental wellness journey",
    description: "Available support to provide coping strategies, mindfulness exercises, and emotional support for your journey.",
    linkText: "Contact us today",
    link: "/contact",
    mockupType: "aiChat",
    reverse: true
  },
  {
    id: 3,
    badge: "PEER SUPPORT",
    title: "Find your community and share your journey",
    description: "Join support groups tailored to your needs. Connect with others who understand what you're going through.",
    linkText: "Meet our team",
    link: "/about",
    mockupType: "community",
    reverse: false
  }
];
