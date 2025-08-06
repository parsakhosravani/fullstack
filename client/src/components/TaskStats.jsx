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
    <div className="mb-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor.replace('50', '100')} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Rate */}
      {stats.total > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-800">
              Completion Progress
            </h4>
            <span className="text-xl font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-full">
              {getCompletionRate()}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${getCompletionRate()}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-3 flex items-center justify-between">
            <span>{stats.completed} of {stats.total} tasks completed</span>
            <span className="font-semibold">
              {stats.total - stats.completed} remaining
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskStats;