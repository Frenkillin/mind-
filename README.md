# MIND

**Il tuo cervello AI personale** — una piattaforma intelligente per gestire progetti, idee, obiettivi e agenti AI specializzati.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)

---

## Panoramica

MIND è un sistema modulare che combina:

- **Dashboard intelligente** — panoramica progetti, attività, obiettivi e note rapide
- **Memoria persistente** — salvataggio progetti, idee e cronologia attività su MongoDB
- **Sistema agenti AI** — Business, Development, Marketing e Research Agent
- **Provider AI multi-modello** — Google Gemini (default), Claude, OpenAI (opzionale)
- **Integrazioni pronte** — GitHub, Replit, controllo vocale e MCP

## Architettura

```
mind/
├── client/                 # Frontend React + Vite
│   └── src/
│       ├── components/     # UI components (dashboard, layout, agents)
│       ├── pages/          # Route pages
│       └── services/       # API client
├── server/                 # Backend Node.js + Express
│   └── src/
│       ├── config/         # Database e environment
│       ├── controllers/    # Request handlers
│       ├── models/         # Mongoose schemas
│       ├── routes/         # API routes
│       ├── services/
│       │   ├── agents/     # AI agent system
│       │   ├── ai/         # AI Provider Manager
│       │   └── integrations/  # Gemini, Claude, OpenAI, GitHub, Replit, Voice
│       └── middleware/
├── docker-compose.yml      # MongoDB container
└── package.json            # Root scripts
```

## Requisiti

- **Node.js** 18 o superiore
- **npm** 9+
- **Docker** (opzionale, per MongoDB) oppure MongoDB installato localmente

## Avvio rapido

### 1. Clona e installa

```bash
git clone <repository-url>
cd mind
npm run install:all
```

### 2. Configura l'ambiente

```bash
cp server/.env.example server/.env
```

Modifica `server/.env` con le tue credenziali:

```env
PORT=5000
MONGODB_URI=mongodb://mind:mind_secret@localhost:27017/mind?authSource=admin

# AI Providers — Gemini è il default
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-2.0-flash
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
OPENAI_ENABLED=false
GITHUB_TOKEN=ghp_...
GITHUB_USERNAME=tuousername
REPLIT_API_KEY=
VOICE_ENABLED=false
```

### 3. Avvia MongoDB

Con Docker:

```bash
docker-compose up -d
```

Oppure usa un'istanza MongoDB Atlas o locale.

### 4. Avvia l'applicazione

```bash
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health check:** http://localhost:5000/api/health

## Funzionalità

### Dashboard

| Sezione | Descrizione |
|---------|-------------|
| Statistiche | Progetti attivi, attività pendenti, obiettivi |
| Progetti | Panoramica progetti con progresso |
| Attività | Task da completare con priorità |
| Obiettivi | Tracker obiettivi con milestone |
| Note rapide | Post-it digitali con salvataggio istantaneo |
| Cronologia | Feed attività recenti |

### Agenti AI

| Agente | Specializzazione |
|--------|----------------|
| **Business Agent** | Strategia, business model, finanza |
| **Development Agent** | Architettura software, codice, debugging |
| **Marketing Agent** | Contenuti, campagne, crescita |
| **Research Agent** | Ricerca, analisi dati, report |

Gli agenti utilizzano il **AI Provider Manager** con Gemini come provider predefinito. Claude è supportato come alternativa; OpenAI è opzionale e disattivato di default (`OPENAI_ENABLED=false`).

### AI Provider Manager

| Provider | Default | Stato |
|----------|---------|-------|
| **Google Gemini** | Sì | Provider principale |
| **Claude** | No | Supportato |
| **OpenAI** | No | Opzionale, disattivato di default |

Il provider attivo è salvato in MongoDB (`AiSettings`) e selezionabile da Impostazioni o via API.

### Memoria persistente

Tutti i dati sono salvati su MongoDB:

- `Project` — progetti con stato, priorità e progresso
- `Idea` — idee categorizzate e stellabili
- `Task` — attività con scadenze e priorità
- `Goal` — obiettivi con milestone
- `Note` — note rapide
- `Activity` — cronologia automatica di ogni azione
- `AgentSession` — conversazioni con gli agenti AI

## API Endpoints

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/health` | Stato del server |
| GET | `/api/dashboard` | Dati dashboard aggregati |
| CRUD | `/api/projects` | Gestione progetti |
| CRUD | `/api/ideas` | Gestione idee |
| CRUD | `/api/tasks` | Gestione attività |
| CRUD | `/api/goals` | Gestione obiettivi |
| CRUD | `/api/notes` | Gestione note |
| GET | `/api/activities` | Cronologia attività |
| GET/POST | `/api/agents` | Lista agenti e sessioni |
| POST | `/api/agents/sessions/:id/message` | Invia messaggio ad agente |
| GET | `/api/integrations/status` | Stato integrazioni |
| GET | `/api/ai/providers` | Lista provider AI e provider attivo |
| POST | `/api/ai/provider` | Imposta provider attivo (`gemini`, `claude`, `openai`) |
| POST | `/api/ai/chat` | Chat tramite provider attivo o specificato |
| CRUD | `/api/memory` | Memoria permanente |

## Integrazioni

| Integrazione | File | Stato |
|--------------|------|-------|
| Google Gemini | `server/src/services/integrations/gemini.js` | **Default** |
| AI Provider Manager | `server/src/services/ai/aiProviderManager.js` | Pronto |
| Claude (Anthropic) | `server/src/services/integrations/claude.js` | Pronto |
| OpenAI | `server/src/services/integrations/openai.js` | Opzionale (`OPENAI_ENABLED`) |
| GitHub | `server/src/services/integrations/github.js` | Pronto |
| Replit | `server/src/services/integrations/replit.js` | Scaffold |
| Controllo vocale | `server/src/services/integrations/voice.js` | Scaffold |

## Script disponibili

```bash
npm run dev          # Avvia frontend + backend in parallelo
npm run dev:server   # Solo backend (porta 5000)
npm run dev:client   # Solo frontend (porta 3000)
npm run build        # Build produzione frontend
npm run start        # Avvia backend in produzione
npm run install:all  # Installa tutte le dipendenze
```

## Design

Interfaccia dark mode con accenti blu:

- Palette: sfondo `#0a0e17`, card `#1a2332`, accent `#3b82f6`
- Font: Inter
- Componenti modulari con CSS custom properties
- Layout responsive con sidebar collassabile su mobile

## Roadmap

- [ ] Autenticazione utente
- [ ] Controllo vocale completo (Web Speech API)
- [ ] Integrazione Replit GraphQL API
- [ ] Notifiche real-time (WebSocket)
- [ ] Export/import dati
- [ ] Mobile app (React Native)
- [ ] Plugin system per agenti custom

## Licenza

Progetto privato — tutti i diritti riservati.
