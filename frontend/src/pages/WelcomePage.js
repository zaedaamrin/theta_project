import React from 'react';
import Nav from '../components/Nav';
import WelcomeMid from '../components/WelcomeMid';
import Footer from '../components/Footer';
import '../App.css';
import WelcomeTop from '../components/WelcomeTop';

const WelcomePage = () => {
  return (
    <div className="welcome-page">
      <Nav />
      <WelcomeTop />
      <WelcomeMid /> 
      <Footer />
    </div>
  );
};

export default WelcomePage;
