import React from 'react';
import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';

const TaskStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total || 0,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Pending',
      value: stats.pending || 0,
      icon: Clock,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      title: 'In Progress',
      value: stats['in-progress'] || 0,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Completed',
      value: stats.completed || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  const getCompletionRate = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  return (
    <div className="mb-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-4 hover:shadow-sm transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Rate */}
      {stats.total > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">
              Completion Rate
            </h4>
            <span className="text-sm font-semibold text-gray-900">
              {getCompletionRate()}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getCompletionRate()}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {stats.completed} of {stats.total} tasks completed
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskStats;