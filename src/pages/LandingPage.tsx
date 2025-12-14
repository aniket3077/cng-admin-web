import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: 'NO MATTER WHAT THE ENERGY NEED',
      subtitle: 'WE HAVE THE END TO END SOLUTION',
      description: 'All Purpose Fuel Solutions',
      image: 'https://images.unsplash.com/photo-1545262810-77515befe149?w=1200&q=80'
    },
    {
      title: 'FIND FUEL STATIONS',
      subtitle: 'ANYTIME, ANYWHERE',
      description: 'Smart Navigation & Real-time Updates',
      image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=1200&q=80'
    },
    {
      title: 'POWERING YOUR JOURNEY',
      subtitle: 'WITH RELIABLE ENERGY',
      description: 'Petrol, Diesel, CNG, LPG & EV Charging',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80'
    }
  ];

  const services = [
    {
      icon: '⛽',
      title: 'Petrol & Diesel',
      description: 'Premium quality fuel at competitive prices'
    },
    {
      icon: '🔥',
      title: 'CNG & LPG',
      description: 'Clean energy solutions for homes and vehicles'
    },
    {
      icon: '⚡',
      title: 'EV Charging',
      description: 'Fast charging stations for electric vehicles'
    },
    {
      icon: '🏪',
      title: 'Station Network',
      description: '500+ stations across India'
    }
  ];

  const stats = [
    { value: '500+', label: 'Fuel Stations' },
    { value: '50K+', label: 'Happy Customers' },
    { value: '100K+', label: 'Daily Transactions' },
    { value: '24/7', label: 'Customer Support' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-blue-900 text-white py-2 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <span>📞 Customer Care: 1906</span>
            <span>📧 support@fuelbharat.com</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-xs">Follow us:</span>
            <div className="flex gap-2">
              <span className="cursor-pointer hover:text-blue-300">📘</span>
              <span className="cursor-pointer hover:text-blue-300">📷</span>
              <span className="cursor-pointer hover:text-blue-300">🔗</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">FB</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">Fuel Bharat</div>
                  <div className="text-xs text-gray-500">Your Friendly Fuel Partner</div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">About Us</a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium">Services</a>
              <a href="#network" className="text-gray-700 hover:text-blue-600 font-medium">Our Network</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
            </div>

            <Link
              to="/login"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all font-semibold shadow-lg"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Slider */}
      <section id="home" className="relative h-[600px] bg-gradient-to-r from-blue-900 to-blue-700 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={slides[activeSlide].image}
            alt="Hero"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-3xl">
            <div className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">NO MATTER WHAT THE</span>
              <div className="bg-red-600 inline-block px-6 py-2 mt-4">
                <span className="text-white">ENERGY</span>
              </div>
            </div>
            <div className="text-5xl md:text-6xl font-bold mb-8">
              NEED, WE HAVE<br />
              THE END TO END
            </div>
            <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              SOLUTION
            </div>
            <p className="text-xl mt-6 text-blue-100">{slides[activeSlide].description}</p>
          </div>

          {/* Fuel Cylinders Visual */}
          <div className="hidden lg:flex absolute right-20 bottom-10 items-end space-x-4">
            <div className="w-24 h-32 bg-gradient-to-b from-blue-600 to-blue-800 rounded-t-full rounded-b-lg shadow-2xl"></div>
            <div className="w-24 h-40 bg-gradient-to-b from-blue-600 to-blue-800 rounded-t-full rounded-b-lg shadow-2xl"></div>
            <div className="w-32 h-48 bg-gradient-to-b from-white to-gray-200 rounded-t-full rounded-b-lg shadow-2xl border-4 border-blue-600"></div>
            <div className="w-24 h-36 bg-gradient-to-b from-red-600 to-red-800 rounded-t-full rounded-b-lg shadow-2xl"></div>
            <div className="w-20 h-28 bg-gradient-to-b from-red-600 to-red-800 rounded-t-full rounded-b-lg shadow-2xl"></div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                activeSlide === index ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-blue-600">Services</span>
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive fuel solutions for all your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-blue-100"
              >
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Network Section */}
      <section id="network" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our Growing Network
          </h2>
          <p className="text-xl mb-12 text-blue-100">
            Expanding across India to serve you better
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Fuel Stations</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Cities Covered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <div className="text-5xl font-bold mb-2">20+</div>
              <div className="text-blue-200">States</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Fuel Bharat Network
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Partner with us to grow your fuel station business
          </p>
          <Link
            to="/login"
            className="inline-block bg-white text-orange-600 px-10 py-4 rounded-full hover:bg-gray-100 transition-all font-bold text-lg shadow-xl transform hover:scale-105"
          >
            Become a Partner
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">FB</span>
                </div>
                <span className="text-xl font-bold">Fuel Bharat</span>
              </div>
              <p className="text-gray-400">
                Your trusted fuel partner
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white">Home</a></li>
                <li><a href="#about" className="hover:text-white">About Us</a></li>
                <li><a href="#services" className="hover:text-white">Services</a></li>
                <li><a href="#network" className="hover:text-white">Network</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Petrol & Diesel</li>
                <li>CNG & LPG</li>
                <li>EV Charging</li>
                <li>Station Finder</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 Customer Care: 1906</li>
                <li>📧 support@fuelbharat.com</li>
                <li>📍 Mumbai, India</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 Fuel Bharat. All rights reserved. | Powering India's Energy Future</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
