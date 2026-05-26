import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MODELS_CONFIG } from '../config/model.js';

export class ModelLoader {
    constructor(scene) {
        this.scene = scene;
        this.model = null;
        this.models = [];
    }

    load(index, options = {}) {
        const url = MODELS_CONFIG.url[index];
        const position = options.position ?? { x: 0, y: 0, z: 0 };

        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load(
                url,
                (gltf) => {
                    const model = gltf.scene;
                    model.position.set(position.x, position.y, position.z);
                    this.scene.add(model);
                    this.model = model;
                    this.models[index] = model;
                    resolve(model);
                },
                undefined,
                reject,
            );
        });
    }

    getModel(index) {
        if (index !== undefined) return this.models[index] ?? null;
        return this.model;
    }
}
