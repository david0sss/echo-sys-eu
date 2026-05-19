/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
import { setLanguage, useLanguage, t } from "./translations";
import LogoLoop from "./components/LogoLoop";
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useMotionValue, useTransform, useSpring } from "motion/react";
const LazyGlobe = lazy(() => import("./components/ui/globe").then(m => ({ default: m.Globe })));
import ColorBends from "./components/ui/ColorBends";
import GlassSurface from "./components/ui/GlassSurface";
import { Shield, ChevronRight, Sparkles, CheckCircle2, Zap, Building, Crosshair, Layers, Hexagon, Ruler, Weight, ShieldAlert, Users, Thermometer, Clock, Menu, X } from "lucide-react";
import Lenis from "lenis";

const LogoMark = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 256 256" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M128 256C128 185.308 185.308 128 256 128C185.308 128 128 70.6924 128 0C128 70.6924 70.6924 128 0 128C70.6924 128 128 185.308 128 256Z" fill="currentColor"/>
  </svg>
);



const LanguageSwitcher = () => {
  const lang = useLanguage();
  const langs = ['en', 'pl', 'uk', 'nl'];
  return (
    <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full p-1 ml-2 shadow-lg backdrop-blur-md relative">
      {langs.map(l => (
        <motion.button
          key={l}
          onClick={() => setLanguage(l)}
          className={`relative px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full z-10 transition-colors ${lang === l ? 'text-black' : 'text-white/40 hover:text-white'}`}
          whileHover={{ scale: lang === l ? 1 : 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {lang === l && (
            <motion.div
              layoutId="langPill"
              className="absolute inset-0 bg-white rounded-full"
              style={{ zIndex: -1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          {l}
        </motion.button>
      ))}
    </div>
  );
};


const SystemButton = ({ label = "Explore Systems", onClick }: { label?: string, onClick?: () => void }) => {
  const handleClick = (e: any) => {
    if (onClick) onClick();
    else {
      window.dispatchEvent(new Event('openContact'));
      setTimeout(() => document.getElementById('contact-form')?.scrollIntoView({behavior: 'smooth'}), 100);
    }
  };
  
  return (
    <button onClick={handleClick} className="cursor-pointer group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-xs px-6 py-2.5 transition-all hover:bg-white/90 active:scale-[0.98]">
      <Shield className="w-4 h-4" />
      <span>{label}</span>
      <ChevronRight className="w-4 h-4 opacity-50 transition-transform group-hover:translate-x-1" />
    </button>
  );
};

const TopNav = () => {
  const [hidden, setHidden] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [glassEnabled, setGlassEnabled] = useState(!((window as any).liquidGlassDisabled));
  const [mobileOpen, setMobileOpen] = useState(false);
  const lang = useLanguage();
  const langs = ['en', 'pl', 'uk', 'nl'];
  const { scrollY } = useScroll();

  const toggleGlass = () => {
    const newState = !glassEnabled;
    setGlassEnabled(newState);
    (window as any).liquidGlassDisabled = !newState;
    window.dispatchEvent(new CustomEvent('toggleLiquidGlass', { detail: { enabled: newState } }));
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
      setMobileOpen(false);
    } else {
      setHidden(false);
    }
  });

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-40 opacity-70" />
      <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/80 to-transparent pointer-events-none z-40 opacity-90" />
      <div
        className="fixed top-0 left-0 right-0 h-24 z-[60]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      {/* Mobile backdrop — closes menu on outside tap */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-[65] bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        variants={{
          visible: { y: 0 },
          hidden: { y: "-150%" }
        }}
        animate={hidden && !isHovered ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed top-4 left-0 right-0 z-[70] flex justify-center items-center gap-3 w-full px-4"
      >
        {/* Auto-shrinking pill anchors mobile dropdown */}
        <div className="relative">
          <GlassSurface borderRadius={9999} className="rounded-full border border-white/10 hover:border-white/20 transition-all bg-[#0e1014]/40 shadow-2xl" contentClassName="flex items-center gap-5 lg:gap-8 px-4 sm:px-5 py-3">
            <div className="flex items-center">
              <img
                src="/images/logo-main.svg"
                alt="ECHO SYSTEMS"
                className="h-10 w-auto object-contain brightness-0 invert"
                loading="eager"
              />
            </div>
            <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-[10px] lg:text-xs font-bold tracking-widest uppercase opacity-70">
              <button onClick={() => scrollTo('section-systems')} className="cursor-pointer hover:text-white transition-colors">{t('eng')}</button>
              <button onClick={() => scrollTo('section-about')} className="cursor-pointer hover:text-white transition-colors">{t('abt')}</button>
            </nav>
            <div className="flex items-center gap-2 lg:gap-3">
              <SystemButton label={t('quote')} onClick={() => { document.getElementById('contact-form')?.scrollIntoView({behavior: 'smooth'}); setMobileOpen(false); }} />
              <LanguageSwitcher />
              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                className="md:hidden cursor-pointer flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors ml-1"
                aria-label="Toggle navigation menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="w-4 h-4" />
                    </motion.span>
                  ) : (
                    <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </GlassSurface>

          {/* Mobile slide-down panel */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="md:hidden absolute top-[calc(100%+8px)] left-0 right-0 rounded-2xl border border-white/10 bg-[#0e1014]/95 backdrop-blur-xl shadow-2xl overflow-hidden"
              >
                <div className="p-4 flex flex-col gap-1">
                  {/* Nav links */}
                  {[
                    { label: t('eng'), id: 'section-systems' },
                    { label: t('abt'), id: 'section-about' },
                  ].map(link => (
                    <button
                      key={link.id}
                      onClick={() => scrollTo(link.id)}
                      className="cursor-pointer w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase text-white/70 hover:text-white hover:bg-white/5 transition-all"
                    >
                      {link.label}
                    </button>
                  ))}

                  <div className="border-t border-white/10 mt-2 pt-4 flex flex-col gap-3">
                    {/* FX Toggle */}
                    <button
                      onClick={toggleGlass}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all ${
                        glassEnabled
                          ? 'text-emerald-400 bg-emerald-500/5 border border-emerald-500/20'
                          : 'text-white/40 bg-white/5 border border-white/10'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 shrink-0" />
                      {glassEnabled ? 'Effects ON' : 'Effects OFF'}
                    </button>

                    {/* Inline language switcher */}
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 relative">
                      {langs.map(l => (
                        <motion.button
                          key={l}
                          onClick={() => setLanguage(l)}
                          className={`relative flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full z-10 transition-colors ${
                            lang === l ? 'text-black' : 'text-white/40 hover:text-white'
                          }`}
                          whileTap={{ scale: 0.92 }}
                        >
                          {lang === l && (
                            <motion.div
                              layoutId="langPillMobile"
                              className="absolute inset-0 bg-white rounded-full"
                              style={{ zIndex: -1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                            />
                          )}
                          {l}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* FX Toggle — flex sibling of pill */}
        <button
          onClick={toggleGlass}
          className={`hidden md:flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all backdrop-blur-md border shadow-xl ${
            glassEnabled
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-black/40 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>{glassEnabled ? 'FX ON' : 'FX OFF'}</span>
        </button>
      </motion.div>
    </>
  );
};

const Hero = () => {
  const lang = useLanguage();
  
  return (
  <section className="relative flex flex-col items-center justify-center text-center min-h-[100vh] py-32 px-6">
    <div className="flex items-center gap-2 mb-6 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 relative z-10 w-fit mx-auto">
      <div className="w-2 h-2 rounded-full bg-[#FF4D00] shadow-[0_0_8px_#FF4D00]"></div>
      <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/90">{t('eu_cert')}</span>
    </div>
    
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="text-[clamp(3rem,6vw,8rem)] font-black leading-[0.9] tracking-tighter relative z-10 w-full"
    >
      <span className="block text-white">{t('hero_title1')}</span>
      <span className="block animate-shiny">
        {t('hero_title2')}
      </span>
    </motion.h1>
    
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="mt-12 max-w-2xl text-base md:text-lg text-white/50 leading-relaxed font-medium relative z-10 mx-auto"
    >
      {t('hero_desc')}
    </motion.p>

    <motion.div 
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 1, delay: 0.4 }}
       className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center z-10"
    >
      <SystemButton label={t('deploy')} onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })} />
      <button onClick={() => {
        const el = document.getElementById('section-A');
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }} className="px-8 py-3 rounded-full border border-white/10 hover:border-white/30 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white transition-all hover:bg-white/5">
        {t('explore')}
      </button>
    </motion.div>
  </section>
  );
};

const TiltCard = ({ children, className, innerClassName = "grid grid-cols-1 md:grid-cols-12 w-full h-full", intensity = 10, distance = 800, onClick }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const isVisibleRef = useRef(false);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useTransform(smoothY, [-1, 1], [intensity, -intensity]);
  const rotateY = useTransform(smoothX, [-1, 1], [-intensity, intensity]);

  // Visibility gating — only track mouse when card is near viewport
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          // Smoothly reset tilt when leaving viewport
          x.set(0);
          y.set(0);
        }
      },
      { rootMargin: '100px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [x, y]);

  useEffect(() => {
    let rafId: number | null = null;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const update = () => {
      rafId = null;
      if (!ref.current || !isVisibleRef.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = lastMouseX - centerX;
      const distanceY = lastMouseY - centerY;
      const currentDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (currentDistance < distance) {
         const normalizedX = distanceX / (distance / 2);
         const normalizedY = distanceY / (distance / 2);
         const strength = 1 - Math.pow(currentDistance / distance, 2);

         x.set(Math.max(-1, Math.min(1, normalizedX)) * strength);
         y.set(Math.max(-1, Math.min(1, normalizedY)) * strength);
      } else {
         x.set(0);
         y.set(0);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      if (rafId === null && isVisibleRef.current) {
        rafId = requestAnimationFrame(update);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [distance, x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ perspective: 1200 }}
      className={className}
      onClick={onClick}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] cursor-pointer"
      >
        <GlassSurface borderRadius={32} className="w-full h-full border border-white/10 hover:border-white/20 transition-colors" contentClassName={innerClassName}>
          {children}
        </GlassSurface>
      </motion.div>
    </motion.div>
  );
};

const SystemViewer = () => {
  const lang = useLanguage();
  const [activeItemId, setActiveItemId] = useState<string>('ABOUT-2026');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const allItems: any[] = [
    { id: 'ABOUT-2026', name: t('about_name'), isAbout: true, material: '', desc: t('about_desc') },
    { id: 'ECM-PS-2026',  name: t('conc_ps_short'), targetId: 'A', image: "/images/series-a-1.webp", material: '', desc: t('conc_ps_desc'),         noStats: true },
    { id: 'ECM-RES-2026', name: t('step_a2_s'),     targetId: 'A', image: "/images/series-a-2.webp", material: '', desc: t('conc_res_viewer_desc'),  noStats: true },
    { id: 'ECM-IND-2026', name: t('conc_ind_short'),targetId: 'A', image: "/images/series-a-3.webp", material: '', desc: t('conc_ind_desc'),         noStats: true },
    { id: 'ESM-B1-2026',  name: t('step_b1_s'),     targetId: 'B', image: "/images/series-b-1.webp", material: '', desc: t('steel_b1_viewer_desc'),  noStats: true },
    { id: 'ESM-B2-2026',  name: t('step_b2_s'),     targetId: 'B', image: "/images/series-b-2.webp", material: '', desc: t('step_b2_d'),             noStats: true },
    { id: 'ESM-B3-2026',  name: t('step_b3_s'),     targetId: 'B', image: "/images/series-b-3.webp", material: '', desc: t('step_b3_d'),             noStats: true },
    { id: 'EP-MIL-2026',  name: t('pipe_mil_short'), targetId: 'C', image: "/images/series-c-1.webp", material: '', desc: t('pipe_mil_desc'),          noStats: true },
    { id: 'EP-CIV-2026',  name: t('pipe_civ_short'), targetId: 'C', image: "/images/series-c-2.webp", material: '', desc: t('pipe_civ_desc'),          noStats: true },
  ];

  const groups: any[] = [
    { type: 'item',   id: 'ABOUT-2026', label: t('about_short') },
    { type: 'folder', id: 'CONCRETE',   label: t('conc_short'),  targetId: 'A', children: [
        { id: 'ECM-PS-2026',  label: t('conc_ps_short') },
        { id: 'ECM-RES-2026', label: t('step_a2_s')     },
        { id: 'ECM-IND-2026', label: t('conc_ind_short')},
    ]},
    { type: 'folder', id: 'STEEL',     label: t('steel_short'), targetId: 'B', children: [
        { id: 'ESM-B1-2026', label: t('step_b1_s') },
        { id: 'ESM-B2-2026', label: t('step_b2_s') },
        { id: 'ESM-B3-2026', label: t('step_b3_s') },
    ]},
    { type: 'folder', id: 'PIPES',     label: t('pipe_short'),  targetId: 'C', children: [
        { id: 'EP-MIL-2026', label: t('pipe_mil_short') },
        { id: 'EP-CIV-2026', label: t('pipe_civ_short') },
    ]},
  ];

  const activeSystem = allItems.find(i => i.id === activeItemId) || allItems[0];

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleScrollToTarget = (e: React.MouseEvent) => {
    if (activeSystem?.targetId) {
      e.stopPropagation();
      document.getElementById(`section-${activeSystem.targetId}`)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="section-systems" className="relative px-6 lg:px-[50px] pt-12 pb-24 w-full max-w-[70rem] mx-auto z-30 -mt-16 sm:-mt-20 lg:-mt-32 xl:-mt-48">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
      >
        <TiltCard intensity={8} distance={1000} onClick={handleScrollToTarget}>
          {/* Sidebar */}
          <aside className="md:col-span-4 border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col gap-1 z-10 bg-black/60" style={{ transform: "translateZ(10px)" }}>
            <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-4 ml-2">{t('info_sys')}</div>
            <div className="flex flex-col gap-0.5">
              {groups.map(group => {
                if (group.type === 'item') {
                  return (
                    <div
                      key={group.id}
                      onClick={(e) => { e.stopPropagation(); setActiveItemId(group.id); }}
                      className={`cursor-pointer flex items-center justify-between p-4 text-sm font-medium rounded-xl border transition-all ${activeItemId === group.id ? 'bg-white/10 border-white/20 text-white shadow-lg' : 'bg-transparent border-transparent opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                    >
                      <span className="truncate mr-4">{group.label}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${activeItemId === group.id ? 'opacity-100' : 'opacity-0 -translate-x-2'}`} />
                    </div>
                  );
                }
                const isOpen = expandedFolders.has(group.id);
                const hasActiveChild = group.children.some((c: any) => c.id === activeItemId);
                return (
                  <div key={group.id}>
                    <div
                      onClick={(e) => { e.stopPropagation(); toggleFolder(group.id); }}
                      className={`cursor-pointer flex items-center justify-between p-4 text-sm font-medium rounded-xl border transition-all ${hasActiveChild ? 'border-white/10 text-white bg-white/5' : 'bg-transparent border-transparent opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                    >
                      <span className="truncate mr-4">{group.label}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-90 opacity-100' : 'opacity-50'}`} />
                    </div>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="ml-4 mt-0.5 border-l border-white/10 pl-3 flex flex-col gap-0.5 pb-1">
                            {group.children.length > 0 ? group.children.map((child: any) => (
                              <div
                                key={child.id}
                                onClick={(e) => { e.stopPropagation(); setActiveItemId(child.id); }}
                                className={`cursor-pointer flex items-center justify-between px-3 py-2.5 text-sm rounded-lg border transition-all ${activeItemId === child.id ? 'bg-white/10 border-white/20 text-white font-medium' : 'bg-transparent border-transparent opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                              >
                                <span className="truncate">{child.label}</span>
                                {activeItemId === child.id && <ChevronRight className="w-3 h-3 opacity-50 shrink-0" />}
                              </div>
                            )) : (
                              <span className="px-3 py-2 text-[11px] text-white/30 italic">Coming soon</span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Main View */}
          <div className="md:col-span-8 bg-transparent min-h-[500px] h-auto lg:h-[650px] relative overflow-hidden" style={{ transform: "translateZ(30px)" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSystem.id}
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative lg:absolute lg:inset-0 p-5 sm:p-8 md:p-12 space-y-6 flex flex-col justify-center w-full"
              >
              <div className="liquid-glass p-8 min-h-[220px] rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="flex flex-col sm:flex-row gap-6 mb-6">
                  {activeSystem.image && (
                    <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden border border-white/10 shadow-lg shrink-0 bg-white">
                      <img src={activeSystem.image} alt={activeSystem.name} loading="lazy" className="w-full h-full object-cover object-center" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-widest opacity-40 mb-3">{activeSystem.isAbout ? t('corp_over') : t('sys_det')}</div>
                    <div className="text-3xl font-bold tracking-tight mb-4">{activeSystem.name}</div>
                  </div>
                </div>
                <p className="text-sm text-white/60 leading-relaxed font-medium mb-6 whitespace-pre-wrap">
                  {activeSystem.isAbout ? "" : <strong className="text-white/80 font-semibold block mb-2">{activeSystem.material}</strong>}{activeSystem.desc}
                </p>
              </div>

              {activeSystem.isAbout ? (
                <div className="liquid-glass p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <div className="text-[10px] opacity-40 uppercase tracking-widest mb-4">{t('legal_entity')}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-mono text-white/80">
                    <div className="flex flex-col gap-1 border-b border-white/10 pb-3"><span className="text-white/40 uppercase text-[10px]">KRS</span><span>0000991436</span></div>
                    <div className="flex flex-col gap-1 border-b border-white/10 pb-3"><span className="text-white/40 uppercase text-[10px]">NIP</span><span>5242950185</span></div>
                    <div className="flex flex-col gap-1 border-b sm:border-b-0 border-white/10 pb-3 sm:pb-0"><span className="text-white/40 uppercase text-[10px]">REGON</span><span>523080793</span></div>
                    <div className="flex flex-col gap-1"><span className="text-white/40 uppercase text-[10px]">{t('address')}</span><span>ul. Rejtana 6/1<br/>87-100 Toruń</span></div>
                  </div>
                </div>
              ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </TiltCard>
      </motion.div>
    </section>
  );
};



const SecurityClassSlider = ({ classes, activeColor }: { classes: any[], activeColor: string }) => {
  const [active, setActive] = useState(0);
  
  return (
    <div className="flex flex-col gap-6 w-full lg:w-1/3">
      <div className="flex flex-col gap-2">
        <GlassSurface borderRadius={12} className="bg-white/5 border border-white/10 relative shadow-inner" contentClassName="flex p-1 w-full">
          {classes.map((cls, i) => (
            <button 
              key={cls.id}
              onClick={() => setActive(i)}
              className={`cursor-pointer flex-1 py-3 text-xs font-bold transition-all relative z-10 ${active === i ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
            >
              {cls.id}
            </button>
          ))}
          <div 
            className="absolute top-1 bottom-1 rounded-lg transition-all duration-300 ease-out shadow-lg"
            style={{
              width: `calc(100% / ${classes.length} - 4px)`,
              left: `calc((100% / ${classes.length}) * ${active} + 2px)`,
              backgroundColor: activeColor,
              opacity: 0.2
            }}
          />
        </GlassSurface>
      </div>
      
      <GlassSurface borderRadius={16} className="border border-white/10 transition-all bg-gradient-to-br from-white/5 to-transparent shadow-inner" contentClassName="flex flex-col justify-center p-6 min-h-[160px]">
        <motion.div
           key={active}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3 }}
        >
          <div className="text-lg font-bold mb-2 tracking-tight" style={{ color: activeColor }}>{classes[active].name}</div>
          <p className="text-white/60 text-[13px] leading-relaxed font-medium">
            {classes[active].desc}
          </p>
        </motion.div>
      </GlassSurface>
    </div>
  );
};

// key?: any is kept to satisfy TypeScript at the call site — React's `key` is a reserved prop
// that never reaches the component body. This is not a real prop; it is a TSC suppressor only.
const StickyScrollSection = ({ section, idx }: { section: any, idx: number, key?: any }) => {
  const isReversed = idx % 2 !== 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeStep, setActiveStep] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const totalSteps = section.steps.length;
    let step = Math.floor(latest * totalSteps);
    if (step >= totalSteps) step = totalSteps - 1;
    if (step < 0) step = 0;
    if (step !== activeStep) {
      setActiveStep(step);
    }
  });

  const imageClasses = 
    idx === 0 ? "w-full order-1 lg:order-none lg:w-5/12 h-[38dvh] sm:h-[200px] md:h-[280px] lg:h-[520px] rounded-[1.5rem] lg:rounded-[2rem]" :
    idx === 1 ? "w-full order-1 lg:order-none lg:w-7/12 h-[38dvh] sm:h-[180px] md:h-[260px] lg:h-[400px] rounded-[1.5rem] lg:rounded-[3rem]" :
    "w-full order-1 lg:order-none lg:w-1/2 h-[38dvh] sm:h-[180px] md:h-[260px] lg:h-auto lg:min-h-[460px] lg:aspect-video rounded-[1.5rem]";

  return (
    <div id={`section-${section.id}`} className="w-full relative border-t border-white/5 scroll-mt-20">
      {/* Sticky section */}
      <div ref={containerRef} className="relative w-full" style={{ height: `${section.steps.length * 100}vh` }}>
        <div className="sticky top-0 w-full h-[100dvh] flex flex-col justify-center overflow-hidden">
          <div className="max-w-[70rem] mx-auto w-full px-4 sm:px-6 lg:px-[50px] relative z-10 py-3 sm:py-4 md:py-8 lg:py-12">
            
            {/* Header & Image Layout */}
            <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-2 sm:gap-4 md:gap-6 lg:gap-20 items-center`}>
              
              {/* TEXT SIDE */}
              <div className="flex-1 w-full flex flex-col items-start z-10 order-2 lg:order-none">
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1 lg:px-4 lg:py-2 rounded-full border mb-2 lg:mb-8 uppercase tracking-widest text-[9px] lg:text-[10px] font-bold shadow-lg bg-black/40 backdrop-blur-md"
                  style={{ borderColor: `${section.color}40`, color: section.color }}
                >
                  Series {section.id} &mdash; {section.tagline}
                </div>
                
                <h2 className="text-lg sm:text-2xl md:text-4xl lg:text-[4.5rem] xl:text-[5rem] font-black tracking-tighter uppercase leading-[1.05] mb-1 sm:mb-2 lg:mb-6">
                  {section.title}
                </h2>
                
                <div className="relative w-full mb-1 lg:mb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="relative flex flex-col"
                    >
                      <h3 className="text-base sm:text-xl lg:text-2xl font-bold mb-1 lg:mb-3" style={{ color: section.color }}>
                        {section.steps[activeStep].subtitle}
                      </h3>
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/60 font-medium leading-relaxed max-w-xl mb-2 lg:mb-6 whitespace-pre-line">
                        {section.steps[activeStep].desc}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>


              </div>

              {/* IMAGE SIDE */}
              <TiltCard intensity={5} distance={600} className={`relative group ${imageClasses}`} innerClassName="w-full h-full relative overflow-hidden shadow-2xl border border-white/20 rounded-[inherit]">
                <div className="absolute inset-0 bg-black/20 mix-blend-multiply z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/40 to-transparent z-10 opacity-90"></div>
                
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeStep}
                    src={section.steps[activeStep].image} 
                    alt={section.steps[activeStep].subtitle} 
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 w-full h-full object-cover object-center" 
                  />
                </AnimatePresence>

                {/* Progress indicators */}
                <div className="absolute bottom-6 left-6 right-6 z-20 flex gap-2">
                  {section.steps.map((_: any, i: number) => (
                    <div key={i} className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full"
                        style={{ backgroundColor: section.color }}
                        initial={{ width: "0%" }}
                        animate={{ width: activeStep >= i ? "100%" : "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  ))}
                </div>

                <div className="absolute top-3 right-3 lg:top-6 lg:right-6 p-2 lg:p-4 rounded-xl lg:rounded-2xl bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 z-20 shadow-2xl">
                  {section.icon}
                </div>
              </TiltCard>
            </div>

            {/* Specs row — full width, single line, below text+image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="flex items-stretch gap-2 mt-2 md:mt-4 lg:mt-6 w-full"
              >
                {section.steps[activeStep].specs.map((spec: any, i: number) => (
                  <GlassSurface key={i} borderRadius={10} className="bg-[#ffffff0a] border border-white/20 relative group shadow-lg flex-1 min-w-0 min-h-[64px] sm:min-h-[72px]" contentClassName="flex flex-row items-center h-full gap-1.5 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                    <div className="opacity-40 shrink-0 relative z-10 hidden sm:block" style={{ color: section.color }}>{spec.icon}</div>
                    <div className="flex flex-col min-w-0 relative z-10">
                      <div className="text-[8px] sm:text-[9px] uppercase tracking-tight font-bold opacity-50 truncate">{spec.label}</div>
                      <div className="text-[9px] sm:text-xs font-bold tracking-tight leading-tight break-words">{spec.value}</div>
                      {spec.subValue && <div className="text-[8px] sm:text-[9px] font-mono opacity-50 break-all leading-tight">{spec.subValue}</div>}
                    </div>
                  </GlassSurface>
                ))}
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </div>

      {/* Non-sticky part: Features & Security */ }
      <div id={`section-${section.id}-features`} className="relative w-full z-10 bg-transparent py-24 border-y border-white/10 overflow-hidden">
        
        {/* Large background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <span className="text-[15vw] font-black tracking-tighter opacity-[0.03] whitespace-nowrap">
            {section.bgText || section.title.toUpperCase()}
          </span>
        </div>

        <div className="max-w-[80rem] px-6 lg:px-[50px] mx-auto w-full relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20, filter: 'blur(3px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 w-full items-start`}
            >
              
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {section.features.map((feat: any, i: number) => (
                  <GlassSurface 
                    key={i}
                    borderRadius={16}
                    className="border transition-all group relative shadow-lg bg-[#ffffff05] hover:bg-[#ffffff0a] w-full h-full"
                    contentClassName="flex flex-col gap-4 p-6"
                    style={{ borderColor: `${section.color}30` }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 opacity-100 group-hover:h-2 transition-all duration-300" style={{ backgroundColor: section.color }}></div>
                    <div className="font-mono text-[10px] mb-2 transition-colors relative z-10" style={{ color: section.color }}>0{i+1}</div>
                    <h4 className="text-xl font-bold tracking-tight text-white/90 leading-tight group-hover:text-white transition-colors relative z-10">{feat.title}</h4>
                    <p className="text-[13px] text-white/50 leading-relaxed font-medium group-hover:text-white/70 transition-colors relative z-10">{feat.desc}</p>
                  </GlassSurface>
                ))}
              </div>

              <SecurityClassSlider classes={section.classes} activeColor={section.color} />
              
            </motion.div>
        </div>
      </div>
    </div>
  );
};

const MaterialSeries = () => {
  const lang = useLanguage();
  
  const sections = [
    {
      id: "A",
      title: "Reinforced Concrete",
      bgText: "CONCRETE",
      tagline: "Underground / Heavy Duty",
      color: "#3D81E3",
      icon: <Building className="w-8 h-8" style={{ color: "rgba(61, 129, 227, 0.8)" }} />,
      steps: [
        {
          subtitle: t('step_a1_s'),
          desc: t('step_a1_d'),
          desc2: t('step_a1_d2'),
          image: "/images/series-a-1.webp",
          specs: [
            { icon: <Users className="w-4 h-4"/>, label: t('spec_cap'), value: t('val_p14') },
            { icon: <ShieldAlert className="w-4 h-4"/>, label: t('spec_rat'), value: t('val_u1u3') },
            { icon: <Weight className="w-4 h-4"/>, label: t('spec_mass'), value: t('val_mass_a1'), subValue: t('val_mass_a1_dims') },
            { icon: <Clock className="w-4 h-4"/>, label: t('spec_dur'), value: t('val_dur12') },
          ]
        },
        {
          subtitle: t('step_a2_s'),
          desc: t('step_a2_d'),
          image: "/images/series-a-2.webp",
          specs: [
            { icon: <Users className="w-4 h-4"/>, label: t('spec_cap'), value: t('val_p4') },
            { icon: <ShieldAlert className="w-4 h-4"/>, label: t('spec_rat'), value: t('val_u1s1') },
            { icon: <Weight className="w-4 h-4"/>, label: t('spec_mass'), value: t('val_mass_a1'), subValue: t('val_mass_a1_dims') },
            { icon: <Clock className="w-4 h-4"/>, label: t('spec_dur'), value: t('val_dur48p') },
          ]
        },
        {
          subtitle: t('step_a3_s'),
          desc: t('step_a3_d'),
          image: "/images/series-a-3.webp",
          specs: [
            { icon: <Users className="w-4 h-4"/>, label: t('spec_cap'), value: t('val_p70p') },
            { icon: <ShieldAlert className="w-4 h-4"/>, label: t('spec_rat'), value: t('val_u1s3') },
            { icon: <Building className="w-4 h-4"/>, label: t('spec_installation'), value: t('val_inst') },
            { icon: <Clock className="w-4 h-4"/>, label: t('spec_dur'), value: t('val_dur48p') },
          ]
        }
      ],
      features: [
        { title: t('feat_a1_t'), desc: t('feat_a1_d') },
        { title: t('feat_a2_t'), desc: t('feat_a2_d') },
        { title: t('feat_a3_t'), desc: t('feat_a3_d') }
      ],
      classes: [
        { id: "U1", name: "U1 Surface", desc: t('class_a_u1') },
        { id: "U2-U3", name: "U2/U3 Surface+", desc: t('class_a_u2') },
        { id: "S1-S3", name: "S1-S3 Underground", desc: t('class_a_s1') }
      ]
    },
    {
      id: "B",
      title: "Steel Modular",
      bgText: "STEEL",
      tagline: "Surface / Mobilized",
      color: "#A4F4FD",
      icon: <Layers className="w-8 h-8" style={{ color: "rgba(164, 244, 253, 0.8)" }} />,
      steps: [
        {
          subtitle: t('step_b1_s'),
          desc: t('step_b1_d'),
          image: "/images/series-b-1.webp",
          specs: [
            { icon: <Users className="w-4 h-4"/>, label: t('spec_cap'), value: t('val_b1_cap') },
            { icon: <ShieldAlert className="w-4 h-4"/>, label: t('spec_rat'), value: t('val_b1_rat') },
            { icon: <Ruler className="w-4 h-4"/>, label: t('spec_dim'), value: t('val_b1_dims') },
            { icon: <Clock className="w-4 h-4"/>, label: t('spec_dur'), value: t('val_b1_dur') }
          ]
        },
        {
          subtitle: t('step_b2_s'),
          desc: t('step_b2_d'),
          image: "/images/series-b-2.webp",
          specs: [
            { icon: <Users className="w-4 h-4"/>, label: t('spec_cap'), value: t('val_b2_cap') },
            { icon: <ShieldAlert className="w-4 h-4"/>, label: t('spec_rat'), value: t('val_b2_rat') },
            { icon: <Layers className="w-4 h-4"/>, label: t('spec_walls'), value: t('val_b2_dims') },
            { icon: <Clock className="w-4 h-4"/>, label: t('spec_dur'), value: t('val_b2_dur') }
          ]
        },
        {
          subtitle: t('step_b3_s'),
          desc: t('step_b3_d'),
          image: "/images/series-b-3.webp",
          specs: [
            { icon: <Users className="w-4 h-4"/>, label: t('spec_cap'), value: t('val_b3_cap') },
            { icon: <ShieldAlert className="w-4 h-4"/>, label: t('spec_rat'), value: t('val_b3_rat') },
            { icon: <Crosshair className="w-4 h-4"/>, label: t('spec_mob'), value: t('val_b3_mob') },
            { icon: <Clock className="w-4 h-4"/>, label: t('spec_dur'), value: t('val_b3_dur') }
          ]
        }
      ],
      features: [
        { title: t('feat_b1_t'), desc: t('feat_b1_d') },
        { title: t('feat_b2_t'), desc: t('feat_b2_d') },
        { title: t('feat_b3_t'), desc: t('feat_b3_d') }
      ],
      classes: [
        { id: "MDS", name: "MDS", desc: t('class_b_l1') },
        { id: "U1-U3", name: "U1-U3", desc: t('class_b_l2') },
        { id: "S1", name: "S1", desc: t('class_b_l3') }
      ]
    },
    {
      id: "C",
      title: "Polymer Underground Pipes",
      bgText: "PIPES",
      tagline: "Urban / Infrastructure",
      color: "#FF4D00",
      icon: <Hexagon className="w-8 h-8" style={{ color: "rgba(255, 77, 0, 0.8)" }} />,
      steps: [
        {
          subtitle: t('step_c1_s'),
          desc: t('step_c1_d'),
          image: "/images/series-c-1.webp",
          specs: [
            { icon: <Users className="w-4 h-4"/>, label: t('spec_cap'), value: t('val_c1_cap') },
            { icon: <ShieldAlert className="w-4 h-4"/>, label: t('spec_rat'), value: t('val_c1_rat') },
            { icon: <Building className="w-4 h-4"/>, label: t('spec_installation'), value: t('val_c1_inst') },
            { icon: <Clock className="w-4 h-4"/>, label: t('spec_dur'), value: t('val_c1_dur') }
          ]
        },
        {
          subtitle: t('step_c2_s'),
          desc: t('step_c2_d'),
          image: "/images/series-c-2.webp",
          specs: [
            { icon: <Ruler className="w-4 h-4"/>, label: t('spec_dim'), value: t('val_c2_diam') },
            { icon: <Building className="w-4 h-4"/>, label: t('spec_depth'), value: t('val_c2_len') },
            { icon: <Layers className="w-4 h-4"/>, label: t('spec_arch'), value: t('val_c2_sys') },
            { icon: <ShieldAlert className="w-4 h-4"/>, label: t('spec_blast'), value: t('val_c2_exit') }
          ]
        }
      ],
      features: [
        { title: t('feat_c1_t'), desc: t('feat_c1_d') },
        { title: t('feat_c2_t'), desc: t('feat_c2_d') },
        { title: t('feat_c3_t'), desc: t('feat_c3_d') }
      ],
      classes: [
        { id: "U1-U2", name: "U1/U2 Basic", desc: t('class_c_u12_d') },
        { id: "U3", name: "U3 High Protection", desc: t('class_c_u3_d') }
      ]
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {sections.map((section, idx) => (
        <StickyScrollSection key={section.id} section={section} idx={idx} />
      ))}
    </div>
  );
};

const certs = [
  { 
    node: <span className="flex items-center justify-center whitespace-nowrap font-mono text-base tracking-widest text-white/40 hover:text-white transition-colors cursor-pointer">ISO 9001:2015</span>, 
    title: "ISO 9001:2015 Quality Management", 
    content: "Certified quality management system for the engineering and manufacturing of heavy protective structures." 
  },
  { 
    node: <span className="flex items-center justify-center whitespace-nowrap font-mono text-base tracking-widest text-white/40 hover:text-white transition-colors cursor-pointer">STANAG 2280</span>, 
    title: "STANAG 2280 NATO standard", 
    content: "Certified against NATO STANAG 2280 engineering criteria for protective structures to resist explosive effects." 
  },
  { 
    node: <span className="flex items-center justify-center whitespace-nowrap font-mono text-base tracking-widest text-white/40 hover:text-white transition-colors cursor-pointer">EN 1143-1</span>, 
    title: "EN 1143-1 Vaults", 
    content: "Meets or exceeds European standards for secure storage, vaults, and blast resistant doors." 
  },
  { 
    node: <span className="flex items-center justify-center whitespace-nowrap font-mono text-base tracking-widest text-white/40 hover:text-white transition-colors cursor-pointer">FCC / CE Marked</span>, 
    title: "FCC / CE Certification", 
    content: "All electrical and environmental control components are fully FCC and CE certified for safe operation." 
  },
  { 
    node: <span className="flex items-center justify-center whitespace-nowrap font-mono text-base tracking-widest text-white/40 hover:text-white transition-colors cursor-pointer">NBC Filter Class 3</span>, 
    title: "NBC Class 3 Protection", 
    content: "Nuclear, Biological, and Chemical filtration systems certified to Military Class 3 containment specifications." 
  },
  { 
    node: <span className="flex items-center justify-center whitespace-nowrap font-mono text-base tracking-widest text-white/40 hover:text-white transition-colors cursor-pointer">DEF STAN 08-103</span>, 
    title: "UK DEF STAN 08-103", 
    content: "In compliance with the UK Ministry of Defence Standard for blast mitigating infrastructure." 
  }
];

const Validation = () => {
  const [activeCert, setActiveCert] = useState<any>(null);
  const { scrollY } = useScroll();
  const lang = useLanguage();
  

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (Math.abs(latest - previous) > 5) {
      // Only update state if a cert is actually open — avoids scroll-driven re-renders
      if (activeCert !== null) setActiveCert(null);
    }
  });

  const logosWithClicks = certs.map(cert => ({
    ...cert,
    onClick: () => setActiveCert(cert)
  }));

  return (
    <section id="section-about" className="relative w-full py-24 z-10">
      <motion.div 
        initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <div className="max-w-[70rem] mx-auto px-6 lg:px-[50px]">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-bold tracking-widest uppercase mb-6">
             <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></span>
             {t('global_stds')}
           </div>
           <h3 className="text-2xl md:text-3xl font-black tracking-tighter leading-[1.2] mb-6">
             {t('vid_t1')} <span className="text-white/40">{t('vid_t2')}</span> {t('vid_t3')} <span className="text-white/40">{t('vid_t4')}</span>
           </h3>
           <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
             {t('vid_desc')}
           </p>
         </div>
    
         <div className="grid lg:grid-cols-12 gap-6 items-stretch">
           {/* Video / Crash Test visual */}
           <div className="lg:col-span-8 liquid-glass rounded-3xl p-2 border border-white/10 relative min-h-[250px] lg:min-h-[450px] w-full overflow-hidden shadow-2xl">
             {/* Responsive 16:9 YouTube embed */}
             <div className="relative w-full h-full min-h-[246px] lg:min-h-[446px]" style={{ paddingBottom: 0 }}>
               <iframe
                 src="https://www.youtube.com/embed/5xgt8cTq_D0?rel=0&modestbranding=1"
                 title={t('sys_impact')}
                 loading="lazy"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                 allowFullScreen
                 className="absolute inset-0 w-full h-full rounded-[22px]"
                 style={{ border: 'none' }}
               />
             </div>
           </div>
    
           {/* Metrics Grid */}
           <div className="lg:col-span-4 flex flex-col gap-6 h-full">
             <div className="liquid-glass flex-1 rounded-3xl p-8 border border-white/10 flex flex-col justify-center min-h-[120px]">
               <div className="text-4xl lg:text-5xl font-black mb-2 tracking-tighter text-brand">12+ Bar</div>
               <div className="text-[10px] opacity-60 uppercase tracking-widest font-bold">{t('shock')}</div>
             </div>
             <div className="liquid-glass flex-1 rounded-3xl p-8 border border-white/10 flex flex-col justify-center min-h-[120px]">
               <div className="text-4xl lg:text-5xl font-black mb-2 tracking-tighter">360mm</div>
               <div className="text-[10px] opacity-60 uppercase tracking-widest font-bold">{t('conc_thick')}</div>
             </div>
             <div className="liquid-glass flex-1 rounded-3xl p-8 border border-brand/20 flex flex-col justify-center bg-brand/5 min-h-[120px]">
               <div className="text-3xl lg:text-4xl font-black mb-2 tracking-tighter flex items-center gap-3">
                 {t('cert_val')} <CheckCircle2 className="w-7 h-7 text-brand"/>
               </div>
               <div className="text-[10px] opacity-60 uppercase tracking-widest font-bold text-brand">{t('cert_in_eu')}</div>
             </div>
           </div>
         </div>
        </div>

       {/* Certifications Loop */}
       <div className="mt-24 py-8 relative overflow-hidden bg-transparent border-y border-white/10 w-full flex items-center">
         <div className="w-full">
           <LogoLoop
              logos={logosWithClicks}
              speed={40}
              direction="left"
              logoHeight={30}
              gap={64}
              hoverSpeed={10}
              scaleOnHover
              fadeOut
              fadeOutColor="#0e1014"
              ariaLabel="Certifications"
              className="py-4 w-full md:pl-48"
            />
         </div>
       </div>
      </motion.div>

      {/* Certification Popup Modal */}
      <AnimatePresence>
        {activeCert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCert(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md liquid-glass bg-[#0e1014] border border-white/20 p-8 rounded-3xl shadow-2xl z-10"
            >
              <div className="absolute top-4 right-4 cursor-pointer p-2 opacity-50 hover:opacity-100 transition-opacity" onClick={() => setActiveCert(null)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1L13 13M1 13L13 1"/></svg>
              </div>
              <div className="text-xs font-bold tracking-widest uppercase text-brand mb-4">{t('cert_det')}</div>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-4">{activeCert.title}</h3>
              <p className="text-white/70 leading-relaxed font-medium">{activeCert.content}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

// ── Contact Form ─────────────────────────────────────────────────────────────
// Standalone component so it can reset its own state when the modal closes.

interface ContactFormState {
  name:    string;
  email:   string;
  subject: string;
  message: string;
  // Honeypot: must stay empty — bots auto-fill hidden fields.
  // Server checks this field; if filled it silently drops the submission.
  _hp:     string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const ContactForm = ({ onClose }: { onClose: () => void }) => {
  const [fields, setFields] = useState<ContactFormState>({
    name: '', email: '', subject: '', message: '', _hp: '',
  });
  const [status,   setStatus]   = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');

    // ── Client-side validation ──────────────────────────────────────────────
    const { name, email, subject, message } = fields;
    if (!name.trim())                        { setErrorMsg(t('form_error')); return; }
    if (name.trim().length > 100)            { setErrorMsg('Name: max 100 characters.'); return; }
    if (!email.trim())                       { setErrorMsg(t('form_error')); return; }
    if (!EMAIL_RE.test(email.trim()))        { setErrorMsg('Please enter a valid email address.'); return; }
    if (email.trim().length > 150)           { setErrorMsg('Email: max 150 characters.'); return; }
    if (!subject.trim())                     { setErrorMsg(t('form_error')); return; }
    if (subject.trim().length > 150)         { setErrorMsg('Subject: max 150 characters.'); return; }
    if (!message.trim())                     { setErrorMsg(t('form_error')); return; }
    if (message.trim().length > 5000)        { setErrorMsg('Message: max 5000 characters.'); return; }

    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(fields),
      });

      const data: { ok: boolean; message?: string } = await res.json();

      if (res.ok && data.ok) {
        setStatus('success');
        // Auto-close modal after 3 s on success
        setTimeout(onClose, 3000);
      } else {
        setStatus('error');
        setErrorMsg(data.message ?? t('form_error'));
      }
    } catch {
      setStatus('error');
      setErrorMsg(t('form_error'));
    }
  };

  const isLoading = status === 'loading';

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
      <div className="shrink-0"><h3 className="text-2xl md:text-3xl font-black text-[#0c0c0c] tracking-tight">{t('contact')}</h3></div>

      {/* Success state */}
      {status === 'success' ? (
        <div className="flex-1 flex items-center gap-3 py-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-semibold text-emerald-700">{t('form_success')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex-1 w-full flex flex-col gap-4">
          {/* Honeypot — visually hidden, never filled by real users */}
          <input
            type="text"
            name="_hp"
            value={fields._hp}
            onChange={handleChange}
            aria-hidden="true"
            tabIndex={-1}
            autoComplete="off"
            style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
          />

          <div className="flex flex-col md:flex-row">
            <div className="flex-1 px-0 md:px-4 py-2 md:py-0 border-b md:border-b-0 md:border-r border-[#0c0c0c]/10">
              <label htmlFor="cf-name" className="text-[10px] font-bold tracking-widest uppercase text-[#0c0c0c]/40 block mb-1">{t('form_name')}</label>
              <input
                id="cf-name"
                type="text"
                name="name"
                value={fields.name}
                onChange={handleChange}
                placeholder="Type..."
                required
                maxLength={100}
                disabled={isLoading}
                autoComplete="name"
                className="w-full bg-transparent text-[#0c0c0c] text-sm font-medium placeholder:text-[#0c0c0c]/30 focus:outline-none py-1 disabled:opacity-50"
              />
            </div>
            <div className="flex-1 px-0 md:px-4 py-2 md:py-0 border-b md:border-b-0 md:border-r border-[#0c0c0c]/10">
              <label htmlFor="cf-email" className="text-[10px] font-bold tracking-widest uppercase text-[#0c0c0c]/40 block mb-1">{t('form_email')}</label>
              <input
                id="cf-email"
                type="email"
                name="email"
                value={fields.email}
                onChange={handleChange}
                placeholder="Email..."
                required
                maxLength={150}
                disabled={isLoading}
                autoComplete="email"
                className="w-full bg-transparent text-[#0c0c0c] text-sm font-medium placeholder:text-[#0c0c0c]/30 focus:outline-none py-1 disabled:opacity-50"
              />
            </div>
            <div className="flex-1 px-0 md:px-4 py-2 md:py-0 border-b md:border-b-0 md:border-r border-[#0c0c0c]/10">
              <label htmlFor="cf-subject" className="text-[10px] font-bold tracking-widest uppercase text-[#0c0c0c]/40 block mb-1">{t('form_subject')}</label>
              <input
                id="cf-subject"
                type="text"
                name="subject"
                value={fields.subject}
                onChange={handleChange}
                placeholder="Inquiry type..."
                required
                maxLength={150}
                disabled={isLoading}
                className="w-full bg-transparent text-[#0c0c0c] text-sm font-medium placeholder:text-[#0c0c0c]/30 focus:outline-none py-1 disabled:opacity-50"
              />
            </div>
            <div className="flex-1 px-0 md:px-4 py-2 md:py-0">
              <label htmlFor="cf-message" className="text-[10px] font-bold tracking-widest uppercase text-[#0c0c0c]/40 block mb-1">{t('form_msg')}</label>
              <input
                id="cf-message"
                type="text"
                name="message"
                value={fields.message}
                onChange={handleChange}
                placeholder="Your inquiry..."
                required
                maxLength={5000}
                disabled={isLoading}
                className="w-full bg-transparent text-[#0c0c0c] text-sm font-medium placeholder:text-[#0c0c0c]/30 focus:outline-none py-1 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Error banner */}
          {status === 'error' && errorMsg && (
            <p className="text-xs font-semibold text-red-600 mt-1">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="shrink-0 w-full md:w-auto md:self-end h-12 px-6 md:px-4 rounded-full bg-[#0c0c0c] text-white flex items-center justify-center gap-2 hover:bg-[#1a1a1a] transition-colors shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="text-xs font-bold tracking-widest uppercase">{t('form_sending')}</span>
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </form>
      )}
    </div>
  );
};

const DeploymentCTA = ({ onOpenContact, showContact }: { onOpenContact: () => void; showContact: boolean }) => {
  const lang = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Apply spring physics for extremely smooth continuous flow
  const smoothScrollY = useSpring(scrollYProgress, { stiffness: 50, damping: 20, mass: 0.5 });

  // Enhanced parallax effects (globe starts massive at 1.4 and scales down to 0.9)
  const textY = useTransform(smoothScrollY, [0, 1], ["20%", "-30%"]);
  const globeY = useTransform(smoothScrollY, [0, 1], ["30%", "-20%"]);
  const globeScale = useTransform(smoothScrollY, [0, 1], [1.4, 0.9]);

  return (
    <section id="contact-form" ref={sectionRef} className="relative min-h-[100dvh] w-full bg-[#0c0c0c] flex flex-col justify-end mt-32 z-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, transparent 0%, #0a0a0a 8%, #080808 100%)' }}>
      
      {/* Background DEPLOYMENT text — scaled down and strong parallax */}
      <motion.div 
        style={{ y: textY }}
        className="absolute top-[12vh] md:top-[8vh] left-0 w-full flex justify-center pointer-events-none select-none z-0"
      >
        <h2 className="text-[clamp(4rem,13vw,16rem)] leading-[0.85] font-black tracking-tighter text-white/[0.04] whitespace-nowrap uppercase">
          DEPLOYMENT
        </h2>
      </motion.div>

      {/* Globe — adaptive, massive, with strong scale & Y parallax */}
      <motion.div 
        className="absolute top-[8vh] md:top-[6vh] left-1/2 -translate-x-1/2 z-[1] pointer-events-none" 
        style={{ width: 'min(90vw, 85vh)', height: 'min(90vw, 85vh)', y: globeY, scale: globeScale }}
      >
        <Suspense fallback={null}>
          <LazyGlobe className="w-full h-full pointer-events-auto" />
        </Suspense>
      </motion.div>

      {/* Subtle radial glow behind globe */}
      <div className="absolute top-[30vh] left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse at center, rgba(61,129,227,0.03) 0%, transparent 70%)' }} />

      {/* Bottom gradient fade for readability */}
      <div className="absolute bottom-0 inset-x-0 h-[50vh] bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent z-[2] pointer-events-none" />

      {/* ---- Content overlay ---- */}
      <div className="relative z-10 flex-1 flex flex-col justify-between min-h-screen pointer-events-none">
        
        {/* Middle content: flanking info + perfectly centered CTA, moved to bottom */}
        <div className="flex-1 flex items-end justify-center pb-24 md:pb-32">
          <div className="w-full max-w-[85rem] mx-auto px-6 lg:px-12 relative flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 lg:gap-0">
            
            {/* Left — tagline (constrained width to allow center absolute positioning) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:w-1/3 text-center lg:text-left pointer-events-auto"
            >
              <h3 className="text-xl md:text-2xl lg:text-[1.7rem] font-semibold leading-snug text-white/90 tracking-tight">
                {t('lets_discuss')}<br />
                <span className="text-white/50">{t('req')}</span>
              </h3>
              <p className="mt-4 text-sm text-white/40 leading-relaxed font-medium hidden lg:block">
                {t('req_desc')}
              </p>
            </motion.div>

            {/* Center — CTA button perfectly centered horizontally */}
            <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex flex-col items-center gap-6 pointer-events-auto z-10">
              <AnimatePresence mode="wait">
                {!showContact && (
                  <motion.button
                    key="cta-btn"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    onClick={onOpenContact}
                    className="cursor-pointer group flex items-center gap-0 bg-white/95 hover:bg-white rounded-full shadow-[0_4px_40px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_60px_rgba(255,255,255,0.25)] transition-all duration-300"
                  >
                    <span className="px-8 py-4 text-[#0c0c0c] font-bold text-sm tracking-wide">
                      {t('deploy')}
                    </span>
                    <span className="w-12 h-12 rounded-full bg-[#0c0c0c] flex items-center justify-center mr-1 transition-transform group-hover:scale-105">
                      <Shield className="w-5 h-5 text-white" />
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Right — contact info (constrained width) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="lg:w-1/3 text-center lg:text-right flex flex-col gap-4 items-center lg:items-end pointer-events-auto"
            >
              <div>
                <a href="mailto:info@echo.systems" className="text-lg md:text-xl font-semibold text-white/90 hover:text-white transition-colors tracking-tight block">
                  info@echo.systems
                </a>
              </div>
              
              <div className="flex flex-col items-center lg:items-end gap-1">
                <div className="w-8 border-t border-white/10 mb-2" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">{t('inquiries')}</span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Footer bar */}
        <div className="mt-auto relative z-20 w-full border-t border-white/5 pointer-events-auto">
          <div className="max-w-[85rem] mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-[11px] text-white/30 font-medium">
              <span>©2026 ECHO SYSTEMS SP. Z O.O.</span>
              <span className="hidden md:inline text-white/10">·</span>
              <span className="hidden md:inline">KRS 0000991436</span>
              <span className="hidden md:inline text-white/10">·</span>
              <span className="hidden md:inline">NIP 5242950185</span>
            </div>
            <div className="flex items-center gap-6 text-[11px] text-white/30 font-medium">
              <span>ul. Rejtana 6/1, 87-100 Toruń, Polska</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};


export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const { scrollY: appScrollY } = useScroll();

  useEffect(() => {
    const handleOpen = () => setShowContact(true);
    window.addEventListener('openContact', handleOpen);
    return () => window.removeEventListener('openContact', handleOpen);
  }, []);

  // Lock body scroll when contact popup is open
  useEffect(() => {
    if (showContact) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showContact]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    // Initialize Lenis for global smooth scroll inertia
    const lenis = new Lenis({
      duration: 2.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [isLoading]);

  const { scrollYProgress: globalScroll } = useScroll();
  const bgY = useTransform(globalScroll, [0, 1], ["-10%", "10%"]);

  return (
    <div className="relative min-h-screen bg-[#0c0c0c] text-white font-sans flex flex-col">
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[999] bg-[#0c0c0c] flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, ease: "linear", repeat: Infinity }}
              className="mb-8 opacity-80"
            >
              <LogoMark className="w-12 h-12 text-white" />
            </motion.div>
            <motion.div 
              className="h-px bg-white/20 w-48 overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: "circInOut" }}
            >
              <motion.div 
                className="h-full bg-white/80 w-full"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1, ease: "linear", repeat: Infinity }}
              />
            </motion.div>
            <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40 mt-6">
              Initializing Core Systems
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="noise-bg z-10 pointer-events-none mix-blend-overlay opacity-30" style={{ willChange: 'transform', contain: 'strict' }}></div>
      
      {/* Global Background ColorBends */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ y: bgY, scale: 1.2, willChange: 'transform', contain: 'layout paint' }}
      >
        <div className="w-full h-full opacity-60 mix-blend-screen">
          <ColorBends
            colors={["#3d81e3", "#1e3a66", "#ffffff"]}
            rotation={23}
            speed={0.15}
            scale={1.7}
            frequency={1}
            warpStrength={1}
            mouseInfluence={0.65}
            noise={0.1}
            parallax={0.15}
            iterations={1}
            intensity={1.2}
            bandWidth={8}
            transparent={true}
            autoRotate={0.3}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/90 via-[#0c0c0c]/40 to-[#0c0c0c]/95 pointer-events-none"></div>
      </motion.div>

      <div className="fixed left-[max(0px,calc(50%-40rem))] inset-y-0 w-px bg-white/5 pointer-events-none z-0 hidden lg:block border-r border-dashed border-white/10"></div>
      <div className="fixed right-[max(0px,calc(50%-40rem))] inset-y-0 w-px bg-white/5 pointer-events-none z-0 hidden lg:block border-l border-dashed border-white/10"></div>

      <TopNav />
      {/* Top Gradient — opaque gradient, no backdrop-filter needed on a dark page */}
      <div className="fixed top-0 inset-x-0 h-[40vh] bg-gradient-to-b from-[#0c0c0c] via-[#0c0c0c]/80 to-transparent pointer-events-none z-40 hidden md:block" style={{ willChange: 'transform' }}></div>

      <div className="relative z-10 flex flex-col w-full max-w-[100vw]">
         
         <main className="w-full">
           <Hero />
           <SystemViewer />
           <MaterialSeries />
           <Validation />
           <DeploymentCTA onOpenContact={() => setShowContact(true)} showContact={showContact} />
         </main>
      </div>

      {/* ---- Contact Form Modal — Root Level (escapes all masks/clips) ---- */}
      <AnimatePresence>
        {showContact && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowContact(false)}
              className="fixed inset-0 z-[9998] pointer-events-auto bg-gradient-to-t from-black/90 via-black/40 to-transparent cursor-pointer"
              style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', maskImage: 'linear-gradient(to top, black 0%, transparent 80%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 80%)' }}
            />
            <motion.div
              initial={{ y: "120%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "120%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="fixed bottom-4 md:bottom-8 left-4 right-4 md:left-8 md:right-8 z-[9999] pointer-events-none max-w-[85rem] mx-auto"
            >
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] px-6 md:px-10 py-8 md:py-10 border border-white/20 pointer-events-auto">
                <button onClick={() => setShowContact(false)} className="absolute -top-4 -right-4 md:-top-5 md:-right-5 z-[100] w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0c0c0c] text-white flex items-center justify-center shadow-2xl hover:bg-[#1a1a1a] transition-colors border border-white/10 hover:scale-105 cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 1L13 13M1 13L13 1"/></svg>
                </button>
                <ContactForm onClose={() => setShowContact(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

