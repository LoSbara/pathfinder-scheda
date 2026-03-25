/**
 * combat.js
 * Calcoli derivati di combattimento per Pathfinder 1e (regole Golarion ITA).
 *
 * Tutte le funzioni sono PURE: ricevono l'oggetto personaggio e ritornano
 * il valore finale. Nessun side-effect, nessuna modifica all'oggetto.
 *
 * ─── FORMULE REGOLAMENTO ─────────────────────────────────────────────────
 *  Mod caratteristica  = floor((punteggio − 10) / 2)
 *
 *  CA normale    = 10 + armatura + scudo + Des + naturale + deflection + dodge + misc
 *                     + (bonus taglia AC)
 *                     − condizioni (Affaticato: −2 AoO; Stordito/Impreparato: perde Des)
 *  CA contatto   = 10 + Des + deflection + dodge + misc + taglia
 *                     (NO armatura, NO scudo, NO naturale)
 *  CA impreparato = CA normale − Des (se Des > 0) − dodge
 *                     (Schivare Prodigioso preserva Des anche da flat-footed)
 *
 *  CMB  = BAB + mod FOR + bonus taglia CMB
 *  CMD  = 10 + BAB + mod FOR + mod DES + bonus taglia CMD + misc
 *         (alcune condizioni tolgono Des: Immobilizzato, Stordito → Des = 0 al CMD)
 *
 *  TS Tempra   = base + mod CON + misc + (bonus morale ira)
 *  TS Riflessi = base + mod DES + misc
 *  TS Volontà  = base + mod SAG + misc + (bonus morale ira)
 *
 *  Iniziativa  = mod DES + misc
 *
 *  Ira di Stirpe:
 *    FOR effettiva +4 (morale), CON effettiva +4 (morale)
 *    TS Volontà +2 (morale), CA −2 (penalità morale)
 *    Round disponibili/giorno = 4 + mod CON (SENZA il bonus ira) + 2 × (livello − 1)
 *    PF massimi temporanei +2 × livello (spariscono alla fine dell'ira)
 *
 *  Attacco Poderoso (BAB +1 richiesto, FOR 13):
 *    penalità_attacco = −(1 + floor(BAB / 4))
 *    bonus_danno      =  2 × (1 + floor(BAB / 4))
 *    → ×1.5 se arma a due mani (arrotondata per difetto)
 *    → ×0.5 se mano secondaria (arrotondata per difetto)
 *
 *  Bonus danno FOR in mischia:
 *    × 1   → arma a una mano / naturale primaria
 *    × 1.5 → arma a due mani / naturale primaria con bonus 1.5 esplicito
 *    × 0.5 → mano secondaria / naturale secondaria
 *
 *  Bonus taglia a CMB/CMD (e inverso per CA):
 *    Piccolissima −2 | Piccola −1 | Media 0 | Grande +1 | Enorme +2
 *    Mastodontica +4  | Colossale +8
 * ──────────────────────────────────────────────────────────────────────────
 */

const Combat = (() => {

  // ── Tabella capacità di carico PF1 (libbre, indice = STR − 1, STR 1–30) ──
  const CARRY_LB = [
    [3,6,10],[6,13,20],[10,20,30],[13,26,40],[16,33,50],
    [20,40,60],[23,46,70],[26,53,80],[30,60,90],[33,66,100],
    [38,76,115],[43,86,130],[50,100,150],[58,116,175],[66,133,200],
    [76,153,230],[86,173,260],[100,200,300],[116,233,350],[133,266,400],
    [153,306,460],[173,346,520],[200,400,600],[233,466,700],[266,533,800],
    [306,613,920],[346,693,1040],[400,800,1200],[466,933,1400],[533,1066,1600],
  ];

  /** Limiti di carico in kg per un dato punteggio di Forza. */
  function _carryKg(strScore) {
    const s = Math.max(1, strScore);
    let lb;
    if (s <= 30) {
      lb = CARRY_LB[s - 1];
    } else {
      const extra = Math.floor((s - 20) / 10);
      const f     = Math.pow(4, extra);
      lb = CARRY_LB[19].map(x => x * f);
    }
    return lb.map(x => +(x / 2.205).toFixed(1));
  }

  // ── Tabella bonus taglia ──────────────────────────────────────────────────
  // cmbMod: bonus a CMB/CMD; acMod: bonus a CA (= −cmbMod)
  const SIZE_TABLE = {
    'Minuscola':    { cmbMod: -8, acMod:  8, label: 'Minuscola'    },
    'Minuta':       { cmbMod: -4, acMod:  4, label: 'Minuta'       },
    'Piccolissima': { cmbMod: -2, acMod:  2, label: 'Piccolissima' },
    'Piccola':      { cmbMod: -1, acMod:  1, label: 'Piccola'      },
    'Media':        { cmbMod:  0, acMod:  0, label: 'Media'        },
    'Grande':       { cmbMod:  1, acMod: -1, label: 'Grande'       },
    'Enorme':       { cmbMod:  2, acMod: -2, label: 'Enorme'       },
    'Mastodontica': { cmbMod:  4, acMod: -4, label: 'Mastodontica' },
    'Colossale':    { cmbMod:  8, acMod: -8, label: 'Colossale'    },
  };

  // Condizioni che impediscono di applicare il bonus Des alla CA
  const CONDITIONS_LOSE_DEX = new Set([
    'Immobilizzato', 'Stordito', 'Privo di Sensi', 'Paralizzato',
  ]);

  // ── Livelli Negativi ─────────────────────────────────────────────────────
  // Ogni livello negativo conferisce −1 a: tiri attacco, TS, prove caratteristica
  // e prove abilità. La penalità si accumula (2 liv. neg. = −2, ecc.).
  function negLvlPenalty(char) {
    return -(char.negativeLevels || 0);
  }

  // ── Condizioni ────────────────────────────────────────────────────────────
  /** Verifica se una condizione è attiva sul personaggio. */
  function hasCondition(char, condition) {
    return Array.isArray(char.conditions) && char.conditions.includes(condition);
  }

  // ── Helper: punteggio effettivo di una caratteristica ────────────────────

  /**
   * Restituisce il punteggio effettivo di una caratteristica,
   * sommando base + razziale + potenziamento + temporaneo + bonus morale (ira).
   * I bonus di potenziamento non si cumulano tra loro → si prende il massimo.
   * I bonus morali (ira) si sommano solo se char.rage.active === true.
   *
   * @param {object} char
   * @param {'str'|'dex'|'con'|'int'|'wis'|'cha'} key
   * @returns {number} punteggio effettivo
   */
  function effectiveScore(char, key) {
    const a = char.abilities;
    const base     = a[key]                    || 10;
    const racial   = a[key + 'Racial']         || 0;
    const enhance  = a[key + 'Enhance']        || 0;
    const temp     = a[key + 'Temp']           || 0;

    // Bonus morale dall'ira (solo durante l'ira attiva, solo FOR e CON)
    let morale = 0;
    if (char.rage?.active) {
      if (key === 'str') morale = char.rage.strBonus || 4;
      if (key === 'con') morale = char.rage.conBonus || 4;
    }

    // Penalità condizioni a FOR e DES:
    //   Affaticato → −2  |  Esausto → −6  (non cumulabili, Esausto è peggiore)
    let condPen = 0;
    if (key === 'str' || key === 'dex') {
      if (hasCondition(char, 'Esausto'))         condPen = -6;
      else if (hasCondition(char, 'Affaticato')) condPen = -2;
    }

    return base + racial + enhance + temp + morale + condPen;
  }

  /** Modificatore di caratteristica dal punteggio effettivo. */
  function mod(char, key) {
    return Character.calcAbilityMod(effectiveScore(char, key));
  }

  /** Bonus taglia da stringa taglia (es. 'Media'). */
  function sizeEntry(char) {
    return SIZE_TABLE[char.meta?.size] || SIZE_TABLE['Media'];
  }

  // ── Ingombro ─────────────────────────────────────────────────────────────

  /** Peso totale trasportato (equipaggiamento + armi + armatura) in kg. */
  function calcCarriedWeight(char) {
    const equip = (char.equipment||[]).reduce((s, i) => s + (i.weight||0)*(i.qty||1), 0);
    const wpns  = (char.weapons||[]).reduce((s, w) => s + (w.weight||0), 0);
    return equip + wpns + (char.armor?.weight || 0);
  }

  /**
   * Categoria di ingombro: 'light' | 'medium' | 'heavy'.
   * Basata su peso portato vs. limiti di carico per la FOR effettiva del PG.
   */
  function calcLoadCategory(char) {
    const carried = calcCarriedWeight(char);
    const limits  = _carryKg(effectiveScore(char, 'str'));
    if (carried <= limits[0]) return 'light';
    if (carried <= limits[1]) return 'medium';
    return 'heavy';
  }

  /**
   * Massimo bonus DES alla CA: il più restrittivo tra armatura e ingombro.
   * Armatura: char.armor.maxDex (null = nessun limite).
   * Ingombro Medio → +3; Pesante → +1; Leggero → nessun limite.
   * Restituisce null se nessun limite si applica.
   */
  function calcEffectiveMaxDex(char) {
    const armorMax = char.armor?.maxDex; // null = nessun limite
    const loadCat  = calcLoadCategory(char);
    const loadMax  = loadCat === 'heavy' ? 1 : loadCat === 'medium' ? 3 : null;

    if (armorMax === null && loadMax === null) return null;
    if (armorMax === null) return loadMax;
    if (loadMax   === null) return armorMax;
    return Math.min(armorMax, loadMax); // il più restrittivo
  }

  // ── Punti Ferita ─────────────────────────────────────────────────────────

  /**
   * Calcola i PF massimi effettivi.
   * Durante l'ira, la CON aumenta → +2 PF per dado vita temporanei.
   * Nota: questi PF extra NON sono "temporanei" nel senso di PF temporanei;
   * spariscono alla fine dell'ira e non si perdono per primi.
   */
  function calcHpMax(char) {
    const base = char.combat?.hpMax || 0;
    if (!char.rage?.active) return base;
    const level = char.meta?.totalLevel || 1;
    return base + (level * 2); // +2 PF per dado vita da CON +4
  }

  // ── Classe Armatura ───────────────────────────────────────────────────────

  /**
   * Restituisce un breakdown dettagliato della CA normale.
   * { total, breakdown: { base, armor, shield, dex, natural, deflection, dodge, size, misc, conditions } }
   */
  function calcAC_breakdown(char) {
    const ac = char.combat?.ac || {};
    const size = sizeEntry(char);

    const armorBonus  = ac.armorBonus  || 0;
    const shieldBonus = ac.shieldBonus || 0;
    const natural     = ac.naturalArmor|| 0;
    const deflection  = ac.deflection  || 0;
    const dodge       = ac.dodge       || 0;
    const misc        = ac.misc        || 0;
    const sizeAC      = size.acMod;

    // Il bonus DES è limitato dal maxDex dell'armatura e dall'ingombro.
    // Schivare Prodigioso è rilevante solo per CA impreparato.
    const maxDex     = calcEffectiveMaxDex(char);
    const desMod     = mod(char, 'dex');
    const desApplied = maxDex !== null ? Math.min(desMod, maxDex) : desMod;

    // Penalità da Ira
    const ragePenalty = char.rage?.active ? -(char.rage.acPenalty || 2) : 0;

    // Penalità condizioni
    let condPenalty = 0;
    if (hasCondition(char, 'Accecato')) condPenalty -= 2;

    const total = 10 + armorBonus + shieldBonus + desApplied + natural
                + deflection + dodge + misc + sizeAC + ragePenalty + condPenalty;

    return {
      total,
      breakdown: {
        base: 10, armor: armorBonus, shield: shieldBonus,
        dex: desApplied, natural, deflection, dodge,
        size: sizeAC, misc, rage: ragePenalty, conditions: condPenalty,
      },
    };
  }

  /** CA normale. */
  function calcAC(char) {
    return calcAC_breakdown(char).total;
  }

  /**
   * CA a contatto: NO armatura, NO scudo, NO naturale.
   */
  function calcAC_touch(char) {
    const ac     = char.combat?.ac || {};
    const size   = sizeEntry(char);
    const maxDex = calcEffectiveMaxDex(char);
    const rawDes = mod(char, 'dex');
    const desMod = maxDex !== null ? Math.min(rawDes, maxDex) : rawDes;
    const ragePen = char.rage?.active ? -(char.rage.acPenalty || 2) : 0;
    return 10 + desMod + (ac.deflection || 0) + (ac.dodge || 0)
             + (ac.misc || 0) + size.acMod + ragePen;
  }

  /**
   * CA impreparato: NO Des (se positivo), NO dodge.
   * Se il personaggio ha Schivare Prodigioso mantiene il Des.
   */
  function calcAC_flatfooted(char) {
    const ac = char.combat?.ac || {};
    const size = sizeEntry(char);
    const desMod = mod(char, 'dex');
    const ragePen = char.rage?.active ? -(char.rage.acPenalty || 2) : 0;

    const hasUncanny = char.classFeatures?.some(f =>
      f.name?.toLowerCase().includes('schivare prodigioso')) ||
      char.feats?.some(f => f.name?.toLowerCase().includes('schivare prodigioso'));

    // Se ha Schivare Prodigioso mantiene Des; dodge va SEMPRE perso in impreparato
    const effectiveDes = hasUncanny ? desMod : 0;

    return 10 + (ac.armorBonus || 0) + (ac.shieldBonus || 0) + effectiveDes
             + (ac.naturalArmor || 0) + (ac.deflection || 0)
             + (ac.misc || 0) + size.acMod + ragePen;
  }

  // ── CMB e CMD ─────────────────────────────────────────────────────────────

  /**
   * CMB = BAB + mod FOR + bonus taglia CMB
   * (Alcune manovre usano DES invece di FOR — gestito a parte nella UI.)
   */
  function calcCMB(char) {
    const bab     = char.combat?.bab      || 0;
    const forMod  = mod(char, 'str');
    const sizeMod = sizeEntry(char).cmbMod;
    const misc    = char.combat?.cmbMisc  || 0;
    const nlPen   = negLvlPenalty(char);
    return bab + forMod + sizeMod + misc + nlPen;
  }

  /**
   * CMD = 10 + BAB + mod FOR + mod DES + bonus taglia CMD + misc
   * Se si è Immobilizzati o Storditi, il Des non si applica.
   */
  function calcCMD(char) {
    const bab    = char.combat?.bab      || 0;
    const forMod = mod(char, 'str');
    const sizeMod = sizeEntry(char).cmbMod; // stesso modificatore di taglia del CMB
    const misc   = char.combat?.cmdMisc  || 0;
    const ragePen = char.rage?.active ? -(char.rage.acPenalty || 2) : 0;

    const loseDex = CONDITIONS_LOSE_DEX.has(
      (char.conditions || []).find(c => CONDITIONS_LOSE_DEX.has(c))
    );
    const desMod = loseDex ? 0 : mod(char, 'dex');

    const nlPen = negLvlPenalty(char);
    return 10 + bab + forMod + desMod + sizeMod + misc + ragePen + nlPen;
  }

  // ── Tiri Salvezza ─────────────────────────────────────────────────────────

  /**
   * TS Tempra = base + mod CON + misc + bonus morale ira.
   * Breakdown: { total, base, ability, misc, rage }
   */
  function calcFort(char) {
    const saves    = char.combat?.saves || {};
    const base     = saves.fortBase || 0;
    const abilMod  = mod(char, 'con');
    const misc     = saves.fortMisc || 0;
    // Nota: in PF1 la Furia base NON aggiunge bonus morale a Tempra (solo a Volontà).
    const nlPen   = negLvlPenalty(char);
    const condPen = _shakeOrSickenPenalty(char); // Atterrito/Spaventato/Malato: −2
    return { total: base + abilMod + misc + nlPen + condPen, base, ability: abilMod, misc, negativeLevels: nlPen, conditions: condPen };
  }

  /**
   * TS Riflessi = base + mod DES + misc.
   */
  function calcRef(char) {
    const saves   = char.combat?.saves || {};
    const base    = saves.refBase  || 0;
    const abilMod = mod(char, 'dex');
    const misc    = saves.refMisc  || 0;
    const nlPen   = negLvlPenalty(char);
    const condPen = _shakeOrSickenPenalty(char);
    return { total: base + abilMod + misc + nlPen + condPen, base, ability: abilMod, misc, negativeLevels: nlPen, conditions: condPen };
  }

  /**
   * TS Volontà = base + mod SAG + misc + bonus morale ira (+2).
   */
  function calcWill(char) {
    const saves   = char.combat?.saves || {};
    const base    = saves.willBase || 0;
    const abilMod = mod(char, 'wis');
    const misc    = saves.willMisc || 0;
    const rageMor = char.rage?.active ? (char.rage.willBonus || 2) : 0;
    const nlPen   = negLvlPenalty(char);
    const condPen = _shakeOrSickenPenalty(char);
    return {
      total: base + abilMod + misc + rageMor + nlPen + condPen,
      base, ability: abilMod, misc, rage: rageMor, negativeLevels: nlPen, conditions: condPen,
    };
  }

  // ── Helper condizioni: penalità ad attacchi, TS e prove ──────────────────

  /**
   * Restituisce −2 se il personaggio è Atterrito, Spaventato o Malato; 0 altrimenti.
   * Si applica a: tiri di attacco, tiri salvezza, prove abilità.
   * Solo Malato si applica anche ai danni (vedi calcConditionDamagePenalty).
   */
  function _shakeOrSickenPenalty(char) {
    return (hasCondition(char, 'Atterrito') || hasCondition(char, 'Spaventato') ||
            hasCondition(char, 'Malato')) ? -2 : 0;
  }

  // ── Iniziativa ────────────────────────────────────────────────────────────

  function calcInitiative(char) {
    const desMod   = mod(char, 'dex');
    const misc     = char.combat?.initiative?.misc || 0;
    const nlPen    = negLvlPenalty(char);
    // Assordato → −4 all'iniziativa
    const condPen  = hasCondition(char, 'Assordato') ? -4 : 0;
    return { total: desMod + misc + nlPen + condPen, dex: desMod, misc, negativeLevels: nlPen, conditions: condPen };
  }

  // ── Round Ira ─────────────────────────────────────────────────────────────

  /**
   * Calcola i round di ira disponibili al giorno.
   * Usa il mod CON SENZA il bonus dell'ira stessa.
   * Formula: 4 + mod CON (base) + 2 × (livello − 1)
   */
  function calcRageRoundsTotal(char) {
    // Mod CON senza bonus ira
    const conScore = (char.abilities?.con || 10)
                   + (char.abilities?.conRacial  || 0)
                   + (char.abilities?.conEnhance || 0)
                   + (char.abilities?.conTemp    || 0);
    const conMod = Character.calcAbilityMod(conScore);
    const level  = char.meta?.totalLevel || 1;
    return Math.max(0, 4 + conMod + 2 * (level - 1));
  }

  /** Round di ira rimanenti oggi. */
  function calcRageRoundsLeft(char) {
    const total = calcRageRoundsTotal(char);
    const used  = char.rage?.roundsUsed || 0;
    return Math.max(0, total - used);
  }

  // ── Attacco Poderoso ──────────────────────────────────────────────────────

  /**
   * Calcola penalità attacco e bonus danno di Attacco Poderoso per il BAB dato.
   * Ritorna { attackPenalty: -N, damageBonusBase, damageBonusTwoHanded, damageBonusOffHand }
   */
  function calcPowerAttack(bab) {
    const tiers = Math.floor(bab / 4); // 0 a BAB 3, 1 a BAB 4-7, ecc.
    const penalty     = -(1 + tiers);
    const bonusBase   = 2 * (1 + tiers);
    return {
      attackPenalty:       penalty,
      damageBonusBase:     bonusBase,
      damageBonusTwoHanded: Math.floor(bonusBase * 1.5),
      damageBonusOffHand:   Math.floor(bonusBase * 0.5),
    };
  }

  // ── Armi: attacco e danno ─────────────────────────────────────────────────

  /**
   * Bonus di attacco totale per un'arma, con breakdown.
   *
   * Tipi di attacco:
   *   'mischia'   → BAB + mod FOR + enhancement + misc
   *   'distanza'  → BAB + mod DES + enhancement + misc
   *   'naturale'  → come mischia (primaria = BAB pieno, secondaria = BAB −5)
   *
   * Condizioni che penalizzano:
   *   Affaticato / Esausto → già riflessi sulla DES/FOR effettiva
   *   Prono → −4 agli attacchi in mischia (ma +4 per chi ti attacca a distanza)
   *
   * @param {object} char
   * @param {object} weapon  — da char.weapons[]
   * @param {boolean} powerAttack  — true se si usa Attacco Poderoso
   * @returns {{ total: number, breakdown: object }}
   */
  function calcWeaponAttack(char, weapon, powerAttack = false) {
    const bab        = char.combat?.bab || 0;
    const enhance    = weapon.enhancement || 0;
    const misc       = weapon.attackMisc  || 0;
    const isRanged   = weapon.attackType === 'distanza';
    const isNatSec   = weapon.attackType === 'naturale' && weapon.offHand;

    // Caratteristica base
    const abilMod = isRanged ? mod(char, 'dex') : mod(char, 'str');

    // Penalità mano secondaria (−5 sugli attacchi naturali secondari, −2/−4 su off-hand)
    let offHandPenalty = 0;
    if (weapon.offHand && !isNatSec)     offHandPenalty = -4; // off-hand senza talento Combattere con Due Armi
    if (isNatSec)                         offHandPenalty = -5;

    // Penalità Attacco Poderoso (solo mischia)
    const pa = calcPowerAttack(bab);
    const paPenalty = (!isRanged && powerAttack) ? pa.attackPenalty : 0;

    // Penalità condizioni
    let condPenalty = 0;
    if (!isRanged && hasCondition(char, 'Prono')) condPenalty -= 4;
    condPenalty += _shakeOrSickenPenalty(char); // Atterrito/Spaventato/Malato: −2

    const nlPen = negLvlPenalty(char);
    const total = bab + abilMod + enhance + misc + offHandPenalty + paPenalty + condPenalty + nlPen;

    return {
      total,
      breakdown: {
        bab, ability: abilMod, enhancement: enhance, misc,
        offHand: offHandPenalty, powerAttack: paPenalty, conditions: condPenalty,
        negativeLevels: nlPen,
      },
    };
  }

  /**
   * Sequenza di bonus attacco per tutti gli attacchi iterativi di un'arma.
   * BAB 1-5: 1 attacco   BAB 6-10: 2 attacchi (+BAB/+BAB−5)
   * BAB 11-15: 3 attacchi  BAB 16+: 4 attacchi
   *
   * Le armi naturali secondarie (offHand) non ottengono iterativi.
   *
   * @param {object} char
   * @param {object} weapon  — da char.weapons[]
   * @param {boolean} powerAttack
   * @returns {number[]}  array di totali (es. [+8, +3] per BAB 8)
   */
  function calcIterativeAttacks(char, weapon, powerAttack = false) {
    const bab = char.combat?.bab || 0;
    const isRanged  = weapon.attackType === 'distanza';

    // Armi naturali secondarie e off-hand non hanno iterativi
    if (weapon.offHand) {
      return [calcWeaponAttack(char, weapon, powerAttack).total];
    }

    const count     = bab >= 16 ? 4 : bab >= 11 ? 3 : bab >= 6 ? 2 : 1;
    const enhance   = weapon.enhancement || 0;
    const weapMisc  = weapon.attackMisc  || 0;
    const abilMod   = isRanged ? mod(char, 'dex') : mod(char, 'str');
    const nlPen     = negLvlPenalty(char);
    const pa        = calcPowerAttack(bab);
    const paPenalty = (!isRanged && powerAttack) ? pa.attackPenalty : 0;
    let   condPenalty = 0;
    if (!isRanged && hasCondition(char, 'Prono')) condPenalty -= 4;
    condPenalty += _shakeOrSickenPenalty(char);

    const attacks = [];
    for (let i = 0; i < count; i++) {
      attacks.push((bab - i * 5) + abilMod + enhance + weapMisc + paPenalty + condPenalty + nlPen);
    }
    return attacks;
  }

  /**
   * Bonus al danno per un'arma ( NON include il dado danno, solo i bonus fissi).
   *
   * FOR in mischia:
   *   × 1   → una mano / naturale primaria
   *   × 1.5 → due mani (floor)
   *   × 0.5 → mano secondaria (floor, min 0)
   *
   * @param {object} char
   * @param {object} weapon
   * @param {boolean} powerAttack
   * @returns {{ total: number, breakdown: object }}
   */
  function calcWeaponDamage(char, weapon, powerAttack = false) {
    const bab      = char.combat?.bab || 0;
    const enhance  = weapon.enhancement || 0;
    const misc     = weapon.damageMisc  || 0;
    const isRanged = weapon.attackType === 'distanza';

    // Armi a distanza normalmente non aggiungono FOR al danno
    // (alcune armi da lancio come il giavellotto sì → flag weapon.addStrToRanged)
    let strBonus = 0;
    if (!isRanged || weapon.addStrToRanged) {
      const strMod = mod(char, 'str');
      if (weapon.twoHanded)      strBonus = Math.floor(strMod * 1.5);
      else if (weapon.offHand)   strBonus = strMod < 0 ? strMod : Math.floor(strMod * 0.5);
      else                        strBonus = strMod;
    }

    // Bonus Attacco Poderoso al danno (solo mischia)
    let paBonus = 0;
    if (!isRanged && powerAttack) {
      const pa = calcPowerAttack(bab);
      if (weapon.twoHanded)    paBonus = pa.damageBonusTwoHanded;
      else if (weapon.offHand) paBonus = pa.damageBonusOffHand;
      else                      paBonus = pa.damageBonusBase;
    }

    // Malato (Sickened) → −2 ai danni
    const sickPen = hasCondition(char, 'Malato') ? -2 : 0;

    const total = strBonus + enhance + paBonus + misc + sickPen;

    return {
      total,
      breakdown: {
        strength: strBonus, enhancement: enhance,
        powerAttack: paBonus, misc, conditions: sickPen,
      },
    };
  }

  // ── Velocità effettiva ─────────────────────────────────────────────────────

  /**
   * Velocità effettiva in metri.
   *
   * Applicato in ordine:
   *  1. Riduzione da armatura (char.armor.speed, es. 3 = −3 m)
   *  2. Riduzione da ingombro Medio/Pesante (9 m → 6 m; 6 m → 4 m)
   *     Si usa il valore più basso tra armatura e ingombro (non si sommano).
   *  3. Condizione Esausto → velocità dimezzata (dopo tutto il resto).
   */
  function calcSpeed(char) {
    const base = char.combat?.speed || 9;

    // 1. Riduzione da armatura
    const armorRed     = char.armor?.speed || 0;
    const speedArmor   = base - armorRed;

    // 2. Riduzione da ingombro
    const loadCat = calcLoadCategory(char);
    let speedLoad = base;
    if (loadCat !== 'light') {
      if      (base >= 9) speedLoad = 6;
      else if (base >= 6) speedLoad = 4;
      // se base < 6 m l'ingombro non riduce ulteriormente
    }

    // Prende il valore più penalizzante
    let speed = Math.min(speedArmor, speedLoad);

    // 3. Esausto → metà
    if (hasCondition(char, 'Esausto')) speed = Math.floor(speed / 2);

    return Math.max(1, speed);
  }

  // ── Risorse di classe ─────────────────────────────────────────────────────

  /** Somma i livelli del personaggio nelle classi indicate (ricerca case-insensitive). */
  function _classLevels(char, classNames) {
    const lower = classNames.map(n => n.toLowerCase());
    return (char.meta?.classes || [])
      .filter(c => lower.includes((c.className || '').toLowerCase()))
      .reduce((s, c) => s + (c.level || 0), 0);
  }

  /**
   * Round di Esibizione Bardica al giorno.
   * Formula PF1: 4 + (livelli_bardo − 1) × 2 + mod CHA + extra
   */
  function calcBardPerfMax(char) {
    const lvls = _classLevels(char, ['Bardo', 'Skald']);
    if (lvls === 0) return char.bardPerf?.extra || 0;
    return 4 + Math.max(0, lvls - 1) * 2 + mod(char, 'cha') + (char.bardPerf?.extra || 0);
  }

  /**
   * Punti Ki totali.
   * Monaco: metà livello Monaco + mod SAG
   * Ninja:  metà livello Ninja  + mod CAR
   */
  function calcKiMax(char) {
    const monacoLvls = _classLevels(char, ['Monaco']);
    const ninjaLvls  = _classLevels(char, ['Ninja']);
    const monacoKi   = monacoLvls > 0 ? Math.floor(monacoLvls / 2) + mod(char, 'wis') : 0;
    const ninjaKi    = ninjaLvls  > 0 ? Math.floor(ninjaLvls  / 2) + mod(char, 'cha') : 0;
    return Math.max(0, monacoKi + ninjaKi + (char.ki?.extra || 0));
  }

  /**
   * Numero di d6 dell'Attacco Furtivo.
   * Formula PF1: ceil(livelli_rogue / 2) + extra
   * Classi che contribuiscono: Ladro, Ninja, Spia, Inquisitore, Vigilante, Attaccabrighe, Schermagliatore
   */
  function calcSneakDice(char) {
    const lvls = _classLevels(char, ['Ladro', 'Ninja', 'Spia', 'Inquisitore', 'Vigilante', 'Attaccabrighe', 'Schermagliatore']);
    return Math.max(0, Math.ceil(lvls / 2)) + (char.sneak?.extra || 0);
  }

  // ── Penalità armatura alla prova (ACP) ────────────────────────────────────

  /**
   * Penalità condizioni alle prove di abilità.
   * Atterrito / Spaventato / Malato → −2.
   * Esportata per essere usata da skills.js.
   */
  function calcConditionSkillPenalty(char) {
    return _shakeOrSickenPenalty(char);
  }

  /**
   * ACP effettiva: il più penalizzante tra armatura e ingombro.
   * Ingombro Medio → −3; Pesante → −6.
   * Non si sommano: si usa il valore più negativo.
   * Usata da skills.js per le abilità con acp: true.
   */
  function calcACP(char) {
    const armorAcp = char.armor?.acp || 0; // già negativo nel modello (es. −3)
    const loadCat  = calcLoadCategory(char);
    const loadAcp  = loadCat === 'heavy' ? -6 : loadCat === 'medium' ? -3 : 0;
    return Math.min(armorAcp, loadAcp); // più negativo vince
  }

  // ── Riepilogo completo ────────────────────────────────────────────────────

  /**
   * Ritorna un oggetto con tutti i valori calcolati in una sola chiamata.
   * Usato dalla UI per aggiornare tutti i campi in una volta.
   */
  function calcAll(char) {
    return {
      // CA
      ac:           calcAC(char),
      acTouch:      calcAC_touch(char),
      acFlatFooted: calcAC_flatfooted(char),
      acBreakdown:  calcAC_breakdown(char).breakdown,
      // Manovre
      cmb:          calcCMB(char),
      cmd:          calcCMD(char),
      // TS
      fort:         calcFort(char),
      ref:          calcRef(char),
      will:         calcWill(char),
      // Altro
      initiative:   calcInitiative(char),
      speed:        calcSpeed(char),
      acp:          calcACP(char),
      hpMax:        calcHpMax(char),
      // Ira
      rageRoundsTotal: calcRageRoundsTotal(char),
      rageRoundsLeft:  calcRageRoundsLeft(char),
      // Risorse di classe
      bardPerfMax: calcBardPerfMax(char),
      kiMax:       calcKiMax(char),
      sneakDice:   calcSneakDice(char),
      // Resistenza/penalità
      sr:             char.combat?.sr || 0,
      negativeLevels: char.negativeLevels || 0,
      // Ingombro
      loadCategory:   calcLoadCategory(char),
      carriedWeight:  calcCarriedWeight(char),
      // Caratteristiche effettive (utile per la UI)
      scores: {
        str: effectiveScore(char, 'str'), strMod: mod(char, 'str'),
        dex: effectiveScore(char, 'dex'), dexMod: mod(char, 'dex'),
        con: effectiveScore(char, 'con'), conMod: mod(char, 'con'),
        int: effectiveScore(char, 'int'), intMod: mod(char, 'int'),
        wis: effectiveScore(char, 'wis'), wisMod: mod(char, 'wis'),
        cha: effectiveScore(char, 'cha'), chaMod: mod(char, 'cha'),
      },
    };
  }

  // ── API pubblica ──────────────────────────────────────────────────────────

  return {
    effectiveScore,
    mod,
    calcAC,
    calcAC_touch,
    calcAC_flatfooted,
    calcAC_breakdown,
    calcCMB,
    calcCMD,
    calcFort,
    calcRef,
    calcWill,
    calcInitiative,
    calcSpeed,
    calcACP,
    calcHpMax,
    calcRageRoundsTotal,
    calcRageRoundsLeft,
    calcBardPerfMax,
    calcKiMax,
    calcSneakDice,
    calcPowerAttack,
    calcCarriedWeight,
    calcLoadCategory,
    calcEffectiveMaxDex,
    calcConditionSkillPenalty,
    calcWeaponAttack,
    calcIterativeAttacks,
    calcWeaponDamage,
    calcAll,
  };
})();
