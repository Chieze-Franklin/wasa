import { GameScene } from "../management/GameScene.js";

export interface RenderingEngine {
    render(scene: GameScene): void;
}