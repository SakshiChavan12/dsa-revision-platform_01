// src/pages/Progress.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProgress } from '../services/api';
import { 
  FaClipboardList, 
  FaCheckCircle, 
  FaHourglassHalf, 
  FaBullseye, 
  FaCheck, 
  FaTimes 
} from 'react-icons/fa';

const Progress = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await getProgress();
        setProgress(response);
      } catch (err) {
        setError('Unable to load progress data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading progress...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>{error}</div>;

  // Fallback to zeros if data is missing
  const overview = progress?.overview || { totalQuestions: 0, solved: 0, attempted: 0, accuracy: 0 };
  const today = progress?.today || { total: 0, solved: 0, wrong: 0, pending: 0 };
  const accuracy7Days = progress?.accuracyLast7Days || [];
  const weakTopics = progress?.weakTopics || [];

  // Build Accuracy Chart (SVG)
  const width = 300, height = 130, padding = { top: 10, bottom: 25, left: 25, right: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxVal = 100;
  const points = accuracy7Days.map((d, i) => ({
    x: padding.left + (i / Math.max(accuracy7Days.length - 1, 1)) * chartWidth,
    y: padding.top + chartHeight - (d.accuracy / maxVal) * chartHeight
  }));
  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1]?.x || 0} ${padding.top + chartHeight} L ${points[0]?.x || 0} ${padding.top + chartHeight} Z`;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>7. Track Progress</h1>
        <Link to="/practice" className="btn-primary" style={{ padding: '8px 24px', fontSize: '0.9rem', textDecoration: 'none' }}>Practice Now</Link>
      </div>

      {/* MAIN 4-COLUMN GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.1fr 1.5fr 1fr', gap: '16px' }}>
        
        {/* CARD 1: OVERVIEW */}
        <div className="card-glow" style={{ padding: '14px', minHeight: '185px' }}>
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '12px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '500' }}>Overview</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}><FaClipboardList /> Total Questions</span>
              <span style={{ color: '#22c55e', fontWeight: '600' }}>{overview.totalQuestions}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}><FaCheckCircle /> Solved</span>
              <span style={{ color: '#22c55e', fontWeight: '600' }}>{overview.solved}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}><FaHourglassHalf /> Attempted</span>
              <span style={{ color: '#f59e0b', fontWeight: '600' }}>{overview.attempted}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}><FaBullseye /> Accuracy</span>
              <span style={{ color: '#38bdf8', fontWeight: '600' }}>{overview.accuracy}%</span>
            </div>
          </div>
        </div>

        {/* CARD 2: TODAY'S PROGRESS */}
        <div className="card-glow" style={{ padding: '14px', minHeight: '185px' }}>
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '12px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '500' }}>Today's Progress</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border-subtle)" strokeWidth="4" />
                <path strokeDasharray={`${(today.solved / Math.max(today.total, 1)) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22c55e" strokeWidth="4" />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '0.9rem', lineHeight: 1 }}>{today.solved}/{today.total}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>Solved</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Solved</span>
                <span style={{ color: '#22c55e' }}>{today.solved}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Wrong</span>
                <span style={{ color: '#ef4444' }}>{today.wrong}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Pending</span>
                <span style={{ color: '#f59e0b' }}>{today.pending}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: ACCURACY CHART */}
        <div className="card-glow" style={{ padding: '14px', minHeight: '185px' }}>
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '8px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '500' }}>Accuracy (Last 7 Days)</div>
          {accuracy7Days.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '20px' }}>No practice data yet.</div>
          ) : (
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
              {[0, 25, 50, 75, 100].map((val, i) => (
                <line key={i} x1={padding.left} y1={padding.top + chartHeight - (val / maxVal) * chartHeight} x2={width - padding.right} y2={padding.top + chartHeight - (val / maxVal) * chartHeight} stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="4" />
              ))}
              <path d={areaPath} fill="rgba(124, 77, 255, 0.2)" />
              <path d={linePath} fill="none" stroke="#7c4dff" strokeWidth="2" strokeLinejoin="round" />
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--bg-card)" stroke="#7c4dff" strokeWidth="2" />
              ))}
              {accuracy7Days.map((d, i) => (
                <text key={i} x={points[i].x} y={padding.top + chartHeight + 16} textAnchor="middle" fontSize="8" fill="var(--text-secondary)">{d.date.split('-')[2]}</text>
              ))}
            </svg>
          )}
        </div>

        {/* CARD 4: WEAK TOPICS */}
        <div className="card-glow" style={{ padding: '14px', minHeight: '185px' }}>
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px', marginBottom: '8px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '500' }}>Weak Topics</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Based on your performance</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {weakTopics.length === 0 ? (
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>No weak topics yet.</div>
            ) : (
              weakTopics.map((topic, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '2px' }}>
                    <span style={{ color: 'var(--text-primary)' }}>{topic.name}</span>
                    <span style={{ color: '#ef4444', fontWeight: '500' }}>{topic.accuracy}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${topic.accuracy}%`, background: '#ef4444', borderRadius: '2px' }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Progress;