import React, { createContext, useContext, useReducer } from 'react';
import { tasksAPI } from '../services/api';

// Tasks context
const TasksContext = createContext();

// Task actions
const TASK_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  SET_STATS: 'SET_STATS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FILTERS: 'SET_FILTERS',
};

// Tasks reducer
const tasksReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case TASK_ACTIONS.SET_TASKS:
      return {
        ...state,
        tasks: action.payload.data,
        total: action.payload.total,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
        error: null,
      };
    case TASK_ACTIONS.ADD_TASK:
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        error: null,
      };
    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        ),
        error: null,
      };
    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
        error: null,
      };
    case TASK_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload,
        error: null,
      };
    case TASK_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case TASK_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case TASK_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  tasks: [],
  stats: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pages: 1,
  filters: {
    status: '',
    priority: '',
    sort: '-createdAt',
  },
};

// Tasks provider component
export const TasksProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  // Fetch tasks
  const fetchTasks = async (params = {}) => {
    try {
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });

      const queryParams = { ...state.filters, ...params };
      const response = await tasksAPI.getTasks(queryParams);
      
      dispatch({ type: TASK_ACTIONS.SET_TASKS, payload: response });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  // Create task
  const createTask = async (taskData) => {
    try {
      dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });

      const response = await tasksAPI.createTask(taskData);
      dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: response.data });
      
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    try {
      dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });

      const response = await tasksAPI.updateTask(id, taskData);
      dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: response.data });
      
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });

      await tasksAPI.deleteTask(id);
      dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: id });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  // Fetch task statistics
  const fetchTaskStats = async () => {
    try {
      const response = await tasksAPI.getTaskStats();
      dispatch({ type: TASK_ACTIONS.SET_STATS, payload: response.data });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch task stats';
      return { success: false, error: message };
    }
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: TASK_ACTIONS.SET_FILTERS, payload: filters });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchTaskStats,
    setFilters,
    clearError,
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
};

// Custom hook to use tasks context
export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};

export default TasksContext;