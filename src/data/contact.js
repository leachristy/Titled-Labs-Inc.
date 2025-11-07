// Contact page data
export const contactInfo = {
  address: {
    street: "13 Willow Street",
    district: "Willow District",
    city: "Therapy City, Somewhere"
  },
  phone: "(657) 333-TILTED",
  email: "support@Tilted.com",
  crisisHotline: {
    number: "(555) 999-TILT",
    availability: "24/7"
  },
  officeHours: {
    weekdays: "Mon–Fri: 8AM–8PM",
    saturday: "Sat: 9AM–5PM",
    sunday: "Sun: 10AM–4PM"
  }
};

export const contactFormFields = [
  {
    id: "name",
    label: "Name",
    type: "text",
    required: true
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    required: true
  },
  {
    id: "phone",
    label: "Phone",
    type: "tel",
    required: false
  },
  {
    id: "message",
    label: "Message",
    type: "textarea",
    rows: 4,
    required: true
  }
];
