#!/usr/bin/env python3
"""Ordina PF1_SPELLS_DB per livello minimo poi alfabeticamente.
Funziona solo con file in cui ogni voce è su una singola riga.
"""
import re, os, unicodedata
from collections import defaultdict

path = os.path.join(os.path.dirname(__file__), '../js/data/spells-list.js')
lines = open(path).readlines()

# Separate header, entries, and footer
header_lines = []
entry_lines = []
in_array = False
for line in lines:
    stripped = line.strip()
    if not in_array:
        header_lines.append(line)
        if stripped.startswith('const PF1_SPELLS_DB'):
            in_array = True
    elif stripped == '];':
        pass  # footer regenerated
    elif stripped.startswith('{') and "name:'" in stripped:
        entry_lines.append(stripped)
    # skip comment lines and blank lines (regenerated)

print(f'Entries trovate: {len(entry_lines)}')

def get_min_level(entry_str):
    m = re.search(r'level:\{([^}]+)\}', entry_str)
    if not m:
        return 99
    nums = re.findall(r':(\d+)', m.group(1))
    return min(int(n) for n in nums) if nums else 99

def get_name(entry_str):
    m = re.search(r"name:'((?:[^'\\]|\\.)*)'", entry_str)
    if not m:
        return ''
    return m.group(1).replace("\\'", "'")

def normalize(s):
    return ''.join(
        c for c in unicodedata.normalize('NFD', s.lower())
        if unicodedata.category(c) != 'Mn'
    )

def sort_key(entry_str):
    return (get_min_level(entry_str), normalize(get_name(entry_str)))

sorted_entries = sorted(entry_lines, key=sort_key)

levels = defaultdict(list)
for e in sorted_entries:
    levels[get_min_level(e)].append(e)

print(f'Dopo ordinamento: {len(sorted_entries)} incantesimi')
for lv in sorted(levels.keys()):
    label = f'Livello {lv}' if lv < 99 else 'Vari'
    print(f'  {label}: {len(levels[lv])} incantesimi')

# Rebuild file
out = ''.join(header_lines)
out += '\n'
for lv in sorted(levels.keys()):
    label = f'Livello {lv}' if lv < 99 else 'Vari'
    out += f'  // \u2500\u2500 {label} \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n'
    for e in levels[lv]:
        out += f'  {e}\n'
    out += '\n'
out += '];\n'

open(path, 'w').write(out)
print('Done.')
