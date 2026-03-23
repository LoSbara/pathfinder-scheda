/**
 * sync.js — Sincronizzazione cloud via Supabase REST API
 *
 * Nessuna autenticazione. Tutti i personaggi del gruppo sono condivisi
 * e visibili a tutti: ognuno può vedere l'avanzamento dei compagni.
 *
 * CONFIGURAZIONE:
 *   1. Crea un progetto gratuito su https://supabase.com
 *   2. Nel SQL Editor esegui lo script qui sotto per creare la tabella:
 *
 *        CREATE TABLE characters (
 *          id          TEXT        PRIMARY KEY,
 *          data        JSONB       NOT NULL,
 *          updated_at  TIMESTAMPTZ DEFAULT now()
 *        );
 *        -- Accesso pubblico totale (senza autenticazione)
 *        ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
 *        CREATE POLICY "gruppo_pubblico" ON characters
 *          FOR ALL USING (true) WITH CHECK (true);
 *
 *   3. Sostituisci i valori in SUPABASE_URL e SUPABASE_ANON_KEY
 *      con quelli dal dashboard → Settings → API.
 *
 * API pubblica:
 *   Sync.isConfigured()         → bool: false se i placeholder non sono stati sostituiti
 *   Sync.upsert(char)           → Promise: salva/aggiorna il personaggio nel cloud
 *   Sync.remove(id)             → Promise: elimina il personaggio dal cloud
 *   Sync.pull()                 → Promise<number>: scarica tutto dal cloud in localStorage
 */
const Sync = (() => {

  // ── Configurazione ────────────────────────────────────────────────────────
  // Sostituire con i valori da: Supabase dashboard → Settings → API
  const SUPABASE_URL      = 'https://eozugrzsifdpwxmsjqud.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvenVncnpzaWZkcHd4bXNqcXVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjAwNzcsImV4cCI6MjA4OTc5NjA3N30.IjBLS5tY-M2ygpHtxgLRK4PxKLzHkpc-zpurovE4TGE';
  const TABLE             = 'characters';

  // ── Internals ─────────────────────────────────────────────────────────────

  function isConfigured() {
    return !SUPABASE_URL.startsWith('YOUR_') && !SUPABASE_ANON_KEY.startsWith('YOUR_');
  }

  function _headers(extra = {}) {
    return {
      'Content-Type': 'application/json',
      'apikey':        SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      ...extra,
    };
  }

  // ── Operazioni REST ───────────────────────────────────────────────────────

  /** Scarica tutti i personaggi dal cloud → [{ id, data, updated_at }] */
  async function fetchAll() {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?select=id,data,updated_at&order=updated_at.desc`,
      { headers: _headers() }
    );
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Sync fetchAll ${res.status}: ${body}`);
    }
    return res.json();
  }

  /** Salva o aggiorna un personaggio nel cloud (upsert su chiave primaria `id`). */
  async function upsert(char) {
    const payload = {
      id:         char.id,
      data:       char,
      updated_at: new Date().toISOString(),
    };
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method:  'POST',
      headers: _headers({ 'Prefer': 'resolution=merge-duplicates,return=minimal' }),
      body:    JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Sync upsert ${res.status}: ${body}`);
    }
  }

  /** Elimina un personaggio dal cloud tramite id. */
  async function remove(id) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`,
      { method: 'DELETE', headers: _headers() }
    );
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Sync remove ${res.status}: ${body}`);
    }
  }

  /**
   * Scarica tutti i personaggi dal cloud e li salva in localStorage.
   * Il dato cloud vince (sovrascrive sempre la versione locale).
   * I personaggi presenti solo in locale non vengono toccati.
   * @returns {Promise<number>} numero di personaggi sincronizzati
   */
  async function pull() {
    const rows = await fetchAll();
    let count = 0;
    for (const row of rows) {
      const char = row.data;
      if (!char?.id) continue;
      // Migra lo schema se necessario prima di salvare
      const migrated = (typeof Character !== 'undefined') ? Character.migrate(char) : char;
      Storage.saveCharacter(migrated);
      count++;
    }
    return count;
  }

  // ── API pubblica ──────────────────────────────────────────────────────────

  return { isConfigured, upsert, remove, pull };

})();
