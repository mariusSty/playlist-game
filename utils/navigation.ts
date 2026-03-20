import { UserSession } from "@/types/room";

export function sessionToRoute(session: UserSession): string {
  switch (session.phase) {
    case "home":
      return "/";
    case "lobby":
      return `/room/${session.pin}`;
    case "theme":
      return `/room/${session.pin}/${session.gameId}/${session.roundId}/theme`;
    case "song":
      return `/room/${session.pin}/${session.gameId}/${session.roundId}/song`;
    case "vote":
      return `/room/${session.pin}/${session.gameId}/${session.roundId}/${session.pickId}`;
    case "result":
      return `/room/${session.pin}/${session.gameId}/result`;
    case "reveal":
      return `/room/${session.pin}/${session.gameId}/${session.roundId}/reveal`;
  }
}
