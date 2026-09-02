import React from 'react';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <div className="app-container">
      <CustomCursor />
      <Hero />
      <Portfolio />
      <Footer />
    </div>
  );
}

export default App;
