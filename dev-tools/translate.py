import json
import codecs

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add bottom mask effect
top_mask = '<div className="fixed top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-40 opacity-70" />'
bottom_mask = '<div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/80 to-transparent pointer-events-none z-40 opacity-90" />'
if bottom_mask not in content:
    content = content.replace(top_mask, top_mask + '\n      ' + bottom_mask)

# 2. Add new translation keys
en_add = """    learn_more: "Learn More", vid_t1: "Manufacturing facilities in Poland", vid_t2: "(EU production standards)", vid_t3: "and Ukraine", vid_t4: "(Advanced combat engineering and R&D).", vid_desc: "Tested in real-world high-risk conditions. Validated by technical impact reports and ISO compliance audits.", sec_class: "Security Classification",
    step_a1_s: "Public & Bus Stops", step_a1_d: "Designed for high-traffic urban areas, providing immediate shelter against blast waves and shrapnel.", step_a2_s: "Residential", step_a2_d: "Fully functional protected living space. Integrated kitchen zone, sleeping quarters, and utility modules.", step_a3_s: "Heavy Industrial", step_a3_d: "B45/B60 High-Strength Concrete. Designed for extreme loads and direct hits. Compliant with European safety standards.",
    class_a_l4: "Highest grade structure, capable of surviving direct kinetic impact and extreme continuous shockwaves.", class_a_l3: "Standard bunker configuration, suitable for underground installation in high-risk zones.", class_a_l2: "Residential scale module, provides essential protection against fallout and pressure.", class_a_s1: "Maximum protection. 48+ hours stay duration. Fully hermetic with sleep quarters. 300 kN/m² blast resistance and 1500x radiation shielding.", class_a_u1: "Basic protection against shrapnel and building collapse. Short stay (<24h). 10 kN/m² blast resistance.", class_a_u2: "Supplemental earth shielding. Medium stay without active exclusion zones. 60 kN/m² blast resistance and 100x radiation shielding.",
    step_b1_s: "MDS Underground", step_b1_d: "Expansive multi-chamber underground bases. Secure, modular expansion possibilities to support large tactical teams.", step_b2_s: "MDS On Ground", step_b2_d: "Rapid-deployment surface bunkers for industrial hubs and estates. Immediate shrapnel and secondary blast protection.", step_b3_s: "Mobile Solution", step_b3_d: "Trailer-mounted or containerized armor living modules. Capable of being relocated in less than 24 hours.",
    class_b_i: "Large scale deployment for factories or critical infrastructure. Connects multiple modules.", class_b_p: "Compact footprint for fast installation under private residential properties.", class_b_l3: "Extended stay modular setup with optional HVAC add-ons. 150 kN/m² deflection rating.", class_b_l2: "Standard deployment for industrial defense. Medium duration viability. 80 kN/m² resistance.", class_b_l1: "Quick-deploy surface splinter protection. Minimal groundwork required.",
    step_c1_s: "Military Ops", step_c1_d: "Hardened pipe solutions for front-line deployment. Self-sustaining with auxiliary ops integration, EMP shielding, and advanced sensory arrays.", step_c2_s: "Civil / Public Support", step_c2_d: "Engineered specifically for dense urban integration. The curved geometry naturally deflects overpressure waves, providing maximum survivability.", class_c_s: "Bus stop and public transport shelter integration.", class_c_g: "Underground walkway or tunnel reinforcement.","""

pl_add = """    learn_more: "Dowiedz się więcej", vid_t1: "Zakłady produkcyjne w Polsce", vid_t2: "(Standardy UE)", vid_t3: "i na Ukrainie", vid_t4: "(Zaawansowana inżynieria bojowa i B&R).", vid_desc: "Testowane w rzeczywistych warunkach wysokiego ryzyka. Potwierdzone raportami i audytami ISO.", sec_class: "Klasyfikacja Bezpieczeństwa",
    step_a1_s: "Przystanki Publiczne", step_a1_d: "Zaprojektowane dla obszarów miejskich o dużym natężeniu ruchu, zapewniają natychmiastowe schronienie.", step_a2_s: "Mieszkalne", step_a2_d: "W pełni funkcjonalna chroniona przestrzeń życiowa. Zintegrowana kuchnia, strefa sypialna i moduły użytkowe.", step_a3_s: "Ciężki Przemysł", step_a3_d: "Beton o wysokiej wytrzymałości B45/B60. Przeznaczone na ekstremalne obciążenia i bezpośrednie trafienia.",
    class_a_l4: "Struktura najwyższej klasy, zdolna przetrwać bezpośrednie uderzenie kinetyczne.", class_a_l3: "Standardowa konfiguracja bunkra, odpowiednia do instalacji podziemnych w strefach wysokiego ryzyka.", class_a_l2: "Moduł skali mieszkalnej, zapewnia podstawową ochronę przed opadem i ciśnieniem.", class_a_s1: "Maksymalna ochrona. Ponad 48h pobytu. W pełni hermetyczne z sypialniami. Odporność 300 kN/m².", class_a_u1: "Podstawowa ochrona przed odłamkami i zawaleniem budynków. Krótki pobyt (<24h). Odporność 10 kN/m².", class_a_u2: "Dodatkowa osłona z ziemi. Średni pobyt bez aktywnych stref wykluczenia. Odporność 60 kN/m².",
    step_b1_s: "MDS Podziemny", step_b1_d: "Rozległe wielokomorowe bazy podziemne. Bezpieczne i modułowe rozszerzenia.", step_b2_s: "MDS Naziemny", step_b2_d: "Bunkry powierzchniowe szybkiego wdrażania dla węzłów przemysłowych. Natychmiastowa ochrona przed odłamkami.", step_b3_s: "Rozwiązanie Mobilne", step_b3_d: "Opancerzone moduły mieszkalne na przyczepach lub w kontenerach. Możliwość relokacji w 24h.",
    class_b_i: "Wdrożenie na dużą skalę dla fabryk i infrastruktury krytycznej. Łączy wiele modułów.", class_b_p: "Kompaktowa budowa do szybkiej instalacji pod prywatnymi nieruchomościami.", class_b_l3: "Przedłużony pobyt z modułowymi dodatkami HVAC. Odporność 150 kN/m².", class_b_l2: "Standardowe wdrożenie do obrony przemysłowej. Odporność 80 kN/m².", class_b_l1: "Powierzchniowa osłona przed odłamkami szybkiego wdrożenia. Minimalne prace ziemne.",
    step_c1_s: "Operacje Wojskowe", step_c1_d: "Wzmocnione rury do wdrażania na linii frontu. Samowystarczalne z integracją operacji pomocniczych.", step_c2_s: "Wsparcie Cywilne / Publiczne", step_c2_d: "Zaprojektowane do integracji w gęstej zabudowie miejskiej. Zakrzywiona geometria naturalnie odchyla fale ciśnienia.", class_c_s: "Integracja z przystankami i transportem publicznym.", class_c_g: "Wzmocnienie przejść podziemnych i tuneli.","""

uk_add = """    learn_more: "Дізнатися більше", vid_t1: "Виробничі потужності в Польщі", vid_t2: "(стандарти ЄС)", vid_t3: "та Україні", vid_t4: "(Передові бойові розробки).", vid_desc: "Протестовано в реальних умовах високого ризику. Підтверджено звітами та аудитами ISO.", sec_class: "Класифікація Безпеки",
    step_a1_s: "Громадські Зупинки", step_a1_d: "Розроблено для міських районів з інтенсивним рухом, забезпечує негайне укриття від вибухових хвиль.", step_a2_s: "Житлові", step_a2_d: "Повністю функціональний захищений житловий простір. Інтегрована кухня та спальні місця.", step_a3_s: "Важка Промисловість", step_a3_d: "Бетон високої міцності B45/B60. Розрахований на екстремальні навантаження та прямі попадання.",
    class_a_l4: "Конструкція найвищого класу, здатна витримати пряме кінетичне попадання.", class_a_l3: "Стандартна конфігурація бункера, придатна для підземного встановлення в зонах високого ризику.", class_a_l2: "Житловий модуль, забезпечує базовий захист від опадів та тиску.", class_a_s1: "Максимальний захист. Більше 48 годин перебування. Повністю герметичний зі спальнями.", class_a_u1: "Базовий захист від уламків та руйнування будівель. Коротке перебування (<24г).", class_a_u2: "Додаткове екранування ґрунтом. Середнє перебування. Стійкість 60 кН/м².",
    step_b1_s: "MDS Підземний", step_b1_d: "Широкі багатокамерні підземні бази. Безпечні модульні можливості розширення.", step_b2_s: "MDS Наземний", step_b2_d: "Наземні бункери швидкого розгортання для промислових центрів. Миттєвий захист від уламків.", step_b3_s: "Мобільне Рішення", step_b3_d: "Броньовані житлові модулі на причепах або в контейнерах. Можливість переміщення за 24г.",
    class_b_i: "Масштабне розгортання для заводів або критичної інфраструктури. З'єднує багато модулів.", class_b_p: "Компактний розмір для швидкого встановлення під приватними будинками.", class_b_l3: "Тривале перебування з модульними доповненнями HVAC. Стійкість 150 кН/м².", class_b_l2: "Стандартне розгортання для промислової оборони. Стійкість 80 кН/m².", class_b_l1: "Швидке розгортання для захисту від уламків. Мінімальні земляні роботи.",
    step_c1_s: "Військові Операції", step_c1_d: "Посилені труби для розміщення на передовій. Самодостатні з інтеграцією допоміжних систем.", step_c2_s: "Громадська Підтримка", step_c2_d: "Спеціально розроблено для інтеграції в щільну міську забудову. Геометрія відхиляє хвилі тиску.", class_c_s: "Інтеграція із зупинками громадського транспорту.", class_c_g: "Посилення підземних переходів та тунелів.","""

nl_add = """    learn_more: "Meer Informatie", vid_t1: "Productiefaciliteiten in Polen", vid_t2: "(EU normen)", vid_t3: "en Oekraïne", vid_t4: "(Geavanceerde gevechtstechniek en R&D).", vid_desc: "Getest in reële risicovolle omstandigheden. Gevalideerd door technische rapporten en ISO audits.", sec_class: "Veiligheidsclassificatie",
    step_a1_s: "Openbaar & Bushaltes", step_a1_d: "Ontworpen voor drukke stedelijke gebieden en biedt onmiddellijke beschutting tegen schokgolven en schrapnel.", step_a2_s: "Residentieel", step_a2_d: "Volledig functionele beschermde leefruimte. Geïntegreerde keuken, slaapvertrekken en nutsmodules.", step_a3_s: "Zware Industrie", step_a3_d: "B45/B60 Hogesterktebeton. Ontworpen voor extreme belastingen en directe inslagen.",
    class_a_l4: "Constructie van de hoogste klasse, in staat om directe kinetische inslagen te overleven.", class_a_l3: "Standaard bunkerconfiguratie, geschikt voor ondergrondse installatie in hoogrisicozones.", class_a_l2: "Residentiële module, biedt essentiële bescherming tegen fall-out en druk.", class_a_s1: "Maximale bescherming. Meer dan 48 uur verblijf. Volledig hermetisch met slaapruimtes.", class_a_u1: "Basisbescherming tegen schrapnel en instortende gebouwen. Kort verblijf (<24u).", class_a_u2: "Extra aardschild. Middellang verblijf zonder actieve uitsluitingszones. 60 kN/m² weerstand.",
    step_b1_s: "MDS Ondergronds", step_b1_d: "Uitgebreide ondergrondse bases met meerdere kamers. Veilige, modulaire uitbreidingsmogelijkheden.", step_b2_s: "MDS Bovengronds", step_b2_d: "Bovengrondse bunkers voor snelle inzet in industriële gebieden. Onmiddellijke bescherming tegen schrapnel.", step_b3_s: "Mobiele Oplossing", step_b3_d: "Gepantserde leefmodules op aanhangers of in containers. Verplaatsbaar in minder dan 24 uur.",
    class_b_i: "Grootschalige inzet voor fabrieken of kritieke infrastructuur. Verbindt meerdere modules.", class_b_p: "Compact ontwerp voor snelle installatie onder particuliere woningen.", class_b_l3: "Langer verblijf met optionele HVAC add-ons. 150 kN/m² afbuigingsclassificatie.", class_b_l2: "Standaard inzet voor industriële defensie. Gemiddelde verblijfsduur. 80 kN/m² weerstand.", class_b_l1: "Snel inzetbare bovengrondse splinterbescherming. Minimaal grondwerk vereist.",
    step_c1_s: "Militaire Operaties", step_c1_d: "Versterkte buizen voor frontlinie inzet. Zelfvoorzienend met integratie van hulpsystemen.", step_c2_s: "Publieke Ondersteuning", step_c2_d: "Speciaal ontworpen voor dichte stedelijke integratie. De gebogen geometrie buigt drukgolven af.", class_c_s: "Integratie met bushaltes en openbaar vervoer.", class_c_g: "Versterking van voetgangerstunnels en gangen.","""

content = content.replace('    req: "Your Requirements", req_desc: "Whether you have a specific operational challenge or want to explore what ECHO Systems can deliver, our team is ready to engage.",', en_add + '\n    req: "Your Requirements", req_desc: "Whether you have a specific operational challenge or want to explore what ECHO Systems can deliver, our team is ready to engage.",')
content = content.replace('    req: "O Twoich Wymaganiach", req_desc: "Niezależnie od tego, czy masz konkretne wyzwanie operacyjne, czy chcesz poznać możliwości ECHO Systems, nasz zespół jest gotowy do działania.",', pl_add + '\n    req: "O Twoich Wymaganiach", req_desc: "Niezależnie od tego, czy masz konkretne wyzwanie operacyjne, czy chcesz poznać możliwości ECHO Systems, nasz zespół jest gotowy do działania.",')
content = content.replace('    req: "Ваші Вимоги", req_desc: "Незалежно від того, чи є у вас конкретні оперативні завдання, чи ви хочете дізнатися, що може запропонувати ECHO Systems, наша команда готова до співпраці.",', uk_add + '\n    req: "Ваші Вимоги", req_desc: "Незалежно від того, чи є у вас конкретні оперативні завдання, чи ви хочете дізнатися, що може запропонувати ECHO Systems, наша команда готова до співпраці.",')
content = content.replace('    req: "Uw Vereisten", req_desc: "Of u nu een specifieke operationele uitdaging heeft of wilt ontdekken wat ECHO Systems kan leveren, ons team staat klaar om u te helpen.",', nl_add + '\n    req: "Uw Vereisten", req_desc: "Of u nu een specifieke operationele uitdaging heeft of wilt ontdekken wat ECHO Systems kan leveren, ons team staat klaar om u te helpen.",')

# 3. Apply translations to App.tsx strings
content = content.replace('"Manufacturing facilities in Poland "', "t('vid_t1') + ' '")
content = content.replace('"(EU production standards)"', "t('vid_t2')")
content = content.replace('" and Ukraine "', " + ' ' + t('vid_t3') + ' '")
content = content.replace('"(Advanced combat engineering and R&D)."', "t('vid_t4')")
content = content.replace('"Tested in real-world high-risk conditions. Validated by technical impact reports and ISO compliance audits."', "t('vid_desc')")
content = content.replace('Learn More', "{t('learn_more')}")

# Replace step/class strings in sections
reps = {
    '"Public & Bus Stops"': "t('step_a1_s')", '"Designed for high-traffic urban areas, providing immediate shelter against blast waves and shrapnel."': "t('step_a1_d')",
    '"Residential"': "t('step_a2_s')", '"Fully functional protected living space. Integrated kitchen zone, sleeping quarters, and utility modules."': "t('step_a2_d')",
    '"Heavy Industrial"': "t('step_a3_s')", '"B45/B60 High-Strength Concrete. Designed for extreme loads and direct hits. Compliant with European safety standards."': "t('step_a3_d')",
    '"Highest grade structure, capable of surviving direct kinetic impact and extreme continuous shockwaves."': "t('class_a_l4')",
    '"Standard bunker configuration, suitable for underground installation in high-risk zones."': "t('class_a_l3')",
    '"Residential scale module, provides essential protection against fallout and pressure."': "t('class_a_l2')",
    '"Maximum protection. 48+ hours stay duration. Fully hermetic with sleep quarters. 300 kN/m² blast resistance and 1500x radiation shielding."': "t('class_a_s1')",
    '"Basic protection against shrapnel and building collapse. Short stay (<24h). 10 kN/m² blast resistance."': "t('class_a_u1')",
    '"Supplemental earth shielding. Medium stay without active exclusion zones. 60 kN/m² blast resistance and 100x radiation shielding."': "t('class_a_u2')",
    
    '"MDS Underground"': "t('step_b1_s')", '"Expansive multi-chamber underground bases. Secure, modular expansion possibilities to support large tactical teams."': "t('step_b1_d')",
    '"MDS On Ground"': "t('step_b2_s')", '"Rapid-deployment surface bunkers for industrial hubs and estates. Immediate shrapnel and secondary blast protection."': "t('step_b2_d')",
    '"Mobile Solution"': "t('step_b3_s')", '"Trailer-mounted or containerized armor living modules. Capable of being relocated in less than 24 hours."': "t('step_b3_d')",
    '"Large scale deployment for factories or critical infrastructure. Connects multiple modules."': "t('class_b_i')",
    '"Compact footprint for fast installation under private residential properties."': "t('class_b_p')",
    '"Extended stay modular setup with optional HVAC add-ons. 150 kN/m² deflection rating."': "t('class_b_l3')",
    '"Standard deployment for industrial defense. Medium duration viability. 80 kN/m² resistance."': "t('class_b_l2')",
    '"Quick-deploy surface splinter protection. Minimal groundwork required."': "t('class_b_l1')",
    
    '"Military Ops"': "t('step_c1_s')", '"Hardened pipe solutions for front-line deployment. Self-sustaining with auxiliary ops integration, EMP shielding, and advanced sensory arrays."': "t('step_c1_d')",
    '"Civil / Public Support"': "t('step_c2_s')", '"Engineered specifically for dense urban integration. The curved geometry naturally deflects overpressure waves, providing maximum survivability."': "t('step_c2_d')",
    '"Bus stop and public transport shelter integration."': "t('class_c_s')",
    '"Underground walkway or tunnel reinforcement."': "t('class_c_g')"
}

for k, v in reps.items():
    content = content.replace(k, v)

with codecs.open('src/App.tsx', 'w', 'utf-8') as f:
    f.write(content)

print("Done")
