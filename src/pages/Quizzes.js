import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getQuizzes, deleteQuiz } from '../api';
import {
  FiSearch, FiFilter, FiPlus, FiBookOpen, FiClock,
  FiPlay, FiEye, FiEdit2, FiTrash2, FiChevronRight,
  FiX, FiGrid, FiList
} from 'react-icons/fi';
import './Quizzes.css';

const CATEGORIES = ['All', 'Mathematics', 'Science', 'History', 'Literature', 'Geography', 'Technology', 'Language', 'General'];
const DIFFICULTIES = ['All', 'easy', 'medium', 'hard'];

const Quizzes = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes]       = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [view, setView]             = useState('grid'); // grid | list
  const [showFilters, setShowFilters] = useState(false);
  const revealRefs = useRef([]);

  useEffect(() => { fetchQuizzes(); }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [filtered]);

  const addRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  useEffect(() => {
    let res = [...quizzes];
    if (search.trim())
      res = res.filter(
        (q) =>
          q.title.toLowerCase().includes(search.toLowerCase()) ||
          q.description?.toLowerCase().includes(search.toLowerCase()) ||
          q.category?.toLowerCase().includes(search.toLowerCase())
      );
    if (category !== 'All')  res = res.filter((q) => q.category === category);
    if (difficulty !== 'All') res = res.filter((q) => q.difficulty === difficulty);
    setFiltered(res);
  }, [search, category, difficulty, quizzes]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await getQuizzes();
      const data = res.data.quizzes || res.data || [];
      setQuizzes(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await deleteQuiz(id);
      fetchQuizzes();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setDifficulty('All');
  };

  const hasFilters = search || category !== 'All' || difficulty !== 'All';
  const diffClass = (d) => d === 'easy' ? 'badge-easy' : d === 'medium' ? 'badge-medium' : 'badge-hard';
  const isOwner = (quiz) => quiz.createdBy?._id === user?._id || quiz.createdBy === user?._id;

  const CATEGORY_IMAGES = {
    Mathematics: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80',
    Science:     'https://images.unsplash.com/photo-1532094349884-543559244a74?w=400&q=80',
    History:     'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80',
    Literature:  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
    Geography:   'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80',
    Technology:  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    Language:    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80',
    General:     'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
  };

  const getCategoryImage = (cat) =>
    CATEGORY_IMAGES[cat] || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80';

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-wrapper">
          <div className="spinner" />
          <p className="spinner-text">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container quizzes-page">
      {/* ─── PAGE HEADER ────────────────────────── */}
      <div className="quizzes-header">
        <div className="quizzes-header-bg" />
        <div className="container">
          <div className="quizzes-header-content">
            <div>
              <h1 className="quizzes-title">Quiz Library</h1>
              <p className="quizzes-subtitle">
                Explore {quizzes.length} quizzes across all subjects
              </p>
            </div>
            <Link to="/quizzes/create" className="btn-primary qh-create-btn">
              <FiPlus size={18} /> Create Quiz
            </Link>
          </div>
        </div>
      </div>

      <div className="container quizzes-body">
        {/* ─── SEARCH + FILTER BAR ──────────────── */}
        <div className="filter-bar reveal" ref={addRef}>
          <div className="search-wrap">
            <FiSearch className="search-icon" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quizzes by title, subject..."
              className="search-input"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>
                <FiX size={16} />
              </button>
            )}
          </div>

          <div className="filter-controls">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="filter-select"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="filter-select"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d === 'All' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}</option>
              ))}
            </select>

            {hasFilters && (
              <button className="clear-filters-btn" onClick={clearFilters}>
                <FiX size={14} /> Clear
              </button>
            )}

            <div className="view-toggle">
              <button
                className={`view-btn ${view === 'grid' ? 'active' : ''}`}
                onClick={() => setView('grid')}
              >
                <FiGrid size={16} />
              </button>
              <button
                className={`view-btn ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
              >
                <FiList size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ─── RESULTS COUNT ────────────────────── */}
        <div className="results-info reveal" ref={addRef}>
          <span className="results-count">
            {filtered.length} quiz{filtered.length !== 1 ? 'zes' : ''} found
          </span>
          {hasFilters && (
            <div className="active-filters">
              {category !== 'All' && (
                <span className="filter-tag">
                  {category}
                  <button onClick={() => setCategory('All')}><FiX size={12} /></button>
                </span>
              )}
              {difficulty !== 'All' && (
                <span className="filter-tag">
                  {difficulty}
                  <button onClick={() => setDifficulty('All')}><FiX size={12} /></button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ─── QUIZ GRID ────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No quizzes found</h3>
            <p>Try adjusting your search or filters.</p>
            {hasFilters && (
              <button className="btn-outline" onClick={clearFilters} style={{ marginTop: '16px' }}>
                Clear Filters
              </button>
            )}
          </div>
        ) : view === 'grid' ? (
          <div className="quizzes-grid">
            {filtered.map((quiz, i) => (
              <div
                className="quiz-card reveal"
                style={{ transitionDelay: `${(i % 6) * 0.07}s` }}
                key={quiz._id}
                ref={addRef}
              >
                {/* Card Image */}
                <div className="qc-img-wrap">
                  <img
                    src={getCategoryImage(quiz.category)}
                    alt={quiz.category}
                    className="qc-img"
                  />
                  <div className="qc-img-overlay" />
                  <div className="qc-img-top">
                    <span className="qc-category">{quiz.category}</span>
                    {quiz.isPublic && <span className="qc-public-badge">Public</span>}
                  </div>
                  <div className="qc-img-bottom">
                    <span className={`badge ${diffClass(quiz.difficulty)}`}>{quiz.difficulty}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="qc-body">
                  <h3 className="qc-title">{quiz.title}</h3>
                  <p className="qc-desc">
                    {quiz.description?.substring(0, 90)}{quiz.description?.length > 90 ? '...' : ''}
                  </p>

                  <div className="qc-meta">
                    <span className="qc-meta-item">
                      <FiBookOpen size={13} /> {quiz.questions?.length || 0} Questions
                    </span>
                    <span className="qc-meta-item">
                      <FiClock size={13} /> {quiz.timeLimit} min
                    </span>
                  </div>

                  <div className="qc-footer">
                    <div className="qc-author">
                      <div className="qc-avatar">
                        {quiz.createdBy?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="qc-author-name">{quiz.createdBy?.name || 'User'}</span>
                    </div>

                    <div className="qc-actions">
                      <Link to={`/quizzes/${quiz._id}`} className="qc-action-btn qc-view" title="View">
                        <FiEye size={15} />
                      </Link>
                      <Link to={`/quizzes/${quiz._id}/take`} className="qc-action-btn qc-play" title="Take Quiz">
                        <FiPlay size={15} />
                      </Link>
                      {isOwner(quiz) && (
                        <>
                          <Link to={`/quizzes/edit/${quiz._id}`} className="qc-action-btn qc-edit" title="Edit">
                            <FiEdit2 size={15} />
                          </Link>
                          <button
                            className="qc-action-btn qc-delete"
                            onClick={(e) => handleDelete(quiz._id, e)}
                            title="Delete"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="quizzes-list">
            {filtered.map((quiz, i) => (
              <div
                className="quiz-list-item reveal"
                style={{ transitionDelay: `${(i % 8) * 0.05}s` }}
                key={quiz._id}
                ref={addRef}
              >
                <div className="qli-img">
                  <img src={getCategoryImage(quiz.category)} alt={quiz.category} />
                </div>
                <div className="qli-info">
                  <div className="qli-top">
                    <span className="qc-category">{quiz.category}</span>
                    <span className={`badge ${diffClass(quiz.difficulty)}`}>{quiz.difficulty}</span>
                    {quiz.isPublic && <span className="badge badge-emerald">Public</span>}
                  </div>
                  <h3 className="qli-title">{quiz.title}</h3>
                  <p className="qli-desc">
                    {quiz.description?.substring(0, 120)}{quiz.description?.length > 120 ? '...' : ''}
                  </p>
                  <div className="qli-meta">
                    <span><FiBookOpen size={13} /> {quiz.questions?.length || 0} Questions</span>
                    <span><FiClock size={13} /> {quiz.timeLimit} min</span>
                    <span>By {quiz.createdBy?.name || 'User'}</span>
                  </div>
                </div>
                <div className="qli-actions">
                  <Link to={`/quizzes/${quiz._id}/take`} className="btn-primary qli-take-btn">
                    <FiPlay size={15} /> Take Quiz
                  </Link>
                  <Link to={`/quizzes/${quiz._id}`} className="btn-outline qli-view-btn">
                    <FiEye size={15} /> View
                  </Link>
                  {isOwner(quiz) && (
                    <div className="qli-owner-actions">
                      <Link to={`/quizzes/edit/${quiz._id}`} className="qc-action-btn qc-edit">
                        <FiEdit2 size={15} />
                      </Link>
                      <button
                        className="qc-action-btn qc-delete"
                        onClick={(e) => handleDelete(quiz._id, e)}
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
