import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find("const translations = {")
end_idx = content.find("const LanguageContext =")

if start_idx != -1 and end_idx != -1:
    dict_end = content.rfind("};", start_idx, end_idx) + 2
    
    clean_dict = """const translations = {
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
    about_name: "ECHO Systems", about_short: "About Us", about_desc: "ECHO Systems (ECHO SYSTEMS Sp. z o.o.) is a Polish technology company headquartered in Toruń, specialising in the development of advanced autonomous, wireless, and robotic systems for professional and defence applications.\\n\\nFounded in 2022 and registered in Poland, we combine deep engineering expertise with a mission to deliver modular, reliable, and mission-ready solutions to clients who operate where failure is not an option.",
    conc_name: "Reinforced Concrete Series", conc_short: "Concrete Modules", conc_mat: "B45/B60 High-Strength Concrete", conc_desc: "Heavy-duty protection, long-term survival capabilities with integrated kitchen/sleeping zones, and active seismic stability. Full CBRN Hermetic Sealing.", conc_def: "Full Spectrum",
    steel_name: "Steel Modular Series", steel_short: "Steel Systems", steel_mat: "Alloy Steel with Tactical Anti-Corrosion Coating", steel_desc: "Focus on Speed and Mobility. Interlocking modular design allowing 48-72 hour assembly. Highly scalable for private and industrial use.", steel_def: "Ballistic",
    pipe_name: "Echo Pipe", pipe_short: "Cylindrical Systems", pipe_mat: "Aerodynamic Blast-Deflection Alloy", pipe_desc: "Designed for urban public infrastructure, bus stops, and public galleries. Aerodynamic geometry for blast-wave deflection and superior debris impact resistance.", pipe_def: "Deflection",
    series_a_title: "Heavy-Duty Reinforced Solutions", series_a_f1: "Airlock System", series_a_d1: "Dual-door decontamination entry", series_a_f2: "Hermetic Seal", series_a_d2: "CBRN pressure isolation", series_a_f3: "Life Support", series_a_d3: "Air scrubbing and water reserves",
    series_b_title: "Rapid Deployment Steel", series_b_f1: "Modular Locks", series_b_d1: "Fast-clip structural joining", series_b_f2: "Anti-Corrosion", series_b_d2: "Multi-layer subterranean coating", series_b_f3: "Mobility", series_b_d3: "Standard container transport logic",
    series_c_title: "Urban Deflection Pipe", series_c_f1: "Curved Deflection", series_c_d1: "Redirects shockwave energy", series_c_f2: "Public Utility", series_c_d2: "Integrates with city transit", series_c_f3: "Quick Access", series_c_d3: "Wide entry points for masses"
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
    about_name: "ECHO Systems", about_short: "O nas", about_desc: "ECHO Systems (ECHO SYSTEMS Sp. z o.o.) to polska firma technologiczna z siedzibą w Toruniu, specjalizująca się w rozwoju zaawansowanych systemów do zastosowań profesjonalnych i obronnych.\\n\\nZałożona w 2022 roku łączymy głęboką wiedzę inżynieryjną z misją dostarczania niezawodnych rozwiązań dla klientów.",
    conc_name: "Seria Żelbetowa", conc_short: "Moduły Betonowe", conc_mat: "Beton o Wysokiej Wytrzymałości B45/B60", conc_desc: "Wzmocniona ochrona, zdolność do długotrwałego przetrwania ze strefą sypialną oraz aktywna stabilność sejsmiczna. Pełne uszczelnienie CBRN.", conc_def: "Pełne Spektrum",
    steel_name: "Seria Stalowa Modułowa", steel_short: "Systemy Stalowe", steel_mat: "Stal Stopowa z Powłoką Antykorozyjną", steel_desc: "Skupienie na szybkości i mobilności. Zazębiająca się konstrukcja modułowa pozwalająca na montaż w 48-72 h. Wysoce skalowalna.", steel_def: "Balistyczna",
    pipe_name: "Echo Pipe", pipe_short: "Systemy Cylindryczne", pipe_mat: "Aerodynamiczny Stop Odbijający", pipe_desc: "Zaprojektowane dla miejskiej infrastruktury publicznej i przystanków. Aerodynamiczna geometria odchylająca falę uderzeniową.", pipe_def: "Odbicie",
    series_a_title: "Wzmocnione Rozwiązania", series_a_f1: "System Śluzy", series_a_d1: "Wejście dwudrzwiowe", series_a_f2: "Uszczelnienie", series_a_d2: "Izolacja ciśnieniowa CBRN", series_a_f3: "Podtrzymanie Życia", series_a_d3: "Filtry powietrza i wody",
    series_b_title: "Stal Szybkiego Wdrażania", series_b_f1: "Zamki Modułowe", series_b_d1: "Szybkie łączenie konstrukcji", series_b_f2: "Antykorozyjność", series_b_d2: "Wielowarstwowa powłoka", series_b_f3: "Mobilność", series_b_d3: "Standardowy transport",
    series_c_title: "Rura Odbijająca", series_c_f1: "Zakrzywione Odbicie", series_c_d1: "Przekierowuje energię fali", series_c_f2: "Użyteczność Pub.", series_c_d2: "Integracja z miastem", series_c_f3: "Szybki Dostęp", series_c_d3: "Szerokie wejścia dla tłumów"
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
    about_name: "ECHO Systems", about_short: "Про нас", about_desc: "ECHO Systems — польська технологічна компанія, що спеціалізується на розробці передових систем для професійного та оборонного застосування.\\n\\nМи поєднуємо глибокі інженерні знання з місією надавати надійні рішення клієнтам.",
    conc_name: "Залізобетонна Серія", conc_short: "Бетонні Модулі", conc_mat: "Бетон B45/B60", conc_desc: "Надійний захист, довгострокове виживання з кухнею/спальнею та активною сейсмічною стабільністю. Повна герметизація CBRN.", conc_def: "Повний Спектр",
    steel_name: "Сталева Модульна Серія", steel_short: "Сталеві Системи", steel_mat: "Сталь з антикорозійним покриттям", steel_desc: "Швидкість і мобільність. Модульна конструкція дозволяє зібрати укриття за 48-72 години. Висока масштабованість.", steel_def: "Балістичний",
    pipe_name: "Echo Pipe", pipe_short: "Циліндричні Системи", pipe_mat: "Аеродинамічний Сплав", pipe_desc: "Розроблено для міської інфраструктури та зупинок. Аеродинамічна геометрія для відхилення вибухової хвилі.", pipe_def: "Відхилення",
    series_a_title: "Надміцні Рішення", series_a_f1: "Система Шлюзів", series_a_d1: "Дводверний вхід", series_a_f2: "Герметичність", series_a_d2: "Ізоляція тиску CBRN", series_a_f3: "Підтримка Життя", series_a_d3: "Очищення повітря і води",
    series_b_title: "Сталь Швидкого Розгортання", series_b_f1: "Модульні Замки", series_b_d1: "Швидке з'єднання", series_b_f2: "Антикорозія", series_b_d2: "Багатошарове покриття", series_b_f3: "Мобільність", series_b_d3: "Стандартний транспорт",
    series_c_title: "Криволінійна Геометрія", series_c_f1: "Відхилення Хвилі", series_c_d1: "Перенаправляє енергію", series_c_f2: "Публічна Користь", series_c_d2: "Інтеграція з містом", series_c_f3: "Швидкий Доступ", series_c_d3: "Широкі входи для натовпу"
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
    about_name: "ECHO Systems", about_short: "Over Ons", about_desc: "ECHO Systems is een Pools technologiebedrijf gespecialiseerd in de ontwikkeling van geavanceerde systemen voor defensietoepassingen.\\n\\nOpgericht in 2022, combineren wij technische expertise met de missie om betrouwbare oplossingen te leveren.",
    conc_name: "Gewapend Beton Serie", conc_short: "Betonnen Modules", conc_mat: "B45/B60 Beton", conc_desc: "Zware bescherming, overlevingscapaciteiten met geïntegreerde zones en actieve seismische stabiliteit. Volledige CBRN afdichting.", conc_def: "Volledig Spectrum",
    steel_name: "Stalen Modulaire Serie", steel_short: "Stalen Systemen", steel_mat: "Gelegeerd staal met coating", steel_desc: "Focus op snelheid en mobiliteit. In elkaar grijpend ontwerp voor montage in 48-72 uur. Zeer schaalbaar.", steel_def: "Ballistisch",
    pipe_name: "Echo Pipe", pipe_short: "Cylindrische Systemen", pipe_mat: "Aerodynamische Legering", pipe_desc: "Ontworpen voor stedelijke infrastructuur en bushaltes. Aerodynamische geometrie voor afbuiging van schokgolven.", pipe_def: "Afbuiging",
    series_a_title: "Versterkte Oplossingen", series_a_f1: "Sluis Systeem", series_a_d1: "Dubbele deur toegang", series_a_f2: "Hermetische Afdichting", series_a_d2: "CBRN druk isolatie", series_a_f3: "Life Support", series_a_d3: "Luchtzuivering en water",
    series_b_title: "Snel Inzetbaar Staal", series_b_f1: "Modulaire Sloten", series_b_d1: "Snelle structurele verbinding", series_b_f2: "Anti-Corrosie", series_b_d2: "Meerlaagse coating", series_b_f3: "Mobiliteit", series_b_d3: "Standaard transport",
    series_c_title: "Afbuigende Buis", series_c_f1: "Gekromde Afbuiging", series_c_d1: "Leidt energie om", series_c_f2: "Openbaar Nut", series_c_d2: "Integratie met stad", series_c_f3: "Snelle Toegang", series_c_d3: "Brede ingangen voor menigten"
  }
};"""

    content = content[:start_idx] + clean_dict + content[dict_end:]
    
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Translations block cleaned.')
else:
    print('Could not find translation block boundaries.')
