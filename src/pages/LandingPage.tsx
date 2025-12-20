import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    BarChart3,
    BatteryCharging,
    CheckCircle,
    Clock,
    Globe,
    LayoutDashboard
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

                    <div className="relative animate-fade-in delay-200">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-lime-500/20 rounded-[2.5rem] blur-2xl transform rotate-3" />
                        <div className="glass-card bg-white/70 backdrop-blur-xl border border-white/60 p-2 rounded-[2rem] shadow-2xl relative">
                            <img
                                src="/dashboard-mockup.png"
                                alt="CNG Station Manager Dashboard"
                                className="rounded-[1.5rem] w-full object-cover shadow-inner"
                            />

                            {/* Floating Cards */}
                            <div className="absolute -bottom-10 -left-10 glass bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce-slow">
                                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                                    <BatteryCharging className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Daily Sales</p>
                                    <p className="text-xl font-bold text-slate-800">₹ 4.2L</p>
                                </div>
                            </div>

                            <div className="absolute -top-10 -right-5 glass bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce-slow delay-700">
                                <div className="p-3 bg-primary-100 rounded-xl text-primary-600">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Active Users</p>
                                    <p className="text-xl font-bold text-slate-800">2.5k+</p>
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

            {/* Stats Section with Image Background Overlay */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto bg-slate-900 rounded-[2.5rem] p-12 lg:p-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px]" />

                    <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-6">Trusted by leading <br /> energy providors.</h2>
                            <p className="text-slate-400 text-lg mb-8">Join the network that's powering the future of sustainable transportation in India.</p>
                            <button
                                onClick={() => navigate('/signup')}
                                className="text-white font-semibold border-b border-primary-500 hover:text-primary-400 transition-colors pb-1 inline-flex items-center gap-2"
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
                            <li><a href="#" className="hover:text-primary-600">Features</a></li>
                            <li><a href="#" className="hover:text-primary-600">Pricing</a></li>
                            <li><a href="#" className="hover:text-primary-600">API</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><a href="#" className="hover:text-primary-600">About Us</a></li>
                            <li><a href="#" className="hover:text-primary-600">Careers</a></li>
                            <li><a href="#" className="hover:text-primary-600">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><a href="#" className="hover:text-primary-600">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary-600">Terms of Service</a></li>
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
