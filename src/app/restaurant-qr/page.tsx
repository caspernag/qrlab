"use client";

import '../../../public/Fonts/WEB/css/satoshi.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, Star, TrendingUp, Smartphone } from 'lucide-react';
import Link from 'next/link';

const restaurantFeatures = [
  {
    icon: "📱",
    title: "Kontaktløse menyer",
    description: "Kundene scanner QR-koden og ser menyen på sin telefon. Ingen fysiske menyer å desinfisere."
  },
  {
    icon: "🔄",
    title: "Oppdater menyen øyeblikkelig",
    description: "Endre priser, legg til sesongvarer eller fjern utsolgte retter uten å trykke nye menyer."
  },
  {
    icon: "📊",
    title: "Se hva som er populært",
    description: "Få detaljert innsikt i hvilke menypunkter kundene ser mest på og når de besøker restauranten."
  },
  {
    icon: "💰",
    title: "Spar penger på printing",
    description: "Ingen mer menyprinting. Én QR-kode kan brukes på alle bord og oppdateres når som helst."
  },
  {
    icon: "🌍",
    title: "Flerspråklig support",
    description: "Vis menyen på flere språk automatisk basert på kundens telefoninnstillinger."
  },
  {
    icon: "⚡",
    title: "Rask implementering",
    description: "Oppe og kjørende på 5 minutter. Print QR-koder og plasser på bordene - så enkelt er det."
  }
];

const testimonials = [
  {
    name: "Erik Solberg",
    role: "Restauranteier, Villa Paradiso",
    content: "Siden vi byttet til QRlab har vi redusert menyutgiftene med 90%. Kundene elsker hvor enkelt det er, og vi kan oppdatere prisene øyeblikkelig.",
    avatar: "E",
    rating: 5,
    restaurant: "Villa Paradiso, Oslo"
  },
  {
    name: "Lise Andersen", 
    role: "Daglig leder, Fiskerestauranten",
    content: "Perfect for en restaurant som serverer fersk fisk. Vi kan oppdatere dagens fangst hver morgen og se hvilke retter som er mest populære.",
    avatar: "L",
    rating: 5,
    restaurant: "Fiskerestauranten, Bergen"
  },
  {
    name: "Marco Rossi",
    role: "Kjøkkensjef, Bella Italia",
    content: "QRlab sin flerspråklige funksjon er gull verdt i turistsesongen. Italienske, engelske og norske gjester kan alle lese menyen på sitt språk.",
    avatar: "M",
    rating: 5,
    restaurant: "Bella Italia, Trondheim"
  }
];

const stats = [
  { number: "500+", label: "Restauranter bruker QRlab" },
  { number: "75%", label: "Reduksjon i menykostnader" },  
  { number: "2 sek", label: "Gjennomsnittlig lastetid" },
  { number: "99.9%", label: "Oppetidsgaranti" }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "99",
    period: "per måned",
    description: "Perfekt for små restauranter og kafeer",
    features: [
      "5 QR-meny koder",
      "Ubegrenset menyoppdateringer", 
      "Grunnleggende analytics",
      "E-post support",
      "Flerspråklig meny (3 språk)"
    ],
    cta: "Prøv 14 dager gratis",
    popular: false
  },
  {
    name: "Restaurant",
    price: "199", 
    period: "per måned",
    description: "For etablerte restauranter med flere lokaler",
    features: [
      "Ubegrensede QR-meny koder",
      "Avanserte analytics og rapporter",
      "Kundetilpasset design og logoer", 
      "Telefon og e-post support",
      "Flerspråklig meny (ubegrenset)",
      "Booking-integrasjon",
      "Sosiale medier-deling"
    ],
    cta: "Start gratis prøve",
    popular: true
  },
  {
    name: "Kjede",
    price: "Tilpasset",
    period: "kontakt oss", 
    description: "For restaurantkjeder og franchises",
    features: [
      "Alt i Restaurant-planen",
      "Sentralisert administrasjon",
      "White-label løsning",
      "API integrasjoner",
      "Dedikert account manager",
      "SLA garanti",
      "Tilpassede funksjoner"
    ],
    cta: "Kontakt oss",
    popular: false
  }
];

export default function RestaurantQR() {
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
        <div className="relative z-10 px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-medium mb-6 border border-orange-100">
              <Smartphone className="w-4 h-4 mr-2" />
              Spesialtilpasset for restauranter
            </div>
            <h1 
              className="text-5xl md:text-7xl font-bold mb-6 text-slate-900 leading-tight" 
              style={{ fontFamily: 'Satoshi-Black' }}
            >
              QR-menyer som
              <span className="text-orange-600"> kundene elsker</span>
            </h1>
            <p 
              className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed" 
              style={{ fontFamily: 'Satoshi-Regular' }}
            >
              Bytt fra papirrmenyer til smarte QR-menyer på 5 minutter. Spar penger, impress gjester og få verdifull innsikt i hva som fungerer best.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/signup?industry=restaurant">
                <button 
                  className="px-8 py-4 bg-orange-600 text-white text-lg rounded-xl hover:bg-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg font-semibold" 
                  style={{ fontFamily: 'Satoshi-Bold' }}
                >
                  Start gratis prøve
                </button>
              </Link>
              <Link href="#pricing">
                <button 
                  className="px-8 py-4 border-2 border-slate-200 text-slate-700 text-lg rounded-xl hover:border-slate-300 hover:bg-slate-50 transform hover:scale-105 transition-all duration-200 font-semibold" 
                  style={{ fontFamily: 'Satoshi-Medium' }}
                >
                  Se priser
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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

        {/* Features Section */}
        <div className="relative z-10 px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 
                className="text-4xl font-bold mb-4 text-slate-900" 
                style={{ fontFamily: 'Satoshi-Bold' }}
              >
                Alt du trenger for moderne restaurant-drift
              </h2>
              <p 
                className="text-xl text-slate-600 max-w-2xl mx-auto" 
                style={{ fontFamily: 'Satoshi-Regular' }}
              >
                QRlab gjør det enkelt å modernisere restauranten din
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurantFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Satoshi-Bold' }}>
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed" style={{ fontFamily: 'Satoshi-Regular' }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="relative z-10 px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-12 md:p-16 border border-orange-100">
              <div className="text-center mb-12">
                <h2 
                  className="text-4xl font-bold mb-4 text-slate-900" 
                  style={{ fontFamily: 'Satoshi-Bold' }}
                >
                  Så enkelt setter du i gang
                </h2>
                <p 
                  className="text-xl text-slate-600 max-w-2xl mx-auto" 
                  style={{ fontFamily: 'Satoshi-Regular' }}
                >
                  Fra registrering til første gjest scanner QR-koden på under 5 minutter
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Satoshi-Bold' }}>
                    Last opp menyen
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Kopier inn teksten fra din eksisterende meny eller last opp PDF. Vi konverterer alt automatisk.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Satoshi-Bold' }}>
                    Generer QR-koder
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Vi lager QR-koder med ditt design og logo. Last ned og print ut på bordstandere eller klistr på bordene.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Satoshi-Bold' }}>
                    Gjester scanner og bestiller
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Gjestene scanner koden, ser menyen på mobilen og kan bestille direkte. Du får verdifulle analytics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="relative z-10 px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-medium mb-6 border border-green-100">
                <TrendingUp className="w-4 h-4 mr-2" />
                Fornøyde restauranter
              </div>
              <h2 
                className="text-4xl font-bold mb-4 text-slate-900" 
                style={{ fontFamily: 'Satoshi-Bold' }}
              >
                Hva norske restauranter sier
              </h2>
              <p 
                className="text-xl text-slate-600 max-w-2xl mx-auto" 
                style={{ fontFamily: 'Satoshi-Regular' }}
              >
                Bli med i over 500 restauranter som allerede har gjort overgangen
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
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900" style={{ fontFamily: 'Satoshi-Medium' }}>
                        {testimonial.name}
                      </div>
                      <div className="text-slate-600 text-sm">
                        {testimonial.role}
                      </div>
                      <div className="text-orange-600 text-sm font-medium">
                        {testimonial.restaurant}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="relative z-10 px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 
                className="text-4xl font-bold mb-4 text-slate-900" 
                style={{ fontFamily: 'Satoshi-Bold' }}
              >
                Priser tilpasset restauranter
              </h2>
              <p 
                className="text-xl text-slate-600 max-w-2xl mx-auto" 
                style={{ fontFamily: 'Satoshi-Regular' }}
              >
                Start gratis og betal kun for det du trenger
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-2xl p-8 border-2 shadow-sm hover:shadow-lg transition-all duration-200 relative ${
                    plan.popular ? 'border-orange-500 scale-105' : 'border-slate-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Mest populær
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
                  </div>

                  <Link href="/signup?industry=restaurant">
                    <button 
                      className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                        plan.popular 
                          ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg hover:shadow-xl' 
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
                Spørsmål fra restauranter
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Satoshi-Medium' }}>
                  Hvor lang tid tar det å sette opp?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  De fleste restauranter er oppe og kjørende på under 5 minutter. Du laster bare opp menyen, vi genererer QR-kodene, og du printer dem ut.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Satoshi-Medium' }}>
                  Kan jeg endre menyen selv?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Ja! Du kan oppdatere priser, retter og beskrivelser når som helst gjennom vårt enkle dashboard. Endringene vises øyeblikkelig for alle gjester.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Satoshi-Medium' }}>
                  Hva hvis gjestene ikke har smartphone?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Du kan fortsatt ha noen fysiske menyer for de få som ikke har smartphone. Eller få gjestene til å spørre servitørene - de kan vise menyen på sin telefon.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Satoshi-Medium' }}>
                  Får jeg innsikt i hva gjestene foretrekker?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Ja! Du ser hvilke menypunkter som blir sett mest, når gjestene besøker restauranten, og hvor lenge de bruker på å se menyen. Perfekt for å optimalisere menyen.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-slate-600 mb-6">
                Har du andre spørsmål? Vi hjelper gjerne!
              </p>
              <Link href="/contact?industry=restaurant">
                <button 
                  className="px-8 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-semibold"
                  style={{ fontFamily: 'Satoshi-Bold' }}
                >
                  Kontakt oss
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