import { GameScene } from "../../dist/management/GameScene.js";
import { GameObject } from "../../dist/objects/GameObject.js";
import { BackDrop, Floor } from "./objects/backdrop/backdrop.js";
import { Mario } from "./objects/mario/mario.js";


export class Scene1 extends GameScene {
    constructor() {
        super("scene1");

        const maxCeiling = 240;
        const minFloor = 600;
        const jumpSpeed = 600;
        const width = 120;
        const height = 200;

        const backdrop = new BackDrop();
        this.addObject(backdrop);

        const mario = new Mario();
        mario.size = { width, height };
        mario.location = { x: 100, y: minFloor - mario.height - 1, z: 0 };
        // mario.gravity = 1;
        // mario.mass = 100;
        // mario.velocityY = -45;
        // mario.velocityX = 10;
        // mario.applyForceY(-0.5);
        this.addObject(mario);

        // const mario2 = new Mario();
        // const { z: z2 } =  mario2.location;
        // mario2.location = { x: 300, y: 50, z: z2 };
        // mario2.gravity = 0.5;
        // mario2.mass = 100;
        // mario2.velocityY = -0.5;
        // mario2.velocityX = 10;
        // mario2.applyForceY(0.1);
        //this.addObject(mario2);

        const floor = new Floor();
        const { x: x1, z: z1 } =  floor.location;
        floor.location = { x: x1, y: minFloor, z: z1 };
        this.addObject(floor);

        this.addEventListener("keyup", (event) => {
            if (event.code === "ArrowUp") {
                if (mario.location.y >= minFloor - mario.height - 1) {
                    mario.velocityY = -jumpSpeed;
                } else {}
            } else if (event.code === "ArrowDown") {
                const { x, y, z } =  mario.location;
                mario.location = { x, y: y + height / 2, z }
                mario.size = { width, height: height / 2 };
                setTimeout(() => {
                    const { x, y, z } =  mario.location;
                    mario.location = { x, y: y - height / 2, z }
                    mario.size = { width, height };
                }, 800);
            }
        });

        mario.addEventListener("location", (event) => {
            const y = event.newValue.y;
            if (y <= maxCeiling) {
                mario.velocityY = jumpSpeed;
            }
        });

        mario.addEventListener("collision", (event) => {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>you lost")
        });

        setInterval(() => {
            const o = this.getObstacle();
            this.addObject(o);
        }, 3000);
    }

    getObstacle() {
        const minFloor = 600;
        const o = new GameObject();

        const obstacleType = Math.random();
        if (obstacleType < 0.7) {
            // tree
            o.surfaces.push({
                shape: {
                    type: "rect",
                    fillStyle: "green",
                }
            });

            const obstacleSize = Math.random();
            if (obstacleSize < 0.5) {
                o.size = { height: 155, width: 80 };
            } else if (obstacleSize >= 0.5 && obstacleType < 0.8) {
                o.size = { height: 100, width: 60 };
            } else {
                o.size = { height: 155, width: 120 };
            }

            const obstacleLocation = Math.random();
            if (obstacleLocation < 0.7) {
                o.location = { x: window.innerWidth - 100, y: minFloor - o.height - 1, z: 0 };
            } else {
                o.location = { x: window.innerWidth - 10, y: minFloor - o.height - 1, z: 0 };
            }
        } else {
            // bird
            o.surfaces.push({
                shape: {
                    type: "rect",
                    fillStyle: "blue",
                }
            });

            
            const obstacleSize = Math.random();
            if (obstacleSize < 0.7) {
                o.size = { height: 50, width: 50 };
            } else {
                o.size = { height: 20, width: 20 };
            }

            const obstacleLocation = Math.random();
            if (obstacleLocation < 0.7) {
                o.location = { x: window.innerWidth - 100, y: minFloor - 200, z: 0 };
            } else {
                o.location = { x: window.innerWidth - 10, y: minFloor - 200, z: 0 };
            }
        }

        o.velocityX = -300;

        const locationEventHandler = (event) => {
            
            const x = event.newValue.x;
            if (x <= -100) {
                o.velocityX = 0;
                // remove event handler
                o.removeEventListener("location", locationEventHandler);
                // remove object from scene
                this.removeObject(o);
            }
        };

        o.addEventListener("location", locationEventHandler);

        return o;
    }
}

// sqrt(2em) / t = f
// e = 0.5 mv2 => sqrt(2e/m) = v