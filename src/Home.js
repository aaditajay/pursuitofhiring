import React, { useState } from "react";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function Home({ onStart }) {
  const [jobRole, setJobRole] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!jobRole.trim()) { setError("Please enter a job role."); return; }
    if (!resume) { setError("Please upload your resume as a PDF."); return; }
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("job_role", jobRole);
      formData.append("resume", resume);
      const res = await fetch(`${BACKEND_URL}/api/start`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onStart({ jobRole, questions: data.questions, resumeText: data.resume_text });
    } catch (err) {
      setError("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
      
      {/* Brand Header aligned with the grid */}
      <div style={{ display: "flex", alignItems: "center", padding: "1.5rem 0", flexShrink: 0 }}>
        <img 
          src="/icon.png" 
          alt="Logo" 
          style={{ height: "38px", display: "block" }} 
          onError={e => { e.target.style.display = "none"; }} 
        />
      </div>

      <div className="animate-fade desktop-split" style={{ alignItems: "center", flex: 1, padding: "1.5rem 0" }}>

        <div className="desktop-main" style={{ paddingRight: "2rem" }}>
          <h1 style={{ fontSize: "52px", fontWeight: "400", lineHeight: "1.15", marginBottom: "1rem", color: "#fff", fontFamily: "CustomHeadingFont, Playfair Display, Georgia, serif", letterSpacing: "-0.5px" }}>
            thE pUrsUit<br />Of hiRiNg
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)", lineHeight: "1.7", marginBottom: "2rem", maxWidth: "460px", fontFamily: "Playfair Display, Georgia, serif", fontStyle: "italic" }}>
            Practice with AI, receive instant feedback, and walk into your dream role with confidence.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)" }}>◈</span>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", fontFamily: "Inter, sans-serif" }}><strong style={{ color: "white" }}>Resume-tailored</strong> questions based on your background</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)" }}>◎</span>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", fontFamily: "Inter, sans-serif" }}><strong style={{ color: "white" }}>Live grading</strong> and constructive feedback on every answer</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)" }}>◉</span>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", fontFamily: "Inter, sans-serif" }}><strong style={{ color: "white" }}>Final report</strong> with score, strengths and improvement tips</span>
            </div>
          </div>
        </div>

        <div className="desktop-sidebar">
          <div className="card">
            <h3 style={{ fontSize: "22px", fontWeight: "400", marginBottom: "0.4rem", color: "white", fontFamily: "Playfair Display, Georgia, serif" }}>
              Prepare Your Session
            </h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "1.75rem", fontFamily: "Playfair Display, Georgia, serif", fontStyle: "italic" }}>
              Upload your resume and target role to begin
            </p>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.6)", marginBottom: "8px", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>
                Target Role
              </label>
              <input type="text" placeholder="e.g. Frontend Developer, Data Analyst" value={jobRole} onChange={e => setJobRole(e.target.value)} disabled={loading} />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.6)", marginBottom: "8px", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>
                Resume (PDF only)
              </label>
              <div className="upload-zone" onClick={() => !loading && document.getElementById("resume-upload").click()}>
                <input id="resume-upload" type="file" accept=".pdf" onChange={e => setResume(e.target.files[0])} style={{ display: "none" }} disabled={loading} />
                <div style={{ fontSize: "20px", marginBottom: "4px" }}>{resume ? "✓" : "↑"}</div>
                <div style={{ fontSize: "13px", fontWeight: "500", color: resume ? "#34D399" : "rgba(255,255,255,0.8)", fontFamily: "Inter, sans-serif" }}>
                  {resume ? resume.name : "Click to upload PDF"}
                </div>
              </div>
            </div>
            {error && <p className="error" style={{ marginBottom: "1rem" }}>{error}</p>}
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "13px", fontSize: "14px", fontFamily: "Inter, sans-serif", letterSpacing: "0.03em" }}>
              {loading ? "Reading your resume..." : "Start Mock Interview →"}
            </button>
          </div>
        </div>

      </div>

      <div style={{ textAlign: "center", padding: "0.75rem 2rem", fontSize: "12px", color: "rgba(255,255,255,0.3)", fontFamily: "Inter, sans-serif", letterSpacing: "0.02em", flexShrink: 0, zIndex: 10 }}>
        Do not use AI for your own sake{" "}&nbsp;|&nbsp;
        <a href="https://linkedin.com/in/aaditajay" target="_blank" rel="noopener noreferrer"
          style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "1px" }}
          onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.9)"}
          onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}>
          Contact Developer
        </a>
      </div>

    </div>
  );
}
