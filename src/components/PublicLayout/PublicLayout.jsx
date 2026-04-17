import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const PublicLayout = () => {
  return (
    <>
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default PublicLayout;
