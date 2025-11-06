import TherapistMockup from "./TherapistMockup";
import { therapistMockData } from "../../data/home";

export default function DetailedFeatureMockup({ type }) {
  const mockupComponents = {
    therapist: <TherapistMockup data={therapistMockData} />,
  };

  return mockupComponents[type] || null;
}
