'use client';

import { useState, useEffect, useRef } from 'react';
import BramSVG from './components/BramSVG';

const translations = {
  en: {
    loading: "Calculating environment...",
    lostTitle: "Lost.",
    lostText: "Bram cannot see you. Enable geolocation to reveal the truth.",
    retryBtn: "Retry Connection",
    errorTitle: "Error.",
    mainTitle: "Can Bram wear shorts?",
    yes: "YES.",
    no: "NO.",
    almost: "ALMOST.",
    naked: "BRAM GOES NAKED.",
    currentMetric: "Current metric",
    sliderLabel: "Manual Climate Change",
    warmText: "Optimal conditions met. Thermal exposure advised for lower extremities.",
    almostText: "Borderline conditions. Bram is considering his options.",
    coldText: "Thermal threshold not achieved. Long-form covering recommended.",
    footer1: "Experimental Body Layout v1.0",
    footer2: "Data: Open-Meteo"
  },
  nl: {
    loading: "Omgeving berekenen...",
    lostTitle: "Verdwaald.",
    lostText: "Bram kan je niet zien. Schakel locatie in om de waarheid te onthullen.",
    retryBtn: "Probeer opnieuw",
    errorTitle: "Fout.",
    mainTitle: "Kan Bram een korte broek aan?",
    yes: "JA.",
    no: "NEE.",
    almost: "BIJNA.",
    naked: "BRAM GAAT NAAKT.",
    currentMetric: "Huidige metriek",
    sliderLabel: "Handmatige Klimaatverandering",
    warmText: "Optimale omstandigheden bereikt. Thermische blootstelling voor onderste ledematen geadviseerd.",
    almostText: "Grensgevallen bereikt. Bram twijfelt nog een beetje.",
    coldText: "Thermische drempel niet bereikt. Lange bedekking aanbevolen.",
    footer1: "Experimentele Lichaamsindeling v1.0",
    footer2: "Data: Open-Meteo"
  }
};

export default function Home() {
  const [temperature, setTemperature] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [locationDenied, setLocationDenied] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [lang, setLang] = useState<'en' | 'nl'>('nl');
  const fetchAttempted = useRef(false);

  useEffect(() => {
    // Detect browser language
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || 'nl';
      if (browserLang.toLowerCase().startsWith('en')) {
        setLang('en');
      } else {
        setLang('nl');
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (fetchAttempted.current) return;
    fetchAttempted.current = true;

    const BREDA_COORDS = { latitude: 51.5891, longitude: 4.7744 };

    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await response.json();
        if (data.current_weather) {
          setTemperature(data.current_weather.temperature);
        } else {
          setError(lang === 'en' ? 'Could not fetch weather.' : 'Kon weer niet ophalen.');
        }
      } catch {
        setError(lang === 'en' ? 'Failed to fetch weather.' : 'Weer ophalen mislukt.');
      } finally {
        setLoading(false);
      }
    };

    if (!navigator.geolocation) {
      fetchWeather(BREDA_COORDS.latitude, BREDA_COORDS.longitude);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      () => {
        // Fallback to Breda on any error (denied, timeout, etc.)
        fetchWeather(BREDA_COORDS.latitude, BREDA_COORDS.longitude);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [lang]);

  const status: 'naked' | 'yes' | 'almost' | 'no' = 
    temperature >= 30 ? 'naked' :
    temperature >= 15 ? 'yes' : 
    temperature >= 10 ? 'almost' : 
    'no';

  const themeClasses = 
    status === 'naked' ? 'bg-orange-500 text-black' :
    status === 'yes' ? 'bg-amber-300 text-black' : 
    status === 'almost' ? 'bg-zinc-800 text-white' : 
    'bg-zinc-900 text-white';

  const t = translations[lang];

  return (
    <div className={`min-h-screen transition-colors duration-1000 selection:bg-white selection:text-black overflow-hidden flex flex-col ${themeClasses}`}>
      {/* Background decoration inspired by antigravity.google */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full animate-pulse ${status === 'yes' ? 'bg-white' : 'bg-white/10'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blur-[150px] rounded-full ${status === 'yes' ? 'bg-orange-400/20' : 'bg-white/5'}`} />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
        {loading ? (
          <div className="space-y-4 animate-in fade-in duration-1000">
            <div className="text-sm font-mono tracking-widest uppercase opacity-40">{t.loading}</div>
            <div className="w-12 h-[1px] bg-white/20 mx-auto" />
          </div>
        ) : locationDenied ? (
          <div className="max-w-md animate-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-4xl font-bold tracking-tighter mb-4 uppercase">{t.lostTitle}</h1>
            <p className="opacity-60 mb-8 font-mono text-sm leading-relaxed">{t.lostText}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 border border-current hover:bg-black hover:text-white transition-all duration-300 rounded-full font-mono text-xs uppercase tracking-widest"
            >
              {t.retryBtn}
            </button>
          </div>
        ) : error ? (
          <div className="max-w-md animate-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-4xl font-bold tracking-tighter mb-4 uppercase">{t.errorTitle}</h1>
            <p className="font-mono text-sm uppercase">{error}</p>
          </div>
        ) : (
          <div className="w-full max-w-5xl flex flex-col items-center space-y-12 md:space-y-20 animate-in fade-in duration-1000">
            <h1 className="text-lg font-mono tracking-[0.4em] uppercase opacity-40">
              {t.mainTitle}
            </h1>

            <div className="relative group">
              <div 
                className={`text-[clamp(6rem,20vw,16rem)] font-black leading-none tracking-tighter transition-all duration-1000 ${
                  status === 'naked' ? 'text-black opacity-100' : status === 'yes' ? 'text-black opacity-100' : status === 'almost' ? 'text-white/50' : 'text-white/10'
                } drop-shadow-[0_10px_30px_rgba(0,0,0,0.1)]`}
              >
                {status === 'naked' ? t.naked : status === 'yes' ? t.yes : status === 'almost' ? t.almost : t.no}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 w-full">
              <div className="bg-white rounded-2xl p-8 transform -rotate-1 hover:rotate-0 transition-transform duration-500 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-black/5">
                <BramSVG status={status} mousePos={mousePos} temperature={temperature} />
              </div>

              <div className={`text-left space-y-8 max-w-xs backdrop-blur-sm p-8 rounded-2xl border transition-all duration-1000 shadow-xl w-full ${status === 'yes' ? 'bg-black/[0.05] border-black/10' : 'bg-white/[0.03] border-white/5'}`}>
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40">{t.currentMetric}</div>
                  <div className="text-6xl font-light tracking-tighter italic transition-all duration-300">
                    {Math.round(temperature)}°C
                  </div>
                </div>
                
                <div className={`h-[1px] w-12 ${status === 'yes' ? 'bg-black/20' : 'bg-white/20'}`} />

                <p className="text-sm font-mono leading-relaxed uppercase tracking-wide min-h-[60px] transition-opacity duration-500 opacity-60">
                  {status === 'yes' ? t.warmText : status === 'almost' ? t.almostText : t.coldText}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Manual Shifter moved to a more prominent fixed position */}
      <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-48 flex flex-col items-end gap-2 opacity-60 hover:opacity-100 transition-opacity z-[100] group">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-80 group-hover:opacity-100 transition-opacity">{t.sliderLabel}</div>
          <input 
              type="range" 
              min="-10" 
              max="40" 
              value={temperature} 
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full cursor-pointer accent-current bg-transparent"
          />
      </div>

      <footer className="relative z-10 p-8 hidden md:flex justify-between items-end">
        <div className="text-[10px] font-mono uppercase tracking-widest opacity-20">{t.footer1}</div>
        <div className="text-[10px] font-mono uppercase tracking-widest opacity-20">{t.footer2}</div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-in { animation: fade-in 1s ease-out forwards; }
        input[type='range'] {
          -webkit-appearance: none;
          appearance: none;
          height: 20px; /* Increased to avoid clipping thumb */
          background: transparent;
        }
        input[type='range']::-webkit-slider-runnable-track {
          width: 100%;
          height: 2px;
          cursor: pointer;
          border-radius: 2px;
          background: currentColor;
          opacity: 0.3;
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
          margin-top: -7px; /* (2px track height / 2) - (16px thumb height / 2) = -7px */
          border: none;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        /* Firefox */
        input[type='range']::-moz-range-track {
          width: 100%;
          height: 2px;
          cursor: pointer;
          border-radius: 2px;
          background: currentColor;
          opacity: 0.3;
        }
        input[type='range']::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
          border: none;
        }
        /* Focus styles */
        input[type='range']:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}
