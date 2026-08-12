// src/pages/Bookmarks.jsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBookmark as FaBookmarkSolid, 
  FaChevronRight, 
  FaMagnifyingGlass, 
  FaRegBookmark
} from 'react-icons/fa6';

// --- MOCK DATA (PRESERVED) ---
const INITIAL_BOOKMARKS = [
  { id: 1, title: "Two Sum", difficulty: "Easy", topics: ["Arrays", "Hash Map"], platform: "LeetCode", description: "Find two numbers in an array that add up to a target value.", bookmarkedAt: "2026-08-10T10:00:00" },
  { id: 2, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topics: ["Strings", "Sliding Window"], platform: "LeetCode", description: "Find the length of the longest substring without repeating characters.", bookmarkedAt: "2026-08-09T14:30:00" },
  { id: 3, title: "Median of Two Sorted Arrays", difficulty: "Hard", topics: ["Arrays", "Binary Search"], platform: "LeetCode", description: "Find the median of two sorted arrays in O(log(m+n)) time.", bookmarkedAt: "2026-08-08T09:15:00" },
  { id: 4, title: "Valid Parentheses", difficulty: "Easy", topics: ["Stack", "Strings"], platform: "LeetCode", description: "Check if a string containing parentheses is valid.", bookmarkedAt: "2026-08-07T16:45:00" },
  { id: 5, title: "Merge Two Sorted Lists", difficulty: "Easy", topics: ["Linked List"], platform: "LeetCode", description: "Merge two sorted linked lists into one sorted list.", bookmarkedAt: "2026-08-06T11:20:00" },
  { id: 6, title: "Number of Islands", difficulty: "Medium", topics: ["Graphs", "BFS", "DFS"], platform: "LeetCode", description: "Count the number of islands in a 2D grid.", bookmarkedAt: "2026-08-05T08:00:00" },
  { id: 7, title: "Longest Increasing Subsequence", difficulty: "Medium", topics: ["Dynamic Programming", "Binary Search"], platform: "LeetCode", description: "Find the length of the longest increasing subsequence.", bookmarkedAt: "2026-08-04T13:10:00" },
  { id: 8, title: "LRU Cache", difficulty: "Medium", topics: ["Hash Map", "Linked List"], platform: "LeetCode", description: "Design a data structure that follows the restrictions of Least Recently Used (LRU) cache.", bookmarkedAt: "2026-08-03T17:30:00" },
];

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState(INITIAL_BOOKMARKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [topicFilter, setTopicFilter] = useState('All Topics');
  const [difficultyFilter, setDifficultyFilter] = useState('All Difficulties');
  const [sortBy, setSortBy] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- FILTERING LOGIC (PRESERVED) ---
  const filteredBookmarks = useMemo(() => {
    let data = bookmarks;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(q => 
        q.title.toLowerCase().includes(term) ||
        q.description.toLowerCase().includes(term) ||
        q.topics.some(t => t.toLowerCase().includes(term)) ||
        q.platform.toLowerCase().includes(term)
      );
    }
    if (topicFilter !== 'All Topics') data = data.filter(q => q.topics.includes(topicFilter));
    if (difficultyFilter !== 'All Difficulties') data = data.filter(q => q.difficulty === difficultyFilter);
    
    data.sort((a, b) => {
      if (sortBy === 'Newest') return new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt);
      if (sortBy === 'Oldest') return new Date(a.bookmarkedAt) - new Date(b.bookmarkedAt);
      if (sortBy === 'Difficulty') {
        const order = { Easy: 1, Medium: 2, Hard: 3 };
        return order[a.difficulty] - order[b.difficulty];
      }
      return 0;
    });
    return data;
  }, [bookmarks, searchTerm, topicFilter, difficultyFilter, sortBy]);

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredBookmarks.length / itemsPerPage);
  const currentData = filteredBookmarks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- HANDLERS (PRESERVED) ---
  const handleRemoveBookmark = (e, id) => {
    e.stopPropagation();
    setBookmarks(prev => prev.filter(q => q.id !== id));
    if (currentData.length === 1 && currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setTopicFilter('All Topics');
    setDifficultyFilter('All Difficulties');
    setSortBy('Newest');
    setCurrentPage(1);
  };

  // --- HELPERS ---
  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' };
    if (diff === 'Medium') return { color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' };
    return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
  };

  // --- EMPTY STATE ---
  if (bookmarks.length === 0) {
    return (
      <div style={styles.pageContainer}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px', color: 'var(--text-primary)' }}>
          <FaRegBookmark size={48} style={{ color: 'var(--text-secondary)' }} />
          <h2 style={{ margin: 0 }}>No bookmarks yet</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Save questions you want to revisit later.</p>
          <Link to="/questions" className="btn-primary" style={{ padding: '10px 24px', textDecoration: 'none' }}>Browse Questions</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      
      {/* 1. PAGE HEADER & SEPARATOR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px', marginBottom: '22px' }}>
        <div>
          <h1 style={styles.heading}>8. Bookmarks</h1>
          <p style={styles.subtitle}>Questions you've saved to revisit later.</p>
        </div>
        <Link to="/practice" className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.9rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Practice Now
        </Link>
      </div>

      {/* 2. SEARCH & FILTER TOOLBAR (Compound UI) */}
      <div style={styles.toolbarContainer}>
        <div style={{ flex: 1, minWidth: '150px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', marginBottom: '10px' }}>
          <FaMagnifyingGlass style={{ color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search bookmarked questions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput} 
          />
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)} style={styles.select}>
            <option>All Topics</option>
            {['Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Trees', 'Graphs', 'Dynamic Programming'].map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} style={styles.select}>
            <option>All Difficulties</option>
            <option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
            <option>Newest</option><option>Oldest</option><option>Difficulty</option>
          </select>
          <button onClick={handleClearFilters} className="btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Clear</button>
        </div>
      </div>

      {/* 3. SUMMARY & PAGINATION TEXT */}
      <div style={styles.summaryBar}>
        <span style={styles.summaryCount}>{filteredBookmarks.length} Bookmarked Questions</span>
        {filteredBookmarks.length > 0 && (
          <span style={styles.summarySecondary}>Showing {currentData.length} of {filteredBookmarks.length}</span>
        )}
      </div>

      {/* 4. BOOKMARK LIST ROWS */}
      {currentData.length === 0 ? (
        <div style={styles.noResults}>
          <p style={{ margin: '0 0 4px 0', color: 'var(--text-primary)' }}>No bookmarked questions found</p>
          <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-secondary)' }}>Try changing your search or filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentData.map((q) => {
            const diffStyle = getDifficultyColor(q.difficulty);
            return (
              <Link key={q.id} to={`/practice/${q.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="card-glow" style={styles.questionCard}>
                  
                  {/* Left: Content (Flex: 1, min-width: 0 to prevent overflow) */}
                  <div style={styles.cardContent}>
                    <div style={styles.cardTitle}>{q.title}</div>
                    <div style={styles.cardDesc}>{q.description}</div>
                    <div style={styles.cardTags}>
                      {q.topics.map(topic => (
                        <span key={topic} style={styles.tag}>{topic}</span>
                      ))}
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                        • {q.platform}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div style={styles.cardActions}>
                    <span style={{ ...styles.difficultyPill, color: diffStyle.color, backgroundColor: diffStyle.bg }}>
                      {q.difficulty}
                    </span>
                    <button 
                      onClick={(e) => handleRemoveBookmark(e, q.id)}
                      style={styles.bookmarkBtn}
                      aria-label="Remove bookmark"
                    >
                      <FaBookmarkSolid style={{ color: 'var(--accent-purple)' }} />
                    </button>
                    <div style={styles.arrowIcon}>
                      <FaChevronRight />
                    </div>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* 5. PAGINATION */}
      {totalPages > 1 && (
        <div style={styles.paginationWrapper}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-outline" style={styles.paginationBtn}>
            ←
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} style={{ ...styles.paginationBtn, background: currentPage === i + 1 ? 'var(--accent-purple)' : 'transparent', color: currentPage === i + 1 ? '#fff' : 'var(--text-secondary)' }}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn-outline" style={styles.paginationBtn}>
            →
          </button>
        </div>
      )}
    </div>
  );
};

// --- EXTERNALIZED STYLES (FOR CLEANER JSX) ---
const styles = {
  pageContainer: {
    width: '100%',
    maxWidth: '1500px',
    margin: '0 auto',
    padding: '28px 32px 40px',
    boxSizing: 'border-box',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: '0 0 4px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: 0
  },
  toolbarContainer: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '24px'
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    outline: 'none',
    width: '100%',
    fontSize: '0.9rem'
  },
  select: {
    background: 'var(--bg-app)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '8px',
    padding: '6px 10px',
    color: 'var(--text-primary)',
    outline: 'none',
    fontSize: '0.85rem',
    cursor: 'pointer',
    minWidth: '100px'
  },
  summaryBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
    borderBottom: '1px solid transparent' // Prevents layout shift
  },
  summaryCount: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  summarySecondary: {
    fontSize: '13px',
    color: 'var(--text-secondary)'
  },
  noResults: {
    textAlign: 'center',
    padding: '40px 0',
    color: 'var(--text-secondary)'
  },
  questionCard: {
    padding: '17px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  cardTitle: {
    color: 'var(--text-primary)',
    fontWeight: '650',
    fontSize: '15px',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
    marginBottom: '6px'
  },
  cardDesc: {
    color: 'var(--text-secondary)',
    fontSize: '13px',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    marginBottom: '10px'
  },
  cardTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    alignItems: 'center'
  },
  tag: {
    background: 'rgba(124, 77, 255, 0.08)',
    border: '1px solid rgba(124, 77, 255, 0.18)',
    borderRadius: '999px',
    padding: '4px 9px',
    fontSize: '11px',
    color: 'var(--text-secondary)'
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    flexShrink: 0
  },
  difficultyPill: {
    padding: '5px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: '600'
  },
  bookmarkBtn: {
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    borderRadius: '7px',
    cursor: 'pointer',
    transition: 'background 0.2s ease'
  },
  arrowIcon: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    transition: 'color 0.2s ease'
  },
  paginationWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: '24px'
  },
  paginationBtn: {
    padding: '6px 12px',
    fontSize: '0.85rem',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

// Note: To apply the hover states exactly as requested, 
// add this to your global CSS (e.g., index.css):
// 
// .card-glow:hover {
//   border-color: rgba(124, 77, 255, 0.55) !important;
//   background: rgba(255, 255, 255, 0.03);
//   transform: translateY(-1px);
// }
// .card-glow:hover div:last-child > div:last-child { color: var(--accent-purple) !important; }
// .card-glow:hover div:last-child > button { background: rgba(124, 77, 255, 0.12) !important; }

export default Bookmarks;