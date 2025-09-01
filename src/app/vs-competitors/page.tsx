"use client";

import '../../../public/Fonts/WEB/css/satoshi.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, X, Star, TrendingUp, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

const competitors = [
  {
    name: "QRlab",
    logo: "🏆",
    tagline: "Intelligent markedsføring",
    pricing: "Fra 0 kr",
    isUs: true,
    features: {
      "Ubegrensede QR-koder": true,
      "Avanserte analytics": true,
      "Dynamiske QR-koder": true,
      "Norsk support": true,
      "Team samarbeid": true,
      "API tilgang": true,
      "Bulk generering": true,
      "Tilpasset design": true,
      "Geolokalisering": true,
      "Echtzeit tracking": true,
      "GDPR compliant": true,
      "White-label": true,
      "Rask lasting": true,
      "Mobiloptimiert": true
    },
    pros: [
      "Norsk kvalitet og support",
      "Avanserte analytics med live tracking",
      "Konkurransedyktige priser",
      "GDPR-kompatibel håndtering",
      "Rask og pålitelig infrastruktur"
    ],
    cons: [],
    rating: 5.0,
    url: "/signup"
  },
  {
    name: "QR Code Tiger",
    logo: "🐅",
    tagline: "World's most used QR generator",
    pricing: "Fra $7/måned",
    isUs: false,
    features: {
      "Ubegrensede QR-koder": true,
      "Avanserte analytics": "limited",
      "Dynamiske QR-koder": true,
      "Norsk support": false,
      "Team samarbeid": "limited",
      "API tilgang": true,
      "Bulk generering": true,
      "Tilpasset design": true,
      "Geolokalisering": "limited",
      "Echtzeit tracking": false,
      "GDPR compliant": "partial",
      "White-label": "enterprise",
      "Rask lasting": true,
      "Mobiloptimiert": true
    },
    pros: [
      "Store kundebase",
      "Mange QR-typer",
      "Godt omdømme"
    ],
    cons: [
      "Dyrere priser",
      "Begrenset support på norsk",
      "Amerikanske servere (GDPR-bekymringer)"
    ],
    rating: 4.2,
    url: "https://qrcode-tiger.com"
  },
  {
    name: "Beaconstac",
    logo: "📡",
    tagline: "QR codes for business growth",
    pricing: "Fra $5/måned",
    isUs: false,
    features: {
      "Ubegrensede QR-koder": "limited",
      "Avanserte analytics": true,
      "Dynamiske QR-koder": true,
      "Norsk support": false,
      "Team samarbeid": true,
      "API tilgang": true,
      "Bulk generering": true,
      "Tilpasset design": "limited",
      "Geolokalisering": true,
      "Echtzeit tracking": "limited",
      "GDPR compliant": "partial",
      "White-label": true,
      "Rask lasting": "limited",
      "Mobiloptimiert": true
    },
    pros: [
      "Enterprise-fokus",
      "Gode integrasjoner",
      "Solid analytics"
    ],
    cons: [
      "Komplisert grensesnitt",
      "Høye priser for små bedrifter",
      "Langsom loading tid"
    ],
    rating: 4.0,
    url: "https://beaconstac.com"
  },
  {
    name: "QR Code Monkey",
    logo: "🐒",
    tagline: "Free QR code generator",
    pricing: "Gratis + Premium",
    isUs: false,
    features: {
      "Ubegrensede QR-koder": "limited",
      "Avanserte analytics": false,
      "Dynamiske QR-koder": false,
      "Norsk support": false,
      "Team samarbeid": false,
      "API tilgang": false,
      "Bulk generering": false,
      "Tilpasset design": "limited",
      "Geolokalisering": false,
      "Echtzeit tracking": false,
      "GDPR compliant": "unknown",
      "White-label": false,
      "Rask lasting": true,
      "Mobiloptimiert": "limited"
    },
    pros: [
      "Gratis alternativ",
      "Enkelt å bruke",
      "Rask QR-generering"
    ],
    cons: [
      "Begrensede funksjoner",
      "Ingen analytics",
      "Ingen dynamiske QR-koder"
    ],
    rating: 3.5,
    url: "https://qrcode-monkey.com"
  }
];

const FeatureIcon = ({ status }: { status: boolean | string }) => {
  if (status === true) {
    return <Check className="w-5 h-5 text-green-500" />;
  }
  if (status === false) {
    return <X className="w-5 h-5 text-red-500" />;
  }
  if (status === "limited" || status === "partial") {
    return <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
      <div className="w-2 h-2 bg-white rounded-full"></div>
    </div>;
  }
  if (status === "enterprise") {
    return <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
      <div className="w-2 h-2 bg-white rounded-full"></div>
    </div>;
  }
  if (status === "unknown") {
    return <div className="w-5 h-5 bg-gray-400 rounded-full">?</div>;
  }
  return null;
};

export default function VsCompetitors() {
  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: 'Satoshi-Variable, sans-serif' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white/60">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgb(99 102 241 / 0.05) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgb(139 92 246 / 0.05) 0%, transparent 50%)`,
        }}></div>
      </div>

      <div className="max-w-[1400px] mx-auto relative">
        <Navbar />

        {/* Hero Section */}
        <div className="relative z-10 text-center px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-6 border border-blue-100">
              <TrendingUp className="w-4 h-4 mr-2" />
              Sammenligning med konkurrenter
            </div>
            <h1 
              className="text-5xl md:text-6xl font-bold mb-6 text-slate-900 leading-tight" 
              style={{ fontFamily: 'Satoshi-Black' }}
            >
              Hvorfor velge
              <span className="text-blue-600"> QRlab?</span>
            </h1>
            <p 
              className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed" 
              style={{ fontFamily: 'Satoshi-Regular' }}
            >
              Se hvordan QRlab sammenligner seg med andre populære QR-plattformer. 
              Vi fokuserer på norsk kvalitet, avanserte analytics og konkurransedyktige priser.
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="relative z-10 px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
              {/* Header */}
              <div className="grid grid-cols-5 gap-4 p-8 bg-slate-50 border-b border-slate-200">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: 'Satoshi-Bold' }}>
                    Funksjoner
                  </h3>
                </div>
                {competitors.map((competitor, index) => (
                  <div key={index} className={`text-center p-4 rounded-2xl ${competitor.isUs ? 'bg-blue-50 border-2 border-blue-200' : 'bg-white border border-slate-200'}`}>
                    <div className="text-3xl mb-2">{competitor.logo}</div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1" style={{ fontFamily: 'Satoshi-Bold' }}>
                      {competitor.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">{competitor.tagline}</p>
                    <div className="text-sm font-medium text-slate-900 mb-3">{competitor.pricing}</div>
                    <div className="flex items-center justify-center mb-3">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star 
                          key={starIndex} 
                          className={`w-4 h-4 ${starIndex < Math.floor(competitor.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                        />
                      ))}
                      <span className="ml-2 text-sm text-slate-600">{competitor.rating}</span>
                    </div>
                    {competitor.isUs && (
                      <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Anbefalt
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Features Comparison */}
              <div className="p-8">
                {Object.keys(competitors[0].features).map((feature, featureIndex) => (
                  <div key={featureIndex} className={`grid grid-cols-5 gap-4 py-4 ${featureIndex !== Object.keys(competitors[0].features).length - 1 ? 'border-b border-slate-100' : ''}`}>
                    <div className="flex items-center">
                      <span className="text-slate-900 font-medium" style={{ fontFamily: 'Satoshi-Medium' }}>
                        {feature}
                      </span>
                    </div>
                    {competitors.map((competitor, compIndex) => (
                      <div key={compIndex} className="flex items-center justify-center">
                        <FeatureIcon status={competitor.features[feature as keyof typeof competitor.features]} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="px-8 pb-8">
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-4" style={{ fontFamily: 'Satoshi-Bold' }}>
                    Symbolforklaring:
                  </h4>
                  <div className="grid md:grid-cols-5 gap-4 text-sm">
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      <span>Full støtte</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                      <span>Begrenset</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-purple-500 rounded-full mr-2 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                      <span>Enterprise kun</span>
                    </div>
                    <div className="flex items-center">
                      <X className="w-4 h-4 text-red-500 mr-2" />
                      <span>Ikke tilgjengelig</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-400 rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold">?</div>
                      <span>Ukjent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Comparison Cards */}
        <div className="relative z-10 px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 
                className="text-4xl font-bold mb-4 text-slate-900" 
                style={{ fontFamily: 'Satoshi-Bold' }}
              >
                Detaljert sammenligning
              </h2>
              <p 
                className="text-xl text-slate-600 max-w-2xl mx-auto" 
                style={{ fontFamily: 'Satoshi-Regular' }}
              >
                Utforsk fordelene og ulempene med hver plattform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {competitors.map((competitor, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-2xl p-8 border shadow-sm hover:shadow-md transition-all duration-200 ${
                    competitor.isUs ? 'border-blue-200 ring-2 ring-blue-100' : 'border-slate-200'
                  }`}
                >
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">{competitor.logo}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Satoshi-Bold' }}>
                      {competitor.name}
                    </h3>
                    <p className="text-slate-600 mb-3">{competitor.tagline}</p>
                    <div className="flex items-center justify-center mb-4">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star 
                          key={starIndex} 
                          className={`w-4 h-4 ${starIndex < Math.floor(competitor.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                        />
                      ))}
                      <span className="ml-2 text-sm text-slate-600">{competitor.rating}</span>
                    </div>
                    <div className="text-lg font-bold text-slate-900">{competitor.pricing}</div>
                  </div>

                  {/* Pros */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-green-700 mb-3 flex items-center" style={{ fontFamily: 'Satoshi-Bold' }}>
                      <Check className="w-4 h-4 mr-2" />
                      Fordeler
                    </h4>
                    <ul className="space-y-2">
                      {competitor.pros.map((pro, proIndex) => (
                        <li key={proIndex} className="text-sm text-slate-600 leading-relaxed">
                          • {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons */}
                  {competitor.cons.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-red-700 mb-3 flex items-center" style={{ fontFamily: 'Satoshi-Bold' }}>
                        <X className="w-4 h-4 mr-2" />
                        Ulemper
                      </h4>
                      <ul className="space-y-2">
                        {competitor.cons.map((con, conIndex) => (
                          <li key={conIndex} className="text-sm text-slate-600 leading-relaxed">
                            • {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="mt-6">
                    {competitor.isUs ? (
                      <Link href={competitor.url}>
                        <button 
                          className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                          style={{ fontFamily: 'Satoshi-Bold' }}
                        >
                          Velg QRlab
                        </button>
                      </Link>
                    ) : (
                      <a 
                        href={competitor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 px-4 bg-slate-100 text-slate-700 text-center rounded-xl hover:bg-slate-200 transition-colors font-semibold"
                        style={{ fontFamily: 'Satoshi-Medium' }}
                      >
                        Se {competitor.name}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why QRlab Wins */}
        <div className="relative z-10 px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 md:p-16 border border-blue-100">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                  <Shield className="w-4 h-4 mr-2" />
                  Hvorfor QRlab vinner
                </div>
                <h2 
                  className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight" 
                  style={{ fontFamily: 'Satoshi-Bold' }}
                >
                  Det smarte valget for
                  <span className="text-blue-600"> norske bedrifter</span>
                </h2>
                <p 
                  className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed" 
                  style={{ fontFamily: 'Satoshi-Regular' }}
                >
                  QRlab kombinerer det beste fra konkurrentene med norsk kvalitet og personlig service
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Satoshi-Bold' }}>
                    Norsk kvalitet
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Bygget og driftet i Norge med fokus på GDPR-compliance og personvern. Support på norsk når du trenger det.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Satoshi-Bold' }}>
                    Beste pris-ytelse
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Premium funksjoner til en brøkdel av konkurrentenes pris. Ingen skjulte kostnader eller uventede avgifter.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Satoshi-Bold' }}>
                    Avanserte funksjoner
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Live tracking, geolokalisering og detaljerte analytics som konkurrentene enten ikke har eller tar ekstra betalt for.
                  </p>
                </div>
              </div>

              <div className="text-center mt-12">
                <Link href="/signup">
                  <button 
                    className="px-10 py-4 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg font-semibold" 
                    style={{ fontFamily: 'Satoshi-Bold' }}
                  >
                    Prøv QRlab gratis i dag
                  </button>
                </Link>
                <p className="text-sm text-slate-600 mt-4">
                  14-dagers gratis prøve • Ingen kredittkort nødvendig
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}