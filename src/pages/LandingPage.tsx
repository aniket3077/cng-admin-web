import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    BarChart3,
    BatteryCharging,
    CheckCircle,
    Clock,
    Globe,
    LayoutDashboard,
    MapPin,
    Smartphone,
    Zap
} from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden selection:bg-primary-500/30">

            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary-200/40 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[35%] h-[40%] bg-lime-200/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[30%] bg-primary-100/40 rounded-full blur-[100px]" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="CNG Bharat" className="w-10 h-10 rounded-xl shadow-lg shadow-primary-500/20 object-contain bg-white" />
                    <span className="text-xl font-bold tracking-tight text-slate-900">CNG Bharat</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-5 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:scale-95 transition-all"
                    >
                        Partner Registration
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-16 pb-32 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 animate-slide-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-slate-200 backdrop-blur-md shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                            <span className="text-sm font-medium text-slate-600">Live across 500+ stations</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-slate-900">
                            Fueling India's <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-lime-500">
                                Green Revolution
                            </span>
                        </h1>

                        <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                            The smartest platform for CNG station owners to manage operations, track inventory, and connect with millions of EV & CNG vehicle owners.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-lime-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
                            >
                                Start Free Trial
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg shadow-lg shadow-slate-200/50 hover:bg-slate-50 hover:border-slate-300 transition-all font-sans"
                            >
                                View Demo
                            </button>
                        </div>

                        <div className="pt-8 flex items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-primary-500" />
                                <span className="text-sm font-medium text-slate-600">No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-primary-500" />
                                <span className="text-sm font-medium text-slate-600">14-day free trial</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative animate-fade-in delay-200 perspective-1000">
                        {/* 3D Background Blobs */}
                        <div className="absolute -inset-10 bg-gradient-to-tr from-primary-400/30 to-lime-400/30 rounded-[3rem] blur-3xl transform rotate-6 animate-pulse" />
                        <div className="absolute -inset-5 bg-gradient-to-bl from-blue-400/20 to-primary-500/20 rounded-[3rem] blur-2xl transform -rotate-3" />

                        {/* Main Card with 3D Effect */}
                        <div className="relative glass-card bg-white/80 backdrop-blur-2xl border-2 border-white/60 p-3 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transform hover:scale-[1.02] transition-transform duration-500">
                            {/* Dashboard Preview */}
                            <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 shadow-inner">
                                <img
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
                                    alt="CNG Analytics Dashboard"
                                    className="w-full h-full object-cover opacity-90"
                                />

                                {/* Glassmorphism Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                                {/* Live Dashboard UI Elements */}
                                <div className="absolute bottom-6 left-6 right-6 space-y-4">
                                    {/* Revenue Card */}
                                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/50 transform hover:scale-105 transition-transform">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Monthly Revenue</p>
                                                <h3 className="text-2xl font-bold text-slate-900 mt-1">₹24,50,000</h3>
                                            </div>
                                            <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-lime-500 rounded-xl flex items-center justify-center shadow-lg">
                                                <BarChart3 className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div className="bg-gradient-to-r from-primary-500 to-lime-500 h-full w-[75%] rounded-full" />
                                            </div>
                                            <span className="text-xs font-bold text-emerald-600">+18.5%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Floating Cards with 3D Effect */}
                            <div className="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100 flex items-center gap-4 animate-bounce-slow transform hover:scale-110 transition-transform cursor-pointer">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl blur opacity-50" />
                                    <div className="relative p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl border border-emerald-200">
                                        <BatteryCharging className="w-7 h-7 text-emerald-600" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Now</p>
                                    <p className="text-2xl font-bold text-slate-900">156</p>
                                    <p className="text-xs text-emerald-600 font-semibold">+12 stations</p>
                                </div>
                            </div>

                            <div className="absolute -top-8 -right-8 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100 flex items-center gap-4 animate-bounce-slow delay-700 transform hover:scale-110 transition-transform cursor-pointer">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-primary-600 rounded-xl blur opacity-50" />
                                    <div className="relative p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl border border-blue-200">
                                        <Globe className="w-7 h-7 text-blue-600" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Coverage</p>
                                    <p className="text-2xl font-bold text-slate-900">28</p>
                                    <p className="text-xs text-blue-600 font-semibold">Cities</p>
                                </div>
                            </div>

                            {/* Additional Floating Element */}
                            <div className="absolute top-1/2 -left-12 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 animate-pulse">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-lime-500 animate-ping" />
                                    <span className="text-sm font-bold text-slate-700">Live</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-white relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">Simple Process</h2>
                        <h3 className="text-3xl font-bold text-slate-900 mb-4">How CNG Bharat Works</h3>
                        <p className="text-slate-500 text-lg">Get your station up and running in 3 simple steps.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center group">
                            <div className="w-16 h-16 mx-auto bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-bold text-primary-600">1</span>
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 mb-2">Register Station</h4>
                            <p className="text-slate-500">Sign up and provide basic station details including location and capacity.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 mx-auto bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-bold text-primary-600">2</span>
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 mb-2">Verify & Configure</h4>
                            <p className="text-slate-500">Complete verification and set up your real-time inventory tracking system.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 mx-auto bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-bold text-primary-600">3</span>
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 mb-2">Go Live</h4>
                            <p className="text-slate-500">Start accepting digital bookings and managing your station efficiently.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 py-24 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to scale</h2>
                        <p className="text-slate-500 text-lg">Streamline your CNG station operations with our comprehensive suite of management tools.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<LayoutDashboard />}
                            title="Centralized Dashboard"
                            description="Monitor all your stations from a single, intuitive interface. Track sales, inventory, and staff performance in real-time."
                        />
                        <FeatureCard
                            icon={<BarChart3 />}
                            title="Advanced Analytics"
                            description="Get deep insights into peak hours, customer trends, and revenue growth. Make data-driven decisions."
                        />
                        <FeatureCard
                            icon={<Clock />}
                            title="Real-time Inventory"
                            description="Never run out of stock. Automated alerts and prediction algorithms keep your supply chain smooth."
                        />
                    </div>
                </div>
            </section>

            {/* Mobile App Showcase with Map */}
            <section className="relative z-10 py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Content */}
                        <div className="order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-6">
                                <Smartphone className="w-4 h-4 text-primary-600" />
                                <span className="text-sm font-bold text-primary-600 uppercase tracking-wide">Mobile App</span>
                            </div>

                            <h2 className="text-4xl font-bold text-slate-900 mb-6">Find CNG Stations <br />Anywhere, Anytime</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                The CNG Bharat mobile app helps drivers discover nearby CNG stations, check real-time availability, and navigate with ease. Available for iOS and Android.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Live Station Locator</h4>
                                        <p className="text-slate-600 text-sm">Real-time map showing all nearby CNG stations with availability status.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Live Stock Updates</h4>
                                        <p className="text-slate-600 text-sm">Check fuel availability before you drive to save time and fuel.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Smart Navigation</h4>
                                        <p className="text-slate-600 text-sm">Turn-by-turn directions to your chosen station integrated with maps.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="#" className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-xs">Download on the</div>
                                        <div className="text-sm font-bold">App Store</div>
                                    </div>
                                </a>
                                <a href="https://drive.google.com/file/d/1M2NTJrcpg9jMRsAu0LrnftPWHvRtFD0R/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-xs">Get it on</div>
                                        <div className="text-sm font-bold">Google Play</div>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Right: Mobile App Mockup with Map */}
                        <div className="order-1 lg:order-2 relative perspective-[2000px] h-[600px] flex items-center justify-center">
                            {/* Background Map Pattern */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                                <div className="w-full h-full" style={{
                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2364748b\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                                    backgroundSize: '30px 30px'
                                }} />
                            </div>

                            {/* --- Floating Elements (Badges) --- */}

                            {/* 1. Real-time Updates (Top Left) */}
                            <div className="absolute top-20 left-0 lg:-left-12 z-40 animate-float-slow hidden md:block">
                                <div className="bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/60">
                                    <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        Real-time Updates
                                    </p>
                                </div>
                            </div>

                            {/* 2. Trusted By Badge (Bottom Left) */}
                            <div className="absolute bottom-32 left-0 lg:-left-20 z-40 animate-float hidden md:block">
                                <div className="glass-card bg-white/95 p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] min-w-[220px]">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex -space-x-3">
                                            <img src="https://i.pravatar.cc/100?img=1" alt="" className="w-9 h-9 rounded-full border-2 border-white" />
                                            <img src="https://i.pravatar.cc/100?img=5" alt="" className="w-9 h-9 rounded-full border-2 border-white" />
                                            <img src="https://i.pravatar.cc/100?img=8" alt="" className="w-9 h-9 rounded-full border-2 border-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Trusted by</p>
                                        <p className="text-base font-bold text-slate-900">50,000+ Users</p>
                                    </div>
                                </div>
                            </div>

                            {/* 3. New! Badge (Top Right of Phone) */}
                            <div className="absolute top-10 right-10 lg:right-12 z-40 animate-float-delayed">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-lime-400 blur-lg opacity-50 animate-pulse" />
                                    <div className="relative bg-gradient-to-br from-lime-400 to-green-500 text-white px-5 py-2 rounded-full shadow-lg font-bold text-sm transform rotate-12 flex items-center gap-1">
                                        <Zap className="w-4 h-4 fill-current" /> New!
                                    </div>
                                </div>
                            </div>

                            {/* 4. AI-Powered Search (Right Middle) */}
                            <div className="absolute top-1/3 -right-4 lg:-right-24 z-40 animate-float hidden md:block">
                                <div className="bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/60">
                                    <p className="text-sm font-bold text-slate-800">✨ AI-Powered Search</p>
                                </div>
                            </div>

                            {/* 5. Smart Navigation (Bottom Right) */}
                            <div className="absolute bottom-24 right-0 lg:-right-16 z-40 animate-float-slow hidden md:block">
                                <div className="bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/60">
                                    <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary-500" />
                                        Smart Navigation
                                    </p>
                                </div>
                            </div>

                            {/* --- Map Pins Background --- */}
                            <div className="absolute top-20 left-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 animate-bounce-slow z-0 opacity-80">
                                <MapPin className="w-6 h-6 fill-current" />
                            </div>
                            <div className="absolute bottom-40 right-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-emerald-500 animate-bounce-slow delay-300 z-0 opacity-80">
                                <MapPin className="w-5 h-5 fill-current" />
                            </div>

                            {/* --- iPhone 15 Pro Mockup Container --- */}
                            <div className="relative z-10 mx-auto w-[320px] h-[650px] animate-3d-float group">
                                {/* Hand Image Layer - Behind Phone */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[700px] z-0 pointer-events-none mix-blend-multiply opacity-80">
                                    <img
                                        src="https://images.unsplash.com/photo-1622782914767-404fb9ab3f57?q=80&w=1000&auto=format&fit=crop"
                                        alt="Hand holding phone"
                                        className="w-full h-full object-contain scale-[1.35] translate-y-12 translate-x-8"
                                        style={{ mixBlendMode: 'multiply' }}
                                    />
                                </div>

                                {/* iPhone 15 Pro Frame */}
                                <div className="relative z-10 w-full h-full bg-slate-900 rounded-[3.5rem] p-3 shadow-[0_0_0_4px_#334155,0_0_0_8px_#1e293b,0_20px_50px_-12px_rgba(0,0,0,0.6)] ml-1">

                                    {/* Screen Content */}
                                    <div className="relative w-full h-full bg-slate-950 rounded-[2.8rem] overflow-hidden border-[3px] border-slate-900">

                                        {/* Dynamic Island Area */}
                                        <div className="absolute top-0 w-full h-14 z-50 flex justify-center items-start pt-3 pointer-events-none">
                                            <div className="w-32 h-9 bg-black rounded-full flex items-center justify-between px-3 transition-all duration-300 group-hover:w-48 group-hover:h-10">
                                                <div className="w-8 h-8 rounded-full bg-slate-900 overflow-hidden flex items-center justify-center relative">
                                                    {/* Fake animation inside island */}
                                                    <div className="absolute inset-0 bg-green-500/20 animate-pulse" />
                                                    <Zap className="w-4 h-4 text-green-500 relative z-10" />
                                                </div>
                                                <span className="text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">Navigating...</span>
                                                <div className="w-5 h-5 rounded-full bg-slate-800 animate-pulse bg-green-500/50" />
                                            </div>
                                        </div>

                                        {/* Status Bar Elements (Fake) */}
                                        <div className="absolute top-3 left-8 z-40 text-[10px] font-bold text-white">9:41</div>
                                        <div className="absolute top-4 right-8 z-40 flex gap-1.5">
                                            <div className="w-4 h-2.5 bg-white rounded-[2px]" />
                                            <div className="w-0.5 h-1 bg-white" />
                                        </div>

                                        {/* Background Map (Dark Theme) */}
                                        <div className="absolute inset-0 z-0 bg-slate-900">
                                            {/* Reliable Map Texture - Inverted for Dark Mode Effect */}
                                            <img
                                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
                                                alt="Map Background"
                                                className="w-full h-full object-cover opacity-20 mix-blend-screen grayscale"
                                            />
                                            {/* India Outline Hint (CSS Shape) */}
                                            <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
                                        </div>

                                        {/* UI Header */}
                                        <div className="absolute top-14 left-4 right-4 z-20">
                                            <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/10">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                                                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="User" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="h-2 w-20 bg-slate-700 rounded mb-1" />
                                                        <div className="h-3 w-32 bg-slate-800 rounded" />
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-primary-900/30 flex items-center justify-center text-primary-400 border border-primary-500/20">
                                                        <Zap className="w-4 h-4 fill-current" />
                                                    </div>
                                                </div>
                                                {/* Search Bar */}
                                                <div className="mt-3 bg-black/40 border border-white/10 rounded-xl p-2 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[10px] text-slate-400">Search India...</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Map Pins (Explicitly Visible) */}
                                        {/* Delhi Area */}
                                        <div className="absolute top-[30%] left-[45%] z-10 animate-bounce-pin">
                                            <div className="relative group/pin">
                                                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center shadow-xl text-white border-2 border-white transform transition-transform group-hover/pin:scale-110">
                                                    <MapPin className="w-4 h-4 fill-current" />
                                                </div>
                                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded shadow text-[8px] font-bold whitespace-nowrap">New Delhi</div>
                                            </div>
                                        </div>

                                        {/* Mumbai Area */}
                                        <div className="absolute top-[50%] left-[20%] z-10 animate-bounce-pin delay-300">
                                            <div className="relative group/pin">
                                                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-xl text-white border-2 border-white">
                                                    <div className="text-[8px] font-bold">CNG</div>
                                                </div>
                                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded shadow text-[8px] font-bold whitespace-nowrap">Mumbai</div>
                                            </div>
                                        </div>

                                        {/* Bangalore Area */}
                                        <div className="absolute top-[70%] left-[40%] z-10 animate-bounce-pin delay-500">
                                            <div className="relative group/pin">
                                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl text-emerald-600 border-2 border-emerald-50">
                                                    <Zap className="w-4 h-4 fill-current" />
                                                </div>
                                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded shadow text-[8px] font-bold whitespace-nowrap">Bangalore</div>
                                            </div>
                                        </div>

                                        {/* Bottom Sheet UI */}
                                        <div className="absolute bottom-6 left-4 right-4 z-30">
                                            <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl p-4 shadow-[0_8px_40px_-10px_rgba(0,0,0,0.5)] border border-white/10">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-white">Nearest Station</h4>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <div className="px-1.5 py-0.5 bg-green-900/30 border border-green-500/20 rounded text-[9px] font-bold text-green-400">OPEN</div>
                                                            <span className="text-[10px] text-slate-400">2.5 km away</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white border border-slate-800">
                                                        <MapPin className="w-5 h-5" />
                                                    </div>
                                                </div>
                                                <button className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-primary-500/10 transition-all active:scale-[0.98]">
                                                    Start Navigation
                                                </button>
                                            </div>
                                        </div>

                                        {/* Side Buttons (iPhone Hardware) */}
                                        <div className="absolute top-32 -left-[5px] w-[4px] h-10 bg-slate-800 rounded-l-md" />
                                        <div className="absolute top-48 -left-[5px] w-[4px] h-14 bg-slate-800 rounded-l-md" />
                                        <div className="absolute top-40 -right-[5px] w-[4px] h-20 bg-slate-800 rounded-r-md" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white relative z-10 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-16">Trusted by Station Owners</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((s) => <div key={s} className="w-5 h-5 text-yellow-500 fill-current">★</div>)}
                            </div>
                            <p className="text-slate-600 mb-6 italic">"CNG Bharat transformed how we manage our daily operations. The inventory tracking is a game-changer!"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                                <div>
                                    <p className="font-bold text-slate-900">Rajesh Kumar</p>
                                    <p className="text-sm text-slate-500">Green Fuel Station, Delhi</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((s) => <div key={s} className="w-5 h-5 text-yellow-500 fill-current">★</div>)}
                            </div>
                            <p className="text-slate-600 mb-6 italic">"The analytics helped us identify peak times and optimize our staff shifts. Highly recommended."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                                <div>
                                    <p className="font-bold text-slate-900">Amit Patel</p>
                                    <p className="text-sm text-slate-500">Eco Energy, Gujarat</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto bg-slate-900 rounded-[2.5rem] p-12 lg:p-24 relative overflow-hidden shadow-2xl shadow-slate-900/20">
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />

                    <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-6">Trusted by leading <br /> energy providers.</h2>
                            <p className="text-slate-400 text-lg mb-8">Join the network that's powering the future of sustainable transportation in India.</p>
                            <button
                                onClick={() => navigate('/signup')}
                                className="text-white font-semibold border-b-2 border-primary-500 hover:text-primary-400 transition-colors pb-1 inline-flex items-center gap-2"
                            >
                                Join the network <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <Stat number="500+" label="Active Stations" />
                            <Stat number="10M+" label="Daily Customers" />
                            <Stat number="99.9%" label="Uptime Guaranteed" />
                            <Stat number="24/7" label="Support" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-200 bg-white relative z-10">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/logo.png" alt="CNG Bharat" className="w-8 h-8 rounded-lg object-contain bg-white" />
                            <span className="text-lg font-bold text-slate-900">CNG Bharat</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Empowering CNG station owners with digital tools for a greener future.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><button onClick={() => navigate('/features')} className="hover:text-primary-600">Features</button></li>
                            <li><button onClick={() => navigate('/pricing')} className="hover:text-primary-600">Pricing</button></li>
                            <li><a href="#" className="hover:text-primary-600">API</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><button onClick={() => navigate('/about')} className="hover:text-primary-600">About Us</button></li>
                            <li><a href="#" className="hover:text-primary-600">Careers</a></li>
                            <li><button onClick={() => navigate('/contact')} className="hover:text-primary-600">Contact</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><button onClick={() => navigate('/privacy')} className="hover:text-primary-600">Privacy Policy</button></li>
                            <li><button onClick={() => navigate('/terms')} className="hover:text-primary-600">Terms of Service</button></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-sm">© 2024 CNG Bharat. All rights reserved.</p>
                    <div className="flex gap-4">
                        {/* Social Icons Placeholder */}
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="group p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-primary-100 shadow-xl shadow-slate-200/50 hover:shadow-primary-500/10 transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-primary-50 group-hover:border-primary-100 flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-500 leading-relaxed">{description}</p>
        </div>
    );
}

function Stat({ number, label }: { number: string, label: string }) {
    return (
        <div>
            <p className="text-4xl font-bold text-white mb-2">{number}</p>
            <p className="text-slate-500 text-sm uppercase tracking-wider font-medium">{label}</p>
        </div>
    );
}
