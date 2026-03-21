# CLAUDE.md — Context file for AI assistants (Claude Sonnet 4.6)

> Read this file at the start of every new conversation to get full project context.
> Last updated: 2026-03-21

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
│   │   ├── spells-list.js  ← Global PF1_SPELLS_DB array (currently EMPTY — TODO)
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
| `PF1_SPELLS_DB` | `data/spells-list.js` | Array of spell definitions (empty) |
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

## 10. Known TODOs / incomplete features

1. **`PF1_SPELLS_DB`** is an empty array in `js/data/spells-list.js`. Autocomplete for spells is not yet implemented.
2. **Bloodline powers** (`rage.bloodlinePowers`) are stored in the data model but have no dedicated UI section yet.
3. **`armor.speedArmor` / `combat.speedArmor`** field exists but is not wired to `calcSpeed()` — speed reduction from armor is not subtracted automatically (the user would need to adjust the base speed manually to reflect armor penalties).
4. ~~**`character.homeland`** is stored in `meta` but has no input field in the Sommario tab.~~ ✅ **IMPLEMENTED** — `#meta-homeland` input added in Sommario tab.
5. ~~**Multiple attack sequences** (iterative attacks)~~ ✅ **IMPLEMENTED** — `calcIterativeAttacks()` returns all attack bonuses; weapon cards display `+X/+Y/+Z`.
6. **`calcFort` rage bonus** in `combat.js` has a logic bug: `rageMor = char.rage?.active ? (char.rage.willBonus ? 0 : 2) : 0` always returns 0 because `willBonus` is truthy (default 2). Fortitude should not get the rage bonus in base PF1; this was intentional but the ternary is confusing and worth clarifying.
7. **`equipment.location`** field exists but is not shown/editable in the UI (only `worn` checkbox is shown).
8. ~~**Spell details** `prepared` missing from UI~~ ✅ **IMPLEMENTED** — `prepared` checkbox added to each spell entry header. Other fields (`subschool`, `descriptor`, `components`, `target`, `spellResistance`) still not in UI.

### Medium priority (now implemented)

- ✅ **Skills list** — removed `Concentrazione` (not a PF1 skill) and `Falsificare` (absorbed into Linguistica); added `Esibizione`, `Travestimento`, `Conoscenze (ingegneria)`. Old entries in saved character `skills` arrays remain stored but won't render.
- ✅ **Patria** — `char.meta.homeland` now has input `#meta-homeland` in the Sommario tab.
- ✅ **Velocità extra** — `char.combat.speedExtra` object with `nuoto`, `volo`, `scalare`, `scavare` (all 0 = inactive). Four numeric inputs in the combat tab below BAB/Initiative/Speed. Not used in calculations — reference only.
- ✅ **Stato vitale** — colored badge `#hp-status` below the HP row: Normale (verde) / Disabilitato a 0 PF (arancio) / Morente < 0 PF (rosso) / Morto ≤ -CON (grigio). `hp-current` input now allows negative values. Updated in `refreshCalculated`.
- ✅ **Preparato** — `prepared: boolean` checkbox in each spell entry header; bound in `_bindSpells` via `e.target.checked`.

- ✅ **Resistenza agli Incantesimi (RI)** — `char.combat.sr` (number, 0 = nessuna). UI field `#sr-input` in the DR/immunities section of the combat tab. Stored in `calcAll()` output as `sr`.
- ✅ **Livelli Negativi** — `char.negativeLevels` (number, root level). UI field `#negative-levels` in the HP section. Each level applies a cumulative `-1` penalty to attack rolls (via `calcWeaponAttack` and `calcIterativeAttacks`), CMB, CMD, all three saving throws, and initiative. Implemented via `negLvlPenalty(char)` helper in `combat.js`.
- ✅ **Attacchi Iterativi** — `Combat.calcIterativeAttacks(char, weapon, powerAttack)` returns an array of total attack bonuses for each iterative attack (BAB 1-5 → 1 attack, 6-10 → 2, 11-15 → 3, 16+ → 4). Off-hand and natural secondary weapons return only one value. Weapon cards display the full sequence as `+13/+8/+3`.
- ✅ **Adattamento UI per classe** — `ClassConfig` global (33 classi PF1 con profili UI) in `js/data/classes-config.js`. Selezione classe nel modal di creazione. `applyClassProfile(char)` in `ui.js` nasconde/mostra tab Incantesimi, blocco Ira, e tab primarie in base alla classe. Supporto multiclasse via `getMergedProfile`. Vedi Sezione 16 per dettagli completi.
- ✅ **Blocchi risorse di classe** — Implementati i 4 blocchi ad alta priorità nel tab Sommario:
  - `#bard-block` (Bardo, Skald): round esibizione rimasti/totali (auto-calc: `4 + (lvl−1)×2 + CHA`), bonus manuale, testo esibizione attiva, pulsante ripristino
  - `#ki-block` (Monaco, Ninja): ki attuali/totali (auto-calc: Monaco→`⌊lvl/2⌋+SAG`, Ninja→`⌊lvl/2⌋+CAR`), bonus manuale, pulsante ripristino
  - `#channel-block` (Chierico, Paladino, Inquisitore, Guardiamarca): tipo (positiva/negativa), dado Xd6, usi rimasti/totali manuali, pulsante ripristino
  - `#sneak-block` (Ladro, Ninja, Spia, Inquisitore, Vigilante, Attaccabrighe, Schermagliatore): dado auto-calc (`⌈livelli_furtivo/2⌉d6`), bonus manuale d6
  - Nuove funzioni in `combat.js`: `calcBardPerfMax`, `calcKiMax`, `calcSneakDice` (tutte esportate e incluse in `calcAll`)
  - Nuovi campi dati in `character.js` `createDefault()`: `bardPerf`, `ki`, `channel`, `sneak`
- ✅ **Autocompletamento nome classe** — Il campo `cls-name` (tab Sommario, lista classi) ha `list="class-datalist"`. Il `<datalist id="class-datalist">` viene popolato con tutti i 33 nomi classe all'avvio via `_initClassDatalist()`. Quando l'utente sceglie una classe riconosciuta, il campo `Dado Vita` si auto-compila con il hitDie corretto da ClassConfig.
- ✅ **Abilità di classe evidenziate** — `ClassConfig.CLASS_SKILLS` mappa ogni classe ai suoi skill IDs standard PF1. `getMergedProfile` calcola `classSkillIds: string[]` (unione per multiclasse). `applyClassProfile` aggiorna `_classSkillIds` e chiama `_applySkillHighlights()`. Le righe matching nel tab Abilità ricevono `.skill-from-class`: bordo gold a sinistra + nome in grassetto dorato. `renderAbilita` richiama `_applySkillHighlights()` ad ogni re-render. Tutti i pulsanti usano `<i class="fa-solid fa-*">`. Regola: `.btn i { pointer-events: none }`. Espansione spell con animazione chevron.
- ✅ **Burger menu** — Tab navigation diventa dropdown burger a `≤540px`. Mostra label del tab attivo. Chiude al click esterno.
- ✅ **Mobile responsiveness** — `main.css` responsive breakpoints a 768px/480px; `character.css` adattamenti mobile; `.skills-table-wrapper` overflow-x scroll.
- ✅ **skillPts in ClassConfig** — tutte le 33 classi hanno `skillPts: N` (punti abilità base per livello prima del mod INT). Valori: Barbaro 4, Bardo 6, Chierico 2, Druido 4, Guerriero 2, Ladro 8, Mago 2, Monaco 4, Paladino 2, Ranger 6, Stregone 2, Alchimista 4, Cavaliere 4, Convocatore 2, Fattucchiera 2, Inquisitore 6, Magus 2, Morfico 4, Oracolo 4, Pistolero 4, Vigilante 4, Antipaladino 2, Ninja 8, Samurai 4, Arcanista 2, Attaccabrighe 4, Cacciatore 6, Iracondo di Stirpe 4, Guardiamarca 4, Schermagliatore 4, Sciamano 4, Skald 6, Spia 6.
- ✅ **skills.js usa ClassConfig.skillPts** — `calcSkillPointsSummary` richiama `_skillPtsForClass(className)` che usa `ClassConfig.findByName(cls).skillPts`; fallback su un dict statico interno con tutti i 33 valori nel caso ClassConfig non sia disponibile.
- ✅ **BAB auto-fill** — `_autoFillBab(char)` in `ui.js` somma la progressione BAB di ogni classe: `full`→+1/livello, `3_4`→`⌊lvl×3/4⌋`, `half`→`⌊lvl/2⌋`. Imposta `char.combat.bab`, aggiorna `bab-input`, chiama `refreshCalculated` e `renderArmi`. Viene chiamato dentro `applyClassProfile` se almeno una classe è riconosciuta.
- ✅ **Spell ability/class auto-fill** — `_autoFillSpellAbility(char)` in `ui.js` legge `spellAbility` dalla prima classe che ha incantesimi e imposta il select `spell-ability` e il campo `spell-class`. Il riempimento avviene solo se i campi sono correntemente vuoti (nessuna sovrascrittura dei valori inseriti dall'utente).
- ✅ **Channel uses auto-calc** — `_autoFillChannelUses(char)` in `ui.js` calcola `usesMax = max(1, 3 + modCHA)` e aggiorna `channel-uses-left` solo se non è stato modificato manualmente (check conservativo: `usesMax === usesLeft || usesMax === 3`). Viene chiamato solo se `profile.features.channel` è truthy.
- ✅ **Prevenzione duplicati classi** — Il handler `cls-name change` in `ui.js` confronta (case-insensitive) il nome inserito con tutte le altre righe classe. Se trova un duplicato, applica la CSS class `.input-warning` al campo e imposta un tooltip con messaggio d'avviso. `input.input-warning` in `character.css`: bordo arancio `#e07c00` + sfondo scuro `#2a1800`.

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

### Sviluppi futuri per classi:
- ~~Sezioni specifiche per classe (es. Esibizione Bardica, Canalizzare Energia, Ki Pool, Patti del Paladino)~~ ✅ **IMPLEMENTATO** — 4 blocchi risorsa nel tab Sommario
- ~~Auto-completamento del nome classe nell'input `cls-name` con lookup da ClassConfig~~ ✅ **IMPLEMENTATO** — datalist + auto-hitDie
- ~~Filtro abilità di classe automatico basato sulla classe del personaggio~~ ✅ **IMPLEMENTATO** — evidenziazione `.skill-from-class`
- **Icona classe nel header del personaggio** — `ClassConfig.CLASSES[].icon` è già presente ma non usata nell'header
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
- **Icons**: use **Font Awesome 6 Free Solid** (`fa-solid fa-*`) for all new buttons and UI elements. The CDN link is in `index.html`. Do NOT use emoji or HTML entity characters for UI icons. Icon reference: home=`fa-house`, save=`fa-floppy-disk`, export=`fa-file-export`, import=`fa-file-import`, add=`fa-plus`, delete/remove=`fa-trash` or `fa-xmark`, expand=`fa-chevron-down`.
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

### 2026-03-21

- **Spell slot grid horizontal overflow** — At ≤480px the `spells-per-day-grid` used `repeat(5, 1fr)` but the inputs forced each cell to ≥90px, causing the page to overflow and appear scrolled. Fix: (a) removed inline `style="width:40px"` from both inputs in `renderIncantesimi`, replaced with class `spell-slot-input`; (b) in character.css added `.spell-slot-input { width: 40px; padding: 0.25em 0.3em; }` as base style; (c) at ≤480px: `repeat(4, 1fr)`, `.spell-slot-input { width: 30px; padding: 0.1em 0.12em; font-size: 0.8rem; }`, reduced box padding and row gap.

- **Power Attack block** (`#power-attack-block`) — Was hardcoded visible in `index.html`. Fixed: added `id="power-attack-block"` and `hidden` class; `renderArmi()` in `ui.js` shows the block only when `char.feats` contains a feat with name "Attacco Poderoso" (case-insensitive, whitespace-normalized). Power Attack is NOT automatically granted at BAB +1 — it must be explicitly chosen as a feat.

- **Class profile residue** (rage-block, wrong sections on Fattucchiera) — `getMergedProfile([])` returned `{ rage: true }` as default. Fixed: returns `{ hasSpellsTab: false, primaryTabs: [], features: {}, classSkillIds: [] }` for empty or blank class name arrays. Also `rage-block` now starts `hidden` in HTML.

- **Sticky nav on mobile** — `position: sticky` was only on `.char-header`, not including conditions banner and tab-nav. Fixed: new wrapper `<div class="char-top-bar">` containing all three elements; sticky rule moved to `.char-top-bar`.

- **`updateStorageBar` TypeError** — `u.used` and `u.total` don't exist; `Storage.getStorageUsage()` returns `{ usedKB, totalKB, percent }`. Fixed in `app.js`.

- **`_classSkillIds` ReferenceError** — Variable used in `_applySkillHighlights()` but never declared at module level. Fixed: added `let _classSkillIds = [];` to ui.js module state section.
