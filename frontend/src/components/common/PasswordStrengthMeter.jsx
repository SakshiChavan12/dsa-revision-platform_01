// frontend/src/components/common/PasswordStrengthMeter.jsx
import { passwordStrength } from '../../utils/validation';

const COLORS = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#22c55e'];
const LABELS = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];

export default function PasswordStrengthMeter({ password }) {
  const score = passwordStrength(password);
  if (!password) return null;

  return (
    <div style={{ marginTop: '6px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              background: i < score ? COLORS[score] : 'var(--border-subtle)',
              transition: 'background 0.2s'
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: '0.75rem', color: COLORS[score], textAlign: 'right' }}>
        {LABELS[score]}
      </div>
    </div>
  );
}