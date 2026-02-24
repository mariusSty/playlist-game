# 🎵 SoundGuess — Le jeu musical qui révèle qui vous êtes

> _Pas besoin de connaître la musique. Il faut connaître les gens._

---

## 🎯 Concept

**SoundGuess** est un jeu mobile multijoueur en temps réel pensé pour les soirées entre amis. Le principe est simple : chaque manche, un thème est posé — et chaque joueur choisit une chanson qui lui correspond. L'extrait de chaque chanson est ensuite joué anonymement, et les joueurs doivent deviner **qui a choisi quoi**.

Ce n'est pas un quiz musical. C'est un jeu sur les gens.

---

## 🕹️ Comment se joue une partie ?

### 1. Création du salon

Un joueur crée un salon et partage le **code PIN à 6 chiffres** à ses amis. Une fois tout le monde connecté, l'hôte lance la partie : le nombre de manches correspond au nombre de joueurs (chaque joueur devient meneur à tour de rôle).

### 2. Chaque manche se déroule en 3 temps

**⏱ Phase de thème**
Le meneur de manche — rôle qui tourne à chaque manche — a **10 secondes** pour choisir parmi 5 thèmes prédéfinis. Exemples :

- _"La chanson de ton enfance"_
- _"La chanson que tu écoutes en boucle en ce moment"_

Si le temps est écoulé, un thème est sélectionné aléatoirement.

**🎧 Phase de sélection**
Chaque joueur voit le thème et **recherche une chanson** depuis l'application via l'API musicale. Des indicateurs montrent en temps réel qui a déjà choisi. Les joueurs peuvent annuler et changer leur choix.

**🗳️ Phase de vote**
Les extraits de 30 secondes sont joués un par un, de façon anonyme, avec des contrôles lecture/pause/replay. Pour chaque extrait, les joueurs votent pour la personne qui leur semble avoir choisi cette chanson.

**À la fin de la manche**, les résultats sont révélés : qui a choisi quoi, qui a bien deviné (✅) et qui s'est trompé (❌).

### 3. Fin de partie

Après toutes les manches, le **classement final** est affiché avec les scores. Les joueurs sont renvoyés dans le salon et peuvent lancer une nouvelle partie.

---

## ✨ Ce qui rend SoundGuess unique

| Fonctionnalité           | Détail                                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------- |
| 🎤 Thèmes variés         | 5 thèmes prédéfinis avec un timer pour garder le rythme                                            |
| 🔄 Rôle rotatif          | Le meneur change à chaque manche — tout le monde contribue                                         |
| 🕵️ Révélation différée   | Les identités ne sont révélées qu'en fin de manche, pour garder le suspense sur les votes suivants |
| 🎵 Extraits audio        | Recherche musicale intégrée — extraits 30s avec contrôles audio complets                           |
| 🧑‍🤝‍🧑 Avatars personnalisés | Avatars DiceBear générés automatiquement à partir du pseudo                                        |
| 🌍 Bilingue              | Interface disponible en français et anglais (détection automatique)                                |
| 🌙 Dark mode             | Support complet du thème sombre                                                                    |
| 📱 Mobile-first          | Conçu pour être joué en groupe, téléphone en main                                                  |

---

## 🏗️ Stack technique

| Couche            | Technologie                                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Framework**     | [Expo](https://expo.dev/) SDK 54 + [React Native](https://reactnative.dev/) 0.81 (React 19.1)                        |
| **Routing**       | [Expo Router](https://docs.expo.dev/router/introduction/) v6 (file-based routing)                                    |
| **Styling**       | [NativeWind](https://www.nativewind.dev/) v4 (TailwindCSS pour React Native)                                         |
| **Temps réel**    | [Socket.IO](https://socket.io/) (WebSockets — salons, votes, synchronisation)                                        |
| **Data fetching** | [SWR](https://swr.vercel.app/) (cache, revalidation, hooks)                                                          |
| **Audio**         | [expo-audio](https://docs.expo.dev/versions/latest/sdk/audio/) (lecture d'extraits 30s)                              |
| **i18n**          | [i18n-js](https://github.com/fnando/i18n-js) + expo-localization (FR/EN)                                             |
| **Stockage**      | [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/) (persistance UUID + pseudo)              |
| **Images**        | [expo-image](https://docs.expo.dev/versions/latest/sdk/image/) + [DiceBear API](https://www.dicebear.com/) (avatars) |
| **Animations**    | [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) v4                                    |
| **Icônes**        | [@expo/vector-icons](https://icons.expo.fyi/) (FontAwesome6)                                                         |
| **Identité**      | uuid v4 + [@faker-js/faker](https://fakerjs.dev/) (pseudo aléatoire au premier lancement)                            |
| **Toasts**        | [react-native-toast-message](https://github.com/calintamas/react-native-toast-message)                               |

---

## 📁 Structure du projet

```
app/                          # Écrans (Expo Router - file-based routing)
├── _layout.tsx               # Layout racine (fonts, UserContext, thème)
├── index.tsx                 # Accueil (édition pseudo, créer/rejoindre)
├── modal.tsx                 # Modal (placeholder)
└── room/
    ├── join.tsx              # Rejoindre un salon (saisie du PIN)
    └── [pin]/
        ├── index.tsx         # Lobby du salon (liste joueurs, Socket.IO)
        └── [gameId]/
            ├── result.tsx    # Résultats finaux (classement)
            └── [roundId]/
                ├── theme.tsx        # Choix du thème (meneur, 10s timer)
                ├── song.tsx         # Recherche & sélection de chanson
                ├── reveal.tsx       # Révélation des réponses
                └── [pickId]/
                    └── index.tsx    # Vote (écoute + deviner le joueur)

components/                   # Composants réutilisables
├── Button.tsx                # Bouton stylisé NativeWind
├── Container.tsx             # Wrapper de mise en page
└── TextInput.tsx             # Input texte thématisé

contexts/
└── user-context.ts           # React Context (id, name)

hooks/                        # Hooks SWR pour le data fetching
├── useGame.ts                # useGame(), useResult()
├── usePick.ts                # usePick(), useMusicApiSearch()
├── useRoom.ts                # useRoom()
└── useRound.ts               # useRound()

types/
└── room.ts                   # Types TS : Room, Game, Round, Pick, Vote, Track...

utils/
├── server.ts                 # apiUrl, fetcher SWR, instance Socket.IO
├── game.ts                   # getCurrentRound()
├── translation.ts            # Config i18n-js (FR/EN auto-detect)
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
                          Socket: startGame
                                    ▼
                        Choix du thème (theme.tsx)
                          ⏱ 10s — le meneur choisit
                                    │
                          Socket: themePicked
                                    ▼
                        Sélection chanson (song.tsx)
                          🔍 Recherche API → choisir une chanson
                                    │
                          Socket: allSongsValidated
                                    ▼
                        Vote ([pickId]/index.tsx)  ◄──────┐
                          🎧 Écouter l'extrait + deviner   │
                                    │                      │
                          Socket: allVotesValidated        │
                          (prochain pick ou révélation)────┘
                                    │
                                    ▼
                        Révélation (reveal.tsx)
                          ✅❌ Qui a choisi quoi ?
                                    │
                          Socket: nextRound → retour au thème
                          Socket: goToResult ↓
                                    ▼
                        Résultats (result.tsx)
                          🏆 Classement → Retour au lobby
```

---

## 🚀 Démarrage rapide

### Prérequis

- [Node.js](https://nodejs.org/) ≥ 20.19
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Un appareil mobile ou un émulateur (iOS Simulator / Android Emulator)

### Installation

```bash
# Cloner le repo
git clone https://github.com/<your-username>/playlist-game.git
cd playlist-game

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec l'URL de votre API :
# EXPO_PUBLIC_API_URL=http://localhost:3000
```

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

## ⚙️ Variables d'environnement

| Variable              | Description                               | Exemple                 |
| --------------------- | ----------------------------------------- | ----------------------- |
| `EXPO_PUBLIC_API_URL` | URL du serveur backend (REST + Socket.IO) | `http://localhost:3000` |

---

## 🛠️ Scripts disponibles

| Commande          | Description                              |
| ----------------- | ---------------------------------------- |
| `npm start`       | Démarre le serveur de développement Expo |
| `npm run ios`     | Lance l'app sur iOS                      |
| `npm run android` | Lance l'app sur Android                  |
| `npm run web`     | Lance l'app sur le web                   |
| `npm test`        | Lance les tests avec Jest                |

---

## 📦 Build & Déploiement

Le projet utilise [EAS Build](https://docs.expo.dev/build/introduction/) pour les builds natifs :

```bash
# Installer EAS CLI
npm install -g eas-cli

# Build de développement
eas build --profile development --platform ios

# Build de preview
eas build --profile preview --platform all

# Build de production
eas build --profile production --platform all
```
