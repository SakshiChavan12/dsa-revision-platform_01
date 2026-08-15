// // src/pages/Login.jsx
// import { useState } from 'react';
// import { Link } from 'react-router-dom';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Mock placeholder for future authentication
//     console.log('Login attempt:', { email, password });
//     alert('Login flow triggered (Frontend only).');
//   };

//   return (
//     <div style={styles.pageWrapper}>
//       <div style={styles.card}>
        
//         {/* Logo / Brand */}
//         <div style={styles.logoArea}>
//           <span style={styles.logoIcon}>{`</>`}</span>
//           <span style={styles.logoText}>DSA Trainer</span>
//         </div>

//         {/* Heading */}
//         <h2 style={styles.heading}>Welcome Back</h2>
//         <p style={styles.subtitle}>Continue your DSA practice journey.</p>

//         {/* Form */}
//         <form onSubmit={handleSubmit} style={styles.form}>
//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Email</label>
//             <input 
//               type="email" 
//               placeholder="Enter your email" 
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               style={styles.input} 
//               required
//             />
//           </div>

//           <div style={styles.inputGroup}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <label style={styles.label}>Password</label>
//               <span style={styles.forgotLink}>Forgot password?</span>
//             </div>
//             <input 
//               type="password" 
//               placeholder="Enter your password" 
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               style={styles.input} 
//               required
//             />
//           </div>

//           <button type="submit" className="btn-primary" style={styles.submitBtn}>
//             Login
//           </button>
//         </form>

//         {/* Divider */}
//         <div style={styles.divider}>
//           <span style={styles.dividerLine}></span>
//           <span style={styles.dividerText}>OR</span>
//           <span style={styles.dividerLine}></span>
//         </div>

//         {/* Sign Up Link */}
//         <p style={styles.switchText}>
//           Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link>
//         </p>

//         {/* Back to Home */}
//         <Link to="/" style={styles.backLink}>
//           ← Back to Home
//         </Link>
//       </div>
//     </div>
//   );
// };

// // --- STYLES ---
// const styles = {
//   pageWrapper: {
//     minHeight: '100vh',
//     width: '100%',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     background: 'var(--bg-app, #080B12)',
//     padding: '24px',
//     boxSizing: 'border-box'
//   },
//   card: {
//     width: '100%',
//     maxWidth: '420px',
//     background: 'var(--bg-card, #0D121C)',
//     border: '1px solid var(--border-subtle, #252B38)',
//     borderRadius: '16px',
//     padding: '40px 32px',
//     boxSizing: 'border-box',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     boxShadow: '0 0 30px rgba(124, 77, 255, 0.05)'
//   },
//   logoArea: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     marginBottom: '32px'
//   },
//   logoIcon: {
//     fontSize: '24px',
//     fontWeight: 'bold',
//     color: 'var(--accent-purple, #7C4DFF)',
//     fontFamily: 'monospace'
//   },
//   logoText: {
//     fontSize: '20px',
//     fontWeight: '700',
//     color: 'var(--text-primary, #F5F7FA)'
//   },
//   heading: {
//     fontSize: '24px',
//     fontWeight: '600',
//     color: 'var(--text-primary, #F5F7FA)',
//     margin: '0 0 8px 0',
//     textAlign: 'center'
//   },
//   subtitle: {
//     fontSize: '14px',
//     color: 'var(--text-secondary, #8FA0B8)',
//     margin: '0 0 32px 0',
//     textAlign: 'center'
//   },
//   form: {
//     width: '100%',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '20px'
//   },
//   inputGroup: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '6px',
//     width: '100%'
//   },
//   label: {
//     fontSize: '13px',
//     fontWeight: '500',
//     color: 'var(--text-secondary, #8FA0B8)'
//   },
//   input: {
//     width: '100%',
//     height: '44px',
//     background: 'var(--bg-app, #080B12)',
//     border: '1px solid var(--border-subtle, #252B38)',
//     borderRadius: '8px',
//     padding: '0 16px',
//     color: 'var(--text-primary, #F5F7FA)',
//     fontSize: '14px',
//     outline: 'none',
//     boxSizing: 'border-box',
//     transition: 'all 0.2s ease'
//   },
//   forgotLink: {
//     fontSize: '12px',
//     color: 'var(--accent-purple, #7C4DFF)',
//     cursor: 'pointer'
//   },
//   submitBtn: {
//     width: '100%',
//     height: '44px',
//     marginTop: '4px',
//     fontSize: '15px',
//     fontWeight: '600',
//     border: 'none',
//     cursor: 'pointer'
//   },
//   divider: {
//     display: 'flex',
//     alignItems: 'center',
//     width: '100%',
//     margin: '24px 0 20px 0',
//     gap: '12px'
//   },
//   dividerLine: {
//     flex: 1,
//     height: '1px',
//     background: 'var(--border-subtle, #252B38)'
//   },
//   dividerText: {
//     fontSize: '12px',
//     color: 'var(--text-secondary, #8FA0B8)'
//   },
//   switchText: {
//     fontSize: '14px',
//     color: 'var(--text-secondary, #8FA0B8)',
//     margin: '0 0 16px 0'
//   },
//   link: {
//     color: 'var(--accent-purple, #7C4DFF)',
//     textDecoration: 'none',
//     fontWeight: '500'
//   },
//   backLink: {
//     fontSize: '13px',
//     color: 'var(--text-secondary, #8FA0B8)',
//     textDecoration: 'none',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '4px',
//     transition: 'color 0.2s'
//   }
// };

// // Note: To make the input focus work, add this to your global CSS:
// // input:focus { border-color: var(--accent-purple) !important; box-shadow: 0 0 10px rgba(124, 77, 255, 0.1); }

// export default Login;


import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth'; // <-- Import login function

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // CALL THE BACKEND API HERE
      await login({ email, password });
      
      // If successful, navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <span style={styles.logoIcon}>{`</>`}</span>
          <span style={styles.logoText}>DSA Trainer</span>
        </div>
        <h2 style={styles.heading}>Welcome Back</h2>
        <p style={styles.subtitle}>Continue your DSA practice journey.</p>

        {error && <div style={{ color: '#ef4444', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
          </div>
          <div style={styles.inputGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={styles.label}>Password</label>
              <span style={styles.forgotLink}>Forgot password?</span>
            </div>
            <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
          </div>
          <button type="submit" className="btn-primary" style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>OR</span>
          <span style={styles.dividerLine}></span>
        </div>

        <p style={styles.switchText}>
          Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link>
        </p>
        <Link to="/" style={styles.backLink}>← Back to Home</Link>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { minHeight: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-app, #080B12)', padding: '24px', boxSizing: 'border-box' },
  card: { width: '100%', maxWidth: '420px', background: 'var(--bg-card, #0D121C)', border: '1px solid var(--border-subtle, #252B38)', borderRadius: '16px', padding: '40px 32px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 0 30px rgba(124, 77, 255, 0.05)' },
  logoArea: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' },
  logoIcon: { fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-purple, #7C4DFF)', fontFamily: 'monospace' },
  logoText: { fontSize: '20px', fontWeight: '700', color: 'var(--text-primary, #F5F7FA)' },
  heading: { fontSize: '24px', fontWeight: '600', color: 'var(--text-primary, #F5F7FA)', margin: '0 0 8px 0', textAlign: 'center' },
  subtitle: { fontSize: '14px', color: 'var(--text-secondary, #8FA0B8)', margin: '0 0 32px 0', textAlign: 'center' },
  form: { width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' },
  label: { fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary, #8FA0B8)' },
  input: { width: '100%', height: '44px', background: 'var(--bg-app, #080B12)', border: '1px solid var(--border-subtle, #252B38)', borderRadius: '8px', padding: '0 16px', color: 'var(--text-primary, #F5F7FA)', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s ease' },
  forgotLink: { fontSize: '12px', color: 'var(--accent-purple, #7C4DFF)', cursor: 'pointer' },
  submitBtn: { width: '100%', height: '44px', marginTop: '4px', fontSize: '15px', fontWeight: '600', border: 'none', cursor: 'pointer', background: 'var(--accent-purple, #7C4DFF)', color: 'white', borderRadius: '8px' },
  divider: { display: 'flex', alignItems: 'center', width: '100%', margin: '24px 0 20px 0', gap: '12px' },
  dividerLine: { flex: 1, height: '1px', background: 'var(--border-subtle, #252B38)' },
  dividerText: { fontSize: '12px', color: 'var(--text-secondary, #8FA0B8)' },
  switchText: { fontSize: '14px', color: 'var(--text-secondary, #8FA0B8)', margin: '0 0 16px 0' },
  link: { color: 'var(--accent-purple, #7C4DFF)', textDecoration: 'none', fontWeight: '500' },
  backLink: { fontSize: '13px', color: 'var(--text-secondary, #8FA0B8)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }
};

export default Login;