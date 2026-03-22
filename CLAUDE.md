# CLAUDE.md — Context file for AI assistants (Claude Sonnet 4.6)

> Read this file at the start of every new conversation to get full project context.
> Last updated: 2026-03-22 (sessione 2)

---

## 0. Stato corrente — aggiornare ad ogni sessione

> ⚠ Aggiornare questa sezione all'inizio/fine di ogni sessione di lavoro. È la prima cosa che l'AI deve leggere.

### Ultima sessione: 2026-03-22 (sessione 3)

**Modifiche non committate (6 file):**
- `js/data/classes-config.js` — Sistema archetipi: `ARCHETYPES` dict, `getArchetypes()`, `getMergedProfile` aggiornato
- `js/ui.js` — Righe classe a due livelli (`.class-row-main` + `.cls-archetype` con datalist)
- `styles/character.css` — Stili `.class-row`, `.class-row-main`, `.cls-archetype`
- `js/data/feats-list.js` — `PF1_FEATS_DB` **339 talenti** (espanso da 151 in sessione 2)
- `js/data/spells-list.js` — `PF1_SPELLS_DB` **251 incantesimi** (espanso da 66 in questa sessione; livelli 0–9 per tutte le classi principali)
- `CLAUDE.md` — Sessione 3: aggiornamenti stato

**Prossimo lavoro prioritario:**
1. Autocomplete talenti in `renderTalenti` in `ui.js` — usa `PF1_FEATS_DB`
2. Autocomplete incantesimi nel tab Incantesimi — usa `PF1_SPELLS_DB`
3. Commit quando c\'è abbastanza roba nuova (utente preferisce aspettare)

---

## 1. Project overview

This is a **static web application** (no build system, no backend, no framework) for creating and managing Pathfinder 1e character sheets. The campaign it was specifically built for is **"La Torre di Jacob"** — a home-brew adventure with 13 floors, and the party levels up one level per floor (level 1 on floor 1, level 13 on floor 13).

The app is meant to be opened directly in a browser by double-clicking `index.html` or served via GitHub Pages. It works entirely offline.

The UI language is **Italian** (labels, placeholder text, button names). The code comments and this file are in **English**.

---

## 2. Tech stack

| Layer | Technology |
|---|---|
| HTML | Single file: `index.html` |
| CSS | Two files: `styles/main.css`, `styles/character.css` |
| JavaScript | Vanilla JS (ES6+), module pattern via IIFEs exposing global namespaces |
| Storage | Browser `localStorage` |
| Fonts | Google Fonts: Cinzel (headers), Crimson Text (body) |
| Icons | **Font Awesome 6.7 Free** via cdnjs CDN — used throughout for all buttons and tab labels |
| Build | None — plain static files |

---

## 3. File structure

```
pathfinder-scheda/
├── index.html              ← Single HTML page, all screens and tabs are here
├── styles/
│   ├── main.css            ← CSS variables, reset, buttons, home screen, toast
│   └── character.css       ← Character sheet: header, tabs, all section styles
├── js/
│   ├── data/
│   │   ├── skills-list.js  ← Global PF1_SKILLS array (35 skills, static)
│   │   ├── spells-list.js  ← Global PF1_SPELLS_DB array (251 incantesimi, livelli 0–9)
│   │   ├── feats-list.js  ← Global PF1_FEATS_DB array (339 talenti PF1)
│   │   └── classes-config.js ← Global ClassConfig: tutte le classi PF1 con feature flags
│   ├── storage.js          ← Storage namespace: read/write/export/import via localStorage
│   ├── character.js        ← Character namespace: data model, validate, migrate
│   ├── combat.js           ← Combat namespace: all PF1 math (pure functions)
│   ├── skills.js           ← Skills namespace: skill total calculation
│   ├── ui.js               ← UI namespace: render + event binding
│   └── app.js              ← Entry point: navigation, home screen, save/export/import
└── assets/                 ← Static assets (currently empty)
```

### Script loading order (critical — defined at bottom of index.html)

```html
<script src="js/data/skills-list.js"></script>   <!-- PF1_SKILLS global -->
<script src="js/data/spells-list.js"></script>   <!-- PF1_SPELLS_DB global -->
<script src="js/data/feats-list.js"></script>    <!-- PF1_FEATS_DB global -->
<script src="js/data/classes-config.js"></script> <!-- ClassConfig global -->
<script src="js/storage.js"></script>             <!-- Storage global -->
<script src="js/character.js"></script>           <!-- Character global (needs nothing) -->
<script src="js/combat.js"></script>              <!-- Combat global (needs Character) -->
<script src="js/skills.js"></script>              <!-- Skills global (needs Combat, PF1_SKILLS) -->
<script src="js/ui.js"></script>                  <!-- UI global (needs all above) -->
<script src="js/app.js"></script>                 <!-- Entry point (needs all above) -->
```

Any new JS file must be added in the correct position in this list.

---

## 4. Architecture patterns

### Global namespaces (IIFE module pattern)
Each JS file exposes a single `const Name = (() => { ... return { ... }; })();` object. No ES modules, no imports/exports. All globals available everywhere after script loading.

| Global | File | Purpose |
|---|---|---|
| `PF1_SKILLS` | `data/skills-list.js` | Array of skill definitions |
| `PF1_SPELLS_DB` | `data/spells-list.js` | Array of spell definitions (251 incantesimi, livelli 0–9) |
| `PF1_FEATS_DB` | `data/feats-list.js` | Array of feat definitions (339 talenti) |
| `Storage` | `storage.js` | CRUD for characters in localStorage |
| `Character` | `character.js` | Data model factory + utilities |
| `Combat` | `combat.js` | Pure math functions for PF1 rules |
| `Skills` | `skills.js` | Skill total calculations |
| `UI` | `ui.js` | All rendering + event binding |

### Single active character
`app.js` maintains `let activeCharacter = null`. When a character is opened, `UI.init(character)` is called once, which renders all tabs and binds all event listeners (only once, gated by `_eventsBound` flag). After that, listeners mutate `_char` (internal pointer in `ui.js`) and call `_dirty()` to mark unsaved changes.

### Two-screen navigation
- `#screen-home` — character list (index cards)
- `#screen-character` — character sheet with 9 tabs

`.screen.active` = visible. Only one screen active at a time.

### Dirty state
`btn-save` gets class `has-changes` when there are unsaved changes. Navigating back warns the user if dirty.

---

## 5. Character data model (`character.js`)

The full object returned by `Character.createDefault(name)`:

```js
{
  id: string,              // generated with Date.now().toString(36) + random

  meta: {
    name: string,
    playerName: string,
    race: string,
    classes: [{ className, level, hitDie }],  // array — supports multiclass
    totalLevel: number,    // sum of all class levels
    alignment: string,     // e.g. 'Caotico Neutrale'
    deity: string,
    homeland: string,
    size: string,          // 'Piccolissima'|'Piccola'|'Media'|'Grande'|'Enorme'|etc.
    gender: string,
    age: string,
    height: string,
    weight: string,
    eyes: string,
    hair: string,
    languages: string[],
    imageDataUrl: string,  // base64 image or ''
    xp: number,
    background: string,
  },

  abilities: {
    // base scores
    str, dex, con, int, wis, cha: number,
    // racial modifiers (permanent)
    strRacial, dexRacial, conRacial, intRacial, wisRacial, chaRacial: number,
    // enhancement bonuses from items (don't stack — highest wins)
    strEnhance, dexEnhance, conEnhance, intEnhance, wisEnhance, chaEnhance: number,
    // temporary modifiers (conditions, situational spells)
    strTemp, dexTemp, conTemp, intTemp, wisTemp, chaTemp: number,
  },

  combat: {
    hpMax: number,
    hpCurrent: number,
    hpNonLethal: number,
    speed: number,         // meters (9m = standard human)
    speedArmor: number,    // speed reduction from armour (not yet wired to calcSpeed)
    speedExtra: {          // secondary movement (0 = not available)
      nuoto: number, volo: number, scalare: number, scavare: number,
    },
    initiative: { misc: number },
    ac: {
      armorBonus, shieldBonus, naturalArmor, deflection, dodge, misc: number,
    },
    saves: {
      fortBase, fortMisc,  // Fortitude
      refBase,  refMisc,   // Reflex
      willBase, willMisc,  // Will
    },
    bab: number,           // Base Attack Bonus (entered manually)
    cmbMisc: number,
    cmdMisc: number,
    sizeModifier: number,  // legacy field — now computed from meta.size
    dr: string,            // e.g. '5/argento'
    sr: number,            // Resistenza agli Incantesimi (0 = nessuna); UI: #sr-input
    resistances: { fuoco, freddo, elettricità, acido, sonoro: number },
    immunities: string[],
    defensiveAbilities: string,
  },

  skills: [
    {
      id: string,          // matches PF1_SKILLS[n].id
      ranks: number,
      classSkill: boolean, // +3 bonus if true and ranks >= 1
      miscBonus: number,
      notes: string,
    }
  ],

  weapons: [
    {
      id: string,
      name: string,
      attackType: 'mischia'|'distanza'|'naturale',
      enhancement: number,     // +1, +2, …
      damage: string,          // e.g. '1d8'
      critRange: string,       // e.g. '19-20'
      critMult: number,        // e.g. 2 or 3
      range: number,           // meters (0 = melee)
      damageType: string,      // 'C'|'P'|'T'|'C/P' etc.
      twoHanded: boolean,
      offHand: boolean,
      attackMisc: number,
      damageMisc: number,
      addStrToRanged: boolean, // for thrown weapons
      notes: string,
    }
  ],

  equipment: [
    {
      id: string,
      name: string,
      qty: number,
      weight: number,   // kg per unit
      cost: string,
      location: string, // 'indosso'|'zaino'|'cavalcatura'|'deposito'
      worn: boolean,
      notes: string,
    }
  ],

  armor: {
    name, type: string,      // type: 'leggera'|'media'|'pesante'|'scudo'
    bonus: number,
    maxDex: number|null,     // null = no limit
    acp: number,             // armor check penalty (negative value, e.g. -3)
    asf: number,             // arcane spell failure %
    speed: number,           // speed reduction
    weight: number,
    notes: string,
  },

  currency: { pp, gp, sp, cp: number },  // platino, oro, argento, rame

  feats: [
    {
      id: string,
      name: string,
      type: string,          // e.g. 'Combattimento', 'Generale', 'Stile'
      prerequisites: string,
      description: string,
      notes: string,
    }
  ],

  classFeatures: [
    {
      id: string,
      name: string,
      className: string,
      levelGained: number,
      description: string,
      usesPerDay: number,
      usesLeft: number,
      notes: string,
    }
  ],

  racialTraits: [
    { id: string, name: string, description: string }
  ],

  spells: {
    casterClass: string,
    casterLevel: number,
    ability: 'cha'|'int'|'wis',
    spellsPerDay: number[10],   // index = spell level 0–9
    spellsUsed:   number[10],
    known: [
      {
        id: string,
        spellLevel: number,
        name: string,
        school: string,
        subschool: string,
        descriptor: string,
        castingTime: string,
        components: string,
        range: string,
        target: string,
        duration: string,
        savingThrow: string,
        spellResistance: string,
        description: string,
        prepared: boolean,
      }
    ],
  },

  rage: {
    active: boolean,
    roundsUsed: number,
    strBonus: number,       // default 4
    conBonus: number,       // default 4
    willBonus: number,      // default 2
    acPenalty: number,      // default 2 (subtracted)
    bloodlineName: string,
    bloodlinePowers: [
      { id, name, levelRequired, description, usesPerDay, usesLeft }
    ],
  },

  conditions: string[],    // e.g. ['Accecato', 'Prono']

  negativeLevels: number,  // count of negative levels; each gives -1 to attacks/saves/checks, -5 HP max
                           // UI: #negative-levels in combat tab; applied via negLvlPenalty() in combat.js
  // health status is derived from hpCurrent vs. CON score (no stored field):
  //   > 0: Normale  |  0: Disabilitato  |  < 0: Morente  |  ≤ -CON: Morto
  //   displayed as colored badge #hp-status, updated in refreshCalculated()

  notes: string,           // free-text

  _schemaVersion: 1,
}
```

### Schema migration
`Character.migrate(char)` is called on every load from localStorage. It uses `fillMissing()` to add any fields present in `createDefault()` but missing in the saved object (non-destructive). This allows forward-compatible saves.

---

## 6. PF1 rules implemented (`combat.js`)

All functions are **pure** (no side effects). They accept the full character object and return computed values.

### Ability scores
```
effectiveScore(char, key) = base + racial + enhance + temp + morale(rage)
mod(char, key)            = floor((effectiveScore - 10) / 2)
```
Enhancement bonuses are supposed to not stack (highest wins) — currently stored as a single field per ability.

### Armor Class
```
AC normal     = 10 + armor + shield + dex + natural + deflection + dodge + size + misc + ragePenalty + condPenalty
AC touch      = 10 + dex + deflection + dodge + size + misc + ragePenalty   (no armor/shield/natural)
AC flat-footed= 10 + armor + shield + natural + deflection + size + misc + ragePenalty
              (drops dex unless character has "Schivare Prodigioso"; always drops dodge)
```
Size table uses `meta.size` string mapped to `{ cmbMod, acMod }`:
- Minuta −4 | Piccolissima −2 | Piccola −1 | **Media 0** | Grande +1 | Enorme +2 | Mastodontica +4 | Colossale +8

### Combat maneuvers
```
CMB = BAB + STR mod + size CMB mod + misc
CMD = 10 + BAB + STR mod + DEX mod + size CMB mod + misc + ragePenalty
    (DEX = 0 if Immobilizzato or Stordito)
```

### Saving throws
```
Fortitude = fortBase + CON mod + misc
Reflex    = refBase  + DEX mod + misc
Will      = willBase + WIS mod + misc + rage will bonus (if raging)
```

### Initiative
```
Initiative = DEX mod + misc
```

### Rage rounds (Bloodrager / Barbarian)
```
rounds per day = 4 + CON mod (WITHOUT rage bonus) + 2 × (level − 1)
HP bonus while raging = +2 per character level (disappear when rage ends)
```

### Power Attack (`calcPowerAttack(bab)`)
```
tiers         = floor(bab / 4)
attackPenalty = -(1 + tiers)
damageBase    = 2 × (1 + tiers)
damageTwoHand = floor(damageBase × 1.5)
damageOffHand = floor(damageBase × 0.5)
```

### Weapon attack/damage
```
Attack (melee)  = BAB + STR mod + enhancement + misc + offHandPenalty + powerAttackPenalty + condPenalty
Attack (ranged) = BAB + DEX mod + enhancement + misc
Attack (natural secondary) = BAB - 5

Damage (melee one-hand)  = STR mod             + enhancement + powerAttackBase + misc
Damage (melee two-hand)  = floor(STR × 1.5)   + enhancement + powerAttackTH   + misc
Damage (off-hand)        = floor(STR × 0.5, 0) + enhancement + powerAttackOH   + misc
Damage (ranged)          = 0 (no STR) unless weapon.addStrToRanged
```

### Speed
```
speed = base (default: 9) — halved if Esausto condition
```

### Skill points per level (reference table used by `Skills.calcSkillPointsSummary`)
```
Barbarian/Bloodrager: 4  |  Bard: 6  |  Cleric: 2  |  Druid: 4  |  Fighter: 2
Monk: 4  |  Paladin: 2  |  Ranger: 6  |  Rogue: 8  |  Sorcerer: 2  |  Wizard: 2
(+INT mod per level, minimum 1; ×4 at level 1)
```

### Skills formula
```
Total = ranks + ability_mod + class_bonus (+3 if classSkill and ranks >= 1) + ACP (if applicable) + misc
```
Skills with Armor Check Penalty (acp: true): Acrobazia, Artista della Fuga, Cavalcare, Furtività, Nuotare, Scalare, Sotterfugio, Volare.

Skills blocked during rage (unless in exception list): any skill using CHA, DEX, or INT.
Exception (always usable during rage): Acrobazia, Cavalcare, Intimidire, Volare.

---

## 7. Storage strategy (`storage.js`)

Two keys in `localStorage`:

| Key | Content |
|---|---|
| `pf1_index` | JSON array of stubs: `[{ id, name, race, classes, totalLevel, updatedAt }]` |
| `pf1_char_<id>` | JSON of the full character object |

The index allows the home screen to load fast without deserializing every character.

### Public API
```js
Storage.getAllCharacters()              // → stub[]
Storage.getCharacter(id)               // → full char or null (auto-migrated)
Storage.saveCharacter(char)            // → id (throws on QuotaExceededError)
Storage.deleteCharacter(id)            // → void
Storage.exportCharacter(id)            // → downloads <name>.pf1.json
Storage.importCharacter(file)          // → Promise<char> (File object)
Storage.importCharacterFromJson(str)   // → char (string)
Storage.getStorageUsage()              // → { usedKB, totalKB, percent }
```

Import generates a NEW id if the id already exists, preventing accidental overwrites.

---

## 8. UI architecture (`ui.js`)

### Internal state
```js
let _char = null;          // pointer to active character
let _eventsBound = false;  // ensures listeners are registered only once
let _classSkillIds = [];   // current class skill IDs for highlight (module-level, updated by applyClassProfile)
```

### Public API
```js
UI.init(char)                // Full render + bind all events (first time) or re-render
UI.refreshCalculated(char)   // Re-compute derived values (CA, TS, CMB, etc.) and update DOM
UI.renderAbilita(char)       // Re-render skills tab
UI.renderArmi(char)          // Re-render weapons tab
UI.renderEquipaggiamento(char) // Re-render equipment tab
UI.renderTalenti(char)       // Re-render feats/features/racial traits tab
UI.renderIncantesimi(char)   // Re-render spells tab
```

### Tab system
9 tabs: Sommario, Caratteristiche, Combattimento, Abilità, Armi, Equipaggiamento, Talenti, Incantesimi, Note.
Data attributes: `data-tab="sommario"` on buttons → `id="tab-sommario"` on panels. Active tab button gets `.active`; active panel gets `.active` (display: block).

### Render functions (one per tab)
Each `render*()` function reads from `_char` and writes to the DOM:
- `renderSommario` — meta fields, image, classes list
- `renderCaratteristiche` — 6 ability cards (generated dynamically), conditions checkboxes, rage block
- `renderCombattimento` — HP, AC inputs, armor, BAB, saves, CMB/CMD, DR, resistances
- `renderAbilita` — skills table (tbody generated), skill points summary
- `renderArmi` — weapon cards (generated), Power Attack helper
- `renderEquipaggiamento` — currency, weight display, equipment items
- `renderTalenti` — feats list, class features list, racial traits list
- `renderIncantesimi` — caster info, slot grid (levels 0–9), known spells list
- `renderNote` — textarea

### Event binding (`_bindAll`)
Called once. Uses event delegation on containers where possible (e.g., `skills-tbody`, `weapons-list`, `equipment-list`). Individual field bindings use `addEventListener('change', ...)`. Every handler calls `_dirty()` to mark unsaved state.

### Conditions
`PF1_CONDITIONS` array in `ui.js`:
```js
['Accecato', 'Affaticato', 'Assordato', 'Atterrito', 'Confuso',
 'Esausto', 'Fascinato', 'Immobilizzato', 'Malato',
 'Nauseato', 'Paralizzato', 'Privo di Sensi', 'Prono',
 'Spaventato', 'Stordito']
```
Active conditions shown as badge chips in `#conditions-banner` at top of character sheet.

### Carry weight table
`CARRY_LB` is a 30-entry lookup (STR 1–30) converted to kg on display. For STR > 30, values are extrapolated by multiplying base (STR 20) values by `4^((STR-20)/10)`.

---

## 9. CSS theme (`styles/main.css`)

Fantasy dark theme. Key CSS custom properties:

```css
--gold: #c8a84b          /* primary accent (borders, headings) */
--gold-light: #e8cb7a    /* hover states, active tabs */
--crimson: #8b1a1a       /* primary button background */
--parchment: #f5ead0     /* base parchment color */
--ink: #2c1d0e           /* darkest text/bg */
--bg-deep: #1a0f07       /* body background */
--bg-panel: #241609      /* header/navigation panels */
--bg-card: #2e1c0d       /* card backgrounds */
--bg-section: #332010    /* section blocks */
--bg-input: #1e1207      /* input backgrounds */
--text-main: #e8d5b0     /* main text */
--text-muted: #a08060    /* secondary/placeholder text */
--text-label: #c8a060    /* field labels */
--border: #5a3e20        /* default border */
--border-gold: #8a6b2e   /* gold border */
--rage-bg: #4a1010       /* rage block background */
--font-title: 'Cinzel', serif
--font-body: 'Crimson Text', Georgia, serif
```

---

## 10. Open TODOs

1. **`PF1_SPELLS_DB`** — **251 incantesimi** livello 0–9, buona copertura classi principali. Autocomplete UI non implementato. Vedi Sezione 19.
2. **`PF1_FEATS_DB`** — **339 talenti**, copertura completa MdG + supplementi principali. Autocomplete in `renderTalenti` non implementato. Vedi Sezione 19.
3. **Bloodline powers** (`rage.bloodlinePowers`) — dati nel model, nessuna sezione UI dedicata.
4. **`armor.speedArmor`** — campo presente in `combat`, non collegato a `calcSpeed()`. La riduzione di velocità per armatura NON viene sottratta automaticamente.
5. **`calcFort` rage bonus** — `rageMor = char.rage?.active ? (char.rage.willBonus ? 0 : 2) : 0` restituisce sempre 0 perché `willBonus` è truthy (default: 2). Comportamento corretto per PF1, ma il codice è fuorviante.
6. **`equipment.location`** — campo nel model, non visibile/modificabile in UI (solo `worn` checkbox).
7. **Spell details UI** — campi `subschool`, `descriptor`, `components`, `target`, `spellResistance` presenti nel model ma senza input nella scheda.



---

## 11. Campaign context — La Torre di Jacob

- **Adventure**: "La Torre di Jacob" — a custom 13-floor tower dungeon
- **System**: Pathfinder 1e (Golarion ITA rules)
- **Progression**: One level per floor (party starts at level 1, max level 13)
- **XP**: The app stores XP (`meta.xp`) but the campaign uses level-based progression by floor, so XP is optional
- **Reference rules**:
  - Italian: https://golarion.altervista.org/wiki/Pagina_principale
  - English: https://www.d20pfsrd.com
- **Known classes used in the campaign**: "Iracondo di Stirpe" (Bloodrager) is explicitly referenced throughout the codebase with rage/bloodline mechanics. Other standard PF1 classes are fully supported via the class profile system.

---

## 16. Sistema di Classi (ClassConfig)

File: `js/data/classes-config.js` — definisce **33 classi PF1** raggruppate per tipo:

| Tipo | Classi |
|---|---|
| Base (11) | Barbaro, Bardo, Chierico, Druido, Guerriero, Ladro, Mago, Monaco, Paladino, Ranger, Stregone |
| Avanzate (10) | Alchimista, Cavaliere, Convocatore, Fattucchiera, Inquisitore, Magus, Morfico, Oracolo, Pistolero, Vigilante |
| Alternative (3) | Antipaladino, Ninja, Samurai |
| Ibride (9) | Arcanista, Attaccabrighe, Cacciatore, Iracondo di Stirpe, Guardiamarca, Schermagliatore, Sciamano, Skald, Spia |

### API ClassConfig
- `ClassConfig.CLASSES` — array completo di tutte le classi
- `ClassConfig.CLASS_SKILLS` — dizionario `{ [classId]: string[] }` che mappa ogni ID classe ai suoi skill IDs standard PF1
- `ClassConfig.findByName(name)` — cerca una classe per nome (case-insensitive), restituisce `null` se non trovata
- `ClassConfig.getMergedProfile(classNames[])` — restituisce il profilo UI unificato per un array di classi (supporta multiclasse)

### Campi per ogni classe in `ClassConfig.CLASSES`:
- `id`, `name`, `type` — identificazione
- `hitDie` — dado vita (es. 12 per Barbaro)
- `bab` — progressione BAB: `'full'` | `'3_4'` | `'half'`
- `skillPts` — punti abilità base per livello (prima del mod INT)
- `hasSpellsTab` — se la classe usa incantesimi
- `spellAbility` — caratteristica di lancio (`'INT'` | `'SAG'` | `'CAR'` | `null`)
- `features` — flags booleani (rage, bardPerf, ki, channel, sneak, ecc.)
- `primaryTabs` — tab UI da evidenziare
- `description`, `icon` — metadati visivi

### Profilo UI restituito da `getMergedProfile`:
```js
{
  hasSpellsTab: boolean,      // se mostrare il tab Incantesimi
  primaryTabs: string[],      // tab da evidenziare (es. ['combattimento','armi'])
  classSkillIds: string[],    // unione degli skill IDs di classe per highlight
  features: {                 // flags per mostrare/nascondere sezioni specifiche
    rage: boolean,            // blocco Ira (id="rage-block")
    bardPerf: boolean,        // esibizione bardica (id="bard-block") ✅
    sneak: boolean,           // attacco furtivo (id="sneak-block") ✅
    channel: boolean,         // canalizzare energia (id="channel-block") ✅
    ki: boolean,              // riserva di ki (id="ki-block") ✅
  }
}
```

### Comportamento `applyClassProfile(char)` in `ui.js`:
1. Nasconde `.tab-btn[data-tab="incantesimi"]` e `#tab-incantesimi` se `hasSpellsTab: false`
2. Nasconde `#rage-block` se `features.rage` è falsy
3. Applica classe CSS `.tab-primary` alle tab primarie della classe
4. Se il tab incantesimi era attivo e viene nascosto → ritorna automaticamente a Sommario
5. Se la classe NON è riconosciuta (nome personalizzato) → mostra tutto (profilo di default sicuro)

### Vengono chiamate `applyClassProfile` in:
- `UI.init(char)` — al caricamento della scheda
- Ogni volta che `_bindSommario` modifica `meta.classes` (aggiunta, rimozione, cambio nome)

### Creazione nuovo personaggio con classe pre-selezionata:
- Il modal di creazione ha un `<select id="modal-char-class">` con optgroup per tipo
- Se una classe è selezionata, `app.js` pre-compila `char.meta.classes` con il hitDie corretto dalla config
- La classifica adatta subito l'UI al caricamento della scheda

### Multiclasse:
- `getMergedProfile` accetta un array di nomi e fa l'UNION di tutti i feature flags
- Se UNA QUALSIASI classe usa incantesimi → mostra tab Incantesimi
- Se UNA QUALSIASI classe usa rage → mostra blocco Ira
- I `primaryTabs` sono l'unione di tutte le tab primarie di tutte le classi

### Sviluppi futuri per classi (open):
- **Icona classe nel header del personaggio** — `ClassConfig.CLASSES[].icon` già presente ma non usata nell'header
- **Patti del Paladino** — `features.paladin` non ancora implementato come blocco UI
- **Language of UI**: Italian
- **Language of code/comments**: Italian comments for PF1 rule references, otherwise mixed Italian/English

---

## 12. Character.js public API

```js
Character.createDefault(name)     // → full character object
Character.calcAbilityMod(score)   // → floor((score - 10) / 2)
Character.generateId()            // → string (Date.now base36 + random)
Character.clone(char)             // → deep copy (JSON round-trip)
Character.validate(char)          // → { valid: bool, errors: string[] }
Character.migrate(char)           // → char (fills missing fields non-destructively)
```

---

## 13. Combat.js public API

```js
Combat.effectiveScore(char, key)     // STR/DEX/CON/INT/WIS/CHA effective value
Combat.mod(char, key)                // ability modifier
Combat.calcAC(char)                  // normal AC total
Combat.calcAC_touch(char)            // touch AC
Combat.calcAC_flatfooted(char)       // flat-footed AC
Combat.calcAC_breakdown(char)        // { total, breakdown: {...} }
Combat.calcCMB(char)                 // Combat Maneuver Bonus
Combat.calcCMD(char)                 // Combat Maneuver Defense
Combat.calcFort(char)                // { total, base, ability, misc }
Combat.calcRef(char)                 // { total, base, ability, misc }
Combat.calcWill(char)                // { total, base, ability, misc, rage }
Combat.calcInitiative(char)          // { total, dex, misc }
Combat.calcSpeed(char)               // effective speed in meters
Combat.calcACP(char)                 // armor check penalty (from char.armor.acp)
Combat.calcHpMax(char)               // HP max (adjusted for rage)
Combat.calcRageRoundsTotal(char)     // total rage rounds per day
Combat.calcRageRoundsLeft(char)      // remaining rage rounds
Combat.calcPowerAttack(bab)          // { attackPenalty, damageBonusBase, damageBonusTwoHanded, damageBonusOffHand }
Combat.calcWeaponAttack(char, weapon, powerAttack) // { total, breakdown: { bab, ability, enhancement, misc, offHand, powerAttack, conditions, negativeLevels } }
Combat.calcIterativeAttacks(char, weapon, powerAttack) // number[] — one total per iterative attack (e.g. [+8, +3] for BAB 8)
Combat.calcWeaponDamage(char, weapon, powerAttack) // { total, breakdown }
Combat.calcAll(char)                 // → all computed values in one call (used by UI)
                                     //   includes: sr, negativeLevels, fort.negativeLevels,
                                     //   ref.negativeLevels, will.negativeLevels, initiative.negativeLevels
```

---

## 14. Skills.js public API

```js
Skills.calcSkillTotal(char, skillId)   // → { total, usable, rageLocked, breakdown }
Skills.calcAllSkills(char)             // → enriched array parallel to PF1_SKILLS
Skills.calcSkillPointsSummary(char)    // → { spent, available, overflow }
```

---

## 15. Development guidelines

- **No framework, no bundler**: add code directly to the relevant JS file.
- **Pure functions in `combat.js`**: never add side effects in `combat.js` or `skills.js`. They are calculation engines.
- **UI mutations in `ui.js`**: all DOM manipulation should live in `ui.js`.
- **Data mutations**: character fields are mutated directly in event handlers inside `ui.js`, then the relevant render function is called to refresh the DOM.
- **Always call `_dirty()`** after mutating `_char` in a UI event handler.
- **Schema changes**: if you add new fields to the character model in `character.js`, also add them to `createDefault()` so `migrate()` picks them up automatically for old saves.
- **CSS**: use the CSS variables defined in `main.css`; avoid hardcoded colors.
- **Italian UI**: all user-visible text (labels, placeholders, button labels, messages) must remain in Italian.
- **XSS**: always use `_e(string)` (the XSS-escape helper in `ui.js`) before inserting user data into `innerHTML`. For `textContent` assignments this is not needed.
- **localStorage quota**: the app handles `QuotaExceededError` gracefully — always keep this check when saving.
- **Icons**: use **Font Awesome 6 Free Solid** (`fa-solid fa-*`) for all new buttons and UI elements. The CDN link is in `index.html`. Do NOT use emoji or HTML entity characters for UI icons. Icon reference: home=`fa-house`, save=`fa-floppy-disk`, export=`fa-file-export`, import=`fa-file-import`, add=`fa-plus`, delete/remove=`fa-trash` or `fa-xmark`, expand=`fa-chevron-down`. **Important**: `.btn i` has `pointer-events: none` in CSS — click events always bubble to the parent button, never bind events to the `<i>` element.
- **Mobile responsiveness**: the app is fully usable on phones. Breakpoints defined in both CSS files:
  - `768px` — tablet/phablet: toolbar wrapping, reduced padding, touch target min 40px
  - `540px` — burger menu dropdown replaces tab-nav
  - `480px` — smartphone: single-column sommario, compacted stats, skills table overflow-x scroll, spell grid 4 columns
  - `400px` — small phone: abilities grid switches to 2 columns to avoid overflow of long names like "COSTITUZIONE (COS)"
  - `360px` — very small phone: `font-size: 14px` base, tightest spacing
  - Skills table is wrapped in `.skills-table-wrapper` (`overflow-x: auto`) in the HTML
  - Touch targets: `.btn` min-height 44px, `.btn-sm` min-height 38px (WCAG guideline)
  - Spell slot inputs use class `.spell-slot-input` (NOT inline `style="width:40px"`) so they can be resized responsively

---

## 17. Bug fixes history (most recent first)

### 2026-03-22
- **Sistema Archetipi** — campo `archetype` in `meta.classes[]`, `ARCHETYPES` dict in `classes-config.js`, UI a due livelli per riga classe, `getMergedProfile` aggiornato. Vedi Sezione 18.

### 2026-03-21 (riepilogo — dettagli in git history)
- **Spell slot grid overflow mobile**: slot-input usa class `.spell-slot-input`, non `style="width:40px"` inline; grid `repeat(4,1fr)` su ≤480px.
- **Power Attack block**: `#power-attack-block` inizia `hidden`; visibile solo se `char.feats` contiene "Attacco Poderoso" (feat, NON automatico a BAB+1).
- **`getMergedProfile([])`**: ora restituisce profilo neutro (era `{ rage: true }`); `rage-block` inizia `hidden`.
- **Sticky nav mobile**: wrapper `<div class="char-top-bar">` per header + conditions banner + tab-nav.
- **`Storage.getStorageUsage()`**: restituisce `{ usedKB, totalKB, percent }` — non `.used`/`.total`.
- **`_classSkillIds`**: dichiarato `let _classSkillIds = []` a livello modulo in `ui.js`.

---

## 18. Sistema Archetipi

File: `js/data/classes-config.js`

### Modello dati
Ogni voce in `char.meta.classes` ora ha un campo opzionale:
```js
{ className: 'Guerriero', level: 5, hitDie: 10, archetype: 'Arciere' }
```
`archetype: ''` = nessun archetipo selezionato. Nessuna migrazione necessaria: i valori mancanti vengono trattati come `''` con fallback `|| ''`.

### Dati in ClassConfig
`ClassConfig.ARCHETYPES` — oggetto `{ [classId]: archetype[] }` con N archetipi per ognuna delle 33 classi.

Ogni archetipo ha:
```js
{
  id: string,              // es. 'iracondo_invulnerabile'
  name: string,            // es. 'Iracondo Invulnerabile' (usato per autocomplete + lookup)
  classSkillAdd?: string[],    // skill IDs aggiunti come abilità di classe
  classSkillRemove?: string[], // skill IDs rimossi dalle abilità di classe
  featureOverrides?: object,   // override dei feature flags (es. { bardPerf: false })
}
```

`ClassConfig.getArchetypes(classId)` — restituisce `ARCHETYPES[classId] || []`.

### UI
- Le righe classe nel tab Sommario ora hanno struttura a due livelli:
  - `.class-row-main` — flex row con [nome classe] [livello] [dado vita] [rimuovi]
  - `.cls-archetype` — input di testo sotto la riga principale, con `<datalist id="arch-list-N">` popolato con gli archetipi della classe selezionata
- Quando l'utente cambia il nome classe, la datalist degli archetipi si aggiorna automaticamente e il campo archetipo viene resettato a vuoto
- Il campo archetipo è opzionale e accetta testo libero (archetipi non catalogati)

### getMergedProfile — aggiornamento
Accetta ora sia `string[]` (backward compat) che `{ name, archetype }[]`:
- Dopo aver calcolato `classSkillIds` base, applica `classSkillAdd/Remove` dall'archetipo selezionato
- Dopo aver calcolato `features`, applica `featureOverrides` dall'archetipo (es. `{ bardPerf: false }` per "Possessore di Segreti")

### applyClassProfile — aggiornamento
Ora passa `{ name: c.className, archetype: c.archetype || '' }` invece di semplici string al `getMergedProfile`.

### Aggiungere nuovi archetipi
Modificare `ARCHETYPES` in `classes-config.js`. Solo i campi che differiscono dalla classe base devono essere specificati. Archetipi senza override funzionano solo come etichette (autocomplete, visualizzazione).

---

## 19. Architettura Dati — Database di Riferimento PF1

### Strategia scelta
Dati di riferimento statici (talenti, incantesimi, abilità) → **file JS globali** caricati come `<script>` in `index.html`. Nessun backend, nessun database cloud per i dati di regola. Questa scelta è motivata da:
- L'app è statica (GitHub Pages, nessun server)
- I dati di riferimento PF1 non cambiano mai
- Un database cloud (Supabase, Turso, ecc.) richiederebbe auth token nel client JS → rischio sicurezza

### Dati personaggio (caratterizzazione futura)
- **Per ora**: `localStorage` (già implementato)
- **In futuro (opzionale)**: Supabase per sincronizzazione cross-device se il giocatore lo richiede

### File dati presenti

#### `js/data/feats-list.js` — `PF1_FEATS_DB`
- **Fonte**: https://golarion.altervista.org/wiki/Database_Talenti (scraping effettuato in sessione 2)
- **Contenuto**: **339 talenti** PF1 in italiano, organizzati per tipo
- **Schema**:
  ```js
  { name: string, type: string, prerequisites: string, benefit: string, source: string }
  ```
- **Tipi inclusi**: Generali, Combattimento, Metamagia, Critico, Stile, Incanalare Energia, Squadra, Eroici, Trama
- **Abbreviazioni source**: MdG=Manuale di Gioco | GdG=Guida del Giocatore | GC=Guida al Combattimento | GM=Guida alla Magia | GCl=Guida alle Classi | GR=Guida alle Razze | UI=Ultimate Intrigue | AO=Avventure Occulte | GCa=Guida alla Campagna | VC=Villain Codex | AG=Adventurer\'s Guide | AM=Avventure Mitiche | UW=Ultimate Wilderness
- **Stato**: 339/~700+ PF1. Buona copertura del MdG e dei supplementi principali. Sufficiente per la campagna.
- **Da fare**: implementare autocomplete UI nel tab Talenti (usa `PF1_FEATS_DB`).

#### `js/data/spells-list.js` — `PF1_SPELLS_DB`
- **Fonte**: Dati scritti da conoscenza PF1 in sessione 3 (golarion.altervista.org/wiki/Database_Incantesimi — fetch fallito; d20pfsrd.com/magic/tools/spells-db — bloccato da Google Sheets)
- **Stato**: **251 incantesimi** livelli 0–9, tutte le classi principali (Mago, Stregone, Arcanista, Chierico, Oracolo, Sciamano, Druido, Bardo, Paladino, Ranger, Inquisitore, Alchimista, Magus, Skald).
- **Schema**: `{ name, level, school, subschool, descriptor, components, castingTime, range, target, duration, savingThrow, spellResistance, description }`
- **`level`** è un oggetto `{ classId: livello }` es. `{ mago:3, stregone:3, arcanista:3 }`
- **Da fare**: implementare autocomplete UI nel tab Incantesimi (usa `PF1_SPELLS_DB`)

#### `js/data/skills-list.js` — `PF1_SKILLS`
- Completo. Lista di tutte le abilità PF1 con metadati.

### Ordine di caricamento script
Vedi Sezione 3. I file `data/` vanno sempre prima di `classes-config.js`.

### TODO dati
- [x] Completare `PF1_FEATS_DB` — FATTO (339 talenti in sessione 2)
- [x] Completare `PF1_SPELLS_DB` — FATTO (251 incantesimi in sessione 3; livelli 0–9)
- [ ] Implementare autocomplete nel tab Talenti (usa `PF1_FEATS_DB`)
- [ ] Implementare autocomplete nel tab Incantesimi (usa `PF1_SPELLS_DB`)
- [ ] Fetch Database_Incantesimi/Database_Talenti per aggiornare dati (attualmente bloccati)
