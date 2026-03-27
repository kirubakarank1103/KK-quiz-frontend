import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createQuiz, updateQuiz, getQuizById } from '../api';
import {
  FiPlus, FiTrash2, FiSave, FiArrowLeft,
  FiCheckCircle, FiBook, FiClock, FiGrid, FiToggleRight
} from 'react-icons/fi';
import './QuizForm.css';

const CATEGORIES = ['Mathematics','Science','History','Literature','Geography','Technology','Language','General'];
const EMPTY_OPTION = () => ['', '', '', ''];
const EMPTY_QUESTION = () => ({
  questionText: '',
  options: EMPTY_OPTION(),
  correctAnswer: 0,
});

const QuizForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'General',
    difficulty: 'easy',
    timeLimit: 10,
    isPublic: true,
  });
  const [questions, setQuestions] = useState([EMPTY_QUESTION()]);
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(isEdit);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [activeQ, setActiveQ]     = useState(0);

  useEffect(() => {
    if (isEdit) loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    try {
      setFetching(true);
      const res = await getQuizById(id);
      const q = res.data;
      setForm({
        title:      q.title,
        description: q.description,
        category:   q.category,
        difficulty:  q.difficulty,
        timeLimit:   q.timeLimit,
        isPublic:    q.isPublic,
      });
      setQuestions(
        q.questions.length > 0
          ? q.questions.map((qu) => ({
              questionText: qu.questionText,
              options: qu.options.length === 4 ? qu.options : [...qu.options, ...EMPTY_OPTION()].slice(0, 4),
              correctAnswer: qu.correctAnswer,
            }))
          : [EMPTY_QUESTION()]
      );
    } catch (err) {
      setError('Failed to load quiz.');
    } finally {
      setFetching(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const handleQuestionChange = (qi, field, val) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qi] = { ...updated[qi], [field]: val };
      return updated;
    });
  };

  const handleOptionChange = (qi, oi, val) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const opts = [...updated[qi].options];
      opts[oi] = val;
      updated[qi] = { ...updated[qi], options: opts };
      return updated;
    });
  };

  const handleCorrectAnswer = (qi, oi) => {
    handleQuestionChange(qi, 'correctAnswer', oi);
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, EMPTY_QUESTION()]);
    setActiveQ(questions.length);
  };

  const removeQuestion = (qi) => {
    if (questions.length === 1) {
      setError('At least one question is required.');
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== qi));
    setActiveQ(Math.max(0, qi - 1));
  };

  const validate = () => {
    if (!form.title.trim()) return 'Quiz title is required.';
    if (!form.description.trim()) return 'Description is required.';
    if (questions.length === 0) return 'Add at least one question.';
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) return `Question ${i + 1}: Question text is required.`;
      if (q.options.some((o) => !o.trim())) return `Question ${i + 1}: All 4 options must be filled.`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    try {
      setLoading(true);
      setError('');
      const payload = { ...form, timeLimit: Number(form.timeLimit), questions };
      if (isEdit) {
        await updateQuiz(id, payload);
        setSuccess('Quiz updated successfully!');
      } else {
        await createQuiz(payload);
        setSuccess('Quiz created successfully!');
      }
      setTimeout(() => navigate('/quizzes'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="page-container">
        <div className="loading-wrapper">
          <div className="spinner" />
          <p className="spinner-text">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container quiz-form-page">
      {/* ─── HEADER ───────────────────────────────── */}
      <div className="qf-header">
        <div className="container">
          <button className="qf-back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft size={18} /> Back
          </button>
          <div className="qf-header-content">
            <div>
              <h1 className="qf-title">{isEdit ? 'Edit Quiz' : 'Create New Quiz'}</h1>
              <p className="qf-subtitle">
                {isEdit ? 'Update your quiz details and questions.' : 'Build a quiz to share with students.'}
              </p>
            </div>
            <button
              className="btn-primary qf-save-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <><span className="btn-spinner" /> Saving...</> : <><FiSave size={16} /> {isEdit ? 'Update Quiz' : 'Publish Quiz'}</>}
            </button>
          </div>
        </div>
      </div>

      <div className="container qf-body">
        {error   && <div className="alert alert-error"><span>⚠️</span> {error}</div>}
        {success && <div className="alert alert-success"><FiCheckCircle /> {success}</div>}

        <div className="qf-grid">
          {/* ─── LEFT: QUIZ DETAILS ─────────────────── */}
          <div className="qf-details-panel">
            <div className="qf-panel">
              <div className="qf-panel-header">
                <FiBook size={18} />
                <h2>Quiz Details</h2>
              </div>

              <div className="form-group">
                <label>Quiz Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Grade 10 Mathematics — Algebra"
                  className="form-input"
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Describe what this quiz covers..."
                  className="form-input qf-textarea"
                  rows={3}
                />
              </div>

              <div className="qf-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={handleFormChange} className="form-select">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select name="difficulty" value={form.difficulty} onChange={handleFormChange} className="form-select">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="qf-row">
                <div className="form-group">
                  <label>Time Limit (minutes)</label>
                  <div className="input-icon-wrap">
                    <FiClock className="input-icon" size={16} />
                    <input
                      type="number"
                      name="timeLimit"
                      value={form.timeLimit}
                      onChange={handleFormChange}
                      min={1} max={180}
                      className="form-input with-icon"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Visibility</label>
                  <div className="qf-toggle-wrap">
                    <label className="qf-toggle">
                      <input
                        type="checkbox"
                        name="isPublic"
                        checked={form.isPublic}
                        onChange={handleFormChange}
                      />
                      <span className="qf-toggle-slider" />
                    </label>
                    <span className="qf-toggle-label">
                      {form.isPublic ? '🌐 Public' : '🔒 Private'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Navigator */}
            <div className="qf-panel qf-question-nav">
              <div className="qf-panel-header">
                <FiGrid size={18} />
                <h2>Questions ({questions.length})</h2>
              </div>
              <div className="qf-nav-grid">
                {questions.map((q, i) => (
                  <button
                    key={i}
                    className={`qf-nav-btn ${activeQ === i ? 'active' : ''} ${q.questionText.trim() ? 'filled' : ''}`}
                    onClick={() => setActiveQ(i)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button className="qf-nav-btn qf-nav-add" onClick={addQuestion}>
                  <FiPlus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: QUESTIONS ───────────────────── */}
          <div className="qf-questions-panel">
            {questions.map((q, qi) => (
              <div
                key={qi}
                className={`qf-question-card ${activeQ === qi ? 'active' : 'collapsed'}`}
                onClick={() => setActiveQ(qi)}
              >
                <div className="qf-qcard-header">
                  <div className="qf-qcard-num">
                    <span>Q{qi + 1}</span>
                  </div>
                  <p className="qf-qcard-preview">
                    {q.questionText || 'Click to edit this question...'}
                  </p>
                  <button
                    className="qf-remove-btn"
                    onClick={(e) => { e.stopPropagation(); removeQuestion(qi); }}
                    title="Remove Question"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>

                {activeQ === qi && (
                  <div className="qf-qcard-body" onClick={(e) => e.stopPropagation()}>
                    <div className="form-group">
                      <label>Question Text *</label>
                      <textarea
                        value={q.questionText}
                        onChange={(e) => handleQuestionChange(qi, 'questionText', e.target.value)}
                        placeholder="Enter the question..."
                        className="form-input qf-textarea"
                        rows={2}
                      />
                    </div>

                    <div className="qf-options-label">
                      Answer Options <span className="qf-options-hint">(click the radio to mark correct)</span>
                    </div>
                    <div className="qf-options-grid">
                      {q.options.map((opt, oi) => (
                        <div
                          key={oi}
                          className={`qf-option ${q.correctAnswer === oi ? 'correct' : ''}`}
                        >
                          <button
                            type="button"
                            className={`qf-option-radio ${q.correctAnswer === oi ? 'selected' : ''}`}
                            onClick={() => handleCorrectAnswer(qi, oi)}
                            title="Mark as correct"
                          >
                            {q.correctAnswer === oi ? <FiCheckCircle size={18} /> : <span className="qf-radio-dot" />}
                          </button>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleOptionChange(qi, oi, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                            className="qf-option-input"
                          />
                          <span className="qf-option-letter">{String.fromCharCode(65 + oi)}</span>
                        </div>
                      ))}
                    </div>
                    <p className="qf-correct-note">
                      ✅ Correct Answer: Option {String.fromCharCode(65 + q.correctAnswer)}
                      {q.options[q.correctAnswer] ? ` — "${q.options[q.correctAnswer]}"` : ''}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Add Question Button */}
            <button className="qf-add-question-btn" onClick={addQuestion}>
              <FiPlus size={20} /> Add Question
            </button>
          </div>
        </div>

        {/* Bottom Submit */}
        <div className="qf-bottom-bar">
          <p className="qf-bottom-info">
            <FiCheckCircle size={15} /> {questions.length} question{questions.length !== 1 ? 's' : ''} • {form.timeLimit} min • {form.difficulty}
          </p>
          <button
            className="btn-primary qf-submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <><span className="btn-spinner" /> Saving...</> : <><FiSave size={16} /> {isEdit ? 'Update Quiz' : 'Publish Quiz'}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizForm;
