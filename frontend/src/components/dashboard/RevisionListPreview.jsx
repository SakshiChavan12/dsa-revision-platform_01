import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

const RevisionListPreview = ({ list }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-900 mb-2">{list.name}</h4>
      
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>{list.totalQuestions} Questions</span>
        <span>{list.solved} Solved</span>
      </div>
      
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div 
          className="absolute h-full bg-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${list.progress}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{list.progress}%</span>
        <button
          onClick={() => navigate('/practice')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
        >
          <Play size={14} />
          Practice
        </button>
      </div>
    </div>
  );
};

export default RevisionListPreview;