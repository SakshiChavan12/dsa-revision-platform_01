
// src/pages/MyLists.jsx
import { Link } from 'react-router-dom';

// POPULATED MOCK DATA (Shows exactly how it looks with content)
const MOCK_LISTS = [
  {
    id: 1,
    name: "Blind 75 - My List",
    count: 25,
    questions: [
      { id: 101, title: "Two Sum", difficulty: "Easy" },
      { id: 102, title: "Add Two Numbers", difficulty: "Medium" },
      { id: 103, title: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
      { id: 104, title: "Median of Two Sorted Arrays", difficulty: "Hard" },
      { id: 105, title: "LRU Cache", difficulty: "Hard" },
      { id: 106, title: "Valid Parentheses", difficulty: "Easy" },
    ]
  },
  {
    id: 2,
    name: "Graphs & Trees",
    count: 12,
    questions: [
      { id: 201, title: "Clone Graph", difficulty: "Medium" },
      { id: 202, title: "Binary Tree Level Order Traversal", difficulty: "Medium" },
      { id: 203, title: "Number of Islands", difficulty: "Medium" },
      { id: 204, title: "Course Schedule", difficulty: "Hard" },
    ]
  },
  {
    id: 3,
    name: "Dynamic Programming",
    count: 8,
    questions: [
      { id: 301, title: "Climbing Stairs", difficulty: "Easy" },
      { id: 302, title: "House Robber", difficulty: "Medium" },
      { id: 303, title: "Coin Change", difficulty: "Medium" },
    ]
  }
];

const MyLists = () => {
  return (
    <div className="my-lists-wrapper" style={{ width: '100%', padding: '24px', maxWidth: '1200px', margin: '0 auto', marginTop: '20px' }}>
      
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

      {/* LISTS GRID (Auto-responsive grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {MOCK_LISTS.map((list) => (
          <div key={list.id} className="card-glow" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            
            {/* Card Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ color: 'var(--text-primary)', margin: '0', fontWeight: '600' }}>{list.name}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.875rem' }}>{list.count} questions</p>
              </div>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.25rem', cursor: 'pointer' }}>
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </button>
            </div>

            {/* Questions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1, marginBottom: '16px' }}>
              {list.questions.map((q, idx) => (
                <Link 
                  key={idx} 
                  to={`/practice/${q.id}`}
                  style={{ textDecoration: 'none' }} 
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '8px 12px', 
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }} 
                  className="question-row-hover">
                    
                    {/* Title */}
                    <span style={{ 
                      color: 'var(--text-primary)', 
                      fontSize: '0.9375rem',
                      overflowWrap: 'break-word', 
                      wordBreak: 'break-word',
                      flex: 1,
                      paddingRight: '16px'
                    }}>
                      {q.title}
                    </span>

                    {/* Badge */}
                    <span style={{
                      padding: '2px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      flexShrink: 0,
                      backgroundColor: q.difficulty === 'Easy' ? 'rgba(34, 197, 94, 0.2)' : 
                                       q.difficulty === 'Medium' ? 'rgba(234, 179, 8, 0.2)' : 
                                       'rgba(239, 68, 68, 0.2)',
                      color: q.difficulty === 'Easy' ? '#22c55e' : 
                             q.difficulty === 'Medium' ? '#eab308' : 
                             '#ef4444'
                    }}>
                      {q.difficulty}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Add Question Button */}
            <button style={{
              background: 'transparent',
              border: '1px dashed var(--border-subtle)',
              borderRadius: '8px',
              padding: '12px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }} className="add-question-btn">
              <i className="fa-regular fa-plus"></i> Add Question
            </button>
          </div>
        ))}
      </div>

      {/* Import from LeetCode */}
      <div style={{ marginTop: '12px' }}>
        <button style={{
          background: 'transparent',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '10px 24px',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'all 0.2s'
        }} className="import-leetcode-btn">
          <i className="fa-solid fa-arrow-right-to-bracket"></i> Import from LeetCode
        </button>
      </div>

    </div>
  );
};

export default MyLists;