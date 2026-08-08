// src/pages/Questions.jsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaChevronDown, FaPlus } from 'react-icons/fa';

// Mock Data
const MOCK_QUESTIONS = [
  { id: 101, title: "Two Sum", topics: ["Array", "Hash Table"], difficulty: "Easy", platform: "LeetCode" },
  { id: 102, title: "Add Two Numbers", topics: ["Linked List", "Math"], difficulty: "Medium", platform: "LeetCode" },
  { id: 103, title: "Longest Substring Without Repeating Characters", topics: ["Hash Table", "String"], difficulty: "Medium", platform: "LeetCode" },
  { id: 104, title: "Median of Two Sorted Arrays", topics: ["Array", "Binary Search"], difficulty: "Hard", platform: "LeetCode" },
  { id: 105, title: "LRU Cache", topics: ["Design", "Hash Table", "DLL"], difficulty: "Hard", platform: "LeetCode" },
  { id: 106, title: "Valid Parentheses", topics: ["String", "Stack"], difficulty: "Easy", platform: "LeetCode" },
  { id: 107, title: "Merge Intervals", topics: ["Array", "Sorting"], difficulty: "Medium", platform: "LeetCode" },
];

const Questions = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ topic: 'All', difficulty: 'All', platform: 'All', status: 'All' });
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // --- FILTER LOGIC ---
  const filteredQuestions = useMemo(() => {
    return MOCK_QUESTIONS.filter(q => {
      const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
                            q.topics.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchesTopic = filters.topic === 'All' || q.topics.includes(filters.topic);
      const matchesDiff = filters.difficulty === 'All' || q.difficulty === filters.difficulty;
      const matchesPlatform = filters.platform === 'All' || q.platform === filters.platform;
      return matchesSearch && matchesTopic && matchesDiff && matchesPlatform;
    });
  }, [search, filters]);

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const currentData = filteredQuestions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- HANDLERS ---
  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(currentData.map(q => q.id));
    else setSelectedIds([]);
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  const handleAddToList = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one question.");
      return;
    }
    alert(`Added ${selectedIds.length} question(s) to list! (Mock Action)`);
    setSelectedIds([]);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '24px', paddingBottom: '40px' }}>
      
      {/* 1. PAGE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-subtle, #202838)', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>All Questions</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Search and filter questions</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{filteredQuestions.length} questions found</span>
          <button 
            onClick={handleAddToList}
            className="btn-primary" 
            style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FaPlus size={12} /> Add to List
          </button>
        </div>
      </div>

      {/* 2. SEARCH & FILTERS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', background: 'var(--bg-card, #0d121c)', border: '1px solid var(--border-subtle, #202838)', borderRadius: '8px', padding: '8px 12px' }}>
          <FaSearch style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
          <input 
            type="text" 
            placeholder="Search questions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '0.9rem' }} 
          />
        </div>
        
        {['topic', 'difficulty', 'platform', 'status'].map((key) => (
          <div key={key} style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--bg-card, #0d121c)', border: '1px solid var(--border-subtle, #202838)', borderRadius: '8px', padding: '8px 12px', minWidth: '110px' }}>
            <select 
              value={filters[key]}
              onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', appearance: 'none', width: '100%', cursor: 'pointer', fontSize: '0.85rem', paddingRight: '20px' }}
            >
              <option value="All">{key.charAt(0).toUpperCase() + key.slice(1)}</option>
              {key === 'topic' && ['Array', 'Hash Table', 'String', 'Linked List', 'Math', 'Binary Search', 'Stack', 'Sorting', 'Design'].map(t => <option key={t} value={t}>{t}</option>)}
              {key === 'difficulty' && ['Easy', 'Medium', 'Hard'].map(d => <option key={d} value={d}>{d}</option>)}
              {key === 'platform' && ['LeetCode', 'GeeksforGeeks', 'CodeChef'].map(p => <option key={p} value={p}>{p}</option>)}
              {key === 'status' && ['Solved', 'Attempted', 'Not Started'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <FaChevronDown size={10} style={{ position: 'absolute', right: '12px', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
          </div>
        ))}

        <button onClick={handleClearFilters} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          Clear Filters
        </button>
      </div>

      {/* 3. QUESTION TABLE */}
      <div className="card-glow" style={{ background: 'var(--bg-card, #0d121c)', border: '1px solid var(--border-subtle, #202838)', borderRadius: '12px', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle, #202838)' }}>
              <th style={{ padding: '16px', textAlign: 'left' }}>
                <input type="checkbox" onChange={toggleSelectAll} checked={currentData.length > 0 && selectedIds.length === currentData.length} style={{ accentColor: 'var(--accent-purple)', cursor: 'pointer' }} />
              </th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>#</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>Title</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>Topics</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>Difficulty</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>Platform</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((q, idx) => {
              const diffStyle = getDifficultyColor(q.difficulty);
              return (
                <tr key={q.id} style={{ borderBottom: '1px solid var(--border-subtle, #202838)', transition: 'background 0.2s' }} className="question-row-hover">
                  <td style={{ padding: '14px 16px' }}>
                    <input type="checkbox" checked={selectedIds.includes(q.id)} onChange={() => toggleSelectOne(q.id)} style={{ accentColor: 'var(--accent-purple)', cursor: 'pointer' }} />
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{idx + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <Link to={`/practice/${q.id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem' }} className="hover:underline">
                      {q.title}
                    </Link>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem', overflowWrap: 'break-word', wordBreak: 'break-word' }}>{q.topics.join(', ')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '2px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: diffStyle.bg, color: diffStyle.color }}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{q.platform}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <button className="btn-outline" style={{ padding: '4px 12px', fontSize: '0.75rem' }} onClick={() => handleAddToList()}>
                      + Add
                    </button>
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
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1}
            className="btn-outline" 
            style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            &lt;
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{ 
                padding: '6px 12px', 
                fontSize: '0.85rem', 
                borderRadius: '6px', 
                border: 'none',
                background: currentPage === i + 1 ? 'var(--accent-purple)' : 'transparent',
                color: currentPage === i + 1 ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
            disabled={currentPage === totalPages}
            className="btn-outline" 
            style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            &gt;
          </button>
        </div>
      )}

    </div>
  );
};

export default Questions;