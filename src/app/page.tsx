'use client';

import { useState, useMemo } from 'react';
import { Globe, Server, RefreshCw, Download, Search, Signal, Users, Star } from 'lucide-react';
import { vpnServers } from '@/data/servers';

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
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const servers: VPNServer[] = vpnServers as VPNServer[];

  const filteredServers = useMemo(() => {
    let filtered = servers;
    if (selectedCountry) {
      filtered = filtered.filter(s => s.country_code === selectedCountry);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.country.toLowerCase().includes(q) || 
        s.ip_address.includes(q) ||
        s.hostname?.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [servers, selectedCountry, searchQuery]);

  const countries = useMemo(() => {
    const countrySet = new Set(servers.map(s => s.country_code));
    return Array.from(countrySet).sort();
  }, [servers]);

  const paginatedServers = filteredServers.slice((page - 1) * pageSize, page * pageSize);

  const handleExport = () => {
    const csv = [
      ['hostname', 'ip_address', 'score', 'ping', 'speed', 'country', 'country_code', 'sessions'],
      ...filteredServers.map(s => [s.hostname, s.ip_address, s.score, s.ping, s.speed, s.country, s.country_code, s.sessions])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vpn_servers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Amkyaw VPN</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Free VPN Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900 dark:text-white">{filteredServers.length} Servers</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <select 
                value={selectedCountry} 
                onChange={e => { setSelectedCountry(e.target.value); setPage(1); }} 
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm"
              >
                <option value="">All Countries</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery} 
                  onChange={e => { setSearchQuery(e.target.value); setPage(1); }} 
                  className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm" 
                />
              </div>
              <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>
        </div>

        {paginatedServers.length === 0 ? (
          <div className="text-center py-12">
            <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No servers found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedServers.map((server, index) => (
                <div 
                  key={server.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CountryFlag countryCode={server.country_code} />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{server.country}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{server.ip_address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
                      <Star className="w-3 h-3 text-yellow-600" />
                      <span className="text-sm font-medium">{server.score.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-1"><Signal className="w-3 h-3" /> Latency</span>
                      <span className={cn('font-medium', server.ping < 50 ? 'text-green-600' : server.ping < 100 ? 'text-yellow-600' : 'text-red-600')}>{server.ping}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" /> Sessions</span>
                      <span className="text-gray-900 dark:text-white">{server.sessions}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredServers.length > pageSize && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1} 
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">Page {page}</span>
                <button 
                  onClick={() => setPage(p => p + 1)} 
                  disabled={paginatedServers.length < pageSize} 
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">Amkyaw VPN &copy; {new Date().getFullYear()}. Free VPN Service.</p>
        </div>
      </footer>
    </div>
  );
}
