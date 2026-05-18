import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SceneManager } from './core/SceneManager.js';
import { CameraManager } from './core/CameraManager.js';
import { SynthwaveLandscape } from './scenery/SynthwaveLandscape.js';
import { CAMERA_CONFIG } from './config/camera.js';
import { SYNTHWAVE_CONFIG } from './config/synthwave.js';

class Main {
    constructor() {
        this.sceneManager = null;
        this.cameraManager = null;
        this.renderer = null;
        this.composer = null;
        this.time = 0;
        this.init();
    }

    init() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;
        document.body.appendChild(this.renderer.domElement);

        this.sceneManager = new SceneManager();
        const scene = this.sceneManager.create();

        this.cameraManager = new CameraManager(this.renderer.domElement);
        this.cameraManager.create();
        this.cameraManager.createControls();
        this.cameraManager.startZoomOut({
            ...CAMERA_CONFIG.zoom,
            lookAt: SYNTHWAVE_CONFIG.camera.lookAt
        });

        const landscape = new SynthwaveLandscape(scene);
        landscape.build();

        this._setupPostProcessing(scene);

        window.addEventListener('resize', () => this.onWindowResize());
        this.animate();
    }

    _setupPostProcessing(scene) {
        const camera = this.cameraManager.getCamera();
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(scene, camera));

        const bloom = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.55,
            0.35,
            0.28
        );
        this.composer.addPass(bloom);
    }

    onWindowResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.cameraManager.onWindowResize();
        this.renderer.setSize(w, h);
        this.composer.setSize(w, h);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.time += 0.016;
        this.cameraManager.update();
        this.composer.render();
    }
}

new Main();
