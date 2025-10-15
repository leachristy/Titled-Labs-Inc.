import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import UntiltNavBar from "../../components/UntiltNavBar";

export default function BreathingExercises() {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";
  const navigate = useNavigate();

  // 🧘 State
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // 🧘 Hardcoded Exercises
  const exercises = [
    {
      name: "Pursed Lip Breathing",
      description:
        "This exercise helps you slow down your breathing and reduce anxiety by focusing on your breath.",
      duration: 60,
      steps: [
        "Relax your neck and shoulders",
        "Keep your mouth closed and inhale through your nose for 2 seconds",
        "Purse your lips and exhale through your mouth for 4 seconds",
        "Repeat for 1 minute",
      ],
    },
    {
      name: "Diaphragmatic Breathing",
      description:
        "This exercise is beneficial for those with breathing challenges, and can help reduce stress related to various health conditions.",
      duration: 60,
      steps: [
        "Lie down on your back with your head on a pillow and knees slightly bent",
        "Place one hand on your chest and the other on your stomach to feel your diaphragm move",
        "Inhale slowly through your nose and feel your stomach rise",
        "Exhale through pursed lips while tightening your abdominal muscles",
        "Repeat for 1 minute, or as needed",
      ],
    },
    {
      name: "Deep Breathing",
      description:
        "Most people take short, shallow breaths with their chest — this exercise focuses on deep breathing with your diaphragm.",
      duration: 60,
      steps: [
        "Get comfortable, either lying down or sitting upright with good posture",
        "Breathe in through your nose and let your stomach expand",
        "Breathe out slowly through your nose",
        "Place one hand on your chest and the other on your stomach to feel the movement",
        "Repeat for 1 minute, or as needed",
      ],
    },
  ];

  // 🧭 Select an Exercise (manual start)
  const startExercise = (exercise) => {
    setSelectedExercise(exercise);
    setTimeLeft(exercise.duration);
    setIsRunning(false); // manual start
  };

  // 🕒 Timer effect
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <>
      <UntiltNavBar />
      <div
        className={`min-h-screen mt-20 px-6 py-10 ${
          isEarthy ? "bg-cream-100" : "bg-indigo-50"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          {/* Top-level Back Button only on list view */}
          {!selectedExercise && (
            <button
              onClick={() => navigate("/selfcare")}
              className={`mb-6 px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-sm ${
                isEarthy
                  ? "bg-tan-300 hover:bg-tan-400 text-brown-900"
                  : "bg-indigo-200 hover:bg-indigo-300 text-indigo-900"
              } transition`}
            >
              ← Back to Self-Care
            </button>
          )}

          {/* List of Exercises */}
          {!selectedExercise ? (
            <>
              <div className="mb-8 text-center">
                <h1
                  className={`text-4xl font-bold ${
                    isEarthy ? "text-brown-800" : "text-indigo-900"
                  }`}
                >
                  Breathing Exercises
                </h1>
                <p className={`mt-2 ${isEarthy ? "text-brown-600" : "text-slate-600"}`}>
                  Select an exercise, read the steps, and start when ready.
                </p>
              </div>

              <div className="grid gap-6">
                {exercises.map((ex, index) => (
                  <div
                    key={index}
                    onClick={() => startExercise(ex)}
                    className={`p-5 rounded-xl shadow-md cursor-pointer border transition ${
                      isEarthy
                        ? "bg-cream-50 hover:bg-tan-100 border-tan-300"
                        : "bg-white hover:bg-indigo-100 border-slate-200"
                    }`}
                  >
                    <h2
                      className={`text-xl font-semibold ${
                        isEarthy ? "text-brown-800" : "text-indigo-900"
                      }`}
                    >
                      {ex.name}
                    </h2>
                    <p
                      className={`text-gray-600 mt-1 ${
                        isEarthy ? "text-brown-600" : "text-slate-700"
                      }`}
                    >
                      {ex.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Duration: {ex.duration} sec</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Single Exercise View
            <div className="text-center">
              <h2
                className={`text-3xl font-bold mb-4 ${
                  isEarthy ? "text-brown-800" : "text-indigo-900"
                }`}
              >
                {selectedExercise.name}
              </h2>
              <p
                className={`text-gray-600 mb-6 ${
                  isEarthy ? "text-brown-600" : "text-slate-700"
                }`}
              >
                {selectedExercise.description}
              </p>

              {/* Steps visible immediately */}
              <ul
                className={`list-disc text-left mx-auto w-max mb-6 ${
                  isEarthy ? "text-brown-700" : "text-slate-800"
                }`}
              >
                {selectedExercise.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>

              {/* Timer / Start and Back Buttons */}
              <div className="flex flex-col items-center gap-3 mb-6">
                {isRunning ? (
                  <div
                    className={`w-40 h-40 rounded-full border-8 flex items-center justify-center text-3xl font-bold animate-pulse ${
                      isEarthy
                        ? "border-tan-300 text-rust-500"
                        : "border-indigo-300 text-indigo-600"
                    }`}
                  >
                    {timeLeft}s
                  </div>
                ) : (
                  <>
                    {timeLeft === 0 ? (
                      <p className="text-green-600 font-semibold">
                        Exercise complete!
                      </p>
                    ) : (
                      <button
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          isEarthy
                            ? "bg-rust-500 hover:bg-rust-600 text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        } transition`}
                        onClick={() => setIsRunning(true)}
                      >
                        Start Exercise
                      </button>
                    )}
                  </>
                )}

                {/* Back Button always below */}
                <button
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                  onClick={() => setSelectedExercise(null)}
                >
                  Back to Exercises
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
