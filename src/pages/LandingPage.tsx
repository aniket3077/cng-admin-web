import { Link } from 'react-router-dom';

export default function LandingPage() {
  const features = [
    {
      title: 'Station Management',
      description: 'Complete CRM system to manage your fuel station operations, inventory, and staff efficiently.'
    },
    {
      title: 'Owner Dashboard',
      description: 'Real-time analytics, revenue tracking, and performance insights for station owners.'
    },
    {
      title: 'Customer Support',
      description: 'Integrated ticketing system to handle customer queries and support requests seamlessly.'
    },
    {
      title: 'Multi-Station Support',
      description: 'Manage multiple fuel stations from a single dashboard with role-based access control.'
    }
  ];

  const howItWorks = [
    { step: '1', title: 'Sign Up', description: 'Create your station owner account in minutes' },
    { step: '2', title: 'Add Stations', description: 'Register your CNG/fuel stations with details' },
    { step: '3', title: 'Get Verified', description: 'Complete KYC and get admin approval' },
    { step: '4', title: 'Go Live', description: 'Start managing operations and tracking analytics' }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '₹0',
      period: '/month',
      features: ['1 Station', 'Basic Dashboard', 'Email Support', '7-day Data History'],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Basic',
      price: '₹29',
      period: '/month',
      features: ['Up to 3 Stations', 'Advanced Analytics', 'Priority Support', '30-day Data History', 'Custom Reports'],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Premium',
      price: '₹49',
      period: '/month',
      features: ['Unlimited Stations', 'Full Analytics Suite', '24/7 Priority Support', 'Unlimited Data History', 'API Access', 'Dedicated Account Manager'],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/WhatsApp%20Image%202025-12-10%20at%2016.41.29_8d5288d7.jpg" 
                alt="Fule Bharat Logo" 
                className="h-12 w-auto object-contain"
              />
              <span className="text-2xl font-black tracking-wide text-gray-900">FULE BHARAT</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-sky-600 font-medium transition">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-sky-600 font-medium transition">How It Works</a>
              <a href="#pricing" className="text-gray-700 hover:text-sky-600 font-medium transition">Pricing</a>
              <a href="#contact" className="text-gray-700 hover:text-sky-600 font-medium transition">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-sky-600 font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-2 rounded-lg hover:from-sky-600 hover:to-sky-700 transition-all font-semibold shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Hero Logo */}
            <div className="mb-8 flex justify-center">
              <img 
                src="/WhatsApp%20Image%202025-12-10%20at%2016.41.29_8d5288d7.jpg" 
                alt="Fule Bharat Logo" 
                className="w-48 h-48 object-contain drop-shadow-2xl"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Manage Your CNG Stations with
              <span className="block mt-2 bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
                Fule Bharat Platform
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Complete management solution for CNG and fuel station owners. Track operations, manage staff, handle support tickets, and grow your business with powerful analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center bg-gradient-to-r from-sky-500 to-sky-600 text-white px-8 py-4 rounded-lg hover:from-sky-600 hover:to-sky-700 transition-all font-semibold shadow-lg text-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Free Trial
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center bg-white text-gray-700 px-8 py-4 rounded-lg hover:bg-sky-50 transition-all font-semibold border-2 border-sky-200 text-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for Station Owners
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage and grow your fuel station business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border-2 border-sky-100 hover:border-sky-500 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-sky-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-sky-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {step.description}
                  </p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <svg className="w-8 h-8 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 ${
                  plan.popular ? 'border-4 border-sky-500 transform scale-105' : 'border-2 border-sky-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-6 py-1 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white hover:from-sky-600 hover:to-cyan-600 shadow-md'
                      : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-500 to-cyan-600">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose Fule Bharat?
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90">
            Join hundreds of station owners who trust Fule Bharat to manage their operations efficiently
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-2xl font-bold mb-2">Secure & Reliable</h3>
              <p className="opacity-90">Bank-grade security for your business data</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-2xl font-bold mb-2">Lightning Fast</h3>
              <p className="opacity-90">Optimized performance for seamless experience</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-2xl font-bold mb-2">24/7 Support</h3>
              <p className="opacity-90">Expert help whenever you need it</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Station Management?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join Fule Bharat today and experience the future of fuel station operations
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-10 py-4 rounded-lg hover:from-sky-600 hover:to-cyan-600 transition-all font-semibold shadow-lg text-lg"
          >
            Get Started Now
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/WhatsApp%20Image%202025-12-10%20at%2016.41.29_8d5288d7.jpg" 
                  alt="Fule Bharat Logo" 
                  className="w-12 h-12 object-contain"
                />
                <span className="text-xl font-bold">FULE BHARAT</span>
              </div>
              <p className="text-gray-400">
                Modern CRM for fuel station management
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#contact" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@fulebharat.in
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Mumbai, India
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 Fule Bharat. All rights reserved. | Empowering Fuel Station Owners</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
