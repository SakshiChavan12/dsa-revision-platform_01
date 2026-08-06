import { Link } from 'react-router-dom';
import { FaListCheck, FaShuffle, FaCode, FaBrain, FaChartLine, FaBookOpen } from 'react-icons/fa6';

const Landing = () => {
  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* HERO SECTION */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 40px', display: 'grid', gap: '60px', alignItems: 'center' }} className="hero-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '999px', padding: '6px 16px', fontSize: '12px', color: 'var(--text-secondary)', width: 'fit-content' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
            v2.4 - Focused Practice Mode
          </div>
          
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.1, margin: 0, color: 'var(--text-primary)' }}>
            Practice DSA Questions <br />
            From <span className="text-gradient">Your Custom Lists</span>
          </h1>
          
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '540px', lineHeight: 1.6, margin: 0 }}>
            Curate your own problem set or choose from popular collections like Blind 75 and Grind 169. We randomly pick a question from your selected list so you never waste time deciding what to study next.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px' }}>
            <Link to="/lists" className="btn-primary">
              Create My First List <span style={{ fontSize: '1.25rem' }}>→</span>
            </Link>
            <Link to="/lists" className="btn-outline">
              Import from LeetCode
            </Link>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-heavy)' }}>
          <div style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(239,68,68,0.6)' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(234,179,8,0.6)' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(34,197,94,0.6)' }}></span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>DSA Trainer - Practice View</span>
          </div>
          <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                <span><FaListCheck style={{ color: 'var(--accent-purple)', marginRight: '8px' }} /> My Lists</span>
              </div>
              <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', borderLeft: '2px solid var(--accent-purple)' }}>
                <span style={{ color: 'var(--text-primary)' }}>Blind 75</span>
                <span style={{ color: '#4ade80' }}>Easy</span>
              </div>
              <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span>Graphs</span>
                <span style={{ color: '#facc15' }}>Medium</span>
              </div>
            </div>
            <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <h4 style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 12px 0' }}>Ready to Practice?</h4>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '14px' }}>Start Practice</button>
            </div>
            <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span>Two Sum</span>
                <span style={{ color: '#4ade80' }}>Easy</span>
              </div>
              <div style={{ background: 'var(--bg-card)', borderRadius: '4px', padding: '8px', fontSize: '10px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-purple)' }}>function</span> twoSum(...) &#123; ... &#125;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 STEP CARDS */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Focused Practice in 3 Steps</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Stop wasting time on random questions. Target your weak spots with structured lists.</p>
        </div>
        
        <div className="step-grid">
          <div className="card-glow step-card">
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)', fontSize: '24px', marginBottom: '16px' }}><FaListCheck /></div>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 12px 0' }}>1. Select Lists</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', flexGrow: 1, lineHeight: 1.6, margin: '0' }}>Create custom lists like "My Blind 75" or curate your own problem set. Add questions directly from LeetCode.</p>
            <div style={{ marginTop: '16px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-secondary)' }}><span style={{ color: '#4ade80' }}>✓</span> Blind 75 (25/75)</span>
              <span style={{ color: 'var(--accent-purple)' }}>+ Add</span>
            </div>
          </div>

          <div className="card-glow step-card">
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22D3EE', fontSize: '24px', marginBottom: '16px' }}><FaShuffle /></div>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 12px 0' }}>2. Random Pick</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', flexGrow: 1, lineHeight: 1.6, margin: '0' }}>Select a list and let DSA Trainer randomly pick your next question so you can focus on solving instead of deciding.</p>
            <button className="btn-outline" style={{ marginTop: '16px', width: '100%', textAlign: 'center', fontSize: '12px' }}>[ Start Practice ]</button>
          </div>

          <div className="card-glow step-card">
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F43F5E', fontSize: '24px', marginBottom: '16px' }}><FaCode /></div>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 12px 0' }}>3. Solve & Track</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', flexGrow: 1, lineHeight: 1.6, margin: '0' }}>Write code, run test cases, get AI-powered hints, and track your completion rate and accuracy per list.</p>
            <div style={{ marginTop: '16px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Editor / Test Cases</span>
              <span style={{ color: '#4ade80', fontWeight: 600 }}>77.8% acc</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-app)' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--text-primary)', margin: '0' }}>Everything You Need for Consistent DSA Practice</h2>
        </div>
        
        <div className="feature-grid">
          {[
            { icon: <FaListCheck />, title: "Custom Lists", desc: "Build targeted lists for specific topics or company interviews." },
            { icon: <FaShuffle />, title: "Randomized Practice", desc: "Eliminate decision fatigue by solving randomly selected problems." },
            { icon: <FaChartLine />, title: "Progress Tracking", desc: "Visualize your solved counts, streaks, and weak topics clearly." },
            { icon: <FaBookOpen />, title: "LeetCode Import", desc: "Seamlessly bring over your existing problem library." },
            { icon: <FaBrain />, title: "AI-Powered Hints", desc: "Get structured, progressive hints to guide you without giving the answer." },
            { icon: <FaCode />, title: "Coding Practice", desc: "Write and test your code in a distraction-free, dark-themed editor." }
          ].map((feature, i) => (
            <div key={i} className="card-glow" style={{ padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ color: 'var(--accent-purple)', fontSize: '24px' }}>{feature.icon}</div>
              <h4 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '16px' }}>{feature.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS PREVIEW */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--text-primary)', margin: '0' }}>Know Exactly Where You Stand</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track your journey with detailed analytics.</p>
        </div>
        
        <div className="card-glow" style={{ padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>127</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Questions Solved</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>77.8%</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Accuracy</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>12<span style={{ fontSize: '20px', color: 'var(--text-secondary)' }}> days</span></div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Current Streak</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>8</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Topics Practiced</div>
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {[
            { name: "Arrays", pct: 78 },
            { name: "Strings", pct: 65 },
            { name: "Trees", pct: 48 },
            { name: "Graphs", pct: 32 },
          ].map((item) => (
            <div key={item.name} className="card-glow" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500, flexShrink: 0 }}>{item.name}</span>
              <div style={{ flexGrow: 1, height: '6px', background: 'var(--bg-app)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--accent-gradient)', width: `${item.pct}%`, borderRadius: '999px' }}></div>
              </div>
              <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'monospace', width: '40px', textAlign: 'right' }}>{item.pct}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <div className="card-glow" style={{ padding: '48px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '300px', height: '300px', background: 'var(--accent-glow)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }}></div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0', position: 'relative' }}>Stop Wondering What to Practice Next.</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0 0 24px 0', position: 'relative' }}>Build your lists. Pick your questions. Practice consistently.</p>
          <Link to="/lists" className="btn-primary" style={{ position: 'relative' }}>
            Start Practicing <span style={{ fontSize: '1.25rem', marginLeft: '4px' }}>→</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--bg-app)', borderTop: '1px solid var(--border-subtle)', padding: '40px 24px', color: 'var(--text-secondary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 700, fontSize: '18px' }}>
            <FaCode style={{ color: 'var(--accent-purple)' }} /> DSA Trainer
          </div>
          <p style={{ margin: 0, fontSize: '14px' }}>Focused DSA practice, one question at a time.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', fontSize: '14px' }}>
            <Link to="/lists" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'inherit'}>My Lists</Link>
            <Link to="/practice" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'inherit'}>Practice</Link>
            <Link to="/stats" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'inherit'}>Stats</Link>
            <Link to="/login" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'inherit'}>Login</Link>
            <Link to="/signup" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'inherit'}>Sign Up</Link>
          </div>
          <div style={{ fontSize: '12px' }}>© 2026 DSA Trainer</div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;