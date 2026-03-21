/**
 * skills.js
 * Calcola i totali delle abilità per un personaggio Pathfinder 1e (Golarion ITA).
 *
 * ─── FORMULA PF1 ─────────────────────────────────────────────────────────
 *  Totale = gradi + mod_caratteristica
 *           + bonus_di_classe  (+3 se "di classe" e gradi >= 1)
 *           + penalità_armatura (negativa, solo se acp: true per l'abilità)
 *           + bonus_misc       (razze, talenti, oggetti, bonus competenza)
 *
 *  Regole aggiuntive:
 *   - Un'abilità "solo addestrati" (trainedOnly: true) non può essere usata
 *     senza almeno 1 grado (il totale viene mostrato ma marcato inutilizzabile).
 *   - Gradi massimi per livello = livello del personaggio.
 *   - Penalità armatura (ACP) si applica a: Acrobazia, Artista della Fuga,
 *     Cavalcare, Furtività, Nuotare, Scalare, Volare, Sotterfugio.
 *   - Durante l'ira NON si possono usare abilità basate su CAR, DES, INT
 *     (eccezione: Acrobazia, Cavalcare, Intimidire, Volare).
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Dipendenze: data/skills-list.js (PF1_SKILLS), combat.js (Combat.mod, Combat.calcACP)
 */

const Skills = (() => {

  // Abilità usabili durante l'ira anche se basate su CHA/DEX/INT
  const RAGE_ALLOWED = new Set([
    'acrobazia', 'cavalcare', 'intimidire', 'volare',
  ]);

  // Caratteristiche "bloccate" durante l'ira per la maggior parte delle abilità
  const RAGE_BLOCKED_ABILITIES = new Set(['cha', 'dex', 'int']);

  /**
   * Calcola il totale di un'abilità dato il suo ID.
   *
   * @param {object} char
   * @param {string} skillId  es. 'percezione'
   * @returns {{
   *   total: number,
   *   usable: boolean,       // false se trainedOnly e ranks = 0
   *   rageLocked: boolean,   // true se l'abilità è inutilizzabile durante l'ira
   *   breakdown: {
   *     ranks, abilityMod, classBonus, acp, misc
   *   }
   * }}
   */
  function calcSkillTotal(char, skillId) {
    const skillDef = PF1_SKILLS.find(s => s.id === skillId);
    if (!skillDef) return { total: 0, usable: false, rageLocked: false, breakdown: {} };

    // Record del personaggio per questa abilità
    const record = (char.skills || []).find(s => s.id === skillId) || {
      ranks: 0, classSkill: false, miscBonus: 0,
    };

    const ranks      = record.ranks      || 0;
    const classSkill = record.classSkill || false;
    const miscBonus  = record.miscBonus  || 0;

    // Modificatore caratteristica effettivo (tiene conto di ira, potenziamenti, ecc.)
    const abilityMod = Combat.mod(char, skillDef.ability);

    // Bonus di classe: +3 se è un'abilità di classe e il personaggio ha almeno 1 grado
    const classBonus = (classSkill && ranks >= 1) ? 3 : 0;

    // Penalità armatura (già negativa nel modello, es. −3)
    const acp = skillDef.acp ? (Combat.calcACP(char) || 0) : 0;

    const total = ranks + abilityMod + classBonus + acp + miscBonus;

    // Abilità non addestrate: non utilizzabile se trainedOnly e ranks = 0
    const usable = !(skillDef.trainedOnly && ranks === 0);

    // Blocco ira: durante l'ira le abilità basate su CHA/DEX/INT
    // (escluse le eccezioni) non possono essere usate.
    const rageLocked = !!(
      char.rage?.active &&
      RAGE_BLOCKED_ABILITIES.has(skillDef.ability) &&
      !RAGE_ALLOWED.has(skillId)
    );

    return {
      total,
      usable,
      rageLocked,
      breakdown: {
        ranks,
        abilityMod,
        classBonus,
        acp,
        misc: miscBonus,
      },
    };
  }

  /**
   * Calcola tutti i totali abilità del personaggio in una sola chiamata.
   * Ritorna un array parallelo a PF1_SKILLS, arricchito con i valori calcolati.
   *
   * @param {object} char
   * @returns {Array<{
   *   id, name, ability, trainedOnly, acp,
   *   ranks, classSkill, miscBonus,
   *   total, usable, rageLocked, breakdown
   * }>}
   */
  function calcAllSkills(char) {
    return PF1_SKILLS.map(skillDef => {
      const result  = calcSkillTotal(char, skillDef.id);
      const record  = (char.skills || []).find(s => s.id === skillDef.id) || {};
      return {
        // Dati statici dall'elenco
        id:          skillDef.id,
        name:        skillDef.name,
        ability:     skillDef.ability,
        trainedOnly: skillDef.trainedOnly,
        hasAcp:      skillDef.acp,
        // Dati dal personaggio
        ranks:       record.ranks      || 0,
        classSkill:  record.classSkill || false,
        miscBonus:   record.miscBonus  || 0,
        notes:       record.notes      || '',
        // Valori calcolati
        ...result,
      };
    });
  }

  /**
   * Conta il totale di gradi abilità spesi e il massimo disponibile.
   * Regola PF1: ogni livello si ottengono (2 + mod INT) gradi minimi 1,
   * moltiplicati ×4 al primo livello (umani +1/livello extra).
   *
   * @param {object} char
   * @returns {{ spent, available, overflow }}
   */
  function calcSkillPointsSummary(char) {
    // Gradi spesi = somma di tutti i ranks
    const spent = (char.skills || []).reduce((sum, s) => sum + (s.ranks || 0), 0);

    // Gradi disponibili: calcolati per classe
    const intMod = Combat.mod(char, 'int');
    const classes = char.meta?.classes || [];

    // Tabella gradi/livello per classe: usa ClassConfig se disponibile, altrimenti fallback statico
    const FALLBACK_SKILL_POINTS = {
      'Barbaro': 4, 'Iracondo di Stirpe': 4, 'Bardo': 6, 'Chierico': 2,
      'Druido': 4, 'Guerriero': 2, 'Ladro': 8, 'Mago': 2, 'Monaco': 4,
      'Paladino': 2, 'Ranger': 6, 'Stregone': 2, 'Alchimista': 4,
      'Cavaliere': 4, 'Convocatore': 2, 'Fattucchiera': 2, 'Inquisitore': 6,
      'Magus': 2, 'Morfico': 4, 'Oracolo': 4, 'Pistolero': 4, 'Vigilante': 4,
      'Antipaladino': 2, 'Ninja': 8, 'Samurai': 4, 'Arcanista': 2,
      'Attaccabrighe': 4, 'Cacciatore': 6, 'Guardiamarca': 4,
      'Schermagliatore': 4, 'Sciamano': 4, 'Skald': 6, 'Spia': 6,
    };

    function _skillPtsForClass(className) {
      if (typeof ClassConfig !== 'undefined') {
        const cfg = ClassConfig.findByName(className);
        if (cfg) return cfg.skillPts;
      }
      return FALLBACK_SKILL_POINTS[className] ?? 2;
    }

    let available = 0;
    for (const cls of classes) {
      const basePoints = _skillPtsForClass(cls.className);
      const perLevel   = Math.max(1, basePoints + intMod);
      // Primo livello ×4 (solo per la prima classe del personaggio)
      const isFirst    = classes.indexOf(cls) === 0;
      available += perLevel * cls.level + (isFirst ? perLevel * 3 : 0);
      // +1/livello per Umano (trait razziale "Talentoso")
      if (char.meta?.race?.toLowerCase().includes('umano')) {
        available += cls.level;
      }
    }

    return { spent, available, overflow: spent > available };
  }

  return {
    calcSkillTotal,
    calcAllSkills,
    calcSkillPointsSummary,
  };
})();
