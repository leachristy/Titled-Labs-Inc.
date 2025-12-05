import { useState } from "react";
import { db } from "../../src/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useTheme } from "../../contexts/ThemeContext";

export default function EditProfile({ 
  userId, 
  profile, 
  avatarOptions = [], 
  googlePhotoUrl,
  onSave, 
  onCancel 
}) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === "earthy";

  const existingBirthday = profile.birthday || "";
  const isBirthdayImmutable = existingBirthday !== "";

  const [form, setForm] = useState({
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    email: profile.email || "",
    birthday: existingBirthday,
    avatarId: profile.avatarId || null,
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName)
      return setError("Please enter both first and last name.");

    try {
      const userRef = doc(db, "users", userId);

      const updateData = {
        firstName: form.firstName,
        lastName: form.lastName,
        updatedAt: new Date(),
        avatarId: form.avatarId,
        birthday: isBirthdayImmutable ? existingBirthday : form.birthday
      };

      await updateDoc(userRef, updateData);
      onSave(form);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    }
  };

  const disabledStyle = `border rounded px-3 py-2 opacity-75 cursor-not-allowed ${
    isEarthy
      ? "border-tan-200 bg-cream-200 text-brown-700"
      : "border-purple-200 bg-purple-50 text-gray-900"
  }`;

  const enabledStyle = `border rounded px-3 py-2 ${
    isEarthy
      ? "border-tan-300 bg-cream-50 text-brown-800"
      : "border-cool-grey bg-white text-charcoal-grey"
  }`;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto flex flex-col gap-4 mt-4 text-left"
    >
      {error && (
        <div className={`text-center rounded py-2 px-3 ${isEarthy ? "bg-rust-500 text-white" : "bg-slate-blue text-white"}`}>
          {error}
        </div>
      )}

      {/* --- NAMES --- */}
      <label className="font-semibold">First Name</label>
      <input
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        className={enabledStyle}
      />

      <label className="font-semibold">Last Name</label>
      <input
        value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        className={enabledStyle}
      />

      {/* --- EMAIL (Always Disabled) --- */}
      <label className="font-semibold">Email</label>
      <input
        value={form.email}
        disabled
        className={disabledStyle}
      />

      {/* --- BIRTHDAY (Disabled if previously set) --- */}
      <label className="font-semibold">Birthday {isBirthdayImmutable && "(Cannot be changed)"}</label>
      <input
        type="date"
        value={form.birthday}
        onChange={(e) => setForm({ ...form, birthday: e.target.value })}
        disabled={isBirthdayImmutable}
        className={isBirthdayImmutable ? disabledStyle : enabledStyle}
      />

{/* --- AVATAR SELECTION --- */}
      <div className="mt-4 mb-2">
        <label className="font-semibold block mb-3">Choose an Avatar</label>
        <div className="grid grid-cols-5 gap-3"> {/* Increased columns to 5 to fit Google option */}
          
          {/* GOOGLE PHOTO (If available) */}
          {googlePhotoUrl && (
            <button
              type="button"
              onClick={() => setForm({ ...form, avatarId: null })} // Set null to use Google/Default
              className={`relative rounded-full overflow-hidden transition-all duration-200 aspect-square group ${
                !form.avatarId
                  ? `ring-4 scale-105 ${isEarthy ? 'ring-rust-500' : 'ring-light-lavender'}` 
                  : 'hover:opacity-80 ring-1 ring-transparent'
              }`}
              title="Use Google Profile Photo"
            >
              <img src={googlePhotoUrl} alt="Google Profile" className="w-full h-full object-cover" />
              {/* Optional: Add a small G icon overlay to indicate source */}
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.5v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
                </svg>
              </div>
            </button>
          )}

          {/* PRESETS */}
          {avatarOptions.map((avatar) => (
            <button
              key={avatar.id}
              type="button"
              onClick={() => setForm({ ...form, avatarId: avatar.id })}
              className={`relative rounded-full overflow-hidden transition-all duration-200 aspect-square ${
                form.avatarId === avatar.id 
                  ? `ring-4 scale-105 ${isEarthy ? 'ring-rust-500' : 'ring-light-lavender'}` 
                  : 'hover:opacity-80 ring-1 ring-transparent'
              }`}
            >
              <img src={avatar.src} alt={avatar.alt} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-6">
        <button
          type="submit"
          className={`px-5 py-2 rounded font-semibold transition ${isEarthy ? "bg-rust-500 hover:bg-rust-600 text-white" : "bg-[#c7b4e2] hover:bg-[#b49fd3] text-gray-900"}`}
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`px-5 py-2 rounded font-semibold border transition ${isEarthy ? "border-tan-300 bg-white text-brown-700 hover:bg-cream-200" : "border-cool-grey bg-white text-slate-blue hover:bg-pale-lavender"}`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}