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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {task.title}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {task.description}
        </p>
      )}

      {/* Priority and Status Badges */}
      <div className="flex items-center space-x-2 mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(task.status)}`}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div className="flex items-center space-x-2 text-sm mb-4">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className={`${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
            Due: {formatDate(task.dueDate)}
            {isOverdue(task.dueDate) && (
              <span className="ml-1 text-red-500">(Overdue)</span>
            )}
          </span>
        </div>
      )}

      {/* Created Date */}
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <Clock className="h-3 w-3" />
        <span>Created: {formatDate(task.createdAt)}</span>
      </div>

      {/* Quick Actions */}
      {task.status !== 'completed' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleStatusChange('completed')}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Mark Complete
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;