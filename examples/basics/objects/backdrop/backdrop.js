import { GameObject } from "../../../../dist/objects/GameObject.js";

export class BackDrop extends GameObject {
    constructor() {
        super();
        
        const surface = {
            shape: {
                type: "rect",
                fillStyle: "grey",
            }
        };

        this.surfaces = [surface];
        this.isRigidBody = false;
        this.location = { x: 0, y: 0, z: -1 };
        this.size = { width: 2000, height: 2000 };
    }
}

export class Floor extends GameObject {
    constructor() {
        super();
        
        const surface = {
            shape: {
                type: "rect",
                fillStyle: "black",
            }
        };

        this.surfaces = [surface];
        this.isRigidBody = true;
        this.location = { x: 0, y: 600, z: 0 };
        this.size = { width: 2000, height: 10 };
    }
}
