import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

en_keys = ',\n    eu_cert: "EU-Certified Protection", legal_entity: "Legal Entity", address: "Address", inquiries: "For Inquiries", contact: "Contact", form_name: "Name", form_email: "Email", form_org: "Organisation", form_msg: "Message"'
pl_keys = ',\n    eu_cert: "Ochrona certyfikowana w UE", legal_entity: "Osobowość Prawna", address: "Adres", inquiries: "Dla Zapytań", contact: "Kontakt", form_name: "Imię i Nazwisko", form_email: "Email", form_org: "Organizacja", form_msg: "Wiadomość"'
uk_keys = ',\n    eu_cert: "Сертифікований захист ЄС", legal_entity: "Юридична Особа", address: "Адреса", inquiries: "Для запитів", contact: "Контакти", form_name: "Ім\'я", form_email: "Email", form_org: "Організація", form_msg: "Повідомлення"'
nl_keys = ',\n    eu_cert: "EU-Gecertificeerde Bescherming", legal_entity: "Juridische Entiteit", address: "Adres", inquiries: "Voor Aanvragen", contact: "Contact", form_name: "Naam", form_email: "E-mail", form_org: "Organisatie", form_msg: "Bericht"'

content = content.replace('series_c_d3: "Wide entry points for masses"\n  },\n  pl: {', f'series_c_d3: "Wide entry points for masses"{en_keys}\n  }},\n  pl: {{')
content = content.replace('series_c_d3: "Szerokie wejścia dla tłumów"\n  },\n  uk: {', f'series_c_d3: "Szerokie wejścia dla tłumów"{pl_keys}\n  }},\n  uk: {{')
content = content.replace('series_c_d3: "Широкі входи для натовпу"\n  },\n  nl: {', f'series_c_d3: "Широкі входи для натовпу"{uk_keys}\n  }},\n  nl: {{')
content = content.replace('series_c_d3: "Brede toegangspunten"\n  }\n};', f'series_c_d3: "Brede toegangspunten"{nl_keys}\n  }}\n}};')

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Keys added")
