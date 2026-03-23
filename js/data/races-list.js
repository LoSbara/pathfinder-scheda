// js/data/races-list.js
// Database razze Pathfinder 1e — fonte: golarion.altervista.org/wiki/Razze
const PF1_RACES_DB = [

  // =====================================================================
  // RAZZE BASE (Core Rulebook)
  // =====================================================================

  {
    id: 'elfo',
    name: 'Elfo',
    abilityMods: { str: 0, dex: 2, con: -2, int: 2, wis: 0, cha: 0 },
    size: 'Media',
    speed: 9,
    traits: [
      'Visione Crepuscolare',
      'Immunità degli Elfi (sonno e ammaliamento)',
      'Familiarità nelle Armi (spade lunghe elfiche, spade corte elfiche, archi lunghi, archi lunghi compositi)',
      'Magia degli Elfi (+2 vs Resistenza agli Incantesimi, +2 Sapienza Magica)',
      'Sensi Acuti (+2 Percezione)'
    ],
    languages: ['Comune', 'Elfico'],
    bonusLanguages: ['Celestiale', 'Draconico', 'Gnoll', 'Gnomesco', 'Goblin', 'Orchesco', 'Silvano'],
    source: 'Core',
    alternativeTraits: [
      { name: 'Arcane Focus', replaces: ['Familiarità nelle Armi'], description: '+2 alle prove di concentrazione per lanciare sulla difensiva' },
      { name: 'Long-Limbed', replaces: ['Familiarità nelle Armi'], description: 'Allungo +3m in mischia (non si cumula con armi lunghe)' },
      { name: 'Eternal Grudge', replaces: ['Familiarità nelle Armi'], description: '+1 tiri per colpire vs nani e orchi; +2 TS vs magia del male' },
      { name: 'Dreamspeaker', replaces: ['Magia degli Elfi'], description: '+1 CD incantesimi del sonno; Comunicare con i Morti 1/gn' },
      { name: 'Fey Thoughts', replaces: ['Magia degli Elfi'], description: 'Raggirare e Percepire Intenzioni diventano abilità di classe' },
      { name: 'Overwhelming Magic', replaces: ['Magia degli Elfi'], description: '+2 CD incantesimi vs bersagli con DV inferiori al livello del lanciatore' },
      { name: 'Desert Runner', replaces: ['Immunità degli Elfi'], description: '+4 Tempra vs affaticamento da caldo/carico; movimento non ridotto' },
      { name: 'Silent Hunter', replaces: ['Sensi Acuti'], description: '+2 Furtività; può muoversi silenziosamente a velocità normale' },
      { name: 'Elven Reflexes', replaces: ['Sensi Acuti'], description: '+2 Iniziativa' },
      { name: 'Darkvision', replaces: ['Visione Crepuscolare', 'Immunità degli Elfi'], description: 'Scurovisione 18m; non immune al sonno; +2 TS vs ammaliamento' },
      { name: 'Spirit of the Waters', replaces: ['Magia degli Elfi', 'Familiarità nelle Armi'], description: '+4 Nuotare; velocità nuoto 4,5m; respira sott\'acqua' },
      { name: 'Woodcraft', replaces: ['Magia degli Elfi'], description: '+1 Sopravvivenza e Conoscenze (natura); diventano abilità di classe' },
      { name: 'Urbanite', replaces: ['Sensi Acuti'], description: '+2 Diplomazia e Senso Inganno in insediamenti urbani' },
      { name: 'Blended View', replaces: ['Visione Crepuscolare'], description: 'La penombra non penalizza la Percezione visiva' },
      { name: 'Gift of Tongues', replaces: ['Sensi Acuti'], description: '+1 Linguistica; ottiene 2 lingue per grado in Linguistica' },
      { name: 'Lightbringer', replaces: ['Magia degli Elfi', 'Familiarità nelle Armi'], description: 'Immunità accecamento da luce; Luce a volontà; Luce Continua 1/gn' },
      { name: 'Fleet-Footed', replaces: ['Visione Crepuscolare', 'Familiarità nelle Armi'], description: '+2 Iniziativa; Corsa come talento bonus' },
      { name: 'Warden of Nature', replaces: ['Immunità degli Elfi'], description: '+2 CA e attacco vs animali, fate e piante magiche' },
      { name: 'Sociable', replaces: ['Immunità degli Elfi'], description: 'Abbassando la CD di Diplomazia di 10 ottiene +2 vs quella creatura per 24h' }
    ]
  },

  {
    id: 'nano',
    name: 'Nano',
    abilityMods: { str: 0, dex: 0, con: 2, int: 0, wis: 2, cha: -2 },
    size: 'Media',
    speed: 6,
    traits: [
      'Scurovisione 18m',
      'Lenti e Saldi (velocità non modificata da armatura o ingombro)',
      'Familiarità nelle Armi (ascia da guerra, martello da guerra, piccone pesante nanico, ascia corta, martello; armi con "nanico" nel nome)',
      'Odio (+1 ai tiri per colpire vs Orchi e Goblinoidi)',
      'Addestramento Difensivo (+4 CA vs creature di tipo Gigante)',
      'Resistenza (+2 TS vs veleni, incantesimi e capacità magiche)',
      'Stabilità (+4 DMC vs Sbilanciare e Spingere)',
      'Cupidigia (+2 Valutare)',
      'Esperto Minatore (+2 Percezione per muratura, trappole su pietra)'
    ],
    languages: ['Comune', 'Nanico'],
    bonusLanguages: ['Gigante', 'Gnomesco', 'Goblin', 'Orchesco', 'Terran', 'Sottocomune'],
    source: 'Core',
    alternativeTraits: [
      { name: 'Craftsman', replaces: ['Astuto'], description: '+2 Artigianato o Professione su pietra/metallo; sempre abilità di classe' },
      { name: 'Lorekeeper', replaces: ['Odio'], description: '+2 Conoscenze (storia) e Conoscenze (locali); sempre abilità di classe' },
      { name: 'Deep Warrior', replaces: ['Addestramento Difensivo'], description: '+2 CMD vs Investimento; +2 tiri per colpire vs aberrazioni' },
      { name: 'Magic Resistant', replaces: ['Resistenza'], description: 'RI 5+livello; –2 ai tiri salvezza vs magie alleate' },
      { name: 'Unstoppable', replaces: ['Resistenza'], description: '+1 Tempra vs paralisi, veleno e debilitazioni fisiche' },
      { name: 'Ancient Enmity', replaces: ['Odio'], description: '+1 tiri per colpire contro elfi (non mezzelfi)' },
      { name: 'Stonesinger', replaces: ['Esperto Minatore'], description: '+1 CL per magie della terra; Roccia Magica 1/gn' },
      { name: 'Relentless', replaces: ['Stabilità'], description: '+2 BMC vs Spingere e Sbilanciare; non può essere intimidito a retrocedere' },
      { name: 'Rock Stepper', replaces: ['Esperto Minatore'], description: 'Ignora penalità terreno difficile su pietra/roccia 1/round' },
      { name: 'Stubborn', replaces: ['Resistenza'], description: '+2 TS vs ammaliamento e illusione; bonus extra per resistere al controllo mentale' },
      { name: 'Surface Survivalist', replaces: ['Resistenza'], description: '+2 TS vs condizioni climatiche estreme in superficie' },
      { name: 'Underminer', replaces: ['Addestramento Difensivo'], description: '+2 attacchi vs creature in buche, fosse o che scavano' },
      { name: 'Well-Prepared', replaces: ['Cupidigia'], description: '1/gn: estrae uno strumento appropriato come se lo avesse nell\'equipaggiamento' },
      { name: 'Practical Magic', replaces: ['Cupidigia'], description: 'Lettura del Magico 3/gn; +1 CL per magie di rilevamento' },
      { name: 'Heart of the Fields', replaces: ['Assiduità'], description: '+1/2 livello a Tempra vs affaticamento ed esaurimento' },
      { name: 'Heart of the Mountains', replaces: ['Assiduità'], description: '+1 Scalare e Sopravvivenza; il terreno montagnoso non causa affaticamento extra' },
      { name: 'Slag Child', replaces: ['Addestramento Difensivo', 'Odio'], description: '+2 TS vs incantesimi e capacità magiche di umanoidi' },
      { name: 'Xenophobic', replaces: ['Linguaggi'], description: 'Non ottiene lingue bonus; +2 Senso Inganno vs creature non-nane' },
      { name: 'Giant-Bloated', replaces: ['Odio'], description: '+2 CMD vs lotta; +1 tiri per colpire vs giganti' },
      { name: 'Vermin Hunter', replaces: ['Odio'], description: '+1 tiri per colpire vs insetti, vermi e creature velenose' },
      { name: 'Ancient Hatred', replaces: ['Odio'], description: '+2 tiri per colpire contro goblin di taglia maggiore' }
    ]
  },

  {
    id: 'gnomo',
    name: 'Gnomo',
    abilityMods: { str: -2, dex: 0, con: 2, int: 0, wis: 0, cha: 2 },
    size: 'Piccola',
    speed: 6,
    traits: [
      'Visione Crepuscolare',
      'Addestramento Difensivo (+4 CA vs creature di tipo Gigante)',
      'Odio (+1 ai tiri per colpire vs Rettili e Goblinoidi)',
      'Magia Gnomesca (+1 CD Illusioni lanzate; Prestidigitazione, Parla con gli Animali e Luci Danzanti 1/gn con Cha≥11)',
      'Resistenza alle Illusioni (+2 TS vs incantesimi di Illusione)',
      'Sensi Acuti (+2 Percezione)',
      'Ossessione (+2 Artigianato o Professione a scelta)'
    ],
    languages: ['Comune', 'Gnomesco', 'Silvano'],
    bonusLanguages: ['Draconico', 'Elfico', 'Gigante', 'Goblin', 'Nanico', 'Orchesco'],
    source: 'Core',
    alternativeTraits: [
      { name: 'Master Tinker', replaces: ['Ossessione'], description: '+1 Individuare Trappole e Artigianato; armi su misura senza penalità' },
      { name: 'Academician', replaces: ['Ossessione'], description: '+2 in una qualsiasi abilità di Conoscenze come abilità di classe' },
      { name: 'Eternal Hope', replaces: ['Fortuna Gnomesca'], description: '+2 TS vs paura e disperazione; 1/gn può ritirare qualsiasi tiro' },
      { name: 'Magic Resistant', replaces: ['Resistenza alle Illusioni'], description: 'RI 5+livello; –2 TS vs magie alleate' },
      { name: 'Animal Friend', replaces: ['Odio', 'Resistenza alle Illusioni'], description: '+1 CM animali; +4 Gestire Animali con gli animali' },
      { name: 'Utilitarian Magic', replaces: ['Magia Gnomesca'], description: 'Sostituisce le SLA con Riparare, Aprire/Chiudere, Luce' },
      { name: 'Knack with Poison', replaces: ['Magia Gnomesca'], description: '+2 Artigianato (alchimia); non rischia di avvelenarsi preparando veleni' },
      { name: 'Gift of Tongues', replaces: ['Sensi Acuti'], description: '+1 Linguistica; ottiene 2 lingue per grado' },
      { name: 'Darkvision', replaces: ['Visione Crepuscolare', 'Sensi Acuti'], description: 'Scurovisione 18m invece di Visione Crepuscolare' },
      { name: 'Explorer', replaces: ['Odio'], description: '+2 Percezione e Sopravvivenza in ambienti sotterranei o selvatici' },
      { name: 'Bewildering Koan', replaces: ['Addestramento Difensivo'], description: '1/gn: Confusione 1 round su un bersaglio (TS Volontà CD=10+½DV+Car nega)' },
      { name: 'Fey Fortitude', replaces: ['Resistenza alle Illusioni'], description: '+1 Tempra vs condizioni fisiche avverse; +2 vs veleni naturali' },
      { name: 'Warden of Nature', replaces: ['Addestramento Difensivo'], description: '+2 CA e attacco vs animali, fate e piante' },
      { name: 'Harmlessly Crazy', replaces: ['Fortuna Gnomesca'], description: '+2 TS vs effetti mentali; –2 TS vs tutti gli altri effetti magici' },
      { name: 'Fell Magic', replaces: ['Magia Gnomesca'], description: 'Scambia le SLA con: Individuare Veleno, Oscurità, Veleno' },
      { name: 'Piranha Strike', replaces: ['Odio'], description: '+1 tiri per colpire vs umanoidi di taglia Media o superiore' },
      { name: 'Storage', replaces: ['Addestramento Difensivo'], description: '+2 CMD vs Trascinamento e Afferrare' }
    ]
  },

  {
    id: 'halfling',
    name: 'Halfling',
    abilityMods: { str: -2, dex: 2, con: 0, int: 0, wis: 0, cha: 2 },
    size: 'Piccola',
    speed: 6,
    traits: [
      'Familiarità nelle Armi (fionda; armi con "halfling" nel nome)',
      'Fortuna Halfling (+1 a tutti i Tiri Salvezza)',
      'Temerarietà (+2 TS vs effetti di Paura)',
      'Piede Saldo (+2 Acrobazia e Scalare)',
      'Sensi Acuti (+2 Percezione)'
    ],
    languages: ['Comune', 'Halfling'],
    bonusLanguages: ['Elfico', 'Gnomesco', 'Goblin', 'Nanico'],
    source: 'Core',
    alternativeTraits: [
      { name: 'Underfoot', replaces: ['Piede Saldo'], description: '+1 CA e +1 tiri per colpire vs creature di taglia Grande o superiore' },
      { name: 'Wanderlust', replaces: ['Piede Saldo'], description: '+2 Sopravvivenza e Conoscenze (geografia); sempre abilità di classe' },
      { name: 'Craven', replaces: ['Temerarietà'], description: '+2 attacco quando fiancheggia; –2 vs nemici non minacciati da alleati' },
      { name: 'Adaptable Luck', replaces: ['Fortuna Halfling'], description: '3/gn: +2 a qualsiasi tiro d20 dopo aver visto il risultato' },
      { name: 'Blessed', replaces: ['Fortuna Halfling'], description: '+1 a tutti i tiri salvezza' },
      { name: 'Ingratiating', replaces: ['Familiarità nelle Armi'], description: '+2 Intrattenere; sempre abilità di classe' },
      { name: 'Omen', replaces: ['Temerarietà'], description: '1/gn: +2 a qualsiasi TS dopo aver visto il risultato' },
      { name: 'Swift as Shadows', replaces: ['Sensi Acuti'], description: '+2 Furtività; +1,5m velocità su terreno aperto' },
      { name: 'Warslinger', replaces: ['Familiarità nelle Armi'], description: 'Ricarica fionda come azione gratuita 1/round' },
      { name: 'Outrider', replaces: ['Sensi Acuti'], description: '+2 Cavalcare e Gestire Animali; sempre abilità di classe' },
      { name: 'Irrepressible', replaces: ['Fortuna Halfling'], description: '+2 TS vs paura; 1/gn ritira qualsiasi TS vs paura' },
      { name: 'Polyglot', replaces: ['Linguaggi'], description: '+2 lingue iniziali; 1 lingua extra ogni 3 livelli' },
      { name: 'Nautical', replaces: ['Familiarità nelle Armi'], description: '+2 Nuotare; +2 abilità in ambiente marino' },
      { name: 'Low Blow', replaces: ['Piede Saldo'], description: '+1 attacco vs creature con PF massimi doppi rispetto ai propri' },
      { name: 'Wildwood Halfling', replaces: ['Familiarità nelle Armi', 'Sensi Acuti'], description: '+2 Furtività e Percezione in foreste' },
      { name: 'Shiftless', replaces: ['Temerarietà'], description: '+2 Bluff e Furtività; sempre abilità di classe' },
      { name: 'Warfoot', replaces: ['Piede Saldo', 'Velocità Lenta'], description: 'Velocità 9m; non ridotta da armatura o ingombro' },
      { name: 'Tavern-Crawler', replaces: ['Familiarità nelle Armi'], description: '+2 Percepire Intenzioni e Intrattenere in ambienti urbani' },
      { name: 'Secretive Survivor', replaces: ['Temerarietà'], description: '+2 Bluff e Raggirare vs creature con Intelligenza 10+' },
      { name: 'Well-Balanced', replaces: ['Piede Saldo'], description: '+2 Acrobazie su superfici instabili; non perde velocità da piede saldo' }
    ]
  },

  {
    id: 'umano',
    name: 'Umano',
    abilityMods: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
    abilityChoiceBonus: true,
    size: 'Media',
    speed: 9,
    traits: [
      'Caratteristica (+2 a una caratteristica a scelta)',
      'Esperti (+1 grado di abilità aggiuntivo a ogni livello)',
      'Talento Bonus (1 talento aggiuntivo al 1° livello)'
    ],
    languages: ['Comune'],
    bonusLanguages: [],
    bonusLanguagesNote: 'Qualsiasi linguaggio (eccetto segreti come Druidico)',
    source: 'Core',
    alternativeTraits: [
      { name: 'Eye for Talent', replaces: ['Talento Bonus'], description: 'Il famiglio/compagno animale ottiene +2 a una caratteristica' },
      { name: 'Heart of the Fields', replaces: ['Talento Bonus'], description: '+1/2 livello Tempra vs affaticamento/esaurimento; agricoltura sempre abilità di classe' },
      { name: 'Heart of the Streets', replaces: ['Talento Bonus'], description: '+1 Riflessi vs calca; +1 iniziativa in aree urbane' },
      { name: 'Heart of the Wilderness', replaces: ['Talento Bonus'], description: '+1/2 livello Tempra vs veleni/malattie naturali; +5 sopravvivere con PF negativi' },
      { name: 'Fearless', replaces: ['Talento Bonus'], description: '+2 TS vs paura; Scosso si applica solo se si può essere anche Spaventati' },
      { name: 'Heart of the Slums', replaces: ['Talento Bonus'], description: '+1 Senso Inganno e Furtività; +2 TS vs malattia' },
      { name: 'Adoptive Parentage', replaces: ['Talento Bonus'], description: 'Adottato da altra razza: ottiene un tratto razziale fisico di quella razza' },
      { name: 'Mixed Heritage', replaces: ['Talento Bonus'], description: 'Ottiene subtype umano e un altro a scelta; conta come entrambi' },
      { name: 'Military Tradition', replaces: ['Talento Bonus'], description: 'Competenza con 2 armi esotiche o militari di una tradizione culturale' },
      { name: 'Noble Illusions', replaces: ['Talento Bonus'], description: 'Individuare gli Allineamenti 3/gn; +2 Diplomazia' },
      { name: 'Heart of the Sea', replaces: ['Talento Bonus'], description: '+2 Nuotare e Conoscenze (natura); Respirare sott\'acqua 1/gn' },
      { name: 'Focused Study', replaces: ['Talento Bonus'], description: '+1 a tutti i tiri d20 per una abilità al 1°, 8° e 16° livello' },
      { name: 'Flight Training', replaces: ['Talento Bonus'], description: 'Talento Caduta Sicura; +2 Acrobazie e Sorvolare' },
      { name: 'Kin Bond', replaces: ['Talento Bonus'], description: '+4 TS vs effetti mente/corpo quando un fratello è presente' },
      { name: 'Silver Tongue', replaces: ['Esperti'], description: '+2 Diplomazia e Bluff; sempre abilità di classe' },
      { name: 'Linguist', replaces: ['Esperti'], description: '+1 Linguistica; ottiene 1 lingua extra per grado' },
      { name: 'Martial Mastery', replaces: ['Esperti'], description: 'Competenza con qualsiasi categoria di arma non esotica' },
      { name: 'Cornered Fury', replaces: ['Esperti'], description: '+2 attacco e CA a ≤½ PF senza alleati a 9m' },
      { name: 'Volatile', replaces: ['Esperti'], description: '+1 BA e CA con Ira o Ispirazione attivi; –2 TS vs paura altrimenti' },
      { name: 'Bestial', replaces: ['Esperti'], description: 'Ottiene Tiro Selvaggio o Olfatto (scelta)' },
      { name: 'Illusive', replaces: ['Esperti'], description: 'Invisibilità o Rimozione Maledizione 1/gn (Car come CL)' }
    ]
  },

  {
    id: 'mezzelfo',
    name: 'Mezzelfo',
    abilityMods: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
    abilityChoiceBonus: true,
    size: 'Media',
    speed: 9,
    traits: [
      'Visione Crepuscolare',
      'Immunità degli Elfi (sonno e ammaliamento)',
      'Sensi Acuti (+2 Percezione)',
      'Adattabilità (Abilità Focalizzata come talento bonus)',
      'Doti Innate (2 classi preferite al 1° livello)'
    ],
    languages: ['Comune', 'Elfico'],
    bonusLanguages: [],
    bonusLanguagesNote: 'Qualsiasi linguaggio (eccetto segreti come Druidico)',
    source: 'Core',
    alternativeTraits: [
      { name: 'Ancestral Arms', replaces: ['Adattabilità'], description: 'Competenza con 1 arma esotica o militare come talento bonus' },
      { name: 'Arcane Training', replaces: ['Adattabilità'], description: 'Usa oggetti magici come membro di una classe magica 3/gn' },
      { name: 'Integrated', replaces: ['Adattabilità'], description: '+1 Bluff, Senso Inganno e Diplomazia' },
      { name: 'Sociable', replaces: ['Adattabilità'], description: 'Abbassando CD Diplomazia di 10 ottiene +2 vs quella creatura per 24h' },
      { name: 'Water Child', replaces: ['Adattabilità'], description: '+4 Nuotare; velocità nuoto 4,5m; respira sott\'acqua' },
      { name: 'Dual Minded', replaces: ['Adattabilità'], description: '+2 a qualsiasi tiro salvezza 1/gn' },
      { name: 'Wary', replaces: ['Doti Innate'], description: '+1 Senso Inganno e Percezione' },
      { name: 'Blended View', replaces: ['Visione Crepuscolare'], description: 'La penombra non penalizza la Percezione visiva' },
      { name: 'Darkvision', replaces: ['Visione Crepuscolare', 'Immunità degli Elfi'], description: 'Scurovisione 18m; non immune al sonno; +2 TS vs ammaliamento' },
      { name: 'Fey Thoughts', replaces: ['Doti Innate'], description: 'Raggirare e Percepire Intenzioni diventano abilità di classe' },
      { name: 'Natural Rider', replaces: ['Doti Innate'], description: '+2 Cavalcare; i compagni animali non richiedono addomesticamento' },
      { name: 'Tactician', replaces: ['Adattabilità'], description: '1/gn: concede talento di squadra a tutti gli alleati a 9m per 3 round' },
      { name: 'Elven Reflexes', replaces: ['Doti Innate'], description: '+2 Iniziativa' },
      { name: 'Tongue of the Sun and Moon', replaces: ['Doti Innate'], description: 'Può comunicare con qualsiasi creatura parlante' }
    ]
  },

  {
    id: 'mezzorco',
    name: 'Mezzorco',
    abilityMods: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
    abilityChoiceBonus: true,
    size: 'Media',
    speed: 9,
    traits: [
      'Scurovisione 18m',
      'Familiarità nelle Armi (ascia bipenne, falchion; armi con "orchesco" nel nome)',
      'Ferocia degli Orchi (1/gn, continua a combattere per 1 round quando PF scendono a 0 o meno)',
      'Intimidire (+2 Intimidire)'
    ],
    languages: ['Comune', 'Orchesco'],
    bonusLanguages: ['Abissale', 'Draconico', 'Gigante', 'Gnoll', 'Goblin'],
    source: 'Core',
    alternativeTraits: [
      { name: 'Scavenger', replaces: ['Ferocia degli Orchi'], description: '+2 Percezione; Percezione sempre abilità di classe' },
      { name: 'Bond to the Land', replaces: ['Ferocia degli Orchi'], description: '+2 CA e Furtività nel terreno di origine' },
      { name: 'Toothy', replaces: ['Familiarità nelle Armi'], description: 'Attacco di morso 1d4 come arma naturale' },
      { name: 'Sacred Tattoo', replaces: ['Ferocia degli Orchi'], description: '+1 a tutti i tiri salvezza' },
      { name: 'Beastmaster', replaces: ['Intimidire'], description: '+2 Gestire Animali; le bestie selvatiche non attaccano per prime senza provocazione' },
      { name: 'Bestial', replaces: ['Scurovisione'], description: 'Scurovisione 36m invece di 18m' },
      { name: 'Chain Fighter', replaces: ['Familiarità nelle Armi'], description: 'Competenza con catena chiodata e flagello' },
      { name: 'City-Raised', replaces: ['Familiarità nelle Armi', 'Linguaggi'], description: 'Comune come lingua bonus; competenza con spade lunghe e mazze' },
      { name: 'Gatecrasher', replaces: ['Ferocia degli Orchi'], description: '+2 BMC e danni Sfondamento; +2 Forza per scassinare' },
      { name: 'Gore Ferocity', replaces: ['Ferocia degli Orchi'], description: 'Quando Ferocia si attiva ottiene anche Spaventoso per 1 round' },
      { name: 'Horde Charge', replaces: ['Ferocia degli Orchi'], description: '+1 attacco in carica se un alleato ha già caricato lo stesso bersaglio' },
      { name: 'Knife in the Dark', replaces: ['Familiarità nelle Armi'], description: 'Gli attacchi a sorpresa non sono limitati alla mischia' },
      { name: 'Night Attack', replaces: ['Scurovisione'], description: '+1 attacco e CA nelle tenebre totali' },
      { name: 'Plagueborn', replaces: ['Ferocia degli Orchi'], description: 'Immunità malattie non-magiche; +2 Tempra vs malattie magiche' },
      { name: 'Razortusk', replaces: ['Familiarità nelle Armi'], description: 'Morso 1d4 con zanne affilate; Ferocia si attiva a ½ PF massimi' },
      { name: 'Rock Climber', replaces: ['Ferocia degli Orchi'], description: '+2 Scalare; può scalare senza attrezzatura a velocità dimezzata' },
      { name: 'Skilled', replaces: ['Ferocia degli Orchi'], description: '1 grado abilità extra al 1° livello e ad ogni livello successivo' },
      { name: 'Smeller', replaces: ['Scurovisione'], description: 'Olfatto limitato (metà gittata) invece della Scurovisione estesa' },
      { name: 'Superstitious', replaces: ['Ferocia degli Orchi'], description: '+2 TS vs magia; –1 alle prove di abilità legate alla magia' },
      { name: 'Vessel of the Failed', replaces: ['Ferocia degli Orchi'], description: 'Può controllare 1 non-morto extra per lancio di controllo non-morti' },
      { name: 'Wildwalker', replaces: ['Familiarità nelle Armi', 'Linguaggi'], description: '+1 Sopravvivenza; terreno selvaggio non rallenta il movimento' }
    ]
  },

  // =====================================================================
  // RAZZE PECULIARI (Advanced Race Guide)
  // =====================================================================

  {
    id: 'aasimar',
    name: 'Aasimar',
    abilityMods: { str: 0, dex: 0, con: 0, int: 0, wis: 2, cha: 2 },
    size: 'Media',
    speed: 9,
    traits: [
      'Scurovisione 18m',
      'Resistenze Celestiali (Resistenza Acido 5, Elettricità 5, Freddo 5)',
      'Luce Diurna (1/gn come capacità magica)',
      'Abile (+2 Diplomazia e Percezione)'
    ],
    languages: ['Comune', 'Celestiale'],
    bonusLanguages: ['Draconico', 'Elfico', 'Gnomesco', 'Halfling', 'Nanico', 'Silvano'],
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Celestial Crusader', replaces: ['Abile'], description: '+1 ai tiri per colpire e al CL contro Esterni malvagi e Non Morti' },
      { name: 'Crusading Magic', replaces: ['Luce Diurna'], description: '+2 prove di CL vs SR; +2 Concentrazione' },
      { name: 'Deathless Spirit', replaces: ['Resistenze Celestiali'], description: 'Resistenza all\'energia negativa; +2 TS vs morte e risucchio di livello' },
      { name: 'Exalted Resistance', replaces: ['Resistenza agli Incantesimi'], description: 'RI 5+livello solo vs magia malvagia e maledizioni' },
      { name: 'Halo', replaces: ['Luce Diurna'], description: 'Crea alone di luce a volontà (come incantesimo Luce)' },
      { name: 'Heavenborn', replaces: ['Luce Diurna'], description: '+2 Conoscenze (piani); immune a vertigini; +1 CL incantesimi del bene' },
      { name: 'Immortal Spark', replaces: ['Abile'], description: '+2 TS vs morte; invecchia a 1/5 del ritmo normale' },
      { name: 'Incorruptible', replaces: ['Luce Diurna'], description: 'Immunità agli effetti corruttivi su mente e corpo' },
      { name: 'Lost Promise', replaces: ['Abile'], description: '–2 TS vs charme e compulsione; +1 CL per ogni classe incantatore' },
      { name: 'Scion of Humanity', replaces: ['Tipo'], description: 'Conta come umano per tutti gli effetti razziali' },
      { name: 'Truespeaker', replaces: ['Abile'], description: '+2 Linguistica; ottiene 3 lingue per grado in Linguistica' }
    ],
    variants: [
      { id: 'idyllkin', name: 'Idillkin', abilityMods: { str: 2, dex: 0, con: 0, int: -2, wis: 0, cha: 2 }, altSLA: 'Comunicare con gli Animali 1/gn; +2 Natura' },
      { id: 'angelkin', name: 'Angelkin', abilityMods: { str: 2, dex: 0, con: 0, int: 0, wis: -2, cha: 2 }, altSLA: 'Forza del Toro 1/gn; +2 Religioni' },
      { id: 'lawbringer', name: 'Lawbringer', abilityMods: { str: 0, dex: -2, con: 2, int: 0, wis: 2, cha: 0 }, altSLA: 'Spaventapasseri di Luce 1/gn; +2 Piani' },
      { id: 'musetouched', name: 'Musetouched', abilityMods: { str: -2, dex: 2, con: 0, int: 0, wis: 0, cha: 2 }, altSLA: 'Colpo Acustico 1/gn; +2 Intrattenere' },
      { id: 'plumekith', name: 'Plumekith', abilityMods: { str: 2, dex: 0, con: 0, int: -2, wis: 2, cha: 0 }, altSLA: 'Accecamento/Sordità 1/gn; +2 Sorvolare' },
      { id: 'emberkin', name: 'Emberkin', abilityMods: { str: 0, dex: 0, con: 0, int: 2, wis: -2, cha: 2 }, altSLA: 'Pirotecnia 1/gn; +2 Sapienza Magica' }
    ]
  },

  {
    id: 'coboldo',
    name: 'Coboldo',
    abilityMods: { str: -4, dex: 2, con: -2, int: 0, wis: 0, cha: 0 },
    size: 'Piccola',
    speed: 9,
    traits: [
      'Scurovisione 18m',
      'Sensibilità alla Luce (Abbagliato in luce intensa)',
      'Armatura Naturale (+1 CA)',
      'Astuto (+2 Percezione, Professione (minatore), prove per individuare o disarmare trappole)'
    ],
    languages: ['Draconico'],
    bonusLanguages: ['Comune', 'Gnomesco', 'Nanico', 'Sottocomune'],
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Beast Bond', replaces: ['Astuto'], description: '+2 Gestire Animali; famiglio/compagno ottiene +1 DV' },
      { name: 'Day Raider', replaces: ['Scurovisione', 'Sensibilità alla Luce'], description: 'Visione Crepuscolare; nessuna sensibilità alla luce' },
      { name: 'Dragon Affinity', replaces: ['Astuto'], description: '+2 Usare Congegni Magici; SLA da lista drago 1/gn' },
      { name: 'Dragonmaw', replaces: ['Astuto'], description: 'Morso 1d4 con afferrare; usa Forza per il morso' },
      { name: 'Dragon-Scaled', replaces: ['Astuto'], description: '+1 armatura naturale; Resistenza 2 al tipo di energia del drago patrono' },
      { name: 'Echo Whistler', replaces: ['Astuto'], description: '+2 Percezione e Furtività sottoterra' },
      { name: 'Frightener', replaces: ['Astuto'], description: '+2 Intimidire; può demoralizzare come azione di movimento' },
      { name: 'Gliding Wings', replaces: ['Astuto'], description: 'Planata: cade a metà velocità e si muove orizzontalmente per metà' },
      { name: 'Jester', replaces: ['Astuto'], description: '+2 Raggirare; 1/gn forza il ritiro di un attacco contro di sé' },
      { name: 'Prehensile Tail', replaces: ['Astuto'], description: 'La coda porta oggetti leggeri; recuperarli è azione rapida' },
      { name: 'Secret Strider', replaces: ['Astuto'], description: '+4 Furtività; ignora terreno difficile naturale' },
      { name: 'Shoulder-to-Shoulder', replaces: ['Sciamare'], description: '+2 CMD se affiancato; può condividere lo stesso quadretto liberamente' },
      { name: 'Spellcaster Sneak', replaces: ['Astuto'], description: '+4 Furtività quando lancia incantesimi' },
      { name: 'Wild Forest Kobold', replaces: ['Astuto', 'Scurovisione'], description: 'Visione Crepuscolare; +2 Percezione e Sopravvivenza in foreste' },
      { name: 'Wyrmcrowned', replaces: ['Astuto'], description: 'Corna 1d4; +2 CMD vs disarmo' }
    ]
  },

  {
    id: 'dhampir',
    name: 'Dhampir',
    abilityMods: { str: 0, dex: 2, con: -2, int: 0, wis: 0, cha: 2 },
    size: 'Media',
    speed: 9,
    traits: [
      'Scurovisione 18m',
      'Visione Crepuscolare',
      'Affinità con l\'Energia Negativa (curato da Energia Negativa, danneggiato da Positiva)',
      'Sensibilità alla Luce (Abbagliato in luce intensa)',
      'Resistenza al Risucchio di Livelli (+2 TS vs risucchio livelli)',
      'Resistenza dei Non Morti (+2 TS vs malattia e effetti dei Non Morti)',
      'Capacità Magiche (Individuazione dei Non Morti 3/gn)',
      'Manipolatore (+2 Percezione e Raggirare)'
    ],
    languages: ['Comune'],
    bonusLanguages: [],
    bonusLanguagesNote: 'Qualsiasi linguaggio (eccetto segreti come Druidico)',
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Dayborn', replaces: ['Sensibilità alla Luce'], description: 'Nessuna sensibilità alla luce; perde anche Scurovisione' },
      { name: 'Fangs', replaces: ['Manipolatore'], description: 'Morso 1d4 che può iniettare veleno sputabile (TS Tempra)' },
      { name: 'Heir to Undying', replaces: ['Modificatori Caratteristiche'], description: 'Lignaggio vampirico: sostituisce i bonus caratteristiche standard' },
      { name: 'Vampire Hunter', replaces: ['Resistenza ai Non Morti'], description: '+2 Percezione e Senso Inganno contro Non Morti' },
      { name: 'Vampiric Empathy', replaces: ['Manipolatore'], description: 'Parla e influenza i Non Morti (come Immedesimazione nelle Emozioni)' }
    ],
    variants: [
      { id: 'ru-shi', name: 'Ru-shi', abilityMods: { str: 0, dex: 0, con: -2, int: 2, wis: 2, cha: 0 }, altSLA: 'Nessun morso; può trattenere il respiro più a lungo' },
      { id: 'svetocher', name: 'Svetocher', abilityMods: { str: 0, dex: 2, con: -2, int: 0, wis: 0, cha: 2 }, altSLA: 'Attacco di morso; +2 vs malattia' },
      { id: 'ajibachana', name: 'Ajibachana', abilityMods: { str: 0, dex: 0, con: -2, int: 2, wis: 0, cha: 2 }, altSLA: 'Nessun morso; +2 Percepire Intenzioni' },
      { id: 'ancient-born', name: 'Ancient-Born', abilityMods: { str: 2, dex: 0, con: 0, int: 0, wis: 2, cha: -2 }, altSLA: 'Nessun morso; ottiene Olfatto' },
      { id: 'sacred-ancestry', name: 'Sacred-Ancestry', abilityMods: { str: 0, dex: 0, con: -2, int: 0, wis: 2, cha: 2 }, altSLA: 'Nessun morso; +2 a tutti i tiri salvezza' }
    ]
  },

  {
    id: 'drow',
    name: 'Drow',
    abilityMods: { str: 0, dex: 2, con: -2, int: 0, wis: 0, cha: 2 },
    size: 'Media',
    speed: 9,
    traits: [
      'Scurovisione 36m',
      'Familiarità nelle Armi (balestre a mano, stocchi, spade corte)',
      'Uso dei Veleni (non rischiano di avvelenarsi accidentalmente)',
      'Cecità alla Luce (Accecato 1 round poi Abbagliato in luce intensa)',
      'Immunità dei Drow (immunità magia del sonno, +2 TS vs Ammaliamento)',
      'Resistenza agli Incantesimi (RI pari a 6 + livello personaggio)',
      'Capacità Magiche (Luci Danzanti, Luminescenza, Oscurità 1/gn ciascuno)',
      'Sensi Acuti (+2 Percezione)'
    ],
    languages: ['Elfico', 'Sottocomune'],
    bonusLanguages: ['Abissale', 'Aklo', 'Aquan', 'Comune', 'Draconico', 'Gnomesco', 'Goblin', 'Linguaggio dei Segni Drow'],
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Ambitious Schemer', replaces: ['Sensi Acuti'], description: 'Bluff o Diplomazia diventa abilità di classe; +2 all\'abilità scelta' },
      { name: 'Ancestral Grudge', replaces: ['Uso Veleni'], description: '+1 ai tiri per colpire vs nani e elfi' },
      { name: 'Blasphemous Covenant', replaces: ['Sensi Acuti'], description: '+2 Diplomazia con demoni non vincolati' },
      { name: 'Champion of Dark Powers', replaces: ['Resistenza agli Incantesimi'], description: 'RI solo vs magia del bene e cure; magia del male ottiene +2 CD' },
      { name: 'Defensive Training', replaces: ['Immunità Drow', 'Sensi Acuti', 'Uso Veleni'], description: '+4 CA in schivata vs aberrazioni' },
      { name: 'Poison Minion', replaces: ['Immunità Drow'], description: 'Il proprio corpo produce mawbane poison da contatto' },
      { name: 'Seducer', replaces: ['Immunità Drow'], description: '+1 CD incantesimi di ammaliamento SLA; Charme Persona 1/gn' },
      { name: 'Stalker', replaces: ['Capacità Magiche'], description: 'Nessuna penalità su terreno difficile sottoterra; ottiene Passo Agile' },
      { name: 'Sure Step', replaces: ['Sensi Acuti'], description: 'Nessuna penalità al movimento nei combattimenti al buio o in cecità' },
      { name: 'Surface Infiltrator', replaces: ['Scurovisione', 'Cecità alla Luce'], description: 'Visione Crepuscolare al posto di entrambi' },
      { name: 'Underworld Guide', replaces: ['Sensi Acuti'], description: '+2 Iniziativa; +2 vs trappole e pericoli sotterranei' },
      { name: 'Voice in the Darkness', replaces: ['Familiarità nelle Armi'], description: '(Car≥13) +2 Intimidire e Furtività in luce fioca o tenebre' }
    ]
  },

  {
    id: 'felinide',
    name: 'Felinide',
    abilityMods: { str: 0, dex: 2, con: 0, int: 0, wis: -2, cha: 2 },
    size: 'Media',
    speed: 9,
    traits: [
      'Visione Crepuscolare',
      'Fortuna Felina (1/gn, può tirare due volte un TS Riflessi e usare il risultato migliore)',
      'Scattante (+3m bonus di velocità in azioni di Carica, Corsa e Ritirata)',
      'Cacciatore Naturale (+2 Furtività, Percezione e Sopravvivenza)'
    ],
    languages: ['Comune', 'Felinide'],
    bonusLanguages: ['Elfico', 'Gnoll', 'Gnomesco', 'Goblin', 'Halfling', 'Orchesco', 'Silvano'],
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Cat\'s Claws', replaces: ['Cacciatore Naturale'], description: '2 artigli 1d4 come armi naturali' },
      { name: 'Clever Cat', replaces: ['Cacciatore Naturale'], description: '+2 Raggirare, Diplomazia e Senso Inganno' },
      { name: 'Climber', replaces: ['Scattante'], description: 'Velocità di arrampicata 6m' },
      { name: 'Curiosity', replaces: ['Cacciatore Naturale'], description: '+4 Diplomazia per ottenere informazioni; Conoscenze (storia) e (locali) di classe' },
      { name: 'Jungle Stalker', replaces: ['Fortuna', 'Scattante'], description: '+2 Acrobazie; ignora il primo quadretto di terreno difficile in natura' },
      { name: 'Nimble Faller', replaces: ['Scattante'], description: 'Atterra sempre sui piedi; +1 CMD vs sgambatura e abbattimento' },
      { name: 'Scent', replaces: ['Visione Crepuscolare'], description: 'Ottiene la capacità Olfatto' }
    ]
  },

  {
    id: 'ghermito',
    name: 'Ghermito',
    abilityMods: { str: 0, dex: 2, con: 0, int: 0, wis: -2, cha: 2 },
    size: 'Media',
    speed: 9,
    traits: [
      'Scurovisione 18m',
      'Visione Crepuscolare',
      'Fondersi con le Ombre (50% di mancanza in luce fioca come Nebbia)',
      'Resistenze Ombrose (Resistenza Elettricità 5, Freddo 5)',
      'Capacità Magiche (Camuffare Se Stesso 1/gn; al 9° Camminare nelle Ombre; al 13° Spostamento Planare)',
      'Abile (+2 Conoscenze (piani) e Furtività)'
    ],
    languages: ['Comune'],
    bonusLanguages: ['Aklo', 'Aquan', 'Auran', 'Draconico', 'Diziriak (solo comprensione)', 'Ignan', 'Terran'],
    bonusLanguagesNote: 'Anche lingue umane regionali',
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Bound to Here', replaces: ['Fondersi nelle Ombre'], description: '+2 TS vs effetti di viaggio planare, morte istantanea e dislocazione' },
      { name: 'Boundary Walker', replaces: ['Resistenze Ombrose'], description: 'Conta come nativo su entrambi i piani; immunità ai danni da transizione planare' },
      { name: 'Deep Shadow Explorer', replaces: ['Capacità Magiche'], description: 'Scurovisione 36m; diventa Sensibile alla Luce' },
      { name: 'Emissary', replaces: ['Abile'], description: '+2 Diplomazia e Bluff; può parlare con le proprie ombre 3/gn' },
      { name: 'Gloom Shimmer', replaces: ['Fondersi nelle Ombre'], description: 'Effetto miss del 20% in luce fioca' },
      { name: 'Recluse', replaces: ['Abile'], description: '+2 Furtività e Percezione; i bonus raddoppiano quando si è soli' },
      { name: 'Shadow Agent', replaces: ['Capacità Magiche'], description: 'Le SLA possono essere usate anche in luce intensa ma a frequenza ridotta' },
      { name: 'Shadow Magic', replaces: ['Capacità Magiche'], description: 'Le SLA diventano versioni della scuola dell\'ombra con effetti aleatori' },
      { name: 'Subtle Manipulator', replaces: ['Abile'], description: '+2 Bluff e Senso Inganno; individua automaticamente le bugie 1/gn' },
      { name: 'Umbral Escort', replaces: ['Capacità Magiche'], description: 'Porta un volontario nel Piano del Crepuscolo 1/gn' },
      { name: 'Unnerving Gaze', replaces: ['Capacità Magiche'], description: 'Lo sguardo causa Scosso a distanza (TS Volontà nega)' },
      { name: 'Whispers from Shadow', replaces: ['Capacità Magiche'], description: 'Ascolta i sussurri dalle ombre; +2 Percezione nei luoghi bui' },
      { name: 'World Walker', replaces: ['Resistenze Ombrose'], description: '+1 CL nelle magie delle ombre; +2 Conoscenze (piani)' }
    ]
  },

  {
    id: 'goblin',
    name: 'Goblin',
    abilityMods: { str: -2, dex: 4, con: 0, int: 0, wis: 0, cha: -2 },
    size: 'Piccola',
    speed: 9,
    traits: [
      'Scurovisione 18m',
      'Esperto (+4 Cavalcare e Furtività)'
    ],
    languages: ['Goblin'],
    bonusLanguages: ['Comune', 'Draconico', 'Gnoll', 'Gnomesco', 'Halfling', 'Nanico', 'Orchesco'],
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Cave Crawler', replaces: ['Esperto di Fuga'], description: 'Velocità arrampicata 6m; +4 Scalare' },
      { name: 'City Scavenger', replaces: ['Esperto di Fuga'], description: '+2 Percezione e Sopravvivenza in aree urbane; sempre abilità di classe' },
      { name: 'Eat Anything', replaces: ['Esperto di Fuga'], description: '+2 Tempra vs nausea, malessere e malattie trasmesse dal cibo' },
      { name: 'Hard Head, Big Teeth', replaces: ['Esperto di Fuga'], description: 'Testata 1d4 e morso 1d6 come armi naturali' },
      { name: 'Junk Tinker', replaces: ['Esperto di Fuga'], description: '+2 Artigianato (meccanismi) e Individuare Trappole' },
      { name: 'Over-Sized Ears', replaces: ['Esperto di Fuga'], description: '+4 Percezione; Senso Cieco 3m' },
      { name: 'Tree Runner', replaces: ['Esperto di Fuga'], description: '+4 Acrobazie e Scalare; le foreste leggere non sono terreno difficile' },
      { name: 'Weapon Familiarity', replaces: ['Esperto di Fuga'], description: 'Competenza con tutte le armi goblin' }
    ]
  },

  {
    id: 'hobgoblin',
    name: 'Hobgoblin',
    abilityMods: { str: 0, dex: 2, con: 2, int: 0, wis: 0, cha: 0 },
    size: 'Media',
    speed: 9,
    traits: [
      'Scurovisione 18m',
      'Furtivo (+4 Furtività)'
    ],
    languages: ['Comune', 'Goblin'],
    bonusLanguages: ['Draconico', 'Gigante', 'Infernale', 'Nanico', 'Orchesco'],
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Authoritative', replaces: ['Furtivo'], description: '+2 Diplomazia; sempre abilità di classe' },
      { name: 'Bandy-Legged', replaces: ['Furtivo'], description: '+4 CMD vs Sgambatura e Investimento' },
      { name: 'Battle-Hardened', replaces: ['Furtivo'], description: '+1 BMC; può combattere 1 round extra sotto 0 PF prima di cadere privo di sensi' },
      { name: 'Engineer', replaces: ['Furtivo'], description: '+2 Artigianato (meccanismi) e Individuare Trappole; sempre abilità di classe' },
      { name: 'Fearsome', replaces: ['Furtivo'], description: '+2 Intimidire; può demoralizzare come azione di movimento' },
      { name: 'Magehunter', replaces: ['Furtivo'], description: '+2 Sapienza Magica; +1 ai tiri per colpire vs lanciatori di incantesimi' },
      { name: 'Pit Boss', replaces: ['Furtivo'], description: '+2 Gestire Animali; i seguaci ottengono +1 ad aiutare' },
      { name: 'Scarred', replaces: ['Furtivo'], description: '+2 TS vs paura; –2 Carisma' },
      { name: 'Slave Hunter', replaces: ['Furtivo'], description: '+2 Sopravvivenza per tracciare; +2 CMD vs tentativi di fuga' },
      { name: 'Unfit', replaces: ['Furtivo', 'Costituzione'], description: '+2 Des –2 Cos; –2 Acrobazie e Nuotare; +2 Iniziativa' }
    ]
  },

  {
    id: 'ifrit',
    name: 'Ifrit',
    abilityMods: { str: 0, dex: 2, con: 0, int: 0, wis: -2, cha: 2 },
    size: 'Media',
    speed: 9,
    traits: [
      'Scurovisione 18m',
      'Resistenza al Fuoco 5',
      'Affinità col Fuoco (Stregone di Stirpe del Fuoco tratta Cha come 2 punti più alto; Chierici con Dominio del Fuoco lanciano incantesimi del dominio a livello +1)',
      'Capacità Magiche (Mani Brucianti 1/gn)'
    ],
    languages: ['Comune', 'Ignan'],
    bonusLanguages: ['Aquan', 'Auran', 'Elfico', 'Gnomesco', 'Halfling', 'Nanico', 'Terran'],
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Brazen Flame', replaces: ['Affinità col Fuoco'], description: 'Il fuoco infligge +1 danno per dado; +2 TS vs fuoco' },
      { name: 'Desert Mirage', replaces: ['Capacità Magiche'], description: 'Confusione 1/gn invece di Mani Brucianti' },
      { name: 'Efreeti Magic', replaces: ['Affinità col Fuoco'], description: 'Ingrandire Persona o Ridurre Persona 1/gn' },
      { name: 'Fire in the Blood', replaces: ['Resistenza al Fuoco'], description: 'Guarigione Accelerata 2 per 1 round ogni volta che subisce danni da fuoco' },
      { name: 'Fire Insight', replaces: ['Affinità col Fuoco'], description: '+2 Sapienza Magica; identifica automaticamente magie del fuoco' },
      { name: 'Fire-Starter', replaces: ['Capacità Magiche'], description: 'Produrre Fiamme 3/gn' },
      { name: 'Forge-Hardened', replaces: ['Resistenza al Fuoco'], description: '+2 TS vs fuoco e caldo; bonus alle prove di Artigianato con metallo' },
      { name: 'Hypnotic', replaces: ['Capacità Magiche'], description: 'Ipnotismo 1/gn' },
      { name: 'Mostly Human', replaces: ['Tipo'], description: 'Conta come umanoide (umano) e Esterno (nativo) per tutti gli effetti' },
      { name: 'Wildfire Heart', replaces: ['Affinità col Fuoco'], description: '+4 Des ai tiri di iniziativa; +1 CD incantesimi del fuoco' }
    ],
    variants: [
      { id: 'lavasoul', name: 'Lavasoul', abilityMods: { str: 0, dex: -2, con: 2, int: 2, wis: 0, cha: 0 }, altSLA: 'Sabbie Ardenti 1/gn; Affinità con il Magma' },
      { id: 'sunsoul', name: 'Sunsoul', abilityMods: { str: 2, dex: 0, con: 0, int: 0, wis: -2, cha: 2 }, altSLA: 'Metallo Solare 1/gn; Affinità con il Sole' }
    ]
  },

  {
    id: 'ondine',
    name: 'Ondine',
    abilityMods: { str: -2, dex: 2, con: 0, int: 0, wis: 2, cha: 0 },
    size: 'Media',
    speed: 9,
    swimSpeed: 9,
    traits: [
      'Scurovisione 18m',
      'Resistenza al Freddo 5',
      'Affinità all\'Acqua (Stregone di Stirpe dell\'Acqua tratta Cha come 2 punti più alto; Chierici con Dominio dell\'Acqua lanciano incantesimi del dominio a livello +1)',
      'Capacità Magiche (Spinta Idraulica 1/gn)'
    ],
    languages: ['Comune', 'Aquan'],
    bonusLanguages: ['Auran', 'Elfico', 'Gnomesco', 'Halfling', 'Ignan', 'Nanico', 'Terran'],
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Acid Breath', replaces: ['Capacità Magiche'], description: '1/gn: cono 1,5m di acido 1d8/2CL (max 5d8), TS Riflessi dimezza' },
      { name: 'Amphibious', replaces: ['Capacità Magiche'], description: 'Ottiene il sottotipo Acquatico e la capacità Anfibia' },
      { name: 'Deepsight', replaces: ['Scurovisione'], description: 'Scurovisione 36m ma solo sott\'acqua' },
      { name: 'Flesh Chameleon', replaces: ['Resistenza al Freddo'], description: '+4 Travestimento come umano; può cambiare il colore della pelle a volontà' },
      { name: 'Hydrated Vitality', replaces: ['Affinità con l\'Acqua'], description: 'Guarigione Accelerata 2 per ogni round completamente immersa in acqua naturale' },
      { name: 'Mostly Human', replaces: ['Tipo'], description: 'Conta come umanoide (umano) e Esterno (nativo) per tutti gli effetti' },
      { name: 'Nereid Fascination', replaces: ['Capacità Magiche'], description: '1/gn: affascina umanoidi entro 6m per ½ livello round (TS Volontà nega)' },
      { name: 'Ooze Breath', replaces: ['Capacità Magiche'], description: '1/gn: cono 1,5m mucoacido 1d4/2CL; bersagli diventano Nauseati per 3 round' },
      { name: 'Terrain Chameleon', replaces: ['Resistenza al Freddo'], description: '+4 Furtività sott\'acqua come azione standard' },
      { name: 'Triton Magic', replaces: ['Capacità Magiche'], description: 'Evocare Alleato I (delfino) 1/gn' },
      { name: 'Water Sense', replaces: ['Resistenza al Freddo'], description: 'Senso Cieco 9m vs creature nel medesimo corpo d\'acqua' }
    ],
    variants: [
      { id: 'mistsoul', name: 'Mistsoul', abilityMods: { str: 0, dex: 0, con: 2, int: -2, wis: 2, cha: 0 }, altSLA: 'Nebbia Oscurante 1/gn; Affinità con la Nebbia' },
      { id: 'rimesoul', name: 'Rimesoul', abilityMods: { str: 0, dex: 2, con: 0, int: 2, wis: 0, cha: -2 }, altSLA: 'Tocco del Gelo 1/gn; Affinità con il Ghiaccio' }
    ]
  },

  {
    id: 'orco',
    name: 'Orco',
    abilityMods: { str: 4, dex: 0, con: 0, int: -2, wis: -2, cha: -2 },
    size: 'Media',
    speed: 9,
    traits: [
      'Scurovisione 18m',
      'Familiarità nelle Armi (ascia bipenne, falchion; armi con "orchesco" nel nome)',
      'Ferocia (rimane cosciente e combatte normalmente quando PF scendono sotto 0)',
      'Sensibilità alla Luce (Abbagliato in luce intensa)'
    ],
    languages: ['Comune', 'Orchesco'],
    bonusLanguages: ['Gigante', 'Gnoll', 'Goblin', 'Nanico', 'Sottocomune'],
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Dayrunner', replaces: ['Sensibilità alla Luce'], description: 'Solo –2 ai tiri per colpire a distanza in luce diretta; non abbagliato' },
      { name: 'Feral', replaces: ['Familiarità nelle Armi', 'Linguaggi'], description: 'Sopravvivenza sempre abilità di classe; +1 attacco e danni sotto 0 PF' },
      { name: 'Reckless Climber', replaces: ['Ferocia'], description: '+4 Scalare senza corda; +4 Acrobazie per mantenere equilibrio' },
      { name: 'Smeller', replaces: ['Ferocia', 'Familiarità nelle Armi'], description: 'Olfatto limitato (metà gittata)' },
      { name: 'Squalid', replaces: ['Ferocia'], description: '+2 TS vs nausea, malessere e malattia' }
    ]
  },

  {
    id: 'oreade',
    name: 'Oreade',
    abilityMods: { str: 2, dex: 0, con: 0, int: 0, wis: 2, cha: -2 },
    size: 'Media',
    speed: 6,
    traits: [
      'Scurovisione 18m',
      'Resistenza all\'Acido 5',
      'Affinità con la Terra (Stregone di Stirpe della Terra tratta Cha come 2 punti più alto; Chierici con Dominio della Terra lanciano incantesimi del dominio a livello +1)',
      'Capacità Magiche (Pietra Magica 1/gn)'
    ],
    languages: ['Comune', 'Terran'],
    bonusLanguages: ['Aquan', 'Auran', 'Elfico', 'Gnomesco', 'Halfling', 'Ignan', 'Nanico', 'Sottocomune'],
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Crystalline Form', replaces: ['Affinità con la Terra'], description: '+2 CA vs raggi; deflette automaticamente un raggio 1/gn' },
      { name: 'Earth Insight', replaces: ['Affinità con la Terra'], description: 'Le evocazioni della terra durano 2 round extra' },
      { name: 'Ferrous Growth', replaces: ['Capacità Magiche'], description: '1/gn: fa crescere 5 kg di ferro/acciaio permanentemente in 10 min' },
      { name: 'Fertile Soil', replaces: ['Affinità con la Terra'], description: 'Stirpe Verdeggiante +2 Car; incantesimi delle piante +1 CL' },
      { name: 'Granite Skin', replaces: ['Resistenza agli Acidi'], description: '+1 armatura naturale' },
      { name: 'Isolated', replaces: ['Resistenza', 'Linguaggi'], description: '+2 Percezione e Conoscenze (dungeon); parla solo Terran' },
      { name: 'Mountain-Born', replaces: ['Capacità Magiche'], description: '+2 Acrobazie su cornicioni; +2 TS vs effetti di altitudine' },
      { name: 'Mostly Human', replaces: ['Tipo'], description: 'Conta come umanoide (umano) e Esterno (nativo) per tutti gli effetti' },
      { name: 'Oread Gem Magic', replaces: ['Affinità con la Terra'], description: 'Può potenziare le magie della terra usando gemme preziose' },
      { name: 'Stone in the Blood', replaces: ['Affinità con la Terra'], description: 'Guarigione Accelerata 2 per 1 round ogni volta che subisce danni da acido' },
      { name: 'Treacherous Earth', replaces: ['Capacità Magiche'], description: '1/gn: crea zona di terreno difficile di 3m per livello in minuti' }
    ],
    variants: [
      { id: 'gemsoul', name: 'Gemsoul', abilityMods: { str: 0, dex: 0, con: 0, int: 0, wis: -2, cha: 2 }, altSLA: 'Cascata di Colori 1/gn; Affinità con i Cristalli' },
      { id: 'ironsoul', name: 'Ironsoul', abilityMods: { str: 0, dex: -2, con: 2, int: 0, wis: 2, cha: 0 }, altSLA: 'Arma Infallibile 1/gn; Affinità con il Metallo' }
    ]
  },

  {
    id: 'rattoide',
    name: 'Rattoide',
    abilityMods: { str: -2, dex: 2, con: 0, int: 2, wis: 0, cha: 0 },
    size: 'Piccola',
    speed: 6,
    traits: [
      'Scurovisione 18m',
      'Sciamare (2 rattoidi nello stesso quadretto ottengono automaticamente il fiancheggiamento)',
      'Armeggiatore (+2 Artigianato (alchimia), Percezione e Usare Congegni Magici)',
      'Empatia con i Roditori (+4 Addestrare Animali contro roditori)'
    ],
    languages: ['Comune'],
    bonusLanguages: ['Aklo', 'Draconico', 'Gnoll', 'Gnomesco', 'Goblin', 'Halfling', 'Nanico', 'Orchesco', 'Sottocomune'],
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Cornered Fury', replaces: ['Sciamare'], description: 'A ≤½ PF senza alleati entro 9m: +2 attacco e CA' },
      { name: 'Market Dweller', replaces: ['Armeggiatore'], description: '+2 Raggirare, Senso Inganno e Borseggio' },
      { name: 'Scent', replaces: ['Armeggiatore'], description: 'Ottiene Olfatto; –2 Percezione basata su vista o udito' },
      { name: 'Skulk', replaces: ['Armeggiatore'], description: '+2 Furtività; solo –5 (non –10) a Furtività dopo una distrazione con Bluff' },
      { name: 'Unnatural', replaces: ['Empatia dei Roditori'], description: 'Gli animali sono ostili per default; +2 schivata CA vs animali; –4 Car in interazioni con animali' }
    ]
  },

  {
    id: 'silfide',
    name: 'Silfide',
    abilityMods: { str: 0, dex: 2, con: -2, int: 2, wis: 0, cha: 0 },
    size: 'Media',
    speed: 9,
    traits: [
      'Scurovisione 18m',
      'Resistenza all\'Elettricità 5',
      'Affinità all\'Aria (Stregone di Stirpe Elementale (aria) tratta Cha come 2 punti più alto; Chierici con Dominio dell\'Aria lanciano incantesimi del dominio a livello +1)',
      'Capacità Magiche (Caduta Morbida 1/gn)'
    ],
    languages: ['Comune', 'Auran'],
    bonusLanguages: ['Aquan', 'Elfico', 'Gnomesco', 'Halfling', 'Ignan', 'Nanico', 'Terran'],
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Air Insight', replaces: ['Affinità con l\'Aria'], description: 'Le evocazioni dell\'aria durano 2 round extra' },
      { name: 'Breeze-Kissed', replaces: ['Affinità con l\'Aria'], description: '+2 CA vs attacchi a distanza non magici; 1/gn spinta/sgambatura a 9m' },
      { name: 'Like the Wind', replaces: ['Resistenza all\'Elettricità'], description: '+1,5m alla velocità base (fino a 10,5m totali)' },
      { name: 'Mostly Human', replaces: ['Tipo'], description: 'Conta come umanoide (umano) e Esterno (nativo) per tutti gli effetti' },
      { name: 'Sky Speaker', replaces: ['Capacità Magiche'], description: 'Parlare con gli Animali 1/gn (solo uccelli e creature volanti)' },
      { name: 'Secretive', replaces: ['Resistenza', 'SLA'], description: '+2 TS vs ammaliamento e divinazione' },
      { name: 'Storm in the Blood', replaces: ['Affinità con l\'Aria'], description: 'Guarigione Accelerata 2 per 1 round ogni volta che subisce danni da elettricità' },
      { name: 'Thunderous Resilience', replaces: ['Resistenza all\'Elettricità'], description: 'Resistenza al Sonoro 5' },
      { name: 'Weather Savvy', replaces: ['Capacità Magiche'], description: '1/gn: prevede con precisione il meteo per le prossime 24 ore (azione completa)' },
      { name: 'Whispering Wind', replaces: ['Capacità Magiche'], description: '+4 Furtività' }
    ],
    variants: [
      { id: 'smokesoul', name: 'Smokesoul', abilityMods: { str: 0, dex: 2, con: -2, int: 0, wis: 0, cha: 2 }, altSLA: 'Movimento Sfumato 1/gn; Affinità con il Fumo' },
      { id: 'stormsoul', name: 'Stormsoul', abilityMods: { str: 0, dex: 2, con: 0, int: 0, wis: -2, cha: 2 }, altSLA: 'Scossa Elettrica 1/gn; Affinità con il Fulmine' }
    ]
  },

  {
    id: 'tengu',
    name: 'Tengu',
    abilityMods: { str: 0, dex: 2, con: -2, int: 0, wis: 2, cha: 0 },
    size: 'Media',
    speed: 9,
    traits: [
      'Visione Crepuscolare',
      'Arma Naturale (attacco con il morso che infligge 1d3 danni)',
      'Spadaccino (competenza automatica in tutte le armi a lama: falchion, kukri, pugnali, scimitarre, spade corte, spade lunghe, spadoni, stocchi, ecc.)',
      'Furtivo (+2 Furtività e Percezione)',
      'Linguista Dotato (+4 Linguistica; ottiene 2 lingue per grado in Linguistica invece di 1)'
    ],
    languages: ['Comune', 'Tengu'],
    bonusLanguages: [],
    bonusLanguagesNote: 'Qualsiasi linguaggio (eccetto segreti come Druidico)',
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Carrion Sense', replaces: ['Linguista Dotato'], description: 'Olfatto limitato (percepisce cadaveri e creature gravemente ferite)' },
      { name: 'Claw Attack', replaces: ['Arma Naturale'], description: '2 artigli 1d3; contano come Attacco Senz\'Armi Migliorato contro prese' },
      { name: 'Deft Swords', replaces: ['Arma Naturale', 'Furtivo'], description: '+2 CMD con qualsiasi arma di tipo "spada"' },
      { name: 'Exotic Weapon Training', replaces: ['Spadaccino'], description: 'Competenza con 3+Int armi orientali esotiche a scelta' },
      { name: 'Glide', replaces: ['Linguista Dotato'], description: 'Volare CD 15 per caduta sicura; planata 1,5m avanzamento per 6m discesa' }
    ]
  },

  {
    id: 'tiefling',
    name: 'Tiefling',
    abilityMods: { str: 0, dex: 2, con: 0, int: 2, wis: 0, cha: -2 },
    size: 'Media',
    speed: 9,
    traits: [
      'Scurovisione 18m',
      'Resistenze Immonde (Resistenza Elettricità 5, Freddo 5, Fuoco 5)',
      'Capacità Magiche (Oscurità 1/gn)',
      'Stregoneria Immonda (Stregone di Stirpe Abissale o Infernale tratta Cha come 2 punti più alto)',
      'Abile (+2 Furtività e Raggirare)'
    ],
    languages: ['Comune'],
    languagesChoice: ['Abissale', 'Infernale'],
    languagesChoiceNote: 'Scelgono Abissale o Infernale come seconda lingua',
    bonusLanguages: ['Abissale', 'Draconico', 'Elfico', 'Gnomesco', 'Goblin', 'Halfling', 'Infernale', 'Nanico', 'Orchesco'],
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Beguiling Liar', replaces: ['Abile'], description: '+4 Raggirare quando mente deliberatamente' },
      { name: 'Bullying', replaces: ['Abile'], description: '+2 Intimidire; sempre abilità di classe' },
      { name: 'Fiendish Sprinter', replaces: ['Abile'], description: '+1,5m di velocità durante carica, corsa e ritirata' },
      { name: 'Maw or Claw', replaces: ['Resistenze', 'SLA'], description: 'Morso 1d6 OPPURE 2 artigli 1d4 (scelta al 1° livello)' },
      { name: 'Pass for Human', replaces: ['Scurovisione', 'Resistenze'], description: 'I tratti infernali non sono visibili; +10 Travestimento come umano' },
      { name: 'Prehensile Tail', replaces: ['Abile'], description: 'La coda porta oggetti leggeri; recuperarli è azione rapida' },
      { name: 'Scaled Skin', replaces: ['Resistenze'], description: '+1 armatura naturale; Resistenza 5 a un tipo di energia' },
      { name: 'Soul Seer', replaces: ['SLA (Oscurità)'], description: 'Visione Vera (limitata alla linea di vista) a volontà' },
      { name: 'Vestigial Wings', replaces: ['Abile'], description: 'Ali vestigiali: +4 Sorvolare; possono rallentare la caduta' }
    ],
    variants: [
      { id: 'asura-spawn', name: 'Asura-spawn', abilityMods: { str: 0, dex: 0, con: 2, int: -2, wis: 2, cha: 0 }, altSLA: 'Scurovisione 36m; aura che infonde paura (1/gn)' },
      { id: 'daemon-spawn', name: 'Daemon-spawn', abilityMods: { str: 2, dex: 0, con: 0, int: 2, wis: 0, cha: -2 }, altSLA: '+2 vs malattia e veleno' },
      { id: 'demodand-spawn', name: 'Demodand-spawn', abilityMods: { str: 2, dex: 0, con: 2, int: 0, wis: 0, cha: -2 }, altSLA: 'Supera gli effetti della paura; Paura 1/gn' },
      { id: 'demon-spawn', name: 'Demon-spawn', abilityMods: { str: 2, dex: 0, con: 0, int: -2, wis: 0, cha: 2 }, altSLA: 'Fracassare 1/gn' },
      { id: 'devil-spawn', name: 'Devil-spawn', abilityMods: { str: 0, dex: 0, con: 2, int: 0, wis: 2, cha: -2 }, altSLA: '+2 vs veleno; Punizione 1/gn' },
      { id: 'div-spawn', name: 'Div-spawn', abilityMods: { str: 0, dex: 2, con: 0, int: -2, wis: 0, cha: 2 }, altSLA: 'Falsa Direzione 1/gn' },
      { id: 'kyton-spawn', name: 'Kyton-spawn', abilityMods: { str: 0, dex: 2, con: 0, int: 0, wis: 2, cha: -2 }, altSLA: 'Ragnatela 1/gn' },
      { id: 'oni-spawn', name: 'Oni-spawn', abilityMods: { str: 2, dex: 0, con: 0, int: 0, wis: 2, cha: -2 }, altSLA: 'Modificare Aspetto 1/gn' },
      { id: 'qlippoth-spawn', name: 'Qlippoth-spawn', abilityMods: { str: 0, dex: 0, con: 2, int: -2, wis: 2, cha: 0 }, altSLA: '+2 vs confusione e follia' },
      { id: 'rakshasa-spawn', name: 'Rakshasa-spawn', abilityMods: { str: 0, dex: 2, con: 0, int: -2, wis: 0, cha: 2 }, altSLA: 'Individuare i Pensieri 1/gn' }
    ]
  },

  // =====================================================================
  // RAZZE INSOLITE (Advanced Race Guide — Uncommon)
  // =====================================================================

  {
    id: 'changeling',
    name: 'Changeling',
    abilityMods: { str: 0, dex: 0, con: -2, int: 0, wis: 2, cha: 2 },
    size: 'Media',
    speed: 9,
    traits: [
      'Scurovisione 18m',
      'Artigli (2 attacchi con gli artigli da 1d4 danni ciascuno)',
      'Armatura Naturale (+1 CA)',
      'Tratto Razziale delle Megere (ereditato dalla madre: Changeling Imponente / Polmoni Marini / Vedova Verde)'
    ],
    languages: ['Comune'],
    languagesNote: 'Parlano anche la lingua della società che le ospita',
    bonusLanguages: ['Aklo', 'Draconico', 'Elfico', 'Gigante', 'Gnoll', 'Goblin', 'Nanico', 'Orchesco'],
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Hag Magic', replaces: ['Armatura Naturale'], description: '+1 CD ammaliamento; Dondolare/Lacerare/Immedesimazione 1/gn' },
      { name: 'Mist Child', replaces: ['Changeling Imponente'], description: '+5% miss chance in copertura e copertura totale' },
      { name: 'Object of Desire', replaces: ['Vedova Verde'], description: '+1 CL Charme Persona e Charme Mostri' },
      { name: 'Ocean\'s Daughter', replaces: ['Polmoni Marini'], description: '+1 Nuotare; immune ai danni non letali da annegamento' },
      { name: 'Witchborn', replaces: ['Modificatori Caratteristiche'], description: '+2 Int e Cha al posto di +2 Sag e Cha' }
    ]
  },

  {
    id: 'drow-nobile',
    name: 'Drow Nobile',
    abilityMods: { str: 0, dex: 4, con: -2, int: 2, wis: 2, cha: 2 },
    size: 'Media',
    speed: 9,
    traits: [
      'Scurovisione 36m',
      'Familiarità nelle Armi (balestre a mano, stocchi, spade corte)',
      'Uso dei Veleni (non rischiano di avvelenarsi accidentalmente)',
      'Cecità alla Luce (Accecato 1 round poi Abbagliato in luce intensa)',
      'Immunità dei Drow (immunità magia del sonno, +2 TS vs Ammaliamento)',
      'Resistenza agli Incantesimi (RI pari a 11 + livello personaggio)',
      'Capacità Magiche (Caduta Morbida, Levitazione, Luci Danzanti, Luminescenza, Oscurità Profonda a volontà; Individuazione del Magico permanente; Dissolvi Magie, Favore Divino, Suggestione 1/gn)',
      'Sensi Acuti (+2 Percezione)'
    ],
    languages: ['Elfico', 'Sottocomune'],
    bonusLanguages: ['Abissale', 'Aklo', 'Aquan', 'Comune', 'Draconico', 'Gnomesco', 'Goblin', 'Linguaggio dei Segni Drow'],
    source: 'Advanced',
    alternativeTraits: [
    ]
  },

  {
    id: 'duergar',
    name: 'Duergar',
    abilityMods: { str: 0, dex: 0, con: 2, int: 0, wis: 2, cha: -4 },
    size: 'Media',
    speed: 6,
    traits: [
      'Scurovisione Superiore 36m',
      'Lenti e Saldi (velocità non modificata da armatura o ingombro)',
      'Sensibilità alla Luce (Abbagliato in luce intensa)',
      'Immunità dei Duergar (immunità ad allucinazioni, Paralisi e Veleno; +2 TS vs incantesimi e capacità magiche)',
      'Stabilità (+4 DMC vs Sbilanciare e Spingere)',
      'Capacità Magiche (Ingrandire Persone e Invisibilità 1/gn ciascuno, solo su se stessi)'
    ],
    languages: ['Comune', 'Nanico', 'Sottocomune'],
    bonusLanguages: ['Aklo', 'Draconico', 'Gigante', 'Goblin', 'Orchesco', 'Terran'],
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Blood Enmity', replaces: ['Capacità Magiche (Invisibilità)'], description: '+1 ai tiri per colpire vs nani e elfi' },
      { name: 'Daysighted', replaces: ['Sensibilità alla Luce', 'Scurovisione Superiore'], description: 'Rimuove la sensibilità alla luce; Scurovisione ridotta a 18m normali' },
      { name: 'Deep Magic', replaces: ['Capacità Magiche (Invisibilità e Ingrandire)'], description: '+2 CL vs SR; +2 alle prove di Dissolvimento Magie' },
      { name: 'Dwarf Traits', replaces: ['Stabilità'], description: 'Può sostituire Stabilità con qualsiasi tratto razziale nano standard' },
      { name: 'Magical Taskmaster', replaces: ['Capacità Magiche (Invisibilità)'], description: 'Charme Persona 1/gn; CD = 10 + ½DV + Sag' }
    ]
  },

  {
    id: 'grippli',
    name: 'Grippli',
    abilityMods: { str: -2, dex: 2, con: 0, int: 0, wis: 2, cha: 0 },
    size: 'Piccola',
    speed: 9,
    climbSpeed: 6,
    traits: [
      'Scurovisione 18m',
      'Andatura nelle Paludi (si muove nei terreni difficili paludosi alla velocità normale)',
      'Familiarità nelle Armi (reti)',
      'Mimetismo (+4 Furtività in zone boscose e paludose)'
    ],
    languages: ['Comune', 'Grippli'],
    bonusLanguages: ['Boggard', 'Draconico', 'Elfico', 'Gnomesco', 'Goblin', 'Silvano'],
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Defensive Training', replaces: ['Andatura', 'Familiarità nelle Armi'], description: '+2 CA schivata vs animali e bestie di taglia Grande o superiore' },
      { name: 'Glider', replaces: ['Andatura in Ambiente Paludoso'], description: 'Dimezza la velocità di caduta; si sposta orizzontalmente per metà distanza' },
      { name: 'Jumper', replaces: ['Mimetismo'], description: 'Conta sempre come se avesse rincorsa per i salti' },
      { name: 'Princely', replaces: ['Andatura', 'Familiarità nelle Armi'], description: 'Competenza nel fioretto; +2 Diplomazia e Intimidire' },
      { name: 'Toxic Skin', replaces: ['Mimetismo'], description: '1/gn (azione rapida): produce veleno da contatto applicabile a sé o alle armi' }
    ]
  },

  {
    id: 'kitsune',
    name: 'Kitsune',
    abilityMods: { str: -2, dex: 2, con: 0, int: 0, wis: 0, cha: 2 },
    size: 'Media',
    speed: 9,
    traits: [
      'Visione Crepuscolare',
      'Armi Naturali (morso 1d4 in forma naturale)',
      'Cambiare Forma (può assumere una singola forma umana fissa come azione standard; +10 Camuffare per apparire umano)',
      'Magia dei Kitsune (+1 CD TS incantesimi di Ammaliamento; Luci Danzanti 3/gn con Cha≥11)',
      'Flessuoso (+2 Acrobazia)'
    ],
    languages: ['Comune', 'Silvano'],
    bonusLanguages: ['Aklo', 'Celestiale', 'Elfico', 'Gnomesco', 'Tengu'],
    bonusLanguagesNote: 'Anche qualsiasi lingua umana',
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Duplicitous', replaces: ['Magia Kitsune'], description: '+2 Raggirare e Travestimento' },
      { name: 'Fast Shifter', replaces: ['Magia Kitsune'], description: 'Può Cambiare Forma come azione di movimento invece che standard' },
      { name: 'Gregarious', replaces: ['Flessuoso'], description: 'Le creature con atteggiamento migliorato ottengono –2 alle prove di Car contro il Kitsune per 24h' },
      { name: 'Keen Kitsune', replaces: ['Modificatori Caratteristiche'], description: '+2 Des e Int al posto di +2 Des e Cha' },
      { name: 'Multilingual', replaces: ['Flessuoso', 'Lingue'], description: 'Parla Comune, Silvano e una lingua etnica; apprende qualsiasi lingua con Linguistica' },
      { name: 'Skilled', replaces: ['Flessuoso', 'Magia Kitsune'], description: 'Ottiene 1 grado abilità extra al 1° livello e ad ogni livello successivo' },
      { name: 'Superior Shapeshifter', replaces: ['Magia Kitsune'], description: 'Ottiene Forma di Volpe come talento bonus al 1° livello' }
    ]
  },

  {
    id: 'marinide',
    name: 'Marinide',
    abilityMods: { str: 0, dex: 2, con: 2, int: 0, wis: 0, cha: 2 },
    size: 'Media',
    speed: 1.5,
    swimSpeed: 15,
    traits: [
      'Visione Crepuscolare',
      'Armatura Naturale (+2 CA)',
      'Anfibio (può respirare sia in acqua che in aria)',
      'Senza Gambe (non può essere Sbilanciato)'
    ],
    languages: ['Comune', 'Aquan'],
    bonusLanguages: ['Aboleth', 'Aklo', 'Draconico', 'Elfico', 'Silvano'],
    source: 'Advanced',
    alternativeTraits: [
      { name: 'Darkvision', replaces: ['Visione Crepuscolare'], description: 'Scurovisione 18m e Sensibilità alla Luce invece di Visione Crepuscolare' },
      { name: 'Seasinger', replaces: ['Visione Crepuscolare'], description: '+2 Intrattenere (canto); +1 CD incantesimi con componente verbale' },
      { name: 'Secret Magic', replaces: ['Velocità di Movimento'], description: '+1 CD Ammaliamento; (Car≥13) Parlare con i Creature Acquatiche a volontà' },
      { name: 'Strongtail', replaces: ['Velocità'], description: 'Velocità terrestre 4,5m; velocità nuoto 9m' },
      { name: 'Unexpected Ally', replaces: ['Visione Crepuscolare'], description: '+2 Diplomazia per migliorare l\'atteggiamento; +1 aiutare altro' }
    ]
  }

];
