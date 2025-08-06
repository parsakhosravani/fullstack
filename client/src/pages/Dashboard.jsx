import React, { useState, useEffect } from 'react';
import { useTasks } from '../contexts/TasksContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import TaskStats from '../components/TaskStats';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { Plus, Search } from 'lucide-react';

const Dashboard = () => {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchTaskStats,
    stats,
    filters,
    setFilters,
    page,
    pages
  } = useTasks();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchTaskStats();
  }, [filters]);

  const handleCreateTask = async (taskData) => {
    const result = await createTask(taskData);
    if (result.success) {
      setShowTaskForm(false);
      setToast({ type: 'success', message: 'Task created successfully!' });
      fetchTaskStats(); // Refresh stats
    } else {
      setToast({ type: 'error', message: result.error });
    }
  };

  const handleUpdateTask = async (taskData) => {
    const result = await updateTask(editingTask._id, taskData);
    if (result.success) {
      setEditingTask(null);
      setShowTaskForm(false);
      setToast({ type: 'success', message: 'Task updated successfully!' });
      fetchTaskStats(); // Refresh stats
    } else {
      setToast({ type: 'error', message: result.error });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(taskId);
      if (result.success) {
        setToast({ type: 'success', message: 'Task deleted successfully!' });
        fetchTaskStats(); // Refresh stats
      } else {
        setToast({ type: 'error', message: result.error });
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoadMore = () => {
    if (page < pages) {
      fetchTasks({ page: page + 1 });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <p className="text-red-600">Error: {error}</p>
              <button
                onClick={() => fetchTasks()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Task Dashboard
              </h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                onClick={() => setShowTaskForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </button>
            </div>
          </div>

          {/* Stats */}
          {stats && <TaskStats stats={stats} />}

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <TaskFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Tasks Grid */}
          {loading && tasks.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {searchTerm ? 'No tasks found matching your search.' : 'No tasks found. Create your first task!'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setShowTaskForm(true)}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Task
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onUpdate={updateTask}
                    />
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {page < pages && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="inline-flex items-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                    ) : null}
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <Modal
          title={editingTask ? 'Edit Task' : 'Create Task'}
          onClose={handleCloseForm}
        >
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCloseForm}
            loading={loading}
          />
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;