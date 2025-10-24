import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export default function ToastDemo() {
  const showSuccess = () => {
    toast.success('Operation completed successfully!', {
      duration: 4000,
      style: {
        background: '#10B981',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
      },
      icon: <CheckCircle size={24} />,
    });
  };

  const showError = () => {
    toast.error('Something went wrong. Please try again.', {
      duration: 4000,
      style: {
        background: '#EF4444',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 40px rgba(239, 68, 68, 0.3)',
      },
      icon: <XCircle size={24} />,
    });
  };

  const showWarning = () => {
    toast('Warning: Your session will expire soon', {
      duration: 4000,
      style: {
        background: '#F59E0B',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)',
      },
      icon: <AlertCircle size={24} />,
    });
  };

  const showInfo = () => {
    toast('New features are now available!', {
      duration: 4000,
      style: {
        background: '#3B82F6',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)',
      },
      icon: <Info size={24} />,
    });
  };

  const showCustom = () => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        style={{
          boxShadow: '0 10px 40px rgba(168, 85, 247, 0.4)',
        }}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="h-10 w-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <Info className="text-white" size={20} />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-white">
                Custom Toast
              </p>
              <p className="mt-1 text-sm text-white text-opacity-90">
                This is a fully customizable toast with gradient design!
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-white border-opacity-20">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-xl p-4 flex items-center justify-center text-sm font-medium text-white hover:bg-white hover:bg-opacity-10 focus:outline-none transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    ));
  };

  const showPromise = () => {
    const myPromise = new Promise((resolve) => {
      setTimeout(() => resolve('Data loaded'), 2000);
    });

    toast.promise(
      myPromise,
      {
        loading: 'Loading data...',
        success: 'Data loaded successfully!',
        error: 'Failed to load data',
      },
      {
        style: {
          background: '#1F2937',
          color: '#F9FAFB',
          padding: '16px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
          border: '1px solid #374151',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        },
        success: {
          style: {
            background: '#10B981',
            border: 'none',
          },
          icon: <CheckCircle size={24} />,
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center p-8">
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#F9FAFB',
            border: '1px solid #374151',
          },
        }}
      />
      
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Toast Notifications
          </h1>
          <p className="text-gray-400 text-lg">
            Beautiful dark-themed toast notifications with react-hot-toast
          </p>
        </div>

        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={showSuccess}
              className="px-6 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Success Toast
            </button>

            <button
              onClick={showError}
              className="px-6 py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/50 flex items-center justify-center gap-2"
            >
              <XCircle size={20} />
              Error Toast
            </button>

            <button
              onClick={showWarning}
              className="px-6 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-amber-500/50 flex items-center justify-center gap-2"
            >
              <AlertCircle size={20} />
              Warning Toast
            </button>

            <button
              onClick={showInfo}
              className="px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2"
            >
              <Info size={20} />
              Info Toast
            </button>

            <button
              onClick={showCustom}
              className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
            >
              Custom Gradient
            </button>

            <button
              onClick={showPromise}
              className="px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-gray-500/50"
            >
              Promise Toast
            </button>
          </div>

          <div className="mt-8 p-4 bg-gray-900 bg-opacity-50 rounded-xl border border-gray-700">
            <h3 className="text-white font-semibold mb-2">Installation:</h3>
            <code className="text-green-400 text-sm">npm install react-hot-toast</code>
          </div>
        </div>
      </div>
    </div>
  );
}