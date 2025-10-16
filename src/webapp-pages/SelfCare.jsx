import React from 'react';
import UntiltNavBar from '../components/UntiltNavBar';
import { useTheme } from "../contexts/ThemeContext";
import CustomButton from '../components/Button';
import { useNavigate } from 'react-router-dom';

const SelfCareSection = ({ title, children, isEarthy }) => (
  <div>
    <h1
      className={`mb-2 text-3xl font-bold ${
        isEarthy ? "text-brown-800" : "text-charcoal-grey"
      }`}
    >
      {title}
    </h1>
    <div className="w-full min-w-md h-24 bg-white border border-black/50 rounded-md shadow-md flex flex-col items-center justify-center gap-2 p-2">
      {children}
    </div>
  </div>
);

export const SelfCare = () => {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Button clicked!");
  };

  const handleJournalClick = () => {
    navigate("/journal");
  };

  const handleGoalsClick = () => {
    navigate("/goals");
  };

  return (
    <>
      <UntiltNavBar />

      <div
        className={`min-h-screen px-4 pt-24 ${
          isEarthy ? "bg-cream-100" : "bg-pale-lavender"
        }`}
        style={{ backgroundColor: isEarthy ? undefined : "var(--pale-lavender)" }}
      >
        <div className="flex flex-col gap-4 p-4">
          <SelfCareSection title="Breathing Exercises" isEarthy={isEarthy}>
            Breathing exercises feature preview here
            <CustomButton isEarthy={isEarthy} onClick={handleClick}>
              View Page
            </CustomButton>
          </SelfCareSection>

          <SelfCareSection title="Guided Videos" isEarthy={isEarthy}>
            Guided videos feature preview here
            <CustomButton isEarthy={isEarthy} onClick={handleClick}>
              View Page
            </CustomButton>
          </SelfCareSection>

          <SelfCareSection title="Journal Entries" isEarthy={isEarthy}>
            Journal entries feature preview here
            <CustomButton isEarthy={isEarthy} onClick={handleJournalClick}>
              View Page
            </CustomButton>
          </SelfCareSection>

          <SelfCareSection title="Goals" isEarthy={isEarthy}>
            Goals feature preview here
            <CustomButton isEarthy={isEarthy} onClick={handleGoalsClick}>
              View Page
            </CustomButton>
          </SelfCareSection>
        </div>
      </div>
    </>
  );
};
