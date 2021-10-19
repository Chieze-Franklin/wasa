import { EventType } from "./GameEventType.js";

export interface GameEvent {
    readonly type: EventType;
}

export interface GameEventInit {
    type?: EventType;
}

export type GameEventListener = (e: GameEvent) => void;
