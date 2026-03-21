/**
 * skills-list.js
 * Lista statica di tutte le abilità di Pathfinder 1e (italiano).
 * Ogni voce: { id, name, ability, trainedOnly, armorCheckPenalty }
 *
 * Caricato come script globale → window.PF1_SKILLS
 */

const PF1_SKILLS = [
  // { id: 'acrobazia',  name: 'Acrobazia',  ability: 'dex', trainedOnly: false, acp: true },
  // TODO: lista completa ~35 abilità

  { id: 'acrobazia',          name: 'Acrobazia',                  ability: 'dex', trainedOnly: false, acp: true  },
  { id: 'addestrare_animali', name: 'Addestrare Animali',         ability: 'cha', trainedOnly: true,  acp: false },
  { id: 'artigianato',        name: 'Artigianato',                ability: 'int', trainedOnly: false, acp: false },
  { id: 'artista_fuga',       name: 'Artista della Fuga',         ability: 'dex', trainedOnly: false, acp: true  },
  { id: 'bluff',              name: 'Bluff',                      ability: 'cha', trainedOnly: false, acp: false },
  { id: 'cavalcare',          name: 'Cavalcare',                  ability: 'dex', trainedOnly: false, acp: true  },
  // Nota: Concentrazione NON è un'abilità in PF1 — è una prova (liv. inc. + mod car.)
  // Nota: Falsificare NON esiste in PF1 — è stata assorbita da Linguistica
  { id: 'conoscenze_arcane',  name: 'Conoscenze (arcane)',        ability: 'int', trainedOnly: true,  acp: false },
  { id: 'conoscenze_dunsioni',name: 'Conoscenze (dungeon)',       ability: 'int', trainedOnly: true,  acp: false },
  { id: 'conoscenze_geografia',name:'Conoscenze (geografia)',     ability: 'int', trainedOnly: true,  acp: false },
  { id: 'conoscenze_ingegneria',name:'Conoscenze (ingegneria)',   ability: 'int', trainedOnly: true,  acp: false },
  { id: 'conoscenze_storia',  name: 'Conoscenze (storia)',        ability: 'int', trainedOnly: true,  acp: false },
  { id: 'conoscenze_locale',  name: 'Conoscenze (locale)',        ability: 'int', trainedOnly: true,  acp: false },
  { id: 'conoscenze_natura',  name: 'Conoscenze (natura)',        ability: 'int', trainedOnly: true,  acp: false },
  { id: 'conoscenze_nobili',  name: 'Conoscenze (nobiltà)',       ability: 'int', trainedOnly: true,  acp: false },
  { id: 'conoscenze_piani',   name: 'Conoscenze (piani)',         ability: 'int', trainedOnly: true,  acp: false },
  { id: 'conoscenze_religione',name:'Conoscenze (religione)',     ability: 'int', trainedOnly: true,  acp: false },
  { id: 'diplomazia',         name: 'Diplomazia',                 ability: 'cha', trainedOnly: false, acp: false },
  { id: 'disattivare_cong',   name: 'Disattivare Congegni',       ability: 'dex', trainedOnly: true,  acp: false },
  { id: 'esibizione',         name: 'Esibizione',                 ability: 'cha', trainedOnly: false, acp: false },
  { id: 'furtivita',          name: 'Furtività',                  ability: 'dex', trainedOnly: false, acp: true  },
  { id: 'guarire',            name: 'Guarire',                    ability: 'wis', trainedOnly: false, acp: false },
  { id: 'illusionismo',       name: 'Illusionismo',               ability: 'cha', trainedOnly: false, acp: false },
  { id: 'intimidire',         name: 'Intimidire',                 ability: 'cha', trainedOnly: false, acp: false },
  { id: 'linguistica',        name: 'Linguistica',                ability: 'int', trainedOnly: true,  acp: false },
  { id: 'magia',              name: 'Magia',                      ability: 'int', trainedOnly: true,  acp: false },
  { id: 'nuotare',            name: 'Nuotare',                    ability: 'str', trainedOnly: false, acp: true  },
  { id: 'percezione',         name: 'Percezione',                 ability: 'wis', trainedOnly: false, acp: false },
  { id: 'professione',        name: 'Professione',                ability: 'wis', trainedOnly: true,  acp: false },
  { id: 'scalare',            name: 'Scalare',                    ability: 'str', trainedOnly: false, acp: true  },
  { id: 'senso_moti',         name: 'Senso dei Moti',             ability: 'wis', trainedOnly: false, acp: false },
  { id: 'sopravvivenza',      name: 'Sopravvivenza',              ability: 'wis', trainedOnly: false, acp: false },
  { id: 'sotterfugio',        name: 'Sotterfugio',                ability: 'dex', trainedOnly: false, acp: true  },
  { id: 'stimare',            name: 'Stimare',                    ability: 'int', trainedOnly: false, acp: false },
  { id: 'travestimento',      name: 'Travestimento',              ability: 'cha', trainedOnly: false, acp: false },
  { id: 'usare_ogm',          name: 'Usare Oggetti Magici',       ability: 'cha', trainedOnly: true,  acp: false },
  { id: 'volare',             name: 'Volare',                     ability: 'dex', trainedOnly: false, acp: true  },
];
