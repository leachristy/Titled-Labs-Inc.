import TeamCard from "../components/TeamCard";
import { team } from "../data/team";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 pt-30 px-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-5">About Untilted Lab Inc.</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're dedicated to making mental health care accessible, affordable, and effective.
            Our team of licensed professionals is here to support you on your wellness journey.
          </p>
        </div>

        <div className="grid-team">
          {team.map((m, i) => <TeamCard key={i} {...m} />)}
        </div>
      </div>
    </div>
  );
}
