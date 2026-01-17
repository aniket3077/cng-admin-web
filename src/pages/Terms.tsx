import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, Mail, User, Building2, Globe, Smartphone, UserCheck, AlertTriangle, CheckCircle, Info, Scale, Link2, Shield, Lock, Bell, Gavel, CreditCard, RefreshCcw, IndianRupee } from 'lucide-react';

export default function Terms() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Go back to home"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="CNG Bharat" className="w-8 h-8 rounded-lg object-contain bg-white" />
                        <span className="text-lg font-bold text-slate-900">CNG Bharat</span>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                        <FileText className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms and Conditions</h1>
                    <p className="text-slate-600">Last Updated: January 9, 2026</p>
                </div>

                <div className="space-y-8">
                    {/* 1. Introduction */}
                    <Section
                        icon={<FileText className="w-6 h-6 text-emerald-600" />}
                        title="1. Introduction"
                        content={
                            <div className="space-y-4">
                                <p>
                                    These Terms and Conditions ("Terms") govern your use of the <strong>CNG Bharat</strong> mobile application and related services ("Service"), operated by CNG Bharat.
                                </p>
                                <p className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-emerald-800">
                                    By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, please do not use the app.
                                </p>
                            </div>
                        }
                    />

                    {/* 2. Company Information */}
                    <Section
                        icon={<Building2 className="w-6 h-6 text-emerald-600" />}
                        title="2. Company Information"
                        content={
                            <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-emerald-600" />
                                    <span className="text-slate-700"><strong>Company Name:</strong> CNG Bharat</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-5 h-5 text-emerald-600" />
                                    <span className="text-slate-700"><strong>App Name:</strong> CNG Bharat</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-emerald-600" />
                                    <span className="text-slate-700"><strong>Owner Name:</strong> Chaitanya Varale</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-emerald-600" />
                                    <span className="text-slate-700"><strong>Contact Email:</strong> </span>
                                    <a href="mailto:cngbharat2025@gmail.com" className="text-emerald-600 hover:underline font-medium">
                                        cngbharat2025@gmail.com
                                    </a>
                                </div>
                            </div>
                        }
                    />

                    {/* 3. Nature of Service */}
                    <Section
                        icon={<Info className="w-6 h-6 text-emerald-600" />}
                        title="3. Nature of Service"
                        content={
                            <div className="space-y-4">
                                <p>
                                    CNG Bharat provides information about CNG stations and availability of CNG to assist users in locating nearby stations.
                                </p>
                                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-amber-800">Disclaimer:</p>
                                            <p className="text-amber-700">
                                                CNG Bharat does not own or operate CNG stations and does not sell CNG. Availability data is informational and may vary in real time.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    />

                    {/* 4. User Eligibility */}
                    <Section
                        icon={<UserCheck className="w-6 h-6 text-emerald-600" />}
                        title="4. User Eligibility"
                        content={
                            <p className="text-slate-600">
                                You must be at least <strong>18 years old</strong> to use this Service. By using the app, you confirm that you meet this requirement.
                            </p>
                        }
                    />

                    {/* 5. User Responsibilities */}
                    <Section
                        icon={<CheckCircle className="w-6 h-6 text-emerald-600" />}
                        title="5. User Responsibilities"
                        content={
                            <div>
                                <p className="mb-3">You agree:</p>
                                <ul className="space-y-2 text-slate-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-600 mt-1">✓</span>
                                        To use the app only for lawful purposes
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-600 mt-1">✓</span>
                                        Not to misuse or attempt to disrupt the Service
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-600 mt-1">✓</span>
                                        Not to copy, reverse-engineer, or resell app content
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-600 mt-1">✓</span>
                                        Not to provide false or misleading information
                                    </li>
                                </ul>
                            </div>
                        }
                    />

                    {/* 6. Accuracy of Information */}
                    <Section
                        icon={<AlertTriangle className="w-6 h-6 text-emerald-600" />}
                        title="6. Accuracy of Information"
                        content={
                            <div className="space-y-4">
                                <p>While we strive to keep information accurate and updated, CNG Bharat does not guarantee:</p>
                                <ul className="list-disc list-inside space-y-2 text-slate-600 ml-2">
                                    <li>CNG availability</li>
                                    <li>Station operating hours</li>
                                    <li>Accuracy of third-party data</li>
                                </ul>
                                <p className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-blue-800">
                                    ℹ️ Users are advised to verify information directly with the CNG station.
                                </p>
                            </div>
                        }
                    />

                    {/* 7. Intellectual Property */}
                    <Section
                        icon={<Shield className="w-6 h-6 text-emerald-600" />}
                        title="7. Intellectual Property"
                        content={
                            <p className="text-slate-600">
                                All content, logos, text, designs, and software used in the app are the property of <strong>CNG Bharat</strong> and protected by applicable laws. Unauthorized use is prohibited.
                            </p>
                        }
                    />

                    {/* 8. Third-Party Services */}
                    <Section
                        icon={<Link2 className="w-6 h-6 text-emerald-600" />}
                        title="8. Third-Party Services"
                        content={
                            <p className="text-slate-600">
                                The app may include third-party services such as maps or analytics tools. We are not responsible for the content or policies of these third parties.
                            </p>
                        }
                    />

                    {/* 9. Limitation of Liability */}
                    <Section
                        icon={<Scale className="w-6 h-6 text-emerald-600" />}
                        title="9. Limitation of Liability"
                        content={
                            <div>
                                <p className="mb-3">To the maximum extent permitted by law, CNG Bharat shall not be liable for:</p>
                                <ul className="list-disc list-inside space-y-2 text-slate-600">
                                    <li>Any loss or damage arising from reliance on app information</li>
                                    <li>Service interruptions or inaccuracies</li>
                                    <li>Indirect or consequential damages</li>
                                </ul>
                            </div>
                        }
                    />

                    {/* 10. Termination */}
                    <Section
                        icon={<Lock className="w-6 h-6 text-emerald-600" />}
                        title="10. Termination"
                        content={
                            <p className="text-slate-600">
                                We reserve the right to suspend or terminate access to the Service at any time without prior notice if these Terms are violated.
                            </p>
                        }
                    />

                    {/* 11. Subscription & Pricing */}
                    <Section
                        icon={<IndianRupee className="w-6 h-6 text-emerald-600" />}
                        title="11. Subscription & Pricing"
                        content={
                            <div className="space-y-4">
                                <p className="text-slate-600">
                                    CNG Bharat may offer premium subscription plans with enhanced features.
                                </p>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="font-semibold text-slate-800 mb-2">Subscription Terms:</p>
                                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                                        <li>Prices are displayed in Indian Rupees (INR)</li>
                                        <li>Subscriptions are billed monthly or annually as selected</li>
                                        <li>Prices may change with 30 days prior notice</li>
                                        <li>All prices are inclusive of applicable taxes</li>
                                    </ul>
                                </div>
                            </div>
                        }
                    />

                    {/* 12. Payment Terms (Razorpay) */}
                    <Section
                        icon={<CreditCard className="w-6 h-6 text-emerald-600" />}
                        title="12. Payment Terms (Razorpay)"
                        content={
                            <div className="space-y-4">
                                <p className="text-slate-600">
                                    All payments are processed securely through <strong>Razorpay Payment Gateway</strong>.
                                </p>
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <p className="font-semibold text-blue-800 mb-2">Accepted Payment Methods:</p>
                                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                                        <li>UPI (Google Pay, PhonePe, Paytm, etc.)</li>
                                        <li>Credit Cards (Visa, MasterCard, RuPay)</li>
                                        <li>Debit Cards</li>
                                        <li>Net Banking</li>
                                        <li>Wallets (Paytm, Mobikwik, etc.)</li>
                                    </ul>
                                </div>
                                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                                    <p className="font-semibold text-emerald-800 mb-2">Payment Security:</p>
                                    <ul className="list-disc list-inside space-y-1 text-emerald-700">
                                        <li>Razorpay is PCI-DSS compliant</li>
                                        <li>256-bit SSL encryption</li>
                                        <li>We never store your card details</li>
                                        <li>All transactions are secure and encrypted</li>
                                    </ul>
                                </div>
                            </div>
                        }
                    />

                    {/* 13. Refund & Cancellation Policy */}
                    <Section
                        icon={<RefreshCcw className="w-6 h-6 text-emerald-600" />}
                        title="13. Refund & Cancellation Policy"
                        content={
                            <div className="space-y-4">
                                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                    <p className="font-semibold text-amber-800 mb-2">Refund Policy:</p>
                                    <ul className="list-disc list-inside space-y-1 text-amber-700">
                                        <li>Refund requests must be made within 7 days of purchase</li>
                                        <li>Refunds will be processed within 5-7 business days</li>
                                        <li>Refunds will be credited to the original payment method</li>
                                        <li>Partial refunds may apply for used subscription periods</li>
                                    </ul>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="font-semibold text-slate-800 mb-2">Cancellation Policy:</p>
                                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                                        <li>You may cancel your subscription at any time</li>
                                        <li>Access continues until the end of the billing period</li>
                                        <li>No refund for the remaining subscription period after cancellation</li>
                                        <li>Auto-renewal can be disabled from account settings</li>
                                    </ul>
                                </div>
                                <p className="text-slate-600">
                                    For refund requests, contact us at <a href="mailto:cngbharat2025@gmail.com" className="text-emerald-600 hover:underline">cngbharat2025@gmail.com</a> with your transaction ID.
                                </p>
                            </div>
                        }
                    />

                    {/* 14. Privacy */}
                    <Section
                        icon={<Shield className="w-6 h-6 text-emerald-600" />}
                        title="14. Privacy"
                        content={
                            <div className="space-y-3">
                                <p className="text-slate-600">
                                    Your use of the Service is also governed by our Privacy Policy, which explains how we handle your data.
                                </p>
                                <a
                                    href="/privacy"
                                    className="inline-flex items-center gap-2 text-emerald-600 hover:underline font-medium"
                                >
                                    <Shield className="w-4 h-4" />
                                    View Privacy Policy
                                </a>
                            </div>
                        }
                    />

                    {/* 15. Changes to Terms */}
                    <Section
                        icon={<Bell className="w-6 h-6 text-emerald-600" />}
                        title="15. Changes to Terms"
                        content={
                            <p className="text-slate-600">
                                We may update these Terms at any time. Continued use of the Service after updates constitutes acceptance of the revised Terms.
                            </p>
                        }
                    />

                    {/* 16. Governing Law */}
                    <Section
                        icon={<Gavel className="w-6 h-6 text-emerald-600" />}
                        title="16. Governing Law"
                        content={
                            <p className="text-slate-600">
                                These Terms shall be governed by and interpreted in accordance with the laws of <strong>India</strong>. Any disputes shall be subject to the jurisdiction of Indian courts.
                            </p>
                        }
                    />

                    {/* 17. Contact Us */}
                    <Section
                        icon={<Mail className="w-6 h-6 text-emerald-600" />}
                        title="17. Contact Us"
                        content={
                            <div>
                                <p className="mb-4 text-slate-600">For any questions regarding these Terms and Conditions, please contact:</p>
                                <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-emerald-600" />
                                        <span className="text-slate-700"><strong>Email:</strong> </span>
                                        <a href="mailto:cngbharat2025@gmail.com" className="text-emerald-600 hover:underline font-medium">
                                            cngbharat2025@gmail.com
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Building2 className="w-5 h-5 text-emerald-600" />
                                        <span className="text-slate-700"><strong>Company:</strong> CNG Bharat</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-emerald-600" />
                                        <span className="text-slate-700"><strong>Owner:</strong> Chaitanya Varale</span>
                                    </div>
                                </div>
                            </div>
                        }
                    />
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-slate-200 text-center">
                    <p className="text-slate-500 text-sm">
                        © 2026 CNG Bharat. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

function Section({ icon, title, content }: { icon: React.ReactNode; title: string; content: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
                {icon}
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            </div>
            <div className="text-slate-700 leading-relaxed">{content}</div>
        </div>
    );
}
