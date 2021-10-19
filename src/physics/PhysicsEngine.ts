import { GameObject } from "../objects/GameObject.js"

export class PhysicsEngine {
    // fields
    // a singleton fo this class
    private static _singleton: PhysicsEngine | null = null;

    // properties
    public static get singleton() {
        if (!this._singleton) {
            this._singleton = new PhysicsEngine();
        }

        return this._singleton;
    }

    // methods

    // calculate velocity
    public calcVelocity(force: number, mass: number, velocity: number) {
        // acceleration, a = f / m
        // change in velocity, dv = a * dt
        // for now (to keep thing simple) assume dt = 1 always, so dv = a, so we just use a
        // new velocity = current velocity + a (remember dv = a)
        // so new velocity = current velocity + (f / m)

        return velocity + (force / mass);
    }

    public detectCollision(rectA: Rectangle, rectB: Rectangle) {
        const { x: minAx, y: minAy, width: wa, height: ha } = rectA;
        const maxAx = minAx + wa;
        const maxAy = minAy + ha;

        const { x: minBx, y: minBy, width: wb, height: hb } = rectB;
        const maxBx = minBx + wb;
        const maxBy = minBy + hb;

        return minAx <= maxBx && maxAx >= minBx && minAy <= maxBy && maxAy >= minBy;
    }
}

export type Rectangle = {
    x: number;
    y: number;
    width: number;
    height: number;
};