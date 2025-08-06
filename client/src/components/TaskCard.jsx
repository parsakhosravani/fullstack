import React from 'react';
import { Calendar, Clock, Edit, Trash2, CheckCircle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onUpdate }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusChange = async (newStatus) => {
    await onUpdate(task._id, { status: newStatus });
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today && task.status !== 'completed';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {task.title}
        </h3>
        <div className="flex items-center space-x-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Priority and Status Badges */}
      <div className="flex items-center space-x-3 mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(task.status)}`}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div className={`flex items-center space-x-2 text-sm mb-4 p-3 rounded-lg ${isOverdue(task.dueDate) ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
          <Calendar className={`h-4 w-4 ${isOverdue(task.dueDate) ? 'text-red-500' : 'text-gray-500'}`} />
          <span className={`font-medium ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-700'}`}>
            Due: {formatDate(task.dueDate)}
            {isOverdue(task.dueDate) && (
              <span className="ml-2 text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">OVERDUE</span>
            )}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>Created: {formatDate(task.createdAt)}</span>
        </div>

        {/* Quick Actions */}
        {task.status !== 'completed' && (
          <button
            onClick={() => handleStatusChange('completed')}
            className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all duration-200"
          >
            <CheckCircle className="h-4 w-4 mr-1.5" />
            Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;