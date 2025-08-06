import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const Toast = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50/95 border-green-200 text-green-800 shadow-green-100/50';
      case 'error':
        return 'bg-red-50/95 border-red-200 text-red-800 shadow-red-100/50';
      case 'warning':
        return 'bg-yellow-50/95 border-yellow-200 text-yellow-800 shadow-yellow-100/50';
      default:
        return 'bg-blue-50/95 border-blue-200 text-blue-800 shadow-blue-100/50';
    }
  };

  return (
    <div 
      className={`fixed top-4 right-4 z-50 max-w-sm w-full border rounded-2xl shadow-2xl backdrop-blur-md animate-slideInRight ${getStyles()}`}
      style={{
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 p-1">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-semibold leading-relaxed">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar for auto-close */}
      <div className="relative h-1 bg-white/30 rounded-b-2xl overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-[5000ms] ease-linear w-full ${
            type === 'success' ? 'bg-green-400' :
            type === 'error' ? 'bg-red-400' :
            type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
          }`}
          style={{
            width: '0%',
            animation: 'toast-progress 5s linear forwards'
          }}
        />
      </div>
      
      <style jsx>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Toast;