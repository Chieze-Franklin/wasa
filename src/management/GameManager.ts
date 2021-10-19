import { GameScene } from "./GameScene.js";
import { RenderingEngine } from "../rendering/RenderingEngine.js"

export class GameManager {
    // fields
    // the active scene
    private _activeScene: GameScene | null = null;
    // the canvas
    private _canvas: HTMLCanvasElement | null = null;
    // if true, another round of game updates should occur
    private _canUpdate: boolean = true;
    // the number of times in a second the game should update
    private _frameRate: number = 24;
    // the rendering engine
    private _renderingEngine: RenderingEngine | null = null;
    // a collection of scenes
    private _scenes: GameScene[] = [];
    // a singleton fo this class
    private static _singleton: GameManager | null = null;
    // if set to true game objects will attempt to maintain
    // uniform actual velocity irrespective of frame rate
    private _uniformVelocity: boolean = false;
    // the handle to the setInterval that updates the game; used to clear the setInterval
    private _updateIntervalHandle: number = Number.NEGATIVE_INFINITY;

    // properties
    public get canvas() {
        return this._canvas;
    }
    public set canvas(value: HTMLCanvasElement | null) {
        this._canvas = value;
    }

    public get frameRate() {
        return this._frameRate;
    }
    public set frameRate(value: number) {
        // mass cannot be less than 1
        if (value < 1) value = 1;
        this._frameRate = value;
    }

    public get renderingEngine() {
        return this._renderingEngine;
    }
    public set renderingEngine(value: RenderingEngine | null) {
        this._renderingEngine = value;
    }

    public static get singleton() {
        if (!this._singleton) {
            this._singleton = new GameManager();
        }

        return this._singleton;
    }

    // properties
    public get activeScene() {
        return this._activeScene;
    }

    public get uniformVelocity() {
        return this._uniformVelocity;
    }
    public set uniformVelocity(value: boolean) {
        this._uniformVelocity = value;
    }

    // methods
    public addScene(scene: GameScene) {
        this._scenes.push(scene);
    }

    // this makes the scene with the matching name the active scene
    public loadScene(name: string) {
        const scene = this._scenes.find((s) => s.name === name);

        if (scene) {
            this._activeScene = scene;
        }
    }

    // loadNextScene()
    // loadPreviousScene()

    public start() {
        // get active scene
        if (!this._activeScene) {
            this._activeScene = this._scenes[0];
        }

        // render active scene
        this._updateIntervalHandle = setInterval(() => this.update(), 1000/this.frameRate);
    }

    private update() {
        if (!this._canUpdate) {
            clearInterval(this._updateIntervalHandle);
            return;
        }

        if (this.renderingEngine && this._activeScene) {
            this.renderingEngine.render(this._activeScene);
        }
    }
}
