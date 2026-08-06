import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle } from 'lucide-react';

const TodaysPractice = ({ question }) => {
  const navigate = useNavigate();

  const difficultyColors = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-amber-100 text-amber-700",
    Hard: "bg-red-100 text-red-700"
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} />
            <span className="text-sm font-medium text-indigo-100">Today's Practice</span>
          </div>
          
          <h3 className="text-2xl font-bold mb-1">{question.title}</h3>
          
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${difficultyColors[question.difficulty]}`}>
              {question.difficulty}
            </span>
            <span className="text-sm text-indigo-200">•</span>
            <span className="text-sm text-indigo-100">{question.topics.join(" • ")}</span>
            <span className="text-sm text-indigo-200">•</span>
            <span className="text-sm text-indigo-100">{question.platform}</span>
          </div>
          
          <p className="text-sm text-indigo-200 mt-3">
            Practice a randomly selected question from your revision lists.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/practice')}
          className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-2.5 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors group"
        >
          Start Practice
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default TodaysPractice;