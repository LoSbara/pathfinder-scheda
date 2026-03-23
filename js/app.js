/**
 * app.js
 * Entry point dell'applicazione.
 * Gestisce:
 *  - La schermata home (lista personaggi)
 *  - La navigazione home ↔ scheda personaggio
 *  - Il lifecycle: carica → modifica → salva → esporta/importa
 */

// Personaggio attualmente aperto in modifica
let activeCharacter = null;

// ── DOM refs ──────────────────────────────────────────────────────────────
const screenHome      = document.getElementById('screen-home');
const screenCharacter = document.getElementById('screen-character');
const characterList   = document.getElementById('character-list');
const btnNewCharacter = document.getElementById('btn-new-character');
const btnBack         = document.getElementById('btn-back');
const btnSave         = document.getElementById('btn-save');
const charHeaderName  = document.getElementById('char-header-name');

// ── Utility ───────────────────────────────────────────────────────────────

function _esc(s) {
  return String(s ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Navigazione ───────────────────────────────────────────────────────────

async function showHome() {
  screenCharacter.classList.remove('active');
  screenHome.classList.add('active');
  renderCharacterList();   // mostra subito i dati locali
  updateStorageBar();

  if (typeof Sync !== 'undefined' && Sync.isConfigured()) {
    updateCloudStatus('syncing');
    try {
      const count = await Sync.pull();
      renderCharacterList();  // aggiorna con i dati cloud
      updateStorageBar();
      updateCloudStatus('ok', count);
    } catch (e) {
      console.warn('[Sync] Pull fallito:', e.message);
      updateCloudStatus('error');
    }
  }
}

function showCharacterSheet(character) {
  activeCharacter = character;
  charHeaderName.textContent = character.meta.name || 'Personaggio';
  screenHome.classList.remove('active');
  screenCharacter.classList.add('active');
  // Scroll to top when opening a character sheet
  window.scrollTo(0, 0);
  UI.init(character);
}

// ── Home: lista personaggi ────────────────────────────────────────────────

function renderCharacterList() {
  const chars  = Storage.getAllCharacters();
  const empty  = document.getElementById('home-empty');
  characterList.innerHTML = '';

  if (chars.length === 0) {
    empty?.classList.remove('hidden');
    return;
  }
  empty?.classList.add('hidden');

  chars.forEach(stub => {
    const classText = (stub.classes || [])
      .map(c => `${c.className || '?'} ${c.level || 1}`)
      .join(' / ') || 'Nessuna classe';

    const card = document.createElement('div');
    card.className = 'character-card';
    card.innerHTML = `
      <div class="card-name">${_esc(stub.name || 'Senza nome')}</div>
      <div class="card-info">
        ${_esc(stub.race || '—')} &nbsp;·&nbsp; ${_esc(classText)}
      </div>
      <div class="card-level">Livello ${stub.totalLevel || '—'}</div>
      <div class="card-actions">
        <button class="btn btn-primary btn-sm" data-action="open"   data-id="${_esc(stub.id)}"><i class="fa-solid fa-folder-open"></i> Apri</button>
        <button class="btn btn-ghost   btn-sm" data-action="export" data-id="${_esc(stub.id)}" title="Esporta JSON"><i class="fa-solid fa-file-export"></i> Esporta</button>
        <button class="btn btn-danger  btn-sm" data-action="delete" data-id="${_esc(stub.id)}" title="Elimina definitivamente"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    characterList.appendChild(card);
  });
}

// ── Creazione nuovo personaggio ───────────────────────────────────────────

function handleNewCharacter() {
  const modal      = document.getElementById('modal-new-character');
  const nameInput  = document.getElementById('modal-char-name');
  const playerInput= document.getElementById('modal-player-name');
  if (nameInput)   nameInput.value   = '';
  if (playerInput) playerInput.value = '';
  modal?.classList.remove('hidden');
  setTimeout(() => nameInput?.focus(), 60);
}

function _closeModal() {
  document.getElementById('modal-new-character')?.classList.add('hidden');
  const cls = document.getElementById('modal-char-class');
  if (cls) cls.value = '';
}

function _confirmNewCharacter() {
  const name   = (document.getElementById('modal-char-name')?.value   || '').trim() || 'Nuovo Personaggio';
  const player = (document.getElementById('modal-player-name')?.value || '').trim();
  const selectedClass = (document.getElementById('modal-char-class')?.value || '').trim();

  const char = Character.createDefault(name);
  char.meta.playerName = player;

  // Pre-compila la classe selezionata (con hitDie corretto dal config)
  if (selectedClass && typeof ClassConfig !== 'undefined') {
    const cfg = ClassConfig.findByName(selectedClass);
    if (cfg) {
      char.meta.classes    = [{ className: selectedClass, level: 1, hitDie: cfg.hitDie }];
      char.meta.totalLevel = 1;
    }
  }

  try {
    Storage.saveCharacter(char);
  } catch (e) {
    showToast('Errore nel salvataggio: ' + e.message, 'error');
    return;
  }

  // Sincronizzazione cloud del nuovo personaggio
  if (typeof Sync !== 'undefined' && Sync.isConfigured()) {
    Sync.upsert(char).catch(e => console.warn('[Sync] Upsert fallito:', e.message));
  }

  _closeModal();
  showToast(`"${name}" creato!`, 'success');
  showCharacterSheet(char);
}

// ── Salvataggio ───────────────────────────────────────────────────────────

function handleSave() {
  if (!activeCharacter) return;
  try {
    Storage.saveCharacter(activeCharacter);
    btnSave.classList.remove('has-changes');
    showToast('Salvato!', 'success');
  } catch (e) {
    showToast('Errore nel salvataggio: ' + e.message, 'error');
    return;
  }
  // Sincronizzazione cloud (fire-and-forget)
  if (typeof Sync !== 'undefined' && Sync.isConfigured()) {
    Sync.upsert(activeCharacter).catch(e =>
      console.warn('[Sync] Upsert fallito:', e.message)
    );
  }
}

// ── Cloud status ─────────────────────────────────────────────────────────

/**
 * Aggiorna l'indicatore cloud nella home toolbar.
 * @param {'ok'|'syncing'|'error'|'off'} state
 * @param {number} [count] numero personaggi sincronizzati (solo per 'ok')
 */
function updateCloudStatus(state, count) {
  const el   = document.getElementById('cloud-status');
  const icon = document.getElementById('cloud-icon');
  const text = document.getElementById('cloud-status-text');
  if (!el || !icon || !text) return;

  el.classList.remove('hidden', 'cloud-ok', 'cloud-syncing', 'cloud-error');

  if (state === 'off' || (typeof Sync !== 'undefined' && !Sync.isConfigured())) {
    el.classList.add('hidden');
    return;
  }

  if (state === 'syncing') {
    el.classList.add('cloud-syncing');
    icon.className = 'fa-solid fa-cloud';
    text.textContent = 'Sincronizzazione…';
  } else if (state === 'ok') {
    el.classList.add('cloud-ok');
    icon.className = 'fa-solid fa-cloud-arrow-up';
    text.textContent = count != null ? `Cloud — ${count} personagg${count === 1 ? 'io' : 'i'}` : 'Cloud attivo';
  } else if (state === 'error') {
    el.classList.add('cloud-error');
    icon.className = 'fa-solid fa-cloud-exclamation';
    text.textContent = 'Sync non disponibile';
  }
}

// ── Toast ─────────────────────────────────────────────────────────────────

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  // Reset classes then apply
  toast.className = 'toast toast-' + type;
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.add('hidden'), 2600);
}

// ── Barra storage ─────────────────────────────────────────────────────────

function updateStorageBar() {
  const u    = Storage.getStorageUsage();
  const text = document.getElementById('storage-text');
  const fill = document.getElementById('storage-fill');
  if (text) text.textContent =
    `Spazio: ${u.usedKB.toFixed(0)} KB / ${u.totalKB.toFixed(0)} KB (${u.percent.toFixed(0)}%)`;
  if (fill) fill.style.width = Math.min(100, u.percent) + '%';
}

// ── Event listeners ───────────────────────────────────────────────────────

btnNewCharacter.addEventListener('click', handleNewCharacter);

btnBack.addEventListener('click', () => {
  if (btnSave.classList.contains('has-changes')) {
    if (!confirm('Ci sono modifiche non salvate. Tornare alla home senza salvare?')) return;
  }
  showHome();
});

btnSave.addEventListener('click', handleSave);

// Modal
document.getElementById('btn-modal-cancel')?.addEventListener('click', _closeModal);
document.getElementById('btn-modal-confirm')?.addEventListener('click', _confirmNewCharacter);
document.getElementById('modal-overlay')?.addEventListener('click', _closeModal);
document.getElementById('modal-char-name')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') _confirmNewCharacter();
});

// Azioni sulle card personaggi (event delegation)
characterList.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;

  if (action === 'open') {
    const char = Storage.getCharacter(id);
    if (char) showCharacterSheet(char);
    else      showToast('Personaggio non trovato', 'error');
  }
  if (action === 'delete') {
    const name = btn.closest('.character-card')?.querySelector('.card-name')?.textContent || 'questo personaggio';
    if (!confirm(`Eliminare definitivamente "${name}"? L'operazione è irreversibile.`)) return;
    Storage.deleteCharacter(id);
    renderCharacterList();
    updateStorageBar();
    showToast('Personaggio eliminato', 'info');
    // Rimuovi anche dal cloud
    if (typeof Sync !== 'undefined' && Sync.isConfigured()) {
      Sync.remove(id).catch(e => console.warn('[Sync] Remove fallito:', e.message));
    }
  }
  if (action === 'export') {
    Storage.exportCharacter(id);
  }
});

// Esporta dalla scheda aperta
document.getElementById('btn-export')?.addEventListener('click', () => {
  if (activeCharacter) Storage.exportCharacter(activeCharacter.id);
});

// Importa da file
document.getElementById('input-import')?.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  Storage.importCharacter(file)
    .then(char => {
      showToast(`"${char.meta.name}" importato!`, 'success');
      renderCharacterList();
      updateStorageBar();
    })
    .catch(err => showToast('Errore importazione: ' + err.message, 'error'));
  e.target.value = ''; // reset per permettere re-import dello stesso file
});

// Ctrl+S / Cmd+S per salvare
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    if (activeCharacter && screenCharacter.classList.contains('active')) {
      handleSave();
    }
  }
});

// ── Init ──────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  showHome();
});

// ════════════════════════════════════════════════════════════════════════════
// SISTEMA DI LEVEL UP
// ════════════════════════════════════════════════════════════════════════════

/**
 * Stato del modal di level-up (null = modal chiuso).
 * @type {{ isNewClass:boolean, classIdx:number, newClassName:string,
 *          hpChoice:string, hpRolled:number, hpCustom:number }|null}
 */
let _luState = null;

// ── Formule PF1 tiri salvezza ──────────────────────────────────────────────

function _goodSaveTotal(level) { return level <= 0 ? 0 : 2 + Math.floor(level / 2); }
function _badSaveTotal(level)  { return level <= 0 ? 0 : Math.floor(level / 3); }

function _babTotal(prog, level) {
  if (level <= 0) return 0;
  if (prog === 'full') return level;
  if (prog === '3_4')  return Math.floor(level * 3 / 4);
  return Math.floor(level / 2); // half
}

/**
 * Delta TS per un livello-up. Gestisce regola multiclasse PF1:
 * il bonus iniziale +2 dei tiri "buoni" si ottiene solo dalla PRIMA classe che lo fornisce.
 */
function _luSaveDelta(char, classInfo, saveType) {
  if (!classInfo?.cfg?.saves) return 0;
  const prog      = classInfo.cfg.saves[saveType];
  const levelFrom = classInfo.level; // livello corrente (prima dell'incremento)
  const levelTo   = levelFrom + 1;

  if (prog === 'good') {
    if (levelFrom === 0) {
      // Prima volta in questa classe: verifica se un'altra classe dà già il +2 di base
      const alreadyHasGood = (char.meta.classes || []).some(c => {
        const oCfg = typeof ClassConfig !== 'undefined' ? ClassConfig.findByName(c.className) : null;
        return oCfg?.saves?.[saveType] === 'good' && (c.level || 0) > 0;
      });
      return alreadyHasGood ? 0 : 2;
    }
    return _goodSaveTotal(levelTo) - _goodSaveTotal(levelFrom);
  }
  return _badSaveTotal(levelTo) - _badSaveTotal(levelFrom);
}

/** BAB totale previsto dopo il livello-up (somma di tutte le classi). */
function _luPreviewBab(char, classInfo) {
  let total = 0;
  (char.meta.classes || []).forEach((c, i) => {
    const isThis = !classInfo.isNew && i === classInfo.idx;
    const lvl    = isThis ? (classInfo.level + 1) : (c.level || 0);
    const cCfg   = typeof ClassConfig !== 'undefined' ? ClassConfig.findByName(c.className) : null;
    total += _babTotal(cCfg?.bab || 'half', lvl);
  });
  if (classInfo.isNew && classInfo.cfg) {
    total += _babTotal(classInfo.cfg.bab || 'half', 1);
  }
  return total;
}

// ── Apertura e chiusura modal ──────────────────────────────────────────────

function handleLevelUp() {
  if (!activeCharacter) return;
  const char = activeCharacter;
  _luState = {
    isNewClass:   char.meta.classes.length === 0,
    classIdx:     0,
    newClassName: '',
    hpChoice:     'average',
    hpRolled:     0,
    hpCustom:     1,
  };
  document.getElementById('modal-level-up')?.classList.remove('hidden');
  _renderLevelUpModal(char);
}

function _closeLevelUpModal() {
  document.getElementById('modal-level-up')?.classList.add('hidden');
  _luState = null;
}

// ── Selezione classe (helper) ─────────────────────────────────────────────

function _getSelectedClassInfo(char) {
  if (_luState.isNewClass) {
    const name = (_luState.newClassName || '').trim();
    if (!name) return null;
    const cfg = typeof ClassConfig !== 'undefined' ? ClassConfig.findByName(name) : null;
    return { name, level: 0, hitDie: cfg?.hitDie || 8, cfg, isNew: true };
  }
  const i   = _luState.classIdx;
  const cls = (char.meta.classes || [])[i];
  if (!cls) return null;
  const cfg = typeof ClassConfig !== 'undefined' ? ClassConfig.findByName(cls.className) : null;
  return { name: cls.className, level: cls.level || 1, hitDie: cfg?.hitDie || cls.hitDie || 8,
           cfg, isNew: false, idx: i };
}

// ── Render completo del modal ──────────────────────────────────────────────

function _renderLevelUpModal(char) {
  _renderLuClassPicker(char);
  _renderLuHP(char);
  _renderLuChanges(char);
  const currentTotal = (char.meta.classes || []).reduce((s, c) => s + (c.level || 0), 0);
  const newTotal = currentTotal + 1;
  _renderLuFeat(newTotal);
  _renderLuAbility(newTotal);
}

function _renderLuClassPicker(char) {
  const container = document.getElementById('lu-class-picker');
  if (!container) return;
  let html = '<div class="lu-class-options">';

  (char.meta.classes || []).forEach((cls, i) => {
    const sel = !_luState.isNewClass && _luState.classIdx === i;
    const cfg = typeof ClassConfig !== 'undefined' ? ClassConfig.findByName(cls.className) : null;
    const hd  = cfg?.hitDie || cls.hitDie || 8;
    const lvl = cls.level || 1;
    html += `<label class="lu-class-option${sel ? ' selected' : ''}" data-class-idx="${i}">
      <input type="radio" name="lu-class" value="${i}" ${sel ? 'checked' : ''} />
      <span class="lu-class-name">${_esc(cls.className || '?')}</span>
      <span class="lu-class-chips">
        <span class="lu-chip">Lv ${lvl} → ${lvl + 1}</span>
        <span class="lu-chip">d${hd}</span>
        ${cfg?.saves ? `<span class="lu-chip">${cfg.saves.fort==='good'?'T✓':'T✗'} ${cfg.saves.ref==='good'?'R✓':'R✗'} ${cfg.saves.will==='good'?'V✓':'V✗'}</span>` : ''}
      </span>
    </label>`;
  });

  const newSel = _luState.isNewClass;
  html += `<label class="lu-class-option${newSel ? ' selected' : ''}" data-class-idx="new">
    <input type="radio" name="lu-class" value="new" ${newSel ? 'checked' : ''} />
    <span class="lu-class-name"><i class="fa-solid fa-plus" style="color:var(--gold)"></i> Nuova classe / Multiclasse</span>
  </label>`;

  if (newSel) {
    html += `<div class="lu-new-class-row">
      <input type="text" id="lu-new-class-name" class="field-input" list="class-datalist"
             value="${_esc(_luState.newClassName)}" placeholder="Nome classe..." autocomplete="off" />
    </div>`;
  }

  html += '</div>';
  container.innerHTML = html;
}

function _renderLuHP(char) {
  const container = document.getElementById('lu-hp-section');
  if (!container) return;
  const classInfo = _getSelectedClassInfo(char);
  if (!classInfo) {
    container.innerHTML = '<p class="text-muted" style="font-size:.85rem">Seleziona prima una classe.</p>';
    return;
  }

  const hd  = classInfo.hitDie;
  const avg = Math.floor(hd / 2) + 1;
  const con = typeof Combat !== 'undefined' ? Combat.mod(char, 'con') : 0;
  const pCon = con >= 0 ? `+${con}` : `${con}`;

  let roll;
  if (_luState.hpChoice === 'max')    roll = hd;
  else if (_luState.hpChoice === 'roll') roll = _luState.hpRolled || avg;
  else if (_luState.hpChoice === 'custom') roll = _luState.hpCustom || 1;
  else roll = avg;

  const gain = Math.max(1, roll + con);
  const newHpMax = (char.combat.hpMax || 0) + gain;

  const btn = (val, label) =>
    `<button class="btn lu-hp-btn${_luState.hpChoice === val ? ' active' : ''}" data-hp="${val}">${label}</button>`;

  let html = `<div class="lu-hp-options">
    ${btn('max',    `Massimo <span class="lu-die-badge">d${hd}=${hd}</span>`)}
    ${btn('average',`Media <span class="lu-die-badge">${avg}/d${hd}</span>`)}
    ${btn('roll', `<i class="fa-solid fa-dice"></i> Tira${_luState.hpChoice === 'roll' && _luState.hpRolled ? ` <strong>${_luState.hpRolled}</strong>` : ''}`)}
    ${btn('custom', 'Personalizzato')}
  </div>`;

  if (_luState.hpChoice === 'custom') {
    html += `<div class="lu-custom-hp-row">
      <input type="number" id="lu-custom-hp" class="field-input field-narrow"
             min="1" max="${hd}" value="${_luState.hpCustom || 1}" />
      <span class="text-muted"> / d${hd}</span>
    </div>`;
  }

  html += `<div class="lu-hp-preview">
    <span>Dado vita: <strong>d${hd}</strong></span>
    <span>CON: <strong>${pCon}</strong></span>
    <span class="lu-hp-gain">+${gain} PF</span>
    <span class="text-muted">(${char.combat.hpMax || 0} → <strong>${newHpMax}</strong>)</span>
  </div>`;

  container.innerHTML = html;
}

function _renderLuChanges(char) {
  const container = document.getElementById('lu-changes-preview');
  if (!container) return;
  const classInfo = _getSelectedClassInfo(char);
  if (!classInfo) {
    container.innerHTML = '<p class="text-muted" style="font-size:.85rem">Seleziona una classe per vedere la progressione.</p>';
    return;
  }

  const intMod = typeof Combat !== 'undefined' ? Combat.mod(char, 'int') : 0;
  const currentTotal = (char.meta.classes || []).reduce((s, c) => s + (c.level || 0), 0);
  const newTotal = currentTotal + 1;

  const currentBab = char.combat.bab || 0;
  const newBab     = _luPreviewBab(char, classInfo);

  const fort  = char.combat.saves?.fortBase || 0;
  const ref   = char.combat.saves?.refBase  || 0;
  const will  = char.combat.saves?.willBase || 0;
  const dFort = _luSaveDelta(char, classInfo, 'fort');
  const dRef  = _luSaveDelta(char, classInfo, 'ref');
  const dWill = _luSaveDelta(char, classInfo, 'will');

  const baseSkillPts     = classInfo.cfg?.skillPts || 2;
  const skillPtsPerLevel = Math.max(1, baseSkillPts + intMod);
  const skillPts         = classInfo.isNew ? skillPtsPerLevel * 4 : skillPtsPerLevel;

  const plus = n => n > 0 ? `<span class="lu-pos">+${n}</span>` : n < 0 ? `<span class="lu-neg">${n}</span>` : '<span class="text-muted">0</span>';
  const saveRow = (label, cur, delta) => `
    <div class="lu-change-item${delta !== 0 ? ' lu-change-notable' : ''}">
      <span class="lu-change-label">${label}</span>
      <span class="lu-change-value">${delta !== 0 ? `${cur} → <strong>${cur + delta}</strong> ${plus(delta)}` : `<span class="text-muted">${cur} (invariato)</span>`}</span>
    </div>`;

  let html = `<div class="lu-changes-grid">
    <div class="lu-change-item lu-change-highlight">
      <span class="lu-change-label">Livello totale</span>
      <span class="lu-change-value">${currentTotal} → <strong>${newTotal}</strong></span>
    </div>
    <div class="lu-change-item${newBab !== currentBab ? ' lu-change-notable' : ''}">
      <span class="lu-change-label">BAB</span>
      <span class="lu-change-value">${newBab !== currentBab ? `${currentBab} → <strong>${newBab}</strong> ${plus(newBab - currentBab)}` : `<span class="text-muted">${currentBab} (invariato)</span>`}</span>
    </div>
    ${saveRow('Tempra', fort, dFort)}
    ${saveRow('Riflessi', ref, dRef)}
    ${saveRow('Volontà', will, dWill)}
    <div class="lu-change-item">
      <span class="lu-change-label">Punti Abilità</span>
      <span class="lu-change-value"><strong>+${skillPts}</strong>
        <span class="text-muted">(${baseSkillPts} base ${intMod >= 0 ? '+' : ''}${intMod} INT${classInfo.isNew ? ' ×4 primo lv' : ''}, min 1/lv)</span>
      </span>
    </div>`;

  if (classInfo.cfg?.spellAbility) {
    html += `<div class="lu-change-item">
      <span class="lu-change-label">Incantesimi</span>
      <span class="lu-change-value text-muted">Aggiorna gli slot nel tab Incantesimi</span>
    </div>`;
  }

  html += '</div>';
  container.innerHTML = html;
}

function _renderLuFeat(newTotal) {
  const el = document.getElementById('lu-feat-section');
  if (!el) return;
  el.classList.toggle('hidden', !(newTotal === 1 || newTotal % 2 === 1));
}

function _renderLuAbility(newTotal) {
  const el = document.getElementById('lu-ability-section');
  if (!el) return;
  el.classList.toggle('hidden', ![4, 8, 12, 16, 20].includes(newTotal));
}

// ── Applica level-up ──────────────────────────────────────────────────────

function _applyLevelUp() {
  if (!activeCharacter || !_luState) return;
  const char = activeCharacter;
  const classInfo = _getSelectedClassInfo(char);

  if (!classInfo) {
    showToast('Seleziona una classe prima di confermare.', 'error');
    return;
  }

  // Calcola delta PRIMA di aggiornare le classi (per la regola multiclasse saves)
  const dFort = _luSaveDelta(char, classInfo, 'fort');
  const dRef  = _luSaveDelta(char, classInfo, 'ref');
  const dWill = _luSaveDelta(char, classInfo, 'will');
  const conMod = typeof Combat !== 'undefined' ? Combat.mod(char, 'con') : 0;

  // 1. Aggiorna o aggiungi la classe
  if (classInfo.isNew) {
    char.meta.classes.push({ className: classInfo.name, level: 1, hitDie: classInfo.hitDie });
  } else {
    char.meta.classes[classInfo.idx].level = classInfo.level + 1;
  }
  char.meta.totalLevel = char.meta.classes.reduce((s, c) => s + (c.level || 0), 0);
  const newTotal = char.meta.totalLevel;

  // 2. Punti Ferita
  const hd  = classInfo.hitDie;
  const avg = Math.floor(hd / 2) + 1;
  let hpRoll;
  switch (_luState.hpChoice) {
    case 'max':     hpRoll = hd;  break;
    case 'average': hpRoll = avg; break;
    case 'roll':    hpRoll = _luState.hpRolled || avg; break;
    case 'custom':  hpRoll = Math.max(1, parseInt(document.getElementById('lu-custom-hp')?.value || '1', 10)); break;
    default:        hpRoll = avg;
  }
  const hpGain = Math.max(1, hpRoll + conMod);
  char.combat.hpMax     = (char.combat.hpMax     || 0) + hpGain;
  char.combat.hpCurrent = (char.combat.hpCurrent || 0) + hpGain;

  // 3. Tiri Salvezza
  if (!char.combat.saves) char.combat.saves = {};
  char.combat.saves.fortBase = (char.combat.saves.fortBase || 0) + dFort;
  char.combat.saves.refBase  = (char.combat.saves.refBase  || 0) + dRef;
  char.combat.saves.willBase = (char.combat.saves.willBase || 0) + dWill;

  // 4. Talento (livelli dispari: 1, 3, 5...)
  if (newTotal === 1 || newTotal % 2 === 1) {
    const featName = (document.getElementById('lu-feat-name')?.value || '').trim();
    if (featName) {
      char.feats.push({ id: Character.generateId(), name: featName,
        type: 'Generale', prerequisites: '', description: '', notes: '' });
    }
  }

  // 5. Aumento caratteristica (livelli 4, 8, 12, 16, 20)
  if ([4, 8, 12, 16, 20].includes(newTotal)) {
    const abilKey = document.getElementById('lu-ability-select')?.value || 'str';
    char.abilities[abilKey] = (char.abilities[abilKey] || 10) + 1;
  }

  // 6. CasterLevel per incantatori
  if (classInfo.cfg?.spellAbility) {
    char.spells.casterLevel = char.meta.classes
      .filter(c => (typeof ClassConfig !== 'undefined' && ClassConfig.findByName(c.className)?.hasSpellsTab))
      .reduce((s, c) => s + (c.level || 0), 0);
  }

  // 7. Chiudi e aggiorna UI (applyClassProfile e _autoFillBab vengono chiamati qui)
  _closeLevelUpModal();
  UI.init(char);
  btnSave.classList.add('has-changes');

  const clsLabel = classInfo.isNew ? ` in ${classInfo.name}` : '';
  showToast(`Livello ${newTotal} raggiunto${clsLabel}! +${hpGain} PF`, 'success');
}

// ── Event listeners level-up ──────────────────────────────────────────────

document.getElementById('btn-level-up')?.addEventListener('click', handleLevelUp);
document.getElementById('btn-lu-cancel')?.addEventListener('click', _closeLevelUpModal);
document.getElementById('btn-lu-confirm')?.addEventListener('click', _applyLevelUp);
document.getElementById('modal-lu-overlay')?.addEventListener('click', _closeLevelUpModal);

// Click delegation sul corpo del modal
document.getElementById('modal-level-up')?.addEventListener('click', e => {
  if (!_luState || !activeCharacter) return;
  const char = activeCharacter;

  // Selezione classe con click sull'etichetta
  const classOpt = e.target.closest('.lu-class-option');
  if (classOpt) {
    const idx = classOpt.dataset.classIdx;
    if (idx === 'new') {
      _luState.isNewClass = true;
      _luState.classIdx   = 0;
    } else {
      _luState.isNewClass = false;
      _luState.classIdx   = parseInt(idx, 10);
    }
    _renderLevelUpModal(char);
    return;
  }

  // Scelta tipo HP
  const hpBtn = e.target.closest('[data-hp]');
  if (hpBtn) {
    const choice = hpBtn.dataset.hp;
    if (choice === 'roll') {
      const info = _getSelectedClassInfo(char);
      _luState.hpRolled = Math.floor(Math.random() * (info?.hitDie || 8)) + 1;
    }
    _luState.hpChoice = choice;
    _renderLuHP(char);
    return;
  }
});

// Input delegation per campi dinamici
document.getElementById('modal-level-up')?.addEventListener('input', e => {
  if (!_luState || !activeCharacter) return;
  const char = activeCharacter;

  if (e.target.id === 'lu-custom-hp') {
    const info = _getSelectedClassInfo(char);
    _luState.hpCustom = Math.max(1, Math.min(info?.hitDie || 8, parseInt(e.target.value || '1', 10)));
    _renderLuHP(char);
    return;
  }

  if (e.target.id === 'lu-new-class-name') {
    _luState.newClassName = e.target.value;
    _renderLuHP(char);
    _renderLuChanges(char);
    const currentTotal = (char.meta.classes || []).reduce((s, c) => s + (c.level || 0), 0);
    _renderLuFeat(currentTotal + 1);
    _renderLuAbility(currentTotal + 1);
    return;
  }
});

