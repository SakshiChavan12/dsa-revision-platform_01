// src/pages/ListDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const ListDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Fetch List Details
  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/lists/${id}`);
        setList(response.data.list);
        setEditName(response.data.list.name);
        setEditDesc(response.data.list.description || '');
        setError('');
      } catch (err) {
        console.error(err);
        if (err.response?.status === 404) {
          setError('List not found.');
        } else {
          setError('Unable to load list details.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [id]);

  // Remove Question
  const handleRemoveQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to remove this question?')) return;
    
    try {
      await api.delete(`/lists/${id}/questions/${questionId}`);
      // Update the UI immediately
      setList(prev => ({
        ...prev,
        questions: prev.questions.filter(q => q._id !== questionId)
      }));
    } catch (err) {
      alert('Failed to remove question.');
    }
  };

  // Update List
  const handleUpdateList = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/lists/${id}`, {
        name: editName,
        description: editDesc
      });
      setList(response.data.list);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update list.');
    }
  };

  // Delete List
  const handleDeleteList = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this entire list?')) return;
    
    try {
      await api.delete(`/lists/${id}`);
      navigate('/lists');
    } catch (err) {
      alert('Failed to delete list.');
    }
  };

  // Loading / Error States
  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading list...</div>;
  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: '16px' }}>
      <h2 style={{ color: 'var(--text-primary)' }}>{error}</h2>
      <Link to="/lists" className="btn-primary" style={{ padding: '10px 24px', textDecoration: 'none' }}>Back to My Lists</Link>
    </div>
  );

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{list.name}</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{list.description || 'No description provided.'}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>{list.questions.length} questions</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => setIsEditing(true)} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Edit List</button>
          <button onClick={handleDeleteList} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>Delete List</button>
          <Link to="/lists" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem', textDecoration: 'none' }}>Back</Link>
        </div>
      </div>

      {/* Questions Table */}
      {list.questions.length === 0 ? (
        <div className="card-glow" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>No questions in this list yet.</p>
          <Link to="/questions" className="btn-primary" style={{ marginTop: '12px', display: 'inline-block', padding: '8px 20px', textDecoration: 'none', fontSize: '0.85rem' }}>
            Browse Questions
          </Link>
        </div>
      ) : (
        <div className="card-glow" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>#</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>Title</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>Topic</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>Difficulty</th>
                <th style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.questions.map((q, idx) => {
                const diffColor = q.difficulty === 'Easy' ? '#22c55e' : q.difficulty === 'Medium' ? '#eab308' : '#ef4444';
                return (
                  <tr key={q._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{idx + 1}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontWeight: '500' }}>{q.title}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{q.topic}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '2px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', color: diffColor, background: diffColor + '20' }}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleRemoveQuestion(q._id)}
                        className="btn-outline"
                        style={{ padding: '4px 12px', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="card-glow" style={{ width: '100%', maxWidth: '450px', padding: '32px', background: 'var(--bg-card)' }}>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 16px 0' }}>Edit List</h3>
            <form onSubmit={handleUpdateList} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>List Name</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ padding: '10px 12px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Description</label>
                <textarea 
                  value={editDesc} 
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows="3"
                  style={{ padding: '10px 12px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListDetails;