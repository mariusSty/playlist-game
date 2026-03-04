# 🎵 Playlist Game

> _Pas besoin de connaître la musique. Il faut connaître les gens._

Application mobile (client) du jeu **Playlist Game** — un jeu multijoueur en temps réel pensé pour les soirées entre amis. Chaque manche, un thème est posé, chaque joueur choisit une chanson anonymement, et les autres doivent deviner **qui a choisi quoi**.

---

## 🕹️ Comment se joue une partie ?

### 1. Création du salon

Un joueur crée un salon et partage le **code PIN à 6 chiffres** à ses amis. Une fois tout le monde connecté, l'hôte lance la partie : le nombre de manches correspond au nombre de joueurs (chaque joueur devient meneur à tour de rôle).

### 2. Chaque manche se déroule en 3 temps

**🎤 Phase de thème**
Le meneur de manche — rôle qui tourne à chaque manche — choisit parmi **5 thèmes prédéfinis** :

- _"Votre meilleure chanson pour séduire"_
- _"Votre meilleure chanson pour dormir"_
- _"Votre meilleure chanson pour faire la fête"_
- _"La chanson qui vous remonte le moral"_
- _"Le son que vous écoutez en boucle en ce moment"_

Les autres joueurs voient un écran d'attente pendant que le meneur choisit.

**🎧 Phase de sélection**
Chaque joueur voit le thème et **recherche une chanson** via l'API Deezer intégrée. Des indicateurs (avatars) montrent en temps réel qui a déjà choisi. Les joueurs peuvent annuler et changer leur choix.

**🗳️ Phase de vote**
Les extraits de 30 secondes sont joués un par un, de façon anonyme, avec des contrôles lecture/pause/replay. Pour chaque extrait, les joueurs votent pour la personne qui leur semble avoir choisi cette chanson.

**À la fin de la manche**, les résultats sont révélés : qui a choisi quoi, qui a bien deviné (✅) et qui s'est trompé (❌).

### 3. Fin de partie

Après toutes les manches, le **classement final** est affiché avec les scores. Les joueurs sont renvoyés dans le salon et peuvent lancer une nouvelle partie.

---

## ✨ Fonctionnalités

| Fonctionnalité           | Détail                                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------- |
| 🎤 Thèmes variés         | 5 thèmes prédéfinis par manche                                                                     |
| 🔄 Rôle rotatif          | Le meneur change à chaque manche — tout le monde contribue                                         |
| 🕵️ Révélation différée   | Les identités ne sont révélées qu'en fin de manche, pour garder le suspense sur les votes suivants |
| 🎵 Extraits audio        | Recherche Deezer intégrée — extraits 30s avec contrôles audio complets                             |
| 🧑‍🤝‍🧑 Avatars personnalisés | Avatars [DiceBear](https://www.dicebear.com/) (fun-emoji) générés à partir du pseudo               |
| 🌍 Bilingue              | Interface en français et anglais (détection automatique via `expo-localization`)                   |
| 🌙 Dark mode             | Support automatique du thème sombre (system preference)                                            |
| 📱 Mobile-first          | Conçu pour être joué en groupe, téléphone en main                                                  |
| 🏗️ New Architecture      | React Native New Architecture activée                                                              |

---

## 🏗️ Stack technique

| Couche            | Technologie                                                                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**     | [Expo](https://expo.dev/) SDK 54 + [React Native](https://reactnative.dev/) 0.81 (React 19.1)                                       |
| **Routing**       | [Expo Router](https://docs.expo.dev/router/introduction/) v6 (file-based routing, typed routes)                                     |
| **Styling**       | [NativeWind](https://www.nativewind.dev/) v4 (TailwindCSS pour React Native)                                                        |
| **Temps réel**    | [Socket.IO](https://socket.io/) v4 (WebSockets — salons, votes, synchronisation)                                                    |
| **Data fetching** | [TanStack React Query](https://tanstack.com/query) v5 (cache, revalidation, mutations)                                              |
| **État**          | [Zustand](https://zustand.docs.pmnd.rs/) v5 (store utilisateur avec persistance SecureStore)                                        |
| **Audio**         | [expo-audio](https://docs.expo.dev/versions/latest/sdk/audio/) (lecture d'extraits 30s)                                             |
| **i18n**          | [i18n-js](https://github.com/fnando/i18n-js) + [expo-localization](https://docs.expo.dev/versions/latest/sdk/localization/) (FR/EN) |
| **Stockage**      | [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/) (persistance UUID + pseudo)                             |
| **Images**        | [expo-image](https://docs.expo.dev/versions/latest/sdk/image/) + [DiceBear API](https://www.dicebear.com/) (avatars fun-emoji)      |
| **Animations**    | [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) v4                                                   |
| **Icônes**        | [lucide-react-native](https://lucide.dev/) (ArrowLeft, DoorOpen, Star, Play, Pause…)                                                |
| **Identité**      | [uuid](https://github.com/uuidjs/uuid) v11 (généré au premier lancement, persisté dans SecureStore)                                 |
| **OTA Updates**   | [expo-updates](https://docs.expo.dev/versions/latest/sdk/updates/) (mises à jour over-the-air via EAS)                              |

---

## 📁 Structure du projet

```
app/                          # Écrans (Expo Router — file-based routing)
├── _layout.tsx               # Layout racine (QueryClient, SafeArea, thème, Zustand init)
├── index.tsx                 # Accueil (édition pseudo, créer/rejoindre)
├── +not-found.tsx            # Page 404
└── room/
    ├── join.tsx              # Rejoindre un salon (saisie du PIN)
    └── [pin]/
        ├── _layout.tsx       # Layout salon (connexion/déconnexion Socket.IO)
        ├── index.tsx         # Lobby (liste joueurs, lancer la partie)
        └── [gameId]/
            ├── result.tsx    # Résultats finaux (classement)
            └── [roundId]/
                ├── theme.tsx        # Choix du thème (meneur)
                ├── song.tsx         # Recherche & sélection de chanson
                ├── reveal.tsx       # Révélation des réponses
                └── [pickId]/
                    └── index.tsx    # Vote (écoute + deviner le joueur)

components/                   # Composants réutilisables
├── Button.tsx                # Bouton stylisé NativeWind (dark mode aware)
├── Container.tsx             # Wrapper de mise en page avec titre
└── TextInput.tsx             # Input texte thématisé

stores/
└── user-store.ts             # Zustand store (id UUID + name, persisté via SecureStore)

hooks/                        # Hooks React Query (queries + mutations)
├── useGame.ts                # useGame(), useResult()
├── useGameMutations.ts       # useStartGame(), useFinishGame()
├── usePick.ts                # usePick(), useMusicApiSearch()
├── usePickMutations.ts       # useValidatePick(), useCancelPick()
├── useRoom.ts                # useRoom()
├── useRoomMutations.ts       # useCreateRoom(), useJoinRoom(), useLeaveRoom()
├── useRound.ts               # useRound()
└── useRoundMutations.ts      # usePickTheme(), useNextRound()

types/
└── room.ts                   # Types TS : Room, Game, Round, Pick, Vote, Track…

utils/
├── server.ts                 # apiUrl + instance Socket.IO (WebSocket transport)
├── translation.ts            # Config i18n-js (FR/EN, détection auto de la locale)
└── cn.ts                     # Utilitaire clsx + tailwind-merge

translations/
├── en.json                   # Traductions anglais
└── fr.json                   # Traductions français

constants/
├── Colors.ts                 # Palette light/dark
└── theme.ts                  # 5 thèmes de jeu prédéfinis
```

---

## 🔄 Flux de jeu

```
Accueil (index.tsx)
  ├── Créer un salon → POST /room → Lobby ([pin]/index.tsx)
  └── Rejoindre (join.tsx) → PATCH /room/:pin → Lobby
                                    │
                          Socket: gameStarted
                                    ▼
                        Choix du thème (theme.tsx)
                          🎤 Le meneur choisit parmi 5 thèmes
                                    │
                          Socket: round:themeUpdated
                                    ▼
                        Sélection chanson (song.tsx)
                          🔍 Recherche Deezer → choisir une chanson
                                    │
                          Socket: pick:updated (firstPickId)
                                    ▼
                        Vote ([pickId]/index.tsx)  ◄──────┐
                          🎧 Écouter l'extrait + deviner   │
                                    │                      │
                          Socket: vote:updated             │
                          (nextPickId ou fin)──────────────┘
                                    │
                                    ▼
                        Révélation (reveal.tsx)
                          ✅❌ Qui a choisi quoi ?
                                    │
                          Socket: round:completed
                          nextRoundId → retour au thème
                          null → fin de partie ↓
                                    ▼
                        Résultats (result.tsx)
                          🏆 Classement → Retour au lobby
```

---

## 🌐 Communication avec le backend

L'app communique avec le [backend Playlist Game](https://github.com/) via :

- **REST API** — Requêtes HTTP pour le CRUD (salons, parties, rounds, picks, votes)
- **WebSocket (Socket.IO)** — Synchronisation temps réel entre les joueurs

### Events WebSocket

| Event                | Direction        | Description                                                        |
| -------------------- | ---------------- | ------------------------------------------------------------------ |
| `room:subscribe`     | Client → Serveur | Rejoindre la room Socket.IO (à la connexion)                       |
| `room:unsubscribe`   | Client → Serveur | Quitter la room (à la déconnexion)                                 |
| `room:updated`       | Serveur → Client | Liste des joueurs mise à jour (join/leave/host transfer)           |
| `gameStarted`        | Serveur → Client | La partie a démarré (contient `roundId` + `gameId`)                |
| `round:themeUpdated` | Serveur → Client | Le thème du round a été choisi                                     |
| `pick:updated`       | Serveur → Client | Un joueur a validé/annulé sa chanson (`firstPickId` si tous prêts) |
| `vote:updated`       | Serveur → Client | Un vote enregistré/annulé (`nextPickId` ou `null` si fin du round) |
| `round:completed`    | Serveur → Client | Round terminé (`nextRoundId` ou `null` si fin de partie)           |

---

## 🚀 Démarrage rapide

### Prérequis

- [Node.js](https://nodejs.org/) ≥ 20
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Un appareil mobile ou un émulateur (iOS Simulator / Android Emulator)
- Le [backend Playlist Game](https://github.com/) en cours d'exécution

### Installation

```bash
# Cloner le repo
git clone https://github.com/<your-username>/playlist-game.git
cd playlist-game

# Installer les dépendances
npm install
```

### Variables d'environnement

L'app utilise les **variables d'environnement EAS** pour les builds. En développement local, créer un fichier `.env.local` :

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

| Variable              | Description                               | Exemple                 |
| --------------------- | ----------------------------------------- | ----------------------- |
| `EXPO_PUBLIC_API_URL` | URL du serveur backend (REST + Socket.IO) | `http://localhost:3000` |

### Lancement

```bash
# Démarrer le serveur de développement Expo
npx expo start

# Lancer sur iOS
npx expo start --ios

# Lancer sur Android
npx expo start --android

# Lancer sur le web
npx expo start --web
```

---

## 🛠️ Scripts disponibles

| Commande          | Description                              |
| ----------------- | ---------------------------------------- |
| `npm start`       | Démarre le serveur de développement Expo |
| `npm run ios`     | Lance l'app sur iOS                      |
| `npm run android` | Lance l'app sur Android                  |
| `npm run web`     | Lance l'app sur le web                   |
| `npm test`        | Lance les tests avec Jest (watch mode)   |

---

## 📦 Build & Déploiement

Le projet utilise [EAS Build](https://docs.expo.dev/build/introduction/) pour les builds natifs et [EAS Update](https://docs.expo.dev/eas-update/introduction/) pour les mises à jour OTA :

```bash
# Installer EAS CLI
npm install -g eas-cli

# Build de développement
eas build --profile development --platform ios

# Build de preview
eas build --profile preview --platform all

# Build de production
eas build --profile production --platform all

# Mise à jour OTA
eas update
```

---

## 📜 Licence

Projet privé — UNLICENSED
