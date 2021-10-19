import { GameObject } from "../objects/GameObject.js";

export class GameScene {
    constructor(name: string) {
        this._name = name;

        const dispatchEventToActiveObjects = (event: Event) => {
            //console.log(">>>>>>>>>>>>>>>>default")
        };

        this.addEventListener("click", dispatchEventToActiveObjects);
        this.addEventListener("keydown", dispatchEventToActiveObjects);
        this.addEventListener("keyup", dispatchEventToActiveObjects);
    }

    // fields
    private _activeObjects: GameObject[] = [];
    private _name: string;
    private _objects: GameObject[] = [];

    // properties
    public get activeObjects() {
        return this._activeObjects;
    }

    public get name() {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get objects() {
        return this._objects;
    }

    // methods
    public addObject(obj: GameObject) {
        this._objects.push(obj);
    }
    public removeObject(obj: GameObject) {
        const index = this._objects.findIndex((o) => o === obj);
        this._objects.splice(index, 1);
    }

    // events
    private _eventToListenerMap: Map<String, EventListener[]> = new Map<String, EventListener[]>();
    public dispatchEvent(type: String, event: Event) {
        const listeners = this._eventToListenerMap.get(type);
        (listeners || []).forEach((l) => l.call(this, event));
    }
    public addEventListener(type: String, listener: EventListener) {
        let listeners = this._eventToListenerMap.get(type);
        listeners = (listeners || []).concat([listener]);
        this._eventToListenerMap.set(type, listeners);
    }
    public removeEventListener(type: String, listener: EventListener) {
        const listeners = this._eventToListenerMap.get(type);
        if (listeners) {
            const index = listeners.findIndex((l) => l === listener);
            listeners.splice(index, 1);
            this._eventToListenerMap.set(type, listeners);
        }
    }
}
