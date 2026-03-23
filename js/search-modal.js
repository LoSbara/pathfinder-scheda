/**
 * search-modal.js
 * Modal riutilizzabile per ricerca incantesimi (PF1_SPELLS_DB) e talenti (PF1_FEATS_DB).
 *
 * API pubblica:
 *   SearchModal.openSpells(char, blockIdx, onSelect)
 *     → onSelect(spell, blockIdx) — spell è l'oggetto da PF1_SPELLS_DB
 *   SearchModal.openFeats(onSelect)
 *     → onSelect(feat) — feat è l'oggetto da PF1_FEATS_DB
 */
const SearchModal = (() => {
  const PAGE_SIZE = 20;

  let _mode     = null;   // 'spells' | 'feats'
  let _onSelect = null;
  let _blockIdx = null;
  let _char     = null;
  let _page     = 0;
  let _filtered = [];

  // filtri correnti
  let _fClass = '';
  let _fLevel = '';
  let _fType  = '';
  let _fText  = '';

  // ── helpers ───────────────────────────────────────────────────────────────

  function _el(id) { return document.getElementById(id); }

  function _esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ── public API ────────────────────────────────────────────────────────────

  /**
   * Apre la modal per cercare incantesimi.
   * @param {object}   char      - personaggio corrente (_char)
   * @param {number}   blockIdx  - indice del blocco caster in char.spells[]
   * @param {function} onSelect  - callback(spell, blockIdx) invocata al click
   */
  function openSpells(char, blockIdx, onSelect) {
    _mode     = 'spells';
    _char     = char;
    _blockIdx = blockIdx;
    _onSelect = onSelect;
    _page     = 0;
    _fClass   = (char.spells && char.spells[blockIdx]) ? (char.spells[blockIdx].classId || '') : '';
    _fLevel   = '';
    _fText    = '';
    _renderFilters();
    _applyFilter();
    _show('Cerca Incantesimo');
  }

  /**
   * Apre la modal per cercare talenti.
   * @param {function} onSelect  - callback(feat) invocata al click
   */
  function openFeats(onSelect) {
    _mode     = 'feats';
    _char     = null;
    _blockIdx = null;
    _onSelect = onSelect;
    _page     = 0;
    _fType    = '';
    _fText    = '';
    _renderFilters();
    _applyFilter();
    _show('Cerca Talento');
  }

  // ── show / hide ───────────────────────────────────────────────────────────

  function _show(title) {
    const titleEl = _el('modal-search-title');
    if (titleEl) titleEl.textContent = title;
    const textEl = _el('modal-search-text');
    if (textEl) textEl.value = '';
    _el('modal-search')?.classList.remove('hidden');
    setTimeout(() => _el('modal-search-text')?.focus(), 50);
  }

  function _hide() {
    _el('modal-search')?.classList.add('hidden');
    _mode     = null;
    _onSelect = null;
    _filtered = [];
  }

  // ── filter rendering ──────────────────────────────────────────────────────

  function _renderFilters() {
    const filtersEl = _el('modal-search-filters');
    if (!filtersEl) return;

    if (_mode === 'spells') {
      const blocks = (_char && _char.spells) ? _char.spells : [];
      const classOptions = [
        '<option value="">— Tutte le classi del PG —</option>',
        ...blocks.map(b =>
          `<option value="${_esc(b.classId)}"${b.classId === _fClass ? ' selected' : ''}>${_esc(b.className || b.classId)}</option>`
        )
      ].join('');
      const levelOptions = [
        '<option value="">Tutti</option>',
        ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(l =>
          `<option value="${l}"${String(_fLevel) === String(l) ? ' selected' : ''}>${l}</option>`
        )
      ].join('');

      filtersEl.innerHTML = `
        <div class="ms-filter-row">
          <div class="field-group">
            <label>Classe</label>
            <select id="ms-filter-class" class="field-input">${classOptions}</select>
          </div>
          <div class="field-group">
            <label>Livello</label>
            <select id="ms-filter-level" class="field-input">${levelOptions}</select>
          </div>
        </div>`;

      _el('ms-filter-class')?.addEventListener('change', e => {
        _fClass = e.target.value; _page = 0; _applyFilter();
      });
      _el('ms-filter-level')?.addEventListener('change', e => {
        _fLevel = e.target.value; _page = 0; _applyFilter();
      });

    } else {
      const FEAT_TYPES = ['', 'Generali', 'Combattimento', 'Metamagia', 'Critico', 'Stile',
                          'Incanalare Energia', 'Squadra', 'Eroici', 'Trama'];
      const typeOptions = FEAT_TYPES.map(t =>
        `<option value="${_esc(t)}"${t === _fType ? ' selected' : ''}>${_esc(t) || '— Tutti —'}</option>`
      ).join('');

      filtersEl.innerHTML = `
        <div class="ms-filter-row">
          <div class="field-group">
            <label>Tipo</label>
            <select id="ms-filter-type" class="field-input">${typeOptions}</select>
          </div>
        </div>`;

      _el('ms-filter-type')?.addEventListener('change', e => {
        _fType = e.target.value; _page = 0; _applyFilter();
      });
    }
  }

  // ── filter logic ──────────────────────────────────────────────────────────

  function _applyFilter() {
    if (_mode === 'spells') _filterSpells();
    else                    _filterFeats();
    _renderResults();
  }

  function _filterSpells() {
    if (typeof PF1_SPELLS_DB === 'undefined') { _filtered = []; return; }
    const txt = _fText.toLowerCase().trim();
    const pgClassIds = (_char && _char.spells)
      ? _char.spells.map(b => b.classId).filter(Boolean)
      : [];

    _filtered = PF1_SPELLS_DB.filter(sp => {
      if (!sp.level) return false;

      if (_fClass) {
        // Classe specifica selezionata
        if (sp.level[_fClass] === undefined) return false;
        if (_fLevel !== '' && sp.level[_fClass] !== parseInt(_fLevel, 10)) return false;
      } else if (pgClassIds.length > 0) {
        // "Tutte le classi del PG": almeno una classe deve avere questo incantesimo
        if (!pgClassIds.some(cid => sp.level[cid] !== undefined)) return false;
      }

      if (txt) {
        const n  = (sp.name        || '').toLowerCase();
        const d  = (sp.description || '').toLowerCase();
        const sc = (sp.school      || '').toLowerCase();
        if (!n.includes(txt) && !d.includes(txt) && !sc.includes(txt)) return false;
      }
      return true;
    });
  }

  function _filterFeats() {
    if (typeof PF1_FEATS_DB === 'undefined') { _filtered = []; return; }
    const txt = _fText.toLowerCase().trim();
    _filtered = PF1_FEATS_DB.filter(ft => {
      if (_fType && ft.type !== _fType) return false;
      if (txt) {
        const n = (ft.name          || '').toLowerCase();
        const p = (ft.prerequisites || '').toLowerCase();
        const b = (ft.benefit       || '').toLowerCase();
        if (!n.includes(txt) && !p.includes(txt) && !b.includes(txt)) return false;
      }
      return true;
    });
  }

  // ── results rendering ─────────────────────────────────────────────────────

  function _getSpellLvDisplay(sp) {
    if (_fClass && sp.level && sp.level[_fClass] !== undefined) return sp.level[_fClass];
    if (_char && _char.spells) {
      for (const b of _char.spells) {
        if (b.classId && sp.level && sp.level[b.classId] !== undefined) return sp.level[b.classId];
      }
    }
    if (sp.level) {
      const vals = Object.values(sp.level);
      if (vals.length > 0) return Math.min(...vals);
    }
    return '?';
  }

  function _renderResults() {
    const resultsEl = _el('modal-search-results');
    const paginEl   = _el('modal-search-pagination');
    if (!resultsEl) return;

    const total      = _filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    _page = Math.min(_page, totalPages - 1);
    const start = _page * PAGE_SIZE;
    const items = _filtered.slice(start, start + PAGE_SIZE);

    if (items.length === 0) {
      resultsEl.innerHTML = '<p class="ms-no-results">Nessun risultato.</p>';
      if (paginEl) paginEl.innerHTML = '';
      return;
    }

    if (_mode === 'spells') {
      resultsEl.innerHTML = items.map((sp, i) => {
        const lv  = _getSpellLvDisplay(sp);
        const sub = [sp.components, sp.range].filter(Boolean).join(' · ');
        return `
          <div class="ms-result-item" data-idx="${start + i}">
            <div class="ms-result-main">
              <span class="ms-result-name">${_esc(sp.name)}</span>
              <span class="ms-result-badge">Lv ${lv}</span>
              <span class="ms-result-school">${_esc(sp.school || '')}</span>
            </div>
            ${sub ? `<div class="ms-result-sub">${_esc(sub)}</div>` : ''}
          </div>`;
      }).join('');
    } else {
      resultsEl.innerHTML = items.map((ft, i) => `
        <div class="ms-result-item" data-idx="${start + i}">
          <div class="ms-result-main">
            <span class="ms-result-name">${_esc(ft.name)}</span>
            <span class="ms-result-badge">${_esc(ft.type || 'Generale')}</span>
          </div>
          ${ft.prerequisites ? `<div class="ms-result-sub">Req.: ${_esc(ft.prerequisites)}</div>` : ''}
        </div>`
      ).join('');
    }

    if (paginEl) {
      if (totalPages <= 1) {
        paginEl.innerHTML = `<span class="ms-count">${total} risultati</span>`;
      } else {
        paginEl.innerHTML = `
          <button class="btn btn-ghost btn-sm ms-prev"${_page === 0 ? ' disabled' : ''}>‹ Prec</button>
          <span class="ms-count">${start + 1}–${Math.min(start + PAGE_SIZE, total)} di ${total}</span>
          <button class="btn btn-ghost btn-sm ms-next"${_page >= totalPages - 1 ? ' disabled' : ''}>Succ ›</button>`;
      }
    }
  }

  // ── event delegation ──────────────────────────────────────────────────────

  function _initEvents() {
    const modal = _el('modal-search');
    if (!modal) return;

    _el('modal-search-overlay')?.addEventListener('click', _hide);
    _el('btn-modal-search-close')?.addEventListener('click', _hide);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !_el('modal-search')?.classList.contains('hidden')) _hide();
    });

    _el('modal-search-text')?.addEventListener('input', e => {
      _fText = e.target.value;
      _page  = 0;
      _applyFilter();
    });

    _el('modal-search-results')?.addEventListener('click', e => {
      const item = e.target.closest('.ms-result-item');
      if (!item || !_onSelect) return;
      const idx  = parseInt(item.dataset.idx, 10);
      const data = _filtered[idx];
      if (data == null) return;
      _onSelect(data, _blockIdx);
      _hide();
    });

    _el('modal-search-pagination')?.addEventListener('click', e => {
      if (e.target.closest('.ms-prev')) { _page = Math.max(0, _page - 1); _renderResults(); }
      if (e.target.closest('.ms-next')) { _page++; _renderResults(); }
    });
  }

  // ── init ──────────────────────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _initEvents);
  } else {
    _initEvents();
  }

  return { openSpells, openFeats };
})();
