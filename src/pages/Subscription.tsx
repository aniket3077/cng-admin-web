import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader, Zap, Star, Shield, HelpCircle, Phone } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://cng-backend.vercel.app/api';

// Declare Razorpay type
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 999,
    duration: 'month',
    features: [
      'List 1 CNG Station',
      'Basic visibility on map',
      'Customer reviews',
      'Email support',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 2499,
    duration: 'month',
    features: [
      'List up to 3 CNG Stations',
      'Priority visibility on map',
      'Real-time CNG availability updates',
      'Customer reviews & ratings',
      'Analytics dashboard',
      'Phone & email support',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 4999,
    duration: 'month',
    features: [
      'Unlimited CNG Stations',
      'Top priority visibility',
      'Real-time CNG availability',
      'Advanced analytics',
      'Promotional banners',
      'Dedicated account manager',
      '24/7 priority support',
      'API access',
    ],
  },
];

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId);
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('ownerToken');
      if (!token) {
        navigate('/login');
        return;
      }

      // Create order
      const response = await fetch(`${API_URL}/owner/subscription/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Initialize Razorpay
      const plan = plans.find(p => p.id === planId);
      const options = {
        key: 'rzp_test_RtZjpW0SUdQOs0', // Your Razorpay test key
        amount: data.amount,
        currency: 'INR',
        name: 'CNG Bharat',
        description: `${plan?.name} Plan Subscription`,
        order_id: data.orderId,
        handler: async function (response: any) {
          // Verify payment
          try {
            const verifyResponse = await fetch(`${API_URL}/owner/subscription/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              alert('Subscription activated successfully!');
              navigate('/owner/dashboard');
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (err: any) {
            setError(err.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: data.ownerName || '',
          email: data.ownerEmail || '',
          contact: data.ownerPhone || '',
        },
        theme: {
          color: '#f97316',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to process subscription');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Choose Your Plan</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Unlock the full potential of CNG Bharat. List your stations, track real-time availability, and grow your business.
        </p>
      </div>

      {error && (
        <div className="max-w-md mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center flex items-center justify-center gap-2">
          <Shield className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative glass-card rounded-3xl p-8 flex flex-col transition-all duration-300 hover:transform hover:-translate-y-2 group ${plan.popular
                ? 'border-primary-500 shadow-2xl shadow-primary-500/20 bg-gradient-to-b from-slate-900/80 to-slate-900/90'
                : 'border-white/10 hover:border-white/20'
              }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary-500/30">
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-8">
              <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-200'}`}>{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">₹{plan.price.toLocaleString()}</span>
                <span className="text-slate-500 italic">/{plan.duration}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? 'bg-primary-500/20 text-primary-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-slate-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading && selectedPlan === plan.id}
              className={`w-full py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${plan.popular
                  ? 'bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading && selectedPlan === plan.id ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {plan.popular ? <Zap className="w-5 h-5 fill-current" /> : <Star className="w-5 h-5" />}
                  Subscribe Now
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ / Info Section */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 pt-8">
        <div className="glass-card p-6 rounded-2xl border border-white/5">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl mt-1">
              <HelpCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Need Custom Solutions?</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Have multiple stations or specific enterprise needs? We can tailor a plan just for you.
              </p>
              <a href="tel:+919876543210" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2 transition-colors">
                <Phone className="w-4 h-4" /> Contact Sales
              </a>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl mt-1">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Safe & Secure</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Secure payments via Razorpay. Cancel anytime. 24/7 dedicated support for premium partners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
