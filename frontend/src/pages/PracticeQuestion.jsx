// src/pages/PracticeQuestion.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQuestionById, QUESTIONS } from '../data/questions';

// --- THE COMPONENT ---
const PracticeQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  
  const [language, setLanguage] = useState('JavaScript (Node.js)');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [hintLevel, setHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Fetch question data based on URL param
  const question = getQuestionById(questionId);
  const allIds = QUESTIONS.map(q => q.id);
  const currentIndex = allIds.indexOf(parseInt(questionId));

  // Reset state when question changes
  useEffect(() => {
    if (question) {
      setCode(question.starterCode);
      setTestResults(null);
      setHintLevel(0);
      setShowSolution(false);
      setActiveTab('description');
    }
  }, [question]);

  // --- HANDLERS ---
  const handleRunCode = () => {
    setIsRunning(true);
    // Mocking API delay
    setTimeout(() => {
      setTestResults([
        { id: 1, status: 'Passed', input: '[2,7,11,15], 9', expected: '[0,1]', output: '[0,1]' },
        { id: 2, status: 'Failed', input: '[3,2,4], 6', expected: '[1,2]', output: '[0,2]' },
        { id: 3, status: 'Not Run', input: '[3,3], 6', expected: '[0,1]', output: '-' }
      ]);
      setIsRunning(false);
    }, 1200);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      alert('All test cases passed! ✅\nYou have successfully solved this problem.');
      setIsSubmitting(false);
    }, 1000);
  };

  const handleReset = () => {
    if (question) setCode(question.starterCode);
  };

  const handleGetHint = () => {
    if (hintLevel < question.hints.length) {
      setHintLevel(prev => prev + 1);
    }
  };

  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return '#22c55e';
    if (diff === 'Medium') return '#eab308';
    return '#ef4444';
  };

  // Handle 404
  if (!question) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: '16px', color: 'var(--text-primary)' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Question Not Found</h1>
        <p style={{ color: 'var(--text-secondary)' }}>The requested question does not exist.</p>
        <Link to="/lists" className="btn-primary" style={{ padding: '10px 24px', textDecoration: 'none' }}>Back to My Lists</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', maxWidth: '1400px', margin: '0 auto', gap: '16px', paddingBottom: '32px' }}>
      
      {/* 1. SECONDARY PRACTICE BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/lists" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="fa-solid fa-arrow-left"></i> Back to My Lists
          </Link>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Practice Mode <span style={{ color: 'var(--text-primary)' }}>Question {currentIndex + 1} / {QUESTIONS.length}</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: getDifficultyColor(question.difficulty), fontWeight: 600, fontSize: '0.85rem' }}>{question.difficulty}</span>
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)} 
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            style={{ background: 'transparent', border: 'none', color: isBookmarked ? '#eab308' : 'var(--text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            <i className={isBookmarked ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
          </button>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)', gap: '24px', flex: 1 }}>
        
        {/* LEFT PANEL: Question */}
        <div className="card-glow" style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '16px' }}>
            <div>
              <h2 style={{ color: 'var(--text-primary)', margin: '0 0 8px 0', fontSize: '1.5rem' }}>{question.title}</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                {question.topics.map(topic => (
                  <span key={topic} style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '2px 10px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{topic}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
            {['description', 'examples', 'constraints'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  padding: '0 0 8px 0', 
                  color: activeTab === tab ? 'var(--accent-purple)' : 'var(--text-secondary)', 
                  borderBottom: activeTab === tab ? '2px solid var(--accent-purple)' : 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                  textTransform: 'capitalize'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, overflowY: 'auto', flex: 1, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
            {activeTab === 'description' && (
              <div>
                {question.description.split('\n').map((line, i) => <p key={i} style={{ margin: '0 0 12px 0' }}>{line}</p>)}
              </div>
            )}
            {activeTab === 'examples' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {question.examples.map((ex, i) => (
                  <div key={i} style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px 16px' }}>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Example {i+1}:</strong>
                    <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}><span style={{ color: 'var(--text-secondary)' }}>Input:</span> {ex.input}</div>
                    <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}><span style={{ color: 'var(--text-secondary)' }}>Output:</span> {ex.output}</div>
                    {ex.explanation && <div style={{ fontSize: '0.9rem' }}><span style={{ color: 'var(--text-secondary)' }}>Explanation:</span> {ex.explanation}</div>}
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'constraints' && (
              <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                {question.constraints.map((c, i) => <div key={i} style={{ padding: '2px 0' }}>• {c}</div>)}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Code Editor */}
        <div className="card-glow" style={{ padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '12px' }}>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '6px', padding: '4px 8px', fontSize: '0.85rem' }}
            >
              <option>JavaScript (Node.js)</option>
              <option>Python</option>
              <option>Java</option>
            </select>
            <button onClick={handleReset} className="btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Reset</button>
          </div>

          {/* Mock Code Editor */}
          <div style={{ flex: 1, background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.6, overflow: 'auto', minHeight: '300px' }}>
            <textarea 
              value={code} 
              onChange={(e) => setCode(e.target.value)}
              style={{ width: '100%', height: '100%', minHeight: '280px', background: 'transparent', border: 'none', color: 'var(--text-primary)', resize: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button onClick={handleRunCode} disabled={isRunning} className="btn-outline" style={{ flex: 1, padding: '10px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              {isRunning ? <i className="fa-solid fa-spinner fa-spin"></i> : <><i className="fa-solid fa-play"></i> Run Code</>}
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary" style={{ flex: 1, padding: '10px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              {isSubmitting ? <i className="fa-solid fa-spinner fa-spin"></i> : <><i className="fa-solid fa-check"></i> Submit</>}
            </button>
          </div>

          {/* Test Results */}
          {testResults && (
            <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <h4 style={{ color: 'var(--text-primary)', margin: '0 0 8px 0', fontSize: '0.9rem' }}>Test Results</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {testResults.map((t) => (
                  <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--bg-app)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: t.status === 'Passed' ? '#22c55e' : t.status === 'Failed' ? '#ef4444' : 'var(--text-secondary)' }}>
                        <i className={t.status === 'Passed' ? "fa-solid fa-circle-check" : t.status === 'Failed' ? "fa-solid fa-circle-xmark" : "fa-regular fa-circle"}></i>
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>Test Case {t.id}</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <span style={{ color: 'var(--text-primary)' }}>In:</span> {t.input}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <span style={{ color: 'var(--text-primary)' }}>Out:</span> {t.output} 
                      {t.status === 'Failed' && <span style={{ color: '#ef4444', marginLeft: '8px' }}>(Expected: {t.expected})</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. HINTS & SOLUTION & NAVIGATION SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '8px' }}>
        
        {/* HINTS */}
        <div className="card-glow" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '16px' }}>
            <h4 style={{ color: 'var(--text-primary)', margin: 0 }}><i className="fa-regular fa-lightbulb" style={{ marginRight: '8px', color: '#eab308' }}></i> Need a Hint?</h4>
            <button onClick={handleGetHint} disabled={hintLevel >= question.hints.length} className="btn-primary" style={{ padding: '4px 16px', fontSize: '0.8rem' }}>Get Hint</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {question.hints.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-subtle)', opacity: i < hintLevel ? 1 : 0.5 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: i < hintLevel ? 'var(--accent-purple)' : 'var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: i < hintLevel ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {i < hintLevel ? h : `Hint ${i+1} is locked. Click "Get Hint" to unlock.`}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SOLUTION & NAVIGATION */}
        <div className="card-glow" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '16px' }}>
              <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>Solution</h4>
              <button onClick={() => setShowSolution(!showSolution)} className="btn-primary" style={{ padding: '4px 16px', fontSize: '0.8rem' }}>
                {showSolution ? 'Hide' : 'View Solution'}
              </button>
            </div>
            {showSolution && (
              <div>
                <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#a5b3ce', overflowX: 'auto' }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{question.solutionCode}</pre>
                </div>
                <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <p style={{ margin: '2px 0' }}><span style={{ fontWeight: 'bold' }}>Time Complexity:</span> {question.timeComplexity}</p>
                  <p style={{ margin: '2px 0' }}><span style={{ fontWeight: 'bold' }}>Space Complexity:</span> {question.spaceComplexity}</p>
                </div>
              </div>
            )}
          </div>

          {/* Prev / Next Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '16px' }}>
            <button 
              onClick={() => navigate(`/practice/${allIds[currentIndex - 1]}`)}
              disabled={currentIndex <= 0}
              className="btn-outline"
              style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', opacity: currentIndex <= 0 ? 0.5 : 1 }}
            >
              <i className="fa-solid fa-arrow-left"></i> Previous
            </button>
            <button 
              onClick={() => navigate(`/practice/${allIds[currentIndex + 1]}`)}
              disabled={currentIndex >= allIds.length - 1}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', opacity: currentIndex >= allIds.length - 1 ? 0.5 : 1 }}
            >
              Next <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PracticeQuestion;