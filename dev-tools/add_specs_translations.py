import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

en_extra = """,
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
"""

pl_extra = """,
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
"""

uk_extra = """,
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
"""

nl_extra = """,
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
"""

content = content.replace('form_msg: "Message"\n  },', f'form_msg: "Message"{en_extra}\n  }},')
content = content.replace('form_msg: "Wiadomość"\n  },', f'form_msg: "Wiadomość"{pl_extra}\n  }},')
content = content.replace('form_msg: "Повідомлення"\n  },', f'form_msg: "Повідомлення"{uk_extra}\n  }},')
content = content.replace('form_msg: "Bericht"\n  }\n};', f'form_msg: "Bericht"{nl_extra}\n  }}\n}};')

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added specs and features translations!")
