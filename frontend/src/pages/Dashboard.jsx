
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSearch, FaBell, FaUserCircle, FaFire, FaCheckCircle,
  FaTimesCircle, FaClock, FaArrowRight, FaChartLine
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext'; // <-- 1. IMPORT THIS!

const Dashboard = () => {
  const { theme } = useTheme(); // <-- 2. READ THE THEME STATE

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [greeting, setGreeting] = useState('');

  // Dynamic time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else if (hour < 21) setGreeting('Good Evening');
    else setGreeting('Good Night');
  }, []);

  // Styles utilizing your existing CSS variables
  const styles = {
    card: {
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    statNumber: {
      fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)'
    },
    label: {
      fontSize: '0.85rem', color: 'var(--text-secondary)'
    },
    purpleText: {
      color: 'var(--accent-purple)'
    },
    progressBar: {
      height: '6px', background: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden', marginTop: '8px'
    }
  };




  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>

      {/* 4. MAIN HEADER */}
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
            <input type="text" placeholder="Search questions, topics..." style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '180px' }} />
          </div>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}><FaBell /></button>
          <div style={{ color: 'var(--accent-purple)', fontSize: '2rem' }}><FaUserCircle /></div>
        </div>
      </div>

      {/* 5. TOP STATISTICS SECTION */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Card 1: Today's Goal */}
        <div style={styles.card}>
          <div>
            <div style={styles.label}>Today's Goal</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-primary)', marginTop: '4px' }}>Solve 3 Questions</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
            <div style={{ position: 'relative', width: '44px', height: '44px' }}>
              <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border-subtle)" strokeWidth="4" />
                <path strokeDasharray="66.6, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--accent-purple)" strokeWidth="4" />
              </svg>
              <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>2/3</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>1 to go! 💪</span>
          </div>
          <Link to="/practice" className="btn-primary" style={{ marginTop: '12px', padding: '8px 16px', fontSize: '0.85rem', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
            Start Practice
          </Link>
        </div>

        {/* Card 2: Total Questions */}
        <div style={styles.card}>
          <div>
            <div style={styles.label}>Total Questions</div>
            <div style={styles.statNumber}>254</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>+18 this week</div>
          </div>
          <div style={{ alignSelf: 'flex-end', color: 'var(--accent-purple)', opacity: 0.3, fontSize: '2.5rem' }}><FaChartLine /></div>
        </div>

        {/* Card 3: Solved */}
        <div style={styles.card}>
          <div>
            <div style={styles.label}>Solved</div>
            <div style={styles.statNumber}>164</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>65%</div>
          </div>
          <div style={styles.progressBar}>
            <div style={{ height: '100%', width: '65%', background: 'var(--accent-purple)', borderRadius: '999px' }}></div>
          </div>
        </div>

        {/* Card 4: Accuracy */}
        <div style={styles.card}>
          <div>
            <div style={styles.label}>Accuracy</div>
            <div style={styles.statNumber}>81.4%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>+5.2% this week</div>
          </div>
          <div style={{ alignSelf: 'flex-end', color: 'var(--success)', opacity: 0.5, fontSize: '1.5rem', marginTop: '8px' }}>
            <svg width="40" height="40" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border-subtle)" strokeWidth="4" />
              <path strokeDasharray="81.4, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--success)" strokeWidth="4" />
            </svg>
          </div>
        </div>
      </div>

      {/* 6. BOTTOM 3-COLUMN SECTION */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.5fr 1fr 1fr',
        gap: '20px',
        marginTop: '12px' 
      }}>
        
        {/* Card 1: Continue Practice */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.1rem' }}>Continue Practice</h3>
            <Link to="/practice" style={{ color: 'var(--accent-purple)', fontSize: '0.85rem', textDecoration: 'none' }}>View All</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(124, 77, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
                <i className="fa-solid fa-code"></i>
              </div>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Two Sum</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Easy</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Array, Hash Table</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Last practiced yesterday</span>
              <Link to="/practice/101" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem', textDecoration: 'none' }}>
                Continue
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2: Weak Topics */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.1rem' }}>Weak Topics</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'Dynamic Programming', pct: 36, color: 'var(--danger)' },
              { name: 'Graphs', pct: 45, color: 'var(--warning)' },
              { name: 'Tree', pct: 52, color: 'var(--info)' },
            ].map((topic) => (
              <div key={topic.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{topic.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{topic.pct}%</span>
                </div>
                <div style={styles.progressBar}>
                  <div style={{ height: '100%', width: `${topic.pct}%`, background: topic.color, borderRadius: '999px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Recent Activity */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.1rem' }}>Recent Activity</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { name: 'Merge Intervals', diff: 'Easy', status: 'Solved', time: 'Today', icon: <FaCheckCircle style={{ color: 'var(--success)' }} /> },
              { name: 'LRU Cache', diff: 'Hard', status: 'Wrong', time: 'Yesterday', icon: <FaTimesCircle style={{ color: 'var(--danger)' }} /> },
              { name: 'Word Ladder', diff: 'Hard', status: 'Solved', time: '2 days ago', icon: <FaCheckCircle style={{ color: 'var(--success)' }} /> },
            ].map((act, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1rem' }}>{act.icon}</span>
                  <div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{act.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{act.diff}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '0.8rem', color: act.status === 'Solved' ? 'var(--success)' : 'var(--danger)' }}>{act.status}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;