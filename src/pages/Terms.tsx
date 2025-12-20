import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function Terms() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <nav className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
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
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
                <p className="text-slate-600 mb-12">Last updated: December 20, 2024</p>

                <div className="prose prose-slate max-w-none space-y-8">
                    <Section
                        title="1. Acceptance of Terms"
                        content="By accessing and using CNG Bharat's services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
                    />
                    <Section
                        title="2. Use of Services"
                        content="You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account credentials."
                    />
                    <Section
                        title="3. Subscription and Payment"
                        content="Subscription fees are billed monthly or annually as per your chosen plan. All fees are non-refundable except as required by law. We reserve the right to change pricing with 30 days notice."
                    />
                    <Section
                        title="4. User Content"
                        content="You retain ownership of any content you submit to our platform. By submitting content, you grant us a license to use, store, and display that content as necessary to provide our services."
                    />
                    <Section
                        title="5. Prohibited Activities"
                        content="You may not use our services to engage in illegal activities, transmit malicious code, attempt unauthorized access, or violate the rights of others."
                    />
                    <Section
                        title="6. Limitation of Liability"
                        content="CNG Bharat is provided 'as is' without warranties of any kind. We are not liable for any damages arising from your use of our services, except as required by law."
                    />
                    <Section
                        title="7. Termination"
                        content="We may terminate or suspend your access to our services at any time, with or without cause. You may cancel your subscription at any time through your account settings."
                    />
                    <Section
                        title="8. Governing Law"
                        content="These Terms are governed by the laws of India. Any disputes shall be resolved in the courts of New Delhi."
                    />
                    <Section
                        title="9. Changes to Terms"
                        content="We reserve the right to modify these Terms at any time. We will notify users of material changes via email or platform notification."
                    />
                    <Section
                        title="10. Contact"
                        content="For questions about these Terms, contact us at legal@cngbharat.com or call +91 98765 43210."
                    />
                </div>
            </div>
        </div>
    );
}

function Section({ title, content }: { title: string, content: string }) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{title}</h2>
            <p className="text-slate-600 leading-relaxed">{content}</p>
        </div>
    );
}
