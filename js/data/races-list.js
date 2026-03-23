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
    source: 'Core'
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
    source: 'Core'
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
    source: 'Core'
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
    source: 'Core'
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
    source: 'Core'
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
    source: 'Core'
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
    source: 'Core'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
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
    source: 'Advanced'
  }

];
