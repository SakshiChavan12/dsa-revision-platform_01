// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaChartLine, FaCode } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const Dashboard = () => {
  const { theme } = useTheme();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [greeting, setGreeting] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else if (hour < 21) setGreeting('Good Evening');
    else setGreeting('Good Night');
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/progress/dashboard');
        if (res.data.success) {
          setData(res.data.data);
          window.dispatchEvent(new Event('streak-updated'));
        }
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const styles = {
    card: {
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--border-subtle)',
      paddingBottom: '16px',
      marginBottom: '16px'
    },
    statNumber: { fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' },
    label: { fontSize: '0.85rem', color: 'var(--text-secondary)' },
    progressBar: {
      height: '6px',
      background: 'var(--border-subtle)',
      borderRadius: '999px',
      overflow: 'hidden',
      marginTop: '8px'
    }
  };

  const timeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading your dashboard...</div>;
  }

  const stats = data || {
    totalQuestions: 0, totalSolved: 0, accuracy: 0, todayCount: 0,
    recentActivity: [], continuePractice: [], weakTopics: []
  };

  const solvedPercentage = stats.totalQuestions === 0 ? 0 : Math.round((stats.totalSolved / stats.totalQuestions) * 100);
  const goalTarget = 3;
  const goalPercentage = Math.min((stats.todayCount / goalTarget) * 100, 100);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>

      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
          {greeting}, {user?.name || 'Guest'}. 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Let's continue your DSA journey.</p>
      </div>

      {/* TOP STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>

        {/* Today's Goal */}
        <div style={styles.card}>
          <div>
            <div style={styles.label}>Today's Goal</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-primary)', marginTop: '4px' }}>Solve {goalTarget} Questions</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
            <div style={{ position: 'relative', width: '44px', height: '44px' }}>
              <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border-subtle)" strokeWidth="4" />
                <path strokeDasharray={`${goalPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--accent-purple)" strokeWidth="4" />
              </svg>
              <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {stats.todayCount}/{goalTarget}
              </span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {stats.todayCount >= goalTarget ? 'Goal met! 🎉' : `${goalTarget - stats.todayCount} to go! 💪`}
            </span>
          </div>
          <Link to="/practice" className="btn-primary" style={{ marginTop: '16px', padding: '8px 16px', fontSize: '0.85rem', textAlign: 'center', textDecoration: 'none' }}>
            Start Practice
          </Link>
        </div>

        {/* Total Questions */}
        <div style={styles.card}>
          <div>
            <div style={styles.label}>Total Questions</div>
            <div style={styles.statNumber}>{stats.totalQuestions}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Available to solve</div>
          </div>
          <div style={{ alignSelf: 'flex-end', color: 'var(--accent-purple)', opacity: 0.3, fontSize: '2.5rem', marginTop: 'auto' }}><FaChartLine /></div>
        </div>

        {/* Solved */}
        <div style={styles.card}>
          <div>
            <div style={styles.label}>Solved</div>
            <div style={styles.statNumber}>{stats.totalSolved}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{solvedPercentage}% complete</div>
          </div>
          <div style={styles.progressBar}>
            <div style={{ height: '100%', width: `${solvedPercentage}%`, background: 'var(--accent-purple)', borderRadius: '999px' }}></div>
          </div>
        </div>

        {/* Accuracy */}
        <div style={styles.card}>
          <div>
            <div style={styles.label}>Accuracy</div>
            <div style={styles.statNumber}>{stats.accuracy}%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>All-time attempt rate</div>
          </div>
          <div style={{ alignSelf: 'flex-end', color: 'var(--success)', opacity: 0.5, fontSize: '1.5rem', marginTop: 'auto' }}>
            <svg width="40" height="40" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border-subtle)" strokeWidth="4" />
              <path strokeDasharray={`${stats.accuracy}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--success)" strokeWidth="4" />
            </svg>
          </div>
        </div>
      </div>

      {/* BOTTOM 3-COLUMN SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>

        {/* Continue Practice */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.1rem' }}>Continue Practice</h3>
            <Link to="/practice" style={{ color: 'var(--accent-purple)', fontSize: '0.85rem', textDecoration: 'none' }}>View All</Link>
          </div>

          {stats.continuePractice.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>You haven't practiced any questions yet.</p>
              <Link to="/practice" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Start Now</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {stats.continuePractice.map((q, idx) => (
                <div
                  key={q.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: idx < stats.continuePractice.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(124, 77, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
                    <FaCode />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {q.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                      <span style={{ color: q.difficulty === 'Easy' ? '#22c55e' : q.difficulty === 'Medium' ? '#eab308' : '#ef4444' }}>{q.difficulty}</span>
                      <span>•</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.topic}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{timeAgo(q.lastPracticed)}</span>
                    <Link to={`/practice/${q.id}`} state={{ listId: q.listId }} className="btn-outline" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
                      Continue
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weak Topics */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.1rem' }}>Weak Topics</h3>
          </div>

          {stats.weakTopics.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Not enough data yet. Solve at least 2 questions per topic to see weak areas.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stats.weakTopics.map((topic) => (
                <div key={topic.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{topic.name}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{topic.pct}%</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{ height: '100%', width: `${topic.pct}%`, background: topic.pct < 40 ? 'var(--danger)' : 'var(--warning)', borderRadius: '999px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.1rem' }}>Recent Activity</h3>
          </div>

          {stats.recentActivity.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No recent activity. Start a practice session!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {stats.recentActivity.map((act, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: i < stats.recentActivity.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                  }}
                >
                  <div>{act.status === 'Solved' ? <FaCheckCircle style={{ color: 'var(--success)' }} /> : <FaTimesCircle style={{ color: 'var(--danger)' }} />}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{act.difficulty}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.75rem', color: act.status === 'Solved' ? 'var(--success)' : 'var(--danger)' }}>{act.status}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{timeAgo(act.time)}</span>
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