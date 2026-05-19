import * as THREE from 'three';
import { TexturesLoader } from '../core/TextureLoader.js'

export class PartsShip{
    constructor(){
        this.ship = null;
        this.cabin = null;
        this.texture_loader = new THREE.TexturesLoader();
    }

    createCabin(){
        const ao
        const map = this.texture_loader.load('grass');
        
        const coneGeometry = new THREE.ConeGeometry(3, 4, 10); // radiusTop, radiusBottom, height
        const material = new THREE.MeshStandardMaterial({map: sprite});

        
        this.cabin = new THREE.Mesh(coneGeometry, material);
        this.cabin.position.set(2.5, 5, 0);
        this.cabin.scale.set(0.3,0.3,0.3);
        return this.cabin;
    }
}