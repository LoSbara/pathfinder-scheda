/**
 * ui.js
 * Rendering dinamico delle sezioni della scheda e binding degli eventi UI.
 *
 * Architettura: module-level _char pointer (aggiornato a ogni init())
 * così i listener vengono legati UNA sola volta e leggono sempre il personaggio attivo.
 */

const UI = (() => {

  // ── Costanti ──────────────────────────────────────────────────────────────

  const ABILITIES = [
    { key: 'str', name: 'Forza',        abbr: 'FOR' },
    { key: 'dex', name: 'Destrezza',    abbr: 'DES' },
    { key: 'con', name: 'Costituzione', abbr: 'COS' },
    { key: 'int', name: 'Intelligenza', abbr: 'INT' },
    { key: 'wis', name: 'Saggezza',     abbr: 'SAG' },
    { key: 'cha', name: 'Carisma',      abbr: 'CAR' },
  ];

  const PF1_CONDITIONS = [
    'Accecato', 'Affaticato', 'Assordato', 'Atterrito', 'Confuso',
    'Esausto', 'Fascinato', 'Immobilizzato', 'Malato',
    'Nauseato', 'Paralizzato', 'Privo di Sensi', 'Prono',
    'Spaventato', 'Stordito',
  ];

  // Capacità di carico PF1 in libbre, indice = forza-1 (STR 1–30)
  const CARRY_LB = [
    [3,6,10],[6,13,20],[10,20,30],[13,26,40],[16,33,50],
    [20,40,60],[23,46,70],[26,53,80],[30,60,90],[33,66,100],
    [38,76,115],[43,86,130],[50,100,150],[58,116,175],[66,133,200],
    [76,153,230],[86,173,260],[100,200,300],[116,233,350],[133,266,400],
    [153,306,460],[173,346,520],[200,400,600],[233,466,700],[266,533,800],
    [306,613,920],[346,693,1040],[400,800,1200],[466,933,1400],[533,1066,1600],
  ];

  // ── Stato modulo ──────────────────────────────────────────────────────────

  let _char = null;         // personaggio attualmente mostrato
  let _eventsBound = false; // gli event listener vengono registrati una sola volta
  let _classSkillIds = [];  // IDs abilità di classe per la classe attiva (popolato da applyClassProfile)

  // ── Utility ───────────────────────────────────────────────────────────────

  function sign(n)      { return n >= 0 ? '+' + n : String(n); }
  function toInt(v, d=0){ const n = parseInt(v, 10); return isNaN(n) ? d : n; }
  function toF(v, d=0)  { const n = parseFloat(v);  return isNaN(n) ? d : n; }
  function el(id)       { return document.getElementById(id); }

  function setVal(id, v) {
    const e = el(id);
    if (e) e.value = v !== null && v !== undefined ? v : '';
  }
  function setText(id, v) {
    const e = el(id);
    if (e) e.textContent = v !== null && v !== undefined ? v : '';
  }

  /** Segnala modifiche non salvate colorando il bottone Salva. */
  function _dirty() {
    el('btn-save')?.classList.add('has-changes');
  }

  /** XSS-safe escape per inserimento in innerHTML. */
  function _e(s) {
    return String(s ?? '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function _carryKg(strScore) {
    const s = Math.max(1, strScore);
    let lb;
    if (s <= 30) {
      lb = CARRY_LB[s - 1];
    } else {
      const extra = Math.floor((s - 20) / 10);
      const base  = CARRY_LB[19];
      const f     = Math.pow(4, extra);
      lb = base.map(x => x * f);
    }
    return lb.map(x => +(x / 2.205).toFixed(1));
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER FUNCTIONS
  // ══════════════════════════════════════════════════════════════════════════

  // ── Sommario ──────────────────────────────────────────────────────────────

  function renderSommario(char) {
    setVal('meta-name',       char.meta.name);
    setVal('meta-player',     char.meta.playerName);
    setVal('meta-race',       char.meta.race);
    setVal('meta-alignment',  char.meta.alignment);
    setVal('meta-deity',      char.meta.deity);
    setVal('meta-size',       char.meta.size);
    setVal('meta-gender',     char.meta.gender);
    setVal('meta-age',        char.meta.age);
    setVal('meta-height',     char.meta.height);
    setVal('meta-weight',     char.meta.weight);
    setVal('meta-eyes',       char.meta.eyes);
    setVal('meta-hair',       char.meta.hair);
    setVal('meta-homeland',   char.meta.homeland || '');
    setVal('meta-languages',  Array.isArray(char.meta.languages)
      ? char.meta.languages.join(', ')
      : (char.meta.languages || ''));
    setVal('meta-background', char.meta.background);
    setVal('meta-xp',         char.meta.xp);

    // Immagine
    const img = el('char-image'), ph = el('char-image-placeholder');
    const btnRm = el('btn-remove-image');
    if (char.meta.imageDataUrl) {
      img.src = char.meta.imageDataUrl;
      img.classList.remove('hidden');
      ph.classList.add('hidden');
      btnRm?.classList.remove('hidden');
    } else {
      img.src = '';
      img.classList.add('hidden');
      ph.classList.remove('hidden');
      btnRm?.classList.add('hidden');
    }

    _renderClassesList(char);
  }

  function _renderClassesList(char) {
    const list = el('classes-list');
    if (!list) return;
    list.innerHTML = '';
    const classes = char.meta.classes || [];
    if (classes.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;padding:0.3rem 0">Nessuna classe — aggiungi una classe sopra.</p>';
    } else {
      classes.forEach((cls, i) => {
        const row = document.createElement('div');
        row.className = 'class-row';
        row.dataset.index = i;
        // Popola datalist archetipi per questa classe
        const classCfg = (typeof ClassConfig !== 'undefined') ? ClassConfig.findByName(cls.className || '') : null;
        const archOptions = (classCfg ? ClassConfig.getArchetypes(classCfg.id) : [])
          .map(a => `<option value="${_e(a.name)}">`).join('');
        row.innerHTML = `
          <div class="class-row-main">
            <input type="text"   class="field-input cls-name"  list="class-datalist" placeholder="Classe"   value="${_e(cls.className || '')}" />
            <input type="number" class="field-input field-narrow cls-level" min="1" max="20" value="${cls.level || 1}" title="Livello" />
            <input type="number" class="field-input class-row-hd cls-hd"   min="4" max="12" value="${cls.hitDie || 8}"  title="Dado Vita" />
            <button class="btn btn-danger btn-sm cls-remove" title="Rimuovi"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <datalist id="arch-list-${i}">${archOptions}</datalist>
          <input type="text" class="field-input cls-archetype" list="arch-list-${i}"
                 placeholder="Archetipo (opzionale)" value="${_e(cls.archetype || '')}" />
        `;
        list.appendChild(row);
      });
    }
    const total = classes.reduce((s, c) => s + (c.level || 0), 0);
    char.meta.totalLevel = total;
    setText('total-level-display', total);
  }

  // ── Caratteristiche ───────────────────────────────────────────────────────

  function renderCaratteristiche(char) {
    const grid = el('abilities-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const calc = Combat.calcAll(char);

    ABILITIES.forEach(ab => {
      const base    = char.abilities[ab.key]              || 10;
      const racial  = char.abilities[ab.key + 'Racial']   || 0;
      const enhance = char.abilities[ab.key + 'Enhance']  || 0;
      const temp    = char.abilities[ab.key + 'Temp']     || 0;
      const eff     = calc.scores[ab.key];
      const modVal  = calc.scores[ab.key + 'Mod'];
      const boosted = char.rage?.active && (ab.key === 'str' || ab.key === 'con');

      const card = document.createElement('div');
      card.className = 'ability-card' + (boosted ? ' rage-boosted' : '');
      card.dataset.key = ab.key;
      card.innerHTML = `
        <span class="ability-name">${ab.name} (${ab.abbr})</span>
        <input type="number" class="ability-score-input" id="ab-${ab.key}-base"
               value="${base}" min="1" max="40" />
        <div class="ability-mod ${modVal >= 0 ? 'positive' : 'negative'}"
             id="ab-${ab.key}-mod">${sign(modVal)}</div>
        <div class="ability-bonuses">
          <div class="ability-bonus-field">
            <label>Racc.</label>
            <input type="number" class="ability-bonus-input" id="ab-${ab.key}-racial" value="${racial}" />
          </div>
          <div class="ability-bonus-field">
            <label>Pot.</label>
            <input type="number" class="ability-bonus-input" id="ab-${ab.key}-enhance" value="${enhance}" />
          </div>
          <div class="ability-bonus-field">
            <label>Temp.</label>
            <input type="number" class="ability-bonus-input" id="ab-${ab.key}-temp" value="${temp}" />
          </div>
        </div>
        <div class="ability-effective" id="ab-${ab.key}-effective">
          Eff: <strong>${eff}</strong>${boosted ? ' 🔥' : ''}
        </div>
      `;
      grid.appendChild(card);
    });

    _renderConditionsCheckboxes(char);

    // Rage block
    const rageBlock = el('rage-block');
    if (rageBlock) rageBlock.classList.toggle('active', !!char.rage?.active);
    setVal('rage-rounds-used', char.rage?.roundsUsed || 0);
    setVal('rage-bloodline',   char.rage?.bloodlineName || '');
    const btn = el('btn-toggle-rage');
    if (btn) btn.textContent = char.rage?.active ? "Esci dall'Ira" : 'Entra in Ira';

    const c2 = Combat.calcAll(char);
    setText('rage-rounds-total', c2.rageRoundsTotal);
    setText('rage-rounds-left',  c2.rageRoundsLeft);

    _renderBloodlinePowers(char);

    // Bard block
    setVal('bard-rounds-left', char.bardPerf?.roundsLeft || 0);
    setVal('bard-extra',       char.bardPerf?.extra || 0);
    setVal('bard-active',      char.bardPerf?.active || '');
    setText('bard-rounds-max', c2.bardPerfMax);

    // Ki block
    setVal('ki-current', char.ki?.current || 0);
    setVal('ki-extra',   char.ki?.extra   || 0);
    setText('ki-max', c2.kiMax);

    // Channel block
    const chType = el('channel-type');
    if (chType) chType.value = char.channel?.type || 'positiva';
    setVal('channel-dice',      char.channel?.diceCount || 1);
    setVal('channel-uses-left', char.channel?.usesLeft  || 3);
    setVal('channel-uses-max',  char.channel?.usesMax   || 3);

    // Sneak block
    const sd = c2.sneakDice;
    setText('sneak-dice', sd > 0 ? sd + 'd6' : '—');
    setVal('sneak-extra', char.sneak?.extra || 0);
  }

  function _renderConditionsCheckboxes(char) {
    const container = el('conditions-checkboxes');
    if (!container) return;
    container.innerHTML = '';
    PF1_CONDITIONS.forEach(cond => {
      const active = (char.conditions || []).includes(cond);
      const lbl = document.createElement('label');
      lbl.className = 'condition-checkbox-label' + (active ? ' active' : '');
      lbl.innerHTML = `<input type="checkbox" value="${_e(cond)}" ${active ? 'checked' : ''} />${_e(cond)}`;
      container.appendChild(lbl);
    });
  }

  function _renderBloodlinePowers(char) {
    const container = el('bloodline-powers-list');
    if (!container) return;
    const powers = char.rage?.bloodlinePowers || [];
    container.innerHTML = '';
    if (powers.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;padding:0.2rem 0">Nessun potere.</p>';
      return;
    }
    powers.forEach((pw, i) => {
      const div = document.createElement('div');
      div.className = 'bloodline-power-entry';
      div.dataset.index = i;
      div.innerHTML = `
        <div class="bloodline-power-header">
          <input type="text" class="field-input bp-name" placeholder="Nome potere"
                 value="${_e(pw.name||'')}" />
          <input type="number" class="field-input field-narrow bp-level-req" min="1" max="20"
                 value="${pw.levelRequired||1}" title="Livello richiesto" />
          <label style="flex-shrink:0;font-size:0.8rem;white-space:nowrap">
            <input type="number" class="field-input field-narrow bp-uses-left" min="0"
                   value="${pw.usesLeft||0}" title="Usi rimasti" />
            /
            <input type="number" class="field-input field-narrow bp-uses-max"  min="0"
                   value="${pw.usesPerDay||0}" title="Usi/giorno (0=illimitato)" />
          </label>
          <button class="btn btn-ghost btn-sm bp-expand" title="Espandi">
            <i class="fa-solid fa-chevron-down"></i>
          </button>
          <button class="btn btn-danger btn-sm bp-remove"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="bp-details">
          <textarea class="feat-desc" rows="2"
                    placeholder="Descrizione del potere...">${_e(pw.description||'')}</textarea>
        </div>
      `;
      container.appendChild(div);
    });
  }

  // ── Combattimento ─────────────────────────────────────────────────────────

  function renderCombattimento(char) {
    setVal('hp-max',       char.combat.hpMax);
    setVal('hp-current',   char.combat.hpCurrent);
    setVal('hp-nonlethal', char.combat.hpNonLethal);

    setVal('ac-armor',      char.combat.ac.armorBonus  || 0);
    setVal('ac-shield',     char.combat.ac.shieldBonus || 0);
    setVal('ac-natural',    char.combat.ac.naturalArmor|| 0);
    setVal('ac-deflection', char.combat.ac.deflection  || 0);
    setVal('ac-dodge',      char.combat.ac.dodge       || 0);
    setVal('ac-misc',       char.combat.ac.misc        || 0);

    setVal('armor-name',    char.armor?.name    || '');
    setVal('armor-type',    char.armor?.type    || '');
    setVal('armor-bonus',   char.armor?.bonus   || 0);
    setVal('armor-maxdex',  char.armor?.maxDex  != null ? char.armor.maxDex : '');
    setVal('armor-acp',     char.armor?.acp     || 0);
    setVal('armor-asf',     char.armor?.asf     || 0);
    setVal('armor-speed',   char.armor?.speed   || 0);
    setVal('armor-weight',  char.armor?.weight  || 0);

    setVal('bab-input',       char.combat.bab);
    setVal('initiative-misc', char.combat.initiative?.misc || 0);
    setVal('speed-base',      char.combat.speed);
    setVal('speed-swim',      char.combat.speedExtra?.nuoto   || 0);
    setVal('speed-fly',       char.combat.speedExtra?.volo    || 0);
    setVal('speed-climb',     char.combat.speedExtra?.scalare || 0);
    setVal('speed-burrow',    char.combat.speedExtra?.scavare || 0);

    setVal('save-fort-base',  char.combat.saves.fortBase  || 0);
    setVal('save-fort-misc',  char.combat.saves.fortMisc  || 0);
    setVal('save-ref-base',   char.combat.saves.refBase   || 0);
    setVal('save-ref-misc',   char.combat.saves.refMisc   || 0);
    setVal('save-will-base',  char.combat.saves.willBase  || 0);
    setVal('save-will-misc',  char.combat.saves.willMisc  || 0);

    setVal('cmb-misc', char.combat.cmbMisc || 0);
    setVal('cmd-misc', char.combat.cmdMisc || 0);

    setVal('dr-input', char.combat.dr || '');
    setVal('sr-input',  char.combat.sr || 0);
    setVal('negative-levels', char.negativeLevels || 0);
    setVal('immunities-input', Array.isArray(char.combat.immunities)
      ? char.combat.immunities.join(', ')
      : (char.combat.immunities || ''));

    setVal('res-fire',  char.combat.resistances?.fuoco       || 0);
    setVal('res-cold',  char.combat.resistances?.freddo      || 0);
    setVal('res-elec',  char.combat.resistances?.elettricità || 0);
    setVal('res-acid',  char.combat.resistances?.acido       || 0);
    setVal('res-sonic', char.combat.resistances?.sonoro      || 0);

    refreshCalculated(char);
  }

  // ── Abilità ───────────────────────────────────────────────────────────────

  function renderAbilita(char) {
    const tbody = el('skills-tbody');
    if (!tbody) return;
    const allSkills = Skills.calcAllSkills(char);
    const filterTrained = el('skills-filter-trained')?.checked;
    const filterClass   = el('skills-filter-class')?.checked;

    tbody.innerHTML = '';
    allSkills.forEach(s => {
      const rec = (char.skills || []).find(r => r.id === s.id) || {};
      const def = PF1_SKILLS.find(d => d.id === s.id) || {};

      if (filterTrained && (s.ranks || 0) <= 0) return;
      if (filterClass   && !rec.classSkill)      return;

      const tr = document.createElement('tr');
      const cls = ['skill-row'];
      if (!s.usable)    cls.push('skill-unusable');
      if (s.rageLocked) cls.push('skill-rage-locked');
      if ((s.ranks||0) > 0) cls.push('skill-trained');
      tr.className = cls.join(' ');
      tr.dataset.id = s.id;

      const abilAbbr = {str:'FOR',dex:'DES',con:'COS',int:'INT',wis:'SAG',cha:'CAR'}[def.ability] || '—';
      const miscSum  = (s.breakdown.abilityMod||0) + (s.breakdown.classBonus||0)
                      + (s.breakdown.acp||0)        + (s.breakdown.misc||0);

      tr.innerHTML = `
        <td class="skill-col-cs">
          <button class="skill-cs-btn ${rec.classSkill ? 'active' : ''}" title="Abilità di Classe">C</button>
        </td>
        <td class="skill-col-name">${_e(s.name)}${def.trainedOnly ? ' <em style="font-size:.7em;color:var(--text-muted)">*</em>' : ''}</td>
        <td class="skill-col-key">${abilAbbr}</td>
        <td class="skill-col-ranks">
          <input type="number" class="skill-ranks-input" min="0" value="${s.ranks||0}" />
        </td>
        <td class="skill-col-bonus">${sign(miscSum)}</td>
        <td class="skill-col-total skill-total ${(s.total||0) > 0 ? 'positive' : ''}">${sign(s.total||0)}</td>
      `;
      tbody.appendChild(tr);
    });

    const sum = Skills.calcSkillPointsSummary(char);
    const sumEl = el('skill-points-summary');
    if (sumEl) {
      sumEl.textContent = `Gradi: ${sum.spent} / ${sum.available}`;
      sumEl.classList.toggle('overflow', sum.overflow > 0);
    }
    _applySkillHighlights();
  }

  // ── Armi ──────────────────────────────────────────────────────────────────

  function renderArmi(char) {
    const list = el('weapons-list');
    if (!list) return;
    list.innerHTML = '';
    const pa = el('power-attack-toggle')?.checked || false;

    (char.weapons || []).forEach((w, i) => {
      const atk = Combat.calcWeaponAttack(char, w, pa);
      const dmg = Combat.calcWeaponDamage(char, w, pa);

      const itk = Combat.calcIterativeAttacks(char, w, pa);
      const atkStr = itk.map(sign).join('/');

      const card = document.createElement('div');
      card.className = 'weapon-card';
      card.dataset.index = i;
      card.innerHTML = `
        <div class="weapon-card-header">
          <input type="text" class="weapon-name-input wpn-name"
                 placeholder="Nome arma" value="${_e(w.name||'')}" />
          <button class="btn btn-danger btn-sm wpn-remove" title="Rimuovi"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="weapon-stats-row">
          <div class="weapon-stat">
            <span class="weapon-stat-label">Attacco</span>
            <span class="weapon-stat-value" title="Bonus attacco (iterativi separati da /): BAB ± carr. ± bonus">${_e(atkStr)}</span>
          </div>
          <div class="weapon-stat">
            <span class="weapon-stat-label">Danno</span>
            <span class="weapon-stat-value">${_e(w.damage||'1d6')} ${sign(dmg.total)}</span>
          </div>
          <div class="weapon-stat">
            <span class="weapon-stat-label">Critico</span>
            <span class="weapon-stat-value">${_e(w.critRange||'20')}/×${w.critMult||2}</span>
          </div>
        </div>
        <div class="weapon-detail-row">
          <div class="field-group">
            <label>Tipo</label>
            <select class="field-input wpn-type">
              ${['mischia','distanza','naturale'].map(t =>
                `<option value="${t}"${w.attackType===t?' selected':''}>${t}</option>`
              ).join('')}
            </select>
          </div>
          <div class="field-group">
            <label>Danno</label>
            <input type="text" class="field-input field-narrow wpn-damage"
                   value="${_e(w.damage||'1d6')}" placeholder="1d6" />
          </div>
          <div class="field-group">
            <label>Potenz.</label>
            <input type="number" class="field-input field-narrow wpn-enhancement"
                   value="${w.enhancement||0}" min="0" max="5" />
          </div>
          <div class="field-group">
            <label>Gittata (m)</label>
            <input type="number" class="field-input field-narrow wpn-range"
                   value="${w.range||0}" min="0" />
          </div>
          <div class="field-group">
            <label>Crit</label>
            <input type="text" class="field-input field-narrow wpn-crit"
                   value="${_e(w.critRange||'20')}" placeholder="19-20" />
          </div>
          <div class="field-group">
            <label>×Crit</label>
            <input type="number" class="field-input field-narrow wpn-critmult"
                   value="${w.critMult||2}" min="2" max="4" />
          </div>
          <div class="field-group">
            <label>Tipo danno</label>
            <input type="text" class="field-input field-narrow wpn-damagetype"
                   value="${_e(w.damageType||'T')}" placeholder="C/T/P" />
          </div>
        </div>
        <div class="field-row" style="margin-top:0.3rem;gap:0.8rem">
          <label style="display:flex;align-items:center;gap:0.4rem;font-size:0.82rem;
                         color:var(--text-muted);text-transform:none;letter-spacing:0">
            <input type="checkbox" class="wpn-twohanded" ${w.twoHanded?'checked':''} />
            Due mani
          </label>
          <label style="display:flex;align-items:center;gap:0.4rem;font-size:0.82rem;
                         color:var(--text-muted);text-transform:none;letter-spacing:0">
            <input type="checkbox" class="wpn-offhand" ${w.offHand?'checked':''} />
            Mano secondaria
          </label>
          <div class="field-group" style="flex:1">
            <label>Misc attacco</label>
            <input type="number" class="field-input field-narrow wpn-atk-misc"
                   value="${w.attackMisc||0}" />
          </div>
          <div class="field-group" style="flex:1">
            <label>Misc danno</label>
            <input type="number" class="field-input field-narrow wpn-dmg-misc"
                   value="${w.damageMisc||0}" />
          </div>
        </div>
        <div class="field-group" style="margin-top:0.3rem">
          <label>Note speciali</label>
          <input type="text" class="field-input wpn-notes"
                 value="${_e(w.notes||'')}" placeholder="es. Bane (non-morti), Aura..." />
        </div>
      `;
      list.appendChild(card);
    });

    if ((char.weapons||[]).length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;padding:0.3rem 0">Nessuna arma — aggiungi un\'arma sopra.</p>';
    }

    // Mostra il blocco Attacco Poderoso solo se il personaggio possiede il talento
    const hasPowerAttack = (char.feats || []).some(f =>
      (f.name || '').toLowerCase().replace(/\s+/g, '') === 'attaccopoteroso'
    );
    el('power-attack-block')?.classList.toggle('hidden', !hasPowerAttack);
    if (!hasPowerAttack) {
      const tog = el('power-attack-toggle');
      if (tog) tog.checked = false;
    }

    _updatePowerAttackPreview(char);
  }

  function _updatePowerAttackPreview(char) {
    const preview = el('power-attack-preview');
    if (!preview) return;
    if (!el('power-attack-toggle')?.checked) {
      preview.classList.add('hidden');
      return;
    }
    const bab = char.combat?.bab || 0;
    const p   = Combat.calcPowerAttack(bab);
    preview.classList.remove('hidden');
    preview.innerHTML =
      `BAB ${bab}: &nbsp;
      <strong>${sign(p.attackPenalty)}</strong> attacco &nbsp;|&nbsp;
      <strong>${sign(p.damageBonusBase)}</strong> danno (1 mano) &nbsp;|&nbsp;
      <strong>${sign(p.damageBonusTwoHanded)}</strong> (2 mani) &nbsp;|&nbsp;
      <strong>${sign(p.damageBonusOffHand)}</strong> (secondaria)`;
  }

  // ── Equipaggiamento ───────────────────────────────────────────────────────

  function renderEquipaggiamento(char) {
    setVal('currency-pp', char.currency?.pp || 0);
    setVal('currency-gp', char.currency?.gp || 0);
    setVal('currency-sp', char.currency?.sp || 0);
    setVal('currency-cp', char.currency?.cp || 0);
    _updateWeight(char);

    const list = el('equipment-list');
    if (!list) return;
    list.innerHTML = '';
    (char.equipment || []).forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'equip-item';
      div.dataset.index = i;
      div.innerHTML = `
        <input type="text"   class="field-input equip-name"
               placeholder="Nome oggetto" value="${_e(item.name||'')}" />
        <input type="number" class="field-input field-narrow equip-qty"
               min="1" value="${item.qty||1}" title="Quantità" />
        <input type="number" class="field-input field-narrow equip-weight"
               min="0" step="0.1" value="${item.weight||0}" title="Peso kg" />
        <input type="text"   class="field-input field-narrow equip-cost"
               value="${_e(item.cost||'')}" placeholder="costo" />
        <select class="field-input field-narrow equip-location" title="Posizione">
          <option value="zaino"       ${(item.location||'zaino')==='zaino'       ?'selected':''}>Zaino</option>
          <option value="indosso"     ${(item.location||'zaino')==='indosso'     ?'selected':''}>Indosso</option>
          <option value="cavalcatura" ${(item.location||'zaino')==='cavalcatura' ?'selected':''}>Cavalc.</option>
          <option value="deposito"    ${(item.location||'zaino')==='deposito'    ?'selected':''}>Deposito</option>
        </select>
        <label title="Indossato/equipaggiato" style="flex-shrink:0">
          <input type="checkbox" class="equip-worn" ${item.worn?'checked':''} />
        </label>
        <button class="btn btn-danger btn-sm equip-remove"><i class="fa-solid fa-xmark"></i></button>
      `;
      list.appendChild(div);
    });
    if ((char.equipment||[]).length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;padding:0.3rem 0">Inventario vuoto.</p>';
    }
  }

  function _updateWeight(char) {
    const equip   = (char.equipment||[]).reduce((s, i) => s + (i.weight||0)*(i.qty||1), 0);
    const carried = equip + (char.armor?.weight || 0);
    setText('weight-carried', carried.toFixed(1) + ' kg');
    const strScore = Combat.effectiveScore(char, 'str');
    const lim = _carryKg(strScore);
    setText('weight-light',  lim[0] + ' kg');
    setText('weight-medium', lim[1] + ' kg');
    setText('weight-heavy',  lim[2] + ' kg');
  }

  // ── Talenti ───────────────────────────────────────────────────────────────

  function renderTalenti(char) {
    _renderFeatsList(char.feats       || [], el('feats-list'), false, 'feat-name-datalist');
    _renderFeatsList(char.classFeatures|| [], el('features-list'), true);
    _renderFeatsList(char.racialTraits || [], el('racial-list'));
  }

  function _renderFeatsList(items, container, isFeature = false, nameListId = null) {
    if (!container) return;
    container.innerHTML = '';
    if (items.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;padding:0.3rem 0">Nessun elemento.</p>';
      return;
    }
    items.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = isFeature ? 'feature-card' : 'feat-card';
      card.dataset.index = i;

      const levelBadge = isFeature && item.levelGained
        ? `<span class="feature-level-badge">Liv.${item.levelGained}</span>` : '';
      const usesHtml = isFeature && item.usesPerDay !== undefined ? `
        <div class="feature-uses">
          Usi giornalieri:
          <input type="number" class="field-input feat-uses-left" style="width:46px"
                 value="${item.usesLeft||0}" min="0" title="Usati oggi" />
          /
          <input type="number" class="field-input feat-uses-day" style="width:46px"
                 value="${item.usesPerDay||0}" min="0" title="Totale/giorno" />
        </div>` : '';
      const typeInput = !isFeature
        ? `<input type="text" class="field-input feat-type"
                  style="width:85px;font-size:0.78rem" placeholder="Tipo"
                  value="${_e(item.type||'')}" />` : '';

      card.innerHTML = `
        <div class="${isFeature ? 'feature-card-header' : 'feat-card-header'}">
          <input type="text" class="${isFeature ? 'feature-name' : 'feat-name'}"
                 placeholder="Nome" value="${_e(item.name||'')}"${nameListId ? ` list="${nameListId}"` : ''} />
          ${levelBadge}
          ${typeInput}
          <button class="btn btn-danger btn-sm feat-remove" title="Rimuovi"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <textarea class="${isFeature ? 'feature-desc' : 'feat-desc'}" rows="2"
                  placeholder="Descrizione, effetti, prerequisiti...">${_e(item.description||'')}</textarea>
        ${usesHtml}
      `;
      container.appendChild(card);
    });
  }

  // ── Incantesimi ───────────────────────────────────────────────────────────

  /** HTML per una singola riga dell'elenco incantesimi. */
  function _spellEntryHtml(spell, si) {
    return `
      <div class="spell-entry" data-index="${si}">
        <div class="spell-entry-header">
          <span class="spell-level-badge">Lv ${spell.spellLevel||0}</span>
          <input type="text" class="spell-name-input" list="spell-name-datalist"
                 placeholder="Nome incantesimo" value="${_e(spell.name||'')}" />
          <label class="spell-prepared-label" title="Segnare come preparato">
            <input type="checkbox" class="spell-prepared" ${spell.prepared ? 'checked' : ''} />
            Prep.
          </label>
          <button class="btn btn-ghost btn-sm spell-expand"
                  title="Espandi" style="font-size:.75rem"><i class="fa-solid fa-chevron-down"></i></button>
          <button class="btn btn-danger btn-sm spell-remove"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="spell-details">
          <div class="spell-detail-row">
            <div class="field-group">
              <label>Livello</label>
              <input type="number" class="field-input field-narrow spell-lvl"
                     min="0" max="9" value="${spell.spellLevel||0}" />
            </div>
            <div class="field-group">
              <label>Scuola</label>
              <input type="text" class="field-input spell-school"
                     value="${_e(spell.school||'')}" placeholder="Trasmutazione..." />
            </div>
            <div class="field-group">
              <label>Sottoscuola</label>
              <input type="text" class="field-input spell-subschool"
                     value="${_e(spell.subschool||'')}" placeholder="Creazione..." />
            </div>
            <div class="field-group">
              <label>Descrittori</label>
              <input type="text" class="field-input spell-descriptor"
                     value="${_e(spell.descriptor||'')}" placeholder="Fuoco, Male..." />
            </div>
            <div class="field-group">
              <label>Componenti</label>
              <input type="text" class="field-input spell-components"
                     value="${_e(spell.components||'')}" placeholder="V, S, M" />
            </div>
            <div class="field-group">
              <label>Tempo comp.</label>
              <input type="text" class="field-input spell-casttime"
                     value="${_e(spell.castingTime||'')}" placeholder="1 az. std" />
            </div>
            <div class="field-group">
              <label>Gittata</label>
              <input type="text" class="field-input spell-range"
                     value="${_e(spell.range||'')}" placeholder="Personale / 30 m" />
            </div>
            <div class="field-group">
              <label>Bersaglio</label>
              <input type="text" class="field-input spell-target"
                     value="${_e(spell.target||'')}" placeholder="1 creatura..." />
            </div>
            <div class="field-group">
              <label>Durata</label>
              <input type="text" class="field-input spell-duration"
                     value="${_e(spell.duration||'')}" placeholder="1 min/lv" />
            </div>
            <div class="field-group">
              <label>Tiro Sal.</label>
              <input type="text" class="field-input spell-save"
                     value="${_e(spell.savingThrow||'')}" placeholder="Nessuno" />
            </div>
            <div class="field-group">
              <label style="white-space:nowrap">Res. Inc.</label>
              <select class="field-input field-narrow spell-sr">
                <option value="no"  ${(spell.spellResistance||'no')==='no'  ?'selected':''}>No</option>
                <option value="si"  ${(spell.spellResistance||'no')==='si'  ?'selected':''}>Sì</option>
              </select>
            </div>
          </div>
          <textarea class="feat-desc" rows="2"
                    placeholder="Descrizione breve...">${_e(spell.description||'')}</textarea>
        </div>
      </div>`;
  }

  /** Genera la griglia slot 0–9 per un blocco incantatrice. */
  function _spellSlotGridHtml(block) {
    let html = '';
    for (let lv = 0; lv <= 9; lv++) {
      const total = block.spellsPerDay[lv] || 0;
      const used  = block.spellsUsed[lv]   || 0;
      html += `
        <div class="spell-level-box${total > 0 ? ' has-slots' : ''}" data-level="${lv}">
          <span class="spell-level-label">Lv ${lv}</span>
          <div class="spell-slots-row">
            <input type="number" class="field-input spell-used spell-slot-input"
                   min="0" value="${used}" title="Usati" />
            /
            <input type="number" class="field-input spell-total spell-slot-input"
                   min="0" value="${total}" title="Al giorno" />
          </div>
        </div>`;
    }
    return html;
  }

  function renderIncantesimi(char) {
    const container = el('caster-blocks-container');
    if (!container) return;

    container.innerHTML = '';
    const blocks = char.spells || [];

    if (blocks.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem;padding:1rem;text-align:center">Nessuna classe incantatrice — viene assegnata automaticamente dalle classi del personaggio.</p>';
      return;
    }

    const asf = char.armor?.asf || 0;

    blocks.forEach((block, bi) => {
      const dc = 10 + Combat.mod(char, block.ability || 'cha');

      let spellsHtml = (block.known || []).map((sp, si) => _spellEntryHtml(sp, si)).join('');
      if (!spellsHtml) {
        spellsHtml = '<p style="color:var(--text-muted);font-size:0.85rem;padding:0.3rem 0">Nessun incantesimo — aggiungi.</p>';
      }

      const section = document.createElement('div');
      section.className = 'caster-block';
      section.dataset.blockIdx = bi;
      section.innerHTML = `
        <div class="section-block">
          <div class="caster-block-header">
            <div class="field-group">
              <label>Classe Incantatrice</label>
              <input type="text" class="field-input caster-class-name"
                     value="${_e(block.className)}" placeholder="es. Mago" />
            </div>
            <div class="field-group">
              <label>Liv. Incantatore</label>
              <input type="number" class="field-input field-narrow caster-level"
                     min="0" value="${block.casterLevel}" />
            </div>
            <div class="field-group">
              <label>Caratteristica</label>
              <select class="field-input caster-ability">
                <option value="cha"${block.ability==='cha'?' selected':''}>CAR</option>
                <option value="int"${block.ability==='int'?' selected':''}>INT</option>
                <option value="wis"${block.ability==='wis'?' selected':''}>SAG</option>
              </select>
            </div>
            <div class="stat-box-small">
              <span class="stat-label">CD base</span>
              <span class="stat-value caster-dc">${dc}</span>
              <small>10 + lv + mod car.</small>
            </div>
            <div class="stat-box-small">
              <span class="stat-label">FIA armatura</span>
              <span class="stat-value caster-asf">${asf}%</span>
            </div>
            <button class="btn btn-ghost btn-sm caster-remove-btn"
                    title="Rimuovi classe incantatrice">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <h3 style="margin-top:1rem">Slot Incantesimi al Giorno</h3>
          <div class="spells-per-day-grid">${_spellSlotGridHtml(block)}</div>
          <div class="section-header" style="margin-top:1rem">
            <h3>Incantesimi Conosciuti</h3>
            <div style="display:flex;gap:0.4rem">
              <button class="btn btn-sm btn-ghost caster-search-spell-btn" title="Cerca nel database">
                <i class="fa-solid fa-magnifying-glass"></i> Cerca
              </button>
              <button class="btn btn-sm btn-secondary caster-add-spell-btn">
                <i class="fa-solid fa-plus"></i> Aggiungi
              </button>
            </div>
          </div>
          <div class="spells-list">${spellsHtml}</div>
        </div>`;
      container.appendChild(section);
    });
  }

  function _updateSpellCalcAll(char) {
    const asf = char.armor?.asf || 0;
    document.querySelectorAll('.caster-block').forEach(blockEl => {
      const bi = parseInt(blockEl.dataset.blockIdx, 10);
      const block = (char.spells || [])[bi];
      if (!block) return;
      const dc = 10 + Combat.mod(char, block.ability || 'cha');
      const dcEl  = blockEl.querySelector('.caster-dc');
      const asfEl = blockEl.querySelector('.caster-asf');
      if (dcEl)  dcEl.textContent  = dc;
      if (asfEl) asfEl.textContent = asf + '%';
    });
  }

  // ── Note ──────────────────────────────────────────────────────────────────

  function renderNote(char) {
    setVal('notes-textarea', char.notes || '');
  }

  // ── refreshCalculated ─────────────────────────────────────────────────────

  function refreshCalculated(char) {
    const c = Combat.calcAll(char);

    setText('ca-normal', c.ac);
    setText('ca-touch',  c.acTouch);
    setText('ca-flat',   c.acFlatFooted);

    const hpBonus = c.hpMax - (char.combat.hpMax || 0);
    setText('hp-temp-display', hpBonus > 0 ? '+' + hpBonus : '+0');

    // Stato vitale PF1: Normale / Disabilitato (0 PF) / Morente (< 0) / Morto (≤ -CON)
    const hpCur    = char.combat?.hpCurrent || 0;
    const conScore = c.scores?.con || 10;
    const statusEl = el('hp-status');
    if (statusEl) {
      let txt = 'Normale', cls = 'hp-status-normal';
      if (hpCur <= -conScore) { txt = 'Morto';        cls = 'hp-status-dead';     }
      else if (hpCur < 0)     { txt = 'Morente';      cls = 'hp-status-dying';    }
      else if (hpCur === 0)   { txt = 'Disabilitato'; cls = 'hp-status-disabled'; }
      statusEl.textContent = txt;
      statusEl.className   = 'hp-status-badge ' + cls;
    }

    setText('initiative-total', sign(c.initiative.total));
    setText('speed-total',      c.speed + ' m');
    setText('cmb-total',        sign(c.cmb));
    setText('cmd-total',        c.cmd);
    setText('save-fort',        sign(c.fort.total));
    setText('save-ref',         sign(c.ref.total));
    setText('save-will',        sign(c.will.total));
    setText('rage-rounds-total', c.rageRoundsTotal);
    setText('rage-rounds-left',  c.rageRoundsLeft);

    // Risorse di classe
    setText('bard-rounds-max', c.bardPerfMax);
    setText('ki-max',          c.kiMax);
    const sd = c.sneakDice;
    setText('sneak-dice', sd > 0 ? sd + 'd6' : '—');

    // Aggiorna le card caratteristiche se renderizzate
    ABILITIES.forEach(ab => {
      const modEl = el(`ab-${ab.key}-mod`);
      const effEl = el(`ab-${ab.key}-effective`);
      if (modEl) {
        const m = c.scores[ab.key + 'Mod'];
        modEl.textContent = sign(m);
        modEl.className   = 'ability-mod ' + (m >= 0 ? 'positive' : 'negative');
      }
      if (effEl) {
        const boosted = char.rage?.active && (ab.key === 'str' || ab.key === 'con');
        effEl.innerHTML = `Eff: <strong>${c.scores[ab.key]}</strong>${boosted ? ' 🔥' : ''}`;
      }
    });

    _updateSpellCalcAll(char);
    _updateConditionsBanner(char);
    _updateWeight(char);
  }

  function _updateConditionsBanner(char) {
    const banner = el('conditions-banner');
    if (!banner) return;
    const conds = char.conditions || [];
    const all   = [...conds, ...(char.rage?.active ? ['⚔ IN IRA'] : [])];
    if (all.length === 0) {
      banner.classList.add('hidden');
      banner.innerHTML = '';
    } else {
      banner.classList.remove('hidden');
      banner.innerHTML = '⚠ ' + all.map(c => `<span class="condition-tag">${_e(c)}</span>`).join(' ');
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // EVENT BINDING (una sola volta)
  // ══════════════════════════════════════════════════════════════════════════

  function _bindAll() {
    _initClassDatalist();
    _initSpellDatalist();
    _initFeatDatalist();
    _bindTabNav();
    _bindSommario();
    _bindAbilities();
    _bindCombat();
    _bindSkills();
    _bindWeapons();
    _bindEquip();
    _bindFeats();
    _bindSpells();
    _bindNotes();
  }

  // Popola il datalist con tutti i nomi classe da ClassConfig
  function _initClassDatalist() {
    const dl = document.getElementById('class-datalist');
    if (!dl || typeof ClassConfig === 'undefined') return;
    dl.innerHTML = '';
    ClassConfig.CLASSES.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      dl.appendChild(opt);
    });
  }

  // Popola il datalist con tutti i nomi talento da PF1_FEATS_DB
  function _initFeatDatalist() {
    const dl = document.getElementById('feat-name-datalist');
    if (!dl || typeof PF1_FEATS_DB === 'undefined') return;
    dl.innerHTML = '';
    PF1_FEATS_DB.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.name;
      dl.appendChild(opt);
    });
  }

  // Popola il datalist con tutti i nomi incantesimo da PF1_SPELLS_DB
  function _initSpellDatalist() {
    const dl = document.getElementById('spell-name-datalist');
    if (!dl || typeof PF1_SPELLS_DB === 'undefined') return;
    dl.innerHTML = '';
    PF1_SPELLS_DB.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.name;
      dl.appendChild(opt);
    });
  }

  function _applySkillHighlights() {
    const set = new Set(_classSkillIds);
    document.querySelectorAll('#skills-tbody .skill-row').forEach(tr => {
      tr.classList.toggle('skill-from-class', set.size > 0 && set.has(tr.dataset.id));
    });
  }

  function _bindTabNav() {
    const nav    = el('tab-nav');
    const burger = el('tab-burger');
    const label  = el('tab-active-label');

    // Burger toggle
    burger?.addEventListener('click', e => {
      e.stopPropagation();
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });

    // Close when tapping outside the nav
    document.addEventListener('click', e => {
      if (nav && !nav.contains(e.target) && nav.classList.contains('open')) {
        nav.classList.remove('open');
        burger?.setAttribute('aria-expanded', 'false');
      }
    });

    nav?.addEventListener('click', e => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      el('tab-' + btn.dataset.tab)?.classList.add('active');
      // Close burger menu and update the active section label
      nav.classList.remove('open');
      burger?.setAttribute('aria-expanded', 'false');
      if (label) label.textContent = btn.textContent.trim();
    });
  }

  // ── Adattamento interfaccia per classe ────────────────────────────────────

  /**
   * Aggiorna la visibilità e l'enfasi di tab/sezioni in base alle classi del personaggio.
   * Va chiamata ogni volta che char.meta.classes cambia.
   * @param {object} char
   */
  function applyClassProfile(char) {
    const classEntries = (char.meta?.classes || [])
      .map(c => ({ name: c.className || '', archetype: c.archetype || '' }))
      .filter(e => e.name);

    const profile = (typeof ClassConfig !== 'undefined')
      ? ClassConfig.getMergedProfile(classEntries)
      : { hasSpellsTab: true, primaryTabs: [], features: { rage: true } };

    // 1. Tab Incantesimi: nascosta per classi senza incantesimi
    const incBtn   = document.querySelector('.tab-btn[data-tab="incantesimi"]');
    const incPanel = document.getElementById('tab-incantesimi');
    const hideSpells = !profile.hasSpellsTab;
    if (incBtn)   incBtn.classList.toggle('tab-class-hidden', hideSpells);
    if (incPanel) incPanel.classList.toggle('tab-class-hidden', hideSpells);

    // Se la tab incantesimi era attiva e viene nascosta → torna a Sommario
    if (hideSpells && incPanel?.classList.contains('active')) {
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      const somBtn = document.querySelector('.tab-btn[data-tab="sommario"]');
      document.getElementById('tab-sommario')?.classList.add('active');
      somBtn?.classList.add('active');
      const lbl = el('tab-active-label');
      if (lbl && somBtn) lbl.textContent = somBtn.textContent.trim();
    }

    // 2. Blocco Ira: mostrato solo per classi con rage
    const rageBlock = el('rage-block');
    if (rageBlock) rageBlock.classList.toggle('hidden', !profile.features.rage);

    // 3. Blocchi risorse di classe
    const blocks = [
      ['bard-block',    profile.features.bardPerf],
      ['ki-block',      profile.features.ki],
      ['channel-block', profile.features.channel],
      ['sneak-block',   profile.features.sneak],
    ];
    blocks.forEach(([id, show]) => {
      el(id)?.classList.toggle('hidden', !show);
    });

    // 4. Tab primarie: evidenziazione visiva
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('tab-primary', profile.primaryTabs.includes(btn.dataset?.tab));
    });

    // 5. Abilità di classe: evidenzia le righe della classe
    _classSkillIds = profile.classSkillIds || [];
    _applySkillHighlights();

    // 6. Auto-fill BAB (calcolato dalla progressione di tutte le classi)
    _autoFillBab(char);

    // 7. Sincronizza blocchi incantatrici da tutte le classi con hasSpellsTab
    _syncCasterBlocksFromClasses(char);

    // 8. Auto-fill usi Canalizzare (3 + mod CHA, se ha channel)
    if (profile.features.channel) _autoFillChannelUses(char);
  }

  /** Calcola e imposta il BAB sommando le progressioni di tutte le classi. */
  function _autoFillBab(char) {
    if (typeof ClassConfig === 'undefined') return;
    const classes = char.meta?.classes || [];
    if (classes.length === 0) return;
    let babTotal = 0;
    let hasKnown = false;
    for (const cls of classes) {
      const cfg = ClassConfig.findByName(cls.className);
      if (!cfg) continue;
      hasKnown = true;
      const lvl = cls.level || 0;
      if      (cfg.bab === 'full') babTotal += lvl;
      else if (cfg.bab === '3_4')  babTotal += Math.floor(lvl * 3 / 4);
      else                         babTotal += Math.floor(lvl / 2);
    }
    if (!hasKnown) return;
    const rounded = Math.floor(babTotal);
    char.combat.bab = rounded;
    setVal('bab-input', rounded);
    refreshCalculated(char);
    renderArmi(char);
  }

  /**
   * Per ogni classe del personaggio con hasSpellsTab, assicura che esista
   * un blocco corrispondente in char.spells. Non sovrascrive blocchi esistenti.
   * Rimuove blocchi di classi non più presenti nel personaggio.
   */
  function _syncCasterBlocksFromClasses(char) {
    if (typeof ClassConfig === 'undefined') return;
    if (!Array.isArray(char.spells)) char.spells = [];
    const classes = char.meta?.classes || [];

    // Classi incantatrici del personaggio (quelle con hasSpellsTab: true)
    const casterClasses = classes
      .map(cls => ClassConfig.findByName(cls.className))
      .filter(cfg => cfg?.hasSpellsTab);

    // Rimuovi blocchi per classi non più nel personaggio (ma solo se vuoti)
    char.spells = char.spells.filter(block => {
      const stillPresent = casterClasses.some(cfg => cfg.id === block.classId || cfg.name === block.className);
      const isEmpty = !block.known?.length &&
                      block.casterLevel === 0 &&
                      (block.spellsPerDay || []).every(s => s === 0);
      return stillPresent || !isEmpty;  // conserva blocchi non vuoti anche se la classe è stata rimossa
    });

    // Aggiungi blocchi mancanti per le classi incantatrici del personaggio
    let changed = false;
    for (const cfg of casterClasses) {
      const exists = char.spells.some(b => b.classId === cfg.id || b.className === cfg.name);
      if (!exists) {
        char.spells.push(Character.defaultCasterBlock(cfg.id, cfg.name, cfg.spellAbility || 'cha'));
        changed = true;
      }
    }

    if (changed) renderIncantesimi(char);
  }

  /** Calcola gli usi di Canalizzare = 3 + mod CHA (standard Chierico PF1). */
  function _autoFillChannelUses(char) {
    if (!char.channel) return;
    const chaMod = (typeof Combat !== 'undefined') ? Combat.mod(char, 'cha') : 0;
    const max = Math.max(1, 3 + chaMod);
    // Aggiorna solo se non è stato modificato manualmente (usesMax === usesLeft o è il default)
    if (char.channel.usesMax === char.channel.usesLeft || char.channel.usesMax === 3) {
      char.channel.usesMax  = max;
      char.channel.usesLeft = Math.min(char.channel.usesLeft, max);
      setVal('channel-uses-max',  max);
      setVal('channel-uses-left', char.channel.usesLeft);
    }
  }

  function _bindSommario() {
    const text = [
      ['meta-name',       (v, c) => { c.meta.name = v; el('char-header-name').textContent = v||'Personaggio'; }],
      ['meta-player',     (v, c) => c.meta.playerName  = v],
      ['meta-race',       (v, c) => c.meta.race        = v],
      ['meta-alignment',  (v, c) => c.meta.alignment   = v],
      ['meta-deity',      (v, c) => c.meta.deity       = v],
      ['meta-size',       (v, c) => { c.meta.size = v; refreshCalculated(c); }],
      ['meta-gender',     (v, c) => c.meta.gender      = v],
      ['meta-age',        (v, c) => c.meta.age         = v],
      ['meta-height',     (v, c) => c.meta.height      = v],
      ['meta-weight',     (v, c) => c.meta.weight      = v],
      ['meta-eyes',       (v, c) => c.meta.eyes        = v],
      ['meta-hair',       (v, c) => c.meta.hair        = v],
      ['meta-homeland',    (v, c) => c.meta.homeland     = v],
      ['meta-background',  (v, c) => c.meta.background  = v],
      ['meta-xp',         (v, c) => c.meta.xp          = toInt(v)],
      ['meta-languages',  (v, c) => c.meta.languages   = v.split(',').map(s=>s.trim()).filter(Boolean)],
    ];
    text.forEach(([id, fn]) => {
      el(id)?.addEventListener('change', e => { if (_char) { fn(e.target.value, _char); _dirty(); } });
    });

    // Immagine
    el('char-image-wrapper')?.addEventListener('click', () => el('input-image')?.click());
    el('input-image')?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file || !_char) return;
      const reader = new FileReader();
      reader.onload = ev => {
        _char.meta.imageDataUrl = ev.target.result;
        const img = el('char-image'), ph = el('char-image-placeholder');
        img.src = ev.target.result; img.classList.remove('hidden');
        ph.classList.add('hidden'); el('btn-remove-image')?.classList.remove('hidden');
        _dirty();
      };
      reader.readAsDataURL(file);
    });
    el('btn-remove-image')?.addEventListener('click', e => {
      e.stopPropagation();
      if (!_char) return;
      _char.meta.imageDataUrl = '';
      el('char-image').src = ''; el('char-image').classList.add('hidden');
      el('char-image-placeholder')?.classList.remove('hidden');
      el('btn-remove-image')?.classList.add('hidden');
      _dirty();
    });

    // Classi (event delegation)
    el('classes-list')?.addEventListener('change', e => {
      if (!_char) return;
      const row = e.target.closest('.class-row');
      if (!row) return;
      const i = toInt(row.dataset.index, -1);
      if (i < 0 || !_char.meta.classes[i]) return;
      if (e.target.classList.contains('cls-name')) {
        const val = e.target.value;
        // Warn se la classe è già presente in un'altra riga
        const isDuplicate = _char.meta.classes.some((c, idx) =>
          idx !== i && c.className.toLowerCase() === val.toLowerCase() && val !== ''
        );
        e.target.classList.toggle('input-warning', isDuplicate);
        if (isDuplicate) {
          e.target.title = 'Classe già presente — usa il livello nella riga esistente';
        } else {
          e.target.title = '';
        }
        _char.meta.classes[i].className = val;
        // Auto-fill hitDie se la classe è nel config
        const cfg = (typeof ClassConfig !== 'undefined') ? ClassConfig.findByName(val) : null;
        if (cfg) {
          _char.meta.classes[i].hitDie = cfg.hitDie;
          const hdInput = row.querySelector('.cls-hd');
          if (hdInput) hdInput.value = cfg.hitDie;
          // Aggiorna la datalist degli archetipi per questa riga
          const datalist = row.querySelector('datalist');
          if (datalist) {
            datalist.innerHTML = ClassConfig.getArchetypes(cfg.id)
              .map(a => `<option value="${_e(a.name)}">`) .join('');
          }
        } else {
          // Classe non riconosciuta: svuota la datalist archetipi
          const datalist = row.querySelector('datalist');
          if (datalist) datalist.innerHTML = '';
        }
        // Reset archetipo se la classe cambia
        const archInput = row.querySelector('.cls-archetype');
        if (archInput) { archInput.value = ''; _char.meta.classes[i].archetype = ''; }
      }
      if (e.target.classList.contains('cls-archetype')) {
        _char.meta.classes[i].archetype = e.target.value;
      }
      if (e.target.classList.contains('cls-level')) _char.meta.classes[i].level = toInt(e.target.value, 1);
      if (e.target.classList.contains('cls-hd'))    _char.meta.classes[i].hitDie = toInt(e.target.value, 8);
      _char.meta.totalLevel = _char.meta.classes.reduce((s,c)=>s+(c.level||0),0);
      setText('total-level-display', _char.meta.totalLevel);
      refreshCalculated(_char);
      applyClassProfile(_char);  // aggiorna visibilità sezioni per la classe
      _dirty();
    });
    el('classes-list')?.addEventListener('click', e => {
      if (!_char || !e.target.classList.contains('cls-remove')) return;
      const row = e.target.closest('.class-row');
      const i   = toInt(row?.dataset.index, -1);
      if (i < 0) return;
      _char.meta.classes.splice(i, 1);
      _char.meta.totalLevel = _char.meta.classes.reduce((s,c)=>s+(c.level||0),0);
      _renderClassesList(_char);
      refreshCalculated(_char);
      applyClassProfile(_char);  // ricalcola dopo rimozione classe
      _dirty();
    });
    el('btn-add-class')?.addEventListener('click', () => {
      if (!_char) return;
      _char.meta.classes.push({ className:'', level:1, hitDie:8, archetype:'' });
      _renderClassesList(_char);
      applyClassProfile(_char);  // ricalcola dopo aggiunta classe
      _dirty();
    });
  }

  function _bindAbilities() {
    el('abilities-grid')?.addEventListener('change', e => {
      if (!_char) return;
      const card = e.target.closest('.ability-card');
      if (!card) return;
      const key = card.dataset.key;
      if (e.target.classList.contains('ability-score-input')) _char.abilities[key] = toInt(e.target.value, 10);
      if (e.target.id?.endsWith('-racial'))  _char.abilities[key+'Racial']  = toInt(e.target.value);
      if (e.target.id?.endsWith('-enhance')) _char.abilities[key+'Enhance'] = toInt(e.target.value);
      if (e.target.id?.endsWith('-temp'))    _char.abilities[key+'Temp']    = toInt(e.target.value);
      refreshCalculated(_char);
      renderAbilita(_char);
      _dirty();
    });

    el('conditions-checkboxes')?.addEventListener('change', e => {
      if (!_char || e.target.type !== 'checkbox') return;
      const cond = e.target.value;
      if (e.target.checked) {
        if (!_char.conditions.includes(cond)) _char.conditions.push(cond);
      } else {
        _char.conditions = _char.conditions.filter(c => c !== cond);
      }
      e.target.closest('label')?.classList.toggle('active', e.target.checked);
      refreshCalculated(_char);
      renderAbilita(_char);
      _dirty();
    });

    el('btn-toggle-rage')?.addEventListener('click', () => {
      if (!_char) return;
      _char.rage.active = !_char.rage.active;
      el('btn-toggle-rage').textContent = _char.rage.active ? "Esci dall'Ira" : 'Entra in Ira';
      el('rage-block')?.classList.toggle('active', _char.rage.active);
      refreshCalculated(_char);
      renderAbilita(_char);
      _dirty();
    });
    el('rage-rounds-used')?.addEventListener('change', e => {
      if (_char) { _char.rage.roundsUsed = toInt(e.target.value); refreshCalculated(_char); _dirty(); }
    });
    el('rage-bloodline')?.addEventListener('change', e => {
      if (_char) { _char.rage.bloodlineName = e.target.value; _dirty(); }
    });

    // Poteri di Stirpe
    el('btn-add-bloodline-power')?.addEventListener('click', () => {
      if (!_char) return;
      _char.rage.bloodlinePowers.push({
        id: Character.generateId(), name:'', levelRequired:1,
        description:'', usesPerDay:0, usesLeft:0
      });
      _renderBloodlinePowers(_char); _dirty();
    });
    el('bloodline-powers-list')?.addEventListener('change', e => {
      if (!_char) return;
      const entry = e.target.closest('.bloodline-power-entry');
      if (!entry) return;
      const i = toInt(entry.dataset.index, -1);
      if (i < 0 || !_char.rage.bloodlinePowers[i]) return;
      const pw = _char.rage.bloodlinePowers[i];
      if (e.target.classList.contains('bp-name'))      pw.name          = e.target.value;
      if (e.target.classList.contains('bp-level-req')) pw.levelRequired = toInt(e.target.value, 1);
      if (e.target.classList.contains('bp-uses-left')) pw.usesLeft      = toInt(e.target.value);
      if (e.target.classList.contains('bp-uses-max'))  pw.usesPerDay    = toInt(e.target.value);
      if (e.target.tagName === 'TEXTAREA')             pw.description   = e.target.value;
      _dirty();
    });
    el('bloodline-powers-list')?.addEventListener('click', e => {
      if (!_char) return;
      if (e.target.classList.contains('bp-expand') || e.target.closest('.bp-expand')) {
        const entry = e.target.closest('.bloodline-power-entry');
        entry?.classList.toggle('expanded');
        e.target.closest('.bp-expand')?.classList.toggle('expanded');
        return;
      }
      if (e.target.classList.contains('bp-remove') || e.target.closest('.bp-remove')) {
        const entry = e.target.closest('.bloodline-power-entry');
        const i = toInt(entry?.dataset.index, -1);
        if (i >= 0) { _char.rage.bloodlinePowers.splice(i, 1); _renderBloodlinePowers(_char); _dirty(); }
      }
    });

    // Esibizione Bardica
    el('btn-bard-reset')?.addEventListener('click', () => {
      if (!_char) return;
      const max = Combat.calcBardPerfMax(_char);
      _char.bardPerf.roundsLeft = max;
      setVal('bard-rounds-left', max);
      _dirty();
    });
    el('bard-rounds-left')?.addEventListener('change', e => {
      if (_char) { _char.bardPerf.roundsLeft = toInt(e.target.value); _dirty(); }
    });
    el('bard-extra')?.addEventListener('change', e => {
      if (_char) { _char.bardPerf.extra = toInt(e.target.value); refreshCalculated(_char); _dirty(); }
    });
    el('bard-active')?.addEventListener('change', e => {
      if (_char) { _char.bardPerf.active = e.target.value; _dirty(); }
    });

    // Ki Pool
    el('btn-ki-reset')?.addEventListener('click', () => {
      if (!_char) return;
      const max = Combat.calcKiMax(_char);
      _char.ki.current = max;
      setVal('ki-current', max);
      _dirty();
    });
    el('ki-current')?.addEventListener('change', e => {
      if (_char) { _char.ki.current = toInt(e.target.value); _dirty(); }
    });
    el('ki-extra')?.addEventListener('change', e => {
      if (_char) { _char.ki.extra = toInt(e.target.value); refreshCalculated(_char); _dirty(); }
    });

    // Canalizzare Energia
    el('btn-channel-reset')?.addEventListener('click', () => {
      if (!_char) return;
      const max = _char.channel?.usesMax || 3;
      _char.channel.usesLeft = max;
      setVal('channel-uses-left', max);
      _dirty();
    });
    el('channel-type')?.addEventListener('change', e => {
      if (_char) { _char.channel.type = e.target.value; _dirty(); }
    });
    el('channel-dice')?.addEventListener('change', e => {
      if (_char) { _char.channel.diceCount = toInt(e.target.value); _dirty(); }
    });
    el('channel-uses-left')?.addEventListener('change', e => {
      if (_char) { _char.channel.usesLeft = toInt(e.target.value); _dirty(); }
    });
    el('channel-uses-max')?.addEventListener('change', e => {
      if (_char) { _char.channel.usesMax = toInt(e.target.value); _dirty(); }
    });

    // Attacco Furtivo
    el('sneak-extra')?.addEventListener('change', e => {
      if (_char) { _char.sneak.extra = toInt(e.target.value); refreshCalculated(_char); _dirty(); }
    });
  }

  function _bindCombat() {
    const fields = [
      ['hp-max',         (v,c)=>{ c.combat.hpMax=toInt(v); refreshCalculated(c); }],
      ['hp-current',     (v,c)=>  c.combat.hpCurrent=toInt(v)],
      ['hp-nonlethal',   (v,c)=>  c.combat.hpNonLethal=toInt(v)],
      ['ac-armor',       (v,c)=>{ c.combat.ac.armorBonus=toInt(v);   refreshCalculated(c); }],
      ['ac-shield',      (v,c)=>{ c.combat.ac.shieldBonus=toInt(v);  refreshCalculated(c); }],
      ['ac-natural',     (v,c)=>{ c.combat.ac.naturalArmor=toInt(v); refreshCalculated(c); }],
      ['ac-deflection',  (v,c)=>{ c.combat.ac.deflection=toInt(v);   refreshCalculated(c); }],
      ['ac-dodge',       (v,c)=>{ c.combat.ac.dodge=toInt(v);        refreshCalculated(c); }],
      ['ac-misc',        (v,c)=>{ c.combat.ac.misc=toInt(v);         refreshCalculated(c); }],
      ['armor-name',     (v,c)=>  c.armor.name=v],
      ['armor-type',     (v,c)=>  c.armor.type=v],
      ['armor-bonus',    (v,c)=>{ c.armor.bonus=toInt(v); c.combat.ac.armorBonus=toInt(v); setVal('ac-armor',v); refreshCalculated(c); }],
      ['armor-maxdex',   (v,c)=>  c.armor.maxDex=(v===''?null:toInt(v))],
      ['armor-acp',      (v,c)=>{ c.armor.acp=toInt(v); refreshCalculated(c); }],
      ['armor-asf',      (v,c)=>{ c.armor.asf=toInt(v); _updateSpellCalcAll(c); }],
      ['armor-speed',    (v,c)=>  c.armor.speed=toInt(v)],
      ['armor-weight',   (v,c)=>{ c.armor.weight=toF(v); _updateWeight(c); }],
      ['bab-input',      (v,c)=>{ c.combat.bab=toInt(v); refreshCalculated(c); renderArmi(c); }],
      ['initiative-misc',(v,c)=>{ c.combat.initiative.misc=toInt(v); refreshCalculated(c); }],
      ['speed-base',     (v,c)=>{ c.combat.speed=toInt(v); refreshCalculated(c); }],
      ['speed-swim',     (v,c)=>{ if (!c.combat.speedExtra) c.combat.speedExtra={}; c.combat.speedExtra.nuoto   = toInt(v); }],
      ['speed-fly',      (v,c)=>{ if (!c.combat.speedExtra) c.combat.speedExtra={}; c.combat.speedExtra.volo    = toInt(v); }],
      ['speed-climb',    (v,c)=>{ if (!c.combat.speedExtra) c.combat.speedExtra={}; c.combat.speedExtra.scalare = toInt(v); }],
      ['speed-burrow',   (v,c)=>{ if (!c.combat.speedExtra) c.combat.speedExtra={}; c.combat.speedExtra.scavare = toInt(v); }],
      ['save-fort-base', (v,c)=>{ c.combat.saves.fortBase=toInt(v);  refreshCalculated(c); }],
      ['save-fort-misc', (v,c)=>{ c.combat.saves.fortMisc=toInt(v);  refreshCalculated(c); }],
      ['save-ref-base',  (v,c)=>{ c.combat.saves.refBase=toInt(v);   refreshCalculated(c); }],
      ['save-ref-misc',  (v,c)=>{ c.combat.saves.refMisc=toInt(v);   refreshCalculated(c); }],
      ['save-will-base', (v,c)=>{ c.combat.saves.willBase=toInt(v);  refreshCalculated(c); }],
      ['save-will-misc', (v,c)=>{ c.combat.saves.willMisc=toInt(v);  refreshCalculated(c); }],
      ['cmb-misc',       (v,c)=>{ c.combat.cmbMisc=toInt(v); refreshCalculated(c); }],
      ['cmd-misc',       (v,c)=>{ c.combat.cmdMisc=toInt(v); refreshCalculated(c); }],
      ['dr-input',       (v,c)=>  c.combat.dr=v],
      ['sr-input',        (v,c)=>  c.combat.sr=toInt(v)],
      ['negative-levels', (v,c)=>{ c.negativeLevels=toInt(v); refreshCalculated(c); renderArmi(c); }],
      ['immunities-input',(v,c)=> c.combat.immunities=v.split(',').map(s=>s.trim()).filter(Boolean)],
      ['res-fire',  (v,c)=> c.combat.resistances.fuoco=toInt(v)],
      ['res-cold',  (v,c)=> c.combat.resistances.freddo=toInt(v)],
      ['res-elec',  (v,c)=> c.combat.resistances['elettricità']=toInt(v)],
      ['res-acid',  (v,c)=> c.combat.resistances.acido=toInt(v)],
      ['res-sonic', (v,c)=> c.combat.resistances.sonoro=toInt(v)],
    ];
    fields.forEach(([id, fn]) => {
      el(id)?.addEventListener('change', e => { if (_char) { fn(e.target.value, _char); _dirty(); } });
    });
    el('btn-search-armor')?.addEventListener('click', () => {
      if (!_char || typeof SearchModal === 'undefined') return;
      SearchModal.openEquipment('armor', item => {
        const cap = s => s ? s[0].toUpperCase() + s.slice(1) : '';
        _char.armor.name   = item.name;
        _char.armor.type   = cap(item.armorType || '');
        _char.armor.bonus  = item.bonus  || 0;
        _char.armor.maxDex = (item.maxDex != null) ? item.maxDex : null;
        _char.armor.acp    = item.acp    || 0;
        _char.armor.asf    = item.asf    || 0;
        _char.armor.speed  = item.speed  || 0;
        _char.armor.weight = item.weight || 0;
        _char.combat.ac.armorBonus = item.bonus || 0;
        setVal('armor-name',   _char.armor.name);
        setVal('armor-type',   _char.armor.type);
        setVal('armor-bonus',  _char.armor.bonus);
        setVal('armor-maxdex', _char.armor.maxDex ?? '');
        setVal('armor-acp',    _char.armor.acp);
        setVal('armor-asf',    _char.armor.asf);
        setVal('armor-speed',  _char.armor.speed);
        setVal('armor-weight', _char.armor.weight);
        setVal('ac-armor',     _char.armor.bonus);
        refreshCalculated(_char); _dirty();
      });
    });
  }

  function _bindSkills() {
    el('skills-tbody')?.addEventListener('change', e => {
      if (!_char) return;
      const row = e.target.closest('tr');
      if (!row) return;
      const skillId = row.dataset.id;
      let rec = _char.skills.find(s => s.id === skillId);
      if (!rec) { rec = {id:skillId,ranks:0,classSkill:false,miscBonus:0}; _char.skills.push(rec); }
      if (e.target.classList.contains('skill-ranks-input')) {
        rec.ranks = Math.max(0, toInt(e.target.value));
      }
      renderAbilita(_char);
      _dirty();
    });
    el('skills-tbody')?.addEventListener('click', e => {
      if (!_char) return;
      const btn = e.target.closest('.skill-cs-btn');
      if (!btn) return;
      const row = btn.closest('tr');
      const skillId = row?.dataset.id;
      if (!skillId) return;
      let rec = _char.skills.find(s => s.id === skillId);
      if (!rec) { rec = {id:skillId,ranks:0,classSkill:false,miscBonus:0}; _char.skills.push(rec); }
      rec.classSkill = !rec.classSkill;
      btn.classList.toggle('active', rec.classSkill);
      renderAbilita(_char);
      _dirty();
    });
    el('skills-filter-trained')?.addEventListener('change', () => { if (_char) renderAbilita(_char); });
    el('skills-filter-class')?.addEventListener('change',   () => { if (_char) renderAbilita(_char); });
  }

  function _bindWeapons() {
    el('btn-search-weapon')?.addEventListener('click', () => {
      if (!_char || typeof SearchModal === 'undefined') return;
      SearchModal.openEquipment('weapon', item => {
        _char.weapons.push({
          id: Character.generateId(),
          name:        item.name,
          attackType:  item.attackType  || 'mischia',
          enhancement: 0,
          damage:      item.damage      || '1d6',
          critRange:   item.critRange   || '20',
          critMult:    item.critMult    || 2,
          range:       item.range       || 0,
          damageType:  item.damageType  || 'T',
          twoHanded:   item.twoHanded   || false,
          offHand:     false,
          attackMisc:  0, damageMisc: 0, notes: '',
        });
        renderArmi(_char); _dirty();
      });
    });
    el('btn-add-weapon')?.addEventListener('click', () => {
      if (!_char) return;
      _char.weapons.push({
        id: Character.generateId(), name:'Nuova Arma', attackType:'mischia',
        enhancement:0, damage:'1d6', critRange:'20', critMult:2, range:0,
        damageType:'T', twoHanded:false, offHand:false,
        attackMisc:0, damageMisc:0, notes:'',
      });
      renderArmi(_char); _dirty();
    });
    el('power-attack-toggle')?.addEventListener('change', () => { if (_char) renderArmi(_char); });

    el('weapons-list')?.addEventListener('change', e => {
      if (!_char) return;
      const card = e.target.closest('.weapon-card');
      if (!card) return;
      const i = toInt(card.dataset.index, -1);
      if (i < 0 || !_char.weapons[i]) return;
      const w = _char.weapons[i];
      if (e.target.classList.contains('wpn-name'))        w.name         = e.target.value;
      if (e.target.classList.contains('wpn-type'))        w.attackType   = e.target.value;
      if (e.target.classList.contains('wpn-damage'))      w.damage       = e.target.value;
      if (e.target.classList.contains('wpn-enhancement')) w.enhancement  = toInt(e.target.value);
      if (e.target.classList.contains('wpn-range'))       w.range        = toInt(e.target.value);
      if (e.target.classList.contains('wpn-crit'))        w.critRange    = e.target.value;
      if (e.target.classList.contains('wpn-critmult'))    w.critMult     = toInt(e.target.value, 2);
      if (e.target.classList.contains('wpn-damagetype'))  w.damageType   = e.target.value;
      if (e.target.classList.contains('wpn-twohanded'))   w.twoHanded    = e.target.checked;
      if (e.target.classList.contains('wpn-offhand'))     w.offHand      = e.target.checked;
      if (e.target.classList.contains('wpn-atk-misc'))    w.attackMisc   = toInt(e.target.value);
      if (e.target.classList.contains('wpn-dmg-misc'))    w.damageMisc   = toInt(e.target.value);
      if (e.target.classList.contains('wpn-notes'))       w.notes        = e.target.value;
      renderArmi(_char); _dirty();
    });
    el('weapons-list')?.addEventListener('click', e => {
      if (!_char || !e.target.classList.contains('wpn-remove')) return;
      const card = e.target.closest('.weapon-card');
      const i    = toInt(card?.dataset.index, -1);
      if (i >= 0) { _char.weapons.splice(i, 1); renderArmi(_char); _dirty(); }
    });
  }

  function _bindEquip() {
    ['pp','gp','sp','cp'].forEach(coin => {
      el('currency-' + coin)?.addEventListener('change', e => {
        if (_char) { _char.currency[coin] = toInt(e.target.value); _dirty(); }
      });
    });
    el('btn-search-item')?.addEventListener('click', () => {
      if (!_char || typeof SearchModal === 'undefined') return;
      SearchModal.openEquipment(null, item => {
        _char.equipment.push({
          id:       Character.generateId(),
          name:     item.name,
          qty:      1,
          weight:   item.weight || 0,
          cost:     item.cost   || '',
          location: 'zaino',
          worn:     false,
          notes:    '',
        });
        renderEquipaggiamento(_char); _dirty();
      });
    });
    el('btn-add-item')?.addEventListener('click', () => {
      if (!_char) return;
      _char.equipment.push({id:Character.generateId(),name:'',qty:1,weight:0,cost:'',location:'zaino',worn:false,notes:''});
      renderEquipaggiamento(_char); _dirty();
    });
    el('equipment-list')?.addEventListener('change', e => {
      if (!_char) return;
      const row = e.target.closest('.equip-item');
      if (!row) return;
      const i = toInt(row.dataset.index, -1);
      if (i < 0 || !_char.equipment[i]) return;
      const eq = _char.equipment[i];
      if (e.target.classList.contains('equip-name'))     eq.name     = e.target.value;
      if (e.target.classList.contains('equip-qty'))      { eq.qty      = toInt(e.target.value, 1); _updateWeight(_char); }
      if (e.target.classList.contains('equip-weight'))   { eq.weight   = toF(e.target.value);      _updateWeight(_char); }
      if (e.target.classList.contains('equip-cost'))     eq.cost     = e.target.value;
      if (e.target.classList.contains('equip-location')) eq.location = e.target.value;
      if (e.target.classList.contains('equip-worn'))     eq.worn     = e.target.checked;
      _dirty();
    });
    el('equipment-list')?.addEventListener('click', e => {
      if (!_char || !e.target.classList.contains('equip-remove')) return;
      const row = e.target.closest('.equip-item');
      const i   = toInt(row?.dataset.index, -1);
      if (i >= 0) { _char.equipment.splice(i, 1); renderEquipaggiamento(_char); _dirty(); }
    });
  }

  function _bindFeats() {
    el('btn-search-feat')?.addEventListener('click', () => {
      if (!_char || typeof SearchModal === 'undefined') return;
      SearchModal.openFeats(feat => {
        _char.feats.push({
          id:          Character.generateId(),
          name:        feat.name        || '',
          type:        feat.type        || '',
          description: (feat.prerequisites ? 'Prerequisiti: ' + feat.prerequisites + '\n' : '') + (feat.benefit || ''),
        });
        renderTalenti(_char); _dirty();
      });
    });
    el('btn-add-feat')?.addEventListener('click', () => {
      if (!_char) return;
      _char.feats.push({id:Character.generateId(),name:'',type:'',description:''});
      renderTalenti(_char); _dirty();
    });
    el('btn-add-feature')?.addEventListener('click', () => {
      if (!_char) return;
      _char.classFeatures.push({id:Character.generateId(),name:'',className:'',levelGained:1,description:'',usesPerDay:0,usesLeft:0});
      renderTalenti(_char); _dirty();
    });
    el('btn-add-racial')?.addEventListener('click', () => {
      if (!_char) return;
      _char.racialTraits.push({id:Character.generateId(),name:'',description:''});
      renderTalenti(_char); _dirty();
    });
    _delegateFeatContainer('feats-list',    () => _char?.feats,          false, true);
    _delegateFeatContainer('features-list', () => _char?.classFeatures, true,  false);
    _delegateFeatContainer('racial-list',   () => _char?.racialTraits,  false, false);
  }

  function _delegateFeatContainer(containerId, arrFn, isFeature, withAutoFill = false) {
    const container = el(containerId);
    if (!container) return;
    container.addEventListener('change', e => {
      if (!_char) return;
      const card = e.target.closest('[data-index]');
      if (!card) return;
      const arr = arrFn();
      const i   = toInt(card.dataset.index, -1);
      if (i < 0 || !arr || !arr[i]) return;
      if (e.target.classList.contains('feat-name')    || e.target.classList.contains('feature-name'))
        arr[i].name = e.target.value;
      // Auto-fill da PF1_FEATS_DB quando il nome corrisponde esattamente
      if (withAutoFill && e.target.classList.contains('feat-name') && typeof PF1_FEATS_DB !== 'undefined') {
        const match = PF1_FEATS_DB.find(f => f.name.toLowerCase() === arr[i].name.toLowerCase());
        if (match) {
          if (!arr[i].type)          arr[i].type          = match.type          || '';
          if (!arr[i].prerequisites) arr[i].prerequisites = match.prerequisites || '';
          if (!arr[i].description)   arr[i].description   = match.benefit       || '';
          renderTalenti(_char); _dirty(); return;
        }
      }
      if (e.target.classList.contains('feat-type'))
        arr[i].type = e.target.value;
      if (e.target.classList.contains('feat-desc')    || e.target.classList.contains('feature-desc'))
        arr[i].description = e.target.value;
      if (e.target.classList.contains('feat-uses-left')) arr[i].usesLeft   = toInt(e.target.value);
      if (e.target.classList.contains('feat-uses-day'))  arr[i].usesPerDay = toInt(e.target.value);
      _dirty();
    });
    container.addEventListener('click', e => {
      if (!_char || !e.target.classList.contains('feat-remove')) return;
      const card = e.target.closest('[data-index]');
      const arr  = arrFn();
      const i    = toInt(card?.dataset.index, -1);
      if (i >= 0 && arr) { arr.splice(i, 1); renderTalenti(_char); _dirty(); }
    });
  }

  function _bindSpells() {
    const tabPanel = document.getElementById('tab-incantesimi');
    if (!tabPanel) return;

    // ── Delegazione eventi sull'intero tab incantesimi ───────────────────────
    // Helper per ricavare il blocco caster dall'elemento target
    function getBlock(target) {
      const blockEl = target.closest('.caster-block');
      if (!blockEl) return null;
      const bi = parseInt(blockEl.dataset.blockIdx, 10);
      const block = _char?.spells?.[bi];
      return block ? { block, bi, blockEl } : null;
    }

    tabPanel.addEventListener('change', e => {
      if (!_char) return;
      const ctx = getBlock(e.target);
      if (!ctx) return;
      const { block, bi, blockEl } = ctx;

      // Campi dell'intestazione blocco
      if (e.target.classList.contains('caster-class-name')) {
        block.className = e.target.value;
        block.classId   = e.target.value.toLowerCase().replace(/\s+/g, '_');
        _dirty(); return;
      }
      if (e.target.classList.contains('caster-level')) {
        block.casterLevel = toInt(e.target.value);
        _dirty(); return;
      }
      if (e.target.classList.contains('caster-ability')) {
        block.ability = e.target.value;
        const dc    = 10 + Combat.mod(_char, block.ability);
        const dcEl  = blockEl.querySelector('.caster-dc');
        if (dcEl) dcEl.textContent = dc;
        _dirty(); return;
      }

      // Slot per livello
      const levelBox = e.target.closest('.spell-level-box');
      if (levelBox) {
        const lv = toInt(levelBox.dataset.level, -1);
        if (lv < 0) return;
        if (e.target.classList.contains('spell-used')) {
          block.spellsUsed[lv] = toInt(e.target.value);
        } else if (e.target.classList.contains('spell-total')) {
          block.spellsPerDay[lv] = toInt(e.target.value);
          levelBox.classList.toggle('has-slots', block.spellsPerDay[lv] > 0);
        }
        _dirty(); return;
      }

      // Modifica incantesimo singolo
      const entry = e.target.closest('.spell-entry');
      if (!entry) return;
      const si = toInt(entry.dataset.index, -1);
      if (si < 0 || !block.known[si]) return;
      const s = block.known[si];

      if (e.target.classList.contains('spell-name-input')) {
        s.name = e.target.value;
        // Auto-fill da PF1_SPELLS_DB se il nome corrisponde esattamente
        if (typeof PF1_SPELLS_DB !== 'undefined') {
          const match = PF1_SPELLS_DB.find(sp => sp.name.toLowerCase() === s.name.toLowerCase());
          if (match) {
            if (!s.school)          s.school          = match.school          || '';
            if (!s.subschool)       s.subschool       = match.subschool       || '';
            if (!s.descriptor)      s.descriptor      = match.descriptor      || '';
            if (!s.components)      s.components      = match.components      || '';
            if (!s.castingTime)     s.castingTime     = match.castingTime     || '';
            if (!s.range)           s.range           = match.range           || '';
            if (!s.target)          s.target          = match.target          || '';
            if (!s.duration)        s.duration        = match.duration        || '';
            if (!s.savingThrow)     s.savingThrow     = match.savingThrow     || '';
            if (!s.spellResistance) s.spellResistance = match.spellResistance || 'no';
            if (!s.description)     s.description     = match.description     || '';
            // Auto-fill livello dalla classe di questo blocco
            if (match.level && block.classId && match.level[block.classId] !== undefined) {
              s.spellLevel = match.level[block.classId];
            }
            renderIncantesimi(_char); _dirty(); return;
          }
        }
        _dirty(); return;
      }
      if (e.target.classList.contains('spell-prepared'))   { s.prepared        = e.target.checked; _dirty(); return; }
      if (e.target.classList.contains('spell-lvl'))        { s.spellLevel = toInt(e.target.value); renderIncantesimi(_char); _dirty(); return; }
      if (e.target.classList.contains('spell-school'))     { s.school          = e.target.value; _dirty(); return; }
      if (e.target.classList.contains('spell-subschool'))  { s.subschool       = e.target.value; _dirty(); return; }
      if (e.target.classList.contains('spell-descriptor')) { s.descriptor      = e.target.value; _dirty(); return; }
      if (e.target.classList.contains('spell-components')) { s.components      = e.target.value; _dirty(); return; }
      if (e.target.classList.contains('spell-casttime'))   { s.castingTime     = e.target.value; _dirty(); return; }
      if (e.target.classList.contains('spell-range'))      { s.range           = e.target.value; _dirty(); return; }
      if (e.target.classList.contains('spell-target'))     { s.target          = e.target.value; _dirty(); return; }
      if (e.target.classList.contains('spell-duration'))   { s.duration        = e.target.value; _dirty(); return; }
      if (e.target.classList.contains('spell-save'))       { s.savingThrow     = e.target.value; _dirty(); return; }
      if (e.target.classList.contains('spell-sr'))         { s.spellResistance = e.target.value; _dirty(); return; }
      if (e.target.tagName === 'TEXTAREA')                 { s.description     = e.target.value; _dirty(); return; }
    });

    tabPanel.addEventListener('click', e => {
      if (!_char) return;

      // Cerca incantesimo nel database
      if (e.target.closest('.caster-search-spell-btn')) {
        if (typeof SearchModal === 'undefined') return;
        const blockEl = e.target.closest('.caster-block');
        if (!blockEl) return;
        const bi = parseInt(blockEl.dataset.blockIdx, 10);
        SearchModal.openSpells(_char, bi, (sp, blockIdx) => {
          const block = _char.spells[blockIdx];
          if (!block) return;
          const spLv = (block.classId && sp.level) ? (sp.level[block.classId] ?? 0) : 0;
          block.known.push({
            id:              Character.generateId(),
            name:            sp.name            || '',
            spellLevel:      spLv,
            school:          sp.school          || '',
            subschool:       sp.subschool        || '',
            descriptor:      sp.descriptor       || '',
            components:      sp.components       || '',
            castingTime:     sp.castingTime      || '',
            range:           sp.range            || '',
            target:          sp.target           || '',
            duration:        sp.duration         || '',
            savingThrow:     sp.savingThrow      || '',
            spellResistance: sp.spellResistance  || 'no',
            description:     sp.description      || '',
            prepared:        false,
          });
          renderIncantesimi(_char); _dirty();
        });
        return;
      }

      // Rimuovi classe incantatrice intera
      if (e.target.closest('.caster-remove-btn')) {
        const ctx = getBlock(e.target);
        if (!ctx) return;
        _char.spells.splice(ctx.bi, 1);
        renderIncantesimi(_char); _dirty(); return;
      }

      // Aggiungi incantesimo a un blocco
      if (e.target.closest('.caster-add-spell-btn')) {
        const ctx = getBlock(e.target);
        if (!ctx) return;
        ctx.block.known.push({
          id: Character.generateId(), spellLevel:0, name:'', school:'', subschool:'',
          descriptor:'', components:'V, S', castingTime:'1 azione standard',
          range:'', target:'', duration:'', savingThrow:'Nessuno',
          spellResistance:'no', description:'', prepared: false,
        });
        renderIncantesimi(_char); _dirty(); return;
      }

      // Espandi/comprimi un incantesimo
      if (e.target.closest('.spell-expand')) {
        const btn   = e.target.closest('.spell-expand');
        const entry = e.target.closest('.spell-entry');
        entry?.classList.toggle('expanded');
        btn?.classList.toggle('expanded');
        return;
      }

      // Rimuovi singolo incantesimo
      if (e.target.classList.contains('spell-remove')) {
        const ctx = getBlock(e.target);
        if (!ctx) return;
        const entry = e.target.closest('.spell-entry');
        const si    = toInt(entry?.dataset.index, -1);
        if (si >= 0) { ctx.block.known.splice(si, 1); renderIncantesimi(_char); _dirty(); }
      }
    });
  }

  function _bindNotes() {
    el('notes-textarea')?.addEventListener('input', e => {
      if (_char) { _char.notes = e.target.value; _dirty(); }
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ══════════════════════════════════════════════════════════════════════════

  function init(char) {
    _char = char;
    if (!_eventsBound) {
      _bindAll();
      _eventsBound = true;
    }
    renderSommario(char);
    renderCaratteristiche(char);
    renderCombattimento(char);
    renderAbilita(char);
    renderArmi(char);
    renderEquipaggiamento(char);
    renderTalenti(char);
    renderIncantesimi(char);
    renderNote(char);
    applyClassProfile(char);
    // Reset dirty state after full render
    el('btn-save')?.classList.remove('has-changes');
  }

  return {
    init,
    refreshCalculated,
    renderAbilita,
    renderArmi,
    renderEquipaggiamento,
    renderTalenti,
    renderIncantesimi,
  };
})();
