// src/pages/PracticeQuestion.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api'; 
import { FaChevronLeft, FaLightbulb } from 'react-icons/fa6';
import { submitCode, testRunCode } from '../services/api';

const PracticeQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Get listId from state, OR fallback to localStorage (for page refreshes)
  const listId = location.state?.listId || localStorage.getItem('currentPracticeListId'); 
  const listName = location.state?.listName || localStorage.getItem('currentPracticeListName') || '';
  const totalQuestions = location.state?.totalQuestions || parseInt(localStorage.getItem('currentPracticeTotalQuestions')) || 0;
  const attemptedQuestionIds = location.state?.attemptedQuestionIds || [];

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [language, setLanguage] = useState('JavaScript (Node.js)');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isEvaluated, setIsEvaluated] = useState(false);

  const [activeTab, setActiveTab] = useState('description');
  const [hintsUsed, setHintsUsed] = useState(0); 

  // 2. FETCH QUESTION
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/questions/${questionId}`);
        setQuestion(response.data.question);
        setCode(`function solve() {\n    // Write your code here\n    \n}`);
        setError('');
        setIsEvaluated(false);
        setHintsUsed(0);
      } catch (err) {
        setError('Question not found');
      } finally {
        setLoading(false);
      }
    };

    if (questionId) {
      fetchQuestion();
    }
  }, [questionId]);

  // LANGUAGE MAP (Important!)
  const getLanguageCode = () => {
    if (language === 'Python') return 'python';
    if (language === 'Java') return 'java';
    return 'javascript'; // Default to javascript
  };

  // 3. RUN CODE (Corrected!)
  const handleRunCode = async () => {
    if (!question) return;

    setIsRunning(true);
    setError('');
    setTestResults(null); // Clear old results

    try {
      // FIX: Send 'sourceCode' not 'code', and do NOT send 'questionId'
      const response = await testRunCode({
        sourceCode: code,
        language: getLanguageCode(),
        stdin: '' 
      });

      // Show the result in a panel
      setTestResults({
        status: response.status,
        output: response.stdout,
        error: response.stderr
      });

    } catch (err) {
      setError('Failed to run code. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  // 4. SUBMIT CODE (Calls backend)
  const handleSubmit = async () => {
    if (!question) return;

    setIsSubmitting(true);
    setError('');

    try {
      const listId = localStorage.getItem('currentPracticeListId');
      const response = await submitCode({
        questionId: question._id,
        listId,
        sourceCode: code, // FIX: Send sourceCode, not code
        language: getLanguageCode() 
      });

      const result = response.submission;
      
      // Instead of alert(), set the results directly to the modal:
      setTestResults({
        status: result.status,
        passed: result.passedTests,
        total: result.totalTests,
        firstFailure: result.firstFailure || null
      });

    } catch (err) {
      setError('Submission failed. Please check syntax and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 7. NEXT QUESTION (with no repetition)
  const handleNextQuestion = async () => {
    if (listId) {
      const currentAttempted = [...attemptedQuestionIds, question._id.toString()];
      localStorage.setItem('currentPracticeAttemptedIds', JSON.stringify(currentAttempted));
      
      try {
        const listResponse = await api.get(`/lists/${listId}`);
        const remainingQuestions = listResponse.data.list.questions.filter(
          q => !currentAttempted.includes(q._id.toString())
        );

        if (remainingQuestions.length > 0) {
          const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
          const nextQuestion = remainingQuestions[randomIndex];
          
          localStorage.setItem('currentPracticeListId', listId);
          localStorage.setItem('currentPracticeListName', listName);
          localStorage.setItem('currentPracticeTotalQuestions', totalQuestions);
          
          navigate(`/practice/${nextQuestion._id}`, {
            state: {
              listId,
              listName,
              totalQuestions,
              attemptedQuestionIds: currentAttempted
            }
          });
        } else {
          alert(`🎉 Practice Complete! You have completed all ${totalQuestions} questions from ${listName}.`);
          localStorage.removeItem('currentPracticeListId');
          localStorage.removeItem('currentPracticeListName');
          localStorage.removeItem('currentPracticeTotalQuestions');
          localStorage.removeItem('currentPracticeAttemptedIds');
          navigate('/practice');
        }
      } catch (err) {
        alert('Unable to fetch next question.');
      }
    } else {
      navigate('/practice');
    }
  };

  const handleShowHint = () => {
    setHintsUsed(prev => Math.min(prev + 1, 3)); 
  };

  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return '#22c55e';
    if (diff === 'Medium') return '#eab308';
    return '#ef4444';
  };

  const examples = question?.examples || [];
  const constraints = question?.constraints || [];
  const hints = question?.hints || [];

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;
  if (error || !question) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <h2>Question Not Found</h2>
        <Link to="/questions" className="btn-primary" style={{ marginTop: '20px', textDecoration: 'none' }}>Back to Questions</Link>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', paddingBottom: '40px' }}>
      {/* TOP BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '16px' }}>
        <Link to="/lists" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontSize: '0.9rem' }}>
          <FaChevronLeft style={{ marginRight: '6px' }} /> Back to My Lists
        </Link>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Practice Mode - {listName} ({totalQuestions === 0 ? 1 : attemptedQuestionIds.length + 1}/{totalQuestions})
        </span>
        <span style={{ color: getDifficultyColor(question.difficulty), fontWeight: '600', fontSize: '0.85rem' }}>{question.difficulty}</span>
      </div>

      {/* MAIN GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)', gap: '24px' }}>
        
        {/* LEFT: QUESTION PANEL */}
        <div className="card-glow" style={{ padding: '24px' }}>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: '0 0 10px 0' }}>{question.title}</h1>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {question.tags?.map(tag => <span key={tag} style={{ padding: '2px 10px', borderRadius: '12px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tag}</span>)}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
            {['description', 'examples', 'constraints'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: 'transparent', border: 'none', paddingBottom: '8px', cursor: 'pointer', borderBottom: activeTab === tab ? '2px solid var(--accent-purple)' : 'none', color: activeTab === tab ? 'var(--accent-purple)' : 'var(--text-secondary)', textTransform: 'capitalize' }}>{tab}</button>
            ))}
          </div>

          {/* Content */}
          <div style={{ lineHeight: 1.6, color: 'var(--text-secondary)', overflowWrap: 'break-word' }}>
            {activeTab === 'description' && <p>{question.description}</p>}
            
            {activeTab === 'examples' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {examples.length === 0 ? <p>No examples available.</p> : 
                  examples.map((ex, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '16px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Example {idx + 1}</strong>
                      <div style={{ marginTop: '8px' }}><strong>Input:</strong> {ex.input}</div>
                      <div><strong>Output:</strong> {ex.output}</div>
                      {ex.explanation && <div style={{ marginTop: '4px' }}><strong>Explanation:</strong> {ex.explanation}</div>}
                    </div>
                  ))
                }
              </div>
            )}

            {activeTab === 'constraints' && (
              <div>
                {constraints.length === 0 ? <p>No constraints listed.</p> : 
                  constraints.map((c, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span>•</span> <span>{c}</span>
                    </div>
                  ))
                }
              </div>
            )}
          </div>

          {/* HINTS SECTION (MAX 3) */}
          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaLightbulb style={{ color: '#eab308' }} /> Need a Hint?
              </h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Hints used: {hintsUsed} / 3</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {hints.slice(0, hintsUsed).map((hint, idx) => (
                <div key={idx} style={{ padding: '12px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <strong style={{ color: 'var(--accent-purple)' }}>Hint {idx + 1}:</strong> {hint}
                </div>
              ))}
              {hints.length === 0 && hintsUsed === 0 && <p style={{ fontSize: '0.85rem' }}>Hints are not available for this question.</p>}
            </div>

            {hintsUsed < Math.min(hints.length, 3) && (
              <button onClick={handleShowHint} className="btn-primary" style={{ marginTop: '12px', padding: '8px 16px', fontSize: '0.85rem' }}>
                Show Hint {hintsUsed + 1}
              </button>
            )}
            {hintsUsed >= 3 && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>No more hints available.</p>}
          </div>
        </div>

        {/* RIGHT: CODE EDITOR */}
        <div className="card-glow" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '6px 12px', color: 'var(--text-primary)' }}>
              <option>JavaScript (Node.js)</option>
              <option>Python</option>
              <option>Java</option>
            </select>
            <button className="btn-outline" onClick={() => setCode(`function solve() {\n    // Write your code here\n    \n}`)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Reset</button>
          </div>
          
          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '16px', minHeight: '300px', fontFamily: 'monospace' }}>
            <textarea value={code} onChange={(e) => setCode(e.target.value)} style={{ width: '100%', minHeight: '280px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.9rem', lineHeight: 1.6, resize: 'vertical', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button onClick={handleRunCode} disabled={isRunning || isEvaluated} className="btn-outline" style={{ flex: 1, padding: '10px' }}>{isRunning ? 'Running...' : 'Run Code'}</button>
            <button onClick={handleSubmit} disabled={isSubmitting || isEvaluated} className="btn-primary" style={{ flex: 1, padding: '10px' }}>{isSubmitting ? 'Submitting...' : 'Submit'}</button>
          </div>

          {/* TEST RESULTS & NEXT QUESTION */}
          {testResults && (
            <div style={{ marginTop: '16px', padding: '16px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
              <h4 style={{ color: testResults.status === 'Accepted' ? '#22c55e' : '#ef4444', margin: '0 0 8px 0' }}>
                {testResults.status === 'Accepted' ? '✓ Test Passed' : '✗ Failed'}
              </h4>
              <pre style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', margin: 0 }}>
                {testResults.output || testResults.error}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeQuestion;