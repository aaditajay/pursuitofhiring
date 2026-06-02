import React, { useState, useEffect, useRef } from 'react';

const BACKEND_URL = 'pursuitofhiring.up.railway.app';

function Interview({ data, onFinish }) {
  const { jobRole, questions, resumeText } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qaPairs, setQaPairs] = useState([]);

  const chatEndRef = useRef(null);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const progress = ((currentIndex) / questions.length) * 100;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentIndex, feedback, loading, qaPairs]);

  const submitAnswer = async () => {
    if (!answer.trim()) { setError('Please type your answer first.'); return; }
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_role: jobRole,
          question: currentQuestion,
          answer: answer,
          resume_text: resumeText,
        }),
      });

      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setFeedback(result);

      setQaPairs(prev => [...prev, {
        question: currentQuestion,
        answer: answer,
        score: result.score,
        feedback: result.feedback,
      }]);
    } catch (err) {
      setError('Something went wrong: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = async () => {
    if (isLast) {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/summary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job_role: jobRole, qa_pairs: qaPairs }),
        });
        const result = await res.json();
        if (result.error) throw new Error(result.error);
        onFinish(result);
      } catch (err) {
        setError('Something went wrong: ' + err.message);
        setLoading(false);
      }
      return;
    }

    setCurrentIndex(prev => prev + 1);
    setAnswer('');
    setFeedback(null);
    setError('');
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'var(--success)';
    if (score >= 5) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getScoreBadge = (score) => {
    if (score >= 8) return 'badge-green';
    if (score >= 5) return 'badge-yellow';
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
        <div className="desktop-split">
          {/* Left Column: Progress & Status Assistant Badge */}
          <div className="desktop-sidebar">
            {/* Header and Progress Indicator */}
            <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  Question {currentIndex + 1} of {questions.length}
                </div>
                <div className="badge badge-green">
                  {jobRole}
                </div>
              </div>
              <div className="progress-container">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Interview Assistant Panel */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '1.25rem 1.5rem', marginBottom: '0' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                color: 'var(--primary)',
                fontSize: '14px'
              }}>
                AI
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '2px' }}>
                  Professional Assistant
                </h4>
                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                  {loading ? 'Evaluating...' : feedback ? 'Evaluation complete' : 'Waiting for response'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Chat timeline + Input Area or Feedback */}
          <div className="desktop-main">
            {/* Chat Timeline Viewport */}
            <div className="card" style={{ padding: '1.5rem', minHeight: '320px' }}>
              <div className="chat-thread" style={{ minHeight: '160px' }}>

                {/* History */}
                {qaPairs.map((pair, idx) => (
                  <React.Fragment key={idx}>
                    <div className="chat-bubble chat-bubble-ai">
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>
                        Question {idx + 1}
                      </div>
                      <div>{pair.question}</div>
                    </div>
                    <div className="chat-bubble chat-bubble-user">
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase', textAlign: 'right' }}>
                        Your Response (Score {pair.score}/10)
                      </div>
                      <div>{pair.answer}</div>
                    </div>
                  </React.Fragment>
                ))}

                {/* Current Question */}
                <div className="chat-bubble chat-bubble-ai">
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Active Question
                  </div>
                  <div style={{ fontWeight: '500', color: '#fff' }}>
                    {currentQuestion}
                  </div>
                </div>

                {/* Active User Answer Bubble */}
                {feedback && (
                  <div className="chat-bubble chat-bubble-user">
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase', textAlign: 'right' }}>
                      Your Response
                    </div>
                    <div>{answer}</div>
                  </div>
                )}

                {/* Typing Indicator */}
                {loading && !feedback && (
                  <div className="chat-bubble chat-bubble-ai" style={{ alignSelf: 'flex-start', padding: '0.5rem 0.85rem' }}>
                    <div className="typing-indicator">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Answer Inputs Area */}
            {!feedback && !loading && (
              <div className="card animate-fade" style={{ marginBottom: '0' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>
                  Your Answer
                </label>
                <textarea
                  rows={5}
                  placeholder="Type your answer here... Explain your experience and approach clearly."
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  style={{ marginBottom: '1.25rem', resize: 'vertical' }}
                />
                {error && <p className="error" style={{ marginBottom: '8px' }}>⚠️ {error}</p>}
                <button
                  className="btn btn-primary"
                  onClick={submitAnswer}
                  style={{ width: '100%' }}
                >
                  Submit Response
                </button>
              </div>
            )}

            {/* Dynamic Feedback Card */}
            {feedback && !loading && (
              <div className="animate-fade">
                <div className="card" style={{ borderTop: `3px solid ${getScoreColor(feedback.score)}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>
                      Assessment Feedback
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${getScoreBadge(feedback.score)}`}>
                        {feedback.score >= 8 ? 'Strong' : feedback.score >= 5 ? 'Average' : 'Needs work'}
                      </span>
                      <span style={{ fontSize: '20px', fontWeight: '800', color: getScoreColor(feedback.score) }}>
                        {feedback.score}<span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/10</span>
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    {feedback.feedback}
                  </p>

                  {/* Strengths & Improvements */}
                  <div style={{ display: 'flex', gap: '1rem', flexDirection: window.innerWidth < 600 ? 'column' : 'row' }}>
                    <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.03)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '0.85rem' }}>
                      <div style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--success)', marginBottom: '4px' }}>
                        ✓ STRENGTH
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {feedback.strength}
                      </div>
                    </div>

                    <div style={{ flex: 1, background: 'rgba(251, 191, 36, 0.03)', borderRadius: '8px', border: '1px solid rgba(251, 191, 36, 0.1)', padding: '0.85rem' }}>
                      <div style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--warning)', marginBottom: '4px' }}>
                        ↑ IMPROVEMENT
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {feedback.improvement}
                      </div>
                    </div>
                  </div>
                </div>

                {error && <p className="error" style={{ marginBottom: '8px' }}>⚠️ {error}</p>}

                <button
                  className="btn btn-primary"
                  onClick={nextQuestion}
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  {isLast ? 'See Final Results' : `Next Question (${currentIndex + 2}/${questions.length})`}
                </button>
              </div>
            )}
          </div>
        </div>

        {footer}

      </div>
    </div>
  );
}

export default Interview;