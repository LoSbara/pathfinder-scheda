# Pathfinder 1e — Torre di Jacob: Gestore Schede

Applicazione web statica per gestire le schede dei personaggi di Pathfinder 1e, progettata per l'avventura **Torre di Jacob** (13 piani, livello 1→13).

## Come usare

### Localmente
Apri `index.html` in un browser. Non serve nessun server.

### Su GitHub Pages
1. Crea un repository pubblico su GitHub
2. Carica tutti i file
3. Vai su *Settings → Pages → Source: main / root*
4. Il sito sarà disponibile su `https://<tuo-utente>.github.io/<nome-repo>/`

## Funzionalità
- Gestione multipla di personaggi (uno per giocatore)
- Salvataggio automatico su `localStorage` del dispositivo
- **Sommario**: nome, razza, classe, livello, immagine
- **Caratteristiche**: STR, DEX, CON, INT, WIS, CHA + modificatori
- **Combattimento**: PF, CA (normale/contatto/impreparato), CMB, CMD, TS, iniziativa
- **Abilità**: lista completa PF1 con gradi e calcolo automatico
- **Armi**: lista armi con bonus attacco e danno calcolati
- **Equipaggiamento**: inventario con peso e monete
- **Talenti & Capacità di Classe**: lista con descrizione
- **Incantesimi**: slot per livello, usati/disponibili
- **Note**: testo libero

## Riferimenti regole
- [Golarion Wiki (ITA)](https://golarion.altervista.org/wiki/Pagina_principale)
- [d20pfsrd (ENG)](https://www.d20pfsrd.com)

## Struttura file
```
pathfinder-scheda/
├── index.html              # Unica pagina HTML
├── styles/
│   ├── main.css            # Stili globali e home
│   └── character.css       # Stili scheda personaggio
├── js/
│   ├── data/
│   │   ├── skills-list.js  # Lista statica abilità PF1
│   │   └── spells-list.js  # Database incantesimi (opzionale)
│   ├── storage.js          # localStorage API
│   ├── character.js        # Modello dati personaggio
│   ├── combat.js           # Calcoli CA, CMB, CMD, TS, armi
│   ├── skills.js           # Calcolo totali abilità
│   ├── ui.js               # Rendering e binding eventi
│   └── app.js              # Entry point, navigazione
└── assets/                 # Immagini statiche (icone, sfondi)
```
