import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft } from 'lucide-react';

export default function Pricing() {
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
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl font-bold text-slate-900 mb-6">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">Choose the plan that fits your needs. All plans include a 14-day free trial.</p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-12 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    <PricingCard
                        name="Basic"
                        price="₹999"
                        period="/month"
                        description="Perfect for single station owners"
                        features={[
                            "1 Station",
                            "Basic Analytics",
                            "Mobile App Access",
                            "Email Support",
                            "Daily Reports"
                        ]}
                        buttonText="Start Free Trial"
                        onClick={() => navigate('/signup')}
                    />
                    <PricingCard
                        name="Standard"
                        price="₹2,499"
                        period="/month"
                        description="For growing station networks"
                        features={[
                            "Up to 5 Stations",
                            "Advanced Analytics",
                            "Priority Support",
                            "API Access",
                            "Custom Reports",
                            "Team Collaboration"
                        ]}
                        buttonText="Start Free Trial"
                        onClick={() => navigate('/signup')}
                        highlighted
                    />
                    <PricingCard
                        name="Premium"
                        price="₹4,999"
                        period="/month"
                        description="For enterprise networks"
                        features={[
                            "Unlimited Stations",
                            "Predictive Analytics",
                            "24/7 Phone Support",
                            "Full API Access",
                            "White-label Options",
                            "Dedicated Account Manager",
                            "Custom Integrations"
                        ]}
                        buttonText="Contact Sales"
                        onClick={() => navigate('/signup')}
                    />
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <FAQItem
                            question="Can I change my plan later?"
                            answer="Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
                        />
                        <FAQItem
                            question="Is there a setup fee?"
                            answer="No, there are no hidden fees. You only pay the monthly subscription price."
                        />
                        <FAQItem
                            question="What payment methods do you accept?"
                            answer="We accept all major credit cards, debit cards, UPI, and net banking."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function PricingCard({ name, price, period, description, features, buttonText, onClick, highlighted = false }: any) {
    return (
        <div className={`p-8 rounded-2xl border-2 ${highlighted ? 'border-primary-500 shadow-xl shadow-primary-500/10' : 'border-slate-200'} bg-white`}>
            {highlighted && (
                <div className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-4">Most Popular</div>
            )}
            <h3 className="text-2xl font-bold text-slate-900">{name}</h3>
            <div className="mt-4 mb-2">
                <span className="text-4xl font-bold text-slate-900">{price}</span>
                <span className="text-slate-600">{period}</span>
            </div>
            <p className="text-slate-600 mb-8">{description}</p>
            <button
                onClick={onClick}
                className={`w-full py-3 rounded-xl font-bold transition-colors ${highlighted
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    }`}
            >
                {buttonText}
            </button>
            <ul className="mt-8 space-y-4">
                {features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    return (
        <div className="p-6 bg-slate-50 rounded-xl">
            <h3 className="font-bold text-slate-900 mb-2">{question}</h3>
            <p className="text-slate-600">{answer}</p>
        </div>
    );
}
