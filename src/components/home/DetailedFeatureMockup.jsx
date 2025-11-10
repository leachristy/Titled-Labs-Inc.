import TherapistMockup from "./TherapistMockup";
import AIChatMockup from "./AIChatMockup";
import CommunityMockup from "./CommunityMockup";
import { therapistMockData, aiChatMockData, communityGroupsData } from "../../data/home";

export default function DetailedFeatureMockup({ type }) {
  const mockupComponents = {
    therapist: <TherapistMockup data={therapistMockData} />,
    aiChat: <AIChatMockup data={aiChatMockData} />,
    community: <CommunityMockup data={communityGroupsData} />,
  };

  return mockupComponents[type] || null;
}
