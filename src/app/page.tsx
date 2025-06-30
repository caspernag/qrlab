"use client";

import '../../public/Fonts/WEB/css/satoshi.css';

import Navbar from "./components/Navbar";
import QRGenerator from "./components/QRGenerator";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden" style={{ fontFamily: 'Satoshi-Variable, sans-serif' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white/60">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgb(99 102 241 / 0.05) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgb(139 92 246 / 0.05) 0%, transparent 50%)`,
        }}></div>
      </div>

      {/* Container with max width */}
      <div className="max-w-[1100px] mx-auto relative">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
          <div className="max-w-4xl mx-auto relative z-20">
            <h1 
              className="text-6xl md:text-8xl font-bold mb-6 text-slate-900 leading-tight tracking-tight" 
              style={{ fontFamily: 'Satoshi-Black' }}
            >
              Intelligent Markedsføring
            </h1>
            <p 
              className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed" 
              style={{ fontFamily: 'Satoshi-Regular' }}
            >
              Se hvor, når og hvem som engasjerer med din markedsføring. Detaljerte analyser som gjør fysisk markedsføring målbart
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                className="px-8 py-4 bg-slate-900 text-white text-lg rounded-xl hover:cursor-pointer hover:bg-slate-800 transform hover:scale-105 transition-all duration-200 shadow-lg" 
                style={{ fontFamily: 'Satoshi-Bold' }}
                onClick={() => {
                  const qrGen = document.getElementById('qr-gen');
                  if (qrGen) {
                    qrGen.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Start Gratis
              </button>
              <button 
                className="px-8 py-4 border-2 border-slate-200 text-slate-700 text-lg rounded-xl hover:cursor-pointer hover:border-slate-300 hover:bg-slate-50 transform hover:scale-105 transition-all duration-200" 
                style={{ fontFamily: 'Satoshi-Medium' }}
              >
                Se hvordan det virker
              </button>
            </div>
          </div>
        </div>

        {/* Generator Section */}
        <div id="qr-gen">
          <QRGenerator />
        </div>

        {/* Premium Trial Section */}
        <div className="relative mt-15 z-10 px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 md:p-16 shadow-2xl relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 20% 80%, rgb(59 130 246 / 0.3) 0%, transparent 50%), 
                                   radial-gradient(circle at 80% 20%, rgb(139 92 246 / 0.3) 0%, transparent 50%)`,
                }}></div>
              </div>
              
              <div className="relative z-10 text-center">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-6 border border-blue-500/30">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Prøv Premium Gratis
                </div>

                <h2 
                  className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight" 
                  style={{ fontFamily: 'Satoshi-Bold' }}
                >
                  Få tilgang til alle premium funksjoner
                  <span className="text-blue-400"> i 14 dager</span>
                </h2>
                
                <p 
                  className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed" 
                  style={{ fontFamily: 'Satoshi-Regular' }}
                >
                  Oppgrader din QR-kode opplevelse med avanserte funksjoner, ubegrenset generering og detaljert analyse.
                </p>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-12 text-left">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Satoshi-Medium' }}>
                        Ubegrenset QR-koder
                      </h3>
                      <p className="text-slate-400" style={{ fontFamily: 'Satoshi-Regular' }}>
                        Lag så mange QR-koder du vil uten begrensninger
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Satoshi-Medium' }}>
                        Avansert Design
                      </h3>
                      <p className="text-slate-400" style={{ fontFamily: 'Satoshi-Regular' }}>
                        Tilpass farger, logoer og former på dine QR-koder
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Satoshi-Medium' }}>
                        Detaljert Analyse
                      </h3>
                      <p className="text-slate-400" style={{ fontFamily: 'Satoshi-Regular' }}>
                        Se hvor mange som scanner QR-kodene dine
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    className="px-10 py-4 bg-white text-slate-900 text-lg rounded-xl hover:bg-slate-100 transform hover:scale-105 transition-all duration-200 shadow-lg font-semibold" 
                    style={{ fontFamily: 'Satoshi-Bold' }}
                  >
                    Start 14-dagers prøveperiode
                  </button>
                  <button 
                    className="px-8 py-4 border-2 border-slate-600 text-slate-300 text-lg rounded-xl hover:border-slate-500 hover:text-white transform hover:scale-105 transition-all duration-200" 
                    style={{ fontFamily: 'Satoshi-Medium' }}
                  >
                    Se alle funksjoner
                  </button>
                </div>

                <p className="text-sm text-slate-400 mt-6" style={{ fontFamily: 'Satoshi-Regular' }}>
                  Ingen kredittkort nødvendig • Full tilgang i 14 dager
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Feature Showcase */}
        <div className="relative z-10 px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl p-12 md:p-16 relative overflow-hidden border border-slate-200 shadow-lg">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, rgb(59 130 246 / 0.1) 0%, transparent 50%), 
                                   radial-gradient(circle at 75% 75%, rgb(139 92 246 / 0.1) 0%, transparent 50%)`,
                }}></div>
              </div>

              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-6 border border-blue-100">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Avansert Sporing
                  </div>
                  <h2 
                    className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 leading-tight" 
                    style={{ fontFamily: 'Satoshi-Bold' }}
                  >
                    Se hvem som scanner kodene dine
                  </h2>
                  <p 
                    className="text-xl text-slate-600 max-w-2xl mx-auto" 
                    style={{ fontFamily: 'Satoshi-Regular' }}
                  >
                    Få detaljert innsikt i hvem, hvor og når QR-kodene dine blir brukt
                  </p>
                </div>

                {/* Analytics Dashboard Mockup */}
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left Column - Stats Cards */}
                  <div className="space-y-6">
                    {/* Total Scans */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <span className="text-green-500 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">+24%</span>
                      </div>
                      <div className="text-3xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'Satoshi-Bold' }}>2,847</div>
                      <div className="text-slate-600 text-sm" style={{ fontFamily: 'Satoshi-Medium' }}>Totale scans</div>
                    </div>

                    {/* Unique Visitors */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                        <span className="text-green-500 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">+18%</span>
                      </div>
                      <div className="text-3xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'Satoshi-Bold' }}>1,924</div>
                      <div className="text-slate-600 text-sm" style={{ fontFamily: 'Satoshi-Medium' }}>Unike besøkende</div>
                    </div>

                    {/* Conversion Rate */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <span className="text-green-500 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">+5.2%</span>
                      </div>
                      <div className="text-3xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'Satoshi-Bold' }}>67.5%</div>
                      <div className="text-slate-600 text-sm" style={{ fontFamily: 'Satoshi-Medium' }}>Konverteringsrate</div>
                    </div>
                  </div>

                  {/* Center Column - World Map Visualization */}
                  <div className="lg:col-span-2">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 h-full">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Satoshi-Bold' }}>
                          Globale scans
                        </h3>
                        <div className="text-sm text-slate-500" style={{ fontFamily: 'Satoshi-Medium' }}>
                          Siste 30 dager
                        </div>
                      </div>

                      {/* Country Stats */}
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">🇳🇴</div>
                            <div>
                              <div className="font-medium text-slate-900" style={{ fontFamily: 'Satoshi-Medium' }}>Norge</div>
                              <div className="text-sm text-slate-500">1,247 scans</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-slate-600 w-8">87%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">🇸🇪</div>
                            <div>
                              <div className="font-medium text-slate-900" style={{ fontFamily: 'Satoshi-Medium' }}>Sverige</div>
                              <div className="text-sm text-slate-500">298 scans</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '21%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-slate-600 w-8">21%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">🇩🇰</div>
                            <div>
                              <div className="font-medium text-slate-900" style={{ fontFamily: 'Satoshi-Medium' }}>Danmark</div>
                              <div className="text-sm text-slate-500">156 scans</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '11%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-slate-600 w-8">11%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">🌍</div>
                            <div>
                              <div className="font-medium text-slate-900" style={{ fontFamily: 'Satoshi-Medium' }}>Andre land</div>
                              <div className="text-sm text-slate-500">87 scans</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '6%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-slate-600 w-8">6%</span>
                          </div>
                        </div>
                      </div>

                      {/* Live Activity */}
                      <div className="border-t border-slate-200 pt-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-slate-700" style={{ fontFamily: 'Satoshi-Medium' }}>
                            Live aktivitet
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                          <div className="flex items-center justify-between">
                            <span>🇳🇴 Oslo → Besøkte nettside</span>
                            <span className="text-xs text-slate-400">2 min siden</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>🇸🇪 Stockholm → Lastet ned fil</span>
                            <span className="text-xs text-slate-400">5 min siden</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>🇳🇴 Bergen → Besøkte nettside</span>
                            <span className="text-xs text-slate-400">8 min siden</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
