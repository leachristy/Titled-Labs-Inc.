import { useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../src/firebase";

/**
 * ImageUpload Component
 * 
 * Provides drag-and-drop and file picker functionality for uploading images.
 * Uploads images to Firebase Storage and returns the download URL.
 * Shows upload progress, preview, and validation.
 * 
 * Features:
 * - Drag and drop support
 * - Click to browse files
 * - Image preview
 * - Upload progress indicator
 * - File type validation (images only)
 * - File size validation (max 5MB)
 * - Remove uploaded image
 * 
 * @param {function} onImageUploaded - Callback function that receives the uploaded image URL
 * @param {string} currentImageUrl - Existing image URL (for editing)
 * @param {boolean} isEarthy - Theme flag (true = earthy theme, false = cool theme)
 */
export default function ImageUpload({
  onImageUploaded,
  currentImageUrl,
  isEarthy,
}) {
  // State for drag-and-drop visual feedback
  const [isDragging, setIsDragging] = useState(false);
  
  // State for upload progress tracking
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // 0-100 percentage
  
  // State for image preview URL
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || "");
  
  // Ref for the hidden file input element
  const fileInputRef = useRef(null);

  /**
   * Drag and drop event handlers
   * These handle the visual feedback when dragging files over the upload area
   */
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true); // Show highlighted state
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false); // Remove highlighted state
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Keep this handler to allow dropping
  };

  /**
   * Handles file drop event
   * Extracts the file and passes it to the upload handler
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]); // Upload the first file
    }
  };

  /**
   * Handles file selection from file picker
   * Triggered when user clicks the upload area
   */
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]); // Upload the selected file
    }
  };

  /**
   * Main file upload handler
   * Validates the file and uploads it to Firebase Storage
   * 
   * @param {File} file - The file object to upload
   */
  const handleFileUpload = async (file) => {
    // Validate file type - must be an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size - max 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    // Start upload process
    setUploading(true);
    setUploadProgress(0);

    // Create a unique filename using timestamp to prevent conflicts
    const timestamp = Date.now();
    const filename = `community-images/${timestamp}_${file.name}`;
    const storageRef = ref(storage, filename);

    // Create upload task with progress tracking
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Monitor upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calculate and update progress percentage
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (error) => {
        // Handle upload errors
        console.error("Upload error:", error);
        alert("Failed to upload image. Please try again.");
        setUploading(false);
        setUploadProgress(0);
      },
      async () => {
        // Upload completed successfully
        // Get the download URL for the uploaded file
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setPreviewUrl(downloadURL); // Show preview
        onImageUploaded(downloadURL); // Pass URL to parent component
        setUploading(false);
        setUploadProgress(0);
      }
    );
  };

  /**
   * Removes the uploaded/previewed image
   * Clears the preview and notifies parent component
   */
  const handleRemoveImage = () => {
    setPreviewUrl("");
    onImageUploaded(""); // Clear image in parent component
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label
        className={`block text-sm font-medium ${
          isEarthy ? "text-brown-700" : "text-gray-700"
        }`}
      >
        Image (optional)
      </label>

      {/* Upload Area - Only shown when no image is uploaded */}
      {!previewUrl && (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
            isDragging
              ? isEarthy
                ? "border-rust-500 bg-cream-100" // Highlighted when dragging - earthy
                : "border-light-lavender bg-purple-50" // Highlighted when dragging - cool
              : isEarthy
              ? "border-tan-300 hover:border-rust-400 hover:bg-cream-50" // Normal state - earthy
              : "border-blue-grey hover:border-light-lavender hover:bg-purple-50" // Normal state - cool
          }`}
          onClick={() => fileInputRef.current?.click()} // Open file picker on click
        >
          {/* Hidden file input - triggered by clicking the upload area */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*" // Only allow image files
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload Progress Display */}
          {/* Upload Progress Display */}
          {uploading ? (
            <div className="space-y-2">
              {/* Spinning loader icon */}
              <svg
                className={`mx-auto h-12 w-12 animate-spin ${
                  isEarthy ? "text-rust-500" : "text-light-lavender"
                }`}
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {/* Upload percentage text */}
              <p
                className={`text-sm font-medium ${
                  isEarthy ? "text-brown-700" : "text-gray-700"
                }`}
              >
                Uploading... {uploadProgress}%
              </p>
              {/* Progress bar */}
              <div
                className={`w-full h-2 rounded-full overflow-hidden ${
                  isEarthy ? "bg-tan-200" : "bg-gray-200"
                }`}
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    isEarthy ? "bg-rust-500" : "bg-light-lavender"
                  }`}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              {/* Upload icon and instructions - shown when not uploading */}
              <svg
                className={`mx-auto h-12 w-12 ${
                  isEarthy ? "text-brown-400" : "text-gray-400"
                }`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-4">
                {/* Main instruction text */}
                <p
                  className={`text-sm font-medium ${
                    isEarthy ? "text-brown-700" : "text-gray-700"
                  }`}
                >
                  {isDragging
                    ? "Drop image here" // Text when dragging over
                    : "Drag and drop an image, or click to browse"} {/* Normal text */}
                </p>
                {/* File type and size info */}
                <p
                  className={`text-xs mt-1 ${
                    isEarthy ? "text-brown-600" : "text-gray-500"
                  }`}
                >
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Preview - Only shown when image is uploaded and not currently uploading */}
      {previewUrl && !uploading && (
        <div className="relative">
          {/* Display uploaded image */}
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full h-auto max-h-64 rounded-lg shadow-md"
            onError={(e) => {
              // Hide image if it fails to load
              e.target.style.display = "none";
              setPreviewUrl("");
            }}
          />
          {/* Remove button - appears in top-right corner of preview */}
          <button
            type="button"
            onClick={handleRemoveImage}
            className={`absolute top-2 right-2 p-2 rounded-full text-white transition shadow-lg ${
              isEarthy
                ? "bg-rust-500 hover:bg-rust-600"
                : "bg-light-lavender hover:bg-medium-lavender"
            }`}
          >
            {/* X icon */}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
