'use strict';
/**
 * equipment-db.js — PF1_EQUIPMENT_DB
 *
 * Archivio completo di equipaggiamento PF1: armi, armature, scudi, oggetti, magia.
 *
 * Schema comune:
 *   { id, name, nameEN, category, subcategory, weight, cost, source }
 *
 * Campi aggiuntivi per category='weapon':
 *   { weaponGroup, attackType, damage, damageS, critRange, critMult,
 *     damageType, twoHanded, range, special }
 *     weaponGroup : 'semplice' | 'marziale' | 'esotico' | 'da_fuoco'
 *     attackType  : 'mischia' | 'distanza'
 *     range       : portata in metri (0 = solo mischia)
 *     damage/damageS: dado danno taglia M / taglia S
 *     critRange   : stringa es. '20' | '19-20' | '18-20'
 *     critMult    : numero es. 2 | 3 | 4
 *     twoHanded   : bool
 *
 * Campi aggiuntivi per category='armor' | 'shield':
 *   { armorType, bonus, maxDex, acp, asf, speed }
 *     armorType : 'leggera' | 'media' | 'pesante' | 'scudo'
 *     bonus     : bonus CA
 *     maxDex    : valore massimo Des (null = nessun limite)
 *     acp       : penalità armatura (0 o negativo)
 *     asf       : % fallimento incantesimi arcani
 *     speed     : riduzione velocità in metri (0 = nessuna)
 */
const PF1_EQUIPMENT_DB = [

  // ══════════════════════════════════════════════════════════════════════════
  // ARMI SEMPLICI — SENZ'ARMI / LEGGERE
  // ══════════════════════════════════════════════════════════════════════════
  { id:'unarmed',           name:'Colpo Senz\'Armi',             nameEN:'Unarmed Strike',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d3', damageS:'1d2', critRange:'20', critMult:2,
    damageType:'C', twoHanded:false, range:0, weight:0, cost:'—', special:'non letale', source:'CRB' },

  { id:'gauntlet',          name:'Guanto d\'Arme',                nameEN:'Gauntlet',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d3', damageS:'1d2', critRange:'20', critMult:2,
    damageType:'C', twoHanded:false, range:0, weight:0.45, cost:'2 mo', special:'', source:'CRB' },

  { id:'spiked_gauntlet',   name:'Guanto d\'Arme Chiodato',      nameEN:'Spiked Gauntlet',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d4', damageS:'1d3', critRange:'20', critMult:2,
    damageType:'P', twoHanded:false, range:0, weight:0.45, cost:'5 mo', special:'', source:'CRB' },

  { id:'dagger',            name:'Pugnale',                       nameEN:'Dagger',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d4', damageS:'1d3', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:3, weight:0.45, cost:'2 mo', special:'', source:'CRB' },

  { id:'punching_dagger',   name:'Pugnale da Pugile',             nameEN:'Punching Dagger',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d4', damageS:'1d3', critRange:'20', critMult:3,
    damageType:'P', twoHanded:false, range:0, weight:0.45, cost:'2 mo', special:'', source:'CRB' },

  { id:'light_mace',        name:'Mazza Leggera',                 nameEN:'Light Mace',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'20', critMult:2,
    damageType:'C', twoHanded:false, range:0, weight:1.8, cost:'5 mo', special:'', source:'CRB' },

  { id:'sickle',            name:'Falcetto',                      nameEN:'Sickle',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'20', critMult:2,
    damageType:'T', twoHanded:false, range:0, weight:0.9, cost:'6 mo', special:'trip', source:'CRB' },

  { id:'battle_aspergillum',name:'Aspersorio da Battaglia',       nameEN:'Battle Aspergillum',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'20', critMult:2,
    damageType:'C', twoHanded:false, range:0, weight:2, cost:'5 mo', special:'', source:'CRB' },

  { id:'cestus',            name:'Cestus',                        nameEN:'Cestus',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d4', damageS:'1d3', critRange:'19-20', critMult:2,
    damageType:'C/P', twoHanded:false, range:0, weight:0.5, cost:'5 mo', special:'', source:'CRB' },

  // ── Semplici una mano ────────────────────────────────────────────────────
  { id:'club',              name:'Randello',                      nameEN:'Club',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'20', critMult:2,
    damageType:'C', twoHanded:false, range:3, weight:1.35, cost:'—', special:'', source:'CRB' },

  { id:'heavy_mace',        name:'Mazza Pesante',                 nameEN:'Heavy Mace',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:2,
    damageType:'C', twoHanded:false, range:0, weight:3.6, cost:'12 mo', special:'', source:'CRB' },

  { id:'morningstar',       name:'Morning Star',                  nameEN:'Morningstar',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:2,
    damageType:'C/P', twoHanded:false, range:0, weight:2.7, cost:'8 mo', special:'', source:'CRB' },

  { id:'shortspear',        name:'Lancia Corta',                  nameEN:'Shortspear',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'20', critMult:2,
    damageType:'P', twoHanded:false, range:6, weight:1.35, cost:'1 mo', special:'', source:'CRB' },

  // ── Semplici due mani ────────────────────────────────────────────────────
  { id:'quarterstaff',      name:'Bastone Ferrato',               nameEN:'Quarterstaff',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d6/1d6', damageS:'1d4/1d4', critRange:'20', critMult:2,
    damageType:'C', twoHanded:true, range:0, weight:1.8, cost:'—', special:'doppio', source:'CRB' },

  { id:'spear',             name:'Lancia',                        nameEN:'Spear',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'P', twoHanded:true, range:6, weight:2.7, cost:'2 mo', special:'brace', source:'CRB' },

  { id:'bayonet',           name:'Baionetta',                     nameEN:'Bayonet',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'20', critMult:2,
    damageType:'P', twoHanded:true, range:0, weight:0.5, cost:'5 mo', special:'', source:'CRB' },

  { id:'longspear',         name:'Lancia Lunga',                  nameEN:'Longspear',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'P', twoHanded:true, range:0, weight:4.5, cost:'5 mo', special:'portata, brace', source:'CRB' },

  { id:'greatclub',         name:'Randello Pesante',              nameEN:'Greatclub',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d10', damageS:'1d8', critRange:'20', critMult:2,
    damageType:'C', twoHanded:true, range:0, weight:3.6, cost:'5 mo', special:'', source:'CRB' },

  // ── Semplici a distanza ──────────────────────────────────────────────────
  { id:'dart',              name:'Dardo',                         nameEN:'Dart',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'distanza', damage:'1d4', damageS:'1d3', critRange:'20', critMult:2,
    damageType:'P', twoHanded:false, range:6, weight:0.23, cost:'5 mr', special:'', source:'CRB' },

  { id:'sling',             name:'Fionda',                        nameEN:'Sling',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'distanza', damage:'1d4', damageS:'1d3', critRange:'20', critMult:2,
    damageType:'C', twoHanded:false, range:15, weight:0, cost:'—', special:'', source:'CRB' },

  { id:'light_crossbow',    name:'Balestra Leggera',              nameEN:'Light Crossbow',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P', twoHanded:true, range:24, weight:1.8, cost:'35 mo', special:'', source:'CRB' },

  { id:'heavy_crossbow',    name:'Balestra Pesante',              nameEN:'Heavy Crossbow',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'distanza', damage:'1d10', damageS:'1d8', critRange:'19-20', critMult:2,
    damageType:'P', twoHanded:true, range:36, weight:3.6, cost:'50 mo', special:'', source:'CRB' },

  { id:'blowgun',           name:'Cerbottana',                    nameEN:'Blowgun',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'distanza', damage:'1d2', damageS:'1', critRange:'20', critMult:2,
    damageType:'P', twoHanded:false, range:6, weight:0.5, cost:'2 mo', special:'', source:'CRB' },

  { id:'javelin',           name:'Giavellotto',                   nameEN:'Javelin',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'distanza', damage:'1d6', damageS:'1d4', critRange:'20', critMult:2,
    damageType:'P', twoHanded:false, range:9, weight:0.9, cost:'1 mo', special:'', source:'CRB' },

  // ══════════════════════════════════════════════════════════════════════════
  // ARMI MARZIALI — LEGGERE
  // ══════════════════════════════════════════════════════════════════════════
  { id:'handaxe',           name:'Ascia',                         nameEN:'Handaxe',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'20', critMult:3,
    damageType:'T', twoHanded:false, range:0, weight:1.35, cost:'6 mo', special:'', source:'CRB' },

  { id:'kukri',             name:'Kukri',                         nameEN:'Kukri',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d4', damageS:'1d3', critRange:'18-20', critMult:2,
    damageType:'T', twoHanded:false, range:0, weight:0.9, cost:'8 mo', special:'', source:'CRB' },

  { id:'light_hammer',      name:'Martello Leggero',              nameEN:'Light Hammer',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d4', damageS:'1d3', critRange:'20', critMult:2,
    damageType:'C', twoHanded:false, range:6, weight:0.9, cost:'1 mo', special:'', source:'CRB' },

  { id:'light_pick',        name:'Piccone Leggero',               nameEN:'Light Pick',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d4', damageS:'1d3', critRange:'20', critMult:4,
    damageType:'P', twoHanded:false, range:0, weight:1.35, cost:'4 mo', special:'', source:'CRB' },

  { id:'sap',               name:'Manganello',                    nameEN:'Sap',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'20', critMult:2,
    damageType:'C', twoHanded:false, range:0, weight:0.9, cost:'1 mo', special:'non letale', source:'CRB' },

  { id:'shortsword',        name:'Spada Corta',                   nameEN:'Short Sword',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'19-20', critMult:2,
    damageType:'P', twoHanded:false, range:0, weight:0.9, cost:'10 mo', special:'', source:'CRB' },

  { id:'gladius',           name:'Gladio',                        nameEN:'Gladius',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:0, weight:1.5, cost:'15 mo', special:'', source:'CRB' },

  { id:'war_razor',         name:'Rasoio da Guerra',              nameEN:'War Razor',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d4', damageS:'1d3', critRange:'19-20', critMult:2,
    damageType:'T', twoHanded:false, range:0, weight:0.5, cost:'8 mo', special:'', source:'CRB' },

  { id:'starknife',         name:'Astrum',                        nameEN:'Starknife',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d4', damageS:'1d3', critRange:'20', critMult:3,
    damageType:'P', twoHanded:false, range:6, weight:1.35, cost:'24 mo', special:'', source:'CRB' },

  { id:'throwing_axe',      name:'Ascia da Lancio',               nameEN:'Throwing Axe',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'20', critMult:2,
    damageType:'T', twoHanded:false, range:3, weight:0.9, cost:'8 mo', special:'', source:'CRB' },

  // ── Marziali una mano ────────────────────────────────────────────────────
  { id:'battleaxe',         name:'Ascia da Battaglia',            nameEN:'Battleaxe',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'T', twoHanded:false, range:0, weight:2.7, cost:'10 mo', special:'', source:'CRB' },

  { id:'flail',             name:'Mazzafrusto Leggero',           nameEN:'Light Flail',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:2,
    damageType:'C', twoHanded:false, range:0, weight:2.25, cost:'8 mo', special:'disarmare, trip', source:'CRB' },

  { id:'longsword',         name:'Spada Lunga',                   nameEN:'Longsword',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'T', twoHanded:false, range:0, weight:1.8, cost:'15 mo', special:'', source:'CRB' },

  { id:'heavy_pick',        name:'Piccone Pesante',               nameEN:'Heavy Pick',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'20', critMult:4,
    damageType:'P', twoHanded:false, range:0, weight:2.7, cost:'8 mo', special:'', source:'CRB' },

  { id:'rapier',            name:'Stocco',                        nameEN:'Rapier',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'18-20', critMult:2,
    damageType:'P', twoHanded:false, range:0, weight:0.9, cost:'20 mo', special:'', source:'CRB' },

  { id:'scimitar',          name:'Scimitarra',                    nameEN:'Scimitar',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'18-20', critMult:2,
    damageType:'T', twoHanded:false, range:0, weight:1.8, cost:'15 mo', special:'', source:'CRB' },

  { id:'trident',           name:'Tridente',                      nameEN:'Trident',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:2,
    damageType:'P', twoHanded:false, range:3, weight:1.8, cost:'15 mo', special:'brace', source:'CRB' },

  { id:'warhammer',         name:'Martello da Guerra',            nameEN:'Warhammer',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'C', twoHanded:false, range:0, weight:2.25, cost:'12 mo', special:'', source:'CRB' },

  { id:'cutlass',           name:'Sciabola d\'Abbordaggio',       nameEN:'Cutlass',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'18-20', critMult:2,
    damageType:'T', twoHanded:false, range:0, weight:2, cost:'15 mo', special:'', source:'APG' },

  { id:'whip',              name:'Frusta',                        nameEN:'Whip',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'1d3', damageS:'1d2', critRange:'20', critMult:2,
    damageType:'T', twoHanded:false, range:0, weight:0.9, cost:'1 mo',
    special:'disarmare, trip, portata, non letale', source:'CRB' },

  // ── Marziali due mani ────────────────────────────────────────────────────
  { id:'falchion',          name:'Falchion',                      nameEN:'Falchion',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'2d4', damageS:'1d6', critRange:'18-20', critMult:2,
    damageType:'T', twoHanded:true, range:0, weight:3.6, cost:'75 mo', special:'', source:'CRB' },

  { id:'glaive',            name:'Falcione',                      nameEN:'Glaive',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d10', damageS:'1d8', critRange:'20', critMult:3,
    damageType:'T', twoHanded:true, range:0, weight:4.5, cost:'8 mo', special:'portata', source:'CRB' },

  { id:'greataxe',          name:'Ascia Bipenne',                 nameEN:'Greataxe',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d12', damageS:'1d10', critRange:'20', critMult:3,
    damageType:'T', twoHanded:true, range:0, weight:5.4, cost:'20 mo', special:'', source:'CRB' },

  { id:'heavy_flail',       name:'Mazzafrusto Pesante',           nameEN:'Heavy Flail',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d10', damageS:'1d8', critRange:'19-20', critMult:2,
    damageType:'C', twoHanded:true, range:0, weight:4.5, cost:'15 mo', special:'disarmare, trip', source:'CRB' },

  { id:'greatsword',        name:'Spadone',                       nameEN:'Greatsword',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'2d6', damageS:'1d10', critRange:'19-20', critMult:2,
    damageType:'T', twoHanded:true, range:0, weight:3.6, cost:'50 mo', special:'', source:'CRB' },

  { id:'guisarme',          name:'Guisarme',                      nameEN:'Guisarme',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'2d4', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'T', twoHanded:true, range:0, weight:5.4, cost:'9 mo', special:'portata, trip', source:'CRB' },

  { id:'halberd',           name:'Alabarda',                      nameEN:'Halberd',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d10', damageS:'1d8', critRange:'20', critMult:3,
    damageType:'P/T', twoHanded:true, range:0, weight:5.4, cost:'10 mo', special:'trip, brace', source:'CRB' },

  { id:'lance',             name:'Lancia da Cavaliere',           nameEN:'Lance',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'P', twoHanded:true, range:0, weight:4.5, cost:'10 mo', special:'portata', source:'CRB' },

  { id:'ranseur',           name:'Corsesca',                      nameEN:'Ranseur',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'2d4', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'P', twoHanded:true, range:0, weight:5.4, cost:'10 mo', special:'portata, disarmare', source:'CRB' },

  { id:'scythe',            name:'Falce',                         nameEN:'Scythe',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'2d4', damageS:'1d6', critRange:'20', critMult:4,
    damageType:'P/T', twoHanded:true, range:0, weight:4.5, cost:'18 mo', special:'trip', source:'CRB' },

  { id:'earth_breaker',     name:'Spaccaterra',                   nameEN:'Earth Breaker',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'2d6', damageS:'1d10', critRange:'20', critMult:3,
    damageType:'C', twoHanded:true, range:0, weight:7, cost:'40 mo', special:'', source:'APG' },

  { id:'bardiche',          name:'Berdica',                       nameEN:'Bardiche',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d10', damageS:'1d8', critRange:'19-20', critMult:2,
    damageType:'T', twoHanded:true, range:0, weight:7, cost:'13 mo', special:'portata', source:'APG' },

  { id:'bec_de_corbin',     name:'Bec de Corbin',                 nameEN:'Bec de Corbin',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d10', damageS:'1d8', critRange:'20', critMult:3,
    damageType:'C/P', twoHanded:true, range:0, weight:6, cost:'15 mo', special:'portata', source:'APG' },

  { id:'bill',              name:'Roncone',                       nameEN:'Bill',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'T', twoHanded:true, range:0, weight:5.5, cost:'11 mo', special:'portata', source:'APG' },

  // ── Marziali a distanza ──────────────────────────────────────────────────
  { id:'pilum',             name:'Pilum',                         nameEN:'Pilum',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'20', critMult:2,
    damageType:'P', twoHanded:false, range:6, weight:2, cost:'5 mo', special:'', source:'CRB' },

  { id:'chakram',           name:'Chakram',                       nameEN:'Chakram',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'20', critMult:2,
    damageType:'T', twoHanded:false, range:9, weight:0.5, cost:'1 mo', special:'', source:'CRB' },

  { id:'shortbow',          name:'Arco Corto',                    nameEN:'Shortbow',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'distanza', damage:'1d6', damageS:'1d4', critRange:'20', critMult:3,
    damageType:'P', twoHanded:true, range:18, weight:0.9, cost:'30 mo', special:'', source:'CRB' },

  { id:'comp_shortbow',     name:'Arco Corto Composito',          nameEN:'Composite Shortbow',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'distanza', damage:'1d6', damageS:'1d4', critRange:'20', critMult:3,
    damageType:'P', twoHanded:true, range:21, weight:0.9, cost:'75 mo', special:'', source:'CRB' },

  { id:'longbow',           name:'Arco Lungo',                    nameEN:'Longbow',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'P', twoHanded:true, range:30, weight:1.35, cost:'75 mo', special:'', source:'CRB' },

  { id:'comp_longbow',      name:'Arco Lungo Composito',          nameEN:'Composite Longbow',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'P', twoHanded:true, range:33, weight:1.35, cost:'100 mo', special:'', source:'CRB' },

  // ══════════════════════════════════════════════════════════════════════════
  // ARMI ESOTICHE
  // ══════════════════════════════════════════════════════════════════════════
  { id:'kama',              name:'Kama',                          nameEN:'Kama',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'20', critMult:2,
    damageType:'T', twoHanded:false, range:0, weight:0.9, cost:'2 mo', special:'trip', source:'CRB' },

  { id:'nunchaku',          name:'Nunchaku',                      nameEN:'Nunchaku',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'20', critMult:2,
    damageType:'C', twoHanded:false, range:0, weight:0.9, cost:'2 mo', special:'disarmare', source:'CRB' },

  { id:'sai',               name:'Sai',                           nameEN:'Sai',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'1d4', damageS:'1d3', critRange:'20', critMult:2,
    damageType:'C', twoHanded:false, range:3, weight:0.45, cost:'1 mo', special:'disarmare', source:'CRB' },

  { id:'siangham',          name:'Siangham',                      nameEN:'Siangham',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'20', critMult:2,
    damageType:'P', twoHanded:false, range:0, weight:0.45, cost:'3 mo', special:'', source:'CRB' },

  { id:'wakizashi',         name:'Wakizashi',                     nameEN:'Wakizashi',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'18-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:0, weight:1, cost:'35 mo', special:'letale', source:'UC' },

  { id:'shuriken',          name:'Shuriken (x5)',                 nameEN:'Shuriken (x5)',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'distanza', damage:'1', damageS:'1', critRange:'20', critMult:2,
    damageType:'P', twoHanded:false, range:3, weight:0.25, cost:'1 mo', special:'', source:'CRB' },

  { id:'bastard_sword',     name:'Spada Bastarda',                nameEN:'Bastard Sword',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'1d10', damageS:'1d8', critRange:'19-20', critMult:2,
    damageType:'T', twoHanded:false, range:0, weight:2.7, cost:'35 mo', special:'', source:'CRB' },

  { id:'falcata',           name:'Falcata',                       nameEN:'Falcata',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:3,
    damageType:'T', twoHanded:false, range:0, weight:2, cost:'18 mo', special:'', source:'APG' },

  { id:'katana',            name:'Katana',                        nameEN:'Katana',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'18-20', critMult:2,
    damageType:'T', twoHanded:false, range:0, weight:3, cost:'50 mo', special:'letale', source:'UC' },

  { id:'khopesh',           name:'Khopesh',                       nameEN:'Khopesh',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'T', twoHanded:false, range:0, weight:4, cost:'20 mo', special:'sbilanciare', source:'APG' },

  { id:'dwarven_waraxe',    name:'Ascia da Guerra Nanica',        nameEN:'Dwarven Waraxe',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'1d10', damageS:'1d8', critRange:'20', critMult:3,
    damageType:'T', twoHanded:false, range:0, weight:3.6, cost:'30 mo', special:'', source:'CRB' },

  { id:'elven_curve_blade', name:'Sciabola Elfica',               nameEN:'Elven Curve Blade',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'1d10', damageS:'1d8', critRange:'18-20', critMult:2,
    damageType:'T', twoHanded:true, range:0, weight:3.15, cost:'80 mo', special:'', source:'CRB' },

  { id:'dire_flail',        name:'Doppio Flagello',               nameEN:'Dire Flail',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'1d8/1d8', damageS:'1d6/1d6', critRange:'20', critMult:2,
    damageType:'C', twoHanded:true, range:0, weight:4.5, cost:'90 mo', special:'disarmare, trip, doppio', source:'CRB' },

  { id:'two_bladed_sword',  name:'Spada a Due Lame',              nameEN:'Two-Bladed Sword',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'1d8/1d8', damageS:'1d6/1d6', critRange:'19-20', critMult:2,
    damageType:'T', twoHanded:true, range:0, weight:5, cost:'100 mo', special:'doppio', source:'CRB' },

  { id:'halfling_sling_staff', name:'Bastone Fionda Halfling',    nameEN:'Halfling Sling Staff',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'C', twoHanded:true, range:24, weight:1.5, cost:'20 mo', special:'', source:'APG' },

  { id:'bola',              name:'Bolas',                         nameEN:'Bolas',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'distanza', damage:'1d4', damageS:'1d3', critRange:'20', critMult:2,
    damageType:'C', twoHanded:false, range:3, weight:1, cost:'5 mo', special:'non letale, sbilanciare', source:'CRB' },

  { id:'dwarven_urgrosh',   name:'Urgrosh Nanico',                nameEN:'Dwarven Urgrosh',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'1d8/1d6', damageS:'1d6/1d4', critRange:'20', critMult:3,
    damageType:'P/T', twoHanded:true, range:0, weight:6, cost:'50 mo', special:'doppio, brace', source:'CRB' },

  { id:'gnome_hooked',      name:'Martello ad Uncino Gnomico',    nameEN:'Gnome Hooked Hammer',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'1d6/1d4', damageS:'1d4/1d3', critRange:'20', critMult:3,
    damageType:'C/P', twoHanded:true, range:0, weight:2.7, cost:'20 mo', special:'trip, brace, doppio', source:'CRB' },

  { id:'orc_double_axe',    name:'Doppia Ascia Orchesca',         nameEN:'Orc Double Axe',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'1d8/1d8', damageS:'1d6/1d6', critRange:'20', critMult:3,
    damageType:'T', twoHanded:true, range:0, weight:6.75, cost:'60 mo', special:'doppio', source:'CRB' },

  { id:'spiked_chain',      name:'Catena Chiodata',               nameEN:'Spiked Chain',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'mischia', damage:'2d4', damageS:'1d6', critRange:'20', critMult:2,
    damageType:'P', twoHanded:true, range:0, weight:4.5, cost:'25 mo', special:'disarmare, trip, portata', source:'CRB' },

  { id:'net',               name:'Rete',                          nameEN:'Net',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'distanza', damage:'—', damageS:'—', critRange:'20', critMult:2,
    damageType:'—', twoHanded:false, range:3, weight:4.5, cost:'20 mo', special:'impigliare', source:'CRB' },

  { id:'hand_crossbow',     name:'Balestra a Mano',               nameEN:'Hand Crossbow',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'distanza', damage:'1d4', damageS:'1d3', critRange:'19-20', critMult:2,
    damageType:'P', twoHanded:false, range:9, weight:0.9, cost:'100 mo', special:'', source:'CRB' },

  { id:'rep_heavy_xbow',    name:'Balestra Pesante a Ripetizione', nameEN:'Repeating Heavy Crossbow',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'distanza', damage:'1d10', damageS:'1d8', critRange:'19-20', critMult:2,
    damageType:'P', twoHanded:true, range:36, weight:5.4, cost:'400 mo', special:'', source:'CRB' },

  { id:'rep_light_xbow',    name:'Balestra Leggera a Ripetizione', nameEN:'Repeating Light Crossbow',
    category:'weapon', subcategory:'esotico', weaponGroup:'esotico',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P', twoHanded:true, range:24, weight:2.7, cost:'250 mo', special:'', source:'CRB' },

  // ══════════════════════════════════════════════════════════════════════════
  // ARMI DA FUOCO (Ultimate Combat)
  // ══════════════════════════════════════════════════════════════════════════
  { id:'pistol',            name:'Pistola',                       nameEN:'Pistol',
    category:'weapon', subcategory:'da_fuoco', weaponGroup:'da_fuoco',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'20', critMult:4,
    damageType:'P', twoHanded:false, range:6, weight:1.8, cost:'1000 mo', special:'fuoco, caricamento lento', source:'UC' },

  { id:'musket',            name:'Moschetto',                     nameEN:'Musket',
    category:'weapon', subcategory:'da_fuoco', weaponGroup:'da_fuoco',
    attackType:'distanza', damage:'1d12', damageS:'1d10', critRange:'20', critMult:4,
    damageType:'P/C', twoHanded:true, range:12, weight:4.05, cost:'1500 mo', special:'fuoco, caricamento lento', source:'UC' },

  { id:'blunderbuss',       name:'Trombone',                      nameEN:'Blunderbuss',
    category:'weapon', subcategory:'da_fuoco', weaponGroup:'da_fuoco',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'20', critMult:2,
    damageType:'P', twoHanded:true, range:3, weight:3.6, cost:'2000 mo', special:'fuoco, cono 6m', source:'UC' },

  { id:'pepperbox',         name:'Pepperbox',                     nameEN:'Pepperbox',
    category:'weapon', subcategory:'da_fuoco', weaponGroup:'da_fuoco',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'20', critMult:4,
    damageType:'P', twoHanded:false, range:6, weight:1.8, cost:'3000 mo', special:'fuoco, cilindro 6 colpi', source:'UC' },

  { id:'double_pistol',     name:'Pistola a Doppia Canna',        nameEN:'Double-Barreled Pistol',
    category:'weapon', subcategory:'da_fuoco', weaponGroup:'da_fuoco',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'20', critMult:4,
    damageType:'P', twoHanded:false, range:6, weight:1.8, cost:'1750 mo', special:'fuoco, doppia canna', source:'UC' },

  // ══════════════════════════════════════════════════════════════════════════
  // ARMATURE LEGGERE
  // ══════════════════════════════════════════════════════════════════════════
  { id:'padded',            name:'Armatura Imbottita',            nameEN:'Padded Armor',
    category:'armor', subcategory:'leggera', armorType:'leggera',
    bonus:1, maxDex:8, acp:0, asf:5, speed:0,
    weight:5, cost:'5 mo', source:'CRB' },

  { id:'leather',           name:'Armatura di Cuoio',             nameEN:'Leather Armor',
    category:'armor', subcategory:'leggera', armorType:'leggera',
    bonus:2, maxDex:6, acp:0, asf:10, speed:0,
    weight:7.5, cost:'10 mo', source:'CRB' },

  { id:'studded_leather',   name:'Armatura di Cuoio Borchiato',   nameEN:'Studded Leather',
    category:'armor', subcategory:'leggera', armorType:'leggera',
    bonus:3, maxDex:5, acp:-1, asf:15, speed:0,
    weight:10, cost:'25 mo', source:'CRB' },

  { id:'chain_shirt',       name:'Giaco di Maglia',               nameEN:'Chain Shirt',
    category:'armor', subcategory:'leggera', armorType:'leggera',
    bonus:4, maxDex:4, acp:-2, asf:20, speed:0,
    weight:12.5, cost:'100 mo', source:'CRB' },

  // ══════════════════════════════════════════════════════════════════════════
  // ARMATURE MEDIE
  // ══════════════════════════════════════════════════════════════════════════
  { id:'hide',              name:'Armatura di Pelle',             nameEN:'Hide Armor',
    category:'armor', subcategory:'media', armorType:'media',
    bonus:4, maxDex:4, acp:-3, asf:20, speed:3,
    weight:12.5, cost:'15 mo', source:'CRB' },

  { id:'scale_mail',        name:'Corazza a Scaglie',             nameEN:'Scale Mail',
    category:'armor', subcategory:'media', armorType:'media',
    bonus:5, maxDex:3, acp:-4, asf:25, speed:3,
    weight:15, cost:'50 mo', source:'CRB' },

  { id:'chain_mail',        name:'Cotta di Maglia',               nameEN:'Chain Mail',
    category:'armor', subcategory:'media', armorType:'media',
    bonus:6, maxDex:2, acp:-5, asf:30, speed:3,
    weight:20, cost:'150 mo', source:'CRB' },

  { id:'breastplate',       name:'Corazza di Piastre',            nameEN:'Breastplate',
    category:'armor', subcategory:'media', armorType:'media',
    bonus:6, maxDex:3, acp:-4, asf:25, speed:3,
    weight:15, cost:'200 mo', source:'CRB' },

  { id:'armored_coat',      name:'Manto Corazzato',               nameEN:'Armored Coat',
    category:'armor', subcategory:'media', armorType:'media',
    bonus:4, maxDex:3, acp:-2, asf:20, speed:3,
    weight:10, cost:'50 mo', source:'APG' },

  // ══════════════════════════════════════════════════════════════════════════
  // ARMATURE PESANTI
  // ══════════════════════════════════════════════════════════════════════════
  { id:'splint_mail',       name:'Corazza a Strisce',             nameEN:'Splint Mail',
    category:'armor', subcategory:'pesante', armorType:'pesante',
    bonus:7, maxDex:0, acp:-7, asf:40, speed:3,
    weight:22.5, cost:'200 mo', source:'CRB' },

  { id:'banded_mail',       name:'Corazza di Bande',              nameEN:'Banded Mail',
    category:'armor', subcategory:'pesante', armorType:'pesante',
    bonus:7, maxDex:1, acp:-6, asf:35, speed:3,
    weight:17.5, cost:'250 mo', source:'CRB' },

  { id:'half_plate',        name:'Mezza Armatura',                nameEN:'Half-Plate',
    category:'armor', subcategory:'pesante', armorType:'pesante',
    bonus:8, maxDex:0, acp:-7, asf:40, speed:3,
    weight:25, cost:'600 mo', source:'CRB' },

  { id:'full_plate',        name:'Armatura Completa',             nameEN:'Full Plate',
    category:'armor', subcategory:'pesante', armorType:'pesante',
    bonus:9, maxDex:1, acp:-6, asf:35, speed:3,
    weight:25, cost:'1500 mo', source:'CRB' },

  // ══════════════════════════════════════════════════════════════════════════
  // SCUDI
  // ══════════════════════════════════════════════════════════════════════════
  { id:'buckler',           name:'Buckler',                       nameEN:'Buckler',
    category:'shield', subcategory:'scudo', armorType:'scudo',
    bonus:1, maxDex:null, acp:-1, asf:5, speed:0,
    weight:2.5, cost:'5 mo', source:'CRB' },

  { id:'lt_wooden_shield',  name:'Scudo Leggero di Legno',        nameEN:'Light Wooden Shield',
    category:'shield', subcategory:'scudo', armorType:'scudo',
    bonus:1, maxDex:null, acp:-1, asf:5, speed:0,
    weight:2.5, cost:'3 mo', source:'CRB' },

  { id:'lt_steel_shield',   name:'Scudo Leggero di Metallo',      nameEN:'Light Steel Shield',
    category:'shield', subcategory:'scudo', armorType:'scudo',
    bonus:1, maxDex:null, acp:-1, asf:5, speed:0,
    weight:3, cost:'9 mo', source:'CRB' },

  { id:'hv_wooden_shield',  name:'Scudo Pesante di Legno',        nameEN:'Heavy Wooden Shield',
    category:'shield', subcategory:'scudo', armorType:'scudo',
    bonus:2, maxDex:null, acp:-2, asf:15, speed:0,
    weight:5, cost:'7 mo', source:'CRB' },

  { id:'hv_steel_shield',   name:'Scudo Pesante di Metallo',      nameEN:'Heavy Steel Shield',
    category:'shield', subcategory:'scudo', armorType:'scudo',
    bonus:2, maxDex:null, acp:-2, asf:15, speed:0,
    weight:7.5, cost:'20 mo', source:'CRB' },

  { id:'tower_shield',      name:'Scudo Torre',                   nameEN:'Tower Shield',
    category:'shield', subcategory:'scudo', armorType:'scudo',
    bonus:4, maxDex:2, acp:-10, asf:50, speed:0,
    weight:22.5, cost:'30 mo', source:'CRB' },

  // ══════════════════════════════════════════════════════════════════════════
  // OGGETTI AVVENTURA (gear)
  // ══════════════════════════════════════════════════════════════════════════
  { id:'backpack',          name:'Zaino',                         nameEN:'Backpack',
    category:'gear', subcategory:'avventura', weight:0.9, cost:'2 mo', source:'CRB' },

  { id:'bedroll',           name:'Giaciglio',                      nameEN:'Bedroll',
    category:'gear', subcategory:'avventura', weight:2.25, cost:'1 ma', source:'CRB' },

  { id:'blanket',           name:'Coperta',                       nameEN:'Blanket',
    category:'gear', subcategory:'avventura', weight:1.35, cost:'5 ma', source:'CRB' },

  { id:'rope_hemp',         name:'Corda di Canapa (15 m)',        nameEN:'Rope, Hemp (50 ft)',
    category:'gear', subcategory:'avventura', weight:4.5, cost:'1 mo', source:'CRB' },

  { id:'rope_silk',         name:'Corda di Seta (15 m)',          nameEN:'Rope, Silk (50 ft)',
    category:'gear', subcategory:'avventura', weight:2.25, cost:'10 mo', source:'CRB' },

  { id:'torch',             name:'Torcia',                        nameEN:'Torch',
    category:'gear', subcategory:'avventura', weight:0.45, cost:'1 mr', source:'CRB' },

  { id:'lantern_hooded',    name:'Lanterna a Scodello',           nameEN:'Lantern, Hooded',
    category:'gear', subcategory:'avventura', weight:0.9, cost:'7 mo', source:'CRB' },

  { id:'lantern_bullseye',  name:'Lanterna a Farfalla',           nameEN:'Lantern, Bullseye',
    category:'gear', subcategory:'avventura', weight:1.35, cost:'12 mo', source:'CRB' },

  { id:'oil',               name:'Olio (500 ml)',                 nameEN:'Oil (1 pint)',
    category:'gear', subcategory:'avventura', weight:0.45, cost:'1 ma', source:'CRB' },

  { id:'rations',           name:'Razioni Giornaliere',           nameEN:'Trail Rations (1 day)',
    category:'gear', subcategory:'avventura', weight:0.45, cost:'5 ma', source:'CRB' },

  { id:'waterskin',         name:'Otre',                          nameEN:'Waterskin',
    category:'gear', subcategory:'avventura', weight:1.8, cost:'1 mo', source:'CRB' },

  { id:'grappling_hook',    name:'Rampino',                       nameEN:'Grappling Hook',
    category:'gear', subcategory:'avventura', weight:1.8, cost:'1 mo', source:'CRB' },

  { id:'crowbar',           name:'Piede di Porco',                nameEN:'Crowbar',
    category:'gear', subcategory:'avventura', weight:2.25, cost:'2 mo', source:'CRB' },

  { id:'shovel',            name:'Vanga',                         nameEN:'Shovel or Spade',
    category:'gear', subcategory:'avventura', weight:3.6, cost:'2 mo', source:'CRB' },

  { id:'flint_steel',       name:'Acciarino e Pietra Focaia',     nameEN:'Flint and Steel',
    category:'gear', subcategory:'avventura', weight:0, cost:'1 mo', source:'CRB' },

  { id:'tindertwig',        name:'Esca (unità)',                  nameEN:'Tindertwig',
    category:'gear', subcategory:'avventura', weight:0, cost:'1 mo', source:'CRB' },

  { id:'candela',           name:'Candela',                       nameEN:'Candle',
    category:'gear', subcategory:'avventura', weight:0, cost:'1 mr', source:'CRB' },

  { id:'sunrod',            name:'Asta Luminosa',                 nameEN:'Sunrod',
    category:'gear', subcategory:'avventura', weight:0.45, cost:'2 mo', source:'CRB' },

  { id:'smokestick',        name:'Bastoncino di Fumo',            nameEN:'Smokestick',
    category:'gear', subcategory:'avventura', weight:0.23, cost:'20 mo', source:'CRB' },

  { id:'mirror',            name:'Specchio d\'Acciaio',           nameEN:'Mirror, Small Steel',
    category:'gear', subcategory:'avventura', weight:0.23, cost:'10 mo', source:'CRB' },

  { id:'chalk',             name:'Gesso (x10)',                   nameEN:'Chalk (10 pieces)',
    category:'gear', subcategory:'avventura', weight:0, cost:'1 mr', source:'CRB' },

  { id:'parchment',         name:'Pergamena (foglio)',            nameEN:'Parchment (sheet)',
    category:'gear', subcategory:'avventura', weight:0, cost:'2 ma', source:'CRB' },

  { id:'ink',               name:'Inchiostro (30 ml)',            nameEN:'Ink (1 oz)',
    category:'gear', subcategory:'avventura', weight:0, cost:'8 mo', source:'CRB' },

  { id:'ink_pen',           name:'Penna da Scrivere',             nameEN:'Inkpen',
    category:'gear', subcategory:'avventura', weight:0, cost:'1 ma', source:'CRB' },

  { id:'sealing_wax',       name:'Ceralacca',                     nameEN:'Sealing Wax',
    category:'gear', subcategory:'avventura', weight:0.45, cost:'1 mo', source:'CRB' },

  { id:'signal_whistle',    name:'Fischietto di Segnalazione',    nameEN:'Signal Whistle',
    category:'gear', subcategory:'avventura', weight:0, cost:'8 mr', source:'CRB' },

  { id:'caltrops',          name:'Triboli',                       nameEN:'Caltrops',
    category:'gear', subcategory:'avventura', weight:0.9, cost:'1 mo', source:'CRB' },

  { id:'manacles',          name:'Manette',                       nameEN:'Manacles',
    category:'gear', subcategory:'avventura', weight:0.9, cost:'15 mo', source:'CRB' },

  { id:'manacles_mw',       name:'Manette di Fattura Sopraffina', nameEN:'Masterwork Manacles',
    category:'gear', subcategory:'avventura', weight:0.9, cost:'50 mo', source:'CRB' },

  { id:'piton',             name:'Piton (x10)',                   nameEN:'Piton (x10)',
    category:'gear', subcategory:'avventura', weight:2.25, cost:'1 mo', source:'CRB' },

  { id:'everburning_torch', name:'Torcia Perenne',                nameEN:'Everburning Torch',
    category:'gear', subcategory:'avventura', weight:0.45, cost:'110 mo', source:'CRB' },
  { id:'agrifoglio_vischio',  name:'Agrifoglio e Vischio',          nameEN:'Holly and Mistletoe',
    category:'gear', subcategory:'avventura', weight:0, cost:'1 mo', source:'CRB' },

  { id:'borsa_componenti',    name:'Borsa per Componenti di Incantesimi', nameEN:'Spell Component Pouch',
    category:'gear', subcategory:'avventura', weight:1, cost:'5 mo', source:'CRB' },

  { id:'borsa_impermeabile',  name:'Borsa Impermeabile',            nameEN:'Waterproof Bag',
    category:'gear', subcategory:'avventura', weight:0.25, cost:'5 ma', source:'UE' },

  { id:'catena',              name:'Catena (3 m)',                   nameEN:'Chain (3 m)',
    category:'gear', subcategory:'avventura', weight:1, cost:'30 mo', source:'CRB' },

  { id:'lampada',             name:'Lampada',                        nameEN:'Lamp',
    category:'gear', subcategory:'avventura', weight:0.5, cost:'1 ma', source:'CRB' },

  { id:'libro_incantesimi',   name:'Libro degli Incantesimi',        nameEN:'Spellbook',
    category:'gear', subcategory:'avventura', weight:1.5, cost:'15 mo', source:'CRB' },

  { id:'sapone',              name:'Sapone',                         nameEN:'Soap',
    category:'gear', subcategory:'avventura', weight:0.25, cost:'1 mr', source:'UE' },

  { id:'scala_pioli',         name:'Scala a Pioli (3 m)',            nameEN:'Ladder (3m)',
    category:'gear', subcategory:'avventura', weight:10, cost:'2 ma', source:'CRB' },

  { id:'simbolo_sacro_legno', name:'Simbolo Sacro di Legno',         nameEN:'Holy Symbol, Wooden',
    category:'gear', subcategory:'avventura', weight:0, cost:'1 mo', source:'CRB' },

  { id:'simbolo_sacro_ferro', name:'Simbolo Sacro di Ferro',         nameEN:'Holy Symbol, Iron',
    category:'gear', subcategory:'avventura', weight:0.5, cost:'5 mo', source:'UE' },

  { id:'simbolo_sacro_argento', name:"Simbolo Sacro d'Argento",      nameEN:'Holy Symbol, Silver',
    category:'gear', subcategory:'avventura', weight:0.5, cost:'25 mo', source:'CRB' },

  { id:'simbolo_sacro_oro',   name:"Simbolo Sacro d'Oro",            nameEN:'Holy Symbol, Gold',
    category:'gear', subcategory:'avventura', weight:0.5, cost:'100 mo', source:'UE' },

  { id:'simbolo_sacrilego_legno', name:'Simbolo Sacrilego di Legno', nameEN:'Unholy Symbol, Wooden',
    category:'gear', subcategory:'avventura', weight:0, cost:'1 mo', source:'CRB' },

  { id:'simbolo_sacrilego_argento', name:"Simbolo Sacrilego d'Argento", nameEN:'Unholy Symbol, Silver',
    category:'gear', subcategory:'avventura', weight:0.5, cost:'25 mo', source:'CRB' },

  { id:'tenda_piccola',       name:'Tenda (piccola)',                 nameEN:'Tent, Small',
    category:'gear', subcategory:'avventura', weight:10, cost:'10 mo', source:'CRB' },

  { id:'tenda_media',         name:'Tenda (media)',                   nameEN:'Tent, Medium',
    category:'gear', subcategory:'avventura', weight:15, cost:'15 mo', source:'CRB' },

  { id:'tenda_grande',        name:'Tenda (grande)',                  nameEN:'Tent, Large',
    category:'gear', subcategory:'avventura', weight:20, cost:'30 mo', source:'CRB' },

  { id:'tenda_padiglione',    name:'Tenda (padiglione)',              nameEN:'Tent, Pavilion',
    category:'gear', subcategory:'avventura', weight:25, cost:'100 mo', source:'CRB' },

  { id:'testo_sacro_economico', name:'Testo Sacro (economico)',       nameEN:'Religious Text, Cheap',
    category:'gear', subcategory:'avventura', weight:0.5, cost:'1 mo', source:'CRB' },

  { id:'testo_sacro',         name:'Testo Sacro',                     nameEN:'Religious Text',
    category:'gear', subcategory:'avventura', weight:1, cost:'25 mo', source:'CRB' },

  // ── Contenitori ──────────────────────────────────────────────────────────
  { id:'belt_pouch',        name:'Borsa da Cintura',              nameEN:'Belt Pouch',
    category:'gear', subcategory:'contenitori', weight:0.23, cost:'1 mo', source:'CRB' },

  { id:'sack',              name:'Sacco',                         nameEN:'Sack',
    category:'gear', subcategory:'contenitori', weight:0.23, cost:'1 ma', source:'CRB' },

  { id:'chest',             name:'Cassa di Legno',                nameEN:'Chest',
    category:'gear', subcategory:'contenitori', weight:11.25, cost:'2 mo', source:'CRB' },

  { id:'scroll_case',       name:'Tubo Porta-Rotoli',             nameEN:'Scroll Case',
    category:'gear', subcategory:'contenitori', weight:0.23, cost:'1 mo', source:'CRB' },

  { id:'quiver',            name:'Faretra',                       nameEN:'Quiver',
    category:'gear', subcategory:'contenitori', weight:0.45, cost:'1 mo', source:'CRB' },

  { id:'watertight_box',    name:'Scatolina Impermeabile',        nameEN:'Watertight Box',
    category:'gear', subcategory:'contenitori', weight:0.23, cost:'2 mo', source:'APG' },

  { id:'iron_box',          name:'Scatola di Ferro',              nameEN:'Iron Box',
    category:'gear', subcategory:'contenitori', weight:4.5, cost:'5 mo', source:'APG' },

  // ── Strumenti ────────────────────────────────────────────────────────────
  { id:'thieves_tools',     name:'Ferri da Scasso',               nameEN:'Thieves\' Tools',
    category:'gear', subcategory:'strumenti', weight:0.45, cost:'30 mo', source:'CRB' },

  { id:'thieves_tools_mw',  name:'Ferri da Scasso di Fattura Sopraffina', nameEN:'Masterwork Thieves\' Tools',
    category:'gear', subcategory:'strumenti', weight:0.45, cost:'100 mo', source:'CRB' },

  { id:'healer_kit',        name:'Kit del Medico (10 usi)',        nameEN:'Healer\'s Kit',
    category:'gear', subcategory:'strumenti', weight:0.45, cost:'50 mo', source:'CRB' },

  { id:'climbers_kit',      name:'Kit da Scalatore',              nameEN:'Climber\'s Kit',
    category:'gear', subcategory:'strumenti', weight:2.25, cost:'80 mo', source:'CRB' },

  { id:'disguise_kit',      name:'Kit dei Travestimenti (10 usi)', nameEN:'Disguise Kit',
    category:'gear', subcategory:'strumenti', weight:3.6, cost:'50 mo', source:'CRB' },

  { id:'magnifying_glass',  name:'Lente d\'Ingrandimento',        nameEN:'Magnifying Glass',
    category:'gear', subcategory:'strumenti', weight:0, cost:'100 mo', source:'CRB' },

  { id:'spyglass',          name:'Cannocchiale',                  nameEN:'Spyglass',
    category:'gear', subcategory:'strumenti', weight:0.45, cost:'1000 mo', source:'CRB' },

  { id:'compass',           name:'Bussola',                       nameEN:'Compass',
    category:'gear', subcategory:'strumenti', weight:0.23, cost:'10 mo', source:'APG' },

  { id:'masterwork_tool',   name:'Strumento di Fattura Sopraffina', nameEN:'Masterwork Tool',
    category:'gear', subcategory:'strumenti', weight:0.45, cost:'50 mo', source:'CRB' },

  { id:'artisan_tools',     name:'Strumenti d\'Artigianato',      nameEN:'Artisan\'s Tools',
    category:'gear', subcategory:'strumenti', weight:2.25, cost:'5 mo', source:'CRB' },

  { id:'artisan_tools_mw',  name:'Strumenti d\'Artigianato Sopraffini', nameEN:'Masterwork Artisan\'s Tools',
    category:'gear', subcategory:'strumenti', weight:2.25, cost:'55 mo', source:'CRB' },

  { id:'musical_instrument',name:'Strumento Musicale (comune)',   nameEN:'Musical Instrument',
    category:'gear', subcategory:'strumenti', weight:1.35, cost:'5 mo', source:'CRB' },

  { id:'musical_instr_mw',  name:'Strumento Musicale Sopraffino', nameEN:'Masterwork Musical Instrument',
    category:'gear', subcategory:'strumenti', weight:1.35, cost:'100 mo', source:'CRB' },

  { id:'lock_simple',      name:'Lucchetto (semplice, CD 20)',    nameEN:'Lock, Simple',
    category:'gear', subcategory:'strumenti', weight:0.5, cost:'20 mo', source:'UE' },

  { id:'lock_average',      name:'Lucchetto (media, CD 25)',      nameEN:'Lock, Average',
    category:'gear', subcategory:'strumenti', weight:0.5, cost:'40 mo', source:'CRB' },

  { id:'lock_good',         name:'Lucchetto (buona, CD 30)',      nameEN:'Lock, Good',
    category:'gear', subcategory:'strumenti', weight:0.5, cost:'80 mo', source:'CRB' },

  { id:'lock_superior',     name:'Lucchetto (superiore, CD 40)', nameEN:'Lock, Superior',
    category:'gear', subcategory:'strumenti', weight:0.5, cost:'150 mo', source:'CRB' },

  { id:'spring_sheath',     name:'Fodero a Molla da Polso',       nameEN:'Spring-loaded Wrist Sheath',
    category:'gear', subcategory:'strumenti', weight:0.23, cost:'5 mo', source:'UC' },

  // ── Alchemica ────────────────────────────────────────────────────────────
  { id:'alchemists_fire',   name:'Fuoco Alchemico',               nameEN:'Alchemist\'s Fire',
    category:'gear', subcategory:'alchemica', weight:0.45, cost:'20 mo', source:'CRB' },

  { id:'acid_flask',        name:'Fiala di Acido',                nameEN:'Acid (flask)',
    category:'gear', subcategory:'alchemica', weight:0.45, cost:'10 mo', source:'CRB' },

  { id:'tanglefoot_bag',    name:'Sacchetto Impigliapiedi',       nameEN:'Tanglefoot Bag',
    category:'gear', subcategory:'alchemica', weight:1.8, cost:'50 mo', source:'CRB' },

  { id:'thunderstone',      name:'Pietra del Tuono',              nameEN:'Thunderstone',
    category:'gear', subcategory:'alchemica', weight:0.45, cost:'30 mo', source:'CRB' },

  { id:'antitoxin',         name:'Antitossina',                   nameEN:'Antitoxin',
    category:'gear', subcategory:'alchemica', weight:0, cost:'50 mo', source:'CRB' },

  { id:'antiplague',        name:'Antipiaga',                     nameEN:'Antiplague',
    category:'gear', subcategory:'alchemica', weight:0, cost:'50 mo', source:'APG' },

  { id:'smelling_salts',    name:'Sali Aromatici',                nameEN:'Smelling Salts',
    category:'gear', subcategory:'alchemica', weight:0, cost:'25 mo', source:'APG' },

  { id:'alch_cartridge',    name:'Cartuccia Alchemica (carta)',   nameEN:'Alchemical Cartridge (paper)',
    category:'gear', subcategory:'alchemica', weight:0, cost:'10 mo', source:'UC' },

  { id:'bottled_lightning', name:'Fulmine in Bottiglia',          nameEN:'Bottled Lightning',
    category:'gear', subcategory:'alchemica', weight:0.45, cost:'40 mo', source:'APG' },

  { id:'frozen_ammo',       name:'Proiettile Ghiacciato',         nameEN:'Frost Powder',
    category:'gear', subcategory:'alchemica', weight:0, cost:'25 mo', source:'APG' },

  { id:'holy_water',       name:'Acqua Santa',                   nameEN:'Holy Water',
    category:'gear', subcategory:'alchemica', weight:0.5, cost:'25 mo', source:'CRB' },

  // ── Trasporto ────────────────────────────────────────────────────────────
  { id:'horse_light',       name:'Cavallo Leggero',               nameEN:'Horse, Light',
    category:'gear', subcategory:'trasporto', weight:0, cost:'75 mo', source:'CRB' },

  { id:'horse_heavy',       name:'Cavallo Pesante',               nameEN:'Horse, Heavy',
    category:'gear', subcategory:'trasporto', weight:0, cost:'200 mo', source:'CRB' },

  { id:'pony',              name:'Pony',                          nameEN:'Pony',
    category:'gear', subcategory:'trasporto', weight:0, cost:'30 mo', source:'CRB' },

  { id:'saddle_military',   name:'Sella Militare',                nameEN:'Saddle, Military',
    category:'gear', subcategory:'trasporto', weight:13.5, cost:'20 mo', source:'CRB' },

  { id:'saddle_riding',     name:'Sella da Equitazione',          nameEN:'Saddle, Riding',
    category:'gear', subcategory:'trasporto', weight:11.25, cost:'10 mo', source:'CRB' },

  { id:'cart',              name:'Carretto',                      nameEN:'Cart',
    category:'gear', subcategory:'trasporto', weight:0, cost:'15 mo', source:'CRB' },

  { id:'wagon',             name:'Carro Trainato',                nameEN:'Wagon',
    category:'gear', subcategory:'trasporto', weight:0, cost:'35 mo', source:'CRB' },

  { id:'animal_feed',      name:'Nutrimento per Animali (giorno)', nameEN:'Feed (per day)',
    category:'gear', subcategory:'trasporto', weight:5, cost:'5 mr', source:'CRB' },

  { id:'bit_bridle',       name:'Morso e Briglie',                nameEN:'Bit and Bridle',
    category:'gear', subcategory:'trasporto', weight:0.5, cost:'2 mo', source:'CRB' },

  { id:'saddlebags',       name:'Sacche da Sella',                nameEN:'Saddlebags',
    category:'gear', subcategory:'trasporto', weight:4, cost:'4 mo', source:'CRB' },

  { id:'saddle_exotic',    name:'Sella da Cavalcatura Esotica',   nameEN:'Exotic Saddle',
    category:'gear', subcategory:'trasporto', weight:7, cost:'30 mo', source:'CRB' },

  { id:'rowboat',          name:'Barca a Remi',                   nameEN:'Rowboat',
    category:'gear', subcategory:'trasporto', weight:0, cost:'50 mo', source:'CRB' },

  // ══════════════════════════════════════════════════════════════════════════
  // OGGETTI MAGICI
  // ══════════════════════════════════════════════════════════════════════════

  // ── Pozioni ──────────────────────────────────────────────────────────────
  { id:'pot_clw',           name:'Pozione: Cura Ferite Lievi',    nameEN:'Potion of Cure Light Wounds',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'50 mo', source:'CRB' },

  { id:'pot_cmw',           name:'Pozione: Cura Ferite Moderate', nameEN:'Potion of Cure Moderate Wounds',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'300 mo', source:'CRB' },

  { id:'pot_csw',           name:'Pozione: Cura Ferite Gravi',    nameEN:'Potion of Cure Serious Wounds',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'750 mo', source:'CRB' },

  { id:'pot_ccw',           name:'Pozione: Cura Ferite Critiche', nameEN:'Potion of Cure Critical Wounds',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'2800 mo', source:'CRB' },

  { id:'pot_invisib',       name:'Pozione: Invisibilità',         nameEN:'Potion of Invisibility',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'300 mo', source:'CRB' },

  { id:'pot_bull_str',      name:'Pozione: Forza del Toro',       nameEN:'Potion of Bull\'s Strength',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'300 mo', source:'CRB' },

  { id:'pot_cat_grace',     name:'Pozione: Grazia del Gatto',     nameEN:'Potion of Cat\'s Grace',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'300 mo', source:'CRB' },

  { id:'pot_endurance',     name:'Pozione: Resistenza dell\'Orso', nameEN:'Potion of Bear\'s Endurance',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'300 mo', source:'CRB' },

  { id:'pot_owl_wis',       name:'Pozione: Saggezza del Gufo',    nameEN:'Potion of Owl\'s Wisdom',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'300 mo', source:'CRB' },

  { id:'pot_eagle_spl',     name:'Pozione: Splendore dell\'Aquila', nameEN:'Potion of Eagle\'s Splendor',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'300 mo', source:'CRB' },

  { id:'pot_haste',         name:'Pozione: Rapidità',             nameEN:'Potion of Haste',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'750 mo', source:'CRB' },

  { id:'pot_fly',           name:'Pozione: Volo',                 nameEN:'Potion of Fly',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'750 mo', source:'CRB' },

  { id:'pot_heroism',       name:'Pozione: Eroismo',              nameEN:'Potion of Heroism',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'750 mo', source:'CRB' },

  { id:'pot_mage_armor',    name:'Pozione: Armatura del Mago',    nameEN:'Potion of Mage Armor',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'50 mo', source:'CRB' },

  { id:'pot_barkskin_2',    name:'Pozione: Corteccia Indurita +2', nameEN:'Potion of Barkskin (+2)',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'300 mo', source:'CRB' },

  { id:'pot_shield_faith',  name:'Pozione: Scudo della Fede +2',  nameEN:'Potion of Shield of Faith +2',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'50 mo', source:'CRB' },

  { id:'pot_rem_fear',      name:'Pozione: Rimuovi Paura',        nameEN:'Potion of Remove Fear',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'50 mo', source:'CRB' },

  { id:'pot_prot_evil',     name:'Pozione: Protezione dal Male',  nameEN:'Potion of Protection from Evil',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'50 mo', source:'CRB' },

  { id:'pot_neutralize',    name:'Pozione: Neutralizza Veleno',   nameEN:'Potion of Neutralize Poison',
    category:'magic', subcategory:'pozioni', weight:0.23, cost:'750 mo', source:'CRB' },

  // ── Bacchette ────────────────────────────────────────────────────────────
  { id:'wand_magic_missile_1',name:'Bacchetta: Freccia Magica (CL1)', nameEN:'Wand of Magic Missile (CL1)',
    category:'magic', subcategory:'bacchette', weight:0, cost:'750 mo', source:'CRB' },

  { id:'wand_magic_missile_3',name:'Bacchetta: Freccia Magica (CL3)', nameEN:'Wand of Magic Missile (CL3)',
    category:'magic', subcategory:'bacchette', weight:0, cost:'2250 mo', source:'CRB' },

  { id:'wand_clw',          name:'Bacchetta: Cura Ferite Lievi',  nameEN:'Wand of Cure Light Wounds',
    category:'magic', subcategory:'bacchette', weight:0, cost:'750 mo', source:'CRB' },

  { id:'wand_cmw',          name:'Bacchetta: Cura Ferite Moderate', nameEN:'Wand of Cure Moderate Wounds',
    category:'magic', subcategory:'bacchette', weight:0, cost:'4500 mo', source:'CRB' },

  { id:'wand_fireball_5',   name:'Bacchetta: Palla di Fuoco (CL5)', nameEN:'Wand of Fireball (CL5)',
    category:'magic', subcategory:'bacchette', weight:0, cost:'11250 mo', source:'CRB' },

  { id:'wand_lightning_5',  name:'Bacchetta: Fulmine (CL5)',       nameEN:'Wand of Lightning Bolt (CL5)',
    category:'magic', subcategory:'bacchette', weight:0, cost:'11250 mo', source:'CRB' },

  { id:'wand_invisib',      name:'Bacchetta: Invisibilità',       nameEN:'Wand of Invisibility',
    category:'magic', subcategory:'bacchette', weight:0, cost:'4500 mo', source:'CRB' },

  { id:'wand_slow',         name:'Bacchetta: Rallentamento',      nameEN:'Wand of Slow',
    category:'magic', subcategory:'bacchette', weight:0, cost:'11250 mo', source:'CRB' },

  // ── Pergamene ────────────────────────────────────────────────────────────
  { id:'scroll_magic_missile', name:'Pergamena: Freccia Magica',    nameEN:'Scroll of Magic Missile',
    category:'magic', subcategory:'pergamene', weight:0, cost:'25 mo', source:'CRB' },

  { id:'scroll_fireball_5', name:'Pergamena: Palla di Fuoco (CL5)', nameEN:'Scroll of Fireball (CL5)',
    category:'magic', subcategory:'pergamene', weight:0, cost:'375 mo', source:'CRB' },

  { id:'scroll_lightning_5',name:'Pergamena: Fulmine (CL5)',       nameEN:'Scroll of Lightning Bolt (CL5)',
    category:'magic', subcategory:'pergamene', weight:0, cost:'375 mo', source:'CRB' },

  { id:'scroll_clw',        name:'Pergamena: Cura Ferite Lievi',  nameEN:'Scroll of Cure Light Wounds',
    category:'magic', subcategory:'pergamene', weight:0, cost:'25 mo', source:'CRB' },

  { id:'scroll_fly',        name:'Pergamena: Volo',               nameEN:'Scroll of Fly',
    category:'magic', subcategory:'pergamene', weight:0, cost:'375 mo', source:'CRB' },

  { id:'scroll_haste',      name:'Pergamena: Rapidità',           nameEN:'Scroll of Haste',
    category:'magic', subcategory:'pergamene', weight:0, cost:'375 mo', source:'CRB' },

  { id:'scroll_invisib',    name:'Pergamena: Invisibilità',       nameEN:'Scroll of Invisibility',
    category:'magic', subcategory:'pergamene', weight:0, cost:'150 mo', source:'CRB' },

  { id:'scroll_remove_curse', name:'Pergamena: Rimuovi Maledizione', nameEN:'Scroll of Remove Curse',
    category:'magic', subcategory:'pergamene', weight:0, cost:'375 mo', source:'CRB' },

  { id:'scroll_teleport',   name:'Pergamena: Teletrasporto',      nameEN:'Scroll of Teleport',
    category:'magic', subcategory:'pergamene', weight:0, cost:'1125 mo', source:'CRB' },

  // ── Anelli ───────────────────────────────────────────────────────────────
  { id:'ring_prot_1',       name:'Anello di Protezione +1',       nameEN:'Ring of Protection +1',
    category:'magic', subcategory:'anelli', weight:0, cost:'2000 mo', source:'CRB' },

  { id:'ring_prot_2',       name:'Anello di Protezione +2',       nameEN:'Ring of Protection +2',
    category:'magic', subcategory:'anelli', weight:0, cost:'8000 mo', source:'CRB' },

  { id:'ring_prot_3',       name:'Anello di Protezione +3',       nameEN:'Ring of Protection +3',
    category:'magic', subcategory:'anelli', weight:0, cost:'18000 mo', source:'CRB' },

  { id:'ring_prot_4',       name:'Anello di Protezione +4',       nameEN:'Ring of Protection +4',
    category:'magic', subcategory:'anelli', weight:0, cost:'32000 mo', source:'CRB' },

  { id:'ring_prot_5',       name:'Anello di Protezione +5',       nameEN:'Ring of Protection +5',
    category:'magic', subcategory:'anelli', weight:0, cost:'50000 mo', source:'CRB' },

  { id:'ring_sustenance',   name:'Anello del Sostentamento',      nameEN:'Ring of Sustenance',
    category:'magic', subcategory:'anelli', weight:0, cost:'2500 mo', source:'CRB' },

  { id:'ring_feather_fall', name:'Anello della Caduta delle Piume', nameEN:'Ring of Feather Falling',
    category:'magic', subcategory:'anelli', weight:0, cost:'2200 mo', source:'CRB' },

  { id:'ring_invisib',      name:'Anello di Invisibilità',        nameEN:'Ring of Invisibility',
    category:'magic', subcategory:'anelli', weight:0, cost:'20000 mo', source:'CRB' },

  { id:'ring_force_shield', name:'Anello di Scudo di Forza',      nameEN:'Ring of Force Shield',
    category:'magic', subcategory:'anelli', weight:0, cost:'8500 mo', source:'CRB' },

  { id:'ring_swimming',     name:'Anello del Nuoto',              nameEN:'Ring of Swimming',
    category:'magic', subcategory:'anelli', weight:0, cost:'2500 mo', source:'CRB' },

  { id:'ring_climbing',     name:'Anello della Scalata',          nameEN:'Ring of Climbing',
    category:'magic', subcategory:'anelli', weight:0, cost:'2500 mo', source:'CRB' },

  { id:'ring_jumping',      name:'Anello del Salto',              nameEN:'Ring of Jumping',
    category:'magic', subcategory:'anelli', weight:0, cost:'2500 mo', source:'CRB' },

  { id:'ring_spell_storing',name:'Anello di Deposito di Incantesimi', nameEN:'Ring of Spell Storing',
    category:'magic', subcategory:'anelli', weight:0, cost:'50000 mo', source:'CRB' },

  { id:'ring_free_action',  name:'Anello di Libera Azione',       nameEN:'Ring of Freedom of Movement',
    category:'magic', subcategory:'anelli', weight:0, cost:'40000 mo', source:'CRB' },

  // ── Amuleti ──────────────────────────────────────────────────────────────
  { id:'am_nat_armor_1',    name:'Amuleto di Armatura Naturale +1', nameEN:'Amulet of Natural Armor +1',
    category:'magic', subcategory:'amuleti', weight:0, cost:'2000 mo', source:'CRB' },

  { id:'am_nat_armor_2',    name:'Amuleto di Armatura Naturale +2', nameEN:'Amulet of Natural Armor +2',
    category:'magic', subcategory:'amuleti', weight:0, cost:'8000 mo', source:'CRB' },

  { id:'am_nat_armor_3',    name:'Amuleto di Armatura Naturale +3', nameEN:'Amulet of Natural Armor +3',
    category:'magic', subcategory:'amuleti', weight:0, cost:'18000 mo', source:'CRB' },

  { id:'am_nat_armor_4',    name:'Amuleto di Armatura Naturale +4', nameEN:'Amulet of Natural Armor +4',
    category:'magic', subcategory:'amuleti', weight:0, cost:'32000 mo', source:'CRB' },

  { id:'am_nat_armor_5',    name:'Amuleto di Armatura Naturale +5', nameEN:'Amulet of Natural Armor +5',
    category:'magic', subcategory:'amuleti', weight:0, cost:'50000 mo', source:'CRB' },

  { id:'am_mighty_fists_1', name:'Amuleto dei Pugni Possenti +1', nameEN:'Amulet of Mighty Fists +1',
    category:'magic', subcategory:'amuleti', weight:0, cost:'4000 mo', source:'CRB' },

  { id:'am_mighty_fists_2', name:'Amuleto dei Pugni Possenti +2', nameEN:'Amulet of Mighty Fists +2',
    category:'magic', subcategory:'amuleti', weight:0, cost:'16000 mo', source:'CRB' },

  { id:'am_health',         name:'Amuleto della Salute',          nameEN:'Amulet of Health',
    category:'magic', subcategory:'amuleti', weight:0, cost:'4000 mo', source:'CRB' },

  // ── Mantelli ─────────────────────────────────────────────────────────────
  { id:'cloak_res_1',       name:'Mantello di Resistenza +1',     nameEN:'Cloak of Resistance +1',
    category:'magic', subcategory:'mantelli', weight:0.45, cost:'1000 mo', source:'CRB' },

  { id:'cloak_res_2',       name:'Mantello di Resistenza +2',     nameEN:'Cloak of Resistance +2',
    category:'magic', subcategory:'mantelli', weight:0.45, cost:'4000 mo', source:'CRB' },

  { id:'cloak_res_3',       name:'Mantello di Resistenza +3',     nameEN:'Cloak of Resistance +3',
    category:'magic', subcategory:'mantelli', weight:0.45, cost:'9000 mo', source:'CRB' },

  { id:'cloak_res_4',       name:'Mantello di Resistenza +4',     nameEN:'Cloak of Resistance +4',
    category:'magic', subcategory:'mantelli', weight:0.45, cost:'16000 mo', source:'CRB' },

  { id:'cloak_res_5',       name:'Mantello di Resistenza +5',     nameEN:'Cloak of Resistance +5',
    category:'magic', subcategory:'mantelli', weight:0.45, cost:'25000 mo', source:'CRB' },

  { id:'cloak_elvenkind',   name:'Mantello della Stirpe Elfica',  nameEN:'Cloak of Elvenkind',
    category:'magic', subcategory:'mantelli', weight:0.45, cost:'2500 mo', source:'CRB' },

  { id:'cloak_displacement',name:'Mantello di Dislocazione',      nameEN:'Cloak of Displacement',
    category:'magic', subcategory:'mantelli', weight:0.45, cost:'24000 mo', source:'CRB' },

  { id:'cloak_spell_res',   name:'Mantello di Resistenza agli Incantesimi', nameEN:'Mantle of Spell Resistance',
    category:'magic', subcategory:'mantelli', weight:0.45, cost:'90000 mo', source:'CRB' },

  // ── Cinture ──────────────────────────────────────────────────────────────
  { id:'belt_str_2',        name:'Cintura di Forza del Gigante +2', nameEN:'Belt of Giant Strength +2',
    category:'magic', subcategory:'cinture', weight:0.45, cost:'4000 mo', source:'CRB' },

  { id:'belt_str_4',        name:'Cintura di Forza del Gigante +4', nameEN:'Belt of Giant Strength +4',
    category:'magic', subcategory:'cinture', weight:0.45, cost:'16000 mo', source:'CRB' },

  { id:'belt_str_6',        name:'Cintura di Forza del Gigante +6', nameEN:'Belt of Giant Strength +6',
    category:'magic', subcategory:'cinture', weight:0.45, cost:'36000 mo', source:'CRB' },

  { id:'belt_dex_2',        name:'Cintura di Destrezza Incredibile +2', nameEN:'Belt of Incredible Dexterity +2',
    category:'magic', subcategory:'cinture', weight:0.45, cost:'4000 mo', source:'CRB' },

  { id:'belt_dex_4',        name:'Cintura di Destrezza Incredibile +4', nameEN:'Belt of Incredible Dexterity +4',
    category:'magic', subcategory:'cinture', weight:0.45, cost:'16000 mo', source:'CRB' },

  { id:'belt_dex_6',        name:'Cintura di Destrezza Incredibile +6', nameEN:'Belt of Incredible Dexterity +6',
    category:'magic', subcategory:'cinture', weight:0.45, cost:'36000 mo', source:'CRB' },

  { id:'belt_con_2',        name:'Cintura di Costituzione Possente +2', nameEN:'Belt of Mighty Constitution +2',
    category:'magic', subcategory:'cinture', weight:0.45, cost:'4000 mo', source:'CRB' },

  { id:'belt_con_4',        name:'Cintura di Costituzione Possente +4', nameEN:'Belt of Mighty Constitution +4',
    category:'magic', subcategory:'cinture', weight:0.45, cost:'16000 mo', source:'CRB' },

  { id:'belt_con_6',        name:'Cintura di Costituzione Possente +6', nameEN:'Belt of Mighty Constitution +6',
    category:'magic', subcategory:'cinture', weight:0.45, cost:'36000 mo', source:'CRB' },

  { id:'belt_str_dex_2',    name:'Cintura di Eccellenza Fisica +2 (FORza+DES)', nameEN:'Belt of Physical Might +2 (STR/DEX)',
    category:'magic', subcategory:'cinture', weight:0.45, cost:'10000 mo', source:'CRB' },

  { id:'belt_str_con_2',    name:'Cintura di Eccellenza Fisica +2 (FOR+COS)', nameEN:'Belt of Physical Might +2 (STR/CON)',
    category:'magic', subcategory:'cinture', weight:0.45, cost:'10000 mo', source:'CRB' },

  { id:'belt_dex_con_2',    name:'Cintura di Eccellenza Fisica +2 (DES+COS)', nameEN:'Belt of Physical Might +2 (DEX/CON)',
    category:'magic', subcategory:'cinture', weight:0.45, cost:'10000 mo', source:'CRB' },

  { id:'belt_phys_perf_2',  name:'Cintura di Perfezione Fisica +2 (FOR+DES+COS)', nameEN:'Belt of Physical Perfection +2',
    category:'magic', subcategory:'cinture', weight:0.45, cost:'18000 mo', source:'CRB' },

  { id:'belt_phys_perf_4',  name:'Cintura di Perfezione Fisica +4 (FOR+DES+COS)', nameEN:'Belt of Physical Perfection +4',
    category:'magic', subcategory:'cinture', weight:0.45, cost:'72000 mo', source:'CRB' },

  // ── Fasce ────────────────────────────────────────────────────────────────
  { id:'hb_int_2',          name:'Fascia di Grande Intelletto +2', nameEN:'Headband of Vast Intelligence +2',
    category:'magic', subcategory:'fasce', weight:0, cost:'4000 mo', source:'CRB' },

  { id:'hb_int_4',          name:'Fascia di Grande Intelletto +4', nameEN:'Headband of Vast Intelligence +4',
    category:'magic', subcategory:'fasce', weight:0, cost:'16000 mo', source:'CRB' },

  { id:'hb_int_6',          name:'Fascia di Grande Intelletto +6', nameEN:'Headband of Vast Intelligence +6',
    category:'magic', subcategory:'fasce', weight:0, cost:'36000 mo', source:'CRB' },

  { id:'hb_wis_2',          name:'Fascia di Saggezza Ispirata +2', nameEN:'Headband of Inspired Wisdom +2',
    category:'magic', subcategory:'fasce', weight:0, cost:'4000 mo', source:'CRB' },

  { id:'hb_wis_4',          name:'Fascia di Saggezza Ispirata +4', nameEN:'Headband of Inspired Wisdom +4',
    category:'magic', subcategory:'fasce', weight:0, cost:'16000 mo', source:'CRB' },

  { id:'hb_wis_6',          name:'Fascia di Saggezza Ispirata +6', nameEN:'Headband of Inspired Wisdom +6',
    category:'magic', subcategory:'fasce', weight:0, cost:'36000 mo', source:'CRB' },

  { id:'hb_cha_2',          name:'Fascia di Carisma Ammaliante +2', nameEN:'Headband of Alluring Charisma +2',
    category:'magic', subcategory:'fasce', weight:0, cost:'4000 mo', source:'CRB' },

  { id:'hb_cha_4',          name:'Fascia di Carisma Ammaliante +4', nameEN:'Headband of Alluring Charisma +4',
    category:'magic', subcategory:'fasce', weight:0, cost:'16000 mo', source:'CRB' },

  { id:'hb_cha_6',          name:'Fascia di Carisma Ammaliante +6', nameEN:'Headband of Alluring Charisma +6',
    category:'magic', subcategory:'fasce', weight:0, cost:'36000 mo', source:'CRB' },

  { id:'hb_int_wis_2',      name:'Fascia di Acume Mentale +2 (INT+SAG)', nameEN:'Headband of Mental Prowess +2 (INT/WIS)',
    category:'magic', subcategory:'fasce', weight:0, cost:'10000 mo', source:'CRB' },

  { id:'hb_int_cha_2',      name:'Fascia di Acume Mentale +2 (INT+CAR)', nameEN:'Headband of Mental Prowess +2 (INT/CHA)',
    category:'magic', subcategory:'fasce', weight:0, cost:'10000 mo', source:'CRB' },

  { id:'hb_wis_cha_2',      name:'Fascia di Acume Mentale +2 (SAG+CAR)', nameEN:'Headband of Mental Prowess +2 (WIS/CHA)',
    category:'magic', subcategory:'fasce', weight:0, cost:'10000 mo', source:'CRB' },

  { id:'hb_mental_sup_2',   name:'Fascia di Superiorità Mentale +2 (INT+SAG+CAR)', nameEN:'Headband of Mental Superiority +2',
    category:'magic', subcategory:'fasce', weight:0, cost:'18000 mo', source:'CRB' },

  { id:'hb_mental_sup_4',   name:'Fascia di Superiorità Mentale +4 (INT+SAG+CAR)', nameEN:'Headband of Mental Superiority +4',
    category:'magic', subcategory:'fasce', weight:0, cost:'72000 mo', source:'CRB' },

  // ── Stivali ──────────────────────────────────────────────────────────────
  { id:'boots_speed',       name:'Stivali della Velocità',        nameEN:'Boots of Speed',
    category:'magic', subcategory:'stivali', weight:0.45, cost:'12000 mo', source:'CRB' },

  { id:'boots_elvenkind',   name:'Stivali della Stirpe Elfica',   nameEN:'Boots of Elvenkind',
    category:'magic', subcategory:'stivali', weight:0.45, cost:'2500 mo', source:'CRB' },

  { id:'boots_winged',      name:'Stivali Alati',                 nameEN:'Winged Boots',
    category:'magic', subcategory:'stivali', weight:0.45, cost:'16000 mo', source:'CRB' },

  { id:'boots_striding',    name:'Stivali dello Scatto e del Balzo', nameEN:'Boots of Striding and Springing',
    category:'magic', subcategory:'stivali', weight:0.45, cost:'5500 mo', source:'CRB' },

  { id:'boots_levit',       name:'Stivali della Levitazione',     nameEN:'Boots of Levitation',
    category:'magic', subcategory:'stivali', weight:0.45, cost:'7500 mo', source:'CRB' },

  { id:'boots_teleport',    name:'Stivali del Teletrasporto',     nameEN:'Boots of Teleportation',
    category:'magic', subcategory:'stivali', weight:0.45, cost:'49000 mo', source:'CRB' },

  // ── Guanti / Occhiali ────────────────────────────────────────────────────
  { id:'gloves_swim_climb', name:'Guanti di Nuoto e Scalata',     nameEN:'Gloves of Swimming and Climbing',
    category:'magic', subcategory:'guanti', weight:0, cost:'6250 mo', source:'CRB' },

  { id:'gloves_arrow',      name:'Guanti dello Schivafrecce',     nameEN:'Gloves of Arrow Snaring',
    category:'magic', subcategory:'guanti', weight:0, cost:'4000 mo', source:'CRB' },

  { id:'eyes_eagle',        name:'Occhi dell\'Aquila',            nameEN:'Eyes of the Eagle',
    category:'magic', subcategory:'occhiali', weight:0, cost:'2500 mo', source:'CRB' },

  { id:'goggles_night',     name:'Occhialini della Notte',        nameEN:'Goggles of Night',
    category:'magic', subcategory:'occhiali', weight:0, cost:'12000 mo', source:'CRB' },

  { id:'goggles_minute',    name:'Occhialini della Vista Acuta',  nameEN:'Goggles of Minute Seeing',
    category:'magic', subcategory:'occhiali', weight:0, cost:'1250 mo', source:'CRB' },

  // ── Verghe ───────────────────────────────────────────────────────────────
  { id:'rod_immovable',     name:'Verga Immobile',                nameEN:'Immovable Rod',
    category:'magic', subcategory:'verghe', weight:1.35, cost:'5000 mo', source:'CRB' },

  { id:'rod_extend_l',      name:'Verga di Estensione (minore)', nameEN:'Rod of Extend Metamagic (lesser)',
    category:'magic', subcategory:'verghe', weight:1.35, cost:'3000 mo', source:'CRB' },

  { id:'rod_extend_n',      name:'Verga di Estensione (normale)', nameEN:'Rod of Extend Metamagic',
    category:'magic', subcategory:'verghe', weight:1.35, cost:'11000 mo', source:'CRB' },

  { id:'rod_extend_g',      name:'Verga di Estensione (maggiore)', nameEN:'Rod of Extend Metamagic (greater)',
    category:'magic', subcategory:'verghe', weight:1.35, cost:'24500 mo', source:'CRB' },

  { id:'rod_empower_l',     name:'Verga di Potenziamento (minore)', nameEN:'Rod of Empower Metamagic (lesser)',
    category:'magic', subcategory:'verghe', weight:1.35, cost:'9000 mo', source:'CRB' },

  { id:'rod_quicken_l',     name:'Verga di Azione Rapida (minore)', nameEN:'Rod of Quicken Metamagic (lesser)',
    category:'magic', subcategory:'verghe', weight:1.35, cost:'35000 mo', source:'CRB' },

  { id:'rod_maximize_l',    name:'Verga di Massimizzazione (minore)', nameEN:'Rod of Maximize Metamagic (lesser)',
    category:'magic', subcategory:'verghe', weight:1.35, cost:'14000 mo', source:'CRB' },

  { id:'rod_silent_l',      name:'Verga Silenziosa (minore)',     nameEN:'Rod of Silent Metamagic (lesser)',
    category:'magic', subcategory:'verghe', weight:1.35, cost:'3000 mo', source:'CRB' },

  { id:'rod_enlarge_l',     name:'Verga di Ingrandimento (minore)', nameEN:'Rod of Enlarge Metamagic (lesser)',
    category:'magic', subcategory:'verghe', weight:1.35, cost:'3000 mo', source:'CRB' },

  // ── Oggetti Meravigliosi ─────────────────────────────────────────────────
  { id:'bag_holding_1',     name:'Borsa del Tenere (Tipo I)',     nameEN:'Bag of Holding (Type I)',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'2500 mo', source:'CRB' },

  { id:'bag_holding_2',     name:'Borsa del Tenere (Tipo II)',    nameEN:'Bag of Holding (Type II)',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'5000 mo', source:'CRB' },

  { id:'bag_holding_3',     name:'Borsa del Tenere (Tipo III)',   nameEN:'Bag of Holding (Type III)',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'7400 mo', source:'CRB' },

  { id:'bag_holding_4',     name:'Borsa del Tenere (Tipo IV)',    nameEN:'Bag of Holding (Type IV)',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'10000 mo', source:'CRB' },

  { id:'handy_haversack',   name:'Zaino Pratico',                 nameEN:'Handy Haversack',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:2.25, cost:'2000 mo', source:'CRB' },

  { id:'portable_hole',     name:'Buca Portatile',               nameEN:'Portable Hole',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0, cost:'20000 mo', source:'CRB' },

  { id:'decanter_water',    name:'Caraffa dell\'Acqua Infinita',  nameEN:'Decanter of Endless Water',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:1.8, cost:'9000 mo', source:'CRB' },

  { id:'bag_tricks_grey',   name:'Borsa dei Trucchi (grigia)',    nameEN:'Bag of Tricks (grey)',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'900 mo', source:'CRB' },

  { id:'bag_tricks_rust',   name:'Borsa dei Trucchi (rugginosa)', nameEN:'Bag of Tricks (rust)',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'3400 mo', source:'CRB' },

  { id:'bag_tricks_tan',    name:'Borsa dei Trucchi (fulva)',     nameEN:'Bag of Tricks (tan)',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'16500 mo', source:'CRB' },

  { id:'robe_archmagi',     name:'Veste dell\'Arcimago',          nameEN:'Robe of the Archmagi',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'75000 mo', source:'CRB' },

  { id:'robe_blending',     name:'Veste del Mimetismo',           nameEN:'Robe of Blending',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'44000 mo', source:'CRB' },

  { id:'helm_comprehend',   name:'Elmo della Comprensione Linguistica', nameEN:'Helm of Comprehend Languages',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:1.35, cost:'5200 mo', source:'CRB' },

  { id:'helm_telepathy',    name:'Elmo della Telepatia',          nameEN:'Helm of Telepathy',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:1.35, cost:'27000 mo', source:'CRB' },

  { id:'horn_of_fog',       name:'Corno della Nebbia',            nameEN:'Horn of Fog',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'2000 mo', source:'CRB' },

  { id:'chime_opening',     name:'Campana dell\'Apertura',        nameEN:'Chime of Opening',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'3000 mo', source:'CRB' },

  { id:'crystal_ball',      name:'Sfera di Cristallo',            nameEN:'Crystal Ball',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:3.6, cost:'42000 mo', source:'CRB' },

  { id:'necklace_fireballs', name:'Collana di Palle di Fuoco (Tipo I)', nameEN:'Necklace of Fireballs (Type I)',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0, cost:'1650 mo', source:'CRB' },

  { id:'unguent_timeless',  name:'Unguento dell\'Eternità',       nameEN:'Unguent of Timelessness',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0, cost:'150 mo', source:'CRB' },

  { id:'manual_body_1',     name:'Manuale della Salute Corporea +1', nameEN:'Manual of Bodily Health +1',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:1.35, cost:'27500 mo', source:'CRB' },

  { id:'manual_bodily_2',   name:'Manuale della Salute Corporea +2', nameEN:'Manual of Bodily Health +2',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:1.35, cost:'55000 mo', source:'CRB' },

  { id:'tome_clear_1',      name:'Tomo del Pensiero Lucido +1',   nameEN:'Tome of Clear Thought +1',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:1.35, cost:'27500 mo', source:'CRB' },

  { id:'tome_leadership_1', name:'Tomo della Leadership +1',      nameEN:'Tome of Leadership and Influence +1',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:1.35, cost:'27500 mo', source:'CRB' },

  { id:'tome_understanding_1',name:'Tomo della Comprensione +1',  nameEN:'Tome of Understanding +1',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:1.35, cost:'27500 mo', source:'CRB' },

  // ══════════════════════════════════════════════════════════════════════════
  // ARMI MAGICHE  (category:'weapon' — compaiono nella ricerca armi)
  // ══════════════════════════════════════════════════════════════════════════

  // ── Spada Lunga (Longsword) ───────────────────────────────────────────────
  { id:'mw_longsword_1', name:'Spada Lunga +1', nameEN:'Longsword +1',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:0, weight:1.8, cost:'2315 mo',
    special:'+1 ai TxC e ai danni', source:'CRB' },

  { id:'mw_longsword_2', name:'Spada Lunga +2', nameEN:'Longsword +2',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:0, weight:1.8, cost:'8315 mo',
    special:'+2 ai TxC e ai danni', source:'CRB' },

  { id:'mw_longsword_3', name:'Spada Lunga +3', nameEN:'Longsword +3',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:0, weight:1.8, cost:'18315 mo',
    special:'+3 ai TxC e ai danni', source:'CRB' },

  { id:'mw_longsword_4', name:'Spada Lunga +4', nameEN:'Longsword +4',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:0, weight:1.8, cost:'32315 mo',
    special:'+4 ai TxC e ai danni', source:'CRB' },

  { id:'mw_longsword_5', name:'Spada Lunga +5', nameEN:'Longsword +5',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:0, weight:1.8, cost:'50315 mo',
    special:'+5 ai TxC e ai danni', source:'CRB' },

  { id:'mw_longsword_1_flaming', name:'Spada Lunga +1 Fiammeggiante', nameEN:'Longsword +1 Flaming',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:0, weight:1.8, cost:'8315 mo',
    special:'+1 TxC/danni; Fiammeggiante: +1d6 danni fuoco', source:'CRB' },

  { id:'mw_longsword_2_flaming', name:'Spada Lunga +2 Fiammeggiante', nameEN:'Longsword +2 Flaming',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:0, weight:1.8, cost:'18315 mo',
    special:'+2 TxC/danni; Fiammeggiante: +1d6 danni fuoco', source:'CRB' },

  { id:'mw_longsword_1_frost', name:'Spada Lunga +1 Gelida', nameEN:'Longsword +1 Frost',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:0, weight:1.8, cost:'8315 mo',
    special:'+1 TxC/danni; Gelida: +1d6 danni freddo', source:'CRB' },

  { id:'mw_longsword_1_shock', name:'Spada Lunga +1 Elettrica', nameEN:'Longsword +1 Shocking',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:0, weight:1.8, cost:'8315 mo',
    special:'+1 TxC/danni; Elettrica: +1d6 danni elettricità', source:'CRB' },

  { id:'mw_longsword_1_keen', name:'Spada Lunga +1 Affilata', nameEN:'Longsword +1 Keen',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'17-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:0, weight:1.8, cost:'8315 mo',
    special:'+1 TxC/danni; Affilata: raddoppia l\'intervallo critico (17–20)', source:'CRB' },

  { id:'mw_longsword_1_holy', name:'Spada Lunga +1 Sacra', nameEN:'Longsword +1 Holy',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:0, weight:1.8, cost:'18315 mo',
    special:'+1 TxC/danni; Sacra: +2d6 danni vs creature malvagie', source:'CRB' },

  { id:'mw_longsword_2_holy', name:'Spada Lunga +2 Sacra', nameEN:'Longsword +2 Holy',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:0, weight:1.8, cost:'32315 mo',
    special:'+2 TxC/danni; Sacra: +2d6 danni vs creature malvagie', source:'CRB' },

  { id:'mw_longsword_1_unholy', name:'Spada Lunga +1 Funesta', nameEN:'Longsword +1 Unholy',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:0, weight:1.8, cost:'18315 mo',
    special:'+1 TxC/danni; Funesta: +2d6 danni vs creature buone', source:'CRB' },

  { id:'mw_longsword_1_ghost', name:'Spada Lunga +1 Tocco Fantasma', nameEN:'Longsword +1 Ghost Touch',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:0, weight:1.8, cost:'8315 mo',
    special:'+1 TxC/danni; Tocco Fantasma: colpisce creature incorporee', source:'CRB' },

  { id:'mw_longsword_1_vorpal', name:'Spada Lunga +5 Vorticosa', nameEN:'Longsword +5 Vorpal',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:0, weight:1.8, cost:'98315 mo',
    special:'+5 TxC/danni; Vorticosa: tiro naturale 20 conferma decapitazione istantanea (TS Tempra CD 31 nega)', source:'CRB' },

  // ── Spada Corta (Shortsword) ──────────────────────────────────────────────
  { id:'mw_shortsword_1', name:'Spada Corta +1', nameEN:'Shortsword +1',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'19-20', critMult:2,
    damageType:'P', twoHanded:false, range:0, weight:1.35, cost:'2310 mo',
    special:'+1 ai TxC e ai danni', source:'CRB' },

  { id:'mw_shortsword_2', name:'Spada Corta +2', nameEN:'Shortsword +2',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'19-20', critMult:2,
    damageType:'P', twoHanded:false, range:0, weight:1.35, cost:'8310 mo',
    special:'+2 ai TxC e ai danni', source:'CRB' },

  { id:'mw_shortsword_3', name:'Spada Corta +3', nameEN:'Shortsword +3',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'19-20', critMult:2,
    damageType:'P', twoHanded:false, range:0, weight:1.35, cost:'18310 mo',
    special:'+3 ai TxC e ai danni', source:'CRB' },

  // ── Grande Spada (Greatsword) ─────────────────────────────────────────────
  { id:'mw_greatsword_1', name:'Grande Spada +1', nameEN:'Greatsword +1',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'2d6', damageS:'1d10', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:true, range:0, weight:3.2, cost:'2350 mo',
    special:'+1 ai TxC e ai danni', source:'CRB' },

  { id:'mw_greatsword_2', name:'Grande Spada +2', nameEN:'Greatsword +2',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'2d6', damageS:'1d10', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:true, range:0, weight:3.2, cost:'8350 mo',
    special:'+2 ai TxC e ai danni', source:'CRB' },

  { id:'mw_greatsword_3', name:'Grande Spada +3', nameEN:'Greatsword +3',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'2d6', damageS:'1d10', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:true, range:0, weight:3.2, cost:'18350 mo',
    special:'+3 ai TxC e ai danni', source:'CRB' },

  { id:'mw_greatsword_1_flaming', name:'Grande Spada +1 Fiammeggiante', nameEN:'Greatsword +1 Flaming',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'2d6', damageS:'1d10', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:true, range:0, weight:3.2, cost:'8350 mo',
    special:'+1 TxC/danni; Fiammeggiante: +1d6 danni fuoco', source:'CRB' },

  { id:'mw_greatsword_1_holy', name:'Grande Spada +1 Sacra', nameEN:'Greatsword +1 Holy',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'2d6', damageS:'1d10', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:true, range:0, weight:3.2, cost:'18350 mo',
    special:'+1 TxC/danni; Sacra: +2d6 danni vs creature malvagie', source:'CRB' },

  // ── Ascia da Battaglia (Battleaxe) ────────────────────────────────────────
  { id:'mw_battleaxe_1', name:'Ascia da Battaglia +1', nameEN:'Battleaxe +1',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'T', twoHanded:false, range:0, weight:2.25, cost:'2310 mo',
    special:'+1 ai TxC e ai danni', source:'CRB' },

  { id:'mw_battleaxe_2', name:'Ascia da Battaglia +2', nameEN:'Battleaxe +2',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'T', twoHanded:false, range:0, weight:2.25, cost:'8310 mo',
    special:'+2 ai TxC e ai danni', source:'CRB' },

  { id:'mw_battleaxe_3', name:'Ascia da Battaglia +3', nameEN:'Battleaxe +3',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'T', twoHanded:false, range:0, weight:2.25, cost:'18310 mo',
    special:'+3 ai TxC e ai danni', source:'CRB' },

  // ── Grande Ascia (Greataxe) ───────────────────────────────────────────────
  { id:'mw_greataxe_1', name:'Grande Ascia +1', nameEN:'Greataxe +1',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d12', damageS:'1d10', critRange:'20', critMult:3,
    damageType:'T', twoHanded:true, range:0, weight:3.2, cost:'2320 mo',
    special:'+1 ai TxC e ai danni', source:'CRB' },

  { id:'mw_greataxe_2', name:'Grande Ascia +2', nameEN:'Greataxe +2',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d12', damageS:'1d10', critRange:'20', critMult:3,
    damageType:'T', twoHanded:true, range:0, weight:3.2, cost:'8320 mo',
    special:'+2 ai TxC e ai danni', source:'CRB' },

  { id:'mw_greataxe_3', name:'Grande Ascia +3', nameEN:'Greataxe +3',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d12', damageS:'1d10', critRange:'20', critMult:3,
    damageType:'T', twoHanded:true, range:0, weight:3.2, cost:'18320 mo',
    special:'+3 ai TxC e ai danni', source:'CRB' },

  // ── Pugnale (Dagger) ──────────────────────────────────────────────────────
  { id:'mw_dagger_1', name:'Pugnale +1', nameEN:'Dagger +1',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d4', damageS:'1d3', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:3, weight:0.5, cost:'2302 mo',
    special:'+1 ai TxC e ai danni', source:'CRB' },

  { id:'mw_dagger_2', name:'Pugnale +2', nameEN:'Dagger +2',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d4', damageS:'1d3', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:3, weight:0.5, cost:'8302 mo',
    special:'+2 ai TxC e ai danni', source:'CRB' },

  { id:'mw_dagger_3', name:'Pugnale +3', nameEN:'Dagger +3',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d4', damageS:'1d3', critRange:'19-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:3, weight:0.5, cost:'18302 mo',
    special:'+3 ai TxC e ai danni', source:'CRB' },

  { id:'mw_dagger_1_keen', name:'Pugnale +1 Affilato', nameEN:'Dagger +1 Keen',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d4', damageS:'1d3', critRange:'17-20', critMult:2,
    damageType:'P/T', twoHanded:false, range:3, weight:0.5, cost:'8302 mo',
    special:'+1 TxC/danni; Affilato: intervallo critico 17–20', source:'CRB' },

  // ── Stocco (Rapier) ───────────────────────────────────────────────────────
  { id:'mw_rapier_1', name:'Stocco +1', nameEN:'Rapier +1',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'18-20', critMult:2,
    damageType:'P', twoHanded:false, range:0, weight:0.9, cost:'2320 mo',
    special:'+1 ai TxC e ai danni', source:'CRB' },

  { id:'mw_rapier_2', name:'Stocco +2', nameEN:'Rapier +2',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'18-20', critMult:2,
    damageType:'P', twoHanded:false, range:0, weight:0.9, cost:'8320 mo',
    special:'+2 ai TxC e ai danni', source:'CRB' },

  { id:'mw_rapier_1_keen', name:'Stocco +1 Affilato', nameEN:'Rapier +1 Keen',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'15-20', critMult:2,
    damageType:'P', twoHanded:false, range:0, weight:0.9, cost:'8320 mo',
    special:'+1 TxC/danni; Affilato: intervallo critico 15–20', source:'CRB' },

  // ── Scimitarra (Scimitar) ─────────────────────────────────────────────────
  { id:'mw_scimitar_1', name:'Scimitarra +1', nameEN:'Scimitar +1',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'18-20', critMult:2,
    damageType:'T', twoHanded:false, range:0, weight:1.35, cost:'2315 mo',
    special:'+1 ai TxC e ai danni', source:'CRB' },

  { id:'mw_scimitar_2', name:'Scimitarra +2', nameEN:'Scimitar +2',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'18-20', critMult:2,
    damageType:'T', twoHanded:false, range:0, weight:1.35, cost:'8315 mo',
    special:'+2 ai TxC e ai danni', source:'CRB' },

  { id:'mw_scimitar_3', name:'Scimitarra +3', nameEN:'Scimitar +3',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'18-20', critMult:2,
    damageType:'T', twoHanded:false, range:0, weight:1.35, cost:'18315 mo',
    special:'+3 ai TxC e ai danni', source:'CRB' },

  { id:'mw_scimitar_1_keen', name:'Scimitarra +1 Affilata', nameEN:'Scimitar +1 Keen',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d6', damageS:'1d4', critRange:'15-20', critMult:2,
    damageType:'T', twoHanded:false, range:0, weight:1.35, cost:'8315 mo',
    special:'+1 TxC/danni; Affilata: intervallo critico 15–20', source:'CRB' },

  // ── Mazza da Guerra (Warhammer) ───────────────────────────────────────────
  { id:'mw_warhammer_1', name:'Mazza da Guerra +1', nameEN:'Warhammer +1',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'C', twoHanded:false, range:0, weight:2.25, cost:'2312 mo',
    special:'+1 ai TxC e ai danni', source:'CRB' },

  { id:'mw_warhammer_2', name:'Mazza da Guerra +2', nameEN:'Warhammer +2',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'C', twoHanded:false, range:0, weight:2.25, cost:'8312 mo',
    special:'+2 ai TxC e ai danni', source:'CRB' },

  { id:'mw_warhammer_1_disrupt', name:'Mazza da Guerra +1 Disgregante', nameEN:'Warhammer +1 Disrupting',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'C', twoHanded:false, range:0, weight:2.25, cost:'18312 mo',
    special:'+1 TxC/danni; Disgregante: Non Morti devono superare TS Volontà (CD 14) al colpo o essere distrutti istantaneamente', source:'CRB' },

  // ── Alabarda (Halberd) ────────────────────────────────────────────────────
  { id:'mw_halberd_1', name:'Alabarda +1', nameEN:'Halberd +1',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d10', damageS:'1d8', critRange:'20', critMult:3,
    damageType:'P/T', twoHanded:true, range:0, weight:2.7, cost:'2310 mo',
    special:'+1 ai TxC e ai danni; braccia, afferrare', source:'CRB' },

  { id:'mw_halberd_2', name:'Alabarda +2', nameEN:'Halberd +2',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'1d10', damageS:'1d8', critRange:'20', critMult:3,
    damageType:'P/T', twoHanded:true, range:0, weight:2.7, cost:'8310 mo',
    special:'+2 ai TxC e ai danni; braccia, afferrare', source:'CRB' },

  // ── Falcione (Falchion) ───────────────────────────────────────────────────
  { id:'mw_falchion_1', name:'Falcione +1', nameEN:'Falchion +1',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'2d4', damageS:'1d6', critRange:'18-20', critMult:2,
    damageType:'T', twoHanded:true, range:0, weight:3.6, cost:'2375 mo',
    special:'+1 ai TxC e ai danni', source:'CRB' },

  { id:'mw_falchion_2', name:'Falcione +2', nameEN:'Falchion +2',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'2d4', damageS:'1d6', critRange:'18-20', critMult:2,
    damageType:'T', twoHanded:true, range:0, weight:3.6, cost:'8375 mo',
    special:'+2 ai TxC e ai danni', source:'CRB' },

  { id:'mw_falchion_1_keen', name:'Falcione +1 Affilato', nameEN:'Falchion +1 Keen',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'mischia', damage:'2d4', damageS:'1d6', critRange:'15-20', critMult:2,
    damageType:'T', twoHanded:true, range:0, weight:3.6, cost:'8375 mo',
    special:'+1 TxC/danni; Affilato: intervallo critico 15–20', source:'CRB' },

  // ── Arco Lungo (Longbow) ──────────────────────────────────────────────────
  { id:'mw_longbow_1', name:'Arco Lungo +1', nameEN:'Longbow +1',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'P', twoHanded:true, range:30, weight:1.35, cost:'2375 mo',
    special:'+1 ai TxC e ai danni', source:'CRB' },

  { id:'mw_longbow_2', name:'Arco Lungo +2', nameEN:'Longbow +2',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'P', twoHanded:true, range:30, weight:1.35, cost:'8375 mo',
    special:'+2 ai TxC e ai danni', source:'CRB' },

  { id:'mw_longbow_3', name:'Arco Lungo +3', nameEN:'Longbow +3',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'P', twoHanded:true, range:30, weight:1.35, cost:'18375 mo',
    special:'+3 ai TxC e ai danni', source:'CRB' },

  { id:'mw_longbow_1_shock', name:'Arco Lungo +1 Elettrico', nameEN:'Longbow +1 Shocking',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'P', twoHanded:true, range:30, weight:1.35, cost:'8375 mo',
    special:'+1 TxC/danni; Elettrico: +1d6 danni elettricità', source:'CRB' },

  // ── Arco Lungo Composito (Composite Longbow) ──────────────────────────────
  { id:'mw_comp_longbow_1', name:'Arco Lungo Composito +1', nameEN:'Composite Longbow +1',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'P', twoHanded:true, range:33, weight:1.35, cost:'2400 mo',
    special:'+1 ai TxC e ai danni', source:'CRB' },

  { id:'mw_comp_longbow_2', name:'Arco Lungo Composito +2', nameEN:'Composite Longbow +2',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'P', twoHanded:true, range:33, weight:1.35, cost:'8400 mo',
    special:'+2 ai TxC e ai danni', source:'CRB' },

  { id:'mw_comp_longbow_3', name:'Arco Lungo Composito +3', nameEN:'Composite Longbow +3',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'P', twoHanded:true, range:33, weight:1.35, cost:'18400 mo',
    special:'+3 ai TxC e ai danni', source:'CRB' },

  // ── Balestra Pesante (Heavy Crossbow) ─────────────────────────────────────
  { id:'mw_hcrossbow_1', name:'Balestra Pesante +1', nameEN:'Heavy Crossbow +1',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'distanza', damage:'1d10', damageS:'1d8', critRange:'19-20', critMult:2,
    damageType:'P', twoHanded:true, range:24, weight:3.6, cost:'2350 mo',
    special:'+1 ai TxC e ai danni', source:'CRB' },

  { id:'mw_hcrossbow_2', name:'Balestra Pesante +2', nameEN:'Heavy Crossbow +2',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'distanza', damage:'1d10', damageS:'1d8', critRange:'19-20', critMult:2,
    damageType:'P', twoHanded:true, range:24, weight:3.6, cost:'8350 mo',
    special:'+2 ai TxC e ai danni', source:'CRB' },

  // ── Balestra Leggera (Light Crossbow) ────────────────────────────────────
  { id:'mw_lcrossbow_1', name:'Balestra Leggera +1', nameEN:'Light Crossbow +1',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P', twoHanded:false, range:24, weight:1.8, cost:'2335 mo',
    special:'+1 ai TxC e ai danni', source:'CRB' },

  { id:'mw_lcrossbow_2', name:'Balestra Leggera +2', nameEN:'Light Crossbow +2',
    category:'weapon', subcategory:'marziale', weaponGroup:'marziale',
    attackType:'distanza', damage:'1d8', damageS:'1d6', critRange:'19-20', critMult:2,
    damageType:'P', twoHanded:false, range:24, weight:1.8, cost:'8335 mo',
    special:'+2 ai TxC e ai danni', source:'CRB' },

  // ── Lancia (Spear) ────────────────────────────────────────────────────────
  { id:'mw_spear_1', name:'Lancia +1', nameEN:'Spear +1',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'P', twoHanded:true, range:6, weight:1.8, cost:'2302 mo',
    special:'+1 ai TxC e ai danni; braccia; gittata 6 m', source:'CRB' },

  { id:'mw_spear_2', name:'Lancia +2', nameEN:'Spear +2',
    category:'weapon', subcategory:'semplice', weaponGroup:'semplice',
    attackType:'mischia', damage:'1d8', damageS:'1d6', critRange:'20', critMult:3,
    damageType:'P', twoHanded:true, range:6, weight:1.8, cost:'8302 mo',
    special:'+2 ai TxC e ai danni; braccia; gittata 6 m', source:'CRB' },

  // ══════════════════════════════════════════════════════════════════════════
  // ARMATURE MAGICHE  (category:'armor' — compaiono nella ricerca armature)
  // ══════════════════════════════════════════════════════════════════════════

  // ── Armatura di Cuoio (Leather) ───────────────────────────────────────────
  { id:'mw_leather_1', name:'Armatura di Cuoio +1', nameEN:'Leather Armor +1',
    category:'armor', subcategory:'leggera', armorType:'leggera',
    bonus:3, maxDex:6, acp:0, asf:10, speed:0, weight:7.5, cost:'1160 mo', source:'CRB' },

  { id:'mw_leather_2', name:'Armatura di Cuoio +2', nameEN:'Leather Armor +2',
    category:'armor', subcategory:'leggera', armorType:'leggera',
    bonus:4, maxDex:6, acp:0, asf:10, speed:0, weight:7.5, cost:'4160 mo', source:'CRB' },

  { id:'mw_leather_3', name:'Armatura di Cuoio +3', nameEN:'Leather Armor +3',
    category:'armor', subcategory:'leggera', armorType:'leggera',
    bonus:5, maxDex:6, acp:0, asf:10, speed:0, weight:7.5, cost:'9160 mo', source:'CRB' },

  // ── Armatura di Cuoio Borchiato (Studded Leather) ─────────────────────────
  { id:'mw_studded_1', name:'Armatura di Cuoio Borchiato +1', nameEN:'Studded Leather +1',
    category:'armor', subcategory:'leggera', armorType:'leggera',
    bonus:4, maxDex:5, acp:-1, asf:15, speed:0, weight:10, cost:'1175 mo', source:'CRB' },

  { id:'mw_studded_2', name:'Armatura di Cuoio Borchiato +2', nameEN:'Studded Leather +2',
    category:'armor', subcategory:'leggera', armorType:'leggera',
    bonus:5, maxDex:5, acp:-1, asf:15, speed:0, weight:10, cost:'4175 mo', source:'CRB' },

  { id:'mw_studded_3', name:'Armatura di Cuoio Borchiato +3', nameEN:'Studded Leather +3',
    category:'armor', subcategory:'leggera', armorType:'leggera',
    bonus:6, maxDex:5, acp:-1, asf:15, speed:0, weight:10, cost:'9175 mo', source:'CRB' },

  // ── Giaco di Maglia (Chain Shirt) ─────────────────────────────────────────
  { id:'mw_chain_shirt_1', name:'Giaco di Maglia +1', nameEN:'Chain Shirt +1',
    category:'armor', subcategory:'leggera', armorType:'leggera',
    bonus:5, maxDex:4, acp:-2, asf:20, speed:0, weight:12.5, cost:'1250 mo', source:'CRB' },

  { id:'mw_chain_shirt_2', name:'Giaco di Maglia +2', nameEN:'Chain Shirt +2',
    category:'armor', subcategory:'leggera', armorType:'leggera',
    bonus:6, maxDex:4, acp:-2, asf:20, speed:0, weight:12.5, cost:'4250 mo', source:'CRB' },

  { id:'mw_chain_shirt_3', name:'Giaco di Maglia +3', nameEN:'Chain Shirt +3',
    category:'armor', subcategory:'leggera', armorType:'leggera',
    bonus:7, maxDex:4, acp:-2, asf:20, speed:0, weight:12.5, cost:'9250 mo', source:'CRB' },

  { id:'mw_chain_shirt_4', name:'Giaco di Maglia +4', nameEN:'Chain Shirt +4',
    category:'armor', subcategory:'leggera', armorType:'leggera',
    bonus:8, maxDex:4, acp:-2, asf:20, speed:0, weight:12.5, cost:'16250 mo', source:'CRB' },

  { id:'mw_chain_shirt_5', name:'Giaco di Maglia +5', nameEN:'Chain Shirt +5',
    category:'armor', subcategory:'leggera', armorType:'leggera',
    bonus:9, maxDex:4, acp:-2, asf:20, speed:0, weight:12.5, cost:'25250 mo', source:'CRB' },

  // ── Cotta di Maglia (Chainmail) ───────────────────────────────────────────
  { id:'mw_chainmail_1', name:'Cotta di Maglia +1', nameEN:'Chainmail +1',
    category:'armor', subcategory:'media', armorType:'media',
    bonus:7, maxDex:2, acp:-5, asf:30, speed:3, weight:20, cost:'1300 mo', source:'CRB' },

  { id:'mw_chainmail_2', name:'Cotta di Maglia +2', nameEN:'Chainmail +2',
    category:'armor', subcategory:'media', armorType:'media',
    bonus:8, maxDex:2, acp:-5, asf:30, speed:3, weight:20, cost:'4300 mo', source:'CRB' },

  { id:'mw_chainmail_3', name:'Cotta di Maglia +3', nameEN:'Chainmail +3',
    category:'armor', subcategory:'media', armorType:'media',
    bonus:9, maxDex:2, acp:-5, asf:30, speed:3, weight:20, cost:'9300 mo', source:'CRB' },

  // ── Corazza di Piastre (Breastplate) ─────────────────────────────────────
  { id:'mw_breastplate_1', name:'Corazza di Piastre +1', nameEN:'Breastplate +1',
    category:'armor', subcategory:'media', armorType:'media',
    bonus:7, maxDex:3, acp:-4, asf:25, speed:3, weight:15, cost:'1350 mo', source:'CRB' },

  { id:'mw_breastplate_2', name:'Corazza di Piastre +2', nameEN:'Breastplate +2',
    category:'armor', subcategory:'media', armorType:'media',
    bonus:8, maxDex:3, acp:-4, asf:25, speed:3, weight:15, cost:'4350 mo', source:'CRB' },

  { id:'mw_breastplate_3', name:'Corazza di Piastre +3', nameEN:'Breastplate +3',
    category:'armor', subcategory:'media', armorType:'media',
    bonus:9, maxDex:3, acp:-4, asf:25, speed:3, weight:15, cost:'9350 mo', source:'CRB' },

  // ── Armatura Completa (Full Plate) ─────────────────────────────────────────
  { id:'mw_full_plate_1', name:'Armatura Completa +1', nameEN:'Full Plate +1',
    category:'armor', subcategory:'pesante', armorType:'pesante',
    bonus:10, maxDex:1, acp:-6, asf:35, speed:3, weight:25, cost:'2650 mo', source:'CRB' },

  { id:'mw_full_plate_2', name:'Armatura Completa +2', nameEN:'Full Plate +2',
    category:'armor', subcategory:'pesante', armorType:'pesante',
    bonus:11, maxDex:1, acp:-6, asf:35, speed:3, weight:25, cost:'5650 mo', source:'CRB' },

  { id:'mw_full_plate_3', name:'Armatura Completa +3', nameEN:'Full Plate +3',
    category:'armor', subcategory:'pesante', armorType:'pesante',
    bonus:12, maxDex:1, acp:-6, asf:35, speed:3, weight:25, cost:'10650 mo', source:'CRB' },

  { id:'mw_full_plate_4', name:'Armatura Completa +4', nameEN:'Full Plate +4',
    category:'armor', subcategory:'pesante', armorType:'pesante',
    bonus:13, maxDex:1, acp:-6, asf:35, speed:3, weight:25, cost:'17650 mo', source:'CRB' },

  { id:'mw_full_plate_5', name:'Armatura Completa +5', nameEN:'Full Plate +5',
    category:'armor', subcategory:'pesante', armorType:'pesante',
    bonus:14, maxDex:1, acp:-6, asf:35, speed:3, weight:25, cost:'26650 mo', source:'CRB' },

  // ══════════════════════════════════════════════════════════════════════════
  // SCUDI MAGICI  (category:'shield' — compaiono nella ricerca scudi)
  // ══════════════════════════════════════════════════════════════════════════

  { id:'mw_buckler_1', name:'Buckler +1', nameEN:'Buckler +1',
    category:'shield', subcategory:'scudo', armorType:'scudo',
    bonus:2, maxDex:null, acp:-1, asf:5, speed:0, weight:2.5, cost:'1155 mo', source:'CRB' },

  { id:'mw_buckler_2', name:'Buckler +2', nameEN:'Buckler +2',
    category:'shield', subcategory:'scudo', armorType:'scudo',
    bonus:3, maxDex:null, acp:-1, asf:5, speed:0, weight:2.5, cost:'4155 mo', source:'CRB' },

  { id:'mw_lt_steel_1', name:'Scudo Leggero di Metallo +1', nameEN:'Light Steel Shield +1',
    category:'shield', subcategory:'scudo', armorType:'scudo',
    bonus:2, maxDex:null, acp:-1, asf:5, speed:0, weight:3, cost:'1159 mo', source:'CRB' },

  { id:'mw_lt_steel_2', name:'Scudo Leggero di Metallo +2', nameEN:'Light Steel Shield +2',
    category:'shield', subcategory:'scudo', armorType:'scudo',
    bonus:3, maxDex:null, acp:-1, asf:5, speed:0, weight:3, cost:'4159 mo', source:'CRB' },

  { id:'mw_hv_steel_1', name:'Scudo Pesante di Metallo +1', nameEN:'Heavy Steel Shield +1',
    category:'shield', subcategory:'scudo', armorType:'scudo',
    bonus:3, maxDex:null, acp:-2, asf:15, speed:0, weight:7.5, cost:'1170 mo', source:'CRB' },

  { id:'mw_hv_steel_2', name:'Scudo Pesante di Metallo +2', nameEN:'Heavy Steel Shield +2',
    category:'shield', subcategory:'scudo', armorType:'scudo',
    bonus:4, maxDex:null, acp:-2, asf:15, speed:0, weight:7.5, cost:'4170 mo', source:'CRB' },

  { id:'mw_hv_steel_3', name:'Scudo Pesante di Metallo +3', nameEN:'Heavy Steel Shield +3',
    category:'shield', subcategory:'scudo', armorType:'scudo',
    bonus:5, maxDex:null, acp:-2, asf:15, speed:0, weight:7.5, cost:'9170 mo', source:'CRB' },

  { id:'mw_hv_steel_4', name:'Scudo Pesante di Metallo +4', nameEN:'Heavy Steel Shield +4',
    category:'shield', subcategory:'scudo', armorType:'scudo',
    bonus:6, maxDex:null, acp:-2, asf:15, speed:0, weight:7.5, cost:'16170 mo', source:'CRB' },

  { id:'mw_hv_steel_5', name:'Scudo Pesante di Metallo +5', nameEN:'Heavy Steel Shield +5',
    category:'shield', subcategory:'scudo', armorType:'scudo',
    bonus:7, maxDex:null, acp:-2, asf:15, speed:0, weight:7.5, cost:'25170 mo', source:'CRB' },

  // ══════════════════════════════════════════════════════════════════════════
  // BASTONI MAGICI  (category:'magic', subcategory:'bastoni')
  // ══════════════════════════════════════════════════════════════════════════

  { id:'staff_charming', name:'Bastone dell\'Ammaliamento', nameEN:'Staff of Charming',
    category:'magic', subcategory:'bastoni', weight:1.8, cost:'17600 mo',
    special:'10 cariche; Ammaliare ×8 (1c), Amicizia con i Mostri ×2 (2c), Suggestione di Gruppo ×2 (2c)', source:'CRB' },

  { id:'staff_defense', name:'Bastone della Difesa', nameEN:'Staff of Defense',
    category:'magic', subcategory:'bastoni', weight:1.8, cost:'62000 mo',
    special:'10 cariche; Scudo ×9 (1c), Scudo della Fede ×7 (1c), Impavido ×6 (2c), Porta Dimensionale (solo sé) ×5 (3c)', source:'CRB' },

  { id:'staff_earth_stone', name:'Bastone della Terra e della Pietra', nameEN:'Staff of Earth and Stone',
    category:'magic', subcategory:'bastoni', weight:1.8, cost:'80500 mo',
    special:'10 cariche; Afferrare la Terra ×5 (1c), Forma Lapidea ×4 (2c), Passare tra la Pietra ×3 (2c), Movimento della Terra ×2 (3c)', source:'CRB' },

  { id:'staff_enchantment', name:'Bastone degli Ammaliamenti', nameEN:'Staff of Enchantment',
    category:'magic', subcategory:'bastoni', weight:1.8, cost:'32800 mo',
    special:'10 cariche; Ammaliare ×4 (1c), Sonno ×4 (1c), Fascino ×4 (1c), Confusione ×2 (2c), Incapacitare ×2 (2c)', source:'CRB' },

  { id:'staff_evocation', name:'Bastone dell\'Evocazione', nameEN:'Staff of Evocation',
    category:'magic', subcategory:'bastoni', weight:1.8, cost:'95000 mo',
    special:'10 cariche; Freccia Magica ×8 (1c), Sfera di Fuoco ×6 (1c), Palla di Fuoco ×6 (2c), Fulmine ×6 (2c), Mano del Mago ×4 (3c)', source:'CRB' },

  { id:'staff_fire', name:'Bastone del Fuoco', nameEN:'Staff of Fire',
    category:'magic', subcategory:'bastoni', weight:1.8, cost:'18950 mo',
    special:'10 cariche; Raggio di Fuoco ×9 (1c), Palla di Fuoco ×6 (1c), Muro di Fuoco ×3 (2c)', source:'CRB' },

  { id:'staff_frost', name:'Bastone del Gelo', nameEN:'Staff of Frost',
    category:'magic', subcategory:'bastoni', weight:1.8, cost:'41400 mo',
    special:'10 cariche; Nebbia Gelida ×4 (1c), Tempesta di Ghiaccio ×3 (2c), Muro di Ghiaccio ×3 (2c), Sfera Congelante ×2 (3c)', source:'CRB' },

  { id:'staff_healing', name:'Bastone della Guarigione', nameEN:'Staff of Healing',
    category:'magic', subcategory:'bastoni', weight:1.8, cost:'29600 mo',
    special:'10 cariche; Cura Ferite Moderate ×4 (1c), Restaurazione Minore ×4 (1c), Rimuovi Cecità/Sordità ×3 (2c), Rimuovi Malattia ×3 (2c)', source:'CRB' },

  { id:'staff_illumination', name:'Bastone dell\'Illuminazione', nameEN:'Staff of Illumination',
    category:'magic', subcategory:'bastoni', weight:1.8, cost:'51500 mo',
    special:'10 cariche; Luce ×9 (1c), Luce del Giorno ×7 (2c), Scudo Solare ×5 (2c), Bagliore del Sole ×2 (4c)', source:'CRB' },

  { id:'staff_life', name:'Bastone della Vita', nameEN:'Staff of Life',
    category:'magic', subcategory:'bastoni', weight:1.8, cost:'109400 mo',
    special:'10 cariche; Cura Ferite Critiche ×4 (1c), Guarire ×3 (2c)', source:'CRB' },

  { id:'staff_necromancy', name:'Bastone della Negromanzia', nameEN:'Staff of Necromancy',
    category:'magic', subcategory:'bastoni', weight:1.8, cost:'69600 mo',
    special:'10 cariche; Tocco Gelido ×8 (1c), Individuare Non Morti ×6 (1c), Onda Vuota ×5 (2c), Sfinimento ×4 (2c)', source:'CRB' },

  { id:'staff_power', name:'Bastone del Potere', nameEN:'Staff of Power',
    category:'magic', subcategory:'bastoni', weight:1.8, cost:'235000 mo',
    special:'10 cariche; Freccia Magica ×8 (1c), Palla di Fuoco ×4 (1c), Cono di Freddo ×4 (2c), Fulmine ×4 (2c), Muro di Forza ×3 (2c), Globo Incandescente ×3 (3c); +2 CA e salvezze; può usarlo per Assorbire Magie', source:'CRB' },

  { id:'staff_magi', name:'Bastone del Mago', nameEN:'Staff of the Magi',
    category:'magic', subcategory:'bastoni', weight:1.8, cost:'238000 mo',
    special:'10 cariche; Freccia Magica ×8 (1c), Annullamento Magico ×6 (1c), Dissolvi Magie ×4 (2c), Fulmine ×4 (2c), Invisibilità ×4 (2c), Porta Dimensionale ×3 (2c), Mano del Mago ×3 (3c); Assorbire Magie gratis', source:'CRB' },

  { id:'staff_transmutation', name:'Bastone della Trasmutazione', nameEN:'Staff of Transmutation',
    category:'magic', subcategory:'bastoni', weight:1.8, cost:'81200 mo',
    special:'10 cariche; Ingrandire Persona ×6 (1c), Miniaturizzare Persona ×6 (1c), Modificare la Propria Forma ×5 (1c), Rallentamento ×4 (2c), Polimorfo ×3 (3c)', source:'CRB' },

  { id:'staff_woodlands', name:'Bastone delle Foreste', nameEN:'Staff of the Woodlands',
    category:'magic', subcategory:'bastoni', weight:1.8, cost:'100800 mo',
    special:'10 cariche; Radici Intralcianti ×6 (1c), Parlare con gli Animali ×5 (1c), Pelle Coriacea ×4 (2c), Portale degli Alberi ×3 (3c), Forma Selvatica ×3 (3c); +2 ai TxC e ai danni', source:'CRB' },

  // ══════════════════════════════════════════════════════════════════════════
  // BRACCIALI  (category:'magic', subcategory:'bracciali')
  // ══════════════════════════════════════════════════════════════════════════

  { id:'brac_armor_1', name:'Bracciali dell\'Armatura +1', nameEN:'Bracers of Armor +1',
    category:'magic', subcategory:'bracciali', weight:0.5, cost:'1000 mo',
    special:'+1 armatura alla CA; non si cumula con armatura fisica indossata', source:'CRB' },

  { id:'brac_armor_2', name:'Bracciali dell\'Armatura +2', nameEN:'Bracers of Armor +2',
    category:'magic', subcategory:'bracciali', weight:0.5, cost:'4000 mo',
    special:'+2 armatura alla CA; non si cumula con armatura fisica indossata', source:'CRB' },

  { id:'brac_armor_3', name:'Bracciali dell\'Armatura +3', nameEN:'Bracers of Armor +3',
    category:'magic', subcategory:'bracciali', weight:0.5, cost:'9000 mo',
    special:'+3 armatura alla CA; non si cumula con armatura fisica indossata', source:'CRB' },

  { id:'brac_armor_4', name:'Bracciali dell\'Armatura +4', nameEN:'Bracers of Armor +4',
    category:'magic', subcategory:'bracciali', weight:0.5, cost:'16000 mo',
    special:'+4 armatura alla CA; non si cumula con armatura fisica indossata', source:'CRB' },

  { id:'brac_armor_5', name:'Bracciali dell\'Armatura +5', nameEN:'Bracers of Armor +5',
    category:'magic', subcategory:'bracciali', weight:0.5, cost:'25000 mo',
    special:'+5 armatura alla CA; non si cumula con armatura fisica indossata', source:'CRB' },

  { id:'brac_armor_6', name:'Bracciali dell\'Armatura +6', nameEN:'Bracers of Armor +6',
    category:'magic', subcategory:'bracciali', weight:0.5, cost:'36000 mo',
    special:'+6 armatura alla CA; non si cumula con armatura fisica indossata', source:'CRB' },

  { id:'brac_armor_7', name:'Bracciali dell\'Armatura +7', nameEN:'Bracers of Armor +7',
    category:'magic', subcategory:'bracciali', weight:0.5, cost:'49000 mo',
    special:'+7 armatura alla CA; non si cumula con armatura fisica indossata', source:'CRB' },

  { id:'brac_armor_8', name:'Bracciali dell\'Armatura +8', nameEN:'Bracers of Armor +8',
    category:'magic', subcategory:'bracciali', weight:0.5, cost:'64000 mo',
    special:'+8 armatura alla CA; non si cumula con armatura fisica indossata', source:'CRB' },

  { id:'brac_archery_lesser', name:'Bracciali dell\'Archeria Leggeri', nameEN:'Bracers of Archery, Lesser',
    category:'magic', subcategory:'bracciali', weight:0.5, cost:'5000 mo',
    special:'+1 competenza ai TxC con archi; conferisce competenza con tutti gli archi', source:'CRB' },

  { id:'brac_archery', name:'Bracciali dell\'Archeria', nameEN:'Bracers of Archery',
    category:'magic', subcategory:'bracciali', weight:0.5, cost:'25000 mo',
    special:'+2 competenza ai TxC con archi; conferisce competenza con tutti gli archi', source:'CRB' },

  // ══════════════════════════════════════════════════════════════════════════
  // PIETRE IOUN  (category:'magic', subcategory:'ioun_stone')
  // ══════════════════════════════════════════════════════════════════════════

  { id:'ioun_clear', name:'Ioun: Chiara Spindola', nameEN:'Ioun Stone, Clear Spindle',
    category:'magic', subcategory:'ioun_stone', weight:0, cost:'4000 mo',
    special:'Sostenta senza cibo o acqua', source:'CRB' },

  { id:'ioun_dusty_rose', name:'Ioun: Prisma Rosa Polveroso', nameEN:'Ioun Stone, Dusty Rose Prism',
    category:'magic', subcategory:'ioun_stone', weight:0, cost:'5000 mo',
    special:'+1 intuizione alla CA', source:'CRB' },

  { id:'ioun_deep_red', name:'Ioun: Sfera Rosso Intenso', nameEN:'Ioun Stone, Deep Red Sphere',
    category:'magic', subcategory:'ioun_stone', weight:0, cost:'8000 mo',
    special:'+2 potenziamento alla Destrezza', source:'CRB' },

  { id:'ioun_incandescent_blue', name:'Ioun: Sfera Blu Incandescente', nameEN:'Ioun Stone, Incandescent Blue Sphere',
    category:'magic', subcategory:'ioun_stone', weight:0, cost:'8000 mo',
    special:'+2 potenziamento alla Saggezza', source:'CRB' },

  { id:'ioun_pale_blue', name:'Ioun: Romboide Azzurro Pallido', nameEN:'Ioun Stone, Pale Blue Rhomboid',
    category:'magic', subcategory:'ioun_stone', weight:0, cost:'8000 mo',
    special:'+2 potenziamento alla Forza', source:'CRB' },

  { id:'ioun_pink_green', name:'Ioun: Sfera Rosa e Verde', nameEN:'Ioun Stone, Pink and Green Sphere',
    category:'magic', subcategory:'ioun_stone', weight:0, cost:'8000 mo',
    special:'+2 potenziamento al Carisma', source:'CRB' },

  { id:'ioun_pink', name:'Ioun: Romboide Rosa', nameEN:'Ioun Stone, Pink Rhomboid',
    category:'magic', subcategory:'ioun_stone', weight:0, cost:'8000 mo',
    special:'+2 potenziamento alla Costituzione', source:'CRB' },

  { id:'ioun_scarlet_blue', name:'Ioun: Sfera Scarlatta e Blu', nameEN:'Ioun Stone, Scarlet and Blue Sphere',
    category:'magic', subcategory:'ioun_stone', weight:0, cost:'8000 mo',
    special:'+2 potenziamento all\'Intelligenza', source:'CRB' },

  { id:'ioun_dark_blue', name:'Ioun: Romboide Blu Scuro', nameEN:'Ioun Stone, Dark Blue Rhomboid',
    category:'magic', subcategory:'ioun_stone', weight:0, cost:'10000 mo',
    special:'Concede il talento Allerta: +2 a Intuizione e Percezione', source:'CRB' },

  { id:'ioun_iridescent', name:'Ioun: Spindola Iridescente', nameEN:'Ioun Stone, Iridescent Spindle',
    category:'magic', subcategory:'ioun_stone', weight:0, cost:'18000 mo',
    special:'Permette di respirare indefinitamente senza aria (underwater, vacuum, ecc.)', source:'CRB' },

  { id:'ioun_orange', name:'Ioun: Prisma Arancione', nameEN:'Ioun Stone, Orange Prism',
    category:'magic', subcategory:'ioun_stone', weight:0, cost:'30000 mo',
    special:'+1 al livello effettivo dell\'incantatore', source:'CRB' },

  { id:'ioun_vibrant_purple', name:'Ioun: Prisma Viola Vibrante', nameEN:'Ioun Stone, Vibrant Purple Prism',
    category:'magic', subcategory:'ioun_stone', weight:0, cost:'36000 mo',
    special:'Immagazzina fino a 3 livelli di incantesimi; il portatore può preparare/lanciare tali incantesimi dalla pietra', source:'CRB' },

  // ══════════════════════════════════════════════════════════════════════════
  // OGGETTI MERAVIGLIOSI AGGIUNTIVI
  // ══════════════════════════════════════════════════════════════════════════

  // ── Amuleti / Collane aggiuntivi ──────────────────────────────────────────
  { id:'amul_mighty_3', name:'Amuleto dei Pugni Possenti +3', nameEN:'Amulet of Mighty Fists +3',
    category:'magic', subcategory:'amuleti', weight:0.05, cost:'18000 mo',
    special:'+3 ai TxC e ai danni con attacchi naturali e senz\'armi', source:'CRB' },

  { id:'amul_mighty_4', name:'Amuleto dei Pugni Possenti +4', nameEN:'Amulet of Mighty Fists +4',
    category:'magic', subcategory:'amuleti', weight:0.05, cost:'32000 mo',
    special:'+4 ai TxC e ai danni con attacchi naturali e senz\'armi', source:'CRB' },

  { id:'amul_mighty_5', name:'Amuleto dei Pugni Possenti +5', nameEN:'Amulet of Mighty Fists +5',
    category:'magic', subcategory:'amuleti', weight:0.05, cost:'50000 mo',
    special:'+5 ai TxC e ai danni con attacchi naturali e senz\'armi', source:'CRB' },

  { id:'amul_adaptation', name:'Collana di Adattamento', nameEN:'Necklace of Adaptation',
    category:'magic', subcategory:'amuleti', weight:0.05, cost:'9000 mo',
    special:'Respira in qualsiasi ambiente (sott\'acqua, vuoto, gas); immunità agli incantesimi che usano gas', source:'CRB' },

  // ── Anelli aggiuntivi ─────────────────────────────────────────────────────
  { id:'ring_water_breath', name:'Anello di Respirazione Acquatica', nameEN:'Ring of Water Breathing',
    category:'magic', subcategory:'anelli', weight:0, cost:'14000 mo',
    special:'Respira indefinitamente sott\'acqua', source:'CRB' },

  { id:'ring_blinking', name:'Anello di Scintillio', nameEN:'Ring of Blinking',
    category:'magic', subcategory:'anelli', weight:0, cost:'27000 mo',
    special:'Scintillio a volontà: 20% probabilità di evitare qualsiasi attacco fisico; può attraversare muri sottili', source:'CRB' },

  { id:'ring_chameleon', name:'Anello del Camaleonte', nameEN:'Ring of Chameleon Power',
    category:'magic', subcategory:'anelli', weight:0, cost:'12700 mo',
    special:'Mimetismo a volontà: +10 a Furtività nel 1° round, +5 successivi; aspetto variabile', source:'CRB' },

  { id:'ring_warmth', name:'Anello del Calore', nameEN:'Ring of Warmth',
    category:'magic', subcategory:'anelli', weight:0, cost:'28000 mo',
    special:'Resistenza al Fuoco 20; immune al freddo naturale; +4 ai TS contro freddo magico', source:'CRB' },

  { id:'ring_animal_friend', name:'Anello dell\'Amicizia con gli Animali', nameEN:'Ring of Animal Friendship',
    category:'magic', subcategory:'anelli', weight:0, cost:'10800 mo',
    special:'Ammaliare Animali a volontà; gli animali amici non attaccano il portatore', source:'CRB' },

  { id:'ring_spell_resist', name:'Anello di Resistenza Magica', nameEN:'Ring of Spell Resistance',
    category:'magic', subcategory:'anelli', weight:0, cost:'90000 mo',
    special:'RI 13 (versioni: RI 15 = 140k, RI 17 = 200k, RI 19 = 260k, RI 21 = 320k mo)', source:'CRB' },

  // ── Per la testa ───────────────────────────────────────────────────────────
  { id:'hat_disguise', name:'Cappello del Travestimento', nameEN:'Hat of Disguise',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.1, cost:'1800 mo',
    special:'Travestimento a volontà (come incantesimo); modifica aspetto fisico, voce, razza umanoide', source:'CRB' },

  { id:'helm_brilliance', name:'Elmo della Brillanza', nameEN:'Helm of Brilliance',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:1.35, cost:'125000 mo',
    special:'10 diamanti (Palla di Fuoco 10d6), 20 rubini (Muro di Fuoco), 30 smeraldi (luce ciecantem), 40 opali (Raggio Ardente); RF 30; +1 agli incantesimi di fuoco', source:'CRB' },

  // ── Guanti aggiuntivi ─────────────────────────────────────────────────────
  { id:'gauntlets_ogre', name:'Guanti dell\'Orco', nameEN:'Gauntlets of Ogre Power',
    category:'magic', subcategory:'guanti', weight:2.25, cost:'4000 mo',
    special:'+2 potenziamento alla Forza per TxC e danni (bonus di tipo enhancement)', source:'CRB' },

  // ── Mantelli aggiuntivi ───────────────────────────────────────────────────
  { id:'cloak_arachnida', name:'Mantello dell\'Aracnide', nameEN:'Cloak of the Arachnida',
    category:'magic', subcategory:'mantelli', weight:0.45, cost:'14000 mo',
    special:'Ragnatela 2/giorno (come incantesimo); Scalata su ragnatele; immune alle ragnatele; visione nel buio 12 m', source:'CRB' },

  // ── Collane di Palle di Fuoco (Tipo II–VII) ───────────────────────────────
  { id:'neck_fireball_2', name:'Collana di Palle di Fuoco (Tipo II)', nameEN:'Necklace of Fireballs, Type II',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'2700 mo',
    special:'sfere 5d6 ×2, 3d6 ×2, 2d6 ×1 (TS Riflessi CD 23, raggio 6 m)', source:'CRB' },

  { id:'neck_fireball_3', name:'Collana di Palle di Fuoco (Tipo III)', nameEN:'Necklace of Fireballs, Type III',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'4350 mo',
    special:'sfere 5d6 ×3, 4d6 ×2, 3d6 ×1 (TS Riflessi CD 23, raggio 6 m)', source:'CRB' },

  { id:'neck_fireball_4', name:'Collana di Palle di Fuoco (Tipo IV)', nameEN:'Necklace of Fireballs, Type IV',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'5400 mo',
    special:'sfere 5d6 ×4, 4d6 ×2, 3d6 ×2 (TS Riflessi CD 23, raggio 6 m)', source:'CRB' },

  { id:'neck_fireball_5', name:'Collana di Palle di Fuoco (Tipo V)', nameEN:'Necklace of Fireballs, Type V',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'5850 mo',
    special:'sfere 5d6 ×5, 4d6 ×2 (TS Riflessi CD 25, raggio 6 m)', source:'CRB' },

  { id:'neck_fireball_6', name:'Collana di Palle di Fuoco (Tipo VI)', nameEN:'Necklace of Fireballs, Type VI',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'8100 mo',
    special:'sfere 7d6 ×3, 5d6 ×4 (TS Riflessi CD 25, raggio 6 m)', source:'CRB' },

  { id:'neck_fireball_7', name:'Collana di Palle di Fuoco (Tipo VII)', nameEN:'Necklace of Fireballs, Type VII',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'8700 mo',
    special:'sfere 7d6 ×4, 5d6 ×2, 3d6 ×2 (TS Riflessi CD 27, raggio 6 m)', source:'CRB' },

  // ── Varia ──────────────────────────────────────────────────────────────────
  { id:'stone_luck', name:'Pietra Fortunata', nameEN:'Stone of Good Luck (Luckstone)',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0, cost:'20000 mo',
    special:'+1 fortuna a tutte le prove di abilità e TS', source:'CRB' },

  { id:'stone_annihilation', name:'Sfera dell\'Annientamento', nameEN:'Sphere of Annihilation',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0, cost:'150000 mo',
    special:'Sfera di oscurità (10 cm): dissolve qualsiasi materiale tocchi incluse creature; prove di Sag (CD 13) per controllare', source:'CRB' },

  { id:'hand_glory', name:'Mano della Gloria', nameEN:'Hand of Glory',
    category:'magic', subcategory:'oggetti_meravigliosi', weight:0.45, cost:'8000 mo',
    special:'Mano mummificata: consente di indossare un anello in più (3° slot); +1 fortuna a tutti i TS', source:'CRB' },

];
