/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
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

const translations: Record<string, Record<string, string>> = {
  en: {
    sys: "Systems", eng: "Engineering", abt: "About Us",
    hero_title1: "CIVILIAN DEFENSE.", hero_title2: "REDEFINED.",
    hero_desc: "Next-generation modular bunker systems designed in Poland and Ukraine. Battle-tested in extreme high-risk environments. 100% scalable for public and private deployment.",
    deploy: "Deploy a System", explore: "Explore Tech Specs", quote: "Get a Quote", secure: "SECURE",
    info_sys: "Information & Systems", corp_over: "Corporate Overview", sys_det: "System Details",
    air_qual: "Air Quality & Filtration", shock: "Shockwave Resistance", struct: "Structural Displacement",
    mfg_comp: "Manufacturing Compliance", sec_class: "Security Classification",
    global_stds: "Global Standards", cert_det: "Certification Details",
    lets_discuss: "Let's Discuss", sys_impact: "System Impact Test 2026",
    learn_more: "Learn More", vid_t1: "Manufacturing facilities in Poland", vid_t2: "(EU production standards)", vid_t3: "and Ukraine", vid_t4: "(Advanced combat engineering and R&D).", vid_desc: "Tested in real-world high-risk conditions. Validated by technical impact reports and ISO compliance audits.",
    step_a1_s: "Public & Bus Stops", step_a1_d: "Designed for high-traffic urban areas, providing immediate shelter against blast waves and shrapnel.", step_a2_s: "Residential", step_a2_d: "Fully functional protected living space. Integrated kitchen zone, sleeping quarters, and utility modules.", step_a3_s: "Heavy Industrial", step_a3_d: "B45/B60 High-Strength Concrete. Designed for extreme loads and direct hits. Compliant with European safety standards.",
    class_a_l4: "Highest grade structure, capable of surviving direct kinetic impact and extreme continuous shockwaves.", class_a_l3: "Standard bunker configuration, suitable for underground installation in high-risk zones.", class_a_l2: "Residential scale module, provides essential protection against fallout and pressure.", class_a_s1: "Maximum protection. 48+ hours stay duration. Fully hermetic with sleep quarters. 300 kN/m² blast resistance and 1500x radiation shielding.", class_a_u1: "Basic protection against shrapnel and building collapse. Short stay (<24h). 10 kN/m² blast resistance.", class_a_u2: "Supplemental earth shielding. Medium stay without active exclusion zones. 60 kN/m² blast resistance and 100x radiation shielding.",
    step_b1_s: "MDS Underground", step_b1_d: "Expansive multi-chamber underground bases. Secure, modular expansion possibilities to support large tactical teams.", step_b2_s: "MDS On Ground", step_b2_d: "Rapid-deployment surface bunkers for industrial hubs and estates. Immediate shrapnel and secondary blast protection.", step_b3_s: "Mobile Solution", step_b3_d: "Trailer-mounted or containerized armor living modules. Capable of being relocated in less than 24 hours.",
    class_b_i: "Large scale deployment for factories or critical infrastructure. Connects multiple modules.", class_b_p: "Compact footprint for fast installation under private residential properties.", class_b_l3: "Extended stay modular setup with optional HVAC add-ons. 150 kN/m² deflection rating.", class_b_l2: "Standard deployment for industrial defense. Medium duration viability. 80 kN/m² resistance.", class_b_l1: "Quick-deploy surface splinter protection. Minimal groundwork required.",
    step_c1_s: "Military Ops", step_c1_d: "Hardened pipe solutions for front-line deployment. Self-sustaining with auxiliary ops integration, EMP shielding, and advanced sensory arrays.", step_c2_s: "Civil / Public Support", step_c2_d: "Engineered specifically for dense urban integration. The curved geometry naturally deflects overpressure waves, providing maximum survivability.", class_c_s: "Bus stop and public transport shelter integration.", class_c_g: "Underground walkway or tunnel reinforcement.",
    req: "Your Requirements", req_desc: "Whether you have a specific operational challenge or want to explore what ECHO Systems can deliver, our team is ready to engage.",
    about_name: "ECHO Systems", about_short: "About Us", about_desc: "ECHO Systems (ECHO SYSTEMS Sp. z o.o.) is a Polish technology company headquartered in Toruń, specialising in the development of advanced autonomous, wireless, and robotic systems for professional and defence applications.\n\nFounded in 2022 and registered in Poland, we combine deep engineering expertise with a mission to deliver modular, reliable, and mission-ready solutions to clients who operate where failure is not an option.",
    conc_name: "Reinforced Concrete Series", conc_short: "Concrete Modules", conc_mat: "B45/B60 High-Strength Concrete", conc_desc: "Heavy-duty protection, long-term survival capabilities with integrated kitchen/sleeping zones, and active seismic stability. Full CBRN Hermetic Sealing.", conc_def: "Full Spectrum",
    steel_name: "Steel Modular Series", steel_short: "Steel Systems", steel_mat: "Alloy Steel with Tactical Anti-Corrosion Coating", steel_desc: "Focus on Speed and Mobility. Interlocking modular design allowing 48-72 hour assembly. Highly scalable for private and industrial use.", steel_def: "Ballistic",
    pipe_name: "Echo Pipe", pipe_short: "Cylindrical Systems", pipe_mat: "Aerodynamic Blast-Deflection Alloy", pipe_desc: "Designed for urban public infrastructure, bus stops, and public galleries. Aerodynamic geometry for blast-wave deflection and superior debris impact resistance.", pipe_def: "Deflection",
    series_a_title: "Heavy-Duty Reinforced Solutions", series_a_f1: "Airlock System", series_a_d1: "Dual-door decontamination entry", series_a_f2: "Hermetic Seal", series_a_d2: "CBRN pressure isolation", series_a_f3: "Life Support", series_a_d3: "Air scrubbing and water reserves",
    series_b_title: "Rapid Deployment Steel", series_b_f1: "Modular Locks", series_b_d1: "Fast-clip structural joining", series_b_f2: "Anti-Corrosion", series_b_d2: "Multi-layer subterranean coating", series_b_f3: "Mobility", series_b_d3: "Standard container transport logic",
    series_c_title: "Urban Deflection Pipe", series_c_f1: "Curved Deflection", series_c_d1: "Redirects shockwave energy", series_c_f2: "Public Utility", series_c_d2: "Integrates with city transit", series_c_f3: "Quick Access", series_c_d3: "Wide entry points for masses",
    eu_cert: "EU-Certified Protection", legal_entity: "Legal Entity", address: "Address", inquiries: "For Inquiries", contact: "Contact", form_name: "Name", form_email: "Email", form_org: "Organisation", form_msg: "Message",
    spec_cap: "Capacity", spec_rat: "Rating", spec_mass: "Mass", spec_hvac: "HVAC", spec_dur: "Duration", spec_depth: "Depth", spec_walls: "Walls", spec_blast: "Blast Res",
    spec_asm: "Assembly", spec_core: "Core", spec_arch: "Arch", spec_defl: "Deflection", spec_mob: "Mobility", spec_res: "Resilience", spec_pow: "Power", spec_fire: "Fire Rate",
    spec_dim: "Dimension", spec_owall: "Outer Wall", spec_icore: "Inner Core",
    val_p2050: "20-50 People", val_u1u2: "U1-U2 Surface", val_t45: "~45 Tons", val_pass: "Passive",
    val_p412: "4-12 People", val_h48: "48+ Hours", val_d48: "4m-8m Avg", val_act: "Active CBRN",
    val_t100: "100+ Tons", val_s3: "S3 Undrgrnd", val_w600: "600mm Wall", val_b300: "300 kN/m²",
    val_w12: "1-2 Weeks", val_t15: "~15 Tons", val_c30: "≥ 30mm Alloy", val_ilock: "Interlocking",
    val_h4872: "48-72 Hrs", val_d150: "150 kN/m²", val_p515: "5-15 People", val_dmode: "Dual Mode",
    val_mhigh: "High (ISO Box)", val_t10: "< 10 Tons", val_sarm: "Spaced Armor", val_l1: "L1 Rapid",
    val_r60: "60 kN/m²", val_sol: "Solar+Gen", val_s1025: "10-25 Squad", val_rei120: "REI 120",
    val_dim: "7.3 x 2.8m", val_t90: "~90 Tons", val_w380: "380mm", val_m4: "4mm Metal",
    feat_a1_t: "Structural Integrity", feat_a1_d: "Highest grade structure capable of surviving kinetic impact.",
    feat_a2_t: "Living Ecology", feat_a2_d: "Fully functional protected living space. Integrated kitchen zone, quarters, and utility modules. Independent HVAC.",
    feat_a3_t: "Defense Engineering", feat_a3_d: "Seismic-resistant base design. Hermetic CBRN filtration systems. Verified by impact reports.",
    feat_b1_t: "Material Science", feat_b1_d: "High-grade alloy steel with tactical anti-corrosion coating. Ballistic-grade plating for maximum kinetic energy absorption.",
    feat_b2_t: "Rapid Deployment", feat_b2_d: "Modular interlocking technology. Precision manufacturing allows assembly within 48-72 hours.",
    feat_b3_t: "Versatility", feat_b3_d: "Scalable architecture. Ideal for tactical headquarters, industrial hub protection, or private estate security.",
    feat_c1_t: "Geometry of Safety", feat_c1_d: "Echo Pipe geometry optimized for blast-wave deflection and pressure distribution. Withstands secondary debris.",
    feat_c2_t: "Public Integration", feat_c2_d: "Dual-purpose urban infrastructure. Designed for bus stations, kiosks, and pavilions. Modern aesthetic.",
    feat_c3_t: "Smart Connectivity", feat_c3_d: "Integrated communication modules, armored sensors, and automated emergency lighting.",
    class_c_u3_d: "Up to 60 kN/m² resistance, REI 120 fire rating. Includes gravitational or mechanical air filtration and 100x radiation reduction.",
    class_c_u12_d: "Up to 10 kN/m² resistance, REI 60 fire rating. Passive ventilation and basic debris management.",
    class_c_aux_d: "Equipped with solar autonomy, integrated payment/vending systems for dual-use city infrastructure."

  },
  pl: {
    sys: "Systemy", eng: "Inżynieria", abt: "O nas",
    hero_title1: "OCHRONA LUDNOŚCI.", hero_title2: "ZDEFINIOWANA NA NOWO.",
    hero_desc: "Modułowe systemy schronów nowej generacji zaprojektowane w Polsce i Ukrainie. Przetestowane w ekstremalnych środowiskach wysokiego ryzyka. W 100% skalowalne.",
    deploy: "Wdróż system", explore: "Specyfikacje", quote: "Wyceń projekt", secure: "BEZPIECZNY",
    info_sys: "Informacje i Systemy", corp_over: "Przegląd Firmy", sys_det: "Szczegóły Systemu",
    air_qual: "Jakość i Filtracja Powietrza", shock: "Odporność na Falę Uderzeniową", struct: "Przemieszczenie Konstrukcji",
    mfg_comp: "Zgodność Produkcyjna", sec_class: "Klasyfikacja Bezpieczeństwa",
    global_stds: "Globalne Standardy", cert_det: "Szczegóły Certyfikacji",
    lets_discuss: "Porozmawiajmy", sys_impact: "Test Uderzeniowy 2026",
    learn_more: "Dowiedz się więcej", vid_t1: "Zakłady produkcyjne w Polsce", vid_t2: "(Standardy UE)", vid_t3: "i na Ukrainie", vid_t4: "(Zaawansowana inżynieria bojowa i B&R).", vid_desc: "Testowane w rzeczywistych warunkach wysokiego ryzyka. Potwierdzone raportami i audytami ISO.",
    step_a1_s: "Przystanki Publiczne", step_a1_d: "Zaprojektowane dla obszarów miejskich o dużym natężeniu ruchu, zapewniają natychmiastowe schronienie.", step_a2_s: "Mieszkalne", step_a2_d: "W pełni funkcjonalna chroniona przestrzeń życiowa. Zintegrowana kuchnia, strefa sypialna i moduły użytkowe.", step_a3_s: "Ciężki Przemysł", step_a3_d: "Beton o wysokiej wytrzymałości B45/B60. Przeznaczone na ekstremalne obciążenia i bezpośrednie trafienia.",
    class_a_l4: "Struktura najwyższej klasy, zdolna przetrwać bezpośrednie uderzenie kinetyczne.", class_a_l3: "Standardowa konfiguracja bunkra, odpowiednia do instalacji podziemnych w strefach wysokiego ryzyka.", class_a_l2: "Moduł skali mieszkalnej, zapewnia podstawową ochronę przed opadem i ciśnieniem.", class_a_s1: "Maksymalna ochrona. Ponad 48h pobytu. W pełni hermetyczne z sypialniami. Odporność 300 kN/m².", class_a_u1: "Podstawowa ochrona przed odłamkami i zawaleniem budynków. Krótki pobyt (<24h). Odporność 10 kN/m².", class_a_u2: "Dodatkowa osłona z ziemi. Średni pobyt bez aktywnych stref wykluczenia. Odporność 60 kN/m².",
    step_b1_s: "MDS Podziemny", step_b1_d: "Rozległe wielokomorowe bazy podziemne. Bezpieczne i modułowe rozszerzenia.", step_b2_s: "MDS Naziemny", step_b2_d: "Bunkry powierzchniowe szybkiego wdrażania dla węzłów przemysłowych. Natychmiastowa ochrona przed odłamkami.", step_b3_s: "Rozwiązanie Mobilne", step_b3_d: "Opancerzone moduły mieszkalne na przyczepach lub w kontenerach. Możliwość relokacji w 24h.",
    class_b_i: "Wdrożenie na dużą skalę dla fabryk i infrastruktury krytycznej. Łączy wiele modułów.", class_b_p: "Kompaktowa budowa do szybkiej instalacji pod prywatnymi nieruchomościami.", class_b_l3: "Przedłużony pobyt z modułowymi dodatkami HVAC. Odporność 150 kN/m².", class_b_l2: "Standardowe wdrożenie do obrony przemysłowej. Odporność 80 kN/m².", class_b_l1: "Powierzchniowa osłona przed odłamkami szybkiego wdrożenia. Minimalne prace ziemne.",
    step_c1_s: "Operacje Wojskowe", step_c1_d: "Wzmocnione rury do wdrażania na linii frontu. Samowystarczalne z integracją operacji pomocniczych.", step_c2_s: "Wsparcie Cywilne / Publiczne", step_c2_d: "Zaprojektowane do integracji w gęstej zabudowie miejskiej. Zakrzywiona geometria naturalnie odchyla fale ciśnienia.", class_c_s: "Integracja z przystankami i transportem publicznym.", class_c_g: "Wzmocnienie przejść podziemnych i tuneli.",
    req: "O Twoich Wymaganiach", req_desc: "Niezależnie od tego, czy masz konkretne wyzwanie operacyjne, czy chcesz poznać możliwości ECHO Systems, nasz zespół jest gotowy do działania.",
    about_name: "ECHO Systems", about_short: "O nas", about_desc: "ECHO Systems (ECHO SYSTEMS Sp. z o.o.) to polska firma technologiczna z siedzibą w Toruniu, specjalizująca się w rozwoju zaawansowanych systemów do zastosowań profesjonalnych i obronnych.\n\nZałożona w 2022 roku łączymy głęboką wiedzę inżynieryjną z misją dostarczania niezawodnych rozwiązań dla klientów.",
    conc_name: "Seria Żelbetowa", conc_short: "Moduły Betonowe", conc_mat: "Beton o Wysokiej Wytrzymałości B45/B60", conc_desc: "Wzmocniona ochrona, zdolność do długotrwałego przetrwania ze strefą sypialną oraz aktywna stabilność sejsmiczna. Pełne uszczelnienie CBRN.", conc_def: "Pełne Spektrum",
    steel_name: "Seria Stalowa Modułowa", steel_short: "Systemy Stalowe", steel_mat: "Stal Stopowa z Powłoką Antykorozyjną", steel_desc: "Skupienie na szybkości i mobilności. Zazębiająca się konstrukcja modułowa pozwalająca na montaż w 48-72 h. Wysoce skalowalna.", steel_def: "Balistyczna",
    pipe_name: "Echo Pipe", pipe_short: "Systemy Cylindryczne", pipe_mat: "Aerodynamiczny Stop Odbijający", pipe_desc: "Zaprojektowane dla miejskiej infrastruktury publicznej i przystanków. Aerodynamiczna geometria odchylająca falę uderzeniową.", pipe_def: "Odbicie",
    series_a_title: "Wzmocnione Rozwiązania", series_a_f1: "System Śluzy", series_a_d1: "Wejście dwudrzwiowe", series_a_f2: "Uszczelnienie", series_a_d2: "Izolacja ciśnieniowa CBRN", series_a_f3: "Podtrzymanie Życia", series_a_d3: "Filtry powietrza i wody",
    series_b_title: "Stal Szybkiego Wdrażania", series_b_f1: "Zamki Modułowe", series_b_d1: "Szybkie łączenie konstrukcji", series_b_f2: "Antykorozyjność", series_b_d2: "Wielowarstwowa powłoka", series_b_f3: "Mobilność", series_b_d3: "Standardowy transport",
    series_c_title: "Rura Odbijająca", series_c_f1: "Zakrzywione Odbicie", series_c_d1: "Przekierowuje energię fali", series_c_f2: "Użyteczność Pub.", series_c_d2: "Integracja z miastem", series_c_f3: "Szybki Dostęp", series_c_d3: "Szerokie wejścia dla tłumów",
    eu_cert: "Ochrona certyfikowana w UE", legal_entity: "Osobowość Prawna", address: "Adres", inquiries: "Dla Zapytań", contact: "Kontakt", form_name: "Imię i Nazwisko", form_email: "Email", form_org: "Organizacja", form_msg: "Wiadomość",
    spec_cap: "Pojemność", spec_rat: "Klasa", spec_mass: "Masa", spec_hvac: "HVAC", spec_dur: "Czas", spec_depth: "Głębokość", spec_walls: "Ściany", spec_blast: "Odporność",
    spec_asm: "Montaż", spec_core: "Rdzeń", spec_arch: "Struktura", spec_defl: "Ugięcie", spec_mob: "Mobilność", spec_res: "Wytrzymałość", spec_pow: "Zasilanie", spec_fire: "Ognioodporność",
    spec_dim: "Wymiary", spec_owall: "Ściana Zew.", spec_icore: "Rdzeń Wew.",
    val_p2050: "20-50 Osób", val_u1u2: "U1-U2 Powierzchnia", val_t45: "~45 Ton", val_pass: "Pasywne",
    val_p412: "4-12 Osób", val_h48: "48+ Godzin", val_d48: "4m-8m Średnio", val_act: "Aktywne CBRN",
    val_t100: "100+ Ton", val_s3: "S3 Podziemie", val_w600: "600mm Ściana", val_b300: "300 kN/m²",
    val_w12: "1-2 Tygodnie", val_t15: "~15 Ton", val_c30: "≥ 30mm Stop", val_ilock: "Zazębiająca",
    val_h4872: "48-72 Godzin", val_d150: "150 kN/m²", val_p515: "5-15 Osób", val_dmode: "Podwójny Tryb",
    val_mhigh: "Wysoka (ISO)", val_t10: "< 10 Ton", val_sarm: "Pancerz z Odstępem", val_l1: "L1 Szybka",
    val_r60: "60 kN/m²", val_sol: "Solar+Gen", val_s1025: "10-25 Oddział", val_rei120: "REI 120",
    val_dim: "7.3 x 2.8m", val_t90: "~90 Ton", val_w380: "380mm", val_m4: "4mm Metal",
    feat_a1_t: "Integracja Strukturalna", feat_a1_d: "Konstrukcja najwyższej klasy zdolna przetrwać bezpośrednie trafienie.",
    feat_a2_t: "Ekologia Życia", feat_a2_d: "W pełni funkcjonalna chroniona przestrzeń. Zintegrowana kuchnia i sypialnie. Niezależny HVAC.",
    feat_a3_t: "Inżynieria Obronna", feat_a3_d: "Konstrukcja odporna na wstrząsy sejsmiczne. Hermetyczne systemy filtracji CBRN.",
    feat_b1_t: "Inżynieria Materiałowa", feat_b1_d: "Wysokiej klasy stal stopowa z powłoką antykorozyjną. Płyty balistyczne.",
    feat_b2_t: "Szybkie Wdrażanie", feat_b2_d: "Zazębiająca się technologia modułowa. Montaż w 48-72 godziny.",
    feat_b3_t: "Wszechstronność", feat_b3_d: "Skalowalna architektura. Idealna do ochrony kwater wojskowych czy fabryk.",
    feat_c1_t: "Geometria Bezpieczeństwa", feat_c1_d: "Geometria Echo Pipe zoptymalizowana do odchylania fal wybuchowych.",
    feat_c2_t: "Integracja Publiczna", feat_c2_d: "Infrastruktura podwójnego przeznaczenia. Przystanki autobusowe, kioski.",
    feat_c3_t: "Inteligentna Łączność", feat_c3_d: "Zintegrowane moduły komunikacyjne i opancerzone czujniki.",
    class_c_u3_d: "Odporność do 60 kN/m², ognioodporność REI 120. Mechaniczna filtracja powietrza.",
    class_c_u12_d: "Odporność do 10 kN/m², ognioodporność REI 60. Pasywna wentylacja.",
    class_c_aux_d: "Autonomia solarna, zintegrowane systemy vendingowe do infrastruktury miejskiej."

  },
  uk: {
    sys: "Системи", eng: "Інженерія", abt: "Про нас",
    hero_title1: "ЦИВІЛЬНИЙ ЗАХИСТ.", hero_title2: "НОВИЙ СТАНДАРТ.",
    hero_desc: "Модульні укриття нового покоління, розроблені в Польщі та Україні. Протестовані в умовах екстремального ризику. 100% масштабованість для публічного та приватного використання.",
    deploy: "Розгорнути", explore: "Тех. Характеристики", quote: "Отримати ціну", secure: "БЕЗПЕЧНО",
    info_sys: "Інформація та Системи", corp_over: "Огляд Компанії", sys_det: "Деталі Системи",
    air_qual: "Якість та Фільтрація", shock: "Стійкість до Хвилі", struct: "Структурне Зміщення",
    mfg_comp: "Виробнича Відповідність", sec_class: "Класифікація Безпеки",
    global_stds: "Глобальні Стандарти", cert_det: "Деталі Сертифікації",
    lets_discuss: "Обговоримо", sys_impact: "Ударне Тестування 2026",
    learn_more: "Дізнатися більше", vid_t1: "Виробничі потужності в Польщі", vid_t2: "(стандарти ЄС)", vid_t3: "та Україні", vid_t4: "(Передові бойові розробки).", vid_desc: "Протестовано в реальних умовах високого ризику. Підтверджено звітами та аудитами ISO.",
    step_a1_s: "Громадські Зупинки", step_a1_d: "Розроблено для міських районів з інтенсивним рухом, забезпечує негайне укриття від вибухових хвиль.", step_a2_s: "Житлові", step_a2_d: "Повністю функціональний захищений житловий простір. Інтегрована кухня та спальні місця.", step_a3_s: "Важка Промисловість", step_a3_d: "Бетон високої міцності B45/B60. Розрахований на екстремальні навантаження та прямі попадання.",
    class_a_l4: "Конструкція найвищого класу, здатна витримати пряме кінетичне попадання.", class_a_l3: "Стандартна конфігурація бункера, придатна для підземного встановлення в зонах високого ризику.", class_a_l2: "Житловий модуль, забезпечує базовий захист від опадів та тиску.", class_a_s1: "Максимальний захист. Більше 48 годин перебування. Повністю герметичний зі спальнями.", class_a_u1: "Базовий захист від уламків та руйнування будівель. Коротке перебування (<24г).", class_a_u2: "Додаткове екранування ґрунтом. Середнє перебування. Стійкість 60 кН/м².",
    step_b1_s: "MDS Підземний", step_b1_d: "Широкі багатокамерні підземні бази. Безпечні модульні можливості розширення.", step_b2_s: "MDS Наземний", step_b2_d: "Наземні бункери швидкого розгортання для промислових центрів. Миттєвий захист від уламків.", step_b3_s: "Мобільне Рішення", step_b3_d: "Броньовані житлові модулі на причепах або в контейнерах. Можливість переміщення за 24г.",
    class_b_i: "Масштабне розгортання для заводів або критичної інфраструктури. З'єднує багато модулів.", class_b_p: "Компактний розмір для швидкого встановлення під приватними будинками.", class_b_l3: "Тривале перебування з модульними доповненнями HVAC. Стійкість 150 кН/м².", class_b_l2: "Стандартне розгортання для промислової оборони. Стійкість 80 кН/m².", class_b_l1: "Швидке розгортання для захисту від уламків. Мінімальні земляні роботи.",
    step_c1_s: "Військові Операції", step_c1_d: "Посилені труби для розміщення на передовій. Самодостатні з інтеграцією допоміжних систем.", step_c2_s: "Громадська Підтримка", step_c2_d: "Спеціально розроблено для інтеграції в щільну міську забудову. Геометрія відхиляє хвилі тиску.", class_c_s: "Інтеграція із зупинками громадського транспорту.", class_c_g: "Посилення підземних переходів та тунелів.",
    req: "Ваші Вимоги", req_desc: "Незалежно від того, чи є у вас конкретні оперативні завдання, чи ви хочете дізнатися, що може запропонувати ECHO Systems, наша команда готова до співпраці.",
    about_name: "ECHO Systems", about_short: "Про нас", about_desc: "ECHO Systems — польська технологічна компанія, що спеціалізується на розробці передових систем для професійного та оборонного застосування.\n\nМи поєднуємо глибокі інженерні знання з місією надавати надійні рішення клієнтам.",
    conc_name: "Залізобетонна Серія", conc_short: "Бетонні Модулі", conc_mat: "Бетон B45/B60", conc_desc: "Надійний захист, довгострокове виживання з кухнею/спальнею та активною сейсмічною стабільністю. Повна герметизація CBRN.", conc_def: "Повний Спектр",
    steel_name: "Сталева Модульна Серія", steel_short: "Сталеві Системи", steel_mat: "Сталь з антикорозійним покриттям", steel_desc: "Швидкість і мобільність. Модульна конструкція дозволяє зібрати укриття за 48-72 години. Висока масштабованість.", steel_def: "Балістичний",
    pipe_name: "Echo Pipe", pipe_short: "Циліндричні Системи", pipe_mat: "Аеродинамічний Сплав", pipe_desc: "Розроблено для міської інфраструктури та зупинок. Аеродинамічна геометрія для відхилення вибухової хвилі.", pipe_def: "Відхилення",
    series_a_title: "Надміцні Рішення", series_a_f1: "Система Шлюзів", series_a_d1: "Дводверний вхід", series_a_f2: "Герметичність", series_a_d2: "Ізоляція тиску CBRN", series_a_f3: "Підтримка Життя", series_a_d3: "Очищення повітря і води",
    series_b_title: "Сталь Швидкого Розгортання", series_b_f1: "Модульні Замки", series_b_d1: "Швидке з'єднання", series_b_f2: "Антикорозія", series_b_d2: "Багатошарове покриття", series_b_f3: "Мобільність", series_b_d3: "Стандартний транспорт",
    series_c_title: "Криволінійна Геометрія", series_c_f1: "Відхилення Хвилі", series_c_d1: "Перенаправляє енергію", series_c_f2: "Публічна Користь", series_c_d2: "Інтеграція з містом", series_c_f3: "Швидкий Доступ", series_c_d3: "Широкі входи для натовпу",
    eu_cert: "Сертифікований захист ЄС", legal_entity: "Юридична Особа", address: "Адреса", inquiries: "Для запитів", contact: "Контакти", form_name: "Ім'я", form_email: "Email", form_org: "Організація", form_msg: "Повідомлення",
    spec_cap: "Місткість", spec_rat: "Клас", spec_mass: "Маса", spec_hvac: "HVAC", spec_dur: "Тривалість", spec_depth: "Глибина", spec_walls: "Стіни", spec_blast: "Стійкість",
    spec_asm: "Збірка", spec_core: "Ядро", spec_arch: "Структура", spec_defl: "Відхилення", spec_mob: "Мобільність", spec_res: "Міцність", spec_pow: "Живлення", spec_fire: "Вогнестійкість",
    spec_dim: "Розміри", spec_owall: "Зовн. Стіна", spec_icore: "Внутр. Ядро",
    val_p2050: "20-50 Осіб", val_u1u2: "U1-U2 Поверхня", val_t45: "~45 Тонн", val_pass: "Пасивна",
    val_p412: "4-12 Осіб", val_h48: "48+ Годин", val_d48: "4m-8m Середня", val_act: "Активна CBRN",
    val_t100: "100+ Тонн", val_s3: "S3 Підземна", val_w600: "600мм Стіна", val_b300: "300 кН/м²",
    val_w12: "1-2 Тижні", val_t15: "~15 Тонн", val_c30: "≥ 30мм Сплав", val_ilock: "Блокова",
    val_h4872: "48-72 Годин", val_d150: "150 кН/м²", val_p515: "5-15 Осіб", val_dmode: "Два Режими",
    val_mhigh: "Висока (ISO)", val_t10: "< 10 Тонн", val_sarm: "Просторова Броня", val_l1: "L1 Швидка",
    val_r60: "60 кН/m²", val_sol: "Solar+Gen", val_s1025: "10-25 Загін", val_rei120: "REI 120",
    val_dim: "7.3 x 2.8m", val_t90: "~90 Тонн", val_w380: "380мм", val_m4: "4мм Метал",
    feat_a1_t: "Структурна Цілісність", feat_a1_d: "Конструкція найвищого класу, здатна витримати кінетичний удар.",
    feat_a2_t: "Екологія Життя", feat_a2_d: "Повністю функціональний захищений простір. Інтегрована кухня. Незалежний HVAC.",
    feat_a3_t: "Оборонна Інженерія", feat_a3_d: "Сейсмостійкий дизайн. Герметичні системи CBRN фільтрації.",
    feat_b1_t: "Матеріалознавство", feat_b1_d: "Високоякісна легована сталь з антикорозійним покриттям.",
    feat_b2_t: "Швидке Розгортання", feat_b2_d: "Модульна технологія. Точне виробництво дозволяє збірку за 48-72 години.",
    feat_b3_t: "Універсальність", feat_b3_d: "Масштабована архітектура. Ідеально для тактичних штабів або заводів.",
    feat_c1_t: "Геометрія Безпеки", feat_c1_d: "Геометрія труби оптимізована для відхилення вибухової хвилі.",
    feat_c2_t: "Громадська Інтеграція", feat_c2_d: "Міська інфраструктура подвійного призначення (зупинки, кіоски).",
    feat_c3_t: "Розумний Зв'язок", feat_c3_d: "Інтегровані модулі зв'язку та броньовані датчики.",
    class_c_u3_d: "Стійкість до 60 кН/м², вогнестійкість REI 120. Механічна фільтрація.",
    class_c_u12_d: "Стійкість до 10 кН/м², вогнестійкість REI 60. Пасивна вентиляція.",
    class_c_aux_d: "Сонячна автономія, інтегровані системи вендингу для міста."

  },
  nl: {
    sys: "Systemen", eng: "Engineering", abt: "Over Ons",
    hero_title1: "BURGERVERDEDIGING.", hero_title2: "HERDEFINIEERD.",
    hero_desc: "Modulaire bunkersystemen van de volgende generatie. Getest in extreme omstandigheden. 100% schaalbaar voor publiek en privaat gebruik.",
    deploy: "Systeem Inzetten", explore: "Bekijk Specificaties", quote: "Offerte Aanvragen", secure: "VEILIG",
    info_sys: "Informatie & Systemen", corp_over: "Bedrijfsoverzicht", sys_det: "Systeemdetails",
    air_qual: "Luchtkwaliteit & Filtratie", shock: "Schokgolf Weerstand", struct: "Structurele Verplaatsing",
    mfg_comp: "Productie Naleving", sec_class: "Veiligheidsclassificatie",
    global_stds: "Wereldwijde Normen", cert_det: "Certificeringsdetails",
    lets_discuss: "Laten we praten", sys_impact: "Systeem Impact Test 2026",
    learn_more: "Meer Informatie", vid_t1: "Productiefaciliteiten in Polen", vid_t2: "(EU normen)", vid_t3: "en Oekraïne", vid_t4: "(Geavanceerde gevechtstechniek en R&D).", vid_desc: "Getest in reële risicovolle omstandigheden. Gevalideerd door technische rapporten en ISO audits.",
    step_a1_s: "Openbaar & Bushaltes", step_a1_d: "Ontworpen voor drukke stedelijke gebieden en biedt onmiddellijke beschutting tegen schokgolven en schrapnel.", step_a2_s: "Residentieel", step_a2_d: "Volledig functionele beschermde leefruimte. Geïntegreerde keuken, slaapvertrekken en nutsmodules.", step_a3_s: "Zware Industrie", step_a3_d: "B45/B60 Hogesterktebeton. Ontworpen voor extreme belastingen en directe inslagen.",
    class_a_l4: "Constructie van de hoogste klasse, in staat om directe kinetische inslagen te overleven.", class_a_l3: "Standaard bunkerconfiguratie, geschikt voor ondergrondse installatie in hoogrisicozones.", class_a_l2: "Residentiële module, biedt essentiële bescherming tegen fall-out en druk.", class_a_s1: "Maximale bescherming. Meer dan 48 uur verblijf. Volledig hermetisch met slaapruimtes.", class_a_u1: "Basisbescherming tegen schrapnel en instortende gebouwen. Kort verblijf (<24u).", class_a_u2: "Extra aardschild. Middellang verblijf zonder actieve uitsluitingszones. 60 kN/m² weerstand.",
    step_b1_s: "MDS Ondergronds", step_b1_d: "Uitgebreide ondergrondse bases met meerdere kamers. Veilige, modulaire uitbreidingsmogelijkheden.", step_b2_s: "MDS Bovengronds", step_b2_d: "Bovengrondse bunkers voor snelle inzet in industriële gebieden. Onmiddellijke bescherming tegen schrapnel.", step_b3_s: "Mobiele Oplossing", step_b3_d: "Gepantserde leefmodules op aanhangers of in containers. Verplaatsbaar in minder dan 24 uur.",
    class_b_i: "Grootschalige inzet voor fabrieken of kritieke infrastructuur. Verbindt meerdere modules.", class_b_p: "Compact ontwerp voor snelle installatie onder particuliere woningen.", class_b_l3: "Langer verblijf met optionele HVAC add-ons. 150 kN/m² afbuigingsclassificatie.", class_b_l2: "Standaard inzet voor industriële defensie. Gemiddelde verblijfsduur. 80 kN/m² weerstand.", class_b_l1: "Snel inzetbare bovengrondse splinterbescherming. Minimaal grondwerk vereist.",
    step_c1_s: "Militaire Operaties", step_c1_d: "Versterkte buizen voor frontlinie inzet. Zelfvoorzienend met integratie van hulpsystemen.", step_c2_s: "Publieke Ondersteuning", step_c2_d: "Speciaal ontworpen voor dichte stedelijke integratie. De gebogen geometrie buigt drukgolven af.", class_c_s: "Integratie met bushaltes en openbaar vervoer.", class_c_g: "Versterking van voetgangerstunnels en gangen.",
    req: "Uw Vereisten", req_desc: "Of u nu een specifieke operationele uitdaging heeft of wilt ontdekken wat ECHO Systems kan leveren, ons team staat klaar om u te helpen.",
    about_name: "ECHO Systems", about_short: "Over Ons", about_desc: "ECHO Systems is een Pools technologiebedrijf gespecialiseerd in de ontwikkeling van geavanceerde systemen voor defensietoepassingen.\n\nOpgericht in 2022, combineren wij technische expertise met de missie om betrouwbare oplossingen te leveren.",
    conc_name: "Gewapend Beton Serie", conc_short: "Betonnen Modules", conc_mat: "B45/B60 Beton", conc_desc: "Zware bescherming, overlevingscapaciteiten met geïntegreerde zones en actieve seismische stabiliteit. Volledige CBRN afdichting.", conc_def: "Volledig Spectrum",
    steel_name: "Stalen Modulaire Serie", steel_short: "Stalen Systemen", steel_mat: "Gelegeerd staal met coating", steel_desc: "Focus op snelheid en mobiliteit. In elkaar grijpend ontwerp voor montage in 48-72 uur. Zeer schaalbaar.", steel_def: "Ballistisch",
    pipe_name: "Echo Pipe", pipe_short: "Cilindrische Systemen", pipe_mat: "Aerodynamische Legering", pipe_desc: "Ontworpen voor stedelijke infrastructuur. Aerodynamische geometrie voor afbuiging van schokgolven.", pipe_def: "Afbuiging",
    series_a_title: "Zware Oplossingen", series_a_f1: "Luchtsluis", series_a_d1: "Tweedeurs ingang", series_a_f2: "Hermetische Afdichting", series_a_d2: "CBRN drukisolatie", series_a_f3: "Levensondersteuning", series_a_d3: "Lucht- en waterreserves",
    series_b_title: "Snel inzetbaar Staal", series_b_f1: "Modulaire Sloten", series_b_d1: "Snelle structurele verbinding", series_b_f2: "Anti-Corrosie", series_b_d2: "Meerlaagse coating", series_b_f3: "Mobiliteit", series_b_d3: "Standaard transport",
    series_c_title: "Stedelijke Afbuigbuis", series_c_f1: "Gebogen Afbuiging", series_c_d1: "Verlegt schokgolfenergie", series_c_f2: "Openbaar Nut", series_c_d2: "Integreert met stadstransit", series_c_f3: "Snelle Toegang", series_c_d3: "Brede toegangspunten",
    eu_cert: "EU-Gecertificeerde Bescherming", legal_entity: "Juridische Entiteit", address: "Adres", inquiries: "Voor Aanvragen", contact: "Contact", form_name: "Naam", form_email: "E-mail", form_org: "Organisatie", form_msg: "Bericht",
    spec_cap: "Capaciteit", spec_rat: "Klasse", spec_mass: "Massa", spec_hvac: "HVAC", spec_dur: "Duur", spec_depth: "Diepte", spec_walls: "Muren", spec_blast: "Weerstand",
    spec_asm: "Montage", spec_core: "Kern", spec_arch: "Architectuur", spec_defl: "Afbuiging", spec_mob: "Mobiliteit", spec_res: "Veerkracht", spec_pow: "Stroom", spec_fire: "Brandklasse",
    spec_dim: "Afmetingen", spec_owall: "Buitenmuur", spec_icore: "Binnenkern",
    val_p2050: "20-50 Personen", val_u1u2: "U1-U2 Oppervlak", val_t45: "~45 Ton", val_pass: "Passief",
    val_p412: "4-12 Personen", val_h48: "48+ Uur", val_d48: "4m-8m Gemiddeld", val_act: "Actieve CBRN",
    val_t100: "100+ Ton", val_s3: "S3 Ondergronds", val_w600: "600mm Muur", val_b300: "300 kN/m²",
    val_w12: "1-2 Weken", val_t15: "~15 Ton", val_c30: "≥ 30mm Legering", val_ilock: "In elkaar grijpend",
    val_h4872: "48-72 Uur", val_d150: "150 kN/m²", val_p515: "5-15 Personen", val_dmode: "Dubbele Modus",
    val_mhigh: "Hoog (ISO Box)", val_t10: "< 10 Ton", val_sarm: "Gepantserde Ruimte", val_l1: "L1 Snel",
    val_r60: "60 kN/m²", val_sol: "Zon+Gen", val_s1025: "10-25 Team", val_rei120: "REI 120",
    val_dim: "7.3 x 2.8m", val_t90: "~90 Ton", val_w380: "380mm", val_m4: "4mm Metaal",
    feat_a1_t: "Structurele Integriteit", feat_a1_d: "Structuur van de hoogste klasse, bestand tegen kinetische impact.",
    feat_a2_t: "Leef Ecologie", feat_a2_d: "Volledig functionele beschermde ruimte. Geïntegreerde keuken en onafhankelijke HVAC.",
    feat_a3_t: "Defensie Engineering", feat_a3_d: "Seismisch-bestendig ontwerp. Hermetische CBRN filtratiesystemen.",
    feat_b1_t: "Materiaalkunde", feat_b1_d: "Hoogwaardig gelegeerd staal met anti-corrosie coating. Ballistische platen.",
    feat_b2_t: "Snelle Inzet", feat_b2_d: "Modulaire technologie. Assemblage binnen 48-72 uur.",
    feat_b3_t: "Veelzijdigheid", feat_b3_d: "Schaalbare architectuur. Ideaal voor hoofdkwartieren of industrie.",
    feat_c1_t: "Geometrie van Veiligheid", feat_c1_d: "Pijp geometrie geoptimaliseerd voor afbuiging van schokgolven.",
    feat_c2_t: "Publieke Integratie", feat_c2_d: "Infrastructuur voor dubbel gebruik. Bushaltes, kiosken.",
    feat_c3_t: "Slimme Connectiviteit", feat_c3_d: "Geïntegreerde communicatiemodules en gepantserde sensoren.",
    class_c_u3_d: "Tot 60 kN/m² weerstand, REI 120. Inclusief luchtfiltratie.",
    class_c_u12_d: "Tot 10 kN/m² weerstand, REI 60. Passieve ventilatie.",
    class_c_aux_d: "Voorzien van zonne-energie en geïntegreerde systemen voor steden."

  }
};

let activeLanguage = 'en';
const languageListeners: Set<() => void> = new Set();
export const setLanguage = (lang: string) => {
  activeLanguage = lang;
  languageListeners.forEach(l => l());
};
export const useLanguage = () => {
  const [lang, setLang] = useState(activeLanguage);
  useEffect(() => {
    const l = () => setLang(activeLanguage);
    languageListeners.add(l);
    return () => { languageListeners.delete(l); };
  }, []);
  return lang;
};

const t = (key: string) => {
  return translations[activeLanguage]?.[key] || translations['en'][key] || key;
};

const LanguageSwitcher = () => {
  const lang = useLanguage();
  const langs = ['en', 'pl', 'uk', 'nl'];
  return (
    <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full p-1 ml-2 shadow-lg backdrop-blur-md">
      {langs.map(l => (
        <button 
          key={l} 
          onClick={() => setLanguage(l)}
          className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${lang === l ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
        >
          {l}
        </button>
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
    <button onClick={handleClick} className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-xs px-6 py-2.5 transition-all hover:bg-white/90 active:scale-[0.98]">
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
        className="fixed top-4 left-0 right-0 z-[70] flex justify-center w-full px-4"
      >
        {/* FX Toggle — standalone floating bubble, anchored to viewport right edge */}
        <button
          onClick={toggleGlass}
          className={`hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-10 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all backdrop-blur-md border shadow-xl ${
            glassEnabled
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-black/40 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>{glassEnabled ? 'FX ON' : 'FX OFF'}</span>
        </button>
        {/* Wrapper gives the dropdown a positioned anchor */}
        <div className="w-full max-w-[65rem] relative">
          <GlassSurface borderRadius={9999} className="w-full rounded-full border border-white/10 hover:border-white/20 transition-all bg-[#0e1014]/40 shadow-2xl" contentClassName="flex items-center justify-between px-4 sm:px-6 py-3 w-full">
            <div className="flex items-center">
              <img
                src="/images/logo-main.svg"
                alt="ECHO SYSTEMS"
                className="h-10 w-auto object-contain brightness-0 invert"
                loading="eager"
              />
            </div>
            <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-[10px] lg:text-xs font-bold tracking-widest uppercase opacity-70">
              <button onClick={() => scrollTo('section-systems')} className="hover:text-white transition-colors">{t('eng')}</button>
              <button onClick={() => scrollTo('section-about')} className="hover:text-white transition-colors">{t('abt')}</button>
            </nav>
            <div className="flex items-center gap-2 lg:gap-3">
              <SystemButton label={t('quote')} onClick={() => { document.getElementById('contact-form')?.scrollIntoView({behavior: 'smooth'}); setMobileOpen(false); }} />
              <LanguageSwitcher />
              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors ml-1"
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
                      className="w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase text-white/70 hover:text-white hover:bg-white/5 transition-all"
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
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
                      {langs.map(l => (
                        <button
                          key={l}
                          onClick={() => setLanguage(l)}
                          className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${
                            lang === l ? 'bg-white text-black' : 'text-white/40 hover:text-white'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
      <button onClick={() => document.getElementById('section-A')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-3 rounded-full border border-white/10 hover:border-white/30 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white transition-all hover:bg-white/5">
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
  const [activeTab, setActiveTab] = useState(0);
  const lang = useLanguage();

  const systems = [
    {
      id: 'ABOUT-2026',
      name: t('about_name'),
      short: t('about_short'),
      isAbout: true,
      material: '',
      desc: t('about_desc'),
    },
    {
      id: 'ECM-B60-2026',
      name: t('conc_name'),
      short: t('conc_short'),
      targetId: 'A',
      image: "/images/sys-concrete.webp",
      material: t('conc_mat'),
      desc: t('conc_desc'),
      grade: 'L4/B-Grade',
      defense: t('conc_def'),
      air: 'CBRN Active',
    },
    {
      id: 'ESM-A1-2026',
      name: t('steel_name'),
      short: t('steel_short'),
      targetId: 'B',
      image: "/images/sys-steel.webp",
      material: t('steel_mat'),
      desc: t('steel_desc'),
      grade: 'L3/Rapid',
      defense: t('steel_def'),
      air: 'HEPA-14',
    },
    {
      id: 'EP-URB-2026',
      name: t('pipe_name'),
      short: t('pipe_short'),
      targetId: 'C',
      image: "/images/sys-pipes.webp",
      material: t('pipe_mat'),
      desc: t('pipe_desc'),
      grade: 'Urban',
      defense: t('pipe_def'),
      air: 'Passive/HEPA',
    }
  ];

  const activeSystem = systems[activeTab];

  const handleScrollToTarget = (e: React.MouseEvent) => {
    if (activeSystem.targetId) {
      e.stopPropagation();
      const el = document.getElementById(`section-${activeSystem.targetId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="section-systems" className="relative px-6 lg:px-[50px] pt-12 pb-24 w-full max-w-[70rem] mx-auto z-30 -mt-16 sm:-mt-20 lg:-mt-32 xl:-mt-48">
      <motion.div 
        initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <TiltCard intensity={8} distance={1000} onClick={handleScrollToTarget}>
          {/* Sidebar */}
          <aside className="md:col-span-4 border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col gap-1 z-10 bg-black/60" style={{ transform: "translateZ(10px)" }}>
            <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-4 ml-2">{t('info_sys')}</div>
            <div className="flex flex-col gap-2">
              {systems.map((sys, i) => (
                <div 
                  key={sys.id} 
                  onClick={(e) => { e.stopPropagation(); setActiveTab(i); }}
                  className={`flex items-center justify-between p-4 text-sm font-medium cursor-pointer rounded-xl border transition-all ${activeTab === i ? 'bg-white/10 border-white/20 text-white shadow-lg' : 'bg-transparent border-transparent opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                >
                  <span className="truncate mr-4">{sys.short}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === i ? 'opacity-100' : 'opacity-0 -translate-x-2'}`} />
                </div>
              ))}
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
                      <img
                        src={activeSystem.image}
                        alt={activeSystem.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-center"
                      />
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
              
              {!activeSystem.isAbout ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="liquid-glass p-6 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col justify-center">
                     <div className="text-3xl font-bold mb-1 tracking-tight">{activeSystem.grade}</div>
                     <div className="text-[10px] opacity-50 uppercase tracking-widest">{activeSystem.defense}</div>
                  </div>
                  <div className="liquid-glass p-6 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col justify-center">
                     <div className="text-3xl font-bold mb-1 tracking-tight flex items-center gap-2">{activeSystem.air}</div>
                     <div className="text-[10px] opacity-50 uppercase tracking-widest">{t('air_qual')}</div>
                  </div>
                </div>
              ) : (
                <div className="liquid-glass p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <div className="text-[10px] opacity-40 uppercase tracking-widest mb-4">{t('legal_entity')}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-mono text-white/80">
                    <div className="flex flex-col gap-1 border-b border-white/10 pb-3"><span className="text-white/40 uppercase text-[10px]">KRS</span><span>0000991436</span></div>
                    <div className="flex flex-col gap-1 border-b border-white/10 pb-3"><span className="text-white/40 uppercase text-[10px]">NIP</span><span>5242950185</span></div>
                    <div className="flex flex-col gap-1 border-b sm:border-b-0 border-white/10 pb-3 sm:pb-0"><span className="text-white/40 uppercase text-[10px]">REGON</span><span>523080793</span></div>
                    <div className="flex flex-col gap-1"><span className="text-white/40 uppercase text-[10px]">{t('address')}</span><span>ul. Rejtana 6/1<br/>87-100 Toruń</span></div>
                  </div>
                </div>
              )}
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
              className={`flex-1 py-3 text-xs font-bold transition-all relative z-10 ${active === i ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
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
    idx === 0 ? "w-full lg:w-5/12 h-[260px] sm:h-[320px] md:h-[380px] lg:h-[700px] rounded-[2rem]" :
    idx === 1 ? "w-full lg:w-7/12 h-[240px] sm:h-[300px] md:h-[360px] lg:h-[500px] rounded-[3rem]" :
    "w-full lg:w-1/2 h-[240px] sm:h-[300px] md:h-[360px] lg:h-auto lg:min-h-[600px] lg:aspect-video rounded-[1.5rem]";

  return (
    <div id={`section-${section.id}`} className="w-full relative border-t border-white/5 scroll-mt-20">
      {/* Sticky section */}
      <div ref={containerRef} className="relative w-full" style={{ height: `${section.steps.length * 100}vh` }}>
        <div className="sticky top-0 w-full h-[100dvh] flex flex-col justify-center overflow-hidden">
          <div className="max-w-[70rem] mx-auto w-full px-6 lg:px-[50px] relative z-10 py-4 md:py-8 lg:py-12">
            
            {/* Header & Image Layout */}
            <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-4 md:gap-6 lg:gap-20 items-center`}>
              
              {/* TEXT SIDE */}
              <div className="flex-1 w-full flex flex-col items-start z-10">
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-4 lg:mb-8 uppercase tracking-widest text-[10px] font-bold shadow-lg bg-black/40 backdrop-blur-md"
                  style={{ borderColor: `${section.color}40`, color: section.color }}
                >
                  Series {section.id} &mdash; {section.tagline}
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[4.5rem] xl:text-[5rem] font-black tracking-tighter uppercase leading-[1.05] mb-4 lg:mb-6">
                  {section.title}
                </h2>
                
                <div className="min-h-[200px] h-auto lg:h-[340px] relative w-full mb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="relative lg:absolute lg:inset-0 flex flex-col"
                    >
                      <h3 className="text-2xl font-bold mb-3" style={{ color: section.color }}>
                        {section.steps[activeStep].subtitle}
                      </h3>
                      <p className="text-lg text-white/60 font-medium leading-relaxed max-w-xl mb-6">
                        {section.steps[activeStep].desc}
                      </p>
                      
                      {/* Technical Specs Grid per step */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 w-full">
                        {section.steps[activeStep].specs.map((spec: any, i: number) => (
                          <GlassSurface key={i} borderRadius={12} className="bg-[#ffffff0a] border border-white/20 relative group shadow-lg w-full h-full" contentClassName="flex flex-col p-2.5 sm:p-3 justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="opacity-40 mb-1.5 sm:mb-2 relative z-10" style={{ color: section.color }}>{spec.icon}</div>
                            <div className="text-[9px] sm:text-[10px] uppercase tracking-wider md:tracking-widest font-bold opacity-50 mb-0.5 relative z-10 line-clamp-1">{spec.label}</div>
                            <div className="text-[11px] sm:text-sm font-bold tracking-tight relative z-10 leading-tight">{spec.value}</div>
                          </GlassSurface>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-4 mt-3 lg:mt-6">
                  <button
                    onClick={() => {
                      const nextIds = ['section-A-features', 'section-B-features', 'section-about'];
                      document.getElementById(nextIds[idx] ?? 'section-about')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black hover:bg-white/90 transition-all text-xs font-bold uppercase tracking-widest"
                  >
                    {t('learn_more')} <ChevronRight className="w-4 h-4" />
                  </button>
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

                <div className="absolute top-6 right-6 p-4 rounded-2xl bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 z-20 shadow-2xl">
                  {section.icon}
                </div>
              </TiltCard>
            </div>

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
              initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
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
          image: "/images/series-a-1.webp",
          specs: [
            { icon: <Users className="w-4 h-4"/>, label: t('spec_cap'), value: t('val_p2050') },
            { icon: <ShieldAlert className="w-4 h-4"/>, label: t('spec_rat'), value: t('val_u1u2') },
            { icon: <Weight className="w-4 h-4"/>, label: t('spec_mass'), value: t('val_t45') },
            { icon: <Thermometer className="w-4 h-4"/>, label: t('spec_hvac'), value: t('val_pass') },
          ]
        },
        {
          subtitle: t('step_a2_s'),
          desc: t('step_a2_d'),
          image: "/images/series-a-2.webp",
          specs: [
            { icon: <Users className="w-4 h-4"/>, label: t('spec_cap'), value: t('val_p412') },
            { icon: <Clock className="w-4 h-4"/>, label: t('spec_dur'), value: t('val_h48') },
            { icon: <Layers className="w-4 h-4"/>, label: t('spec_depth'), value: t('val_d48') },
            { icon: <Thermometer className="w-4 h-4"/>, label: t('spec_hvac'), value: t('val_act') },
          ]
        },
        {
          subtitle: t('step_a3_s'),
          desc: t('step_a3_d'),
          image: "/images/series-a-3.webp",
          specs: [
            { icon: <Weight className="w-4 h-4"/>, label: t('spec_mass'), value: t('val_t100') },
            { icon: <ShieldAlert className="w-4 h-4"/>, label: t('spec_rat'), value: t('val_s3') },
            { icon: <Building className="w-4 h-4"/>, label: t('spec_walls'), value: t('val_w600') },
            { icon: <Crosshair className="w-4 h-4"/>, label: t('spec_blast'), value: t('val_b300') },
          ]
        }
      ],
      features: [
        { title: t('feat_a1_t'), desc: t('feat_a1_d') },
        { title: t('feat_a2_t'), desc: t('feat_a2_d') },
        { title: t('feat_a3_t'), desc: t('feat_a3_d') }
      ],
      classes: [
        { id: "S1-S3", name: "S1-S3 Underground", desc: t('class_a_s1') },
        { id: "U1", name: "U1 Surface", desc: t('class_a_u1') },
        { id: "U2-U3", name: "U2/U3 Surface+", desc: t('class_a_u2') }
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
            { icon: <Clock className="w-4 h-4"/>, label: t('spec_asm'), value: t('val_w12') },
            { icon: <Weight className="w-4 h-4"/>, label: t('spec_mass'), value: t('val_t15') },
            { icon: <ShieldAlert className="w-4 h-4"/>, label: t('spec_core'), value: t('val_c30') },
            { icon: <Layers className="w-4 h-4"/>, label: t('spec_arch'), value: t('val_ilock') }
          ]
        },
        {
          subtitle: t('step_b2_s'),
          desc: t('step_b2_d'),
          image: "/images/series-b-2.webp",
          specs: [
            { icon: <Clock className="w-4 h-4"/>, label: t('spec_asm'), value: t('val_h4872') },
            { icon: <ShieldAlert className="w-4 h-4"/>, label: t('spec_defl'), value: t('val_d150') },
            { icon: <Users className="w-4 h-4"/>, label: t('spec_cap'), value: t('val_p515') },
            { icon: <Thermometer className="w-4 h-4"/>, label: t('spec_hvac'), value: t('val_dmode') }
          ]
        },
        {
          subtitle: t('step_b3_s'),
          desc: t('step_b3_d'),
          image: "/images/series-b-3.webp",
          specs: [
            { icon: <Crosshair className="w-4 h-4"/>, label: t('spec_mob'), value: t('val_mhigh') },
            { icon: <Weight className="w-4 h-4"/>, label: t('spec_mass'), value: t('val_t10') },
            { icon: <Layers className="w-4 h-4"/>, label: t('spec_walls'), value: t('val_sarm') },
            { icon: <ShieldAlert className="w-4 h-4"/>, label: t('spec_rat'), value: t('val_l1') }
          ]
        }
      ],
      features: [
        { title: t('feat_b1_t'), desc: t('feat_b1_d') },
        { title: t('feat_b2_t'), desc: t('feat_b2_d') },
        { title: t('feat_b3_t'), desc: t('feat_b3_d') }
      ],
      classes: [
        { id: "L3", name: "Level 3 Modular", desc: t('class_b_l3') },
        { id: "L2", name: "Level 2 Tactical", desc: t('class_b_l2') },
        { id: "L1", name: "Level 1 Rapid", desc: t('class_b_l1') }
      ]
    },
    {
      id: "C",
      title: "Cylindrical Systems",
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
            { icon: <Crosshair className="w-4 h-4"/>, label: t('spec_res'), value: t('val_r60') },
            { icon: <Zap className="w-4 h-4"/>, label: t('spec_pow'), value: t('val_sol') },
            { icon: <Users className="w-4 h-4"/>, label: t('spec_cap'), value: t('val_s1025') },
            { icon: <Layers className="w-4 h-4"/>, label: t('spec_fire'), value: t('val_rei120') }
          ]
        },
        {
          subtitle: t('step_c2_s'),
          desc: t('step_c2_d'),
          image: "/images/series-c-2.webp",
          specs: [
            { icon: <Ruler className="w-4 h-4"/>, label: t('spec_dim'), value: t('val_dim') },
            { icon: <Weight className="w-4 h-4"/>, label: t('spec_mass'), value: t('val_t90') },
            { icon: <ShieldAlert className="w-4 h-4"/>, label: t('spec_owall'), value: t('val_w380') },
            { icon: <ShieldAlert className="w-4 h-4"/>, label: t('spec_icore'), value: t('val_m4') }
          ]
        }
      ],
      features: [
        { title: t('feat_c1_t'), desc: t('feat_c1_d') },
        { title: t('feat_c2_t'), desc: t('feat_c2_d') },
        { title: t('feat_c3_t'), desc: t('feat_c3_d') }
      ],
      classes: [
        { id: "U3", name: "U3 High Protection", desc: t('class_c_u3_d') },
        { id: "U1-U2", name: "U1/U2 Basic", desc: t('class_c_u12_d') },
        { id: "AUX", name: "Auxiliary Ops", desc: t('class_c_aux_d') }
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
      setActiveCert(null);
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
                 src="https://www.youtube.com/embed/5xgt8cTq_D0"
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
               <div className="text-4xl lg:text-5xl font-black mb-2 tracking-tighter">&lt;0.1mm</div>
               <div className="text-[10px] opacity-60 uppercase tracking-widest font-bold">{t('struct')}</div>
             </div>
             <div className="liquid-glass flex-1 rounded-3xl p-8 border border-brand/20 flex flex-col justify-center bg-brand/5 min-h-[120px]">
               <div className="text-3xl lg:text-4xl font-black mb-2 tracking-tighter flex items-center gap-3">
                 ISO-9001 <CheckCircle2 className="w-7 h-7 text-brand"/>
               </div>
               <div className="text-[10px] opacity-60 uppercase tracking-widest font-bold text-brand">{t('mfg_comp')}</div>
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

const DeploymentCTA = () => {
  const lang = useLanguage();
  const [showContact, setShowContact] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleOpen = () => setShowContact(true);
    window.addEventListener('openContact', handleOpen);
    return () => window.removeEventListener('openContact', handleOpen);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (Math.abs(latest - previous) > 5) {
      setShowContact(false);
    }
  });
  
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
                    onClick={() => setShowContact(true)}
                    className="group flex items-center gap-0 bg-white/95 hover:bg-white rounded-full shadow-[0_4px_40px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_60px_rgba(255,255,255,0.25)] transition-all duration-300"
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

      {/* ---- Contact Form Overlay (JeskoJets style — floating box) ---- */}
      <AnimatePresence>
        {showContact && (
          <>
            {/* Backdrop with bottom gradient blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowContact(false)}
              className="fixed inset-0 z-[9998] pointer-events-auto bg-gradient-to-t from-black/90 via-black/40 to-transparent"
              style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', maskImage: 'linear-gradient(to top, black 0%, transparent 80%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 80%)' }}
            />

            {/* Floating Contact form box */}
            <motion.div
              initial={{ y: "120%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "120%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="fixed bottom-4 md:bottom-8 left-4 right-4 md:left-8 md:right-8 z-[9999] pointer-events-none max-w-[85rem] mx-auto"
            >
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] px-6 md:px-10 py-8 md:py-10 border border-white/20 pointer-events-auto">
                
                {/* Close button attached to the top right of the box */}
                <button
                  onClick={() => setShowContact(false)}
                  className="absolute -top-4 -right-4 md:-top-5 md:-right-5 z-[100] w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0c0c0c] text-white flex items-center justify-center shadow-2xl hover:bg-[#1a1a1a] transition-colors border border-white/10 hover:scale-105"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 1L13 13M1 13L13 1"/></svg>
                </button>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
                  
                  {/* Title */}
                  <div className="shrink-0">
                    <h3 className="text-2xl md:text-3xl font-black text-[#0c0c0c] tracking-tight">{t('contact')}</h3>
                  </div>

                  {/* Form fields */}
                  <form onSubmit={(e) => { e.preventDefault(); setShowContact(false); }} className="flex-1 w-full flex flex-col md:flex-row items-stretch gap-4 md:gap-0">
                    <div className="flex-1 flex flex-col md:flex-row">
                      <div className="flex-1 px-0 md:px-4 py-2 md:py-0 border-b md:border-b-0 md:border-r border-[#0c0c0c]/10">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-[#0c0c0c]/40 block mb-1">{t('form_name')}</label>
                        <input type="text" placeholder="Type..." required className="w-full bg-transparent text-[#0c0c0c] text-sm font-medium placeholder:text-[#0c0c0c]/30 focus:outline-none py-1" />
                      </div>
                      <div className="flex-1 px-0 md:px-4 py-2 md:py-0 border-b md:border-b-0 md:border-r border-[#0c0c0c]/10">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-[#0c0c0c]/40 block mb-1">{t('form_email')}</label>
                        <input type="email" placeholder="Email..." required className="w-full bg-transparent text-[#0c0c0c] text-sm font-medium placeholder:text-[#0c0c0c]/30 focus:outline-none py-1" />
                      </div>
                      <div className="flex-1 px-0 md:px-4 py-2 md:py-0 border-b md:border-b-0 md:border-r border-[#0c0c0c]/10">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-[#0c0c0c]/40 block mb-1">{t('form_org')}</label>
                        <input type="text" placeholder="Company..." className="w-full bg-transparent text-[#0c0c0c] text-sm font-medium placeholder:text-[#0c0c0c]/30 focus:outline-none py-1" />
                      </div>
                      <div className="flex-1 px-0 md:px-4 py-2 md:py-0">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-[#0c0c0c]/40 block mb-1">{t('form_msg')}</label>
                        <input type="text" placeholder="Your inquiry..." required className="w-full bg-transparent text-[#0c0c0c] text-sm font-medium placeholder:text-[#0c0c0c]/30 focus:outline-none py-1" />
                      </div>
                    </div>
                    
                    {/* Submit circle */}
                    <button type="submit" className="shrink-0 w-full md:w-12 h-12 rounded-full md:rounded-full bg-[#0c0c0c] text-white flex items-center justify-center hover:bg-[#1a1a1a] transition-colors shadow-lg md:ml-4 mt-3 md:mt-0">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </form>
                </div>
                
                {/* Privacy note */}
                <div className="mt-5 flex items-center gap-2 text-[10px] text-[#0c0c0c]/30 font-medium uppercase tracking-widest">
                  <div className="w-3 h-3 rounded-full border border-[#0c0c0c]/20" />
                  By submitting, you agree to our privacy policy
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};


export default function App() {
  const [isLoading, setIsLoading] = useState(true);

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
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard smooth easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 2,
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
           <DeploymentCTA />
         </main>
      </div>
    </div>
  );
}

