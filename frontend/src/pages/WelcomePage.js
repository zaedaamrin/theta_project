import React from 'react';
import Nav from '../components/Nav';
import WelcomeMid from '../components/WelcomeMid';
import Footer from '../components/Footer';
import Intro from '../components/Intro';
import '../App.css';

const WelcomePage = () => {
  return (
    <div className="welcome-page">
      <Nav />
      <WelcomeMid /> 
      <Intro /> 
      <Footer />
    </div>
  );
};

export default WelcomePage;
