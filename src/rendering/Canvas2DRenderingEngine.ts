import { GameScene } from "../management/GameScene.js";
import { RenderingEngine } from "./RenderingEngine.js";
import { PhysicsEngine } from "../physics/PhysicsEngine.js";
import { ObjectUtils } from "../utils/ObjectUtils.js";

export class Canvas2DRenderingEngine implements RenderingEngine {
    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._renderer = canvas.getContext("2d");
        this._renderer!.imageSmoothingEnabled = false;
        // this._renderer!.imageSmoothingQuality = "high";
        // console.log(this._renderer?.imageSmoothingQuality)
    }

    private _canvas: HTMLCanvasElement;
    // used for caching images
    private _hashToImgMapper = new Map<number, HTMLImageElement>();
    private _renderer: CanvasRenderingContext2D | null;

    public render(scene: GameScene) {
        if (!this._renderer) return;

        // const rect = this._canvas.getBoundingClientRect();
        // const { x, y, width, height } = rect;
        this._renderer.clearRect(0, 0, this._canvas.width, this._canvas.height);

        let objects = scene.objects;

        // filter out only objects visible in current view
        const canvasRect = {
            x: this._canvas.clientLeft,
            y: this._canvas.clientTop,
            width: this._canvas.width,
            height: this._canvas.height,
        };
        objects = objects
            .filter((obj) => PhysicsEngine.singleton.detectCollision(canvasRect, obj));

        // sort by location.z
        objects = objects.sort((a, b) => a.location.z - b.location.z);

        objects.forEach((obj) => {
            if (obj.isRigidBody) {
                const siblings = objects
                    .filter((o) => o !== obj && o.isRigidBody && o.location.z === obj.location.z)
                obj.updateRigidBody(siblings);
            } else {
                obj.update();
            }

            const { x, y } = obj.location;
            const { width, height } = obj.size;

            // render all path2Ds
            obj.surfaces
                .map((s) => s.path2D)
                .forEach((path2D) => {
                    if (!path2D) return;

                    // this._renderer?.moveTo(x, y);
                    this._renderer?.beginPath();
                    this._renderer?.stroke(new Path2D(path2D));
                });

            // render all images
            obj.surfaces
                .map((s) => s.image)
                .forEach((image) => {
                    if (!image) return;

                    const hash = ObjectUtils.hashObject(image);

                    let img = this._hashToImgMapper.get(hash);

                    if (!img) {
                        img = document.createElement("img");
                        img.src = image.src;
                        img.width = width * window.devicePixelRatio;
                        img.height = height * window.devicePixelRatio;
                        this._hashToImgMapper.set(hash, img);
                        img.addEventListener('load', () => {
                            this._renderer?.drawImage(img!, x, y, width * window.devicePixelRatio, height * window.devicePixelRatio);
                        });
                    } else {
                        this._renderer?.drawImage(img, x, y, width, height);
                    }
                });

            // render all shapes
            obj.surfaces
                .map((s) => s.shape)
                .forEach((shape) => {
                    if (!shape) return;

                    if (shape.type === "rect") {
                        this._renderer!.fillStyle = shape.fillStyle;
                        this._renderer?.fillRect(x, y, width, height);
                        if (shape.strokeStyle) {
                            this._renderer!.strokeStyle = shape.strokeStyle;
                            this._renderer?.strokeRect(x, y, width, height);
                        }
                    }
                });
        });
    }
}
