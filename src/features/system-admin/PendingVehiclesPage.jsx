import React, { useState } from 'react';
import PendingVehicleTable from '../../components/AdminSysLayout/PendingVehicle/PendingVehicleTable';

const FAKE_VEHICLES = [
  { id: 1, plate: '30A-123.45', type: 'Sedan 4 chỗ', brand: 'Toyota Vios', year: '2022', status: 'pending', imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=150&q=80' },
  { id: 2, plate: '51G-567.89', type: 'SUV 7 chỗ', brand: 'Hyundai SantaFe', year: '2023', status: 'pending', imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=150&q=80' },
  { id: 3, plate: '29C-999.99', type: 'Bán tải', brand: 'Ford Ranger', year: '2021', status: 'rejected', imageUrl: 'https://images.unsplash.com/photo-1559404223-911ce6518a22?auto=format&fit=crop&w=150&q=80' },
  { id: 4, plate: '60B-333.33', type: 'Sedan 4 chỗ', brand: 'Kia K3', year: '2024', status: 'approved', imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=150&q=80' },
];

const PendingVehiclesPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredVehicles = FAKE_VEHICLES.filter(vehicle => {
    const matchesSearch = vehicle.plate.toLowerCase().includes(searchKeyword.toLowerCase()) || 
                          vehicle.brand.toLowerCase().includes(searchKeyword.toLowerCase());
    if (activeFilter === 'all') return matchesSearch;
    return matchesSearch && vehicle.status === activeFilter;
  });

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Inter']">
            Phê duyệt Phương tiện
          </h1>
          <p className="text-slate-500 mt-2 font-medium font-['Inter']">
            Quản lý và xem xét các hồ sơ phương tiện mới đăng ký.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10l2-4h14l2 4v7h-2v2h-2v-2H7v2H5v-2H3v-7z"></path>
                <circle cx="7" cy="14" r="1.5" fill="currentColor"></circle>
                <circle cx="17" cy="14" r="1.5" fill="currentColor"></circle>
             </svg>
          </div>
          <div>
            <p className="text-slate-500 font-medium font-['Inter'] text-sm">Tổng phương tiện</p>
            <p className="text-2xl font-bold text-slate-800">{FAKE_VEHICLES.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
             </svg>
          </div>
          <div>
            <p className="text-slate-500 font-medium font-['Inter'] text-sm">Chờ duyệt</p>
             <p className="text-2xl font-bold text-slate-800">
               {FAKE_VEHICLES.filter(v => v.status === 'pending').length}
             </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
             </svg>
          </div>
          <div>
            <p className="text-slate-500 font-medium font-['Inter'] text-sm">Đã Phê duyệt</p>
             <p className="text-2xl font-bold text-slate-800">
               {FAKE_VEHICLES.filter(v => v.status === 'approved').length}
             </p>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
         <PendingVehicleTable vehicles={filteredVehicles} />
      </div>
    </div>
  );
};

export default PendingVehiclesPage;
