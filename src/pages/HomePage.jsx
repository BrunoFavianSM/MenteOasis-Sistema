import React from 'react';
import Navbar from '../components/webpage/Navbar';
import Hero from '../components/webpage/Hero';
import About from '../components/webpage/About';
import Services from '../components/webpage/Services';
import Workshops from '../components/webpage/Workshops';
import SocialWork from '../components/webpage/SocialWork';
import Events from '../components/webpage/Events';
import Galeria from '../components/webpage/Galeria';
import LocationMap from '../components/webpage/LocationMap';
import ContactForm from '../components/webpage/ContactForm';
import Footer from '../components/webpage/Footer';
import WhatsAppButton from '../components/webpage/WhatsAppButton';
import Testimonials from '../components/webpage/Testimonials';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <Navbar />
            <Hero />
            <About />
            <Services />
            <Testimonials />
            <Workshops />
            <SocialWork />
            <Events />
            <Galeria />
            <LocationMap />
            <ContactForm />
            <Footer />
            <WhatsAppButton />
        </div>
    );
};

export default HomePage;
