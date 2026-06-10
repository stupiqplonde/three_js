import * as THREE from 'three';
import { SceneManager } from "./core/SceneManager.js";
import { CameraManager } from "./core/CameraManager.js";
import { LightManager } from "./core/LightManager.js";
import { ShipGenerator } from "./utils/shipGenerator.js";
import { Set } from './utils/set.js';
import { SkySettings } from './utils/skySet.js';
import { ModelLoader } from './core/ModelLoader.js';
import { Ship } from './entities/Ship.js';

const NEAR_DISTANCE = 1;
const ASTEROID_SPEED = 4;
const SHIP_SPEED = 3;

class Main {
    constructor() {
        this.sceneManager = null;
        this.cameraManager = null;
        this.lightManager = null;
        this.settings = null;
        this.renderer = null;

        this.modelLoader = null;
        this.skySettings = null;
        this.shipGenerator = null;
        this.timer = null;

        this.ship = null;
        this.asteroid = null;
        this.shipVelocity = new THREE.Vector3();
        this.asteroidVelocity = new THREE.Vector3();
        this._direction = new THREE.Vector3();
        this._deflectOffset = new THREE.Vector3(0, 1.5, 0.3);
        this.wasNear = false;

        this.init();
    }

    init() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        this.sceneManager = new SceneManager();
        const scene = this.sceneManager.create();

        this.cameraManager = new CameraManager(this.renderer.domElement);
        this.cameraManager.create();
        this.cameraManager.createOrbitControls();
        // this.cameraManager.createFlyControls();

        this.lightManager = new LightManager(scene);
        this.lightManager.createAll();

        this.settings = new Set(scene);
        this.settings.createAllHelpers();
        this.cube = this.settings.createAllMeshes();

        this.skySettings = new SkySettings(scene);
        this.skySettings.createStars();

        this.shipGenerator = new ShipGenerator(scene);

        this.timer = new THREE.Timer();
        this.timer.connect(document);

        this.modelLoader = new ModelLoader(scene);

        this.modelLoader.load(0, { position: { x: -8, y: 0, z: 0 } }).then((model) => {
            this.ship = model;
            this.ship.name = 'ship';
            this.shipVelocity.set(SHIP_SPEED, 0, 0);
        });

        this.modelLoader.load(1, { position: { x: 8, y: 0, z: 0 } }).then((model) => {
            this.asteroid = model;
            this.asteroid.name = 'asteroid';
            // this.aimAsteroidAtShip();
        });

        window.addEventListener('resize', () => this.onWindowResize());
        this.animate();

        this.cruiser = new Ship(scene)
    }


    onWindowResize() {
        this.cameraManager.onWindowResize();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate(timestamp) {
        requestAnimationFrame((t) => this.animate(t));
        this.timer.update(timestamp);
        const delta = this.timer.getDelta();

        this.cameraManager.update(delta);

        const camera = this.cameraManager.getCamera();

        if(this.ship && camera){
            this.ship.position.copy(camera.position);
            this.ship.position.x = 0
            this.ship.position.y -= 5;
            this.ship.position.z = 0;

            this.ship.rotation.x = camera.rotation.x;
            this.ship.rotation.y = camera.rotation.y + Math.PI / 2;
            this.ship.rotation.z = camera.rotation.z;
        }

        // this.updateMovement(delta);

        // if (this.asteroid && this.ship) {
        //     this.checkNearMiss();
        // }


        if (this.asteroid && this.ship) {
            if(this.ship.position.distanceTo(this.asteroid.position) < 6){
                this.sceneManager.scene.remove(this.asteroid);
                this.asteroid = null;
            }
        }


        this.renderer.render(
            this.sceneManager.getScene(),
            this.cameraManager.getCamera(),
            this.camera = this.cameraManager.getCamera()
        );
    }
}

const game = new Main();