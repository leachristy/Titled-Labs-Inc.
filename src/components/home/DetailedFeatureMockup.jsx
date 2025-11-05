import TherapistMockup from "./TherapistMockup";
import AIChatMockup from "./AIChatMockup";
import CommunityGroupsMockup from "./CommunityGroupsMockup";
import { therapistMockData, aiChatMockData, communityGroupsData } from "../../data/home";

export default function DetailedFeatureMockup({ type }) {
  const mockupComponents = {
    therapist: <TherapistMockup data={therapistMockData} />,
    aiChat: <AIChatMockup messages={aiChatMockData} />,
    community: <CommunityGroupsMockup groups={communityGroupsData} />
  };

  return mockupComponents[type] || null;
}
