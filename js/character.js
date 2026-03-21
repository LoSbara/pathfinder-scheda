/**
 * character.js
 * Modello dati di un personaggio Pathfinder 1e (regole Golarion ITA).
 *
 * Esporta il namespace globale `Character` con:
 *   Character.createDefault(name)   → oggetto personaggio nuovo
 *   Character.calcAbilityMod(score) → modificatore caratteristica
 *   Character.generateId()          → id univoco stringa
 *   Character.clone(char)           → deep copy
 *   Character.validate(char)        → { valid: bool, errors: [] }
 *
 * ─── REGOLE DI RIFERIMENTO ────────────────────────────────────────────────
 *  Modificatore = floor((punteggio − 10) / 2)
 *  CA normale   = 10 + armatura + scudo + Des + naturale + deflection + misc
 *  CA contatto  = 10 + Des + deflection + misc
 *  CA imprep.   = CA − Des (se Des > 0) − schivata
 *  CMB = BAB + mod FOR + bonus taglia
 *  CMD = 10 + BAB + mod FOR + mod DES + bonus taglia + misc
 *  TS Tempra    = base + mod CON + misc
 *  TS Riflessi  = base + mod DES + misc
 *  TS Volontà   = base + mod SAG + misc
 *  Iniziativa   = mod DES + misc
 *  Ira di stirpe (Iracondo): +4 FOR, +4 CON, +2 VS Volontà, −2 CA
 *                             round/giorno = 4 + mod CON + 2×(livello−1)
 * ──────────────────────────────────────────────────────────────────────────
 */

const Character = (() => {

  // ── Utility ──────────────────────────────────────────────────────────────

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /** Modificatore caratteristica PF1: floor((score − 10) / 2) */
  function calcAbilityMod(score) {
    return Math.floor(((score || 10) - 10) / 2);
  }

  /** Deep copy senza riferimenti condivisi */
  function clone(char) {
    return JSON.parse(JSON.stringify(char));
  }

  // ── Strutture di default per sotto-oggetti ───────────────────────────────

  function _defaultAbilities() {
    return {
      // Punteggi base (prima di bonus razziali o oggetti)
      str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10,
      // Bonus/penalità razziali permanenti
      strRacial: 0, dexRacial: 0, conRacial: 0,
      intRacial: 0, wisRacial: 0, chaRacial: 0,
      // Bonus di potenziamento da oggetti (es. Forza del Toro)
      strEnhance: 0, dexEnhance: 0, conEnhance: 0,
      intEnhance: 0, wisEnhance: 0, chaEnhance: 0,
      // Bonus/penalità temporanei (condizioni, incantesimi situazionali)
      strTemp: 0, dexTemp: 0, conTemp: 0,
      intTemp: 0, wisTemp: 0, chaTemp: 0,
    };
  }

  function _defaultCombat() {
    return {
      hpMax: 0,
      hpCurrent: 0,
      hpNonLethal: 0,       // danni non letali accumulati

      speed: 9,             // velocità in metri (9m = standard umano a piedi)
      speedArmor: 0,        // riduzione velocità per armatura (0 se nessuna)

      // Velocità extra (0 = il personaggio non ha quel tipo di movimento)
      speedExtra: {
        nuoto:   0,   // swim speed
        volo:    0,   // fly speed
        scalare: 0,   // climb speed
        scavare: 0,   // burrow speed
      },

      initiative: { misc: 0 },  // bonus vari all'iniziativa (Des calcolato live)

      // Classe Armatura — i bonus vengono inseriti manualmente dall'utente;
      // il totale viene calcolato da combat.js leggendo anche Des dall'abilities.
      ac: {
        armorBonus: 0,      // bonus armatura (dall'armatura indossata)
        shieldBonus: 0,     // bonus scudo
        naturalArmor: 0,    // armatura naturale (razza, talenti, incantesimi)
        deflection: 0,      // deflection (es. Anello di Protezione)
        dodge: 0,           // schivata (es. talento Schivare)
        misc: 0,            // altri bonus non categorizzati
      },

      // Tiri Salvezza — solo la parte BASE di classe; i modificatori
      // di caratteristica vengono sommati automaticamente da combat.js.
      saves: {
        fortBase: 0, fortMisc: 0,   // Tempra (base + misc)
        refBase: 0,  refMisc: 0,    // Riflessi
        willBase: 0, willMisc: 0,   // Volontà
      },

      bab: 0,       // Bonus di Attacco Base (inserito manualmente per classe)

      // CMB e CMD vengono calcolati da combat.js; qui i bonus misc aggiuntivi
      cmbMisc: 0,
      cmdMisc: 0,

      // Bonus taglia a CMB/CMD/CA (−1 Piccola, 0 Media, +1 Grande, ecc.)
      sizeModifier: 0,

      // Riduzione Danno — stringa libera es. "5/argento" o "—"
      dr: '',

      // Resistenza agli Incantesimi — valore numerico (0 = nessuna)
      sr: 0,

      // Resistenze energetiche (valori numerici)
      resistances: {
        fuoco: 0, freddo: 0, elettricità: 0, acido: 0, sonoro: 0,
      },

      // Immunità (array di stringhe)
      immunities: [],

      // Capacità speciali difensive (testo libero, es. "Schivare Prodigioso")
      defensiveAbilities: '',
    };
  }

  function _defaultSkills() {
    // Per ogni abilità di PF1_SKILLS viene creato un record.
    // Se PF1_SKILLS non è ancora caricato (ordine script), restituisce [].
    if (typeof PF1_SKILLS === 'undefined') return [];
    return PF1_SKILLS.map(s => ({
      id:         s.id,
      ranks:      0,
      classSkill: false,   // se true e ranks >= 1 → +3 bonus di classe
      miscBonus:  0,       // bonus vari (razze, talenti, oggetti)
      notes:      '',
    }));
  }

  function _defaultSpells() {
    return {
      casterClass:  '',    // es. 'Iracondo di Stirpe', 'Mago', 'Chierico'
      casterLevel:  0,
      ability:      'cha', // caratteristica di lancio: cha, int, wis
      // Slot per livello incantesimo (0–9); 0 = non disponibile
      spellsPerDay: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      spellsUsed:   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      // Incantesimi conosciuti / preparati
      known: [],
      // Struttura di uno spell:
      // { id, spellLevel, name, school, subschool, descriptor,
      //   castingTime, components, range, target, duration,
      //   savingThrow, spellResistance, description, prepared }
    };
  }

  function _defaultRage() {
    // Ira di stirpe / Furia del Barbaro
    // I round disponibili si calcolano da combat.js: 4 + mod CON + 2×(livello−1)
    return {
      active:      false,
      roundsUsed:  0,
      // Bonus morali durante l'ira (valori base PF1; modificabili per stirpi speciali)
      strBonus:    4,
      conBonus:    4,
      willBonus:   2,
      acPenalty:   2,   // penalità alla CA (sottratta)
      // Stirpe (es. 'Abissale', 'Celestiale', 'Draconica') — per poteri speciali
      bloodlineName: '',
      bloodlinePowers: [],
      // Struttura di un potere di stirpe:
      // { id, name, levelRequired, description, usesPerDay, usesLeft }
    };
  }

  // ── Costruttore principale ────────────────────────────────────────────────

  /**
   * Crea un personaggio con tutti i campi al valore di default.
   * @param {string} name - Nome del personaggio
   * @returns {object} Oggetto personaggio completo
   */
  function createDefault(name = 'Nuovo Personaggio') {
    return {
      id: generateId(),

      // ── Informazioni generali ──────────────────────────────────────────
      meta: {
        name,
        playerName:   '',
        race:         '',
        // Classi: array per supportare multiclasse
        // { className, level, hitDie }  es. { className: 'Iracondo di Stirpe', level: 6, hitDie: 10 }
        classes:      [],
        // Livello totale (somma di tutte le classi)
        totalLevel:   1,
        alignment:    '',     // es. 'Caotico Neutrale'
        deity:        '',
        homeland:     '',
        size:         'Media',
        gender:       '',
        age:          '',
        height:       '',
        weight:       '',
        eyes:         '',
        hair:         '',
        languages:    [],     // es. ['Comune', 'Infernale']
        imageDataUrl: '',     // base64 o URL immagine personaggio
        xp:           0,      // punti esperienza (opzionale, la Torre usa i livelli piano)
        background:   '',     // storia/background del personaggio
      },

      // ── Caratteristiche ───────────────────────────────────────────────
      abilities: _defaultAbilities(),

      // ── Combattimento ─────────────────────────────────────────────────
      combat: _defaultCombat(),

      // ── Abilità di abilità ────────────────────────────────────────────
      skills: _defaultSkills(),

      // ── Armi e attacchi ───────────────────────────────────────────────
      // Ogni arma è indipendente; il totale attacco/danno è calcolato da combat.js
      weapons: [],
      // Struttura di un'arma:
      // { id, name, attackType,  // 'mischia' | 'distanza' | 'naturale'
      //   enhancement,           // bonus di potenziamento (+1, +2…)
      //   damage, critRange, critMult,
      //   range,                 // gittata in metri (0 = mischia)
      //   damageType,            // 'C' | 'P' | 'T' | 'C/P' ecc.
      //   twoHanded,             // impugnatura a due mani
      //   offHand,               // mano secondaria
      //   special, notes }

      // ── Equipaggiamento ───────────────────────────────────────────────
      equipment: [],
      // Struttura di un oggetto:
      // { id, name, qty, weight, cost, location, worn, notes }
      // location: 'indosso' | 'zaino' | 'cavalcatura' | 'deposito'

      // Armatura attualmente indossata (aggiorna combat.ac.armorBonus ecc.)
      armor: {
        name:       '',
        type:       '',   // 'leggera' | 'media' | 'pesante' | 'scudo'
        bonus:      0,
        maxDex:     null, // null = nessun limite
        acp:        0,    // penalità di armatura alla prova
        asf:        0,    // % fallimento incantesimi arcani
        speed:      0,    // riduzione velocità
        weight:     0,
        notes:      '',
      },

      // ── Monete ────────────────────────────────────────────────────────
      currency: { pp: 0, gp: 0, sp: 0, cp: 0 },  // platino, oro, argento, rame

      // ── Talenti ───────────────────────────────────────────────────────
      feats: [],
      // Struttura di un talento:
      // { id, name, type,         // es. 'Combattimento', 'Generale', 'Stile'
      //   prerequisites, description, notes }

      // ── Capacità di classe ────────────────────────────────────────────
      classFeatures: [],
      // Struttura:
      // { id, name, className, levelGained, description, usesPerDay, usesLeft, notes }

      // ── Tratti razziali ───────────────────────────────────────────────
      racialTraits: [],
      // { id, name, description }

      // ── Incantesimi ───────────────────────────────────────────────────
      spells: _defaultSpells(),

      // ── Ira di stirpe / Furia ─────────────────────────────────────────
      rage: _defaultRage(),
      // ── Esibizioni Bardiche (Bardo, Skald) ───────────────────────────────
      // roundsLeft: round rimasti oggi; extra: bonus manuali; active: nome esibizione attiva
      bardPerf: { roundsLeft: 0, extra: 0, active: '' },
      // ── Ki Pool (Monaco, Ninja) ───────────────────────────────────────────
      // current: ki attuali; extra: bonus manuali (oggetti magici ecc.)
      ki: { current: 0, extra: 0 },
      // ── Canalizzare Energia (Chierico, Paladino, Inquisitore, Guardiamarca)
      // type: 'positiva'|'negativa'; diceCount: dado Xd6; usesLeft/usesMax: usi oggi
      channel: { type: 'positiva', diceCount: 1, usesLeft: 3, usesMax: 3 },
      // ── Attacco Furtivo (Ladro, Ninja, Spia, Inquisitore, Vigilante) ─────
      // extra: d6 bonus manuali (multiclasse, oggetti ecc.) oltre al calcolo auto
      sneak: { extra: 0 },
      // ── Livelli Negativi ──────────────────────────────────────────────
      // Ogni livello negativo: −1 a tiri attacco, TS, prove abilità/car., −5 PF max
      // Si eliminano con Ristorare Potenziato o simili
      negativeLevels: 0,
      // ── Condizioni attive ─────────────────────────────────────────────
      // Valori possibili (PF1): Affaticato, Esausto, Nauseato, Stordito,
      // Accecato, Sordo, Spaventato, Atterrito, Paralizzato, Privo di Sensi,
      // Prono, Immobilizzato, Invisibile, Impreparato, Malato, Intossicato
      conditions: [],

      // ── Note libere ───────────────────────────────────────────────────
      notes: '',

      // ── Versione schema (per future migrazioni) ───────────────────────
      _schemaVersion: 1,
    };
  }

  // ── Validazione ──────────────────────────────────────────────────────────

  /**
   * Controlla che l'oggetto personaggio abbia tutti i campi obbligatori.
   * Utile prima di salvare o importare.
   */
  function validate(char) {
    const errors = [];
    if (!char || typeof char !== 'object') {
      return { valid: false, errors: ['Oggetto non valido'] };
    }
    if (!char.id)                  errors.push('id mancante');
    if (!char.meta)                errors.push('meta mancante');
    if (!char.meta?.name)          errors.push('nome mancante');
    if (!char.abilities)           errors.push('abilities mancante');
    if (!char.combat)              errors.push('combat mancante');
    if (!Array.isArray(char.skills))      errors.push('skills non è un array');
    if (!Array.isArray(char.weapons))     errors.push('weapons non è un array');
    if (!Array.isArray(char.equipment))   errors.push('equipment non è un array');
    if (!Array.isArray(char.feats))       errors.push('feats non è un array');
    if (!char.currency)            errors.push('currency mancante');
    if (!char.spells)              errors.push('spells mancante');
    if (!char.rage)                errors.push('rage mancante');
    return { valid: errors.length === 0, errors };
  }

  // ── Migrazione schema ─────────────────────────────────────────────────────

  /**
   * Aggiorna un personaggio salvato con una versione precedente dello schema
   * aggiungendo i campi mancanti con valori di default.
   * Non sovrascrive mai dati esistenti.
   */
  function migrate(char) {
    const defaults = createDefault(char.meta?.name || 'Personaggio');

    function fillMissing(target, source) {
      for (const key of Object.keys(source)) {
        if (target[key] === undefined) {
          target[key] = source[key];
        } else if (
          typeof source[key] === 'object' &&
          source[key] !== null &&
          !Array.isArray(source[key]) &&
          typeof target[key] === 'object' &&
          target[key] !== null
        ) {
          fillMissing(target[key], source[key]);
        }
      }
    }

    fillMissing(char, defaults);
    char._schemaVersion = defaults._schemaVersion;
    return char;
  }

  // ── API pubblica ─────────────────────────────────────────────────────────

  return {
    createDefault,
    calcAbilityMod,
    generateId,
    clone,
    validate,
    migrate,
  };
})();
