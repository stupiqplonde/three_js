import * as THREE from 'three';
import { SceneManager } from "./core/SceneManager.js";
import { CameraManager } from "./core/CameraManager.js";
import { LightManager } from "./core/LightManager.js";
import { ShipGenerator } from "./utils/shipGenerator.js"
import { Set } from './utils/set.js';
import { SkySettings } from './utils/skySet.js';
import { ModelLoader } from './core/ModelLoader.js';
import { PaneConstructor } from "./utils/PaneConstructor.js"


class Main{
    constructor(){
        this.sceneManager = null;
        this.cameraManager = null;
        this.lightManager = null;
        this.settings = null;
        this.renderer = null;
        this.camera = null;
        
        this.time = 0;
        this.cube = null;

        this.paneConstructor = null;

        this.modelLoader = null;
        this.skySettings = null;
        // Для будущего вызова класса делающего корабль
        this.shipGenerator = null;
        
        this.init()
    }
    
    init(){
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        this.sceneManager = new SceneManager();
        const scene = this.sceneManager.create();

        this.cameraManager = new CameraManager(this.renderer.domElement);
        this.cameraManager.create();
        this.cameraManager.createControls();
        

        this.lightManager = new LightManager(scene);
        this.lightManager.createAll();

        this.settings = new Set(scene);
        this.settings.createAllHelpers();
        this.cube = this.settings.createAllMeshes();

        this.skySettings = new SkySettings(scene);
        this.skySettings.createStars();
       
        this.shipGenerator = new ShipGenerator(scene);
        this.shipGenerator.createShip('scout');


        this.modelLoader = new ModelLoader(scene);
        this.modelLoader.load(0);

        this.paneConstructor = new PaneConstructor(scene);
        this.paneConstructor.addAllPanels();

        
        window.addEventListener('resize', () => this.onWindowResize());

        this.animate();
    }
    
    onWindowResize(){
        this.cameraManager.onWindowResize();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate(){
        requestAnimationFrame(() => this.animate());
        this.time += 0.016;
        
        this.cameraManager.update();
        
        this.renderer.render(
            this.sceneManager.getScene(),
            this.cameraManager.getCamera()
        )
    }
}

const game = new Main();
