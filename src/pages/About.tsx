import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Target, Users, Zap } from 'lucide-react';

export default function About() {
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
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold text-slate-900 mb-6">Powering India's Clean Energy Future</h1>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        CNG Bharat is India's leading platform for CNG station management, helping fuel providers digitize operations and scale sustainably.
                    </p>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    <ValueCard
                        icon={<Target />}
                        title="Our Mission"
                        description="To digitize India's CNG infrastructure and make clean fuel accessible to every corner of the nation."
                    />
                    <ValueCard
                        icon={<Users />}
                        title="Our Vision"
                        description="Become the trusted technology partner for 10,000+ CNG stations across India by 2027."
                    />
                    <ValueCard
                        icon={<Zap />}
                        title="Our Values"
                        description="Innovation, transparency, and sustainability drive everything we build and every decision we make."
                    />
                </div>
            </section>

            {/* Story */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Our Story</h2>
                    <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                        <p>
                            Founded in 2023, CNG Bharat was born from a simple observation: India's CNG stations were operating with outdated, fragmented systems that hindered growth and efficiency.
                        </p>
                        <p>
                            We set out to build a modern, unified platform that would empower station owners with the tools they need to compete in the digital age. Today, we serve hundreds of stations and millions of customers.
                        </p>
                        <p>
                            Our team combines deep expertise in energy, software, and operations to deliver a product that truly understands the needs of fuel providers.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 bg-slate-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Join us in shaping the future</h2>
                    <p className="text-slate-400 text-lg mb-8">Be part of India's clean energy revolution.</p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-8 py-4 bg-primary-500 text-white rounded-2xl font-bold text-lg hover:bg-primary-600 transition-colors"
                    >
                        Become a Partner
                    </button>
                </div>
            </section>
        </div>
    );
}

function ValueCard({ icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="p-8 bg-white rounded-2xl border border-slate-200">
            <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
    );
}
