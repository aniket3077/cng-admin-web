import { useNavigate } from 'react-router-dom';
import {
    BarChart3,
    Bell,
    ChevronLeft,
    Clock,
    Globe,
    LayoutDashboard,
    MapPin,
    Shield,
    Smartphone,
    Zap
} from 'lucide-react';

export default function Features() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <nav className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                        </button>
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="CNG Bharat" className="w-8 h-8 rounded-lg object-contain bg-white" />
                            <span className="text-lg font-bold text-slate-900">CNG Bharat</span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl font-bold text-slate-900 mb-6">Powerful Features for Modern Fuel Management</h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">Everything you need to run a successful CNG station network, all in one platform.</p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<LayoutDashboard />}
                            title="Unified Dashboard"
                            description="Monitor all stations, track real-time metrics, and manage operations from a single command center."
                        />
                        <FeatureCard
                            icon={<BarChart3 />}
                            title="Advanced Analytics"
                            description="Deep insights into sales trends, peak hours, and customer behavior with predictive forecasting."
                        />
                        <FeatureCard
                            icon={<Clock />}
                            title="Real-time Inventory"
                            description="Live stock tracking with automated low-stock alerts and smart reordering suggestions."
                        />
                        <FeatureCard
                            icon={<Smartphone />}
                            title="Mobile Management"
                            description="Full-featured mobile app to manage your stations on the go, anytime, anywhere."
                        />
                        <FeatureCard
                            icon={<Shield />}
                            title="Enterprise Security"
                            description="Bank-grade encryption, role-based access control, and comprehensive audit logs."
                        />
                        <FeatureCard
                            icon={<Bell />}
                            title="Smart Alerts"
                            description="Instant notifications for critical events, anomalies, and performance thresholds."
                        />
                        <FeatureCard
                            icon={<Globe />}
                            title="Network Integration"
                            description="Connect with fleet operators and B2B partners for consistent volume and revenue."
                        />
                        <FeatureCard
                            icon={<MapPin />}
                            title="Location Intelligence"
                            description="Geospatial analytics to optimize station placement and understand regional demand."
                        />
                        <FeatureCard
                            icon={<Zap />}
                            title="API Access"
                            description="Comprehensive REST API for custom integrations and third-party applications."
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 bg-slate-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Ready to transform your operations?</h2>
                    <p className="text-slate-400 text-lg mb-8">Join hundreds of station owners already using CNG Bharat.</p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-8 py-4 bg-primary-500 text-white rounded-2xl font-bold text-lg hover:bg-primary-600 transition-colors"
                    >
                        Start Free Trial
                    </button>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-primary-200 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
        </div>
    );
}
