import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPolicy() {
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
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
                <p className="text-slate-600 mb-12">Last updated:  December 20, 2024</p>

                <div className="prose prose-slate max-w-none space-y-8">
                    <Section
                        title="1. Information We Collect"
                        content="We collect information you provide directly to us, including your name, email address, phone number, business details, and station information. We also collect usage data and analytics to improve our services."
                    />
                    <Section
                        title="2. How We Use Your Information"
                        content="We use the information we collect to provide, maintain, and improve our services, to communicate with you, to process transactions, and to ensure the security of our platform."
                    />
                    <Section
                        title="3. Information Sharing"
                        content="We do not sell your personal information. We may share your information with service providers who help us operate our platform, and as required by law."
                    />
                    <Section
                        title="4. Data Security"
                        content="We implement industry-standard security measures to protect your information, including encryption, secure servers, and regular security audits."
                    />
                    <Section
                        title="5. Your Rights"
                        content="You have the right to access, correct, or delete your personal information. You can also opt-out of marketing communications at any time."
                    />
                    <Section
                        title="6. Cookies"
                        content="We use cookies and similar technologies to enhance your experience, analyze usage, and personalize content. You can control cookie settings through your browser."
                    />
                    <Section
                        title="7. Changes to This Policy"
                        content="We may update this privacy policy from time to time. We will notify you of any significant changes by email or through our platform."
                    />
                    <Section
                        title="8. Contact Us"
                        content="If you have questions about this privacy policy, please contact us at privacy@cngbharat.com or call +91 98765 43210."
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
