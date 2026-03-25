/**
 * party.js
 * Sistema Party — gestione del gruppo di PG.
 *
 * Responsabilità:
 *  - Rendering dello schermo party (#screen-party)
 *  - HP tracking per ogni membro (salvataggio immediato in localStorage)
 *  - Condizioni per ogni membro
 *  - Modalità Gestisci: rinomina party, aggiungi/rimuovi membri
 *
 * Dipende da: Storage, Combat, Character (globali)
 * Chiama (come globali): showHome(), showCharacterSheet(), activeCharacter, UI
 */
const Party = (() => {

  // ── Stato interno ─────────────────────────────────────────────────────────

  let _party    = null;   // oggetto party corrente { id, name, characterIds[] }
  let _editMode = false;  // true = modalità gestione
  let _bound    = false;  // event listeners già registrati?

  // ── Utility ───────────────────────────────────────────────────────────────

  function _e(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function _sign(n) { return n >= 0 ? '+' + n : String(n); }

  // ── API pubblica: navigazione ─────────────────────────────────────────────

  function show() {
    _party    = Storage.getParty();
    _editMode = !_party;   // se non esiste un party, apri direttamente in edit/crea
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-party')?.classList.add('active');
    window.scrollTo(0, 0);
    _bindEvents();
    _render();
  }

  // ── Rendering ─────────────────────────────────────────────────────────────

  function _render() {
    const title   = document.getElementById('party-screen-title');
    const editBtn = document.getElementById('btn-party-edit');

    if (!_party) {
      if (title)   title.textContent = 'Party';
      if (editBtn) editBtn.classList.add('hidden');
      _renderCreate();
    } else {
      if (title)   title.textContent = _party.name || 'Party';
      if (editBtn) {
        editBtn.classList.remove('hidden');
        editBtn.innerHTML = _editMode
          ? '<i class="fa-solid fa-xmark"></i> Chiudi'
          : '<i class="fa-solid fa-pen"></i> Gestisci';
      }
      _editMode ? _renderEditMode() : _renderViewMode();
    }
  }

  // ── Vista: crea party ─────────────────────────────────────────────────────

  function _renderCreate() {
    const container = document.getElementById('party-content');
    if (!container) return;
    container.innerHTML = `
      <div class="party-empty-state">
        <i class="fa-solid fa-users" style="font-size:2.5rem;color:var(--gold);opacity:0.5;margin-bottom:0.75rem"></i>
        <p>Nessun party attivo. Crea il tuo gruppo per tracciare HP, condizioni e stats di tutti i PG insieme.</p>
        <div class="party-create-row">
          <input type="text" id="party-name-input" class="field-input" placeholder="Nome del party (es. La Torre di Jacob)..." />
          <button class="btn btn-primary" id="btn-party-create-confirm">
            <i class="fa-solid fa-plus"></i> Crea Party
          </button>
        </div>
      </div>`;
  }

  // ── Vista: panoramica membri ──────────────────────────────────────────────

  function _renderViewMode() {
    const container = document.getElementById('party-content');
    if (!container) return;

    const chars = (_party.characterIds || [])
      .map(id => Storage.getCharacter(id))
      .filter(Boolean);

    if (chars.length === 0) {
      container.innerHTML = `
        <div class="party-empty-state">
          <p>Nessun membro nel party.</p>
          <button class="btn btn-ghost" id="btn-quick-add-members">
            <i class="fa-solid fa-user-plus"></i> Aggiungi Membri
          </button>
        </div>`;
      return;
    }

    container.innerHTML = chars.map(char => _memberCardHtml(char)).join('');
  }

  function _memberCardHtml(char) {
    const c      = Combat.calcAll(char);
    const hp     = char.combat?.hpCurrent ?? 0;
    const hpMax  = c.hpMax;
    const hpPct  = hpMax > 0 ? Math.max(0, Math.min(100, hp / hpMax * 100)) : 0;
    const hpCls  = hp <= 0 ? 'hp-danger' : hpPct < 30 ? 'hp-warning' : 'hp-ok';

    const classText = (char.meta?.classes || [])
      .map(cl => `${cl.className} ${cl.level}`).join(' / ') || '—';

    const conds    = char.conditions || [];
    const condHtml = conds.length > 0
      ? conds.map(cond =>
          `<span class="party-cond-chip" data-char-id="${_e(char.id)}" data-cond="${_e(cond)}">${_e(cond)} <i class="fa-solid fa-xmark"></i></span>`
        ).join('')
      : '<span class="party-no-cond">Nessuna condizione</span>';

    return `
      <div class="party-member-card" data-char-id="${_e(char.id)}">
        <div class="party-member-header">
          <div class="party-member-identity">
            <span class="party-member-name">${_e(char.meta?.name || '—')}</span>
            <span class="party-member-info">${_e(char.meta?.race || '')} · ${_e(classText)}</span>
          </div>
          <button class="btn btn-ghost btn-sm party-open-sheet" data-char-id="${_e(char.id)}">
            <i class="fa-solid fa-scroll"></i> Scheda
          </button>
        </div>

        <div class="party-stats-row">
          <div class="party-stat-box">
            <div class="party-stat-label">CA</div>
            <div class="party-stat-value">${c.ac}</div>
          </div>
          <div class="party-stat-box">
            <div class="party-stat-label">Init</div>
            <div class="party-stat-value">${_sign(c.initiative.total)}</div>
          </div>
          <div class="party-stat-box">
            <div class="party-stat-label">Vel</div>
            <div class="party-stat-value">${c.speed}m</div>
          </div>
          <div class="party-stat-box">
            <div class="party-stat-label">Temp</div>
            <div class="party-stat-value">${_sign(c.fort.total)}</div>
          </div>
          <div class="party-stat-box">
            <div class="party-stat-label">Rif</div>
            <div class="party-stat-value">${_sign(c.ref.total)}</div>
          </div>
          <div class="party-stat-box">
            <div class="party-stat-label">Vol</div>
            <div class="party-stat-value">${_sign(c.will.total)}</div>
          </div>
        </div>

        <div class="party-hp-section">
          <div class="party-hp-bar-wrap">
            <div class="party-hp-bar ${_e(hpCls)}" style="width:${hpPct.toFixed(1)}%"></div>
          </div>
          <div class="party-hp-controls">
            <span class="party-hp-display ${_e(hpCls)}">${hp} / ${hpMax} PF</span>
            <div class="party-hp-quick-btns">
              <button class="btn btn-xs party-hp-btn party-hp-dmg" data-char-id="${_e(char.id)}" data-delta="-10">−10</button>
              <button class="btn btn-xs party-hp-btn party-hp-dmg" data-char-id="${_e(char.id)}" data-delta="-5">−5</button>
              <button class="btn btn-xs party-hp-btn party-hp-dmg" data-char-id="${_e(char.id)}" data-delta="-1">−1</button>
              <button class="btn btn-xs party-hp-btn party-hp-heal" data-char-id="${_e(char.id)}" data-delta="1">+1</button>
              <button class="btn btn-xs party-hp-btn party-hp-heal" data-char-id="${_e(char.id)}" data-delta="5">+5</button>
              <button class="btn btn-xs party-hp-btn party-hp-heal" data-char-id="${_e(char.id)}" data-delta="10">+10</button>
            </div>
            <div class="party-hp-custom-row">
              <input type="number" min="0" class="field-input party-hp-input" data-char-id="${_e(char.id)}"
                placeholder="Quantità..." style="width:90px" />
              <button class="btn btn-xs party-hp-apply-heal" data-char-id="${_e(char.id)}">Cura</button>
              <button class="btn btn-xs party-hp-apply-dmg" data-char-id="${_e(char.id)}">Danno</button>
            </div>
          </div>
        </div>

        <div class="party-cond-section">
          <div class="party-cond-chips" id="party-conds-${_e(char.id)}">${condHtml}</div>
          <button class="btn btn-ghost btn-xs party-add-cond" data-char-id="${_e(char.id)}">
            <i class="fa-solid fa-plus"></i> Condizione
          </button>
        </div>
      </div>`;
  }

  // ── Vista: gestione party ─────────────────────────────────────────────────

  function _renderEditMode() {
    const container = document.getElementById('party-content');
    if (!container) return;

    const allChars  = Storage.getAllCharacters();
    const memberSet = new Set(_party.characterIds || []);

    container.innerHTML = `
      <div class="party-edit-panel">
        <div class="party-edit-name-row">
          <label class="field-label">Nome Party</label>
          <input type="text" id="party-edit-name" class="field-input"
            value="${_e(_party.name || '')}" placeholder="Nome del gruppo..." />
        </div>

        <h4 class="party-edit-section-title">
          <i class="fa-solid fa-users"></i> Membri
        </h4>
        <div class="party-members-checklist">
          ${allChars.length === 0
            ? '<p style="color:var(--text-muted);font-size:0.85rem">Nessun personaggio salvato. Crea prima un PG dalla home.</p>'
            : allChars.map(stub => {
                const classText = (stub.classes || [])
                  .map(c => `${c.className} ${c.level}`).join(' / ') || '—';
                return `
                  <label class="party-member-check-item">
                    <input type="checkbox" class="party-member-checkbox" value="${_e(stub.id)}"
                      ${memberSet.has(stub.id) ? 'checked' : ''} />
                    <div class="party-member-check-info">
                      <span class="party-member-check-name">${_e(stub.name || '—')}</span>
                      <span class="party-member-check-meta">${_e(stub.race || '—')} · ${_e(classText)} · Lv ${stub.totalLevel || 1}</span>
                    </div>
                  </label>`;
              }).join('')}
        </div>

        <div class="party-edit-actions">
          <button class="btn btn-primary" id="btn-party-save-edit">
            <i class="fa-solid fa-check"></i> Salva Modifiche
          </button>
          <button class="btn btn-danger btn-sm" id="btn-party-delete">
            <i class="fa-solid fa-trash"></i> Elimina Party
          </button>
        </div>
      </div>`;
  }

  // ── Helpers: aggiorna singola card senza re-render completo ──────────────

  function _refreshCard(charId) {
    const char = Storage.getCharacter(charId);
    if (!char) return;
    const existing = document.querySelector(`.party-member-card[data-char-id="${charId}"]`);
    if (!existing) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = _memberCardHtml(char);
    existing.replaceWith(tmp.firstElementChild);
  }

  // ── Azioni: HP ────────────────────────────────────────────────────────────

  function _adjustHP(charId, delta) {
    const char = Storage.getCharacter(charId);
    if (!char) return;
    const hpMax = Combat.calcAll(char).hpMax;
    char.combat.hpCurrent = Math.min(hpMax, (char.combat.hpCurrent ?? 0) + delta);
    Storage.saveCharacter(char);
    // Aggiorna la scheda aperta se è lo stesso personaggio
    if (typeof activeCharacter !== 'undefined' && activeCharacter?.id === charId) {
      activeCharacter.combat.hpCurrent = char.combat.hpCurrent;
      if (typeof UI !== 'undefined') UI.refreshCalculated(activeCharacter);
    }
    _refreshCard(charId);
  }

  // ── Azioni: Condizioni ────────────────────────────────────────────────────

  function _removeCondition(charId, condition) {
    const char = Storage.getCharacter(charId);
    if (!char) return;
    char.conditions = (char.conditions || []).filter(c => c !== condition);
    Storage.saveCharacter(char);
    if (typeof activeCharacter !== 'undefined' && activeCharacter?.id === charId) {
      activeCharacter.conditions = char.conditions;
      if (typeof UI !== 'undefined') UI.refreshCalculated(activeCharacter);
    }
    _refreshCard(charId);
  }

  const _ALL_CONDITIONS = [
    'Accecato','Affaticato','Assordato','Atterrito','Confuso',
    'Esausto','Fascinato','Immobilizzato','Malato','Nauseato',
    'Paralizzato','Privo di Sensi','Prono','Spaventato','Stordito',
  ];

  function _openConditionModal(charId) {
    const char = Storage.getCharacter(charId);
    if (!char) return;
    const existing = new Set(char.conditions || []);

    const modal = document.getElementById('party-cond-modal');
    const list  = document.getElementById('party-cond-list');
    if (!modal || !list) return;

    list.innerHTML = _ALL_CONDITIONS.map(c => `
      <label class="party-cond-check-item">
        <input type="checkbox" value="${_e(c)}" ${existing.has(c) ? 'checked' : ''} />
        ${_e(c)}
      </label>`).join('');

    modal.dataset.charId = charId;
    modal.classList.remove('hidden');
  }

  function _applyConditionModal() {
    const modal  = document.getElementById('party-cond-modal');
    const list   = document.getElementById('party-cond-list');
    const charId = modal?.dataset.charId;
    if (!charId || !list) return;

    const char = Storage.getCharacter(charId);
    if (!char) return;
    char.conditions = Array.from(list.querySelectorAll('input:checked')).map(el => el.value);
    Storage.saveCharacter(char);
    if (typeof activeCharacter !== 'undefined' && activeCharacter?.id === charId) {
      activeCharacter.conditions = char.conditions;
      if (typeof UI !== 'undefined') UI.refreshCalculated(activeCharacter);
    }
    modal.classList.add('hidden');
    _refreshCard(charId);
  }

  // ── Gestione party: salva modifiche ───────────────────────────────────────

  function _saveEditMode() {
    const nameInput = document.getElementById('party-edit-name');
    const checkboxes = document.querySelectorAll('.party-member-checkbox:checked');
    _party.name = (nameInput?.value || '').trim() || _party.name;
    _party.characterIds = Array.from(checkboxes).map(el => el.value);
    Storage.saveParty(_party);
    _editMode = false;
    _render();
  }

  function _deleteParty() {
    if (!confirm('Eliminare il party? I personaggi non verranno eliminati.')) return;
    Storage.deleteParty();
    _party    = null;
    _editMode = false;
    _render();
  }

  // ── Event binding (una volta per screen lifecycle) ────────────────────────

  function _bindEvents() {
    if (_bound) return;
    _bound = true;

    // Topbar
    document.getElementById('btn-party-back')?.addEventListener('click', () => {
      if (typeof showHome === 'function') showHome();
    });

    document.getElementById('btn-party-edit')?.addEventListener('click', () => {
      if (!_party) return;
      _editMode = !_editMode;
      _render();
    });

    // Delegation sul contenitore principale
    const content = document.getElementById('party-content');
    content?.addEventListener('click', e => {
      // Crea party
      if (e.target.closest('#btn-party-create-confirm')) {
        const name = (document.getElementById('party-name-input')?.value || '').trim() || 'Il Party';
        _party = { id: Date.now().toString(36), name, characterIds: [] };
        Storage.saveParty(_party);
        _editMode = true;
        _render();
        return;
      }

      // Aggiungi membri veloce (quando 0 membri)
      if (e.target.closest('#btn-quick-add-members')) {
        _editMode = true; _render(); return;
      }

      // Apri scheda PG
      const openBtn = e.target.closest('.party-open-sheet');
      if (openBtn) {
        const char = Storage.getCharacter(openBtn.dataset.charId);
        if (char && typeof showCharacterSheet === 'function') showCharacterSheet(char);
        return;
      }

      // HP quick buttons
      const hpBtn = e.target.closest('.party-hp-btn');
      if (hpBtn) {
        _adjustHP(hpBtn.dataset.charId, parseInt(hpBtn.dataset.delta, 10));
        return;
      }

      // HP custom: Cura
      const applyHeal = e.target.closest('.party-hp-apply-heal');
      if (applyHeal) {
        const charId = applyHeal.dataset.charId;
        const input  = document.querySelector(`.party-hp-input[data-char-id="${charId}"]`);
        const amount = parseInt(input?.value || '0', 10);
        if (amount > 0) { _adjustHP(charId, amount); if (input) input.value = ''; }
        return;
      }

      // HP custom: Danno
      const applyDmg = e.target.closest('.party-hp-apply-dmg');
      if (applyDmg) {
        const charId = applyDmg.dataset.charId;
        const input  = document.querySelector(`.party-hp-input[data-char-id="${charId}"]`);
        const amount = parseInt(input?.value || '0', 10);
        if (amount > 0) { _adjustHP(charId, -amount); if (input) input.value = ''; }
        return;
      }

      // Rimuovi condizione (× sul chip)
      const condChip = e.target.closest('.party-cond-chip');
      if (condChip) {
        _removeCondition(condChip.dataset.charId, condChip.dataset.cond);
        return;
      }

      // Apri modal condizioni
      const addCondBtn = e.target.closest('.party-add-cond');
      if (addCondBtn) {
        _openConditionModal(addCondBtn.dataset.charId);
        return;
      }

      // Salva modifiche (edit mode)
      if (e.target.closest('#btn-party-save-edit')) { _saveEditMode(); return; }
      if (e.target.closest('#btn-party-delete'))    { _deleteParty();  return; }
    });

    // Modal condizioni
    document.getElementById('btn-party-cond-apply')?.addEventListener('click', _applyConditionModal);
    document.getElementById('btn-party-cond-cancel')?.addEventListener('click', () => {
      document.getElementById('party-cond-modal')?.classList.add('hidden');
    });
    document.getElementById('party-cond-modal-overlay')?.addEventListener('click', () => {
      document.getElementById('party-cond-modal')?.classList.add('hidden');
    });
  }

  // ── Notifica refresh dalla scheda personaggio ─────────────────────────────

  /**
   * Chiamata da app.js dopo un salvataggio, per aggiornare la card nel party
   * se il party screen è attivo e il personaggio salvato è un membro.
   */
  function notifyCharacterSaved(charId) {
    const screen = document.getElementById('screen-party');
    if (!screen?.classList.contains('active')) return;
    if (!_party?.characterIds?.includes(charId)) return;
    if (!_editMode) _refreshCard(charId);
  }

  // ── API pubblica ──────────────────────────────────────────────────────────

  return {
    show,
    notifyCharacterSaved,
  };
})();
