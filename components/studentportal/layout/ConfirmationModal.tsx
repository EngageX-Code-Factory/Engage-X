'use client';

import { X, AlertTriangle, LogOut, Trash2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const themes = {
    danger: {
      icon: <Trash2 className="w-8 h-8 text-red-500" />,
      button: 'bg-red-600 hover:bg-red-700 shadow-red-900/20',
      bg: 'from-red-600/20',
      border: 'border-red-500/20'
    },
    warning: {
      icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
      button: 'bg-orange-600 hover:bg-orange-700 shadow-orange-900/20',
      bg: 'from-orange-600/20',
      border: 'border-orange-500/20'
    },
    info: {
      icon: <LogOut className="w-8 h-8 text-purple-500" />,
      button: 'bg-purple-600 hover:bg-purple-700 shadow-purple-900/20',
      bg: 'from-purple-600/20',
      border: 'border-purple-500/20'
    }
  };

  const theme = themes[type];

  return (
    <div className="fixed inset-0 z-[200] grid place-items-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0f0c29]/90 p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${theme.bg} via-transparent to-transparent`} />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border ${theme.border} mb-6`}>
            {theme.icon}
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex w-full gap-4">
            <button 
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-white hover:bg-white/10 transition-all"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 h-12 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 ${theme.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
