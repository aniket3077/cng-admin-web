import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Shield, 
  Zap, 
  Sparkles, 
  Loader, 
  AlertTriangle, 
  Calendar, 
  Star, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { API_BASE_URL, ownerApi } from '../services/api';

interface OwnerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  subscriptionType?: 'basic' | 'standard' | 'premium' | 'trial' | null;
  subscriptionEndsAt?: string | null;
}

export default function Subscription() {
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchOwnerProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/owner/profile`, {
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.owner) {
          setProfile(data.owner);
          localStorage.setItem('ownerUser', JSON.stringify(data.owner));
        }
      } else if (response.status === 401) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setErrorMessage('Could not load subscription details. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOwnerProfile();
  }, []);

  const handleSubscribe = async (planId: 'basic' | 'standard' | 'premium' | 'trial') => {
    setLoadingPlan(planId);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // 1. Initiate order creation on backend
      const orderResponse = await ownerApi.initiateSubscription(planId);

      // Check if SDK script loaded successfully
      if (!(window as any).Razorpay) {
        throw new Error('Razorpay Checkout SDK is offline. Please check your internet connection.');
      }

      // 2. Open Razorpay Checkout modal
      const options = {
        key: orderResponse.keyId,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'CNG Bharat',
        description: `${planId.toUpperCase()} Partner Subscription`,
        image: '/logo.png',
        order_id: orderResponse.orderId,
        handler: async function (razorpayResponse: any) {
          setVerifyingPayment(true);
          try {
            // 3. Verify Razorpay signature on backend
            const verifyResult = await ownerApi.completeSubscription({
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
              planId,
            });

            if (verifyResult.success) {
              setSuccessMessage(`Payment verified successfully! You are now subscribed to the ${verifyResult.subscription.planName} plan.`);
              await fetchOwnerProfile();
            } else {
              setErrorMessage('Payment verification failed.');
            }
          } catch (err: any) {
            console.error('Verification error:', err);
            setErrorMessage(err.response?.data?.error || 'Payment verification failed.');
          } finally {
            setVerifyingPayment(false);
            setLoadingPlan(null);
          }
        },
        prefill: {
          name: orderResponse.ownerName || '',
          email: orderResponse.ownerEmail || '',
          contact: orderResponse.ownerPhone || '',
        },
        notes: {
          planId,
          ownerId: profile?.id || '',
        },
        theme: {
          color: '#10b981', // emerald color matching theme
        },
        modal: {
          ondismiss: function () {
            setErrorMessage('Payment cancelled.');
            setLoadingPlan(null);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error('Razorpay payment failed:', response.error);
        setErrorMessage(`Payment failed: ${response.error.description}`);
        setLoadingPlan(null);
      });

      rzp.open();
    } catch (err: any) {
      console.error('Initiation error:', err);
      setErrorMessage(err.response?.data?.error || err.message || 'Failed to start payment checkout.');
      setLoadingPlan(null);
    }
  };

  const isSubscriptionActive = () => {
    if (!profile?.subscriptionEndsAt) return false;
    return new Date(profile.subscriptionEndsAt) > new Date();
  };

  const getDaysRemaining = () => {
    if (!profile?.subscriptionEndsAt) return 0;
    const diffTime = new Date(profile.subscriptionEndsAt).getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader className="w-12 h-12 text-primary-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading subscription details...</p>
      </div>
    );
  }

  const active = isSubscriptionActive();
  const daysLeft = getDaysRemaining();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">My Subscription</h1>
        <p className="text-slate-500 mt-1">Upgrade your partner tier or view current payment details.</p>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 animate-fade-in shadow-sm">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Check out failed</p>
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-700 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Success!</p>
            <p className="text-sm text-emerald-600">{successMessage}</p>
          </div>
        </div>
      )}

      {verifyingPayment && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 text-blue-700 animate-pulse-slow shadow-sm">
          <Loader className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />
          <p className="font-bold text-sm">Verifying transaction signature with Razorpay... Please do not close or reload this page.</p>
        </div>
      )}

      {/* Subscription Status Card */}
      <div className="glass-card p-8 rounded-2xl border border-white/60 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-lime-500/10 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Current Tier Status</span>
              {active ? (
                <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wide">
                  Active
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wide">
                  No Active Subscription
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              {active 
                ? `${profile?.subscriptionType?.toUpperCase() || 'PARTNER'} TIER`
                : 'Free Account'}
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl">
              {active 
                ? `Thank you for being a partner with CNG Bharat. Your current plan grants you premium verification status and updates capabilities.`
                : 'Upgrade to a premium partner plan below to register more CNG stations, receive SMS queue alerts, and unlock live traffic analytics.'}
            </p>
          </div>

          {active && profile?.subscriptionEndsAt && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center gap-4 flex-shrink-0">
              <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm text-primary-600">
                <Calendar className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Expires On</p>
                <p className="font-bold text-slate-800">
                  {new Date(profile.subscriptionEndsAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-xs font-medium text-emerald-600 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="space-y-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-800">Available Plans</h2>
          <p className="text-slate-500 text-sm mt-1">Select the best business plan matching your scale of operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Trial Plan */}
          <PlanCard
            name="Sandbox Trial"
            price="₹1"
            period="/7 days"
            description="Perfect for testing integration checkout."
            features={[
              '1 Test Station Registration',
              'Sandbox environment',
              'Basic analytics dashboard',
              'No SMS alerts support',
              'Community support channel'
            ]}
            btnText={profile?.subscriptionType === 'trial' && active ? 'Current Plan' : 'Initiate Checkout'}
            isCurrent={profile?.subscriptionType === 'trial' && active}
            isLoading={loadingPlan === 'trial'}
            onSelect={() => handleSubscribe('trial')}
          />

          {/* Basic Plan */}
          <PlanCard
            name="Basic Partner"
            price="₹999"
            period="/month"
            description="Perfect for single station owners starting out."
            features={[
              '1 Station Registration',
              'Live CNG Stock Updates',
              'Live Crowd Status Updates',
              'Verification Badge on Maps',
              'Standard Email Support'
            ]}
            btnText={profile?.subscriptionType === 'basic' && active ? 'Current Plan' : 'Upgrade Plan'}
            isCurrent={profile?.subscriptionType === 'basic' && active}
            isLoading={loadingPlan === 'basic'}
            onSelect={() => handleSubscribe('basic')}
          />

          {/* Standard Plan */}
          <PlanCard
            name="Standard Partner"
            price="₹2,499"
            period="/month"
            description="Our most popular plan for expanding operators."
            features={[
              'Up to 3 Stations Registration',
              'Priority CNG Stock Highlights',
              'SMS Alerts for Station Queue Status',
              'Automated Geocoding Updates',
              'Priority Business Support'
            ]}
            btnText={profile?.subscriptionType === 'standard' && active ? 'Current Plan' : 'Upgrade Plan'}
            isCurrent={profile?.subscriptionType === 'standard' && active}
            isLoading={loadingPlan === 'standard'}
            highlighted
            onSelect={() => handleSubscribe('standard')}
          />

          {/* Premium Plan */}
          <PlanCard
            name="Premium Partner"
            price="₹4,999"
            period="/month"
            description="Ultimate capabilities for large fleet partners."
            features={[
              'Unlimited Stations Registration',
              'Guaranteed Verification Audit SLA',
              'SMS Alerts & API webhook calls',
              'Live analytics on user searches',
              '24/7 Phone & Dedicated Manager'
            ]}
            btnText={profile?.subscriptionType === 'premium' && active ? 'Current Plan' : 'Upgrade Plan'}
            isCurrent={profile?.subscriptionType === 'premium' && active}
            isLoading={loadingPlan === 'premium'}
            onSelect={() => handleSubscribe('premium')}
          />
        </div>
      </div>

      {/* Trust & Guarantee Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Secure Payment Gateway</h4>
            <p className="text-xs text-slate-500 mt-1">Processed securely using Razorpay. All transaction details are encrypted and PCI-DSS compliant.</p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Instant Upgrade Activation</h4>
            <p className="text-xs text-slate-500 mt-1">Your station owner partner limit updates instantly following signature verification by our server.</p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Flexible Subscriptions</h4>
            <p className="text-xs text-slate-500 mt-1">Upgrade or modify your plan tier at any time. Active subscriptions extend linearly upon renewal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  btnText: string;
  isCurrent: boolean;
  isLoading: boolean;
  highlighted?: boolean;
  onSelect: () => void;
}

function PlanCard({
  name,
  price,
  period,
  description,
  features,
  btnText,
  isCurrent,
  isLoading,
  highlighted = false,
  onSelect
}: PlanCardProps) {
  return (
    <div
      className={`glass-card p-6 rounded-2xl border-2 flex flex-col justify-between transition-all duration-300 relative ${
        isCurrent
          ? 'border-emerald-500 shadow-lg shadow-emerald-500/5'
          : highlighted
            ? 'border-primary-500 shadow-xl shadow-primary-500/10 scale-105 md:-translate-y-2 z-10'
            : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-lime-500 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-sm flex items-center gap-1">
          <Star className="w-3 h-3 fill-white" /> Popular
        </span>
      )}

      <div>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800">{name}</h3>
          <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{description}</p>
        </div>

        <div className="mb-6 flex items-baseline">
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{price}</span>
          <span className="text-xs text-slate-500 ml-1 font-medium">{period}</span>
        </div>

        <ul className="space-y-3 mb-8 border-t border-slate-100 pt-5">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onSelect}
        disabled={isCurrent || isLoading}
        className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
          isCurrent
            ? 'bg-slate-100 text-slate-400 border border-slate-200/80 cursor-default'
            : isLoading
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : highlighted
                ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md shadow-primary-500/25 active:scale-[0.98]'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 active:scale-[0.98]'
        }`}
      >
        {isLoading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" /> Checkout...
          </>
        ) : (
          btnText
        )}
      </button>
    </div>
  );
}
