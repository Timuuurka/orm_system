import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow px-4 py-6 max-w-6xl mx-auto">
      {children}
    </main>
    <Footer />
  </div>
);

export default MainLayout;
