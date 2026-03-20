import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Hexagon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const navRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -50',
        end: 99999,
        toggleClass: { className: 'bg-white/70 backdrop-blur-2xl border-white shadow-sm', targets: navRef.current },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <nav ref={navRef} className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl rounded-[2rem] border border-white/20 bg-white/30 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] transition-all duration-300 flex items-center justify-between px-6 py-3">
      <div className="font-sans font-bold text-xl tracking-tight text-accent flex items-center gap-2 cursor-pointer">
        <Hexagon className="w-6 h-6 text-accent" /> <span className="text-dark">DM Studio</span>
      </div>
      <div className="hidden md:flex items-center gap-8 font-sans text-sm font-semibold">
        <a href="#portfolio" className="hover:text-accent transition-colors">Portfolio</a>
        <a href="#process" className="hover:text-accent transition-colors">Process</a>
      </div>
      <button className="relative overflow-hidden group bg-dark text-white px-5 py-2.5 rounded-[2rem] font-sans text-sm font-semibold transition-transform hover:scale-[1.03] duration-300 flex items-center gap-2">
        <span className="relative z-10 transition-transform group-hover:-translate-y-10">Contact</span>
        <span className="absolute inset-0 flex items-center justify-center bg-accent transition-transform translate-y-full group-hover:translate-y-0">Contact</span>
      </button>
    </nav>
  );
};

const Hero = () => {
  const heroRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-elem', {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-[100dvh] w-full flex items-end pb-24 px-6 md:px-12 lg:px-24 bg-dark">
      <div className="absolute inset-0 z-0 opacity-80">
        <img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=2000" alt="Minimalist Architecture" className="w-full h-full object-cover grayscale opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/40 to-transparent"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl flex flex-col items-start gap-4">
        <div className="hero-elem text-white font-sans font-medium text-sm tracking-widest border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4">
          Sys 01 // Hyper-Realistic Archviz
        </div>
        <h1 className="hero-elem font-sans font-bold text-5xl md:text-7xl lg:text-[7rem] text-white leading-[1.05] tracking-tighter">
          Visualize the <br className="hidden md:block"/><span className="text-accent font-light">structure.</span>
        </h1>
        <div className="hero-elem mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="relative overflow-hidden group bg-white text-dark px-8 py-4 rounded-[3rem] font-sans text-lg font-bold transition-transform hover:scale-[1.03] duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex items-center justify-center gap-2">
            <span className="relative z-10 flex items-center gap-2">Explore Portfolio <ArrowRight className="w-5 h-5" /></span>
          </button>
          <button className="relative overflow-hidden group bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-[3rem] font-sans text-lg font-bold transition-transform hover:scale-[1.03] duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex items-center justify-center gap-2">
            <span className="relative z-10 hover:text-accent transition-colors">Client Inquiry</span>
          </button>
        </div>
      </div>
    </section>
  );
};

const ShufflerCard = () => {
  const [cards, setCards] = useState([
    { id: 1, title: 'Material Accuracy', val: '99.9%' },
    { id: 2, title: 'Lighting Fidelity', val: 'Raytraced' },
    { id: 3, title: 'Micro-Textures', val: '4K/8K' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        const newCards = [...prev];
        const last = newCards.pop();
        newCards.unshift(last);
        return newCards;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/50 backdrop-blur-md border border-dark/10 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col h-[400px] overflow-hidden relative transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
      <div className="mb-8">
        <h3 className="font-sans font-bold text-2xl text-dark tracking-tight">Uncompromising Realism</h3>
        <p className="font-sans text-sm text-dark/60 font-medium mt-2">Sys.01 // Diagnostic Shuffler</p>
      </div>
      <div className="relative flex-1 flex flex-col items-center justify-center">
        {cards.map((c, i) => (
          <div 
            key={c.id}
            className="absolute w-full bg-white border border-dark/5 p-6 rounded-[1.5rem] shadow-sm transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col gap-2"
            style={{
              top: `${i * 20 + 20}px`,
              scale: 1 - i * 0.05,
              zIndex: 10 - i,
              opacity: 1 - i * 0.2
            }}
          >
            <div className="font-sans text-xs text-accent font-bold tracking-wider uppercase">Param {c.id}</div>
            <div className="font-sans font-semibold text-lg text-dark">{c.title}</div>
            <div className="font-sans text-sm bg-[#FAFAFA] border border-dark/5 pt-2 pb-2 pl-3 text-dark rounded-md font-bold text-left">{c.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TypewriterCard = () => {
  const fullText = "Analyzing lighting...\n> Sun trajectory verified.\n> Fog density: 12%.\n> Ambiance pass complete.\n> Ready for render.";
  const [text, setText] = useState('');
  
  useEffect(() => {
    let current = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
         current += fullText.charAt(i);
         setText(current);
         i++;
      } else {
         setTimeout(() => { current = ''; i = 0; setText(''); }, 3000);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/50 backdrop-blur-md border border-dark/10 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col h-[400px] transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="font-sans font-bold text-2xl text-dark tracking-tight">Atmospheric Precision</h3>
          <p className="font-sans text-sm text-dark/60 font-medium mt-2">Sys.02 // Telemetry Feed</p>
        </div>
        <div className="flex items-center gap-2 bg-accent/10 py-1.5 px-3 rounded-full">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <span className="font-sans text-[10px] text-accent font-bold tracking-wider uppercase">Live Feed</span>
        </div>
      </div>
      <div className="flex-1 bg-[#1A1A1A] text-white p-6 rounded-[1.5rem] font-sans text-sm font-medium leading-relaxed whitespace-pre-line overflow-hidden relative shadow-inner">
        {text}
        <span className="inline-block w-2 h-4 bg-accent ml-1 animate-pulse align-middle"></span>
      </div>
    </div>
  );
};

const SchedulerCard = () => {
  return (
    <div className="bg-white/50 backdrop-blur-md border border-dark/10 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col h-[400px] relative overflow-hidden group transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
      <div className="mb-8">
        <h3 className="font-sans font-bold text-2xl text-dark tracking-tight">Immersive Scale</h3>
        <p className="font-sans text-sm text-dark/60 font-medium mt-2">Sys.03 // Scale Calibration</p>
      </div>
      <div className="flex-1 border border-dark/5 rounded-[1.5rem] p-4 grid grid-cols-7 gap-1 relative bg-white shadow-inner">
        {['S','M','T','W','T','F','S'].map((day, i) => (
          <div key={i} className={`flex items-center justify-center font-sans font-bold text-xs rounded-xl ${i === 3 ? 'bg-accent text-white shadow-sm' : 'bg-transparent text-dark/40'}`}>
            {day}
          </div>
        ))}
        {/* Animated Custom Cursor SVG */}
        <div className="absolute top-1/2 left-1/2 w-6 h-6 text-dark z-10 transition-transform duration-1000 -translate-x-1/2 -translate-y-1/2 group-hover:translate-x-12 group-hover:-translate-y-8">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="1" className="drop-shadow-md"><path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.42c.45 0 .67-.54.35-.85L6.35 3.35a.5.5 0 00-.85.35z"/></svg>
        </div>
      </div>
    </div>
  );
}

const Features = () => {
  const container = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feat-card', {
        scrollTrigger: {
          trigger: container.current,
          start: 'top 80%',
        },
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out'
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="py-24 px-6 md:px-12 lg:px-24 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <div className="feat-card"><ShufflerCard /></div>
        <div className="feat-card"><TypewriterCard /></div>
        <div className="feat-card"><SchedulerCard /></div>
      </div>
    </section>
  );
};

const PortfolioStats = () => {
  const statsRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stat-item', {
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out'
      });
    }, statsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={statsRef} className="py-24 px-6 md:px-12 lg:px-24 border-t border-dark/5 relative z-10 w-full flex justify-center bg-white/30 backdrop-blur-md">
      <div className="max-w-7xl w-full flex flex-col items-center">
        <h2 className="font-sans font-bold text-3xl md:text-5xl tracking-tight text-dark mb-16">Portfolio Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16 w-full lg:divide-x divide-dark/10">
          <div className="stat-item flex flex-col items-center text-center gap-2">
            <div className="font-sans text-accent text-sm tracking-wider uppercase font-bold">Total Projects</div>
            <div className="font-sans font-bold text-5xl md:text-7xl text-dark tracking-tighter">154+</div>
          </div>
          <div className="stat-item flex flex-col items-center text-center gap-2">
            <div className="font-sans text-accent text-sm tracking-wider uppercase font-bold">Global Clients</div>
            <div className="font-sans font-bold text-5xl md:text-7xl text-dark tracking-tighter">82</div>
          </div>
          <div className="stat-item flex flex-col items-center text-center gap-2">
            <div className="font-sans text-accent text-sm tracking-wider uppercase font-bold">Target Accuracy</div>
            <div className="font-sans font-bold text-5xl md:text-7xl text-dark tracking-tighter">99%</div>
          </div>
          <div className="stat-item flex flex-col items-center text-center gap-2">
            <div className="font-sans text-accent text-sm tracking-wider uppercase font-bold">Render Hours</div>
            <div className="font-sans font-bold text-5xl md:text-7xl text-dark tracking-tighter">12k+</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Philosophy = () => {
  const philRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.phil-line', {
        y: 60, opacity: 0
      }, {
        scrollTrigger: {
          trigger: philRef.current,
          start: 'top 60%',
        },
        y: 0, opacity: 1,
        stagger: 0.2,
        duration: 1.2,
        ease: 'power3.out'
      });
    }, philRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={philRef} className="relative py-48 px-6 md:px-12 lg:px-24 bg-[#111111] text-white overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <img src="https://images.unsplash.com/photo-1541888079737-14f7b24ccbb1?auto=format&fit=crop&q=80&w=2000" alt="Concrete Texture" className="w-full h-full object-cover grayscale opacity-30" />
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-12 text-center md:text-left">
        <p className="phil-line font-sans font-medium text-xl md:text-2xl text-white/60 tracking-tight">
          Most visualization focuses on <span className="text-white">generic rendering.</span>
        </p>
        <p className="phil-line font-sans font-bold text-5xl md:text-7xl lg:text-[7rem] leading-none tracking-tighter">
          We focus on <br className="hidden md:block"/>
          <span className="font-light text-accent">absolute truth.</span>
        </p>
      </div>
    </section>
  );
};

const Protocol = () => {
  const container = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (i === 0) return;
        gsap.to(cardsRef.current[i - 1], {
          scale: 0.9,
          opacity: 0.5,
          filter: 'blur(10px)',
          scrollTrigger: {
            trigger: card,
            start: 'top 60%',
            end: 'top top',
            scrub: true,
          }
        });
      });
    }, container);
    return () => ctx.revert();
  }, []);

  const steps = [
    { num: '01', title: '도면 접수', desc: '고객으로부터 CAD 도면 및 기초 데이터를 전달받아 공간 분석을 시작합니다.', anim: (
      <div className="w-32 h-32 border border-accent/30 animate-[spin_10s_linear_infinite] rounded-[2rem] flex items-center justify-center bg-white shadow-sm">
        <div className="w-20 h-20 border border-dark/20 rotate-45 rounded-xl"></div>
      </div>
    )},
    { num: '02', title: '모델링 제작', desc: '물리적 속성을 고려하여 정교한 3D 지오메트리 및 매터리얼을 구축합니다.', anim: (
      <div className="w-full h-12 bg-dark/5 overflow-hidden relative rounded-xl border border-dark/10">
        <div className="absolute top-0 left-0 h-full w-2 bg-accent animate-[ping_2s_linear_infinite]"></div>
        <div className="grid grid-cols-12 gap-1 h-full opacity-20 p-1">
          {[...Array(12)].map((_, i) => <div key={i} className="bg-dark rounded-sm"></div>)}
        </div>
      </div>
    )},
    { num: '03', title: '초현실 렌더링', desc: '빛의 반사와 산란을 계산하여 사진과 구분할 수 없는 고품질 렌더링을 완성합니다.', anim: (
      <svg className="w-full h-24 stroke-accent drop-shadow-sm" fill="none" viewBox="0 0 100 20" preserveAspectRatio="none">
        <path d="M0 10 L20 10 L25 5 L35 15 L40 10 L100 10" strokeWidth="0.5" strokeDasharray="100" strokeDashoffset="100" className="animate-[dash_2s_linear_infinite]" />
        <style>{`@keyframes dash { to { stroke-dashoffset: 0; } } .animate-\\[dash_2s_linear_infinite\\] { animation: dash 2s linear infinite; }`}</style>
      </svg>
    )}
  ];

  return (
    <section ref={container} className="relative pb-24 border-t border-dark/5">
      {steps.map((step, i) => (
        <div 
          key={i} 
          ref={el => cardsRef.current[i] = el}
          className="h-[80vh] w-full flex items-center justify-center sticky top-24 px-6 py-12"
        >
          <div className="w-full max-w-5xl bg-white/70 backdrop-blur-2xl border border-white max-h-[500px] rounded-[3rem] p-8 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 flex flex-col gap-4">
              <div className="font-sans text-accent text-sm font-bold tracking-widest uppercase">STEP // {step.num}</div>
              <h2 className="font-sans font-bold text-4xl md:text-5xl tracking-tight text-dark">{step.title}</h2>
              <p className="font-sans text-base font-medium text-dark/70 leading-relaxed max-w-sm mt-3">{step.desc}</p>
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center min-h-[250px] bg-[#FAFAFA] rounded-[2rem] p-8 shadow-inner border border-dark/5">
              {step.anim}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

const GetStarted = () => {
  return (
    <section className="py-16 px-6 md:px-12 lg:px-24 flex items-center justify-center z-10 relative">
      <div className="w-full max-w-5xl bg-[#111111] text-white rounded-[3rem] p-12 md:p-24 flex flex-col items-center text-center gap-6 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h2 className="font-sans font-bold text-5xl md:text-7xl tracking-tighter">Initiate Node</h2>
          <p className="font-sans font-medium mt-4 text-white/70 max-w-lg mb-8 text-sm">Select a visualization type to begin the simulation process. Our pipeline is ready for data ingestion.</p>
          <button className="relative overflow-hidden group bg-accent text-white px-10 py-5 rounded-[3rem] font-sans text-xl font-bold transition-transform hover:scale-[1.03] duration-300 flex items-center justify-center gap-2 shadow-lg shadow-accent/20">
            <span className="relative z-10 flex items-center gap-2">Contact Systems <ArrowUpRight className="w-6 h-6" /></span>
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#111111] text-white pt-24 pb-12 px-6 md:px-12 lg:px-24 rounded-t-[4rem] relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          <div className="font-sans font-bold text-3xl tracking-tighter flex items-center gap-2">
            <Hexagon className="w-8 h-8 text-accent" /> DM Studio
          </div>
          <p className="font-sans text-sm font-medium text-white/50 max-w-sm">
            Hyper-realistic architectural visualization.<br/>
            Raw precision. Immersive scale.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="font-sans text-xs uppercase font-bold text-green-500 tracking-wider">System Operational</div>
          </div>
        </div>
        <div className="flex flex-col gap-4 font-sans text-sm font-medium text-white/50">
          <h4 className="text-white font-bold mb-2">Index</h4>
          <a href="#" className="hover:text-accent transition-colors">Portfolio</a>
          <a href="#" className="hover:text-accent transition-colors">Process</a>
          <a href="#" className="hover:text-accent transition-colors">Laboratory</a>
        </div>
        <div className="flex flex-col gap-4 font-sans text-sm font-medium text-white/50">
          <h4 className="text-white font-bold mb-2">Legal</h4>
          <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-accent transition-colors">Privacy Protocol</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-xs font-semibold text-white/30 uppercase tracking-wider">
        <div>&copy; {new Date().getFullYear()} DM Studio. Elements secured.</div>
        <div>Sector 01 // Node Active</div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="relative bg-[#FAFAFA] text-[#111111] font-sans overflow-hidden">
      {/* Noise Overlay */}
      <svg className="noise-overlay" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
      
      <Navbar />
      <Hero />
      <Features />
      <PortfolioStats />
      <Philosophy />
      <Protocol />
      <GetStarted />
      <Footer />
    </div>
  );
}
