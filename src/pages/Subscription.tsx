import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader, Zap, Star, Shield, HelpCircle, Phone, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../services/api';

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
    id: 'trial',
    name: '7-Day Trial',
    price: 1,
    duration: '7 days',
    features: [
      'Full Platform Access',
      'List Unlimited Stations',
      'Real-time Updates',
      'Analytics Dashboard',
      'Priority Support',
    ],
    popular: false,
  },
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

const readResponseJson = async (response: Response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subscriptionState, setSubscriptionState] = useState<{ plan: string; isActive: boolean; isPendingApproval?: boolean; expiresAt: string | null } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const token = localStorage.getItem('ownerToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/owner/subscription`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await readResponseJson(response);

        if (response.ok) {
          setSubscriptionState(data.subscription);
        }
      } catch (err) {
        console.error('Failed to load subscription status:', err);
      }
    };

    loadSubscription();
  }, [navigate]);

  const handleRequestApproval = async (planId: string) => {
    setSelectedPlan(planId);
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('ownerToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/owner/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      });

      const data = await readResponseJson(response);

      if (!response.ok) {
        throw new Error(data?.error || data?.message || 'Failed to submit request');
      }

      setSubscriptionState(data.subscription || null);
      alert('Subscription request sent to admin for approval.');
    } catch (err: any) {
      setError(err.message || 'Failed to submit request');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-800">Choose Your Plan</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Choose a plan and send it to the admin for approval. No payment is collected from the station owner at this step.
        </p>
      </div>

      {subscriptionState?.isPendingApproval && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Approval request pending</p>
            <p className="text-sm">Your {subscriptionState.plan} plan is waiting for admin approval.</p>
          </div>
        </div>
      )}

      {subscriptionState?.isActive && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-900 flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Active subscription</p>
            <p className="text-sm">Your {subscriptionState.plan} plan is active until {subscriptionState.expiresAt ? new Date(subscriptionState.expiresAt).toLocaleDateString() : 'N/A'}.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center flex items-center justify-center gap-2">
          <Shield className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 hover:transform hover:-translate-y-2 group ${plan.popular
              ? 'bg-white border-2 border-primary-500 shadow-2xl shadow-primary-500/10'
              : 'bg-white border border-slate-200 hover:border-primary-200 hover:shadow-xl hover:shadow-slate-200/50'
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
              <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-primary-600' : 'text-slate-800'}`}>{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-800">₹{plan.price.toLocaleString()}</span>
                <span className="text-slate-500 italic">/{plan.duration}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-slate-600 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleRequestApproval(plan.id)}
              disabled={loading && selectedPlan === plan.id}
              className={`w-full py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${plan.popular
                ? 'bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 text-white shadow-lg shadow-primary-500/25'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading && selectedPlan === plan.id ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  {plan.popular ? <Zap className="w-5 h-5 fill-current" /> : <Star className="w-5 h-5" />}
                  Request Approval
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ / Info Section */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 pt-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-xl mt-1 text-blue-600">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Need Custom Solutions?</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Have multiple stations or specific enterprise needs? Send your plan request and the admin team will review it.
              </p>
              <a href="tel:+919876543210" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2 transition-colors">
                <Phone className="w-4 h-4" /> Contact Sales
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl mt-1 text-emerald-600">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Safe & Secure</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Requests are reviewed by the admin team before a plan is activated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
