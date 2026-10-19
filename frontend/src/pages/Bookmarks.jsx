import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBookmark, FaCode } from 'react-icons/fa';
import api from '../services/api';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await api.get('/bookmarks');
        if (res.data.success) {
          setBookmarks(res.data.bookmarks);
        }
      } catch (err) {
        console.error("Failed to load bookmarks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  // Handle removing a bookmark
  const handleRemoveBookmark = async (e, questionId) => {
    // Prevent the click from triggering the parent <Link> navigation
    e.preventDefault();
    e.stopPropagation();

    setRemovingId(questionId);
    try {
      const res = await api.post(`/bookmarks/${questionId}`);
      if (res.data.success && !res.data.bookmarked) {
        // Remove it from the UI immediately
        setBookmarks(prev => prev.filter(q => q._id !== questionId));
      }
    } catch (err) {
      console.error("Failed to remove bookmark", err);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading your bookmarks...</div>;
  }

  return (
    <div style={{ width: '100%', padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '32px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FaBookmark style={{ color: 'var(--accent-purple)' }} /> My Bookmarks
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Questions you've saved for later review.</p>
      </div>

      {bookmarks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '48px', color: 'var(--text-secondary)', marginBottom: '16px' }}><FaBookmark /></div>
          <h3 style={{ color: 'var(--text-primary)', margin: '0 0 8px 0' }}>No bookmarks yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Click the bookmark icon on any question to save it here.</p>
          <Link to="/questions" className="btn-primary" style={{ padding: '10px 24px', textDecoration: 'none' }}>
            Browse Questions
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {bookmarks.map(q => (
            <Link 
              key={q._id} 
              to={`/practice/${q._id}`} 
              style={{ textDecoration: 'none' }}
            >
              <div className="card-glow" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.1rem', fontWeight: '600', lineHeight: 1.4 }}>{q.title}</h3>
                  
                  {/* Remove Bookmark Icon */}
                  <button
                    onClick={(e) => handleRemoveBookmark(e, q._id)}
                    disabled={removingId === q._id}
                    title="Remove Bookmark"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: removingId === q._id ? 'not-allowed' : 'pointer',
                      color: 'var(--accent-purple)',
                      fontSize: '1.1rem',
                      padding: '4px',
                      flexShrink: 0,
                      opacity: removingId === q._id ? 0.5 : 1,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { if(removingId !== q._id) e.currentTarget.style.color = '#ef4444' }}
                    onMouseLeave={(e) => { if(removingId !== q._id) e.currentTarget.style.color = 'var(--accent-purple)' }}
                  >
                    <FaBookmark />
                  </button>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(124, 77, 255, 0.1)', color: 'var(--text-secondary)' }}>
                    {q.topic}
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', 
                    color: q.difficulty === 'Easy' ? '#22c55e' : q.difficulty === 'Medium' ? '#eab308' : '#ef4444',
                    background: 'rgba(255,255,255,0.05)'
                  }}>
                    {q.difficulty}
                  </span>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaCode /> Practice now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;