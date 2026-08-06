import { CheckCircle, XCircle, PlusCircle, Award } from 'lucide-react';

const RecentActivity = ({ activities }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'solved':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'failed':
        return <XCircle size={16} className="text-red-600" />;
      case 'added':
        return <PlusCircle size={16} className="text-blue-600" />;
      default:
        return <Award size={16} className="text-amber-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
            <div className="mt-0.5">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;