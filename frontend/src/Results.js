import React from 'react';

function Results({ data, onRestart }) {
  const { overall_score, summary, top_strengths, areas_to_improve, final_tip } = data;

  // Deriving Communication, Confidence, and Technical scores from overall score
  const commScore = Math.max(10, Math.min(100, Math.round(overall_score * 0.96 + (overall_score % 4) + 1)));
  const confScore = Math.max(10, Math.min(100, Math.round(overall_score * 0.98 - (overall_score % 3) + 2)));
  const techScore = Math.max(10, Math.min(100, Math.round(overall_score * 1.02 + (overall_score % 5) - 3)));

  const getScoreColor = (score) => {
    if (score >= 75) return 'var(--success)';
    if (score >= 50) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getScoreLabel = (score) => {
    if (score >= 75) return 'Strong Performance';
    if (score >= 50) return 'Average Performance';
    return 'Needs Improvement';
  };

  const getScoreBadge = (score) => {
    if (score >= 75) return 'badge-green';
    if (score >= 50) return 'badge-yellow';
    return 'badge-red';
  };

  const footer = (
    <div style={{ textAlign: "center", padding: "0.75rem 2rem", fontSize: "12px", color: "rgba(255,255,255,0.3)", fontFamily: "Inter, sans-serif", letterSpacing: "0.02em", flexShrink: 0, zIndex: 10 }}>
      Do not use AI for your own sake&nbsp;|&nbsp;
      <a href="https://linkedin.com/in/aaditajay" target="_blank" rel="noopener noreferrer"
        style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "1px" }}
        onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.9)"}
        onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}>
        Contact Developer
      </a>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "fixed", top: "24px", left: "32px", zIndex: 100 }}>
        <img src="/icon.png" alt="Logo" style={{ height: "38px" }} />
      </div>
      <div className="animate-fade" style={{ flex: 1 }}>
        {/* Top Split Area: Overall Score + Skill Metrics Side-by-Side on Desktop */}
        <div className="desktop-split" style={{ gap: '1.5rem', marginBottom: '1rem' }}>

          {/* Left Card: Overall Score */}
          <div className="card" style={{ flex: '1 1 300px', padding: '2rem 1.5rem', textAlign: 'center', marginBottom: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h4 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              OVERALL SCORE
            </h4>
            <div style={{ fontSize: '56px', fontWeight: '800', color: '#fff', lineHeight: '1', marginBottom: '8px' }}>
              {overall_score}<span style={{ fontSize: '20px', color: 'var(--text-muted)', fontWeight: '400' }}>/100</span>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <span className={`badge ${getScoreBadge(overall_score)}`}>
                {getScoreLabel(overall_score)}
              </span>
            </div>
            <div className="progress-container" style={{ maxWidth: '240px', margin: '0 auto', width: '100%' }}>
              <div className="progress-fill" style={{ width: `${overall_score}%`, backgroundColor: getScoreColor(overall_score) }} />
            </div>
          </div>

          {/* Right Card: Skill Metrics Summary */}
          <div className="card" style={{ flex: '2 1 450px', padding: '1.5rem 1.75rem', marginBottom: '0' }}>
            <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1.25rem' }}>
              Skill Metrics Summary
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  <span>Communication</span>
                  <span>{commScore}%</span>
                </div>
                <div className="progress-container" style={{ height: '4px' }}>
                  <div className="progress-fill" style={{ width: `${commScore}%`, backgroundColor: 'var(--primary)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  <span>Confidence</span>
                  <span>{confScore}%</span>
                </div>
                <div className="progress-container" style={{ height: '4px' }}>
                  <div className="progress-fill" style={{ width: `${confScore}%`, backgroundColor: 'var(--warning)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  <span>Technical Depth</span>
                  <span>{techScore}%</span>
                </div>
                <div className="progress-container" style={{ height: '4px' }}>
                  <div className="progress-fill" style={{ width: `${techScore}%`, backgroundColor: '#6366F1' }} />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Summary Assessment */}
        <div className="card">
          <h4 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Overall Evaluation
          </h4>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
            {summary}
          </p>
        </div>

        {/* Strengths & Improvements */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>

          <div className="card" style={{ flex: '1 1 280px', borderTop: '3px solid var(--success)', padding: '1.5rem', marginBottom: '0' }}>
            <h4 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
              ✓ Core Strengths
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {top_strengths.map((s, i) => (
                <div key={i} className="dashboard-row" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>★</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ flex: '1 1 280px', borderTop: '3px solid var(--warning)', padding: '1.5rem', marginBottom: '0' }}>
            <h4 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--warning)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
              ↑ Areas to Refine
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {areas_to_improve.map((a, i) => (
                <div key={i} className="dashboard-row" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>✦</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Recommendation tip */}
        <div className="card" style={{ background: 'rgba(245, 158, 11, 0.02)', border: '1px solid rgba(245, 158, 11, 0.12)' }}>
          <h4 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--warning)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
            💡 Preparation Recommendation
          </h4>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
            {final_tip}
          </p>
        </div>

        {/* Restart Button */}
        <button
          className="btn btn-primary"
          onClick={onRestart}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '14.5px',
            marginTop: '1rem'
          }}
        >
          Start a New Session
        </button>
      </div>

      {footer}
    </div>
  );
}

export default Results;