import { PhysicsEngine } from "../physics/PhysicsEngine.js";
import { GameManager } from "../management/GameManager.js";
import { EventType } from "../events/GameEventType.js";
import { GameEvent, GameEventListener } from "../events/GameEvent.js";
import { CollisionEvent, LocationChangeEvent } from "../events/GameObjectEvents.js";

export class GameObject {
    // fields
    private _forceX: number = 0;
    private _forceY: number = 0;
    private _forceZ: number = 0;
    private _gravity: number = 0;
    private _hasMovedSinceCollisionDetection = false;
    private _location: Location3D = { x: 0, y: 0, z: 0 };
    private _mass: number = 1;
    // if true, this object can partake in collisions
    private _isRigidBody: boolean = true;
    private _size: Size3D = { width: 40, height: 40 }
    private _surfaces: Surface[] = [];
    private _velocityX: number = 0;
    private _velocityY: number = 0;
    private _velocityZ: number = 0;

    // properties
    public get gravity() {
        return this._gravity;
    }
    public set gravity(value: number) {
        this._gravity = value;
        this._forceY += this._gravity;
    }

    public get isRigidBody() {
        return this._isRigidBody;
    }
    public set isRigidBody(value: boolean) {
        this._isRigidBody = value;
    }

    public get location() {
        return this._location;
    }
    public set location(value: Location3D) {
        if (this._location !== value) {
            this.dispatchEvent("location", new LocationChangeEvent({
                oldValue: this._location,
                newValue: value,
                target: this,
            }));
        }

        this._location = value;
    }

    public get mass() {
        return this._mass;
    }
    public set mass(value: number) {
        // mass cannot be zero
        if (value <= 0) value = 1;
        this._mass = value;
    }

    public get size() {
        return this._size;
    }
    public set size(value: Size3D) {
        this._size = value;
    }

    public get surfaces() {
        return this._surfaces;
    }
    public set surfaces(value: Surface[]) {
        if (!value) value = [];
        this._surfaces = value;
    }

    public get velocityX() {
        return this._velocityX;
    }
    public set velocityX(value: number) {
        this._velocityX = value;
    }

    public get velocityY() {
        return this._velocityY;
    }
    public set velocityY(value: number) {
        this._velocityY = value;
    }

    public get velocityZ() {
        return this._velocityZ;
    }
    public set velocityZ(value: number) {
        this._velocityZ = value;
    }

    public get x() {
        return this._location.x;
    }
    public get y() {
        return this._location.y;
    }
    public get z() {
        return this._location.z;
    }
    public get width() {
        return this._size.width;
    }
    public get height() {
        return this._size.height;
    }

    // methods
    public applyForceY(force: number) {
        this._forceY = force + this._gravity;
    }

    // update certain fields
    public update() {
        const physicsEngine = PhysicsEngine.singleton;
        const frameRate = GameManager.singleton.frameRate;
        const uniformVelocity = GameManager.singleton.uniformVelocity;

        // calc new distances
        // first get new velocity, v
        // change in distance, dd = v * dt
        // for now (to keep thing simple) assume dt = 1 always, so dd = v
        // new distance = current distance + dd = current distance + v

        // x-axis
        this._velocityX = physicsEngine.calcVelocity(this._forceX, this._mass, this._velocityX);
        const newX = this.x + (uniformVelocity ? this.velocityX / frameRate : this._velocityX);

        // y-axis
        this._velocityY = physicsEngine.calcVelocity(this._forceY, this._mass, this._velocityY);
        const newY = this.y + (uniformVelocity ? this._velocityY / frameRate : this._velocityY);

        // z-axis
        this._velocityZ = physicsEngine.calcVelocity(this._forceZ, this._mass, this._velocityZ);
        const newZ = this.z + (uniformVelocity ? this._velocityZ / frameRate : this._velocityZ);

        this.location = { x: newX, y: newY, z: newZ };
    }

    // update certain fields while looking out for collisions
    public updateRigidBody(siblings: GameObject[]) {
        const physicsEngine = PhysicsEngine.singleton;
        const frameRate = GameManager.singleton.frameRate;
        const uniformVelocity = GameManager.singleton.uniformVelocity;

        // calc new distances
        // first get new velocity, v
        // change in distance, dd = v * dt
        // for now (to keep thing simple) assume dt = 1 always, so dd = v
        // new distance = current distance + dd = current distance + v

        // x-axis
        this._velocityX = physicsEngine.calcVelocity(this._forceX, this._mass, this._velocityX);
        const newX = this.x + (uniformVelocity ? this.velocityX / frameRate : this._velocityX);

        // y-axis
        this._velocityY = physicsEngine.calcVelocity(this._forceY, this._mass, this._velocityY);
        const newY = this.y + (uniformVelocity ? this._velocityY / frameRate : this._velocityY);

        // z-axis
        this._velocityZ = physicsEngine.calcVelocity(this._forceZ, this._mass, this._velocityZ);
        const newZ = this.z + (uniformVelocity ? this._velocityZ / frameRate : this._velocityZ);

        const approximateRect = {
            x: Math.min(this.x, newX),
            y: Math.min(this.y, newY),
            width: Math.abs(this.x - newX) + this.width,
            height: Math.abs(this.y - newY) + this.height,
        };

        const collidingSiblings = siblings.filter((s) => PhysicsEngine.singleton.detectCollision(approximateRect, s));

        if (!collidingSiblings.length) {
            this.location = { x: newX, y: newY, z: newZ };
            this._hasMovedSinceCollisionDetection = false;
        } else {
            // TODO: position object optimally
            if (!this._hasMovedSinceCollisionDetection) {
                this.dispatchEvent("collision", new CollisionEvent({
                    objects: collidingSiblings,
                    target: this,
                }));
                collidingSiblings.forEach((o) => o.dispatchEvent("collision", new CollisionEvent({
                    objects: [this],
                    target: o,
                })));
                // this.location = { x: newX, y: newY, z: newZ };
                this._hasMovedSinceCollisionDetection = true;
            }
        }
    }

    // events
    private _eventToListenerMap: Map<EventType, GameEventListener[]> = new Map<EventType, GameEventListener[]>();
    private dispatchEvent(type: EventType, event: GameEvent) {
        const listeners = this._eventToListenerMap.get(type);
        (listeners || []).forEach((l) => l.call(this, event));
    }
    public addEventListener(type: EventType, listener: GameEventListener) {
        let listeners = this._eventToListenerMap.get(type);
        listeners = (listeners || []).concat([listener]);
        this._eventToListenerMap.set(type, listeners);
    }
    public removeEventListener(type: EventType, listener: GameEventListener) {
        const listeners = this._eventToListenerMap.get(type);
        if (listeners) {
            const index = listeners.findIndex((l) => l === listener);
            listeners.splice(index, 1);
            this._eventToListenerMap.set(type, listeners);
        }
    }
}

export interface Surface {
    path2D?: Path2D;
    image?: {
        src: string;
    };
    shape?: {
        type: ShapeType;
        fillStyle: string | CanvasGradient | CanvasPattern;
        strokeStyle?: string | CanvasGradient | CanvasPattern;
    }
}

export interface Location3D {
    x: number;
    y: number;
    z: number;
}

export interface Size3D {
    depth?: number;
    height: number;
    width: number;
}

export type ShapeType = "rect";