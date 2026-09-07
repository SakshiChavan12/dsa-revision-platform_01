// src/pages/MyLists.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyLists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch lists from backend
  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true);
        const response = await api.get('/lists');
        setLists(response.data.lists);
      } catch (err) {
        console.error(err);
        setError('Unable to load your lists.');
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, []);

  // Loading / Error / Empty states
  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading your lists...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>{error}</div>;

  return (
    <div className="my-lists-wrapper" style={{ width: '100%', padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0' }}>My Lists</h1>
            <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>Organize your DSA questions into focused practice lists.</p>
          </div>
          <Link to="/create-list" className="btn-primary" style={{ padding: '10px 24px', whiteSpace: 'nowrap', textDecoration: 'none' }}>
            <i className="fa-regular fa-plus" style={{ marginRight: '8px' }}></i> Create New List
          </Link>
        </div>
      </div>

      {/* LISTS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {lists.length === 0 ? (
          <div className="card-glow" style={{ padding: '48px', textAlign: 'center', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '48px', color: 'var(--text-secondary)', marginBottom: '16px' }}><i className="fa-regular fa-folder-open"></i></div>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 8px 0' }}>No lists created yet</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Create your first list and start organizing your practice.</p>
            <Link to="/create-list" className="btn-primary" style={{ marginTop: '24px', display: 'inline-block', padding: '10px 24px', textDecoration: 'none' }}>Create Your First List</Link>
          </div>
        ) : (
          lists.map((list) => (
            <Link 
              key={list._id} 
              to={`/lists/${list._id}`} 
              style={{ textDecoration: 'none' }}
            >
              <div className="card-glow" style={{ padding: '24px', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.2s' }}>
                
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ color: 'var(--text-primary)', margin: '0', fontWeight: '600' }}>{list.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.875rem' }}>{list.questions.length} questions</p>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                </div>

                {/* First 3 Questions Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
                  {list.questions.slice(0, 3).map((q, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ overflowWrap: 'break-word', wordBreak: 'break-word', flex: 1, paddingRight: '8px' }}>{q.title}</span>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        color: q.difficulty === 'Easy' ? '#22c55e' : q.difficulty === 'Medium' ? '#eab308' : '#ef4444',
                        flexShrink: 0
                      }}>
                        {q.difficulty}
                      </span>
                    </div>
                  ))}
                  {list.questions.length > 3 && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingTop: '4px' }}>
                      + {list.questions.length - 3} more...
                    </div>
                  )}
                </div>

              </div>
            </Link>
          ))
        )}
      </div>

    </div>
  );
};

export default MyLists;