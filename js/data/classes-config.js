/**
 * classes-config.js
 * Definizioni di tutte le classi Pathfinder 1e (Golarion ITA).
 *
 * Ogni classe descrive:
 *   id, name, type           — identità
 *   hitDie, bab              — meccaniche base
 *   skillPts                 — gradi abilità/livello (prima di INT mod)
 *   hasSpellsTab             — se mostrare la scheda Incantesimi
 *   spellAbility             — caratteristica di lancio (null | 'int' | 'wis' | 'cha')
 *   features                 — mappa di feature flags per adattare l'UI
 *   primaryTabs              — tab da evidenziare per questa classe
 *   description, icon        — UI
 *
 * Usato da ui.js → applyClassProfile() per adattare la scheda.
 *
 * features riconosciuti dall'UI attuale:
 *   rage          → mostra/nasconde il blocco Ira
 *   (tutti gli altri sono salvati per uso futuro)
 */

'use strict';

const ClassConfig = (() => {

  // ══════════════════════════════════════════════════════════════════════
  // CLASSI BASE (11)
  // ══════════════════════════════════════════════════════════════════════
  const CLASSES = [
    {
      id: 'barbaro',
      name: 'Barbaro',
      type: 'base',
      hitDie: 12,
      bab: 'full',
      skillPts: 4,
      hasSpellsTab: false,
      spellAbility: null,
      features: { rage: true },
      primaryTabs: ['combattimento', 'armi'],
      description: 'Guerriero selvaggio che attinge alla furia per potenziare il combattimento.',
      saves: { fort: 'good', ref: 'bad', will: 'bad' },
      icon: 'fa-solid fa-tornado',
      startingGold: { dice: 3, sides: 6, multiplier: 10 },
    },
    {
      id: 'bardo',
      name: 'Bardo',
      type: 'base',
      hitDie: 8,
      bab: '3_4',
      skillPts: 6,
      hasSpellsTab: true,
      spellAbility: 'cha',
      features: { bardPerf: true },
      primaryTabs: ['incantesimi', 'abilita'],
      description: 'Artista versatile che lancia incantesimi arcani e ispira i compagni con le esibizioni bardiche.',
      saves: { fort: 'bad', ref: 'good', will: 'good' },
      icon: 'fa-solid fa-music',
      startingGold: { dice: 3, sides: 6, multiplier: 10 },
    },
    {
      id: 'chierico',
      name: 'Chierico',
      type: 'base',
      hitDie: 8,
      bab: '3_4',
      skillPts: 2,
      hasSpellsTab: true,
      spellAbility: 'wis',
      features: { channel: true, domain: true },
      primaryTabs: ['incantesimi', 'combattimento'],
      description: 'Tramite divino che lancia incantesimi, canalizza energia e invoca i poteri del proprio dominio.',
      saves: { fort: 'bad', ref: 'bad', will: 'good' },
      icon: 'fa-solid fa-cross',
      startingGold: { dice: 4, sides: 6, multiplier: 10 },
    },
    {
      id: 'druido',
      name: 'Druido',
      type: 'base',
      hitDie: 8,
      bab: '3_4',
      skillPts: 4,
      hasSpellsTab: true,
      spellAbility: 'wis',
      features: { animalComp: true, wildShape: true },
      primaryTabs: ['incantesimi', 'caratteristiche'],
      description: 'Custode della natura capace di trasformarsi in animali e controllare le forze della natura.',
      saves: { fort: 'good', ref: 'bad', will: 'good' },
      icon: 'fa-solid fa-tree',
      startingGold: { dice: 2, sides: 6, multiplier: 10 },
    },
    {
      id: 'guerriero',
      name: 'Guerriero',
      type: 'base',
      hitDie: 10,
      bab: 'full',
      skillPts: 2,
      hasSpellsTab: false,
      spellAbility: null,
      features: {},
      primaryTabs: ['combattimento', 'armi', 'talenti'],
      description: 'Maestro del combattimento armato, con accesso a talenti di combattimento bonus.',
      saves: { fort: 'good', ref: 'bad', will: 'bad' },
      icon: 'fa-solid fa-shield-halved',
      startingGold: { dice: 5, sides: 6, multiplier: 10 },
    },
    {
      id: 'ladro',
      name: 'Ladro',
      type: 'base',
      hitDie: 8,
      bab: '3_4',
      skillPts: 8,
      hasSpellsTab: false,
      spellAbility: null,
      features: { sneak: true },
      primaryTabs: ['abilita', 'armi'],
      description: 'Esperto furtivo specializzato in inganni, trappole e attacchi furtivi.',
      saves: { fort: 'bad', ref: 'good', will: 'bad' },
      icon: 'fa-solid fa-user-secret',
      startingGold: { dice: 4, sides: 6, multiplier: 10 },
    },
    {
      id: 'mago',
      name: 'Mago',
      type: 'base',
      hitDie: 6,
      bab: 'half',
      skillPts: 2,
      hasSpellsTab: true,
      spellAbility: 'int',
      features: { familiar: true },
      primaryTabs: ['incantesimi', 'caratteristiche'],
      description: 'Studioso dell\'arcano che prepara incantesimi da libri di incantesimi.',
      saves: { fort: 'bad', ref: 'bad', will: 'good' },
      icon: 'fa-solid fa-hat-wizard',
      startingGold: { dice: 2, sides: 6, multiplier: 10 },
    },
    {
      id: 'monaco',
      name: 'Monaco',
      type: 'base',
      hitDie: 8,
      bab: 'full',
      skillPts: 4,
      hasSpellsTab: false,
      spellAbility: null,
      features: { ki: true },
      primaryTabs: ['combattimento', 'armi', 'talenti'],
      description: 'Combattente ascetico che padroneggia il combattimento disarmato e canalizza l\'energia ki.',
      saves: { fort: 'good', ref: 'good', will: 'good' },
      icon: 'fa-solid fa-hand-fist',
      startingGold: { dice: 1, sides: 6, multiplier: 10 },
    },
    {
      id: 'paladino',
      name: 'Paladino',
      type: 'base',
      hitDie: 10,
      bab: 'full',
      skillPts: 2,
      hasSpellsTab: true,
      spellAbility: 'wis',
      features: { smite: true, layOnHands: true, channel: true },
      primaryTabs: ['combattimento', 'incantesimi'],
      description: 'Campione della legge e del bene con poteri divini per punire i malvagi e guarire gli alleati.',
      saves: { fort: 'good', ref: 'bad', will: 'good' },
      icon: 'fa-solid fa-shield',
      startingGold: { dice: 5, sides: 6, multiplier: 10 },
    },
    {
      id: 'ranger',
      name: 'Ranger',
      type: 'base',
      hitDie: 10,
      bab: 'full',
      skillPts: 6,
      hasSpellsTab: true,
      spellAbility: 'wis',
      features: { animalComp: true },
      primaryTabs: ['combattimento', 'armi', 'abilita'],
      description: 'Cacciatore esperto con nemici prescelti, compagno animale e magia divina.',
      saves: { fort: 'good', ref: 'good', will: 'bad' },
      icon: 'fa-solid fa-compass',
      startingGold: { dice: 5, sides: 6, multiplier: 10 },
    },
    {
      id: 'stregone',
      name: 'Stregone',
      type: 'base',
      hitDie: 6,
      bab: 'half',
      skillPts: 2,
      hasSpellsTab: true,
      spellAbility: 'cha',
      features: { rageBloodline: true },
      primaryTabs: ['incantesimi', 'caratteristiche'],
      description: 'Lanciatore arcano con poteri innati derivanti dalla propria stirpe magica.',
      saves: { fort: 'bad', ref: 'bad', will: 'good' },
      icon: 'fa-solid fa-wand-magic-sparkles',
      startingGold: { dice: 2, sides: 6, multiplier: 10 },
    },

    // ══════════════════════════════════════════════════════════════════════
    // CLASSI AVANZATE (10)
    // ══════════════════════════════════════════════════════════════════════
    {
      id: 'alchimista',
      name: 'Alchimista',
      type: 'advanced',
      hitDie: 8,
      bab: '3_4',
      skillPts: 4,
      hasSpellsTab: true,       // usa estratti (come incantesimi)
      spellAbility: 'int',
      features: { bombs: true, mutagen: true, extracts: true },
      primaryTabs: ['incantesimi', 'equipaggiamento'],
      description: 'Scienziato arcano che padroneggia estratti, bombe e il potente mutageno.',
      saves: { fort: 'good', ref: 'good', will: 'bad' },
      icon: 'fa-solid fa-flask',
      startingGold: { dice: 3, sides: 6, multiplier: 10 },
    },
    {
      id: 'cavaliere',
      name: 'Cavaliere',
      type: 'advanced',
      hitDie: 10,
      bab: 'full',
      skillPts: 4,
      hasSpellsTab: false,
      spellAbility: null,
      features: { challenge: true, animalComp: true },
      primaryTabs: ['combattimento', 'armi'],
      description: 'Guerriero montato che segue un ordine cavalleresco e sfida i suoi avversari.',
      saves: { fort: 'good', ref: 'bad', will: 'bad' },
      icon: 'fa-solid fa-chess-knight',
      startingGold: { dice: 5, sides: 6, multiplier: 10 },
    },
    {
      id: 'convocatore',
      name: 'Convocatore',
      type: 'advanced',
      hitDie: 8,
      bab: '3_4',
      skillPts: 2,
      hasSpellsTab: true,
      spellAbility: 'cha',
      features: { eidolon: true },
      primaryTabs: ['incantesimi', 'caratteristiche'],
      description: 'Lanciatore di incantesimi con un potente eidolon come compagno permanente.',
      saves: { fort: 'bad', ref: 'bad', will: 'good' },
      icon: 'fa-solid fa-dragon',
      startingGold: { dice: 2, sides: 6, multiplier: 10 },
    },
    {
      id: 'fattucchiera',
      name: 'Fattucchiera',
      type: 'advanced',
      hitDie: 6,
      bab: 'half',
      skillPts: 2,
      hasSpellsTab: true,
      spellAbility: 'int',
      features: { hexes: true, familiar: true, patron: true },
      primaryTabs: ['incantesimi', 'caratteristiche'],
      description: 'Lanciatore arcano guidata da un misterioso patrono, con potenti maledizioni.',
      saves: { fort: 'bad', ref: 'bad', will: 'good' },
      icon: 'fa-solid fa-broom',
      startingGold: { dice: 3, sides: 6, multiplier: 10 },
    },
    {
      id: 'inquisitore',
      name: 'Inquisitore',
      type: 'advanced',
      hitDie: 8,
      bab: '3_4',
      skillPts: 6,
      hasSpellsTab: true,
      spellAbility: 'wis',
      features: { judgment: true, sneak: true },
      primaryTabs: ['combattimento', 'incantesimi', 'abilita'],
      description: 'Agente divino che usa giudizi, incantesimi e tattiche di combattimento per la sua divinità.',
      saves: { fort: 'good', ref: 'bad', will: 'good' },
      icon: 'fa-solid fa-scale-balanced',
      startingGold: { dice: 4, sides: 6, multiplier: 10 },
    },
    {
      id: 'magus',
      name: 'Magus',
      type: 'advanced',
      hitDie: 8,
      bab: '3_4',
      skillPts: 2,
      hasSpellsTab: true,
      spellAbility: 'int',
      features: { arcanePool: true, spellCombat: true },
      primaryTabs: ['combattimento', 'incantesimi'],
      description: 'Guerriero arcano che fonde magia e combattimento in mischia tramite la riserva arcana.',
      saves: { fort: 'good', ref: 'bad', will: 'good' },
      icon: 'fa-solid fa-bolt-lightning',
      startingGold: { dice: 4, sides: 6, multiplier: 10 },
    },
    {
      id: 'morfico',
      name: 'Morfico',
      type: 'advanced',
      hitDie: 10,
      bab: 'full',
      skillPts: 4,
      hasSpellsTab: false,
      spellAbility: null,
      features: { wildShape: true },
      primaryTabs: ['combattimento', 'armi'],
      description: 'Combattente capace di trasformarsi parzialmente in animali per potenziare gli attacchi.',
      saves: { fort: 'good', ref: 'bad', will: 'good' },
      icon: 'fa-solid fa-paw',
      startingGold: { dice: 3, sides: 6, multiplier: 10 },
    },
    {
      id: 'oracolo',
      name: 'Oracolo',
      type: 'advanced',
      hitDie: 8,
      bab: '3_4',
      skillPts: 4,
      hasSpellsTab: true,
      spellAbility: 'cha',
      features: { mystery: true, curse: true },
      primaryTabs: ['incantesimi', 'caratteristiche'],
      description: 'Lanciatore divino afflitto da una maledizione oracolare ma dotato di un potente mistero.',
      saves: { fort: 'bad', ref: 'bad', will: 'good' },
      icon: 'fa-solid fa-eye',
      startingGold: { dice: 3, sides: 6, multiplier: 10 },
    },
    {
      id: 'pistolero',
      name: 'Pistolero',
      type: 'advanced',
      hitDie: 10,
      bab: 'full',
      skillPts: 4,
      hasSpellsTab: false,
      spellAbility: null,
      features: { grit: true },
      primaryTabs: ['combattimento', 'armi'],
      description: 'Combattente con armi da fuoco che guadagna punti coraggio per eseguire prodezze speciali.',
      saves: { fort: 'good', ref: 'good', will: 'bad' },
      icon: 'fa-solid fa-crosshairs',
      startingGold: { dice: 5, sides: 6, multiplier: 10 },
    },
    {
      id: 'vigilante',
      name: 'Vigilante',
      type: 'advanced',
      hitDie: 8,
      bab: '3_4',
      skillPts: 4,
      hasSpellsTab: false,
      spellAbility: null,
      features: {},
      primaryTabs: ['combattimento', 'abilita'],
      description: 'Giustiziere con doppia identità – pubblica e vigilante – con talenti specializzati.',
      saves: { fort: 'bad', ref: 'good', will: 'good' },
      icon: 'fa-solid fa-mask',
      startingGold: { dice: 5, sides: 6, multiplier: 10 },
    },

    // ══════════════════════════════════════════════════════════════════════
    // CLASSI ALTERNATIVE (3)
    // ══════════════════════════════════════════════════════════════════════
    {
      id: 'antipaladino',
      name: 'Antipaladino',
      type: 'alternative',
      hitDie: 10,
      bab: 'full',
      skillPts: 2,
      hasSpellsTab: true,
      spellAbility: 'cha',
      features: { smite: true, channel: true },
      primaryTabs: ['combattimento', 'incantesimi'],
      description: 'Campione del caos e del male, versione oscura del paladino con poteri corrotti.',
      saves: { fort: 'good', ref: 'bad', will: 'good' },
      icon: 'fa-solid fa-skull-crossbones',
      startingGold: { dice: 5, sides: 6, multiplier: 10 },
    },
    {
      id: 'ninja',
      name: 'Ninja',
      type: 'alternative',
      hitDie: 8,
      bab: '3_4',
      skillPts: 8,
      hasSpellsTab: false,
      spellAbility: null,
      features: { ki: true, sneak: true },
      primaryTabs: ['abilita', 'armi'],
      description: 'Assassino furtivo orientale che usa ki e tattiche di guerriglia.',
      saves: { fort: 'bad', ref: 'good', will: 'bad' },
      icon: 'fa-solid fa-user-ninja',
      startingGold: { dice: 4, sides: 6, multiplier: 10 },
    },
    {
      id: 'samurai',
      name: 'Samurai',
      type: 'alternative',
      hitDie: 10,
      bab: 'full',
      skillPts: 4,
      hasSpellsTab: false,
      spellAbility: null,
      features: { resolve: true, challenge: true },
      primaryTabs: ['combattimento', 'armi', 'talenti'],
      description: 'Guerriero onorevole orientale con determinazione, ordine e sfida da cavaliere.',
      saves: { fort: 'good', ref: 'bad', will: 'bad' },
      icon: 'fa-solid fa-torii-gate',
      startingGold: { dice: 3, sides: 6, multiplier: 10 },
    },

    // ══════════════════════════════════════════════════════════════════════
    // CLASSI IBRIDE (9)
    // ══════════════════════════════════════════════════════════════════════
    {
      id: 'arcanista',
      name: 'Arcanista',
      type: 'hybrid',
      hitDie: 6,
      bab: 'half',
      skillPts: 2,
      hasSpellsTab: true,
      spellAbility: 'int',
      features: { arcaneRes: true },
      primaryTabs: ['incantesimi', 'caratteristiche'],
      description: 'Ibrido tra mago e stregone: prepara incantesimi ma li lancia con slot flessibili.',
      saves: { fort: 'bad', ref: 'bad', will: 'good' },
      icon: 'fa-solid fa-book-open',
      startingGold: { dice: 2, sides: 6, multiplier: 10 },
    },
    {
      id: 'attaccabrighe',
      name: 'Attaccabrighe',
      type: 'hybrid',
      hitDie: 10,
      bab: 'full',
      skillPts: 4,
      hasSpellsTab: false,
      spellAbility: null,
      features: {},
      primaryTabs: ['combattimento', 'armi', 'talenti'],
      description: 'Ibrido tra guerriero e monaco specializzato nel combattimento disarmato e flessibilità marziale.',
      saves: { fort: 'good', ref: 'good', will: 'bad' },
      icon: 'fa-solid fa-hand-fist',
      startingGold: { dice: 3, sides: 6, multiplier: 10 },
    },
    {
      id: 'cacciatore',
      name: 'Cacciatore',
      type: 'hybrid',
      hitDie: 8,
      bab: '3_4',
      skillPts: 6,
      hasSpellsTab: true,
      spellAbility: 'wis',
      features: { animalComp: true, wildShape: true },
      primaryTabs: ['combattimento', 'abilita'],
      description: 'Ibrido tra ranger e druido, cacciatore esperto con un poderoso compagno animale.',
      saves: { fort: 'good', ref: 'good', will: 'bad' },
      icon: 'fa-solid fa-binoculars',
      startingGold: { dice: 4, sides: 6, multiplier: 10 },
    },
    {
      id: 'iracondo_stirpe',
      name: 'Iracondo di Stirpe',
      type: 'hybrid',
      hitDie: 10,
      bab: 'full',
      skillPts: 4,
      hasSpellsTab: true,
      spellAbility: 'cha',
      features: { rage: true, rageBloodline: true },
      primaryTabs: ['combattimento', 'incantesimi', 'armi'],
      description: 'Ibrido tra barbaro e stregone: guerriero furioso con poteri di stirpe e incantesimi arcani.',
      saves: { fort: 'good', ref: 'bad', will: 'bad' },
      icon: 'fa-solid fa-fire',
      startingGold: { dice: 3, sides: 6, multiplier: 10 },
    },
    {
      id: 'guardiamarca',
      name: 'Guardiamarca',
      type: 'hybrid',
      hitDie: 8,
      bab: '3_4',
      skillPts: 4,
      hasSpellsTab: true,
      spellAbility: 'wis',
      features: { sacredWeapon: true, channel: true },
      primaryTabs: ['combattimento', 'incantesimi'],
      description: 'Ibrido tra chierico e guerriero con benedizioni divine e arma sacra.',
      saves: { fort: 'good', ref: 'bad', will: 'good' },
      icon: 'fa-solid fa-hammer',
      startingGold: { dice: 4, sides: 6, multiplier: 10 },
    },
    {
      id: 'schermagliatore',
      name: 'Schermagliatore',
      type: 'hybrid',
      hitDie: 10,
      bab: 'full',
      skillPts: 4,
      hasSpellsTab: false,
      spellAbility: null,
      features: { panache: true },
      primaryTabs: ['combattimento', 'armi'],
      description: 'Ibrido tra guerriero e bardo, maestro della spada che usa bravura per eseguire prodezze.',
      saves: { fort: 'bad', ref: 'good', will: 'bad' },
      icon: 'fa-solid fa-feather',
      startingGold: { dice: 5, sides: 6, multiplier: 10 },
    },
    {
      id: 'sciamano',
      name: 'Sciamano',
      type: 'hybrid',
      hitDie: 8,
      bab: '3_4',
      skillPts: 4,
      hasSpellsTab: true,
      spellAbility: 'wis',
      features: { hexes: true, spiritMagic: true },
      primaryTabs: ['incantesimi', 'caratteristiche'],
      description: 'Ibrido tra oracolo e fattucchiera che comunica con gli spiriti e usa maledizioni.',
      saves: { fort: 'bad', ref: 'bad', will: 'good' },
      icon: 'fa-solid fa-ghost',
      startingGold: { dice: 3, sides: 6, multiplier: 10 },
    },
    {
      id: 'skald',
      name: 'Skald',
      type: 'hybrid',
      hitDie: 8,
      bab: '3_4',
      skillPts: 6,
      hasSpellsTab: true,
      spellAbility: 'cha',
      features: { rage: true, bardPerf: true },
      primaryTabs: ['combattimento', 'incantesimi'],
      description: 'Ibrido tra bardo e barbaro che infonde furia nei compagni tramite canti di guerra.',
      saves: { fort: 'good', ref: 'bad', will: 'good' },
      icon: 'fa-solid fa-drum',
      startingGold: { dice: 3, sides: 6, multiplier: 10 },
    },
    {
      id: 'spia',
      name: 'Spia',
      type: 'hybrid',
      hitDie: 8,
      bab: '3_4',
      skillPts: 6,
      hasSpellsTab: true,
      spellAbility: 'int',
      features: { sneak: true, extracts: true },
      primaryTabs: ['abilita', 'incantesimi'],
      description: 'Ibrido tra alchimista e ladro: investigatore acuto con estratti e attacco furtivo.',
      saves: { fort: 'bad', ref: 'good', will: 'good' },
      icon: 'fa-solid fa-magnifying-glass',
      startingGold: { dice: 4, sides: 6, multiplier: 10 },
    },
  ];

  // ══════════════════════════════════════════════════════════════════════
  // ARCHETIPI per classe (id → array di { id, name, [classSkillAdd], [classSkillRemove], [featureOverrides] })
  // classSkillAdd / classSkillRemove usano gli stessi skill IDs di CLASS_SKILLS.
  // featureOverrides sostituisce flag specifici del profilo UI (es. { bardPerf: false }).
  // ══════════════════════════════════════════════════════════════════════
  const ARCHETYPES = {

    // ── BARBARO ─────────────────────────────────────────────────────────────
    barbaro: [
      // APG
      { id: 'iracondo_invulnerabile',  name: 'Iracondo Invulnerabile' },
      { id: 'barbaro_urbano',          name: 'Barbaro Urbano',
        classSkillAdd: ['bluff','diplomazia','conoscenze_locale','senso_moti','travestimento'],
        classSkillRemove: ['nuotare','sopravvivenza'] },
      { id: 'seguace_totem',           name: 'Seguace del Totem' },
      { id: 'cavaliere_barbaro',       name: 'Cavaliere Barbaro',
        classSkillAdd: ['addestrare_animali','cavalcare'] },
      { id: 'predone_mare',            name: 'Predone del Mare',
        classSkillAdd: ['nuotare','scalare'] },
      { id: 'superstizioso',           name: 'Superstizioso' },
      { id: 'vero_primitivo',          name: 'Vero Primitivo',
        classSkillRemove: ['cavalcare'] },
      { id: 'barbaro_selvaggio',       name: 'Barbaro Selvaggio' },
      { id: 'discendente_elementale',  name: 'Discendente Elementale' },
      { id: 'barbaro_beone',           name: 'Barbaro Beone' },
      { id: 'cantastorie_tribale',     name: 'Cantastorie Tribale',
        classSkillAdd: ['esibizione'] },
      { id: 'sciamano_polvere',        name: 'Sciamano della Polvere',
        classSkillAdd: ['conoscenze_arcane','magia'] },
      // UC
      { id: 'colosso_corazzato',       name: 'Colosso Corazzato' },
      { id: 'pugile_brutale',          name: 'Pugile Brutale' },
      { id: 'cane_pazzo',              name: 'Cane Pazzo',
        classSkillAdd: ['addestrare_animali'] },
      { id: 'iracondo_branco',         name: 'Iracondo del Branco',
        classSkillAdd: ['diplomazia','senso_moti'] },
      { id: 'iracondo_cicatrizzato',   name: 'Iracondo Cicatrizzato' },
      { id: 'massacratore_titani',     name: 'Massacratore dei Titani' },
      { id: 'iracondo_selvaggio',      name: 'Iracondo Selvaggio' },
      { id: 'demolitore',              name: 'Demolitore' },
      { id: 'temerario',               name: 'Temerario' },
      { id: 'cavaliere_stellato_bar',  name: 'Cavaliere Stellato' },
    ],

    // ── BARDO ────────────────────────────────────────────────────────────────
    bardo: [
      // APG
      { id: 'arcano_duellante',        name: 'Arcano Duellante' },
      { id: 'bardo_corte',             name: 'Bardo di Corte',
        classSkillAdd: ['conoscenze_nobili','diplomazia'] },
      { id: 'investigatore_bardo',     name: 'Investigatore',
        classSkillAdd: ['disattivare_cong'] },
      { id: 'bardo_lamento',           name: 'Bardo del Lamento',
        classSkillAdd: ['conoscenze_religione'] },
      { id: 'geisha',                  name: 'Geisha',
        classSkillAdd: ['guarire'] },
      { id: 'prestigiatore',           name: 'Prestigiatore',
        classSkillAdd: ['usare_ogm'] },
      { id: 'menestello',              name: 'Menestello' },
      { id: 'trovatore',               name: 'Trovatore' },
      { id: 'coreuta',                 name: 'Coreuta' },
      { id: 'possessore_segreti',      name: 'Possessore di Segreti',
        featureOverrides: { bardPerf: false } },
      { id: 'veggente_arcano',         name: 'Veggente Arcano',
        classSkillAdd: ['conoscenze_arcane','magia'] },
      { id: 'maestro_strumenti',       name: 'Maestro degli Strumenti' },
      // UC
      { id: 'archeologo',              name: 'Archeologo',
        featureOverrides: { bardPerf: false },
        classSkillAdd: ['disattivare_cong','percezione'] },
      { id: 'danzatore_derviscio',     name: 'Danzatore Derviscio',
        featureOverrides: { bardPerf: false } },
      { id: 'chiama_tuono',            name: 'Chiama-Tuono' },
      { id: 'guaritore_canoro',        name: 'Guaritore Canoro',
        classSkillAdd: ['guarire'],
        featureOverrides: { bardPerf: false } },
      { id: 'danzatore_fiamme',        name: 'Danzatore delle Fiamme' },
      // UM
      { id: 'dialogante_animali',      name: 'Dialogante con gli Animali',
        classSkillAdd: ['addestrare_animali'] },
      { id: 'demagogo',                name: 'Demagogo',
        classSkillAdd: ['bluff','intimidire'] },
    ],

    // ── CHIERICO ─────────────────────────────────────────────────────────────
    chierico: [
      // APG
      { id: 'crociato',                name: 'Crociato' },
      { id: 'claustrale',              name: 'Chierico Claustrale',
        featureOverrides: { channel: false },
        classSkillAdd: ['conoscenze_arcane','conoscenze_dunsioni','conoscenze_natura','conoscenze_piani'] },
      { id: 'separatista',             name: 'Separatista' },
      { id: 'teologo',                 name: 'Teologo' },
      // UC
      { id: 'evangelista',             name: 'Evangelista',
        classSkillAdd: ['esibizione'] },
      { id: 'guaritore_misericordioso',name: 'Guaritore Misericordioso',
        classSkillAdd: ['guarire'] },
      { id: 'signore_nonmorti',        name: 'Signore dei Nonmorti',
        classSkillAdd: ['conoscenze_arcane'] },
      // UM
      { id: 'cardinale',               name: 'Cardinale',
        classSkillAdd: ['bluff','diplomazia','senso_moti'] },
      { id: 'stratega_divino',         name: 'Stratega Divino',
        classSkillAdd: ['conoscenze_storia'] },
      { id: 'sacerdote_combattente',   name: 'Sacerdote Combattente' },
      { id: 'curatore',                name: 'Curatore',
        classSkillAdd: ['guarire'] },
      { id: 'pontefice',               name: 'Pontefice',
        classSkillAdd: ['diplomazia','conoscenze_nobili'] },
      { id: 'esorcista',               name: 'Esorcista',
        classSkillAdd: ['conoscenze_piani','magia'] },
      { id: 'incanalatore_divino',     name: 'Incanalatore Divino' },
      { id: 'sacerdote_altare',        name: 'Sacerdote dell\'Altare' },
    ],

    // ── DRUIDO ───────────────────────────────────────────────────────────────
    druido: [
      // APG — ambienti
      { id: 'druido_acquatico',        name: 'Druido Acquatico',
        classSkillAdd: ['nuotare'] },
      { id: 'druido_artico',           name: 'Druido Artico',
        classSkillAdd: ['scalare'] },
      { id: 'druido_caverna',          name: 'Druido della Caverna',
        classSkillAdd: ['conoscenze_dunsioni'] },
      { id: 'druido_deserto',          name: 'Druido del Deserto',
        classSkillRemove: ['nuotare'] },
      { id: 'druido_giungla',          name: 'Druido della Giungla' },
      { id: 'druido_montagna',         name: 'Druido della Montagna',
        classSkillAdd: ['scalare'] },
      { id: 'druido_pianura',          name: 'Druido della Pianura',
        classSkillAdd: ['cavalcare'] },
      { id: 'druido_palude',           name: 'Druido della Palude',
        classSkillAdd: ['furtivita','nuotare'] },
      { id: 'druido_urbano',           name: 'Druido Urbano',
        classSkillAdd: ['bluff','conoscenze_locale','diplomazia'],
        classSkillRemove: ['sopravvivenza'] },
      { id: 'druido_pestilenza',       name: 'Druido della Pestilenza',
        featureOverrides: { companion: false } },
      { id: 'custode_natura',          name: 'Custode della Natura' },
      { id: 'animale_battaglia',       name: 'Animale da Battaglia',
        classSkillAdd: ['intimidire'] },
      { id: 'pastore_selvaggio',       name: 'Pastore Selvaggio',
        classSkillAdd: ['addestrare_animali'] },
      { id: 'druido_viaggio',          name: 'Druido del Viaggio' },
      { id: 'scolpitore_elementi',     name: 'Scolpitore di Elementi' },
      { id: 'signore_tempesta',        name: 'Signore della Tempesta' },
      // UC
      { id: 'invocatore_luna',         name: 'Invocatore della Luna' },
      { id: 'esperto_menhir',          name: 'Esperto dei Menhir',
        classSkillAdd: ['conoscenze_arcane','magia'] },
      { id: 'signore_branco',          name: 'Signore del Branco',
        featureOverrides: { companion: false } },
      { id: 'zanna_natura',            name: 'Zanna della Natura',
        featureOverrides: { companion: false } },
    ],

    // ── GUERRIERO ────────────────────────────────────────────────────────────
    guerriero: [
      // APG
      { id: 'arciere',                 name: 'Arciere' },
      { id: 'due_armi',                name: 'Combattente a Due Armi' },
      { id: 'torre',                   name: 'Specialista dello Scudo a Torre' },
      { id: 'rovina_mostri',           name: 'Rovina dei Mostri',
        classSkillAdd: ['conoscenze_arcane','conoscenze_dunsioni','conoscenze_natura','conoscenze_piani','conoscenze_religione'] },
      { id: 'campione_popolo',         name: 'Campione del Popolo',
        classSkillAdd: ['diplomazia'] },
      { id: 'tattico',                 name: 'Tattico',
        classSkillAdd: ['conoscenze_storia','senso_moti'] },
      { id: 'bruto',                   name: 'Bruto',
        featureOverrides: { rage: true } },
      { id: 'cavaliere_stellato',      name: 'Cavaliere Stellato' },
      // UC
      { id: 'gladiatore',              name: 'Gladiatore',
        classSkillAdd: ['bluff','esibizione','senso_moti'] },
      { id: 'guardia_corpo',           name: 'Guardia del Corpo',
        classSkillAdd: ['senso_moti'] },
      { id: 'guerriero_mobile',        name: 'Guerriero Mobile' },
      { id: 'cavaliere_guerra',        name: 'Cavaliere da Guerra',
        classSkillAdd: ['addestrare_animali','cavalcare'] },
      { id: 'maestro_armi',            name: 'Maestro delle Armi' },
      { id: 'demolizitore_guer',       name: 'Demolitore' },
      { id: 'guerriero_difesa',        name: 'Guerriero della Difesa' },
      { id: 'guerriero_fede',          name: 'Guerriero della Fede',
        classSkillAdd: ['conoscenze_religione','senso_moti'] },
      // UM
      { id: 'armigero',                name: 'Armigero',
        classSkillAdd: ['conoscenze_nobili'] },
      { id: 'guerriero_pugno',         name: 'Guerriero a Mani Nude' },
    ],

    // ── LADRO ────────────────────────────────────────────────────────────────
    ladro: [
      // APG
      { id: 'acrobatico',              name: 'Assassino Acrobatico' },
      { id: 'collezionista_taglie',    name: 'Collezionista di Taglie',
        classSkillAdd: ['percezione','sopravvivenza'] },
      { id: 'esploratore',             name: 'Esploratore',
        classSkillAdd: ['conoscenze_dunsioni','conoscenze_natura'] },
      { id: 'maestro_coltelli',        name: 'Maestro dei Coltelli' },
      { id: 'spia_ladro',              name: 'Spia',
        classSkillAdd: ['travestimento'] },
      { id: 'stalker',                 name: 'Stalker',
        classSkillAdd: ['furtivita'] },
      { id: 'truffatore',              name: 'Truffatore',
        classSkillAdd: ['bluff','senso_moti','travestimento'] },
      // UC
      { id: 'assassino_ladro',         name: 'Assassino',
        classSkillAdd: ['travestimento'] },
      { id: 'bucaniere',               name: 'Bucaniere',
        classSkillAdd: ['nuotare','scalare'] },
      { id: 'cecchino_ladro',          name: 'Cecchino',
        classSkillAdd: ['percezione','furtivita'] },
      { id: 'contrabbandiere',         name: 'Contrabbandiere',
        classSkillAdd: ['bluff','travestimento'] },
      { id: 'pirata_ladro',            name: 'Pirata',
        classSkillAdd: ['nuotare','scalare','intimidire'] },
      { id: 'falsificatore',           name: 'Falsificatore',
        classSkillAdd: ['artigianato','linguistica'] },
      { id: 'investigatore_ladro',     name: 'Investigatore',
        classSkillAdd: ['diplomazia','senso_moti','linguistica'] },
      { id: 'scassinatore',            name: 'Scassinatore',
        classSkillAdd: ['conoscenze_dunsioni','conoscenze_ingegneria'] },
      { id: 'calcolatore',             name: 'Calcolatore',
        classSkillAdd: ['conoscenze_locale'] },
    ],

    // ── MAGO ─────────────────────────────────────────────────────────────────
    mago: [
      // Scuole (APG/Core)
      { id: 'spec_abiurazione',        name: 'Specialista di Abiurazione' },
      { id: 'spec_ammaliamento',       name: 'Specialista di Ammaliamento' },
      { id: 'spec_congiunzione',       name: 'Specialista di Congiunzione' },
      { id: 'spec_divinazione',        name: 'Specialista di Divinazione' },
      { id: 'spec_evocazione',         name: 'Specialista di Evocazione' },
      { id: 'spec_illusione',          name: 'Specialista di Illusione' },
      { id: 'spec_negromanzia',        name: 'Specialista di Negromanzia' },
      { id: 'spec_trasmutazione',      name: 'Specialista di Trasmutazione' },
      { id: 'universalista',           name: 'Universalista' },
      // APG
      { id: 'legato_libro',            name: 'Mago Legato al Libro' },
      { id: 'mago_elementale',         name: 'Mago Elementale' },
      // UC
      { id: 'mago_guerra',             name: 'Mago da Guerra' },
      { id: 'mago_duellante',          name: 'Mago Duellante',
        classSkillAdd: ['acrobazia'] },
      // UM
      { id: 'magister',                name: 'Magister' },
      { id: 'contromagista',           name: 'Contromagista' },
      { id: 'mago_sangue',             name: 'Mago del Sangue' },
    ],

    // ── MONACO ───────────────────────────────────────────────────────────────
    monaco: [
      // APG
      { id: 'pugno_ferro',             name: 'Monaco del Pugno di Ferro' },
      { id: 'mano_vuota',              name: 'Monaco della Mano Vuota' },
      { id: 'studioso_forma',          name: 'Studioso della Forma Interna' },
      { id: 'kata_maestro',            name: 'Kata Maestro',
        classSkillAdd: ['esibizione'] },
      { id: 'monaco_quattro_venti',    name: 'Monaco dei Quattro Venti' },
      { id: 'danzatore_vento',         name: 'Danzatore del Vento' },
      // UC
      { id: 'maestro_bastone',         name: 'Maestro del Bastone' },
      { id: 'monaco_zen',              name: 'Monaco Zen Arciere',
        classSkillAdd: ['percezione'] },
      { id: 'guerriero_stellato',      name: 'Guerriero Stellato' },
      { id: 'monaco_ombra',            name: 'Monaco dell\'Ombra',
        classSkillAdd: ['furtivita','travestimento'] },
      { id: 'monaco_cintura',          name: 'Monaco della Cintura Mantenuta',
        featureOverrides: { ki: false } },
      { id: 'monaco_vuoto',            name: 'Monaco del Vuoto Interiore',
        featureOverrides: { ki: false } },
      // UM
      { id: 'monaco_sangue_sacro',     name: 'Monaco del Sangue Sacro',
        classSkillAdd: ['conoscenze_religione'] },
      { id: 'monaco_asceta',           name: 'Monaco Asceta' },
      { id: 'monaco_vortice',          name: 'Monaco del Vortice' },
    ],

    // ── PALADINO ─────────────────────────────────────────────────────────────
    paladino: [
      // APG
      { id: 'mezza_luna',              name: 'Cavaliere della Mezza Luna' },
      { id: 'difensore_fede',          name: 'Difensore della Vera Fede' },
      { id: 'campione_altare',         name: 'Campione dell\'Altare' },
      { id: 'sacerdote_sacro',         name: 'Sacerdote Sacro',
        classSkillAdd: ['conoscenze_arcane'] },
      { id: 'templare',                name: 'Templare' },
      // UC
      { id: 'cavaliere_sacro',         name: 'Cavaliere Sacro',
        classSkillAdd: ['addestrare_animali','cavalcare'] },
      { id: 'inquisitore_sacro',       name: 'Inquisitore Sacro',
        classSkillAdd: ['intimidire','percezione'] },
      { id: 'paladino_arco',           name: 'Paladino dell\'Arco' },
      { id: 'protettore_divino',       name: 'Protettore Divino' },
      // UM
      { id: 'paladino_misericordia',   name: 'Paladino della Misericordia',
        classSkillAdd: ['guarire'] },
      { id: 'difensore_onore',         name: 'Difensore dell\'Onore' },
      { id: 'guerriero_sacro',         name: 'Guerriero Sacro' },
    ],

    // ── RANGER ───────────────────────────────────────────────────────────────
    ranger: [
      // APG
      { id: 'cacciatore_mostri',       name: 'Cacciatore di Mostri',
        classSkillAdd: ['conoscenze_arcane','conoscenze_dunsioni','conoscenze_natura','conoscenze_piani','conoscenze_religione'] },
      { id: 'arciere_foresta',         name: 'Arciere della Foresta' },
      { id: 'segugio',                 name: 'Segugio',
        classSkillAdd: ['percezione','senso_moti'] },
      { id: 'cavalcatore_cielo',       name: 'Cavalcatore del Cielo',
        classSkillAdd: ['volare'] },
      { id: 'nomade',                  name: 'Nomade' },
      { id: 'custode_selvaggio',       name: 'Custode delle Terre Selvagge' },
      // UC
      { id: 'ranger_urbano',           name: 'Ranger Urbano',
        classSkillAdd: ['bluff','diplomazia','conoscenze_locale','travestimento'],
        classSkillRemove: ['conoscenze_natura','sopravvivenza'] },
      { id: 'naturalista_ranger',      name: 'Naturalista',
        classSkillAdd: ['guarire','conoscenze_natura'] },
      { id: 'predone_terra',           name: 'Predone della Terra' },
      { id: 'trapper',                 name: 'Trapper',
        classSkillAdd: ['conoscenze_dunsioni'] },
      // UM
      { id: 'ranger_cavalcante',       name: 'Ranger a Cavallo',
        classSkillAdd: ['addestrare_animali','cavalcare'] },
      { id: 'guardiano_ranger',        name: 'Guardiano' },
    ],

    // ── STREGONE ─────────────────────────────────────────────────────────────
    stregone: [
      // APG
      { id: 'mago_arcano',             name: 'Mago Arcano' },
      { id: 'sanguemisto',             name: 'Sanguemisto' },
      { id: 'elementalista',           name: 'Elementalista' },
      { id: 'stregone_familiare',      name: 'Stregone del Familiare' },
      // UC
      { id: 'mangiastorie',            name: 'Divorastorie',
        classSkillAdd: ['bluff','diplomazia','intimidire'] },
      { id: 'stregone_maledetto',      name: 'Stregone Maledetto' },
      // UM
      { id: 'stregone_destino',        name: 'Stregone del Destino' },
      { id: 'stregone_ombre',          name: 'Stregone delle Ombre' },
      { id: 'stregone_sangue',         name: 'Mago del Sangue' },
      { id: 'stregone_tattoo',         name: 'Stregone dei Tatuaggi' },
    ],

    // ── ALCHIMISTA ───────────────────────────────────────────────────────────
    alchimista: [
      // APG
      { id: 'bombardiere',             name: 'Bombardiere' },
      { id: 'chirurgo',                name: 'Chirurgo',
        classSkillAdd: ['guarire'] },
      { id: 'veleniere',               name: 'Veleniere' },
      // UC
      { id: 'formulista',              name: 'Formulista' },
      { id: 'trasformatore',           name: 'Trasformatore' },
      { id: 'alchimista_viscerale',    name: 'Alchimista Viscerale' },
      { id: 'distillatore',            name: 'Distillatore' },
      { id: 'estrattore',              name: 'Estrattore' },
      // UM
      { id: 'mutante',                 name: 'Mutante' },
      { id: 'coltivatore_alch',        name: 'Coltivatore Alchemico',
        classSkillAdd: ['conoscenze_natura'] },
      { id: 'alch_cognitivo',          name: 'Alchimista Cognitivo',
        classSkillAdd: ['conoscenze_arcane','conoscenze_storia'] },
      { id: 'riciclatore',             name: 'Riciclatore' },
    ],

    // ── CAVALIERE ────────────────────────────────────────────────────────────
    cavaliere: [
      // APG
      { id: 'signore_cavallo',         name: 'Signore del Cavallo' },
      { id: 'comandante',              name: 'Comandante',
        classSkillAdd: ['diplomazia','conoscenze_nobili'] },
      { id: 'cavaliere_errante',       name: 'Cavaliere Errante' },
      // UC
      { id: 'campione_ordine',         name: 'Campione dell\'Ordine' },
      { id: 'cacciatore_cav',          name: 'Cacciatore a Cavallo',
        classSkillAdd: ['percezione','sopravvivenza'] },
      { id: 'guardiano_cav',           name: 'Guardiano',
        classSkillAdd: ['guarire','senso_moti'] },
      { id: 'cavaliere_piedi',         name: 'Cavaliere a Piedi' },
      { id: 'cavaliere_dragone',       name: 'Cavaliere del Drago' },
    ],

    // ── CONVOCATORE ──────────────────────────────────────────────────────────
    convocatore: [
      // APG
      { id: 'bestia_convocatore',      name: 'Convocatore della Bestia' },
      { id: 'summoner_patto',          name: 'Convocatore del Patto' },
      // UC
      { id: 'convocatore_definitivo',  name: 'Grande Convocatore',
        featureOverrides: { companion: false } },
      { id: 'maestro_piaga',           name: 'Maestro della Piaga' },
      { id: 'convocatore_naturale',    name: 'Convocatore Naturale',
        classSkillAdd: ['conoscenze_natura','sopravvivenza'] },
    ],

    // ── FATTUCCHIERA ─────────────────────────────────────────────────────────
    fattucchiera: [
      // APG
      { id: 'fattucchiera_cacciatrice',name: 'Fattucchiera Cacciatrice' },
      { id: 'fattucchiera_natura',     name: 'Fattucchiera della Natura',
        classSkillAdd: ['addestrare_animali','sopravvivenza'] },
      { id: 'fattucchiera_carnevale',  name: 'Fattucchiera Carnevalesca',
        classSkillAdd: ['esibizione'] },
      { id: 'strega_fate',             name: 'Ostetrica delle Fate' },
      // UC
      { id: 'fattucchiera_ghiaccio',   name: 'Fattucchiera del Ghiaccio' },
      { id: 'strega_corvo',            name: 'Strega del Corvo' },
      { id: 'fattucchiera_maledizione',name: 'Fattucchiera della Maledizione' },
      // UM
      { id: 'fattucchiera_cielo',      name: 'Fattucchiera del Cielo',
        classSkillAdd: ['volare'] },
      { id: 'fattucchiera_veleno',     name: 'Fattucchiera del Veleno' },
    ],

    // ── INQUISITORE ──────────────────────────────────────────────────────────
    inquisitore: [
      // APG
      { id: 'esaminatore',             name: 'Esaminatore',
        classSkillAdd: ['disattivare_cong','linguistica'] },
      { id: 'cacciatore_inquisitore',  name: 'Cacciatore di Mostri',
        classSkillAdd: ['conoscenze_arcane','conoscenze_natura','conoscenze_piani','conoscenze_religione'] },
      { id: 'segugio_inquisitore',     name: 'Segugio',
        classSkillAdd: ['percezione','senso_moti'] },
      { id: 'incorrotto',              name: 'Incorrotto' },
      // UC
      { id: 'terrore_empi',            name: 'Terrore degli Empi',
        classSkillAdd: ['intimidire'] },
      { id: 'giustiziere',             name: 'Giustiziere' },
      { id: 'inquisitore_ombra',       name: 'Inquisitore Oscuro',
        classSkillAdd: ['furtivita','travestimento'] },
      { id: 'cacciatore_vampiri',      name: 'Cacciatore di Vampiri' },
      // UM
      { id: 'scopritore_eresie',       name: 'Scopritore di Eresie',
        classSkillAdd: ['conoscenze_arcane','conoscenze_religione'] },
    ],

    // ── MAGUS ────────────────────────────────────────────────────────────────
    magus: [
      // APG
      { id: 'magus_kensai',            name: 'Kensai' },
      { id: 'magus_anime',             name: 'Magus Anime' },
      // UC
      { id: 'magus_lame',              name: 'Danzatore di Lame',
        classSkillAdd: ['acrobazia','esibizione'] },
      { id: 'magus_arcano',            name: 'Stregone Arcano' },
      { id: 'sferzatore_arcano',       name: 'Sferzatore Arcano' },
      { id: 'magus_acqua',             name: 'Magus delle Acque',
        classSkillAdd: ['nuotare'] },
      { id: 'magus_sangue',            name: 'Magus del Sangue' },
      { id: 'magus_vuoto',             name: 'Magus del Vuoto' },
      // UM
      { id: 'magus_mirabile',          name: 'Magus Mirabile' },
    ],

    // ── MORFICO ──────────────────────────────────────────────────────────────
    morfico: [
      { id: 'mannaro_benedetto',       name: 'Mannaro Benedetto' },
      { id: 'esploratore_bestiale',    name: 'Esploratore Bestiale' },
      { id: 'shifter_elementale',      name: 'Trasmutatore Elementale' },
      { id: 'morfico_ferale',          name: 'Morfico Ferale',
        classSkillAdd: ['intimidire'] },
      { id: 'morfico_libero',          name: 'Morfico Libero' },
      { id: 'guardiano_forma',         name: 'Guardiano della Forma' },
    ],

    // ── ORACOLO ──────────────────────────────────────────────────────────────
    oracolo: [
      // APG
      { id: 'oracolo_battito',         name: 'Oracolo del Battito del Cuore' },
      { id: 'cavaliere_oracolo',       name: 'Cavaliere dell\'Oracolo',
        classSkillAdd: ['addestrare_animali','cavalcare'] },
      { id: 'oracolo_guerra',          name: 'Oracolo di Guerra',
        classSkillAdd: ['intimidire'] },
      // UC
      { id: 'oracolo_guaritore',       name: 'Guaritore Divino',
        classSkillAdd: ['guarire'] },
      { id: 'oracolo_cieco',           name: 'Oracolo Cieco' },
      { id: 'oracolo_sangue',          name: 'Oracolo del Sangue' },
      { id: 'oracolo_tempesta',        name: 'Oracolo della Tempesta' },
      { id: 'oracolo_antichita',       name: 'Oracolo dell\'Antichità' },
    ],

    // ── PISTOLERO ────────────────────────────────────────────────────────────
    pistolero: [
      // UC
      { id: 'tiratore_scelto',         name: 'Tiratore Scelto' },
      { id: 'cacciatore_pistola',      name: 'Cacciatore Pistolero',
        classSkillAdd: ['conoscenze_natura','sopravvivenza'] },
      { id: 'pistolero_pellegrino',    name: 'Pistolero Pellegrino' },
      { id: 'duellante_pistola',       name: 'Duellante con Pistola' },
      { id: 'pistolero_corsaro',       name: 'Pistolero Corsaro',
        classSkillAdd: ['nuotare','scalare'] },
      { id: 'soldato_polvere',         name: 'Soldato della Polvere' },
      { id: 'pistolero_ombra',         name: 'Pistolero delle Ombre',
        classSkillAdd: ['furtivita'] },
    ],

    // ── VIGILANTE ────────────────────────────────────────────────────────────
    vigilante: [
      // ACG
      { id: 'avventuriero_identita',   name: 'Vigilante Avventuriero' },
      { id: 'cacciatore_identita',     name: 'Vigilante Cacciatore',
        classSkillAdd: ['conoscenze_natura','sopravvivenza'] },
      { id: 'vigilante_arcano',        name: 'Vigilante Arcano',
        classSkillAdd: ['conoscenze_arcane','magia'] },
      { id: 'vigilante_ombra',         name: 'Vigilante delle Ombre',
        classSkillAdd: ['furtivita'] },
      { id: 'vigilante_rete',          name: 'Vigilante della Rete',
        classSkillAdd: ['diplomazia','bluff'] },
    ],

    // ── ANTIPALADINO ─────────────────────────────────────────────────────────
    antipaladino: [
      { id: 'signore_morte',           name: 'Signore della Morte',
        classSkillAdd: ['conoscenze_arcane'] },
      { id: 'terrore_armate',          name: 'Terrore delle Armate',
        classSkillAdd: ['intimidire'] },
      { id: 'campione_oscuro',         name: 'Campione Oscuro' },
      { id: 'servitore_purgatorio',    name: 'Servitore del Purgatorio' },
      { id: 'vendicatore_oscuro',      name: 'Vendicatore Oscuro' },
    ],

    // ── NINJA ────────────────────────────────────────────────────────────────
    ninja: [
      { id: 'shinobi_ombre',           name: 'Shinobi delle Ombre',
        classSkillAdd: ['furtivita'] },
      { id: 'ninja_veleno',            name: 'Ninja Veleniere' },
      { id: 'ninja_acqua',             name: 'Ninja dell\'Acqua',
        classSkillAdd: ['nuotare'] },
      { id: 'ninja_senza_armatura',    name: 'Ninja Senz\'Armatura',
        featureOverrides: { sneak: true } },
      { id: 'cacciatore_ninja',        name: 'Cacciatore Ninja',
        classSkillAdd: ['conoscenze_natura','sopravvivenza'] },
    ],

    // ── SAMURAI ──────────────────────────────────────────────────────────────
    samurai: [
      { id: 'ronin',                   name: 'Ronin' },
      { id: 'guerriero_vincolo',       name: 'Guerriero del Vincolo' },
      { id: 'samurai_bandiera',        name: 'Samurai della Bandiera',
        classSkillAdd: ['conoscenze_storia'] },
      { id: 'samurai_arco',            name: 'Samurai dell\'Arco' },
      { id: 'onorevole_samurai',       name: 'Samurai Onorevole' },
    ],

    // ── ARCANISTA ────────────────────────────────────────────────────────────
    arcanista: [
      // ACG
      { id: 'mago_esplosivo',          name: 'Mago Esplosivo' },
      { id: 'sangue_arcano',           name: 'Sangue Arcano' },
      { id: 'arcanista_neutra',        name: 'Arcanista Neutra' },
      { id: 'arcanista_familiare',     name: 'Arcanista del Familiare' },
      { id: 'arcanista_ombra',         name: 'Arcanista delle Ombre',
        classSkillAdd: ['furtivita'] },
      { id: 'arcanista_fuoco',         name: 'Arcanista del Fuoco' },
      { id: 'arcanista_libri',         name: 'Arcanista dei Libri' },
    ],

    // ── ATTACCABRIGHE ────────────────────────────────────────────────────────
    attaccabrighe: [
      // ACG
      { id: 'pugno_urbano',            name: 'Pugno di Ferro Urbano',
        classSkillAdd: ['bluff','diplomazia'] },
      { id: 'totem_brawler',           name: 'Seguace del Totem' },
      { id: 'attaccabrighe_snervante', name: 'Attaccabrighe Snervante' },
      { id: 'wrestler',                name: 'Lottatore' },
      { id: 'attaccabrighe_feroce',    name: 'Attaccabrighe Feroce',
        featureOverrides: { rage: true } },
    ],

    // ── CACCIATORE ───────────────────────────────────────────────────────────
    cacciatore: [
      // ACG
      { id: 'seguace_animali',         name: 'Seguace degli Animali' },
      { id: 'cacciatore_orde',         name: 'Cacciatore delle Orde' },
      { id: 'esploratore_cac',         name: 'Esploratore',
        featureOverrides: { companion: false } },
      { id: 'cacciatore_urbano',       name: 'Cacciatore Urbano',
        classSkillAdd: ['bluff','diplomazia','conoscenze_locale'],
        classSkillRemove: ['sopravvivenza'] },
      { id: 'cacciatore_ferale',       name: 'Cacciatore Ferale' },
    ],

    // ── IRACONDO DI STIRPE ───────────────────────────────────────────────────
    iracondo_stirpe: [
      // ACG
      { id: 'iracondo_urbano',         name: 'Iracondo Urbano',
        classSkillAdd: ['bluff','diplomazia','conoscenze_locale','senso_moti'],
        classSkillRemove: ['sopravvivenza'] },
      { id: 'iracondo_rovi',           name: 'Iracondo dei Rovi' },
      { id: 'iracondo_invulnerabile',  name: 'Iracondo Invulnerabile' },
      { id: 'iracondo_elemento',       name: 'Iracondo Elementale' },
      { id: 'iracondo_reagente',       name: 'Iracondo Reagente',
        classSkillAdd: ['conoscenze_arcane'] },
      { id: 'iracondo_folle',          name: 'Iracondo Folle' },
    ],

    // ── GUARDIAMARCA ─────────────────────────────────────────────────────────
    guardiamarca: [
      // ACG
      { id: 'guardia_sacra',           name: 'Guardia Sacra',
        classSkillAdd: ['conoscenze_religione','senso_moti'] },
      { id: 'patrugliatore',           name: 'Pattugliatore',
        classSkillAdd: ['percezione','sopravvivenza'] },
      { id: 'difensore_marchio',       name: 'Difensore del Marchio' },
      { id: 'esecutore',               name: 'Esecutore',
        classSkillAdd: ['intimidire'] },
      { id: 'guardiamarca_ombra',      name: 'Guardiamarca delle Ombre',
        classSkillAdd: ['furtivita','travestimento'] },
    ],

    // ── SCHERMAGLIATORE ──────────────────────────────────────────────────────
    schermagliatore: [
      // ACG
      { id: 'duellante_lama',          name: 'Duellante della Lama' },
      { id: 'tiratore_accurato',       name: 'Tiratore Accurato' },
      { id: 'schermagliatore_ombra',   name: 'Schermagliatore delle Ombre',
        classSkillAdd: ['furtivita'] },
      { id: 'schermagliatore_veloce',  name: 'Schermagliatore Veloce' },
      { id: 'schermagliatore_mare',    name: 'Schermagliatore del Mare',
        classSkillAdd: ['nuotare','scalare'] },
    ],

    // ── SCIAMANO ─────────────────────────────────────────────────────────────
    sciamano: [
      // ACG
      { id: 'sciamano_corpo',          name: 'Sciamano del Corpo' },
      { id: 'sciamano_natura',         name: 'Sciamano della Natura' },
      { id: 'sciamano_spiriti',        name: 'Parlante con gli Spiriti' },
      { id: 'sciamano_osseo',          name: 'Sciamano dell\'Osso',
        classSkillAdd: ['conoscenze_arcane'] },
      { id: 'sciamano_lama',           name: 'Sciamano della Lama' },
      { id: 'sciamano_tempesta',       name: 'Sciamano della Tempesta' },
    ],

    // ── SKALD ────────────────────────────────────────────────────────────────
    skald: [
      // ACG
      { id: 'bardo_battaglia',         name: 'Bardo di Battaglia' },
      { id: 'cantore_guerriero',       name: 'Cantore Guerriero' },
      { id: 'skald_furioso',           name: 'Skald Furioso' },
      { id: 'skald_invulnerabile',     name: 'Skald Invulnerabile' },
      { id: 'berserker_nordico',       name: 'Berserker Nordico' },
    ],

    // ── SPIA ─────────────────────────────────────────────────────────────────
    spia: [
      // ACG
      { id: 'stalker_corte',           name: 'Spia della Corte',
        classSkillAdd: ['bluff','diplomazia','conoscenze_nobili'] },
      { id: 'agente_doppio',           name: 'Agente Doppio' },
      { id: 'assassino_spia',          name: 'Assassino',
        classSkillAdd: ['travestimento'] },
      { id: 'mimetizzatore',           name: 'Mimetizzatore',
        classSkillAdd: ['furtivita','travestimento'] },
      { id: 'informatore',             name: 'Informatore',
        classSkillAdd: ['senso_moti'] },
    ],
  };

  // ══════════════════════════════════════════════════════════════════════  // ABILITÀ DI CLASSE per id (vedi skills-list.js)
  // ══════════════════════════════════════════════════════════════════
  const CLASS_SKILLS = {
    barbaro:          ['acrobazia','artigianato','cavalcare','conoscenze_natura','intimidire','percezione','professione','nuotare','sopravvivenza'],
    bardo:            ['acrobazia','artigianato','bluff','cavalcare','conoscenze_arcane','conoscenze_dunsioni','conoscenze_geografia','conoscenze_ingegneria','conoscenze_storia','conoscenze_locale','conoscenze_natura','conoscenze_nobili','conoscenze_piani','conoscenze_religione','diplomazia','disattivare_cong','esibizione','furtivita','illusionismo','linguistica','magia','percezione','professione','senso_moti','stimare','travestimento','usare_ogm','volare'],
    chierico:         ['artigianato','diplomazia','guarire','conoscenze_arcane','conoscenze_storia','conoscenze_nobili','conoscenze_piani','conoscenze_religione','linguistica','professione','senso_moti'],
    druido:           ['artigianato','addestrare_animali','cavalcare','volare','conoscenze_geografia','conoscenze_natura','diplomazia','guarire','linguistica','nuotare','percezione','professione','sopravvivenza'],
    guerriero:        ['acrobazia','artigianato','cavalcare','conoscenze_dunsioni','conoscenze_ingegneria','intimidire','nuotare','percezione','professione','scalare','sopravvivenza'],
    ladro:            ['acrobazia','artigianato','artista_fuga','bluff','cavalcare','diplomazia','disattivare_cong','furtivita','illusionismo','intimidire','conoscenze_dunsioni','conoscenze_locale','linguistica','magia','percezione','professione','scalare','senso_moti','stimare','sotterfugio','travestimento','usare_ogm'],
    mago:             ['artigianato','volare','conoscenze_arcane','conoscenze_dunsioni','conoscenze_geografia','conoscenze_ingegneria','conoscenze_storia','conoscenze_locale','conoscenze_natura','conoscenze_nobili','conoscenze_piani','conoscenze_religione','linguistica','magia','professione'],
    monaco:           ['acrobazia','artigianato','artista_fuga','cavalcare','conoscenze_storia','conoscenze_religione','guarire','intimidire','linguistica','magia','percezione','professione','scalare','senso_moti','sotterfugio'],
    paladino:         ['artigianato','cavalcare','diplomazia','guarire','conoscenze_nobili','conoscenze_religione','professione','senso_moti'],
    ranger:           ['acrobazia','artigianato','addestrare_animali','cavalcare','conoscenze_dunsioni','conoscenze_geografia','conoscenze_natura','linguistica','nuotare','percezione','professione','scalare','sopravvivenza','sotterfugio','volare'],
    stregone:         ['artigianato','bluff','volare','intimidire','conoscenze_arcane','magia','professione','stimare','usare_ogm'],
    alchimista:       ['artigianato','disattivare_cong','volare','guarire','conoscenze_arcane','conoscenze_natura','linguistica','magia','percezione','professione','scalare','sopravvivenza','usare_ogm'],
    cavaliere:        ['artigianato','addestrare_animali','bluff','cavalcare','diplomazia','intimidire','conoscenze_locale','conoscenze_nobili','professione','senso_moti'],
    convocatore:      ['artigianato','volare','guarire','conoscenze_arcane','conoscenze_piani','linguistica','magia','professione','senso_moti','usare_ogm'],
    fattucchiera:     ['artigianato','volare','guarire','intimidire','conoscenze_arcane','conoscenze_storia','conoscenze_natura','conoscenze_piani','linguistica','magia','professione','senso_moti','sopravvivenza'],
    inquisitore:      ['artigianato','bluff','cavalcare','diplomazia','disattivare_cong','furtivita','intimidire','conoscenze_arcane','conoscenze_dunsioni','conoscenze_natura','conoscenze_piani','conoscenze_religione','linguistica','magia','percezione','professione','scalare','senso_moti','sopravvivenza','sotterfugio','travestimento'],
    magus:            ['artigianato','volare','intimidire','conoscenze_arcane','conoscenze_dunsioni','linguistica','magia','nuotare','professione','scalare','sopravvivenza'],
    morfico:          ['acrobazia','artigianato','addestrare_animali','cavalcare','conoscenze_natura','nuotare','percezione','professione','scalare','sopravvivenza'],
    oracolo:          ['artigianato','diplomazia','guarire','conoscenze_storia','conoscenze_religione','professione','senso_moti'],
    pistolero:        ['acrobazia','artigianato','bluff','cavalcare','guarire','intimidire','conoscenze_ingegneria','conoscenze_locale','percezione','professione','scalare','sopravvivenza','sotterfugio'],
    vigilante:        ['acrobazia','artigianato','bluff','cavalcare','diplomazia','disattivare_cong','furtivita','illusionismo','intimidire','conoscenze_locale','conoscenze_nobili','linguistica','percezione','professione','scalare','senso_moti','stimare','sotterfugio','travestimento'],
    antipaladino:     ['artigianato','bluff','cavalcare','disattivare_cong','guarire','intimidire','conoscenze_arcane','conoscenze_nobili','conoscenze_religione','professione','senso_moti','sotterfugio'],
    ninja:            ['acrobazia','artigianato','artista_fuga','bluff','cavalcare','diplomazia','disattivare_cong','furtivita','illusionismo','intimidire','conoscenze_locale','linguistica','magia','percezione','professione','scalare','senso_moti','sotterfugio','travestimento','usare_ogm'],
    samurai:          ['artigianato','addestrare_animali','cavalcare','diplomazia','intimidire','conoscenze_locale','conoscenze_nobili','professione','senso_moti'],
    arcanista:        ['artigianato','volare','conoscenze_arcane','conoscenze_dunsioni','conoscenze_storia','conoscenze_ingegneria','conoscenze_locale','conoscenze_natura','conoscenze_nobili','conoscenze_piani','conoscenze_religione','conoscenze_geografia','linguistica','magia','professione','stimare','usare_ogm'],
    attaccabrighe:    ['acrobazia','artigianato','artista_fuga','cavalcare','conoscenze_dunsioni','conoscenze_locale','intimidire','nuotare','percezione','professione','scalare','senso_moti','sotterfugio'],
    cacciatore:       ['acrobazia','artigianato','addestrare_animali','cavalcare','conoscenze_dunsioni','conoscenze_geografia','conoscenze_natura','linguistica','magia','nuotare','percezione','professione','scalare','senso_moti','sopravvivenza','sotterfugio','volare'],
    iracondo_stirpe:  ['acrobazia','artigianato','cavalcare','conoscenze_arcane','intimidire','nuotare','percezione','professione','sopravvivenza'],
    guardiamarca:     ['artigianato','diplomazia','guarire','intimidire','conoscenze_dunsioni','conoscenze_religione','linguistica','magia','percezione','professione','scalare','senso_moti','sopravvivenza'],
    schermagliatore:  ['acrobazia','artigianato','artista_fuga','bluff','cavalcare','diplomazia','furtivita','illusionismo','intimidire','nuotare','percezione','professione','scalare','senso_moti','sotterfugio'],
    sciamano:         ['artigianato','volare','guarire','conoscenze_arcane','conoscenze_natura','conoscenze_piani','conoscenze_religione','linguistica','magia','professione','senso_moti','sopravvivenza'],
    skald:            ['acrobazia','artigianato','bluff','cavalcare','conoscenze_arcane','conoscenze_dunsioni','conoscenze_geografia','conoscenze_ingegneria','conoscenze_locale','conoscenze_natura','conoscenze_nobili','conoscenze_piani','conoscenze_religione','conoscenze_storia','diplomazia','esibizione','intimidire','linguistica','magia','percezione','professione','senso_moti','sopravvivenza'],
    spia:             ['acrobazia','artigianato','artista_fuga','bluff','cavalcare','diplomazia','disattivare_cong','furtivita','guarire','illusionismo','intimidire','conoscenze_arcane','conoscenze_dunsioni','conoscenze_geografia','conoscenze_ingegneria','conoscenze_storia','conoscenze_locale','conoscenze_natura','conoscenze_nobili','conoscenze_piani','conoscenze_religione','linguistica','magia','percezione','professione','scalare','senso_moti','sotterfugio','travestimento','usare_ogm'],
  };

  // ══════════════════════════════════════════════════════════════════  // API PUBBLICA
  // ══════════════════════════════════════════════════════════════════════

  /**
   * Trova una classe per nome (case-insensitive).
   * @param {string} name
   * @returns {object|null}
   */
  function findByName(name) {
    if (!name) return null;
    const n = name.toLowerCase().trim();
    return CLASSES.find(c => c.name.toLowerCase() === n) || null;
  }

  /**
   * Restituisce l'array di archetipi per una classe dato il suo id.
   * @param {string} classId
   * @returns {Array}
   */
  function getArchetypes(classId) {
    return ARCHETYPES[classId] || [];
  }

  /**
   * Calcola il profilo UI unificato per un array di classi (multiclasse).
   * Accetta sia string[] che { name, archetype }[] (backward compatible).
   * Se nessuna classe è riconosciuta, restituisce il profilo di default (mostra tutto).
   *
   * @param {Array<string|{name:string,archetype:string}>} classNamesOrEntries
   * @returns {{ hasSpellsTab: boolean, primaryTabs: string[], features: object, classSkillIds: string[] }}
   */
  function getMergedProfile(classNamesOrEntries) {
    // Nessuna classe: personaggio vuoto — non mostrare nulla di class-specific
    if (!classNamesOrEntries || classNamesOrEntries.length === 0) {
      return { hasSpellsTab: false, primaryTabs: [], features: {}, classSkillIds: [] };
    }

    // Normalizza a { name, archetype } objects (backward compat con string[])
    const entries = classNamesOrEntries.map(item =>
      typeof item === 'string' ? { name: item, archetype: '' } : item
    );

    // Filtra i nomi vuoti (righe classe appena aggiunte ma non ancora compilate)
    const validEntries = entries.filter(e => e.name && e.name.trim() !== '');
    if (validEntries.length === 0) {
      return { hasSpellsTab: false, primaryTabs: [], features: {}, classSkillIds: [] };
    }

    const configs = validEntries.map(e => findByName(e.name)).filter(Boolean);
    // Classe(i) non riconosciute → mostra tutto per retrocompatibilità
    if (configs.length === 0) return _defaultProfile();

    const merged = {
      hasSpellsTab:   configs.some(c => c.hasSpellsTab),
      primaryTabs:    [...new Set(configs.flatMap(c => c.primaryTabs))],
      features:       {},
      classSkillIds:  [...new Set(configs.flatMap(c => CLASS_SKILLS[c.id] || []))],
    };

    // Union di tutti i feature flags attivi
    configs.forEach(c => {
      Object.entries(c.features || {}).forEach(([k, v]) => {
        if (v) merged.features[k] = true;
      });
    });

    // Applica override dalle selezioni di archetipo
    validEntries.forEach(entry => {
      if (!entry.archetype || !entry.archetype.trim()) return;
      const cfg = findByName(entry.name);
      if (!cfg) return;
      const archName = entry.archetype.toLowerCase().trim();
      const arch = (ARCHETYPES[cfg.id] || []).find(a =>
        a.name.toLowerCase() === archName
      );
      if (!arch) return;
      // Override abilità di classe
      if (arch.classSkillAdd) {
        arch.classSkillAdd.forEach(s => {
          if (!merged.classSkillIds.includes(s)) merged.classSkillIds.push(s);
        });
      }
      if (arch.classSkillRemove) {
        merged.classSkillIds = merged.classSkillIds.filter(s => !arch.classSkillRemove.includes(s));
      }
      // Override feature flags (es. { bardPerf: false })
      if (arch.featureOverrides) {
        Object.entries(arch.featureOverrides).forEach(([k, v]) => {
          merged.features[k] = v;
        });
      }
    });

    return merged;
  }

  /**
   * Profilo di default: mostra tutto.
   * Usato quando la classe non è riconosciuta o la lista è vuota → sicuro per
   * personaggi esistenti e classi personalizzate.
   */
  function _defaultProfile() {
    return {
      hasSpellsTab:  true,
      primaryTabs:   [],
      features:      { rage: true },  // mostra rage block per sicurezza
      classSkillIds: [],
    };
  }

  return { CLASSES, CLASS_SKILLS, ARCHETYPES, findByName, getArchetypes, getMergedProfile };
})();
