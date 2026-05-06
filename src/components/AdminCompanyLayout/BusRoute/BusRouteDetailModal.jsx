import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getBusRouteByIdApi } from '@/services/busRouteService';

const BusRouteDetailModal = ({ isOpen, onClose, route }) => {
  const [detailData, setDetailData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !route?.id) return;

    let cancelled = false;
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const response = await getBusRouteByIdApi(route.id);
        const data = response?.data ?? response;
        const item = Array.isArray(data?.items) ? data.items[0] : data;
        if (!cancelled) setDetailData(item);
      } catch (error) {
        if (!cancelled) {
          toast.error(error.response?.data?.message || 'Không thể tải chi tiết tuyến xe.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchDetail();
    return () => { cancelled = true; };
  }, [isOpen, route?.id]);

  if (!isOpen || !route) return null;

  const sortedPoints = detailData?.routePoints 
    ? [...detailData.routePoints].sort((a, b) => a.sequence - b.sequence)
    : [];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden bg-white rounded-2xl shadow-2xl transition-transform duration-300 scale-100 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Chi tiết tuyến xe</h2>
            </div>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              onClick={onClose}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="ml-3 text-slate-500">Đang tải chi tiết...</span>
            </div>
          ) : detailData ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-500">Tên tuyến xe</label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-medium">
                    {detailData.name || "--"}
                  </div>
                </div>

                <div className="space-y-1.5 mt-2">
                  <label className="block text-sm font-medium text-slate-500 mb-2">Danh sách các điểm dừng</label>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <ul className="divide-y divide-slate-100">
                      {sortedPoints.map((p, idx) => (
                        <li key={p.id || idx} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1 font-medium text-sm text-slate-800">
                            {p.locationName || p.locationId || '--'}
                          </div>
                        </li>
                      ))}
                      {sortedPoints.length === 0 && (
                        <li className="p-4 text-center text-sm text-slate-500">Chưa có điểm dừng nào</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Không tìm thấy thông tin
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 cursor-pointer"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusRouteDetailModal;
