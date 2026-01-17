import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, Mail, User, MapPin, Globe, Lock, FileText, Link2, Bell, Smartphone, Database, Users, Baby, Settings, Building2, CreditCard, Clock, Trash2 } from 'lucide-react';

export default function PrivacyPolicy() {
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
                        <Shield className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
                    <p className="text-slate-600">Last Updated: January 9, 2026</p>
                </div>

                <div className="space-y-8">
                    {/* Introduction */}
                    <Section
                        icon={<FileText className="w-6 h-6 text-emerald-600" />}
                        title="Introduction"
                        content={
                            <div className="space-y-4">
                                <p>
                                    <strong>CNG Bharat</strong> ("we", "our", "us") operates the CNG Bharat mobile application, which provides information about CNG stations and real-time or updated availability of CNG to help users plan their travel efficiently.
                                </p>
                                <p>
                                    Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our app and services ("Service").
                                </p>
                                <p className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-emerald-800">
                                    By using the Service, you agree to this Privacy Policy.
                                </p>
                            </div>
                        }
                    />

                    {/* Company & Ownership Details */}
                    <Section
                        icon={<Building2 className="w-6 h-6 text-emerald-600" />}
                        title="Company & Ownership Details"
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

                    {/* Nature of Service */}
                    <Section
                        icon={<MapPin className="w-6 h-6 text-emerald-600" />}
                        title="Nature of Service"
                        content={
                            <div className="space-y-4">
                                <p>CNG Bharat provides:</p>
                                <ul className="list-disc list-inside space-y-2 text-slate-600 ml-2">
                                    <li>Information about nearby CNG stations</li>
                                    <li>CNG availability status at stations</li>
                                    <li>Location-based station discovery</li>
                                </ul>
                                <p className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-800">
                                    ⚠️ We do not sell CNG directly. We only provide informational services related to CNG stations.
                                </p>
                            </div>
                        }
                    />

                    {/* Information We Collect */}
                    <Section
                        icon={<Database className="w-6 h-6 text-emerald-600" />}
                        title="Information We Collect"
                        content={
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded">1</span>
                                        Personal Information
                                    </h4>
                                    <p className="text-slate-600">
                                        We do not require users to create an account. Personal information is collected only if you contact us directly via email.
                                    </p>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded">2</span>
                                        Location Information
                                    </h4>
                                    <ul className="list-disc list-inside space-y-2 text-slate-600">
                                        <li>Location access may be requested only to show nearby CNG stations and availability</li>
                                        <li>Location data is not stored or shared without user consent</li>
                                    </ul>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                        <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded">3</span>
                                        Non-Personal Information
                                    </h4>
                                    <ul className="list-disc list-inside space-y-2 text-slate-600">
                                        <li>Device type</li>
                                        <li>App usage statistics</li>
                                        <li>IP address (for security and analytics purposes)</li>
                                    </ul>
                                </div>
                            </div>
                        }
                    />

                    {/* How We Use Your Information */}
                    <Section
                        icon={<Settings className="w-6 h-6 text-emerald-600" />}
                        title="How We Use Your Information"
                        content={
                            <div>
                                <p className="mb-3">We use information to:</p>
                                <ul className="list-disc list-inside space-y-2 text-slate-600">
                                    <li>Display nearby CNG stations and availability</li>
                                    <li>Improve accuracy of station data</li>
                                    <li>Enhance app performance and user experience</li>
                                    <li>Respond to user queries and support requests</li>
                                </ul>
                            </div>
                        }
                    />

                    {/* Data Sharing */}
                    <Section
                        icon={<Users className="w-6 h-6 text-emerald-600" />}
                        title="Data Sharing"
                        content={
                            <div>
                                <p className="mb-3 font-medium text-emerald-700">We do not sell or rent your data.</p>
                                <p className="mb-2">Information may be shared only:</p>
                                <ul className="list-disc list-inside space-y-2 text-slate-600">
                                    <li>If required by law</li>
                                    <li>To protect legal rights</li>
                                    <li>With trusted service providers (e.g., maps or analytics) strictly for app functionality</li>
                                </ul>
                            </div>
                        }
                    />

                    {/* Third-Party Services */}
                    <Section
                        icon={<Link2 className="w-6 h-6 text-emerald-600" />}
                        title="Third-Party Services"
                        content={
                            <div className="space-y-3">
                                <p>The app may use third-party tools such as:</p>
                                <ul className="list-disc list-inside space-y-2 text-slate-600">
                                    <li>Google Maps</li>
                                    <li>Analytics services</li>
                                </ul>
                                <p className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-blue-800">
                                    ℹ️ These third parties have their own privacy policies, and we encourage users to review them.
                                </p>
                            </div>
                        }
                    />

                    {/* Data Security */}
                    <Section
                        icon={<Lock className="w-6 h-6 text-emerald-600" />}
                        title="Data Security"
                        content={
                            <div className="space-y-4">
                                <p className="text-slate-600">
                                    We take reasonable security measures to protect user data. However, no online system can guarantee complete security.
                                </p>
                                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                                    <p className="font-semibold text-emerald-800 mb-2">Security Measures Include:</p>
                                    <ul className="list-disc list-inside space-y-1 text-emerald-700">
                                        <li>SSL/TLS encryption for data transmission</li>
                                        <li>Secure servers and databases</li>
                                        <li>Regular security audits</li>
                                        <li>Access controls and authentication</li>
                                    </ul>
                                </div>
                            </div>
                        }
                    />

                    {/* Data Retention */}
                    <Section
                        icon={<Clock className="w-6 h-6 text-emerald-600" />}
                        title="Data Retention"
                        content={
                            <div className="space-y-3">
                                <p className="text-slate-600">
                                    We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-slate-600">
                                    <li>Account data: Retained until account deletion request</li>
                                    <li>Usage analytics: Retained for up to 24 months</li>
                                    <li>Payment records: Retained as required by tax laws (typically 7 years)</li>
                                </ul>
                            </div>
                        }
                    />

                    {/* Payment Information - Razorpay */}
                    <Section
                        icon={<CreditCard className="w-6 h-6 text-emerald-600" />}
                        title="Payment Information (Razorpay)"
                        content={
                            <div className="space-y-4">
                                <p className="text-slate-600">
                                    For subscription and premium features, we use <strong>Razorpay</strong> as our payment gateway.
                                </p>
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <p className="font-semibold text-blue-800 mb-2">Payment Data Handling:</p>
                                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                                        <li>We do NOT store your complete card/bank details</li>
                                        <li>Payment processing is handled entirely by Razorpay</li>
                                        <li>Razorpay is PCI-DSS compliant</li>
                                        <li>We only store transaction IDs for reference</li>
                                    </ul>
                                </div>
                                <p className="text-slate-600">
                                    For Razorpay's privacy practices, please visit: <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Razorpay Privacy Policy</a>
                                </p>
                            </div>
                        }
                    />

                    {/* Data Deletion */}
                    <Section
                        icon={<Trash2 className="w-6 h-6 text-emerald-600" />}
                        title="Data Deletion"
                        content={
                            <div className="space-y-4">
                                <p className="text-slate-600">
                                    You can request deletion of your personal data at any time by contacting us at <a href="mailto:cngbharat2025@gmail.com" className="text-emerald-600 hover:underline">cngbharat2025@gmail.com</a>.
                                </p>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="font-semibold text-slate-800 mb-2">Upon deletion request:</p>
                                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                                        <li>Your account and associated data will be permanently deleted within 30 days</li>
                                        <li>Some data may be retained for legal compliance</li>
                                        <li>Anonymized analytics data may be retained</li>
                                    </ul>
                                </div>
                            </div>
                        }
                    />

                    {/* Children's Privacy */}
                    <Section
                        icon={<Baby className="w-6 h-6 text-emerald-600" />}
                        title="Children's Privacy"
                        content={
                            <p className="text-slate-600">
                                CNG Bharat does not knowingly collect data from children under the age of 13. If such data is identified, it will be removed immediately.
                            </p>
                        }
                    />

                    {/* Your Rights (GDPR & Google Play Compliant) */}
                    <Section
                        icon={<Shield className="w-6 h-6 text-emerald-600" />}
                        title="Your Rights"
                        content={
                            <div className="space-y-4">
                                <p className="mb-3">Under applicable data protection laws, you have the following rights:</p>
                                <div className="grid gap-3">
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <p className="font-semibold text-slate-800">Right to Access</p>
                                        <p className="text-slate-600 text-sm">Request a copy of your personal data we hold</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <p className="font-semibold text-slate-800">Right to Rectification</p>
                                        <p className="text-slate-600 text-sm">Request correction of inaccurate data</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <p className="font-semibold text-slate-800">Right to Erasure</p>
                                        <p className="text-slate-600 text-sm">Request deletion of your personal data</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <p className="font-semibold text-slate-800">Right to Withdraw Consent</p>
                                        <p className="text-slate-600 text-sm">Withdraw consent for data processing at any time</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <p className="font-semibold text-slate-800">Right to Data Portability</p>
                                        <p className="text-slate-600 text-sm">Request transfer of your data in a machine-readable format</p>
                                    </div>
                                </div>
                                <p className="text-slate-600 mt-4">
                                    To exercise any of these rights, contact us at <a href="mailto:cngbharat2025@gmail.com" className="text-emerald-600 hover:underline">cngbharat2025@gmail.com</a>
                                </p>
                            </div>
                        }
                    />

                    {/* Changes to This Policy */}
                    <Section
                        icon={<Bell className="w-6 h-6 text-emerald-600" />}
                        title="Changes to This Policy"
                        content={
                            <p className="text-slate-600">
                                We may update this Privacy Policy periodically. Changes will be reflected with an updated date.
                            </p>
                        }
                    />

                    {/* Contact Us */}
                    <Section
                        icon={<Mail className="w-6 h-6 text-emerald-600" />}
                        title="Contact Us"
                        content={
                            <div>
                                <p className="mb-4 text-slate-600">If you have questions about this Privacy Policy or data usage, contact us:</p>
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
