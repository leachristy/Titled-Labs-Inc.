import { useTheme } from "../contexts/ThemeContext";
import TeamCard from "../components/TeamCard";
import { team } from "../data/team";

export default function About() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === 'earthy';

  return (
    <>
      <title>About - Tilted | Mental Wellness</title>
      <div className={`min-h-screen pt-30 px-20 ${isEarthy ? 'bg-cream-100' : 'bg-pale-lavender'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className={`text-heading mb-5 ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`}>
              About Tilted Lab Inc.
            </h1>
            <p className={`text-subheading ${isEarthy ? 'text-brown-700' : 'text-slate-blue'}`}>
              We're dedicated to making mental health care accessible,
              affordable, and effective. Our team of licensed professionals is
              here to support you on your wellness journey.
            </p>
          </div>

          <div className="grid-team">
            {team.map((m, i) => (
              <TeamCard key={i} {...m} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
