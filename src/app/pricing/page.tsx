"use client";

import '../../../public/Fonts/WEB/css/satoshi.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, Star, Users, Zap, Shield, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const pricingPlans = [
  {
    name: "Gratis",
    price: "0",
    period: "for alltid",
    description: "Perfekt for personlig bruk og testing",
    features: [
      "5 QR-koder per måned",
      "Grunnleggende QR-typer (URL, telefon, e-post)",
      "Standard design-alternativer",
      "Grunnleggende sporing (totale scans)",
      "PNG/JPG nedlasting",
      "Fellesskaps-support"
    ],
    limitations: [
      "Begrenset til 5 QR-koder",
      "QRlab vannmerke på koder",
      "Ingen dynamiske QR-koder",
      "Grunnleggende analyse"
    ],
    cta: "Start Gratis",
    ctaLink: "/signup",
    popular: false,
    color: "border-slate-200"
  },
  {
    name: "Premium",
    price: "149",
    period: "per måned",
    description: "Ideell for bedrifter og profesjonelle brukere",
    features: [
      "Ubegrensede QR-koder",
      "15+ QR-typer (WiFi, vCard, SMS, osv.)",
      "Tilpassede farger og design",
      "Logo-opplasting og branding",
      "Dynamiske QR-koder (kan endres)",
      "Detaljert sporing og analyse",
      "Bulk-generering (CSV opplasting)",
      "Eksport i alle formater",
      "Prioritets e-post support",
      "Ingen vannmerke"
    ],
    limitations: [],
    cta: "Start 14-dagers prøve",
    ctaLink: "/signup?plan=premium",
    popular: true,
    color: "border-blue-500",
    badge: "Mest populær"
  },
  {
    name: "Enterprise",
    price: "Tilpasset",
    period: "kontakt oss",
    description: "For store organisasjoner med spesielle behov",
    features: [
      "Alt i Premium-planen",
      "Ubegrenset team-medlemmer",
      "White-label løsning",
      "API tilgang og integrasjoner",
      "Tilpassede rapporter",
      "SSO integrasjon",
      "Dedikert kundesuksess-manager",
      "SLA garanti",
      "On-premise deployment (valgfritt)",
      "Tilpassede funksjoner"
    ],
    limitations: [],
    cta: "Kontakt salg",
    ctaLink: "/contact?plan=enterprise",
    popular: false,
    color: "border-purple-500"
  }
];

const testimonials = [
  {
    name: "Sofie Hansen",
    role: "Markedssjef, TechStart AS",
    content: "QRlab har revolusjonert hvordan vi sporer vår offline markedsføring. Analytics-dataene er uvurderlige for å optimalisere kampanjene våre.",
    avatar: "S",
    rating: 5
  },
  {
    name: "Lars Andersen",
    role: "Restauranteier, Bistro Oslo",
    content: "Enkelt å lage QR-menyer og oppdatere dem. Kundene elsker hvor lett det er å se menyen på telefonen.",
    avatar: "L",
    rating: 5
  },
  {
    name: "Maria Nordström",
    role: "Event Manager, Creative Events",
    content: "Bruker QRlab for alle våre events. Bulk-genereringen sparer oss timer, og rapportene gir oss innsikt i deltagerengasjement.",
    avatar: "M", 
    rating: 5
  }
];

const stats = [
  { number: "50,000+", label: "QR-koder laget" },
  { number: "2,500+", label: "Aktive brukere" },
  { number: "99.9%", label: "Oppetid" },
  { number: "24/7", label: "Support" }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: 'Satoshi-Variable, sans-serif' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white/60">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgb(99 102 241 / 0.05) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgb(139 92 246 / 0.05) 0%, transparent 50%)`,
        }}></div>
      </div>

      <div className="max-w-[1200px] mx-auto relative">
        <Navbar />

        {/* Hero Section */}
        <div className="relative z-10 text-center px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-6 border border-blue-100">
              <Star className="w-4 h-4 mr-2" />
              Transparent og forutsigbar prising
            </div>
            <h1 
              className="text-5xl md:text-6xl font-bold mb-6 text-slate-900 leading-tight" 
              style={{ fontFamily: 'Satoshi-Black' }}
            >
              Velg din
              <span className="text-blue-600"> QR-plan</span>
            </h1>
            <p 
              className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed" 
              style={{ fontFamily: 'Satoshi-Regular' }}
            >
              Start gratis og oppgrader når du trenger mer. Ingen skjulte kostnader, ingen langsiktige forpliktelser.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Satoshi-Bold' }}>
                    {stat.number}
                  </div>
                  <div className="text-slate-600 text-sm" style={{ fontFamily: 'Satoshi-Regular' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="relative z-10 px-6 pb-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-2xl p-8 border-2 ${plan.color} shadow-sm hover:shadow-lg transition-all duration-200 relative ${plan.popular ? 'scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Satoshi-Bold' }}>
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    {plan.price === "Tilpasset" ? (
                      <div className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Satoshi-Bold' }}>
                        Tilpasset
                      </div>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-slate-900" style={{ fontFamily: 'Satoshi-Bold' }}>
                          {plan.price} kr
                        </span>
                        <span className="text-slate-600 ml-2">{plan.period}</span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-600" style={{ fontFamily: 'Satoshi-Regular' }}>
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700" style={{ fontFamily: 'Satoshi-Regular' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                  {plan.limitations.length > 0 && (
                    <>
                      <div className="border-t border-slate-200 pt-4 mt-6">
                        <div className="text-sm text-slate-500 mb-3 font-medium">Begrensninger:</div>
                        {plan.limitations.map((limitation, limitIndex) => (
                          <div key={limitIndex} className="flex items-start mb-2">
                            <div className="w-2 h-2 bg-slate-300 rounded-full mr-3 mt-2.5 flex-shrink-0"></div>
                            <span className="text-slate-500 text-sm">
                              {limitation}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <Link href={plan.ctaLink}>
                  <button 
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      plan.popular 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    style={{ fontFamily: 'Satoshi-Bold' }}
                  >
                    {plan.cta}
                  </button>
                </Link>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="max-w-4xl mx-auto text-center mt-12">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <Shield className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h4 className="font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Satoshi-Medium' }}>
                    14-dagers pengene tilbake
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Ikke fornøyd? Få pengene tilbake, ingen spørsmål stilt.
                  </p>
                </div>
                <div>
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h4 className="font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Satoshi-Medium' }}>
                    Ingen oppsettavgift
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Start umiddelbart uten skjulte kostnader eller avgifter.
                  </p>
                </div>
                <div>
                  <Zap className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <h4 className="font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Satoshi-Medium' }}>
                    Avbryt når som helst
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Ingen langsiktige forpliktelser. Avbryt abonnementet når som helst.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="relative z-10 px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-medium mb-6 border border-green-100">
                <TrendingUp className="w-4 h-4 mr-2" />
                Kundeuttalelser
              </div>
              <h2 
                className="text-4xl font-bold mb-4 text-slate-900" 
                style={{ fontFamily: 'Satoshi-Bold' }}
              >
                Hva våre kunder sier
              </h2>
              <p 
                className="text-xl text-slate-600 max-w-2xl mx-auto" 
                style={{ fontFamily: 'Satoshi-Regular' }}
              >
                Bli med i tusenvis av fornøyde brukere som har transformert sin markedsføring
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, starIndex) => (
                      <Star key={starIndex} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 leading-relaxed" style={{ fontFamily: 'Satoshi-Regular' }}>
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900" style={{ fontFamily: 'Satoshi-Medium' }}>
                        {testimonial.name}
                      </div>
                      <div className="text-slate-600 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="relative z-10 px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 
                className="text-4xl font-bold mb-4 text-slate-900" 
                style={{ fontFamily: 'Satoshi-Bold' }}
              >
                Ofte stilte spørsmål
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Satoshi-Medium' }}>
                  Kan jeg oppgradere eller nedgradere planen min?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Ja, du kan endre planen din når som helst. Ved oppgradering får du umiddelbar tilgang til nye funksjoner. Ved nedgradering trer endringene i kraft ved neste faktureringsperiode.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Satoshi-Medium' }}>
                  Hva skjer med mine QR-koder hvis jeg avbryter?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Statiske QR-koder fortsetter å fungere for alltid. Dynamiske QR-koder og sporing-funksjoner deaktiveres etter 30 dager, men dataene dine oppbevares i 12 måneder.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Satoshi-Medium' }}>
                  Tilbyr dere rabatt for årlige abonnementer?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Ja, vi tilbyr 20% rabatt på alle planer ved årlig betaling. Dette beregnes automatisk ved utsjekking når du velger årlig fakturering.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Satoshi-Medium' }}>
                  Har dere API for utviklere?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Ja, vårt REST API er tilgjengelig for Premium og Enterprise-planer. Du får tilgang til fullstendig dokumentasjon og eksempler i dashbordet.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-slate-600 mb-6">
                Har du andre spørsmål? Vi er her for å hjelpe!
              </p>
              <Link href="/contact">
                <button 
                  className="px-8 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-semibold"
                  style={{ fontFamily: 'Satoshi-Bold' }}
                >
                  Kontakt support
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}