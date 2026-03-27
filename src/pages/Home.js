import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiStar, FiUsers, FiBookOpen, FiAward, FiZap, FiShield, FiTrendingUp } from 'react-icons/fi';
import './Home.css';

const STATS = [
  { number: '50K+', label: 'Students Learning', icon: <FiUsers /> },
  { number: '1,200+', label: 'Quizzes Available', icon: <FiBookOpen /> },
  { number: '98%', label: 'Satisfaction Rate', icon: <FiStar /> },
  { number: '200+', label: 'Subjects Covered', icon: <FiAward /> },
];

const FEATURES = [
  {
    icon: <FiZap size={28} />,
    title: 'Instant Feedback',
    desc: 'Get real-time scoring and detailed explanations after every quiz attempt.',
  },
  {
    icon: <FiShield size={28} />,
    title: 'Trusted & Secure',
    desc: 'Your progress and data are protected with enterprise-grade security.',
  },
  {
    icon: <FiTrendingUp size={28} />,
    title: 'Track Progress',
    desc: 'Visual dashboards show your improvement over time across all subjects.',
  },
  {
    icon: <FiBookOpen size={28} />,
    title: 'Rich Content',
    desc: 'Thousands of questions across Mathematics, Science, Language, History and more.',
  },
  {
    icon: <FiUsers size={28} />,
    title: 'Community Learning',
    desc: 'Share quizzes with classmates and learn together in groups.',
  },
  {
    icon: <FiAward size={28} />,
    title: 'Earn Badges',
    desc: 'Unlock achievements and badges as you master new topics and levels.',
  },
];

const CATEGORIES = [
  {
    name: 'Mathematics',
    count: '320+ quizzes',
    img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80',
    color: '#1a6b4a',
  },
  {
    name: 'Science',
    count: '280+ quizzes',
    img: 'https://images.unsplash.com/photo-1532094349884-543559244a74?w=400&q=80',
    color: '#0f4a33',
  },
  {
    name: 'History',
    count: '190+ quizzes',
    img: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80',
    color: '#a07830',
  },
  {
    name: 'Literature',
    count: '150+ quizzes',
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
    color: '#2d6a9e',
  },
  {
    name: 'Geography',
    count: '120+ quizzes',
    img: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80',
    color: '#6a3d9a',
  },
  {
    name: 'Technology',
    count: '250+ quizzes',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    color: '#1a5276',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Class 10 Student',
    avatar: 'P',
    rating: 5,
    text: 'QuizMaster Pro helped me score 95% in my board exams. The practice tests are exactly like the real thing!',
  },
  {
    name: 'Rahul Verma',
    role: 'Engineering Student',
    avatar: 'R',
    rating: 5,
    text: 'I use it daily to revise concepts. The difficulty levels make it perfect for progressive learning.',
  },
  {
    name: 'Anjali Patel',
    role: 'Teacher, DPS School',
    avatar: 'A',
    rating: 5,
    text: 'Creating quizzes for my students is so easy. The platform saves me hours every week!',
  },
];

const Home = () => {
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

  return (
    <div className="home">
      {/* ─── HERO ─────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg-pattern" />
        <div className="hero-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-left">
            <div className="hero-badge">
              <FiStar size={14} /> Trusted by 50,000+ Students
            </div>
            <h1 className="hero-title">
              Master Any Subject<br />
              <span className="hero-title-green">Ace Every Exam</span>
            </h1>
            <p className="hero-desc">
              India's most trusted quiz platform for students. Create, practise, and excel with
              thousands of expert-crafted quizzes across every subject and difficulty level.
            </p>
            <div className="hero-cta">
              <Link to="/signup" className="btn-primary hero-btn-main">
                Start Learning Free <FiArrowRight />
              </Link>
              <Link to="/login" className="btn-outline">
                Sign In
              </Link>
            </div>
            <div className="hero-checks">
              {['No credit card required', 'Free forever plan', '1,200+ quizzes included'].map((t) => (
                <span key={t} className="hero-check">
                  <FiCheckCircle size={16} /> {t}
                </span>
              ))}
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80"
                alt="Students studying"
                className="hero-img"
              />
              <div className="hero-img-card card-float-1">
                <FiAward size={20} className="card-icon" />
                <div>
                  <p className="card-val">98%</p>
                  <p className="card-lbl">Pass Rate</p>
                </div>
              </div>
              <div className="hero-img-card card-float-2">
                <FiUsers size={20} className="card-icon" />
                <div>
                  <p className="card-val">50K+</p>
                  <p className="card-lbl">Learners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────── */}
      <section className="stats-section" ref={addRef}>
        <div className="container">
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div className="stat-card reveal" style={{ animationDelay: `${i * 0.1}s` }} key={i} ref={addRef}>
                <div className="stat-icon">{s.icon}</div>
                <p className="stat-number">{s.number}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────── */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge reveal" ref={addRef}>Why Students Love Us</div>
            <h2 className="section-title reveal" ref={addRef}>
              Everything You Need to <span className="text-emerald">Excel</span>
            </h2>
            <p className="section-subtitle reveal" ref={addRef}>
              Designed specifically for Indian students with curriculum-aligned content.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div className="feature-card reveal" style={{ transitionDelay: `${i * 0.08}s` }} key={i} ref={addRef}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ───────────────────────────── */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge reveal" ref={addRef}>Browse Topics</div>
            <h2 className="section-title reveal" ref={addRef}>
              Explore <span className="text-emerald">Popular Categories</span>
            </h2>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((c, i) => (
              <Link to="/signup" className="category-card reveal" style={{ transitionDelay: `${i * 0.08}s` }} key={i} ref={addRef}>
                <div className="category-img-wrap">
                  <img src={c.img} alt={c.name} className="category-img" />
                  <div className="category-overlay" style={{ background: `${c.color}cc` }} />
                </div>
                <div className="category-info">
                  <h3 className="category-name">{c.name}</h3>
                  <p className="category-count">{c.count}</p>
                </div>
                <div className="category-arrow"><FiArrowRight /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────── */}
      <section className="section how-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge reveal" ref={addRef}>Simple Process</div>
            <h2 className="section-title reveal" ref={addRef}>
              How It <span className="text-emerald">Works</span>
            </h2>
          </div>
          <div className="steps-grid">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up in 30 seconds. No credit card needed.', icon: <FiUsers /> },
              { step: '02', title: 'Choose a Quiz', desc: 'Browse quizzes by subject, class, or difficulty.', icon: <FiBookOpen /> },
              { step: '03', title: 'Take the Quiz', desc: 'Answer timed questions with instant feedback.', icon: <FiZap /> },
              { step: '04', title: 'Track Progress', desc: 'Review scores and improve with each attempt.', icon: <FiTrendingUp /> },
            ].map((s, i) => (
              <div className="step-card reveal" style={{ transitionDelay: `${i * 0.1}s` }} key={i} ref={addRef}>
                <div className="step-number">{s.step}</div>
                <div className="step-icon">{s.icon}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────── */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge reveal" ref={addRef}>Student Stories</div>
            <h2 className="section-title reveal" ref={addRef}>
              What Our <span className="text-emerald">Learners Say</span>
            </h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial-card reveal" style={{ transitionDelay: `${i * 0.1}s` }} key={i} ref={addRef}>
                <div className="test-stars">
                  {Array.from({ length: t.rating }).map((_, j) => <FiStar key={j} fill="var(--gold)" stroke="var(--gold)" size={16} />)}
                </div>
                <p className="test-text">"{t.text}"</p>
                <div className="test-author">
                  <div className="test-avatar">{t.avatar}</div>
                  <div>
                    <p className="test-name">{t.name}</p>
                    <p className="test-role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ───────────────────────────── */}
      <section className="cta-section reveal" ref={addRef}>
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Start Your Learning Journey?</h2>
              <p className="cta-subtitle">Join 50,000+ students already learning with QuizMaster Pro.</p>
              <div className="cta-btns">
                <Link to="/signup" className="btn-gold cta-btn">
                  Create Free Account <FiArrowRight />
                </Link>
                <Link to="/login" className="cta-link">Already have an account? Sign in →</Link>
              </div>
            </div>
            <div className="cta-img">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80" alt="Students" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>QuizMaster Pro</span>
              </div>
              <p className="footer-tagline">India's trusted quiz platform for every student.</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Platform</h4>
                <Link to="/quizzes">Browse Quizzes</Link>
                <Link to="/signup">Create Account</Link>
                <Link to="/login">Sign In</Link>
              </div>
              <div className="footer-col">
                <h4>Support</h4>
                <a href="#faq">FAQ</a>
                <a href="#contact">Contact</a>
                <a href="#privacy">Privacy</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 QuizMaster Pro. Made with ❤️ for students across India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;