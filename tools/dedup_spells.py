#!/usr/bin/env python3
"""
dedup_spells.py v2 — Matching per nome (IT→EN) come filtro primario.

Algoritmo:
  1. Nome: traduzione token IT→EN, overlap con nome inglese  (peso 60%)
  2. Struttura: scuola + livelli + range + componenti           (peso 40%)
  3. Matching 1:1 (bipartito greedy)

Soglie:
  ≥ 0.55 → rimosso automaticamente (tenuta versione italiana)
  0.35–0.55 → borderline → richiede revisione manuale

Usa:
  python3 tools/dedup_spells.py            # applica modifiche
  python3 tools/dedup_spells.py --dry-run  # solo stampa, nessuna modifica
"""

import re, os, sys
from collections import defaultdict

DRY_RUN = '--dry-run' in sys.argv

BASE = os.path.dirname(__file__)
PATH = os.path.join(BASE, '../js/data/spells-list.js')

# ── Helpers ────────────────────────────────────────────────────────────────

def parse_entry(e):
    def get(pat):
        m = re.search(pat, e)
        return m.group(1).replace("\\'", "'") if m else ''
    name   = get(r"name:'((?:[^'\\]|\\.)*)'")
    school = get(r"school:'((?:[^'\\]|\\.)*)'")
    range_ = get(r"range:'((?:[^'\\]|\\.)*)'")
    comp   = get(r"components:'((?:[^'\\]|\\.)*)'")
    dur    = get(r"duration:'((?:[^'\\]|\\.)*)'")
    desc   = get(r"description:'((?:[^'\\]|\\.)*)'")
    level  = {}
    lm = re.search(r'level:\{([^}]+)\}', e)
    if lm:
        for pair in lm.group(1).split(','):
            if ':' in pair:
                k, v = pair.split(':', 1)
                try: level[k.strip()] = int(v.strip())
                except: pass
    return {'name': name, 'school': school.lower(), 'range': range_,
            'comp': comp, 'dur': dur, 'level': level, 'desc': desc, 'raw': e}

IT_MARKERS = ['azione standard', "un'azione standard",
              'round/livello', 'minuto/livello', 'ora/livello',
              'Istantanea', 'istantanea',
              'Concentrazione', 'concentrazione',
              'Permanente', 'permanente']

def is_italian(e):
    return any(m in e for m in IT_MARKERS)

def base_comps(s):
    s = s.upper().replace('M/DF', 'MΨ').replace('D/F', 'DF').replace('DF', 'Ψ')
    return frozenset(re.findall(r'\b(V|S|M|F|Ψ)\b', s))

def norm_range(r):
    r = r.lower().strip()
    if 'close' in r or 'corta' in r:                          return 'close'
    if 'medium' in r or r.startswith('media'):                return 'medium'
    if 'long'   in r or r.startswith('lunga'):                return 'long'
    if r in ('touch','tocco') or r.startswith(('tocco','touch')): return 'touch'
    if r.startswith('personal') or r == 'personale':          return 'personal'
    if r in ('0','0 m','0m','0 ft','0 ft.'):                  return 'personal'
    if 'unlimited' in r or 'illimitat' in r:                  return 'unlimited'
    if 'see text' in r or 'vedi test' in r:                   return 'see_text'
    if 'special'  in r or 'speciale'  in r:                   return 'special'
    if 'cone' in r or 'cono' in r:                            return 'cone'
    return r[:15]

# ── Italian → English token translation map ───────────────────────────────
# None = parola da ignorare (articoli, preposizioni)
_IGNORE = {
    'di','del','della','delle','dei','degli','dagli','il','la','le','lo',
    'i','gli','un','una','l','d','dal','dai','da','in','con','su','per',
    'tra','fra','senza','non','e','o','a','ai','alle','al','allo','sulle',
    'sulla','sui','sul','nell','nella','nelle','nei','che','si','se',
    'ma','ed','od','ad','ne','ci','vi','li','li',
}

IT_TO_EN = {
    # Elementi / Energie
    'acido':        ['acid'],
    'acqua':        ['water'],
    'aria':         ['air', 'wind'],
    'caldo':        ['heat', 'fire'],
    'calore':       ['heat', 'warmth'],
    'cenere':       ['ash', 'cinders'],
    'freddo':       ['cold', 'frost', 'ice'],
    'fumo':         ['smoke'],
    'fuoco':        ['fire', 'flame', 'fireball'],
    'gelo':         ['frost', 'freeze', 'freezing'],
    'ghiaccio':     ['ice', 'frost'],
    'fulmine':      ['lightning', 'bolt'],
    'folgore':      ['lightning', 'bolt'],
    'lampo':        ['flash', 'bolt', 'lightning'],
    'pietra':       ['stone', 'rock', 'earth'],
    'roccia':       ['rock', 'stone'],
    'soffio':       ['breath'],
    'respiro':      ['breath'],
    'suono':        ['sound', 'sonic'],
    'terra':        ['earth', 'stone', 'ground'],
    'tuono':        ['thunder'],
    'tonante':      ['thundering', 'thunder'],
    'vento':        ['wind', 'gust'],
    # Luce / Buio
    'bagliore':     ['flare', 'dazzle'],
    'buio':         ['darkness', 'dark'],
    'danzanti':     ['dancing', 'dance'],
    'fiaccola':     ['torch', 'light'],
    'fiaccole':     ['lights', 'torches', 'torch'],
    'luce':         ['light'],
    'luci':         ['lights'],
    'luna':         ['moon'],
    'nebbia':       ['fog', 'mist'],
    'notte':        ['night', 'darkness'],
    'nuvola':       ['cloud'],
    'nube':         ['cloud'],
    'oscurità':     ['darkness', 'dark'],
    'sole':         ['sun', 'solar'],
    'solare':       ['solar', 'sun', 'sunburst'],
    # Forme geometriche / Proiettili
    'cono':         ['cone'],
    'dardo':        ['missile', 'dart', 'arrow'],
    'esplosione':   ['explosion', 'blast', 'burst'],
    'freccia':      ['arrow', 'bolt'],
    'globo':        ['globe', 'orb', 'ball'],
    'implosione':   ['implosion'],
    'meteora':      ['meteor'],
    'meteore':      ['meteors'],
    'palla':        ['ball', 'fireball', 'orb'],
    'palle':        ['balls', 'orbs'],
    'raggio':       ['ray', 'beam'],
    'sfera':        ['sphere', 'orb', 'ball'],
    # Corpo
    'braccio':      ['arm'],
    'carne':        ['flesh', 'body'],
    'dita':         ['fingers'],
    'dito':         ['finger'],
    'mano':         ['hand'],
    'occhi':        ['eyes'],
    'occhio':       ['eye'],
    'ossa':         ['bones'],
    'osso':         ['bone'],
    'pelle':        ['skin', 'bark'],
    'sangue':       ['blood'],
    # Magia / Incantesimi
    'accecante':    ['blinding', 'blind'],
    'ammaliamento': ['charm', 'enchantment'],
    'ammaliare':    ['charm', 'enchant', 'fascinate'],
    'deviare':      ['deflect', 'deflection'],
    'disgiunzione': ['disjunction'],
    'incantesimi':  ['spells'],
    'incantesimo':  ['spell'],
    'magica':       ['magic', 'magical'],
    'magico':       ['magic', 'magical'],
    'scudo':        ['shield'],
    'simulacro':    ['simulacrum'],
    'stasi':        ['stasis'],
    # Protezione / Resistenza
    'barriera':     ['barrier', 'wall'],
    'difesa':       ['defense', 'protect'],
    'muro':         ['wall'],
    'protezione':   ['protection', 'protect'],
    'resistenza':   ['resistance', 'resist', 'endure'],
    'resistere':    ['resist', 'endure'],
    # Effetti su creature
    'bloccare':     ['hold', 'block'],
    'cecità':       ['blindness', 'blind'],
    'charme':       ['charm'],
    'dominare':     ['dominate', 'domination'],
    'fantasma':     ['phantom', 'ghost'],
    'frastornare':  ['stagger', 'daze'],
    'gabbia':       ['cage', 'prison'],
    'illusione':    ['illusion'],
    'invisibile':   ['invisible', 'invisibility'],
    'invisibilità': ['invisibility'],
    'legame':       ['bond', 'binding'],
    'ninna':        ['sleep', 'lullaby'],
    'nanna':        ['sleep', 'lullaby'],
    'ombra':        ['shadow'],
    'paralizzare':  ['paralyze', 'paralysis'],
    'paura':        ['fear'],
    'sonno':        ['sleep'],
    'sordità':      ['deafness', 'deaf'],
    'stordire':     ['stun', 'daze'],
    'terrore':      ['fear', 'terror'],
    'visione':      ['vision', 'dream'],
    'sogno':        ['dream'],
    # Cura / Danno
    'cura':         ['cure', 'heal', 'healing'],
    'danno':        ['damage', 'harm'],
    'danneggiare':  ['damage', 'harm', 'disrupt'],
    'ferita':       ['wound', 'injury'],
    'ferite':       ['wounds'],
    'guarigione':   ['healing', 'cure'],
    'guarire':      ['cure', 'heal'],
    'nonmorti':     ['undead'],
    'veleno':       ['poison', 'venom'],
    'veleni':       ['poison'],
    'sanguinare':   ['bleed'],
    # Morte / Resurrezione
    'morte':        ['death', 'dead', 'kill'],
    'morti':        ['dead', 'undead'],
    'mortale':      ['kill', 'death', 'deadly'],
    'resurrezione': ['resurrection', 'raise', 'resurrect'],
    'simbolo':      ['symbol'],
    # Mente / Spirito
    'mente':        ['mind', 'mental'],
    'pensiero':     ['thought', 'mind'],
    # Divinazione
    'divinazione':  ['divination'],
    'guida':        ['guidance', 'guide'],
    'individuare':  ['detect', 'locate'],
    'rilevare':     ['detect', 'locate'],
    'scrutare':     ['scry', 'scrying'],
    # Evocazione / Creazione
    'creare':       ['create', 'creation'],
    'creazione':    ['creation', 'create'],
    'elementale':   ['elemental'],
    'evocare':      ['summon', 'call', 'evoke'],
    'strumento':    ['instrument'],
    'animale':      ['animal'],
    'animali':      ['animals'],
    'bestia':       ['beast', 'animal'],
    'bestie':       ['beasts', 'animals'],
    'mostro':       ['monster'],
    'mostri':       ['monsters'],
    'ragnatela':    ['web'],
    'ragno':        ['spider'],
    # Trasformazione / Trasmutazione
    'cambiamento':  ['change', 'shapechange'],
    'forma':        ['form', 'shape'],
    'metamorfosi':  ['metamorphosis', 'polymorph'],
    'mutare':       ['morph', 'transform', 'polymorph'],
    'trasformarsi': ['polymorph', 'transform'],
    # Viaggio / Portali
    'aprire':       ['open', 'opening'],
    'arresto':      ['stop', 'halt', 'arrest'],
    'camminare':    ['walk', 'pass'],
    'catena':       ['chain'],
    'chiudere':     ['close', 'closing'],
    'dimensionale': ['dimensional', 'dimension'],
    'gravità':      ['gravity'],
    'imprigionamento': ['imprisonment', 'imprison'],
    'inversione':   ['reverse', 'reversal'],
    'labirinto':    ['maze'],
    'levitare':     ['levitate'],
    'levitazione':  ['levitation'],
    'libertà':      ['freedom'],
    'passo':        ['step', 'walk', 'pass'],
    'passi':        ['steps', 'walk'],
    'porta':        ['door', 'gate'],
    'portale':      ['gate', 'portal'],
    'rallentare':   ['slow'],
    'stabilizzare': ['stabilize'],
    'teletrasporto':['teleport'],
    'tempo':        ['time', 'temporal'],
    'tracce':       ['trace', 'track'],
    'traccia':      ['trace', 'track'],
    'volo':         ['fly', 'flight'],
    'volare':       ['fly', 'flight'],
    'velocità':     ['speed', 'haste'],
    'veloce':       ['swift', 'haste'],
    # Descrittori / Qualificatori
    'autentica':    ['true', 'greater'],
    'autentico':    ['true', 'greater'],
    'maggiore':     ['greater', 'major'],
    'minore':       ['lesser', 'minor'],
    'superiore':    ['greater', 'superior'],
    # Energie, effetti speciali
    'avvizzimento': ['wilt', 'wither'],
    'banshee':      ['banshee'],
    'clone':        ['clone'],
    'drenare':      ['drain'],
    'drago':        ['dragon'],
    'dragone':      ['dragon'],
    'energia':      ['energy'],
    'furia':        ['rage', 'fury'],
    'implosione':   ['implosion'],
    'incendiaria':  ['incendiary'],
    'orrendo':      ['horrid', 'horrible'],
    'parola':       ['word'],
    'piaga':        ['plague', 'blight'],
    'polare':       ['polar', 'cold', 'ice'],
    'potere':       ['power', 'word'],
    'rammendo':     ['mending', 'mend'],
    'tocco':        ['touch'],
    'toccare':      ['touch'],
    'urlo':         ['wail', 'scream', 'cry'],
    'vampirico':    ['vampiric', 'drain'],
    'vita':         ['life'],
    # Altre descrizioni fisiche
    'gasosa':       ['gaseous', 'gas'],
    'gelido':       ['cold', 'frost', 'ice', 'freezing'],
    'debolezza':    ['enfeeblement', 'weakness', 'feeble'],
    'indebolimento':['enfeeblement', 'weakness'],
    'ardente':      ['burning', 'fire', 'flaming'],
    'bruciante':    ['burning', 'searing', 'scorching'],
    'rovente':      ['scorching', 'searing', 'burning'],
    # Persone / Creature
    'persona':      ['person'],
    'persone':      ['person', 'people'],
    'umano':        ['person', 'human'],
    'umani':        ['persons', 'humans'],
    'mostro':       ['monster'],
    'mostri':       ['monsters'],
    'mostri':       ['monsters'],
    # Magia qualificatori
    'divino':       ['divine'],
    'divina':       ['divine'],
    'oscura':       ['dark', 'evil', 'shadow'],
    'eroismo':      ['heroism', 'hero'],
    'prismatico':   ['prismatic'],
    'prismatica':   ['prismatic'],
    'invulnerabilità': ['invulnerability'],
    'ancora':       ['anchor', 'anchoring'],
    'neutralizzare':['neutralize', 'neutralization'],
    'leggere':      ['light', 'minor', 'lesser'],
    'gravi':        ['serious', 'severe'],
    'critiche':     ['critical'],
    'critici':      ['critical'],
    'moderate':     ['moderate'],
    'moderata':     ['moderate'],
    'massa':        ['mass', 'massive'],
    'gruppo':       ['sphere', 'mass', 'area'],
    'dolore':       ['pain', 'symbol'],
    # Magie di rilevamento
    'diurna':       ['daylight', 'day'],
    'arcana':       ['arcane'],
    'arcano':       ['arcane'],
    'serrature':    ['lock', 'arcane'],
    'serratura':    ['lock', 'arcane'],
    'pensieri':     ['thought', 'thoughts', 'detect'],
    'oggetti':      ['object', 'objects'],
    'direzione':    ['direction', 'detect'],
    'parlare':      ['speak', 'talk', 'communicate'],
    'sussurrante':  ['whisper', 'whispering'],
    # Razze / creature speciali
    'fatate':       ['fey'],
    'fata':         ['fey'],
    # Varie
    'scontro':      ['encounter', 'fight'],
    'esplosive':    ['explosive'],
    'esplosivo':    ['explosive'],
    'artificiale':  ['artificial', 'false'],
}

def name_score(it_name, en_name):
    """
    Token-overlap: traduce i token italiani in inglese e conta quanti
    appaiono nel nome inglese.  Ritorna un float [0, 1].
    """
    it_tokens = re.findall(r"[a-z\u00e0-\u00fc]+", it_name.lower())
    # Per i nomi inglesi composti (es. 'fireball') aggiungiamo anche i
    # sotto-token via split su radici di 4+ caratteri
    en_base = set(re.findall(r'[a-z]+', en_name.lower()))
    en_tokens = set(en_base)
    for tok in en_base:
        # split composti lunghi (es. fireball → fire+ball)
        if len(tok) >= 8:
            for l in range(4, len(tok) - 3):
                en_tokens.add(tok[:l])
                en_tokens.add(tok[l:])
        # normalizzazione suffissi comuni: flaming→flame, scorched→scorch
        if tok.endswith('ing') and len(tok) >= 6:
            en_tokens.add(tok[:-3])      # flamm
            en_tokens.add(tok[:-3] + 'e')  # flame  ← fix Flaming→flame
        if tok.endswith('ed') and len(tok) >= 5:
            en_tokens.add(tok[:-2])
            en_tokens.add(tok[:-1])      # scored→score
        if tok.endswith('er') and len(tok) >= 5:
            en_tokens.add(tok[:-2])
            en_tokens.add(tok[:-1])

    en_candidates = set()
    meaningful = 0
    for tok in it_tokens:
        if tok in _IGNORE:
            continue
        tr = IT_TO_EN.get(tok)
        if tr is not None:
            en_candidates.update(tr)
        else:
            # Parola non nel dizionario: confronto diretto (nomi propri, ecc.)
            en_candidates.add(tok)
        meaningful += 1

    if meaningful == 0:
        return 0.0
    matched = len(en_candidates & en_tokens)
    return min(1.0, matched / meaningful)


def struct_score(ital, eng):
    """Scuola + livelli + range + componenti => [0, 1]."""
    if ital['school'] != eng['school']:
        return 0.0
    il, el = ital['level'], eng['level']
    if not il:
        return 0.0
    # Contraddizioni dirette di livello
    for cls, lv in il.items():
        if cls in el and el[cls] != lv:
            return 0.0
    matches  = sum(1 for c, v in il.items() if el.get(c) == v)
    overlap  = matches / len(il)
    if overlap < 0.40:
        return 0.0
    conf = overlap * 0.55

    ri, re_ = norm_range(ital['range']), norm_range(eng['range'])
    if ri and re_:
        if ri == re_:
            conf += 0.30
        else:
            return 0.0      # range incompatibile → sicuramente spell diverso

    ic, ec = base_comps(ital['comp']), base_comps(eng['comp'])
    if ic and ec:
        if ic == ec or ic.issubset(ec):
            conf += 0.15
        elif len(ic & ec) >= max(1, len(ic) // 2):
            conf += 0.07
    return round(min(1.0, conf), 3)


def combined(ital, eng):
    ns = name_score(ital['name'], eng['name'])
    if ns < 0.15:           # senza evidenza nel nome → scarta
        return 0.0
    ss = struct_score(ital, eng)
    return round(ns * 0.75 + ss * 0.25, 3)


# Termini inglesi troppo generici da ignorare nel confronto descrizioni
_DESC_IGNORE = {
    'level', 'spell', 'target', 'creature', 'effect', 'bonus', 'round',
    'minute', 'action', 'saving', 'throw', 'damage', 'standard', 'casting',
    'range', 'caster', 'duration', 'their', 'with', 'that', 'this', 'from',
    'each', 'area', 'feet', 'touch', 'close', 'subject', 'ability', 'which',
    'within', 'point', 'points', 'receive', 'cannot', 'apply', 'similar',
    'check', 'make', 'equal', 'more', 'than', 'when', 'will', 'have',
    'also', 'what', 'must', 'your', 'them', 'need', 'long', 'time',
}


def desc_score(d_it: str, d_en: str) -> float:
    """
    Similarità descrizione language-agnostica.
    Segnali:
      1. Espressioni dado (1d6, 2d8, …) — same in IT e EN   [peso 0.60]
      2. Token inglesi lunghi (≥5 char) presenti in entrambi  [peso 0.25]
      3. Keyword IT tradotte in EN descrizione                [peso 0.15]
    """
    if not d_it or not d_en:
        return 0.5  # neutrale se mancano dati

    # 1. Dice
    dice_it = set(re.findall(r'\d+d\d+', d_it.lower()))
    dice_en = set(re.findall(r'\d+d\d+', d_en.lower()))
    if dice_it and dice_en:
        ratio = len(dice_it & dice_en) / max(len(dice_it), len(dice_en))
        # Mismatch forte (overlap < 70%) → penalità, non solo neutral
        dice_sim = ratio if ratio >= 0.70 else ratio * 0.30
    elif not dice_it and not dice_en:
        dice_sim = 0.5   # entrambi senza dadi: neutrale
    else:
        dice_sim = 0.1   # uno ha dadi, l'altro no: pessimo segnale

    # 2. Token inglesi condivisi (parole ≥5 char non generiche)
    it_words = set(re.findall(r'[a-z]{5,}', d_it.lower())) - _DESC_IGNORE
    en_words = set(re.findall(r'[a-z]{5,}', d_en.lower())) - _DESC_IGNORE
    shared = it_words & en_words
    term_sim = min(1.0, len(shared) * 0.15) if shared else 0.0

    # 3. Keyword IT tradotte presenti nella descrizione EN
    it_tokens = re.findall(r'[a-z\u00e0-\u00fc]+', d_it.lower())
    translated = set()
    for tok in it_tokens:
        tr = IT_TO_EN.get(tok)
        if tr:
            translated.update(tr)
    en_desc_words = set(re.findall(r'[a-z]+', d_en.lower()))
    kw_sim = (len(translated & en_desc_words) / max(len(translated), 1)
              if translated else 0.0)

    return round(dice_sim * 0.60 + term_sim * 0.25 + kw_sim * 0.15, 3)


# ── Carica file ───────────────────────────────────────────────────────────

raw_lines = open(PATH, encoding='utf-8').read().splitlines()
entry_lines = [(i, l.strip()) for i, l in enumerate(raw_lines)
               if l.strip().startswith('{') and "name:'" in l.strip()]

italian_entries, english_entries = [], []
for idx, raw in entry_lines:
    p = parse_entry(raw); p['line_idx'] = idx
    (italian_entries if is_italian(raw) else english_entries).append(p)

print(f'Voci italiane: {len(italian_entries)}')
print(f'Voci inglesi:  {len(english_entries)}')

# ── Matching bipartito greedy (ogni entry inglese usata al massimo 1 volta) ──

eng_by_school = defaultdict(list)
for e in english_entries:
    eng_by_school[e['school']].append(e)

candidates = []
for i, ital in enumerate(italian_entries):
    for eng in eng_by_school.get(ital['school'], []):
        c = combined(ital, eng)
        if c >= 0.30:
            candidates.append((c, i, eng))

# Ordina per (punteggio totale DESC, nome DESC): a parità di punteggio, preferisce
# la coppia con maggior similarità di nome (evita false positive strutturali)
candidates.sort(
    key=lambda x: (x[0], name_score(italian_entries[x[1]]['name'], x[2]['name'])),
    reverse=True
)

used_it, used_en = set(), set()
confirmed, borderline = [], []

for c, i_idx, eng in candidates:
    it_key = italian_entries[i_idx]['name']
    en_id  = id(eng)
    if it_key in used_it or en_id in used_en:
        continue
    used_it.add(it_key)
    used_en.add(en_id)
    ital = italian_entries[i_idx]
    ss = struct_score(ital, eng)
    # Gruppo A: nome + struttura coincidono → rimozione automatica
    if c >= 0.55 and ss > 0:
        confirmed.append((ital, eng, c, ss, 0.0))
    else:
        borderline.append((ital, eng, c, ss, 0.0))

# ── Secondo pass per Gruppo B: confronto descrizioni ─────────────────────
# Pool inglese ancora disponibile (non consumato dal Gruppo A)
used_en_a = {id(e) for _, e, _, _, _ in confirmed}
eng_avail_by_school = defaultdict(list)
for e in english_entries:
    if id(e) not in used_en_a:
        eng_avail_by_school[e['school']].append(e)

# Italiani non ancora confermati
confirmed_it_names = {it['name'] for it, _, _, _, _ in confirmed}
unmatched_it = [it for it in italian_entries if it['name'] not in confirmed_it_names]

candidates_b = []
for ital in unmatched_it:
    for eng in eng_avail_by_school.get(ital['school'], []):
        ns = name_score(ital['name'], eng['name'])
        if ns < 0.40:
            continue
        ds = desc_score(ital['desc'], eng['desc'])
        total = round(ns * 0.50 + ds * 0.50, 3)
        if total >= 0.40:
            candidates_b.append((total, ns, ds, ital, eng))

candidates_b.sort(
    key=lambda x: (x[0], x[1], x[2]),
    reverse=True
)

used_it_b, used_en_b = set(), set()
confirmed_b, borderline_b = [], []

for total, ns, ds, ital, eng in candidates_b:
    it_key = ital['name']
    en_id  = id(eng)
    if it_key in used_it_b or it_key in confirmed_it_names or en_id in used_en_b or en_id in used_en_a:
        continue
    used_it_b.add(it_key)
    used_en_b.add(en_id)
    if total >= 0.55 and ds >= 0.40:
        confirmed_b.append((ital, eng, total, ns, ds))
    else:
        borderline_b.append((ital, eng, total, ns, ds))

print(f'\nGruppo A confermati (nome+struct):   {len(confirmed)}')
print(f'Gruppo B confermati (nome+desc):     {len(confirmed_b)}')
print(f'Borderline:                          {len(borderline) + len(borderline_b)}')
print(f'Nessun match:                        {len(italian_entries) - len(confirmed) - len(confirmed_b) - len(borderline) - len(borderline_b)}')

# ── Stampa tutti i confirmed ──────────────────────────────────────────────

print('\n=== GRUPPO A (nome+struct) ===')
for it, en, c, ss, _ in confirmed:
    ns = name_score(it['name'], en['name'])
    print(f"  IT '{it['name']}' ↔ EN '{en['name']}'"
          f" | tot={c:.2f} nome={ns:.2f} struct={ss:.2f}")

print('\n=== GRUPPO B (nome+desc) ===')
for it, en, c, ns, ds in confirmed_b:
    dice_it = set(re.findall(r'\d+d\d+', it['desc'].lower()))
    dice_en = set(re.findall(r'\d+d\d+', en['desc'].lower()))
    print(f"  IT '{it['name']}' ↔ EN '{en['name']}'"
          f" | tot={c:.2f} nome={ns:.2f} desc={ds:.2f}"
          f" | dadi: {dice_it} ↔ {dice_en}")

print('\n=== BORDERLINE (non rimossi) ===')
for it, en, c, ss, _ in borderline + borderline_b:
    ns = name_score(it['name'], en['name'])
    ds = desc_score(it['desc'], en['desc'])
    ri = norm_range(it['range'])
    print(f"  IT '{it['name']}' ↔ EN '{en['name']}'"
          f" | tot={c:.2f} nome={ns:.2f} struct={ss:.2f} desc={ds:.2f}"
          f" | range={ri}")

# ── Applica (salvo in dry-run) ────────────────────────────────────────────

if DRY_RUN:
    print('\n[DRY-RUN: nessuna modifica al file]')
    sys.exit(0)

to_remove = {e['line_idx'] for _, e, _, _, _ in confirmed}
to_remove |= {e['line_idx'] for _, e, _, _, _ in confirmed_b}
print(f'\n→ Rimozione {len(to_remove)} righe inglesi...')

new = [l for i, l in enumerate(raw_lines) if i not in to_remove]
out, prev_blank = [], False
for l in new:
    blank = l.strip() == ''
    if blank and prev_blank: continue
    out.append(l); prev_blank = blank

open(PATH, 'w', encoding='utf-8').write('\n'.join(out) + '\n')
rem = sum(1 for l in out if l.strip().startswith('{') and "name:'" in l.strip())
print(f'Righe prima: {len(raw_lines)}, dopo: {len(out)}')
print(f'Voci incantesimi rimanenti: {rem}')
