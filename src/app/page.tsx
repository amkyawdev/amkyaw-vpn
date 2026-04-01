'use client';

import { useState, useMemo, useCallback } from 'react';
import { Globe, Server, Download, Search, Signal, Users, Star, Wifi, Copy, Check } from 'lucide-react';
import { vpnServers } from '@/data/servers';
import ovpnData from '@/data/ovpn_servers.json';

interface VPNServer {
  id: number;
  hostname: string;
  ip_address: string;
  score: number;
  ping: number;
  speed: number;
  country: string;
  country_code: string;
  sessions: number;
  uptime: number;
}

interface OVpnServer {
  id: number;
  provider: string;
  country: string;
  country_code: string;
  protocol: string;
  filename: string;
  config_url: string;
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

function CountryFlag({ countryCode }: { countryCode: string }) {
  const flagEmoji = countryCode.toUpperCase().split('').map(char => String.fromCharCode(127397 + char.charCodeAt(0))).join('');
  return <span className="text-2xl">{flagEmoji}</span>;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'vpngate' | 'openvpn'>('vpngate');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const pageSize = 20;

  const servers = vpnServers as unknown as VPNServer[];
  const ovpnServers = ovpnData.servers as OVpnServer[];

  const filteredVpnGateServers = useMemo(() => {
    let filtered = servers;
    if (selectedCountry) filtered = filtered.filter(s => s.country_code === selectedCountry);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s => s.country.toLowerCase().includes(q) || s.ip_address.includes(q) || s.hostname?.toLowerCase().includes(q));
    }
    return filtered;
  }, [servers, selectedCountry, searchQuery]);

  const filteredOpenVPNServers = useMemo(() => {
    let filtered = ovpnServers;
    if (selectedCountry) filtered = filtered.filter(s => s.country_code === selectedCountry);
    if (selectedProvider) filtered = filtered.filter(s => s.provider === selectedProvider);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s => s.country.toLowerCase().includes(q) || s.filename.toLowerCase().includes(q));
    }
    return filtered;
  }, [ovpnServers, selectedCountry, selectedProvider, searchQuery]);

  const countries = useMemo(() => {
    const data = activeTab === 'vpngate' ? servers : ovpnServers;
    return Array.from(new Set(data.map(s => s.country_code))).sort();
  }, [activeTab, servers, ovpnServers]);

  const providers = useMemo(() => Array.from(new Set(ovpnServers.map(s => s.provider))).sort(), [ovpnServers]);

  const paginatedVpnGateServers = filteredVpnGateServers.slice((page - 1) * pageSize, page * pageSize);
  const paginatedOpenVPNServers = filteredOpenVPNServers.slice((page - 1) * pageSize, page * pageSize);

  const handleExport = () => {
    let csv: string;
    if (activeTab === 'vpngate') {
      csv = [
        ['country', 'country_code', 'ip_address', 'hostname'],
        ...filteredVpnGateServers.map(s => [s.country, s.country_code, s.ip_address, s.hostname || ''])
      ].map(row => row.join(',')).join('\n');
    } else {
      csv = [
        ['provider', 'country', 'country_code', 'protocol', 'filename'],
        ...filteredOpenVPNServers.map(s => [s.provider, s.country, s.country_code, s.protocol, s.filename])
      ].map(row => row.join(',')).join('\n');
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vpn_servers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = useCallback((text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const downloadConfig = (filename: string) => {
    window.open(`/data/ovpn/${filename}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg"><Globe className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Amkyaw VPN</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Free VPN Dashboard - Click Connect to start</p>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 mb-6 border border-gray-200 dark:border-gray-700 flex gap-2">
          <button onClick={() => { setActiveTab('vpngate'); setPage(1); setSelectedCountry(''); setSelectedProvider(''); }} className={cn('flex-1 py-2 px-4 rounded-lg font-medium transition-colors', activeTab === 'vpngate' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300')}>
            <Wifi className="w-4 h-4 inline mr-2" />VPN Gate ({servers.length})
          </button>
          <button onClick={() => { setActiveTab('openvpn'); setPage(1); setSelectedCountry(''); setSelectedProvider(''); }} className={cn('flex-1 py-2 px-4 rounded-lg font-medium transition-colors', activeTab === 'openvpn' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300')}>
            <Server className="w-4 h-4 inline mr-2" />OpenVPN ({ovpnServers.length})
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2"><Server className="w-5 h-5 text-blue-600" /><span className="font-medium text-gray-900 dark:text-white">{activeTab === 'vpngate' ? filteredVpnGateServers.length : filteredOpenVPNServers.length} Servers</span></div>
            <div className="flex flex-wrap items-center gap-4">
              <select value={selectedCountry} onChange={e => { setSelectedCountry(e.target.value); setPage(1); }} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm">
                <option value="">All Countries</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {activeTab === 'openvpn' && (
                <select value={selectedProvider} onChange={e => { setSelectedProvider(e.target.value); setPage(1); }} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm">
                  <option value="">All Providers</option>
                  {providers.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1); }} className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm" />
              </div>
              <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"><Download className="w-4 h-4" />Export</button>
            </div>
          </div>
        </div>
        {activeTab === 'vpngate' && (
          paginatedVpnGateServers.length === 0 ? <div className="text-center py-12"><Server className="w-12 h-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-500 dark:text-gray-400">No servers found</p></div> : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedVpnGateServers.map((server) => (
                  <div key={server.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CountryFlag countryCode={server.country_code} />
                        <div><h3 className="font-semibold text-gray-900 dark:text-white">{server.country}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{server.ip_address}</p></div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded"><Star className="w-3 h-3 text-yellow-600" /><span className="text-sm font-medium">{server.score.toLocaleString()}</span></div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span className="text-gray-500 flex items-center gap-1"><Signal className="w-3 h-3" />Latency</span><span className={cn('font-medium', server.ping < 50 ? 'text-green-600' : server.ping < 100 ? 'text-yellow-600' : 'text-red-600')}>{server.ping}ms</span></div>
                      <div className="flex items-center justify-between"><span className="text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" />Sessions</span><span className="text-gray-900 dark:text-white">{server.sessions}</span></div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredVpnGateServers.length > pageSize && <div className="flex items-center justify-center gap-2 mt-8"><button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50">Previous</button><span className="px-4 py-2">Page {page}</span><button onClick={() => setPage(p => p + 1)} disabled={paginatedVpnGateServers.length < pageSize} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50">Next</button></div>}
            </>
          )
        )}
        {activeTab === 'openvpn' && (
          paginatedOpenVPNServers.length === 0 ? <div className="text-center py-12"><Server className="w-12 h-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-500 dark:text-gray-400">No servers found</p></div> : (
            <>
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 rounded-lg p-2"><Globe className="w-5 h-5 text-white" /></div>
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">How to Connect (3 Steps)</p>
                    <ol className="text-xs text-blue-700 dark:text-blue-300 mt-1 list-decimal list-inside">
                      <li>Download .ovpn config file below</li>
                      <li>Import to OpenVPN Connect app</li>
                      <li>Enter username/password and click Connect</li>
                    </ol>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedOpenVPNServers.map((server) => (
                  <div key={server.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CountryFlag countryCode={server.country_code} />
                        <div><h3 className="font-semibold text-gray-900 dark:text-white">{server.country}</h3><p className="text-xs text-gray-500 dark:text-gray-400">{server.provider}</p></div>
                      </div>
                      <span className={cn('px-2 py-1 rounded text-xs font-medium', server.protocol === 'TCP' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700' : 'bg-purple-100 dark:bg-purple-900 text-purple-700')}>{server.protocol}</span>
                    </div>
                    {server.provider === 'FOV' && <div className="text-xs text-gray-500 mb-2">User: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">vpn</code> / Pass: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">vpn</code></div>}
                    {server.provider === 'VBK' && <div className="text-xs text-gray-500 mb-2">User: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">vpnbook</code> / Pass: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">vpnbook</code></div>}
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => downloadConfig(server.filename)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"><Download className="w-4 h-4" />Download</button>
                      <button onClick={() => copyToClipboard(server.filename, server.id)} className="px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-700">{copiedId === server.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}</button>
                    </div>
                  </div>
                ))}
              </div>
              {filteredOpenVPNServers.length > pageSize && <div className="flex items-center justify-center gap-2 mt-8"><button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50">Previous</button><span className="px-4 py-2">Page {page}</span><button onClick={() => setPage(p => p + 1)} disabled={paginatedOpenVPNServers.length < pageSize} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50">Next</button></div>}
            </>
          )
        )}
      </main>
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center"><p className="text-sm text-gray-500">Amkyaw VPN &copy; {new Date().getFullYear()}. Free VPN Service.</p></div>
      </footer>
    </div>
  );
}
