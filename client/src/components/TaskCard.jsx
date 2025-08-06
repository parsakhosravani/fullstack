import React from 'react';
import { Calendar, Clock, Edit, Trash2, CheckCircle, AlertCircle, Star } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onUpdate }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'low':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'in-progress':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      case 'pending':
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-3 w-3" />;
      case 'medium':
        return <Star className="h-3 w-3" />;
      case 'low':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return null;
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
    <div className="card p-6 hover:scale-105 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-800 transition-colors duration-200">
          {task.title}
        </h3>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
        <span className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${getPriorityColor(task.priority)}`}>
          {getPriorityIcon(task.priority)}
          <span className="capitalize">{task.priority}</span>
        </span>
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200 ${getStatusColor(task.status)}`}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div className={`flex items-center space-x-2 text-sm mb-4 p-3 rounded-xl ${
          isOverdue(task.dueDate) 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <Calendar className={`h-4 w-4 ${isOverdue(task.dueDate) ? 'text-red-500' : 'text-blue-500'}`} />
          <span className={`font-medium ${isOverdue(task.dueDate) ? 'text-red-700' : 'text-blue-700'}`}>
            Due: {formatDate(task.dueDate)}
            {isOverdue(task.dueDate) && (
              <span className="ml-2 text-red-600 font-semibold">(Overdue!)</span>
            )}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        {/* Created Date */}
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>Created: {formatDate(task.createdAt)}</span>
        </div>

        {/* Quick Actions */}
        {task.status !== 'completed' && (
          <button
            onClick={() => handleStatusChange('completed')}
            className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:scale-105 transition-all duration-200 shadow-sm"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Complete</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;