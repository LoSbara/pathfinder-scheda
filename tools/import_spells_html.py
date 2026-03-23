#!/usr/bin/env python3
"""
import_spells_html.py

Importa tutti gli incantesimi da spell_full/Updated 31Mar2020.html
e genera un nuovo js/data/spells-list.js.

Strategia:
- Parsing HTML export Google Sheets (~2900 voci)
- Conversione: nomi scuola → italiano, classi → IDs italiani
- Descrizioni in inglese (short_description se disponibile)
- Merge con DB italiano esistente (mantenuto as-is)
- Ordinamento per livello minimo poi alfabetico
"""

import os, re, unicodedata
from html.parser import HTMLParser
from collections import defaultdict

BASE = os.path.dirname(__file__)
HTML_PATH = os.path.join(BASE, '../spell_full/Updated 31Mar2020.html')
OUT_PATH  = os.path.join(BASE, '../js/data/spells-list.js')

# ── Mappings ──────────────────────────────────────────────────────────────

SCHOOL_IT = {
    'abjuration':   'Abiurazione',
    'conjuration':  'Congiunzione',
    'divination':   'Divinazione',
    'enchantment':  'Ammaliamento',
    'evocation':    'Evocazione',
    'illusion':     'Illusione',
    'necromancy':   'Necromanza',
    'transmutation':'Trasmutazione',
    'universal':    'Universale',
}

# HTML column name → list of Italian class IDs
# wiz maps to both mago AND arcanista (same spell list in PF1)
CLASS_MAP = {
    'sor':                ['stregone'],
    'wiz':                ['mago', 'arcanista'],
    'cleric':             ['chierico'],
    'druid':              ['druido'],
    'ranger':             ['ranger'],
    'bard':               ['bardo'],
    'paladin':            ['paladino'],
    'alchemist':          ['alchimista'],
    'summoner_unchained': ['evocatore'],
    'witch':              ['strega'],
    'inquisitor':         ['inquisitore'],
    'oracle':             ['oracolo'],
    'magus':              ['magus'],
    'bloodrager':         ['sangreselvaggio'],
    'shaman':             ['sciamano'],
    'skald':              ['skald'],
    'hunter':             ['cacciatore'],
    'investigator':       ['investigatore'],
    'psychic':            ['psionico'],
    'medium':             ['medium'],
    'mesmerist':          ['mesmerista'],
    'occultist':          ['occultista'],
    'spiritualist':       ['spiritualista'],
    # excluded: summoner (unchained only), adept (NPC), antipaladin, deity
}

# ── HTML Parser ────────────────────────────────────────────────────────────

class SheetParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows = []
        self._row = None
        self._cell = None

    def handle_starttag(self, tag, attrs):
        if tag == 'tr':
            self._row = []
        elif tag in ('td', 'th') and self._row is not None:
            self._cell = ''

    def handle_data(self, data):
        if self._cell is not None:
            self._cell += data

    def handle_endtag(self, tag):
        if tag in ('td', 'th') and self._row is not None:
            self._row.append(self._cell.strip() if self._cell is not None else '')
            self._cell = None
        elif tag == 'tr' and self._row is not None:
            self.rows.append(self._row)
            self._row = None

# ── Helpers ────────────────────────────────────────────────────────────────

def get_cell(row, idx, default=''):
    if idx is None or idx >= len(row):
        return default
    val = row[idx].strip()
    return default if (not val or val == 'NULL') else val

def get_level_val(row, idx):
    """Returns integer level or None if absent/NULL/0-flag."""
    if idx is None or idx >= len(row):
        return None
    val = row[idx].strip()
    if not val or val == 'NULL':
        return None
    try:
        return int(val)
    except ValueError:
        return None

def js_escape(s):
    """Escape a string for use inside JS single quotes."""
    s = s.replace('\\', '\\\\')          # backslash first
    s = s.replace("'", "\\'")            # apostrophes
    s = s.replace('\r', '').replace('\n', ' ')  # flatten newlines
    s = re.sub(r'\s+', ' ', s).strip()   # collapse whitespace
    return s

def normalize_name(s):
    """Lowercase + remove accents for dedup comparison."""
    nfkd = unicodedata.normalize('NFD', s.lower())
    return ''.join(c for c in nfkd if unicodedata.category(c) != 'Mn')

def get_min_level(level_obj):
    if not level_obj:
        return 99
    return min(level_obj.values())

def sort_key_entry(e):
    return (get_min_level(e['level']), normalize_name(e['name']))

# ── Load existing Italian DB ───────────────────────────────────────────────

def load_italian_entries(path):
    """Parse existing spells-list.js and return list of raw line strings."""
    lines = open(path, encoding='utf-8').readlines()
    entries = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('{') and "name:'" in stripped:
            entries.append(stripped)
    return entries

def extract_name_from_js(entry_str):
    m = re.search(r"name:'((?:[^'\\]|\\.)*)'", entry_str)
    return m.group(1).replace("\\'", "'") if m else ''

def extract_level_from_js(entry_str):
    m = re.search(r'level:\{([^}]+)\}', entry_str)
    if not m:
        return {}
    result = {}
    for pair in m.group(1).split(','):
        pair = pair.strip()
        if ':' in pair:
            k, v = pair.split(':', 1)
            try:
                result[k.strip()] = int(v.strip())
            except ValueError:
                pass
    return result

# ── Parse HTML ─────────────────────────────────────────────────────────────

print('Parsing HTML...')
parser = SheetParser()
html_content = open(HTML_PATH, encoding='utf-8').read()
parser.feed(html_content)
del html_content  # free memory
print(f'  Total rows parsed: {len(parser.rows)}')

# Row 0 = column letters (A, B, ...)
# Row 1 = field names (name, school, ...)
# Row 2+ = data
if len(parser.rows) < 3:
    raise RuntimeError('Not enough rows parsed')

field_row = parser.rows[1]
field_idx = {h: i for i, h in enumerate(field_row)}

required = ['name', 'school', 'description']
for f in required:
    if f not in field_idx:
        raise RuntimeError(f'Field not found: {f}')

# ── Build HTML spell objects ───────────────────────────────────────────────

print('Building spell objects...')
html_spells = []  # list of dicts

for row in parser.rows[2:]:
    name = get_cell(row, field_idx.get('name'))
    if not name:
        continue

    school_en = get_cell(row, field_idx.get('school')).lower()
    school_it = SCHOOL_IT.get(school_en, school_en.capitalize() if school_en else '')

    subschool  = get_cell(row, field_idx.get('subschool'))
    descriptor = get_cell(row, field_idx.get('descriptor'))
    components = get_cell(row, field_idx.get('components'))
    casting    = get_cell(row, field_idx.get('casting_time'))
    range_     = get_cell(row, field_idx.get('range'))
    targets    = (get_cell(row, field_idx.get('targets')) or
                  get_cell(row, field_idx.get('area')) or
                  get_cell(row, field_idx.get('effect')))
    duration   = get_cell(row, field_idx.get('duration'))
    save       = get_cell(row, field_idx.get('saving_throw'))
    sr         = get_cell(row, field_idx.get('spell_resistance'))

    # Description: prefer short_description, fall back to description (max 300 chars)
    desc = get_cell(row, field_idx.get('short_description'))
    if not desc:
        full_desc = get_cell(row, field_idx.get('description'))
        if full_desc:
            desc = full_desc[:300].rstrip()
            if len(full_desc) > 300:
                desc += '...'

    # Build level object from per-class columns
    level_obj = {}
    for col_name, it_ids in CLASS_MAP.items():
        lv = get_level_val(row, field_idx.get(col_name))
        if lv is not None:
            for it_id in it_ids:
                # wiz → both mago and arcanista at same level
                if it_id not in level_obj:
                    level_obj[it_id] = lv
                else:
                    level_obj[it_id] = min(level_obj[it_id], lv)

    # Skip if no PC class has this spell
    if not level_obj:
        continue

    html_spells.append({
        'name':            name,
        'level':           level_obj,
        'school':          school_it,
        'subschool':       subschool,
        'descriptor':      descriptor,
        'components':      components,
        'castingTime':     casting,
        'range':           range_,
        'target':          targets,
        'duration':        duration,
        'savingThrow':     save,
        'spellResistance': sr,
        'description':     desc,
        'source':          'html',  # marker, not written to JS
    })

print(f'  HTML spells with at least one PC class: {len(html_spells)}')

# ── Load existing Italian DB ───────────────────────────────────────────────

print('Loading existing Italian DB...')
it_raw_entries = load_italian_entries(OUT_PATH)
it_names_norm = {normalize_name(extract_name_from_js(e)) for e in it_raw_entries}
print(f'  Italian entries: {len(it_raw_entries)}')

# ── Merge: keep Italian, add HTML not already in Italian ──────────────────

print('Merging...')
new_html_spells = [s for s in html_spells
                   if normalize_name(s['name']) not in it_names_norm]
print(f'  New HTML spells (not in Italian DB): {len(new_html_spells)}')
print(f'  HTML spells already covered by Italian DB (skipped): '
      f'{len(html_spells) - len(new_html_spells)}')

# ── Convert HTML spells to JS entry strings ────────────────────────────────

def spell_to_js(s):
    """Convert a spell dict to a JS object literal string (single line)."""
    def q(v):
        return "'" + js_escape(str(v)) + "'"

    level_str = '{' + ','.join(f'{k}:{v}' for k, v in sorted(s['level'].items())) + '}'

    parts = [
        f"name:{q(s['name'])}",
        f"level:{level_str}",
        f"school:{q(s['school'])}",
        f"subschool:{q(s['subschool'])}",
        f"descriptor:{q(s['descriptor'])}",
        f"components:{q(s['components'])}",
        f"castingTime:{q(s['castingTime'])}",
        f"range:{q(s['range'])}",
        f"target:{q(s['target'])}",
        f"duration:{q(s['duration'])}",
        f"savingThrow:{q(s['savingThrow'])}",
        f"spellResistance:{q(s['spellResistance'])}",
        f"description:{q(s['description'])}",
    ]
    return '{ ' + ', '.join(parts) + ' },'

html_js_entries = [spell_to_js(s) for s in new_html_spells]

# ── Combine all entries and sort ───────────────────────────────────────────

print('Sorting all entries...')

def get_min_level_from_js(entry_str):
    m = re.search(r'level:\{([^}]+)\}', entry_str)
    if not m:
        return 99
    nums = re.findall(r':(\d+)', m.group(1))
    return min(int(n) for n in nums) if nums else 99

all_entries = it_raw_entries + html_js_entries

def sort_key_js(entry_str):
    lv = get_min_level_from_js(entry_str)
    name = extract_name_from_js(entry_str)
    return (lv, normalize_name(name))

all_entries.sort(key=sort_key_js)

from collections import defaultdict
by_level = defaultdict(list)
for e in all_entries:
    by_level[get_min_level_from_js(e)].append(e)

print(f'  Total entries: {len(all_entries)}')
for lv in sorted(by_level.keys()):
    label = f'Livello {lv}' if lv < 99 else 'Vari'
    print(f'    {label}: {len(by_level[lv])}')

# ── Write output ───────────────────────────────────────────────────────────

print(f'Writing {OUT_PATH}...')

header = """/**
 * spells-list.js
 * Incantesimi PF1 — usati per autocomplete nel tab Incantesimi.
 * Quando l'utente seleziona un nome dalla lista, i dettagli vengono pre-compilati.
 *
 * window.PF1_SPELLS_DB = []
 * Ogni voce: { name, level, school, subschool, descriptor, components,
 *              castingTime, range, target, duration, savingThrow,
 *              spellResistance, description }
 * `level` è un oggetto { classeId: livello } (es. { mago:1, stregone:1 })
 *
 * Fonte: incantesimi italiani tradotti manualmente + DB inglese d20pfsrd (~2900 voci)
 */
const PF1_SPELLS_DB = [
"""

out = header
for lv in sorted(by_level.keys()):
    label = f'Livello {lv}' if lv < 99 else 'Vari'
    sep = '─' * 55
    out += f'\n  // ── {label} {sep}\n'
    for e in by_level[lv]:
        out += f'  {e}\n'
    out += '\n'
out += '];\n'

open(OUT_PATH, 'w', encoding='utf-8').write(out)
print('Done.')
