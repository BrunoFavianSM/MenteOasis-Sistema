import React from 'react';
import Navbar from './components/webpage/Navbar';
import Hero from './components/webpage/Hero';
import About from './components/webpage/About';
import Services from './components/webpage/Services';
import Workshops from './components/webpage/Workshops';
import SocialWork from './components/webpage/SocialWork';
import Events from './components/webpage/Events';
import LocationMap from './components/webpage/LocationMap';
import Footer from './components/webpage/Footer';
import WhatsAppButton from './components/webpage/WhatsAppButton';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Workshops />
      <SocialWork />
      <Events />
      <LocationMap />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default App;
