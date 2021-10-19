import { GameManager } from "./management/GameManager.js";
import { Canvas2DRenderingEngine } from "./rendering/Canvas2DRenderingEngine.js";
import { debounce } from "./utils/misc.js";

const main = () => {
    const body = document.getElementsByTagName('body')[0];
    body.style.height = "98vh";
    body.style.width = "98vw";

    const container: HTMLElement | any = document.getElementById("wasa");
    container.style.height = "100%";
    container.style.width = "100%";

    const canvas = document.createElement("canvas");
    canvas.style.imageRendering = "crisp-edges";
    handleResize();
    container.appendChild(canvas);

    function handleResize() {
        const bodyRect = body.getBoundingClientRect();
        canvas.height = bodyRect.height * window.devicePixelRatio;
        canvas.width = bodyRect.width * window.devicePixelRatio;
        canvas.style.height = `${bodyRect.height}px`;
        canvas.style.width = `${bodyRect.width}px`;
    }

    function handleResizeWithMinimalFlickering() {
        const context = canvas.getContext("2d");

        // create temp canvas and context
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempContext = tempCanvas.getContext("2d");

        // draw current canvas to temp canvas
        if (tempContext) tempContext.drawImage(canvas, 0, 0);

        // resize current canvas
        handleResize();

        // draw temp canvas back to the current canvas
        if (context && tempContext) context.drawImage(tempContext.canvas, 0, 0);
    }

    // resize canvas to watch body
    window.addEventListener('resize', () => debounce(handleResizeWithMinimalFlickering, 100)());

    // initiate GameManager singleton with defualt values
    const gameManager = GameManager.singleton;
    gameManager.canvas = canvas;
    gameManager.renderingEngine = new Canvas2DRenderingEngine(canvas);

    // dispatch canvas and window events to the active scene
    canvas.onclick = (event: MouseEvent) => gameManager.activeScene?.dispatchEvent("click", event);
    window.onkeydown = (event: KeyboardEvent) => gameManager.activeScene?.dispatchEvent("keydown", event);
    window.onkeyup = (event: KeyboardEvent) => gameManager.activeScene?.dispatchEvent("keyup", event);
};

main();

// 0269414559