// src/pages/Signup.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log('Signup attempt:', formData);
    alert('Signup flow triggered (Frontend only).');
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        
        {/* Logo / Brand */}
        <div style={styles.logoArea}>
          <span style={styles.logoIcon}>{`</>`}</span>
          <span style={styles.logoText}>DSA Trainer</span>
        </div>

        {/* Heading */}
        <h2 style={styles.heading}>Create Your Account</h2>
        <p style={styles.subtitle}>Start your DSA journey today.</p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text" 
              name="fullName"
              placeholder="Enter your full name" 
              value={formData.fullName}
              onChange={handleChange}
              style={styles.input} 
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input 
              type="email" 
              name="email"
              placeholder="Enter your email" 
              value={formData.email}
              onChange={handleChange}
              style={styles.input} 
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="Create a password" 
              value={formData.password}
              onChange={handleChange}
              style={styles.input} 
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Confirm your password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input} 
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={styles.submitBtn}>
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p style={styles.switchText}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </p>

        {/* Back to Home */}
        <Link to="/" style={styles.backLink}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'var(--bg-app, #080B12)',
    padding: '24px',
    boxSizing: 'border-box'
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'var(--bg-card, #0D121C)',
    border: '1px solid var(--border-subtle, #252B38)',
    borderRadius: '16px',
    padding: '40px 32px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 0 30px rgba(124, 77, 255, 0.05)'
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px'
  },
  logoIcon: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--accent-purple, #7C4DFF)',
    fontFamily: 'monospace'
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-primary, #F5F7FA)'
  },
  heading: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'var(--text-primary, #F5F7FA)',
    margin: '0 0 8px 0',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary, #8FA0B8)',
    margin: '0 0 32px 0',
    textAlign: 'center'
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%'
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-secondary, #8FA0B8)'
  },
  input: {
    width: '100%',
    height: '44px',
    background: 'var(--bg-app, #080B12)',
    border: '1px solid var(--border-subtle, #252B38)',
    borderRadius: '8px',
    padding: '0 16px',
    color: 'var(--text-primary, #F5F7FA)',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease'
  },
  submitBtn: {
    width: '100%',
    height: '44px',
    marginTop: '4px',
    fontSize: '15px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer'
  },
  switchText: {
    fontSize: '14px',
    color: 'var(--text-secondary, #8FA0B8)',
    margin: '0 0 16px 0'
  },
  link: {
    color: 'var(--accent-purple, #7C4DFF)',
    textDecoration: 'none',
    fontWeight: '500'
  },
  backLink: {
    fontSize: '13px',
    color: 'var(--text-secondary, #8FA0B8)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'color 0.2s'
  }
};

export default Signup;