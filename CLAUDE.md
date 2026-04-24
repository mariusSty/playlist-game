# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in browser
npm test           # Run Jest tests (watch mode)
```

The backend API URL is configured via `EXPO_PUBLIC_API_URL` in `.env.local` (defaults to `http://localhost:3000`).

## Architecture

**Playlist Game** is a real-time multiplayer music quiz app built with Expo + React Native. Players join rooms via PIN codes, take turns picking songs from Deezer for a given theme, and vote on each other's choices.

### Stack

- **Routing**: Expo Router (file-based, typed routes)
- **Styling**: NativeWind v4 (TailwindCSS) + HeroUI Native components
- **State**: Zustand (user identity) + React Query (server state)
- **Real-time**: Socket.IO for live game events
- **Persistence**: `expo-secure-store` for user UUID and username across sessions
- **i18n**: i18n-js with auto-detection (`translations/en.json`, `translations/fr.json`)
- **Error tracking**: Sentry

### Routing Structure

Routes map directly to game phases. The `app/` directory uses dynamic segments:

```
/                               → Home (create/join room)
/room/[pin]                     → Lobby (waiting room)
/room/[pin]/[gameId]/[roundId]/theme   → Theme selection (host only)
/room/[pin]/[gameId]/[roundId]/song    → Song search & pick
/room/[pin]/[gameId]/[roundId]/[pickId] → Voting
/room/[pin]/[gameId]/[roundId]/reveal  → Round results
/room/[pin]/[gameId]/result            → Final results
```

Navigation is driven by `UserSession.phase` from the backend. `utils/navigation.ts:sessionToRoute()` converts a session to its matching route. The root layout polls `GET /user/{id}/session` every 5 seconds and auto-navigates when the phase changes.

### Data Flow

```
Zustand (user id + name)
  ↓
REST API (React Query hooks)
  ↑
Socket.IO events → queryClient.invalidateQueries() → refetch → re-render
```

**Socket.IO events** (received from server) trigger React Query cache invalidation rather than updating state directly. This keeps a single source of truth in the server.

**Key query keys**: `["userSession", userId]`, `["room", pin]`, `["round", roundId]`, `["pick", pickId]`, `["musicSearch", query]`

### Hooks Convention

- `hooks/useXxx.ts` — React Query `useQuery` (read data)
- `hooks/useXxxMutations.ts` — React Query `useMutation` (write data)

Socket.IO connection lifecycle is managed in `hooks/useSessionSocket.ts`. It subscribes/unsubscribes when the room layout mounts/unmounts.

### Types

All shared domain types (`Room`, `Game`, `Round`, `Pick`, `Vote`, `Track`, `UserSession`) are defined in `types/room.ts`. `UserSession.phase` is a union type used to drive navigation.

### Path Alias

`@/*` resolves to the project root (configured in `tsconfig.json`). Use this for all imports instead of relative paths.
