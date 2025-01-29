"use client";
import { useState, DragEvent } from "react";
import { FiUpload, FiCopy, FiCheck } from "react-icons/fi"; // Import FiCheck for the check icon

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [text, setText] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false); // State to track the copied status

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/ocr", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setText(data.text);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to process the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text.join(" "));
    setCopied(true); // Set copied to true when text is copied
    setTimeout(() => setCopied(false), 2000); // Reset the state after 2 seconds
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#F7F9FC",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#272757",
          marginBottom: "10px",
        }}
      >
        Image to Text Converter
      </h1>
      <p style={{ color: "#505081", marginBottom: "20px" }}>
        An online image to text converter to extract text from images.
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            border: "2px dashed #8686AC",
            backgroundColor: "#F7F9FC",
            borderRadius: "10px",
            padding: "40px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <FiUpload size={40} color="#8686AC" />
          <p style={{ color: "#505081", marginBottom: "10px" }}>
            Drop, Upload or Paste image
          </p>
          <p
            style={{ fontSize: "14px", color: "#8686AC", marginBottom: "10px" }}
          >
            Supported formats: JPG, PNG, GIF, JPEG, PDF
          </p>
          <label
            style={{
              display: "inline-block",
              backgroundColor: "#272757",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Browse
            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*, .pdf"
            />
          </label>
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !selectedFile}
          style={{
            width: "100%",
            backgroundColor: loading || !selectedFile ? "#8686AC" : "#0F0E47",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: loading || !selectedFile ? "not-allowed" : "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading ? "Processing..." : "Upload & Extract Text"}
        </button>

        {text.length > 0 && (
          <div
            style={{
              marginTop: "20px",
              backgroundColor: "#F7F9FC",
              padding: "10px",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                color: "#505081",
                marginRight: "10px",
                flexGrow: 1,
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {text.join(" ")}
            </p>
            {copied ? (
              <FiCheck
                size={20}
                color="#8686AC"
                style={{ cursor: "pointer" }}
              />
            ) : (
              <FiCopy
                size={20}
                color="#8686AC"
                style={{ cursor: "pointer" }}
                onClick={handleCopyText}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
