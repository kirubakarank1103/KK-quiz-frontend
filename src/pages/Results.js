import React from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { FiRefreshCw, FiHome, FiBookOpen, FiCheckCircle, FiXCircle, FiAward } from 'react-icons/fi';
import './Results.css';

const Results = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const location  = useLocation();
  const state     = location.state;

  if (!state) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">❌</div>
          <h3>No results found</h3>
          <p>Take a quiz first to see your results.</p>
          <Link to="/quizzes" className="btn-primary" style={{ marginTop: '16px' }}>Browse Quizzes</Link>
        </div>
      </div>
    );
  }

  const { score, total, answers, quiz, auto } = state;
  const pct      = Math.round((score / total) * 100);
  const isPassed = pct >= 60;

  const grade = pct >= 90 ? { label: 'A+', color: '#2e7d32', bg: '#e8f5e9' }
              : pct >= 80 ? { label: 'A',  color: '#388e3c', bg: '#e8f5e9' }
              : pct >= 70 ? { label: 'B',  color: '#1976d2', bg: '#e3f2fd' }
              : pct >= 60 ? { label: 'C',  color: '#f57c00', bg: '#fff8e1' }
              :             { label: 'F',  color: '#c62828', bg: '#fce4ec' };

  const getMessage = () => {
    if (pct === 100) return { emoji: '🏆', text: 'Perfect Score! Outstanding!' };
    if (pct >= 90)   return { emoji: '🌟', text: 'Excellent Performance!' };
    if (pct >= 80)   return { emoji: '🎉', text: 'Great Job! Well done!' };
    if (pct >= 70)   return { emoji: '👍', text: 'Good work! Keep it up!' };
    if (pct >= 60)   return { emoji: '✅', text: 'You Passed! Keep practising.' };
    return { emoji: '📚', text: 'Keep Studying! You\'ll do better next time.' };
  };

  const msg = getMessage();

  return (
    <div className="page-container results-page">
      {/* ─── HERO ─────────────────────────────── */}
      <div className={`results-hero ${isPassed ? 'passed' : 'failed'}`}>
        <div className="results-hero-bg" />
        <div className="container results-hero-content">
          {auto && (
            <div className="alert alert-info results-auto-note">
              ⏱️ Time's up! Quiz was automatically submitted.
            </div>
          )}
          <div className="results-score-circle">
            <div className="rsc-inner">
              <span className="rsc-pct">{pct}%</span>
              <span className="rsc-label">Score</span>
            </div>
            <svg className="rsc-ring" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="white"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 1.5s ease' }}
              />
            </svg>
          </div>
          <div className="results-message">
            <p className="results-emoji">{msg.emoji}</p>
            <h1 className="results-title">{msg.text}</h1>
            <p className="results-subtitle">
              You scored {score} out of {total} questions correctly.
            </p>
          </div>
          <div className="results-stats-row">
            <div className="rs-stat">
              <span className="rs-val">{score}</span>
              <span className="rs-lbl">Correct</span>
            </div>
            <div className="rs-divider" />
            <div className="rs-stat">
              <span className="rs-val">{total - score}</span>
              <span className="rs-lbl">Incorrect</span>
            </div>
            <div className="rs-divider" />
            <div className="rs-stat">
              <span className="rs-val" style={{ background: grade.bg, color: grade.color, padding: '2px 10px', borderRadius: '8px' }}>
                {grade.label}
              </span>
              <span className="rs-lbl">Grade</span>
            </div>
            <div className="rs-divider" />
            <div className="rs-stat">
              <span className="rs-val">{isPassed ? '✅' : '❌'}</span>
              <span className="rs-lbl">{isPassed ? 'Passed' : 'Failed'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── BODY ─────────────────────────────── */}
      <div className="container results-body">
        {/* Action Buttons */}
        <div className="results-actions">
          <button className="btn-primary" onClick={() => navigate(`/quizzes/${id}/take`)}>
            <FiRefreshCw size={16} /> Retake Quiz
          </button>
          <Link to="/quizzes" className="btn-outline">
            <FiBookOpen size={16} /> Browse Quizzes
          </Link>
          <Link to="/dashboard" className="btn-ghost">
            <FiHome size={16} /> Dashboard
          </Link>
        </div>

        {/* Answer Review */}
        {quiz && (
          <div className="results-review">
            <h2 className="results-review-title">
              <FiAward size={22} /> Answer Review
            </h2>
            <div className="results-q-list">
              {quiz.questions.map((q, i) => {
                const userAns = answers?.[i];
                const isCorrect = userAns === q.correctAnswer;
                const isSkipped = userAns === undefined || userAns === -1;
                return (
                  <div key={i} className={`rq-item ${isCorrect ? 'correct' : isSkipped ? 'skipped' : 'incorrect'}`}>
                    <div className="rq-header">
                      <div className="rq-status">
                        {isCorrect  ? <FiCheckCircle size={20} className="rq-icon correct" />  :
                         isSkipped  ? <span className="rq-skip-icon">—</span> :
                                      <FiXCircle size={20} className="rq-icon incorrect" />}
                      </div>
                      <div className="rq-q-num">Q{i + 1}</div>
                      <p className="rq-q-text">{q.questionText}</p>
                    </div>
                    <div className="rq-answers">
                      {q.options.map((opt, oi) => {
                        const isUserChoice  = oi === userAns;
                        const isRightAnswer = oi === q.correctAnswer;
                        return (
                          <div
                            key={oi}
                            className={`rq-option ${isRightAnswer ? 'right-answer' : ''} ${isUserChoice && !isRightAnswer ? 'wrong-choice' : ''}`}
                          >
                            <span className="rq-opt-letter">{String.fromCharCode(65 + oi)}</span>
                            <span className="rq-opt-text">{opt}</span>
                            {isRightAnswer && <span className="rq-opt-tag correct-tag">✓ Correct</span>}
                            {isUserChoice && !isRightAnswer && <span className="rq-opt-tag wrong-tag">✗ Your Answer</span>}
                          </div>
                        );
                      })}
                    </div>
                    {isSkipped && <p className="rq-skipped-note">⚠️ This question was not answered.</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;