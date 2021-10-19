import { GameManager } from "../../dist/management/GameManager.js";
import { Scene1 } from "./scene1.js"

const gameManager = GameManager.singleton;

gameManager.uniformVelocity = true;
gameManager.frameRate = 24;

gameManager.addScene(new Scene1());

gameManager.start();
