/**
 * storage.js
 * Gestione salvataggio/caricamento personaggi via localStorage.
 *
 * Strategia di storage:
 *   - Un indice leggero in  'pf1_index'       → array di { id, name, classes, totalLevel, race }
 *   - Ogni personaggio in   'pf1_char_<id>'   → oggetto completo JSON
 *
 * In questo modo la lista della home si carica senza deserializzare tutti i personaggi.
 *
 * API pubblica:
 *   Storage.getAllCharacters()              → Array di stub { id, name, classes, totalLevel, race }
 *   Storage.getCharacter(id)               → Oggetto personaggio completo (migrato se necessario)
 *   Storage.saveCharacter(character)       → Salva/aggiorna, ritorna id
 *   Storage.deleteCharacter(id)            → Rimuove personaggio e voce nell'indice
 *   Storage.exportCharacter(id)            → Scarica file .json
 *   Storage.importCharacter(file)          → Legge File object, ritorna Promise<character>
 *   Storage.importCharacterFromJson(str)   → Importa da stringa JSON, ritorna character
 *   Storage.getStorageUsage()              → { used, total, percent } in KB
 */

const Storage = (() => {
  const INDEX_KEY  = 'pf1_index';
  const CHAR_PREFIX = 'pf1_char_';

  // ── Indice ────────────────────────────────────────────────────────────────

  function _readIndex() {
    try {
      return JSON.parse(localStorage.getItem(INDEX_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function _writeIndex(index) {
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
  }

  /** Costruisce lo stub da inserire nell'indice a partire dal personaggio completo. */
  function _makeStub(char) {
    return {
      id:         char.id,
      name:       char.meta?.name        || 'Senza nome',
      race:       char.meta?.race        || '',
      classes:    char.meta?.classes     || [],
      totalLevel: char.meta?.totalLevel  || 1,
      updatedAt:  Date.now(),
    };
  }

  // ── Lettura ───────────────────────────────────────────────────────────────

  /**
   * Ritorna l'array di stub di tutti i personaggi salvati.
   * Usato dalla home per mostrare la lista senza caricare i dati completi.
   */
  function getAllCharacters() {
    return _readIndex();
  }

  /**
   * Carica il personaggio completo dal localStorage, lo migra se necessario,
   * e ritorna l'oggetto personaggio. Ritorna null se non trovato.
   */
  function getCharacter(id) {
    if (!id) return null;
    try {
      const raw = localStorage.getItem(CHAR_PREFIX + id);
      if (!raw) return null;
      const char = JSON.parse(raw);
      // Migra lo schema se il personaggio è stato salvato con una versione precedente
      return Character.migrate(char);
    } catch (e) {
      console.error('[Storage] Errore lettura personaggio:', id, e);
      return null;
    }
  }

  // ── Scrittura ─────────────────────────────────────────────────────────────

  /**
   * Salva o aggiorna un personaggio.
   * - Valida l'oggetto prima di salvare.
   * - Aggiorna l'indice.
   * Ritorna l'id del personaggio salvato, o lancia in caso di errore.
   */
  function saveCharacter(character) {
    const { valid, errors } = Character.validate(character);
    if (!valid) {
      throw new Error('[Storage] Personaggio non valido: ' + errors.join(', '));
    }

    const serialized = JSON.stringify(character);

    // Controlla che non si superi la quota disponibile (stima ~5MB per localStorage)
    try {
      localStorage.setItem(CHAR_PREFIX + character.id, serialized);
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        throw new Error('[Storage] Spazio localStorage esaurito. Esporta alcuni personaggi per liberare spazio.');
      }
      throw e;
    }

    // Aggiorna l'indice (crea o sovrascrive lo stub)
    const index = _readIndex();
    const existingIdx = index.findIndex(s => s.id === character.id);
    const stub = _makeStub(character);
    if (existingIdx >= 0) {
      index[existingIdx] = stub;
    } else {
      index.push(stub);
    }
    _writeIndex(index);

    return character.id;
  }

  // ── Cancellazione ─────────────────────────────────────────────────────────

  /**
   * Elimina il personaggio dal localStorage e lo rimuove dall'indice.
   * Non lancia errori se l'id non esiste.
   */
  function deleteCharacter(id) {
    if (!id) return;
    localStorage.removeItem(CHAR_PREFIX + id);
    const index = _readIndex().filter(s => s.id !== id);
    _writeIndex(index);
  }

  // ── Export ────────────────────────────────────────────────────────────────

  /**
   * Scarica il personaggio come file JSON sul dispositivo dell'utente.
   * Il file si chiama '<nome-personaggio>.pf1.json'.
   */
  function exportCharacter(id) {
    const char = getCharacter(id);
    if (!char) throw new Error('[Storage] Personaggio non trovato: ' + id);

    const json = JSON.stringify(char, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href     = url;
    // Sanitizza il nome del file rimuovendo caratteri non validi
    const safeName = (char.meta?.name || 'personaggio')
      .replace(/[^a-zA-Z0-9_\-À-ÿ ]/g, '_')
      .trim()
      .replace(/\s+/g, '_');
    a.download = safeName + '.pf1.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── Import ────────────────────────────────────────────────────────────────

  /**
   * Importa un personaggio da un oggetto File (input[type=file]).
   * Ritorna una Promise che risolve con il personaggio importato e salvato.
   * Se l'id esiste già, genera un nuovo id per evitare sovrascritture accidentali.
   */
  function importCharacter(file) {
    return new Promise((resolve, reject) => {
      if (!file || file.type !== 'application/json') {
        reject(new Error('Seleziona un file .json valido'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const char = importCharacterFromJson(e.target.result);
          resolve(char);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Errore lettura file'));
      reader.readAsText(file, 'utf-8');
    });
  }

  /**
   * Importa un personaggio da stringa JSON.
   * Migra lo schema, assegna un nuovo id se già esistente, salva e ritorna l'oggetto.
   */
  function importCharacterFromJson(jsonString) {
    let char;
    try {
      char = JSON.parse(jsonString);
    } catch {
      throw new Error('JSON non valido');
    }

    // Migra lo schema
    char = Character.migrate(char);

    // Valida
    const { valid, errors } = Character.validate(char);
    if (!valid) {
      throw new Error('File non valido: ' + errors.join(', '));
    }

    // Se l'id esiste già, genera un nuovo id per evitare conflitti
    if (localStorage.getItem(CHAR_PREFIX + char.id)) {
      char.id = Character.generateId();
      char.meta.name = char.meta.name + ' (importato)';
    }

    saveCharacter(char);
    return char;
  }

  // ── Utilità ───────────────────────────────────────────────────────────────

  /**
   * Stima dello spazio localStorage occupato dai personaggi PF1.
   * Ritorna { usedKB, totalKB (stima 5120), percent }
   */
  function getStorageUsage() {
    let usedBytes = 0;
    for (const key of Object.keys(localStorage)) {
      if (key === INDEX_KEY || key.startsWith(CHAR_PREFIX)) {
        usedBytes += (localStorage.getItem(key) || '').length * 2; // UTF-16 → ~2 byte/char
      }
    }
    const usedKB  = Math.round(usedBytes / 1024 * 10) / 10;
    const totalKB = 5120; // stima conservativa ~5 MB
    return {
      usedKB,
      totalKB,
      percent: Math.min(100, Math.round(usedKB / totalKB * 100)),
    };
  }

  // ── Party ──────────────────────────────────────────────────────────────────

  const PARTY_KEY = 'pf1_party';

  /**
   * Ritorna l'oggetto party attivo o null se non esiste.
   * Struttura: { id, name, characterIds: string[] }
   */
  function getParty() {
    try {
      return JSON.parse(localStorage.getItem(PARTY_KEY)) || null;
    } catch {
      return null;
    }
  }

  /** Salva il party nel localStorage. */
  function saveParty(party) {
    localStorage.setItem(PARTY_KEY, JSON.stringify(party));
  }

  /** Elimina il party (i personaggi non vengono eliminati). */
  function deleteParty() {
    localStorage.removeItem(PARTY_KEY);
  }

  // ── API pubblica ──────────────────────────────────────────────────────────

  return {
    getAllCharacters,
    getCharacter,
    saveCharacter,
    deleteCharacter,
    exportCharacter,
    importCharacter,
    importCharacterFromJson,
    getStorageUsage,
    getParty,
    saveParty,
    deleteParty,
  };
})();
