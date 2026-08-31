// src/pages/Practice.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa6';
import api from '../services/api';
import { getRandomQuestionFromList } from '../services/api';

const Practice = () => {
  const navigate = useNavigate();
  
  const [myLists, setMyLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedListId, setSelectedListId] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState('');

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoadingLists(true);
        const response = await api.get('/lists');
        setMyLists(response.data.lists);
      } catch (err) {
        setError('Unable to load your lists. Please try again.');
      } finally {
        setLoadingLists(false);
      }
    };
    fetchLists();
  }, []);

  const handleListChange = (e) => {
    const listId = e.target.value;
    setSelectedListId(listId);
    setStartError('');
    
    const foundList = myLists.find(list => list._id === listId);
    setSelectedList(foundList || null);
  };

  const handleStartPractice = async () => {
    if (!selectedListId) {
      setStartError('Please select a list first.');
      return;
    }

    if (selectedList && selectedList.questions.length === 0) {
      setStartError('This list has no questions. Add questions to this list first.');
      return;
    }

    setIsStarting(true);
    setStartError('');

    try {
      const response = await getRandomQuestionFromList(selectedListId);
      const questionId = response.question._id;
      navigate(`/practice/${questionId}`);
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 404) {
        setStartError(err.response.data.message || 'Unable to start practice. Please check your list.');
      } else {
        setStartError('Unable to start practice. Please try again.');
      }
    } finally {
      setIsStarting(false);
    }
  };

  if (loadingLists) return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading your lists...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '70vh', width: '100%', paddingTop: '20px' }}>
      
      <div className="card-glow" style={{
        width: '420px',
        maxWidth: 'calc(100% - 32px)',
        padding: '28px 24px',
        borderRadius: '12px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        
        <div style={{ width: '100%', marginBottom: '12px' }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: 'var(--text-primary)', 
            margin: '0', 
            textAlign: 'left' 
          }}>
            Practice
          </h2>
        </div>

        <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)', marginBottom: '24px' }}></div>

        {/* ✅ THIS IS YOUR EXACT LOCAL DICE! */}
        <img 
          src="/dice.png" 
          alt="3D Dice"
          style={{ 
            width: '100px', 
            height: '100px', 
            marginBottom: '16px'
          }}
        />

        <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 6px 0', textAlign: 'center' }}>
          Ready to Practice?
        </h3>

        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.5', margin: '0 0 14px 0' }}>
          We will randomly pick a question<br />
          from your list.
        </p>

        <div style={{ position: 'relative', width: '100%', maxWidth: '280px', marginBottom: '8px' }}>
          <select 
            value={selectedListId} 
            onChange={handleListChange}
            style={{
              width: '100%',
              height: '40px',
              padding: '0 12px',
              appearance: 'none',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="">Select a list...</option>
            {myLists.map(list => (
              <option key={list._id} value={list._id}>
                {list.name} ({list.questions.length})
              </option>
            ))}
          </select>
          <FaChevronDown size={12} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
        </div>

        {selectedList && selectedList.questions.length === 0 && (
          <p style={{ color: '#eab308', fontSize: '12px', margin: '4px 0 8px 0' }}>
            This list has no questions. Add questions to this list first.
          </p>
        )}

        <button 
          onClick={handleStartPractice}
          disabled={!selectedListId || isStarting || (selectedList && selectedList.questions.length === 0)}
          className="btn-primary"
          style={{
            width: '100%',
            maxWidth: '280px',
            height: '40px',
            marginTop: '8px',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '8px',
            opacity: (!selectedListId || isStarting || (selectedList && selectedList.questions.length === 0)) ? 0.5 : 1
          }}
        >
          {isStarting ? 'Finding question...' : 'Start Practice'}
        </button>

        {startError && (
          <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>
            {startError}
          </p>
        )}

        {myLists.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              You haven't created any lists yet. Create a list first to start practicing.
            </p>
            <Link to="/lists" className="btn-outline" style={{ padding: '8px 16px', fontSize: '13px', textDecoration: 'none' }}>
              Go to My Lists
            </Link>
          </div>
        )}

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.5', margin: '14px 0 0 0' }}>
          You can't skip or pick a question.<br />
          Solve and improve! 💪
        </p>

        {/* ✅ Attribution */}
        <div style={{ marginTop: '16px', fontSize: '10px', color: 'var(--text-secondary)' }}>
          <a href="https://www.flaticon.com/free-icons/dice" title="dice icons" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
            Dice icons created by Muhamad Ulum - Flaticon
          </a>
        </div>

      </div>
    </div>
  );
};

export default Practice;