// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaBell, FaUserCircle, FaCheckCircle, FaTimesCircle, FaChartLine } from 'react-icons/fa';
import { getDashboard } from '../services/api';

const Dashboard = () => {
  const [greeting, setGreeting] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dynamic greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else if (hour < 21) setGreeting('Good Evening');
    else setGreeting('Good Night');
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await getDashboard();
        setDashboard(data);
        setError('');
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Unable to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // ─────────────────────────────────────────────
  // Loading state (same layout, no fake numbers)
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ width: '100%', padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading dashboard...
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Error state
  // ─────────────────────────────────────────────
  if (error || !dashboard) {
    return (
      <div style={{ width: '100%', padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error || 'Failed to load dashboard.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
          style={{ padding: '10px 24px' }}
        >
          Retry
        </button>
      </div>
    );
  }

  const { user, todayGoal, stats, streak, continuePractice, weakTopics, recentActivity } = dashboard;

  // Styles
  const styles = {
    card: {
      background: 'var(--bg-card, #0d121c)',
      border: '1px solid var(--border-subtle, #202838)',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: '700',
      color: 'var(--text-primary, #f5f7fb)'
    },
    label: {
      fontSize: '0.85rem',
      color: 'var(--text-secondary, #8d98aa)'
    },
    progressBar: {
      height: '6px',
      background: 'var(--border-subtle, #202838)',
      borderRadius: '999px',
      overflow: 'hidden',
      marginTop: '8px'
    }
  };

  // Circular progress percent for Today's Goal
  const goalPercent = todayGoal.target > 0
    ? Math.min((todayGoal.completed / todayGoal.target) * 100, 100)
    : 0;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>

      {/* MAIN HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
            {greeting}, {user?.name || 'Guest'}. 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Let's continue your DSA journey.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 16px', color: 'var(--text-secondary)' }}>
            <FaSearch style={{ marginRight: '8px' }} />
            <input
              type="text"
              placeholder="Search questions, topics..."
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '180px' }}
            />
          </div>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}>
            <FaBell />
          </button>
          <div style={{ color: 'var(--accent-purple)', fontSize: '2rem' }}><FaUserCircle /></div>
        </div>
      </div>

      {/* TOP STATISTICS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>

        {/* Card 1: Today's Goal */}
        <div style={styles.card}>
          <div>
            <div style={styles.label}>Today's Goal</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-primary)', marginTop: '4px' }}>
              Solve {todayGoal.target} Questions
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
            <div style={{ position: 'relative', width: '44px', height: '44px' }}>
              <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border-subtle)" strokeWidth="4" />
                <path strokeDasharray={`${goalPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--accent-purple)" strokeWidth="4" />
              </svg>
              <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {todayGoal.completed}/{todayGoal.target}
              </span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {todayGoal.isCompleted ? 'Goal completed! 🎉' : `${todayGoal.remaining} to go! 💪`}
            </span>
          </div>
          <Link to="/practice" className="btn-primary" style={{ marginTop: '12px', padding: '8px 16px', fontSize: '0.85rem', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
            Start Practice
          </Link>
        </div>

        {/* Card 2: Total Questions */}
        <div style={styles.card}>
          <div>
            <div style={styles.label}>Total Questions</div>
            <div style={styles.statNumber}>{stats.totalQuestions}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {stats.weeklyChange.hasData
                ? `${stats.weeklyChange.solvedDelta >= 0 ? '+' : ''}${stats.weeklyChange.solvedDelta} this week`
                : '\u00A0'}
            </div>
          </div>
          <div style={{ alignSelf: 'flex-end', color: 'var(--accent-purple)', opacity: 0.3, fontSize: '2.5rem' }}>
            <FaChartLine />
          </div>
        </div>

        {/* Card 3: Solved */}
        <div style={styles.card}>
          <div>
            <div style={styles.label}>Solved</div>
            <div style={styles.statNumber}>{stats.solved}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {stats.solvedPercentage}%
            </div>
          </div>
          <div style={styles.progressBar}>
            <div style={{ height: '100%', width: `${stats.solvedPercentage}%`, background: 'var(--accent-purple)', borderRadius: '999px' }}></div>
          </div>
        </div>

        {/* Card 4: Accuracy */}
        <div style={styles.card}>
          <div>
            <div style={styles.label}>Accuracy</div>
            <div style={styles.statNumber}>{stats.accuracy}%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {stats.weeklyChange.hasData ? 'Based on all submissions' : 'Start solving to see accuracy'}
            </div>
          </div>
          <div style={{ alignSelf: 'flex-end', color: '#22c55e', opacity: 0.5, fontSize: '1.5rem', marginTop: '8px' }}>
            <svg width="40" height="40" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border-subtle)" strokeWidth="4" />
              <path strokeDasharray={`${stats.accuracy}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22c55e" strokeWidth="4" />
            </svg>
          </div>
        </div>
      </div>

      {/* BOTTOM 3-COLUMN SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '20px', marginTop: '12px' }}>

        {/* Card 1: Continue Practice */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.1rem' }}>Continue Practice</h3>
            <Link to="/practice" style={{ color: 'var(--accent-purple)', fontSize: '0.85rem', textDecoration: 'none' }}>View All</Link>
          </div>

          {continuePractice.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <p style={{ margin: '0 0 12px 0' }}>No recent practice yet.</p>
              <Link to="/practice" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-block' }}>
                Start Practice
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {continuePractice.map((item) => (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(124, 77, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
                      <i className="fa-solid fa-code"></i>
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: item.difficulty === 'Easy' ? '#22c55e' : item.difficulty === 'Medium' ? '#eab308' : '#ef4444' }}>
                        {item.difficulty}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {item.tags.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Last practiced {item.lastPracticedLabel}
                    </span>
                    <Link to={`/practice/${item._id}`} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem', textDecoration: 'none' }}>
                      Continue
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 2: Weak Topics */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.1rem' }}>Weak Topics</h3>
          </div>

          {weakTopics.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Start practicing to discover your weak topics.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {weakTopics.map((topic) => (
                <div key={topic.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-primary)' }}>{topic.name}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{topic.accuracy}%</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{
                      height: '100%',
                      width: `${topic.accuracy}%`,
                      background: topic.accuracy < 40 ? '#ef4444' : topic.accuracy < 60 ? '#f59e0b' : '#38bdf8',
                      borderRadius: '999px'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 3: Recent Activity */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.1rem' }}>Recent Activity</h3>
          </div>

          {recentActivity.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              No recent activity yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivity.map((act, i) => (
                <div key={act._id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1rem' }}>
                      {act.statusLabel === 'Solved'
                        ? <FaCheckCircle style={{ color: '#22c55e' }} />
                        : <FaTimesCircle style={{ color: '#ef4444' }} />}
                    </span>
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{act.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{act.difficulty}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '0.8rem', color: act.statusLabel === 'Solved' ? '#22c55e' : '#ef4444' }}>
                      {act.statusLabel}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{act.relativeTime}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;