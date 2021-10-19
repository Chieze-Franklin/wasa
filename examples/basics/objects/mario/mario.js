import { GameObject } from "../../../../dist/objects/GameObject.js";

export class Mario extends GameObject {
    constructor() {
        super();

        const surface = {
            image: {
                src: "./objects/mario/mario.svg"
            },
            // path2D: `M 0 100 Q 50 0 100 100 Q 150 500 200 100 Q 250 0 300 100 C 350 500 350 0 400 100 C 450 0 450 500 500 100 A 50 50 0 1 1 600 100 `,
        };

        this.surfaces = [surface];
    }

    jump() {}
}