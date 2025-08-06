import React, { useState, useEffect } from 'react';
import { useTasks } from '../contexts/TasksContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import TaskStats from '../components/TaskStats';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { Plus, Search, Sparkles, Target, Calendar, TrendingUp } from 'lucide-react';

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
      setToast({ type: 'success', message: '✨ Task created successfully!' });
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
      setToast({ type: 'success', message: '🎉 Task updated successfully!' });
      fetchTaskStats(); // Refresh stats
    } else {
      setToast({ type: 'error', message: result.error });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(taskId);
      if (result.success) {
        setToast({ type: 'success', message: '🗑️ Task deleted successfully!' });
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
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center bg-red-50 border border-red-200 rounded-2xl p-8">
              <div className="p-3 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => fetchTasks()}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent">
                    Task Dashboard
                  </h2>
                  <p className="text-gray-600 mt-1">Organize your work and achieve your goals</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex md:mt-0 md:ml-4">
              <button
                onClick={() => setShowTaskForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Task</span>
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Your Progress</h3>
              </div>
              <TaskStats stats={stats} />
            </div>
          )}

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input pl-12 w-full"
                  />
                </div>
              </div>
              <div>
                <TaskFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>
          </div>

          {/* Tasks Grid */}
          {loading && tasks.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your tasks...</p>
              </div>
            </div>
          ) : (
            <>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-16">
                  <div className="card max-w-md mx-auto p-8">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <Calendar className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {searchTerm ? 'No matching tasks found' : 'Ready to get organized?'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm 
                        ? 'Try adjusting your search terms or filters.' 
                        : 'Create your first task and start your productivity journey!'}
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={() => setShowTaskForm(true)}
                        className="btn-primary"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Task
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTasks.map((task, index) => (
                    <div 
                      key={task._id} 
                      className="animate-fadeInUp" 
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <TaskCard
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onUpdate={updateTask}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {page < pages && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="btn-secondary"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More Tasks
                      </>
                    )}
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
          title={editingTask ? '✏️ Edit Task' : '➕ Create New Task'}
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