// src/pages/PracticeQuestion.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api'; 
import { FaChevronLeft, FaLightbulb } from 'react-icons/fa6';
import { FaCheckCircle, FaTimesCircle, FaTrophy } from 'react-icons/fa';
import { submitCode, runCode } from '../services/api';

const PracticeQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

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

  const [activeTab, setActiveTab] = useState('description');
  const [hintsUsed, setHintsUsed] = useState(0); 
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const getStarterCode = (lang, q) => {
    if (!q) return '';
    if (lang === 'JavaScript (Node.js)') return `const fs = require('fs');\n\nconst input = fs.readFileSync(0, 'utf-8').trim();\n\n// Write your logic here\nconsole.log("your output here");`;
    if (lang === 'Python') return `import sys\n\ninput_data = sys.stdin.read().strip()\n\n# Write your logic here\nprint("your output here")`;
    if (lang === 'Java') return `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your logic here\n        System.out.println("your output here");\n    }\n}`;
    return '';
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/questions/${questionId}`);
        const q = response.data.question;
        setQuestion(q);
        setCode(getStarterCode('JavaScript (Node.js)', q));
        setLanguage('JavaScript (Node.js)');
        setError('');
        setHintsUsed(0);
        setTestResults(null);
      } catch (err) {
        setError('Question not found');
      } finally {
        setLoading(false);
      }
    };
    if (questionId) fetchQuestion();
  }, [questionId]);

  const handleRunCode = async () => {
    if (!question) return;
    setIsRunning(true);
    setError('');
    setTestResults(null);
    try {
      const response = await runCode({ questionId: question._id, language, sourceCode: code });
      if (!response.success) {
        setError(response.message || 'Failed to run code.');
        return;
      }
      setTestResults({
        mode: 'run', status: response.status, isCorrect: response.status === 'Accepted',
        passed: response.passed, total: response.total, testResults: response.testResults || []
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to run code. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!question) return;
    setIsSubmitting(true);
    setError('');
    try {
      const storedListId = localStorage.getItem('currentPracticeListId');
      const response = await submitCode({ questionId: question._id, listId: storedListId || null, language, sourceCode: code });
      if (!response.success) {
        setError(response.message || 'Submission failed.');
        return;
      }
      const result = response.submission;
      setTestResults({
        mode: 'submit', status: result.status, isCorrect: result.isCorrect,
        passed: result.passedTests, total: result.totalTests, firstFailure: result.firstFailure || null
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    setTestResults(null);
    if (!listId || !question) { navigate('/practice'); return; }

    const currentAttempted = [...attemptedQuestionIds, question._id.toString()];
    localStorage.setItem('currentPracticeAttemptedIds', JSON.stringify(currentAttempted));

    try {
      const listResponse = await api.get(`/lists/${listId}`);
      const remainingQuestions = listResponse.data.list.questions.filter(q => !currentAttempted.includes(q._id.toString()));

      if (remainingQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
        const nextQuestion = remainingQuestions[randomIndex];
        localStorage.setItem('currentPracticeListId', listId);
        localStorage.setItem('currentPracticeListName', listName);
        localStorage.setItem('currentPracticeTotalQuestions', totalQuestions);
        navigate(`/practice/${nextQuestion._id}`, {
          state: { listId, listName, totalQuestions, attemptedQuestionIds: currentAttempted }
        });
      } else {
        setShowCompletionModal(true);
      }
    } catch (err) {
      alert('Unable to fetch next question.');
    }
  };

  const handleFinishPractice = () => {
    localStorage.removeItem('currentPracticeListId');
    localStorage.removeItem('currentPracticeListName');
    localStorage.removeItem('currentPracticeTotalQuestions');
    localStorage.removeItem('currentPracticeAttemptedIds');
    navigate('/practice');
  };

  const handleShowHint = () => setHintsUsed(prev => Math.min(prev + 1, 3));

  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return '#22c55e';
    if (diff === 'Medium') return '#eab308';
    return '#ef4444';
  };

  const examples = question?.examples || [];
  const constraints = question?.constraints || [];
  const hints = question?.hints || [];

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;
  if (error && !question) return <div style={{ textAlign: 'center', padding: '60px' }}><h2>Question Not Found</h2><Link to="/questions" className="btn-primary" style={{ marginTop: '20px' }}>Back to Questions</Link></div>;

  return (
    <div style={{ width: '100%', paddingBottom: '40px' }}>
      {/* TOP BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <Link to="/lists" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
          <FaChevronLeft style={{ marginRight: '6px' }} /> Back
        </Link>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {listName ? `${listName} (${totalQuestions === 0 ? 1 : attemptedQuestionIds.length + 1}/${totalQuestions})` : 'Practice Mode'}
        </span>
        <span style={{ color: getDifficultyColor(question.difficulty), fontWeight: '600', fontSize: '0.85rem' }}>{question.difficulty}</span>
      </div>

      {/* MAIN GRID */}
      <div className="practice-workspace">
        
        {/* LEFT: QUESTION PANEL */}
        <div className="card-glow" style={{ padding: '24px' }}>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: '0 0 12px 0' }}>{question.title}</h1>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {question.tags?.map(tag => <span key={tag} style={{ padding: '4px 10px', borderRadius: '12px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tag}</span>)}
          </div>

          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
            {['description', 'examples', 'constraints'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: 'transparent', border: 'none', paddingBottom: '8px', cursor: 'pointer', borderBottom: activeTab === tab ? '2px solid var(--accent-purple)' : 'none', color: activeTab === tab ? 'var(--accent-purple)' : 'var(--text-secondary)', textTransform: 'capitalize', fontWeight: 500 }}>{tab}</button>
            ))}
          </div>

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
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                      <span>•</span> <span>{c}</span>
                    </div>
                  ))
                }
              </div>
            )}
          </div>

          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaLightbulb style={{ color: '#eab308' }} /> Need a Hint?
              </h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{hintsUsed} / 3 used</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {hints.slice(0, hintsUsed).map((hint, idx) => (
                <div key={idx} style={{ padding: '12px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                  <strong style={{ color: 'var(--accent-purple)' }}>Hint {idx + 1}:</strong> {hint}
                </div>
              ))}
              {hints.length === 0 && hintsUsed === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Hints are not available for this question.</p>}
            </div>

            {hintsUsed < Math.min(hints.length, 3) && (
              <button onClick={handleShowHint} className="btn-outline" style={{ marginTop: '16px', padding: '8px 16px', fontSize: '0.85rem' }}>
                Reveal Hint {hintsUsed + 1}
              </button>
            )}
            {hintsUsed >= 3 && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>No more hints available.</p>}
          </div>
        </div>

        {/* RIGHT: CODE EDITOR */}
        <div className="card-glow" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <select 
              value={language} 
              onChange={(e) => { setLanguage(e.target.value); setCode(getStarterCode(e.target.value, question)); }} 
              style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '8px 12px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
            >
              <option>JavaScript (Node.js)</option>
              <option>Python</option>
              <option>Java</option>
            </select>
            <button className="btn-outline" onClick={() => setCode(getStarterCode(language, question))} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Reset Code</button>
          </div>
          
          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '16px', flexGrow: 1, display: 'flex' }}>
            <textarea 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              style={{ width: '100%', minHeight: '300px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: 1.6, resize: 'vertical', outline: 'none' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button onClick={handleRunCode} disabled={isRunning} className="btn-outline" style={{ flex: 1, padding: '12px' }}>{isRunning ? 'Running...' : 'Run Code'}</button>
            <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary" style={{ flex: 1, padding: '12px' }}>{isSubmitting ? 'Submitting...' : 'Submit'}</button>
          </div>

          {error && question && (
            <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          RE-DESIGNED TEST RESULTS MODAL
          ======================================================== */}
                {/* ========================================================
              LEETCODE-STYLE TEST RESULTS MODAL
              ======================================================== */}
          {testResults && (
            <div style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
            }}>
              <div 
                className="custom-scrollbar"
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                  borderRadius: '12px', padding: '32px', maxWidth: '850px', width: '100%', maxHeight: '90vh', 
                  overflowY: 'auto', color: 'var(--text-primary)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                }}
              >
                {/* MODAL HEADER */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  {testResults.isCorrect ? <FaCheckCircle style={{ color: 'var(--success)', fontSize: '2rem' }} /> : <FaTimesCircle style={{ color: 'var(--danger)', fontSize: '2rem' }} />}
                  <h2 style={{ margin: 0, color: testResults.isCorrect ? 'var(--success)' : 'var(--danger)', fontSize: '1.75rem', fontWeight: '600' }}>
                    {testResults.isCorrect ? 'Accepted' : testResults.status}
                  </h2>
                </div>
                
                <p style={{ marginTop: '0', color: 'var(--text-secondary)', fontSize: '0.95rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px' }}>
                  You passed <strong style={{ color: 'var(--text-primary)' }}>{testResults.passed}</strong> out of <strong style={{ color: 'var(--text-primary)' }}>{testResults.total}</strong> test cases.
                </p>

                {/* INDIVIDUAL TEST CASES */}
                {testResults.testResults && testResults.testResults.length > 0 && (
                  <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {testResults.testResults.map((t, idx) => (
                      <div key={idx}>
                        {/* Case Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <strong style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '600' }}>Case {t.testCase}</strong>
                          <span style={{
                            fontSize: '0.85rem', fontWeight: 600, color: t.passed ? 'var(--success)' : 'var(--danger)',
                            padding: '4px 12px', borderRadius: '999px', background: t.passed ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'
                          }}>
                            {t.passed ? 'Passed' : 'Failed'}
                          </span>
                        </div>

                        {/* Input & Output (LeetCode Style) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-app)', padding: '20px', borderRadius: '8px' }}>
                          
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Input</span>
                            <pre style={{ margin: '8px 0 0 0', padding: '0', background: 'transparent', fontSize: '0.95rem', fontFamily: 'monospace', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                              {t.input || '(no input)'}
                            </pre>
                          </div>
                          
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Output</span>
                            <pre style={{ margin: '8px 0 0 0', padding: '0', background: 'transparent', fontSize: '0.95rem', fontFamily: 'monospace', color: t.passed ? 'var(--text-primary)' : '#fca5a5', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                              {t.actualOutput || '(empty)'}
                            </pre>
                          </div>

                          {!t.passed && t.expectedOutput && (
                            <div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Expected</span>
                              <pre style={{ margin: '8px 0 0 0', padding: '0', background: 'transparent', fontSize: '0.95rem', fontFamily: 'monospace', color: 'var(--success)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                {t.expectedOutput}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* SUBMIT FAILURE DETAILS */}
                {testResults.mode === 'submit' && testResults.firstFailure && !testResults.isCorrect && (
                  <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(239,68,68,0.05)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <strong style={{ color: 'var(--danger)', fontSize: '0.95rem' }}>
                      Failed on Test Case {testResults.firstFailure.testCase} {testResults.firstFailure.hidden && '(Hidden)'}
                    </strong>
                    {!testResults.firstFailure.hidden && (
                      <div style={{ marginTop: '12px', fontSize: '0.9rem' }}>
                        <div><span style={{ color: 'var(--text-secondary)' }}>Expected: </span><span style={{ fontFamily: 'monospace', color: 'var(--success)' }}>{testResults.firstFailure.expectedOutput}</span></div>
                        <div style={{ marginTop: '4px' }}><span style={{ color: 'var(--text-secondary)' }}>Got: </span><span style={{ fontFamily: 'monospace', color: '#fca5a5' }}>{testResults.firstFailure.actualOutput}</span></div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => {
                    if (testResults.mode === 'submit' && testResults.isCorrect) handleNextQuestion();
                    else setTestResults(null);
                  }}
                  className="btn-primary"
                  style={{ marginTop: '32px', width: '100%', padding: '14px', fontSize: '1rem', fontWeight: '600', borderRadius: '8px' }}
                >
                  {testResults.mode === 'submit' && testResults.isCorrect ? 'Proceed to Next Question' : 'Close Results'}
                </button>
              </div>
            </div>
          )}
    </div>
  );
};

export default PracticeQuestion;