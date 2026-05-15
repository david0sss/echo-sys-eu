import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('untranslated.txt', 'w', encoding='utf-8') as f:
    for i, line in enumerate(lines):
        if re.search(r'>\s*[A-Z][a-zA-Z0-9_ \-\.\,\&\/]+\s*<', line):
            f.write(f'{i+1}: {line.strip()}\n')
        if re.search(r'label=\"[A-Z][a-zA-Z0-9_ \-\.\,\&\/]+\"', line):
            f.write(f'{i+1}: {line.strip()}\n')
