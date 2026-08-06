import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Shuffle } from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: BookOpen,
      label: "Browse Questions",
      onClick: () => navigate('/questions'),
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100"
    },
    {
      icon: Plus,
      label: "Create Revision List",
      onClick: () => navigate('/create-list'),
      color: "bg-green-50 text-green-600 hover:bg-green-100"
    },
    {
      icon: Shuffle,
      label: "Start Random Practice",
      onClick: () => navigate('/practice'),
      color: "bg-purple-50 text-purple-600 hover:bg-purple-100"
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg ${action.color} transition-colors font-medium text-sm`}
          >
            <action.icon size={18} />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;