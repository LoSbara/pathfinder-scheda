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
    },
  ];

  // ══════════════════════════════════════════════════════════════════════
  // ARCHETIPI per classe (id → array di { id, name, [classSkillAdd], [classSkillRemove], [featureOverrides] })
  // classSkillAdd / classSkillRemove usano gli stessi skill IDs di CLASS_SKILLS.
  // featureOverrides sostituisce flag specifici del profilo UI (es. { bardPerf: false }).
  // ══════════════════════════════════════════════════════════════════════
  const ARCHETYPES = {
    barbaro: [
      { id: 'iracondo_invulnerabile',  name: 'Iracondo Invulnerabile' },
      { id: 'barbaro_urbano',          name: 'Barbaro Urbano',
        classSkillAdd: ['bluff','diplomazia','conoscenze_locale','senso_moti','travestimento'],
        classSkillRemove: ['nuotare','sopravvivenza'] },
      { id: 'seguace_totem',           name: 'Seguace del Totem' },
      { id: 'cantastorie_tribale',     name: 'Cantastorie Tribale' },
      { id: 'sciamano_polvere',        name: 'Sciamano della Polvere' },
      { id: 'cavaliere_barbaro',       name: 'Cavaliere Barbaro' },
    ],
    bardo: [
      { id: 'arcano_duellante',        name: 'Arcano Duellante' },
      { id: 'trovatore',               name: 'Trovatore' },
      { id: 'menestello',              name: 'Menestello' },
      { id: 'coreuta',                 name: 'Coreuta' },
      { id: 'possessore_segreti',      name: 'Possessore di Segreti',
        featureOverrides: { bardPerf: false } },
      { id: 'veggente_arcano',         name: 'Veggente Arcano' },
      { id: 'maestro_strumenti',       name: 'Maestro degli Strumenti' },
    ],
    chierico: [
      { id: 'crociato',                name: 'Crociato' },
      { id: 'curatore',                name: 'Curatore' },
      { id: 'pontefice',               name: 'Pontefice' },
      { id: 'sacerdote_combattente',   name: 'Sacerdote Combattente' },
      { id: 'esorcista',               name: 'Esorcista' },
    ],
    druido: [
      { id: 'custode_natura',          name: 'Custode della Natura' },
      { id: 'animale_battaglia',       name: 'Animale da Battaglia' },
      { id: 'pastore_selvaggio',       name: 'Pastore Selvaggio' },
      { id: 'druido_viaggio',          name: 'Druido del Viaggio' },
      { id: 'scolpitore_elementi',     name: 'Scolpitore di Elementi' },
      { id: 'signore_tempesta',        name: 'Signore della Tempesta' },
    ],
    guerriero: [
      { id: 'arciere',                 name: 'Arciere' },
      { id: 'due_armi',                name: 'Combattente a Due Armi' },
      { id: 'torre',                   name: 'Specialista dello Scudo a Torre' },
      { id: 'rovina_mostri',           name: 'Rovina dei Mostri' },
      { id: 'campione_popolo',         name: 'Campione del Popolo' },
      { id: 'tattico',                 name: 'Tattico' },
      { id: 'bruto',                   name: 'Bruto' },
      { id: 'cavaliere_stellato',      name: 'Cavaliere Stellato' },
    ],
    ladro: [
      { id: 'maestro_coltelli',        name: 'Maestro dei Coltelli' },
      { id: 'esploratore',             name: 'Esploratore' },
      { id: 'acrobatico',              name: 'Assassino Acrobatico' },
      { id: 'stalker',                 name: 'Stalker' },
      { id: 'collezionista_taglie',    name: 'Collezionista di Taglie' },
      { id: 'spia_ladro',              name: 'Spia' },
    ],
    mago: [
      { id: 'legato_libro',            name: 'Mago Legato al Libro' },
      { id: 'mago_elementale',         name: 'Mago Elementale' },
      { id: 'magister',                name: 'Magister' },
      { id: 'universalista',           name: 'Universalista' },
      { id: 'negromanzia',             name: 'Specialista di Negromanzia' },
    ],
    monaco: [
      { id: 'pugno_ferro',             name: 'Monaco del Pugno di Ferro' },
      { id: 'mano_vuota',              name: 'Monaco della Mano Vuota' },
      { id: 'studioso_forma',          name: 'Studioso della Forma Interna' },
      { id: 'kata_maestro',            name: 'Kata Maestro' },
    ],
    paladino: [
      { id: 'mezza_luna',              name: 'Cavaliere della Mezza Luna' },
      { id: 'protettore_divino',       name: 'Protettore Divino' },
      { id: 'difensore_fede',          name: 'Difensore della Vera Fede' },
      { id: 'campione_altare',         name: 'Campione dell\'Altare' },
    ],
    ranger: [
      { id: 'cacciatore_mostri',       name: 'Cacciatore di Mostri' },
      { id: 'arciere_foresta',         name: 'Arciere della Foresta' },
      { id: 'segugio',                 name: 'Segugio' },
      { id: 'cavalcatore_cielo',       name: 'Cavalcatore del Cielo' },
      { id: 'nomade',                  name: 'Nomade' },
    ],
    stregone: [
      { id: 'mago_arcano',             name: 'Mago Arcano' },
      { id: 'sanguemisto',             name: 'Sanguemisto' },
      { id: 'elementalista',           name: 'Elementalista' },
    ],
    alchimista: [
      { id: 'bombardiere',             name: 'Bombardiere' },
      { id: 'chirurgo',                name: 'Chirurgo' },
      { id: 'formulista',              name: 'Formulista' },
      { id: 'veleniere',               name: 'Veleniere' },
      { id: 'trasformatore',           name: 'Trasformatore' },
    ],
    cavaliere: [
      { id: 'signore_cavallo',         name: 'Signore del Cavallo' },
      { id: 'comandante',              name: 'Comandante' },
      { id: 'cavaliere_errante',       name: 'Cavaliere Errante' },
    ],
    convocatore: [
      { id: 'bestia_convocatore',      name: 'Convocatore della Bestia' },
      { id: 'summoner_patto',          name: 'Convocatore del Patto' },
    ],
    fattucchiera: [
      { id: 'fattucchiera_cacciatrice',name: 'Fattucchiera Cacciatrice' },
      { id: 'fattucchiera_natura',     name: 'Fattucchiera della Natura' },
      { id: 'fattucchiera_carnevale',  name: 'Fattucchiera Carnevalesca' },
      { id: 'strega_fate',             name: 'Ostetrica delle Fate' },
    ],
    inquisitore: [
      { id: 'esaminatore',             name: 'Esaminatore' },
      { id: 'cacciatore_inquisitore',  name: 'Cacciatore di Mostri' },
      { id: 'segugio_inquisitore',     name: 'Segugio' },
      { id: 'incorrotto',              name: 'Incorrotto' },
    ],
    magus: [
      { id: 'magus_kensai',            name: 'Kensai' },
      { id: 'magus_anime',             name: 'Magus Anime' },
      { id: 'magus_lame',              name: 'Danzatore di Lame' },
      { id: 'magus_arcano',            name: 'Stregone Arcano' },
    ],
    morfico: [
      { id: 'mannaro_benedetto',       name: 'Mannaro Benedetto' },
      { id: 'esploratore_bestiale',    name: 'Esploratore Bestiale' },
      { id: 'shifter_elementale',      name: 'Trasmutatore Elementale' },
    ],
    oracolo: [
      { id: 'oracolo_battito',         name: 'Oracolo del Battito del Cuore' },
      { id: 'cavaliere_oracolo',       name: 'Cavaliere dell\'Oracolo' },
    ],
    pistolero: [
      { id: 'tiratore_scelto',         name: 'Tiratore Scelto' },
      { id: 'cacciatore_pistola',      name: 'Cacciatore Pistolero' },
      { id: 'pistolero_pellegrino',    name: 'Pistolero Pellegrino' },
    ],
    vigilante: [
      { id: 'avventuriero_identita',   name: 'Vigilante Avventuriero' },
      { id: 'cacciatore_identita',     name: 'Vigilante Cacciatore' },
    ],
    antipaladino: [
      { id: 'signore_morte',           name: 'Signore della Morte' },
      { id: 'terrore_armate',          name: 'Terrore delle Armate' },
    ],
    ninja: [
      { id: 'shinobi_ombre',           name: 'Shinobi delle Ombre' },
      { id: 'ninja_veleno',            name: 'Ninja Veleniere' },
    ],
    samurai: [
      { id: 'ronin',                   name: 'Ronin' },
      { id: 'guerriero_vincolo',       name: 'Guerriero del Vincolo' },
    ],
    arcanista: [
      { id: 'mago_esplosivo',          name: 'Mago Esplosivo' },
      { id: 'sangue_arcano',           name: 'Sangue Arcano' },
    ],
    attaccabrighe: [
      { id: 'pugno_urbano',            name: 'Pugno di Ferro Urbano' },
      { id: 'totem_brawler',           name: 'Seguace del Totem' },
    ],
    cacciatore: [
      { id: 'seguace_animali',         name: 'Seguace degli Animali' },
      { id: 'cacciatore_orde',         name: 'Cacciatore delle Orde' },
    ],
    iracondo_stirpe: [
      { id: 'iracondo_urbano',         name: 'Iracondo Urbano',
        classSkillAdd: ['bluff','diplomazia','conoscenze_locale','senso_moti'],
        classSkillRemove: ['sopravvivenza'] },
      { id: 'iracondo_rovi',           name: 'Iracondo dei Rovi' },
      { id: 'iracondo_invulnerabile',  name: 'Iracondo Invulnerabile' },
    ],
    guardiamarca: [
      { id: 'guardia_sacra',           name: 'Guardia Sacra' },
      { id: 'patrugliatore',           name: 'Pattugliatore' },
    ],
    schermagliatore: [
      { id: 'duellante_lama',          name: 'Duellante della Lama' },
      { id: 'tiratore_accurato',       name: 'Tiratore Accurato' },
    ],
    sciamano: [
      { id: 'sciamano_corpo',          name: 'Sciamano del Corpo' },
      { id: 'sciamano_natura',         name: 'Sciamano della Natura' },
    ],
    skald: [
      { id: 'bardo_battaglia',         name: 'Bardo di Battaglia' },
      { id: 'cantore_guerriero',       name: 'Cantore Guerriero' },
    ],
    spia: [
      { id: 'stalker_corte',           name: 'Spia della Corte' },
      { id: 'agente_doppio',           name: 'Agente Doppio' },
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
