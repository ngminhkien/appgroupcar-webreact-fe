import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BookingSearchBar from './BookingSearchBar';

const UserPublicLayout = () => {
  const { pathname } = useLocation();
  const showSearchBar = pathname === '/booking' || pathname === '/create-request';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {showSearchBar && (
        <div className="bg-slate-50 pt-8 px-6 flex justify-center w-full relative z-20">
          <BookingSearchBar />
        </div>
      )}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserPublicLayout;
