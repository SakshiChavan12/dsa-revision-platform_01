import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaListCheck, FaShuffle, FaCode, FaBrain, FaChartLine, FaBookOpen } from 'react-icons/fa6';

const Landing = () => {
  // Simple live counter effect for the stats section
  const [solvedCount, setSolvedCount] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    // Animate numbers on mount
    const interval = setInterval(() => {
      setSolvedCount(prev => prev < 127 ? prev + 3 : 127);
      setAccuracy(prev => prev < 77.8 ? prev + 1.8 : 77.8);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* =========================================
          HERO SECTION
          ========================================= */}
      <section style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 60px' }}>
        {/* Background Ambient Glow */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '60vw', height: '400px', background: 'var(--accent-glow)', filter: 'blur(120px)', opacity: 0.4, zIndex: 0, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(124, 77, 255, 0.1)', border: '1px solid rgba(124, 77, 255, 0.3)', borderRadius: '999px', padding: '6px 16px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500, backdropFilter: 'blur(10px)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></span>
            v2.4 - Focused Practice Mode
          </div>
          
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Practice DSA Questions <br />
            From <span className="text-gradient">Your Custom Lists</span>
          </h1>
          
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.6, margin: '0 0 16px 0' }}>
            Stop wondering what to solve next. Build your own DSA revision lists, practice random questions from your chosen set, and focus on what truly needs revision.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
            <Link to="/signup" className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              Create My First List <span style={{ fontSize: '1.25rem', marginLeft: '4px' }}>→</span>
            </Link>
            <Link to="/login" className="btn-outline" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              Explore Questions
            </Link>
          </div>
        </div>

        {/* Dashboard Preview (Floating & Tilted) */}
        <div style={{ position: 'relative', zIndex: 1, marginTop: '64px', perspective: '1000px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 40px rgba(124, 77, 255, 0.1)', transform: 'rotateX(2deg) scale(1.02)', transition: 'transform 0.3s' }}>
            <div style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(239,68,68,0.8)' }}></span>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(234,179,8,0.8)' }}></span>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(34,197,94,0.8)' }}></span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>DSA Trainer - Practice View</span>
            </div>
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              
              <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '12px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 600 }}>
                  <span><FaListCheck style={{ color: 'var(--accent-purple)', marginRight: '8px' }} /> My Lists</span>
                </div>
                <div style={{ background: 'rgba(124, 77, 255, 0.1)', borderRadius: '6px', padding: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', borderLeft: '3px solid var(--accent-purple)', color: 'var(--text-primary)' }}>
                  <span style={{ fontWeight: 500 }}>Blind 75</span>
                  <span style={{ color: '#4ade80' }}>Easy</span>
                </div>
                <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <span>Graphs</span>
                  <span style={{ color: '#facc15' }}>Medium</span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '15px', margin: 0 }}>Ready to Practice?</h4>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-purple), #00bcd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'white', boxShadow: '0 0 20px rgba(124, 77, 255, 0.4)' }}>
                  <FaShuffle />
                </div>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '8px' }}>Start Practice</button>
              </div>

              <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '12px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  <span>Two Sum</span>
                  <span style={{ color: '#4ade80' }}>Easy</span>
                </div>
                <div style={{ background: '#0d0f14', borderRadius: '6px', padding: '12px', fontSize: '11px', fontFamily: 'monospace', color: '#9CA3AF', lineHeight: 1.5 }}>
                  <span style={{ color: '#C084FC' }}>function</span> <span style={{ color: '#60A5FA' }}>twoSum</span>(...) &#123; <br />
                  &nbsp;&nbsp;<span style={{ color: '#F87171' }}>return</span> [0, 1]; <br />
                  &#125;
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          3 STEP CARDS
          ========================================= */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0' }}>Focused Practice in 3 Steps</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Stop wasting time on random questions. Target your weak spots with structured lists.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          <div className="card-glow" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(124, 77, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)', fontSize: '24px' }}><FaListCheck /></div>
            <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.25rem' }}>1. Select Lists</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', flexGrow: 1, lineHeight: 1.6, margin: 0 }}>Create custom lists like "My Blind 75" or curate your own problem set. Add questions directly from LeetCode.</p>
            <div style={{ marginTop: '8px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}><span style={{ color: '#4ade80' }}>✓</span> Blind 75 (25/75)</span>
              <span style={{ color: 'var(--accent-purple)', fontWeight: 600, cursor: 'pointer' }}>+ Add</span>
            </div>
          </div>

          <div className="card-glow" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(34, 211, 238, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22D3EE', fontSize: '24px' }}><FaShuffle /></div>
            <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.25rem' }}>2. Random Pick</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', flexGrow: 1, lineHeight: 1.6, margin: 0 }}>Select a list and let DSA Trainer randomly pick your next question so you can focus on solving instead of deciding.</p>
            <button className="btn-outline" style={{ marginTop: '8px', width: '100%', textAlign: 'center', fontSize: '13px', padding: '12px' }}>[ Start Practice ]</button>
          </div>

          <div className="card-glow" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F43F5E', fontSize: '24px' }}><FaCode /></div>
            <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.25rem' }}>3. Solve & Track</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', flexGrow: 1, lineHeight: 1.6, margin: 0 }}>Write code, run test cases, get AI-powered hints, and track your completion rate and accuracy per list.</p>
            <div style={{ marginTop: '8px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Editor / Test Cases</span>
              <span style={{ color: '#4ade80', fontWeight: 700 }}>77.8% acc</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================
          FEATURES GRID
          ========================================= */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Everything You Need for Consistent DSA Practice</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { icon: <FaListCheck />, title: "Custom Lists", desc: "Build targeted lists for specific topics or company interviews.", color: "var(--accent-purple)" },
            { icon: <FaShuffle />, title: "Randomized Practice", desc: "Eliminate decision fatigue by solving randomly selected problems.", color: "#22D3EE" },
            { icon: <FaChartLine />, title: "Progress Tracking", desc: "Visualize your solved counts, streaks, and weak topics clearly.", color: "#4ade80" },
            { icon: <FaBookOpen />, title: "LeetCode Import", desc: "Seamlessly bring over your existing problem library.", color: "#F59E0B" },
            { icon: <FaBrain />, title: "AI-Powered Hints", desc: "Get structured, progressive hints to guide you without giving the answer.", color: "#F43F5E" },
            { icon: <FaCode />, title: "Coding Practice", desc: "Write and test your code in a distraction-free, dark-themed editor.", color: "#A78BFA" }
          ].map((feature, i) => (
            <div key={i} className="card-glow" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-card)' }}>
              <div style={{ color: feature.color, fontSize: '28px' }}>{feature.icon}</div>
              <h4 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.1rem' }}>{feature.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          LIVE STATS PREVIEW
          ========================================= */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0' }}>Know Exactly Where You Stand</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Track your journey with detailed analytics.</p>
        </div>
        
        <div className="card-glow" style={{ padding: '40px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '32px', textAlign: 'center', background: 'linear-gradient(180deg, var(--bg-card) 0%, rgba(124, 77, 255, 0.05) 100%)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{solvedCount}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Questions Solved</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{Math.round(accuracy)}<span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>%</span></div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Accuracy</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f97316', fontFamily: 'monospace' }}>12<span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>days</span></div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Current Streak</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'monospace' }}>8</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>Topics Practiced</div>
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {[
            { name: "Arrays", pct: 78 },
            { name: "Strings", pct: 65 },
            { name: "Trees", pct: 48 },
            { name: "Graphs", pct: 32 },
          ].map((item) => (
            <div key={item.name} className="card-glow" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', background: 'var(--bg-card)' }}>
              <span style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 600, flexShrink: 0 }}>{item.name}</span>
              <div style={{ flexGrow: 1, height: '8px', background: 'var(--bg-app)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--accent-gradient)', width: `${item.pct}%`, borderRadius: '999px', transition: 'width 1s ease-in-out' }}></div>
              </div>
              <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'monospace', width: '40px', textAlign: 'right', fontWeight: 600 }}>{item.pct}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          FINAL CTA (Glowing)
          ========================================= */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px 100px' }}>
        <div className="card-glow" style={{ padding: '64px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'var(--bg-card)' }}>
          <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '100%', background: 'var(--accent-glow)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>Stop Wondering What to Practice Next.</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>Build your lists. Pick your questions. Practice consistently.</p>
            <Link to="/signup" className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem', marginTop: '8px' }}>
              Start Practicing <span style={{ fontSize: '1.25rem', marginLeft: '4px' }}>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          FOOTER
          ========================================= */}
      <footer style={{ background: 'var(--bg-app)', borderTop: '1px solid var(--border-subtle)', padding: '48px 24px', color: 'var(--text-secondary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 800, fontSize: '20px' }}>
            <FaCode style={{ color: 'var(--accent-purple)' }} /> DSA Trainer
          </div>
          <p style={{ margin: 0, fontSize: '15px' }}>Focused DSA practice, one question at a time.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center', fontSize: '14px', fontWeight: 500 }}>
            <Link to="/lists" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'inherit'}>My Lists</Link>
            <Link to="/practice" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'inherit'}>Practice</Link>
            <Link to="/stats" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'inherit'}>Stats</Link>
            <Link to="/login" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'inherit'}>Login</Link>
            <Link to="/signup" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'inherit'}>Sign Up</Link>
          </div>
          <div style={{ fontSize: '13px', opacity: 0.7 }}>© 2026 DSA Trainer. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;