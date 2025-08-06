import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const TaskFilters = ({ filters, onFilterChange }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const handleResetFilters = () => {
    onFilterChange({
      status: '',
      priority: '',
      sort: '-createdAt'
    });
  };

  const hasActiveFilters = filters.status || filters.priority || filters.sort !== '-createdAt';

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Status Filter */}
      <div className="min-w-0">
        <select
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="px-4 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div className="min-w-0">
        <select
          value={filters.priority || ''}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="px-4 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Sort Filter */}
      <div className="min-w-0">
        <select
          value={filters.sort || '-createdAt'}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="px-4 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="title">Title A-Z</option>
          <option value="-title">Title Z-A</option>
          <option value="dueDate">Due Date</option>
          <option value="-priority">Priority High-Low</option>
          <option value="priority">Priority Low-High</option>
        </select>
      </div>

      {/* Reset Filters */}
      {hasActiveFilters && (
        <button
          onClick={handleResetFilters}
          className="inline-flex items-center px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-sm"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </button>
      )}

      {/* Filter Icon (for mobile) */}
      <div className="lg:hidden">
        <Filter className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};

export default TaskFilters;