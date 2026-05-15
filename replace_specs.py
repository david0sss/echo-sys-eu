import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    # Specs Series A
    ('label: "Capacity", value: "20-50 People"', 'label: t(\'spec_cap\'), value: t(\'val_p2050\')'),
    ('label: "Rating", value: "U1-U2 Surface"', 'label: t(\'spec_rat\'), value: t(\'val_u1u2\')'),
    ('label: "Mass", value: "~45 Tons"', 'label: t(\'spec_mass\'), value: t(\'val_t45\')'),
    ('label: "HVAC", value: "Passive"', 'label: t(\'spec_hvac\'), value: t(\'val_pass\')'),
    ('label: "Capacity", value: "4-12 People"', 'label: t(\'spec_cap\'), value: t(\'val_p412\')'),
    ('label: "Duration", value: "48+ Hours"', 'label: t(\'spec_dur\'), value: t(\'val_h48\')'),
    ('label: "Depth", value: "4m-8m Avg"', 'label: t(\'spec_depth\'), value: t(\'val_d48\')'),
    ('label: "HVAC", value: "Active CBRN"', 'label: t(\'spec_hvac\'), value: t(\'val_act\')'),
    ('label: "Mass", value: "100+ Tons"', 'label: t(\'spec_mass\'), value: t(\'val_t100\')'),
    ('label: "Rating", value: "S3 Undrgrnd"', 'label: t(\'spec_rat\'), value: t(\'val_s3\')'),
    ('label: "Walls", value: "600mm Wall"', 'label: t(\'spec_walls\'), value: t(\'val_w600\')'),
    ('label: "Blast Res", value: "300 kN/m²"', 'label: t(\'spec_blast\'), value: t(\'val_b300\')'),
    
    # Features Series A
    ('{ title: "Structural Integrity", desc: t(\'step_a3_d\') }', '{ title: t(\'feat_a1_t\'), desc: t(\'feat_a1_d\') }'),
    ('{ title: "Living Ecology", desc: "Fully functional protected living space. Integrated kitchen zone, quarters, and utility modules. Independent HVAC." }', '{ title: t(\'feat_a2_t\'), desc: t(\'feat_a2_d\') }'),
    ('{ title: "Defense Engineering", desc: "Seismic-resistant base design. Hermetic CBRN filtration systems. Verified by impact reports." }', '{ title: t(\'feat_a3_t\'), desc: t(\'feat_a3_d\') }'),
    
    # Specs Series B
    ('label: "Assembly", value: "1-2 Weeks"', 'label: t(\'spec_asm\'), value: t(\'val_w12\')'),
    ('label: "Mass", value: "~15 Tons"', 'label: t(\'spec_mass\'), value: t(\'val_t15\')'),
    ('label: "Core", value: "≥ 30mm Alloy"', 'label: t(\'spec_core\'), value: t(\'val_c30\')'),
    ('label: "Arch", value: "Interlocking"', 'label: t(\'spec_arch\'), value: t(\'val_ilock\')'),
    ('label: "Assembly", value: "48-72 Hrs"', 'label: t(\'spec_asm\'), value: t(\'val_h4872\')'),
    ('label: "Deflection", value: "150 kN/m²"', 'label: t(\'spec_defl\'), value: t(\'val_d150\')'),
    ('label: "Capacity", value: "5-15 People"', 'label: t(\'spec_cap\'), value: t(\'val_p515\')'),
    ('label: "HVAC", value: "Dual Mode"', 'label: t(\'spec_hvac\'), value: t(\'val_dmode\')'),
    ('label: "Mobility", value: "High (ISO Box)"', 'label: t(\'spec_mob\'), value: t(\'val_mhigh\')'),
    ('label: "Mass", value: "< 10 Tons"', 'label: t(\'spec_mass\'), value: t(\'val_t10\')'),
    ('label: "Walls", value: "Spaced Armor"', 'label: t(\'spec_walls\'), value: t(\'val_sarm\')'),
    ('label: "Rating", value: "L1 Rapid"', 'label: t(\'spec_rat\'), value: t(\'val_l1\')'),
    
    # Features Series B
    ('{ title: "Material Science", desc: "High-grade alloy steel with tactical anti-corrosion coating. Ballistic-grade plating for maximum kinetic energy absorption." }', '{ title: t(\'feat_b1_t\'), desc: t(\'feat_b1_d\') }'),
    ('{ title: "Rapid Deployment", desc: "Modular interlocking technology. Precision manufacturing allows assembly within 48-72 hours." }', '{ title: t(\'feat_b2_t\'), desc: t(\'feat_b2_d\') }'),
    ('{ title: "Versatility", desc: "Scalable architecture. Ideal for tactical headquarters, industrial hub protection, or private estate security." }', '{ title: t(\'feat_b3_t\'), desc: t(\'feat_b3_d\') }'),
    
    # Specs Series C
    ('label: "Resilience", value: "60 kN/m²"', 'label: t(\'spec_res\'), value: t(\'val_r60\')'),
    ('label: "Power", value: "Solar+Gen"', 'label: t(\'spec_pow\'), value: t(\'val_sol\')'),
    ('label: "Capacity", value: "10-25 Squad"', 'label: t(\'spec_cap\'), value: t(\'val_s1025\')'),
    ('label: "Fire Rate", value: "REI 120"', 'label: t(\'spec_fire\'), value: t(\'val_rei120\')'),
    ('label: "Dimension", value: "7.3 x 2.8m"', 'label: t(\'spec_dim\'), value: t(\'val_dim\')'),
    ('label: "Mass", value: "~90 Tons"', 'label: t(\'spec_mass\'), value: t(\'val_t90\')'),
    ('label: "Outer Wall", value: "380mm"', 'label: t(\'spec_owall\'), value: t(\'val_w380\')'),
    ('label: "Inner Core", value: "4mm Metal"', 'label: t(\'spec_icore\'), value: t(\'val_m4\')'),
    
    # Features Series C
    ('{ title: "Geometry of Safety", desc: "Echo Pipe geometry optimized for blast-wave deflection and pressure distribution. Withstands secondary debris." }', '{ title: t(\'feat_c1_t\'), desc: t(\'feat_c1_d\') }'),
    ('{ title: "Public Integration", desc: "Dual-purpose urban infrastructure. Designed for bus stations, kiosks, and pavilions. Modern aesthetic." }', '{ title: t(\'feat_c2_t\'), desc: t(\'feat_c2_d\') }'),
    ('{ title: "Smart Connectivity", desc: "Integrated communication modules, armored sensors, and automated emergency lighting." }', '{ title: t(\'feat_c3_t\'), desc: t(\'feat_c3_d\') }'),
    
    # Classes C
    ('desc: "Up to 60 kN/m² resistance, REI 120 fire rating. Includes gravitational or mechanical air filtration and 100x radiation reduction."', 'desc: t(\'class_c_u3_d\')'),
    ('desc: "Up to 10 kN/m² resistance, REI 60 fire rating. Passive ventilation and basic debris management."', 'desc: t(\'class_c_u12_d\')'),
    ('desc: "Equipped with solar autonomy, integrated payment/vending systems for dual-use city infrastructure."', 'desc: t(\'class_c_aux_d\')')
]

for old, new in replacements:
    content = content.replace(old, new)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Replaced all hardcoded values with variables")
