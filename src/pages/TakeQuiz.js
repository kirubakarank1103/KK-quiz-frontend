import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, submitQuiz } from '../api';
import { FiClock, FiArrowRight, FiArrowLeft, FiSend, FiAlertCircle } from 'react-icons/fi';
import './TakeQuiz.css';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [answers, setAnswers]     = useState({});
  const [current, setCurrent]     = useState(0);
  const [timeLeft, setTimeLeft]   = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted]     = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => { fetchQuiz(); }, [id]);

  const fetchQuiz = async () => {
    try {
      const res = await getQuizById(id);
      setQuiz(res.data);
      setTimeLeft(res.data.timeLimit * 60);
    } catch {
      setError('Failed to load quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = useCallback(async (auto = false) => {
    if (submitting) return;
    try {
      setSubmitting(true);
      const answersArr = quiz.questions.map((_, i) =>
        answers[i] !== undefined ? answers[i] : -1
      );
      const res = await submitQuiz(id, answersArr);
      navigate(`/results/${id}`, {
        state: {
          score:    res.data.score,
          total:    res.data.total,
          answers:  answersArr,
          quiz:     quiz,
          auto:     auto,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Submit failed. Please try again.');
      setSubmitting(false);
    }
  }, [answers, quiz, id, navigate, submitting]);

  // Timer
  useEffect(() => {
    if (!started || !quiz) return;
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft, handleSubmit, quiz]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const timerClass = timeLeft <= 60 ? 'timer-danger' : timeLeft <= 300 ? 'timer-warn' : '';

  const answered  = Object.keys(answers).length;
  const progress  = quiz ? (answered / quiz.questions.length) * 100 : 0;

  if (loading) return <div className="page-container"><div className="loading-wrapper"><div className="spinner" /><p className="spinner-text">Loading quiz...</p></div></div>;
  if (error)   return <div className="page-container"><div className="empty-state"><div className="empty-state-icon">❌</div><h3>{error}</h3></div></div>;
  if (!quiz)   return null;

  // Start Screen
  if (!started) {
    return (
      <div className="page-container tq-start-page">
        <div className="tq-start-card">
          <div className="tq-start-icon">🎯</div>
          <h1 className="tq-start-title">{quiz.title}</h1>
          <p className="tq-start-desc">{quiz.description}</p>
          <div className="tq-start-info">
            <div className="tq-info-item">
              <span className="tq-info-val">{quiz.questions.length}</span>
              <span className="tq-info-lbl">Questions</span>
            </div>
            <div className="tq-info-divider" />
            <div className="tq-info-item">
              <span className="tq-info-val">{quiz.timeLimit}</span>
              <span className="tq-info-lbl">Minutes</span>
            </div>
            <div className="tq-info-divider" />
            <div className="tq-info-item">
              <span className="tq-info-val tq-diff" style={{ textTransform: 'capitalize' }}>{quiz.difficulty}</span>
              <span className="tq-info-lbl">Difficulty</span>
            </div>
          </div>
          <div className="tq-start-rules">
            <p><FiAlertCircle size={14} /> Read each question carefully before selecting.</p>
            <p><FiClock size={14} /> The timer starts when you click "Start Quiz".</p>
            <p><FiSend size={14} /> You can review and change answers before submitting.</p>
          </div>
          <button className="btn-primary tq-start-btn" onClick={() => setStarted(true)}>
            Start Quiz <FiArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const q = quiz.questions[current];

  return (
    <div className="page-container tq-page">
      {/* ─── TOP BAR ──────────────────────────── */}
      <div className="tq-topbar">
        <div className="container tq-topbar-inner">
          <div className="tq-quiz-name">{quiz.title}</div>
          <div className="tq-progress-wrap">
            <div className="tq-progress-bar">
              <div className="tq-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="tq-progress-text">{answered}/{quiz.questions.length}</span>
          </div>
          <div className={`tq-timer ${timerClass}`}>
            <FiClock size={16} /> {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="container tq-body">
        <div className="tq-grid">
          {/* ─── QUESTION PANEL ──────────────── */}
          <div className="tq-main">
            <div className="tq-question-card">
              <div className="tq-q-header">
                <span className="tq-q-num">Question {current + 1} of {quiz.questions.length}</span>
                <div className="tq-q-difficulty">
                  <span className={`badge badge-${quiz.difficulty === 'easy' ? 'easy' : quiz.difficulty === 'medium' ? 'medium' : 'hard'}`}>
                    {quiz.difficulty}
                  </span>
                </div>
              </div>

              <h2 className="tq-question-text">{q.questionText}</h2>

              <div className="tq-options">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    className={`tq-option ${answers[current] === oi ? 'selected' : ''}`}
                    onClick={() => setAnswers((prev) => ({ ...prev, [current]: oi }))}
                  >
                    <div className={`tq-opt-indicator ${answers[current] === oi ? 'active' : ''}`}>
                      {String.fromCharCode(65 + oi)}
                    </div>
                    <span className="tq-opt-text">{opt}</span>
                    {answers[current] === oi && <div className="tq-opt-check">✓</div>}
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="tq-nav">
                <button
                  className="btn-outline tq-nav-btn"
                  onClick={() => setCurrent((c) => c - 1)}
                  disabled={current === 0}
                >
                  <FiArrowLeft size={16} /> Previous
                </button>
                {current < quiz.questions.length - 1 ? (
                  <button
                    className="btn-primary tq-nav-btn"
                    onClick={() => setCurrent((c) => c + 1)}
                  >
                    Next <FiArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    className="btn-gold tq-nav-btn tq-submit-btn"
                    onClick={() => handleSubmit(false)}
                    disabled={submitting}
                  >
                    {submitting ? <><span className="btn-spinner" /> Submitting...</> : <><FiSend size={16} /> Submit Quiz</>}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ─── QUESTION GRID ────────────────── */}
          <div className="tq-sidebar">
            <div className="tq-q-grid-card">
              <h3 className="tq-q-grid-title">Question Navigator</h3>
              <div className="tq-q-grid">
                {quiz.questions.map((_, i) => (
                  <button
                    key={i}
                    className={`tq-q-dot ${
                      i === current ? 'current' :
                      answers[i] !== undefined ? 'answered' : ''
                    }`}
                    onClick={() => setCurrent(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="tq-q-legend">
                <span className="tq-legend-item"><span className="dot current" />Current</span>
                <span className="tq-legend-item"><span className="dot answered" />Answered</span>
                <span className="tq-legend-item"><span className="dot" />Pending</span>
              </div>
            </div>

            <button
              className="btn-primary tq-final-submit"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : `Submit (${answered}/${quiz.questions.length} answered)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
