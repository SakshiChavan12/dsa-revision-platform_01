import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaChevronDown, FaPlus } from 'react-icons/fa';
import api from '../services/api';
import { addQuestionsToList } from '../services/api';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ topic: 'All', difficulty: 'All', platform: 'All' });
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [myLists, setMyLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState('');
  const [loadingLists, setLoadingLists] = useState(false);
  const [addingToList, setAddingToList] = useState(false);
  const [notification, setNotification] = useState('');
  
  // Create New List State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [creatingList, setCreatingList] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await api.get('/questions');
        setQuestions(response.data.questions);
        setError('');
      } catch (err) {
        setError('Unable to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

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

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const currentData = filteredQuestions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- MODAL HANDLERS ---
  const openAddToListModal = async () => {
    if (selectedQuestionIds.length === 0) {
      setNotification('Please select at least one question.');
      return;
    }
    
    setShowModal(true);
    setNotification('');
    setShowCreateForm(false);
    setSelectedListId('');
    setLoadingLists(true);
    
    try {
      const response = await api.get('/lists');
      setMyLists(response.data.lists);
    } catch (err) {
      setNotification('Unable to load lists.');
    } finally {
      setLoadingLists(false);
    }
  };

  const handleCreateNewList = async () => {
    if (!newListName.trim()) return;
    setCreatingList(true);
    try {
      const response = await api.post('/lists', {
        name: newListName,
        description: newListDesc
      });
      setMyLists(prev => [response.data.list, ...prev]);
      setSelectedListId(response.data.list._id);
      setNewListName('');
      setNewListDesc('');
      setShowCreateForm(false);
      setNotification('New list created!');
    } catch (err) {
      setNotification('Failed to create list.');
    } finally {
      setCreatingList(false);
    }
  };

  const handleAddQuestions = async () => {
    if (!selectedListId) {
      setNotification('Please select a list.');
      return;
    }
    
    setAddingToList(true);
    try {
      const result = await addQuestionsToList(selectedListId, selectedQuestionIds);
      
      if (result.addedCount > 0 && result.skippedCount > 0) {
        setNotification(`${result.addedCount} question(s) added. ${result.skippedCount} question(s) already existed.`);
      } else if (result.addedCount > 0) {
        setNotification(`${result.addedCount} question(s) added successfully!`);
      } else {
        setNotification('All selected questions are already in this list.');
      }
      
      setSelectedQuestionIds([]);
      setTimeout(() => setShowModal(false), 1500);
      
    } catch (err) {
      setNotification('Unable to add questions. Please try again.');
    } finally {
      setAddingToList(false);
    }
  };

  // --- SELECTION HANDLERS ---
  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedQuestionIds(filteredQuestions.map(q => q._id));
    else setSelectedQuestionIds([]);
  };

  const handleSelectOne = (id) => {
    setSelectedQuestionIds(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  const handleClearFilters = () => {
    setSearch('');
    setFilters({ topic: 'All', difficulty: 'All', platform: 'All' });
    setCurrentPage(1);
  };

  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' };
    if (diff === 'Medium') return { color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' };
    return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
  };

  const uniqueTopics = ['All', ...new Set(questions.map(q => q.topic).filter(Boolean))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '24px', paddingBottom: '40px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>All Questions</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Search and filter questions</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{filteredQuestions.length} questions found</span>
          <button 
            onClick={openAddToListModal}
            disabled={selectedQuestionIds.length === 0}
            className="btn-primary" 
            style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', opacity: selectedQuestionIds.length === 0 ? 0.5 : 1 }}
          >
            <FaPlus size={12} /> {selectedQuestionIds.length > 0 ? `Add ${selectedQuestionIds.length} Questions to List` : 'Add to List'}
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 12px' }}>
          <FaSearch style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
          <input type="text" placeholder="Search questions..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 12px', minWidth: '110px' }}>
          <select value={filters.topic} onChange={(e) => setFilters({ ...filters, topic: e.target.value })} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', appearance: 'none', width: '100%', cursor: 'pointer', fontSize: '0.85rem', paddingRight: '20px' }}>
            {uniqueTopics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <FaChevronDown size={10} style={{ position: 'absolute', right: '12px', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 12px', minWidth: '110px' }}>
          <select value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', appearance: 'none', width: '100%', cursor: 'pointer', fontSize: '0.85rem', paddingRight: '20px' }}>
            <option value="All">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <FaChevronDown size={10} style={{ position: 'absolute', right: '12px', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
        </div>
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

      {/* TABLE */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: 'var(--text-secondary)' }}>Loading questions...</div>
      ) : error ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', color: '#ef4444' }}>{error}</div>
      ) : (
        <div className="card-glow" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '16px', textAlign: 'left' }}>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={filteredQuestions.length > 0 && selectedQuestionIds.length === filteredQuestions.length} 
                    style={{ accentColor: 'var(--accent-purple)', cursor: 'pointer' }} 
                  />
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
                      <input 
                        type="checkbox" 
                        checked={selectedQuestionIds.includes(q._id)} 
                        onChange={() => handleSelectOne(q._id)} 
                        style={{ accentColor: 'var(--accent-purple)', cursor: 'pointer' }} 
                      />
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{idx + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <Link to={`/practice/${q._id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem' }} className="hover:underline">{q.title}</Link>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem', overflowWrap: 'break-word', wordBreak: 'break-word' }}>{q.topic}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '2px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: diffStyle.bg, color: diffStyle.color }}>{q.difficulty}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{q.platform}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button className="btn-outline" style={{ padding: '4px 12px', fontSize: '0.75rem' }} onClick={() => openAddToListModal(q._id)}>+ Add</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: currentPage === 1 ? 0.5 : 1 }}>&lt;</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px', border: 'none', background: currentPage === i + 1 ? 'var(--accent-purple)' : 'transparent', color: currentPage === i + 1 ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}>{i + 1}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: currentPage === totalPages ? 0.5 : 1 }}>&gt;</button>
        </div>
      )}

      {/* ADD TO LIST MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ width: '90%', maxWidth: '500px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
              Add {selectedQuestionIds.length} Question(s) to List
            </h3>
            
            {notification && <p style={{ color: '#22c55e', fontSize: '0.9rem', marginBottom: '12px' }}>{notification}</p>}

            <div style={{ marginBottom: '16px' }}>
              {loadingLists ? <p style={{ color: 'var(--text-secondary)' }}>Loading lists...</p> : (
                myLists.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No lists found. Create one below.</p> : (
                  <select 
                    value={selectedListId} 
                    onChange={(e) => setSelectedListId(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  >
                    <option value="">Select a list...</option>
                    {myLists.map(list => (
                      <option key={list._id} value={list._id}>{list.name}</option>
                    ))}
                  </select>
                )
              )}
            </div>

            {showCreateForm ? (
              <div style={{ background: 'var(--bg-app)', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                <input type="text" placeholder="List Name" value={newListName} onChange={(e) => setNewListName(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)' }} />
                <input type="text" placeholder="Description (optional)" value={newListDesc} onChange={(e) => setNewListDesc(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleCreateNewList} disabled={creatingList} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>{creatingList ? 'Creating...' : 'Create List'}</button>
                  <button onClick={() => setShowCreateForm(false)} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowCreateForm(true)} className="btn-outline" style={{ width: '100%', padding: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem', borderStyle: 'dashed' }}>
                <FaPlus size={12} /> Create New List
              </button>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setShowModal(false)} className="btn-outline" style={{ padding: '10px 20px' }}>Cancel</button>
              <button onClick={handleAddQuestions} disabled={addingToList} className="btn-primary" style={{ padding: '10px 20px', opacity: addingToList ? 0.6 : 1 }}>
                {addingToList ? 'Adding...' : 'Add to Selected Lists'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;