import { useState } from "react";
import { db } from "../src/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useTheme } from "../contexts/ThemeContext";

export default function EditProfile({ userId, profile, onSave, onCancel }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const [form, setForm] = useState({
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    email: profile.email || "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName)
      return setError("Please enter both first and last name.");

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        firstName: form.firstName,
        lastName: form.lastName,
        updatedAt: new Date(),
      });
      onSave(form);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto flex flex-col gap-4 mt-4 text-left"
    >
      {error && (
        <div
          className={`text-center rounded py-2 px-3 ${
            isEarthy ? "bg-rust-500 text-white" : "bg-slate-blue text-white"
          }`}
        >
          {error}
        </div>
      )}

      <label className="font-semibold">First Name</label>
      <input
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        className={`border rounded px-3 py-2 ${
          isEarthy
            ? "border-tan-300 bg-cream-50 text-brown-800"
            : "border-cool-grey bg-white text-charcoal-grey"
        }`}
      />

      <label className="font-semibold">Last Name</label>
      <input
        value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        className={`border rounded px-3 py-2 ${
          isEarthy
            ? "border-tan-300 bg-cream-50 text-brown-800"
            : "border-cool-grey bg-white text-charcoal-grey"
        }`}
      />

      <label className="font-semibold">Email</label>
      <input
        value={form.email}
        disabled
        className={`border rounded px-3 py-2 opacity-75 cursor-not-allowed ${
          isEarthy
            ? "border-tan-200 bg-cream-200 text-brown-700"
            : "border-cool-grey bg-blue-grey/10 text-charcoal-grey"
        }`}
      />

      <div className="flex justify-center gap-3 mt-6">
        <button
          type="submit"
          className={`px-5 py-2 rounded font-semibold transition ${
            isEarthy
              ? "bg-rust-500 hover:bg-rust-600 text-white"
              : "bg-slate-blue hover:bg-charcoal-grey text-white"
          }`}
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`px-5 py-2 rounded font-semibold border transition ${
            isEarthy
              ? "border-tan-300 bg-white text-brown-700 hover:bg-cream-200"
              : "border-cool-grey bg-white text-slate-blue hover:bg-pale-lavender"
          }`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
