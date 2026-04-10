'use client';

import { useState, useEffect } from 'react';
import BramSVG from './components/BramSVG';

export default function Home() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [locationDenied, setLocationDenied] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          );
          const data = await response.json();
          if (data.current_weather) {
            setTemperature(data.current_weather.temperature);
          } else {
            setError('Could not fetch weather data.');
          }
        } catch (err) {
          setError('Failed to fetch weather data.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setLocationDenied(true);
        } else {
          setError('Could not retrieve your location.');
        }
        setLoading(false);
      }
    );
  }, []);

  const isWarm = temperature !== null && temperature >= 15;

  return (
    <div className="min-h-screen bg-[#000] text-white selection:bg-white selection:text-black overflow-hidden flex flex-col">
      {/* Background decoration inspired by antigravity.google */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/5 blur-[150px] rounded-full" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
        {loading ? (
          <div className="space-y-4 animate-in fade-in duration-1000">
            <div className="text-sm font-mono tracking-widest uppercase opacity-40">Calculating environment...</div>
            <div className="w-12 h-[1px] bg-white/20 mx-auto" />
          </div>
        ) : locationDenied ? (
          <div className="max-w-md animate-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-4xl font-bold tracking-tighter mb-4 uppercase">Lost.</h1>
            <p className="text-white/60 mb-8 font-mono text-sm leading-relaxed">
              Bram cannot see you. Enable geolocation to reveal the truth.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 border border-white/20 hover:bg-white hover:text-black transition-all duration-300 rounded-full font-mono text-xs uppercase tracking-widest"
            >
              Retry Connection
            </button>
          </div>
        ) : error ? (
          <div className="max-w-md animate-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-4xl font-bold tracking-tighter mb-4 uppercase">Error.</h1>
            <p className="text-white/60 font-mono text-sm uppercase">{error}</p>
          </div>
        ) : (
          <div className="w-full max-w-5xl flex flex-col items-center space-y-12 md:space-y-20 animate-in fade-in duration-1000">
            <h1 className="text-sm font-mono tracking-[0.4em] uppercase opacity-40">
              Kan Bram een korte broek aan?
            </h1>

            <div className="relative group">
              {/* Massive Yes/No with improved readability */}
              <div 
                className={`text-[clamp(6rem,20vw,16rem)] font-black leading-none tracking-tighter transition-all duration-1000 ${
                  isWarm ? 'text-white' : 'text-white/20'
                } drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)]`}
              >
                {isWarm ? 'JA.' : 'NEE.'}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 w-full">
              <div className="bg-white rounded-2xl p-8 transform -rotate-1 hover:rotate-0 transition-transform duration-500 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10">
                <BramSVG isWarm={isWarm} mousePos={mousePos} />
              </div>

              <div className="text-left space-y-6 max-w-xs backdrop-blur-sm bg-white/[0.03] p-6 rounded-2xl border border-white/5 shadow-xl">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40">Current metric</div>
                  <div className="text-5xl font-light tracking-tighter italic">{temperature}°C</div>
                </div>
                
                <div className="h-[1px] w-12 bg-white/20" />

                <p className="text-white/50 text-sm font-mono leading-relaxed uppercase tracking-wide">
                  {isWarm 
                    ? "Optimal conditions met. Thermal exposure advised for lower extremities." 
                    : "Thermal threshold not achieved. Long-form covering recommended."}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 p-8 flex justify-between items-end">
        <div className="text-[10px] font-mono uppercase tracking-widest opacity-20">
          Experimental Body Layout v1.0
        </div>
        <div className="text-[10px] font-mono uppercase tracking-widest opacity-20">
          Data: Open-Meteo
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
