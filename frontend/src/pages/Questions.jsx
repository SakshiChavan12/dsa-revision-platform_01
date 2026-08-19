// src/pages/Questions.jsx
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaChevronDown, FaPlus } from 'react-icons/fa';
import api from '../services/api'; // <-- Import your api instance

const Questions = () => {
  // --- STATE ---
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ topic: 'All', difficulty: 'All', platform: 'All', status: 'All' });
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // --- FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        // 1. Axios calls the backend
        const response = await api.get('/questions');
        // 2. Set the data from MongoDB into state
        setQuestions(response.data.questions);
        setError('');
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Unable to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // --- FILTER LOGIC (Frontend) ---
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
                            q.topic.toLowerCase().includes(search.toLowerCase());
      const matchesTopic = filters.topic === 'All' || q.topic === filters.topic;
      const matchesDiff = filters.difficulty === 'All' || q.difficulty === filters.difficulty;
      const matchesPlatform = filters.platform === 'All' || q.platform === filters.platform;
      return matchesSearch && matchesTopic && matchesDiff && matchesPlatform;
    });
  }, [questions, search, filters]);

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const currentData = filteredQuestions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- HANDLERS ---
  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(currentData.map(q => q._id));
    else setSelectedIds([]);
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };


    // --- QUESTIONS: ADD TO LIST ---
  const [showListModal, setShowListModal] = useState(false);
  const [availableLists, setAvailableLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState('');

  // Fetch lists when modal opens
  const openAddToListModal = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one question.");
      return;
    }
    try {
      const response = await api.get('/lists');
      setAvailableLists(response.data.lists);
      setShowListModal(true);
    } catch (err) {
      alert('Failed to load lists.');
    }
  };

  const confirmAddToList = async () => {
    if (!selectedListId) {
      alert('Please select a list.');
      return;
    }
    try {
      // Loop through selected questions and add them one by one
      for (const qId of selectedIds) {
        await api.post(`/lists/${selectedListId}/questions`, { questionId: qId });
      }
      alert(`Successfully added ${selectedIds.length} question(s) to the list!`);
      setShowListModal(false);
      setSelectedIds([]);
      setSelectedListId('');
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message === 'Question already exists in this list') {
        alert('Some questions were already in the list. The rest were added successfully.');
      } else {
        alert('Failed to add questions to list.');
      }
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setFilters({ topic: 'All', difficulty: 'All', platform: 'All', status: 'All' });
    setCurrentPage(1);
  };

  // --- HELPERS ---
  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' };
    if (diff === 'Medium') return { color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' };
    return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
  };

  // Derive unique topics for the dropdown from the database dynamically
  const uniqueTopics = ['All', ...new Set(questions.map(q => q.topic).filter(Boolean))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '24px', paddingBottom: '40px' }}>
      
      {/* ... (PAGE HEADER - UNCHANGED) ... */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>All Questions</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Search and filter questions</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{filteredQuestions.length} questions found</span>
          // Change the existing "Add to List" button to use openAddToListModal
<button 
  onClick={openAddToListModal} 
  className="btn-primary" 
  style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
>
  <FaPlus size={12} /> Add to List
</button>
        </div>
      </div>

      {/* ... (SEARCH & FILTERS - UNCHANGED) ... */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 12px' }}>
          <FaSearch style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
          <input type="text" placeholder="Search questions..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
        </div>
        
        {/* Topic Dropdown - Now uses dynamically fetched data */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 12px', minWidth: '110px' }}>
          <select value={filters.topic} onChange={(e) => setFilters({ ...filters, topic: e.target.value })} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', appearance: 'none', width: '100%', cursor: 'pointer', fontSize: '0.85rem', paddingRight: '20px' }}>
            {uniqueTopics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <FaChevronDown size={10} style={{ position: 'absolute', right: '12px', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
        </div>

        {/* Difficulty Filter */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 12px', minWidth: '110px' }}>
          <select value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', appearance: 'none', width: '100%', cursor: 'pointer', fontSize: '0.85rem', paddingRight: '20px' }}>
            <option value="All">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <FaChevronDown size={10} style={{ position: 'absolute', right: '12px', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
        </div>

        {/* Platform Filter */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 12px', minWidth: '110px' }}>
          <select value={filters.platform} onChange={(e) => setFilters({ ...filters, platform: e.target.value })} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', appearance: 'none', width: '100%', cursor: 'pointer', fontSize: '0.85rem', paddingRight: '20px' }}>
            <option value="All">All</option>
            <option value="LeetCode">LeetCode</option>
            <option value="GeeksforGeeks">GeeksforGeeks</option>
          </select>
          <FaChevronDown size={10} style={{ position: 'absolute', right: '12px', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
        </div>

        <button onClick={handleClearFilters} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Clear Filters</button>
      </div>

      {/* LOADING / ERROR / TABLE RENDERING */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: 'var(--text-secondary)' }}>
          Loading questions...
        </div>
      ) : error ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', color: '#ef4444' }}>
          {error}
        </div>
      ) : (
        <>
          {/* 3. QUESTION TABLE - UPDATED TO USE REAL DATA */}
          <div className="card-glow" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '16px', textAlign: 'left' }}>
                    <input type="checkbox" onChange={toggleSelectAll} checked={currentData.length > 0 && selectedIds.length === currentData.length} style={{ accentColor: 'var(--accent-purple)', cursor: 'pointer' }} />
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>#</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>Title</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>Topic</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>Difficulty</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>Platform</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((q, idx) => {
                  const diffStyle = getDifficultyColor(q.difficulty);
                  return (
                    <tr key={q._id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }} className="question-row-hover">
                      <td style={{ padding: '14px 16px' }}>
                        <input type="checkbox" checked={selectedIds.includes(q._id)} onChange={() => toggleSelectOne(q._id)} style={{ accentColor: 'var(--accent-purple)', cursor: 'pointer' }} />
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{idx + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td style={{ padding: '14px 16px' }}>
                        {/* Changed to use _id from MongoDB */}
                        <Link to={`/practice/${q._id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem' }} className="hover:underline">
                          {q.title}
                        </Link>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem', overflowWrap: 'break-word', wordBreak: 'break-word' }}>{q.topic}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '2px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: diffStyle.bg, color: diffStyle.color }}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{q.platform}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <button className="btn-outline" style={{ padding: '4px 12px', fontSize: '0.75rem' }} onClick={() => handleAddToList()}>+ Add</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 4. PAGINATION */}
          {totalPages > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
              {/* ... Pagination buttons ... */}
            </div>
          )}
        </>
      )}

      {/* Add to List Modal */}
{showListModal && (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
    <div className="card-glow" style={{ width: '100%', maxWidth: '400px', padding: '32px', background: 'var(--bg-card)' }}>
      <h3 style={{ color: 'var(--text-primary)', margin: '0 0 16px 0' }}>Add to List</h3>
      {availableLists.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>You haven't created any lists yet.</p>
      ) : (
        <>
          <select 
            value={selectedListId} 
            onChange={(e) => setSelectedListId(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', marginBottom: '16px' }}
          >
            <option value="">Select a list...</option>
            {availableLists.map(list => (
              <option key={list._id} value={list._id}>{list.name}</option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowListModal(false)} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Cancel</button>
            <button onClick={confirmAddToList} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Add</button>
          </div>
        </>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default Questions;