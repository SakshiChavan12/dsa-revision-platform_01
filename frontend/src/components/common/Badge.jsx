const Badge = ({ children, variant = 'neutral' }) => {
  const variants = {
    easy: 'bg-green-500/20 text-green-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    hard: 'bg-red-500/20 text-red-400',
    neutral: 'bg-[#2D2D3D] text-gray-400'
  };

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${variants[variant] || variants.neutral}`}>
      {children}
    </span>
  );
};

export default Badge;