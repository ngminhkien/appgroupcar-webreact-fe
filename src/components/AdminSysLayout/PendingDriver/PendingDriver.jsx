import React from 'react';

const DriverApprovalTable = ({ drivers }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-1.5"></span>
            Chờ duyệt
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-1.5"></span>
            Đã duyệt
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-1.5"></span>
            Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] table-fixed divide-y divide-slate-200">
        <thead className="bg-slate-50/80 backdrop-blur-sm">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-['Inter']">
              Tài xế
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-['Inter']">
              Hạng bằng
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-['Inter']">
              Ngày nộp
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-['Inter']">
              Trạng thái
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-['Inter']">
              
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {drivers.map((driver) => (
             <tr key={driver.id} className="hover:bg-slate-50 transition-colors group cursor-pointer text-sm font-['Inter']">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full border-2 border-white shadow-sm" src={driver.avatarUrl} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{driver.name}</div>
                      <div className="text-sm text-slate-500 font-medium">ID: #{driver.id.toString().padStart(4, '0')}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm font-medium text-slate-700">{driver.licenseClass}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-slate-600 font-medium">
                     <svg className="w-4 h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                     </svg>
                     {driver.submissionDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(driver.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-slate-800 bg-slate-200 hover:bg-slate-300 transition-colors font-semibold">
                     Xem chi tiết
                  </button>
                  {driver.status === 'pending' && (
                     <button className="ml-3 inline-flex items-center justify-center px-4 py-2 rounded-xl text-emerald-900 bg-[#6FF399] hover:bg-[#5ce085] transition-colors font-semibold">
                        <svg className="w-5 h-5 mr-1.5 text-emerald-800" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        Phê duyệt
                     </button>
                   )}
                </td>
             </tr>
          ))}
          {drivers.length === 0 && (
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-['Inter']">
                 Không tìm thấy hồ sơ nào khớp.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Pagination Footer */}
      {drivers.length > 0 && (
         <div className="bg-white px-4 py-3 border-t border-slate-100 sm:px-6 flex items-center justify-between">
            <div className="hidden sm:block">
               <p className="text-sm text-slate-700 font-['Inter']">
                  Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{drivers.length}</span> trên <span className="font-medium">{drivers.length}</span> hồ sơ
               </p>
            </div>
         </div>
      )}
    </div>
  );
};

export default DriverApprovalTable;
