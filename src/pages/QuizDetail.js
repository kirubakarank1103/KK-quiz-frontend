import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getQuizById, deleteQuiz } from '../api';
import {
  FiPlay, FiEdit2, FiTrash2, FiArrowLeft,
  FiClock, FiBookOpen, FiUser, FiCalendar,
  FiGlobe, FiLock, FiChevronDown, FiChevronUp, FiAward
} from 'react-icons/fi';
import './QuizDetail.css';

const CATEGORY_IMAGES = {
  Mathematics: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
  Science:     'https://images.unsplash.com/photo-1532094349884-543559244a74?w=800&q=80',
  History:     'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&q=80',
  Literature:  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
  Geography:   'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80',
  Technology:  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  Language:    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
  General:     'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
};

const QuizDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [expandedQ, setExpandedQ] = useState(null);

  useEffect(() => { fetchQuiz(); }, [id]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await getQuizById(id);
      setQuiz(res.data);
    } catch (err) {
      setError('Failed to load quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this quiz permanently?')) return;
    try {
      await deleteQuiz(id);
      navigate('/quizzes');
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const isOwner = quiz?.createdBy?._id === user?._id || quiz?.createdBy === user?._id;
  const diffClass = (d) => d === 'easy' ? 'badge-easy' : d === 'medium' ? 'badge-medium' : 'badge-hard';
  const coverImg = CATEGORY_IMAGES[quiz?.category] || CATEGORY_IMAGES.General;

  if (loading) return <div className="page-container"><div className="loading-wrapper"><div className="spinner" /><p className="spinner-text">Loading quiz...</p></div></div>;
  if (error)   return <div className="page-container"><div className="empty-state"><div className="empty-state-icon">❌</div><h3>{error}</h3><Link to="/quizzes" className="btn-outline">Back to Quizzes</Link></div></div>;
  if (!quiz)   return null;

  return (
    <div className="page-container quiz-detail-page">
      {/* ─── HERO ───────────────────────────────── */}
      <div className="qd-hero">
        <img src={coverImg} alt={quiz.category} className="qd-hero-img" />
        <div className="qd-hero-overlay" />
        <div className="container qd-hero-content">
          <button className="qd-back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft size={16} /> Back
          </button>
          <div className="qd-hero-body">
            <div className="qd-badges">
              <span className={`badge ${diffClass(quiz.difficulty)}`}>{quiz.difficulty}</span>
              <span className="badge badge-emerald">{quiz.category}</span>
              {quiz.isPublic
                ? <span className="qd-vis-badge public"><FiGlobe size={12} /> Public</span>
                : <span className="qd-vis-badge private"><FiLock size={12} /> Private</span>}
            </div>
            <h1 className="qd-title">{quiz.title}</h1>
            <p className="qd-desc">{quiz.description}</p>
            <div className="qd-meta-row">
              <span className="qd-meta-item"><FiBookOpen size={15} /> {quiz.questions?.length} Questions</span>
              <span className="qd-meta-item"><FiClock size={15} /> {quiz.timeLimit} Minutes</span>
              <span className="qd-meta-item"><FiUser size={15} /> {quiz.createdBy?.name || 'User'}</span>
              <span className="qd-meta-item">
                <FiCalendar size={15} /> {new Date(quiz.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
              </span>
            </div>
          </div>
          <div className="qd-hero-actions">
            <Link to={`/quizzes/${id}/take`} className="btn-primary qd-take-btn">
              <FiPlay size={18} /> Start Quiz
            </Link>
            {isOwner && (
              <>
                <Link to={`/quizzes/edit/${id}`} className="btn-outline qd-action-btn qd-edit-btn">
                  <FiEdit2 size={16} /> Edit
                </Link>
                <button className="btn-danger qd-action-btn" onClick={handleDelete}>
                  <FiTrash2 size={16} /> Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container qd-body">
        <div className="qd-grid">
          {/* ─── QUESTIONS PREVIEW ───────────────── */}
          <div className="qd-main">
            <div className="qd-section-card">
              <h2 className="qd-section-title">
                <FiBookOpen size={20} /> Questions Preview
              </h2>
              <div className="qd-questions">
                {quiz.questions.map((q, i) => (
                  <div key={i} className="qd-question-item">
                    <div
                      className="qd-q-header"
                      onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                    >
                      <div className="qd-q-num">{i + 1}</div>
                      <p className="qd-q-text">{q.questionText}</p>
                      <button className="qd-q-toggle">
                        {expandedQ === i ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                      </button>
                    </div>
                    {expandedQ === i && (
                      <div className="qd-options">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className={`qd-option ${oi === q.correctAnswer ? 'correct' : ''}`}>
                            <span className="qd-opt-letter">{String.fromCharCode(65 + oi)}</span>
                            <span className="qd-opt-text">{opt}</span>
                            {oi === q.correctAnswer && <span className="qd-opt-correct-mark">✓ Correct</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── SIDEBAR ────────────────────────── */}
          <div className="qd-sidebar">
            <div className="qd-info-card">
              <h3 className="qd-info-title">Quiz Overview</h3>
              <div className="qd-info-list">
                {[
                  { icon: <FiBookOpen />, label: 'Questions', val: quiz.questions?.length },
                  { icon: <FiClock />,    label: 'Time Limit', val: `${quiz.timeLimit} min` },
                  { icon: <FiAward />,    label: 'Difficulty', val: quiz.difficulty },
                  { icon: <FiGrid />,     label: 'Category',   val: quiz.category },
                  { icon: <FiUser />,     label: 'Created By', val: quiz.createdBy?.name || 'User' },
                ].map((item, i) => (
                  <div className="qd-info-item" key={i}>
                    <div className="qd-info-icon">{item.icon}</div>
                    <div>
                      <p className="qd-info-label">{item.label}</p>
                      <p className="qd-info-val">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="qd-cta-card">
              <div className="qd-cta-icon"><FiPlay size={32} /></div>
              <h3>Ready to Start?</h3>
              <p>Test your knowledge on this topic.</p>
              <Link to={`/quizzes/${id}/take`} className="btn-primary qd-cta-btn">
                <FiPlay size={16} /> Start Quiz Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Missing import fix
const FiGrid = ({ size }) => (
  <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
);

export default QuizDetail;
