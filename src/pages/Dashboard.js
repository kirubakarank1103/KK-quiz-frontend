import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getQuizzes, deleteQuiz } from '../api';
import {
  FiBookOpen, FiPlus, FiTrendingUp, FiAward, FiClock,
  FiEdit2, FiTrash2, FiEye, FiPlay, FiChevronRight,
  FiUsers, FiStar, FiZap
} from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [myQuizzes, setMyQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const revealRefs = useRef([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  const addRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getQuizzes();
      const all = res.data.quizzes || res.data || [];
      setQuizzes(all);
      setMyQuizzes(all.filter((q) => q.createdBy?._id === user?._id || q.createdBy === user?._id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quiz? This cannot be undone.')) return;
    try {
      await deleteQuiz(id);
      setDeleteId(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const difficultyColor = (d) =>
    d === 'easy' ? 'badge-easy' : d === 'medium' ? 'badge-medium' : 'badge-hard';

  const stats = [
    {
      icon: <FiBookOpen size={24} />,
      label: 'Total Quizzes',
      value: quizzes.length,
      sub: 'Available to take',
      color: 'stat-emerald',
    },
    {
      icon: <FiStar size={24} />,
      label: 'My Quizzes',
      value: myQuizzes.length,
      sub: 'Created by you',
      color: 'stat-gold',
    },
    {
      icon: <FiTrendingUp size={24} />,
      label: 'Public Quizzes',
      value: quizzes.filter((q) => q.isPublic).length,
      sub: 'Shared with all',
      color: 'stat-blue',
    },
    {
      icon: <FiZap size={24} />,
      label: 'Categories',
      value: [...new Set(quizzes.map((q) => q.category))].length,
      sub: 'Subjects covered',
      color: 'stat-purple',
    },
  ];

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-wrapper">
          <div className="spinner"></div>
          <p className="spinner-text">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container dashboard-page">
      {/* ─── HERO HEADER ──────────────────────────── */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-bg" />
        <div className="container">
          <div className="dashboard-hero-content">
            <div className="dashboard-greeting">
              <div className="greeting-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="greeting-time">
                  {new Date().getHours() < 12
                    ? '🌅 Good Morning'
                    : new Date().getHours() < 17
                    ? '☀️ Good Afternoon'
                    : '🌙 Good Evening'}
                </p>
                <h1 className="greeting-name">{user?.name}!</h1>
                <p className="greeting-sub">Ready to learn something new today?</p>
              </div>
            </div>
            <div className="dashboard-hero-actions">
              <Link to="/quizzes/create" className="btn-primary dash-hero-btn">
                <FiPlus size={18} /> Create Quiz
              </Link>
              <Link to="/quizzes" className="btn-outline dash-hero-btn">
                <FiPlay size={18} /> Browse Quizzes
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container dashboard-body">
        {/* ─── STATS GRID ───────────────────────────── */}
        <section className="dash-section">
          <div className="dash-stats-grid">
            {stats.map((s, i) => (
              <div
                className={`dash-stat-card reveal ${s.color}`}
                style={{ transitionDelay: `${i * 0.08}s` }}
                key={i}
                ref={addRef}
              >
                <div className="dash-stat-icon">{s.icon}</div>
                <div className="dash-stat-info">
                  <p className="dash-stat-value">{s.value}</p>
                  <p className="dash-stat-label">{s.label}</p>
                  <p className="dash-stat-sub">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── QUICK ACTIONS ────────────────────────── */}
        <section className="dash-section reveal" ref={addRef}>
          <div className="dash-section-header">
            <h2 className="dash-section-title">Quick Actions</h2>
          </div>
          <div className="quick-actions-grid">
            {[
              {
                icon: <FiPlus size={28} />,
                label: 'Create New Quiz',
                desc: 'Build a custom quiz from scratch',
                to: '/quizzes/create',
                cls: 'qa-emerald',
              },
              {
                icon: <FiPlay size={28} />,
                label: 'Take a Quiz',
                desc: 'Browse and attempt quizzes',
                to: '/quizzes',
                cls: 'qa-gold',
              },
              {
                icon: <FiBookOpen size={28} />,
                label: 'My Quiz Library',
                desc: 'View all quizzes you created',
                to: '/quizzes',
                cls: 'qa-blue',
              },
              {
                icon: <FiAward size={28} />,
                label: 'Leaderboard',
                desc: 'See top performers',
                to: '/quizzes',
                cls: 'qa-purple',
              },
            ].map((a, i) => (
              <Link
                to={a.to}
                className={`quick-action-card reveal ${a.cls}`}
                style={{ transitionDelay: `${i * 0.08}s` }}
                key={i}
                ref={addRef}
              >
                <div className="qa-icon">{a.icon}</div>
                <div className="qa-info">
                  <p className="qa-label">{a.label}</p>
                  <p className="qa-desc">{a.desc}</p>
                </div>
                <FiChevronRight className="qa-arrow" size={20} />
              </Link>
            ))}
          </div>
        </section>

        {/* ─── MY QUIZZES ───────────────────────────── */}
        <section className="dash-section reveal" ref={addRef}>
          <div className="dash-section-header">
            <div>
              <h2 className="dash-section-title">My Quizzes</h2>
              <p className="dash-section-sub">Quizzes you've created</p>
            </div>
            <Link to="/quizzes/create" className="btn-primary dash-section-btn">
              <FiPlus size={16} /> New Quiz
            </Link>
          </div>

          {myQuizzes.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-icon">
                <FiBookOpen size={40} />
              </div>
              <h3>No quizzes yet</h3>
              <p>Create your first quiz and share your knowledge!</p>
              <Link to="/quizzes/create" className="btn-primary" style={{ marginTop: '16px' }}>
                <FiPlus /> Create Quiz
              </Link>
            </div>
          ) : (
            <div className="dash-quiz-list">
              {myQuizzes.slice(0, 6).map((quiz, i) => (
                <div
                  className="dash-quiz-card reveal"
                  style={{ transitionDelay: `${i * 0.06}s` }}
                  key={quiz._id}
                  ref={addRef}
                >
                  <div className="dqc-left">
                    <div className="dqc-category-dot" />
                    <div className="dqc-info">
                      <h3 className="dqc-title">{quiz.title}</h3>
                      <div className="dqc-meta">
                        <span className={`badge ${difficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                        <span className="dqc-meta-item">
                          <FiBookOpen size={13} /> {quiz.questions?.length || 0} Qs
                        </span>
                        <span className="dqc-meta-item">
                          <FiClock size={13} /> {quiz.timeLimit} min
                        </span>
                        <span className="dqc-meta-item">
                          <FiUsers size={13} /> {quiz.category}
                        </span>
                        {quiz.isPublic && (
                          <span className="badge badge-emerald">Public</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="dqc-actions">
                    <Link
                      to={`/quizzes/${quiz._id}`}
                      className="dqc-btn dqc-view"
                      title="View"
                    >
                      <FiEye size={16} />
                    </Link>
                    <Link
                      to={`/quizzes/${quiz._id}/take`}
                      className="dqc-btn dqc-play"
                      title="Take"
                    >
                      <FiPlay size={16} />
                    </Link>
                    <Link
                      to={`/quizzes/edit/${quiz._id}`}
                      className="dqc-btn dqc-edit"
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </Link>
                    <button
                      className="dqc-btn dqc-delete"
                      onClick={() => handleDelete(quiz._id)}
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ─── ALL RECENT QUIZZES ───────────────────── */}
        <section className="dash-section reveal" ref={addRef}>
          <div className="dash-section-header">
            <div>
              <h2 className="dash-section-title">Recently Added</h2>
              <p className="dash-section-sub">Latest quizzes available to take</p>
            </div>
            <Link to="/quizzes" className="btn-outline dash-section-btn">
              View All <FiChevronRight size={16} />
            </Link>
          </div>

          {quizzes.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-icon"><FiBookOpen size={40} /></div>
              <h3>No quizzes available</h3>
              <p>Be the first to create and share a quiz!</p>
            </div>
          ) : (
            <div className="dash-recent-grid">
              {quizzes.slice(0, 6).map((quiz, i) => (
                <div
                  className="dash-recent-card reveal"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                  key={quiz._id}
                  ref={addRef}
                >
                  <div className="drc-header">
                    <span className="drc-category">{quiz.category}</span>
                    <span className={`badge ${difficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <h3 className="drc-title">{quiz.title}</h3>
                  <p className="drc-desc">
                    {quiz.description?.substring(0, 80)}
                    {quiz.description?.length > 80 ? '...' : ''}
                  </p>
                  <div className="drc-stats">
                    <span><FiBookOpen size={13} /> {quiz.questions?.length || 0} Questions</span>
                    <span><FiClock size={13} /> {quiz.timeLimit} min</span>
                  </div>
                  <div className="drc-footer">
                    <div className="drc-author">
                      <div className="drc-author-avatar">
                        {quiz.createdBy?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span>{quiz.createdBy?.name || 'User'}</span>
                    </div>
                    <Link to={`/quizzes/${quiz._id}`} className="drc-btn">
                      View <FiChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
