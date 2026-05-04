import * as THREE from "three";
import { LIGHTS_CONFIG } from "../config/light.js";

export class LightManager {
    constructor(scene) {
        this.scene = scene;
        this.lights = {};
    }

    create() {
        this._createMainLight();
        this._createAmbientLight();
        return this.lights;
    }

    _createMainLight() {
        const config = LIGHTS_CONFIG.main;
        const light = new THREE.DirectionalLight(config.color, config.intensity);
        light.position.set(config.position.x, config.position.y, config.position.z);
        light.castShadow = config.castShadow;
        light.shadow.mapSize.set(config.shadowMapSize, config.shadowMapSize);
        this.scene.add(light);
        this.lights.main = light;
    }

    _createAmbientLight() {
        const config = LIGHTS_CONFIG.ambient;
        const light = new THREE.AmbientLight(config.color, config.intensity);
        this.scene.add(light);
        this.lights.ambient = light;
    }
}