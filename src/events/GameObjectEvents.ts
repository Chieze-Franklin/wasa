import { GameObject, Location3D } from "../objects/GameObject";
import { EventType } from "./GameEventType.js";
import { GameEvent, GameEventInit } from "./GameEvent.js";

export interface GameObjectEvent extends GameEvent {
    readonly target?: GameObject;
}

export interface GameObjectEventInit extends GameEventInit {
    target?: GameObject;
}

// ======================

export class CollisionEvent implements GameObjectEvent {
    constructor(eventInitDict: CollisionEventInit) {
        const { target, objects } = eventInitDict;
        this.target = target;
        this.objects = objects;
    }

    readonly type: EventType = "collision";
    readonly target?: GameObject;
    readonly objects?: GameObject[];
}

export interface CollisionEventInit extends GameObjectEventInit {
    objects: GameObject[];
}

// ======================

export interface PropertyChangeEvent<T> extends GameObjectEvent {
    readonly oldValue: T;
    readonly newValue: T;
}

export interface PropertyChangeEventInit<T> extends GameObjectEventInit {
    oldValue: T;
    newValue: T;
}

export class LocationChangeEvent implements PropertyChangeEvent<Location3D> {
    constructor(eventInitDict: LocationChangeEventInit) {
        const { oldValue, newValue, target } = eventInitDict;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.target = target;
    }

    readonly type: EventType = "location";
    readonly oldValue: Location3D;
    readonly newValue: Location3D;
    readonly target?: GameObject;
}

export interface LocationChangeEventInit extends PropertyChangeEventInit<Location3D> {}
