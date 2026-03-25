/**
 * creation.js
 * Wizard passo-passo per la creazione del personaggio di livello 1.
 *
 * Passi:
 *   0 — Razza            (con tratti alternativi)
 *   1 — Classe
 *   2 — Caratteristiche  (point buy oppure manuale)
 *   3 — Dettagli         (nome, allineamento, aspetto, lingue)
 *   4 — Abilità          (distribuzione gradi)
 *   5 — Talenti          (selezione talenti iniziali)
 *   6 — Riepilogo        (anteprima + conferma)
 *
 * Public API: Creation.start()
 */

'use strict';

const Creation = (() => {

  // ─────────────────────────────────────────────────────────────────────────
  // Costanti
  // ─────────────────────────────────────────────────────────────────────────

  const STEPS = [
    { label: 'Razza',           icon: 'fa-solid fa-shield-halved'   },
    { label: 'Classe',          icon: 'fa-solid fa-book-skull'       },
    { label: 'Caratteristiche', icon: 'fa-solid fa-dice-d6'          },
    { label: 'Dettagli',        icon: 'fa-solid fa-user'             },
    { label: 'Abilità',         icon: 'fa-solid fa-book-open'        },
    { label: 'Talenti',         icon: 'fa-solid fa-star'             },
    { label: 'Riepilogo',       icon: 'fa-solid fa-scroll'           },
  ];

  const ABILITIES_DEF = [
    { key: 'str', name: 'Forza',         abbr: 'FOR' },
    { key: 'dex', name: 'Destrezza',     abbr: 'DES' },
    { key: 'con', name: 'Costituzione',  abbr: 'COS' },
    { key: 'int', name: 'Intelligenza',  abbr: 'INT' },
    { key: 'wis', name: 'Saggezza',      abbr: 'SAG' },
    { key: 'cha', name: 'Carisma',       abbr: 'CAR' },
  ];

  // Costo point buy PF1 (score → costo punti)
  const PB_COST = { 7: -4, 8: -2, 9: -1, 10: 0, 11: 1, 12: 2, 13: 3, 14: 5, 15: 7, 16: 10, 17: 13, 18: 17 };

  const ALIGNMENTS = [
    ['Legale Buono',    'Neutrale Buono',    'Caotico Buono'    ],
    ['Legale Neutrale', 'Neutrale',          'Caotico Neutrale' ],
    ['Legale Malvagio', 'Neutrale Malvagio', 'Caotico Malvagio' ],
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // Stato wizard
  // ─────────────────────────────────────────────────────────────────────────

  let _step  = 0;
  let _draft = null;

  // ─────────────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────────────

  function _e(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function _mod(score) { return Math.floor((score - 10) / 2); }
  function _pbCost(s)  { return PB_COST[Math.max(7, Math.min(18, s))] ?? 0; }
  function _pbSpent()  {
    return Object.values(_draft.abilities).reduce((t, v) => t + _pbCost(v), 0);
  }
  function _sign(n) { return n >= 0 ? `+${n}` : `${n}`; }

  // Converte costo PF1 in go (usato solo nel wizard, duplicato da ui.js che è privato)
  function _parseCostGp(costStr) {
    if (!costStr || costStr === '—') return 0;
    const m = String(costStr).trim().match(/^([\d.,]+)\s*(mo|ma|mr|mp|pa)/i);
    if (!m) return 0;
    const n = parseFloat(m[1].replace(',', '.'));
    switch (m[2].toLowerCase()) {
      case 'mp': case 'pa': return n * 10;
      case 'mo': return n;
      case 'ma': return n / 10;
      case 'mr': return n / 100;
      default:   return n;
    }
  }

  function _draftEquipCostTotal() {
    return (_draft.startingEquipment || []).reduce((s, eq) => s + (eq.costGp || 0), 0);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Navigazione schermata
  // ─────────────────────────────────────────────────────────────────────────

  /** Avvia il wizard (chiamato dal pulsante "Nuovo Personaggio") */
  function start() {
    _draft = {
      raceId: null,  raceObj: null,
      variantId:  null,  variantObj: null,  // variante di razza (es. Daemon-spawn per Tiefling)
      altTraits: [],                   // nomi dei tratti alternativi selezionati
      classId: null, classObj: null,
      abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      pbMode:   'pointbuy',
      pbBudget: 15,
      name: '', playerName: '', alignment: '',
      gender: '', deity: '', homeland: '', age: '', height: '', weight: '', eyes: '', hair: '',
      bonusLanguages: [],              // lingue bonus da INT (scelte)
      skillRanks: {},                  // { skillId: 0|1 }
      feats: [],                       // [{ name, type }]
      startingGp: null,          // null = non ancora tirato/scelto
      startingEquipment: [],    // oggetti acquistati durante il wizard
    };
    _step = 0;

    document.getElementById('screen-home')?.classList.remove('active');
    document.getElementById('screen-character')?.classList.remove('active');
    document.getElementById('screen-creation')?.classList.add('active');
    window.scrollTo(0, 0);

    _render();
  }

  function _cancel() {
    _draft = null;
    document.getElementById('screen-creation')?.classList.remove('active');
    document.getElementById('screen-home')?.classList.add('active');
  }

  function _prev() {
    if (_step === 0) { _cancel(); return; }
    _step--;
    _render();
    _scrollTop();
  }

  function _next() {
    const err = _validate();
    if (err) { showToast(err, 'warning'); return; }
    if (_step < STEPS.length - 1) {
      _step++;
      _render();
      _scrollTop();
    }
  }

  function _scrollTop() {
    document.getElementById('creation-content')?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Rendering
  // ─────────────────────────────────────────────────────────────────────────

  function _render() {
    _renderStepper();
    _renderFooter();
    const c = document.getElementById('creation-content');
    if (!c) return;
    const renderers = [
      _renderRace, _renderClass, _renderAbilities,
      _renderDetails, _renderSkills, _renderFeats, _renderSummary,
    ];
    renderers[_step]?.(c);
  }

  function _renderStepper() {
    const el    = document.getElementById('creation-stepper');
    const title = document.getElementById('creation-step-title');
    const num   = document.getElementById('creation-step-num');
    if (el) {
      el.innerHTML = STEPS.map((s, i) => {
        const state = i < _step ? 'cs-done' : i === _step ? 'cs-active' : 'cs-pending';
        const dot   = i < _step ? '<i class="fa-solid fa-check"></i>' : i + 1;
        return `<div class="cs-step-dot-wrap ${state}">
          <div class="cs-dot">${dot}</div>
          <span class="cs-dot-label">${s.label}</span>
        </div>`;
      }).join('');
    }
    if (title) title.textContent = STEPS[_step]?.label ?? '';
    if (num)   num.textContent   = `${_step + 1} / ${STEPS.length}`;
  }

  function _renderFooter() {
    const prev = document.getElementById('btn-creation-prev');
    const next = document.getElementById('btn-creation-next');
    const conf = document.getElementById('btn-creation-confirm');
    if (!prev) return;
    const isFirst = _step === 0;
    const isLast  = _step === STEPS.length - 1;
    prev.innerHTML = isFirst
      ? '<i class="fa-solid fa-times"></i> Annulla'
      : '<i class="fa-solid fa-arrow-left"></i> Indietro';
    next?.classList.toggle('hidden', isLast);
    conf?.classList.toggle('hidden', !isLast);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Passo 0 — RAZZA
  // ─────────────────────────────────────────────────────────────────────────

  function _renderRace(c) {
    const races = typeof PF1_RACES_DB !== 'undefined' ? PF1_RACES_DB : [];
    c.innerHTML = `
      <div class="cs-step-header">
        <h2><i class="${STEPS[0].icon}"></i> Scegli la Razza</h2>
        <p>La razza determina i modificatori alle caratteristiche, le capacità razziali e le lingue iniziali.</p>
      </div>
      <input type="text" id="race-search" class="field-input cs-search" placeholder="🔍 Cerca razza…" />
      <div id="race-grid" class="cs-race-grid">
        ${races.map(r => _raceCard(r)).join('')}
      </div>
      <div id="race-panel">
        ${_draft.raceId
          ? _raceDetailsHTML(_draft.raceObj)
          : '<p class="cs-hint"><i class="fa-solid fa-hand-pointer"></i> Seleziona una razza per vedere i tratti e le opzioni di personalizzazione.</p>'}
      </div>`;

    document.getElementById('race-search')?.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.cs-race-card').forEach(card => {
        card.style.display = card.dataset.name.toLowerCase().includes(q) ? '' : 'none';
      });
    });

    document.querySelectorAll('.cs-race-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.cs-race-card').forEach(x => x.classList.remove('selected'));
        card.classList.add('selected');
        _draft.raceId     = card.dataset.id;
        _draft.raceObj    = races.find(r => r.id === card.dataset.id) ?? null;
        _draft.altTraits  = [];
        _draft.variantId  = null;
        _draft.variantObj = null;
        document.getElementById('race-panel').innerHTML = _raceDetailsHTML(_draft.raceObj);
        _bindAltTraits();
        _bindVariantCards();
      });
    });

    if (_draft.raceId) { _bindAltTraits(); _bindVariantCards(); }
  }

  function _raceCard(r) {
    const mods = Object.entries(r.abilityMods)
      .filter(([, v]) => v !== 0)
      .map(([k, v]) => `${k.toUpperCase()} ${v > 0 ? '+' : ''}${v}`)
      .join('  ');
    return `<div class="cs-race-card ${_draft.raceId === r.id ? 'selected' : ''}"
                 data-id="${r.id}" data-name="${_e(r.name)}">
      <div class="cs-race-name">${_e(r.name)}</div>
      <div class="cs-race-mods">${mods || '<em>Variabile</em>'}</div>
      <div class="cs-race-meta">
        <span>${_e(r.size)}</span>
        <span class="cs-badge ${r.source === 'Core' ? 'cs-badge-core' : 'cs-badge-adv'}">${r.source}</span>
      </div>
    </div>`;
  }

  function _raceDetailsHTML(r) {
    if (!r) return '';
    const racialModsHTML = Object.entries(r.abilityMods)
      .filter(([, v]) => v !== 0)
      .map(([k, v]) => `<span class="cs-mod-badge ${v > 0 ? 'pos' : 'neg'}">${k.toUpperCase()} ${_sign(v)}</span>`)
      .join('');

    const replacedBySelected = (r.alternativeTraits ?? [])
      .filter(at => _draft.altTraits.includes(at.name))
      .flatMap(at => at.replaces);

    const traitsHTML = (r.traits ?? []).map(t => {
      const replaced = replacedBySelected.includes(t);
      return `<li class="cs-trait ${replaced ? 'cs-trait-replaced' : ''}">
        ${_e(t)} ${replaced ? '<span class="cs-replaced-badge">Sostituito</span>' : ''}
      </li>`;
    }).join('');

    const altHTML = (r.alternativeTraits?.length > 0) ? `
      <div class="cs-alt-traits">
        <h4>Tratti Alternativi</h4>
        ${r.alternativeTraits.map(at => {
          const selected  = _draft.altTraits.includes(at.name);
          const conflicts = at.replaces.some(rep =>
            (r.alternativeTraits ?? []).some(o =>
              o.name !== at.name && _draft.altTraits.includes(o.name) && o.replaces.includes(rep)
            )
          );
          return `<label class="cs-alt-trait ${selected ? 'selected' : ''} ${conflicts ? 'conflict' : ''}">
            <input type="checkbox" class="cs-alt-cb" data-name="${_e(at.name)}"
                   ${selected ? 'checked' : ''} ${conflicts ? 'disabled' : ''} />
            <div class="cs-alt-body">
              <strong>${_e(at.name)}</strong>
              <span class="cs-alt-replaces">Sostituisce: ${_e(at.replaces.join(', '))}</span>
              <span class="cs-alt-desc">${_e(at.description)}</span>
            </div>
          </label>`;
        }).join('')}
      </div>` : '';

    // ── Varianti di razza ────────────────────────────────────────────────
    const variantsHTML = (r.variants?.length > 0) ? `
      <div class="cs-variants">
        <h4>Varianti di Eredità</h4>
        <p class="cs-hint" style="margin-bottom:0.5rem">Ogni variante sostituisce i modificatori base e la capacità magica della razza.</p>
        <div class="cs-variant-grid">
          <div class="cs-variant-card ${!_draft.variantId ? 'selected' : ''}" data-variant-id="">
            <div class="cs-variant-name">${_e(r.name)} Base</div>
            <div class="cs-variant-mods">${
              Object.entries(r.abilityMods).filter(([,v]) => v !== 0)
                .map(([k,v]) => `<span class="cs-mod-badge ${v>0?'pos':'neg'}">${k.toUpperCase()} ${_sign(v)}</span>`).join('') ||
              '<span class="text-muted">Variabile</span>'
            }</div>
          </div>
          ${r.variants.map(v => {
            const sel = _draft.variantId === v.id;
            const mods = Object.entries(v.abilityMods).filter(([,val]) => val !== 0)
              .map(([k,val]) => `<span class="cs-mod-badge ${val>0?'pos':'neg'}">${k.toUpperCase()} ${_sign(val)}</span>`).join('') ||
              '<span class="text-muted">Variabile</span>';
            return `<div class="cs-variant-card ${sel ? 'selected' : ''}" data-variant-id="${_e(v.id)}"
                         data-variant-name="${_e(v.name)}">
              <div class="cs-variant-name">${_e(v.name)}</div>
              <div class="cs-variant-mods">${mods}</div>
              ${v.altSLA ? `<div class="cs-variant-sla">${_e(v.altSLA)}</div>` : ''}
            </div>`;
          }).join('')}
        </div>
      </div>` : '';

    return `<div class="cs-race-panel">
      <div class="cs-race-panel-header">
        <h3>${_e(r.name)}</h3>
        <div class="cs-mod-row">${racialModsHTML || '<span class="text-muted">Nessun modificatore fisso</span>'}</div>
      </div>
      <div class="cs-race-panel-cols">
        <div>
          <h4>Tratti Razziali Standard</h4>
          <ul class="cs-traits-list">${traitsHTML}</ul>
        </div>
        <div>
          <h4>Lingue</h4>
          <p class="cs-lang-line">${_e(r.languages.join(', '))}</p>
          ${r.bonusLanguages?.length ? `<p class="text-muted cs-bonus-langs">Bonus: ${_e(r.bonusLanguages.join(', '))}</p>` : ''}
        </div>
      </div>
      ${variantsHTML}
      ${altHTML}
    </div>`;
  }

  function _bindVariantCards() {
    document.querySelectorAll('.cs-variant-card').forEach(card => {
      card.addEventListener('click', () => {
        const vid = card.dataset.variantId || null;
        _draft.variantId  = vid;
        _draft.variantObj = vid
          ? (_draft.raceObj?.variants ?? []).find(v => v.id === vid) ?? null
          : null;
        document.getElementById('race-panel').innerHTML = _raceDetailsHTML(_draft.raceObj);
        _bindAltTraits();
        _bindVariantCards();
        // Aggiorna i modificatori nel passo Caratteristiche se già renderizzato
        const racialMods = _draft.variantObj?.abilityMods ?? _draft.raceObj?.abilityMods ?? {};
        _refreshAllAbilRows(racialMods);
      });
    });
  }

  function _bindAltTraits() {
    document.querySelectorAll('.cs-alt-cb').forEach(cb => {
      cb.addEventListener('change', e => {
        const name = e.target.dataset.name;
        if (e.target.checked) {
          if (!_draft.altTraits.includes(name)) _draft.altTraits.push(name);
        } else {
          _draft.altTraits = _draft.altTraits.filter(t => t !== name);
        }
        document.getElementById('race-panel').innerHTML = _raceDetailsHTML(_draft.raceObj);
        _bindAltTraits();
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Passo 1 — CLASSE
  // ─────────────────────────────────────────────────────────────────────────

  function _renderClass(c) {
    const classes = typeof ClassConfig !== 'undefined' ? ClassConfig.CLASSES : [];
    const groups  = [
      { type: 'base',      label: 'Classi Base'        },
      { type: 'advanced',  label: 'Classi Avanzate'    },
      { type: 'hybrid',    label: 'Classi Ibride'      },
      { type: 'alternate', label: 'Classi Alternative' },
    ];
    c.innerHTML = `
      <div class="cs-step-header">
        <h2><i class="${STEPS[1].icon}"></i> Scegli la Classe</h2>
        <p>La classe determina il dado vita, il bonus d'attacco base, le abilità di classe e le capacità speciali al livello 1.</p>
      </div>
      ${groups.map(g => {
        const list = classes.filter(cl => cl.type === g.type);
        if (!list.length) return '';
        return `<div class="cs-class-group">
          <h4 class="cs-group-label">${g.label}</h4>
          <div class="cs-class-grid">${list.map(cl => _classCard(cl)).join('')}</div>
        </div>`;
      }).join('')}`;

    document.querySelectorAll('.cs-class-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.cs-class-card').forEach(x => x.classList.remove('selected'));
        card.classList.add('selected');
        _draft.classId  = card.dataset.id;
        _draft.classObj = (typeof ClassConfig !== 'undefined' ? ClassConfig.CLASSES : [])
          .find(cl => cl.id === _draft.classId) ?? null;
      });
    });
  }

  function _classCard(cl) {
    const babMap = { full: 'Att. Completo', '3_4': 'Att. ¾', '1_2': 'Att. ½' };
    const saves  = ['Fort', 'Rif', 'Vol'].map((n, i) => {
      const key  = ['fort', 'ref', 'will'][i];
      const good = cl.saves?.[key] === 'good';
      return `<span class="cs-save ${good ? 'cs-save-good' : 'cs-save-bad'}">${n}</span>`;
    }).join('');
    return `<div class="cs-class-card ${_draft.classId === cl.id ? 'selected' : ''}"
                 data-id="${cl.id}" title="${_e(cl.description ?? '')}">
      <div class="cs-class-icon"><i class="${cl.icon ?? 'fa-solid fa-shield'}"></i></div>
      <div class="cs-class-name">${_e(cl.name)}</div>
      <div class="cs-class-stats">
        <span class="cs-pill"><i class="fa-solid fa-dice"></i> d${cl.hitDie}</span>
        <span class="cs-pill">${babMap[cl.bab] ?? cl.bab}</span>
        <span class="cs-pill">${cl.skillPts} gr.</span>
      </div>
      <div class="cs-class-saves">${saves}</div>
    </div>`;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Passo 2 — CARATTERISTICHE
  // ─────────────────────────────────────────────────────────────────────────

  function _renderAbilities(c) {
    const racialMods = _draft.variantObj?.abilityMods ?? _draft.raceObj?.abilityMods ?? {};
    const spent      = _pbSpent();
    const isManual   = _draft.pbMode === 'manual';
    c.innerHTML = `
      <div class="cs-step-header">
        <h2><i class="${STEPS[2].icon}"></i> Caratteristiche</h2>
        <p>Assegna i punteggi base. I bonus razziali vengono applicati automaticamente.</p>
      </div>
      <div class="cs-ability-toolbar">
        <label class="cs-toolbar-item">
          Modalità:
          <select id="pb-mode" class="field-input cs-select-sm">
            <option value="pointbuy" ${_draft.pbMode === 'pointbuy' ? 'selected' : ''}>Point Buy</option>
            <option value="manual"   ${_draft.pbMode === 'manual'   ? 'selected' : ''}>Valore manuale</option>
          </select>
        </label>
        <span id="pb-status-row" class="cs-toolbar-item ${isManual ? 'hidden' : ''}">
          Punti: <strong id="pb-spent-val">${spent}</strong> /
          <select id="pb-budget" class="field-input cs-select-sm">
            <option value="10" ${_draft.pbBudget === 10 ? 'selected' : ''}>10 — Bassa Fantasia</option>
            <option value="15" ${_draft.pbBudget === 15 ? 'selected' : ''}>15 — Standard</option>
            <option value="20" ${_draft.pbBudget === 20 ? 'selected' : ''}>20 — Alta Fantasia</option>
            <option value="25" ${_draft.pbBudget === 25 ? 'selected' : ''}>25 — Epica</option>
          </select>
        </span>
      </div>
      <div class="cs-abilities-table">
        <div class="cs-abilities-header">
          <span>Caratteristica</span><span>Base</span><span>Razziale</span><span>Finale</span><span>Mod</span>
        </div>
        ${ABILITIES_DEF.map(a => _abilityRow(a, racialMods, isManual)).join('')}
      </div>`;
    _bindAbilitiesEvents();
  }

  function _abilityRow(a, racialMods, isManual) {
    const base   = _draft.abilities[a.key];
    const racial = racialMods[a.key] ?? 0;
    const final  = base + racial;
    const mod    = _mod(final);
    const ctrl   = isManual
      ? `<input type="number" class="field-input cs-ab-manual" data-key="${a.key}" min="3" max="18" value="${base}" />`
      : `<div class="cs-ab-pb">
           <button class="btn btn-sm btn-ghost cs-ab-dec" data-key="${a.key}" ${base <= 7 ? 'disabled' : ''}>−</button>
           <span class="cs-ab-val">${base}</span>
           <button class="btn btn-sm btn-ghost cs-ab-inc" data-key="${a.key}">+</button>
         </div>`;
    return `<div class="cs-ability-row" id="arow-${a.key}">
      <span class="cs-ab-name"><strong>${a.abbr}</strong><small>${a.name}</small></span>
      ${ctrl}
      <span class="cs-ab-racial ${racial > 0 ? 'pos' : racial < 0 ? 'neg' : ''}">${racial !== 0 ? _sign(racial) : '—'}</span>
      <span class="cs-ab-final">${final}</span>
      <span class="cs-ab-mod ${mod >= 0 ? 'pos' : 'neg'}">${_sign(mod)}</span>
    </div>`;
  }

  function _bindAbilitiesEvents() {
    const racialMods = _draft.variantObj?.abilityMods ?? _draft.raceObj?.abilityMods ?? {};
    document.getElementById('pb-mode')?.addEventListener('change', e => {
      _draft.pbMode = e.target.value;
      if (_draft.pbMode === 'pointbuy') ABILITIES_DEF.forEach(a => { _draft.abilities[a.key] = 10; });
      _renderAbilities(document.getElementById('creation-content'));
    });
    document.getElementById('pb-budget')?.addEventListener('change', e => {
      _draft.pbBudget = parseInt(e.target.value);
      _refreshAllAbilRows(racialMods);
    });
    document.querySelectorAll('.cs-ab-dec').forEach(btn => {
      btn.addEventListener('click', () => {
        const k = btn.dataset.key;
        if (_draft.abilities[k] > 7) { _draft.abilities[k]--; _refreshAbilRow(k, racialMods); _updatePbStatus(); }
      });
    });
    document.querySelectorAll('.cs-ab-inc').forEach(btn => {
      btn.addEventListener('click', () => {
        const k = btn.dataset.key;
        const cur  = _draft.abilities[k];
        const cost = _pbCost(cur + 1) - _pbCost(cur);
        if (cur < 18 && (_draft.pbMode !== 'pointbuy' || (_pbSpent() + cost) <= _draft.pbBudget)) {
          _draft.abilities[k]++;
          _refreshAbilRow(k, racialMods);
          _updatePbStatus();
        }
      });
    });
    document.querySelectorAll('.cs-ab-manual').forEach(inp => {
      inp.addEventListener('input', e => {
        const k = e.target.dataset.key;
        _draft.abilities[k] = Math.min(18, Math.max(3, parseInt(e.target.value) || 10));
        _refreshAbilRow(k, racialMods);
      });
    });
  }

  function _refreshAbilRow(key, racialMods) {
    const row    = document.getElementById(`arow-${key}`);
    if (!row) return;
    const base   = _draft.abilities[key];
    const racial = racialMods[key] ?? 0;
    const final  = base + racial;
    const mod    = _mod(final);
    const valEl  = row.querySelector('.cs-ab-val');
    if (valEl) valEl.textContent = base;
    const dec = row.querySelector('.cs-ab-dec');
    if (dec) dec.disabled = base <= 7;
    const inc = row.querySelector('.cs-ab-inc');
    if (inc) {
      const cost  = _pbCost(base + 1) - _pbCost(base);
      inc.disabled = base >= 18 || (_draft.pbMode === 'pointbuy' && (_pbSpent() + cost) > _draft.pbBudget);
    }
    const finalEl = row.querySelector('.cs-ab-final');
    const modEl   = row.querySelector('.cs-ab-mod');
    if (finalEl) finalEl.textContent = final;
    if (modEl) { modEl.textContent = _sign(mod); modEl.className = `cs-ab-mod ${mod >= 0 ? 'pos' : 'neg'}`; }
  }

  function _refreshAllAbilRows(racialMods) {
    ABILITIES_DEF.forEach(a => _refreshAbilRow(a.key, racialMods));
    _updatePbStatus();
  }

  function _updatePbStatus() {
    const spent = _pbSpent();
    const el = document.getElementById('pb-spent-val');
    if (el) el.textContent = spent;
    // aggiorna stati dei pulsanti +
    ABILITIES_DEF.forEach(a => {
      const inc = document.querySelector(`.cs-ab-inc[data-key="${a.key}"]`);
      if (!inc) return;
      const cur  = _draft.abilities[a.key];
      const cost = _pbCost(cur + 1) - _pbCost(cur);
      inc.disabled = cur >= 18 || (_draft.pbMode === 'pointbuy' && (spent + cost) > _draft.pbBudget);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Passo 3 — DETTAGLI
  // ─────────────────────────────────────────────────────────────────────────

  function _renderDetails(c) {
    const race         = _draft.raceObj;
    const intFinal     = (_draft.abilities.int ?? 10) + (race?.abilityMods?.int ?? 0);
    const intMod       = _mod(intFinal);
    const baseLangs    = race?.languages ?? [];
    const bonusOptions = race?.bonusLanguages ?? [];
    const bonusSlots   = Math.max(0, intMod);

    c.innerHTML = `
      <div class="cs-step-header">
        <h2><i class="${STEPS[3].icon}"></i> Dettagli Personaggio</h2>
        <p>Nome, allineamento e aspetto fisico del tuo eroe.</p>
      </div>
      <div class="cs-details-grid">
        <div class="cs-details-col">
          <div class="field-group">
            <label>Nome Personaggio <span class="cs-required">*</span></label>
            <input type="text" id="d-name" class="field-input" placeholder="Nome eroe…" value="${_e(_draft.name)}" autofocus />
          </div>
          <div class="field-group">
            <label>Giocatore</label>
            <input type="text" id="d-player" class="field-input" placeholder="Il tuo nome…" value="${_e(_draft.playerName)}" />
          </div>
          <div class="field-group">
            <label>Allineamento</label>
            <div class="cs-align-grid">
              ${ALIGNMENTS.flatMap(row => row).map(al =>
                `<button class="cs-align-btn ${_draft.alignment === al ? 'selected' : ''}" data-align="${_e(al)}">${_e(al)}</button>`
              ).join('')}
            </div>
          </div>
        </div>
        <div class="cs-details-col">
          <div class="field-row">
            <div class="field-group">
              <label>Sesso</label>
              <input type="text" id="d-gender" class="field-input" placeholder="—" value="${_e(_draft.gender)}" />
            </div>
            <div class="field-group">
              <label>Divinità</label>
              <input type="text" id="d-deity" class="field-input" placeholder="es. Gorum" value="${_e(_draft.deity)}" />
            </div>
          </div>
          <div class="field-group">
            <label>Patria</label>
            <input type="text" id="d-homeland" class="field-input" placeholder="es. Brevoy" value="${_e(_draft.homeland)}" />
          </div>
          <div class="field-row">
            <div class="field-group">
              <label>Età</label>
              <input type="text" id="d-age" class="field-input field-narrow" placeholder="—" value="${_e(_draft.age)}" />
            </div>
            <div class="field-group">
              <label>Altezza</label>
              <input type="text" id="d-height" class="field-input" placeholder="es. 1,80 m" value="${_e(_draft.height)}" />
            </div>
            <div class="field-group">
              <label>Peso</label>
              <input type="text" id="d-weight" class="field-input" placeholder="es. 85 kg" value="${_e(_draft.weight)}" />
            </div>
          </div>
          <div class="field-row">
            <div class="field-group">
              <label>Occhi</label>
              <input type="text" id="d-eyes" class="field-input" placeholder="—" value="${_e(_draft.eyes)}" />
            </div>
            <div class="field-group">
              <label>Capelli</label>
              <input type="text" id="d-hair" class="field-input" placeholder="—" value="${_e(_draft.hair)}" />
            </div>
          </div>
          <div class="field-group">
            <label>Lingue</label>
            <div class="cs-langs">
              <div class="cs-langs-auto">
                ${baseLangs.map(l => `<span class="cs-lang-badge">${_e(l)}</span>`).join('')}
                ${!baseLangs.length ? '<span class="text-muted">Nessuna lingua automatica</span>' : ''}
              </div>
              ${bonusSlots > 0 && bonusOptions.length ? `
                <p class="cs-langs-hint">INT ${_sign(intMod)} → ${bonusSlots} lingua${bonusSlots !== 1 ? 'e' : ''} aggiuntiva${bonusSlots !== 1 ? '' : ''}:</p>
                ${Array.from({ length: bonusSlots }, (_, i) =>
                  `<select class="field-input cs-lang-extra" data-slot="${i}">
                    <option value="">— Scegli —</option>
                    ${bonusOptions.map(l => `<option value="${_e(l)}" ${_draft.bonusLanguages[i] === l ? 'selected' : ''}>${_e(l)}</option>`).join('')}
                  </select>`
                ).join('')}
              ` : ''}
            </div>
          </div>
        </div>
      </div>`;

    document.querySelectorAll('.cs-align-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cs-align-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        _draft.alignment = btn.dataset.align;
      });
    });

    const fieldMap = {
      'd-name': 'name', 'd-player': 'playerName', 'd-gender': 'gender',
      'd-deity': 'deity', 'd-homeland': 'homeland', 'd-age': 'age',
      'd-height': 'height', 'd-weight': 'weight', 'd-eyes': 'eyes', 'd-hair': 'hair',
    };
    Object.entries(fieldMap).forEach(([id, key]) => {
      document.getElementById(id)?.addEventListener('input', e => { _draft[key] = e.target.value; });
    });

    document.querySelectorAll('.cs-lang-extra').forEach(sel => {
      sel.addEventListener('change', () => {
        _draft.bonusLanguages = Array.from(document.querySelectorAll('.cs-lang-extra')).map(s => s.value);
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Passo 4 — ABILITÀ
  // ─────────────────────────────────────────────────────────────────────────

  function _renderSkills(c) {
    const cls          = _draft.classObj;
    const race         = _draft.raceObj;
    const intFinal     = (_draft.abilities.int ?? 10) + (race?.abilityMods?.int ?? 0);
    const intMod       = _mod(intFinal);
    const baseSkillPts = cls?.skillPts ?? 2;
    const availPts     = Math.max(1, baseSkillPts + intMod);
    const classSkillIds= cls ? (ClassConfig?.CLASS_SKILLS?.[cls.id] ?? []) : [];
    const skills       = typeof PF1_SKILLS !== 'undefined' ? PF1_SKILLS : [];
    const spent        = Object.values(_draft.skillRanks).reduce((s, v) => s + v, 0);

    c.innerHTML = `
      <div class="cs-step-header">
        <h2><i class="${STEPS[4].icon}"></i> Abilità</h2>
        <p>Hai <strong>${availPts}</strong> grado${availPts !== 1 ? 'i' : ''} abilità da distribuire
          (${baseSkillPts} classe ${_sign(intMod)} INT).
          Al livello 1 ogni abilità può avere al massimo 1 grado.
          Le abilità di classe guadagnano +3 con almeno 1 grado.</p>
      </div>
      <div class="cs-pts-bar">
        <span>Gradi usati: <strong id="sk-spent">${spent}</strong> / ${availPts}</span>
        <div class="cs-pts-track"><div class="cs-pts-fill" id="sk-fill" style="width:${Math.min(100, spent / availPts * 100)}%"></div></div>
      </div>
      <div class="cs-skills-table">
        <div class="cs-skills-header">
          <span>Abilità</span>
          <span class="cs-col-ab">Car.</span>
          <span class="cs-col-cs" title="Abilità di classe">Cl.</span>
          <span class="cs-col-rank">Grado</span>
          <span class="cs-col-tot">Tot.</span>
        </div>
        <div id="cs-skills-body">
          ${skills.map(sk => _skillRowHTML(sk, classSkillIds)).join('')}
        </div>
      </div>`;

    document.querySelectorAll('.cs-sk-check').forEach(cb => {
      cb.addEventListener('change', e => {
        const id = e.target.dataset.id;
        if (e.target.checked) {
          const curSpent = Object.values(_draft.skillRanks).reduce((s, v) => s + v, 0);
          if (curSpent >= availPts) {
            e.target.checked = false;
            showToast(`Hai già usato tutti i ${availPts} gradi abilità.`, 'warning');
            return;
          }
          _draft.skillRanks[id] = 1;
        } else {
          _draft.skillRanks[id] = 0;
        }
        _refreshSkillTotals(classSkillIds);
        _updateSkillPts(availPts);
      });
    });
  }

  function _skillRowHTML(sk, classSkillIds) {
    const isClass = classSkillIds.includes(sk.id);
    const ranks   = _draft.skillRanks[sk.id] ?? 0;
    const total   = _calcSkillTotal(sk, isClass, ranks);
    return `<div class="cs-skill-row ${isClass ? 'cs-cls-skill' : ''}" id="sk-row-${sk.id}">
      <span class="cs-sk-name">${_e(sk.name)}${sk.trainedOnly ? '<sup title="Richiede addestramento">*</sup>' : ''}</span>
      <span class="cs-sk-ab">${(sk.ability ?? '?').toUpperCase().substring(0, 3)}</span>
      <span class="cs-sk-cs">${isClass ? '<i class="fa-solid fa-check cs-cs-icon"></i>' : ''}</span>
      <label class="cs-sk-rank-label">
        <input type="checkbox" class="cs-sk-check" data-id="${sk.id}" ${ranks > 0 ? 'checked' : ''} />
      </label>
      <span class="cs-sk-total ${total < 0 ? 'neg' : ''}" id="sk-tot-${sk.id}">${_sign(total)}</span>
    </div>`;
  }

  function _calcSkillTotal(sk, isClass, ranks) {
    const race      = _draft.raceObj;
    const abilKey   = sk.ability?.toLowerCase?.() ?? 'int';
    const abilScore = (_draft.abilities[abilKey] ?? 10) + (race?.abilityMods?.[abilKey] ?? 0);
    const abilMod   = _mod(abilScore);
    const clsBonus  = (isClass && ranks > 0) ? 3 : 0;
    return ranks + abilMod + clsBonus;
  }

  function _refreshSkillTotals(classSkillIds) {
    const skills = typeof PF1_SKILLS !== 'undefined' ? PF1_SKILLS : [];
    skills.forEach(sk => {
      const el = document.getElementById(`sk-tot-${sk.id}`);
      if (!el) return;
      const ranks = _draft.skillRanks[sk.id] ?? 0;
      const total = _calcSkillTotal(sk, classSkillIds.includes(sk.id), ranks);
      el.textContent = _sign(total);
      el.className   = `cs-sk-total ${total < 0 ? 'neg' : ''}`;
    });
  }

  function _updateSkillPts(availPts) {
    const spent = Object.values(_draft.skillRanks).reduce((s, v) => s + v, 0);
    const spEl  = document.getElementById('sk-spent');
    const fill  = document.getElementById('sk-fill');
    if (spEl) spEl.textContent = spent;
    if (fill) fill.style.width = `${Math.min(100, (spent / availPts) * 100)}%`;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Passo 5 — TALENTI
  // ─────────────────────────────────────────────────────────────────────────

  function _featSlots() {
    let n = 1;
    if (_draft.raceId  === 'umano')     n++; // bonus umano
    if (_draft.classId === 'guerriero') n++; // bonus talento di combattimento
    return n;
  }

  function _renderFeats(c) {
    const total = _featSlots();
    const feats = typeof PF1_FEATS_DB !== 'undefined' ? PF1_FEATS_DB : [];
    c.innerHTML = `
      <div class="cs-step-header">
        <h2><i class="${STEPS[5].icon}"></i> Talenti</h2>
        <p>Al livello 1 puoi scegliere <strong>${total}</strong> talento${total !== 1 ? 'i' : ''}${
          _draft.raceId  === 'umano'     ? ' <span class="cs-bonus-note">(+1 bonus Umano)</span>'    : ''
        }${
          _draft.classId === 'guerriero' ? ' <span class="cs-bonus-note">(+1 bonus Guerriero)</span>' : ''
        }. Fai clic su un talento per selezionarlo.</p>
      </div>
      <div class="cs-feat-slots-wrap" id="cs-feat-slots-wrap">
        ${_featSlotsHTML(total)}
      </div>
      <input type="text" id="feat-search" class="field-input cs-search" placeholder="🔍 Cerca talento…" />
      <div class="cs-feats-list" id="cs-feats-list">
        ${feats.map(f => _featItemHTML(f)).join('')}
      </div>`;

    document.getElementById('feat-search')?.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.cs-feat-item').forEach(item => {
        item.style.display = item.dataset.search?.includes(q) ? '' : 'none';
      });
    });

    document.querySelectorAll('.cs-feat-item').forEach(item => {
      item.addEventListener('click', () => {
        const name = item.dataset.name;
        const idx  = _draft.feats.findIndex(f => f.name === name);
        if (idx >= 0) {
          _draft.feats.splice(idx, 1);
          item.classList.remove('cs-feat-active');
        } else if (_draft.feats.length < total) {
          _draft.feats.push({ name, type: item.dataset.type ?? '' });
          item.classList.add('cs-feat-active');
        } else {
          showToast(`Puoi scegliere al massimo ${total} talento${total !== 1 ? 'i' : ''}.`, 'warning');
          return;
        }
        document.getElementById('cs-feat-slots-wrap').innerHTML = _featSlotsHTML(total);
        _bindFeatRemove(total);
      });
    });
    _bindFeatRemove(total);
  }

  function _featSlotsHTML(total) {
    return `<div class="cs-feat-slots">${Array.from({ length: total }, (_, i) => {
      const f = _draft.feats[i];
      return `<div class="cs-feat-slot ${f ? 'filled' : ''}">
        ${f
          ? `<span class="cs-feat-slot-name">${_e(f.name)}</span>
             <button class="cs-feat-remove btn btn-ghost btn-sm" data-idx="${i}">×</button>`
          : `<span class="cs-feat-slot-empty"><i class="fa-regular fa-square-plus"></i> Slot ${i + 1} — Seleziona dalla lista</span>`}
      </div>`;
    }).join('')}</div>`;
  }

  function _bindFeatRemove(total) {
    document.querySelectorAll('.cs-feat-remove').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const idx         = parseInt(btn.dataset.idx);
        const removedName = _draft.feats[idx]?.name;
        _draft.feats.splice(idx, 1);
        document.getElementById('cs-feat-slots-wrap').innerHTML = _featSlotsHTML(total);
        _bindFeatRemove(total);
        if (removedName) {
          // deselect in list
          document.querySelectorAll('.cs-feat-item').forEach(item => {
            if (item.dataset.name === removedName) item.classList.remove('cs-feat-active');
          });
        }
      });
    });
  }

  function _featItemHTML(f) {
    const selected   = _draft.feats.some(x => x.name === f.name);
    const searchStr  = `${f.name} ${f.type ?? ''} ${f.benefit ?? ''}`.toLowerCase();
    const typeLabels = {
      'Combattimento': 'Comb.', 'Generali': 'Gen.', 'Metamagia': 'Meta', 'Creazione Oggetti': 'Craft.',
      'Critico': 'Crit.', 'Squadra': 'Squadra', 'Stile': 'Stile',
      'Eroici': 'Eroico', 'Trama': 'Trama', 'Incanalare Energia': 'Incanalare',
    };
    return `<div class="cs-feat-item ${selected ? 'cs-feat-active' : ''}"
                 data-name="${_e(f.name)}" data-type="${_e(f.type ?? '')}"
                 data-search="${_e(searchStr)}">
      <span class="cs-feat-name">${_e(f.name)}</span>
      ${f.type ? `<span class="cs-feat-type">${_e(typeLabels[f.type] ?? f.type)}</span>` : ''}
      ${f.prerequisites
        ? `<span class="cs-feat-prereq" title="Prerequisiti: ${_e(f.prerequisites)}"><i class="fa-solid fa-lock"></i></span>`
        : ''}
    </div>`;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Passo 6 — RIEPILOGO
  // ─────────────────────────────────────────────────────────────────────────

  function _renderSummary(c) {
    const race       = _draft.raceObj;
    const cls        = _draft.classObj;
    const racialMods = race?.abilityMods ?? {};
    const finals = {};
    const mods   = {};
    ABILITIES_DEF.forEach(a => {
      finals[a.key] = (_draft.abilities[a.key] ?? 10) + (racialMods[a.key] ?? 0);
      mods[a.key]   = _mod(finals[a.key]);
    });

    const hp   = Math.max(1, (cls?.hitDie ?? 8) + mods.con);
    const fort = ((cls?.saves?.fort === 'good') ? 2 : 0) + mods.con;
    const ref  = ((cls?.saves?.ref  === 'good') ? 2 : 0) + mods.dex;
    const will = ((cls?.saves?.will === 'good') ? 2 : 0) + mods.wis;
    const bab  = cls?.bab === 'full' ? 1 : 0;

    const classSkillIds = cls ? (ClassConfig?.CLASS_SKILLS?.[cls.id] ?? []) : [];
    const skills        = typeof PF1_SKILLS !== 'undefined' ? PF1_SKILLS : [];
    const skillsRanked  = Object.entries(_draft.skillRanks)
      .filter(([, r]) => r > 0)
      .map(([id]) => {
        const sk = skills.find(s => s.id === id);
        if (!sk) return null;
        const tot = _calcSkillTotal(sk, classSkillIds.includes(id), 1);
        return `<div class="cs-sum-row"><span>${_e(sk.name)}</span><strong>${_sign(tot)}</strong></div>`;
      }).filter(Boolean).join('');

    const replacedTraits = (race?.alternativeTraits ?? [])
      .filter(at => _draft.altTraits.includes(at.name))
      .flatMap(at => at.replaces);
    const activeTraits   = (race?.traits ?? []).filter(t => !replacedTraits.includes(t));
    const altTraitObjs   = (race?.alternativeTraits ?? []).filter(at => _draft.altTraits.includes(at.name));
    const allLangs       = [...(race?.languages ?? []), ..._draft.bonusLanguages.filter(Boolean)];

    c.innerHTML = `
      <div class="cs-step-header">
        <h2><i class="${STEPS[6].icon}"></i> Riepilogo</h2>
        <p>Controlla le scelte prima di creare il personaggio. Puoi tornare indietro per modificarle.</p>
      </div>
      <div class="cs-summary-grid">
        <div class="cs-sum-card">
          <h3><i class="fa-solid fa-id-card"></i> Identità</h3>
          <div class="cs-sum-row"><span>Nome</span><strong>${_e(_draft.name) || '<em>—</em>'}</strong></div>
          <div class="cs-sum-row"><span>Giocatore</span><strong>${_e(_draft.playerName) || '<em>—</em>'}</strong></div>
          <div class="cs-sum-row"><span>Razza</span><strong>${_e(race?.name ?? '—')}</strong></div>
          <div class="cs-sum-row"><span>Classe</span><strong>${_e(cls?.name ?? '—')} 1</strong></div>
          <div class="cs-sum-row"><span>Allineamento</span><strong>${_e(_draft.alignment) || '<em>—</em>'}</strong></div>
          ${_draft.gender ? `<div class="cs-sum-row"><span>Sesso</span><strong>${_e(_draft.gender)}</strong></div>` : ''}
        </div>
        <div class="cs-sum-card">
          <h3><i class="fa-solid fa-dumbbell"></i> Caratteristiche</h3>
          ${ABILITIES_DEF.map(a =>
            `<div class="cs-sum-row">
              <span>${a.abbr} — ${a.name}</span>
              <strong>${finals[a.key]} <em class="${mods[a.key] >= 0 ? 'pos' : 'neg'}">(${_sign(mods[a.key])})</em></strong>
            </div>`
          ).join('')}
        </div>
        <div class="cs-sum-card">
          <h3><i class="fa-solid fa-shield-halved"></i> Combattimento</h3>
          <div class="cs-sum-row"><span>Punti Ferita</span><strong class="cs-hp-val">${hp}</strong></div>
          <div class="cs-sum-row"><span>Classe Armatura</span><strong>${10 + mods.dex}</strong></div>
          <div class="cs-sum-row"><span>BAB</span><strong>${_sign(bab)}</strong></div>
          <div class="cs-sum-row"><span>Iniziativa</span><strong>${_sign(mods.dex)}</strong></div>
          <div class="cs-sum-row"><span>Tempra</span><strong>${_sign(fort)}</strong></div>
          <div class="cs-sum-row"><span>Riflessi</span><strong>${_sign(ref)}</strong></div>
          <div class="cs-sum-row"><span>Volontà</span><strong>${_sign(will)}</strong></div>
        </div>
        <div class="cs-sum-card">
          <h3><i class="fa-solid fa-book-open"></i> Abilità con gradi</h3>
          ${skillsRanked || '<p class="text-muted">Nessuna abilità selezionata.</p>'}
        </div>
        <div class="cs-sum-card">
          <h3><i class="fa-solid fa-star"></i> Talenti</h3>
          ${_draft.feats.length
            ? _draft.feats.map(f => `<div class="cs-sum-row"><span>${_e(f.name)}</span><strong>${_e(f.type || 'Generale')}</strong></div>`).join('')
            : '<p class="text-muted">Nessun talento scelto.</p>'}
        </div>
        <div class="cs-sum-card">
          <h3><i class="fa-solid fa-dna"></i> Tratti Razziali</h3>
          ${activeTraits.map(t => `<div class="cs-sum-row"><span>${_e(t)}</span></div>`).join('')}
          ${altTraitObjs.map(at => `<div class="cs-sum-row">
            <span>${_e(at.name)}</span><strong class="cs-alt-label">Alternativo</strong>
          </div>`).join('')}
          ${!activeTraits.length && !altTraitObjs.length ? '<p class="text-muted">—</p>' : ''}
        </div>
        ${allLangs.length ? `
          <div class="cs-sum-card">
            <h3><i class="fa-solid fa-language"></i> Lingue</h3>
            <p>${_e(allLangs.join(', '))}</p>
          </div>` : ''}
        <div class="cs-sum-card cs-sum-card--gold" id="cs-sum-gold">
          <h3><i class="fa-solid fa-coins"></i> Ricchezza Iniziale</h3>
          <div class="cs-sum-row">
            <span>Formula</span>
            <strong>${cls?.startingGold ? cls.startingGold.dice + 'd6 × ' + cls.startingGold.multiplier + ' go' : '—'}</strong>
          </div>
          ${_draft.startingGp !== null ? `
          <div class="cs-sum-row">
            <span>Risultato</span>
            <strong style="color:var(--gold)">${_draft.startingGp} go</strong>
          </div>` : '<p class="text-muted" style="font-size:0.8rem;margin:0.3rem 0">Non ancora assegnata</p>'}
          <div style="display:flex;gap:0.5rem;margin-top:0.5rem">
            <button class="btn btn-sm btn-ghost" id="cs-btn-roll-gold">
              <i class="fa-solid fa-dice-d6"></i> Tira
            </button>
            <button class="btn btn-sm btn-ghost" id="cs-btn-avg-gold">
              <i class="fa-solid fa-calculator"></i> Media
            </button>
          </div>
        </div>
        ${_draft.startingGp !== null ? (() => {
          const remaining = parseFloat(((_draft.startingGp ?? 0) - _draftEquipCostTotal()).toFixed(2));
          const eqList    = _draft.startingEquipment || [];
          return `
        <div class="cs-sum-card cs-sum-card--equip">
          <h3><i class="fa-solid fa-bag-shopping"></i> Equipaggiamento Iniziale</h3>
          <div class="cs-sum-row">
            <span>Monete rimaste</span>
            <strong style="color:${remaining < 0 ? '#e07040' : 'var(--gold)'}">${remaining} go</strong>
          </div>
          <div id="cs-equip-list" style="margin:0.4rem 0">
            ${eqList.length === 0
              ? '<p class="text-muted" style="font-size:0.8rem">Nessun oggetto acquistato.</p>'
              : eqList.map((eq, i) => `
                <div class="cs-equip-row">
                  <span class="cs-equip-name">${_e(eq.name)}</span>
                  <span class="cs-equip-cost">${_e(eq.cost || '—')}</span>
                  <button class="btn btn-xs btn-ghost cs-equip-remove" data-idx="${i}">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>`).join('')}
          </div>
          <button class="btn btn-sm btn-ghost" id="cs-btn-buy-equip">
            <i class="fa-solid fa-magnifying-glass"></i> Cerca Oggetto
          </button>
        </div>`;
        })() : ''}
      </div>`;

    // Listener ricchezza iniziale
    document.getElementById('cs-btn-roll-gold')?.addEventListener('click', () => {
      const sg = _draft.classObj?.startingGold;
      if (!sg) return;
      let total = 0;
      for (let i = 0; i < sg.dice; i++) total += Math.floor(Math.random() * sg.sides) + 1;
      _draft.startingGp = total * sg.multiplier;
      _renderSummary(document.getElementById('creation-content'));
    });
    document.getElementById('cs-btn-avg-gold')?.addEventListener('click', () => {
      const sg = _draft.classObj?.startingGold;
      if (!sg) return;
      _draft.startingGp = Math.floor(sg.dice * ((sg.sides + 1) / 2)) * sg.multiplier;
      _renderSummary(document.getElementById('creation-content'));
    });

    // Listener equipaggiamento iniziale
    document.getElementById('cs-btn-buy-equip')?.addEventListener('click', () => {
      if (typeof SearchModal === 'undefined') return;
      SearchModal.openEquipment(null, item => {
        const costGp   = _parseCostGp(item.cost);
        const remaining = (_draft.startingGp ?? 0) - _draftEquipCostTotal();
        if (costGp > 0 && remaining < costGp) {
          if (typeof showToast === 'function')
            showToast(`Fondi insufficienti (rimasti ${parseFloat(remaining.toFixed(2))} go, servono ${costGp} go).`, 'warning');
          return;
        }
        _draft.startingEquipment.push({
          id: `eq_${Date.now()}`, name: item.name, qty: 1,
          weight: item.weight || 0, cost: item.cost || '',
          location: 'zaino', worn: false, notes: '', costGp,
        });
        _renderSummary(document.getElementById('creation-content'));
      });
    });
    document.getElementById('cs-equip-list')?.addEventListener('click', e => {
      const btn = e.target.closest('.cs-equip-remove');
      if (!btn) return;
      const idx = parseInt(btn.dataset.idx, 10);
      if (!isNaN(idx)) {
        _draft.startingEquipment.splice(idx, 1);
        _renderSummary(document.getElementById('creation-content'));
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Validazione per passo
  // ─────────────────────────────────────────────────────────────────────────

  function _validate() {
    switch (_step) {
      case 0: return _draft.raceId  ? null : 'Seleziona una razza per continuare.';
      case 1: return _draft.classId ? null : 'Seleziona una classe per continuare.';
      case 3: return _draft.name.trim() ? null : 'Inserisci il nome del personaggio.';
      default: return null;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Costruzione del personaggio
  // ─────────────────────────────────────────────────────────────────────────

  function _buildCharacter() {
    const race       = _draft.raceObj;
    const variant    = _draft.variantObj;   // null se razza base
    const cls        = _draft.classObj;
    // I mods applicati sono quelli della variante (se scelta) o della razza base
    const racialMods = variant?.abilityMods ?? race?.abilityMods ?? {};
    const char       = Character.createDefault(_draft.name.trim() || 'Senza Nome');

    // ── Meta ──────────────────────────────────────────────────────────────
    char.meta.playerName     = _draft.playerName;
    char.meta.race           = race?.name ?? '';
    char.meta.raceId         = race?.id   ?? '';
    char.meta.raceVariantId  = variant?.id   ?? '';
    char.meta.raceVariantName= variant?.name ?? '';
    char.meta.alignment   = _draft.alignment;
    char.meta.gender      = _draft.gender;
    char.meta.deity       = _draft.deity;
    char.meta.homeland    = _draft.homeland;
    char.meta.age         = _draft.age;
    char.meta.height      = _draft.height;
    char.meta.weight      = _draft.weight;
    char.meta.eyes        = _draft.eyes;
    char.meta.hair        = _draft.hair;
    char.meta.size        = race?.size ?? 'Media';
    char.meta.classes     = [{ className: cls?.name ?? '', level: 1, hitDie: cls?.hitDie ?? 8 }];
    char.meta.totalLevel  = 1;
    char.meta.languages   = [...(race?.languages ?? []), ..._draft.bonusLanguages.filter(Boolean)];

    // ── Caratteristiche ────────────────────────────────────────────────────
    ABILITIES_DEF.forEach(a => {
      char.abilities[a.key]               = _draft.abilities[a.key] ?? 10;
      char.abilities[`${a.key}Racial`]    = racialMods[a.key] ?? 0;
    });

    // ── Combattimento ──────────────────────────────────────────────────────
    const conFinal = char.abilities.con + char.abilities.conRacial;
    const conMod   = _mod(conFinal);
    char.combat.hpMax          = Math.max(1, (cls?.hitDie ?? 8) + conMod);
    char.combat.hpCurrent      = char.combat.hpMax;
    char.combat.speed          = race?.speed ?? 9;
    char.combat.bab            = cls?.bab === 'full' ? 1 : 0;
    char.combat.saves.fortBase = cls?.saves?.fort === 'good' ? 2 : 0;
    char.combat.saves.refBase  = cls?.saves?.ref  === 'good' ? 2 : 0;
    char.combat.saves.willBase = cls?.saves?.will === 'good' ? 2 : 0;

    // ── Abilità ────────────────────────────────────────────────────────────
    const classSkillIds = cls ? (ClassConfig?.CLASS_SKILLS?.[cls.id] ?? []) : [];
    if (Array.isArray(char.skills)) {
      char.skills = char.skills.map(sk => ({
        ...sk,
        ranks:      _draft.skillRanks[sk.id] ?? 0,
        classSkill: classSkillIds.includes(sk.id),
      }));
    }

    // ── Talenti ────────────────────────────────────────────────────────────
    char.feats = _draft.feats.map(f => ({
      id: Character.generateId(), name: f.name,
      type: f.type || 'Generale', prerequisites: '', description: '', notes: '',
    }));

    // ── Tratti razziali ────────────────────────────────────────────────────
    const replacedStd = (race?.alternativeTraits ?? [])
      .filter(at => _draft.altTraits.includes(at.name))
      .flatMap(at => at.replaces);
    char.racialTraits = [
      // Se è stata scelta una variante, aggiungila come primo tratto con il suo altSLA
      ...(variant ? [{ id: Character.generateId(), name: variant.name, description: variant.altSLA ?? '' }] : []),
      ...(race?.traits ?? [])
        .filter(t => !replacedStd.includes(t))
        .map(t => ({ id: Character.generateId(), name: t, description: '' })),
      ...(race?.alternativeTraits ?? [])
        .filter(at => _draft.altTraits.includes(at.name))
        .map(at => ({ id: Character.generateId(), name: at.name, description: at.description ?? '' })),
    ];

    // ── Incantesimi (blocco iniziale per classi incantatrici) ───────────────
    if (cls?.hasSpellsTab && cls?.spellAbility) {
      char.spells = [{
        classId:      cls.id,
        className:    cls.name,
        casterLevel:  1,
        ability:      cls.spellAbility,
        spellsPerDay: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        spellsUsed:   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        known: [],
      }];
    }

    // ── Valuta iniziale ────────────────────────────────────────────────────
    const spentGp = _draftEquipCostTotal();
    char.currency.gp = Math.max(0, (_draft.startingGp ?? 0) - spentGp);

    // ── Equipaggiamento acquistato nel wizard ──────────────────────────────
    (_draft.startingEquipment || []).forEach(eq => {
      char.equipment.push({
        id: Character.generateId(), name: eq.name, qty: eq.qty ?? 1,
        weight: eq.weight || 0, cost: eq.cost || '',
        location: eq.location || 'zaino', worn: false, notes: '',
      });
    });

    return char;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Conferma e salvataggio
  // ─────────────────────────────────────────────────────────────────────────

  function _confirm() {
    const err = _validate();
    if (err) { showToast(err, 'warning'); return; }

    const char = _buildCharacter();
    try {
      Storage.saveCharacter(char);
    } catch (e) {
      showToast('Errore nel salvataggio: ' + e.message, 'error');
      return;
    }

    if (typeof Sync !== 'undefined' && Sync.isConfigured()) {
      Sync.upsert(char).catch(e => console.warn('[Sync] Upsert fallito:', e.message));
    }

    document.getElementById('screen-creation')?.classList.remove('active');
    showToast(`"${char.meta.name}" creato!`, 'success');
    showCharacterSheet(char);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Init: binding pulsanti fissi (una tantum)
  // ─────────────────────────────────────────────────────────────────────────

  function _initGlobalButtons() {
    document.getElementById('btn-creation-prev')?.addEventListener('click', _prev);
    document.getElementById('btn-creation-next')?.addEventListener('click', _next);
    document.getElementById('btn-creation-confirm')?.addEventListener('click', _confirm);
    document.getElementById('btn-creation-cancel')?.addEventListener('click', _cancel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _initGlobalButtons);
  } else {
    _initGlobalButtons();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────────
  return { start };

})();
