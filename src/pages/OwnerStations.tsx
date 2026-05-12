import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  BatteryCharging,
  Users,
  PlusCircle,
  Loader,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit2,
  X,
} from 'lucide-react';
import { ownerApi, Station } from '../services/api';

export default function OwnerStations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCng, setEditingCng] = useState<string | null>(null);
  const [tempCng, setTempCng] = useState('');
  const [updatingCng, setUpdatingCng] = useState<string | null>(null);
  const [updatingCrowd, setUpdatingCrowd] = useState<string | null>(null);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const data = await ownerApi.getMyStations();
      setStations(data.stations || []);
    } catch (err) {
      console.error('Failed to load stations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleCngUpdate = async (stationId: string, qty: number) => {
    setUpdatingCng(stationId);
    try {
      await ownerApi.updateCngStatus(stationId, qty);
      setStations(prev =>
        prev.map(s =>
          s.id === stationId
            ? { ...s, cngAvailable: qty > 0, cngQuantityKg: qty, cngUpdatedAt: new Date().toISOString() }
            : s
        )
      );
      setEditingCng(null);
      setTempCng('');
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to update CNG status');
    } finally {
      setUpdatingCng(null);
    }
  };

  const handleCrowdUpdate = async (stationId: string, level: 'low' | 'medium' | 'high') => {
    setUpdatingCrowd(stationId);
    try {
      await ownerApi.updateCrowdStatus(stationId, level);
      setStations(prev =>
        prev.map(s => (s.id === stationId ? { ...s, crowdLevel: level } : s))
      );
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to update crowd status');
    } finally {
      setUpdatingCrowd(null);
    }
  };

  const approvalBadge = (status: string | undefined) => {
    const map: Record<string, string> = {
      approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
    };
    const s = status || 'pending';
    return `px-3 py-1 rounded-full text-xs font-medium border ${map[s] || 'bg-slate-100 text-slate-500'}`;
  };

  const crowdColor = (level: string | undefined) => {
    if (level === 'low') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (level === 'high') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const formatUpdated = (iso: string | undefined) => {
    if (!iso) return 'Never';
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Stations</h1>
          <p className="text-slate-500 mt-1">
            Manage your {stations.length} registered CNG station{stations.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/owner/add-station"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl shadow-lg shadow-primary-500/20 transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          Add Station
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader className="w-10 h-10 text-primary-500 animate-spin mb-4" />
          <p className="text-slate-500">Loading your stations...</p>
        </div>
      ) : stations.length === 0 ? (
        <div className="glass-card rounded-2xl border border-white/60 shadow-xl text-center py-20">
          <MapPin className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No Stations Yet</h3>
          <p className="text-slate-500 mb-6">Register your first CNG station to get started.</p>
          <Link
            to="/owner/add-station"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl shadow-lg shadow-primary-500/20 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            Register Station
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stations.map(station => (
            <div
              key={station.id}
              className="glass-card p-6 rounded-2xl border border-white/60 shadow-xl space-y-5"
            >
              {/* Station Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{station.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {station.city}{station.state ? `, ${station.state}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={approvalBadge(station.approvalStatus)}>
                    {station.approvalStatus || 'pending'}
                  </span>
                  {station.isVerified && (
                    <span className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* CNG Stock */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                    <BatteryCharging className="w-4 h-4 text-emerald-500" /> CNG Stock
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatUpdated(station.cngUpdatedAt)}
                  </span>
                </div>

                {editingCng === station.id ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={tempCng}
                      onChange={e => setTempCng(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 font-bold text-center focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                      placeholder="kg"
                      autoFocus
                    />
                    <button
                      onClick={() => handleCngUpdate(station.id, parseFloat(tempCng) || 0)}
                      disabled={updatingCng === station.id}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      {updatingCng === station.id ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => { setEditingCng(null); setTempCng(''); }}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 py-2 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {[0, 100, 250, 500].map(qty => (
                      <button
                        key={qty}
                        onClick={() => handleCngUpdate(station.id, qty)}
                        disabled={updatingCng === station.id}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                          qty === 0
                            ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            : station.cngQuantityKg === qty
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {updatingCng === station.id ? '...' : qty === 0 ? 'Empty' : `${qty}kg`}
                      </button>
                    ))}
                    <button
                      onClick={() => { setEditingCng(station.id); setTempCng(String(station.cngQuantityKg || 0)); }}
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors border border-slate-200"
                      title="Custom amount"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className={`mt-2 flex items-center gap-2 text-sm font-medium ${station.cngAvailable ? 'text-emerald-600' : 'text-red-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${station.cngAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  {station.cngAvailable
                    ? `Available — ${station.cngQuantityKg ?? 0} kg`
                    : 'Out of Stock'}
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Crowd Level */}
              <div>
                <span className="text-sm font-semibold text-slate-600 flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-blue-500" /> Crowd Level
                </span>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => handleCrowdUpdate(station.id, level)}
                      disabled={updatingCrowd === station.id}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border capitalize transition-all ${
                        station.crowdLevel === level
                          ? crowdColor(level) + ' font-bold ring-2 ring-offset-1 ring-current'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {updatingCrowd === station.id ? <Loader className="w-3 h-3 animate-spin mx-auto" /> : level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address */}
              {station.address && (
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {station.address}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
