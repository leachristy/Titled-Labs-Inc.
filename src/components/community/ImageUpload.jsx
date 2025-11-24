import { useState } from "react";

/**
 * ImageUpload Component
 * 
 * Provides URL input functionality for adding images via link.
 * Shows image preview and validation.
 * 
 * Features:
 * - URL input field
 * - Image preview
 * - URL validation
 * - Remove image
 * 
 * @param {function} onImageUploaded - Callback function that receives the image URL
 * @param {string} currentImageUrl - Existing image URL (for editing)
 * @param {boolean} isEarthy - Theme flag (true = earthy theme, false = cool theme)
 */
export default function ImageUpload({
  onImageUploaded,
  currentImageUrl,
  isEarthy,
}) {
  // State for image URL input
  const [imageUrl, setImageUrl] = useState(currentImageUrl || "");
  
  // State for image preview URL
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || "");
  
  // State for loading preview
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  /**
   * Handles URL input change and validates image
   * 
   * @param {string} url - The image URL entered by user
   */
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    
    // Clear preview if URL is empty
    if (!url.trim()) {
      setPreviewUrl("");
      onImageUploaded("");
      return;
    }
    
    // Validate and load image preview
    setIsLoadingPreview(true);
  };

  /**
   * Handles loading the image preview
   * Sets the preview URL when user finishes typing or clicks preview button
   */
  const handleLoadPreview = () => {
    if (!imageUrl.trim()) return;
    
    setIsLoadingPreview(true);
    
    // Create a temporary image to validate the URL
    const img = new Image();
    img.onload = () => {
      setPreviewUrl(imageUrl);
      onImageUploaded(imageUrl);
      setIsLoadingPreview(false);
    };
    img.onerror = () => {
      alert("Failed to load image. Please check the URL and try again.");
      setIsLoadingPreview(false);
    };
    img.src = imageUrl;
  };

  /**
   * Removes the previewed image
   * Clears the preview and URL input
   */
  const handleRemoveImage = () => {
    setImageUrl("");
    setPreviewUrl("");
    onImageUploaded("");
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label
        className={`block text-sm font-medium ${
          isEarthy ? "text-brown-700" : "text-gray-700"
        }`}
      >
        Image URL (optional)
      </label>

      {/* URL Input Field */}
      <div className="flex gap-2">
        <input
          type="url"
          value={imageUrl}
          onChange={handleUrlChange}
          placeholder="https://example.com/image.jpg"
          className={`flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
            isEarthy
              ? "border-tan-300 focus:ring-rust-500"
              : "bg-white text-gray-900 border-blue-grey focus:ring-light-lavender"
          }`}
        />
        {/* Preview Button */}
        <button
          type="button"
          onClick={handleLoadPreview}
          disabled={!imageUrl.trim() || isLoadingPreview}
          className={`px-4 py-2 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed ${
            isEarthy
              ? "bg-rust-500 hover:bg-rust-600"
              : "bg-light-lavender hover:bg-medium-lavender"
          }`}
        >
          {isLoadingPreview ? (
            <svg
              className="animate-spin h-5 w-5"
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
          ) : (
            "Preview"
          )}
        </button>
      </div>

      {/* Helper text */}
      <p className={`text-xs ${isEarthy ? "text-brown-600" : "text-gray-600"}`}>
        Enter a direct link to an image (PNG, JPG, GIF, etc.)
      </p>

      {/* Preview - Only shown when image URL is loaded */}
      {previewUrl && (
        <div className="relative mt-4">
          {/* Display image */}
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full h-auto max-h-64 rounded-lg shadow-md"
            onError={(e) => {
              // Hide image if it fails to load
              e.target.style.display = "none";
              setPreviewUrl("");
              alert("Failed to load image. Please check the URL.");
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
