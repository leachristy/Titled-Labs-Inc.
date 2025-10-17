import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from "../src/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import BadgeGallery from "./BadgeGallery";
import Confirmation from "./Confirmation";
import defaultPic from "../assets/default-profile.jpg";

export default function EditProfile({ userId, profile, onSave, onCancel }) {
  const [form, setForm] = useState(profile);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Define color palette constants
  const BACKGROUND_LIGHT = "#ECDAC8";
  const TEXT_DARK = "#955749";
  const PRIMARY_BUTTON = "#BF5B3C";
  const HOVER_BUTTON = "#D8966F";
  const INPUT_BORDER = "#D1A693";
  const INPUT_BACKGROUND = "#F9F6F1";

  // Styles for the component
  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '500px', 
      margin: '0 auto',
      padding: '20px 0',
    },
    label: {
      color: TEXT_DARK,
      fontWeight: 'bold',
      marginTop: '15px',
      marginBottom: '5px',
      textAlign: 'left',
    },
    input: {
      padding: '10px 15px',
      border: `1px solid ${INPUT_BORDER}`,
      borderRadius: '4px',
      backgroundColor: INPUT_BACKGROUND,
      color: TEXT_DARK,
      fontSize: '16px',
    },
    fileInputContainer: {
        marginBottom: '10px',
        textAlign: 'left',
    },
    error: {
      backgroundColor: PRIMARY_BUTTON,
      color: 'white',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px',
      textAlign: 'center',
    },
    loading: {
        color: TEXT_DARK,
        textAlign: 'center',
        margin: '10px 0',
    },
    button: {
      backgroundColor: PRIMARY_BUTTON, // #BF5B3C
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '0 5px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
      minWidth: '120px',
    },
    cancelButton: {
      backgroundColor: INPUT_BORDER,
      color: TEXT_DARK,
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '0 5px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
      minWidth: '120px',
    },
    buttonGroup: {
      marginTop: '30px',
      display: 'flex',
      justifyContent: 'center',
    }
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validateName = (name) => /^[A-Za-z]{1,50}$/.test(name);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setError("Only .jpg, .jpeg, or .png allowed");
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `profiles/${userId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setForm({ ...form, profilePic: url });
      setError("");
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateName(form.firstName) || !validateName(form.lastName)) {
      return setError("Names must contain only letters (max 50 chars).");
    }
    if (form.email && !validateEmail(form.email)) {
        return setError("Please enter a valid email address.");
    }

    setError("");
    onSave(form);
  };

  return (
    <form className="edit-form" onSubmit={handleSubmit} style={styles.form}>
      {error && <div style={styles.error}>{error}</div>}

      <label style={styles.label}>First Name</label>
      <input
        value={form.firstName || ""}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        style={styles.input}
      />

      <label style={styles.label}>Last Name</label>
      <input
        value={form.lastName || ""}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        style={styles.input}
      />

      <label style={styles.label}>Email</label>
      <input
        value={form.email || ""}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        style={{ ...styles.input, backgroundColor: '#eee', cursor: 'not-allowed' }}
        disabled
      />

      <label style={styles.label}>Profile Picture</label>
      <div style={styles.fileInputContainer}>
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={handleFileChange}
        />
      </div>


      {uploading && <p style={styles.loading}>Uploading profile picture...</p>}

      <div style={styles.buttonGroup}>
        <button 
          type="submit" 
          style={styles.button}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = HOVER_BUTTON)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_BUTTON)}
        >
          Save Changes
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          style={styles.cancelButton}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_BUTTON)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = INPUT_BORDER)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}