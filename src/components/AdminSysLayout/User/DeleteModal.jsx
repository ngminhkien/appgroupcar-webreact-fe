import React from 'react';

const DeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName, 
  isLoading 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden bg-white rounded-2xl shadow-2xl transition-transform duration-300 scale-100"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Xác nhận xóa</h2>
            </div>
            <button 
              type="button" 
              className="text-slate-400 hover:text-slate-600 transition-colors"
              onClick={onClose}
              aria-label="Đóng"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-2">
          <p className="text-slate-600">
            Bạn có chắc chắn muốn xóa người dùng <span className="font-bold text-slate-900">{userName}</span>?
          </p>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến người dùng này sẽ bị gỡ bỏ vĩnh viễn khỏi hệ thống.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-6 mt-4 flex justify-end gap-3 bg-slate-50">
          <button 
            type="button" 
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 disabled:opacity-50"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy bỏ
          </button>
          <button 
            type="button" 
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isLoading ? 'Đang xử lý...' : 'Xác nhận xóa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;