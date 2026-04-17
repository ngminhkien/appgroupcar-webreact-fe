import React from 'react';

const PendingVehicleTable = ({ vehicles }) => {
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
              Phương tiện
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-['Inter']">
              Loại xe
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-['Inter']">
              Dòng xe
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-['Inter']">
              Trạng thái
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-['Inter']">
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {vehicles.map((vehicle) => (
             <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors group cursor-pointer text-sm font-['Inter']">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-lg object-cover border border-slate-200 shadow-sm" src={vehicle.imageUrl} alt="Car Icon" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{vehicle.plate}</div>
                      <div className="text-sm text-slate-500 font-medium">ID: #{vehicle.id.toString().padStart(4, '0')}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm font-medium text-slate-700">{vehicle.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-700 font-medium">
                     {vehicle.brand} <span className="text-slate-400 font-normal">({vehicle.year})</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(vehicle.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-slate-800 bg-slate-200 hover:bg-slate-300 transition-colors font-semibold">
                     Xem chi tiết
                  </button>
                  {vehicle.status === 'pending' && (
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
          {vehicles.length === 0 && (
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-['Inter']">
                 Không tìm thấy phương tiện nào khớp.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Pagination Footer */}
      {vehicles.length > 0 && (
         <div className="bg-white px-4 py-3 border-t border-slate-100 sm:px-6 flex items-center justify-between">
            <div className="hidden sm:block">
               <p className="text-sm text-slate-700 font-['Inter']">
                  Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{vehicles.length}</span> trên <span className="font-medium">{vehicles.length}</span> phương tiện
               </p>
            </div>
         </div>
      )}
    </div>
  );
};

export default PendingVehicleTable;
