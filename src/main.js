import * as THREE from "three";
import { SceneManager } from "./core/SceneManager.js";
import { CameraManager } from "./core/CameraManager.js";
import { LightManager } from "./core/LightManager.js";

class Main {
    constructor() {
        this.sceneManager = null;
        this.cameraManager = null;
        this.lightManager = null;
        this.renderer = null;
        this.cube = null;

        this.time = 0;
        this.init();
    }

    init() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.body.appendChild(this.renderer.domElement);

        this.sceneManager = new SceneManager();
        const scene = this.sceneManager.create();

        this.cameraManager = new CameraManager(this.renderer.domElement);
        this.cameraManager.create();

        this.lightManager = new LightManager(scene);
        this.lightManager.create();

        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const material = new THREE.MeshStandardMaterial({ color: 0x66aaff });
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.castShadow = true;
        scene.add(this.cube);

        window.addEventListener("resize", () => this.onResize());

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.time += 0.016;

        if (this.cube) {
            this.cube.rotation.y += 0.01;
            this.cube.rotation.x += 0.005;
        }

        this.renderer.render(
            this.sceneManager.getScene(),
            this.cameraManager.getCamera()
        );
    }

    onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.cameraManager.handleResize();
    }
}

new Main();