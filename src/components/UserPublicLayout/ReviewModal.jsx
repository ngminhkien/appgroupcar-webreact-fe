import React, { useState } from 'react';
import { postReviewApi } from '@/services/reviewService';

/**
 * ReviewModal – hiển thị form đánh giá công ty/tài xế sau khi hoàn thành chuyến.
 *
 * Props:
 *   - isOpen:       boolean
 *   - onClose:      () => void
 *   - bookingType:  'bus' | 'carpool' | 'cargo'
 *   - booking:      object  (mapped booking item)
 *     - id           referenceId (chuyến đi)
 *     - revieweeId   ID công ty hoặc tài xế
 *     - revieweeName Tên hiển thị (công ty hoặc tài xế)
 */
const SERVICE_TYPE = { bus: 4, carpool: 1, cargo: 3 };

const StarRating = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className={`text-4xl transition-all duration-150 cursor-pointer hover:scale-110 leading-none ${
          star <= value
            ? 'text-amber-400 drop-shadow-[0_1px_3px_rgba(251,191,36,0.6)]'
            : 'text-slate-300 hover:text-amber-300'
        }`}
      >
        ★
      </button>
    ))}
  </div>
);

const RATING_LABELS = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'];

const ReviewModal = ({ isOpen, onClose, bookingType, booking }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !booking) return null;

  const reviewerId = localStorage.getItem('userId') || '';
  const serviceType = SERVICE_TYPE[bookingType] ?? 4;

  // Nhãn hiển thị: bus → "công ty", carpool/cargo → "tài xế"
  const targetLabel = bookingType === 'bus' ? 'nhà xe' : 'tài xế';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Vui lòng chọn số sao đánh giá.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await postReviewApi({
        referenceId: booking.id,
        serviceType,
        reviewerId,
        revieweeId: booking.revieweeId,
        rating,
        comment: comment.trim(),
      });
      setSuccess(true);
    } catch (err) {
      console.error('Review error:', err);
      setError(err?.response?.data?.message || 'Gửi đánh giá thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Panel */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 flex items-center justify-center">
              <span className="text-amber-500 text-lg">★</span>
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Đánh giá {targetLabel}</h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5 truncate max-w-[200px]">
                {booking.revieweeName || 'Không xác định'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          {success ? (
            /* ─── Success state ─── */
            <div className="flex flex-col items-center py-6 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-base font-black text-slate-900">Cảm ơn bạn đã đánh giá!</p>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Đánh giá của bạn giúp cải thiện chất lượng dịch vụ.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm py-2.5 px-8 rounded-2xl transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          ) : (
            /* ─── Form state ─── */
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Route info chip */}
              <div className="bg-slate-50 rounded-2xl p-3.5 flex items-center gap-3 border border-slate-100">
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs font-bold text-slate-700 truncate">
                  {booking.from} <span className="text-slate-400 mx-1">→</span> {booking.to}
                </span>
                <span className="ml-auto text-[10px] font-black text-slate-400 shrink-0">{booking.date}</span>
              </div>

              {/* Star Rating */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chọn mức đánh giá</p>
                <StarRating value={rating} onChange={setRating} />
                <p className={`text-sm font-extrabold transition-all duration-200 ${rating > 0 ? 'text-amber-500' : 'text-slate-300'}`}>
                  {rating > 0 ? RATING_LABELS[rating] : '—'}
                </p>
              </div>

              {/* Comment textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600">
                  Nhận xét <span className="text-slate-400 font-medium">(không bắt buộc)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={`Chia sẻ trải nghiệm của bạn về ${targetLabel} này...`}
                  rows={3}
                  maxLength={500}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 resize-none transition-all"
                />
                <span className="text-[10px] text-slate-400 font-medium self-end">{comment.length}/500</span>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-xs font-bold text-rose-600">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-black text-sm py-3 rounded-2xl transition-all cursor-pointer shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Gửi đánh giá
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
